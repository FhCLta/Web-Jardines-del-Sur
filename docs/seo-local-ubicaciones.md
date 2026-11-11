# Títulos de los desarrollos, ubicación con mapa y perfiles de Google

Trabajo del 5 y 6 nov 2026, pedido por Florencio. Dos objetivos:

1. Que los cuatro desarrollos tengan **el mismo formato de título** que
   `/jardines-del-sur-7`, que va en primer lugar.
2. Que cada página **se conecte con su perfil de Google Maps** (mapa, datos
   para Google y botones), igual que la del 7.

---

## 1. Títulos: un solo formato

**Formato:** `Nombre Cancún | Producto en venta`. Sin "en Cancún": el título del
7 no se toca (va #1) y dice "Jardines del Sur 7 Cancún" sin "en"; si los demás
lo llevaran, dejarían de ir parejos.

| Página | Título actual | Antes | Cambio |
|---|---|---|---|
| `/jardines-del-sur-6` | Jardines del Sur 6 Cancún \| Casas y departamentos en venta | Jardines del Sur 6 \| Casas y Departamentos en Cancún | 5 nov 2026 |
| `/jardines-del-sur-7` | Jardines del Sur 7 Cancún \| Próxima Apertura a la Venta | — | **No se toca nunca** |
| `/lirios-residencial-2` | Lirios Residencial 2 Cancún \| Departamentos en venta | Lirios Residencial 2 \| Departamentos en Cancún | 6 nov 2026 |
| `/la-rioja-2` | La Rioja Residencial 2 Cancún \| Casas de lujo en venta | La Rioja 2 Residencial \| Casas de Lujo en Cancún | 6 nov 2026 |

Todos caben sin cortarse (52–57 caracteres; Google corta cerca de 60).

**Qué NO cambió:** H1, URL (canonical) y, salvo Lirios, la descripción. El
`metaTitle` de cada desarrollo dice lo mismo que el título porque es el nombre
de la página en los datos para Google (JSON-LD).

**⚠️ La Rioja, orden de palabras.** Hasta el 6 nov decía "La Rioja **2
Residencial**" porque en los términos de Google Ads la gente teclea "la rioja 2
residencial". Florencio eligió "La Rioja **Residencial 2**" (como Lirios y como
el nombre oficial). Google entiende el orden distinto, pero **si la posición de
"la rioja 2" cae, este es el primer sospechoso**.

### 🧪 Prueba desde el 10 nov 2026: título = nombre del perfil de Google

Decisión de Florencio, para ver cómo posiciona. Solo dos páginas:

| Página | Título de prueba | Título que reemplaza (5/6–10 nov) |
|---|---|---|
| `/jardines-del-sur-6` | Jardines del Sur 6 \| Altta Homes Cancun | Jardines del Sur 6 Cancún \| Casas y departamentos en venta |
| `/la-rioja-2` | La Rioja Residencial 2 \| Altta Homes Cancun | La Rioja Residencial 2 Cancún \| Casas de lujo en venta |

El mismo día renombró el perfil de La Rioja a "La Rioja Residencial 2 \| Altta
Homes Cancun" (antes "La Rioja 2 \| …"), y su `placeName` se igualó. Sin acento
en "Cancun", como los perfiles. Lirios y Jardines del Sur 7 **no** entran en la
prueba. Las búsquedas de "casas"/"departamentos" las trabajan los catálogos
(`/casas-en-cancun`, `/departamentos-en-cancun`).

⚠️ Los títulos de noviembre tenían 4-5 días: Google no alcanzó a reflejarlos, así
que lo que se mida es la prueba contra lo que había antes del 5 nov. Medir
**hacia el 1 dic 2026** con Search Console (posición y CTR de "jardines del sur
6", "la rioja 2" y "la rioja residencial 2", página por página). Para regresar:
`seoTitleLead` y `metaTitle` en `dev-content.ts` (los comentarios guardan los
anteriores).

**Dónde se cambia:** `seoTitleLead` y `metaTitle` de cada desarrollo en
`app/(desarrollos)/_lib/dev-content.ts`. Comprobar siempre con
`python3 scripts/diseno/comparar-seo.py`: solo debe cambiar la página tocada.

**Cómo medir (hacia el 1 dic 2026):** Search Console, posición y CTR de
"jardines del sur 6", "lirios residencial 2" y "la rioja 2" contra antes del
cambio. Referencia previa: "jardines del sur 6" tenía 584 impresiones y 2.4% de
CTR (`docs/metricas-negocio.md`). Un título nuevo tarda de 1 a 4 semanas en
reflejarse; no volver a moverlo antes de medir.

---

## 2. Sección "Ubicación de X" con mapa

Viene del bloque `mapa` de cada desarrollo en `dev-content.ts` y la pinta
`app/(desarrollos)/_lib/SiloPage.tsx`, después de amenidades (el mismo orden
que el menú de anclas; "Ubicación" lleva a `#ubicacion`). Un desarrollo sin
`mapa` se queda como estaba.

| Campo | Para qué |
|---|---|
| `placeName` | Nombre exacto del perfil en Google |
| `cid` | Id del perfil. El mapa se incrusta por `cid`: así sale **un solo pin, con su ficha**. Buscando por nombre salían varios lugares parecidos |
| `url` | Link que abre el perfil (botones). Formato `https://www.google.com/maps?cid=…` |
| `placeUrl` | Link largo del perfil (para `hasMap` y `sameAs` del JSON-LD) |
| `geo`, `street`, `postalCode` | Los del perfil |
| `lead`, `puntos` | Texto e íconos de la sección. **Solo distancias medidas**, nunca a ojo |
| `residencial` | (opcional) Ubicación real del residencial cuando el perfil es la OFICINA, no el residencial (caso La Rioja) |
| `boton` | (opcional) Texto del botón principal; por omisión "Cómo llegar" |

El mapa no se carga hasta que el visitante lo pide (`components/MapEmbedCard.jsx`):
cero costo de velocidad.

**Datos para Google (JSON-LD):** un nodo `Residence` con coordenadas, `hasMap`
y `sameAs` al perfil. Con `residencial`, en cambio, van dos nodos: el
`Residence` en su ubicación real (sin enlazar perfiles ajenos) y un
`RealEstateAgent` `#oficina` con el perfil de Florencio.

**Cómo se midieron las distancias:** en línea recta desde el pin, con
OpenStreetMap (Overpass) y Google Maps. En el texto se dicen redondeadas y con
espacio duro entre número y unidad (`450 m`) para que en celular no quede
"2 km" solo en un renglón.

---

## 3. Los perfiles de Google de Florencio

| Perfil | cid | Coordenadas | Dirección que dice el perfil |
|---|---|---|---|
| Jardines del Sur 6 \| Altta Homes Cancun | 15319358797701757229 | 21.0826758, -86.8863806 | Av. 127 SM 342 MZ 27, 77536 |
| Jardines del Sur 7 \| Altta Homes Cancun | place `0x39666beb394ecc4c` | 21.0835955, -86.8914348 | Josefa Ortiz de Domínguez, 77500 |
| La Rioja Residencial 2 \| Altta Homes Cancun (hasta el 10 nov 2026: "La Rioja 2 \| …") | 10624409005148155448 | 21.1028811, -86.8795074 | Esquina Av. 135 y Av. 127, 77536 |
| Lirios Residencial 2 \| Altta Homes Cancun | 4371211098013598685 | 21.1283273, -86.8877574 | Av Robles, 77536 |

Jardines del Sur 6 vive en `lib/contacto.ts` (`OFFICE_*`, que también alimenta
la dirección del pie de página de todo el sitio); los demás, en su bloque
`mapa`.

### Trampas (no repetirlas)

- **El link corto `maps.app.goo.gl/9sKBR1fUNSswv5d19`**, que la web usó hasta el
  5 nov 2026 en el pie de página y en el inicio, **no es el perfil de
  Florencio**: lleva a otro lugar, hoy llamado solo "Jardines del Sur 6" (132
  reseñas).
- **"Oficina de ventas de La Rioja Residencial"** (998 385 1133) es la oficina
  oficial, no su perfil.
- **"LA RIOJA RESIDENCIAL 2"** en Maps es de otras personas: de ese lugar solo
  se usan las coordenadas, sin enlazarlo.
- Para identificar un perfil desde un link de búsqueda de Google: el parámetro
  `stick` trae, en base64 y gzip, el place id y el nombre.

---

## 4. Cada desarrollo

**Jardines del Sur 6.** Perfil en la calle Tucán, a 0.5 km del de Jardines del
Sur 7. Puntos: dirección, 10 min del aeropuerto, 500 m de Av. Huayacán, oficina
de ventas en el desarrollo.

**Lirios Residencial 2 — está en OTRA zona que el 6 y el 7.** Medido: Av. Las
Torres (en los mapas aparece como Av. Cancún, es la misma) a 450 m, Chedraui
Santuario a 560 m, Santuario María Desatadora de Nudos a 800 m, Av. 135 a 1.1
km, escuelas a ~1 km; Walmart, Soriana y Bodega Aurrera a menos de 2 km.
**La Av. Huayacán le queda a ~4 km** y el aeropuerto a ~10 km en línea recta.

**La Rioja 2 — su perfil es la oficina con casas muestra, no el residencial.**
La oficina (Av. 135 esq. Av. 127) es donde Florencio cita a sus clientes; el
residencial está junto a Jardines del Sur 6 (600 m), a 2.9 km de la oficina.
La sección dice las dos cosas: mapa y botón "Cómo llegar a las casas muestra"
a la oficina; en el texto, el residencial aparte. Desde el residencial: Av.
Huayacán ~540 m, aeropuerto 4.8 km en línea recta (por eso "10 min" y "500 m de
Huayacán" sí aplican a La Rioja). En "Lo esencial" dice **"Casas muestra:"**,
no "Ubicación:".

---

## 5. Datos falsos que se corrigieron

- **Lirios decía "A 10 min del aeropuerto y 500 m de Av. Huayacán"** en su
  descripción de Google y en su página de promociones: se había copiado del 6.
  Ahora dice "Junto a la Av. Las Torres, a 600 m del Chedraui Santuario". En
  `PromosPage.tsx`, `ZONA_POR_DEV` da a Lirios su propio texto de zona; el 6 y
  La Rioja conservan el general.
- **La Rioja decía "Ubicación: Av. 135 esq. Av. 127"**: ahí están las casas
  muestra, no las casas.
- **Todos los links a Maps** del sitio iban al lugar equivocado (ver Trampas).

---

## 6. Pendiente, fuera del repo (lo hace Florencio)

1. **Teléfono en los cuatro perfiles:** siguen con el 998 109 8443 (WhatsApp
   bloqueado). Cambiarlo al número nuevo, y el de la web en `lib/contacto.ts`.
2. **"Sitio web" de cada perfil → la página de su desarrollo**, no el inicio
   (`/jardines-del-sur-6`, `/jardines-del-sur-7`, `/la-rioja-2`,
   `/lirios-residencial-2`). Así perfil y página se confirman uno al otro.
3. **Dirección de Jardines del Sur 6:** el perfil dice "Av. 127 Supermanzana 342
   Manzana 27"; la web, desde el 5 nov 2026, la que dio Florencio: "Calle Tucán
   Mza 27 Lt 9, SM 341, Jardines del Sur 6". Hay que igualarlas en un lado o en
   el otro. Cambiar la dirección de un perfil puede pedir verificarlo otra vez.
4. **Search Console:** pedir indexación de las tres páginas cuyo título cambió.
