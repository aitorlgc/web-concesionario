/* ==========================================================================
   LÍNEA TEMPORAL HORIZONTAL — el scroll vertical mueve la pista
   ========================================================================== */
import { $, throttleRAF, clamp, reducedMotion } from '../lib/util.js';
import { CARS, carSVG } from '../data/car-art.js';

export function initTimeline(){
  const sec = $('.tl');
  if (!sec) return;
  const track = $('#tl-track');
  const view  = $('.tl__viewport', sec);
  const prog  = $('.tl__prog i', sec);
  const year  = $('.tl__year', sec);

  track.innerHTML = CARS.map(c => `
    <article class="tl__c" data-era="${c.era}">
      <div class="tl__yr">${c.year}</div>
      <div class="tl__nm">
        <h3>${c.name}</h3>
        <span class="mono muted">${c.chassis} · ${c.years}</span>
      </div>
      <div class="tl__art">${carSVG(c, { blueprint:true })}</div>
      <p class="tl__tag">${c.tag}</p>
      <div class="tl__specs">
        <span>${c.engine}</span>
        <span>${c.L} mm</span>
        <span>${c.stockHp} CV serie</span>
        <span class="hot">${c.tuneHp} CV aquí</span>
      </div>
    </article>`).join('');

  const reduce = reducedMotion();
  let maxX = 0;
  const measure = () => {
    if (reduce){ sec.style.height = 'auto'; return; }
    maxX = Math.max(track.scrollWidth - view.clientWidth, 0);
    // La altura de la sección se ajusta al recorrido horizontal
    const vh = window.innerHeight;
    sec.style.height = `${vh + maxX * 0.72}px`;
  };

  const update = () => {
    if (reduce) return;
    const r = sec.getBoundingClientRect();
    const total = sec.offsetHeight - window.innerHeight;
    const p = clamp(-r.top / Math.max(total, 1), 0, 1);
    track.style.transform = `translate3d(${-p * maxX}px,0,0)`;
    if (prog) prog.style.transform = `scaleX(${p})`;
    if (year){
      const idx = Math.min(Math.floor(p * CARS.length), CARS.length - 1);
      year.textContent = CARS[idx].year;
    }
  };

  if (reduce){
    view.style.overflowX = 'auto';
    view.style.scrollSnapType = 'x mandatory';
    sec.style.height = 'auto';
    const st = $('.tl__sticky', sec);
    st.style.position = 'static';
    st.style.height = 'auto';
    track.style.transform = 'none';
    return;
  }

  measure();
  addEventListener('resize', throttleRAF(() => { measure(); update(); }));
  addEventListener('scroll', throttleRAF(update), { passive:true });
  // Las fuentes cambian el ancho: vuelve a medir cuando terminen de cargar
  document.fonts?.ready.then(() => { measure(); update(); });
  update();
}
