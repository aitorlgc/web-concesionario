/* ==========================================================================
   REVELADO AL SCROLL
   ========================================================================== */
import { $$, splitChars, reducedMotion } from '../lib/util.js';

export function initReveal(root = document){
  const items = $$('[data-reveal],.linemask,.chars', root);
  $$('.chars', root).forEach(splitChars);

  if (reducedMotion() || !('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { rootMargin:'0px 0px -12% 0px', threshold:.06 });

  items.forEach((el, i) => {
    if (el.dataset.rd) el.style.setProperty('--rd', el.dataset.rd + 'ms');
    else if (el.closest('[data-stagger]')){
      const sibs = Array.from(el.closest('[data-stagger]').children);
      const idx = sibs.indexOf(el.closest('[data-stagger]') === el.parentElement ? el : el.closest('[data-stagger] > *'));
      el.style.setProperty('--rd', `${Math.max(idx, 0) * 90}ms`);
    }
    void i;
    io.observe(el);
  });
}
