/* ==========================================================================
   CONTACTO — ficha de entrada en cuatro pasos con validación propia
   ========================================================================== */
import { $, $$, on, store, eur, fmt } from '../lib/util.js';
import { CARS } from '../data/car-art.js';
import { FAQ, ETAPAS } from '../data/site.js';
import { toast } from '../modules/toast.js';
import { initAccordion } from '../modules/accordion.js';
import { rev } from '../modules/sound.js';

const KEY = 'hm-form';
const SERVICIOS_FORM = [
  { v:'Diagnóstico y banco', d:'Punto de partida obligatorio. 90 € descontables.' },
  { v:'Etapa 1', d:'Reprogramación sobre hardware de serie.' },
  { v:'Etapa 2', d:'Admisión, escape e intercooler más mapa propio.' },
  { v:'Etapa 3', d:'Turbo mayor, forjado y gestión al límite.' },
  { v:'Chasis y suspensión', d:'Roscadas, barras, refuerzos y báscula.' },
  { v:'Frenada', d:'Kits de pinza, discos y refrigeración.' },
  { v:'Carrocería y aero', d:'Ensanchados, fibra, alerones y pintura.' },
  { v:'Restomod clásico', d:'Restauración integral de E30, E9, 2002…' },
  { v:'Preparación de pista', d:'Jaula, seguridad y asistencia en track day.' },
  { v:'Otra cosa', d:'Cuéntanoslo en el campo de texto.' }
];

let step = 0;
const STEPS = 4;

export function initContacto(){
  const form = $('#bk-form');
  if (!form) return;

  /* --- Rellena selects y opciones ------------------------------------- */
  $('#f-modelo').innerHTML =
    '<option value="">Elige tu BMW</option>' +
    CARS.map(c => `<option value="${c.name} ${c.chassis}">${c.name} · ${c.chassis} · ${c.years}</option>`).join('') +
    '<option value="Otro BMW">Otro BMW (lo indico abajo)</option>';

  $('#bk-serv').innerHTML = SERVICIOS_FORM.map((s, i) => `
    <label class="opt">
      <input type="radio" name="servicio" value="${s.v}" ${i === 0 ? 'checked' : ''} required>
      <span class="opt__box"><span class="opt__dot"></span>
        <span><span class="opt__t">${s.v}</span><span class="opt__d">${s.d}</span></span>
      </span>
    </label>`).join('');

  const faq = $('#faq');
  if (faq){
    faq.innerHTML = FAQ.map((f, i) => `
      <div class="acc__item">
        <button class="acc__btn" aria-expanded="false" aria-controls="faq-p${i}" id="faq-b${i}">
          ${f.q}<span class="acc__ix" aria-hidden="true"></span>
        </button>
        <div class="acc__panel" id="faq-p${i}" role="region" aria-labelledby="faq-b${i}">
          <div class="acc__inner">${f.a}</div>
        </div>
      </div>`).join('');
    initAccordion(faq.parentElement);
  }

  /* --- Fecha mínima: mañana ------------------------------------------- */
  const fecha = $('#f-fecha');
  const t = new Date(); t.setDate(t.getDate() + 1);
  fecha.min = t.toISOString().slice(0, 10);
  fecha.value = t.toISOString().slice(0, 10);

  /* --- Presupuesto ----------------------------------------------------- */
  const presu = $('#f-presu');
  const presuVal = $('#f-presu-val');
  const paintPresu = () => { presuVal.textContent = eur(+presu.value); };
  on(presu, 'input', paintPresu); paintPresu();

  /* --- Recupera borrador y configuración ------------------------------- */
  restore(form);
  prefillFromConfig(form);
  on(form, 'input', () => saveDraft(form));
  on(form, 'change', () => saveDraft(form));

  /* --- Navegación ------------------------------------------------------ */
  on($('#bk-next'), 'click', () => {
    if (!validate(form, step)) return;
    if (step < STEPS - 1){ go(step + 1); }
    else submit(form);
  });
  on($('#bk-prev'), 'click', () => go(step - 1));
  on(form, 'keydown', e => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA'){ e.preventDefault(); $('#bk-next').click(); }
  });
  on($('#bk-again'), 'click', () => {
    $('#bk-done').hidden = true;
    form.hidden = false;
    $('#bk-steps').hidden = false;
    go(0);
  });

  go(0);
}

/* -------------------------------------------------------------------------- */
function go(n){
  step = Math.max(0, Math.min(n, STEPS - 1));
  $$('.bk__step').forEach(f => f.classList.toggle('is-active', +f.dataset.step === step));
  $$('.steps__i').forEach((s, i) => {
    s.classList.toggle('is-active', i === step);
    s.classList.toggle('is-done', i < step);
  });
  $('#bk-prev').disabled = step === 0;
  const next = $('#bk-next');
  next.firstChild.textContent = step === STEPS - 1 ? 'Enviar la ficha ' : 'Siguiente ';
  if (step === STEPS - 1) resume();
  const box = $('.bk');
  const y = box.getBoundingClientRect().top + window.scrollY - 110;
  if (window.scrollY > y + 200 || window.scrollY < y - 400) window.scrollTo({ top:y, behavior:'smooth' });
}

/* -------------------------------------------------------------------------- */
function validate(form, n){
  const fs = form.querySelector(`.bk__step[data-step="${n}"]`);
  let ok = true;
  $$('[data-err]', fs).forEach(e => { e.textContent = ''; });
  $$('.field', fs).forEach(f => f.classList.remove('has-error'));

  const fail = (name, msg) => {
    ok = false;
    const e = fs.querySelector(`[data-err="${name}"]`);
    if (e) e.textContent = msg;
    const input = fs.querySelector(`[name="${name}"]`);
    input?.closest('.field')?.classList.add('has-error');
    if (ok === false && !fs.dataset.focused){ input?.focus(); fs.dataset.focused = '1'; setTimeout(() => delete fs.dataset.focused, 100); }
  };

  const val = n2 => (fs.querySelector(`[name="${n2}"]`)?.value || '').trim();

  if (n === 0){
    if (!val('modelo')) fail('modelo', 'Dinos qué coche es');
    const a = +val('anio');
    if (!a || a < 1960 || a > 2026) fail('anio', 'Año entre 1960 y 2026');
    const km = val('km');
    if (km === '' || +km < 0 || +km > 900000) fail('km', 'Kilómetros no válidos');
    if (!val('estado')) fail('estado', 'Elige el estado del coche');
  }
  if (n === 1){
    if (!fs.querySelector('[name="servicio"]:checked')) fail('servicio', 'Elige un servicio');
  }
  if (n === 2){
    const f = val('fecha');
    if (!f) fail('fecha', 'Elige un día');
    else {
      const d = new Date(f + 'T12:00:00');
      if (isNaN(d)) fail('fecha', 'Fecha no válida');
      else if (d < new Date(Date.now() - 864e5)) fail('fecha', 'Tiene que ser una fecha futura');
      else if (d.getDay() === 0) fail('fecha', 'Los domingos cerramos');
    }
  }
  if (n === 3){
    if (val('nombre').length < 2) fail('nombre', 'Escribe tu nombre');
    if (!/^[+\d][\d\s().-]{7,}$/.test(val('telefono'))) fail('telefono', 'Teléfono no válido');
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(val('email'))) fail('email', 'Correo no válido');
    if (!fs.querySelector('[name="consent"]').checked){
      const e = fs.querySelector('[data-err="consent"]');
      if (e) e.textContent = 'Necesitamos tu permiso para responderte';
      ok = false;
    }
  }
  if (!ok) toast('Revisa los campos marcados');
  return ok;
}

/* -------------------------------------------------------------------------- */
function data(form){
  const fd = new FormData(form);
  const o = {};
  for (const [k, v] of fd.entries()) o[k] = v;
  return o;
}

function resume(){
  const d = data($('#bk-form'));
  const cfg = store.get('hm-cita');
  $('#bk-resume').innerHTML = `
    <h3 class="mono bk__rh">Resumen</h3>
    <table class="spec">
      <tbody>
        <tr><th>Coche</th><td>${d.modelo || '—'} · ${d.anio || '—'} · ${d.km ? fmt(+d.km) + ' km' : '—'}</td></tr>
        <tr><th>Estado</th><td>${d.estado || '—'}</td></tr>
        <tr><th>Servicio</th><td>${d.servicio || '—'}</td></tr>
        <tr><th>Presupuesto</th><td>${eur(+(d.presupuesto || 0))}</td></tr>
        <tr><th>Cita</th><td>${fechaLarga(d.fecha)} · ${(d.franja || '').split('·')[0].trim()}</td></tr>
        <tr><th>Entrega</th><td>${d.entrega || '—'}</td></tr>
        ${cfg ? `<tr><th>Del configurador</th><td>${cfg.coche} · ${cfg.etapa} · ${cfg.cv} CV · ${eur(cfg.total)}</td></tr>` : ''}
      </tbody>
    </table>`;
}

function fechaLarga(v){
  if (!v) return '—';
  const d = new Date(v + 'T12:00:00');
  return isNaN(d) ? v : d.toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}

/* -------------------------------------------------------------------------- */
function submit(form){
  const d = data(form);
  const ref = 'HM-' + new Date().getFullYear() + '-' +
    String(Math.floor(Math.random() * 9000) + 1000);
  const cfg = store.get('hm-cita');
  store.set('hm-citas', [...(store.get('hm-citas') || []), { ref, fecha:Date.now(), ...d, config:cfg }]);
  store.del(KEY);

  form.hidden = true;
  $('#bk-steps').hidden = true;
  const done = $('#bk-done');
  done.hidden = false;
  $('#bk-ref').textContent = ref;
  $('#bk-doneTxt').textContent =
    `Gracias, ${d.nombre.split(' ')[0]}. Te llamamos al ${d.telefono} antes de 24 horas laborables para confirmar el ${fechaLarga(d.fecha)}.`;
  toast('Ficha registrada · ' + ref, 'ok');
  rev({ peak:7200, up:.7, down:1.2, gain:.35 });
  done.scrollIntoView({ behavior:'smooth', block:'center' });
}

/* -------------------------------------------------------------------------- */
function saveDraft(form){
  store.set(KEY, data(form));
  const s = $('#bk-save');
  if (s){
    s.textContent = 'Borrador guardado';
    clearTimeout(saveDraft._t);
    saveDraft._t = setTimeout(() => { s.textContent = ''; }, 2200);
  }
}

function restore(form){
  const d = store.get(KEY);
  if (!d) return;
  Object.entries(d).forEach(([k, v]) => {
    const el = form.elements[k];
    if (!el) return;
    if (el instanceof RadioNodeList || el.length !== undefined && el.value === undefined){
      Array.from(el).forEach(i => { if (i.value === v) i.checked = true; });
    } else if (el.type === 'checkbox'){ el.checked = !!v; }
    else el.value = v;
  });
}

function prefillFromConfig(form){
  const cfg = store.get('hm-cita');
  if (!cfg) return;
  const sel = form.elements['modelo'];
  const match = Array.from(sel.options).find(o => o.value && cfg.coche.startsWith(o.value));
  if (match) sel.value = match.value;
  const et = ETAPAS.find(e => e.nombre === cfg.etapa);
  if (et){
    const r = form.querySelector(`[name="servicio"][value="${et.nombre}"]`);
    if (r) r.checked = true;
  }
  const p = form.elements['presupuesto'];
  if (p){ p.value = Math.min(Math.max(Math.round(cfg.total / 500) * 500, 500), 60000); p.dispatchEvent(new Event('input', { bubbles:true })); }
  const notas = form.elements['notas'];
  if (notas && !notas.value){
    notas.value = `Vengo del configurador: ${cfg.coche}, ${cfg.color}, ${cfg.etapa}` +
      (cfg.extras.length ? ` con ${cfg.extras.join(', ').toLowerCase()}` : '') +
      `. Objetivo aproximado: ${cfg.cv} CV y ${cfg.nm} Nm.`;
  }
  const box = $('.bk__save');
  if (box) box.textContent = 'Configuración cargada';
  toast('Hemos rellenado la ficha con tu configuración', 'ok');
}
