# High Cars

Landing de un concesionario de alta gama alemana (km 0 y ocasión), hecha con Next.js 16,
Tailwind CSS 4 y Motion siguiendo el flujo de claude-webkit.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

- `src/lib/stock.ts`: los coches (precio, km, frase del asesor, cotas para el dibujo).
- `src/lib/car-art.ts`: dibuja cada coche en SVG a partir de sus medidas (adaptado de HOFMEISTER).
- `src/lib/recomendar.ts`: la lógica del asesor "¿Qué coche va contigo?".

Pendiente antes de publicar (buscar `TODO`): teléfono, WhatsApp y email reales, redes sociales,
reseñas reales y, si se quiere, Formspree para el formulario.
