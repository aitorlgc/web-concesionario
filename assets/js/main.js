/* ==========================================================================
   HOFMEISTER — ARRANQUE COMÚN
   ========================================================================== */
import { $, on }        from './lib/util.js';
import { initPreloader } from './modules/preloader.js';
import { initCursor }    from './modules/cursor.js';
import { initNav }       from './modules/nav.js';
import { initReveal }    from './modules/reveal.js';
import { initTheme }     from './modules/theme.js';
import { initMarquee }   from './modules/marquee.js';
import { initCounters }  from './modules/counters.js';
import { initAccordion } from './modules/accordion.js';
import { initMagnet }    from './modules/magnet.js';
import { initHUD }       from './modules/hud.js';
import { initSound, rev } from './modules/sound.js';
import { initKonami }    from './modules/konami.js';

export const app = { hero:null };

export async function boot(pageInit){
  initTheme();
  initCursor();
  initNav();
  initMarquee();
  initAccordion();
  initSound();
  initHUD();
  initKonami(() => rev({ peak:8200, up:.9, down:1.4, gain:.45 }));

  // El módulo de página puede devolver una promesa
  const pending = pageInit ? pageInit() : null;

  await initPreloader();
  initReveal();
  initCounters();
  initMagnet();
  await pending;

  // Botones que "dan gas"
  $$('[data-rev]').forEach(b => on(b, 'click', () => {
    const p = +(b.dataset.rev || 7600);
    rev({ peak:p });
    app.hero?.rev(1);
  }));

  // Anclas suaves con compensación de cabecera
  $$('a[href^="#"]:not([href="#"])').forEach(a => on(a, 'click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    const y = t.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72) - 12;
    window.scrollTo({ top:y, behavior:'smooth' });
  }));

  document.documentElement.classList.add('js-ready');
}

function $$(s, c = document){ return Array.from(c.querySelectorAll(s)); }
