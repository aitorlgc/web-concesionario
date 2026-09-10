/* ==========================================================================
   MARQUESINA — duplica la pista para bucle continuo
   ========================================================================== */
import { $$ } from '../lib/util.js';

export function initMarquee(root = document){
  $$('.marquee', root).forEach(m => {
    const track = m.querySelector('.marquee__track');
    if (!track || track.dataset.cloned) return;
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    m.appendChild(clone);
    track.dataset.cloned = '1';
    if (m.dataset.speed) {
      m.style.setProperty('--mq-dur', m.dataset.speed + 's');
      clone.style.setProperty('--mq-dur', m.dataset.speed + 's');
    }
  });
}
