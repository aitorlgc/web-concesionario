import type { CarShape } from "./car-art";

export type Uso = "diario" | "finde" | "circuito" | "familia";
export type Motor = "gasolina" | "hibrido" | "electrico";

export type Car = {
  id: string;
  brand: "BMW M" | "Mercedes-AMG" | "Porsche" | "Audi Sport";
  model: string;
  version: string;
  estado: "Km 0" | "Ocasión";
  year: number;
  km: number;
  price: number;
  cv: number;
  zeroTo100: number;
  motor: Motor;
  motorLabel: string;
  color: string;
  paint: string;
  usos: Uso[];
  asesor: string;
  shape: CarShape;
};

/* Cotas de partida: BMW M4 (G82) y M3 (G80).
   El resto de coches se derivan de ellas con sus medidas reales. */
const coupe: CarShape = {
  L: 4794, H: 1393, WB: 2857, FO: 890, WD: 700,
  cowl: 1582, roofF: 2061, roofR: 3356, deck: 3835,
  hoodH: 895, beltH: 925, beltRise: 34, sillH: 200, noseTopH: 890, noseBotH: 215,
  tailTopH: 950, tailBotH: 270, noseLean: 62, tailLean: -6,
  archF: 38, archR: 44, crown: 20, wsRake: 0.54, blRake: 0.42,
  rim: "star", spokes: 10, rimD: 0.81, nose: "kidney", kink: true,
  aero: { splitter: true, skirt: true, diffuser: true, wing: "lip" },
};

const saloon: CarShape = {
  ...coupe,
  L: 4794, H: 1433, doors: 4,
  cowl: 1678, roofF: 2109, roofR: 3548, deck: 3979,
  hoodH: 920, beltH: 950, beltRise: 36, sillH: 210, noseTopH: 915, noseBotH: 230,
  tailTopH: 975, tailBotH: 290, noseLean: 56, tailLean: -8,
  archF: 34, archR: 40, crown: 26, wsRake: 0.56, blRake: 0.46,
  aero: { splitter: true, skirt: true, diffuser: true, ducktail: true },
};

const wagon: CarShape = {
  ...saloon,
  wagon: true,
  roofR: 4380, deck: 4600, blRake: 0.9, crown: 18,
  tailTopH: 1080, beltRise: 20,
  aero: { splitter: true, skirt: true, diffuser: true },
};

export const STOCK: Car[] = [
  {
    id: "m2", brand: "BMW M", model: "M2", version: "Coupé · caja manual",
    estado: "Km 0", year: 2025, km: 40, price: 82900, cv: 480, zeroTo100: 4.3,
    motor: "gasolina", motorLabel: "3.0 seis en línea biturbo", color: "#3E6DB0", paint: "Azul Zandvoort",
    usos: ["finde", "circuito", "diario"],
    asesor: "Si es tu primer deportivo, empieza por aquí. Propulsión, cambio manual y un tamaño que se deja conducir. Te va a enseñar más que cualquier curso.",
    shape: {
      ...coupe, L: 4580, H: 1403, WB: 2747, FO: 820,
      cowl: 1500, roofF: 1960, roofR: 3160, deck: 3640,
      archF: 46, archR: 52, boxArch: true, rim: "twin", spokes: 20, caliper: "#1D4E9A",
    },
  },
  {
    id: "m4", brand: "BMW M", model: "M4 Competition", version: "Coupé xDrive",
    estado: "Km 0", year: 2025, km: 25, price: 104900, cv: 530, zeroTo100: 3.5,
    motor: "gasolina", motorLabel: "3.0 seis en línea biturbo", color: "#1F4A3A", paint: "Verde Isle of Man",
    usos: ["finde", "diario", "circuito"],
    asesor: "El que te comprarías si no tuvieras que dar explicaciones a nadie. Y en este verde no vas a cruzarte con otro.",
    shape: { ...coupe, caliper: "#D8C3A0" },
  },
  {
    id: "m3t", brand: "BMW M", model: "M3 Competition Touring", version: "xDrive",
    estado: "Ocasión", year: 2024, km: 18400, price: 97500, cv: 510, zeroTo100: 3.6,
    motor: "gasolina", motorLabel: "3.0 seis en línea biturbo", color: "#8C1F2B", paint: "Rojo Toronto",
    usos: ["familia", "diario", "finde"],
    asesor: "Maletero de familiar, 510 caballos y cara de no haber roto un plato. Para quien no quiere elegir entre la sillita y el circuito.",
    shape: { ...wagon, L: 4801, H: 1440, caliper: "#D8C3A0" },
  },
  {
    id: "c63", brand: "Mercedes-AMG", model: "C 63 S E Performance", version: "Berlina 4MATIC+",
    estado: "Ocasión", year: 2024, km: 22100, price: 84900, cv: 680, zeroTo100: 3.4,
    motor: "hibrido", motorLabel: "2.0 turbo + eléctrico", color: "#4B5057", paint: "Gris Grafito",
    usos: ["diario", "familia", "finde"],
    asesor: "Sí, es un cuatro cilindros. También es el C 63 más rápido que se ha fabricado. Pruébalo antes de opinar, que es lo que hice yo.",
    shape: {
      ...saloon, L: 4842, H: 1438, WB: 2875, FO: 880, nose: "star", kink: false,
      rim: "turbine", spokes: 10, caliper: "#B8B8B8",
    },
  },
  {
    id: "gt63", brand: "Mercedes-AMG", model: "GT 63 Coupé", version: "4MATIC+",
    estado: "Km 0", year: 2025, km: 60, price: 179900, cv: 585, zeroTo100: 3.2,
    motor: "gasolina", motorLabel: "4.0 V8 biturbo", color: "#3B4A2C", paint: "Verde Infierno Magno",
    usos: ["finde", "circuito"],
    asesor: "Capó larguísimo, V8 que se oye a dos calles y dos plazas traseras de verdad. Para llegar a los sitios y que se note que has llegado.",
    shape: {
      ...coupe, L: 4728, H: 1354, WB: 2700, FO: 900, nose: "star", kink: false,
      cowl: 1980, roofF: 2380, roofR: 3300, deck: 4050, blRake: 0.75, crown: 26,
      hoodH: 900, noseTopH: 860, rim: "star", spokes: 5, caliper: "#C0392B",
      aero: { splitter: true, skirt: true, diffuser: true, wing: "lip" },
    },
  },
  {
    id: "911", brand: "Porsche", model: "911 Carrera S", version: "992.2",
    estado: "Ocasión", year: 2025, km: 6900, price: 164500, cv: 480, zeroTo100: 3.3,
    motor: "gasolina", motorLabel: "3.0 bóxer biturbo", color: "#1D3766", paint: "Azul Genciana",
    usos: ["diario", "finde", "circuito"],
    asesor: "No se deprecia como los demás. Si quieres un deportivo para todos los días y venderlo bien dentro de cinco años, es este.",
    shape: {
      ...coupe, L: 4542, H: 1298, WB: 2450, FO: 960, WD: 690, nose: "crest", kink: false,
      cowl: 1640, roofF: 2020, roofR: 2700, deck: 4150, blRake: 0.86, crown: 34, wsRake: 0.5,
      hoodH: 770, beltH: 830, beltRise: 60, noseTopH: 720, noseBotH: 230, tailTopH: 950, tailBotH: 330,
      noseLean: 40, archF: 40, archR: 54, rim: "twin", spokes: 20, caliper: "#C0392B",
      aero: { ducktail: true },
    },
  },
  {
    id: "taycan", brand: "Porsche", model: "Taycan 4S", version: "Performance Battery Plus",
    estado: "Ocasión", year: 2024, km: 15200, price: 99900, cv: 598, zeroTo100: 3.7,
    motor: "electrico", motorLabel: "Dos motores eléctricos", color: "#8E3A5B", paint: "Frozen Berry",
    usos: ["diario", "familia"],
    asesor: "Silencioso hasta que pisas. Si puedes cargar en casa, es el mejor coche de diario que tenemos ahora mismo en la nave.",
    shape: {
      ...saloon, L: 4963, H: 1379, WB: 2900, FO: 930, nose: "crest", kink: false,
      cowl: 1720, roofF: 2200, roofR: 3500, deck: 4420, blRake: 0.7, crown: 36,
      hoodH: 800, beltH: 880, noseTopH: 760, noseBotH: 230, tailTopH: 960,
      rim: "turbine", spokes: 10, caliper: "#2E6E5A", aero: { skirt: true, diffuser: true },
    },
  },
  {
    id: "rs6", brand: "Audi Sport", model: "RS 6 Avant performance", version: "quattro",
    estado: "Ocasión", year: 2024, km: 19800, price: 132000, cv: 630, zeroTo100: 3.4,
    motor: "gasolina", motorLabel: "4.0 V8 biturbo", color: "#7F8386", paint: "Gris Nardo",
    usos: ["familia", "diario", "finde"],
    asesor: "El familiar que deja callados a los deportivos en los semáforos. Y en gris Nardo, que es como hay que llevarlo.",
    shape: {
      ...wagon, L: 4995, H: 1460, WB: 2927, FO: 960, nose: "frame", kink: false,
      roofR: 4480, deck: 4700, archF: 52, archR: 56, boxArch: true,
      rim: "star", spokes: 10, caliper: "#C0392B",
    },
  },
  {
    id: "r8", brand: "Audi Sport", model: "R8 V10 performance", version: "Coupé RWD",
    estado: "Ocasión", year: 2023, km: 11300, price: 169900, cv: 570, zeroTo100: 3.7,
    motor: "gasolina", motorLabel: "5.2 V10 atmosférico", color: "#D9A21B", paint: "Amarillo Vegas",
    usos: ["finde", "circuito"],
    asesor: "Es el último V10 atmosférico que se puede comprar, porque ya no se fabrica. Estos coches no van a bajar de precio. Piénsalo.",
    shape: {
      ...coupe, L: 4429, H: 1240, WB: 2650, FO: 900, WD: 680, nose: "frame", kink: false,
      cowl: 1180, roofF: 1760, roofR: 2600, deck: 3300, blRake: 0.34, crown: 14, wsRake: 0.44,
      hoodH: 680, beltH: 800, beltRise: 40, sillH: 170, noseTopH: 660, noseBotH: 190,
      tailTopH: 960, tailBotH: 280, noseLean: 90, archF: 30, archR: 36,
      rim: "twin", spokes: 10, caliper: "#C0392B",
      aero: { splitter: true, skirt: true, diffuser: true, wing: "lip" },
    },
  },
  {
    id: "cla45", brand: "Mercedes-AMG", model: "CLA 45 S", version: "Coupé 4MATIC+",
    estado: "Ocasión", year: 2023, km: 24500, price: 58900, cv: 421, zeroTo100: 4.0,
    motor: "gasolina", motorLabel: "2.0 turbo, el más potente de serie", color: "#9E9A91", paint: "Gris Montaña",
    usos: ["diario", "finde"],
    asesor: "421 caballos en un coche que aparcas en cualquier sitio. Es la puerta de entrada a AMG sin estirar el presupuesto.",
    shape: {
      ...saloon, L: 4693, H: 1413, WB: 2729, FO: 850, nose: "star", kink: false,
      roofR: 3250, deck: 3900, blRake: 0.62, crown: 30,
      rim: "twin", spokes: 10, caliper: "#B8B8B8",
    },
  },
];

/* Nombre para mostrar: "BMW M4", no "BMW M M4". */
export function nombre(c: Car) {
  const marca = c.brand === "BMW M" ? "BMW" : c.brand === "Audi Sport" ? "Audi" : c.brand;
  return `${marca} ${c.model}`;
}

export const eur = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export const kmFmt = (n: number) => new Intl.NumberFormat("es-ES").format(n) + " km";

/* Cuota orientativa: 20 % de entrada, 48 meses, TIN 6,99 %. */
export function cuota(price: number) {
  const capital = price * 0.8;
  const i = 0.0699 / 12;
  const n = 48;
  return Math.round((capital * i) / (1 - Math.pow(1 + i, -n)));
}
