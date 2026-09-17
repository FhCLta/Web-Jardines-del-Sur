// Genera los logos que van SOBRE LA FOTO del encabezado de los silos: blancos,
// con un contorno de 1 px (en pantalla) del color ORIGINAL de cada logo.
//
// POR QUE ARCHIVO Y NO CSS: un contorno con `filter: drop-shadow` no puede ser
// mas delgado que un pixel de pantalla (0.2 y 0.5 px se redondean a 1) y a 1 px
// el color rellena los huecos entre letras: el logo queda como calcomania.
// Dibujado aqui, a resolucion alta y luego reducido, el contorno sale fino y
// nitido. Probado en monitor comun, Mac y celular (17 sept 2026).
//
// DECISIONES DE FLORENCIO:
// - 1 px y no 0.5: a 0.5 el color casi no se distingue en monitores comunes.
// - Logos +20% (17 sept 2026): 90 px en computadora, 70 en tablet, 56 en celular.
//   El archivo se genera a 3x de esos 90 px para que no pierda nitidez al crecer.
// - Lirios con VERDE PROFUNDO #087777, no con el #11abab del logo: la nitidez que se
//   percibe depende del contraste entre el blanco y el contorno, y el verde del logo
//   es claro (se leia como brillo, no como orilla). Es el mismo tono, mas oscuro; el
//   logo original no trae un verde tan oscuro en ninguna parte. El rojo de La Rioja
//   ya es oscuro y se queda tal cual.
// - En La Rioja 2, "RESIDENCIAL" va SIN contorno: sus letras miden ~3 px en
//   pantalla y con contorno se empastan en una rayita roja.
//
// Solo se usan sobre foto. En las pestanas del inicio y en las listas de
// precios va el logo original a color (public/logos/<desarrollo>.webp).
//
// USO: node scripts/gen-logos-contorno.mjs

import sharp from "sharp";

const ALTO_EN_PANTALLA = 90; // .logoBlanco img en silo.module.css (escritorio)
const ALTO_ARCHIVO = ALTO_EN_PANTALLA * 3; // 3x: nitido en pantallas de alta densidad
const TRABAJO = 4; // se dibuja a 4x del archivo final y se reduce
const GROSOR = 1; // px de pantalla

// Colores medidos de los pixeles de cada logo original (promedio de la tinta de
// color), no escogidos a ojo. Excepcion: Lirios, oscurecido a proposito.
const LOGOS = [
  {
    origen: "public/logos/la-rioja-2.webp",
    // -v2: nombre nuevo por la cache de imagenes de 30 dias (la v1 era de 76 px).
    destino: "public/logos/la-rioja-2-contorno-v2.webp",
    color: "#a22f2c",
    sinContorno: medirResidencial,
  },
  {
    origen: "public/logos/lirios-2.webp",
    destino: "public/logos/lirios-2-contorno-v2.webp",
    color: "#087777", // verde profundo (ver arriba); el del logo es #11abab
  },
];

// "RESIDENCIAL" es la franja de letritas del fondo del logo de La Rioja. Se
// mide: desde el ultimo renglon hacia arriba mientras haya tinta en la zona
// central (despues de la punta de la R grande), y se detiene en el renglon
// vacio que la separa del gancho de la J. Si el archivo cambia, esto se
// re-mide solo — y truena si lo que encuentra no parece una franja de texto.
async function medirResidencial(origen) {
  const { data, info } = await sharp(origen).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, A = (x, y) => data[(y * W + x) * 4 + 3];
  const X0 = Math.round(W * 0.27), X1 = Math.round(W * 0.92);
  let y0 = null;
  for (let y = H - 1; y >= H - 25; y--) {
    let n = 0;
    for (let x = X0; x <= X1; x++) if (A(x, y) > 40) n++;
    if (n > 0) y0 = y;
    else if (y0 !== null) break;
  }
  let x0 = W, x1 = 0;
  for (let y = y0; y < H; y++) for (let x = X0; x < W; x++) if (A(x, y) > 40) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  const caja = { x0: x0 - 1, x1: x1 + 1, y0: y0 - 1, y1: H - 1 };
  const alto = caja.y1 - caja.y0 + 1, ancho = caja.x1 - caja.x0 + 1;
  if (alto > 9 || ancho < W * 0.4) {
    throw new Error(`"RESIDENCIAL" no se encontro donde se esperaba (${JSON.stringify(caja)}). Revisar el logo.`);
  }
  return caja;
}

async function fabricar({ origen, destino, color, sinContorno }) {
  const meta = await sharp(origen).metadata();
  const f = (ALTO_ARCHIVO * TRABAJO) / meta.height;
  const radio = Math.max(1, Math.round(GROSOR * (ALTO_ARCHIVO / ALTO_EN_PANTALLA) * TRABAJO));
  const pad = radio + 2;
  const W0 = Math.round(meta.width * f), H0 = ALTO_ARCHIVO * TRABAJO;
  const { data: rgba } = await sharp(origen).ensureAlpha().resize(W0, H0, { kernel: "lanczos3" }).raw().toBuffer({ resolveWithObject: true });
  const W = W0 + pad * 2, H = H0 + pad * 2;

  // silueta del logo, con las orillas afinadas
  const alfa = new Uint8Array(W * H);
  for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) {
    const a = rgba[(y * W0 + x) * 4 + 3];
    alfa[(y + pad) * W + (x + pad)] = Math.max(0, Math.min(255, Math.round(((a - 70) * 255) / 120)));
  }

  // lo que lleva contorno (todo, menos la zona excluida)
  const conContorno = new Uint8Array(alfa);
  if (sinContorno) {
    const c = await sinContorno(origen);
    const x0 = Math.floor(c.x0 * f) + pad, x1 = Math.ceil((c.x1 + 1) * f) + pad;
    const y0 = Math.floor(c.y0 * f) + pad, y1 = Math.ceil((c.y1 + 1) * f) + pad;
    for (let y = y0; y < Math.min(H, y1); y++) for (let x = x0; x < Math.min(W, x1); x++) conContorno[y * W + x] = 0;
  }

  // contorno = la silueta "engordada" en un circulo del radio pedido
  const offs = [];
  for (let dy = -radio; dy <= radio; dy++) for (let dx = -radio; dx <= radio; dx++) if (dx * dx + dy * dy <= radio * radio + radio) offs.push(dy * W + dx);
  const borde = new Uint8Array(W * H);
  for (let y = radio; y < H - radio; y++) for (let x = radio; x < W - radio; x++) {
    const i = y * W + x;
    let m = 0;
    for (let k = 0; k < offs.length; k++) { const v = conContorno[i + offs[k]]; if (v > m) { m = v; if (m === 255) break; } }
    borde[i] = m;
  }

  // color del contorno debajo, logo blanco encima
  const [cr, cg, cb] = [1, 3, 5].map((j) => parseInt(color.slice(j, j + 2), 16));
  const out = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const aw = alfa[i] / 255, ab = borde[i] / 255, a = aw + ab * (1 - aw), o = i * 4;
    if (a <= 0) continue;
    out[o] = Math.round((255 * aw + cr * ab * (1 - aw)) / a);
    out[o + 1] = Math.round((255 * aw + cg * ab * (1 - aw)) / a);
    out[o + 2] = Math.round((255 * aw + cb * ab * (1 - aw)) / a);
    out[o + 3] = Math.round(a * 255);
  }
  const info = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .resize({ height: Math.round(H / TRABAJO), kernel: "lanczos3" })
    .webp({ lossless: true })
    .toFile(destino);
  return { destino, width: info.width, height: info.height, kb: +(info.size / 1024).toFixed(1) };
}

const resultado = [];
for (const logo of LOGOS) resultado.push(await fabricar(logo));
for (const r of resultado) console.log(`✓ ${r.destino}  ${r.width}x${r.height}  ${r.kb} KB`);
console.log("JSON " + JSON.stringify(resultado));
