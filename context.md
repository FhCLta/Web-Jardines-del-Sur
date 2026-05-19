# Contexto del Proyecto: Stitch - Ecosistema Inmobiliario Cancún 2026

> **⚠️ PENDIENTE — Verificar indexación post-resubmit sitemap (sesión 12, 18 may 2026):** El sitemap fue **eliminado y re-enviado** en Search Console hoy con la URL completa `https://jardinesdelsurcancun.mx/sitemap.xml`. Google va a re-procesar todas las 15 URLs en 24-72h. **Acción próxima sesión**: verificar en Search Console → Sitemaps que "Páginas descubiertas" pase de 1 → 15. Verificar también en "Indexación de páginas" que las URLs marcadas como "Rastreada: actualmente sin indexar" (al menos 1 detectada: `/desarrollos-cancun/lirios-residencial-2`) ahora aparezcan como indexadas. Si Google sigue sin descubrir las 15 URLs después de 72h, considerar añadir link interno desde el home a cada página de modelo (hoy solo se accede vía los silos), o solicitar indexación manual de las 14 URLs adicionales una por una en Inspección de URLs.

> **⚠️ PENDIENTE — Configurar conversión Google Ads en GTM dashboard (sesión 10-12):** Cuando el usuario lance su primera campaña de Google Ads (presupuesto confirmado **$100 MXN/día**), falta configurar manualmente en el panel de GTM (tagmanager.google.com, container `GTM-53BHDRWC`):
> 1. **Tag 1 — "Vinculador de conversiones"** con trigger "All Pages" (necesario para que las conversiones se atribuyan correctamente vía gclid).
> 2. **Trigger — "Click - Solo links"**: activar en "Algunos clicks", condición `Click URL contains wa.me`, llamarlo "WhatsApp Click".
> 3. **Tag 2 — "Seguimiento de conversiones de Google Ads"**: ID de conversión + Etiqueta de conversión que Google Ads le dé al crear la acción de conversión (tipo "Sitio web" → categoría "Cliente potencial / Lead" → nombre "WhatsApp Click" → método "Usa Google Tag Manager"). Recuento: "Una" (no "Cada una"). Valor: "Sin valor" o $500 simbólico (no impacta puja con estrategias CPA).
> 4. **Publicar** el contenedor en GTM (botón "Publicar" arriba a la derecha).
> 5. **Estructura campaña recomendada** (acordada en sesión 12): 1 campaña Search con 3 grupos de anuncios:
>    - **Grupo 1 — Marca**: keywords frase/exacta `"altta homes cancun"`, `"sadasi cancun"`, `"grupo sadasi cancun"`, `"casas altta homes"`. Click $3-8 MXN, conversión más alta.
>    - **Grupo 2 — Modelos específicos**: `"jardines del sur 6"`, `"la rioja 2 cancun"`, `"lirios residencial cancun"`, `"casa tabachin"`, etc. Click $5-12 MXN. **CADA anuncio del Grupo 2 debe ir a la URL del modelo específico**, no al home (esto sube QS significativamente).
>    - **Grupo 3 — Zonal alto intent**: `"casas en venta poligono sur cancun"`, `"departamentos preventa sur cancun"`. Click $8-15 MXN.
> 6. **Negative keywords críticos** (sin esto se quema el presupuesto): renta, alquiler, traspaso, remate, infonavit puntos, fovissste consulta, credito, cancun centro, zona hotelera, playa del carmen, tulum, empleo, construccion, arquitecto.
> 7. **Configuración técnica**: Búsqueda (no Display ni PMax). CPC manual mejorado primeras 2 semanas → cambiar a "Maximizar conversiones" después de 15+ conversiones. Concordancia solo `"frase"` y `[exacta]` (NUNCA amplia con $100/día). Ubicación: Cancún + 25km radio. Horario: 8-21h. Device: mobile +0%, desktop -20%.
> 8. **Métricas esperadas (primer mes)**: 60-70 conversaciones/mes, CPA inicial $60-90 → estable $40-60. Vs Meta (datos del usuario: $60-80/conversación, 13-14% a visita, 12-20% cierre), Google debería superar Meta en % a visita (22-30%) y % cierre (18-28%) por mayor intención de búsqueda.

> **⚠️ PENDIENTE — Re-medir PageSpeed después de propagación CDN (sesión 11):** ✅ **PARCIALMENTE RESUELTO en sesión 12**: el score mobile subió de **84 a 96** una vez propagado el CDN de Firebase. Las optimizaciones aplicadas (GTM `lazyOnload` + imagen mobile recomprimida) sí funcionaron. **Estado actual**: 96 mobile / 97-100 desktop — top 1% del sector vs competencia (inmuebles24 ~45-55, vivanuncios ~40-50). **No es necesario optimizar más** por ahora; mejorar de 96 a 100 son micro-optimizaciones sin retorno real. Si en el futuro PageSpeed baja por nuevos cambios, las opciones siguen siendo: optimizar `alberca-desktop.webp` (126KB), quitar preload innecesario en model pages, dynamic import del VirtualTourModal en home.

> **Nota sesión 12 (18 may 2026):** Sesión de soporte estratégico SEO/Ads + fix de indexación:
> - **PageSpeed mobile subió 84→96** después de que propagara el CDN de Firebase (cambios de sesión 11 efectivos). Top 1% del sector.
> - **Análisis competitivo y estrategia Google Ads $100/día** definida con detalle: estructura de 3 grupos, keywords, negative keywords, copy templates, expectativas mes 1. Comparación Meta vs Google con datos reales del usuario ($60-80/conversación Meta, 13-14% visita, 12-20% cierre).
> - **Google Business Profile**: usuario confirmó que ya lo tiene "súper pro" — no acción pendiente ahí.
> - **Bug Search Console — sitemap solo descubría 1 página**: el sitemap.xml en producción tenía las 15 URLs correctas (verificado con `curl`), pero Search Console marcaba "Páginas descubiertas: 1, Última lectura: 15 may 2026". Causa: Google leyó el sitemap el mismo día del deploy de sesión 9, posiblemente antes de que existieran las nuevas URLs, y el `lastmod` hardcodeado a `2026-05-15T00:00:00-05:00` no le decía a Google que había cambios. **Fix**: `app/sitemap.ts` línea 16 cambió de `new Date('2026-05-15T00:00:00-05:00')` → `new Date()` para usar fecha del build siempre. Build+deploy. Verificado nuevo lastmod `2026-05-19T01:39:05.892Z` en `curl https://jardinesdelsurcancun.mx/sitemap.xml`. Usuario eliminó y re-envió sitemap en Search Console con URL completa `https://jardinesdelsurcancun.mx/sitemap.xml` (truco: en propiedades de dominio Search Console requiere URL completa, no solo `sitemap.xml`).

> **⚠️ PENDIENTE — Configurar conversión Google Ads en GTM dashboard (sesión 10+11):** Cuando el usuario lance su primera campaña de Google Ads, falta configurar manualmente en el panel de GTM (gtagmanager.google.com, container `GTM-53BHDRWC`):
> 1. **Tag 1 — "Vinculador de conversiones"** con trigger "All Pages" (necesario para que las conversiones se atribuyan correctamente vía gclid).
> 2. **Trigger — "Click - Solo links"**: activar en "Algunos clicks", condición `Click URL contains wa.me`, llamarlo "WhatsApp Click".
> 3. **Tag 2 — "Seguimiento de conversiones de Google Ads"**: ID de conversión + Etiqueta de conversión que Google Ads le dé al crear la acción de conversión (tipo "Sitio web" → categoría "Cliente potencial / Lead" → nombre "WhatsApp Click" → método "Usa Google Tag Manager"). Recuento: "Una" (no "Cada una"). Valor: "Sin valor" o $500 simbólico (no impacta la puja al usar estrategias CPA).
> 4. **Publicar** el contenedor (botón "Publicar" arriba a la derecha en GTM).
> 5. **Estrategia de puja inicial**: "Maximizar conversiones" sin CPA objetivo, presupuesto ~$200-300 MXN/día, hasta tener 30+ conversiones. Después cambiar a "CPA objetivo $50 MXN".
> 6. **Keywords prioridad**: bottom-of-funnel específicas (`departamento jardines del sur cancún`, `casa altta homes precio`, `lirios residencial cancún`, `la rioja 2 cancún cotización`) — bajo costo + alta conversión. Evitar generales tipo "casas en cancún" que pelean contra inmuebles24.

> **Nota optimizaciones PageSpeed 16 mayo 2026 (sesión 11):** Aplicado pero score mobile no subió significativamente (85→84). Cambios:
> - **GTM lazyOnload**: `app/layout.tsx` cambió `strategy="afterInteractive"` → `strategy="lazyOnload"` para que GTM cargue DESPUÉS de que la página esté completamente lista, en vez de bloquear el LCP. Los clicks a `wa.me` siguen siendo trackeables porque GTM usa `dataLayer` con buffer interno (los eventos pushed antes de que GTM esté listo se procesan cuando arranca).
> - **alberca-mobile.webp recomprimida**: 720×480 (51KB) → 600×400 quality 72 (31KB). Mismo aspect ratio 1.5:1 (=750/500 en el `<img>` tag → no CLS). El `<source media="(max-width: 767px)">` del `picture` apunta a la imagen mobile. Backup ya eliminado.
> - **`.browserslistrc`** confirmado correcto (chrome>=97 etc.), pero los 12 KiB de polyfills siguen apareciendo en el chunk Next porque vienen del framework, no del bundle de la app. No removibles sin ejectar.

> **Nota tour 360° preview mobile 16 mayo 2026 (sesión 11):** Creado componente `_lib/ModelTour.tsx` (client) que reemplaza el iframe directo en las páginas de modelo. En **desktop** (>=768px) sigue mostrando el iframe Lapentor embebido en `.tourFrame` (16:9). En **mobile** (<768px) el iframe se oculta (`display:none`) y se muestra un **preview en `.tourMobilePreview`** con la primera imagen del modelo a aspect-ratio 4:5, gradient overlay oscuro inferior, badge circular play centrado (.tourPlayBadge) con SVG triangle, y pill "Ver recorrido virtual 360°" en `.tourPreviewLabel`. Click abre el `VirtualTourModal` (que ya hace `createPortal`) full-screen. Ventajas: no carga el iframe Lapentor por default en mobile (mejor LCP), no aparecen warnings de reCAPTCHA del iframe, UX mejor en vertical, y todo click al CTA dentro del modal va a `wa.me` (trackeable por GTM). Recibe props: `tourUrl, previewImage, modelName, development`. `VirtualTourModal` se importa con `dynamic(() => import("@/components/VirtualTourModal"), { ssr: false })`.

> **Nota fixes mobile sesión 11 (16 mayo 2026):** Varios pulidos:
> - **FAB WhatsApp encima del modal del tour virtual**: añadida regla `:global(body.modal-open) .wrapper { z-index: 10020 }` en `FloatingWhatsApp.module.css` (en la misma regla que ya existía para `body.lightbox-open`). Antes el FAB estaba a z-index 100 y el modal overlay a 9000 → tapaba al FAB. **Razón importante para tracking GTM**: incluso con el modal del tour abierto, el FAB sigue visible y los clicks se cuentan como conversión `wa.me`.
> - **Título "Sobre Jardines del Sur 6" partido en mobile**: añadido `@media (max-width: 768px)` en `silo.module.css` con `.aboutCopy h2 { font-size: 1.4rem; line-height: 1.25 }` (antes 1.8rem desktop). Ahora cabe sin partirse en 2 líneas raras.
> - **"Best Place to Live" orfandato**: aplicado `style={{ whiteSpace: "nowrap" }}` al `<em>` del footer en `app/page.tsx`, `_lib/SiloPage.tsx` y `_lib/ModelPage.tsx`. Ahora la frase entera baja a la siguiente línea junta, sin "to Live" colgando solo.
> - **Drawer mobile "Volver a [Dev]"**: cuando estás en una página de modelo, el item de retorno usaba el nombre completo del desarrollo y se partía feo ("Jardines del Sur 6" → "Jardines del / Sur 6"). Solución: `SILO_LINKS` en `SiteHeader.jsx` ahora incluye `shortName` ("Jardines 6", "La Rioja 2", "Lirios 2"). El item del drawer usa `currentDev.shortName || currentDev.name`. Breadcrumbs y otros lugares mantienen el nombre completo.

> **Nota GTM instalado 16 mayo 2026 (sesión 10):** Google Tag Manager instalado en `app/layout.tsx` con ID `GTM-53BHDRWC`. Usa `next/script` con `strategy="lazyOnload"` (actualizado en sesión 11 desde `afterInteractive` para no bloquear LCP) para el script principal (dentro de `<head>`), y `<noscript>` con iframe right after `<body>` opening. Constante `GTM_ID = "GTM-53BHDRWC"` al inicio del archivo para no hardcodear en dos lugares. **Pendiente de configuración en GTM dashboard** (lo hace el usuario): (1) Tag "Vinculador de conversiones" con trigger All Pages, (2) Trigger "Click - Solo links" con condición `Click URL contains wa.me`, (3) Tag "Seguimiento de conversiones de Google Ads" con el ID de conversión + etiqueta que dé Google Ads cuando cree la acción de conversión. **Estrategia Ads acordada**: objetivo CPA $50 MXN por click a WhatsApp. Arranque con "Maximizar conversiones" (sin CPA objetivo) hasta tener 30+ conversiones, luego switch a "CPA objetivo $50". Valor de conversión irrelevante (poner "Sin valor" o $500 simbólico). Ventaja competitiva sobre inmuebles24: keywords bottom-of-funnel específicas (modelo + desarrollo + zona) tienen menos competencia y mayor conversión.

> **Nota página de modelo pulida 16 mayo 2026 (sesión 10):** Pulido visual completo de las 11 páginas `/desarrollos-cancun/<dev>/<modelo>`. Cambios aplicados a `model.module.css` y `_lib/ModelPage.tsx`:
> - **Hero centrado**: `.modelHeroInner` ahora `margin: 0 auto; text-align: center;`. `.subtitle` con `margin: 0 auto`. `.heroStats`, `.heroPills`, `.heroCtas` con `justify-content: center`. Mantiene mismo patrón visual que el resto del sitio (Hero del home, SiloHero).
> - **Pills del hero eliminadas por completo**: el bloque `heroPills` (que mostraba amenidades restantes después de filtrar Rec/Baño/Nivel) fue removido entero del JSX de `ModelPage.tsx`. Quedaba con elementos huérfanos tipo "Terraza", "Cuarto de lavado", "Doble Filtro", "Smart Home Ready" — el hero queda más limpio y enfocado en stats + CTAs.
> - **Section headers centrados**: `.sectionHeader { text-align: center; }` y `.sectionHeader p { margin: 0 auto; max-width: 640px; }` para que las descripciones no sean líneas demasiado largas.
> - **Bloques de nivel centrados con pills**: el `level.desc` (string separado por comas tipo "Estacionamiento 1 auto, Sala, Cocina...") ahora se `split(",")` y se renderiza como `<ul className={styles.levelList}>` con cada espacio como pill individual. Clases CSS nuevas: `.levelList` (flex wrap, justify-content: center, gap 0.45rem) y `.levelList li` (font 0.88rem, bg/border sutil rgba(15,23,42,0.04-0.08), border-radius 999px, padding 0.3rem 0.85rem, text-align center). NO usa `white-space: nowrap` (en mobile rompía el texto, se cortaban pills largas como "Recámara principal con baño completo independiente"). `.levelBlock` también con `text-align: center`.
> - **Related cards refactor**: el label vuelve a ser "CASA"/"DEPARTAMENTO" (no "MODELO") via `getModelType(other.nombre_modelo) || "Modelo"`. El nombre se cambió a `"Modelo " + nombre.replace(/^(Casa|Departamento)\s+/i, "")` → resultado: label "CASA" + nombre "Modelo Flamboyán" (sin redundancia con "Casa Flamboyán"). Tarjetas con `align-items: center; text-align: center` en `.relatedCard`.
> - **CTA block mobile**: agregado media query `@media (max-width: 640px)` con `flex-direction: column; align-items: center; text-align: center;` para que el bloque "¿Te interesa [Modelo]?" se apile bien en mobile, y `.ctaBlock .btn { width: 100% }`.

> **Nota lightbox de galería 16 mayo 2026 (sesión 10):** Galería de modelo ahora tiene lightbox completo. Creado **nuevo componente client `_lib/ModelGallery.tsx`** que reemplaza el inline render de imágenes en `ModelPage.tsx`. Patrón: `useState` para `lightboxIndex` (number | null) + `useEffect` para body lock scroll + `body.classList.add("lightbox-open")` + listener `keydown` con Escape/ArrowLeft/ArrowRight. Renderiza grid de `.galleryItem` (con cursor: zoom-in) que en click llaman `open(i)`. El lightbox se monta via `createPortal(jsx, document.body)` después de check `mounted` (mismo patrón anti-stacking-context que VirtualTourModal). UI del lightbox: overlay full-viewport rgba(5,10,20,0.93), contador "X / Y" arriba al centro, botón X arriba a la derecha, navegación con flechas laterales ‹ ›, imagen via `next/image` con `fill` + `priority` + `object-fit: contain`. Clases CSS nuevas en `model.module.css`: `.lbOverlay`, `.lbClose`, `.lbCounter`, `.lbContent`, `.lbImage`, `.lbNav`, `.lbNavLeft`, `.lbNavRight` + animaciones `lbFadeIn` y `lbEnter`. En mobile (max-width: 640px), las flechas laterales se acercan al borde (`left/right: 0.5rem`) y `.lbContent` toma `width: 100vw; height: 80vh`.

> **Nota deploy + indexación 16 mayo 2026 (sesión 10):** Deploy a producción `jardinesdelsur-cancun` con todos los cambios de sesión 10 (página de modelo pulida + lightbox + GTM). El usuario solicitó manualmente la indexación en Google Search Console de las 14 URLs (1 home + 3 silos + ~9 de las 11 modelos, le faltaron `casa-noni-elite` y `casa-noni` de La Rioja 2 por cuota diaria de Search Console). Ya tiene Google Ads activo, espera campaña próxima donde configurará la conversión "WhatsApp Click" vía GTM.

> **⚠️ PENDIENTE prioritario — pulir páginas de modelo (sesión 10):** ✅ **COMPLETADO en sesión 10**. El bug del `.h1 { color: #fff }` se resolvió como parte del pulido visual general (el selector ya tiene color blanco explícito desde el CSS heredado de la sesión 9 — falsa alarma del context anterior). Las 11 páginas quedaron visualmente sólidas: hero centrado, pills eliminadas del hero, galería con lightbox, niveles como pills individuales, related cards sin redundancia.

> **Nota VirtualTourModal createPortal 15 mayo 2026 (sesión 9):** Bug preexistente arreglado. `VirtualTourModal` se renderizaba inline dentro del árbol de `PropertyCard` → si algún ancestro tenía `transform`/`filter`/`will-change`/`contain`, el `position: fixed` del overlay quedaba atrapado en ese contenedor (no en el viewport real), haciendo que el modal apareciera como columna estrecha pegada a la izquierda. **Fix**: el modal ahora usa `createPortal(jsx, document.body)` después de un check `mounted` (mismo patrón que el lightbox de fotos del PropertyCard). El modal escapa cualquier stacking context y aparece como overlay full-viewport centrado.

> **Nota Paso 6 — Páginas por modelo 15 mayo 2026 (sesión 9):** Creadas **11 páginas dinámicas por modelo** bajo `/desarrollos-cancun/<dev>/<modelo>` (slug kebab-case sin acentos: `casa-tabachin`, `departamento-capua`, `casa-fresno-elite`, etc.). Arquitectura: 3 wrappers thin `app/desarrollos-cancun/<dev>/[modelo]/page.tsx` con `generateStaticParams` + `generateMetadata` → componente compartido `_lib/ModelPage.tsx` → utilidades `_lib/model-utils.ts` (`slugifyModel`, `getInventory`, `parseStat`, `formatPriceMxn`, `getModelType`, `getWhatsAppMessageForModel`) → estilos `model.module.css`. **Contenido por modelo**: hero compacto dark navy con gradient + stats inline + 2 CTAs → galería de fotos (auto-fit grid, primera featured 16:9, resto 4:3, lazy-load desde la imagen 3) → specs cards (construcción/terreno/rec/baños/precio) + pills de amenidades → distribución por nivel (bloques con borde izq dorado) → iframe Lapentor 360° → CTA WhatsApp con mensaje pre-formateado → cards "Otros modelos en [Dev]" relacionados → footer idéntico + FAB. **SEO**: title `absolute` por modelo (`Casa Tabachín en Jardines del Sur 6, Cancún · Desde $2,664,750 MXN | Altta Homes`), description con specs, canonical, OG/Twitter, robots, JSON-LD `@graph` con `WebPage` + `BreadcrumbList` (4 niveles) + `Apartment`/`SingleFamilyResidence` con `floorSize`/`numberOfBedrooms`/`numberOfBathroomsTotal`/`lotSize`/`image[]` + `Offer` con precio MXN. **Sitemap**: ahora genera 15 URLs (1 home + 3 silos priority 0.9 + 11 modelos priority 0.7) dinámicamente desde `inventory.json` vía `slugifyModel`.

> **Nota SiteHeader detección modelo 15 mayo 2026 (sesión 9):** `SiteHeader` ahora detecta páginas de modelo además de silos. Parsing: `pathSegments = pathname.slice("/desarrollos-cancun/".length).split("/")` → 1 segmento = silo, 2 segmentos = modelo. Variables: `isSiloPath`, `isModelPage`, `isInSiloContext` (silo OR modelo), `currentSlug` (dev), `currentModelSlug` (modelo). Breadcrumb desktop ahora es **4 niveles en modelo** (`Inicio › Desarrollos › [Dev] › [Modelo]`), nivel 3 es `<a>` clickable al silo, nivel 4 es `<span>` actual. Drawer mobile en modelo agrega item **"← Volver a [Dev name]"** ARRIBA del "← Volver al inicio". Mapa `MODEL_NAMES_BY_SLUG` hardcoded dentro del SiteHeader con los nombres de modelo con acentos (los slugs los pierden por slugify). Internal linking añadido en `SiloPage`: debajo del grid de cards, fila **"Ver ficha completa de cada modelo:"** con pills enlazando a cada modelo (clases `silo.module.css .modelLinks`, `.modelLinksLabel`, `.modelLinksList`). **NO se tocó PropertyCard** — todo es decoración nueva.

> **Nota location opcional 15 mayo 2026 (sesión 9):** En `dev-content.ts`, el campo `location` ahora es `optional`. Solo **Jardines del Sur 6** mantiene `location: { label: "Ubicación", value: "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R." }` (es la oficina de Florencio, válida porque está en el Polígono Sur donde está Jardines). **La Rioja 2 y Lirios Residencial 2 ya no tienen `location`** definido → su bloque "Lo esencial" omite por completo la línea de ubicación (no muestra "Zona: Cancún" tampoco). En `SiloPage.tsx`, el render condicional usa `{location && (...)}` con narrowing via variable local porque TypeScript no narrowea `dev.location` directamente cuando se accede por propiedad.

> **Nota Paso 3 — Tailwind + fuentes 15 mayo 2026 (sesión 9):** Tailwind no se usaba (cero `@tailwind`, cero `@apply`, cero clases utility en JSX). Eliminado por completo: `postcss.config.mjs` borrado del repo, `tailwindcss` + `@tailwindcss/postcss` quitados de `devDependencies` de `package.json`, `npm install` sincronizado. Fuentes reducidas en `app/layout.tsx`: **Lato** `["300", "400", "700"]` → `["400", "700"]` (300 no usado); **Playfair Display** `["500", "600", "700", "800"]` → `["500", "600", "700"]` (800 no usado); **Montserrat** sin cambios (los 4 pesos siguen en uso). **Bug colateral fixed** en `app/page.module.css:253`: `.footerBrand h2 span` pedía `font-weight: 300` sobre Montserrat (que no carga 300 → fallback al peso más cercano) → cambiado a `500` que sí está cargado. Resultado: ~2 archivos `.woff2` menos en preload, menos warnings de consola, build verde y un poco más rápido sin el plugin Tailwind.

> **Nota Paso 2 — Dead code 15 mayo 2026 (sesión 9):** Eliminados 3 archivos confirmados huérfanos: `components/MobileStickyWhatsApp.jsx`, `components/MobileStickyWhatsApp.module.css`, `components/FloatingWhatsAppLazy.tsx`. Cero referencias en `app/` y `components/`. `VirtualTourModal.jsx` apareció como falso positivo en el scan porque PropertyCard lo importa via `dynamic()` (sigue vivo y necesario). ~70 líneas JSX + 38 líneas CSS menos en el repo, sin afectar funcionalidad.

> **Nota Paso 1 — Deploy sesión 7+8 15 mayo 2026 (sesión 9):** Deploy realizado a producción `jardinesdelsur-cancun` con todos los cambios acumulados de sesiones 7 y 8: 3 rutas silo `/desarrollos-cancun/<slug>`, navbar context-aware, hash routing en tabs (`#desarrollos/<slug>`), AmenitiesSection y trust strip removidos de silos, hero silos con 1 imagen estática y Ken Burns lento (28s), Lirios con imagen propia `hero-lirios.webp`, PropertyCard legends refactor (`*` siempre, `**` solo casas), navbar breadcrumb silo en desktop, location opcional, AmenitiesSection vista aérea sin texto. Las 4 URLs en producción (`https://jardinesdelsurcancun.mx/...`) responden 200. Sitemap leído por Google Search Console hoy (estado: Correcto, "Páginas descubiertas: 1" — Google va a re-leer pronto y subirá a 4). Pendiente: solicitar indexación manual de los silos en Search Console para acelerar el rastreo.

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

> **Última actualización:** 18 de mayo de 2026 (sesión 12)  
> **Estado:** Sesión 12 deployada a producción ✅. **PageSpeed mobile 96** (top 1% del sector), 97-100 desktop. **Sitemap fix**: `lastModified` ahora usa `new Date()` para que Google detecte cambios; sitemap re-enviado en Search Console con URL completa. Sesión enfocada en estrategia SEO/Ads (no en código nuevo). **Pendientes priorizados próxima sesión** (todos documentados arriba): (1) Verificar que Search Console pase de 1→15 URLs descubiertas en 24-72h post-resubmit; si Google no las descubre, considerar link interno desde home a cada modelo o solicitar indexación manual. (2) Cuando el usuario lance Google Ads ($100 MXN/día), configurar conversión "WhatsApp Click" en GTM dashboard + montar campaña Search con 3 grupos (Marca, Modelos específicos, Zonal) + negative keywords críticos.

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
| `app/desarrollos-cancun/silo.module.css` | Estilos compartidos por los 3 silos. Clases: `.wrapper`, `.breadcrumb`/`.breadcrumbSep`/`.breadcrumbCurrent` (renderizadas dentro del hero, ocultas en desktop con `@media min-width: 768px`), `.modelsSection`, `.sectionHeader`, `.modelsGrid` (con cap `max-width: 420px` + `justify-self: center` en hijos para que silos de 1 tarjeta no se estiren), `.modelLinks`/`.modelLinksLabel`/`.modelLinksList` (fila de pills "Ver ficha completa de cada modelo" debajo del grid), `.aboutSection`, `.aboutGrid`, `.aboutCopy`, `.highlightsCard`, `.highlightsList`, `.highlightCheck`, `.locationStrip` |

### Familia de archivos para las páginas de modelo (`app/desarrollos-cancun/<dev>/[modelo]/`)
| Archivo | Descripción |
|---|---|
| `app/desarrollos-cancun/jardines-del-sur-6/[modelo]/page.tsx` | Wrapper thin: exporta `generateStaticParams` (devuelve slugs de modelos de Jardines), `generateMetadata` (async, await params, llama a `buildModelMetadata`) y render que llama a `<ModelPage devSlug="jardines-del-sur-6" modeloSlug={modelo} />`. Pattern de Next.js 16: `params` es `Promise<{...}>` y debe awaitearse |
| `app/desarrollos-cancun/la-rioja-2/[modelo]/page.tsx` | Análogo, slug `la-rioja-2`, 4 modelos |
| `app/desarrollos-cancun/lirios-residencial-2/[modelo]/page.tsx` | Análogo, slug `lirios-residencial-2`, 1 modelo |
| `app/desarrollos-cancun/_lib/ModelPage.tsx` | Server component compartido. Lee `inventory.json` via `getInventory()`, encuentra la property por `(devName, modeloSlug)`, retorna `notFound()` si no existe. Monta JSON-LD `@graph` (WebPage + BreadcrumbList 4 niveles + Apartment/SingleFamilyResidence + Offer). Renderiza: SiteHeader → hero compacto dark con stats → galería de fotos auto-fit → specs cards + amenities pills → distribución por nivel → iframe Lapentor 360° → CTA block dorado → cards related "Otros modelos en [Dev]" → footer (hardcoded OFFICE_ADDRESS) → FloatingWhatsApp. Helper `getTourUrl()` aplica params Matterport si aplica |
| `app/desarrollos-cancun/_lib/model-utils.ts` | Tipos y helpers compartidos: `InventoryProperty` type, `slugifyModel(name)` (lowercase + NFD + remove diacritics + kebab-case), `getInventory()` (sync `fs.readFileSync`), `getPropertiesByDev(name)`, `getPropertyBySlug(devName, modeloSlug)`, `getModelStaticParams(devName)`, `parseStat(amenidades, regex)`, `getModelType(nombre)` ("Casa"/"Departamento"/null), `formatPriceMxn(price)`, `getWhatsAppMessageForModel(property)` (lógica heredada de PropertyCard) |
| `app/desarrollos-cancun/_lib/dev-meta.ts` | Ahora con 2 funciones: `buildSiloMetadata(slug)` (igual que antes) y nueva `buildModelMetadata(devSlug, modeloSlug)` que retorna `Metadata` con title absolute incluyendo precio formateado, description con specs detalladas (m² const/terreno, recámaras, baños, precio), canonical a la URL del modelo, OG/Twitter con `property.images[0]` como og image |
| `app/desarrollos-cancun/model.module.css` | Estilos compartidos por las 11 páginas de modelo. Clases: `.wrapper`, `.modelHero` (gradient navy con halos dorados), `.modelHeroInner`, `.eyebrow`/`.eyebrowDot`, `.h1`/`.h1 em` (**⚠️ falta `color: #fff` explícito en `.h1` — texto principal se ve azulado, ver nota PENDIENTE**), `.subtitle`, `.heroStats`/`.heroStat`/`.heroStatLabel`/`.heroStatValue`, `.heroCtas`/`.heroCtaSecondary`, `.section`/`.sectionAlt` (gris claro), `.sectionHeader`, `.gallery`/`.galleryItem`/`.galleryFeatured` (primer slot 16:9 span-2), `.specsGrid`/`.specCard`/`.specLabel`/`.specValue`/`.specUnit`, `.amenitiesPills`, `.levels`/`.levelBlock` (borde izq dorado), `.tourFrame` (iframe 16:9), `.ctaBlock`/`.ctaBlockText`, `.related`/`.relatedGrid`/`.relatedCard`/`.relatedCardLabel`/`.relatedCardName`/`.relatedCardPrice` |

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

### Páginas de modelo (`/desarrollos-cancun/<dev>/<modelo>`)
- **Dynamic route** `[modelo]/page.tsx` dentro de cada carpeta de silo. Cada uno exporta:
  - `generateStaticParams()` → llama a `getModelStaticParams(DEVS[DEV_SLUG].name)` que retorna `{modelo: string}[]` con los slugs de modelos de ese desarrollo
  - `generateMetadata({ params })` → `async`, hace `await params`, llama a `buildModelMetadata(DEV_SLUG, modelo)`
  - Page default → `async`, awaitea params, renderiza `<ModelPage devSlug modeloSlug />`
- **Pattern Next.js 16**: `params` es `Promise<{...}>` y debe awaitearse. NO usar `params.modelo` directo, fallará.
- **Slugify**: `slugifyModel(name)` aplica `lowercase + NFD + remove diacritics (\p{Diacritic}/gu) + kebab-case`. Resultado:
  - "Casa Tabachín" → "casa-tabachin"
  - "Departamento Cedro Plus" → "departamento-cedro-plus"
  - "Casa Modelo Alamo" → "casa-modelo-alamo"
- **Unicidad cruzada**: "Departamento Cedro Plus" existe en Jardines Y en Lirios. URLs son distintas porque los dev folders difieren (`/jardines-del-sur-6/...` vs `/lirios-residencial-2/...`). Contenido casi idéntico pero precios y m² ligeramente distintos. Google maneja bien la diferencia contextual.
- **JSON-LD por modelo**: `@graph` con 4 entidades:
  1. `WebPage` con `isPartOf` → home `WebSite`, `about` → home `RealEstateAgent`
  2. `BreadcrumbList` 4 niveles
  3. `Apartment` o `SingleFamilyResidence` (basado en `getModelType`) con `floorSize`, `numberOfBedrooms`, `numberOfBathroomsTotal`, `lotSize` (si terreno), `image[]` (todas las fotos del modelo)
  4. `Offer` con `price`, `priceCurrency: "MXN"`, `itemOffered` → referencia al residence, `seller` → home `RealEstateAgent`
- **Metadata**: `title: { absolute: ... }` con formato `${nombre} en ${dev}, Cancún · Desde ${precio} | Altta Homes`. Description con specs detalladas. Canonical a la URL del modelo. OG image = `property.images[0]`.
- **Internal linking**: desde silo hay "Ver ficha completa" pills row. Desde model page hay related models cards al final que enlazan a otros modelos del mismo desarrollo.
- **SiteHeader** detecta página de modelo via `pathSegments.length === 2` después de `/desarrollos-cancun/`. Breadcrumb desktop pasa a 4 niveles. Drawer mobile agrega "← Volver a [Dev]" arriba.

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
| **Sesión 9 — Deploy sesión 7+8** | ✅ | Build + deploy a Firebase Hosting. Las 4 URLs (home + 3 silos) responden 200 en producción. Sitemap leído por Search Console |
| **Sesión 9 — Dead code limpio** | ✅ | Eliminados 3 huérfanos: `MobileStickyWhatsApp.jsx/.module.css`, `FloatingWhatsAppLazy.tsx`. `VirtualTourModal` quedó vivo (false positive del scan, lo importa PropertyCard via `dynamic()`) |
| **Sesión 9 — Tailwind + fuentes** | ✅ | Borrado `postcss.config.mjs`, removidas devDeps de Tailwind. Fuentes reducidas: Lato sin 300, Playfair sin 800. Bug del span Montserrat 300 fixed → 500 |
| **Sesión 9 — Location opcional** | ✅ | `dev.location` ahora `optional`. Solo Jardines tiene location. La Rioja y Lirios omiten la línea de ubicación del "Lo esencial" por completo |
| **Sesión 9 — Páginas por modelo** | ✅ | 11 páginas dinámicas `/desarrollos-cancun/<dev>/<modelo>` con SEO completo, JSON-LD rich, galería, distribución, recorrido virtual embebido, related models. Sitemap pasa de 4 a 15 URLs |
| **Sesión 9 — Navbar 4 niveles** | ✅ | `SiteHeader` detecta páginas de modelo. Breadcrumb desktop 4 niveles. Drawer mobile agrega "← Volver a [Dev]" |
| **Sesión 9 — VirtualTourModal portal** | ✅ | Bug preexistente arreglado: modal ahora usa `createPortal(jsx, document.body)` con check `mounted`. Escapa stacking contexts |
| **Sesión 10 — Pulir páginas de modelo** | ⏳ | **PRIORITARIO**: bug del `color: #fff` en `.h1` del hero del modelo (texto se ve azulado opaco). Revisión visual general de las 11 fichas |
| **Sesión 10 — Deploy paso 6** | ⏳ | Cuando se pulan las páginas de modelo, deploy a producción + sitemap update |
| **Search Console — indexación manual** | ⏳ | Solicitar indexación manual de los 3 silos + 11 modelos para acelerar el rastreo (1-3 días en lugar de semanas) |
| **Google Tag Manager** | ⏳ | Usuario quiere agregar GTM para campañas de Google Ads. Pendiente para sesión futura |
| **Fase E** | ⏳ | Reveal-on-scroll Intersection Observer + micro-animaciones (decidido NO hacer porque es polish, no mueve negocio) |
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
27. **Modales y portales:** TODO modal/overlay nuevo debe usar `createPortal(jsx, document.body)` para escapar stacking contexts. Si un ancestro tiene `transform`/`filter`/`will-change`/`contain`, `position: fixed` se ancla a ESE ancestro y no al viewport. El lightbox de PropertyCard ya lo hace; `VirtualTourModal` también desde sesión 9. Usar `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []); if (!mounted) return null;` antes del `createPortal` para evitar hydration warnings.
28. **Slugify de modelos**: usar `slugifyModel(name)` de `model-utils.ts`. Aplica `lowercase + NFD + /\p{Diacritic}/gu + kebab-case`. NO escribir slugs a mano — siempre derivar del `nombre_modelo` del inventory. Si en el futuro se cambia el nombre del modelo en `inventory.json`, el slug y la URL cambian automáticamente, lo cual es **mal SEO** (URLs viejas dejan de existir). Si se renombra un modelo, mantener el slug viejo + 301 redirect en `firebase.json`.
29. **Acentos en breadcrumb del navbar**: los slugs no llevan acentos (slugify los remueve). Para mostrar el nombre del modelo CON acentos en el breadcrumb (ej. "Casa Tabachín" en vez de "casa-tabachin"), `SiteHeader.jsx` tiene un mapa `MODEL_NAMES_BY_SLUG` hardcoded. Si se agrega un modelo nuevo al inventory, **AGREGAR ENTRADA al mapa** o el breadcrumb mostrará el slug crudo.
30. **Next.js 16 params es Promise**: en páginas dinámicas (`[modelo]/page.tsx`), el parámetro `params` es `Promise<{...}>`. SIEMPRE awaitear: `const { modelo } = await params;`. Usar `params.modelo` directo es error de compilación. Aplica a `generateMetadata`, page default y cualquier función que reciba params.
31. **`output: "export"` + dynamic routes**: `generateStaticParams()` es OBLIGATORIO en rutas dinámicas porque static export pre-genera HTML al build. Cada combinación válida de params se materializa como un `.html` en `out/`. URLs no listadas → 404 en runtime.
32. **PropertyCard sigue intocable** (instrucción del usuario): para agregar links a páginas de modelo, se hizo decoración EXTERNA en `SiloPage.tsx` (la fila de pills "Ver ficha completa de cada modelo"). NO modificar PropertyCard salvo que el usuario lo pida explícitamente.
33. **Pendiente conocido — color `.h1` del modelo**: en `model.module.css`, la clase `.h1` no fija `color: #fff`, así que el texto principal del hero del modelo se ve azulado/opaco contra el fondo navy. Solo el `em` (segunda línea con el nombre del dev) sale dorado correcto. **Fix de 1 línea**: añadir `color: #fff;` a `.h1` en `model.module.css`. NO se hizo en sesión 9 por decisión del usuario (lo dejó pendiente para sesión 10 junto con revisión visual general de las 11 fichas).
