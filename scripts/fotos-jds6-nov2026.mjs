// Fotos nuevas de Jardines del Sur 6 (nov 2026), elegidas de las carpetas que
// armó Florencio en "jardines del sur 6/Modelo X/X/". Fachada siempre primero.
// Después de la fachada, las vistas de cocina, comedor y sala juntas (pedido
// de Florencio). 9 o 13 por modelo a propósito: con 1 grande + 8 o + 12 la
// galería de la ficha cierra sin huecos (ver .galleryCuadrada en
// model.module.css).
// Nombres nuevos a propósito: las imágenes se guardan 30 días en el navegador
// (firebase.json), y con el mismo nombre algunos clientes verían las viejas.
// Por eso la etiqueta de la fachada también nombra su miniatura: una fachada
// que se cambia lleva etiqueta nueva ("fachada-edificio", 8 nov 2026).
// Uso: node scripts/fotos-jds6-nov2026.mjs   → escribe webp + miniatura y
// muestra la lista de rutas para data/inventory.json.
// Solo algunos modelos: node scripts/fotos-jds6-nov2026.mjs "Modelo Capua"
import sharp from "sharp";
import fs from "fs";
import path from "path";

const ORIGEN = "jardines del sur 6";
const ANCHO = 1280; // nunca se agranda una foto más chica
const CALIDAD = 80; // calidad alta: casi no se nota contra el original
const ANCHO_MINI = 640; // primera foto de la tarjeta (FIRST_IMAGE_THUMBS)
const CALIDAD_MINI = 65;

// Las fachadas retocadas en 4K traen tanto detalle fino que a calidad 80
// pesaban el doble que las de antes (Capua 177 KB contra 90; Cedro 222 contra
// 95), y la fachada es lo primero que carga la ficha. Un suavizado muy leve y
// calidad 72 las dejan en 99 y 134 KB (miniaturas 26 y 35 KB, como antes):
// comparadas al 100% casi no se distinguen y en pantalla no se nota.
const RETOCADA = { suavizado: 0.7, calidad: 72 };

const SELECCION = {
  "Modelo Capua": {
    slug: "departamento-capua",
    sub: "Capua",
    fotos: [
      // Fachada retocada que Florencio agregó el 7 nov 2026 (antes:
      // departamento-modelo-capua-jardines-del-sur.jpg, "fachada"). Viene
      // CUADRADA y la tarjeta la mostraba con franjas a los lados (la pinta
      // con objectFit contain): se recorta a 4:3 por el centro, como el Cedro.
      ["Fachada 4k.jpg", "fachada-edificio", { proporcion: 4 / 3, ...RETOCADA }],
      ["vista-general-departamento-capua-jardines-del-sur.jpg", "sala-comedor-cocina"],
      ["cocina-departamento-capua-jardines-del-sur.jpg", "cocina"],
      ["sala-departamento-capua-jardines-del-sur.jpg", "sala"],
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
      // Fachada retocada del 7 nov 2026 (antes: 1.jpg, "fachada").
      ["Fachada 4k.jpg", "fachada-edificio", RETOCADA],
      ["5.jpg", "sala-comedor"],
      ["8.jpg", "sala"],
      ["3.jpg", "barra-y-lavado"],
      ["6.jpg", "comedor"],
      ["4.jpg", "cocina"],
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
      ["12.jpg", "cocina-y-comedor"],
      ["11.jpg", "comedor-y-sala"],
      ["5.jpg", "comedor"],
      ["3.jpg", "sala"],
      ["13.jpg", "sala-2"],
      ["4.jpg", "cocina"],
      ["6.jpg", "patio"],
      ["7.jpg", "recamara-principal"],
      ["8.jpg", "recamara-2"],
      ["10.jpg", "estancia"],
      ["15.jpg", "roof-garden"],
    ],
  },
  "Modelo Flamboyan": {
    slug: "casa-flamboyan",
    sub: "Flamboyan",
    fotos: [
      ["1.jpg", "fachada"],
      ["2.jpg", "sala-comedor"],
      ["14.jpg", "comedor-y-sala"],
      ["13.jpg", "comedor-sala-y-escalera"],
      ["6.jpg", "sala"],
      ["12.jpg", "sala-y-comedor"],
      ["3.jpg", "cocina"],
      ["4.jpg", "cocina-detalle"],
      ["5.jpg", "recamara-principal"],
      ["8.jpg", "recamara-principal-2"],
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
      ["16.jpg", "comedor-cocina-y-sala"],
      ["2.jpg", "sala"],
      ["17.jpg", "comedor-y-cocina"],
      ["18.jpg", "sala-comedor-y-escalera"],
      ["6.jpg", "comedor"],
      ["19.jpg", "cocina-con-barra"],
      ["7.jpg", "recibidor"],
      ["8.jpg", "recamara-principal"],
      ["13.jpg", "bano-y-vestidor"],
      ["11.jpg", "recamara-2"],
      ["14.jpg", "recamara-3"],
      ["10.jpg", "estancia"],
    ],
  },
  // Solo la fachada es nueva. En el inventario le siguen 2, 6, 4 y 5.webp (la
  // 3 era otra vista de la cocina): 5 fotos, que también cierran la galería.
  "Modelo Tabachin": {
    slug: "casa-tabachin",
    sub: "Tabachin",
    fotos: [["Fachada Tabachin.jpg", "fachada"]],
  },
};

const SOLO = process.argv.slice(2);
let total = 0;
for (const [carpeta, { slug, sub, fotos }] of Object.entries(SELECCION)) {
  if (SOLO.length && !SOLO.includes(carpeta)) continue;
  const destino = path.join("public/jardines", carpeta);
  const rutas = [];
  for (const [i, [archivo, etiqueta, opciones = {}]] of fotos.entries()) {
    const nombre = `${slug}-jardines-del-sur-6-${etiqueta}.webp`;
    const entrada = path.join(ORIGEN, carpeta, sub, archivo);
    // Opciones: `proporcion` (ancho / alto) recorta por el centro a esa forma;
    // `suavizado` y `calidad`, ver RETOCADA.
    const { proporcion, suavizado, calidad = CALIDAD } = opciones;
    const preparar = (ancho) => {
      const foto = sharp(entrada).rotate().resize(proporcion
        ? { width: ancho, height: Math.round(ancho / proporcion), fit: "cover", withoutEnlargement: true }
        : { width: ancho, withoutEnlargement: true });
      return suavizado ? foto.blur(suavizado) : foto;
    };
    await preparar(ANCHO)
      .webp({ quality: calidad, effort: suavizado ? 6 : 5 })
      .toFile(path.join(destino, nombre));
    const kb = Math.round(fs.statSync(path.join(destino, nombre)).size / 1024);
    total += kb;
    rutas.push(`/jardines/${carpeta}/${nombre}`);
    if (i === 0) {
      const mini = `jardines-${carpeta.replace(/ /g, "-")}-${slug}-${etiqueta}.webp`;
      await preparar(ANCHO_MINI)
        .webp({ quality: CALIDAD_MINI, effort: 6 })
        .toFile(path.join("public/optimized/model-thumbs", mini));
      console.log(`  miniatura /optimized/model-thumbs/${mini} (${Math.round(fs.statSync(path.join("public/optimized/model-thumbs", mini)).size / 1024)} KB)`);
    }
    console.log(`  ${kb} KB  ${nombre}`);
  }
  console.log(`${carpeta}: ${JSON.stringify(rutas)}`);
}
console.log(`Total: ${total} KB`);
