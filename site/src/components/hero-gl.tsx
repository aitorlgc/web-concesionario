"use client";

import { useEffect, useRef } from "react";

/* Fondo de la portada: un plató oscuro con barridos de luz que pasan
   como reflejos sobre la chapa. Sigue al ratón con retardo, se pausa
   fuera de pantalla y se queda quieto con "reducir movimiento". */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform float hz;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;
  vec3 carbon=vec3(.055,.055,.063);
  vec3 green=vec3(.082,.224,.184);
  vec3 champ=vec3(.847,.765,.627);
  vec3 orange=vec3(1.,.42,.1);
  vec3 col=carbon;

  // Foco principal: verde profundo, se desplaza con el ratón
  vec2 lp=vec2(-.35+m.x*.25,hz+.55+m.y*.12);
  float d=length((uv-lp)*vec2(.7,1.));
  col+=green*1.05*exp(-d*d*2.6);

  // Foco cálido de estudio detrás del coche: lo recorta contra el fondo
  vec2 sp=uv-vec2(.17*r.x/r.y,hz+.14);
  col+=champ*.3*exp(-dot(sp*vec2(1.1,2.4),sp*vec2(1.1,2.4))*3.);

  // Barridos de luz diagonales, lentos
  for(int i=0;i<3;i++){
    float fi=float(i);
    float a=.55+fi*.18;
    float x=uv.x*cos(a)+uv.y*sin(a);
    float pos=mod(t*(.035+fi*.012)+fi*.9,3.2)-1.6;
    float band=exp(-pow((x-pos)*(5.+fi*5.),2.));
    col+=champ*band*(.05+.02*fi)*smoothstep(-.6,.3,uv.y);
  }

  // Suelo: horizonte con un filo naranja muy fino y reflejo difuso
  float floorMask=smoothstep(hz+.01,hz-.02,uv.y);
  col=mix(col,carbon*.8+green*.35*exp(-pow(uv.x-lp.x,2.)*1.5)*exp(-(hz-uv.y)*5.),floorMask);
  col+=orange*.35*exp(-pow((uv.y-hz)*260.,2.))*exp(-pow(uv.x*1.1,2.));

  // Viñeta y grano para evitar bandas
  col*=1.-.55*pow(length(uv*vec2(.8,1.1)),2.2);
  col+=(h(gl_FragCoord.xy+t)-.5)*.018;
  gl_FragColor=vec4(col,1.);
}`;

export function HeroGL({ className, horizon }: { className?: string; horizon: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  // Altura del horizonte (0 abajo, 1 arriba): donde apoyan las ruedas del coche.
  const horizonRef = useRef(horizon);
  useEffect(() => {
    horizonRef.current = horizon;
  }, [horizon]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const uM = gl.getUniformLocation(prog, "m");
    const uH = gl.getUniformLocation(prog, "hz");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uR, canvas.width, canvas.height);
    };

    const frame = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform1f(uT, reduce ? 12 : (now - start) / 1000);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.uniform1f(uH, horizonRef.current - 0.5);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce && visible) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });

    resize();
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    canvas.dataset.ready = "true";

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        background:
          "radial-gradient(60% 50% at 70% 35%, rgba(21,57,47,.9), transparent 70%), #0e0e10",
      }}
    >
      <canvas
        ref={ref}
        className="size-full opacity-0 transition-opacity duration-700 ease-out data-[ready=true]:opacity-100"
      />
    </div>
  );
}
