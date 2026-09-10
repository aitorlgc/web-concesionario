/* ==========================================================================
   TRANSICIÓN ENTRE PÁGINAS — cortinilla con las tres franjas M
   ========================================================================== */
import { reducedMotion } from '../lib/util.js';

const SEEN = 'hm-seen';

export function isReturning(){
  try { return sessionStorage.getItem(SEEN) === '1'; } catch { return false; }
}
export function markSeen(){
  try { sessionStorage.setItem(SEEN, '1'); } catch { /* ignorado */ }
}

function build(){
  const el = document.createElement('div');
  el.className = 'wipe';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(el);
  return el;
}

export function initTransition(){
  markSeen();
  if (reducedMotion()) return;
  const wipe = build();

  /* Salida al cargar (solo si venimos de otra página del sitio) */
  if (document.documentElement.dataset.wipeIn === '1'){
    wipe.classList.add('is-full');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      wipe.classList.remove('is-full');
      wipe.classList.add('is-out');
      setTimeout(() => wipe.className = 'wipe', 900);
    }));
  }

  /* Entrada al navegar */
  const go = url => {
    wipe.classList.add('is-in');
    setTimeout(() => { location.href = url; }, 620);
    // Red de seguridad: si la navegación no ocurre, retira la cortinilla
    setTimeout(() => wipe.classList.remove('is-in'), 4000);
  };

  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (a.target && a.target !== '_self') return;
    if (a.hasAttribute('download')) return;
    if (url.pathname === location.pathname){ return; }          // anclas internas
    if (!/\.html?$/.test(url.pathname) && url.pathname !== '/') return;
    e.preventDefault();
    sessionStorage.setItem('hm-wipe', '1');
    go(url.href);
  });

  addEventListener('pageshow', ev => {
    if (ev.persisted) wipe.className = 'wipe';
  });
}

/* Marca la página como "llegada por cortinilla" antes de pintar nada */
export function flagIncoming(){
  // El script en línea de <head> ya marcó data-wipe-in antes del primer pintado;
  // aquí solo limpiamos la bandera para que no se repita.
  try { sessionStorage.removeItem('hm-wipe'); } catch { /* ignorado */ }
}
