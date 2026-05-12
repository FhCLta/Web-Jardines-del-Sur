# Contexto del Proyecto: Stitch - Ecosistema Inmobiliario Cancún 2026

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

> **Última actualización:** 1 de mayo de 2026 (sesión 4)  
> **Estado:** Fases A–D completas + distribución de niveles actualizada + CTAs optimizados + nav centrado. Fase E pendiente.

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
| `components/SiteHeader.jsx/.module.css` | Header glass scroll + hamburger drawer mobile. Nav desktop: **3 columnas grid** (logo izq · links centrados · botón der). Links: **Inicio · Modelos y Precios · Contacto**. Botón "Informes WhatsApp" separado del nav (fuera del `<nav>`). z-index: 120. Drawer z-index: 115 |
| `components/Hero.jsx/.module.css` | 4 slides Ken Burns, eyebrow pulsante, título Playfair, trust strip, scrollHint. H1 actual: "Casas y departamentos / en Cancún" + "con el respaldo de Grupo Sadasi". Subtítulo actual en 2 líneas: desarrollos en bold y abajo "Modelos, precios e informes en minutos.". Primera imagen del hero usa `<picture><img>` real con `fetchPriority="high"` y fuente mobile `/optimized/hero/alberca-mobile.webp`; slides siguientes cargan en idle. CTA primario: **"Ver Modelos y Precios"** → `#desarrollos`. CTA secundario: **"Hablar con un asesor"** → WA |
| `components/DevelopmentTabs.jsx/.module.css` | Selector segmentado 3 cols. `id="desarrollos"` removido (ahora está en page.tsx) |
| `components/PropertyCard.jsx/.module.css` | Encabezado distribución: `"Distribución:"`. Etiqueta "Nivel N:" solo aparece si hay más de 1 nivel (`levels.length > 1`). CTA: **"Cotizar ahora"** (antes "Cotizar"). Legal legend: `***` nota de lote tipo oculta cuando `metros_terreno === null` (departamentos). Textos legales actualizados: "Precio no incluye gastos de escrituración", "Actualizado a FEBRERO DEL 2026", "Lote tipo. Esquina o excedente varía el costo." El badge visual `statusBadge` ya no se renderiza; imágenes de cards cargan lazy |
| `components/VirtualTourModal.jsx/.module.css` | Mensaje WA sincronizado con PropertyCard: usa `getWhatsAppText()` con la misma lógica inteligente de prefijo (casa modelo / departamento modelo). Tours activos de La Rioja 2 y Jardines/Lirios usan Lapentor; se conserva fallback Matterport si aparece una URL `matterport.com`. CSS mobile protegido con `100dvh`, header/footer fijos en flex y `.content { min-height: 0 }` para que el iframe no tape el CTA |
| `components/AmenitiesSection.jsx/.module.css` | Masonry navy/gold, 6 tiles con imágenes optimizadas de `/optimized/amenidades/` |
| `components/FloatingWhatsApp.jsx/.module.css` | Dark/gold tooltip, FAB bottom:5rem mobile |

---

## 5. Lógica Clave

### Selector de desarrollo (DevelopmentTabs)
- Grid 3 columnas iguales con `repeat(3, 1fr)`, dentro de contenedor con `background: rgba(15,23,42,0.04)` y `border-radius: 1.1rem`
- Cada `.devCard`: foto circular 38px + nombre, centrado verticalmente
- Activa: `translateY(-2px)`, sombra gold `0 0 0 2px rgba(209,146,0,0.55)`, foto con `border-color: var(--accent)` y `scale(1.08)`
- El "diamante" apuntando hacia abajo en `.devCardActive::after` indica qué panel está activo

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
| AmenitiesSection imágenes | ✅ | Reimplementada con 6 imágenes de `/amenidades/`: alberca (Jardines), gimnasio1, área infantil, cancha, gimnasio exterior, Vista aerea1 (La Rioja 2) |
| **Sesión 4 — Distribución** | ✅ | Todos los niveles de Jardines del Sur 6 actualizados. Encabezado inteligente. Etiqueta "Nivel N:" condicional. Nota lote tipo condicional por terreno |
| **Sesión 4 — CTAs y Nav** | ✅ | Hero: "Hablar con un asesor" + "Ver Modelos y Precios". Cards: "Cotizar ahora". Nav: Inicio · Modelos y Precios · Contacto centrados (grid 3 cols). Ancla `#desarrollos` en page.tsx |
| **Sesión 4 — VirtualTourModal WA** | ✅ | Mensaje WA del modal sincronizado con lógica de PropertyCard (`getWhatsAppText()`) |
| **Sesión 5 — Tours La Rioja** | ✅ | Recorridos de La Rioja 2 actualizados a Lapentor. Modal mobile ajustado con `100dvh` para conservar el footer de cotizacion visible |
| **Fase E** | ⏳ | Reveal-on-scroll Intersection Observer + micro-animaciones |
| Distribución La Rioja 2 | ⏳ | Pendiente: revisar niveles/distribucion textual de Fresno Elite, Alamo, Noni Elite y Noni |
| Fotos Lirios 2 | ⏳ | Pendiente de recibir imágenes |
| SEO / Analytics | ⏳ | Diferido por solicitud del usuario |

---

## 9. Notas Importantes para Continuar
1. **No tocar CTAs de PropertyCard** — "Visita Virtual" y "Cotizar ahora" están bloqueados por instrucción del usuario
2. **Distribución La Rioja 2** — pendiente para sesión 5 (Fresno Elite, Alamo, Noni Elite, Noni)
3. **Fase E** es el siguiente paso mayor: `IntersectionObserver` en tarjetas, sectionHeader, amenidades tiles — entrada suave desde abajo con `opacity 0→1` + `translateY(24px→0)`
4. El dev server puede requerir `npm run dev` en `D:/Web de Jardines` — verificar con `curl http://localhost:3000`
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
