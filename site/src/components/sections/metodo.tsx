import { Reveal } from "@/components/reveal";

const PASOS = [
  {
    t: "Primero, un café",
    d: "Nos cuentas qué buscas y para qué. Si el coche que traías en la cabeza no te encaja, te lo decimos. Preferimos perder una venta a que te arrepientas en tres meses.",
  },
  {
    t: "El historial, encima de la mesa",
    d: "Cada coche pasa una revisión de 120 puntos, con kilómetros certificados y el libro de mantenimiento oficial. Si algo se ha pintado o cambiado, lo sabrás antes de firmar.",
  },
  {
    t: "Números claros",
    d: "Cuota, TAE y coste total en la misma hoja, sin letra pequeña. Trabajamos con la financiera de cada marca y con dos bancos, y te enseñamos las tres ofertas.",
  },
  {
    t: "Te lo llevamos a casa",
    d: "Entrega en toda la península con 24 meses de garantía. A la semana te llamamos para ver qué tal. Y al año, para la primera revisión.",
  },
];

export function Metodo() {
  return (
    <section id="como-trabajamos" aria-labelledby="metodo-title" className="border-t border-border py-section">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 md:grid-cols-12 md:px-8">
        <Reveal className="md:sticky md:top-32 md:col-span-5 md:self-start">
          <p className="eyebrow text-accent">Cómo trabajamos</p>
          <h2 id="metodo-title" className="font-wide mt-4 text-fluid-section leading-[0.95] font-extrabold uppercase">
            Tu primer deportivo no debería dar vértigo.
          </h2>
          <p className="mt-6 max-w-sm font-serif text-fluid-lg text-foreground/80 italic">
            Somos el amigo que sabe de coches. El que te dice la verdad aunque no sea la que querías oír.
          </p>
        </Reveal>

        <ol className="md:col-span-6 md:col-start-7">
          {PASOS.map((p, i) => (
            <li key={p.t} className="border-t border-border first:border-t-0 first:pt-0 py-10">
              <Reveal delay={i * 0.05} className="grid grid-cols-[3.5rem_1fr] gap-4">
                <span className="font-wide pt-1 text-sm font-bold tabular-nums text-primary">0{i + 1}</span>
                <div>
                  <h3 className="font-wide text-xl font-bold">{p.t}</h3>
                  <p className="mt-3 text-foreground/70">{p.d}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
