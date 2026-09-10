/* ==========================================================================
   SONIDO — motor de seis cilindros en línea sintetizado con WebAudio.
   Cero archivos de audio: todo son osciladores, ruido y filtros.
   ========================================================================== */
import { $, on, store } from '../lib/util.js';

let ctx = null, master = null, enabled = false, ready = false;

function ensure(){
  if (ready) return true;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.0;
  master.connect(ctx.destination);
  ready = true;
  return true;
}

/* Curva de saturación suave para dar cuerpo al escape */
function driveCurve(amount = 24){
  const n = 1024, curve = new Float32Array(n);
  for (let i = 0; i < n; i++){
    const x = (i * 2) / n - 1;
    curve[i] = ((3 + amount) * x * 20 * Math.PI / 180) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

function noiseBuffer(sec = 2){
  const len = Math.floor(ctx.sampleRate * sec);
  const b = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

/* --------------------------------------------------------------------------
   Aceleronazo: sube de ralentí a corte y baja
   -------------------------------------------------------------------------- */
export function rev({ peak = 7600, idle = 900, up = 0.85, down = 1.25, gain = 0.5 } = {}){
  if (!enabled || !ensure()) return;
  if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime;
  const total = up + down + 0.25;

  const bus = ctx.createGain();
  bus.gain.value = 0;
  const shaper = ctx.createWaveShaper();
  shaper.curve = driveCurve(40);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass'; lp.Q.value = 0.9;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass'; hp.frequency.value = 60;
  bus.connect(shaper); shaper.connect(lp); lp.connect(hp); hp.connect(master);

  // Frecuencia de encendido de un seis en línea: rpm/60 * 3
  const f0 = r => (r / 60) * 3;
  const oscs = [];
  const harm = [
    [1, 0.55], [2, 0.34], [3, 0.22], [4, 0.14], [5, 0.09], [6, 0.06], [8, 0.035]
  ];
  harm.forEach(([mult, amp], i) => {
    const o = ctx.createOscillator();
    o.type = i % 2 ? 'sawtooth' : 'square';
    const g = ctx.createGain();
    g.gain.value = amp;
    o.connect(g); g.connect(bus);
    o.frequency.setValueAtTime(f0(idle) * mult, t);
    o.frequency.exponentialRampToValueAtTime(f0(peak) * mult, t + up);
    o.frequency.exponentialRampToValueAtTime(f0(idle * 1.25) * mult, t + up + down);
    o.start(t); o.stop(t + total);
    oscs.push(o);
  });

  // Admisión / turbo: ruido filtrado que sigue las vueltas
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(total + 0.2);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass'; bp.Q.value = 1.6;
  bp.frequency.setValueAtTime(500, t);
  bp.frequency.exponentialRampToValueAtTime(2600, t + up);
  bp.frequency.exponentialRampToValueAtTime(600, t + up + down);
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.001, t);
  ng.gain.exponentialRampToValueAtTime(0.16, t + up);
  ng.gain.exponentialRampToValueAtTime(0.002, t + up + down);
  src.connect(bp); bp.connect(ng); ng.connect(master);
  src.start(t); src.stop(t + total);

  // Silbido de turbina
  const wh = ctx.createOscillator();
  wh.type = 'sine';
  const wg = ctx.createGain();
  wg.gain.setValueAtTime(0.0001, t);
  wg.gain.exponentialRampToValueAtTime(0.045, t + up * 0.92);
  wg.gain.exponentialRampToValueAtTime(0.0001, t + up + 0.35);
  wh.frequency.setValueAtTime(2200, t);
  wh.frequency.exponentialRampToValueAtTime(8200, t + up);
  wh.connect(wg); wg.connect(master);
  wh.start(t); wh.stop(t + up + 0.5);

  // Válvula de descarga al soltar
  const bov = ctx.createBufferSource();
  bov.buffer = noiseBuffer(0.5);
  const bf = ctx.createBiquadFilter();
  bf.type = 'bandpass'; bf.frequency.value = 3400; bf.Q.value = 0.7;
  const bg = ctx.createGain();
  bg.gain.setValueAtTime(0.0001, t + up);
  bg.gain.exponentialRampToValueAtTime(0.10, t + up + 0.03);
  bg.gain.exponentialRampToValueAtTime(0.0001, t + up + 0.42);
  bov.connect(bf); bf.connect(bg); bg.connect(master);
  bov.start(t + up); bov.stop(t + up + 0.5);

  // Filtro de escape que se abre con las vueltas
  lp.frequency.setValueAtTime(700, t);
  lp.frequency.exponentialRampToValueAtTime(5200, t + up);
  lp.frequency.exponentialRampToValueAtTime(800, t + up + down);

  bus.gain.setValueAtTime(0.0001, t);
  bus.gain.exponentialRampToValueAtTime(gain, t + 0.06);
  bus.gain.setValueAtTime(gain, t + up);
  bus.gain.exponentialRampToValueAtTime(0.0001, t + up + down);

  document.dispatchEvent(new CustomEvent('hm:rev', { detail:{ peak, up, down } }));
}

/* Clic seco de interfaz — relé de taller */
export function tick(freq = 1800, dur = 0.045, gain = 0.06){
  if (!enabled || !ensure()) return;
  if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'square'; o.frequency.value = freq;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master);
  o.start(t); o.stop(t + dur + 0.02);
}

export function isSoundOn(){ return enabled; }

export function initSound(){
  const btn = $('[data-sound-toggle]');
  enabled = store.get('hm-sound', false) === true;

  const paint = () => {
    if (!btn) return;
    btn.classList.toggle('is-on', enabled);
    btn.setAttribute('aria-pressed', String(enabled));
    btn.setAttribute('aria-label', enabled ? 'Silenciar el taller' : 'Activar el sonido del taller');
    const bars = btn.querySelectorAll('.eq i');
    bars.forEach(b => b.style.animationPlayState = enabled ? 'running' : 'paused');
  };
  paint();

  on(btn, 'click', () => {
    enabled = !enabled;
    store.set('hm-sound', enabled);
    paint();
    if (enabled){
      ensure();
      if (ctx?.state === 'suspended') ctx.resume();
      master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.05);
      rev({ peak:5200, up:0.5, down:0.8, gain:0.32 });
    } else if (ready){
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.06);
    }
  });

  // Clic sutil en elementos interactivos
  document.addEventListener('pointerdown', e => {
    if (!enabled) return;
    if (e.target.closest('button,.chip,a.btn,.opt__box,.acc__btn')) tick(2400, .03, .035);
  });
}
