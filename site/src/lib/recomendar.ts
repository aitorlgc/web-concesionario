import { STOCK, type Car, type Motor, type Uso } from "./stock";

export type Respuestas = {
  uso: Uso;
  motor: Motor | "igual";
  presupuesto: number; // tope en euros; Infinity = sin techo
};

/* Puntúa cada coche como lo haría un asesor: primero para qué lo quieres,
   luego cómo te gusta que suene y, dentro del presupuesto, lo mejor que alcanza. */
export function recomendar(r: Respuestas): { top: Car; otros: Car[] } {
  const score = (c: Car) => {
    let s = 0;
    const i = c.usos.indexOf(r.uso);
    if (i === 0) s += 6;
    else if (i > 0) s += 4 - i;
    if (r.motor === "igual") s += 1;
    else if (c.motor === r.motor) s += 4;
    else if (r.motor === "hibrido" && c.motor === "electrico") s += 1;
    // Aprovechar el presupuesto sin pasarse: premia lo que se acerca al tope.
    if (Number.isFinite(r.presupuesto)) s += (c.price / r.presupuesto) * 2;
    return s;
  };

  let pool = STOCK.filter((c) => c.price <= r.presupuesto);
  if (pool.length === 0) pool = [...STOCK].sort((a, b) => a.price - b.price).slice(0, 3);

  const ranked = [...pool].sort((a, b) => score(b) - score(a));
  return { top: ranked[0], otros: ranked.slice(1, 3) };
}
