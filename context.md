# Contexto del Proyecto: Stitch - Ecosistema Inmobiliario Cancún 2026

> **Nota PropertyCard legends 15 mayo 2026 (sesión 8):** Reglas nuevas para las notas legales debajo de cada tarjeta. **"* Precio no incluye gastos de escrituración"** ahora aparece en **todas las tarjetas** (Jardines + La Rioja + Lirios, casas y departamentos). **"** Lote tipo. Esquina o excedente varía el costo."** solo aparece cuando `property.metros_terreno` (es decir, todas las **casas** de Jardines + La Rioja; NO en departamentos). La leyenda **"Actualizado a FEBRERO DEL 2026" fue eliminada** por completo. Asteriscos renumerados de `*` + `****` a `*` + `**` para consistencia visual. Variable `isJardinesCard` removida del componente (ya no se usa).

> **Nota grid silos cap 15 mayo 2026 (sesión 8):** `.modelsGrid` en `silo.module.css` ahora limita el ancho de cada tarjeta para que silos con una sola tarjeta (Lirios Residencial 2) no se estire a todo el contenedor. Reglas: `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))` + `justify-content: center` en el grid + `.modelsGrid > *` con `max-width: 420px` y `justify-self: center`. Resultado: 1 tarjeta queda centrada a 420px, múltiples tarjetas mantienen su comportamiento original.

> **Nota Lirios hero 15 mayo 2026 (sesión 8):** Imagen propia de Lirios cargada en `/public/optimized/hero/hero-lirios.webp` (99 KB, copiada desde `Lirios 2/Hero Lirios.webp`). Antes el silo de Lirios usaba `gradientOnly: true` (sin imagen). Ahora usa una sola imagen estática con Ken Burns lento (28s) — mismo efecto que Jardines y La Rioja. `dev.hero.slides`, `mobileImage` y `preloadImage` apuntan al mismo archivo.

> **Nota AmenitiesSection 15 mayo 2026 (sesión 8):** Tile de "Alberca y Casa Club · La Rioja 2" en `AmenitiesSection.jsx` quedó SIN label ni descripción (campos vacíos). La imagen sigue visible pero sin texto encima — el usuario indicó que la foto no es del desarrollo correcto y prefiere no etiquetarla. Los otros 5 tiles conservan sus labels intactos.

> **Nota navbar breadcrumb silo 15 mayo 2026 (sesión 8):** En desktop de los silos, el breadcrumb (`Inicio › Desarrollos › <Nombre>`) se renderiza en el **navbar** (columna central del grid), no en el hero. Estilos nuevos en `SiteHeader.module.css`: `.headerBreadcrumb`, `.headerBreadcrumbSep`, `.headerBreadcrumbCurrent` con 2 estados (scrolled = colores oscuros; not-scrolled = blanco translúcido + dorado sobre hero). `usePathname` detecta el slug y mapea a `currentDev.name` desde `SILO_LINKS`. En mobile el navbar NO muestra breadcrumb (queda como está, solo logo + burger), y el breadcrumb se muestra en el hero del silo. Regla CSS en `silo.module.css`: `@media (min-width: 768px) { .breadcrumb { display: none } }` oculta el breadcrumb del hero en desktop. WhatsApp button sigue pegado a la derecha por `justify-self: end` en columna 3 del grid.

> **Nota silos sesión 8 — simplificación 15 mayo 2026:** Cambios estratégicos en los 3 silos para enfocar conversión y mejorar performance:
> - **AmenitiesSection eliminada de los silos** (ahora solo aparece en el home) → silos más cortos y rápidos, ~340 KB de assets no se cargan en silos.
> - **Trust strip "430,000+ / 12 / 15%" eliminado del hero del silo** (solo se queda en el home) → hero del silo más enfocado al desarrollo específico, menos distracción de stats genéricos de marca.
> - **Hero del silo: 1 sola imagen estática con zoom Ken Burns lento (28s)** en vez de 4 slides rotando. `HeroBackground` ahora acepta props `slides`, `mobileImage`, `gradientOnly` y `animationDuration` (default no animation override). `SiloHero` pasa `animationDuration="28s"`. Si `slides.length <= 1`, no se inicia el `setInterval` de rotación.
> - **Hero Lirios 2: 1 imagen propia** (`hero-lirios.webp`) con el mismo zoom lento. Anteriormente era `gradientOnly` (solo gradient oscuro), reemplazado por la imagen real.

> **Nota perfil Florencio 15 mayo 2026 (sesión 8, CRÍTICO):** El sitio **NO es el sitio oficial de Altta Homes/Sadasi** — es el sitio personal de Florencio Hurtado, asesor inmobiliario que vende propiedades de Altta Homes. Implicaciones de negocio:
> - La dirección **"Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R."** es la **oficina de ventas de Florencio** (su perfil de Google Business), NO la dirección de Jardines del Sur 6.
> - **No mostrar direcciones específicas para La Rioja 2 y Lirios Residencial 2** en los silos — solo "Cancún, Q.R." (sin calle/manzana). Mostrar una dirección inventada perdería credibilidad o haría creer al lead que el desarrollo está en la oficina.
> - El footer de todos los silos hardcodea la oficina (constantes `OFFICE_ADDRESS` y `OFFICE_MAP_URL` en `SiloPage.tsx`) — es la sucursal de Florencio, válido como contacto universal.
> - El bloque "Lo esencial" en silos: Jardines usa `location: { label: "Ubicación", value: "Av. 127..." }` (porque la oficina está EN el Polígono Sur donde está Jardines, da credibilidad). La Rioja y Lirios usan `location: { label: "Zona", value: "Cancún, Q.R." }`.
> - JSON-LD `OfferCatalog` por silo: cada `Offer` solo lleva `addressLocality: "Cancún"`, sin `streetAddress` específico.
> - El `RealEstateAgent` global (en home) sí lleva la dirección de oficina completa porque ES el contacto del negocio (Florencio).

> **Nota navbar context-aware 15 mayo 2026:** `SiteHeader` usa `usePathname()` (next/navigation) para detectar silos (`pathname.startsWith("/desarrollos-cancun/")`). En home: nav completa "Inicio · Modelos y Precios · Contacto" con hrefs absolutos `/#top`, `/#desarrollos`, `/#contacto` (así también funcionan al hacer click desde silos). En silos: desktop logo + **breadcrumb centrado** (ver Nota navbar breadcrumb silo) + WhatsApp; drawer mobile contextual con "← Volver al inicio" (en dorado, clase `drawerBack`), separador "Otros desarrollos" (clase `drawerLabel` con líneas decorativas dorada), los 2 silos restantes (el actual queda filtrado por slug), Contacto, CTA WhatsApp. Logo siempre `href="/#top"`. Lista `SILO_LINKS` hardcoded dentro del componente (slug+name).

> **Nota hero silos 15 mayo 2026:** Cada silo usa `<SiloHero dev={dev} waHref={waHref} />` (en `components/SiloHero.jsx`) que reutiliza `Hero.module.css` + `HeroBackground` parametrizado con `slides` y `mobileImage`. Mismo Playfair, mismo eyebrow con punto pulsante dorado, mismo trust strip 430k/12/15%, mismo overlay+vignette, misma animación Ken Burns. Cada silo elige sus 4 slides reordenando las imágenes de `/optimized/hero/` para que la más relevante quede primera (LCP): Jardines→alberca, La Rioja 2→vista-aerea, Lirios 2→terraza. Cada silo agrega su propio `<link rel="preload">` mobile/desktop en SiloPage. H1 en sentence case (`"Casas y departamentos"`) para que no haga wrap raro en mobile. Subtítulo simplificado al patrón `"N modelos desde $X MXN"` sin mencionar recámaras. Breadcrumb visual encima del eyebrow (clases en `silo.module.css`: `.breadcrumb`, `.breadcrumbSep`, `.breadcrumbCurrent`).

> **Nota rutas silo SEO 15 mayo 2026:** Implementadas rutas reales por desarrollo bajo `output: "export"`: `/desarrollos-cancun/jardines-del-sur-6`, `.../la-rioja-2`, `.../lirios-residencial-2`. Cada `app/desarrollos-cancun/<slug>/page.tsx` es server component thin wrapper que importa `SiloPage` (en `_lib/`) y exporta `metadata` vía `buildSiloMetadata(slug)`. `SiloPage` lee `data/inventory.json`, filtra por `development === dev.name`, monta JSON-LD `WebPage` + `BreadcrumbList` + `OfferCatalog` filtrado, y renderiza: SiteHeader → SiloHero → grid PropertyCard → sección "Sobre [desarrollo]" con 3 párrafos SEO + tarjeta lateral "Lo esencial" → AmenitiesSection → footer (reutiliza clases de `page.module.css`) → FloatingWhatsApp. Metadata por silo: `title: { absolute: ... }` (evita duplicar sufijo del template), `description`, `alternates.canonical: /desarrollos-cancun/<slug>`, OG completos. `sitemap.ts` lista las 4 URLs (home + 3 silos, priority 0.9). JSON-LD `ItemList` del home apunta cada item a su URL silo (no más `#desarrollos`). Internal linking del home → silos: botón "Ver página completa de [desarrollo] →" debajo del grid en `DevelopmentTabs` (clase `siloLinkWrap` + `siloLink` en `DevelopmentTabs.module.css`), más 3 entradas nuevas en `<ul>` del footer Nav.

> **Nota hash routing tabs 15 mayo 2026:** `DevelopmentTabs` sincroniza la tab activa con `window.location.hash` en formato `#desarrollos/<slug>` (`jardines-del-sur-6`, `la-rioja-2`, `lirios-residencial-2`). Patrón anti-warning: `useEffect` lee el hash al mount + listener `hashchange`; un `activeTabRef` se sincroniza vía `useEffect([activeTab])` y se lee desde el handler para evitar el warning "Cannot update a component (Router) while rendering a different component" (causado por usar functional setState con `history.replaceState` adentro — Next.js intercepta replaceState y dispatcha al Router). Click en tab → `handleTabSelect` hace `setActiveTab` + `history.replaceState`. Click en cualquier `<a href="#desarrollos">` del sitio → hashchange detecta slug vacío y reescribe la URL para añadir el slug del tab activo (sin tocar historial). Default sin hash: queda Jardines del Sur 6 sin reescribir URL.

> **Nota deploy 14 mayo 2026 (2):** mensajes de WhatsApp unificados en todos los botones genéricos (FAB, Header, Hero "Hablar con un asesor", Footer, FooterPhoneContact) al texto: `"Hola, quiero más información sobre las casas y departamentos de Altta Homes en Cancún."` Los botones dinámicos de PropertyCard y VirtualTourModal conservan su mensaje específico por modelo/desarrollo. Decisión de diseño: no mencionar desarrollos específicos en botones genéricos porque son leads en la parte alta del funnel; el agente califica en la conversación.

> **Nota deploy 14 mayo 2026:** deploy realizado desde sesión local. Cambios incluidos: fix de z-index del FAB de WhatsApp cuando el lightbox está abierto (`body.lightbox-open` class en PropertyCard + regla `z-index: 10020` en FloatingWhatsApp.module.css); puerto del dev server fijado a `3301` con hostname `127.0.0.1` en `package.json`.

> **Nota produccion 11 mayo 2026:** sitio desplegado en Firebase Hosting (`jardinesdelsur-cancun`) y activo en `https://jardinesdelsurcancun.mx`. JSON-LD reforzado con `RealEstateAgent`, `hasMap`, `geo`, `sameAs` al perfil de Google Business/Maps, `OfferCatalog` basado en inventario real, y sin `aggregateRating` inventado. Google verification meta agregada en `app/layout.tsx`. `sitemap.xml` y `robots.txt` responden 200; Search Console puede tardar en leerlos aunque el XML este correcto.

> **Nota favicon/hero 11 mayo 2026:** favicon AH aprobado e instalado por convencion de Next en `app/favicon.ico`, `app/icon.svg` y `app/apple-icon.png`; preview en `public/favicon-preview-ah.svg`. Hero ajustado: H1 "Casas y departamentos / en Cancun", trust line "con el respaldo de Grupo Sadasi" mas grande, subtitulo en dos lineas con desarrollos en bold: "Jardines del Sur 6, La Rioja 2 y Lirios Residencial 2." + "Modelos, precios e informes en minutos.".

> **Nota imagenes 11 mayo 2026:** `public/jardines/Modelo Flamboyan/5.webp` fue reemplazada porque el archivo publicado era 70x70 y se veia pixelado en el lightbox. Se restauro desde `jardines del sur 6/Modelo Flamboyan/5.webp` con tamano 984x656. Afecta solo esa imagen puntual, no el LCP del hero.

> **Nota visitas virtuales 11 mayo 2026:** recorridos de La Rioja 2 actualizados a Lapentor: `noni-elite`, `fresno-elite`, `alamo` y `noni`. La Noni de La Rioja usa su recorrido Lapentor propio y ya no depende del embed Matterport. `VirtualTourModal.jsx` conserva compatibilidad con URLs `matterport.com` y agrega `play=1`, `qs=1`, `wh=0`, `nt=0` solo si vuelve a aparecer Matterport. `VirtualTourModal.module.css` usa `100dvh` en mobile, `min-height: 0` en `.content`, `flex: 0 0 auto` en header/footer y `overflow: hidden` en modal para evitar que Chrome mobile estire el iframe y tape el CTA de cotizacion.

> **Nota PageSpeed 11 mayo 2026:** desktop llego a 99/100 y mobile llego a 98 en una corrida estable. No perseguir 100 si implica tocar estetica o conversion. El intento de convertir el tooltip flotante de WhatsApp a CSS puro y quitar preloads manuales bajo la metrica mobile; esos cambios fueron revertidos. Mantener la version con `FloatingWhatsApp.jsx` usando `useEffect/useState` y `app/layout.tsx` con preloads manuales responsive del hero.

> **Nota performance 11 mayo 2026:** optimizacion mobile aplicada tras informe PageSpeed. Hero convertido de `background-image` a `<picture><img>` real con `fetchPriority="high"`, preload responsive solo para hero mobile/desktop, assets derivados en `/public/optimized/`, amenidades reemplazadas por WebP mas ligeros, cards con imagen lazy y sin preload accidental de Capua. Verificado en produccion: solo 2 image preloads y `CapuaPreload = false`.

> **Nota UI 11 mayo 2026:** los badges visuales de estado (`Preventa 2026` / `Preventa`) fueron removidos de `PropertyCard`. El campo `status` permanece en `data/inventory.json` para logica interna, pero ya no se muestra en tarjetas.

> **Nota Codex 11 mayo 2026:** proyecto revisado con guias locales de Next.js 16.2.4 en `node_modules/next/dist/docs/`; `npm.cmd run lint` OK; `npm.cmd run build` OK con red permitida para Google Fonts; dev server activo en `http://127.0.0.1:3000`. Ajustes menores: se limpiaron warnings de lint en `DevelopmentTabs.jsx`, se simplifico el portal/lightbox en `PropertyCard.jsx`, y Lirios usa `/amenidades/alberca2.webp` como placeholder existente para evitar 404/500 de imagen.

> **Nota inventario 11 mayo 2026:** `jds6-capua` se mantiene disponible en **Jardines del Sur 6** con precio desde **$1,853,830 MXN**. `Lirios Residencial 2` queda con un solo modelo: **Departamento Cedro Plus**, mismo layout/fotos/recorrido que Jardines del Sur 6, precio desde **$2,248,750 MXN** y 2 cajones de estacionamiento. Capua no debe aparecer en Lirios.

> **Nota SEO 11 mayo 2026:** primer bloque SEO publicado en Firebase Hosting y verificado en `https://jardinesdelsurcancun.mx`: canonical al dominio `.mx`, metadata/Open Graph/Twitter, H1 orientado a "Casas y departamentos en Cancún", JSON-LD `RealEstateAgent` + `WebSite` + `ItemList`, `robots.txt` y `sitemap.xml`. Siguiente fase sugerida: rutas silo `/desarrollos-cancun/...` por desarrollo.

> **Última actualización:** 15 de mayo de 2026 (sesión 8)  
> **Estado:** Fases A–D completas + Fase SEO Silo completa + navbar context-aware + hash routing en tabs + silos simplificados (sin AmenitiesSection ni trust strip, hero single-image con zoom lento, navbar breadcrumb desktop, location por silo). Legends de PropertyCard refactorizadas. Fase E (reveal-on-scroll) pendiente.

---

## 1. Visión General
**Objetivo:** Landing page de alta conversión para Google Ads + WhatsApp leads de **Grupo Sadasi / Altta Homes** en Cancún: 3 desarrollos (Jardines del Sur 6, La Rioja 2, Lirios Residencial 2).  
**Estética 2026:** Luxury dark/gold, glassmorphism, Playfair Display + Montserrat, hero cinematográfico, Ken Burns slideshow.

---

## 2. Stack Tecnológico
- **Framework:** Next.js App Router + React 19 (ver AGENTS.md — puede tener breaking changes)
- **Estilos:** Vanilla CSS Modules exclusivamente. **Sin Tailwind.**
- **Datos:** `data/inventory.json` bajo clave `inventory_stitch_2026`
- **Fonts:** Montserrat (`--font-montserrat`), Lato (`--font-lato`), Playfair Display (`--font-display`)
- **WhatsApp:** `+529982059044` unificado en todos lados (incluyendo VirtualTourModal — ya corregido)

---

## 3. Tokens de Marca (`app/globals.css`)
| Token | Valor |
|---|---|
| `--primary` | `#1A365D` |
| `--accent` | `#D19200` ← dorado oficial extraído de alttahomescancun.com |
| `--accent-2` | `#E8B43A` |
| `--accent-deep` | `#A37200` |
| `--gradient-gold` | `linear-gradient(135deg, #D19200, #E8B43A)` |
| `--gradient-primary` | deep blue |

**Regla:** `#D19200` siempre SÓLIDO en elementos funcionales (logo, precio, btn-primary, section span). Gradiente solo en hero `em` y decorativos.

---

## 4. Arquitectura de Componentes

### Componentes activos
| Archivo | Descripción |
|---|---|
| `app/page.tsx` | Server component. Importa: `SiteHeader`, `Hero`, `DevelopmentTabs`, `AmenitiesSection`, footer inline, `FloatingWhatsApp`. Subtítulo sección modelos: "Explora los modelos disponibles en Jardines del Sur 6, La Rioja 2 y Lirios 2." Ancla `<div id="desarrollos">` añadida justo antes de DevelopmentTabs con `scrollMarginTop: 72px` |
| `app/layout.tsx` | Fonts (Montserrat, Lato, Playfair Display), className incluye `${playfair.variable}`. Metadata SEO completa, Google site verification y preloads responsive solo para hero mobile/desktop optimizado |
| `app/globals.css` | Tokens, `.btn` shimmer hover, `.btn-primary` sólido dorado, `.glass` blur(14px) |
| `app/page.module.css` | Footer premium oscuro, sectionHeader, inventory section |
| `components/SiteHeader.jsx/.module.css` | **Context-aware** via `usePathname()`. Header glass scroll + hamburger drawer mobile. Home: nav `Inicio · Modelos y Precios · Contacto` + botón WA. Silo desktop: logo + **breadcrumb centrado** (`Inicio › Desarrollos › <Nombre>`) + WA. Silo mobile: solo logo + burger (sin breadcrumb en navbar — el breadcrumb del hero asume); drawer con "← Volver al inicio" + "Otros desarrollos" + cross-silos (filtrando el actual) + Contacto + WA. Lista `SILO_LINKS` hardcoded. Links del header usan hrefs absolutos `/#top`, `/#desarrollos`, `/#contacto`. z-index: 120. Drawer z-index: 115. CSS extra: `.headerBreadcrumb`/`.headerBreadcrumbSep`/`.headerBreadcrumbCurrent` (con 2 estados scrolled/not-scrolled), `.drawerLabel` (separador con líneas decorativas), `.drawerBack` (item dorado de regreso al inicio) |
| `components/Hero.jsx/.module.css` | 4 slides Ken Burns, eyebrow pulsante, título Playfair, trust strip, scrollHint. H1 actual: "Casas y departamentos / en Cancún" + "con el respaldo de Grupo Sadasi". Subtítulo actual en 2 líneas: desarrollos en bold y abajo "Modelos, precios e informes en minutos.". Primera imagen del hero usa `<picture><img>` real con `fetchPriority="high"` y fuente mobile `/optimized/hero/alberca-mobile.webp`; slides siguientes cargan en idle. CTA primario: **"Ver Modelos y Precios"** → `#desarrollos`. CTA secundario: **"Hablar con un asesor"** → WA |
| `components/HeroBackground.jsx` | Client component que renderiza los slides Ken Burns. **Parametrizado** con props `slides` (default = 4 imágenes hero del home), `mobileImage` (default = `alberca-mobile.webp`), `gradientOnly` (renderiza fondo `.bgGradientFallback` sin imagen) y `animationDuration` (override inline del Ken Burns CSS animation, ej. `"28s"` para silos). Si `slides.length <= 1` no inicia el `setInterval` de rotación. Reutilizado por Hero del home (sin props) y por SiloHero (con slides/mobileImage del desarrollo + animationDuration="28s") |
| `components/SiloHero.jsx` | Hero específico de silos que reutiliza `Hero.module.css` + `HeroBackground` parametrizado. Recibe `dev` (de `dev-content.ts`) y `waHref` por props. Pasa `animationDuration="28s"` (Ken Burns lento) y `gradientOnly={hero.gradientOnly}`. Estructura: eyebrow + H1 con `em` dorado + subtítulo bold+detail + CTAs ("Ver Modelos y Precios" / "Hablar con un asesor") + scrollHint. **NO incluye trust strip** (430k/12/15%) — eliminado intencionalmente, esos stats solo aparecen en el home. Encima del eyebrow renderiza el breadcrumb visual del hero (`Inicio › Desarrollos › <Nombre>`) que está oculto en desktop (display: none `@media (min-width: 768px)`) y se ve solo en mobile. En desktop el breadcrumb vive en el navbar (ver `SiteHeader.module.css .headerBreadcrumb`) |
| `components/DevelopmentTabs.jsx/.module.css` | Selector segmentado 3 cols. `id="desarrollos"` removido (ahora está en page.tsx). **Hash routing**: tab activa sincronizada con `#desarrollos/<slug>` vía `usePathname`-style con `useEffect`+`hashchange`+`activeTabRef`. Botón **"Ver página completa de [desarrollo] →"** debajo del grid (clases `siloLinkWrap` + `siloLink`) que linkea al silo del tab activo |
| `components/PropertyCard.jsx/.module.css` | Encabezado distribución: `"Distribución:"`. Etiqueta "Nivel N:" solo aparece si hay más de 1 nivel (`levels.length > 1`). CTA: **"Cotizar ahora"** (antes "Cotizar"). Legal legend (refactor sesión 8): `*` "Precio no incluye gastos de escrituración" en **todas** las tarjetas (Jardines + La Rioja + Lirios). `**` "Lote tipo. Esquina o excedente varía el costo." solo cuando `property.metros_terreno` (todas las casas, ningún departamento). Leyenda "Actualizado a FEBRERO DEL 2026" **eliminada**. Variable `isJardinesCard` ya no existe. El badge visual `statusBadge` ya no se renderiza; imágenes de cards cargan lazy |
| `components/VirtualTourModal.jsx/.module.css` | Mensaje WA sincronizado con PropertyCard: usa `getWhatsAppText()` con la misma lógica inteligente de prefijo (casa modelo / departamento modelo). Tours activos de La Rioja 2 y Jardines/Lirios usan Lapentor; se conserva fallback Matterport si aparece una URL `matterport.com`. CSS mobile protegido con `100dvh`, header/footer fijos en flex y `.content { min-height: 0 }` para que el iframe no tape el CTA |
| `components/AmenitiesSection.jsx/.module.css` | Masonry navy/gold, 6 tiles con imágenes optimizadas de `/optimized/amenidades/`. **Solo aparece en el home** — los silos no la renderizan (eliminada en sesión 8). El tile `wide` de "vista aérea" tiene `label` y `desc` vacíos (la imagen es genérica, sin atribución a desarrollo específico) |
| `components/FloatingWhatsApp.jsx/.module.css` | Dark/gold tooltip, FAB bottom:5rem mobile |

### Familia de archivos para las rutas silo (`app/desarrollos-cancun/`)
| Archivo | Descripción |
|---|---|
| `app/desarrollos-cancun/jardines-del-sur-6/page.tsx` | Thin wrapper: exporta `metadata = buildSiloMetadata("jardines-del-sur-6")` y renderiza `<SiloPage slug="jardines-del-sur-6" />` |
| `app/desarrollos-cancun/la-rioja-2/page.tsx` | Análogo, slug `la-rioja-2` |
| `app/desarrollos-cancun/lirios-residencial-2/page.tsx` | Análogo, slug `lirios-residencial-2` |
| `app/desarrollos-cancun/_lib/dev-content.ts` | Tipo `DevContent` + objeto `DEVS` (3 entradas). Por desarrollo: slug, name, shortName, metaTitle, metaDescription, h1, heroSubtitle, heroImage, ogImage, **location: { label, value }** (Jardines=Ubicación+Av.127, La Rioja/Lirios=Zona+Cancún Q.R.), whatsappMessage, **hero** (slides 1 imagen, mobileImage, preloadImage, opcional gradientOnly, eyebrow {strong, rest}, title {lines, em}, subtitle {bold, detail}), intro (eyebrow, paragraphs), highlights. Sesión 8: `ubicacion: string` reemplazado por `location: { label, value }`; silos con 1 slide en vez de 4; Lirios usa imagen propia `hero-lirios.webp` (antes era `gradientOnly: true`) |
| `app/desarrollos-cancun/_lib/dev-meta.ts` | `buildSiloMetadata(slug)` → genera `Metadata` con `title: { absolute }` para evitar duplicar el sufijo del template del root layout, description, canonical, OG, Twitter, robots |
| `app/desarrollos-cancun/_lib/SiloPage.tsx` | Server component compartido. Lee `inventory.json`, filtra por `dev.name`, monta JSON-LD `WebPage` + `BreadcrumbList` + `OfferCatalog`, agrega `<link rel="preload">` para LCP mobile/desktop por silo (condicional: solo si `dev.hero.preloadImage` existe), y renderiza la página completa (SiteHeader → SiloHero → modelos → about → footer → FloatingWhatsApp). **Sesión 8: AmenitiesSection eliminada** del flujo. Footer hardcodea `OFFICE_ADDRESS` y `OFFICE_MAP_URL` (constantes del archivo) — NO usa `dev.location` porque el footer representa la oficina de Florencio, no el desarrollo. Card "Lo esencial" usa `dev.location.label` + `dev.location.value` |
| `app/desarrollos-cancun/silo.module.css` | Estilos compartidos por los 3 silos. Clases: `.wrapper`, `.breadcrumb`/`.breadcrumbSep`/`.breadcrumbCurrent` (renderizadas dentro del hero, ocultas en desktop con `@media min-width: 768px`), `.modelsSection`, `.sectionHeader`, `.modelsGrid` (con cap `max-width: 420px` + `justify-self: center` en hijos para que silos de 1 tarjeta no se estiren), `.aboutSection`, `.aboutGrid`, `.aboutCopy`, `.highlightsCard`, `.highlightsList`, `.highlightCheck`, `.locationStrip` |

---

## 5. Lógica Clave

### Selector de desarrollo (DevelopmentTabs)
- Grid 3 columnas iguales con `repeat(3, 1fr)`, dentro de contenedor con `background: rgba(15,23,42,0.04)` y `border-radius: 1.1rem`
- Cada `.devCard`: foto circular 38px + nombre, centrado verticalmente
- Activa: `translateY(-2px)`, sombra gold `0 0 0 2px rgba(209,146,0,0.55)`, foto con `border-color: var(--accent)` y `scale(1.08)`
- El "diamante" apuntando hacia abajo en `.devCardActive::after` indica qué panel está activo

### Hash routing en DevelopmentTabs
- Slugs: `SLUG_BY_DEV` map `"Jardines del Sur 6" → "jardines-del-sur-6"`, etc. `DEV_BY_SLUG` inverso para parseo.
- `parseHashSlug()` matchea `^#desarrollos(?:\/(.+))?$`. Retorna el slug, `""` si solo `#desarrollos`, o `null` si otro hash.
- `useEffect` al mount + listener `hashchange`:
  - Slug válido → `setActiveTab(DEV_BY_SLUG[slug])`
  - Slug vacío (bare `#desarrollos`) → reescribe URL con `#desarrollos/<currentTabSlug>` vía `history.replaceState`, leyendo el tab actual desde `activeTabRef.current` (NO functional setState — evita el warning "Cannot update Router while rendering" porque Next.js intercepta `replaceState` y dispatcha al Router).
- `handleTabSelect(dev)` → `setActiveTab(dev)` + `history.replaceState(null, "", "#desarrollos/<slug>")`. Sin pushState (no contamina historial).
- Botón "Ver página completa de [activeTab] →" debajo del grid linkea al silo correspondiente.

### SiteHeader context-aware
- `usePathname()` (de `next/navigation`). `isSilo = pathname.startsWith("/desarrollos-cancun/")`. `currentSlug = pathname.slice(...).replace(/\/$/, "")`.
- `otherSilos = SILO_LINKS.filter(s => s.slug !== currentSlug)`.
- Home: renderiza `<nav className={styles.navDesktop}>` con 3 links + WhatsApp.
- Silo: NO renderiza `<nav>` desktop (grid `1fr auto 1fr` se mantiene con auto column vacía), drawer renderiza items contextuales.
- Drawer items en silo: "Volver al inicio" (clase `drawerBack`, dorado) + label "Otros desarrollos" (clase `drawerLabel`, con líneas decorativas via `::before`/`::after`) + map sobre `otherSilos` con números `01`/`02` + "Contacto" + CTA WA.
- Logo siempre `<a href="/#top">` (desde home: scroll; desde silo: navega).

### Silos SEO (`/desarrollos-cancun/<slug>`)
- Compatible con `output: "export"` (HTML estático generado al build).
- 3 carpetas estáticas (no dynamic `[slug]` para evitar `generateStaticParams` y mantener simplicidad).
- Cada `page.tsx` es server component thin: importa `SiloPage` + `buildSiloMetadata`, no usa hooks.
- `SiloPage`:
  - Lee `data/inventory.json` con `fs.readFileSync` (server-only).
  - `properties = inventory.filter(p => p.development === dev.name)`.
  - Construye JSON-LD `@graph` con 3 entidades: `WebPage` (con `isPartOf` apuntando al `WebSite` del home, `about` apuntando al `RealEstateAgent` del home), `BreadcrumbList` (3 niveles), `OfferCatalog` (un `Offer` por property).
  - Preloads de hero por silo: 2 `<link rel="preload">` con `media` queries para mobile/desktop.
  - Layout: SiteHeader → SiloHero → `<section id="modelos">` con grid PropertyCard → `<section>` aboutSection con 3 párrafos + tarjeta `highlightsCard` → AmenitiesSection (reutilizada) → footer inline (mismas clases de `page.module.css` para que sea visualmente idéntico al home) → FloatingWhatsApp.
- `buildSiloMetadata(slug)`:
  - `title: { absolute: dev.metaTitle }` ← clave: usar `absolute` evita que el template `"%s | Jardines del Sur Cancún"` del root layout añada sufijo a un título que ya termina en "| Altta Homes".
  - canonical apunta a `/desarrollos-cancun/<slug>`.
  - OG + Twitter usando `dev.ogImage`.
- Internal linking:
  - Botón "Ver página completa de [desarrollo] →" en cada tab del home (DevelopmentTabs).
  - 3 links en `<ul>` del footer Nav del home (Jardines del Sur 6, La Rioja 2, Lirios Residencial 2).
  - JSON-LD `ItemList` del home tiene cada item apuntando a su silo URL.
  - `sitemap.ts` lista las 4 URLs (home priority 1, silos 0.9).

### Stats de PropertyCard
- 4 stats → `grid-template-columns: repeat(4, 1fr)` 
- 3 stats (sin terreno) → `:has(.stat:nth-child(3):last-child)` fuerza `repeat(3, 1fr)` en desktop, triángulo 2x1 en mobile
- Los stats se parsean de `amenidades_key` con regex: `/^([\d.]+)\s*Rec/i` y `/^([\d.]+)\s*Ba/i`
- ~~Las amenidades restantes (no Rec ni Ba) se muestran como pills al final~~ **ELIMINADAS** — los pills de amenidades fueron removidos de PropertyCard por verse desordenados

### Header split en PropertyCard
- Si `nombre_modelo` empieza con "Departamento" o "Casa" → header usa `headerSplit` (4 hijos en grid 2×2):
  - Col1 row1: `modelType` (ej. "Departamento") — Montserrat 0.7rem caps tracking
  - Col1 row2: `h3 modelNameTitle` (ej. "Capua") — Playfair 1.4rem
  - Col2 row1: `.priceLabelTop` "DESDE" — Montserrat 0.6rem caps
  - Col2 row2: `.priceBottom` precio — Montserrat 1.35rem 800 dorado
- Solo aplica en `@media (min-width: 769px)`. En mobile el header vuelve a flex column centrado.
- Selector `.header.headerSplit` (especificidad extra) para vencer la regla móvil de `.header`.

### Legal legend en Jardines del Sur 6
- `isJardinesCard = property.development === "Jardines del Sur 6"`
- Al final de `.content` se renderiza `<div className={styles.legalLegend}>` con 3 párrafos de nota legal (escrituración, fecha febrero 2026, lote tipo)
- Estilo: fondo `rgba(209,146,0,0.08→0.03)` gradiente, borde `rgba(209,146,0,0.22)`, Lato 0.72rem

### Modal VirtualTour + chrome pages
- `useEffect` en VirtualTourModal: agrega/remueve `body.modal-open` + lock scroll
- SiteHeader: `:global(body.modal-open) .header { display: none }` — desaparece al abrir modal
- MobileStickyWhatsApp CSS tenía la misma regla pero el componente ya fue eliminado de page.tsx
- Overlay z-index: 9000 (por encima de header 120, FloatingWhatsApp 100)
- La Rioja 2, Jardines y Lirios usan Lapentor actualmente. Matterport queda solo como compatibilidad si aparece una URL antigua.
- `getTourUrl()` solo modifica Matterport: `play=1`, `qs=1`, `wh=0`, `nt=0`. No modificar Lapentor.
- Si en algun momento vuelve Matterport, los warnings de consola `showcase.js`, `three.module.min.js`, `xr-spatial-tracking` y WebGL vienen de Matterport; no son errores del sitio si el tour carga y dice `Playing, session started`.
- En Chrome mobile/emulacion, mantener `height: calc(100dvh - 1rem)` y fallback `100vh`; esto evita que el iframe estire el modal y oculte "Te interesa este modelo?" / "Solicitar Cotizacion".

### Lightbox
- Renderizado con `createPortal(…, document.body)` — escapa de cualquier stacking context
- Lock de scroll del body al abrir, cierre con tecla Escape
- z-index overlay: 9999, z-index X: 10001
- Botón X: `position: absolute` dentro del overlay (que es fixed 100vw/100vh), arriba-derecha `1.25rem`

### AmenitiesSection
- Fondo: `linear-gradient(160deg, #080f1c, #0b1929, #131f35)` + halos dorados radiales
- Grid: `grid-template-columns: repeat(12, 1fr)` con `grid-auto-rows: 11vw`
- Sizes: `tile_large` (6col×3row), `tile_tall` (3col×3row), `tile_wide` (9col×2row), `tile_normal` (3col×2row)
- Descripción de cada tile se revela en hover con `max-height: 0 → 60px` + `opacity: 0 → 1`

### Footer
- `page.module.css`: `grid-template-columns: 2fr 1fr 1.4fr` desktop, `1fr` mobile
- CTA "Informes por WhatsApp" con SVG real de WhatsApp y gradiente dorado, `border-radius: 999px`
- `.footerContactItem` con iconos cuadrados `36x36` fondo dorado translúcido

---

## 6. Datos de Inventario — Distribución actualizada sesión 4

| Desarrollo | Modelo | Niveles | Estado |
|---|---|---|---|
| Jardines del Sur 6 | Departamento Capua | 1 nivel (depto) | Precio desde $1,853,830 |
| Jardines del Sur 6 | Departamento Cedro Plus | 1 nivel (depto) | ✅ actualizado |
| Jardines del Sur 6 | Casa Flamboyán | PB + PA (2 niveles) | ✅ actualizado |
| Jardines del Sur 6 | Casa Ceiba | PB + 1er + 3er nivel | ✅ actualizado |
| Jardines del Sur 6 | Casa Tabachín | PB + PA (2 niveles) | ✅ actualizado |
| Jardines del Sur 6 | Casa Noni | PB + PA (2 niveles) | ✅ actualizado |
| La Rioja 2 | Casa Fresno Elite | — | ✅ recorrido Lapentor actualizado |
| La Rioja 2 | Casa Modelo Alamo | — | ✅ recorrido Lapentor actualizado |
| La Rioja 2 | Casa Noni Elite | — | ✅ recorrido Lapentor actualizado |
| La Rioja 2 | Casa Noni | — | ✅ recorrido Lapentor actualizado |
| Lirios Residencial 2 | Departamento Cedro Plus | 1 nivel (depto) | Precio desde $2,248,750 · 2 cajones de estacionamiento |

**Regla de encabezado distribución:**
- Todas las tarjetas → `"Distribución:"`
- Etiqueta `"Nivel N:"` → solo cuando `levels.length > 1`
- Nota `****` lote tipo → solo cuando `metros_terreno !== null`

---

## 7. Imágenes disponibles en `/public/`
```
/jardines/Imagnes de amenidades y hero/  → alberca.webp, area de juego infantil.webp, cancha.webp, gimnasio.webp, gimnasio1.webp
/jardines/Modelo Capua/                  → 1–6.webp
/jardines/Modelo Cedro Plus/             → 1–6.webp
/jardines/Modelo Ceiba/                  → 1–7.webp
/jardines/Modelo Flamboyan/              → 1–5.webp
/jardines/Modelo Noni/                   → (disponibles)
/jardines/Modelo Tabachin/               → (disponibles)
/larioja2/Imagnes de amenidades y hero/  → alberca.webp, Terraza.webp, Vista aerea.webp
/larioja2/Casa Fresno Elite/             → (disponibles)
/larioja2/Casa Modelo Alamo/             → (disponibles)
/larioja2/Casa noni/                     → (disponibles)
/larioja2/Casa Noni Elite/               → (disponibles)
/amenidades/                             → alberca.webp, alberca2.webp, gimnasio.webp, gimnasio1.webp,
                                           cancha.webp, "area de juego infantil.webp", "Vista aerea1.webp"
                                           (6 imágenes usadas en AmenitiesSection)
/optimized/hero/                         → alberca-desktop.webp, alberca-mobile.webp,
                                           vista-aerea.webp, area-infantil.webp, terraza.webp
/optimized/amenidades/                   → alberca.webp, gimnasio1.webp, area-infantil.webp,
                                           cancha.webp, gimnasio.webp, vista-aerea.webp
```

**Nota imagen Flamboyan:** `public/jardines/Modelo Flamboyan/5.webp` debe conservarse en 984x656. Si se regenera desde assets optimizados, verificar que no vuelva a 70x70 porque se pixeliza en el lightbox.

**Favicon activo:**
```
/app/favicon.ico
/app/icon.svg
/app/apple-icon.png
/public/favicon-preview-ah.svg
```

---

## 8. Fases de Trabajo

| Fase | Estado | Descripción |
|---|---|---|
| CRO baseline | ✅ | Diagnóstico 5.7/10, plan de mejoras |
| WhatsApp unificado | ✅ | `+529982059044` en header, hero, cards, footer, FAB |
| Tokens premium 2026 | ✅ | Gradients, shadows, radii, `#D19200` |
| FloatingWhatsApp premium | ✅ | Golden Scissors style dark/gold tooltip |
| MobileStickyWhatsApp | ❌ eliminado | Era redundante con FloatingWhatsApp. Removido de page.tsx |
| **Fase A** | ✅ | Hero cinematográfico Ken Burns + SiteHeader glass + hamburger drawer |
| **Fase B** | ✅ | Selector segmentado 3 cols (control premium, foto circular, sin scroll) |
| **Fase C** | ✅ | PropertyCard: stats grid iconos, título Playfair, priceBlock, lightbox portal. Badge visual de status removido por solicitud del usuario |
| **Fase D** | ✅ | AmenitiesSection masonry navy/gold + Footer premium oscuro 3 cols |
| Pulido visual PropertyCard | ✅ | Pills eliminadas, split header Casa+Depto desktop, legal legend Jardines, 3-stats inline mobile |
| Fix VirtualTourModal mobile | ✅ | WhatsApp correcto, z-index 9000, X 44×44, body.modal-open oculta header y sticky bar |
| Datos institucionales Sadasi | ✅ | Hero eyebrow 50 AÑOS, trust 430k/12 estados/15% plusvalía; AmenitiesSection trust row actualizado; footer tagline; meta description SEO |
| Optimización de performance | ✅ | Hero LCP con `<picture><img>` y `fetchPriority="high"`, slides lazy en idle, assets `/public/optimized/`, cards con imágenes lazy, sin preload accidental de modelos, next.config.ts Cache-Control + AVIF |
| **Sesión 6 — Fix lightbox z-index** | ✅ | `body.lightbox-open` class en PropertyCard.jsx para disparar regla CSS; FloatingWhatsApp sube a z-index 10020 cuando el lightbox está abierto. Dev server fijado a `--port 3301 --hostname 127.0.0.1` en package.json |
| **Sesión 6 — WA unificado** | ✅ | Mensaje único en FAB, Header, Hero, Footer y FooterPhoneContact: "Hola, quiero más información sobre las casas y departamentos de Altta Homes en Cancún." PropertyCard y VirtualTourModal conservan mensajes dinámicos por modelo |
| AmenitiesSection imágenes | ✅ | Reimplementada con 6 imágenes de `/amenidades/`: alberca (Jardines), gimnasio1, área infantil, cancha, gimnasio exterior, Vista aerea1 (La Rioja 2) |
| **Sesión 4 — Distribución** | ✅ | Todos los niveles de Jardines del Sur 6 actualizados. Encabezado inteligente. Etiqueta "Nivel N:" condicional. Nota lote tipo condicional por terreno |
| **Sesión 4 — CTAs y Nav** | ✅ | Hero: "Hablar con un asesor" + "Ver Modelos y Precios". Cards: "Cotizar ahora". Nav: Inicio · Modelos y Precios · Contacto centrados (grid 3 cols). Ancla `#desarrollos` en page.tsx |
| **Sesión 4 — VirtualTourModal WA** | ✅ | Mensaje WA del modal sincronizado con lógica de PropertyCard (`getWhatsAppText()`) |
| **Sesión 5 — Tours La Rioja** | ✅ | Recorridos de La Rioja 2 actualizados a Lapentor. Modal mobile ajustado con `100dvh` para conservar el footer de cotizacion visible |
| **Sesión 7 — Hash routing tabs** | ✅ | `DevelopmentTabs` sincroniza tab activa con `#desarrollos/<slug>`. Patrón `activeTabRef` para evitar warning Router-en-render |
| **Sesión 7 — Rutas silo SEO** | ✅ | 3 rutas reales `/desarrollos-cancun/<slug>` (server components estáticos). `SiloPage` reutiliza componentes + `inventory.json`. JSON-LD `WebPage` + `BreadcrumbList` + `OfferCatalog` por silo. `sitemap.ts` actualizado. `ItemList` del home apunta a silos. Internal linking: botón "Ver página completa" en tabs + 3 links en footer |
| **Sesión 7 — Hero silos = home** | ✅ | `SiloHero` reutiliza `Hero.module.css` + `HeroBackground` parametrizado (props `slides`, `mobileImage`). Mismas tipografías/colores/animaciones. Preload por silo en `SiloPage`. H1 sentence case. Subtítulo formato `"N modelos desde $X MXN"` |
| **Sesión 7 — Navbar context-aware** | ✅ | `SiteHeader` usa `usePathname()`. Home: nav completa. Silo: desktop solo logo+WA (centro vacío premium), drawer mobile contextual con "Volver al inicio" + cross-silos + Contacto + WA |
| **Sesión 8 — Silos simplificados** | ✅ | AmenitiesSection y trust strip (430k/12/15%) eliminados de silos. Hero del silo: 1 imagen estática con Ken Burns lento (28s). Lirios cargó imagen propia `hero-lirios.webp` |
| **Sesión 8 — Location por silo** | ✅ | `dev.ubicacion: string` reemplazado por `location: { label, value }`. Jardines = "Ubicación: Av. 127..." (Google Business de Florencio). La Rioja y Lirios = "Zona: Cancún, Q.R." (sin dirección específica). Footer hardcodea oficina con constantes `OFFICE_ADDRESS` + `OFFICE_MAP_URL` |
| **Sesión 8 — Navbar breadcrumb silo** | ✅ | En desktop el breadcrumb del silo vive en el navbar (centro del grid), no en el hero. Hero breadcrumb hidden en desktop (`@media min-width: 768px`). Mobile no cambia |
| **Sesión 8 — PropertyCard legends** | ✅ | "*" Precio escrituración en todas las tarjetas. "**" Lote tipo solo en casas (con `metros_terreno`). "Actualizado FEBRERO 2026" eliminado. Asteriscos renumerados `*` + `**`. Variable `isJardinesCard` removida |
| **Sesión 8 — Grid silo single-card fix** | ✅ | `.modelsGrid > *` con `max-width: 420px` + `justify-self: center` para que silos con 1 tarjeta (Lirios) no se estiren al ancho del contenedor |
| **Sesión 8 — AmenitiesSection vista aérea** | ✅ | Tile `wide` quedó sin label ni desc (campos vacíos) porque la imagen no representa al desarrollo etiquetado (los otros 5 tiles conservan sus textos) |
| **Fase E** | ⏳ | Reveal-on-scroll Intersection Observer + micro-animaciones |
| Distribución La Rioja 2 | ⏳ | Pendiente: revisar niveles/distribucion textual de Fresno Elite, Alamo, Noni Elite y Noni |
| Fotos Lirios 2 | ⏳ | Pendiente de recibir imágenes |
| SEO / Analytics | ⏳ | Diferido por solicitud del usuario |

---

## 9. Notas Importantes para Continuar
1. **No tocar CTAs de PropertyCard** — "Visita Virtual" y "Cotizar ahora" están bloqueados por instrucción del usuario
2. **Distribución La Rioja 2** — pendiente para sesión 5 (Fresno Elite, Alamo, Noni Elite, Noni)
3. **Fase E** es el siguiente paso mayor: `IntersectionObserver` en tarjetas, sectionHeader, amenidades tiles — entrada suave desde abajo con `opacity 0→1` + `translateY(24px→0)`
4. El dev server corre en `http://127.0.0.1:3301` — `npm run dev` en `D:/Web de Jardines`. Verificar con `curl http://127.0.0.1:3301`
5. Verificar siempre en mobile (390×844) Y desktop (1366×900) tras cada cambio visual
6. Para ocultar chrome cuando hay modal: `body.modal-open` class + `:global(body.modal-open) .selector { display: none }` en el módulo CSS
7. `MobileStickyWhatsApp` está obsoleto — no reimportar en page.tsx
8. El browser interno de VS Code tiene caché agresivo — usar Chrome/Edge externo con Ctrl+Shift+R para ver cambios en tiempo real
9. **SiteHeader grid:** `grid-template-columns: 1fr auto 1fr`. Logo: `justify-self: start`. ctaBtn (fuera del nav): `justify-self: end`. Nav: `justify-content: center`. No mover ctaBtn dentro del nav.
10. **No volver a mostrar badges de preventa** en PropertyCard salvo que el usuario lo pida; el campo `status` se conserva solo como dato interno.
11. **Performance hero:** mantener la primera imagen como `<picture><img>` real con `fetchPriority="high"` y los slides secundarios cargando en idle. No regresar el LCP principal a `background-image`.
12. **Deploy actual:** publicar con `npm.cmd run build` y `firebase.cmd deploy --only hosting --project jardinesdelsur-cancun`. Verificar produccion con `https://jardinesdelsurcancun.mx`.
13. **PageSpeed:** si mobile varia entre 88 y 98, revisar primero la latencia de la corrida. No tocar polyfills de Next ni CSS critico por recomendaciones menores de Lighthouse. Desktop 99/100 y mobile 95+ son suficientemente buenos para no sacrificar diseño/conversion.
14. **Tours virtuales:** La Rioja 2 esta en Lapentor (`noni-elite`, `fresno-elite`, `alamo`, `noni`). Mantener compatibilidad Matterport en codigo, pero no asumir que La Rioja usa Matterport actualmente.
15. **Hero copy actual:** mantener la primera linea del subtitulo con los 3 desarrollos en bold y la segunda linea como "Modelos, precios e informes en minutos." porque reduce redundancia con el H1 y ayuda a conversion sin afectar SEO.
16. **No tocar Hero.jsx ni HeroBackground.jsx para "personalizar" silos** — `HeroBackground` está parametrizado (props `slides`, `mobileImage`) y los silos pasan sus propios slides reordenando las imágenes del home. No crear un segundo `Hero` para silos: usar `SiloHero` que ya reutiliza `Hero.module.css` y `HeroBackground`.
17. **Anti-pattern hash routing:** NO usar `setState((current) => { history.replaceState(...); return current; })` para leer el estado actual desde un updater. Next.js intercepta `replaceState` y dispatcha al Router, lo cual genera el warning "Cannot update a component (Router) while rendering a different component". Patrón correcto: `useRef` sincronizado con `useEffect([state])` y leer `ref.current` desde el handler.
18. **Title de silo: usar `title: { absolute: ... }`** en `metadata` para evitar que el `template: "%s | Jardines del Sur Cancún"` del root layout añada sufijo a un título que ya termina en "| Altta Homes". Resultado: títulos de silo ≤ 75 caracteres sin sufijos duplicados.
19. **No tocar el cuerpo de DevelopmentTabs si solo es para SEO** — el "Ver página completa de [desarrollo] →" debajo del grid + los 3 links en footer + JSON-LD `ItemList` ya cubren el internal linking. No duplicar links en otras partes (riesgo de keyword stuffing / penalización).
20. **Slug format estable: kebab-case** (`jardines-del-sur-6`, `la-rioja-2`, `lirios-residencial-2`). Si se renombra un desarrollo en el futuro, mantener el slug viejo + 301 redirect en `firebase.json` para no perder autoridad SEO.
21. **CRÍTICO — Rol de Florencio:** el sitio NO es el oficial de Altta Homes/Sadasi, es el sitio personal del asesor inmobiliario Florencio Hurtado. La dirección "Av. 127 SM 342 MZ 27" es **su oficina de ventas** (Google Business), NO la dirección de Jardines del Sur 6. NUNCA inventar/mostrar dirección específica para La Rioja 2 o Lirios Residencial 2 — solo "Cancún, Q.R." (sin calle, sin SM, sin MZ). El footer de silos hardcodea `OFFICE_ADDRESS` (oficina de Florencio) porque es contacto universal del negocio, no del desarrollo.
22. **No regresar AmenitiesSection ni trust strip (430k/12/15%) a los silos.** Decisión de sesión 8: solo viven en el home. Razones: (a) hero del silo más enfocado al desarrollo específico, (b) 340 KB menos en cada silo, (c) mejor PageSpeed mobile.
23. **Hero del silo es 1 sola imagen con Ken Burns lento (28s)** — no rotación de 4 slides como el home. Si se agregan más fotos por desarrollo, NO meter 4 slides al silo: la decisión es enfocar el silo en una imagen LCP única. El home conserva los 4 slides porque es el touchpoint cinematográfico de marca.
24. **Reglas de leyendas legales en PropertyCard (sesión 8):** `*` "Precio no incluye gastos de escrituración" → siempre, en TODAS las tarjetas (Jardines + La Rioja + Lirios, casas y departamentos). `**` "Lote tipo. Esquina o excedente varía el costo." → solo cuando `property.metros_terreno` existe (todas las casas, ningún departamento). NO restaurar la leyenda "Actualizado FEBRERO 2026" salvo que el usuario lo pida explícitamente.
25. **Grid silo con `.modelsGrid > * { max-width: 420px; justify-self: center }`:** evita que silos con 1 sola tarjeta (Lirios hoy) se estiren al ancho del contenedor. Si se agregan más modelos a Lirios, NO eliminar este cap — sigue siendo el comportamiento correcto (cada card ≤ 420px, multi-card se centra).
26. **Imagen hero de Lirios** está en `/public/optimized/hero/hero-lirios.webp` (99 KB). Copiada desde `/Lirios 2/Hero Lirios.webp` (fuera de `/public/`, no servible). Si se recibe versión mobile más liviana en el futuro, actualizar `dev.hero.mobileImage` en `dev-content.ts` (hoy mobile y desktop son el mismo archivo).
