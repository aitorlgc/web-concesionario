/* ==========================================================================
   ACORDEÓN accesible
   ========================================================================== */
import { $$, on } from '../lib/util.js';

export function initAccordion(root = document){
  $$('.acc', root).forEach(acc => {
    const single = acc.dataset.single !== 'false';
    $$('.acc__btn', acc).forEach(btn => {
      const panel = btn.nextElementSibling;
      on(btn, 'click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        if (single){
          $$('.acc__btn', acc).forEach(b => {
            if (b !== btn){ b.setAttribute('aria-expanded', 'false'); b.nextElementSibling.style.height = '0px'; }
          });
        }
        btn.setAttribute('aria-expanded', String(!open));
        panel.style.height = open ? '0px' : panel.scrollHeight + 'px';
      });
      on(panel, 'transitionend', () => {
        if (btn.getAttribute('aria-expanded') === 'true') panel.style.height = 'auto';
      });
    });
  });
  addEventListener('resize', () => {
    $$('.acc__btn[aria-expanded="true"]', root).forEach(b => {
      b.nextElementSibling.style.height = 'auto';
    });
  });
}
