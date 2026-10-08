# La lista de precios publicada

Los precios de Altta Homes salen de `data/precios.json` y de ahi los genera
`scripts/gen-cotizador-precios.mjs`. **Se actualizan al desplegar el sitio**, no
antes.

## Dos formas de leerlo

| | Direccion | Para quien |
|---|---|---|
| **Etiqueta `<script>`** | `https://alttahomescancun.mx/cotizador/precios.js` | Un cotizador. Define `window.COTIZADOR_PRECIOS`. Una etiqueta `<script src>` **no pasa por CORS**, asi que sirve entre dominios sin configurar nada. |
| **`fetch`** | `https://alttahomescancun.mx/api/precios.json` | Cualquier otro consumidor. Trae lo mismo mas la lista plana de productos. CORS abierto. |

> ⚠️ **Las dos direcciones son estables y no cambian.** La app de expedientes
> (`datosgeneralesalttahomes`) carga `precios.js` por URL fija; moverlo la deja
> sin precios y sin aviso.

`precios.js` se sirve con `Cache-Control: no-cache`, asi que el navegador lo
revalida siempre: en cuanto se despliega, el siguiente arranque ya trae los
precios nuevos. `precios.json` va con 5 minutos de margen y hasta un dia
sirviendo la ultima copia buena si el sitio no responde.

## Por que existe

La app de expedientes tenia una copia del cotizador y tambien su propia copia de
los precios, en base de datos mas un respaldo en su codigo. Eran tres copias del
mismo dato. Tres copias se separan; la pregunta no es si, es cuando.

## Que trae `window.COTIZADOR_PRECIOS`

```
datosAzular                      ← los desarrollos
datosCasas1                      ← casas de Jardines del Sur 6
datosLaRioja2                    ← casas de La Rioja 2
datosDepartamentosJardines6
datosDepartamentosLirios2
cuotasContingencia
historico                        ← lo que ya no se vende
```

### Cada desarrollo trae con que resolverse solo

```json
"Azular1": {
  "modelos": ["FLAMBOYAN", "CEIBA", "NONI"],
  "precioTerrenoExcedente": 5750,
  "label": "Jardines del Sur 6 Casas",
  "fraccionamiento": "JARDINES DEL SUR 6",
  "tipo": "casas",
  "catalogo": "datosCasas1"
}
```

Esos cuatro ultimos campos son los que permiten elegir catalogo **leyendo el
dato**, en vez de comparar contra nombres de desarrollo escritos a mano. Es lo
que hace que un desarrollo nuevo sea solo datos y no codigo.

- **`label`** — el texto del selector.
- **`fraccionamiento`** — el nombre en mayusculas para la carta propuesta. Se
  deriva del nombre publico. Si algun fraccionamiento se imprime distinto, se
  pone `fraccionamiento` a mano en `precios.json` y ese manda.
- **`tipo`** — `casas` o `departamentos`.
- **`catalogo`** — cual de las tablas le corresponde.

### La Rioja 2 trae además su lista casa por casa (`unidades`)

```json
"LaRioja2": {
  "modelos": ["NONI ELITE", "NONI ELITE PROMO", ...],
  "unidades": [
    { "etiqueta": "ALAMO · OSO 2 #52", "clave": "ALAMO OSO 2 CASA 52", "unidad": "OSO 2 #52" },
    ...
  ]
}
```

El cotizador muestra una opción por casa y escribe `unidad` en "# de la
Unidad". El precio sale de `clave`, que es una fila del catálogo: varias casas
comparten clave cuando comparten precio. **`modelos` no cambió** (es lo que lee
la app de expedientes); `unidades` es un campo agregado. Se captura en
`data/precios.json` (`desarrollos.LaRioja2.unidades`) y el generador se niega a
publicar si una casa apunta a una clave que no existe o si una dirección se
repite. La opción `PROMO` de una casa sale sola mientras su clave tenga
promoción vigente.

### Cada producto trae un identificador estable

Toda fila de los catalogos lleva `id`:

```json
"FLAMBOYAN": { "id": "azular1-flamboyan", "precioLista": 2621000, ... }
```

Es `desarrollo + clave del cotizador + nivel`: `azular1-flamboyan`,
`lirios2-depas-capua-l-1-3`. **No cambia nunca**, aunque cambien el nombre
comercial o el precio. Es la llave con la que una cotizacion guardada vuelve a
encontrar su producto.

### `historico` — lo dado de baja

Los catalogos traen **solo lo vendible**: cotizar algo que ya no se vende es el
mismo error que cotizar un descuento vencido. Pero lo retirado no desaparece,
pasa a `historico` con `activo: false` y todos sus numeros.

Si desapareciera del archivo, un expediente firmado se abriria con el selector
vacio y recalcularia sobre la nada: el asesor veria numeros que no son los que
firmo su cliente. **Una baja es una bandera, nunca una eliminacion.**

## Ademas, en `/api/precios.json`

- **`desarrollos`** — los mismos cuatro campos, como lista.
- **`productos`** — la lista plana y completa (vendibles e historico juntos), con
  el `neto` ya calculado (`precioLista - bono`) y el `valorAvaluo` siempre
  resuelto. No re-derivar el neto del otro lado: dos calculos distintos dan dos
  precios distintos.
- **`actualizado`** — la fecha que se edita a mano al cambiar precios. **No hay
  fecha de generacion** a proposito: la salida tiene que ser identica corriendo
  el generador dos veces, o `check-precios.mjs` no podria detectar que el
  archivo quedo viejo.

## Las tres trampas de estos datos

**1. "PROMO" significa dos cosas.** En departamentos es la **vista** al
estacionamiento: una variante permanente del producto, no una oferta. En casas
es una promocion real que suma bono. En `productos` van en campos distintos:
`vista: "estacionamiento"` para la primera, `promocion: true` para la segunda.

**2. La clave del cotizador puede llevar guion.** `"CAPUA P-4"`, `"CAPUA L-1"`.
El `<option value>` se arma como `` `${clave}-${nivel}` ``, asi que al separarlo
hay que usar el **ultimo** guion. El nivel jamas lleva guion.

```js
const i = seleccion.lastIndexOf("-");
const modelo = seleccion.slice(0, i);
const planta = seleccion.slice(i + 1);
```

**3. Los niveles estan escritos a mano en dos lugares.** `ordenPlantas` en
`public/cotizador/script.js` y `orden` en `lib/precios.ts`, los dos con
`PB, 1, 2, 3`. Un nivel fuera de esa lista no truena en ninguno: desaparece del
selector y se desordena en la web. El generador lo rechaza antes de publicar.

## Un desarrollo nuevo

Con los cuatro campos de arriba, del lado del dato es solo datos. Lo que sigue
necesitando alta explicita:

1. **En `precios.json`**: `nombre`, `precio_terreno_excedente` y
   `cuota_contingencia`. La clave del desarrollo es la que viaja en el
   `<option value>` y la que guardan las cotizaciones: no cambia nunca.
2. **En el generador**: `CATALOGO_POR_DEV`. Si falta, **truena a proposito**: un
   desarrollo que se cuele sin catalogo acabaria cotizandose con los precios de
   otro fraccionamiento, y eso no falla, miente.
3. **En el `<select>` del cotizador**: la lista de opciones es HTML fijo.

## Lo que el generador se niega a publicar

| Truena si… | Porque |
|---|---|
| un desarrollo no tiene `nombre` | no hay etiqueta que mostrar, y una inventada es peor que ninguna |
| un desarrollo no esta en `CATALOGO_POR_DEV` | acabaria cotizandose con precios de otro fraccionamiento |
| un departamento trae un nivel desconocido | desaparece del cotizador y se desordena en la web, callado en los dos |
| dos productos comparten `id` | rompe la llave con la que un expediente guardado encuentra su producto |

## Como se actualiza

```bash
# 1. editar data/precios.json (y la fecha "actualizado")
node scripts/gen-cotizador-precios.mjs   # escribe precios.js Y api/precios.json
node scripts/check-precios.mjs           # debe decir TODO EN ORDEN
npm run build && firebase deploy --only hosting
```
