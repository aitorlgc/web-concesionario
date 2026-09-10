/* ==========================================================================
   CONFIGURADOR — el coche, la curva, las prestaciones y el presupuesto
   se recalculan a cada cambio.
   ========================================================================== */
import { $, $$, on, fmt, eur, store, clamp } from '../lib/util.js';
import { CARS, CARS_BY_ID, carSVG } from '../data/car-art.js';
import { ETAPAS, EXTRAS, COLORES } from '../data/site.js';
import { Dyno, buildCurve } from '../modules/dyno.js';
import { cero100, vmax, pesoPotencia } from '../modules/perf.js';
import { rev } from '../modules/sound.js';
import { toast } from '../modules/toast.js';

const KEY = 'hm-config';
const DEF = { car:'m4-f82', color:'schwarz', stage:'stage1', extras:[], blueprint:false };

let cfg = { ...DEF, ...(store.get(KEY) || {}) };
let dyno = null;

/* -------------------------------------------------------------------------- */
/* Traduce la configuración en una especificación de dibujo                    */
function spec(){
  const car = CARS_BY_ID[cfg.car] || CARS[0];
  const has = id => cfg.extras.includes(id);
  const s = { ...car, aero:{ ...(car.aero || {}) } };

  if (has('susp')){ s.sillH = Math.max(car.sillH - 38, 120); s.archF = Math.max(car.archF - 12, 14); s.archR = Math.max(car.archR - 14, 14); }
  if (has('wide')){ s.archF += 30; s.archR += 34; s.boxArch = true; }
  if (has('aero')){ s.aero.splitter = 1; s.aero.skirt = 1; s.aero.diffuser = 1; s.aero.wing = car.era === 'clasico' ? 'batwing' : 'gt'; }
  if (has('llantas')){ s.rimD = Math.min(car.rimD + .05, .86); s.rim = car.era === 'clasico' ? 'mesh' : 'star'; s.spokes = car.era === 'clasico' ? 20 : 10; }
  if (has('escape')) s.aero.diffuser = 1;
  if (cfg.stage === 'stage3') s.aero.ducktail = 1;
  s.stripes = 'none';
  return s;
}

/* Cálculo de cifras */
function calc(){
  const car = CARS_BY_ID[cfg.car] || CARS[0];
  const et = ETAPAS.find(e => e.id === cfg.stage) || ETAPAS[0];
  const turbo = /turbo/i.test(car.engine);
  const sel = EXTRAS.filter(e => cfg.extras.includes(e.id));

  const hpBonus = sel.reduce((a, e) => a + (e.hp || 0), 0);
  const gain = et.gainPct * (turbo ? 1 : .62);
  const tqGain = et.torquePct * (turbo ? 1 : .58);

  const cv = Math.round(car.stockHp * (1 + gain) * (1 + hpBonus));
  const nm = Math.round(car.torque * (1 + tqGain) * (1 + hpBonus * .7));
  const kg = car.kg + sel.reduce((a, e) => a + (e.kg || 0), 0);
  const grip = clamp(sel.reduce((a, e) => a + (e.grip || 0), 0), 0, .18);
  const cda = car.cda + sel.reduce((a, e) => a + (e.drag || 0), 0);
  const clasico = car.era === 'clasico';

  // Mano de obra: un clásico da más trabajo por cada euro de pieza
  const factor = clasico ? 1.28 : 1;
  const base = Math.round(et.precio * factor);
  const extrasEur = sel.reduce((a, e) => a + Math.round(e.p * factor), 0);
  const dias = et.dias + sel.reduce((a, e) => a + (e.dias || 0), 0);

  const rpmMax = turbo ? 7200 : (car.stockHp > 400 ? 8400 : 7800);
  return {
    car, et, turbo, sel, cv, nm, kg, grip, cda, clasico, base, extrasEur, dias, rpmMax,
    total: base + extrasEur,
    s100: cero100(kg, cv, { grip, clasico }),
    s100Base: cero100(car.kg, car.stockHp, { clasico }),
    vmax: vmax(cv, cda),
    ratio: pesoPotencia(kg, cv),
    stock: buildCurve({ hp:car.stockHp, nm:car.torque, rpmMax, turbo }),
    tuned: buildCurve({ hp:cv, nm, rpmMax:rpmMax + (turbo ? 200 : 300), turbo })
  };
}

/* -------------------------------------------------------------------------- */
export function initConfigurador(){
  buildCars(); buildColors(); buildStages(); buildExtras();
  dyno = new Dyno($('#cfg-canvas'));

  on($('#cfg-blueprint'), 'click', e => {
    cfg.blueprint = !cfg.blueprint;
    e.currentTarget.setAttribute('aria-pressed', String(cfg.blueprint));
    e.currentTarget.classList.toggle('is-on', cfg.blueprint);
    paint();
  });
  on($('#cfg-clear'), 'click', () => { cfg.extras = []; syncInputs(); paint(); });
  on($('#cfg-reset'), 'click', () => {
    cfg = { ...DEF, extras:[] };
    syncInputs(); paint();
    toast('Configuración reiniciada');
  });
  on($('#cfg-copy'), 'click', copiar);
  const runBtn = $('#cfg-run');
  on(runBtn, 'click', async () => {
    if (dyno.running) return;
    const r = calc();
    runBtn.disabled = true;
    rev({ peak:r.rpmMax, idle:1100, up:3.6, down:1.3, gain:.4 });
    const art = $('#cfg-car .carsvg');
    art?.classList.add('is-rolling');
    await dyno.run(3600, (pt, t) => {
      if (art) art.style.setProperty('--spin', `${(0.9 - t * 0.74).toFixed(3)}s`);
    });
    setTimeout(() => art?.classList.remove('is-rolling'), 900);
    runBtn.disabled = false;
  });
  on($('#cfg-send'), 'click', () => {
    store.set('hm-cita', resumen());
    toast('Configuración guardada — abriendo el formulario de cita', 'ok');
    setTimeout(() => { location.href = 'contacto.html#reserva'; }, 700);
  });

  syncInputs();
  paint(true);
}

/* -------------------------------------------------------------------------- */
function buildCars(){
  const el = $('#cfg-cars');
  el.innerHTML = CARS.map(c => `
    <label class="cfgcar">
      <input type="radio" name="cfg-car" value="${c.id}">
      <span class="cfgcar__b">
        <span class="cfgcar__n">${c.name}</span>
        <span class="cfgcar__c mono">${c.chassis} · ${c.year}</span>
        <span class="cfgcar__p mono">${c.stockHp} CV</span>
      </span>
    </label>`).join('');
  on(el, 'change', e => { cfg.car = e.target.value; paint(); rev({ peak:6000, up:.5, down:.8, gain:.28 }); });
}

function buildColors(){
  const el = $('#cfg-colors');
  el.innerHTML = COLORES.map(c => `
    <label class="sw" title="${c.n}">
      <input type="radio" name="cfg-color" value="${c.id}">
      <span class="sw__b" style="--sw:${c.c}"><span class="sr-only">${c.n}</span></span>
    </label>`).join('');
  on(el, 'change', e => { cfg.color = e.target.value; paint(); });
}

function buildStages(){
  const el = $('#cfg-stages');
  el.innerHTML = ETAPAS.map(e => `
    <label class="opt">
      <input type="radio" name="cfg-stage" value="${e.id}">
      <span class="opt__box">
        <span class="opt__dot" aria-hidden="true"></span>
        <span>
          <span class="opt__t">${e.nombre} · ${e.code}</span>
          <span class="opt__d">${e.resumen}</span>
        </span>
        <span class="opt__price">${eur(e.precio)}</span>
      </span>
    </label>`).join('');
  on(el, 'change', ev => { cfg.stage = ev.target.value; paint(); rev({ peak:5800 + ETAPAS.findIndex(x => x.id === cfg.stage) * 900, up:.6, down:1, gain:.3 }); });
}

function buildExtras(){
  const el = $('#cfg-extras');
  el.innerHTML = EXTRAS.map(e => `
    <label class="opt">
      <input type="checkbox" name="cfg-extra" value="${e.id}">
      <span class="opt__box">
        <span class="opt__dot opt__dot--sq" aria-hidden="true"></span>
        <span>
          <span class="opt__t">${e.n}</span>
          <span class="opt__d">${e.d}</span>
        </span>
        <span class="opt__price">${eur(e.p)}</span>
      </span>
    </label>`).join('');
  on(el, 'change', ev => {
    const v = ev.target.value;
    cfg.extras = ev.target.checked ? [...new Set([...cfg.extras, v])] : cfg.extras.filter(x => x !== v);
    paint();
  });
}

function syncInputs(){
  $$('input[name="cfg-car"]').forEach(i => i.checked = i.value === cfg.car);
  $$('input[name="cfg-color"]').forEach(i => i.checked = i.value === cfg.color);
  $$('input[name="cfg-stage"]').forEach(i => i.checked = i.value === cfg.stage);
  $$('input[name="cfg-extra"]').forEach(i => i.checked = cfg.extras.includes(i.value));
  const bp = $('#cfg-blueprint');
  bp.setAttribute('aria-pressed', String(cfg.blueprint));
  bp.classList.toggle('is-on', cfg.blueprint);
}

/* -------------------------------------------------------------------------- */
function paint(first = false){
  store.set(KEY, cfg);
  const r = calc();
  const col = COLORES.find(c => c.id === cfg.color) || COLORES[0];

  $('#cfg-name').textContent = `${r.car.name} ${r.car.chassis} · ${col.n} · ${r.et.nombre}`;
  $('#cfg-car').innerHTML = carSVG(spec(), { blueprint:cfg.blueprint, body:col.c, glass:'#121820' });

  const up = (a, b) => `<span class="up">+${Math.round(((b - a) / a) * 100)}%</span>`;
  $('#cfg-figs').innerHTML = `
    <div><dt>Potencia</dt><dd>${fmt(r.tuned.peakP.v)}<i>CV</i>${up(r.car.stockHp, r.cv)}</dd></div>
    <div><dt>Par</dt><dd>${fmt(r.tuned.peakT.v)}<i>Nm</i>${up(r.car.torque, r.nm)}</dd></div>
    <div><dt>0–100 km/h</dt><dd>${r.s100.toFixed(1)}<i>s</i><span class="up">−${(r.s100Base - r.s100).toFixed(1)}s</span></dd></div>
    <div><dt>Vmax teórica</dt><dd>${fmt(r.vmax)}<i>km/h</i></dd></div>
    <div><dt>Peso</dt><dd>${fmt(r.kg)}<i>kg</i>${r.kg !== r.car.kg ? `<span class="${r.kg < r.car.kg ? 'up' : 'dn'}">${r.kg < r.car.kg ? '−' : '+'}${Math.abs(r.kg - r.car.kg)}</span>` : ''}</dd></div>
    <div><dt>Peso / potencia</dt><dd>${r.ratio.toFixed(2)}<i>kg/CV</i></dd></div>`;

  dyno.setData(r.stock, r.tuned);
  first ? requestAnimationFrame(() => { dyno.resize(); dyno.animate(); }) : dyno.draw();

  const rows = [
    [`${r.et.nombre} · ${r.et.code}`, r.base],
    ...r.sel.map(e => [e.n, Math.round(e.p * (r.clasico ? 1.28 : 1))])
  ];
  $('#cfg-bill').innerHTML = `<tbody>${rows.map(([n, p]) =>
    `<tr><th>${n}</th><td>${eur(p)}</td></tr>`).join('')}
    ${r.clasico ? '<tr class="bill__note"><th>Recargo de mano de obra en clásico</th><td>incluido · +28 %</td></tr>' : ''}
    </tbody>`;
  $('#cfg-total').textContent = eur(r.total);
  $('#cfg-days').textContent = `${r.dias} ${r.dias === 1 ? 'día' : 'días'}`;
}

/* -------------------------------------------------------------------------- */
function resumen(){
  const r = calc();
  const col = COLORES.find(c => c.id === cfg.color) || COLORES[0];
  return {
    coche:`${r.car.name} ${r.car.chassis} (${r.car.years})`,
    color:col.n,
    etapa:r.et.nombre,
    extras:r.sel.map(e => e.n),
    cv:Math.round(r.tuned.peakP.v),
    nm:Math.round(r.tuned.peakT.v),
    s100:+r.s100.toFixed(1),
    vmax:Math.round(r.vmax),
    kg:r.kg,
    total:r.total,
    dias:r.dias
  };
}

function copiar(){
  const s = resumen();
  const txt = [
    'HOFMEISTER · Configuración',
    '─────────────────────────',
    `Coche:   ${s.coche}`,
    `Color:   ${s.color}`,
    `Etapa:   ${s.etapa}`,
    `Extras:  ${s.extras.length ? s.extras.join(', ') : 'ninguno'}`,
    '',
    `Potencia:      ${s.cv} CV`,
    `Par:           ${s.nm} Nm`,
    `0–100 km/h:    ${s.s100} s`,
    `Vmax teórica:  ${s.vmax} km/h`,
    `Peso:          ${s.kg} kg`,
    '',
    `Presupuesto estimado: ${eur(s.total)}`,
    `Tiempo de taller:     ${s.dias} días`,
    '',
    'Estimación orientativa. La cifra definitiva sale del banco.'
  ].join('\n');
  navigator.clipboard?.writeText(txt)
    .then(() => toast('Resumen copiado al portapapeles', 'ok'))
    .catch(() => toast('No se pudo copiar; selecciona el texto a mano'));
}
