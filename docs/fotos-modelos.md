# Fotos de los modelos

Cómo se cambiaron las fotos de Jardines del Sur 6 (6 nov 2026) y cómo repetirlo
con otro modelo o desarrollo.

---

## 1. De dónde salen

Florencio deja las fotos originales en una subcarpeta por modelo dentro de
`jardines del sur 6/` (en la raíz del repo, NO se publica):

```
jardines del sur 6/Modelo Capua/Capua/*.jpg
jardines del sur 6/Modelo Ceiba/Ceiba/*.jpg
…
jardines del sur 6/Modelo Tabachin/Tabachin/Fachada Tabachin.jpg
```

Antes de elegir, armar una hoja de contacto por modelo (miniaturas con su
nombre de archivo) y **mirarla completa**. Revisar que ninguna foto tenga
personas.

## 2. Cómo se eligen (criterio de Florencio)

1. **La fachada siempre primero.** Es la miniatura de la tarjeta.
2. **Después, las vistas de cocina, comedor y sala juntas**: son las que más
   venden ("una vista súper linda de la cocina y sala combinadas").
3. Luego sala, cocina, recámaras, baño y lo especial de cada modelo (el roof
   garden del Ceiba, el baño con vestidor del Noni, el área de lavado del
   Capua).
4. **Fuera las repetidas**: dos cocinas casi iguales confunden más de lo que
   suman.
5. **Cuántas: 5, 9 o 13** (1 + múltiplo de 4). Con esos números la galería de la
   ficha cierra sin huecos: la principal ocupa 2x2 y las columnas son fijas (4
   en computadora, 2 en tableta, 1 en celular). Ver `principalAlta` en
   `app/(desarrollos)/_lib/ModelGallery.tsx` y `.galleryCuadrada` en
   `app/(desarrollos)/model.module.css`. Con otro número la galería sigue con
   su acomodo anterior y deja huecos.

Resultado nov 2026: Ceiba, Flamboyán y Noni 13; Capua y Cedro Plus 9 (no hay más
vistas combinadas); Tabachín 5 (fachada nueva + 4 que ya tenía).

**La Rioja 2 (7 nov 2026), `scripts/fotos-larioja2-nov2026.mjs`:** Florencio
pidió NO tocar la fachada, solo los interiores, así que la primera foto sigue
siendo `fachada.webp` (y su miniatura). Noni Elite 13 y Álamo 13 (las fotos
nuevas no traen baño: se conservó el `7.webp` de antes); Fresno Elite 9 (de 3
fotos del comedor entraron 2). En sus carpetas venían archivos repetidos con
otro nombre: comparar con `md5` antes de elegir. Las fotos viejas de Noni Elite
se quedan: la Casa Noni de La Rioja (`larioja2-noni`) usa varias.

## 3. Cómo se convierten

`node scripts/fotos-jds6-nov2026.mjs` — la lista de cada modelo está en el
propio script (archivo original → etiqueta). Escribe:

- **WebP de 1280 px de ancho, calidad 80** en `public/jardines/Modelo X/`. Nunca
  agranda una foto más chica. ~120 KB en promedio; solo cargan cuando el
  cliente las ve.
- **Miniatura de la fachada, 640 px, calidad 65** en
  `public/optimized/model-thumbs/`. Es lo único que carga la tarjeta al abrir la
  página (26–38 KB). Se conecta en `FIRST_IMAGE_THUMBS` de
  `components/PropertyCard.jsx`.
- **Nombres nuevos y descriptivos** (`casa-ceiba-jardines-del-sur-6-sala.webp`).
  Las imágenes se guardan 30 días en el navegador (`firebase.json`): con el
  mismo nombre, algunos clientes seguirían viendo las viejas.

Después, poner las rutas en `images` del modelo en `data/inventory.json` (la
primera es la fachada) y comprobar:

```bash
npm run build && python3 scripts/diseno/comparar-seo.py   # solo cambia el JSON-LD de las fichas
node scripts/diseno/verificar-pantallas.mjs /jardines-del-sur-6 /jardines-del-sur-6/casa-ceiba
```

Revisar que no haya imágenes rotas y mirar la galería en 1280, 900 y 390 px.

**Fachadas nuevas del Capua y el Cedro Plus (8 nov 2026):** Florencio las dejó
retocadas en 4K (`Fachada 4k.jpg`, y una copia `Fachada.png` más chica que no
se usa). Etiqueta nueva `fachada-edificio`, así que el webp y la miniatura
tienen nombre nuevo (`FIRST_IMAGE_THUMBS` en `PropertyCard.jsx` apunta a ella).
Para cambiar solo esos modelos: `node scripts/fotos-jds6-nov2026.mjs "Modelo
Capua" "Modelo Cedro Plus"`.

⚠️ **Las fotos retocadas pesan el doble.** Traen tanto detalle fino que a
calidad 80 la del Capua pesaba 177 KB y la del Cedro 222 (las de antes, 90 y
95), y la fachada es lo primero que carga la ficha. Con un suavizado muy leve
(0.7) y calidad 72 (`RETOCADA` en el script) quedaron en 95 y 129 KB, y sus
miniaturas en 26 y 35 KB, como antes. Comparadas al 100% casi no se
distinguen. Florencio pidió expresamente que no pesen ni pongan lento el sitio.

⚠️ **Una fachada cuadrada se ve mal en la tarjeta:** la tarjeta pinta la foto
con `objectFit: contain` y deja franjas a los lados. La del Capua venía de
3840×3840; se recorta a 4:3 por el centro (tercer valor de la lista en el
script).

## 4. Ojo

- **Mismo modelo, distinto desarrollo:** el Capua y el Cedro Plus de Lirios
  tienen sus propias fotos (`public/lirios/…`). Comparar contra ellas antes de
  usar una foto: la fachada del Cedro Plus de Jardines del Sur 6 es un edificio
  con alberca distinto al de Lirios.
- Las fotos viejas (`1.webp`, `2.webp`…) se quedaron en su carpeta porque la
  imagen que sale al compartir la página de Lirios (`ogImage` en
  `dev-content.ts`) todavía es `/jardines/Modelo Cedro Plus/1.webp`, que es el
  edificio de **Jardines del Sur 6**, no el de Lirios. Pendiente de corregir.
