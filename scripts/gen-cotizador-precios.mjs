// Genera public/cotizador/precios.js a partir de data/precios.json.
//
// POR QUE EXISTE: los precios viven en UN solo lugar (data/precios.json) y de
// ahi comen el sitio web (lib/precios.ts -> getInventory) y el cotizador. Antes
// el cotizador los tenia hardcodeados en script.js, asi que actualizar precios
// eran dos ediciones que se podian desincronizar.
//
// FORMA DE SALIDA: reproduce EXACTAMENTE los objetos que script.js ya esperaba
// (datosAzular, datosCasas1, datosLaRioja2, datosDepartamentosJardines6,
// datosDepartamentosLirios2). Se inyectan como un global con un <script> previo,
// NO con fetch: el arranque del cotizador es sincrono y de el dependen imprimir,
// compartir imagen y compartir PDF.
//
// USO:  node scripts/gen-cotizador-precios.mjs
// VERIFICAR: node scripts/check-precios.mjs  (compara contra los catalogos
// originales y contra los precios publicados del sitio)

import fs from "node:fs";
import path from "node:path";

const RAIZ = process.cwd();
const ORIGEN = path.join(RAIZ, "data", "precios.json");
const DESTINO = path.join(RAIZ, "public", "cotizador", "precios.js");

const precios = JSON.parse(fs.readFileSync(ORIGEN, "utf8"));

// Los catalogos originales traian `valorAvaluo` repetido e identico a
// `precioLista` en casas y en los depas de Jardines 6, y NO lo traian en Lirios.
// `obtenerValorAvaluo()` cae a precioLista cuando falta, asi que da igual para el
// calculo; se reproduce tal cual para que el archivo generado sea identico al
// catalogo que habia antes del refactor (ver check-precios.mjs).
const EMITE_VALOR_AVALUO = new Set(["Azular1", "LaRioja2", "Azular1-Depas"]);

const claveCatalogo = (entrada) =>
  entrada.vista === "estacionamiento" ? `${entrada.modelo} PROMO` : entrada.modelo;

function filaComun(entrada, bono) {
  const fila = { precioLista: entrada.precio_lista };
  if (EMITE_VALOR_AVALUO.has(entrada.dev)) fila.valorAvaluo = entrada.precio_lista;
  fila.bono = bono;
  fila.avaluo = entrada.avaluo_tramite;
  fila.porcentajesEscrituracion = entrada.escrituracion;
  return fila;
}

// --- Casas: cada entrada genera su modelo y, si trae promocion, el "<MODELO> PROMO"
// inmediatamente despues (ese orden es el que ve el usuario en el selector).
function catalogoCasas(dev) {
  const salida = {};
  for (const casa of precios.casas.filter((c) => c.dev === dev)) {
    salida[casa.modelo] = filaComun(casa, casa.bono);
    if (casa.promocion) {
      salida[`${casa.modelo} PROMO`] = filaComun(
        casa,
        casa.bono + casa.promocion.bono_extra
      );
    }
  }
  return salida;
}

// --- Departamentos: modelo -> nivel. La vista "estacionamiento" se emite como
// un modelo aparte con sufijo PROMO, que es como lo nombraba el catalogo viejo.
function catalogoDepartamentos(dev) {
  const salida = {};
  for (const depa of precios.departamentos.filter((d) => d.dev === dev)) {
    const clave = claveCatalogo(depa);
    salida[clave] = salida[clave] || {};
    salida[clave][depa.nivel] = {
      prototipo: depa.prototipo,
      ...filaComun(depa, depa.bono),
    };
  }
  return salida;
}

// `modelos` alimenta el <select> de prototipo; conserva el orden de precios.json
// e intercala cada PROMO justo despues de su modelo base.
function listaModelos(dev) {
  return Object.keys(catalogoCasas(dev));
}

const datosAzular = {};
for (const [dev, cfg] of Object.entries(precios.desarrollos)) {
  datosAzular[dev] = {
    modelos: listaModelos(dev),
    precioTerrenoExcedente: cfg.precio_terreno_excedente,
  };
}

const bundle = {
  datosAzular,
  datosCasas1: catalogoCasas("Azular1"),
  datosLaRioja2: catalogoCasas("LaRioja2"),
  datosDepartamentosJardines6: catalogoDepartamentos("Azular1-Depas"),
  datosDepartamentosLirios2: catalogoDepartamentos("Lirios2-Depas"),
  cuotasContingencia: Object.fromEntries(
    Object.entries(precios.desarrollos).map(([dev, c]) => [dev, c.cuota_contingencia])
  ),
};

const cabecera = `// ARCHIVO GENERADO - NO EDITAR A MANO.
// Fuente: data/precios.json  |  Generador: scripts/gen-cotizador-precios.mjs
// Para cambiar precios: edita data/precios.json y corre
//   node scripts/gen-cotizador-precios.mjs
// Precios actualizados al ${precios.actualizado}.
`;

fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
fs.writeFileSync(
  DESTINO,
  `${cabecera}window.COTIZADOR_PRECIOS = ${JSON.stringify(bundle, null, 2)};\n`
);

const nDepas = Object.values(bundle.datosDepartamentosJardines6).length +
  Object.values(bundle.datosDepartamentosLirios2).length;
console.log(`✓ ${path.relative(RAIZ, DESTINO)}`);
console.log(`  casas: ${Object.keys(bundle.datosCasas1).length + Object.keys(bundle.datosLaRioja2).length} variantes`);
console.log(`  departamentos: ${nDepas} grupos modelo/vista`);
