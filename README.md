# HOFMEISTER — taller de tuning BMW

Sitio completo para un taller ficticio especializado en BMW, en Getafe (Madrid).
Estático, sin dependencias, sin proceso de compilación y **sin una sola fotografía**:
todo lo que se ve está dibujado o generado por código.

```bash
npm run dev          # sirve en http://127.0.0.1:4173
# o, sin Node:
python3 -m http.server 4173
```

También funciona abriendo `index.html` directamente si tu navegador permite módulos
ES desde `file://`; servirlo por HTTP es más fiable.

---

## Qué tiene dentro

| Página | Qué hay |
|---|---|
| `index.html` | Portada: fondo WebGL, manifiesto del pliegue Hofmeister, servicios, etapas, banco de potencia interactivo, garaje, línea temporal horizontal 1973–2022, cifras, testimonios |
| `taller.html` | Servicios en detalle, proceso de cinco pasos, inventario de la nave, equipo y compromisos |
| `garaje.html` | Nueve proyectos filtrables con ficha completa: comparador antes/después, tabla técnica y curva de banco |
| `configurador.html` | Chasis, color, etapa y extras; el dibujo del coche, las prestaciones, la curva y el presupuesto se recalculan en vivo |
| `contacto.html` | Ficha de cita en cuatro pasos con validación propia, plano del polígono y preguntas frecuentes |
| `legal.html` | Aviso legal, privacidad y créditos técnicos |

---

## Decisiones técnicas

**Ilustraciones de coches generadas por código.**
`assets/js/data/car-art.js` describe doce BMW con cotas reales en milímetros —largo,
alto, batalla, voladizo, diámetro de rueda— y cuatro quiebres de silueta. A partir de
ahí construye el SVG completo: carrocería, sombreado de chapa, cristalería con el
*pliegue Hofmeister* del montante C, llantas con disco y pinza, aerodinámica y sombra.
Cambiar la altura de faldón o el ensanchado es cambiar un número, y por eso el
configurador puede redibujar el coche a cada clic.

**Curvas de banco con física de verdad.**
`assets/js/modules/dyno.js` modela el par con una curva paramétrica y **deriva** la
potencia de él: `P (kW) = par (Nm) × régimen (rpm) ÷ 9.549`. El final de la meseta de
par se resuelve por bisección hasta que la potencia máxima coincide con la del motor,
así que la curva y la cifra nunca se contradicen. `perf.js` calcula el 0–100 como el
mayor de dos límites —potencia y adherencia— y la velocidad máxima despejando
`P = ½·ρ·CdA·v³`.

**Fondo WebGL propio.**
`hero-gl.js` es un *fragment shader* GLSL escrito para este proyecto: rejilla en
perspectiva, niebla, textura de asfalto, estelas en los colores M y bruma de calor.
Reacciona al ratón, al scroll y a los aceleronazos. En modo día se reimprime como
tinta de color sobre papel en lugar de invertirse.

**Motor sintetizado.**
`sound.js` no carga ningún archivo de audio: sintetiza un seis cilindros en línea con
osciladores en los armónicos de la frecuencia de encendido (`rpm ÷ 60 × 3`), ruido
filtrado para la admisión, silbido de turbina, válvula de descarga y un filtro de
escape que se abre con las vueltas. Está silenciado por defecto.

**Todo autocontenido.**
Las cinco familias tipográficas (Anton, Barlow, Barlow Condensed, Big Shoulders
Display y JetBrains Mono, todas bajo SIL OFL) están alojadas en `assets/fonts/`.
No hay CDN, ni analítica, ni peticiones a terceros. La web funciona sin conexión.

---

## Accesibilidad

- HTML semántico, navegación completa por teclado y foco visible en todo.
- `aria-expanded`, `aria-pressed`, `aria-current`, `role="tab"`, `aria-live` y foco
  atrapado en el menú y en las fichas modales.
- Contraste AA en modo noche y en modo día.
- Con **reducir movimiento** activo: sin animaciones, la línea temporal pasa a ser un
  carrusel con desplazamiento normal y el fondo WebGL se sustituye por un degradado.
- El sonido nunca arranca solo.

## Detalles escondidos

- Código Konami —o teclear `M3`— activa el **modo M**.
- El cuentavueltas de la esquina traduce el scroll en régimen de motor y marcha.
- El botón «Dar gas» acelera de verdad: sube el shader y suena el motor.
- Lo que configures viaja al formulario de cita y lo rellena solo.

---

## Estructura

```
assets/
  css/    tokens · base · components · sections · pages · car · fonts
  js/
    data/     car-art.js (generador de coches) · site.js · projects.js
    lib/      util.js
    modules/  hero-gl · dyno · perf · sound · hud · timeline · nav · reveal · …
    pages/    home · taller · garaje · configurador · contacto · legal
  fonts/  woff2 autoalojados
  svg/    marca, favicon y open graph
```

---

Proyecto de demostración. Hofmeister Garage S.L. no existe; BMW y las denominaciones
de modelo citadas pertenecen a sus titulares y se emplean de forma descriptiva.
