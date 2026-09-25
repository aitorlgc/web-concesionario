import { Reveal } from "@/components/reveal";

// TODO: sustituir por reseñas reales (Google, Coches.net…) antes de publicar.
const OPINIONES = [
  {
    q: "Entré a por un Cayenne y salí con un M3 Touring. Me explicaron por qué en diez minutos y tenían razón. Dos años después, sigo sonriendo cada mañana.",
    n: "Javier M.",
    c: "BMW M3 Competition Touring",
  },
  {
    q: "Era mi primer coche de este nivel y me daba respeto. Ni una prisa, ni una presión. Me dejaron probar tres antes de decidir.",
    n: "Lucía R.",
    c: "Porsche Taycan 4S",
  },
  {
    q: "Me enseñaron hasta la factura de los frenos. Eso no te lo hace nadie.",
    n: "Iker S.",
    c: "Audi RS 6 Avant",
  },
];

export function Opiniones() {
  const [main, ...rest] = OPINIONES;
  return (
    <section aria-labelledby="opiniones-title" className="bg-surface-deep py-section">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <h2 id="opiniones-title" className="eyebrow text-accent">
          Lo que cuentan después
        </h2>

        <Reveal>
          <figure className="mt-10 max-w-5xl">
            <blockquote className="font-serif text-fluid-2xl leading-[1.05] italic">“{main.q}”</blockquote>
            <figcaption className="mt-6 text-sm text-muted-foreground">
              <span className="text-foreground">{main.n}</span> · {main.c}
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-16 grid gap-10 md:ml-[25%] md:grid-cols-2">
          {rest.map((o, i) => (
            <Reveal key={o.n} delay={i * 0.08}>
              <figure className="border-t border-border pt-6">
                <blockquote className="font-serif text-fluid-lg leading-snug italic">“{o.q}”</blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  <span className="text-foreground">{o.n}</span> · {o.c}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-12 text-xs text-muted-foreground">Opiniones de ejemplo.</p>
      </div>
    </section>
  );
}
