/* ==========================================================================
   TEMA — noche / día
   ========================================================================== */
import { $, on, store } from '../lib/util.js';

export function initTheme(){
  const btn = $('[data-theme-toggle]');
  const html = document.documentElement;
  const saved = store.get('hm-theme', 'noche');
  apply(saved);

  function apply(t){
    if (t === 'dia') html.setAttribute('data-theme', 'dia');
    else html.removeAttribute('data-theme');
    store.set('hm-theme', t);
    if (btn){
      btn.setAttribute('aria-label', t === 'dia' ? 'Cambiar a modo noche' : 'Cambiar a modo día');
      btn.classList.toggle('is-on', t === 'dia');
      btn.dataset.state = t;
    }
    document.dispatchEvent(new CustomEvent('hm:theme', { detail:{ theme:t } }));
  }

  on(btn, 'click', () => {
    apply(html.getAttribute('data-theme') === 'dia' ? 'noche' : 'dia');
  });
}
