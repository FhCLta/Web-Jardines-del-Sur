# Jardines del Sur 7 — plan de lanzamiento

> **Apertura de preventa: septiembre-octubre 2026.** Arranca con los modelos
> **Tabachín** y **Noni**. Los demás se van abriendo después.

**El activo que se está defendiendo:** `alttahomescancun.mx/jardines-del-sur-7`
está en **posición 1.32** en Google para "jardines del sur 7" (1.21 para
"jardines del sur 7 cancun") **antes** de que el desarrollo exista comercialmente.

---

## 1. La apuesta

Cuando abra la preventa, otros asesores van a invertir en Meta Ads. Parte de esa
gente, después de ver el anuncio, **buscará "Jardines del Sur 7" en Google** — y
ahí aparece Florencio primero.

**Se cosecha en orgánico la demanda que otros pagan por generar.** Por eso
defender ese #1 rinde más que cualquier campaña propia: es apalancamiento sobre
gasto ajeno.

---

## 2. ⭐ La escalera de conversión

El tráfico de JdS7 no se pierde aunque la persona no compre en preventa: **todo
prospecto tiene una salida**, y la mejor no es la obvia.

### El hallazgo: Tabachín y Noni YA existen en Jardines del Sur 6

| Modelo | JdS6 — entrega ya | JdS7 — preventa |
|---|---|---|
| **Tabachín** | $2,664,750 ✓ disponible | por definir |
| **Noni** | $3,161,125 ✓ disponible | por definir |

Entonces el cruce más potente **no es cambiarle el modelo**, es **quitarle la
espera**:

> *"¿Te gustó el Tabachín de Jardines del Sur 7? En Jardines del Sur 6 tenemos
> ese mismo modelo, listo para entrega, sin esperar."*

Convierte mucho mejor que ofrecer otro modelo, porque no se le mueve lo que le
gustó.

### Los tres peldaños

| # | Perfil | A dónde va |
|---|---|---|
| 1 | Le gustó el modelo pero no quiere esperar | **Mismo modelo en JdS6**: Tabachín $2,664,750 · Noni $3,161,125 |
| 2 | Quiere JdS6 pero otro tamaño o precio | Ceiba $2,602,050 · Flamboyán $2,225,850 |
| 3 | No le alcanza para casa | Departamentos JdS6: Capua desde $1,758,830 |

---

## 3. ⭐ El precio distinto como gancho — funciona en los dos sentidos

Los precios de JdS7 **van a ser distintos** a los de JdS6. Sea cual sea la
dirección, **hay argumento de venta**. Esto es lo que hay que tener listo antes
de conocer los precios oficiales:

### Si JdS7 sale MÁS BARATO (precio de preventa)

- **Gancho:** *"precio de preventa, antes de que suba"* — la urgencia es real y
  el ahorro es medible.
- **Riesgo a manejar:** canibaliza a JdS6. Quien puede esperar, espera.
- **Cómo se atiende:** segmentar por urgencia. Al que necesita entrega ya, JdS6
  no le compite — le resuelve. Y el diferencial de precio es el costo de no
  esperar, dicho de frente.

### Si JdS7 sale MÁS CARO

- **Gancho:** *"el mismo modelo, más barato y disponible ya, en Jardines del Sur
  6"* — argumento inmediato para cerrar sin esperar.
- **Y para quien igual quiere JdS7:** etapa nueva, obra reciente, plusvalía por
  delante.

**En los dos casos el tráfico de JdS7 se monetiza.** Lo que cambia es cuál de
los dos desarrollos se cierra, no si se cierra.

> **Regla de contenido:** cuando existan los precios oficiales, la comparación
> JdS6 vs JdS7 del mismo modelo debe estar **visible en la página**, no solo en
> el discurso del asesor. Es exactamente el tipo de dato que la competencia no
> publica y que hace que el cliente escriba.

---

## 4. ⚠️ Qué es y qué NO es competir contra uno mismo

> **Corregido el 24 ago 2026.** Esta sección se contradecía con el comentario de
> `jardines-del-sur-cancun/page.tsx` y la contradicción ya había producido una
> decisión equivocada: se estuvo a punto de NO hacer la página de precios de
> JdS7 creyendo que cualquier página con ese nombre en el título canibalizaba.
> **Lo detectó Florencio**, que insistió en que no cuadraba. Tenía razón.

### La regla, en una línea

**Dos páginas compiten cuando responden la MISMA pregunta, no cuando comparten
palabras.**

`/jardines-del-sur-6` y `/jardines-del-sur-6/precios` comparten el nombre entero
del desarrollo en el título y no compiten: una contesta *"qué es"* y la otra
*"cuánto cuesta"*. Son búsquedas distintas y Google las separa sin problema.

### La prueba está en este mismo sitio

Al 24 ago 2026, las páginas que llevan **"Jardines del Sur 6"**:

| Dónde | Cuántas |
|---|---|
| En el `<title>` | **11** — el silo, las 6 fichas, casas, departamentos, promociones, precios |
| En el `<h1>` | **5** |

Y Jardines del Sur 6 **no se hundió**. Lo que le costó visibilidad fue **quitar**
un término el 20 jun (los títulos, commit `0e6c60a`), no repetirlo; su CTR
incluso mejoró de 1.8% a 2.4%. Ver `metricas-negocio.md`.

Si repetir el nombre canibalizara, el desarrollo que más vende llevaría meses
destruido.

### El reparto de términos — esto es lo que sí hay que respetar

Cada página es dueña de UN término. Eso no impide que varias lleven el nombre
del desarrollo; impide que dos peleen por la MISMA frase con el mismo tipo de
contenido.

| Página | Término que le toca |
|---|---|
| `/` | `altta homes cancun` (marca) |
| `/jardines-del-sur-cancun` | `jardines del sur cancun`, `jardines del sur` |
| `/jardines-del-sur-6` | `jardines del sur 6` |
| `/jardines-del-sur-7` | `jardines del sur 7` ⭐ **posición 1.32, intocable** |
| `/<dev>/precios` | `precios <desarrollo>` |
| `/<dev>/promociones` | `promociones <desarrollo>` |
| `/<dev>/<modelo>` | `<modelo> <desarrollo>` |

### La única restricción real sobre "Jardines del Sur 7"

**El hub `/jardines-del-sur-cancun` no debe reclamar `jardines del sur 7` en su
`<title>` ni en su `<h1>`.** Ahí sí hay choque: el hub y `/jardines-del-sur-7`
son el mismo tipo de página —panorama del desarrollo— y pelearían la misma
frase. Mencionarlo en el cuerpo y enlazarlo **suma**, no resta.

**Fuera de esa página, no hay restricción.** Cuando JdS7 abra venta, sus fichas,
sus promociones y su lista de precios llevan el nombre en título y H1 igual que
las del 6. Sus títulos atacan `casa tabachin jardines del sur 7` o
`precios jardines del sur 7`, que no son la frase que defiende el silo.

### De dónde salió el malentendido

De **R1 de `sites/RIESGOS.md`**, que dice —correctamente— que dos SITIOS del
mismo dueño con el mismo contenido se canibalizan. Es un riesgo de **dominios**,
de cuando se evaluó publicar un segundo sitio. Se aplicó a páginas dentro del
mismo sitio, donde no aplica.

### Nombres de modelo repetidos (el problema original de esta sección)

Los nombres sí se repiten entre desarrollos:

| Modelo | Aparece en |
|---|---|
| **Noni** | JdS6 · La Rioja 2 · **y ahora JdS7** |
| **Tabachín** | JdS6 · **y ahora JdS7** |
| Cedro Plus | JdS6 · Lirios Residencial 2 |

**Aquí el riesgo sí es real**, porque son páginas del mismo tipo contestando lo
mismo. Y por eso la solución es **al revés de lo que se creía**: hay que poner el
desarrollo explícito en títulos, H1, URLs y JSON-LD —"Casa Noni en Jardines del
Sur 7", nunca "Casa Noni" a secas— **justamente para que dejen de ser la misma
página a ojos de Google.** Repetir el nombre del desarrollo es la cura, no la
enfermedad.

---

## 5. Preparación antes de la apertura

### Defender el #1 (mientras tanto)

1. **Frescura de obra.** La galería es del 23 jul 2026. Fotos nuevas cada mes
   son señal para Google y prueba de avance para el cliente. Es la palanca más
   barata: una visita a la obra, y el componente ya está hecho.
2. **Cobertura de búsquedas.** Hoy son 79 impresiones. Al abrir, la gente buscará
   variantes: *precios*, *modelos*, *cuándo abre*, *planos*, *casas*. Conviene
   que la página las responda **antes** de que haya volumen.
3. **Sin formulario de lista de espera** — decisión tomada, ver la memoria
   `jds7-preventa-sin-formulario`. El contacto entra por WhatsApp.

### Estar listo para el día 1

El día que salgan precios y modelos, la página debe cambiar **en horas, no en
días**. Lo que Florencio va a pasar: fotos, precios, metros, distribución y
planos de Tabachín y Noni.

Las fichas se arman con la plantilla existente y se alimentan de
`data/precios.json`, así que **entran al sitio y al cotizador a la vez**.

### Al abrir

SEO + Google Ads + Meta Ads + WhatsApp en conjunto. Con el #1 orgánico ya
ganado, la pauta amplifica en vez de tener que abrir camino.

---

## 6. Dominios defensivos — comprados, estacionados

`jardinesdelsur7.mx` (el más importante), `jardinesdelsur7cancun.com` y
`jardinesdelsur7cancun.mx`. **No se construye nada en ellos ni se redirigen** —
existen para que nadie más los use.

`jardinesdelsur7.com` se lo adelantó otro, pero **no resuelve en DNS**: lo tiene
apartado, sin usar. Conviene revisarlo de vez en cuando; si un día empieza a
responder, alguien va en serio por el término.
