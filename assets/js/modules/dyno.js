/* ==========================================================================
   BANCO DE POTENCIA — curvas de par y potencia dibujadas sobre <canvas>.
   El par se modela con una curva física y la potencia se deriva de él:
       P(kW) = T(Nm) · n(rpm) / 9549      ·      1 CV = 0,7355 kW
   ========================================================================== */
import { clamp, fmt, reducedMotion } from '../lib/util.js';

const CV_K = 7023.5;                       // T·rpm / 7023,5 = CV
export const cv = (nm, rpm) => (nm * rpm) / CV_K;

/* --------------------------------------------------------------------------
   Forma normalizada del par
   -------------------------------------------------------------------------- */
function torqueShape(rpm, { idle, rise, plat0, plat1, max, turbo }){
  if (rpm <= idle) return turbo ? .34 : .55;
  if (rpm < plat0){
    const t = (rpm - idle) / (plat0 - idle);
    const e = turbo ? Math.pow(t, .55) : Math.pow(t, .8);
    return (turbo ? .34 : .55) + (1 - (turbo ? .34 : .55)) * e;
  }
  if (rpm <= plat1){
    // Meseta con una leve ondulación: ningún motor real es una recta
    const t = (rpm - plat0) / Math.max(plat1 - plat0, 1);
    return 1 - .022 * Math.sin(t * Math.PI * 2.2) - .012 * t;
  }
  const t = (rpm - plat1) / Math.max(max - plat1, 1);
  return 1 - (turbo ? .34 : .24) * Math.pow(t, 1.35);
  void rise;
}

/* Ajusta el final de la meseta hasta que la potencia máxima coincide */
function solvePlateau(target, nm, cfg){
  let lo = cfg.plat0 + 200, hi = cfg.max * .97;
  for (let i = 0; i < 26; i++){
    const mid = (lo + hi) / 2;
    const p = peakPower(nm, { ...cfg, plat1:mid });
    if (p < target) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

function peakPower(nm, cfg){
  let best = 0;
  for (let r = cfg.idle; r <= cfg.max; r += 50){
    best = Math.max(best, cv(nm * torqueShape(r, cfg), r));
  }
  return best;
}

/* --------------------------------------------------------------------------
   Genera una curva completa
   -------------------------------------------------------------------------- */
export function buildCurve({ hp, nm, rpmMax = 7200, turbo = true, idle = 1000 }){
  const cfg = {
    idle,
    plat0: turbo ? Math.round(idle + (rpmMax - idle) * .26) : Math.round(idle + (rpmMax - idle) * .48),
    plat1: Math.round(rpmMax * .70),
    max: rpmMax,
    turbo
  };
  cfg.plat1 = clamp(solvePlateau(hp, nm, cfg), cfg.plat0 + 250, rpmMax * .96);

  const pts = [];
  const step = 100;
  let peakP = { v:0, r:0 }, peakT = { v:0, r:0 };
  for (let r = idle; r <= rpmMax; r += step){
    const t = nm * torqueShape(r, cfg);
    const p = cv(t, r);
    pts.push({ r, t, p });
    if (p > peakP.v) peakP = { v:p, r };
    if (t > peakT.v) peakT = { v:t, r };
  }
  return { pts, peakP, peakT, rpmMax, idle, cfg };
}

/* --------------------------------------------------------------------------
   Dibujo
   -------------------------------------------------------------------------- */
export class Dyno {
  constructor(canvas, opts = {}){
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.opts = Object.assign({ labels:['DE SERIE', 'HOFMEISTER'] }, opts);
    this.progress = reducedMotion() ? 1 : 0;
    this.hover = null;
    this.curves = null;
    this._bind();
    this.resize();
  }

  _bind(){
    this._onResize = () => { this.resize(); this.draw(); };
    addEventListener('resize', this._onResize);
    document.addEventListener('hm:theme', () => requestAnimationFrame(() => this.draw()));

    const pos = e => {
      const r = this.c.getBoundingClientRect();
      return { x:e.clientX - r.left, y:e.clientY - r.top };
    };
    this.c.addEventListener('pointermove', e => {
      const { x } = pos(e);
      this.hover = x; this.draw();
    });
    this.c.addEventListener('pointerleave', () => { this.hover = null; this.draw(); });
  }

  resize(){
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = this.c.clientWidth || 800;
    const h = this.c.clientHeight || 380;
    this.c.width = Math.round(w * dpr);
    this.c.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w; this.h = h;
  }

  setData(stock, tuned){
    this.curves = { stock, tuned };
    this.rpmMax = Math.max(stock.rpmMax, tuned.rpmMax);
    this.pMax = Math.ceil(Math.max(tuned.peakP.v, stock.peakP.v) * 1.16 / 50) * 50;
    this.tMax = Math.ceil(Math.max(tuned.peakT.v, stock.peakT.v) * 1.16 / 50) * 50;
    return this;
  }

  animate(){
    if (reducedMotion()){ this.progress = 1; this.draw(); return; }
    this.progress = 0;
    const t0 = performance.now();
    const dur = 1500;
    const step = now => {
      this.progress = clamp((now - t0) / dur, 0, 1);
      this.draw();
      if (this.progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* Pasada de banco: la curva se dibuja al ritmo del motor subiendo de vueltas */
  run(dur = 4200, onTick){
    if (this.running) return Promise.resolve();
    this.running = true;
    this.live = true;
    this.progress = 0;
    const t0 = performance.now();
    return new Promise(resolve => {
      const step = now => {
        const t = clamp((now - t0) / dur, 0, 1);
        // Aceleración realista: rápida abajo, más lenta arriba
        this.progress = 1 - Math.pow(1 - t, 1.65);
        this.draw();
        if (onTick){
          const pts = this.curves.tuned.pts;
          const i = clamp(Math.floor(pts.length * this.progress), 0, pts.length - 1);
          onTick(pts[i], this.progress);
        }
        if (t < 1) requestAnimationFrame(step);
        else {
          this.live = false; this.running = false; this.progress = 1;
          this.draw();
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  }

  css(v){ return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

  draw(){
    if (!this.curves) return;
    const { ctx, w, h } = this;
    const pad = { l:52, r:52, t:26, b:36 };
    const gw = w - pad.l - pad.r;
    const gh = h - pad.t - pad.b;
    const dim  = this.css('--fg-mute') || '#59626F';
    const line = this.css('--line') || 'rgba(255,255,255,.09)';
    const fg   = this.css('--fg') || '#DDE3EB';
    const hot  = this.css('--signal') || '#FF2E17';
    const data = this.css('--data') || '#3FB6FF';

    ctx.clearRect(0, 0, w, h);

    const X = r => pad.l + ((r - 800) / (this.rpmMax - 800)) * gw;
    const YP = v => pad.t + gh - (v / this.pMax) * gh;
    const YT = v => pad.t + gh - (v / this.tMax) * gh;

    /* --- Rejilla --- */
    ctx.font = '500 9px "JetBrains Mono", monospace';
    ctx.strokeStyle = line; ctx.lineWidth = 1;
    ctx.fillStyle = dim;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (let r = 1000; r <= this.rpmMax; r += 1000){
      const x = X(r);
      ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + gh); ctx.stroke();
      ctx.fillText(String(r / 1000), x, pad.t + gh + 9);
    }
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    const stepsP = 5;
    for (let i = 0; i <= stepsP; i++){
      const v = (this.pMax / stepsP) * i;
      const y = YP(v);
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + gw, y); ctx.stroke();
      ctx.fillStyle = hot; ctx.fillText(fmt(v), pad.l - 8, y);
      ctx.fillStyle = data; ctx.textAlign = 'left';
      ctx.fillText(fmt((this.tMax / stepsP) * i), pad.l + gw + 8, y);
      ctx.textAlign = 'right';
    }

    ctx.fillStyle = dim; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText('RPM × 1000', pad.l + gw / 2, pad.t + gh + 22);
    ctx.save();
    ctx.translate(13, pad.t + gh / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = hot; ctx.fillText('CV', 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(w - 13, pad.t + gh / 2); ctx.rotate(Math.PI / 2);
    ctx.fillStyle = data; ctx.fillText('NM', 0, 0);
    ctx.restore();

    /* --- Trazado de una curva --- */
    const path = (pts, key, Y, color, { width = 2, dash = null, glow = 0, fill = false } = {}) => {
      const last = Math.max(2, Math.floor(pts.length * this.progress));
      ctx.save();
      ctx.beginPath();
      pts.slice(0, last).forEach((p, i) => {
        const x = X(p.r), y = Y(p[key]);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      if (fill){
        const g = ctx.createLinearGradient(0, pad.t, 0, pad.t + gh);
        g.addColorStop(0, color + '44');
        g.addColorStop(1, color + '00');
        ctx.lineTo(X(pts[last - 1].r), pad.t + gh);
        ctx.lineTo(X(pts[0].r), pad.t + gh);
        ctx.closePath();
        ctx.fillStyle = g; ctx.fill();
      } else {
        if (dash) ctx.setLineDash(dash);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        if (glow){ ctx.shadowColor = color; ctx.shadowBlur = glow; }
        ctx.stroke();
      }
      ctx.restore();
    };

    const { stock, tuned } = this.curves;
    path(tuned.pts, 'p', YP, hot, { fill:true });
    path(stock.pts, 't', YT, data, { width:1.4, dash:[5, 5] });
    path(stock.pts, 'p', YP, hot, { width:1.4, dash:[5, 5] });
    path(tuned.pts, 't', YT, data, { width:2.4, glow:10 });
    path(tuned.pts, 'p', YP, hot, { width:3, glow:14 });

    /* --- Picos --- */
    if (this.progress > .93){
      const mark = (r, v, Y, color, txt, dy = 0) => {
        const x = X(r), y = Y(v);
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
        ctx.strokeStyle = this.css('--bg'); ctx.lineWidth = 2; ctx.stroke();
        ctx.font = '700 10px "JetBrains Mono", monospace';
        ctx.fillStyle = color;
        ctx.textAlign = x > pad.l + gw * .7 ? 'right' : 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(txt, x + (x > pad.l + gw * .7 ? -8 : 8), y - 6 + dy);
      };
      const px = X(tuned.peakP.r), tx = X(tuned.peakT.r);
      const py = YP(tuned.peakP.v), ty = YT(tuned.peakT.v);
      const cerca = Math.abs(px - tx) < 150 && Math.abs(py - ty) < 26;
      mark(tuned.peakP.r, tuned.peakP.v, YP, hot, `${fmt(tuned.peakP.v)} CV @ ${fmt(tuned.peakP.r)}`);
      mark(tuned.peakT.r, tuned.peakT.v, YT, data, `${fmt(tuned.peakT.v)} NM @ ${fmt(tuned.peakT.r)}`, cerca ? 20 : 0);
    }

    /* --- Cabeza luminosa durante la pasada --- */
    if (this.live && this.progress > .02){
      const pts = tuned.pts;
      const i = clamp(Math.floor(pts.length * this.progress), 0, pts.length - 1);
      const p = pts[i];
      const x = X(p.r);
      ctx.save();
      ctx.strokeStyle = hot; ctx.globalAlpha = .45; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + gh); ctx.stroke();
      ctx.globalAlpha = 1;
      [[YP(p.p), hot], [YT(p.t), data]].forEach(([y, c]) => {
        ctx.shadowColor = c; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = c; ctx.fill();
      });
      ctx.restore();
      ctx.font = '700 11px "JetBrains Mono", monospace';
      ctx.textAlign = x > pad.l + gw * .6 ? 'right' : 'left';
      ctx.textBaseline = 'top';
      const ox = x + (x > pad.l + gw * .6 ? -10 : 10);
      ctx.fillStyle = fg; ctx.fillText(`${fmt(p.r)} RPM`, ox, pad.t + 4);
      ctx.fillStyle = hot; ctx.fillText(`${fmt(p.p)} CV`, ox, pad.t + 18);
      ctx.fillStyle = data; ctx.fillText(`${fmt(p.t)} NM`, ox, pad.t + 32);
    }

    /* --- Cursor de lectura --- */
    if (!this.live && this.hover !== null && this.hover > pad.l && this.hover < pad.l + gw){
      const rpm = 800 + ((this.hover - pad.l) / gw) * (this.rpmMax - 800);
      const near = arr => arr.reduce((a, b) => Math.abs(b.r - rpm) < Math.abs(a.r - rpm) ? b : a);
      const pt = near(tuned.pts), ps = near(stock.pts);
      const x = X(pt.r);
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = fg; ctx.globalAlpha = .5; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + gh); ctx.stroke();
      ctx.restore();

      const lines = [
        [`${fmt(pt.r)} RPM`, fg],
        [`${fmt(pt.p)} CV  ·  ${fmt(pt.t)} NM`, hot],
        [`serie: ${fmt(ps.p)} CV  ·  ${fmt(ps.t)} NM`, dim]
      ];
      ctx.font = '500 10px "JetBrains Mono", monospace';
      const bw = Math.max(...lines.map(l => ctx.measureText(l[0]).width)) + 20;
      const bx = clamp(x + 12, pad.l, pad.l + gw - bw);
      const by = pad.t + 8;
      ctx.fillStyle = this.css('--bg-sunk') || '#04070A';
      ctx.globalAlpha = .94;
      ctx.fillRect(bx, by, bw, 52);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = line; ctx.strokeRect(bx + .5, by + .5, bw - 1, 51);
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      lines.forEach((l, i) => { ctx.fillStyle = l[1]; ctx.fillText(l[0], bx + 10, by + 10 + i * 14); });
    }
  }
}
