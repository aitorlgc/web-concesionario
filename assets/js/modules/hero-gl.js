/* ==========================================================================
   FONDO WEBGL — "asfalto en plano" : rejilla en perspectiva, estelas M,
   calor de motor y grano. Shader propio, sin librerías.
   ========================================================================== */
import { reducedMotion, clamp } from '../lib/util.js';

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uScroll;
uniform float uRev;
uniform float uDay;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t  = uTime;
  float spd = 1.15 + uScroll * 2.4 + uRev * 6.0;
  vec3 col = vec3(0.0);

  float horizon = -0.055 + uMouse.y * 0.028 - uScroll * 0.05;
  float y = uv.y - horizon;

  /* ---------------- Suelo: rejilla de plano técnico ---------------- */
  if (y < -0.0015){
    float z = 1.0 / (-y);
    vec2 road = vec2(uv.x * z * 0.9 - uMouse.x * 0.5, z * 0.42 + t * spd);

    float gx = abs(fract(road.x) - 0.5);
    float gz = abs(fract(road.y) - 0.5);
    float lw = 0.016 + 0.0028 * z;
    float lines = smoothstep(lw, 0.0, gx) * 0.7 + smoothstep(lw * 1.4, 0.0, gz) * 0.85;

    float lane = smoothstep(0.013, 0.0, abs(abs(road.x) - 1.5));
    float centre = smoothstep(0.017, 0.0, abs(road.x)) * (0.5 + 0.5 * sin(road.y * 6.2831));

    float fog = exp(-z * 0.19);
    float tarmac = fbm(road * vec2(2.2, 0.9) + 3.0);

    col += vec3(0.06, 0.34, 0.70) * lines * fog * 0.85;
    col += vec3(1.0, 0.18, 0.07) * lane * fog * 0.42;
    col += vec3(1.0, 0.74, 0.0) * centre * fog * 0.20;
    col += vec3(0.035, 0.045, 0.06) * tarmac * exp(-z * 0.12);
    col += vec3(0.012, 0.02, 0.035) * fog;
  }

  /* ---------------- Cielo: bruma y estelas ---------------- */
  else {
    float h = clamp(y * 2.2, 0.0, 1.0);
    col += mix(vec3(0.03, 0.06, 0.11), vec3(0.006, 0.008, 0.014), h);

    /* Estelas horizontales en colores M */
    for (int i = 0; i < 3; i++){
      float fi = float(i);
      float sy = 0.055 + fi * 0.052;
      float ph = fract(t * (0.16 + fi * 0.06) + fi * 0.37);
      float x0 = -1.9 + ph * 3.8;
      float d  = abs(uv.y - horizon - sy) * 62.0;
      float seg = smoothstep(0.55, 0.0, abs(uv.x - x0) - 0.30);
      vec3 mc = i == 0 ? vec3(0.04, 0.37, 0.82)
              : i == 1 ? vec3(0.48, 0.18, 0.56)
                       : vec3(0.89, 0.13, 0.10);
      col += mc * exp(-d * d) * seg * 0.95;
    }

    /* Calor sobre la línea de horizonte */
    float haze = exp(-abs(y) * 22.0);
    col += vec3(0.07, 0.28, 0.60) * haze * (0.30 + 0.28 * fbm(vec2(uv.x * 4.0, t * 0.6)));
  }

  /* ---------------- Resplandor del horizonte ---------------- */
  float glow = exp(-abs(y) * 13.0) * 0.30;
  col += vec3(0.09, 0.34, 0.72) * glow;
  col += vec3(1.0, 0.24, 0.10) * exp(-abs(y) * 30.0) * uRev * 1.4;

  /* ---------------- Viñeta + grano ---------------- */
  float r = length(uv * vec2(0.72, 1.0));
  col *= smoothstep(1.35, 0.22, r);
  col += (hash(gl_FragCoord.xy + fract(t) * 91.7) - 0.5) * 0.035;

  /* Modo día: la misma escena impresa como tinta de color sobre papel */
  float m   = max(max(col.r, col.g), col.b);
  vec3  hue = m > 0.002 ? col / m : vec3(1.0);
  float ink = clamp(m * 1.9, 0.0, 1.0);
  vec3  paper = vec3(0.878, 0.872, 0.852);
  vec3  day = paper * mix(vec3(1.0), hue, ink) * (1.0 - ink * 0.42);
  col = mix(col, day, uDay);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src){
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)){
    console.warn('shader:', gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

export function initHeroGL(canvas){
  if (!canvas) return null;
  const fallback = () => { canvas.classList.add('is-fallback'); return null; };
  if (reducedMotion()) return fallback();

  const gl = canvas.getContext('webgl', { antialias:false, alpha:false, powerPreference:'low-power' })
          || canvas.getContext('experimental-webgl');
  if (!gl) return fallback();

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return fallback();

  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return fallback();
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = n => gl.getUniformLocation(prog, n);
  const uRes = U('uRes'), uTime = U('uTime'), uMouse = U('uMouse'),
        uScroll = U('uScroll'), uRev = U('uRev'), uDay = U('uDay');

  let mx = 0, my = 0, tmx = 0, tmy = 0;
  let scroll = 0, rev = 0, revTarget = 0, day = 0;
  let running = true, t0 = performance.now();

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h){
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  addEventListener('resize', resize);
  addEventListener('pointermove', e => {
    tmx = (e.clientX / innerWidth) * 2 - 1;
    tmy = (e.clientY / innerHeight) * 2 - 1;
  }, { passive:true });
  addEventListener('scroll', () => {
    scroll = clamp(window.scrollY / Math.max(innerHeight, 1), 0, 1.4);
  }, { passive:true });

  const io = new IntersectionObserver(en => { running = en[0].isIntersecting; },
    { threshold:0.01 });
  io.observe(canvas);

  document.addEventListener('hm:theme', e => { day = e.detail.theme === 'dia' ? 1 : 0; });
  if (document.documentElement.getAttribute('data-theme') === 'dia') day = 1;

  const api = { rev(v = 1){ revTarget = v; } };

  const frame = () => {
    requestAnimationFrame(frame);
    if (!running) return;
    resize();
    mx += (tmx - mx) * .06; my += (tmy - my) * .06;
    revTarget *= 0.955;
    rev += (revTarget - rev) * .16;
    const t = (performance.now() - t0) / 1000;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, mx, my);
    gl.uniform1f(uScroll, scroll);
    gl.uniform1f(uRev, rev);
    gl.uniform1f(uDay, day);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  resize();
  requestAnimationFrame(frame);
  return api;
}
