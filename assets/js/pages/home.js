/* ==========================================================================
   PORTADA
   ========================================================================== */
import { $, $$, on, fmt, eur } from '../lib/util.js';
import { CARS, CARS_BY_ID, carSVG } from '../data/car-art.js';
import { SERVICIOS, ETAPAS, CIFRAS, TESTIMONIOS } from '../data/site.js';
import { PROYECTOS } from '../data/projects.js';
import { initHeroGL } from '../modules/hero-gl.js';
import { initTimeline } from '../modules/timeline.js';
import { Dyno, buildCurve } from '../modules/dyno.js';
import { rev } from '../modules/sound.js';

/* Referencia usada en las tarjetas de etapa: un seis en línea biturbo moderno */
const REF = { hp:431, nm:550 };

export function initHome(app){
  heroCar();
  servicios();
  etapas();
  banco();
  garaje();
  cifras();
  testimonios();
  initTimeline();
  app.hero = initHeroGL($('.hero__gl'));
  on(document, 'hm:rev', e => {
    app.hero?.rev(1);
    rodar($('#heroCar .carsvg'), e.detail);
  });
}

/* -------------------------------------------------------------------------- */
function heroCar(){
  const host = $('#heroCar');
  const car = CARS_BY_ID['m4-csl-g82'];
  if (host){
    host.innerHTML = carSVG(car, { blueprint:true });
    host.querySelector('.carsvg')?.classList.add('show-kink');
  }
  const meta = $('#heroMeta');
  if (meta) meta.textContent = `En pantalla · ${car.name} ${car.chassis} · ${car.engine} · ${car.stockHp} → ${car.tuneHp} CV`;
}

/* Hace rodar las ruedas del dibujo al ritmo del aceleronazo */
function rodar(svg, { up = .85, down = 1.25 } = {}){
  if (!svg) return;
  clearTimeout(rodar._t);
  svg.classList.add('is-rolling');
  const total = (up + down) * 1000;
  const t0 = performance.now();
  const tick = now => {
    const t = (now - t0) / total;
    if (t >= 1){ svg.classList.remove('is-rolling'); return; }
    // Sube de vueltas y baja igual que el sonido
    const v = t < up / (up + down) ? t / (up / (up + down)) : 1 - (t - up / (up + down)) / (down / (up + down));
    svg.style.setProperty('--spin', `${(0.85 - v * 0.72).toFixed(3)}s`);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* -------------------------------------------------------------------------- */
function servicios(){
  const el = $('#servicios-grid');
  if (!el) return;
  el.innerHTML = SERVICIOS.map((s, i) => `
    <article class="srv__c" data-reveal data-rd="${i * 70}" tabindex="0">
      <span class="srv__n">/${s.num}</span>
      <h3 class="srv__t">${s.titulo}</h3>
      <p class="srv__d">${s.desc}</p>
      <div class="srv__list"><ul>${s.puntos.map(p => `<li>${p}</li>`).join('')}</ul></div>
      <span class="srv__tag">${s.tag}</span>
    </article>`).join('');
}

/* -------------------------------------------------------------------------- */
function etapas(){
  const el = $('#etapas-grid');
  if (!el) return;
  const maxHp = Math.round(REF.hp * (1 + ETAPAS[2].gainPct));
  const maxNm = Math.round(REF.nm * (1 + ETAPAS[2].torquePct));

  el.innerHTML = ETAPAS.map((e, i) => {
    const hp = Math.round(REF.hp * (1 + e.gainPct));
    const nm = Math.round(REF.nm * (1 + e.torquePct));
    return `
    <article class="et${i === 1 ? ' et--hero' : ''}" data-reveal data-rd="${i * 110}">
      ${i === 1 ? '<span class="et__ribbon">El punto dulce</span>' : ''}
      <div class="et__head">
        <div>
          <span class="et__code">${e.code}</span>
          <h3 class="et__name">${e.nombre}</h3>
        </div>
        <span class="mono muted">+${Math.round(e.gainPct * 100)}%</span>
      </div>
      <p class="et__sum">${e.resumen}</p>
      <div class="et__meter">
        <div class="et__row">
          <span>CV</span>
          <span class="et__track" style="--v:${(hp / maxHp).toFixed(3)}"><i class="base" style="--v:${(REF.hp / maxHp).toFixed(3)}"></i><i class="gain" style="--v:${(hp / maxHp).toFixed(3)};opacity:.55"></i></span>
          <span class="et__val">${REF.hp}→${hp}</span>
        </div>
        <div class="et__row">
          <span>NM</span>
          <span class="et__track"><i class="base" style="--v:${(REF.nm / maxNm).toFixed(3)}"></i><i class="gain" style="--v:${(nm / maxNm).toFixed(3)};opacity:.55"></i></span>
          <span class="et__val">${REF.nm}→${nm}</span>
        </div>
      </div>
      <ul class="et__inc">${e.incluye.map(x => `<li>${x}</li>`).join('')}</ul>
      <div class="et__foot">
        <p class="et__price"><small>Desde</small>${eur(e.precio)}</p>
        <p class="et__days">${e.dias} ${e.dias === 1 ? 'día' : 'días'} de taller<br>Garantía ${e.garantia}</p>
      </div>
    </article>`;
  }).join('');

  // Las barras se pintan una encima de otra: base debajo, ganancia encima
  $$('.et__track', el).forEach(t => {
    const gain = t.querySelector('.gain');
    if (gain) t.insertBefore(gain, t.firstChild);
  });
}

/* -------------------------------------------------------------------------- */
function banco(){
  const cv = $('#banco-canvas');
  if (!cv) return;
  const sel = $('#banco-car');
  const tabs = $('#banco-stages');
  const out = $('#banco-out');

  sel.innerHTML = CARS.map(c => `<option value="${c.id}"${c.id === 'm4-f82' ? ' selected' : ''}>${c.name} · ${c.chassis} · ${c.years}</option>`).join('');
  tabs.innerHTML = ETAPAS.map((e, i) =>
    `<button role="tab" data-stage="${i}" aria-selected="${i === 1}">${e.nombre}</button>`).join('');

  const dyno = new Dyno(cv);
  let stage = 1;

  const render = (animate = true) => {
    const car = CARS_BY_ID[sel.value];
    const e = ETAPAS[stage];
    const turbo = /turbo/i.test(car.engine);
    const rpmMax = turbo ? 7200 : (car.stockHp > 400 ? 8400 : 7800);
    const stock = buildCurve({ hp:car.stockHp, nm:car.torque, rpmMax, turbo });
    const hp2 = Math.round(car.stockHp * (1 + e.gainPct * (turbo ? 1 : .62)));
    const nm2 = Math.round(car.torque * (1 + e.torquePct * (turbo ? 1 : .58)));
    const tuned = buildCurve({ hp:hp2, nm:nm2, rpmMax:rpmMax + (turbo ? 200 : 300), turbo });
    dyno.setData(stock, tuned);
    animate ? dyno.animate() : dyno.draw();

    const d = (a, b) => `+${Math.round(((b - a) / a) * 100)}%`;
    out.innerHTML = `
      <div><dt>Potencia</dt><dd>${fmt(tuned.peakP.v)}<span class="mono muted">CV</span><span class="up">${d(stock.peakP.v, tuned.peakP.v)}</span></dd></div>
      <div><dt>Par máximo</dt><dd>${fmt(tuned.peakT.v)}<span class="mono muted">Nm</span><span class="up">${d(stock.peakT.v, tuned.peakT.v)}</span></dd></div>
      <div><dt>Régimen de pico</dt><dd>${fmt(tuned.peakP.r)}<span class="mono muted">rpm</span></dd></div>
      <div><dt>Etapa · desde</dt><dd>${eur(e.precio)}</dd></div>`;
  };

  on(sel, 'change', () => { render(); rev({ peak:6200, up:.55, down:.9, gain:.3 }); });
  on(tabs, 'click', ev => {
    const b = ev.target.closest('button');
    if (!b) return;
    stage = +b.dataset.stage;
    $$('button', tabs).forEach(x => x.setAttribute('aria-selected', String(x === b)));
    render();
    rev({ peak:5600 + stage * 900, up:.55, down:.9, gain:.3 });
  });

  /* --- Pasada de banco en directo --------------------------------------- */
  const runBtn = $('#banco-run');
  const live = $('#banco-live');
  on(runBtn, 'click', async () => {
    if (dyno.running) return;
    const r = CARS_BY_ID[sel.value];
    const turbo = /turbo/i.test(r.engine);
    const redline = turbo ? 7200 : (r.stockHp > 400 ? 8400 : 7800);
    runBtn.disabled = true;
    live.hidden = false;
    live.setAttribute('aria-live', 'polite');
    rev({ peak:redline, idle:1100, up:4.2, down:1.4, gain:.42 });
    const rpmEl = live.querySelector('.banco__liveRpm b');
    const cvEl  = live.querySelector('.banco__liveCv b');
    const barEl = live.querySelector('.banco__liveBar i');
    await dyno.run(4200, (p, t) => {
      rpmEl.textContent = fmt(p.r);
      cvEl.textContent = fmt(p.p);
      barEl.style.transform = `scaleX(${t})`;
      live.classList.toggle('is-red', p.r > redline * .88);
    });
    runBtn.disabled = false;
    setTimeout(() => { live.hidden = true; live.classList.remove('is-red'); }, 2600);
  });

  // Anima la primera vez que entra en pantalla
  let done = false;
  const io = new IntersectionObserver(en => {
    if (en[0].isIntersecting && !done){ done = true; render(); }
  }, { threshold:.25 });
  io.observe(cv);
  render(false);
}

/* -------------------------------------------------------------------------- */
function garaje(){
  const el = $('#garaje-teaser');
  if (!el) return;
  const dest = ['p-g80-cuartel', 'p-e30-hormigon', 'p-e92-naranja'];
  el.innerHTML = dest.map((id, i) => {
    const p = PROYECTOS.find(x => x.id === id);
    const car = CARS_BY_ID[p.car];
    return `
    <a class="gt__c" href="garaje.html#${p.id}" data-reveal data-rd="${i * 110}" data-cursor="Abrir ficha">
      <div class="gt__art">
        <span class="gt__ref">${p.ref}</span>
        <span class="gt__cats"><span class="badge">${p.anio}</span></span>
        ${carSVG(car, p.livery)}
      </div>
      <div class="gt__body">
        <h3 class="gt__t">${p.titulo}</h3>
        <p class="gt__s">${p.sub}</p>
        <p class="gt__d">${p.resumen}</p>
        <div class="gt__num">
          <div><b>Potencia</b><span>${p.despues.cv} <em class="up">+${p.despues.cv - p.antes.cv}</em></span></div>
          <div><b>Par</b><span>${p.despues.nm} <em class="up">+${p.despues.nm - p.antes.nm}</em></span></div>
          <div><b>0–100</b><span>${p.despues.s100.toFixed(1)}s</span></div>
        </div>
      </div>
    </a>`;
  }).join('');
}

/* -------------------------------------------------------------------------- */
function cifras(){
  const el = $('#cifras');
  if (!el) return;
  el.innerHTML = CIFRAS.map((c, i) => `
    <div data-reveal data-rd="${i * 90}">
      <p class="cifras__n"><span data-count="${c.n}">0</span>${c.u ? `<span class="cifras__u">${c.u}</span>` : ''}</p>
      <p class="cifras__l">${c.l}</p>
      <p class="cifras__d">${c.d}</p>
    </div>`).join('');
}

/* -------------------------------------------------------------------------- */
function testimonios(){
  const el = $('#testi-track');
  if (!el) return;
  el.innerHTML = TESTIMONIOS.map(t => `
    <figure class="tq">
      <blockquote class="tq__q">${t.t}</blockquote>
      <figcaption class="tq__f">
        <span class="tq__a">${t.a}</span>
        <span class="tq__c">${t.c}<br>${t.k}</span>
      </figcaption>
    </figure>`).join('');
}
