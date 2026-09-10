/* ==========================================================================
   HUD — cuentavueltas que traduce el scroll en régimen de motor
   ========================================================================== */
import { $, throttleRAF, clamp, reducedMotion } from '../lib/util.js';

const MAXRPM = 9;
const A0 = 218, A1 = -38;               // grados: inicio y fin de la escala

const pol = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
};

function dial(){
  const cx = 60, cy = 58, R = 46;
  let ticks = '';
  for (let i = 0; i <= MAXRPM; i++){
    const a = A0 + ((A1 - A0) * i) / MAXRPM;
    const red = i >= 7.5;
    const [x1, y1] = pol(cx, cy, R, a);
    const [x2, y2] = pol(cx, cy, R - (i % 1 === 0 ? 9 : 5), a);
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${red ? 'var(--signal)' : 'currentColor'}" stroke-width="${i % 1 === 0 ? 2 : 1}"/>`;
    const [tx, ty] = pol(cx, cy, R - 19, a);
    ticks += `<text x="${tx.toFixed(1)}" y="${(ty + 3.4).toFixed(1)}" text-anchor="middle" font-size="8.5" fill="${red ? 'var(--signal)' : 'currentColor'}">${i}</text>`;
  }
  const [ax, ay] = pol(cx, cy, R, A0);
  const [bx, by] = pol(cx, cy, R, A1);
  const [rx, ry] = pol(cx, cy, R, A0 + ((A1 - A0) * 7.5) / MAXRPM);
  return `
  <svg class="hud__svg" viewBox="0 0 120 120" aria-hidden="true">
    <path d="M${ax.toFixed(1)} ${ay.toFixed(1)} A${R} ${R} 0 1 1 ${bx.toFixed(1)} ${by.toFixed(1)}"
          fill="none" stroke="currentColor" stroke-width="1" opacity=".45"/>
    <path d="M${rx.toFixed(1)} ${ry.toFixed(1)} A${R} ${R} 0 0 1 ${bx.toFixed(1)} ${by.toFixed(1)}"
          fill="none" stroke="var(--signal)" stroke-width="3"/>
    <g opacity=".8">${ticks}</g>
    <g class="hud__needle" style="transform-origin:${cx}px ${cy}px">
      <path d="M${cx} ${cy - 3.2} L${cx + R - 6} ${cy - 1.1} L${cx + R - 6} ${cy + 1.1} L${cx} ${cy + 3.2} Z" fill="var(--signal)"/>
    </g>
    <circle cx="${cx}" cy="${cy}" r="5" fill="var(--bg)" stroke="currentColor" stroke-width="1.4"/>
  </svg>`;
}

export function initHUD(){
  const hud = $('.hud');
  if (!hud) return;
  hud.insertAdjacentHTML('afterbegin', dial());
  hud.insertAdjacentHTML('beforeend', `
    <div class="hud__gear" aria-hidden="true">N</div>
    <div class="hud__read">
      <div class="hud__rpm"><span>0</span></div>
      <div class="hud__x">rpm × 1000</div>
    </div>`);

  const needle = $('.hud__needle', hud);
  const rpmEl  = $('.hud__rpm span', hud);
  const gearEl = $('.hud__gear', hud);
  const GEARS = ['N', '1', '2', '3', '4', '5', '6'];

  let cur = 0, target = 0, boost = 0;

  const read = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    hud.classList.toggle('is-on', window.scrollY > 200);
    // Cada "marcha" recorre la escala de vueltas de 1.2 a 7.8
    const seg = 1 / 6;
    const g = Math.min(Math.floor(p / seg), 5);
    const within = (p - g * seg) / seg;
    target = 1.2 + within * 6.6;
    gearEl.textContent = GEARS[g + 1] || '6';
    gearEl.style.color = target > 7.5 ? 'var(--signal)' : '';
  };

  // Se retira al llegar al pie para no tapar los enlaces legales
  const foot = document.querySelector('.foot');
  if (foot && 'IntersectionObserver' in window){
    new IntersectionObserver(en => hud.classList.toggle('is-tucked', en[0].isIntersecting),
      { rootMargin:'0px 0px -55% 0px' }).observe(foot);
  }

  addEventListener('scroll', throttleRAF(read), { passive:true });
  addEventListener('resize', throttleRAF(read));
  document.addEventListener('hm:rev', () => { boost = 2.4; });
  read();

  if (reducedMotion()){
    needle.style.transform = 'rotate(0deg)';
    return;
  }

  const loop = () => {
    requestAnimationFrame(loop);
    boost *= 0.94;
    const t = clamp(target + boost, 0, MAXRPM);
    cur += (t - cur) * 0.11;
    const deg = A0 + ((A1 - A0) * cur) / MAXRPM;
    needle.style.transform = `rotate(${-deg}deg)`;
    rpmEl.textContent = cur.toFixed(1);
  };
  requestAnimationFrame(loop);
}
