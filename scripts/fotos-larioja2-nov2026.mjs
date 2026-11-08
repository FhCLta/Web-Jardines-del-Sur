// Fotos nuevas de La Rioja 2 (nov 2026), elegidas de las carpetas que armó
// Florencio en "La rioja 2/Casa X/X/". Pidió NO tocar la fachada: la primera
// foto de cada modelo sigue siendo fachada.webp (y su miniatura de la tarjeta).
// Después, las vistas de sala, comedor y cocina; luego recámaras, baño y lo
// especial de cada casa. 9 o 13 por modelo: con 1 grande + 8 o + 12 la galería
// de la ficha cierra sin huecos (docs/fotos-modelos.md).
// Fuera las repetidas: en Álamo 10.jpg = planta-baja-…jpg y 9.jpg =
// sala-principal-…jpg (mismo archivo); en Noni Elite 1.jpg = 14.jpg.
// Las fotos viejas (2.webp, 3.webp…) se quedan en su carpeta: la Casa Noni de
// La Rioja (larioja2-noni) usa varias de la del Noni Elite.
// Uso: node scripts/fotos-larioja2-nov2026.mjs → escribe los webp y muestra la
// lista de rutas para data/inventory.json.
import sharp from "sharp";
import fs from "fs";
import path from "path";

const ORIGEN = "La rioja 2";
const ANCHO = 1280; // nunca se agranda una foto más chica
const CALIDAD = 80; // calidad alta: casi no se nota contra el original

// [archivo original, etiqueta] o ["=", ruta pública que ya existe y se conserva]
const SELECCION = {
  "Casa Noni Elite": {
    slug: "casa-noni-elite",
    sub: "Noni Elite",
    fotos: [
      ["=", "/larioja2/Casa Noni Elite/fachada.webp"],
      ["3.jpg", "sala"],
      ["4.jpg", "comedor"],
      ["2.jpg", "cocina"],
      ["1.jpg", "estancia"],
      ["6.jpg", "escalera"],
      ["7.jpg", "estudio"],
      ["8.jpg", "recamara-principal"],
      ["10.jpg", "vestidor"],
      ["11.jpg", "bano"],
      ["9.jpg", "recamara-2"],
      ["12.jpg", "recamara-3"],
      ["13.jpg", "terraza"],
    ],
  },
  // Las fotos nuevas no traen baño: se conserva el de antes (7.webp).
  "Casa Modelo Alamo": {
    slug: "casa-modelo-alamo",
    sub: "Alamo",
    fotos: [
      ["=", "/larioja2/Casa Modelo Alamo/fachada.webp"],
      ["10.jpg", "sala-y-comedor"],
      ["2.jpg", "cocina-y-comedor"],
      ["1.jpg", "cocina"],
      ["8.jpg", "comedor"],
      ["9.jpg", "sala"],
      ["sala-casa-modelo-alamo-la-rioja-2.jpg", "estancia"],
      ["4.jpg", "recamara-principal"],
      ["5.jpg", "recamara-2"],
      ["=", "/larioja2/Casa Modelo Alamo/7.webp"],
      ["12.jpg", "balcon"],
      ["6.jpg", "terraza"],
      ["7.jpg", "jardin"],
    ],
  },
  // 9 fotos nuevas, 3 del comedor: entra la más amplia y la más nítida.
  "Casa Fresno Elite": {
    slug: "casa-fresno-elite",
    sub: "Fresno Elite",
    fotos: [
      ["=", "/larioja2/Casa Fresno Elite/fachada.webp"],
      ["plantabaja-casa-modelo-fresno-elite-la-rioja-2.jpg", "comedor-y-sala"],
      ["plantabaja-2-casa-modelo-fresno-elite-la-rioja-2.jpg", "sala-y-comedor"],
      ["cocina-casa-modelo-fresno-elite-la-rioja-2.jpg", "cocina"],
      ["sala-comedor-casa-fresno-elite-la-rioja.jpg", "comedor"],
      ["sala-de-tv-casa-fresno-elite-la-rioja.jpg", "sala-de-tv"],
      ["recamara-1-casa-modelo-fresno-elite-la-rioja-2.jpg", "recamara-principal"],
      ["recamara-casa-fresno-elite-la-rioja-2.jpg", "recamara-2"],
      ["bano-casa-fresno-elite-la-rioja.jpg", "bano"],
    ],
  },
};

let total = 0;
for (const [carpeta, { slug, sub, fotos }] of Object.entries(SELECCION)) {
  const destino = path.join("public/larioja2", carpeta);
  const rutas = [];
  for (const [archivo, etiqueta] of fotos) {
    if (archivo === "=") {
      rutas.push(etiqueta);
      continue;
    }
    const nombre = `${slug}-la-rioja-2-${etiqueta}.webp`;
    await sharp(path.join(ORIGEN, carpeta, sub, archivo))
      .rotate()
      .resize({ width: ANCHO, withoutEnlargement: true })
      .webp({ quality: CALIDAD, effort: 5 })
      .toFile(path.join(destino, nombre));
    const kb = Math.round(fs.statSync(path.join(destino, nombre)).size / 1024);
    total += kb;
    rutas.push(`/larioja2/${carpeta}/${nombre}`);
    console.log(`  ${kb} KB  ${nombre}`);
  }
  console.log(`${carpeta} (${rutas.length}): ${JSON.stringify(rutas)}`);
}
console.log(`Total: ${total} KB`);
