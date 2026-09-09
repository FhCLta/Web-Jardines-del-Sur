# La lista de precios publicada

**URL:** `https://alttahomescancun.mx/api/precios.json`

Un archivo estatico, publico, de solo lectura. Lo genera
`scripts/gen-cotizador-precios.mjs` desde `data/precios.json`, igual que
`public/cotizador/precios.js`. **Se actualiza al desplegar el sitio**, no antes.

## Por que existe

La app de expedientes (`datosgeneralesalttahomes`) tiene una copia del
cotizador y hasta hoy tambien su propia copia de los precios, en Firestore
(`catalogos/precios`) mas un respaldo en su codigo. Eran tres copias del mismo
dato. Tres copias se separan; la pregunta no es si, es cuando. Esta URL las
convierte en una sola fuente.

## Que trae

```
{
  "version": 1,
  "actualizado": "2026-08-30",     ← la fecha que se edita a mano al cambiar precios
  "desarrollos": [ ... ],
  "productos":   [ ... ],
  "cotizador":   { ... }
}
```

**No lleva fecha de generacion**, a proposito: la salida tiene que ser identica
corriendo el generador dos veces o `check-precios.mjs` no podria detectar que el
archivo quedo viejo. Para saber si los precios cambiaron se mira `actualizado`.

### `cotizador` — para alimentar un cotizador

Identico a lo que este sitio le entrega al suyo en `window.COTIZADOR_PRECIOS`:
`datosAzular`, `datosCasas1`, `datosLaRioja2`, `datosDepartamentosJardines6`,
`datosDepartamentosLirios2`, `cuotasContingencia`. Se puede asignar tal cual, sin
adaptador.

**Solo trae lo vendible.** Los modelos agotados no estan, igual que hoy.

### `productos` — para el expediente

La lista plana y **completa**, con los agotados incluidos y marcados
`activo: false`.

```json
{
  "id": "lirios2-depas-capua-l-1-3",
  "desarrollo": "Lirios2-Depas",
  "tipo": "departamento",
  "modelo": "CAPUA",
  "claveCotizador": "CAPUA L-1",
  "nivel": "3",
  "edificio": "L-1",
  "vista": null,
  "promocion": false,
  "prototipo": "CAPUA 3N L-1",
  "activo": true,
  "precioLista": 2700000,
  "bono": 710000,
  "neto": 1990000,
  "valorAvaluo": 2700000,
  "avaluo": 11500,
  "porcentajesEscrituracion": { "infonavit": 0.07, ... },
  "web": "lirios2-capua"
}
```

- **`id`** es la llave estable. No cambia aunque cambie el nombre comercial o el
  precio. Es lo que debe guardar un expediente para volver a encontrar su
  producto.
- **`neto`** ya viene calculado (`precioLista - bono`). No volverlo a derivar del
  otro lado: dos calculos distintos dan dos precios distintos.
- **`valorAvaluo`** viene siempre resuelto. En los catalogos originales faltaba
  en Lirios y el cotizador caia a `precioLista`; un campo ausente es una trampa.
- **`web`** es el id del modelo en el sitio publico (`data/inventory.json`),
  cuando el modelo tiene ficha.

## Las tres trampas de estos datos

**1. "PROMO" significa dos cosas.** En departamentos es la **vista** al
estacionamiento: una variante permanente del producto, no una oferta. En casas
es una promocion real que suma bono. Por eso van en campos distintos:
`vista: "estacionamiento"` para la primera, `promocion: true` para la segunda.
Tratarlas igual es el error clasico aqui.

**2. La clave del cotizador puede llevar guion.** `"CAPUA P-4"`, `"CAPUA L-1"`.
El `<option value>` del selector de departamentos se arma como
`` `${clave}-${nivel}` ``, asi que al separarlo hay que usar el **ultimo** guion,
nunca el primero. El nivel jamas lleva guion.

```js
const i = seleccion.lastIndexOf("-");
const modelo = seleccion.slice(0, i);
const planta = seleccion.slice(i + 1);
```

**3. Una baja es una bandera, nunca una eliminacion.** Un producto que deja de
venderse sale de `cotizador` pero se queda en `productos` con `activo: false`.
Si desapareciera del archivo, un expediente firmado se abriria con el selector
vacio y recalcularia sobre la nada: el asesor veria numeros que no son los que
firmo su cliente.

## Cabeceras

| Cabecera | Valor | Por que |
|---|---|---|
| `Access-Control-Allow-Origin` | `*` | Es dato que ya esta publicado en el sitio. Abierto cubre tambien `localhost` sin configurar nada mas. |
| `Cache-Control` | `public, max-age=300, stale-while-revalidate=86400` | 5 minutos de margen y hasta un dia sirviendo la ultima copia buena si el sitio no responde. Corto a proposito: un descuento vencido cacheado es un precio que ya no existe. |

Se configuran en `firebase.json`. La reescritura `/api/meta-capi` no estorba: un
archivo estatico gana sobre una reescritura.

## Un desarrollo nuevo

Jardines del Sur 7 entra en preventa y sera el quinto. Dos cosas antes:

1. **De este lado**, un desarrollo tiene que darse de alta en `CATALOGO_POR_DEV`
   (en el generador) y traer `nombre` en `precios.json`. Si falta cualquiera de
   los dos, el generador **truena**. Es a proposito: un desarrollo que se cuela
   sin catalogo acabaria cotizandose con los precios de otro fraccionamiento, y
   eso no falla — miente.
2. **Del lado del expediente**, hay que dejar de elegir catalogo comparando
   contra nombres de desarrollo escritos a mano. Para eso viaja el campo
   `catalogo` en cada desarrollo.

## Como se actualiza

```bash
# 1. editar data/precios.json (y la fecha "actualizado")
node scripts/gen-cotizador-precios.mjs   # escribe precios.js Y api/precios.json
node scripts/check-precios.mjs           # debe decir TODO EN ORDEN
npm run build && firebase deploy --only hosting
```
