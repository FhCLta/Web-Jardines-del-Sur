// Genera public/cotizador/precios.js y public/api/precios.json a partir de
// data/precios.json.
//
// POR QUE EXISTE: los precios viven en UN solo lugar (data/precios.json) y de
// ahi comen el sitio web (lib/precios.ts -> getInventory) y el cotizador. Antes
// el cotizador los tenia hardcodeados en script.js, asi que actualizar precios
// eran dos ediciones que se podian desincronizar.
//
// QUIEN LOS LEE, Y COMO:
//   1. El cotizador de este sitio  -> <script src="./precios.js"> (sincrono)
//   2. La app de expedientes       -> <script src> al MISMO precios.js, cruzando
//      (datosgeneralesalttahomes)     dominios. Una etiqueta <script> no pasa
//                                     por CORS, por eso les sirve tal cual.
//   3. Cualquier otro consumidor   -> /api/precios.json (con CORS abierto)
//
// ⚠️ precios.js NO PUEDE CAMBIAR DE DIRECCION. Hay una app que lo carga por URL
// fija; moverlo la deja sin precios y sin aviso.
//
// FORMA DE SALIDA: reproduce los objetos que script.js ya esperaba
// (datosAzular, datosCasas1, datosLaRioja2, datosDepartamentosJardines6,
// datosDepartamentosLirios2). Se inyectan como un global con un <script> previo,
// NO con fetch: el arranque del cotizador es sincrono y de el dependen imprimir,
// compartir imagen y compartir PDF.
//
// USO:  node scripts/gen-cotizador-precios.mjs
// VERIFICAR: node scripts/check-precios.mjs

import fs from "node:fs";
import path from "node:path";

const RAIZ = process.cwd();
const ORIGEN = path.join(RAIZ, "data", "precios.json");
const DESTINO = path.join(RAIZ, "public", "cotizador", "precios.js");
const API_DESTINO = path.join(RAIZ, "public", "api", "precios.json");

const precios = JSON.parse(fs.readFileSync(ORIGEN, "utf8"));

// Los catalogos originales traian `valorAvaluo` repetido e identico a
// `precioLista` en casas y en los depas de Jardines 6, y NO lo traian en Lirios.
// `obtenerValorAvaluo()` cae a precioLista cuando falta, asi que da igual para el
// calculo; se reproduce tal cual para no cambiarle la forma al catalogo que el
// cotizador ya venia recibiendo.
const EMITE_VALOR_AVALUO = new Set(["Azular1", "LaRioja2", "Azular1-Depas"]);

// Nombre de la variable del catalogo dentro del bundle. Vive aqui y no en
// precios.json porque describe la FORMA DEL CODIGO del cotizador, no un dato del
// producto. Viaja en la salida para que el cotizador pueda elegir catalogo
// LEYENDO el dato, en vez de comparar contra nombres de desarrollo escritos a
// mano: eso es lo que hace que un desarrollo nuevo sea solo datos.
const CATALOGO_POR_DEV = {
  Azular1: "datosCasas1",
  LaRioja2: "datosLaRioja2",
  "Azular1-Depas": "datosDepartamentosJardines6",
  "Lirios2-Depas": "datosDepartamentosLirios2",
};

// Los niveles que se saben pintar estan escritos a mano en DOS lugares:
// `ordenPlantas` en public/cotizador/script.js y `orden` en lib/precios.ts. Un
// nivel fuera de esa lista no truena en ninguno de los dos: en el cotizador el
// departamento simplemente NO sale en el selector, y en el sitio se ordena antes
// que la planta baja. Los dos fallan callados, asi que se cazan aqui.
const NIVELES_CONOCIDOS = ["PB", "1", "2", "3"];

const slug = (texto) =>
  String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const esDepas = (dev) => precios.departamentos.some((d) => d.dev === dev);

// Clave del catalogo = como el cotizador agrupa las plantas de un modelo. Hay
// dos razones para partir un modelo en dos grupos, y son excluyentes:
//   - la VISTA al estacionamiento (Jardines 6), que el catalogo viejo llamaba
//     "PROMO" y asi se conserva para no romper lo que ya existe;
//   - el EDIFICIO (el Capua de Lirios: P-4 y L-1), mismo avaluo y distinto
//     descuento.
// ⚠️ La clave puede traer un guion ("CAPUA P-4"). script.js lo tiene en cuenta:
// separa modelo y planta por el ULTIMO guion, no por el primero.
const claveCatalogo = (entrada) => {
  if (entrada.vista === "estacionamiento") return `${entrada.modelo} PROMO`;
  if (entrada.edificio) return `${entrada.modelo} ${entrada.edificio}`;
  return entrada.modelo;
};

// Llave estable de un producto: desarrollo + clave del cotizador + nivel. Es
// exactamente la terna que hace falta para volver a seleccionarlo, y es lo que
// guardan las cotizaciones de la app de expedientes. NO CAMBIA aunque cambie el
// nombre comercial o el precio.
const idProducto = (dev, clave, nivel) =>
  [slug(dev), slug(clave), nivel ? slug(nivel) : null].filter(Boolean).join("-");

// --- Integridad de la fuente, antes de generar nada -------------------------
for (const [dev, cfg] of Object.entries(precios.desarrollos)) {
  if (!cfg.nombre) {
    throw new Error(`El desarrollo "${dev}" no tiene "nombre" en precios.json.`);
  }
  if (!CATALOGO_POR_DEV[dev]) {
    throw new Error(
      `El desarrollo "${dev}" no esta en CATALOGO_POR_DEV (scripts/gen-cotizador-precios.mjs). ` +
        `Un desarrollo nuevo necesita su propio catalogo en el cotizador; sin darlo de alta aqui ` +
        `acabaria cotizandose con los precios de otro fraccionamiento.`
    );
  }
}
for (const depa of precios.departamentos) {
  if (!NIVELES_CONOCIDOS.includes(depa.nivel)) {
    throw new Error(
      `Nivel desconocido "${depa.nivel}" en ${depa.dev} / ${depa.prototipo}. ` +
        `Los que se saben pintar son: ${NIVELES_CONOCIDOS.join(", ")}. Para ` +
        `agregar otro hay que darlo de alta en "ordenPlantas" ` +
        `(public/cotizador/script.js) y en "orden" (lib/precios.ts), o el ` +
        `departamento desaparece del cotizador sin avisar.`
    );
  }
}

// La etiqueta lleva "Casas"/"Depas" solo cuando el mismo nombre aparece dos
// veces —es lo que distingue "Jardines del Sur 6 Casas" de "... Depas"—. Un
// desarrollo con un solo producto se queda con su nombre limpio.
const vecesPorNombre = {};
for (const cfg of Object.values(precios.desarrollos)) {
  vecesPorNombre[cfg.nombre] = (vecesPorNombre[cfg.nombre] || 0) + 1;
}
const etiquetaDev = (dev) => {
  const { nombre } = precios.desarrollos[dev];
  if (vecesPorNombre[nombre] === 1) return nombre;
  return `${nombre} ${esDepas(dev) ? "Depas" : "Casas"}`;
};

// El nombre en mayusculas que se imprime en la carta propuesta. Se deriva del
// nombre publico; si algun fraccionamiento se imprime distinto, se pone
// "fraccionamiento" a mano en precios.json y ese manda.
const fraccionamientoDev = (dev) => {
  const cfg = precios.desarrollos[dev];
  return cfg.fraccionamiento || cfg.nombre.toUpperCase();
};

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
  // ⚠️ Los modelos AGOTADOS no entran al cotizador: cotizar algo que ya no se
  // puede vender es el mismo error que cotizar un descuento vencido. Siguen en
  // precios.json y en el sitio —la ficha conserva su valor SEO y su precio es
  // la referencia de la etapa siguiente— y siguen en `historico`, para que un
  // expediente ya firmado se pueda volver a abrir. Pero no se pueden cotizar.
  for (const casa of precios.casas.filter((c) => c.dev === dev && !c.agotado)) {
    salida[casa.modelo] = {
      id: idProducto(casa.dev, casa.modelo, null),
      ...filaComun(casa, casa.bono),
    };
    if (casa.promocion) {
      const clave = `${casa.modelo} PROMO`;
      salida[clave] = {
        id: idProducto(casa.dev, clave, null),
        ...filaComun(casa, casa.bono + casa.promocion.bono_extra),
      };
    }
  }
  return salida;
}

// --- Departamentos: modelo -> nivel. La vista "estacionamiento" se emite como
// un modelo aparte con sufijo PROMO, que es como lo nombraba el catalogo viejo.
function catalogoDepartamentos(dev) {
  const salida = {};
  for (const depa of precios.departamentos.filter((d) => d.dev === dev && !d.agotado)) {
    const clave = claveCatalogo(depa);
    salida[clave] = salida[clave] || {};
    salida[clave][depa.nivel] = {
      id: idProducto(depa.dev, clave, depa.nivel),
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

// --- Lista plana de productos, la vista que usa el expediente ---------------
// `activo: false` = no se vende hoy, pero sigue aqui. Una baja es una bandera,
// nunca una eliminacion: si el producto desaparece, la cotizacion firmada del
// cliente se abre vacia y se recalcula sobre la nada.
function productoApi(entrada, clave, nivel, bono) {
  return {
    id: idProducto(entrada.dev, clave, nivel),
    desarrollo: entrada.dev,
    tipo: esDepas(entrada.dev) ? "departamento" : "casa",
    modelo: entrada.modelo,
    // Lo que va en el <option value> del cotizador. ⚠️ Puede traer guion
    // ("CAPUA P-4"): al partir "<clave>-<nivel>" hay que usar el ULTIMO guion,
    // nunca el primero. El nivel jamas lleva guion.
    claveCotizador: clave,
    nivel: nivel ?? null,
    edificio: entrada.edificio ?? null,
    // ⚠️ "PROMO" significa dos cosas y aqui van separadas a proposito:
    //   - en departamentos es la VISTA al estacionamiento, una variante
    //     permanente del producto (vista: "estacionamiento");
    //   - en casas es una promocion real que suma bono (promocion: true).
    // Tratarlas igual es el error clasico con estos datos.
    vista: entrada.vista ?? null,
    promocion: !esDepas(entrada.dev) && bono !== entrada.bono,
    prototipo: entrada.prototipo || clave,
    activo: !entrada.agotado,
    precioLista: entrada.precio_lista,
    bono,
    // El neto ya viene calculado para que nadie del otro lado lo vuelva a
    // derivar y le salga distinto.
    neto: entrada.precio_lista - bono,
    // En los catalogos originales faltaba en Lirios y el cotizador caia a
    // precioLista. Aqui va siempre resuelto: un campo ausente es una trampa.
    valorAvaluo: entrada.precio_lista,
    avaluo: entrada.avaluo_tramite,
    porcentajesEscrituracion: entrada.escrituracion,
    // Id del modelo en el sitio publico (data/inventory.json), cuando existe.
    web: entrada.web ?? null,
  };
}

const productosApi = [];
for (const casa of precios.casas) {
  productosApi.push(productoApi(casa, casa.modelo, null, casa.bono));
  if (casa.promocion) {
    productosApi.push(
      productoApi(
        casa,
        `${casa.modelo} PROMO`,
        null,
        casa.bono + casa.promocion.bono_extra
      )
    );
  }
}
for (const depa of precios.departamentos) {
  productosApi.push(productoApi(depa, claveCatalogo(depa), depa.nivel, depa.bono));
}

const vistos = new Set();
for (const prod of productosApi) {
  if (vistos.has(prod.id)) {
    throw new Error(
      `Id repetido en la lista publica: "${prod.id}". Los ids tienen que ser ` +
        `unicos y estables: son la llave con la que un expediente guardado ` +
        `vuelve a encontrar su producto.`
    );
  }
  vistos.add(prod.id);
}

// --- Unidades: la lista de precios CASA POR CASA (hoy, solo La Rioja 2) -----
// El cotizador muestra en "Prototipo" solo el modelo ("ALAMO") y en "# de la
// Unidad" las casas de ese modelo ("OSO 2 #52"); la casa elegida trae su precio. El PRECIO no se repite aqui: cada casa apunta
// con `clave` a su fila de `casas`, que sigue siendo la unica fuente. `modelos`
// NO cambia, porque es lo que lee la app de expedientes.
// Se valida antes de publicar: una casa que apunta a una clave inexistente (o
// agotada) se cotizaria en blanco, y una direccion repetida es un error de captura.
function unidadesDe(dev, cfg) {
  if (!cfg.unidades) return undefined;
  const catalogo = catalogoCasas(dev);
  const salida = [];
  const direcciones = new Set();
  for (const u of cfg.unidades) {
    const direccion = `${u.calle} #${u.numero}`;
    if (direcciones.has(direccion)) {
      throw new Error(`Unidad repetida en ${dev}: "${direccion}".`);
    }
    direcciones.add(direccion);
    if (!catalogo[u.clave]) {
      throw new Error(
        `La unidad "${direccion}" de ${dev} apunta a la clave "${u.clave}", que no esta ` +
          `en el cotizador (no existe o esta agotada). Se cotizaria sin precio.`
      );
    }
    salida.push({
      prototipo: u.prototipo,
      etiqueta: `${u.prototipo} · ${direccion}`,
      clave: u.clave,
      unidad: direccion,
    });
    // La promocion vigente de su clave, como opcion aparte. Cuando la promocion
    // se retira de `casas`, esta opcion desaparece sola.
    if (u.promo && catalogo[`${u.clave} PROMO`]) {
      salida.push({
        prototipo: `${u.prototipo} PROMO`,
        etiqueta: `${u.prototipo} PROMO · ${direccion}`,
        clave: `${u.clave} PROMO`,
        unidad: direccion,
      });
    }
  }
  return salida;
}

// --- El bundle que recibe el cotizador --------------------------------------
const datosAzular = {};
for (const [dev, cfg] of Object.entries(precios.desarrollos)) {
  const unidades = unidadesDe(dev, cfg);
  datosAzular[dev] = {
    modelos: listaModelos(dev),
    ...(unidades ? { unidades } : {}),
    precioTerrenoExcedente: cfg.precio_terreno_excedente,
    // Los cuatro campos siguientes son los que permiten que el cotizador
    // resuelva un desarrollo LEYENDO el dato en vez de comparar contra nombres
    // escritos a mano. Sin ellos, cada desarrollo nuevo obliga a tocar codigo
    // en las dos apps.
    label: etiquetaDev(dev),
    fraccionamiento: fraccionamientoDev(dev),
    tipo: esDepas(dev) ? "departamentos" : "casas",
    catalogo: CATALOGO_POR_DEV[dev],
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
  // Lo que ya no se vende: fuera de los catalogos para que no se pueda cotizar
  // por accidente, pero presente para que un expediente viejo lo encuentre.
  historico: productosApi.filter((p) => !p.activo),
};

const cabecera = `// ARCHIVO GENERADO - NO EDITAR A MANO.
// Fuente: data/precios.json  |  Generador: scripts/gen-cotizador-precios.mjs
// Para cambiar precios: edita data/precios.json y corre
//   node scripts/gen-cotizador-precios.mjs
// Precios actualizados al ${precios.actualizado}.
//
// ⚠️ ESTA DIRECCION NO CAMBIA: la app de expedientes carga este archivo con
// <script src> desde otro dominio. Moverlo la deja sin precios y sin aviso.
`;

fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
fs.writeFileSync(
  DESTINO,
  `${cabecera}window.COTIZADOR_PRECIOS = ${JSON.stringify(bundle, null, 2)};\n`
);

// --- La misma informacion como JSON, para quien prefiera leerla con fetch ----
// ⚠️ NO LLEVA FECHA DE GENERACION. Es a proposito: la salida tiene que ser
// identica corriendo el generador dos veces, o check-precios.mjs no podria
// detectar que el archivo quedo viejo. La fecha buena es `actualizado`.
const desarrollosApi = Object.entries(precios.desarrollos).map(([dev, cfg]) => ({
  id: dev,
  nombre: cfg.nombre,
  label: etiquetaDev(dev),
  fraccionamiento: fraccionamientoDev(dev),
  tipo: esDepas(dev) ? "departamentos" : "casas",
  catalogo: CATALOGO_POR_DEV[dev],
  cuotaContingencia: cfg.cuota_contingencia,
  precioTerrenoExcedente: cfg.precio_terreno_excedente,
}));

const api = {
  _doc:
    "Lista de precios de Altta Homes Cancun. ARCHIVO GENERADO desde data/precios.json; " +
    "no editar a mano. Contrato y ejemplos en docs/api-precios.md.",
  _vistas: {
    cotizador:
      "Identico a window.COTIZADOR_PRECIOS de /cotizador/precios.js. Los catalogos " +
      "traen solo lo vendible; lo dado de baja va en cotizador.historico.",
    productos:
      "Lista plana y completa. Los agotados vienen con activo:false para que un " +
      "expediente viejo pueda seguir encontrando su producto. Una baja es una " +
      "bandera, nunca una eliminacion.",
  },
  version: 1,
  actualizado: precios.actualizado,
  desarrollos: desarrollosApi,
  productos: productosApi,
  cotizador: bundle,
};

fs.mkdirSync(path.dirname(API_DESTINO), { recursive: true });
fs.writeFileSync(API_DESTINO, `${JSON.stringify(api, null, 2)}\n`);

const nDepas = Object.values(bundle.datosDepartamentosJardines6).length +
  Object.values(bundle.datosDepartamentosLirios2).length;
console.log(`✓ ${path.relative(RAIZ, DESTINO)}`);
console.log(`  casas: ${Object.keys(bundle.datosCasas1).length + Object.keys(bundle.datosLaRioja2).length} variantes`);
console.log(`  departamentos: ${nDepas} grupos modelo/vista`);
console.log(`  historico: ${bundle.historico.length} dado(s) de baja`);
console.log(`✓ ${path.relative(RAIZ, API_DESTINO)}`);
console.log(`  productos: ${productosApi.length} (${productosApi.filter((p) => !p.activo).length} inactivos)`);
