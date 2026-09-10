/* ==========================================================================
   EL GARAJE — rejilla filtrable y ficha de proyecto
   ========================================================================== */
import { $, $$, on, fmt, lockScroll, trapFocus, clamp } from '../lib/util.js';
import { CARS_BY_ID, carSVG } from '../data/car-art.js';
import { PROYECTOS, CATEGORIAS } from '../data/projects.js';
import { Dyno, buildCurve } from '../modules/dyno.js';
import { initReveal } from '../modules/reveal.js';
import { rev } from '../modules/sound.js';

let current = 0;
let untrap = null;
let dyno = null;

/* Variante "de serie": más altura, sin aero, color apagado */
function stockSpec(car){
  return { ...car,
    sillH: car.sillH + 26,
    archF: car.archF + 46,
    archR: car.archR + 50,
    aero: {},
    stripes: 'none',
    rimD: car.rimD * 0.93
  };
}

export function initGaraje(){
  const grid = $('#gr-grid');
  const chips = $('#gr-filters');
  const count = $('#gr-count');
  if (!grid) return;

  chips.innerHTML = CATEGORIAS.map((c, i) => {
    const n = c.id === 'todo' ? PROYECTOS.length : PROYECTOS.filter(p => p.cats.includes(c.id)).length;
    return `<button class="chip" data-cat="${c.id}" aria-pressed="${i === 0}">${c.n}<span class="chip__count">${n}</span></button>`;
  }).join('');

  const card = (p, i) => {
    const car = CARS_BY_ID[p.car];
    return `
    <article class="pj" data-id="${p.id}" data-cats="${p.cats.join(' ')}" data-reveal data-rd="${(i % 3) * 90}">
      <button class="pj__hit" aria-label="Abrir la ficha de ${p.titulo}" data-cursor="Abrir ficha"></button>
      <div class="pj__art">
        <span class="pj__ref mono">${p.ref}</span>
        <span class="pj__yr mono">${p.anio}</span>
        ${carSVG(car, p.livery)}
      </div>
      <div class="pj__body">
        <div class="pj__head">
          <h2 class="pj__t">${p.titulo}</h2>
          <span class="pj__cats">${p.cats.map(c => `<i class="badge">${CATEGORIAS.find(x => x.id === c)?.n || c}</i>`).join('')}</span>
        </div>
        <p class="pj__s mono">${p.sub}</p>
        <p class="pj__d">${p.resumen}</p>
        <dl class="pj__num">
          <div><dt>Potencia</dt><dd>${p.despues.cv}<span class="up">+${p.despues.cv - p.antes.cv}</span></dd></div>
          <div><dt>Par</dt><dd>${p.despues.nm}<span class="up">+${p.despues.nm - p.antes.nm}</span></dd></div>
          <div><dt>Peso</dt><dd>${p.despues.kg}<span class="up">−${p.antes.kg - p.despues.kg}</span></dd></div>
          <div><dt>Taller</dt><dd>${p.meses}<span class="mono muted">meses</span></dd></div>
        </dl>
      </div>
    </article>`;
  };

  grid.innerHTML = PROYECTOS.map(card).join('');
  count.textContent = `${PROYECTOS.length} proyectos`;

  /* --- Filtro ---------------------------------------------------------- */
  on(chips, 'click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    $$('.chip', chips).forEach(c => c.setAttribute('aria-pressed', String(c === b)));
    const cat = b.dataset.cat;
    let visible = 0;
    $$('.pj', grid).forEach(el => {
      const ok = cat === 'todo' || el.dataset.cats.split(' ').includes(cat);
      el.classList.toggle('is-out', !ok);
      if (ok) visible++;
    });
    count.textContent = `${visible} ${visible === 1 ? 'proyecto' : 'proyectos'}`;
    $('#gr-empty').classList.toggle('hide', visible > 0);
  });

  /* --- Ficha ----------------------------------------------------------- */
  on(grid, 'click', e => {
    const el = e.target.closest('.pj');
    if (!el) return;
    open(PROYECTOS.findIndex(p => p.id === el.dataset.id));
  });

  const modal = $('#pj-modal');
  $$('[data-close]', modal).forEach(b => on(b, 'click', close));
  on(document, 'keydown', e => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') open((current + 1) % PROYECTOS.length);
    if (e.key === 'ArrowLeft') open((current - 1 + PROYECTOS.length) % PROYECTOS.length);
  });

  // Abre directamente si la URL trae un ancla
  const hash = location.hash.slice(1);
  const idx = PROYECTOS.findIndex(p => p.id === hash);
  if (idx >= 0) setTimeout(() => open(idx), 700);

  initReveal(grid);
}

/* -------------------------------------------------------------------------- */
function open(i){
  current = i;
  const p = PROYECTOS[i];
  const car = CARS_BY_ID[p.car];
  const modal = $('#pj-modal');
  const body = $('#pj-body');
  const turbo = /turbo/i.test(car.engine);
  const rpmMax = turbo ? 7200 : 8200;

  const delta = (a, b, unit = '', inv = false) => {
    const d = b - a;
    const good = inv ? d < 0 : d > 0;
    return `<span class="${good ? 'up' : 'dn'}">${d > 0 ? '+' : '−'}${fmt(Math.abs(d))}${unit}</span>`;
  };

  body.innerHTML = `
    <header class="pjf__head">
      <div class="pjf__headL">
        <p class="mono muted">${p.ref} · ${p.anio} · ${p.meses} meses de taller</p>
        <h2 class="display display--h2 pjf__t" id="pj-title">${p.titulo}</h2>
        <p class="mono pjf__s">${p.sub}</p>
      </div>
      <div class="pjf__nav">
        <button class="iconbtn" data-nav="-1" aria-label="Proyecto anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>
        </button>
        <span class="mono muted">${String(i + 1).padStart(2, '0')} / ${String(PROYECTOS.length).padStart(2, '0')}</span>
        <button class="iconbtn" data-nav="1" aria-label="Proyecto siguiente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>
    </header>

    <div class="compare pjf__compare" id="pj-compare" style="--split:52%">
      <div class="compare__layer">${carSVG(stockSpec(car), { body:'#6E747C', glass:'#1A1F27' })}</div>
      <div class="compare__layer compare__layer--after">${carSVG(car, p.livery)}</div>
      <span class="compare__tag compare__tag--l">Como llegó</span>
      <span class="compare__tag compare__tag--r">Como salió</span>
      <span class="compare__handle"><span class="compare__grip">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l-4 6 4 6M15 6l4 6-4 6"/></svg>
      </span></span>
    </div>

    <div class="pjf__grid">
      <div class="pjf__col">
        <p class="pjf__lead">${p.resumen}</p>
        <blockquote class="pjf__q">${p.quote}</blockquote>
        <h3 class="mono pjf__h">Lo que se tocó</h3>
        <ul class="pjf__work">${p.trabajo.map(t => `<li>${t}</li>`).join('')}</ul>
      </div>
      <div class="pjf__col">
        <h3 class="mono pjf__h">Antes y después</h3>
        <table class="spec">
          <tbody>
            <tr><th>Potencia</th><td>${p.antes.cv} → <b>${p.despues.cv} CV</b> ${delta(p.antes.cv, p.despues.cv)}</td></tr>
            <tr><th>Par máximo</th><td>${p.antes.nm} → <b>${p.despues.nm} Nm</b> ${delta(p.antes.nm, p.despues.nm)}</td></tr>
            <tr><th>Peso</th><td>${p.antes.kg} → <b>${p.despues.kg} kg</b> ${delta(p.antes.kg, p.despues.kg, '', true)}</td></tr>
            <tr><th>0–100 km/h</th><td>${p.antes.s100.toFixed(1)} → <b>${p.despues.s100.toFixed(1)} s</b></td></tr>
            <tr><th>Relación peso/potencia</th><td>${(p.antes.kg / p.antes.cv).toFixed(2)} → <b>${(p.despues.kg / p.despues.cv).toFixed(2)} kg/CV</b></td></tr>
            <tr><th>Motor</th><td>${car.engine}</td></tr>
            <tr><th>Chasis</th><td>${car.chassis} · ${car.years}</td></tr>
            <tr><th>Batalla</th><td>${fmt(car.WB)} mm</td></tr>
          </tbody>
        </table>
        <h3 class="mono pjf__h">Curva de banco</h3>
        <div class="pjf__chart"><canvas id="pj-canvas" aria-label="Curvas antes y después"></canvas></div>
        <div class="banco__legend">
          <span><i class="lg lg--dash"></i> Como llegó</span>
          <span><i class="lg lg--hot"></i> CV</span>
          <span><i class="lg lg--data"></i> Nm</span>
        </div>
      </div>
    </div>`;

  $$('[data-nav]', body).forEach(b => on(b, 'click', () => {
    open((current + +b.dataset.nav + PROYECTOS.length) % PROYECTOS.length);
  }));

  if (!modal.classList.contains('is-open')){
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lockScroll(true);
    untrap = trapFocus(modal);
  }
  modal.querySelector('.modal__box').scrollTop = 0;
  history.replaceState(null, '', '#' + p.id);

  compare($('#pj-compare'));

  const cv = $('#pj-canvas');
  dyno = new Dyno(cv);
  const stock = buildCurve({ hp:p.antes.cv, nm:p.antes.nm, rpmMax, turbo });
  const tuned = buildCurve({ hp:p.despues.cv, nm:p.despues.nm, rpmMax:rpmMax + 200, turbo });
  requestAnimationFrame(() => { dyno.resize(); dyno.setData(stock, tuned).animate(); });
  rev({ peak:6800, up:.6, down:1, gain:.3 });
}

function close(){
  const modal = $('#pj-modal');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  lockScroll(false);
  untrap?.(); untrap = null;
  history.replaceState(null, '', location.pathname);
}

/* -------------------------------------------------------------------------- */
function compare(el){
  if (!el) return;
  let dragging = false;
  const set = x => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--split', `${clamp(((x - r.left) / r.width) * 100, 2, 98)}%`);
  };
  on(el, 'pointerdown', e => { dragging = true; el.setPointerCapture(e.pointerId); set(e.clientX); });
  on(el, 'pointermove', e => { if (dragging) set(e.clientX); });
  on(el, 'pointerup',   () => { dragging = false; });
  on(el, 'pointercancel', () => { dragging = false; });
  on(el, 'keydown', e => {
    const cur = parseFloat(el.style.getPropertyValue('--split')) || 50;
    if (e.key === 'ArrowLeft')  el.style.setProperty('--split', `${clamp(cur - 4, 2, 98)}%`);
    if (e.key === 'ArrowRight') el.style.setProperty('--split', `${clamp(cur + 4, 2, 98)}%`);
  });
  el.tabIndex = 0;
  el.setAttribute('role', 'slider');
  el.setAttribute('aria-label', 'Comparar el coche antes y después');
}
