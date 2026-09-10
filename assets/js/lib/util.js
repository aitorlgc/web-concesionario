/* ==========================================================================
   HOFMEISTER — UTILIDADES
   ========================================================================== */
export const $  = (s, c = document) => c.querySelector(s);
export const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
export const on = (el, ev, fn, o) => el && el.addEventListener(ev, fn, o);

export const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
export const lerp  = (a, b, t) => a + (b - a) * t;
export const map   = (v, a, b, c, d) => c + ((v - a) / (b - a)) * (d - c);
export const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () =>
  window.matchMedia('(hover: none), (pointer: coarse)').matches;

export const raf = fn => requestAnimationFrame(fn);

export function throttleRAF(fn){
  let ticking = false;
  return (...args) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { fn(...args); ticking = false; });
  };
}

export function debounce(fn, ms = 180){
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

/* Número con separador de miles español */
export const nf = new Intl.NumberFormat('es-ES');
export const fmt = n => nf.format(Math.round(n));
export const eur = n => new Intl.NumberFormat('es-ES', {
  style:'currency', currency:'EUR', maximumFractionDigits:0
}).format(n);

/* Divide un texto en <span> por carácter, respetando palabras */
export function splitChars(el){
  if (el.dataset.split === '1') return;
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  words.forEach((w, wi) => {
    const wrap = document.createElement('span');
    wrap.className = 'w';
    wrap.style.display = 'inline-block';
    wrap.style.whiteSpace = 'nowrap';
    [...w].forEach((ch, ci) => {
      const s = document.createElement('span');
      s.textContent = ch;
      s.style.transitionDelay = `${(wi * 40) + ci * 26}ms`;
      wrap.appendChild(s);
    });
    el.appendChild(wrap);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
  el.dataset.split = '1';
}

/* Bloqueo de scroll conservando la posición */
let lockY = 0;
export function lockScroll(on){
  const b = document.body;
  if (on){
    lockY = window.scrollY;
    b.style.position = 'fixed';
    b.style.top = `-${lockY}px`;
    b.style.width = '100%';
  } else {
    b.style.position = '';
    b.style.top = '';
    b.style.width = '';
    window.scrollTo(0, lockY);
  }
}

/* Foco atrapado dentro de un contenedor (modales, menú) */
export function trapFocus(container){
  const sel = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
  const handler = e => {
    if (e.key !== 'Tab') return;
    const items = $$(sel, container).filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
}

/* Almacenamiento tolerante a fallos */
export const store = {
  get(k, d = null){
    try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); }
    catch { return d; }
  },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignorado */ } },
  del(k){ try { localStorage.removeItem(k); } catch { /* ignorado */ } }
};

/* Animación numérica */
export function animateNumber(el, to, { from = 0, dur = 1600, decimals = 0, suffix = '', prefix = '' } = {}){
  if (reducedMotion()){ el.textContent = prefix + to.toFixed(decimals) + suffix; return; }
  const t0 = performance.now();
  const step = now => {
    const t = clamp((now - t0) / dur, 0, 1);
    const v = from + (to - from) * easeOutCubic(t);
    el.textContent = prefix + (decimals ? v.toFixed(decimals) : fmt(v)) + suffix;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
