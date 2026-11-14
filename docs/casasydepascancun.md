# casasydepascancun — plan completo y estructura del código

Escrito el 14 nov 2026. Base: el código de **alttahomescancun.mx** (repo
`FhCLta/Web-Jardines-del-Sur`). El sitio nuevo **reusa el código**; el texto,
la marca y el diseño son nuevos.

> **Cómo se usa este documento**
> 1. Crear una carpeta y un repo nuevos en GitHub: `casasydepascancun`.
> 2. Copiar este archivo ahí como `PLAN.md`.
> 3. Abrir Claude Code en esa carpeta y pegar el prompt de la **§13**.
>
> Las secciones 1 a 12 son el plan. El prompt le dice a Claude Code que las lea
> y las siga, etapa por etapa.

---

## 1. El negocio

- **Qué es:** un sitio de bienes raíces en Cancún con **varios desarrollos en
  venta**, **casas y departamentos en renta** y **locales comerciales** (venta
  y renta).
- **De quién es:** de Florencio. Es un **activo que se renta**: un socio,
  *master broker* autorizado por los desarrollos y por los dueños de los
  locales, paga una renta por el sitio y recibe los contactos.
- **Cómo gana valor:** posicionándose en Google de forma orgánica (sin pagar
  anuncios), primero con el nombre de cada desarrollo (lo que llevó a
  alttahomescancun.mx al primer lugar) y después con búsquedas como "casas en
  venta en Cancún", "departamentos en renta en Cancún" o "locales comerciales
  en Cancún". Meta: el sitio inmobiliario más completo de Cancún, con cientos de
  páginas y más de mil con el inventario completo (§6).
- **Cómo se mantiene:** el inventario vive en **una hoja de Google y una
  carpeta de Google Drive**. El socio o Florencio actualizan la hoja y suben
  fotos; el sitio se actualiza solo, sin tocar código.

### Lo que eso obliga a diseñar desde el día uno

1. **Todo a nombre de Florencio:** dominio, Firebase, GitHub, Search Console,
   Analytics y la hoja de Google. El socio tiene permiso para **editar la
   hoja**, nunca es dueño de nada. Si un día cambia el inquilino, el activo se
   queda completo.
2. **El contacto del socio vive en un solo lugar** (pestaña `config` de la
   hoja). Cambiar de inquilino = cambiar una celda y esperar la siguiente
   actualización.
3. **Medir cada contacto que el sitio entrega.** Es lo que justifica la renta:
   clics a WhatsApp por mes, por página y por inmueble, medidos por el sitio y
   no por el socio (§7).
4. **El sitio dice quién lo opera.** Pie de página: "Operado por [nombre del
   socio], master broker autorizado". Da confianza al cliente y Google entiende
   quién es el negocio.

---

## 2. Qué se copia de alttahomescancun.mx y qué no

**Repo nuevo, no una copia del repo viejo.** Clonar el viejo y borrar arrastra
IDs de medición, el cotizador con precios internos, fotos pesadas de Altta y la
historia de git (riesgos R2, R3 y R7 de `sites/RIESGOS.md` en el repo viejo).
Se crea un proyecto limpio y se **portan** los módulos de esta lista,
leyéndolos del repo viejo.

### ✅ Se porta (código y patrones probados)

| Del repo viejo | Para qué sirve | Notas al portarlo |
|---|---|---|
| `package.json`: Next **16.2.4**, React **19.2.4**, TypeScript | Mismo stack | Misma versión exacta. Next 16 tiene cambios de ruptura: leer `node_modules/next/dist/docs/` antes de escribir código |
| `next.config.ts` (`output: "export"`, `images.unoptimized`) | Sitio estático: rápido, barato, sin servidor | Igual |
| `firebase.json`: `cleanUrls`, `trailingSlash: false`, cabeceras de caché | Hosting | Copiar solo las cabeceras genéricas (HTML `no-cache`, `_next/static` inmutable, imágenes 30 días). **No** los redirects ni las rutas `/api/precios.json` e `/inventario.json` |
| `lib/site.ts` | Fuente única del dominio (`SITE_URL`): canónicas, sitemap, Open Graph y JSON-LD salen de ahí | Igual |
| `lib/contacto.ts` | Teléfono y oficina en un solo lugar | Ahora lo llena la pestaña `config` de la hoja |
| `lib/whatsapp-ruta.ts` | Mensaje de WhatsApp según la página donde está el visitante | Adaptar: el mensaje lleva el **código del inmueble** (§7) |
| `components/FloatingWhatsApp.jsx`, `ContactNavBtn.jsx`, `SiteHeader.jsx` | Botones que acompañan en todas las páginas | `SiteHeader` usa mapas de nombres a mano para la migaja de pan: generarlos de los datos |
| `components/PropertyCard.jsx` | Tarjeta con galería, precio y botones | Base para tarjetas de desarrollo, renta y local |
| `app/(desarrollos)/_lib/ModelGallery.tsx`, `components/VirtualTourModal.jsx` | Galería y recorrido virtual 360° | Igual |
| `components/MapEmbedCard.jsx` | Mapa embebido con el pin del lugar | Igual |
| `app/(desarrollos)/_lib/SiloPage.tsx` | Página de un desarrollo: hero, intro, modelos, amenidades, ubicación, promociones | Ver §4: alimentada por la hoja |
| `app/(desarrollos)/_lib/ModelPage.tsx` | Ficha de modelo: hero, galería, distribución, tour, precios por nivel, relacionados | Igual |
| `app/(catalogo)/_lib/TipoPage.tsx` | Catálogo por tipo cruzando desarrollos ("Casas en Cancún") | Base de las páginas de venta y renta |
| `app/(desarrollos)/_lib/dev-meta.ts` | Arma título y descripción SEO con el conteo y el "desde" sacados del inventario | El "desde" **siempre calculado**, nunca escrito a mano |
| `app/(desarrollos)/_lib/promo-tarjeta.ts` + bloque `promos` de `dev-content.ts` | Promoción con cuenta regresiva que se apaga sola al vencer | Las promociones vienen de la pestaña `promociones` |
| `app/agendar-cita/` (`horario.ts`, `AgendarCita.tsx`, `PaginaCita.tsx`) | Agendar cita: día y hora calculados en el navegador en hora de Cancún, y el mensaje sale por WhatsApp | Oficinas y horario desde `config` |
| `components/MortgageCalculator.jsx` + `app/calculadora-hipotecaria/` | Calculadora hipotecaria | Igual |
| `app/blog/_lib/posts.ts` + `app/blog/[slug]/` | Blog como datos (bloques p/h2/ul/cta), sin MDX | Igual |
| `app/preguntas-frecuentes/` | Preguntas frecuentes con JSON-LD `FAQPage` | Texto nuevo |
| `app/sitemap.ts`, `app/robots.ts` | Sitemap y robots | El sitemap solo lleva páginas indexables (§6) |
| `app/whatsapp/` | Página de aterrizaje para anuncios que abre WhatsApp | Con los IDs de medición NUEVOS |
| `lib/texto-modelo.ts` (`altDeFoto`) | Texto alternativo de cada foto a partir del nombre del archivo | Igual |
| `app/globals.css` | Arreglos de celular: `text-size-adjust`, navegador interno de Facebook/Instagram, `text-wrap: balance/pretty` | Copiar los arreglos. **Los colores y las letras son nuevos** (§8) |
| `scripts/fotos-jds6-nov2026.mjs` | Fotos a WebP con sharp: 1280 px q80, miniaturas 640 px q65, nombre descriptivo | Base del paso de fotos desde Drive (§5) |
| `scripts/check-precios.mjs` | Revisa que los datos cuadren y **falla** si no | Base de `validar-datos.mjs` (§5) |
| `scripts/diseno/verificar-pantallas.mjs` | Revisa 360, 390 y 1280 px: desborde, texto cortado, huérfanas, toques chicos, cajas vacías | Igual |
| `scripts/diseno/comparar-seo.py` | Compara title, description, canonical, H1 y JSON-LD de lo compilado contra producción | Cambiar `PROD` al dominio nuevo |

### ❌ NO se porta

- **IDs de medición:** `GTM-53BHDRWC`, `AW-18157218280` y su etiqueta, el token
  de Search Console de `app/layout.tsx`. El sitio nuevo tiene los suyos.
- **El cotizador** (`public/cotizador/`), `data/precios.json`,
  `/api/precios.json`, `/inventario.json`: son herramientas y contratos de
  Florencio con Altta.
- **Textos, fotos y logos de Altta**, `dev-content.ts` con su contenido,
  `data/inventory.json`.
- **El teléfono y el perfil de Google de Florencio** (`lib/contacto.ts` con sus
  datos).
- **El pie de página copiado en 12 archivos** (deuda del sitio viejo): aquí es
  un solo `<SiteFooter />` desde el principio.
- Nada de Meta (Píxel, CAPI) salvo que Florencio lo decida aparte.

---

## 3. Stack y estructura de carpetas

```
casasydepascancun/
├── PLAN.md                     ← este documento
├── CLAUDE.md                   ← reglas permanentes (Claude Code lo crea en la etapa 1)
├── app/
│   ├── layout.tsx              ← fuentes, metadata base, GTM nuevo, SiteHeader/SiteFooter
│   ├── page.tsx                ← inicio
│   ├── globals.css             ← tokens de diseño (§8) + arreglos de celular
│   ├── [desarrollo]/           ← silo de cada desarrollo, en la raíz como en Altta (§6.2)
│   │   ├── page.tsx            ← SiloPage
│   │   ├── [modelo]/page.tsx   ← ModelPage
│   │   ├── casas/ · departamentos/ · precios/ · promociones/ · avance-de-obra/
│   ├── desarrollos/page.tsx    ← todos los desarrollos
│   ├── casas-en-venta-cancun/  ← hubs por tipo y operación (§6.3), con subpáginas de presupuesto
│   ├── departamentos-en-venta-cancun/
│   ├── casas-en-renta-cancun/
│   ├── departamentos-en-renta-cancun/
│   ├── locales-en-renta-cancun/ · locales-en-venta-cancun/
│   ├── renta/[inmueble]/page.tsx   ← ficha de casa o depa en renta
│   ├── locales/[local]/page.tsx    ← ficha de local
│   ├── zonas/[zona]/           ← zona y zona + tipo, solo con inventario suficiente (§6.4)
│   ├── constructoras/[constructora]/
│   ├── preventa-cancun/ · entrega-inmediata-cancun/ · casas-con-infonavit-cancun/ …
│   ├── precios/ · promociones/
│   ├── agendar-cita/
│   ├── calculadora-hipotecaria/
│   ├── blog/
│   ├── preguntas-frecuentes/
│   ├── aviso-de-privacidad/
│   ├── whatsapp/               ← aterrizaje de anuncios
│   ├── sitemap.ts
│   └── robots.ts
├── components/                 ← SiteHeader, SiteFooter, FloatingWhatsApp, PropertyCard,
│                                  ListingCard, Filtros, Gallery, MapEmbedCard, etc.
├── lib/
│   ├── site.ts                 ← SITE_URL
│   ├── datos.ts                ← ÚNICA puerta a los datos (lee data/generado/*.json)
│   ├── contacto.ts             ← lee config: WhatsApp y nombre del socio
│   ├── whatsapp.ts             ← arma mensaje + enlace con código del inmueble
│   └── seo.ts                  ← títulos, descripciones y JSON-LD
├── data/
│   └── generado/               ← lo escribe el script de la hoja; NO se edita a mano
│       ├── desarrollos.json
│       ├── modelos.json
│       ├── rentas.json
│       ├── locales.json
│       ├── promociones.json
│       └── config.json
├── public/fotos/               ← WebP generados desde Drive (no se editan a mano)
├── scripts/
│   ├── traer-hoja.mjs          ← hoja de Google → data/generado/*.json
│   ├── traer-fotos.mjs         ← Drive → WebP en public/fotos
│   ├── validar-datos.mjs       ← falla si algo no cuadra (§5)
│   ├── auditar-seo.mjs         ← falla si hay títulos repetidos, huérfanas, etc. (§6.12)
│   └── diseno/                 ← verificar-pantallas.mjs, comparar-seo.py
├── .github/workflows/
│   └── actualizar.yml          ← la actualización automática (§5)
└── firebase.json
```

**Regla de oro de los datos:** ninguna página lee la hoja ni los JSON
directamente. Todo pasa por `lib/datos.ts`, que entrega los inmuebles ya
filtrados (sin los inactivos) y ya calculados ("desde", conteos). Es lo que
hace `getInventory()` en el sitio viejo: un solo lugar decide qué se publica.

---

## 4. Los cuatro tipos de inmueble

| Tipo | Cómo se organiza | Página | Ejemplo de URL |
|---|---|---|---|
| **Desarrollo en venta** | Desarrollo → modelos (igual que Altta) | SiloPage + ModelPage | `/residencial-x/casa-modelo-y` |
| **Casa o depa en renta** | Un inmueble = una ficha | Ficha de renta | `/renta/depa-2-recamaras-zona-sur-r014` |
| **Local comercial** | Un local = una ficha, en venta o renta | Ficha de local | `/locales/local-45-m2-av-tulum-l007` |
| **Promoción** | Cuelga de un desarrollo o modelo | Tarjeta + `/promociones` | — |

- **Venta** usa la estructura que ya funciona en alttahomescancun.mx.
- **Rentas y locales son distintos:** un solo inmueble, con renta mensual,
  depósito, si está amueblado, si aceptan mascotas, y desde cuándo está
  disponible. Y se rentan en semanas. Por eso llevan **listados con filtros**
  (zona, recámaras, precio, amueblado) y fichas sencillas, no silos.
- **Filtros:** se filtran en el navegador sobre los datos que ya vienen en la
  página. Los filtros cambian la URL (`?recamaras=2`) pero la canónica es
  siempre la página base: Google no indexa combinaciones de filtros.
- **El slug lleva el código** del inmueble (`r014`, `l007`): si cambia la
  descripción, la URL no cambia.

### Cuando algo se vende o se renta

Columna `estado` de la hoja: `disponible` · `apartado` · `vendido` / `rentado`.

- `apartado`: sigue publicado con etiqueta "Apartado".
- `vendido`/`rentado`: sale de listados y sitemap; su ficha se queda **60 días**
  con "Ya se rentó · Mira opciones parecidas" y `noindex`. Después se borra y
  su URL redirige (301) al listado de su tipo; el script genera esos redirects.
- **Inmueble sin actualizar en 30 días** (`fecha_actualizacion`): se oculta solo
  y aparece en el aviso a Florencio. Un depa ya rentado que sigue publicado
  quita más confianza que uno que no está.

---

## 5. Google Drive como panel: actualización automática

### La hoja de Google (una sola, con pestañas)

| Pestaña | Columnas principales |
|---|---|
| `desarrollos` | id, nombre, slug, constructora, zona, colonia, tipo (casas/departamentos/ambos), estado (preventa/venta/agotado), descripción, amenidades (separadas por `\|`), lat, lng, link de Google Maps, cid del perfil de Google, carpeta_fotos, carpeta_obra (fotos de avance con fecha), recorrido_virtual, entrega (inmediata o fecha), financiamiento (bancario/Infonavit/Fovissste), activo, fecha_actualizacion |
| `modelos` | id, desarrollo_id, nombre, tipo, recámaras, baños, m2_construcción, m2_terreno, niveles (texto por nivel), precio, precio_por_anunciar, carpeta_fotos, recorrido_virtual, activo, fecha_actualizacion |
| `rentas` | código, tipo (casa/depa), zona, colonia, renta_mensual, depósito, amueblado, mascotas, recámaras, baños, m2, estacionamientos, disponible_desde, estado, descripción, carpeta_fotos, fecha_actualizacion |
| `locales` | código, operación (venta/renta), zona, dirección pública, m2, precio, uso_permitido, estacionamiento, estado, descripción, carpeta_fotos, fecha_actualizacion |
| `promociones` | desarrollo_id, modelo_id, beneficios (separados por `\|`), condición, vence (AAAA-MM-DD), nota |
| `config` | whatsapp_socio (52 + 10 dígitos), nombre_socio, leyenda_operador, oficinas (nombre, dirección, mapa), horario de citas, correo de avisos |

- Validaciones de la propia hoja (listas desplegables para `estado`, `tipo`,
  `zona`) para que nadie escriba "Disponible " con espacio.
- **Una carpeta de Drive por inmueble**; el orden de las fotos sale del nombre
  (`01-fachada.jpg`, `02-sala.jpg`…). La primera es la portada.

### Por qué al compilar y no en el navegador

Google tiene que ver el inventario en el HTML. Si la página fuera a la hoja
cada vez que alguien la abre, Google vería una página vacía. Por eso un script
lee la hoja **al compilar**, escribe los JSON y el sitio se publica estático,
igual que hoy.

### El flujo automático (GitHub Actions)

```
 Hoja + Drive ──► traer-hoja.mjs ──► validar-datos.mjs ──► traer-fotos.mjs
                                          │ falla                │
                                          ▼                      ▼
                              correo a Florencio,         npm run build
                              el sitio NO cambia                 │
                                                                 ▼
                                    auditar-seo.mjs (§6.12)
                                                                 │
                                                                 ▼
                                                firebase deploy --only hosting
```

- **Cuándo corre:** cada 6 horas (`schedule`), con un botón manual
  (`workflow_dispatch`) y, opcional, un menú "Publicar ahora" en la hoja
  (Apps Script que llama `repository_dispatch`).
- **Solo publica si algo cambió:** guarda una huella de los datos y de la fecha
  de modificación de cada foto; si es igual a la anterior, termina sin
  publicar.
- **Acceso:** una cuenta de servicio de Google Cloud con permiso de **solo
  lectura** sobre la hoja y la carpeta (APIs de Sheets y Drive). Sus llaves y
  la de Firebase viven en los *secrets* de GitHub, **nunca en el repo**.
- **Fotos:** se bajan de Drive, se convierten a WebP (1280 px q80 y miniatura
  640 px q65, como en Altta) y se nombran con el slug del inmueble y el
  espacio (`depa-zona-sur-r014-sala.webp`): eso ayuda al SEO y obliga al
  navegador a pedir la foto nueva cuando cambia, a pesar de la caché de 30
  días. Se guardan en caché entre corridas para no reconvertir todo.

### `validar-datos.mjs`: falla antes de publicar algo falso

Si falla, el sitio publicado no cambia y llega un correo con la lista de
errores. Revisa:

- Campos obligatorios vacíos, precios que no son número, estados o zonas que no
  existen en la lista.
- Slugs o códigos repetidos.
- Inmuebles activos sin fotos o con la carpeta vacía.
- WhatsApp del socio con formato distinto a `52` + 10 dígitos.
- Promociones con `vence` ya pasado (se omiten y se avisa).
- Rentas y locales con `fecha_actualizacion` de más de 30 días (se ocultan y se
  avisa).

**Lección del sitio viejo:** "un rótulo que no cuadra es peor que ningún
rótulo". Todo lo que es número ("desde $X", "N modelos", "N departamentos en
renta") se **calcula** de los datos. Nunca se escribe a mano en un texto.

---

## 6. SEO: el sistema de alttahomescancun.mx, llevado a escala

La meta es ser **el sitio inmobiliario más completo de Cancún**: cientos de
páginas al arranque y más de mil con el inventario completo, cada una
contestando una búsqueda real. El método no es nuevo: es el que llevó a
alttahomescancun.mx al primer lugar, repetido por cada desarrollo, zona y
tipo de inmueble.

### 6.1 Lo que funcionó en alttahomescancun.mx (con datos)

| Qué se hizo | Resultado |
|---|---|
| Página propia para un desarrollo **antes de que se vendiera** (`/jardines-del-sur-7`, creada el 9 jun 2026) | **Posición 1.32** y 47.7% de CTR para "jardines del sur 7" en agosto; 66.7% de CTR en "jardines del sur 7 cancun". **10-15 contactos sin costo** antes de abrir la venta |
| Página de **precios antes de tener precios** (`/jardines-del-sur-7/precios`) | Captura "precios jardines del sur 7" desde antes; se llena el día que salgan |
| **Silo por desarrollo:** el desarrollo, cada modelo, casas, departamentos, precios, promociones y cita, cada una con el nombre del desarrollo en título y H1 | 11 páginas con "Jardines del Sur 6" en el título **sin canibalizarse**: cada una responde una pregunta distinta |
| **Perfil de Google por desarrollo**, con su nombre igual al título de la página y el mapa incrustado por `cid` | Señal local fuerte: Google ve el mismo nombre, dirección y coordenadas en la web y en el perfil |
| Búsquedas con nombre de desarrollo | En Google Ads: `[oficina de ventas jardines del sur 6]` a $0.47 por contacto contra $435 de la marca. **El nombre del desarrollo es la búsqueda que más vende** |

**Y lo que costó (para no repetirlo):**

- **20 jun 2026: se cambiaron todos los títulos a la marca** y el término
  "Jardines del Sur Cancún" desapareció del sitio. Se perdió esa búsqueda y
  hubo que hacer una página aparte para recuperarla. Lección: **los títulos
  mandan; no se cambian en bloque, y se mide en Search Console antes de
  moverlos.**
- **Modelos con el mismo nombre en varios desarrollos** (Noni, Tabachín, Cedro
  Plus). La cura es poner el desarrollo explícito en título, H1, URL y JSON-LD:
  "Casa Noni en Jardines del Sur 7", nunca "Casa Noni" a secas. Con varias
  constructoras esto pasa mucho más.
- **El inicio no nombra a un solo desarrollo:** se lleva entre las patas a los
  demás.

### 6.2 La unidad que se repite: el silo de cada desarrollo

Cada fila activa de la pestaña `desarrollos` genera, sola, este grupo de
páginas. Es la estructura de Altta, sin cambios de forma:

| Página | URL | Búsqueda que es suya | Existe cuando |
|---|---|---|---|
| El desarrollo | `/[desarrollo]` | "[desarrollo]", "[desarrollo] cancun" | Siempre que esté activo (también en preventa) |
| Cada modelo | `/[desarrollo]/[modelo]` | "[modelo] [desarrollo]" | El modelo tiene fotos y m² |
| Casas / Departamentos | `/[desarrollo]/casas`, `/[desarrollo]/departamentos` | "casas en [desarrollo]" | El desarrollo tiene **los dos** tipos |
| Precios | `/[desarrollo]/precios` | "precios [desarrollo]" | Siempre (en preventa: "precios por anunciar", como JdS7) |
| Promociones | `/[desarrollo]/promociones` | "promociones [desarrollo]" | Hay una promoción vigente |
| Avance de obra | `/[desarrollo]/avance-de-obra` | "avance de obra [desarrollo]" | Hay fotos de obra con fecha del último mes |
| Agendar cita | `/agendar-cita/[desarrollo]` | "cita [desarrollo]", "oficina de ventas [desarrollo]" | Tiene oficina o casa muestra |

**Rutas cortas en la raíz** (`/[desarrollo]`, no `/desarrollos/[desarrollo]`),
como hizo Altta al acortar sus silos. Las rutas fijas (`/casas-en-venta-cancun`,
`/promociones`…) tienen prioridad sobre la dinámica; `validar-datos` impide que
un desarrollo se llame igual que una ruta fija.

Cada silo lleva, como en Altta: hero, introducción con texto propio, modelos,
amenidades, **ubicación con mapa del perfil de Google**, promociones al final,
y un botón de WhatsApp con mensaje propio de esa página.

### 6.3 Las páginas que reúnen (hubs)

Cruzan todos los desarrollos e inmuebles. Atacan las búsquedas genéricas.

| Hub | URL | Búsqueda |
|---|---|---|
| Por tipo y operación | `/casas-en-venta-cancun`, `/departamentos-en-venta-cancun`, `/casas-en-renta-cancun`, `/departamentos-en-renta-cancun`, `/locales-en-renta-cancun`, `/locales-en-venta-cancun` | "casas en venta en cancun"… |
| Por zona | `/zonas/[zona]` y `/zonas/[zona]/[tipo-operacion]` | "departamentos en renta zona sur cancun" |
| Por constructora | `/constructoras/[constructora]` | "casas [constructora] cancun" |
| Por presupuesto | `/casas-en-venta-cancun/menos-de-2-millones`… | "casas de 2 millones en cancun" |
| Por crédito | `/casas-con-infonavit-cancun`, `/casas-con-fovissste-cancun` | "casas con infonavit en cancun" |
| Por característica | `/departamentos-amueblados-renta-cancun`, `/departamentos-pet-friendly-cancun`, `/casas-con-alberca-cancun` | las mismas palabras |
| Preventa | `/preventa-cancun` | "preventa casas cancun", "preventa departamentos cancun" |
| Entrega inmediata | `/entrega-inmediata-cancun` | "casas entrega inmediata cancun" |
| Precios | `/precios` | "precios de casas en cancun" |
| Promociones | `/promociones` | "promociones casas cancun" |
| Todos los desarrollos | `/desarrollos` | "desarrollos en cancun", "nuevos desarrollos cancun" |

Todos salen de las columnas de la hoja (`zona`, `constructora`,
`financiamiento`, `precio`, `amueblado`, `mascotas`, `amenidades`, `estado`,
`entrega`). Una columna nueva en la hoja puede abrir una familia nueva de
páginas sin tocar el diseño.

### 6.4 Compuertas: una página existe solo si tiene algo que decir

**Publicada no es lo mismo que indexada.** Google decide qué indexa, y cuando
un sitio tiene muchas páginas flojas ("Rastreada: actualmente sin indexar"),
**castiga al sitio entero**, no solo a esas páginas. Por eso cada familia tiene
una compuerta que revisa `lib/datos.ts` al compilar:

| Página | Se genera solo si… |
|---|---|
| Hub de zona, presupuesto, crédito o característica | **3 o más** inmuebles activos que cumplan |
| Constructora | **2 o más** desarrollos activos |
| Ficha de modelo | 3+ fotos y m² de construcción |
| Ficha de renta o local | disponible o apartado, 3+ fotos, descripción de 300+ caracteres, actualizada hace menos de 30 días |
| Silo de desarrollo | descripción propia de 300+ caracteres y 3+ fotos |

Lo que no pasa la compuerta **no se genera y no entra al sitemap**; cuando
llega al mínimo, aparece sola en la siguiente actualización. Los filtros
(`?recamaras=2`) nunca son páginas nuevas: su canónica es la página base.

### 6.5 Cuántas páginas: escenarios

Cálculo con un silo de ~9 páginas por desarrollo (desarrollo, 4 modelos,
precios, promociones, avance de obra, cita):

| Momento | Inventario | Páginas aprox. |
|---|---|---|
| Arranque | 10 desarrollos, 20 rentas, 10 locales | 90 silo + 25 hubs + 30 fichas + 15 herramientas y blog = **~160** |
| 6 meses | 25 desarrollos, 80 rentas, 40 locales | 225 + 60 + 120 + 40 = **~450** |
| Completo | 50 desarrollos, 300 rentas, 120 locales | 450 + 120 + 420 + 80 = **~1,000+** |

**La meta que importa no es el número de páginas, sino cuántas reciben
impresiones en Search Console.** Mil páginas que nadie ve no rentan el sitio;
doscientas que salen en Google, sí.

### 6.6 Títulos, H1 y descripciones: las fórmulas

Todas se arman en `lib/seo.ts` con datos de la hoja (patrón de
`dev-meta.ts`). Máximo 60 caracteres en el título: `auditar-seo` avisa si se
pasa.

| Página | Título | H1 |
|---|---|---|
| Inicio | `Casas y Depas Cancún \| Venta, renta y locales comerciales` (no nombra a un solo desarrollo) | Casas, departamentos y locales en Cancún |
| Desarrollo | `[Desarrollo] Cancún \| [Casas/Departamentos] en venta` (formato que usa Altta desde nov 2026) | [Casas/Departamentos] en [Desarrollo], Cancún |
| Modelo | `[Modelo] en [Desarrollo], Cancún · Desde $X MXN` | [Modelo] en [Desarrollo] |
| Casas / Deptos del desarrollo | `Casas en [Desarrollo] \| [Marca]` | Casas en [Desarrollo] |
| Precios / Promociones / Cita | `Precios en [Desarrollo] \| [Marca]` (igual con Promociones y Agendar cita) | Precios de [Desarrollo] |
| Hub tipo | `Casas en venta en Cancún \| [Marca]` | Casas en venta en Cancún |
| Hub zona | `Departamentos en renta en [Zona], Cancún` | lo mismo |
| Ficha renta | `Depa en renta de 2 recámaras en [Zona], Cancún · $14,000/mes` | Departamento de 2 recámaras en renta en [Zona] |
| Ficha local | `Local en renta de 45 m² en [Calle], Cancún` | lo mismo |

- **El desarrollo siempre explícito** en título, H1, URL y JSON-LD.
- **Descripción con datos calculados:** cuántos modelos, el "desde" real, la
  zona y la llamada a WhatsApp. Ejemplo: "4 modelos de casas de 3 recámaras en
  Residencial X, Zona Sur de Cancún, desde $2,225,850. Fotos, precios y
  recorridos. Escríbenos por WhatsApp."
- **Un título que va bien no se toca.** Si se prueba otro formato, se cambia en
  una familia de páginas, se anota la fecha y se mide 3-4 semanas en Search
  Console antes de extenderlo (lección del 20 jun).
- **Slugs sin acentos** con la función `slugifyModel` del sitio viejo.

### 6.7 Datos para Google (JSON-LD)

Los mismos tipos que ya usa alttahomescancun.mx, más los de renta:

| Página | Tipos |
|---|---|
| Todo el sitio | `RealEstateAgent` (el negocio y su operador), `WebSite`, `BreadcrumbList` |
| Desarrollo | `Residence` con `geo`, `hasMap` y `sameAs` al perfil de Google; `OfferCatalog` con los modelos; `ImageGallery` |
| Modelo | `Offer` (`priceCurrency: MXN`), `QuantitativeValue` para m², `ImageObject` |
| Hubs | `CollectionPage` + `ItemList` |
| Renta | `Apartment`/`House` con `numberOfRooms`, `floorSize`, `petsAllowed`; `Offer` con `UnitPriceSpecification` (`unitCode: "MON"`) |
| Preguntas | `FAQPage` |
| Blog | `Blog`, `BlogPosting` |

El JSON-LD sale de los **mismos datos** que la página: nunca puede decir un
precio distinto al visible.

### 6.8 Enlazado interno: ninguna página huérfana

Lo que hace Altta, más lo que pide la escala:

- **Migas de pan** en todas las páginas (Inicio › Zona Sur › Residencial X ›
  Casa Y), con su `BreadcrumbList`.
- **Dentro del silo:** el desarrollo enlaza a sus modelos, precios,
  promociones y cita; cada modelo enlaza de vuelta y a "otros modelos de este
  desarrollo".
- **El mismo modelo en otros desarrollos** (bloque de Altta): enlaza las fichas
  con el mismo nombre de modelo.
- **"Cerca de aquí":** cada ficha enlaza 3-6 inmuebles de su misma zona y
  operación.
- **Hubs → fichas y fichas → hubs:** cada ficha enlaza su zona, su tipo y su
  constructora.
- **Pie de página** con los hubs principales; dentro de un desarrollo, el pie
  lleva a SUS precios (como Altta).
- `auditar-seo` falla si una URL del sitemap no recibe al menos un enlace
  interno.

### 6.9 Perfiles de Google y ubicación

Es la pieza local que más pesó en Altta:

- **Un perfil por oficina o casa muestra real** del socio, con atención al
  público. Google suspende los perfiles de lugares que no existen.
- **Florencio como administrador** de cada perfil, para que el activo no
  dependa de nadie.
- Nombre del perfil igual al título de su página; dirección y coordenadas
  iguales en la web, en el JSON-LD y en el perfil.
- Sección **"Ubicación de [desarrollo]"** con mapa incrustado por `cid` (un solo
  pin con su ficha) que se carga hasta que el visitante lo pide
  (`MapEmbedCard`).
- Botón **Reserva** del perfil → `/agendar-cita/[desarrollo]` (el WhatsApp va en
  el campo **Chat**, no en Reserva: Google no acepta enlaces de mensajería ahí).
- **Solo distancias medidas** ("a 500 m de Av. Huayacán"), nunca copiadas de
  otro desarrollo. En Altta, Lirios llevó meses con datos de otro desarrollo.

### 6.10 Frescura

- **`lastmod` real en el sitemap:** la fecha de la última edición de esa fila
  en la hoja, no la fecha de compilación. Google confía en `lastmod` solo si es
  honesto.
- **Avance de obra mensual** con fecha en los desarrollos en construcción.
- **Promociones del mes** con cuenta regresiva que se apaga sola.
- **Blog:** 2 artículos al mes, contestando dudas reales (crédito, zonas,
  costos de escrituración, rentar vs comprar).
- Fichas de renta con "Actualizado el [fecha]" visible.

### 6.11 Sitemap e indexación a escala

- **Sitemap índice dividido por familia:** desarrollos, modelos, hubs, rentas,
  locales, blog. En Search Console se ve qué familia indexa y cuál no.
  (Verificar en `node_modules/next/dist/docs/` que `generateSitemaps` funcione
  con `output: "export"`; si no, los genera un script al compilar).
- Solo páginas que pasaron su compuerta e indexables.
- **No usar la API de indexación de Google:** solo es para ofertas de empleo y
  transmisiones en vivo; usarla para inmuebles va contra sus reglas.
- Revisar cada semana el informe **Páginas** de Search Console: indexadas vs.
  "rastreada, sin indexar". Si una familia no indexa, se sube su compuerta o
  se mejora su contenido. No se empuja.

### 6.12 Auditoría automática antes de publicar

`scripts/auditar-seo.mjs` corre en la actualización automática, después del
build y **antes** de publicar. Si falla, no se publica:

- Títulos o descripciones **repetidos** entre páginas.
- Página sin H1, sin canónica, o con título de más de 60 caracteres.
- URL del sitemap que da 404 en el `out/`, o página `noindex` dentro del
  sitemap.
- Página huérfana (sin enlaces internos).
- JSON-LD con un precio distinto al visible.

Además, `comparar-seo.py` (portado) compara cada página contra producción para
ver qué cambió en el título, la descripción, la canónica o el H1 antes de
publicar a mano.

### 6.13 Autoridad (enlaces de otros sitios)

Con un dominio nuevo, los enlaces de calidad aceleran todo:

- Que los desarrolladores enlacen al sitio desde su página ("dónde comprar",
  "asesores autorizados").
- Perfiles de Google del socio con el enlace al sitio.
- Directorios locales serios y la asociación inmobiliaria a la que pertenezca
  el socio.
- Videos de recorridos en YouTube con el enlace a su ficha.
- **Nunca comprar enlaces:** Google castiga al sitio completo.

### 6.14 ⚠️ No competir con alttahomescancun.mx

alttahomescancun.mx va #1 en "jardines del sur 7" y fuerte en los otros
desarrollos de Altta. Si el sitio nuevo publica páginas sobre **Jardines del
Sur 6, Jardines del Sur 7, La Rioja 2 o Lirios Residencial 2**, Google ve dos
sitios del mismo dueño respondiendo lo mismo, elige uno y hunde el otro.

- **Por omisión:** el sitio nuevo **no** tiene páginas de los desarrollos de
  Altta. Cambiarlo es decisión de Florencio (§12).
- **Google Ads:** si algún día los dos sitios se anuncian, cada uno con sus
  propias palabras. Google no deja que un mismo negocio salga dos veces en la
  misma búsqueda, y puede suspender la cuenta.

### 6.15 Tiempos

alttahomescancun.mx puso a Jardines del Sur 7 en primer lugar en unos dos
meses (página del 9 jun, posición 1.32 en agosto). Lo mismo se espera aquí
**donde nadie más tiene una página dedicada**:

| Búsqueda | Competencia | Tiempo estimado |
|---|---|---|
| Nombre de desarrollo o modelo, "precios [desarrollo]" | Poca: casi nadie hace página por desarrollo | Semanas a 3 meses, como JdS7 |
| Zona + tipo ("departamentos en renta zona sur cancun") | Media | 2 a 4 meses |
| Genéricas ("casas en venta en cancun") | Los portales grandes | Más largo; se ganan con el volumen de páginas buenas, los enlaces y los perfiles de Google |

Por eso el orden: **primero los silos de desarrollo** (ganan rápido y traen
contactos que valen), luego zonas, al final lo genérico.

---

## 7. Medición: la prueba de que el sitio vale la renta

- **Propios desde el día uno:** contenedor de Google Tag Manager, propiedad de
  GA4 y propiedad de Search Console del dominio nuevo.
- **Cada botón de WhatsApp manda un evento** `whatsapp_click` con: tipo
  (venta / renta / local), código del inmueble y página. Igual el de "Agendar
  cita".
- **El mensaje de WhatsApp lleva el código:** "Hola, me interesa el
  departamento en renta R014 (Zona Sur). ¿Sigue disponible?". El socio sabe qué
  quiere el cliente sin preguntar, y Florencio puede comparar sus números con
  los del socio.
- **Reporte mensual** (Looker Studio, compartido con el socio): contactos por
  mes, por tipo y por inmueble, y búsquedas de Google que traen visitas.
- El número de WhatsApp sale de `config`. Si cambia el socio, los eventos
  siguen contando igual.

---

## 8. Diseño (por investigar)

Se decide en una sesión aparte, con investigación de por medio. Lo que sí queda
fijo:

- **Tokens en `:root`** (`--primary`, `--accent`, `--background`, `--surface`,
  `--text-primary`, `--text-secondary`, radios y sombras), como en el sitio
  viejo. Mientras no haya colores, se usan neutros de prueba; cambiar la paleta
  es tocar solo esos tokens.
- **Celular primero:** se diseña a 360 px y se revisa en 360, 390 y 1280 con
  `verificar-pantallas.mjs`, mirando las capturas.
- Reglas de celular heredadas (cada una salió de una corrección real):
  - nada mueve la página de lado;
  - ninguna palabra sola en el último renglón (`text-wrap: balance` en
    títulos, `pretty` en párrafos);
  - la flecha va pegada a su texto con espacio duro (`Ver más →`);
  - nombres con número con espacios duros para que el número no quede solo (en
    lo visible, nunca en title/description/WhatsApp);
  - zona de toque de al menos 44 px;
  - el precio nunca se separa de su "desde" ni de "MXN";
  - ninguna caja vacía a la vista;
  - en iPhone, campos de formulario con letra de 16 px o más (si no, Safari
    hace zoom).
- Por investigar: paleta, tipografías, logo, estilo de fotos, y cómo se ven
  los portales grandes y los brokers locales para diferenciarse.

---

## 9. Trampas técnicas que ya costaron en el sitio viejo

1. **Next 16 no es el que conoces:** `params` es una promesa (`await params`);
   rutas dinámicas con `generateStaticParams` + `dynamicParams = false`; con
   `output: "export"` no hay servidor ni optimización de imágenes. Leer
   `node_modules/next/dist/docs/` antes de escribir.
2. **Fechas "de hoy" se calculan en el navegador**, en hora de
   `America/Cancun`. En el HTML estático quedarían congeladas el día de la
   compilación (citas, cuentas regresivas, "disponible desde").
3. **JSX se come el espacio después de un dato:** `cada {x} minutos` salió
   "cada 30minutos". Armar esas frases con plantilla de texto.
4. **Vista previa local con `firebase serve`**, no con `python -m http.server`
   (da errores #418 de React que no existen en producción). Para verla en el
   celular: `--host 0.0.0.0`.
5. **La compilación a veces falla al bajar las fuentes de Google:** reintentar
   una vez antes de buscar otro problema.
6. **Caché de imágenes de 30 días:** para reemplazar una foto, cambia el nombre
   del archivo (el paso de fotos ya lo hace).
7. **iPhone:** para medir cómo se ve en Safari, Playwright con WebKit (el Chrome
   sin ventana no se comporta igual).
8. **Verificar en producción** después de publicar: cada URL nueva responde 200,
   el sitemap está bien y el texto dice lo que debe. Que compile no basta.
9. **Política de WhatsApp:** el sitio no pide datos por chat (INE, cuentas,
   tarjetas). Si algún día hay formulario que guarde datos, primero el aviso de
   privacidad.
10. **Mensajes de WhatsApp con `encodeURIComponent`** y el número en un solo
    lugar. En el sitio viejo el número estuvo copiado en ~25 archivos, y cuando
    se bloqueó hubo que cambiarlo en todos.

---

## 10. Etapas

| Etapa | Qué queda listo | Quién |
|---|---|---|
| **0. Cuentas** | Dominios comprados (`.mx` principal y `.com` de defensa; los dos estaban libres el 14 nov 2026), repo en GitHub, proyecto en Firebase, hoja de Google y carpeta de Drive con la plantilla de §5, cuenta de servicio | Florencio, guiado |
| **1. Esqueleto** | Proyecto Next 16 limpio, `CLAUDE.md`, tokens neutros, `SiteHeader`, `SiteFooter`, WhatsApp flotante, inicio, publicado en la URL `.web.app` **con `noindex`** | Claude Code |
| **2. Datos y silos** | `traer-hoja`, `validar-datos`, `traer-fotos`, `lib/datos.ts`; el silo completo de §6.2 funcionando con 1-2 desarrollos reales | Claude Code |
| **3. Automático** | GitHub Actions publicando solo cada 6 horas y con botón; correo si falla | Claude Code + Florencio (secrets) |
| **4. Rentas y locales** | Listados con filtros, fichas, vendido/rentado, ocultar lo viejo | Claude Code |
| **5. SEO a escala** | Hubs de §6.3 con sus compuertas (§6.4), títulos de §6.6, JSON-LD de §6.7, enlazado de §6.8, sitemap por familias, `auditar-seo.mjs`, promociones, agendar cita, calculadora, preguntas, blog, aviso de privacidad | Claude Code |
| **6. Diseño** | Paleta, letras y logo según la investigación | Juntos |
| **7. Lanzamiento** | Medición (§7), dominio conectado, quitar `noindex`, Search Console con sitemap, reporte mensual | Claude Code + Florencio |

**El `noindex` se queda hasta la etapa 7.** Un sitio a medias indexado deja
mala primera impresión en Google.

**Costos esperados:** GitHub Actions entra en lo gratuito (unas 4 corridas al
día de pocos minutos). Firebase Hosting es gratis hasta cierto tráfico diario;
con muchas fotos y visitas, pasa al plan de pago por uso (centavos a pocos
dólares al mes). La cuenta de servicio de Google no cuesta.

---

## 11. Reglas permanentes del proyecto (van al `CLAUDE.md` nuevo)

1. **No publicar ni hacer commit sin que Florencio lo pida.** Editar y compilar
   sí; publicar no.
2. **Verificar en producción** lo que se publique.
3. **Los datos solo vienen de la hoja.** Ningún precio, estado ni teléfono se
   escribe en un componente.
4. **Todo número visible se calcula** ("desde", conteos). Al tocar una cifra,
   revisar que su etiqueta siga siendo cierta.
5. **Ninguna página sobre los desarrollos de Altta** sin orden de Florencio
   (§6.14).
6. **Una página por pregunta, con compuerta** (§6.4): ninguna familia de
   páginas se genera sin el mínimo de datos. El desarrollo va explícito en
   título, H1, URL y JSON-LD.
7. **Un título que funciona no se cambia en bloque.** Se prueba en una
   familia y se mide en Search Console 3-4 semanas (§6.6).
8. **Nada de cuentas a nombre del socio.** El socio edita la hoja; lo demás es
   de Florencio.
9. **Explicar en español llano, una cosa a la vez**, sin cerrar mensajes con
   listas de pendientes.
10. **Antes de escribir código de Next, leer la guía en
   `node_modules/next/dist/docs/`.**

---

## 12. Decisiones abiertas de Florencio

- **¿Desarrollos de Altta en el sitio nuevo?** Por omisión, no (§6.14).
- **Paleta, letras y logo:** sesión de investigación aparte (§8).
- **Nombre y leyenda del socio** que aparecen en el pie, y su WhatsApp.
- **¿Rentas con precio visible?** Recomendado sí: es lo primero que filtra la
  gente.
- **Cada cuánto se actualiza:** 6 horas por omisión.
- **¿Meta (Facebook/Instagram)?** Fuera por omisión, como en el sitio viejo.

---

## 13. Prompt para Claude Code

Pegar en Claude Code, abierto en la carpeta nueva `casasydepascancun`, con este
archivo ya copiado ahí como `PLAN.md`:

```
Vamos a construir casasydepascancun: un sitio de bienes raíces en Cancún con desarrollos en venta, casas y departamentos en renta, y locales comerciales. El sitio es mío (Florencio) y se lo rento a un socio master broker; los contactos llegan a su WhatsApp. El inventario vive en una hoja de Google y una carpeta de Drive, y el sitio se actualiza solo.

1. Lee PLAN.md completo antes de hacer nada. Es el plan y manda sobre lo que supongas.

2. El código base es mi otro sitio, alttahomescancun.mx. Clónalo SOLO PARA LEER en una carpeta hermana: gh repo clone FhCLta/Web-Jardines-del-Sur ../referencia-altta. No lo modifiques, no hagas commit ni publiques nada ahí. Porta los módulos de la tabla "Se porta" de PLAN.md §2, adaptándolos, y respeta la lista "NO se porta" (nada de IDs de medición, cotizador, textos, fotos, teléfono ni perfil de Google de Altta).

3. Este proyecto es nuevo y limpio: no copies el repo entero ni su historia. Usa Next 16.2.4, React 19.2.4 y TypeScript, con output: "export" y Firebase Hosting. Antes de escribir código de Next, lee la guía correspondiente en node_modules/next/dist/docs/: esta versión tiene cambios de ruptura.

4. Trabaja por las etapas de PLAN.md §10, una a la vez. Empieza por la etapa 1. Al terminar cada etapa, dime en español llano qué quedó, cómo lo probaste y qué sigue, y espera mi visto bueno antes de pasar a la siguiente.

5. En la etapa 1 crea CLAUDE.md con las reglas de PLAN.md §11 y una tabla de "qué leer y cuándo" que apunte a PLAN.md.

5b. El SEO es el corazón del negocio: PLAN.md §6 es el sistema que llevó a alttahomescancun.mx al primer lugar, llevado a cientos de páginas. La unidad que se repite es el silo de cada desarrollo (§6.2); los hubs (§6.3) solo se generan cuando pasan su compuerta (§6.4); títulos y H1 con las fórmulas de §6.6; JSON-LD de §6.7; ninguna página huérfana (§6.8). Para ver cómo lo resuelve el sitio viejo, lee en ../referencia-altta: app/(desarrollos)/_lib/dev-meta.ts, SiloPage.tsx, ModelPage.tsx, app/sitemap.ts, docs/jds7-lanzamiento.md §4 y docs/seo-local-ubicaciones.md.

6. Reglas que no se rompen:
   - No publiques ni hagas commit sin que te lo pida.
   - El sitio va con noindex hasta la etapa 7.
   - Ningún dato de inmueble, precio ni teléfono escrito a mano en un componente: todo sale de la hoja a través de lib/datos.ts.
   - Todo número visible ("desde", conteos) se calcula de los datos.
   - Nada sobre Jardines del Sur 6, Jardines del Sur 7, La Rioja 2 ni Lirios Residencial 2 sin que yo lo decida.
   - Las llaves de Google y Firebase van en los secrets de GitHub, nunca en el repo.

7. Para revisar lo visual usa scripts/diseno/verificar-pantallas.mjs (portado del sitio viejo) en 360, 390 y 1280 px, y mira las capturas antes de enseñármelo. Los colores y las letras se deciden después (PLAN.md §8): mientras, usa tokens neutros en :root.

8. Las decisiones de PLAN.md §12 son mías. Si una te bloquea, pregúntame solo esa, con tu recomendación.

Empieza leyendo PLAN.md y dime en pocas líneas cómo vas a hacer la etapa 1 antes de escribir código.
```
