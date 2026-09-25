"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarArt } from "@/components/car-art";
import { Reveal } from "@/components/reveal";
import { recomendar, type Respuestas } from "@/lib/recomendar";
import { cuota, eur, kmFmt, nombre } from "@/lib/stock";
import { quieroVerlo } from "@/lib/interes";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

type Opcion<T> = { value: T; titulo: string; texto: string };

const PREGUNTAS = [
  {
    key: "uso",
    pregunta: "¿Para qué lo vas a usar sobre todo?",
    opciones: [
      { value: "diario", titulo: "Para el día a día", texto: "Ir a trabajar y que cada trayecto cuente." },
      { value: "finde", titulo: "Escapadas", texto: "Puertos de montaña, sin prisa por volver." },
      { value: "circuito", titulo: "Circuito", texto: "Tandas, vértices y cronómetro." },
      { value: "familia", titulo: "Con la familia", texto: "Somos más de dos y hay maletero que llenar." },
    ],
  },
  {
    key: "motor",
    pregunta: "¿Cómo te gusta que suene?",
    opciones: [
      { value: "gasolina", titulo: "Que se oiga", texto: "Seis cilindros, V8 o V10. Cuanto más, mejor." },
      { value: "hibrido", titulo: "Rápido y sensato", texto: "Mucha potencia, menos gasolinera." },
      { value: "electrico", titulo: "En silencio", texto: "Que empuje sin hacer ruido." },
      { value: "igual", titulo: "Me da igual", texto: "Tú sabrás. Para eso estás." },
    ],
  },
  {
    key: "presupuesto",
    pregunta: "¿Hasta dónde quieres llegar?",
    opciones: [
      { value: 90000, titulo: "Hasta 90.000 €", texto: "Desde unos 1.100 € al mes." },
      { value: 135000, titulo: "Hasta 135.000 €", texto: "Aquí ya entra casi todo." },
      { value: Infinity, titulo: "Sin techo", texto: "Enséñame lo mejor que tengáis." },
    ],
  },
] as const;

type Parcial = Partial<Respuestas>;

export function Asesor() {
  const [paso, setPaso] = useState(0);
  const [resp, setResp] = useState<Parcial>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const terminado = paso >= PREGUNTAS.length;
  const resultado = terminado ? recomendar(resp as Respuestas) : null;

  // Al cambiar de paso, el foco va al nuevo enunciado (lectores de pantalla y teclado).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [paso]);

  const elegir = (key: string, value: unknown) => {
    setResp((r) => ({ ...r, [key]: value }));
    setPaso((p) => p + 1);
  };

  const reiniciar = () => {
    setResp({});
    setPaso(0);
  };

  return (
    <section id="asesor" aria-labelledby="asesor-title" className="relative bg-surface-deep py-section">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <Reveal className="md:sticky md:top-32 md:self-start">
            <p className="eyebrow text-accent">Tu asesor</p>
            <h2 id="asesor-title" className="font-wide mt-4 text-fluid-section leading-[0.95] font-extrabold uppercase">
              ¿Qué coche va contigo?
            </h2>
            <p className="mt-6 max-w-sm text-foreground/75">
              Tres preguntas, como si nos las hicieras tomando un café. Al final te decimos cuál nos
              llevaríamos nosotros en tu lugar.
            </p>
            {!terminado && (
              <p className="mt-10 font-wide text-sm tabular-nums text-muted-foreground" aria-live="polite">
                <span className="text-foreground">0{paso + 1}</span> / 0{PREGUNTAS.length}
              </p>
            )}
          </Reveal>

          <div className="min-h-[520px]">
            <AnimatePresence mode="wait" initial={false}>
              {!terminado ? (
                <motion.fieldset
                  key={paso}
                  initial={{ opacity: 0, transform: "translateX(24px)" }}
                  animate={{ opacity: 1, transform: "translateX(0px)" }}
                  exit={{ opacity: 0, transform: "translateX(-16px)" }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                >
                  <legend className="sr-only">Pregunta {paso + 1} de {PREGUNTAS.length}</legend>
                  <h3
                    ref={headingRef}
                    tabIndex={-1}
                    className="font-serif text-fluid-xl leading-tight italic outline-none"
                  >
                    {PREGUNTAS[paso].pregunta}
                  </h3>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {(PREGUNTAS[paso].opciones as readonly Opcion<unknown>[]).map((o) => {
                      const selected = resp[PREGUNTAS[paso].key as keyof Parcial] === o.value;
                      return (
                        <button
                          key={o.titulo}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => elegir(PREGUNTAS[paso].key, o.value)}
                          className={cn(
                            "group flex cursor-pointer flex-col items-start gap-2 rounded-lg border p-5 text-left",
                            "transition-[transform,border-color,background-color] duration-200 ease-out active:scale-[0.98]",
                            "hover:border-accent/70 hover:bg-foreground/[0.03]",
                            selected ? "border-primary bg-primary/10" : "border-border"
                          )}
                        >
                          <span className="flex w-full items-center justify-between font-wide text-base font-bold">
                            {o.titulo}
                            <ArrowRight
                              aria-hidden="true"
                              className="size-4 text-accent opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0.5 group-hover:opacity-100"
                            />
                          </span>
                          <span className="text-sm text-muted-foreground">{o.texto}</span>
                        </button>
                      );
                    })}
                  </div>
                  {paso > 0 && (
                    <Button variant="ghost" size="sm" className="mt-6 -ml-3" onClick={() => setPaso((p) => p - 1)}>
                      <ArrowLeft className="size-4" aria-hidden="true" /> Atrás
                    </Button>
                  )}
                </motion.fieldset>
              ) : (
                resultado && (
                  <motion.div
                    key="resultado"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    aria-live="polite"
                  >
                    <p className="eyebrow text-accent">Mi recomendación</p>
                    <h3
                      ref={headingRef}
                      tabIndex={-1}
                      className="font-wide mt-3 text-fluid-xl leading-none font-extrabold uppercase outline-none"
                    >
                      {resultado.top.model}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {resultado.top.brand} · {resultado.top.version} · {resultado.top.paint}
                    </p>

                    <motion.div
                      className="my-6"
                      initial={{ opacity: 0, transform: "translateX(40px)" }}
                      animate={{ opacity: 1, transform: "translateX(0px)" }}
                      transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
                    >
                      <CarArt car={resultado.top} uid={`rec-${resultado.top.id}`} />
                    </motion.div>

                    <blockquote className="border-l border-accent/50 pl-5">
                      <p className="font-serif text-fluid-lg leading-snug italic">“{resultado.top.asesor}”</p>
                      <footer className="mt-3 text-sm text-muted-foreground">Álvaro, asesor en High Cars</footer>
                    </blockquote>

                    <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 text-sm sm:grid-cols-4">
                      <div>
                        <dt className="text-muted-foreground">Potencia</dt>
                        <dd className="font-wide mt-1 text-lg font-bold">{resultado.top.cv} CV</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">0-100 km/h</dt>
                        <dd className="font-wide mt-1 text-lg font-bold">{resultado.top.zeroTo100.toLocaleString("es-ES")} s</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">{resultado.top.estado}</dt>
                        <dd className="font-wide mt-1 text-lg font-bold">{kmFmt(resultado.top.km)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Precio</dt>
                        <dd className="font-wide mt-1 text-lg font-bold">{eur(resultado.top.price)}</dd>
                        <dd className="text-xs text-muted-foreground">o {eur(cuota(resultado.top.price))}/mes*</dd>
                      </div>
                    </dl>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button size="lg" onClick={() => quieroVerlo(resultado.top.id)}>
                        Quiero verlo en persona
                      </Button>
                      <Button size="lg" variant="outline" onClick={reiniciar}>
                        <RotateCcw className="size-4" aria-hidden="true" /> Empezar de nuevo
                      </Button>
                    </div>

                    {resultado.otros.length > 0 && (
                      <p className="mt-8 text-sm text-muted-foreground">
                        También te encajarían:{" "}
                        {resultado.otros.map((c, i) => (
                          <span key={c.id}>
                            {i > 0 && " o "}
                            <button
                              type="button"
                              onClick={() => quieroVerlo(c.id)}
                              className="cursor-pointer text-foreground underline decoration-accent/50 underline-offset-4 transition-colors duration-200 ease-out hover:text-primary"
                            >
                              {nombre(c)}
                            </button>
                          </span>
                        ))}
                        .
                      </p>
                    )}
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
