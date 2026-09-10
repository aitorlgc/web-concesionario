/* ==========================================================================
   PRECARGA — cuenta de 000 a 100 con lectura de sistemas
   ========================================================================== */
import { $, reducedMotion } from '../lib/util.js';

const LINEAS = [
  'CENTRALITA', 'BANCO DE RODILLOS', 'SONDAS LAMBDA', 'PRESIÓN DE SOPLADO', 'LISTO'
];

export function initPreloader(){
  const el = $('.preload');
  if (!el) { document.body.classList.add('is-ready'); return Promise.resolve(); }

  const pct  = $('.preload__pct', el);
  const bar  = $('.preload__bar i', el);
  const meta = $('.preload__meta', el);

  meta.innerHTML = LINEAS.map(t => `<span>${t}</span>`).join('');
  const spans = Array.from(meta.children);

  return new Promise(resolve => {
    const finish = () => {
      el.classList.add('is-done');
      document.body.classList.add('is-ready');
      setTimeout(() => { el.setAttribute('hidden', ''); }, 1500);
      resolve();
    };

    if (reducedMotion()){
      pct.textContent = '100';
      bar.style.transform = 'scaleX(1)';
      spans.forEach(s => s.style.color = 'var(--signal)');
      setTimeout(finish, 260);
      return;
    }

    let v = 0;
    const t0 = performance.now();
    const dur = 1750;
    const tick = now => {
      const t = Math.min((now - t0) / dur, 1);
      // Curva de "subida de vueltas": rápida, mesetas, tirón final
      const e = t < .55 ? t * 1.42 : t < .8 ? .78 + (t - .55) * .32 : .86 + (t - .8) * .7;
      v = Math.min(Math.round(e * 100), 100);
      pct.textContent = String(v).padStart(3, '0');
      bar.style.transform = `scaleX(${v / 100})`;
      const idx = Math.min(Math.floor(v / 100 * LINEAS.length), LINEAS.length - 1);
      spans.forEach((s, i) => { s.style.color = i <= idx ? 'var(--ink-900)' : ''; });
      if (t < 1) requestAnimationFrame(tick);
      else { spans[spans.length - 1].style.color = 'var(--signal)'; setTimeout(finish, 300); }
    };
    requestAnimationFrame(tick);
  });
}
