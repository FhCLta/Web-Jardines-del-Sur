# /inventario.json — inventario para el CRM (KloseAI)

**URL:** https://alttahomescancun.mx/inventario.json
**Quién lo lee:** el CRM de Florencio, una vez al día, desde su servidor. Su IA
lo usa para saber qué modelos existen en cada desarrollo y cuáles se ofrecen al
redactar seguimientos.

## Reglas (acordadas con Florencio, 3 oct 2026)

- **Sin precios, sin promociones, sin medidas.** La IA nunca los menciona. Las
  medidas (`m2_construccion`, `m2_terreno`) van siempre en `null`: en
  departamentos el m² es un mínimo ("desde") y la IA lo daría como exacto. Los
  campos se quedan para no romper el formato.
- Todos los desarrollos (JdS7 con `"estado": "proximamente"`, declarado en
  `data/silos.json`) y todos los modelos con ficha, incluidos los agotados.
- **Fuera:** lo que tiene `oculto_web` (la Casa Noni de La Rioja 2).
- Un modelo vive SIEMPRE dentro de su desarrollo: `casa-noni` existe en JdS6 y
  en JdS7 y son productos distintos.
- `actualizado` = fecha del deploy, hora de Cancún (-05:00).

## Cómo se genera

`app/inventario.json/route.ts`, al compilar, con `getInventory()` — la misma
función que alimenta las fichas. Nunca se edita a mano: cambia solo cuando
cambia `data/inventory.json` y se publica.

Cabeceras en `firebase.json`: `X-Robots-Tag: noindex`, `Cache-Control: public,
max-age=3600`, **sin CORS**. No está en el sitemap.

⚠️ El CRM depende de los nombres de campo y de los valores permitidos
(`venta|proximamente|agotado`, `casa|departamento`,
`disponible|agotado|proximamente`). Agregar campos sí; renombrar o quitar, no.

Es un contrato distinto de `/api/precios.json` (app de expedientes), que sí
lleva precios y sí abre CORS. Ver `docs/api-precios.md`.
