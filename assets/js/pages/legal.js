/* ==========================================================================
   AVISO LEGAL — resalta la sección visible en el índice
   ========================================================================== */
import { $$ } from '../lib/util.js';

export function initLegal(){
  const links = $$('.legal__toc a');
  const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!secs.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(en => {
    en.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-here', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin:'-20% 0px -70% 0px' });
  secs.forEach(s => io.observe(s));
}
