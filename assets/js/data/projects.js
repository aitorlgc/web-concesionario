/* ==========================================================================
   HOFMEISTER — EL GARAJE: PROYECTOS ENTREGADOS
   ========================================================================== */

export const CATEGORIAS = [
  { id:'todo',      n:'Todo' },
  { id:'clasico',   n:'Clásicos' },
  { id:'moderno',   n:'Modernos' },
  { id:'widebody',  n:'Ensanchados' },
  { id:'pista',     n:'Pista' },
  { id:'derrape',   n:'Derrape' }
];

export const PROYECTOS = [
  {
    id:'p-e30-hormigon', car:'m3-e30', ref:'HM-0417',
    titulo:'HORMIGÓN', sub:'M3 E30 · Restomod de calle',
    cats:['clasico','widebody'], anio:2024, meses:9,
    livery:{ body:'#9C9E9B', glass:'#171C23' },
    resumen:'Un E30 M3 de 1989 encontrado bajo una lona en Guadalajara. Once meses de chapa y un S14 llevado a 2.5 litros con inyección programable. Nada por fuera grita; todo por debajo lo hace.',
    antes:{ cv:200, nm:240, kg:1200, s100:6.7 },
    despues:{ cv:318, nm:295, kg:1085, s100:4.9 },
    trabajo:[
      'Desmontaje integral y chorreado de la carrocería',
      'Sustitución de pasos de rueda, faldones y piso trasero',
      'S14 llevado a 2.5 l con cigüeñal de carrera larga y forjado completo',
      'Inyección programable con cuerpos individuales de 48 mm',
      'Suspensión roscada de 3 vías y refuerzo de torretas',
      'Freno de 4 pistones con disco de 330 mm delante'
    ],
    quote:'El objetivo era que pareciera de serie a diez metros y otra cosa a diez centímetros.'
  },
  {
    id:'p-g80-cuartel', car:'m3-g80', ref:'HM-0511',
    titulo:'CUARTEL', sub:'M3 G80 · Etapa 3 y ensanchado',
    cats:['moderno','widebody'], anio:2025, meses:4,
    livery:{ body:'#20242A', glass:'#0F1318' },
    resumen:'S58 con turbos híbridos, refrigeración duplicada y un ensanchado de 60 mm por lado fabricado en molde propio. 720 CV que llegan al suelo porque el chasis fue lo primero, no lo último.',
    antes:{ cv:510, nm:650, kg:1730, s100:3.9 },
    despues:{ cv:724, nm:880, kg:1668, s100:3.2 },
    trabajo:[
      'Turbos híbridos con rueda compresora de 58 mm',
      'Intercooler de agua-aire con circuito independiente',
      'Ensanchado de 60 mm por lado en carbono preimpregnado',
      'Llanta forjada 20" con neumático semi-slick',
      'Refuerzo de embrague y refrigeración de transmisión',
      'Escape completo de titanio con válvulas'
    ],
    quote:'La parrilla ya era polémica. Le añadimos 210 CV para que la discusión valiera la pena.'
  },
  {
    id:'p-e36-humo', car:'m3-e36', ref:'HM-0288',
    titulo:'HUMO', sub:'M3 E36 · Máquina de derrape',
    cats:['clasico','derrape','pista'], anio:2023, meses:5,
    livery:{ body:'#D8DEE4', glass:'#141A21' },
    resumen:'Kit de ángulo de 65°, jaula homologada y un S50 que vive a 7.000 rpm sin quejarse. Construido para durar una temporada entera de campeonato, no para una foto.',
    antes:{ cv:321, nm:350, kg:1460, s100:5.5 },
    despues:{ cv:428, nm:412, kg:1298, s100:4.6 },
    trabajo:[
      'Jaula multipunto soldada y homologada FIA',
      'Kit de ángulo de dirección de 65° con cremallera rápida',
      'Autoblocante de discos con reparto ajustable',
      'Depósito de seguridad y extinción a bordo',
      'Radiador de agua y aceite sobredimensionados',
      'Cableado íntegro rehecho con conectores estancos'
    ],
    quote:'Todo lo que no aportaba grados de ángulo o litros de refrigerante se quedó fuera.'
  },
  {
    id:'p-e39-notario', car:'m5-e39', ref:'HM-0350',
    titulo:'EL NOTARIO', sub:'M5 E39 · Sleeper absoluto',
    cats:['clasico'], anio:2024, meses:6,
    livery:{ body:'#141A24', glass:'#101419' },
    resumen:'Nada por fuera. Llanta de serie restaurada, altura de serie, escape con el mismo sonido. Dentro, un S62 con árboles, admisión y una gestión reescrita desde cero.',
    antes:{ cv:400, nm:500, kg:1795, s100:5.3 },
    despues:{ cv:521, nm:588, kg:1770, s100:4.4 },
    trabajo:[
      'Árboles de levas de perfil agresivo y muelles reforzados',
      'Admisión individual con trompetas variables',
      'Colectores de acero inoxidable de igual longitud',
      'Gestión programable con lambda de banda ancha por bancada',
      'Refrigeración de aceite y bomba de agua eléctrica',
      'Restauración completa de llanta y suspensión de serie'
    ],
    quote:'El cliente pidió literalmente que nadie pudiera notarlo. Misión cumplida hasta que abres gas.'
  },
  {
    id:'p-e92-naranja', car:'m3-gts-e92', ref:'HM-0463',
    titulo:'NARANJA MECÁNICA', sub:'M3 GTS E92 · Track weapon',
    cats:['moderno','pista'], anio:2025, meses:3,
    livery:{ body:'#F0561E', glass:'#131820' },
    resumen:'Un GTS ya nace preparado. Nosotros lo llevamos donde BMW no podía por garantía: 8.500 rpm, aero recalculada y 140 kg menos que el M3 de calle.',
    antes:{ cv:450, nm:440, kg:1530, s100:4.4 },
    despues:{ cv:562, nm:478, kg:1452, s100:3.9 },
    trabajo:[
      'Admisión de carbono con caja aislada térmicamente',
      'Escape completo de titanio y colectores de igual longitud',
      'Alerón de perfil calculado con soportes al chasis',
      'Difusor trasero funcional y planos de fondo',
      'Frenos cerámicos con conductos de refrigeración',
      'Amortiguación de 3 vías con reglaje por circuito'
    ],
    quote:'Un V8 atmosférico a 8.500 rpm es un argumento que no admite réplica.'
  },
  {
    id:'p-2002-abuelo', car:'2002turbo', ref:'HM-0102',
    titulo:'EL ABUELO', sub:'2002 turbo · Restauración total',
    cats:['clasico'], anio:2023, meses:14,
    livery:{ body:'#F2F0EA', glass:'#1B212A' },
    resumen:'Catorce meses. Chapa nueva en 38 puntos, turbo KKK reconstruido y una tapicería rehecha con el mismo tejido original. El coche del padre de un cliente, devuelto al mundo.',
    antes:{ cv:170, nm:240, kg:1080, s100:6.9 },
    despues:{ cv:243, nm:302, kg:1042, s100:5.8 },
    trabajo:[
      'Chapa nueva en 38 puntos y tratamiento de cavidades',
      'Turbo KKK reconstruido con actuador ajustable',
      'Inyección mecánica sustituida por gestión electrónica oculta',
      'Frenos delanteros de 4 pistones ocultos tras llanta original',
      'Tapicería reproducida con tejido de época',
      'Pintura en dos capas con acabado de época'
    ],
    quote:'No queríamos un 2002 mejor. Queríamos el 2002 que él recordaba.'
  },
  {
    id:'p-f82-nocturno', car:'m4-f82', ref:'HM-0399',
    titulo:'NOCTURNO', sub:'M4 F82 · Etapa 2+ de calle',
    cats:['moderno'], anio:2024, meses:2,
    livery:{ body:'#2B3038', glass:'#12161C' },
    resumen:'El equilibrio que casi nadie busca: 610 CV, aire acondicionado que enfría, maletero utilizable y un consumo que permite ir a Bilbao sin repostar dos veces.',
    antes:{ cv:431, nm:550, kg:1572, s100:4.1 },
    despues:{ cv:612, nm:790, kg:1560, s100:3.5 },
    trabajo:[
      'Downpipes de alta celda y línea de escape 76 mm',
      'Intercooler de mayor volumen con ventilación forzada',
      'Bomba de alta presión mejorada',
      'Mapa de gasolina 98 y mapa alternativo E85',
      'Refuerzo de embrague y soportes de motor',
      'Suspensión roscada de confort ajustable'
    ],
    quote:'Un coche de 600 CV que tu pareja acepta usar el domingo es la ingeniería más difícil.'
  },
  {
    id:'p-e46-blanco', car:'m3-csl-e46', ref:'HM-0231',
    titulo:'PAPEL', sub:'M3 CSL E46 · Puesta a cero',
    cats:['clasico','pista'], anio:2023, meses:7,
    livery:{ body:'#E8EAEC', glass:'#151A21' },
    resumen:'Un CSL con 190.000 km y el S54 pidiendo casquillos. Se abrió, se midió, se reconstruyó. Sale con más potencia que nuevo y con la conciencia tranquila.',
    antes:{ cv:360, nm:370, kg:1385, s100:4.9 },
    despues:{ cv:441, nm:398, kg:1352, s100:4.3 },
    trabajo:[
      'Reconstrucción completa del S54 con casquillos de biela',
      'Culata rectificada y guías nuevas',
      'Admisión de carbono revisada y filtro de competición',
      'Escape de titanio con catalizadores deportivos',
      'Puesta a punto en banco a 8.200 rpm',
      'Sustitución de bujes y silentblocks por poliuretano'
    ],
    quote:'Reconstruir un S54 bien cuesta lo que cuesta. Hacerlo mal cuesta el motor entero.'
  },
  {
    id:'p-g82-record', car:'m4-csl-g82', ref:'HM-0540',
    titulo:'RÉCORD', sub:'M4 CSL G82 · Cliente de circuito',
    cats:['moderno','pista','widebody'], anio:2025, meses:5,
    livery:{ body:'#0F1216', glass:'#0B0E12' },
    resumen:'Ya venía con 550 CV y sin asientos traseros. Le añadimos aero real, refrigeración de competición y una gestión que aguanta veinte minutos a fondo sin recortar.',
    antes:{ cv:550, nm:650, kg:1625, s100:3.7 },
    despues:{ cv:781, nm:902, kg:1588, s100:3.0 },
    trabajo:[
      'Turbos de mayor caudal con wastegate externa',
      'Sistema de agua-metanol de dos etapas',
      'Alerón de cola de cisne y difusor de fondo plano',
      'Refrigeración de caja de cambios y diferencial',
      'Barras estabilizadoras huecas ajustables',
      'Telemetría embarcada con 24 canales'
    ],
    quote:'Veinte minutos a fondo sin que la centralita recorte. Ese era el único requisito.'
  }
];

export const PROYECTOS_BY_ID = Object.fromEntries(PROYECTOS.map(p => [p.id, p]));
