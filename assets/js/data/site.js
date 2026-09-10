/* ==========================================================================
   HOFMEISTER — DATOS DEL SITIO
   ========================================================================== */

export const SITE = {
  nombre:'HOFMEISTER',
  claim:'División de calle bávara',
  fundado:1998,
  direccion:'Nave 14 · Polígono Los Ángeles · Getafe, Madrid',
  telefono:'+34 916 04 22 07',
  telHref:'+34916042207',
  email:'taller@hofmeister.es',
  horario:[
    ['Lunes a viernes','08:00 — 20:00'],
    ['Sábado','09:00 — 14:00'],
    ['Domingo','Cerrado (salvo track day)']
  ],
  coords:'40°18\'02" N · 3°43\'55" O'
};

/* --------------------------------------------------------------------------
   ETAPAS DE POTENCIA
   -------------------------------------------------------------------------- */
export const ETAPAS = [
  {
    id:'stage1', code:'ST.1', nombre:'Etapa 1', precio:690, dias:1,
    resumen:'Reprogramación sobre el hardware de serie. El despertar.',
    gainPct:0.18, torquePct:0.22,
    incluye:['Lectura y clonado de la centralita original','Mapa propio desarrollado en banco','Optimización de avance, inyección y presión de sobrealimentación','Eliminación del limitador de velocidad','Dos sesiones de banco incluidas'],
    garantia:'2 años'
  },
  {
    id:'stage2', code:'ST.2', nombre:'Etapa 2', precio:2450, dias:3,
    resumen:'Se abre el motor por fuera: admisión, escape e intercooler.',
    gainPct:0.34, torquePct:0.38,
    incluye:['Todo lo de Etapa 1','Downpipe sin catalizador o de alta celda','Intercooler de mayor volumen','Admisión de flujo libre con caja aislada','Escape de línea completa 76 mm','Mapa específico para el hardware montado'],
    garantia:'2 años'
  },
  {
    id:'stage3', code:'ST.3', nombre:'Etapa 3', precio:8900, dias:12,
    resumen:'Turbo mayor, internos forjados y gestión de fábrica al límite.',
    gainPct:0.52, torquePct:0.46,
    incluye:['Todo lo de Etapa 2','Turbo híbrido o upgrade de turbina','Bielas y pistones forjados','Bomba de gasolina de alto caudal e inyectores','Refrigeración de aceite adicional','Embrague reforzado o refuerzo de convertidor','Puesta a punto completa en banco con carga'],
    garantia:'1 año'
  }
];

/* --------------------------------------------------------------------------
   SERVICIOS
   -------------------------------------------------------------------------- */
export const SERVICIOS = [
  {
    id:'motor', num:'01', titulo:'Motor y gestión',
    desc:'Reprogramación propia sobre banco de rodillos, no ficheros comprados. Cada mapa se valida con sondas de banda ancha, temperaturas de admisión y registro de detonación.',
    puntos:['Mapas de Etapa 1 a 3','Turbos híbridos y upgrades','Forjado interno','Metanol y agua/metanol','Descarbonización y puesta a punto'],
    tag:'Banco propio 1.200 CV'
  },
  {
    id:'chasis', num:'02', titulo:'Chasis y suspensión',
    desc:'Un coche rápido que no gira no sirve para nada. Montamos, alineamos y ajustamos en báscula de cuatro apoyos hasta cuadrar reparto de pesos y precarga.',
    puntos:['Suspensiones roscadas y de 3 vías','Barras estabilizadoras y refuerzos','Alineación en báscula','Kits de ángulo para derrape','Jaulas homologadas'],
    tag:'Báscula de 4 apoyos'
  },
  {
    id:'frenos', num:'03', titulo:'Frenada',
    desc:'La potencia se compra; la frenada se gana. Kits de pinza monobloque, discos flotantes y latiguillos metálicos con purga a presión.',
    puntos:['Kits de 6 y 8 pistones','Discos flotantes 380–405 mm','Pastillas de circuito y calle','Refrigeración por conductos','Líquido de alto punto de ebullición'],
    tag:'De calle a circuito'
  },
  {
    id:'carroceria', num:'04', titulo:'Carrocería y aero',
    desc:'Ensanchados, difusores y alerones fabricados en fibra en casa. Nada de pegar plástico: bancada, molde, laminado y ajuste de panel a panel.',
    puntos:['Ensanchados a medida','Fibra de carbono preimpregnada','Alerones con perfil calculado','Pintura en cabina propia','Restauración de chapa clásica'],
    tag:'Molde y laminado propios'
  },
  {
    id:'clasicos', num:'05', titulo:'Restomod clásico',
    desc:'Un E30 no se moderniza tirando su alma a la basura. Conservamos la carrocería y el tacto, y renovamos todo lo que no se ve.',
    puntos:['Reconstrucción de S14 y M20','Inyección programable en clásicos','Frenos y suspensión modernos','Tratamiento anticorrosión completo','Tapicería y salpicadero a medida'],
    tag:'Desde 1998'
  },
  {
    id:'circuito', num:'06', titulo:'Preparación de pista',
    desc:'Servicio en boxes, telemetría, gestión de neumático y puesta a punto entre tandas. Vamos al circuito contigo.',
    puntos:['Asistencia en track day','Telemetría y análisis de vuelta','Gestión de gomas y presiones','Depósito de seguridad y extinción','Transporte en góndola'],
    tag:'Jarama · Ascari · Nürburgring'
  }
];

/* --------------------------------------------------------------------------
   PROCESO
   -------------------------------------------------------------------------- */
export const PROCESO = [
  { n:'01', t:'Diagnóstico honesto', d:'Antes de tocar nada, el coche pasa por banco y por elevador. Si el motor no está sano, te lo decimos y no te vendemos potencia.' },
  { n:'02', t:'Proyecto sobre papel', d:'Definimos objetivo, presupuesto cerrado y calendario. Recibes un dossier con cada pieza, su marca y su porqué.' },
  { n:'03', t:'Taller', d:'Fotos y vídeo de cada fase en un enlace privado. Sin sorpresas, sin extras que aparecen a mitad de factura.' },
  { n:'04', t:'Banco y validación', d:'Mínimo seis pasadas. Ajustamos hasta que la curva sea plana, segura y repetible en caliente.' },
  { n:'05', t:'Entrega y seguimiento', d:'Ficha técnica firmada, curva impresa y revisión gratuita a los 1.000 km. Y el teléfono siempre abierto.' }
];

/* --------------------------------------------------------------------------
   EQUIPO
   -------------------------------------------------------------------------- */
export const EQUIPO = [
  { n:'Iker Salgado', r:'Fundador · Mapeado', y:'Desde 1998', d:'26 años metiendo las manos en centralitas Bosch. Empezó soldando EPROM en un E30 en un garaje de Villaverde.', ini:'IS' },
  { n:'Nadia Ferrán', r:'Jefa de mecánica', y:'Desde 2009', d:'Ex-mecánica de resistencia. Si algo se rompe en pista, lo arregla antes de la siguiente tanda.', ini:'NF' },
  { n:'Bruno Oteiza', r:'Chapa y fibra', y:'Desde 2012', d:'Fabrica moldes de ensanchado a mano. Sus paneles ajustan mejor que los de fábrica y lo sabe.', ini:'BO' },
  { n:'Lea Vidal', r:'Chasis y datos', y:'Desde 2018', d:'Ingeniera de vehículos. Traduce telemetría en décimas y explica por qué tu coche subvira.', ini:'LV' }
];

/* --------------------------------------------------------------------------
   TESTIMONIOS
   -------------------------------------------------------------------------- */
export const TESTIMONIOS = [
  { t:'Llevé un E46 con 280.000 km convencido de que había que jubilarlo. Salió con 450 CV y una curva más limpia que de fábrica.', a:'Óscar M.', c:'M3 E46 · Etapa 2', k:'Madrid' },
  { t:'Me presupuestaron 8.900 € y la factura fueron 8.900 €. En este mundillo eso vale más que los caballos.', a:'Rebeca L.', c:'M4 F82 · Etapa 3', k:'Valencia' },
  { t:'Restauraron el 2002 de mi padre. Cuando lo arrancó, se le saltaron las lágrimas. No hay factura que pague eso.', a:'Diego A.', c:'2002 turbo · Restomod', k:'Bilbao' },
  { t:'Vinieron al Jarama con nosotros. Cambiaron reglaje entre tandas y bajé 2,4 segundos por vuelta.', a:'Marta S.', c:'M2 Competition · Pista', k:'Segovia' },
  { t:'Pedí un widebody y me hicieron tres bocetos antes de cortar nada. Ese respeto por el coche no se encuentra fácil.', a:'Yeray P.', c:'M3 G80 · Ensanchado', k:'Sevilla' },
  { t:'El único taller que me ha dicho “eso no te lo hagas, no lo vas a notar”. Volveré siempre.', a:'Carla R.', c:'335i E92 · Etapa 1', k:'Zaragoza' }
];

/* --------------------------------------------------------------------------
   PREGUNTAS FRECUENTES
   -------------------------------------------------------------------------- */
export const FAQ = [
  { q:'¿Pierdo la garantía del concesionario?', a:'Sí, en el grupo motopropulsor. Es la verdad y no te la vamos a maquillar. Por eso cubrimos con garantía propia de dos años la mecánica sobre la que trabajamos en Etapa 1 y 2, con el mismo alcance que un taller oficial y sin franquicia.' },
  { q:'¿Cuánta potencia aguanta mi motor de serie?', a:'Depende del bloque, no del modelo. Un S55 aguanta 620 CV con internos de serie si la refrigeración y el combustible acompañan; un N54 con 200.000 km puede no llegar a 400. Por eso todo empieza con una compresión y una pasada de diagnóstico antes de presupuestar.' },
  { q:'¿Pasaré la ITV?', a:'Todo lo que montamos con homologación se documenta y se tramita: reformas de importancia, fichas reducidas y proyecto de ingeniería cuando hace falta. Lo que no es homologable te lo decimos antes de cobrarte, no después.' },
  { q:'¿Trabajáis solo con BMW?', a:'Trabajamos solo con BMW. Es una decisión, no una limitación: 26 años sobre la misma marca nos dan un archivo de mapas, tolerancias y fallos típicos que no tendríamos repartiéndonos entre diez fabricantes.' },
  { q:'¿Cuánto tarda un proyecto?', a:'Una Etapa 1 se hace en el día. Una Etapa 2, entre dos y cuatro días según disponibilidad de piezas. Una Etapa 3 o un ensanchado completo son entre tres semanas y tres meses, y la fecha se cierra por escrito antes de empezar.' },
  { q:'¿Puedo ver el coche mientras trabajáis?', a:'Puedes venir cuando quieras dentro del horario y tienes un enlace privado con fotos y vídeo de cada fase. Nada de esto se hace a puerta cerrada.' },
  { q:'¿Hacéis envíos de piezas o mapas a distancia?', a:'Piezas sí, mapas no. Un fichero sin banco es una lotería con tu motor. Si estás lejos, organizamos el transporte y te alojamos el coche mientras trabajamos.' },
  { q:'¿Qué pasa si algo falla después?', a:'Traes el coche, lo miramos y lo arreglamos. Si la culpa es nuestra, no pagas. Llevamos 26 años en el mismo polígono precisamente por eso.' }
];

/* --------------------------------------------------------------------------
   CIFRAS
   -------------------------------------------------------------------------- */
export const CIFRAS = [
  { n:2860, u:'', l:'Proyectos entregados', d:'desde 1998' },
  { n:1200, u:'CV', l:'Techo del banco', d:'rodillos de inercia y carga' },
  { n:26,   u:'años', l:'Solo BMW', d:'sin excepciones' },
  { n:98,   u:'%', l:'Vuelven o recomiendan', d:'encuesta interna 2025' }
];

/* --------------------------------------------------------------------------
   EXTRAS DEL CONFIGURADOR
   kg  : variación de peso        dias: días añadidos de taller
   -------------------------------------------------------------------------- */
export const EXTRAS = [
  { id:'escape',  n:'Escape de titanio',        p:3400, kg:-14, dias:1, hp:.02,
    d:'Línea completa 76 mm con válvulas y colectores de igual longitud.' },
  { id:'frenos',  n:'Frenos de 6 pistones',     p:4200, kg:6,   dias:1, grip:.02,
    d:'Pinza monobloque, disco flotante de 380 mm y latiguillos metálicos.' },
  { id:'susp',    n:'Suspensión de 3 vías',     p:3900, kg:-5,  dias:2, grip:.05, low:1,
    d:'Roscada con compresión alta y baja separadas, ajustada en báscula.' },
  { id:'wide',    n:'Ensanchado en carbono',    p:7800, kg:16,  dias:14, grip:.06, wide:1,
    d:'60 mm por lado, molde propio, laminado y ajustado panel a panel.' },
  { id:'aero',    n:'Aero funcional',           p:5600, kg:9,   dias:5, drag:.06, aero:1,
    d:'Splitter, difusor de fondo plano y alerón con perfil calculado.' },
  { id:'llantas', n:'Llanta forjada',           p:4900, kg:-18, dias:1, grip:.03, wheels:1,
    d:'Forjada en una pieza, 19" o 20", con neumático semi-slick.' },
  { id:'jaula',   n:'Jaula homologada',         p:3200, kg:38,  dias:6,
    d:'Multipunto soldada, con documentación FIA para competición.' },
  { id:'refri',   n:'Refrigeración de competición', p:2700, kg:8, dias:2, hp:.015,
    d:'Radiador de agua y aceite sobredimensionados y bomba eléctrica.' },
  { id:'interior',n:'Baquets y arnés',          p:3100, kg:-26, dias:3,
    d:'Asientos de carbono, arnés de seis puntos y desmontaje de traseros.' }
];

/* Colores de fábrica reinterpretados */
export const COLORES = [
  { id:'alpin',   n:'Alpinweiß III', c:'#F0F0ED' },
  { id:'schwarz', n:'Schwarz II',    c:'#101216' },
  { id:'estoril', n:'Estorilblau',   c:'#1B4F9C' },
  { id:'imola',   n:'Imolarot',      c:'#A80E14' },
  { id:'dakar',   n:'Dakargelb',     c:'#E4AE00' },
  { id:'laguna',  n:'Laguna Seca',   c:'#57B0E4' },
  { id:'fire',    n:'Fire Orange',   c:'#EF5A1E' },
  { id:'nardo',   n:'Nardograu',     c:'#9CA1A7' },
  { id:'isleman', n:'Isle of Man',   c:'#25493A' },
  { id:'sepia',   n:'Sepiabraun',    c:'#5B4433' }
];
