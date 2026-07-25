import { createRequire } from "node:module";
const require = createRequire("/Users/florencioleonardohurtadocastaneda/Documents/Git_Web Jardines/Web-Jardines-del-Sur/");
const sharp = require("sharp");
import { mkdir } from "node:fs/promises";
import path from "node:path";

const PUB = "/Users/florencioleonardohurtadocastaneda/Documents/Git_Web Jardines/Web-Jardines-del-Sur/public";
const OUT = path.join(PUB, "brochure-img");
await mkdir(OUT, { recursive: true });

// misma regla de slug que brImg() en CatalogPage.tsx
function slug(src) {
  return src
    .replace(/^\//, "")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// [ruta origen, ancho destino]
const IMAGES = [
  ["/optimized/hero/alberca-desktop.webp", 1600], // portada full-bleed
  ["/jardines/Modelo Flamboyan/1.webp", 1300],
  ["/jardines/Modelo Ceiba/1.webp", 1300],
  ["/jardines/Modelo Tabachin/1.webp", 1300],
  ["/jardines/Modelo Noni/1.webp", 1300],
  ["/jardines/amenidades/alberca.webp", 1000],
  ["/jardines/amenidades/gimnasio.webp", 1000],
  ["/jardines/amenidades/juegos-infantiles.webp", 1000],
  ["/jardines/amenidades/skate-park.webp", 1000],
  ["/jardines/amenidades/areas-verdes.webp", 1000],
];

for (const [src, width] of IMAGES) {
  const inFile = path.join(PUB, src);
  const outFile = path.join(OUT, `${slug(src)}.jpg`);
  await sharp(inFile)
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(outFile);
  const m = await sharp(outFile).metadata();
  console.log(`${slug(src)}.jpg  ${m.width}x${m.height}  ${(m.size / 1024).toFixed(0)}KB`);
}
