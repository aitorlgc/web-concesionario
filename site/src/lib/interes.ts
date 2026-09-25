/* Cualquier botón "Quiero verlo" avisa al formulario de contacto
   y lleva al usuario hasta él con el coche ya elegido. */
export const INTERES_EVENT = "highcars:interes";

export function quieroVerlo(carId: string) {
  window.dispatchEvent(new CustomEvent<string>(INTERES_EVENT, { detail: carId }));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("contacto")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}
