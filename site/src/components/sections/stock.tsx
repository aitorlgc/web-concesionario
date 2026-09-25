"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarArt } from "@/components/car-art";
import { Reveal } from "@/components/reveal";
import { STOCK, cuota, eur, kmFmt, nombre, type Car } from "@/lib/stock";
import { quieroVerlo } from "@/lib/interes";
import { cn } from "@/lib/utils";

const FILTROS = ["Todos", "Km 0", "Ocasión"] as const;
type Filtro = (typeof FILTROS)[number];

function Ficha({ car }: { car: Car }) {
  return (
    <article
      className="ficha group relative flex w-[82vw] max-w-[420px] shrink-0 snap-start flex-col rounded-lg border border-border bg-card p-6 sm:w-[380px]"
      aria-labelledby={`ficha-${car.id}`}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="eyebrow text-muted-foreground">{car.brand}</span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 font-medium",
            car.estado === "Km 0" ? "bg-primary/15 text-primary" : "bg-accent/12 text-accent"
          )}
        >
          {car.estado}
        </span>
      </div>

      <div className="relative my-6 transition-transform duration-500 ease-out group-hover:-translate-x-2">
        <CarArt car={car} uid={`stock-${car.id}`} />
      </div>

      <h3 id={`ficha-${car.id}`} className="font-wide text-xl leading-tight font-extrabold uppercase">
        {car.model}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {car.version} · {car.year} · {kmFmt(car.km)}
      </p>
      <p className="mt-3 flex items-center gap-2 text-sm text-foreground/80">
        <span aria-hidden="true" className="size-3 rounded-full ring-1 ring-foreground/20" style={{ background: car.color }} />
        {car.paint} · {car.cv} CV
      </p>

      <p className="mt-5 mb-6 line-clamp-3 font-serif text-lg leading-snug text-foreground/85 italic">“{car.asesor}”</p>

      <div className="mt-auto flex items-end justify-between gap-4 border-t border-border pt-5">
        <div>
          <p className="font-wide text-2xl font-extrabold">{eur(car.price)}</p>
          <p className="text-xs text-muted-foreground">o {eur(cuota(car.price))}/mes*</p>
        </div>
        <Button size="sm" variant="light" onClick={() => quieroVerlo(car.id)} aria-label={`Quiero ver el ${nombre(car)}`}>
          Quiero verlo
        </Button>
      </div>
    </article>
  );
}

export function Stock() {
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const rail = useRef<HTMLDivElement>(null);
  const coches = filtro === "Todos" ? STOCK : STOCK.filter((c) => c.estado === filtro);

  const mover = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".ficha");
    const step = card ? card.offsetWidth + 20 : 400;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: step * dir, behavior: reduce ? "auto" : "smooth" });
  };

  const cambiarFiltro = (f: Filtro) => {
    setFiltro(f);
    rail.current?.scrollTo({ left: 0 });
  };

  return (
    <section id="stock" aria-labelledby="stock-title" className="py-section">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-accent">Stock</p>
            <h2 id="stock-title" className="font-wide mt-4 text-fluid-2xl leading-[0.95] font-extrabold uppercase">
              En la nave,
              <br />
              ahora mismo.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Filtrar por estado" className="flex rounded-full border border-border p-1">
              {FILTROS.map((f) => {
                const n = f === "Todos" ? STOCK.length : STOCK.filter((c) => c.estado === f).length;
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={filtro === f}
                    onClick={() => cambiarFiltro(f)}
                    className={cn(
                      "cursor-pointer rounded-full px-4 py-2 text-sm transition-[background-color,color] duration-200 ease-out",
                      filtro === f ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    {f} <span className="tabular-nums opacity-60">{n}</span>
                  </button>
                );
              })}
            </div>
            <div className="hidden gap-2 md:flex">
              <Button variant="outline" size="icon" onClick={() => mover(-1)} aria-label="Coches anteriores">
                <ArrowLeft className="size-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => mover(1)} aria-label="Más coches">
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

      <div
        ref={rail}
        className="rail mt-12 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-4 md:scroll-px-8 md:px-8 xl:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))] xl:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        tabIndex={0}
        aria-label="Coches en stock, desplazable en horizontal"
      >
        {coches.map((c) => (
          <Ficha key={c.id} car={c} />
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-7xl px-5 text-xs text-muted-foreground md:px-8">
        *Cuota orientativa con 20 % de entrada, 48 meses y TIN 6,99 %. Precios con IVA. Te damos el TAE y el
        coste total por escrito antes de firmar nada.
      </p>
    </section>
  );
}
