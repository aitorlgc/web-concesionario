/* ==========================================================================
   HOFMEISTER — GENERADOR PARAMÉTRICO DE PERFILES BMW  ·  v2
   --------------------------------------------------------------------------
   Cada modelo se define con cotas reales en milímetros (largo, alto, batalla,
   voladizo, diámetro de rueda) más la posición de los cuatro quiebres de la
   silueta. El generador produce un SVG completo: carrocería con sombreado de
   chapa, cristalería con el pliegue Hofmeister, llantas con disco y pinza,
   aerodinámica y sombra proyectada. Cero fotografías, cero dependencias.
   ========================================================================== */

const S   = 0.235;   // unidades SVG por milímetro
const GY  = 420;     // línea de suelo
const PAD = 40;      // margen lateral

const mm = v => v * S;
const f  = v => v.toFixed(1);

/* ==========================================================================
   CATÁLOGO
   ========================================================================== */
export const CARS = [
  {
    id:'2002turbo', name:'2002 turbo', chassis:'E20', year:1973, years:'1973–1974', era:'clasico',
    engine:'M10 · 2.0 4L turbo', stockHp:170, tuneHp:265, torque:240,
    tag:'El primer turbo de serie europeo. Y el primer aviso.',
    kg:1080, cda:0.62, L:4230, H:1410, WB:2500, FO:800, WD:620,
    cowl:1396, roofF:1819, roofR:2961, deck:3384,
    hoodH:905, beltH:935, beltRise:8, sillH:255, noseTopH:900, noseBotH:330,
    tailTopH:950, tailBotH:380, noseLean:34, tailLean:-14,
    archF:34, archR:38, crown:30, wsRake:.70, blRake:.62,
    rim:'mesh', spokes:16, rimD:0.70, body:'#EFEEE9', glass:'#1C222A',
    aero:{ splitter:1, ducktail:1 }, stripes:'m-classic', badge:'turbo'
  },
  {
    id:'csl-e9', name:'3.0 CSL', chassis:'E9', year:1973, years:'1972–1975', era:'clasico',
    engine:'M30 · 3.2 6L', stockHp:206, tuneHp:340, torque:286,
    tag:'Batmóvil. El acta fundacional de Motorsport.',
    kg:1270, cda:0.66, L:4630, H:1370, WB:2625, FO:810, WD:630,
    cowl:1759, roofF:2176, roofR:3334, deck:3797,
    hoodH:885, beltH:905, beltRise:10, sillH:240, noseTopH:880, noseBotH:310,
    tailTopH:930, tailBotH:360, noseLean:30, tailLean:-10,
    archF:30, archR:34, crown:24, wsRake:.66, blRake:.56,
    rim:'star', spokes:5, rimD:0.68, body:'#E7E5DE', glass:'#1A2029',
    aero:{ splitter:1, wing:'batwing' }, stripes:'m-classic', badge:'csl'
  },
  {
    id:'m1', name:'M1', chassis:'E26', year:1978, years:'1978–1981', era:'clasico',
    engine:'M88 · 3.5 6L', stockHp:277, tuneHp:470, torque:330,
    tag:'Motor central, lápiz de Giugiaro, alma de Procar.',
    kg:1300, cda:0.60, L:4360, H:1140, WB:2560, FO:780, WD:640, midEngine:true,
    cowl:1090, roofF:1744, roofR:2616, deck:2965,
    hoodH:665, beltH:775, beltRise:26, sillH:180, noseTopH:640, noseBotH:190,
    tailTopH:955, tailBotH:300, noseLean:96, tailLean:-6,
    archF:26, archR:34, crown:12, wsRake:.46, blRake:.30,
    rim:'turbine', spokes:12, rimD:0.66, body:'#E2401F', glass:'#151A21',
    aero:{ splitter:1, ducktail:1, skirt:1, louvers:1 }, stripes:'none', badge:'procar'
  },
  {
    id:'m3-e30', name:'M3', chassis:'E30', year:1986, years:'1986–1991', era:'clasico',
    engine:'S14 · 2.3 4L', stockHp:200, tuneHp:330, torque:240,
    tag:'El turismo más laureado de la historia. Sin discusión.',
    kg:1200, cda:0.65, L:4360, H:1365, WB:2562, FO:800, WD:610,
    cowl:1439, roofF:1875, roofR:3052, deck:3488,
    hoodH:885, beltH:905, beltRise:14, sillH:240, noseTopH:880, noseBotH:300,
    tailTopH:945, tailBotH:355, noseLean:28, tailLean:-16,
    archF:40, archR:46, crown:26, wsRake:.68, blRake:.60, boxArch:true,
    rim:'mesh', spokes:18, rimD:0.72, body:'#DFDED8', glass:'#1D232B',
    aero:{ splitter:1, ducktail:1, skirt:1 }, stripes:'m-classic', badge:'m'
  },
  {
    id:'m5-e34', name:'M5', chassis:'E34', year:1991, years:'1988–1995', era:'clasico',
    engine:'S38 · 3.8 6L', stockHp:340, tuneHp:460, torque:400,
    tag:'Traje de ejecutivo, guantes de boxeo. Hecha a mano.',
    kg:1670, cda:0.68, L:4720, H:1412, WB:2761, FO:855, WD:640, doors:4,
    cowl:1652, roofF:2077, roofR:3493, deck:3918,
    hoodH:905, beltH:925, beltRise:18, sillH:250, noseTopH:900, noseBotH:320,
    tailTopH:950, tailBotH:370, noseLean:26, tailLean:-14,
    archF:28, archR:30, crown:28, wsRake:.66, blRake:.58,
    rim:'turbine', spokes:20, rimD:0.74, body:'#1C2C47', glass:'#131820',
    aero:{ skirt:1 }, stripes:'none', badge:'m'
  },
  {
    id:'m3-e36', name:'M3', chassis:'E36', year:1995, years:'1992–1999', era:'clasico',
    engine:'S50B32 · 3.2 6L', stockHp:321, tuneHp:430, torque:350,
    tag:'La escuela del sobreviraje europeo empieza aquí.',
    kg:1460, cda:0.66, L:4433, H:1335, WB:2700, FO:830, WD:630,
    cowl:1463, roofF:1906, roofR:3103, deck:3546,
    hoodH:835, beltH:865, beltRise:22, sillH:225, noseTopH:830, noseBotH:270,
    tailTopH:900, tailBotH:330, noseLean:38, tailLean:-12,
    archF:32, archR:36, crown:22, wsRake:.62, blRake:.52,
    rim:'twin', spokes:17, rimD:0.73, body:'#2E7050', glass:'#181E26',
    aero:{ splitter:1, skirt:1, ducktail:1 }, stripes:'none', badge:'m'
  },
  {
    id:'m5-e39', name:'M5', chassis:'E39', year:2000, years:'1998–2003', era:'clasico',
    engine:'S62 · 5.0 V8', stockHp:400, tuneHp:540, torque:500,
    tag:'Para media internet, la mejor berlina jamás construida.',
    kg:1795, cda:0.70, L:4783, H:1412, WB:2830, FO:870, WD:660, doors:4,
    cowl:1674, roofF:2104, roofR:3539, deck:3970,
    hoodH:895, beltH:915, beltRise:24, sillH:235, noseTopH:890, noseBotH:290,
    tailTopH:945, tailBotH:350, noseLean:34, tailLean:-12,
    archF:26, archR:28, crown:26, wsRake:.64, blRake:.54,
    rim:'star', spokes:5, rimD:0.75, body:'#152840', glass:'#131820',
    aero:{ splitter:1, skirt:1 }, stripes:'none', badge:'m'
  },
  {
    id:'m3-csl-e46', name:'M3 CSL', chassis:'E46', year:2003, years:'2003', era:'clasico',
    engine:'S54 · 3.2 6L', stockHp:360, tuneHp:450, torque:370,
    tag:'Techo de carbono, 110 kg menos y admisión que da miedo.',
    kg:1385, cda:0.66, L:4492, H:1372, WB:2731, FO:840, WD:650,
    cowl:1482, roofF:1932, roofR:3144, deck:3594,
    hoodH:860, beltH:885, beltRise:26, sillH:215, noseTopH:855, noseBotH:250,
    tailTopH:920, tailBotH:305, noseLean:44, tailLean:-10,
    archF:32, archR:38, crown:24, wsRake:.60, blRake:.48,
    rim:'twin', spokes:19, rimD:0.76, body:'#C9CED3', glass:'#161C24',
    aero:{ splitter:1, skirt:1, ducktail:1, diffuser:1 }, stripes:'none', badge:'csl'
  },
  {
    id:'m3-gts-e92', name:'M3 GTS', chassis:'E92', year:2010, years:'2010', era:'moderno',
    engine:'S65 · 4.4 V8 atmosférico', stockHp:450, tuneHp:560, torque:440,
    tag:'Naranja fuego, jaula atornillada y 8.300 rpm de gloria.',
    kg:1530, cda:0.70, L:4615, H:1418, WB:2761, FO:870, WD:670,
    cowl:1523, roofF:1984, roofR:3231, deck:3692,
    hoodH:895, beltH:920, beltRise:30, sillH:210, noseTopH:890, noseBotH:235,
    tailTopH:960, tailBotH:290, noseLean:52, tailLean:-8,
    archF:34, archR:40, crown:26, wsRake:.58, blRake:.46,
    rim:'twin', spokes:19, rimD:0.77, body:'#F04E17', glass:'#151A22',
    aero:{ splitter:1, skirt:1, wing:'gt', diffuser:1 }, stripes:'none', badge:'gts'
  },
  {
    id:'m4-f82', name:'M4', chassis:'F82', year:2015, years:'2014–2020', era:'moderno',
    engine:'S55 · 3.0 6L biturbo', stockHp:431, tuneHp:620, torque:550,
    tag:'Biturbo, carbono y una nube de humo permanente.',
    kg:1572, cda:0.70, L:4671, H:1383, WB:2812, FO:880, WD:680,
    cowl:1541, roofF:2009, roofR:3270, deck:3737,
    hoodH:875, beltH:900, beltRise:34, sillH:205, noseTopH:870, noseBotH:225,
    tailTopH:935, tailBotH:275, noseLean:58, tailLean:-6,
    archF:36, archR:42, crown:22, wsRake:.56, blRake:.44,
    rim:'twin', spokes:20, rimD:0.78, body:'#3F4B58', glass:'#141920',
    aero:{ splitter:1, skirt:1, ducktail:1, diffuser:1 }, stripes:'none', badge:'m'
  },
  {
    id:'m3-g80', name:'M3 Competition', chassis:'G80', year:2021, years:'2021–', era:'moderno',
    engine:'S58 · 3.0 6L biturbo', stockHp:510, tuneHp:720, torque:650,
    tag:'La parrilla que partió internet en dos. Y ganó.',
    kg:1730, cda:0.73, L:4794, H:1433, WB:2857, FO:890, WD:690, doors:4, bigKidney:true,
    cowl:1678, roofF:2109, roofR:3548, deck:3979,
    hoodH:920, beltH:950, beltRise:36, sillH:210, noseTopH:915, noseBotH:230,
    tailTopH:975, tailBotH:290, noseLean:56, tailLean:-8,
    archF:34, archR:40, crown:26, wsRake:.56, blRake:.46,
    rim:'star', spokes:10, rimD:0.80, body:'#1D5192', glass:'#131820',
    aero:{ splitter:1, skirt:1, ducktail:1, diffuser:1 }, stripes:'none', badge:'m'
  },
  {
    id:'m4-csl-g82', name:'M4 CSL', chassis:'G82', year:2022, years:'2022', era:'moderno',
    engine:'S58 · 3.0 6L biturbo', stockHp:550, tuneHp:780, torque:650,
    tag:'100 kg menos, sin asientos traseros y con récord en el Ring.',
    kg:1625, cda:0.70, L:4794, H:1393, WB:2857, FO:890, WD:700, bigKidney:true,
    cowl:1582, roofF:2061, roofR:3356, deck:3835,
    hoodH:895, beltH:925, beltRise:34, sillH:200, noseTopH:890, noseBotH:215,
    tailTopH:950, tailBotH:270, noseLean:62, tailLean:-6,
    archF:38, archR:44, crown:20, wsRake:.54, blRake:.42,
    rim:'star', spokes:10, rimD:0.81, body:'#13171C', glass:'#0D1116',
    aero:{ splitter:1, skirt:1, diffuser:1, wing:'lip' }, stripes:'m-mod', badge:'csl'
  }
];

export const CARS_BY_ID = Object.fromEntries(CARS.map(c => [c.id, c]));

/* ==========================================================================
   GEOMETRÍA
   ========================================================================== */
function geom(c){
  const x0 = PAD;
  const len = mm(c.L);
  const x1 = x0 + len;
  const wr = mm(c.WD) / 2;
  const fAx = x0 + mm(c.FO);
  const rAx = fAx + mm(c.WB);
  const wcY = GY - wr;
  const Y = h => GY - mm(h);
  const X = d => x0 + mm(d);

  return {
    x0, x1, len, wr, fAx, rAx, wcY,
    sillY:Y(c.sillH),
    beltY:Y(c.beltH),
    beltRY:Y(c.beltH + (c.beltRise || 0)),
    roofY:Y(c.H),
    hoodY:Y(c.hoodH),
    noseTopY:Y(c.noseTopH),
    noseBotY:Y(c.noseBotH),
    tailTopY:Y(c.tailTopH),
    tailBotY:Y(c.tailBotH),
    noseBotX:x0 + mm(c.noseLean || 0),
    tailBotX:x1 + mm(c.tailLean || 0),
    cowlX:X(c.cowl), roofFX:X(c.roofF), roofRX:X(c.roofR), deckX:X(c.deck),
    archFR:wr + mm(c.archF),
    archRR:wr + mm(c.archR),
    rimR:wr * c.rimD,
    crown:mm(c.crown),
    vbW:len + PAD * 2,
    vbY:Y(c.H) - 58,
    vbH:mm(c.H) + 58 + 86
  };
}

const archCut = (g, ax, R) => {
  // El arco nunca baja del eje: por debajo, el paso cae recto hasta el faldón.
  const endY = Math.min(g.sillY, g.wcY + mm(30));
  const dy = endY - g.wcY;
  const dx = Math.sqrt(Math.max(R * R - dy * dy, 1));
  return { l:ax - dx, r:ax + dx, top:g.wcY - R, endY };
};

/* Altura del bajo de la carrocería en un punto x (para escapes y faldones) */
const bottomAt = (g, x) => {
  const aR = archCut(g, g.rAx, g.archRR);
  if (x >= aR.r){
    const t = Math.min(Math.max((x - aR.r) / (g.tailBotX - aR.r), 0), 1);
    return g.sillY + (g.tailBotY - g.sillY) * t;
  }
  return g.sillY;
};

/* Línea de cintura: sube hacia atrás (efecto cuña) */
const beltAt = (g, x) => {
  const t = Math.min(Math.max((x - g.cowlX) / (g.deckX - g.cowlX), 0), 1);
  return g.beltY + (g.beltRY - g.beltY) * t;
};

function bodyPath(c, g){
  const aF = archCut(g, g.fAx, g.archFR);
  const aR = archCut(g, g.rAx, g.archRR);
  const nR = 16, tR = 14;
  const p = [];

  // Frontal, de abajo a arriba
  p.push(`M ${f(g.noseBotX)} ${f(g.noseBotY)}`);
  p.push(`C ${f(g.noseBotX - mm(30))} ${f(g.noseBotY - mm(120))} ${f(g.x0)} ${f(g.noseTopY + mm(230))} ${f(g.x0)} ${f(g.noseTopY + nR)}`);
  p.push(`Q ${f(g.x0)} ${f(g.noseTopY)} ${f(g.x0 + nR)} ${f(g.noseTopY)}`);
  // Capó
  p.push(`C ${f(g.x0 + (g.cowlX - g.x0) * .45)} ${f(g.noseTopY - mm(24))} ${f(g.cowlX - mm(340))} ${f(g.hoodY - mm(10))} ${f(g.cowlX)} ${f(g.hoodY)}`);
  // Parabrisas
  p.push(`Q ${f(g.cowlX + (g.roofFX - g.cowlX) * c.wsRake)} ${f(g.hoodY - (g.hoodY - g.roofY) * (1 - c.wsRake * .34))} ${f(g.roofFX)} ${f(g.roofY)}`);
  // Techo
  p.push(`Q ${f((g.roofFX + g.roofRX) / 2)} ${f(g.roofY - g.crown)} ${f(g.roofRX)} ${f(g.roofY)}`);
  // Luneta / montante C
  p.push(`Q ${f(g.roofRX + (g.deckX - g.roofRX) * c.blRake)} ${f(g.roofY + (g.tailTopY - g.roofY) * (1 - c.blRake * .42))} ${f(g.deckX)} ${f(g.tailTopY)}`);
  // Portón / maletero
  p.push(`C ${f(g.deckX + (g.x1 - g.deckX) * .45)} ${f(g.tailTopY - mm(16))} ${f(g.x1 - mm(120))} ${f(g.tailTopY - mm(8))} ${f(g.x1 - tR)} ${f(g.tailTopY)}`);
  p.push(`Q ${f(g.x1)} ${f(g.tailTopY)} ${f(g.x1)} ${f(g.tailTopY + tR)}`);
  // Zaga
  p.push(`C ${f(g.x1)} ${f(g.tailTopY + mm(240))} ${f(g.tailBotX + mm(24))} ${f(g.tailBotY - mm(110))} ${f(g.tailBotX)} ${f(g.tailBotY)}`);
  // Bajos, de atrás hacia delante
  p.push(`L ${f(aR.r)} ${f(g.sillY)}`);
  p.push(arch(c, g, aR, g.archRR));
  p.push(`L ${f(aF.r)} ${f(g.sillY)}`);
  p.push(arch(c, g, aF, g.archFR));
  p.push(`L ${f(g.noseBotX)} ${f(g.noseBotY)} Z`);
  return p.join(' ');
}

function arch(c, g, a, R){
  return `L ${f(a.r)} ${f(a.endY)} A ${f(R)} ${f(R)} 0 0 0 ${f(a.l)} ${f(a.endY)} L ${f(a.l)} ${f(g.sillY)}`;
}

/* Labio del paso de rueda: trazo que marca el ensanchado */
function archLip(c, g, ax, R){
  const a = archCut(g, ax, R);
  const w = c.boxArch ? 5.5 : 3.2;
  return `<path d="M${f(a.r)} ${f(g.sillY)} L${f(a.r)} ${f(a.endY)} A ${f(R)} ${f(R)} 0 0 0 ${f(a.l)} ${f(a.endY)} L${f(a.l)} ${f(g.sillY)}" class="c-arch" stroke-width="${w}"/>`;
}

/* ==========================================================================
   CRISTALERÍA — con el pliegue Hofmeister
   ========================================================================== */
function glassPaths(c, g){
  const roofG   = g.roofY + mm(48);
  const wsFrontX = g.cowlX + mm(40);
  const aPost   = mm(120);
  const dloF    = g.roofFX + aPost;
  const dloR    = g.roofRX - mm(60);
  const bTop    = dloF + (dloR - dloF) * (c.doors === 4 ? .40 : .54);
  const bBot    = bTop - mm(210);
  const gap     = mm(26);

  const bF = beltAt(g, wsFrontX);

  // Parabrisas (sigue la inclinación del pilar A)
  const ws = `M ${f(wsFrontX)} ${f(bF - mm(6))}
    Q ${f(g.cowlX + (g.roofFX - g.cowlX) * c.wsRake + mm(20))} ${f(g.hoodY - (g.hoodY - g.roofY) * (1 - c.wsRake * .34) + mm(46))} ${f(g.roofFX + mm(40))} ${f(roofG)}
    L ${f(dloF)} ${f(roofG)}
    L ${f(wsFrontX + mm(250))} ${f(bF - mm(6))} Z`;

  // Ventanilla delantera
  const w1x = wsFrontX + mm(272);
  const win1 = `M ${f(w1x)} ${f(beltAt(g, w1x) - mm(14))}
    L ${f(dloF + mm(30))} ${f(roofG)}
    L ${f(bTop)} ${f(roofG)}
    L ${f(bBot)} ${f(beltAt(g, bBot) - mm(14))} Z`;

  // Ventanilla trasera con el pliegue Hofmeister: la esquina inferior
  // trasera se adelanta y forma el gancho característico de la marca.
  const kinkX  = dloR - mm(190);
  const kinkMx = dloR - mm(30);
  const bK     = beltAt(g, kinkX) - mm(14);
  const win2 = `M ${f(bBot + gap)} ${f(beltAt(g, bBot + gap) - mm(14))}
    L ${f(bTop + gap)} ${f(roofG)}
    L ${f(dloR)} ${f(roofG)}
    L ${f(kinkMx)} ${f(bK - mm(150))}
    L ${f(kinkX)} ${f(bK)} Z`;

  const kink = `M ${f(dloR)} ${f(roofG)} L ${f(kinkMx)} ${f(bK - mm(150))} L ${f(kinkX)} ${f(bK)}`;

  // Luneta
  const blF = dloR + mm(50);
  const bl = `M ${f(blF)} ${f(roofG)}
    L ${f(g.roofRX + (g.deckX - g.roofRX) * .80)} ${f(g.tailTopY + mm(80))}
    L ${f(g.roofRX + (g.deckX - g.roofRX) * .30)} ${f(g.tailTopY + mm(115))}
    L ${f(blF - mm(230))} ${f(roofG)} Z`;

  return { ws, win1, win2, kink, bl, bTop, bBot, dloF, dloR, roofG, bF };
}

/* ==========================================================================
   LLANTAS
   ========================================================================== */
function wheel(c, g, cx, front){
  const R = g.wr, r = g.rimR;
  const lip = r * .9, hub = r * .2, n = c.spokes;
  let spokes = '';

  if (c.rim === 'star'){
    for (let i = 0; i < n; i++){
      const a = (i / n) * Math.PI * 2 + .14;
      const w = (Math.PI / n) * .62;
      const P = (ang, rad) => [cx + Math.cos(ang) * rad, g.wcY + Math.sin(ang) * rad];
      const p1 = P(a - w, hub * 1.5), p2 = P(a + w, hub * 1.5);
      const p3 = P(a + w * .45, lip), p4 = P(a - w * .45, lip);
      spokes += `<path d="M${f(p1[0])} ${f(p1[1])}L${f(p2[0])} ${f(p2[1])}L${f(p3[0])} ${f(p3[1])}L${f(p4[0])} ${f(p4[1])}Z" class="cw-spoke"/>`;
    }
  } else if (c.rim === 'twin'){
    for (let i = 0; i < n; i++){
      const a = (i / n) * Math.PI * 2;
      spokes += `<line x1="${f(cx + Math.cos(a) * hub * 1.4)}" y1="${f(g.wcY + Math.sin(a) * hub * 1.4)}" x2="${f(cx + Math.cos(a) * lip)}" y2="${f(g.wcY + Math.sin(a) * lip)}" class="cw-spoke-l" stroke-width="${(r * .1).toFixed(2)}"/>`;
    }
  } else if (c.rim === 'turbine'){
    for (let i = 0; i < n; i++){
      const a = (i / n) * Math.PI * 2, a2 = a + .46;
      spokes += `<path d="M${f(cx + Math.cos(a) * hub * 1.5)} ${f(g.wcY + Math.sin(a) * hub * 1.5)} Q${f(cx + Math.cos(a + .22) * r * .62)} ${f(g.wcY + Math.sin(a + .22) * r * .62)} ${f(cx + Math.cos(a2) * lip)} ${f(g.wcY + Math.sin(a2) * lip)}" class="cw-spoke-l" fill="none" stroke-width="${(r * .12).toFixed(2)}"/>`;
    }
  } else { // malla BBS
    for (let ring = 0; ring < 2; ring++){
      const rr = ring ? lip * .70 : lip * .93;
      const cnt = ring ? Math.round(n * .6) : n;
      for (let i = 0; i < cnt; i++){
        const a = (i / cnt) * Math.PI * 2 + (ring ? .22 : 0);
        spokes += `<line x1="${f(cx + Math.cos(a) * hub * 1.3)}" y1="${f(g.wcY + Math.sin(a) * hub * 1.3)}" x2="${f(cx + Math.cos(a) * rr)}" y2="${f(g.wcY + Math.sin(a) * rr)}" class="cw-spoke-l" stroke-width="${(r * .05).toFixed(2)}"/>`;
      }
    }
    spokes += `<circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(lip * .70)}" class="cw-mesh"/>`;
  }

  const dR = r * .84;
  const ca = front ? -.52 : -2.62, cw = .52;
  const P = (ang, rad) => `${f(cx + Math.cos(ang) * rad)} ${f(g.wcY + Math.sin(ang) * rad)}`;
  const cal = `M${P(ca - cw, dR * .99)} A${f(dR * .99)} ${f(dR * .99)} 0 0 1 ${P(ca + cw, dR * .99)} L${P(ca + cw, dR * .6)} A${f(dR * .6)} ${f(dR * .6)} 0 0 0 ${P(ca - cw, dR * .6)} Z`;

  return `<g class="cw">
    <circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(R)}" class="cw-tyre"/>
    <circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(R * .985)}" class="cw-tyre-w"/>
    <circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(dR)}" class="cw-disc"/>
    <circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(dR * .78)}" class="cw-disc-in"/>
    <path d="${cal}" class="cw-caliper"/>
    <circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(r)}" class="cw-rim"/>
    ${spokes}
    <circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(r * .95)}" class="cw-lip"/>
    <circle cx="${f(cx)}" cy="${f(g.wcY)}" r="${f(r * .2)}" class="cw-hub"/>
  </g>`;
}

/* ==========================================================================
   SVG COMPLETO
   ========================================================================== */
export function carSVG(c, opt = {}){
  const g  = geom(c);
  const gl = glassPaths(c, g);
  const uid = 'k' + c.id.replace(/[^a-z0-9]/gi, '');
  const body  = opt.body  || c.body;
  const glass = opt.glass || c.glass;
  const a = c.aero || {};
  const path = bodyPath(c, g);

  /* ---- Aerodinámica --------------------------------------------------- */
  let aero = '';
  if (a.splitter) aero += `<path d="M${f(g.noseBotX)} ${f(g.noseBotY - 4)} L${f(g.x0 - mm(16))} ${f(g.noseBotY + mm(26))} L${f(g.x0 + mm(280))} ${f(g.noseBotY + mm(20))} L${f(g.noseBotX + mm(250))} ${f(g.noseBotY - 4)} Z" class="c-aero"/>`;
  if (a.skirt) aero += `<path d="M${f(g.fAx + g.archFR * .86)} ${f(g.sillY - 4)} C${f(g.fAx + g.archFR)} ${f(g.sillY + mm(30))} ${f(g.rAx - g.archRR)} ${f(g.sillY + mm(34))} ${f(g.rAx - g.archRR * .86)} ${f(g.sillY - 4)} Z" class="c-aero"/>`;
  if (a.diffuser) aero += `<path d="M${f(g.x1 - mm(760))} ${f(g.tailBotY - 2)} L${f(g.x1 - mm(700))} ${f(g.tailBotY + mm(58))} L${f(g.tailBotX + mm(14))} ${f(g.tailBotY + mm(48))} L${f(g.tailBotX)} ${f(g.tailBotY - 2)} Z" class="c-aero"/>`;
  if (a.louvers){
    for (let i = 0; i < 5; i++){
      const x = g.roofRX + mm(30) + i * mm(58);
      aero += `<line x1="${f(x)}" y1="${f(g.roofY + mm(60))}" x2="${f(x + mm(40))}" y2="${f(g.tailTopY + mm(40))}" class="c-louver"/>`;
    }
  }
  if (a.ducktail){
    const xs = g.deckX + (g.x1 - g.deckX) * .10;
    const xe = g.x1 - mm(4);
    const yt = g.tailTopY;
    aero += `<path d="M${f(xs)} ${f(yt + mm(4))} C${f(xs + (xe - xs) * .5)} ${f(yt - mm(60))} ${f(xe - mm(150))} ${f(yt - mm(118))} ${f(xe)} ${f(yt - mm(112))} L${f(xe)} ${f(yt - mm(30))} C${f(xe - mm(190))} ${f(yt - mm(34))} ${f(xs + (xe - xs) * .45)} ${f(yt + mm(2))} ${f(xs - mm(12))} ${f(yt + mm(30))} Z" class="c-body-2"/>`;
  }
  if (a.wing === 'batwing'){
    const wy = g.tailTopY - mm(360);
    aero += `<g class="c-aero">
      <path d="M${f(g.x1 - mm(640))} ${f(wy + mm(30))} L${f(g.x1 + mm(60))} ${f(wy)} L${f(g.x1 + mm(60))} ${f(wy + mm(74))} L${f(g.x1 - mm(640))} ${f(wy + mm(104))} Z"/>
      <rect x="${f(g.x1 - mm(560))}" y="${f(wy + mm(60))}" width="${f(mm(52))}" height="${f(g.tailTopY - wy - mm(50))}"/>
      <rect x="${f(g.x1 - mm(150))}" y="${f(wy + mm(42))}" width="${f(mm(52))}" height="${f(g.tailTopY - wy - mm(30))}"/>
    </g>`;
  }
  if (a.wing === 'gt'){
    const wy = g.tailTopY - mm(330);
    aero += `<g class="c-aero">
      <path d="M${f(g.x1 - mm(560))} ${f(wy + mm(56))} Q${f(g.x1 - mm(210))} ${f(wy - mm(20))} ${f(g.x1 + mm(150))} ${f(wy + mm(6))} L${f(g.x1 + mm(150))} ${f(wy + mm(74))} Q${f(g.x1 - mm(210))} ${f(wy + mm(44))} ${f(g.x1 - mm(560))} ${f(wy + mm(122))} Z"/>
      <path d="M${f(g.x1 - mm(400))} ${f(wy + mm(80))} L${f(g.x1 - mm(360))} ${f(g.tailTopY + mm(30))} L${f(g.x1 - mm(290))} ${f(g.tailTopY + mm(20))} L${f(g.x1 - mm(330))} ${f(wy + mm(68))} Z"/>
    </g>`;
  }
  if (a.wing === 'lip'){
    aero += `<path d="M${f(g.x1 - mm(300))} ${f(g.tailTopY + mm(22))} Q${f(g.x1 - mm(70))} ${f(g.tailTopY - mm(84))} ${f(g.x1 + mm(18))} ${f(g.tailTopY - mm(70))} L${f(g.x1 + mm(14))} ${f(g.tailTopY - mm(24))} Q${f(g.x1 - mm(110))} ${f(g.tailTopY - mm(6))} ${f(g.x1 - mm(292))} ${f(g.tailTopY + mm(44))} Z" class="c-aero"/>`;
  }

  /* ---- Líneas de chapa ------------------------------------------------ */
  const cutA = gl.bBot;
  const cutB = c.doors === 4 ? gl.bBot + (gl.dloR - gl.bBot) * .5 : null;
  const doorF = gl.dloF - mm(150);
  let lines = `
    <path d="M${f(g.cowlX + mm(20))} ${f(g.hoodY + mm(16))} C${f(g.cowlX - mm(420))} ${f(g.hoodY - mm(6))} ${f(g.x0 + mm(260))} ${f(g.noseTopY + mm(6))} ${f(g.x0 + mm(60))} ${f(g.noseTopY + mm(50))}" class="c-line c-line--soft"/>
    <path d="M${f(doorF)} ${f(beltAt(g, doorF))} L${f(doorF - mm(110))} ${f(g.sillY - 2)}" class="c-line"/>
    <path d="M${f(cutA)} ${f(beltAt(g, cutA))} L${f(cutA - mm(70))} ${f(g.sillY - 2)}" class="c-line"/>`;
  if (cutB) lines += `<path d="M${f(cutB)} ${f(beltAt(g, cutB))} L${f(cutB - mm(60))} ${f(g.sillY - 2)}" class="c-line"/>`;
  lines += `<path d="M${f(g.deckX - mm(40))} ${f(g.tailTopY + mm(60))} L${f(g.x1 - mm(30))} ${f(g.tailTopY + mm(84))}" class="c-line c-line--soft"/>`;

  /* ---- Detalles -------------------------------------------------------- */
  const hY = x => beltAt(g, x) + mm(150);
  const h1 = cutA - mm(300);
  const exY1 = bottomAt(g, g.x1 - mm(400));
  const exY2 = bottomAt(g, g.x1 - mm(220));
  const details = `
    <rect x="${f(h1)}" y="${f(hY(h1))}" width="${f(mm(170))}" height="${f(mm(32))}" rx="3" class="c-chrome"/>
    ${cutB ? `<rect x="${f(cutB - mm(280))}" y="${f(hY(cutB - mm(280)))}" width="${f(mm(160))}" height="${f(mm(30))}" rx="3" class="c-chrome"/>` : ''}
    <path d="M${f(gl.dloF - mm(130))} ${f(beltAt(g, gl.dloF) - mm(24))} l${f(mm(-140))} ${f(mm(-52))} q${f(mm(-76))} ${f(mm(14))} ${f(mm(-52))} ${f(mm(92))} Z" class="c-mirror"/>
    <path d="M${f(g.x0 + mm(24))} ${f(g.noseTopY + mm(52))} l${f(mm(190))} ${f(mm(-14))} l${f(mm(4))} ${f(mm(64))} l${f(mm(-192))} ${f(mm(16))} Z" class="c-light"/>
    <path d="M${f(g.x1 - mm(28))} ${f(g.tailTopY + mm(74))} l${f(mm(-196))} ${f(mm(14))} l${f(mm(-3))} ${f(mm(70))} l${f(mm(200))} ${f(mm(-12))} Z" class="c-light c-light--rear"/>
    <rect x="${f(g.x1 - mm(400))}" y="${f(exY1)}" width="${f(mm(140))}" height="${f(mm(58))}" rx="5" class="c-exhaust"/>
    <rect x="${f(g.x1 - mm(220))}" y="${f(exY2)}" width="${f(mm(140))}" height="${f(mm(58))}" rx="5" class="c-exhaust"/>
    <circle cx="${f(g.rAx - mm(280))}" cy="${f(beltAt(g, g.rAx) + mm(250))}" r="${f(mm(66))}" class="c-fuel"/>`;

  /* ---- Parrilla ------------------------------------------------------- */
  const kw = c.bigKidney ? mm(74) : mm(48);
  const kTop = c.bigKidney ? g.noseTopY + mm(24) : g.noseTopY + mm(120);
  const kBot = c.bigKidney ? g.noseBotY - mm(60) : g.noseBotY - mm(230);
  const kidney = `<path d="M${f(g.x0 + mm(8))} ${f(kTop)} C${f(g.x0 - mm(10))} ${f(kTop + (kBot - kTop) * .4)} ${f(g.noseBotX - mm(6))} ${f(kBot - (kBot - kTop) * .3)} ${f(g.noseBotX + mm(4))} ${f(kBot)} l${f(kw)} ${f(mm(-10))} C${f(g.noseBotX + kw - mm(4))} ${f(kBot - (kBot - kTop) * .34)} ${f(g.x0 + kw - mm(2))} ${f(kTop + (kBot - kTop) * .42)} ${f(g.x0 + kw + mm(10))} ${f(kTop + mm(4))} Z" class="c-kidney"/>`;

  /* ---- Franjas M ------------------------------------------------------- */
  let stripes = '';
  if (c.stripes === 'm-classic'){
    const h = mm(24), sx = g.x0 + mm(90), ex = g.x1 - mm(90);
    ['var(--m-blue)','var(--m-violet)','var(--m-red)'].forEach((col, i) => {
      const y0 = beltAt(g, sx) + mm(268) + i * h * 1.18;
      const y1 = beltAt(g, ex) + mm(268) + i * h * 1.18;
      stripes += `<path d="M${f(sx)} ${f(y0)} L${f(ex)} ${f(y1)} L${f(ex)} ${f(y1 + h)} L${f(sx)} ${f(y0 + h)} Z" fill="${col}" opacity=".92"/>`;
    });
  }
  if (c.stripes === 'm-mod'){
    const h = mm(26);
    ['var(--m-blue)','var(--m-violet)','var(--m-red)'].forEach((col, i) => {
      const xa = g.x0 + mm(180), xb = g.cowlX - mm(60);
      const ya = g.noseTopY + mm(40) + i * h * 1.25;
      const yb = g.hoodY + mm(16) + i * h * 1.25;
      stripes += `<path d="M${f(xa)} ${f(ya)} L${f(xb)} ${f(yb)} L${f(xb)} ${f(yb + h)} L${f(xa)} ${f(ya + h)} Z" fill="${col}" opacity=".95"/>`;
    });
  }

  /* ---- Cotas de plano técnico ------------------------------------------ */
  let dims = '';
  if (opt.blueprint){
    const by = GY + mm(190);
    dims = `<g class="c-dim">
      <path d="M${f(g.x0)} ${f(by - 9)} V${f(by + 9)} M${f(g.x1)} ${f(by - 9)} V${f(by + 9)} M${f(g.x0)} ${f(by)} H${f(g.x1)}"/>
      <text x="${f((g.x0 + g.x1) / 2)}" y="${f(by - 16)}" text-anchor="middle">${c.L} MM</text>
      <path d="M${f(g.fAx)} ${f(g.wcY)} H${f(g.rAx)}" stroke-dasharray="7 6"/>
      <circle cx="${f(g.fAx)}" cy="${f(g.wcY)}" r="3"/><circle cx="${f(g.rAx)}" cy="${f(g.wcY)}" r="3"/>
      <text x="${f((g.fAx + g.rAx) / 2)}" y="${f(g.wcY - 14)}" text-anchor="middle">BATALLA ${c.WB}</text>
    </g>`;
  }

  return `<svg class="carsvg${opt.blueprint ? ' carsvg--blueprint' : ''}" viewBox="0 ${f(g.vbY)} ${f(g.vbW)} ${f(g.vbH)}" role="img" aria-label="Perfil técnico BMW ${c.name} ${c.chassis}" style="--car-body:${body};--car-glass:${glass}">
  <defs>
    <linearGradient id="${uid}-a" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".26"/>
      <stop offset=".30" stop-color="#fff" stop-opacity=".05"/>
      <stop offset=".55" stop-color="#000" stop-opacity=".05"/>
      <stop offset=".88" stop-color="#000" stop-opacity=".34"/>
      <stop offset="1" stop-color="#000" stop-opacity=".52"/>
    </linearGradient>
    <linearGradient id="${uid}-b" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity=".0"/>
      <stop offset=".28" stop-color="#fff" stop-opacity=".55"/>
      <stop offset=".55" stop-color="#fff" stop-opacity=".12"/>
      <stop offset=".82" stop-color="#fff" stop-opacity=".42"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="${uid}-g" x1="0" y1="0" x2=".2" y2="1">
      <stop offset="0" stop-color="#a9d8ff" stop-opacity=".34"/>
      <stop offset=".5" stop-color="#4d6a8c" stop-opacity=".10"/>
      <stop offset="1" stop-color="#000" stop-opacity=".30"/>
    </linearGradient>
    <radialGradient id="${uid}-s" cx="50%" cy="50%">
      <stop offset="0" stop-color="#000" stop-opacity=".66"/>
      <stop offset=".6" stop-color="#000" stop-opacity=".22"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="${uid}-c"><path d="${path}"/></clipPath>
  </defs>

  <ellipse cx="${f((g.x0 + g.x1) / 2)}" cy="${f(GY + mm(46))}" rx="${f(g.len * .53)}" ry="${f(mm(140))}" fill="url(#${uid}-s)"/>
  ${aero}
  <path d="${path}" class="c-body"/>
  <g clip-path="url(#${uid}-c)">
    <path d="${path}" fill="url(#${uid}-a)"/>
    <path d="M${f(g.x0)} ${f(beltAt(g, g.x0) + mm(200))} L${f(g.x1)} ${f(beltAt(g, g.x1) + mm(90))} L${f(g.x1)} ${f(beltAt(g, g.x1) + mm(190))} L${f(g.x0)} ${f(beltAt(g, g.x0) + mm(320))} Z" fill="url(#${uid}-b)" opacity=".5"/>
    <path d="M${f(g.x0)} ${f(g.sillY - mm(210))} L${f(g.x1)} ${f(g.sillY - mm(160))} L${f(g.x1)} ${f(g.sillY + mm(60))} L${f(g.x0)} ${f(g.sillY + mm(60))} Z" fill="#000" opacity=".34"/>
    ${stripes}
  </g>
  <g class="c-glass">
    <path d="${gl.ws}"/><path d="${gl.win1}"/><path d="${gl.win2}"/><path d="${gl.bl}"/>
  </g>
  <g class="c-glass-gl" clip-path="url(#${uid}-c)">
    <path d="${gl.ws}" fill="url(#${uid}-g)"/><path d="${gl.win1}" fill="url(#${uid}-g)"/><path d="${gl.win2}" fill="url(#${uid}-g)"/>
  </g>
  <path d="${gl.kink}" class="c-kink"/>
  ${lines}
  ${kidney}
  ${details}
  ${wheel(c, g, g.fAx, true)}
  ${wheel(c, g, g.rAx, false)}
  ${archLip(c, g, g.fAx, g.archFR)}
  ${archLip(c, g, g.rAx, g.archRR)}
  <path d="${path}" class="c-outline"/>
  ${dims}
</svg>`;
}

export const carMeta = geom;
