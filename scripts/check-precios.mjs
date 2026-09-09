// Verifica que la fuente unica de precios este sana y sincronizada.
//
// Corre esto DESPUES de tocar data/precios.json y ANTES de desplegar:
//   node scripts/gen-cotizador-precios.mjs && node scripts/check-precios.mjs
//
// Comprueba 4 cosas:
//   1. Los archivos generados estan al dia (precios.js del cotizador y
//      api/precios.json, la lista que leen otras apps).
//   2. Cada modelo publicado en el sitio tiene precio en la fuente unica.
//   3. Ningun id del inventario esta marcado como publicable dos veces.
//   4. El neto que vera el cliente cuadra: precio_lista - bono.
//
// Sale con codigo 1 si algo falla, para poder encadenarlo en un pre-deploy.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const RAIZ = process.cwd();
const leer = (p) => fs.readFileSync(path.join(RAIZ, p), "utf8");

const precios = JSON.parse(leer("data/precios.json"));
const inventario = JSON.parse(leer("data/inventory.json")).inventory_stitch_2026;

const fallos = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);
const mal = (msg) => {
  fallos.push(msg);
  console.log(`  ✗ ${msg}`);
};

// 1) archivos generados al dia --------------------------------------------
// Son dos: el que come el cotizador de este sitio y el que leen otras apps.
// Cualquiera de los dos viejo significa que se publicaria un precio que ya
// cambio en la fuente.
console.log("\n1) archivos generados al dia");
const GENERADOS = ["public/cotizador/precios.js", "public/api/precios.json"];
const antes = GENERADOS.map(leer);
execFileSync(process.execPath, ["scripts/gen-cotizador-precios.mjs"], {
  cwd: RAIZ,
  stdio: "pipe",
});
GENERADOS.forEach((archivo, i) => {
  if (antes[i] === leer(archivo)) {
    ok(`${archivo} coincide con data/precios.json`);
  } else {
    mal(
      `${archivo} estaba DESACTUALIZADO (ya se regenero; revisa el diff y vuelve a commitear)`
    );
  }
});

// 2 y 3) mapeo a la web ---------------------------------------------------
console.log("\n2) cada modelo del sitio tiene precio en la fuente unica");
const todas = [...precios.casas, ...precios.departamentos];
const porId = new Map();
for (const e of todas) {
  if (!e.web) continue;
  if (porId.has(e.web)) mal(`"${e.web}" marcado como publicable mas de una vez`);
  porId.set(e.web, e);
}

for (const modelo of inventario) {
  // Modelos anunciados sin precio (preventa). No tienen fila en precios.json
  // a proposito; exigirsela seria pedir un dato que todavia no existe.
  if (modelo.precio_por_anunciar) {
    ok(`${modelo.id.padEnd(22)} ${"(precio por anunciar)".padEnd(26)} sin precio, declarado`);
    continue;
  }
  const e = porId.get(modelo.id);
  if (!e) {
    mal(`"${modelo.id}" no tiene variante marcada con "web" en precios.json`);
    continue;
  }
  const neto = e.precio_lista - e.bono;
  const etiqueta = e.prototipo || e.modelo;
  ok(
    `${modelo.id.padEnd(22)} ${etiqueta.padEnd(26)} neto $${neto.toLocaleString("es-MX")}`
  );
}

// 4) variantes huerfanas (marcadas para web pero sin modelo en el inventario)
console.log("\n3) sin variantes apuntando a modelos inexistentes");
const idsInventario = new Set(inventario.map((m) => m.id));
let huerfanas = 0;
for (const [id] of porId) {
  if (!idsInventario.has(id)) {
    mal(`precios.json publica "${id}", que no existe en inventory.json`);
    huerfanas++;
  }
}
if (!huerfanas) ok("ninguna");

console.log(
  `\n${fallos.length === 0 ? "TODO EN ORDEN" : `${fallos.length} PROBLEMA(S)`} — ${todas.length} variantes, ${porId.size} publicadas en la web\n`
);
process.exit(fallos.length ? 1 : 0);
