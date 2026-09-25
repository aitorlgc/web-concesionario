/* Perfiles de coche dibujados por código.
   Generador paramétrico:
   cada coche se describe con cotas reales en milímetros y el generador devuelve
   el SVG completo. Aquí se amplía a varias marcas (frontal, pliegue, franjas). */

export type Rim = "star" | "twin" | "turbine" | "mesh";
export type Nose = "kidney" | "star" | "crest" | "frame";

export type CarShape = {
  L: number; H: number; WB: number; FO: number; WD: number;
  cowl: number; roofF: number; roofR: number; deck: number;
  hoodH: number; beltH: number; beltRise?: number; sillH: number;
  noseTopH: number; noseBotH: number; tailTopH: number; tailBotH: number;
  noseLean?: number; tailLean?: number;
  archF: number; archR: number; crown: number; wsRake: number; blRake: number;
  boxArch?: boolean; doors?: 2 | 4; wagon?: boolean;
  rim: Rim; spokes: number; rimD: number;
  nose: Nose; kink?: boolean;
  aero?: { splitter?: boolean; skirt?: boolean; diffuser?: boolean; ducktail?: boolean; wing?: "lip" | "gt" };
  caliper?: string;
};

const S = 0.235;   // unidades SVG por milímetro
const GY = 420;    // línea de suelo
const PAD = 40;

const mm = (v: number) => v * S;
const f = (v: number) => v.toFixed(1);

type Geom = ReturnType<typeof geom>;

function geom(c: CarShape) {
  const x0 = PAD;
  const len = mm(c.L);
  const x1 = x0 + len;
  const wr = mm(c.WD) / 2;
  const fAx = x0 + mm(c.FO);
  const rAx = fAx + mm(c.WB);
  const wcY = GY - wr;
  const Y = (h: number) => GY - mm(h);
  const X = (d: number) => x0 + mm(d);
  return {
    x0, x1, len, wr, fAx, rAx, wcY,
    sillY: Y(c.sillH),
    beltY: Y(c.beltH),
    beltRY: Y(c.beltH + (c.beltRise || 0)),
    roofY: Y(c.H),
    hoodY: Y(c.hoodH),
    noseTopY: Y(c.noseTopH),
    noseBotY: Y(c.noseBotH),
    tailTopY: Y(c.tailTopH),
    tailBotY: Y(c.tailBotH),
    noseBotX: x0 + mm(c.noseLean || 0),
    tailBotX: x1 + mm(c.tailLean || 0),
    cowlX: X(c.cowl), roofFX: X(c.roofF), roofRX: X(c.roofR), deckX: X(c.deck),
    archFR: wr + mm(c.archF),
    archRR: wr + mm(c.archR),
    rimR: wr * c.rimD,
    crown: mm(c.crown),
    vbW: len + PAD * 2,
    vbY: Y(c.H) - 40,
    vbH: mm(c.H) + 40 + 60,
  };
}

const archCut = (g: Geom, ax: number, R: number) => {
  const endY = Math.min(g.sillY, g.wcY + mm(30));
  const dy = endY - g.wcY;
  const dx = Math.sqrt(Math.max(R * R - dy * dy, 1));
  return { l: ax - dx, r: ax + dx, top: g.wcY - R, endY };
};

const bottomAt = (g: Geom, x: number) => {
  const aR = archCut(g, g.rAx, g.archRR);
  if (x >= aR.r) {
    const t = Math.min(Math.max((x - aR.r) / (g.tailBotX - aR.r), 0), 1);
    return g.sillY + (g.tailBotY - g.sillY) * t;
  }
  return g.sillY;
};

const beltAt = (g: Geom, x: number) => {
  const t = Math.min(Math.max((x - g.cowlX) / (g.deckX - g.cowlX), 0), 1);
  return g.beltY + (g.beltRY - g.beltY) * t;
};

function arch(g: Geom, a: ReturnType<typeof archCut>, R: number) {
  return `L ${f(a.r)} ${f(a.endY)} A ${f(R)} ${f(R)} 0 0 0 ${f(a.l)} ${f(a.endY)} L ${f(a.l)} ${f(g.sillY)}`;
}

function bodyPath(c: CarShape, g: Geom) {
  const aF = archCut(g, g.fAx, g.archFR);
  const aR = archCut(g, g.rAx, g.archRR);
  const nR = 16, tR = 14;
  const p: string[] = [];
  p.push(`M ${f(g.noseBotX)} ${f(g.noseBotY)}`);
  p.push(`C ${f(g.noseBotX - mm(30))} ${f(g.noseBotY - mm(120))} ${f(g.x0)} ${f(g.noseTopY + mm(230))} ${f(g.x0)} ${f(g.noseTopY + nR)}`);
  p.push(`Q ${f(g.x0)} ${f(g.noseTopY)} ${f(g.x0 + nR)} ${f(g.noseTopY)}`);
  p.push(`C ${f(g.x0 + (g.cowlX - g.x0) * 0.45)} ${f(g.noseTopY - mm(24))} ${f(g.cowlX - mm(340))} ${f(g.hoodY - mm(10))} ${f(g.cowlX)} ${f(g.hoodY)}`);
  p.push(`Q ${f(g.cowlX + (g.roofFX - g.cowlX) * c.wsRake)} ${f(g.hoodY - (g.hoodY - g.roofY) * (1 - c.wsRake * 0.34))} ${f(g.roofFX)} ${f(g.roofY)}`);
  p.push(`Q ${f((g.roofFX + g.roofRX) / 2)} ${f(g.roofY - g.crown)} ${f(g.roofRX)} ${f(g.roofY)}`);
  p.push(`Q ${f(g.roofRX + (g.deckX - g.roofRX) * c.blRake)} ${f(g.roofY + (g.tailTopY - g.roofY) * (1 - c.blRake * 0.42))} ${f(g.deckX)} ${f(g.tailTopY)}`);
  p.push(`C ${f(g.deckX + (g.x1 - g.deckX) * 0.45)} ${f(g.tailTopY - mm(16))} ${f(g.x1 - mm(120))} ${f(g.tailTopY - mm(8))} ${f(g.x1 - tR)} ${f(g.tailTopY)}`);
  p.push(`Q ${f(g.x1)} ${f(g.tailTopY)} ${f(g.x1)} ${f(g.tailTopY + tR)}`);
  p.push(`C ${f(g.x1)} ${f(g.tailTopY + mm(240))} ${f(g.tailBotX + mm(24))} ${f(g.tailBotY - mm(110))} ${f(g.tailBotX)} ${f(g.tailBotY)}`);
  p.push(`L ${f(aR.r)} ${f(g.sillY)}`);
  p.push(arch(g, aR, g.archRR));
  p.push(`L ${f(aF.r)} ${f(g.sillY)}`);
  p.push(arch(g, aF, g.archFR));
  p.push(`L ${f(g.noseBotX)} ${f(g.noseBotY)} Z`);
  return p.join(" ");
}

function archLip(c: CarShape, g: Geom, ax: number, R: number) {
  const a = archCut(g, ax, R);
  const w = c.boxArch ? 5.5 : 3.2;
  return `<path d="M${f(a.r)} ${f(g.sillY)} L${f(a.r)} ${f(a.endY)} A ${f(R)} ${f(R)} 0 0 0 ${f(a.l)} ${f(a.endY)} L${f(a.l)} ${f(g.sillY)}" class="c-arch" stroke-width="${w}"/>`;
}

function glassPaths(c: CarShape, g: Geom) {
  const roofG = g.roofY + mm(48);
  const wsFrontX = g.cowlX + mm(40);
  const dloF = g.roofFX + mm(120);
  const dloR = g.roofRX - mm(c.wagon ? 60 : 170);
  const bTop = dloF + (dloR - dloF) * (c.doors === 4 ? 0.4 : 0.54);
  const bBot = bTop - mm(210);
  const gap = mm(26);
  const bF = beltAt(g, wsFrontX);

  const ws = `M ${f(wsFrontX)} ${f(bF - mm(6))}
    Q ${f(g.cowlX + (g.roofFX - g.cowlX) * c.wsRake + mm(20))} ${f(g.hoodY - (g.hoodY - g.roofY) * (1 - c.wsRake * 0.34) + mm(46))} ${f(g.roofFX + mm(40))} ${f(roofG)}
    L ${f(dloF)} ${f(roofG)}
    L ${f(wsFrontX + mm(250))} ${f(bF - mm(6))} Z`;

  const w1x = wsFrontX + mm(272);
  const win1 = `M ${f(w1x)} ${f(beltAt(g, w1x) - mm(14))}
    L ${f(dloF + mm(30))} ${f(roofG)}
    L ${f(bTop)} ${f(roofG)}
    L ${f(bBot)} ${f(beltAt(g, bBot) - mm(14))} Z`;

  // Ventanilla trasera: con pliegue (BMW) o con caída suave hacia la zaga.
  const kinkX = dloR - mm(190);
  const kinkMx = dloR - mm(30);
  const bK = beltAt(g, kinkX) - mm(14);
  const endX = c.kink ? kinkX : dloR + mm(c.wagon ? 20 : 60);
  const endY = c.kink ? bK : beltAt(g, endX) - mm(14);
  const win2 = c.kink
    ? `M ${f(bBot + gap)} ${f(beltAt(g, bBot + gap) - mm(14))} L ${f(bTop + gap)} ${f(roofG)} L ${f(dloR)} ${f(roofG)} L ${f(kinkMx)} ${f(bK - mm(150))} L ${f(kinkX)} ${f(bK)} Z`
    : `M ${f(bBot + gap)} ${f(beltAt(g, bBot + gap) - mm(14))} L ${f(bTop + gap)} ${f(roofG)} L ${f(dloR - mm(40))} ${f(roofG)} Q ${f(dloR + mm(30))} ${f(roofG + mm(20))} ${f(endX)} ${f(endY)} Z`;

  const blTop = g.roofRX - mm(20);
  const blBot = g.deckX - mm(60);
  const bl = `M ${f(blTop)} ${f(roofG)}
    L ${f(blBot)} ${f(g.tailTopY + mm(46))}
    L ${f(blBot - mm(150))} ${f(g.tailTopY + mm(74))}
    L ${f(blTop - mm(130))} ${f(roofG)} Z`;

  return { ws, win1, win2, bl, bTop, bBot, dloF, dloR };
}

function wheel(c: CarShape, g: Geom, cx: number, front: boolean) {
  const R = g.wr, r = g.rimR;
  const lip = r * 0.9, hub = r * 0.2, n = c.spokes;
  let spokes = "";
  const P2 = (ang: number, rad: number) => [cx + Math.cos(ang) * rad, g.wcY + Math.sin(ang) * rad];

  if (c.rim === "star") {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.14;
      const w = (Math.PI / n) * 0.62;
      const p1 = P2(a - w, hub * 1.5), p2 = P2(a + w, hub * 1.5);
      const p3 = P2(a + w * 0.45, lip), p4 = P2(a - w * 0.45, lip);
      spokes += `<path d="M${f(p1[0])} ${f(p1[1])}L${f(p2[0])} ${f(p2[1])}L${f(p3[0])} ${f(p3[1])}L${f(p4[0])} ${f(p4[1])}Z" class="cw-spoke"/>`;
    }
  } else if (c.rim === "twin") {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      spokes += `<line x1="${f(cx + Math.cos(a) * hub * 1.4)}" y1="${f(g.wcY + Math.sin(a) * hub * 1.4)}" x2="${f(cx + Math.cos(a) * lip)}" y2="${f(g.wcY + Math.sin(a) * lip)}" class="cw-spoke-l" stroke-width="${(r * 0.1).toFixed(2)}"/>`;
    }
  } else if (c.rim === "turbine") {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, a2 = a + 0.46;
      spokes += `<path d="M${f(cx + Math.cos(a) * hub * 1.5)} ${f(g.wcY + Math.sin(a) * hub * 1.5)} Q${f(cx + Math.cos(a + 0.22) * r * 0.62)} ${f(g.wcY + Math.sin(a + 0.22) * r * 0.62)} ${f(cx + Math.cos(a2) * lip)} ${f(g.wcY + Math.sin(a2) * lip)}" class="cw-spoke-l" fill="none" stroke-width="${(r * 0.12).toFixed(2)}"/>`;
    }
  } else {
    for (let ring = 0; ring < 2; ring++) {
      const rr = ring ? lip * 0.7 : lip * 0.93;
      const cnt = ring ? Math.round(n * 0.6) : n;
      for (let i = 0; i < cnt; i++) {
        const a = (i / cnt) * Math.PI * 2 + (ring ? 0.22 : 0);
        spokes += `<line x1="${f(cx + Math.cos(a) * hub * 1.3)}" y1="${f(g.wcY + Math.sin(a) * hub * 1.3)}" x2="${f(cx + Math.cos(a) * rr)}" y2="${f(g.wcY + Math.sin(a) * rr)}" class="cw-spoke-l" stroke-width="${(r * 0.05).toFixed(2)}"/>`;
      }
    }
    spokes += `<circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(lip * 0.7)}" class="cw-mesh"/>`;
  }

  const dR = r * 0.84;
  const ca = front ? -0.52 : -2.62, cw = 0.52;
  const P = (ang: number, rad: number) => `${f(cx + Math.cos(ang) * rad)} ${f(g.wcY + Math.sin(ang) * rad)}`;
  const cal = `M${P(ca - cw, dR * 0.99)} A${f(dR * 0.99)} ${f(dR * 0.99)} 0 0 1 ${P(ca + cw, dR * 0.99)} L${P(ca + cw, dR * 0.6)} A${f(dR * 0.6)} ${f(dR * 0.6)} 0 0 0 ${P(ca - cw, dR * 0.6)} Z`;

  return `<g class="cw">
    <circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(R)}" class="cw-tyre"/>
    <circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(dR)}" class="cw-disc"/>
    <path d="${cal}" class="cw-caliper" style="fill:${c.caliper || "#C8A45C"}"/>
    <g class="cw-rot">
      <circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(r)}" class="cw-rim"/>
      ${spokes}
      <circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(r * 0.95)}" class="cw-lip"/>
      <circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(r * 0.2)}" class="cw-hub"/>
    </g>
  </g>`;
}

/* Frontal visto de perfil: sólo se intuye, pero cambia el carácter del coche. */
function noseShape(c: CarShape, g: Geom) {
  if (c.nose === "kidney") {
    const kw = mm(74);
    const kTop = g.noseTopY + mm(24);
    const kBot = g.noseBotY - mm(60);
    return `<path d="M${f(g.x0 + mm(8))} ${f(kTop)} C${f(g.x0 - mm(10))} ${f(kTop + (kBot - kTop) * 0.4)} ${f(g.noseBotX - mm(6))} ${f(kBot - (kBot - kTop) * 0.3)} ${f(g.noseBotX + mm(4))} ${f(kBot)} l${f(kw)} ${f(mm(-10))} C${f(g.noseBotX + kw - mm(4))} ${f(kBot - (kBot - kTop) * 0.34)} ${f(g.x0 + kw - mm(2))} ${f(kTop + (kBot - kTop) * 0.42)} ${f(g.x0 + kw + mm(10))} ${f(kTop + mm(4))} Z" class="c-grille"/>`;
  }
  if (c.nose === "star" || c.nose === "frame") {
    // Parrilla alta (Mercedes-AMG, Audi): panel oscuro con lamas horizontales.
    const top = g.noseTopY + mm(60);
    const bot = g.noseBotY - mm(c.nose === "frame" ? 30 : 70);
    const w = mm(c.nose === "frame" ? 64 : 52);
    let bars = "";
    for (let i = 1; i < 4; i++) {
      const y = top + ((bot - top) * i) / 4;
      bars += `<line x1="${f(g.x0 + mm(4))}" y1="${f(y)}" x2="${f(g.x0 + w)}" y2="${f(y - mm(6))}" class="c-grille-bar"/>`;
    }
    return `<path d="M${f(g.x0 + mm(6))} ${f(top)} L${f(g.x0 + w + mm(8))} ${f(top - mm(6))} L${f(g.noseBotX + w)} ${f(bot - mm(8))} L${f(g.noseBotX + mm(2))} ${f(bot)} Z" class="c-grille"/>${bars}`;
  }
  // "crest": morro bajo sin parrilla (Porsche), sólo toma de aire inferior.
  return `<path d="M${f(g.noseBotX + mm(4))} ${f(g.noseBotY - mm(150))} l${f(mm(90))} ${f(mm(-8))} l${f(mm(10))} ${f(mm(110))} l${f(mm(-96))} ${f(mm(10))} Z" class="c-grille"/>`;
}

export function carSVG(c: CarShape, opt: { id: string; body: string; glass?: string; label: string }) {
  const g = geom(c);
  const gl = glassPaths(c, g);
  const uid = "k" + opt.id.replace(/[^a-z0-9]/gi, "");
  const glass = opt.glass || "#12161c";
  const a = c.aero || {};
  const path = bodyPath(c, g);
  const nR2 = 16;

  let aero = "";
  if (a.splitter) aero += `<path d="M${f(g.noseBotX)} ${f(g.noseBotY - 4)} L${f(g.x0 - mm(16))} ${f(g.noseBotY + mm(26))} L${f(g.x0 + mm(280))} ${f(g.noseBotY + mm(20))} L${f(g.noseBotX + mm(250))} ${f(g.noseBotY - 4)} Z" class="c-aero"/>`;
  if (a.skirt) aero += `<path d="M${f(g.fAx + g.archFR * 0.86)} ${f(g.sillY - 4)} C${f(g.fAx + g.archFR)} ${f(g.sillY + mm(30))} ${f(g.rAx - g.archRR)} ${f(g.sillY + mm(34))} ${f(g.rAx - g.archRR * 0.86)} ${f(g.sillY - 4)} Z" class="c-aero"/>`;
  if (a.diffuser) aero += `<path d="M${f(g.x1 - mm(760))} ${f(g.tailBotY - 2)} L${f(g.x1 - mm(700))} ${f(g.tailBotY + mm(58))} L${f(g.tailBotX + mm(14))} ${f(g.tailBotY + mm(48))} L${f(g.tailBotX)} ${f(g.tailBotY - 2)} Z" class="c-aero"/>`;
  if (a.ducktail) {
    const xs = g.deckX + (g.x1 - g.deckX) * 0.1;
    const xe = g.x1 - mm(4);
    const yt = g.tailTopY;
    aero += `<path d="M${f(xs)} ${f(yt + mm(4))} C${f(xs + (xe - xs) * 0.5)} ${f(yt - mm(40))} ${f(xe - mm(150))} ${f(yt - mm(80))} ${f(xe)} ${f(yt - mm(76))} L${f(xe)} ${f(yt - mm(20))} C${f(xe - mm(190))} ${f(yt - mm(24))} ${f(xs + (xe - xs) * 0.45)} ${f(yt + mm(2))} ${f(xs - mm(12))} ${f(yt + mm(30))} Z" class="c-body-2"/>`;
  }
  if (a.wing === "lip") {
    aero += `<path d="M${f(g.x1 - mm(300))} ${f(g.tailTopY + mm(22))} Q${f(g.x1 - mm(70))} ${f(g.tailTopY - mm(84))} ${f(g.x1 + mm(18))} ${f(g.tailTopY - mm(70))} L${f(g.x1 + mm(14))} ${f(g.tailTopY - mm(24))} Q${f(g.x1 - mm(110))} ${f(g.tailTopY - mm(6))} ${f(g.x1 - mm(292))} ${f(g.tailTopY + mm(44))} Z" class="c-aero"/>`;
  }
  if (a.wing === "gt") {
    const wy = g.tailTopY - mm(260);
    aero += `<g class="c-aero">
      <path d="M${f(g.x1 - mm(560))} ${f(wy + mm(56))} Q${f(g.x1 - mm(210))} ${f(wy - mm(20))} ${f(g.x1 + mm(80))} ${f(wy + mm(6))} L${f(g.x1 + mm(80))} ${f(wy + mm(64))} Q${f(g.x1 - mm(210))} ${f(wy + mm(44))} ${f(g.x1 - mm(560))} ${f(wy + mm(112))} Z"/>
      <path d="M${f(g.x1 - mm(400))} ${f(wy + mm(80))} L${f(g.x1 - mm(360))} ${f(g.tailTopY + mm(30))} L${f(g.x1 - mm(290))} ${f(g.tailTopY + mm(20))} L${f(g.x1 - mm(330))} ${f(wy + mm(68))} Z"/>
    </g>`;
  }

  const cutA = gl.bBot;
  const cutB = c.doors === 4 ? gl.bBot + (gl.dloR - gl.bBot) * 0.5 : null;
  const doorF = gl.dloF - mm(150);
  let lines = `
    <path d="M${f(g.cowlX + mm(20))} ${f(g.hoodY + mm(16))} C${f(g.cowlX - mm(420))} ${f(g.hoodY - mm(6))} ${f(g.x0 + mm(260))} ${f(g.noseTopY + mm(6))} ${f(g.x0 + mm(60))} ${f(g.noseTopY + mm(50))}" class="c-line c-line--soft"/>
    <path d="M${f(doorF)} ${f(beltAt(g, doorF))} L${f(doorF - mm(110))} ${f(g.sillY - 2)}" class="c-line"/>
    <path d="M${f(cutA)} ${f(beltAt(g, cutA))} L${f(cutA - mm(70))} ${f(g.sillY - 2)}" class="c-line"/>`;
  if (cutB) lines += `<path d="M${f(cutB)} ${f(beltAt(g, cutB))} L${f(cutB - mm(60))} ${f(g.sillY - 2)}" class="c-line"/>`;
  // Reflejo del hombro: la línea de luz que recorre el lateral
  const shX0 = g.fAx + g.archFR * 0.6, shX1 = g.rAx + g.archRR * 0.2;
  lines += `<path d="M${f(shX0)} ${f(beltAt(g, shX0) + mm(120))} C${f(shX0 + (shX1 - shX0) * 0.35)} ${f(beltAt(g, shX0) + mm(100))} ${f(shX0 + (shX1 - shX0) * 0.7)} ${f(beltAt(g, shX1) + mm(70))} ${f(shX1)} ${f(beltAt(g, shX1) + mm(60))}" class="c-shoulder"/>`;
  lines += `<path d="M${f(g.deckX - mm(40))} ${f(g.tailTopY + mm(60))} L${f(g.x1 - mm(30))} ${f(g.tailTopY + mm(84))}" class="c-line c-line--soft"/>`;

  const hY = (x: number) => beltAt(g, x) + mm(150);
  const h1 = cutA - mm(300);
  const exY1 = bottomAt(g, g.x1 - mm(400));
  const exY2 = bottomAt(g, g.x1 - mm(220));
  const details = `
    <rect x="${f(h1)}" y="${f(hY(h1))}" width="${f(mm(170))}" height="${f(mm(28))}" rx="3" class="c-chrome"/>
    ${cutB ? `<rect x="${f(cutB - mm(280))}" y="${f(hY(cutB - mm(280)))}" width="${f(mm(160))}" height="${f(mm(26))}" rx="3" class="c-chrome"/>` : ""}
    <path d="M${f(gl.dloF - mm(130))} ${f(beltAt(g, gl.dloF) - mm(24))} l${f(mm(-140))} ${f(mm(-52))} q${f(mm(-76))} ${f(mm(14))} ${f(mm(-52))} ${f(mm(92))} Z" class="c-mirror"/>
    <path d="M${f(g.x0 + mm(14))} ${f(g.noseTopY + mm(40))} l${f(mm(200))} ${f(mm(-12))} l${f(mm(4))} ${f(mm(50))} l${f(mm(-204))} ${f(mm(16))} Z" class="c-light"/>
    <path d="M${f(g.x0 + mm(14))} ${f(g.noseTopY + mm(40))} l${f(mm(200))} ${f(mm(-12))}" class="c-lightEdge"/>
    <path d="M${f(g.x1 - mm(28))} ${f(g.tailTopY + mm(74))} l${f(mm(-196))} ${f(mm(14))} l${f(mm(-3))} ${f(mm(56))} l${f(mm(200))} ${f(mm(-12))} Z" class="c-light c-light--rear"/>
    <rect x="${f(g.x1 - mm(400))}" y="${f(exY1)}" width="${f(mm(140))}" height="${f(mm(54))}" rx="5" class="c-exhaust"/>
    <rect x="${f(g.x1 - mm(220))}" y="${f(exY2)}" width="${f(mm(140))}" height="${f(mm(54))}" rx="5" class="c-exhaust"/>`;

  return `<svg class="carsvg" viewBox="0 ${f(g.vbY)} ${f(g.vbW)} ${f(g.vbH)}" role="img" aria-label="${opt.label}" style="--car-body:${opt.body};--car-glass:${glass}">
  <defs>
    <linearGradient id="${uid}-a" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".16"/>
      <stop offset=".30" stop-color="#fff" stop-opacity=".06"/>
      <stop offset=".55" stop-color="#000" stop-opacity=".05"/>
      <stop offset=".88" stop-color="#000" stop-opacity=".24"/>
      <stop offset="1" stop-color="#000" stop-opacity=".38"/>
    </linearGradient>
    <linearGradient id="${uid}-b" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".28" stop-color="#fff" stop-opacity=".5"/>
      <stop offset=".55" stop-color="#fff" stop-opacity=".1"/>
      <stop offset=".82" stop-color="#fff" stop-opacity=".38"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="${uid}-g" x1="0" y1="0" x2=".2" y2="1">
      <stop offset="0" stop-color="#f2e6d0" stop-opacity=".30"/>
      <stop offset=".5" stop-color="#6b6252" stop-opacity=".08"/>
      <stop offset="1" stop-color="#000" stop-opacity=".30"/>
    </linearGradient>
    <radialGradient id="${uid}-s" cx="50%" cy="50%">
      <stop offset="0" stop-color="#000" stop-opacity=".75"/>
      <stop offset=".6" stop-color="#000" stop-opacity=".25"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="${uid}-c"><path d="${path}"/></clipPath>
  </defs>
  <ellipse cx="${f((g.x0 + g.x1) / 2)}" cy="${f(GY + mm(40))}" rx="${f(g.len * 0.55)}" ry="${f(mm(120))}" fill="url(#${uid}-s)"/>
  ${aero}
  <path d="${path}" class="c-body"/>
  <g clip-path="url(#${uid}-c)">
    <path d="${path}" fill="url(#${uid}-a)"/>
    <path d="M${f(g.x0)} ${f(beltAt(g, g.x0) + mm(150))} L${f(g.x1)} ${f(beltAt(g, g.x1) + mm(60))} L${f(g.x1)} ${f(beltAt(g, g.x1) + mm(110))} L${f(g.x0)} ${f(beltAt(g, g.x0) + mm(206))} Z" fill="url(#${uid}-b)" opacity=".35"/>
    <path d="M${f(g.x0)} ${f(g.sillY - mm(210))} L${f(g.x1)} ${f(g.sillY - mm(160))} L${f(g.x1)} ${f(g.sillY + mm(60))} L${f(g.x0)} ${f(g.sillY + mm(60))} Z" fill="#000" opacity=".22"/>
  </g>
  <g class="c-glass"><path d="${gl.ws}"/><path d="${gl.win1}"/><path d="${gl.win2}"/><path d="${gl.bl}"/></g>
  <g clip-path="url(#${uid}-c)"><path d="${gl.ws}" fill="url(#${uid}-g)"/><path d="${gl.win1}" fill="url(#${uid}-g)"/><path d="${gl.win2}" fill="url(#${uid}-g)"/></g>
  ${lines}
  ${noseShape(c, g)}
  ${details}
  ${wheel(c, g, g.fAx, true)}
  ${wheel(c, g, g.rAx, false)}
  ${archLip(c, g, g.fAx, g.archFR)}
  ${archLip(c, g, g.rAx, g.archRR)}
  <path d="${path}" class="c-outline"/>
  <path d="M${f(g.x0 + nR2)} ${f(g.noseTopY)} C${f(g.x0 + (g.cowlX - g.x0) * 0.45)} ${f(g.noseTopY - mm(24))} ${f(g.cowlX - mm(340))} ${f(g.hoodY - mm(10))} ${f(g.cowlX)} ${f(g.hoodY)} Q${f(g.cowlX + (g.roofFX - g.cowlX) * c.wsRake)} ${f(g.hoodY - (g.hoodY - g.roofY) * (1 - c.wsRake * 0.34))} ${f(g.roofFX)} ${f(g.roofY)} Q${f((g.roofFX + g.roofRX) / 2)} ${f(g.roofY - g.crown)} ${f(g.roofRX)} ${f(g.roofY)}" class="c-sheen"/>
</svg>`;
}
