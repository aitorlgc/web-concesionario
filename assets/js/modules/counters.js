/* ==========================================================================
   CONTADORES
   ========================================================================== */
import { $$, animateNumber } from '../lib/util.js';

export function initCounters(root = document){
  const els = $$('[data-count]', root);
  if (!els.length) return;
  const io = new IntersectionObserver(en => {
    en.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      animateNumber(el, parseFloat(el.dataset.count), {
        dur: +(el.dataset.dur || 1700),
        decimals: +(el.dataset.dec || 0),
        suffix: el.dataset.suffix || ''
      });
      io.unobserve(el);
    });
  }, { threshold:.4 });
  els.forEach(el => io.observe(el));
}
