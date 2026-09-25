"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import { HeroGL } from "@/components/hero-gl";
import { CarArt } from "@/components/car-art";
import { Button } from "@/components/ui/button";
import { STOCK, nombre } from "@/lib/stock";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const HERO_CAR = STOCK.find((c) => c.id === "m4")!;

/* Cada línea del titular se destapa con clip-path, escalonadas. */
function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.span
      className="block"
      initial={{ clipPath: "inset(0 0 100% 0)", transform: "translateY(40%)" }}
      animate={{ clipPath: "inset(0 0 0% 0)", transform: "translateY(0%)" }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.span>
  );
}

export function Hero() {
  const carRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const [horizon, setHorizon] = useState(0.12);
  const reduce = useReducedMotion();

  // El horizonte del fondo se alinea con la línea donde apoya el coche.
  useEffect(() => {
    const sec = sectionRef.current, g = groundRef.current;
    if (!sec || !g) return;
    const measure = () => {
      const s = sec.getBoundingClientRect(), r = g.getBoundingClientRect();
      setHorizon((s.bottom - r.top) / s.height);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sec);
    return () => ro.disconnect();
  }, []);

  /* El coche entra rodando: las llantas giran exactamente lo que avanza
     el coche y frenan con la misma curva, así no patina. */
  useEffect(() => {
    const el = carRef.current;
    if (!el) return;
    if (reduce) {
      el.style.opacity = "1";
      return;
    }
    const travel = Math.min(window.innerWidth * 0.55, 900);
    const wheel = el.querySelector<SVGGElement>(".cw-rot");
    const diameter = wheel?.getBoundingClientRect().width || 150;
    const turns = (travel / (Math.PI * diameter)) * 360;
    const wheels = Array.from(el.querySelectorAll<SVGGElement>(".cw-rot"));
    const opts = { duration: 1.25, ease: EASE_OUT, delay: 0.35 };

    const a = animate(
      el,
      { transform: [`translateX(${travel}px)`, "translateX(0px)"], opacity: [0, 1] },
      { ...opts, opacity: { duration: 0.4, delay: 0.35 } }
    );
    const b = wheels.map((w) => animate(w, { rotate: [turns, 0] }, opts));
    return () => {
      a.stop();
      b.forEach((x) => x.stop());
    };
  }, [reduce]);

  return (
    <section ref={sectionRef} id="inicio" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <HeroGL className="absolute inset-0 -z-10" horizon={horizon} />

      <div className="mx-auto w-full max-w-7xl px-5 pt-28 md:px-8 md:pt-36">
        <motion.p
          className="eyebrow text-accent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          BMW M · Mercedes-AMG · Porsche · Audi Sport
        </motion.p>

        <h1 className="font-wide mt-6 text-fluid-hero leading-[0.9] font-extrabold tracking-[-0.03em] uppercase">
          <Line delay={0.05}>Has llegado</Line>
          <Line delay={0.15}>
            lejos.{" "}
            <span className="font-serif text-[0.95em] font-normal tracking-normal normal-case italic text-primary">
              Ahora, el coche.
            </span>
          </Line>
        </h1>

        <motion.div
          className="mt-8 flex max-w-sm flex-col gap-6"
          initial={{ opacity: 0, transform: "translateY(12px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.45 }}
        >
          <p className="text-fluid-base text-foreground/80">
            Deportivos y berlinas alemanas de alta gama, en km 0 y de ocasión, elegidos uno a uno. Te
            decimos cuál comprar y, sobre todo, por qué.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#asesor">Encuentra el tuyo</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#stock">Ver el stock</a>
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto mt-10 w-full max-w-7xl px-5 pb-6 md:mt-auto md:px-8">
        <div
          ref={carRef}
          style={{ opacity: 0 }}
          className="relative -mb-[4%] w-[112%] md:absolute md:right-8 md:bottom-full md:mb-[-3.2%] md:w-[62%] md:max-w-[980px]"
        >
          <CarArt car={HERO_CAR} uid="hero" className="[&_.carsvg]:[--paint-deep:color-mix(in_oklab,var(--car-body)_62%,#0b0b0c)]" />
        </div>
        <div
          ref={groundRef}
          className="relative flex items-end justify-between gap-4 border-t border-foreground/15 pt-4 text-sm text-muted-foreground"
        >
          <p>
            En escena: <span className="text-foreground">{nombre(HERO_CAR)}</span> ·{" "}
            {HERO_CAR.paint} · {HERO_CAR.estado}
          </p>
          <a
            href="#stock"
            className="hidden items-center gap-1 text-foreground transition-colors duration-200 ease-out hover:text-primary sm:inline-flex"
          >
            Ver en el stock <ArrowDownRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
