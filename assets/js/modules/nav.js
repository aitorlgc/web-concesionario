/* ==========================================================================
   NAVEGACIÓN — cabecera pegajosa, menú a pantalla completa
   ========================================================================== */
import { $, $$, on, lockScroll, trapFocus, throttleRAF } from '../lib/util.js';

export function initNav(){
  const nav    = $('.nav');
  const burger = $('.burger');
  const menu   = $('.menu');
  const prog   = $('.scrollbar-top i');
  if (!nav) return;

  /* --- Estado pegajoso + autoocultado --------------------------------- */
  let last = 0;
  const onScroll = throttleRAF(() => {
    const y = window.scrollY;
    nav.classList.toggle('is-stuck', y > 24);
    if (!menu?.classList.contains('is-open')){
      nav.classList.toggle('is-hidden', y > 420 && y > last + 4);
    }
    last = y;
    if (prog){
      const max = document.documentElement.scrollHeight - innerHeight;
      prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }
  });
  on(window, 'scroll', onScroll, { passive:true });
  onScroll();

  /* --- Menú ------------------------------------------------------------ */
  if (!burger || !menu) return;
  let untrap = null;
  const setMenu = open => {
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar el menú' : 'Abrir el menú');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    nav.classList.remove('is-hidden');
    lockScroll(open);
    if (open){
      $$('.menu__link', menu).forEach((l, i) => l.style.setProperty('--rd', `${90 + i * 60}ms`));
      untrap = trapFocus(menu);
      setTimeout(() => $('.menu__link', menu)?.focus(), 420);
    } else {
      untrap?.(); untrap = null;
      burger.focus();
    }
  };
  on(burger, 'click', () => setMenu(!menu.classList.contains('is-open')));
  on(document, 'keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
  });
  $$('.menu__link', menu).forEach(l => on(l, 'click', () => setMenu(false)));
}
