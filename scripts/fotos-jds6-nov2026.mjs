// Fotos nuevas de Jardines del Sur 6 (nov 2026), elegidas de las carpetas que
// armó Florencio en "jardines del sur 6/Modelo X/X/". Fachada siempre primero.
// 9 por modelo a propósito: con 1 grande + 8 la galería de la ficha cierra sin
// huecos (ver .galleryFeaturedAlto en model.module.css).
// Nombres nuevos a propósito: las imágenes se guardan 30 días en el navegador
// (firebase.json), y con el mismo nombre algunos clientes verían las viejas.
// Uso: node scripts/fotos-jds6-nov2026.mjs   → escribe webp + miniatura y
// muestra la lista de rutas para data/inventory.json.
import sharp from "sharp";
import fs from "fs";
import path from "path";

const ORIGEN = "jardines del sur 6";
const ANCHO = 1280; // nunca se agranda una foto más chica
const CALIDAD = 76;
const ANCHO_MINI = 640; // primera foto de la tarjeta (FIRST_IMAGE_THUMBS)

const SELECCION = {
  "Modelo Capua": {
    slug: "departamento-capua",
    sub: "Capua",
    fotos: [
      ["departamento-modelo-capua-jardines-del-sur.jpg", "fachada"],
      ["vista-general-departamento-capua-jardines-del-sur.jpg", "sala-comedor-cocina"],
      ["sala-departamento-capua-jardines-del-sur.jpg", "sala"],
      ["cocina-departamento-capua-jardines-del-sur.jpg", "cocina"],
      ["recamara-principal-departamento-capua-jardines-del-sur.jpg", "recamara-principal"],
      ["recamara-departamento-capua-jardines-del-sur.jpg", "recamara-2"],
      ["recamara-departamento-capua-jardines-del-sur-2.jpg", "recamara-3"],
      ["bano-departamento-capua-jardines-del-sur.jpg", "bano"],
      ["area-de-lavado-departamento-capua-jardines-del-sur.jpg", "area-de-lavado"],
    ],
  },
  "Modelo Cedro Plus": {
    slug: "departamento-cedro-plus",
    sub: "Cedro Plus",
    fotos: [
      ["1.jpg", "fachada"],
      ["5.jpg", "sala-comedor"],
      ["8.jpg", "sala"],
      ["6.jpg", "comedor"],
      ["4.jpg", "cocina"],
      ["3.jpg", "barra-y-lavado"],
      ["7.jpg", "estancia"],
      ["10.jpg", "recamara"],
      ["9.jpg", "bano"],
    ],
  },
  "Modelo Ceiba": {
    slug: "casa-ceiba",
    sub: "Ceiba",
    fotos: [
      ["1.jpg", "fachada"],
      ["2.jpg", "cocina-comedor-sala"],
      ["3.jpg", "sala"],
      ["5.jpg", "comedor"],
      ["4.jpg", "cocina"],
      ["6.jpg", "patio"],
      ["7.jpg", "recamara-principal"],
      ["8.jpg", "recamara-2"],
      ["15.jpg", "roof-garden"],
    ],
  },
  "Modelo Flamboyan": {
    slug: "casa-flamboyan",
    sub: "Flamboyan",
    fotos: [
      ["1.jpg", "fachada"],
      ["2.jpg", "sala-comedor"],
      ["6.jpg", "sala"],
      ["3.jpg", "cocina"],
      ["4.jpg", "cocina-detalle"],
      ["5.jpg", "recamara-principal"],
      ["7.jpg", "recamara-2"],
      ["10.jpg", "recamara-3"],
      ["11.jpg", "estancia"],
    ],
  },
  "Modelo Noni": {
    slug: "casa-noni",
    sub: "Noni",
    fotos: [
      ["1.jpg", "fachada"],
      ["2.jpg", "sala"],
      ["6.jpg", "comedor"],
      ["3.jpg", "cocina"],
      ["7.jpg", "recibidor"],
      ["8.jpg", "recamara-principal"],
      ["13.jpg", "bano-y-vestidor"],
      ["11.jpg", "recamara-2"],
      ["14.jpg", "recamara-3"],
    ],
  },
};

let total = 0;
for (const [carpeta, { slug, sub, fotos }] of Object.entries(SELECCION)) {
  const destino = path.join("public/jardines", carpeta);
  const rutas = [];
  for (const [i, [archivo, etiqueta]] of fotos.entries()) {
    const nombre = `${slug}-jardines-del-sur-6-${etiqueta}.webp`;
    const entrada = path.join(ORIGEN, carpeta, sub, archivo);
    await sharp(entrada)
      .rotate()
      .resize({ width: ANCHO, withoutEnlargement: true })
      .webp({ quality: CALIDAD, effort: 5 })
      .toFile(path.join(destino, nombre));
    const kb = Math.round(fs.statSync(path.join(destino, nombre)).size / 1024);
    total += kb;
    rutas.push(`/jardines/${carpeta}/${nombre}`);
    if (i === 0) {
      const mini = `jardines-${carpeta.replace(/ /g, "-")}-${slug}-fachada.webp`;
      await sharp(entrada)
        .rotate()
        .resize({ width: ANCHO_MINI, withoutEnlargement: true })
        .webp({ quality: 65, effort: 6 })
        .toFile(path.join("public/optimized/model-thumbs", mini));
      console.log(`  miniatura /optimized/model-thumbs/${mini} (${Math.round(fs.statSync(path.join("public/optimized/model-thumbs", mini)).size / 1024)} KB)`);
    }
    console.log(`  ${kb} KB  ${nombre}`);
  }
  console.log(`${carpeta}: ${JSON.stringify(rutas)}`);
}
console.log(`Total: ${total} KB`);
