/* ==========================================================================
   IMANTADO Y BASCULACIÓN
   ========================================================================== */
import { $$, on, isTouch, reducedMotion, clamp } from '../lib/util.js';

export function initMagnet(root = document){
  if (isTouch() || reducedMotion()) return;

  $$('[data-magnet]', root).forEach(el => {
    const str = +(el.dataset.magnet || 22);
    on(el, 'pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      el.style.transform = `translate(${x * str}px, ${y * str * .6}px)`;
    });
    on(el, 'pointerleave', () => { el.style.transform = ''; });
  });

  $$('[data-tilt]', root).forEach(el => {
    const max = +(el.dataset.tilt || 7);
    on(el, 'pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = clamp((e.clientX - r.left) / r.width, 0, 1) - .5;
      const y = clamp((e.clientY - r.top) / r.height, 0, 1) - .5;
      el.style.transform = `perspective(900px) rotateY(${x * max * 2}deg) rotateX(${-y * max * 2}deg) translateZ(0)`;
    });
    on(el, 'pointerleave', () => { el.style.transform = ''; });
  });
}
