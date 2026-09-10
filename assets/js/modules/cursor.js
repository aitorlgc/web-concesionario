/* ==========================================================================
   CURSOR — retícula con estados e imantado
   ========================================================================== */
import { $, isTouch, reducedMotion, lerp } from '../lib/util.js';

export function initCursor(){
  if (isTouch() || reducedMotion()) return;
  const el = $('.cursor');
  if (!el) return;
  const ring  = $('.cursor__ring', el);
  const dot   = $('.cursor__dot', el);
  const label = $('.cursor__label', el);

  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  const move = e => {
    mx = e.clientX; my = e.clientY;
    el.classList.add('is-on');
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    label.style.transform = `translate(${mx}px,${my + 4}px) translate(-50%,-50%)`;
  };
  addEventListener('pointermove', move, { passive:true });
  addEventListener('pointerdown', () => el.classList.add('is-down'));
  addEventListener('pointerup',   () => el.classList.remove('is-down'));
  addEventListener('pointerleave',() => el.classList.remove('is-on'));

  const loop = () => {
    rx = lerp(rx, mx, .18); ry = lerp(ry, my, .18);
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const SEL = 'a,button,[role="button"],input,select,textarea,summary,.chip,.card,label';
  document.addEventListener('pointerover', e => {
    const t = e.target.closest('[data-cursor]');
    if (t){
      el.classList.add('is-label');
      label.textContent = t.dataset.cursor;
      return;
    }
    if (e.target.closest(SEL)) el.classList.add('is-hover');
  });
  document.addEventListener('pointerout', e => {
    if (e.target.closest('[data-cursor]')) el.classList.remove('is-label');
    if (e.target.closest(SEL)) el.classList.remove('is-hover');
  });
}
