/* ==========================================================================
   PRESTACIONES — modelo sencillo pero coherente
   0–100 km/h : el mayor de dos límites, el de potencia y el de adherencia
   Vmax       : despeje de P = ½·ρ·CdA·v³ con pérdidas de transmisión
   ========================================================================== */
const RHO  = 1.2;     // densidad del aire (kg/m³)
const CV_W = 735.5;   // vatios por CV
const ETA  = 0.82;    // rendimiento de transmisión
const V100 = 27.78;   // 100 km/h en m/s
const G    = 9.81;

/** Tiempo de 0 a 100 km/h. `grip` (0–0,18) recoge gomas, chasis y ancho de vía. */
export function cero100(kg, cv, { grip = 0, clasico = false } = {}){
  const r = kg / Math.max(cv, 1);
  const tPot  = 1.236 * Math.pow(r, 0.948) * (clasico ? 1.06 : 1);
  const mu    = (clasico ? 0.74 : 0.85) + grip * 0.9;
  const tAdh  = V100 / (G * mu);
  // Mezcla suave entre ambos límites: manda el mayor sin salto brusco
  const n = 8;
  return Math.pow(Math.pow(tPot, n) + Math.pow(tAdh, n), 1 / n);
}

/** Velocidad máxima teórica en km/h a partir de la potencia y el área frontal. */
export function vmax(cv, cda){
  return Math.cbrt((2 * cv * CV_W * ETA) / (RHO * cda)) * 3.6;
}

export const pesoPotencia = (kg, cv) => kg / Math.max(cv, 1);
