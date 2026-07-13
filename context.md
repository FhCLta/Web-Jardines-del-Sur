# Contexto del Proyecto: Stitch - Ecosistema Inmobiliario Cancún 2026

> **✅ COTIZADOR v4 FINAL (12 jul 2026, madrugada) — CALIBRADO CONTRA CORRIDA REAL DE BBVA, desplegado OCULTO (noindex), pendiente SOLO revisión final de Florencio → checklist de publicación:**
>
> Tras la v3, Florencio comparó contra su simulador BBVA real y se afinaron 4 cosas (todas desplegadas): (1) **aportación en efectivo con PISO**: en modelos que requieren efectivo (ej. Flamboyán $89,735) el slider ARRANCA en ese mínimo y NO deja bajar; se reinicia al cambiar de modelo; (2) **"Ingreso sugerido"** (sin "familiar") con **regla 50/50** = mensualidad/50% (los bancos aceptan hasta ~60%; no espantar clientes viables); (3) **comisión de administración 0.30‰ mensual del crédito** agregada (faltaba vs BBVA): verificación con crédito idéntico $2,482,300 @ 9.65% 20a → base IDÉNTICO $23,382; total nuestro $26,168 vs BBVA $26,025 = **+0.5% conservador** 🎯; (4) el precio "desde" público de Capua ($1,758,830) y los avalúos corregidos YA ESTÁN EN PRODUCCIÓN (Florencio los aprobó; verificados en vivo en home/silo).
>
> **Estado actual:** la página `/calculadora-hipotecaria` está DESPLEGADA pero **oculta** (noindex + sin enlaces + fuera del sitemap) — se puede probar por URL directa desde cualquier dispositivo. **Ventaja clave del diseño (le encantó a Florencio): la calculadora lee `inventory.json` → al actualizar precios/avalúos del sitio se recalibra SOLA.** Solo recordar actualizar `VARIANT_NOTE` (etiqueta nivel/vista) en `MortgageCalculator.jsx` si cambia la variante publicada de un depto. **PENDIENTE: (a) Florencio la revisa a detalle; (b) ADAPTAR/PULIR PARA MOBILE (pedido explícito de Florencio 13 jul)** — el layout ya apila a 1 columna en <860px, pero falta la pasada fina en teléfono real: tamaños de sliders/botones táctiles, panel de resultados, badge, selector de modelo con textos largos, verificación visual 390px/320px como se hizo con el hero; **(c) al aprobar (a)+(b), ejecutar checklist de publicación:** quitar `robots: index:false` de `app/calculadora-hipotecaria/page.tsx` → agregarla a `sitemap.ts` → enlace "Calculadora" en los 6 footers (+decidir bloque en fichas de modelo, prop `initialModelId` ya soportada) → build+deploy → solicitar indexación en Search Console.

> **🔁 (Histórico) ACTUALIZACIÓN COTIZADOR (12 jul 2026, noche) — v3 con la LÓGICA REAL del cotizador interno de Florencio (sigue en LOCAL/noindex):**
>
> Florencio compartió su cotizador interno (`../Cotizador Automatico Nuevo/` — script.js con catálogo completo) y se calibró contra él. **Lógica v3 implementada:** (1) **precio de lista = AVALÚO; bono = descuento; neto = lo que paga el cliente** (verificado: los precios del inventario del sitio SON los netos de su catálogo); (2) **gastos de escrituración = 8.5% SOBRE EL AVALÚO** (el % más alto de su tabla real — infonavit 7%, fovissste 8%, cofinavit 8.5%, bancario 7.5-7.7%, contado 7.2% — decisión de Florencio: usar el más alto, simple y nunca prometer de menos; las variantes PROMO ya NO aplican); (3) **el crédito (90% del avalúo) cubre PRECIO + GASTOS** → efectivo para estrenar = max(0, neto+gastos−crédito) = **$0 en la mayoría de los modelos** → badge "Estrenas SIN enganche — el crédito cubre precio y gastos"; la aportación es "voluntaria (opcional)" para bajar mensualidad.
>
> **Departamentos (decisión de Florencio):** SIN selector de nivel/vista — cada depto usa su **variante más barata** con su avalúo CORRESPONDIENTE + nota "Precio correspondiente al [nivel/vista]… hay más niveles y vistas — cotízalos por WhatsApp" (gancho). **Se corrigió el `inventory.json`** para que precio↔avalúo sean pares consistentes de la MISMA variante: Capua → $1,758,830 / avalúo $2,230,000 (**Nivel 3 · vista estacionamiento** — ⚠️ esto BAJÓ el "desde" público de Capua, antes $1,777,640 del Nivel 2; se propaga a tarjetas/hero del silo/metadata); Cedro Plus JdS6 → $2,247,700 / avalúo $2,760,000 (Nivel 2 · alberca; antes tenía el avalúo del Nivel 3); Cedro Plus Lirios → $2,248,750 / avalúo $2,653,000 (Nivel 2; ídem). El mapa nivel↔etiqueta vive en `VARIANT_NOTE` de `MortgageCalculator.jsx` (actualizar si cambian precios). **Catálogo completo de variantes** (por si se necesita): en el script.js del cotizador interno de Florencio.
>
> **Nota Infonavit corregida (dato de Florencio verificado con fuentes):** solo **Cofinavit** suma crédito Infonavit al del banco; en **Apoyo Infonavit** el banco es el único que presta y las aportaciones patronales (5%) amortizan capital (termina años antes; SSV queda de garantía).
>
> ⚠️ Lo de abajo es la v1/v2 (histórico) — la lógica vigente es esta v3.

> **🚧 EN PROGRESO sesión 39 (12 jul 2026) — CALCULADORA HIPOTECARIA construida en LOCAL (NO desplegada, en revisión de Florencio):**
>
> **Estado:** componente **`components/MortgageCalculator.jsx`** (+`.module.css`) y página **`app/calculadora-hipotecaria/page.tsx`** (+`calculadora.module.css`) ya construidos y commiteados. ⚠️ **NO está en producción a propósito:** la página tiene **`robots: index:false` TEMPORAL**, NO está en el sitemap ni enlazada en footers — si algún deploy de otra cosa la arrastra, no pasa nada (queda huérfana y no indexable). **Probar en local:** `npm run build` → `cd out && python3 -m http.server 8321` → `http://localhost:8321/calculadora-hipotecaria.html`.
>
> **Lo que ya hace (calibrado con los simuladores reales, carpeta `../Simuladores Bancarios/`):** BBVA Oferta Inigualable Prime jul-2026 = tasa 9.65%, CAT 11.98%, seguros vida 0.60‰ saldo + daños 0.16‰ + comisión $0.30‰, aforo 90%; Scotiabank multiproducto = tasa 10.75%, CAT 12.32%, seguros 0.60‰+0.31‰, comisión apertura 1.25%, financia hasta 95%. **Scotia sale ~6% más caro/mes; su ventaja = enganche 5%** (confirma instinto de Florencio). La fórmula base (amortización francesa) se verificó AL CENTAVO contra la tabla del Excel de BBVA. Config: selector de modelo (precio real de `inventory.json`), enganche 5-50% (default 10), plazo 5/10/15/20, tasa 9.5-12% (default 10.25 = punto medio real), seguros = 0.6‰ crédito + 0.2‰ valor, **gastos iniciales ~8% del valor** (dato REAL de la plaza según Florencio — NO 4-5%; reetiquetado suave "Presupuesta además…"), ingreso sugerido = mensualidad/40%, toggle **"¿Cuentas con crédito Infonavit?"** → nota dorada de Cofinavit/Apoyo Infonavit (convierte la objeción "no tengo enganche" en gancho) + el mensaje de WhatsApp prellenado incluye modelo+enganche+plazo+mensualidad (+Infonavit si aplica). Disclaimers completos ("calibrado con simuladores de la banca 2026", no es oferta, aplican restricciones). Sin nombres de bancos en el sitio (decisión: la comparación BBVA vs Scotia es arma de Florencio en WhatsApp, no de la página).
>
> **💡 INSIGHT CLAVE DE FLORENCIO (pendiente de incorporar — LO MÁS IMPORTANTE):** en sus desarrollos el **valor de AVALÚO es MAYOR que el precio de venta** (ej. real: avalúo $4M, precio de venta $3.2M) y **el banco presta ~90% SOBRE EL AVALÚO** → 90%×$4M = $3.6M > $3.2M → **el cliente compra SIN ENGANCHE**. Así se vende muchísimo en sus desarrollos en Cancún. El `inventory.json` YA TIENE el campo **`valor_avaluo`** por modelo (ej. Capua: precio $1,777,640 vs avalúo $2,330,000 → 90% del avalúo = $2,097,000 > precio = sin enganche). **REDISEÑO PENDIENTE:** la calculadora debe usar `valor_avaluo` → crédito máximo = 90% × avalúo; si cubre el precio → mostrar **"Estrena SIN enganche"** como argumento estrella (deslizador de enganche arrancando en $0/opcional); efectivo necesario = max(0, precio − créditoMax) + gastos (~8%). Esto también responde su preocupación de no espantar leads de Cofinavit/Apoyo Infonavit con "engancheS+gastos" — la realidad de su plaza es MENOS efectivo del que la v1 sugiere.
>
> **Checklist para pasar a producción (cuando Florencio la apruebe tras revisar en local):** (1) incorporar lógica de avalúo/sin enganche; (2) revisar textos con él; (3) quitar `index:false` → `index:true`; (4) agregar `/calculadora-hipotecaria` al `sitemap.ts`; (5) enlace "Calculadora" en los 6 footers (+ ¿navbar?); (6) bloque compacto de la calculadora en las fichas de MODELO (prop `initialModelId` ya soportada); (7) build + deploy + solicitar indexación en Search Console.

> **📋 PLAN PRÓXIMAS SESIONES GRANDES (acordado 12 jul 2026) — en orden:**
>
> **A) CALCULADORA DE MENSUALIDAD (→ EN PROGRESO, ver entrada de arriba):** Florencio pasará los **simuladores de BBVA y Scotiabank** (Excel/capturas) + idealmente un caso real reciente para calibrar. Diseño acordado: (1) calibrar la fórmula contra lo que incluyen los bancos (capital+interés, seguros, comisiones) para que el estimado sea realista; (2) integrada al sitio — se elige el MODELO (precio real del `inventory.json`), enganche/plazo/tasa ajustables (**tasa de referencia con deslizador ~9.5-12%, default ~10.5% — NUNCA "la tasa de [banco] es X%"**, se desactualiza y es riesgo); (3) resultado siempre "**estimado**" + disclaimer estilo del sitio ("valores aproximados, no constituyen oferta de crédito; condiciones según tu perfil y la institución"); (4) CTA "Recibe tu cotización exacta por WhatsApp" con mensaje prellenado (modelo + cálculo) → lead pre-calificado. Razonamiento: la imprecisión juega A FAVOR (la calculadora califica/calienta; el número exacto lo da el asesor). ~1 sesión.
>
> **B) CAPI DE META — Fase 2 (sesión grande #2):** endpoint en Firebase Functions que reenvía eventos a Meta CAPI con `event_id` para deduplicar; después aligerar el Pixel del navegador (~245 KB) → móvil ~85→~95. Prerrequisitos que hace Florencio guiado (20 min): activar plan **Blaze** + generar **token CAPI** en Events Manager. Beneficio: mejor optimización de campañas Meta (el aviso amarillo de Ads Manager "ausencia de Conversions API") + velocidad. NO trae más volumen por sí sola. ~1-2 sesiones + 1 de aligerar Pixel.
>
> **Mientras tanto (Florencio solo):** (1) pedir RESEÑAS a los ~7 clientes de ventas cerradas (mayor palanca de conversión; al llegar a 8-10 se monta sección de testimonios); (2) agregar 2-3 imágenes/carrusel al anuncio de Meta (la otra mitad del aviso amarillo). **Contexto de negocio:** ~7 VENTAS en <2 meses vía el sitio + Ads; leads siguen llegando.

> **✅ CERRADO sesión 39 (12 jul 2026) — Zoom del navegador FB/IG/Messenger RESUELTO DEFINITIVO con compensación AUTOMÁTICA medida (confirmado por Florencio: "está perfecto"):**
>
> La solución final REEMPLAZÓ los porcentajes fijos adivinados (95/92/89/85/80, que "no hacían nada" — ver por qué abajo). **Cómo funciona ahora:** script inline en `layout.tsx` → si el UA es de Meta (`FBAN|FBAV|FB_IAB|Instagram`): (1) **mide la inflación real** comparando el ancho de un texto en el DOM vs el mismo texto medido en `canvas` (el zoom de texto del WebView no afecta al canvas) → `ratio`; (2) baja el font-size raíz a `(100/ratio)%` (arregla todo el texto rem) y (3) fija la variable CSS **`--mz` = 1/ratio**, y TODOS los font-size con `vw` del sitio (25 clamps en 8 archivos CSS) multiplican su término vw por `var(--mz, 1)` → arregla título del hero y encabezados grandes. En navegadores normales `--mz` no existe → fallback 1 → **cero cambio** (verificado: h1 = 35.1px idéntico en Chrome antes/después). ⚠️ Al agregar un font-size con vw NUEVO al sitio, incluirle `* var(--mz, 1)`.
>
> **Diagnóstico que lo destrabó:** modo **`?debugmeta`** (cajita negra al pie con `meta/ratio/probe/htmlFont/UA`) — en el Pixel 9 de Florencio (FB_IAB Android) dio **ratio=1.300** (el WebView infla el texto 30% por el tamaño de fuente del sistema). Con los % fijos "no se veía cambio" porque lo dominante en pantalla (el título del hero) es vw-based y el font-size raíz no lo alcanza. La cajita solo aparece con `?debugmeta` en la URL (mandarse el link por DM y abrirlo dentro de la app para probar).
>
> **También quedó (scoped a `html.meta-inapp`):** `text-size-adjust: none` + anti font-boosting de Android (`max-height: 999999px` en contenedores de texto). **La diferencia de ALTURA restante entre Chrome e IG es NORMAL** (cada navegador come distinta pantalla con su UI y el hero llena el alto visible 100svh) — Florencio conforme, NO perseguirla.
>
> **BONUS de la sesión — fix de caché importante:** las páginas HTML se cacheaban 1 HORA en el navegador del visitante (la regla `**/*.html → no-cache` de firebase.json NO aplicaba porque el sitio usa URLs limpias sin .html). Se agregó regla `source: "**" → no-cache` al inicio de headers (los assets conservan su caché largo por sus reglas específicas, verificado). Ahora cualquier cambio (promos, precios) se ve al instante. Todo commiteado y pusheado.

> **↩️ (Superada por la sesión 39) sesión 38 (11 jul 2026) — Zoom/deformación del WebView de FB/IG COMPENSADO (pendiente desde sesión 33), desplegado y CONFIRMADO por Florencio ("quedó perfecto, casi como en Chrome"):**
>
> Causa (diagnóstico sesión 33): el navegador interno de Meta en iOS aplica el **Dynamic Type** (tamaño de texto del sistema del iPhone) a las webs; Chrome/Safari lo ignoran → el sitio se veía inflado/deforme SOLO en FB/IG. La solución agresiva (viewport `maximum-scale`) sigue vetada (mata pinch-zoom).
>
> **Fix implementado (seguro, scoped):** (1) script inline en el `<head>` de `app/layout.tsx` — detecta UA de Meta (`/FBAN|FBAV|FB_IAB|Instagram/i`); si no es Meta NO hace nada (Chrome/Safari intactos). Si es Meta: agrega clase **`meta-inapp`** al `<html>` + **mide la inflación real** con un probe `font: -apple-system-body` (default iOS = 17px; si sale >17.5 el usuario tiene texto agrandado) y compensa con `html.style.fontSize = (17/medido*100)%`. (2) En `globals.css`: `html.meta-inapp { text-size-adjust: none }` (el html base sigue en `100%`). **El pinch-zoom NO se toca.** Trade-off aceptado: usuarios con texto de sistema agrandado ven el sitio a tamaño normal dentro de FB/IG (pueden hacer zoom con los dedos).
>
> Verificado: UA normal → sin clase ni ajuste; UA Instagram → clase activa; regla compilada en el CSS. Probado por Florencio en su iPhone desde la app → se ve prácticamente igual que Chrome. La tarea pendiente de sesión 33 ("revisitar cuando exista fix seguro") queda CERRADA.
>
> **Ajuste fino (misma sesión):** tras la 1ª prueba Florencio pidió "bajar otro tin" → se agregó una bajada base **`html.meta-inapp { font-size: 92% }`** en `globals.css` (aplica aun con texto de sistema normal; empezó en 95% → 92%) y la fórmula del script pasó a `(17/medido*92)%`. **✅ HECHO (12 jul 2026):** se bajó el tin pedido → **89%** en los 2 lugares (`globals.css` `html.meta-inapp { font-size: 80% }` y `*80` en el script de `layout.tsx`). Desplegado. Si algún día pide otro ajuste: son esos 2 lugares (mantenerlos SIEMPRE con el mismo número) + build + deploy + re-probar desde la app de IG/FB (cerrar y reabrir el navegador interno para saltar caché). Escala usada hasta ahora: 100% → 95% → 92% → 89% → 85% → 80%.

> **✅ COMPLETADO sesión 38 (11 jul 2026, parte 2) — Mejoras visuales del HOME (hero + footer + selector de desarrollos con LOGOS oficiales), todo desplegado:**
>
> 1. **Footer "Navegación": link "Promociones"** (→ `/jardines-del-sur-6/promociones`) agregado bajo "Jardines del Sur 6" en los 5 footers (home, blog índice, blog artículo, FAQ, JdS7). NO es el navbar (eso sigue vetado, sesión 36); es la columna del footer. Bonus: enlaces internos sitio-wide a la página de promos.
> 2. **Hero del home — chips de desarrollos:** la línea plana "Jardines del Sur 6, La Rioja 2 y Lirios Residencial 2." se convirtió en **3 píldoras doradas clicables** (`.devChips`/`.devChip` en `Hero.jsx` + `Hero.module.css`), cada una → su silo (visibilidad + 3 enlaces internos desde el hero). En móvil envuelven en 2 filas centradas (verificado 390px y 320px).
> 3. **"Modelos, precios e informes en minutos" más visible:** `.subtitleDetail` pasó a blanco brillante (0.92) peso 600 + **"en minutos" en dorado** (`.subtitleFast`). **Llevado a los 3 silos** vía campo nuevo **`detailAccent`** en `hero.subtitle` (`dev-content.ts`) + `renderDetail()` en `SiloHero.jsx` (resalta la frase en dorado): JdS6 "en minutos", La Rioja "por WhatsApp", Lirios "Smart Home Ready". Editable: cambiar `detailAccent` por dev.
> 4. **Selector de desarrollos (DevelopmentTabs) = LOGOS OFICIALES:** Florencio pasó los logos originales en `../Logos/` (fuera del repo). Se generaron `public/logos/{jardines-6,la-rioja-2,lirios-2}.png` (sharp: trim + height 160, transparentes) y reemplazaron la fotico redonda + nombre. **ITERACIONES (decisión final de Florencio): SOLO LOGOS, siempre a todo color/brillo** (sin grayscale en inactivas — lo probé y lo rechazó), tamaño 64px desktop / 54px móvil; la activa se distingue por la tarjeta blanca + aro dorado (igual que antes) + logo 1.06x. **Se probaron y DESCARTARON:** logos atenuados en inactivas, nombre debajo (redundante — el logo ya trae el nombre), producto debajo ("CASAS Y DEPARTAMENTOS" se rompía feo en 2 líneas en cell), nombre+producto (redundante).
>
> **⏳ MEJORA PENDIENTE (pedida por Florencio al cerrar la sesión):** a él SÍ le gustó estéticamente la variante de **producto debajo del logo** ("Casas y departamentos" / "Casas de lujo" / "Departamentos") — se quitó solo porque en CELL la etiqueta larga de JdS6 se rompía feo en 2 líneas. **Retomarla y HACERLA MEJOR**: resolver el caso móvil de "CASAS Y DEPARTAMENTOS" (opciones evaluadas: texto más corto solo para JdS6, tipografía adaptativa, o layout que haga el salto de línea verse intencional/balanceado en las 3 tarjetas). ⚠️ Restricción conocida: a Florencio NO le gusta la abreviatura "Deptos" (rechazada en sesión 35 para el title SEO) — buscar una salida que no abrevie feo. El código de la variante vive en el historial de git (commits del 11 jul, spans `.devCardSub`/`.devCardTag` en DevelopmentTabs). El `alt` del `<img>` conserva el nombre (a11y/SEO). Las fotos viejas `/optimized/dev-tabs/*.webp` quedaron sin uso (no borradas).
>
> **Verificación visual:** headless Chrome de Mac tiene un defecto (ancho mínimo ~500px → capturas móviles recortadas; también las capturas tras salto a ancla salen en blanco). Solución que funciona: **`puppeteer-core` instalado `--no-save`** (usa el Chrome del sistema) con `setViewport` + `scrollIntoView` + `screenshot` de elemento; alternativa rápida para arriba del fold: harness HTML con iframes de 390/320px. Todo se verificó visualmente en desktop y móvil antes de cada deploy.
>
> **⚠️ TODO el trabajo del 11 jul (blog + footer + hero + logos) está SIN commit/push** — Florencio quedó de dar luz verde. Los logos fuente viven en `Git_Web Jardines/Logos/` (fuera del repo git).

> **✅ COMPLETADO sesión 38 (11 jul 2026) — Blog: corregido el artículo viejo de Infonavit (Modelo T100) + 2 artículos nuevos (crédito bancario y plusvalía Zona Sur), desplegado:**
>
> Florencio pidió "borrar el blog viejo de Infonavit (modelo T1000/1080) porque está desactualizado, dejar solo el actualizado, e investigar/lanzar otro tema". **Al abrir el archivo se detectó (y se le señaló) que el artículo "viejo" NO es un artículo del modelo T1000:** es la guía general **`comprar-casa-con-infonavit-en-cancun-2026`** que apunta al keyword transaccional fuerte *"comprar casa con infonavit en cancún"*; su ÚNICO problema era **una línea** ("al menos 1080 puntos"). Borrarlo = perder ese keyword + 404 en URL ya indexada. **Decisión de Florencio (recomendación aceptada): NO borrar, arreglar la línea** + escribir **AMBOS** temas nuevos.
>
> **Lo hecho en `app/blog/_lib/posts.ts`:** (1) **Arreglado el artículo viejo de Infonavit** — se reescribió el bullet "1080 puntos" para reflejar el **Modelo T100** ("precalificas / no precalificas", ya no hay puntaje; menciona los 1,080 pts solo como referencia histórica), se ajustaron 2 frases cercanas que asumían el esquema de puntos, y se agregó un **enlace interno** (cta) al artículo `cambios-infonavit-precalificacion-mci-2026` (T100) → coherencia + freshness + interlinking. (2) **Artículo NUEVO "crédito bancario"** slug `comprar-casa-con-credito-bancario-en-cancun-2026` (lidera con bancario [[feedback_credito_bancario_primero]]; llena el hueco: no había NADA de bancario; es el esquema de La Rioja 2 premium; datos 2026: tasas fijas ~9.5-12% e "incluso por debajo de 9.5% según perfil/enganche/banco" como valores APROXIMADOS — ajuste pedido por Florencio; enganche 10-20%, mensualidad ≤30% ingreso, cofinanciamiento; se aclaró también a petición suya que el crédito bancario aplica en LOS TRES desarrollos, no solo La Rioja; portada `/larioja2-alberca.webp`; CTAs a /la-rioja-2 + /whatsapp + cross-link al de Infonavit). (3) **Artículo NUEVO "plusvalía Zona Sur"** slug `plusvalia-zona-sur-cancun-poligono-sur-2026` (Zona Sur zona de mayor proyección; Tren Maya + aeropuerto 10 min + Av. Huayacán; cifras del sector como ESTIMACIONES con disclaimer "no garantizada"; portada `/larioja2/vista-aerea.webp`; CTAs a /jardines-del-sur-6 + /la-rioja-2 + /whatsapp).
>
> **⚠️ Corrección post-pull (misma sesión):** esta sesión se trabajó SIN hacer `git pull` primero (los cambios de la sesión 37 —favicon círculo "Altta", promo del Mundial quitada, botones en tarjetas de promos y la regla **"Zona Sur, NO Polígono Sur"** [[feedback_zona_sur_no_poligono]]— no estaban en local, y el deploy de los artículos los pisó temporalmente en producción). Se corrigió: `git pull` + merge (los 2 artículos nuevos se alinearon a la regla quitándoles TODOS los "Polígono Sur" → "Zona Sur", con gramática femenina) + rebuild + redeploy con TODO junto. ⚠️ El **slug** del artículo de plusvalía conserva `poligono-sur` en la URL (ya se había solicitado indexación; cambiarlo = 404 — pendiente decisión de Florencio si quiere renombrarlo con redirect). **Lección: SIEMPRE `git pull` al iniciar sesión (Florencio trabaja también desde otra máquina/sesión).**
>
> **Reglas aplicadas:** crédito bancario antes que Infonavit, FOVISSSTE solo JdS6, "asesor autorizado de Altta Homes", disclaimers en temas financieros, sin "plusvalía garantizada" ni cifras como promesa, Zona Sur (no Polígono Sur). El **sitemap** genera las URLs nuevas solo (`getAllPosts()`). **Pendiente Florencio:** solicitar indexación de las 2 URLs nuevas en Search Console (URLs: `/blog/comprar-casa-con-credito-bancario-en-cancun-2026` y `/blog/plusvalia-zona-sur-cancun-poligono-sur-2026`). **Recordatorio Ads:** ~12 jul re-pasar el informe de anuncio para comparar contra la línea base (CPA $92.11) del WhatsApp Click.

> **🔧 MANTENIMIENTO sesión 37 (3 jul 2026) — Quitada la promo "Si gana México, ganas tú" de JdS6** (México quedó eliminado del Mundial). Se borró ese item de `promos.items` en `dev-content.ts`. Quedan 3: La Portería de JDS, Modelo Capua, Modelo Noni. Deploy + verificado en vivo.

> **✅ COMPLETADO sesión 37 (3 jul 2026) — Logo de Google Ads actualizado al nuevo círculo "Altta" (mismo del favicon):** Se aclaró que **Google Ads NO usa el favicon** — el logo de anuncios es un recurso aparte ("Logotipo de la empresa" en Recursos/Assets). **Confirmado en la cuenta: la verificación de anunciante está COMPLETA** ("Advertiser identity verified" — HURTADO CASTAÑEDA FLORENCIO LEONARDO, MX) → por eso los logos SÍ se muestran (el viejo ya tenía 607 impresiones). ⚠️ NUNCA tocar "Restablecer verificación" (borra la verificación). Se generó **`logo-google-ads.png`** (1200×1200, círculo del favicon recortado borde-a-borde con esquinas transparentes; Google lo muestra en círculo). Florencio lo subió como logo nuevo (nivel Cuenta) y **quitó el viejo** (el óvalo "Altta Homes Cancún"). El nuevo entra a revisión 1-3 días → "Apto"; como quitó el viejo antes, puede haber un hueco corto sin logo mientras revisan (normal). **Recordatorios sobre el logo en Ads:** solo se muestra en **móvil**, en anuncios de posiciones altas, y NO en todas las impresiones; para verlo sin gastar usar **Herramientas → Vista previa y diagnóstico de anuncios** (dispositivo Móvil). El archivo `logo-google-ads.png` quedó en la raíz (temporal, no commiteado).

> **✅ COMPLETADO sesión 37 (3 jul 2026) — Favicon FINAL = círculo "Altta" limpio (diseñado por Florencio), desplegado:** Tras iterar (óvalo+CANCÚN → se probó recorte del óvalo, rechazado "feo" → se investigó la marca oficial: es navy + "Altta" blanco + techo dorado, el competidor amontona todo = ilegible), **Florencio diseñó él mismo** el favicon definitivo: `Favicon Altta.png` (1254×1254) — círculo navy, aro dorado, techo dorado, **"Altta" blanco grande y legible**. Quedó premium y alineado con la marca oficial. ⚠️ **La fuente venía con esquinas NEGRAS opacas** → se recortó a **círculo transparente** (máscara circular radio ~599/627 = borde del aro, blend `dest-in`) antes de generar, si no se vería como cuadro negro en la pestaña. Regenerados `app/icon.png` (1024 transparente), `app/apple-icon.png` (180 aplanado navy rgb(0,18,46)) y `app/favicon.ico` (16/32/48 RGBA). Build + deploy; verificado 200 en vivo. Detalle y GOTCHAs en [[favicon_altta_redondo]]. **Bump previo:** también se subió `icon.png` a 1024 (Florencio preguntó por agrandar el favicon → se aclaró que el tamaño mostrado lo fija el navegador/Google, no el archivo; solo mejora nitidez). La carpeta temporal `favicon-propuestas/` (previews V1/V2 que generé) se borró al elegir el suyo.

> **↩️ (Reemplazada) sesión 37 — Favicon logo REDONDO óvalo+CANCÚN (círculo completo):** Florencio quiso cambiar el favicon de la versión cuadrada (monograma "AH") a su logo **redondo** de marca. **Fuente = archivo propio de Florencio `altta_homes_cancun_logo_circular_google_ads.png`** (1024×1024, círculo azul marino con óvalo dorado "Altta HOMES" + cinta "CANCÚN", fondo transparente). Regenerados los 3 archivos que Next detecta solo: `app/icon.png` (512, círculo completo, transparente), `app/apple-icon.png` (180, círculo completo **aplanado sobre navy** #062348 muestreado del propio círculo — iOS no maneja bien esquinas transparentes), `app/favicon.ico` (16/32/48).
> - ⚠️ **Decisión sobre el favicon.ico:** primero se hizo la "opción B" = recorte cerrado al óvalo (sin la cinta CANCÚN) para que se leyera mejor a 16px. **Florencio la rechazó ("se ve muy feo") → se usó el CÍRCULO COMPLETO también en el favicon** (igual que icon.png, todos los tamaños). NO volver a recortar el óvalo. A 16px el texto se difumina (inevitable en logo detallado) pero se reconoce como círculo navy+dorado.
> - **Cómo se generó (no hay librería .ico instalada):** script con `sharp` (dep transitiva de Next, no está en package.json) + **empaquetado ICO a mano** (header ICONDIR + ICONDIRENTRY + PNGs). ⚠️ **GOTCHA que sigue vigente:** los PNG dentro del .ico deben ser **RGBA** o el build de Next 16/Turbopack falla ("PNG is not in RGBA format") → usar `.ensureAlpha()` (la imagen fuente sí tiene alfa, pero igual se fuerza). Build limpio + `firebase deploy`; verificado en vivo HTTP 200 en `/favicon.ico`, `/icon.png`, `/apple-icon.png`. Recordar: el navegador cachea fuerte el favicon (Cmd/Ctrl+Shift+R o incógnito para verlo). Detalle en [[favicon_altta_redondo]].

> **✅ COMPLETADO sesión 37 (3 jul 2026) — "Polígono Sur" ELIMINADO de todo el sitio → ahora es "Zona Sur" (desplegado):** Florencio pidió que **NO exista ni un solo "Polígono Sur"** en la web; todo debe decir **"Zona Sur"** (posicionamiento premium). Reemplazadas **~30 apariciones en 10 archivos del sitio**: `app/layout.tsx` (description + se borró el keyword duplicado "Polígono Sur Cancún" porque ya existía "Zona Sur Cancún"), `app/page.tsx` (2 nombres de Place en JSON-LD), `app/preguntas-frecuentes/page.tsx` (×2), `app/blog/_lib/posts.ts` (×5), `app/blog/page.tsx` (×2), `app/(desarrollos)/_lib/dev-content.ts` (×7: JdS6 metaDescription/heroSubtitle/eyebrow.strong/intro.eyebrow/intro párrafo/highlight + Lirios metaDescription), `app/(desarrollos)/_lib/ModelPage.tsx` (eyebrowSub), `app/(desarrollos)/_lib/PromosPage.tsx` (footer), `app/(desarrollos)/jardines-del-sur-7/page.tsx` (×6), `components/AmenitiesSection.jsx` (×1). **Cuidados:** (a) **gramática** — "el/del Polígono Sur" → "**la/de la** Zona Sur" (Zona es femenino); (b) donde ya decía "Zona Sur de Cancún **(Polígono Sur)**" se **quitó el paréntesis** (no duplicar). Build limpio + deploy; verificado en vivo 0 apariciones en home/silos/promos/JdS7/blog/FAQ. **La Rioja no tenía "Polígono Sur" (ya estaba limpio).**
> - ⚠️ **SEO:** esto **revierte** la decisión previa documentada en `plan-seo-altta-homes.md` ("Zona Sur en título + Polígono Sur en descripción como keyword"). Se pierde la señal del término "polígono sur" en búsqueda, pero es decisión de Florencio (branding premium). **Regla nueva → ver [[feedback_zona_sur_no_poligono]].**
> - **Fuera de alcance (NO tocado, son notas internas / no es la web):** `google-ads.md`, `anuncio-perfecto.md`, `plan-seo-altta-homes.md`, `context.md`, y los prompts del bot de WhatsApp `meta-ai-prompt-whatsapp*.txt` (estos SÍ son de cara al cliente vía WhatsApp — el bot dice "3 desarrollos en el Polígono Sur"). **Pendiente confirmar con Florencio si quiere limpiar también los prompts del bot y los textos de Google Ads.**

> **✅ COMPLETADO sesión 37 (3 jul 2026) — reacomodo estético de los botones de las tarjetas de Promociones (JdS6), desplegado:** Florencio pidió dos ajustes; ambos hechos:
> 1. **Botones APILADOS (uno encima del otro), NO lado a lado** → `.promoActions` pasó a `flex-direction: column` en todos los tamaños; `.promoActionBtn` de `flex:1` a `width:100%`. Se quitaron las reglas de apilado del `@media ≤700px` (ya redundantes). Mismo estilo de botón: `btn btn-secondary` (outline, "Ver el modelo/Ver modelos y precios") arriba + `btn btn-primary` (dorado, "Cotizar ahora/Contacta con un asesor") abajo.
> 2. **Botones ARRIBA de la vigencia y de "Aplican restricciones"** → en `PromosPage.tsx` el orden quedó: beneficios → **`.promoActions`** → `.promoVigencia` → `.promoRestric`. El **separador punteado + `margin-top:auto`** (anclaje del cluster al fondo de la tarjeta) se movieron de `.promoVigencia` a `.promoActions` (ahora la línea punteada va arriba de los botones; los botones+vigencia+restric quedan pegados al fondo, alineados entre las 4 tarjetas). `.promoVigencia` quedó con `margin-top:1rem`, sin borde. Build limpio + `firebase deploy`; verificado en vivo (orden botones<vigencia<restricciones).

> **↩️ DESCARTADO/REVERTIDO sesión 36 (2 jul 2026) — botón "Promociones" en el navbar (NO va):**
>
> En un momento se agregó un botón "Promociones" en la barra de navegación (header + drawer móvil, gate `PROMO_SLUGS`). **Fue un malentendido:** lo que Florencio realmente quería era que **los botones de las tarjetas de promo tuvieran el mismo diseño que los botones de las tarjetas de modelo** (ver entrada de CTAs abajo), NO un botón en el navbar. Florencio confirmó explícitamente: **quítalo**. Se revirtió por completo → `SiteHeader.jsx` y `SiteHeader.module.css` quedaron **idénticos** al commit (git diff vacío). **Lección: no volver a proponer/agregar un botón "Promociones" al navbar.** El acceso a promos vive en el teaser/banner del silo (sesión 35) y en los botones de las tarjetas.

> **✅ COMPLETADO sesión 36 (2 jul 2026) — CTAs en las tarjetas de la página de Promociones (JdS6) para subir conversión (desplegado):**
>
> Idea de Florencio: las 4 tarjetas de promo eran un **callejón sin salida** (mostraban la promo pero sin ningún botón → el interesado tenía que bajar hasta el CTA del pie). Propuso ponerle acción a cada tarjeta, **diferenciada según el tipo** — buena jugada de conversión. Implementado con **2 botones por tarjeta**:
> - **Tarjetas genéricas** ("La Portería de JDS", "Si gana México, ganas tú"): **[Ver modelos y precios]** (outline, → silo `/jardines-del-sur-6`) + **[Contacta con un asesor]** (WhatsApp, dorado, mensaje prellenado con el nombre de la promo).
> - **Tarjetas de modelo** (Capua, Noni): **[Ver el modelo]** (outline, → ficha directa) + **[Cotizar ahora]** (WhatsApp, dorado, mensaje prellenado con el modelo + su beneficio). El dorado (WhatsApp) va a la derecha porque es la conversión real.
>
> **⚠️ Diseño de los botones = IDÉNTICO al de las tarjetas de modelo (`PropertyCard.jsx` → "Visita Virtual" + "Cotizar ahora"):** Florencio pidió expresamente que fueran iguales. Primero se pusieron con estilos custom tipo píldora (`.promoBtn`/`.promoBtnSecondary`, border-radius 999px) → **estaban mal, no coincidían**. Se corrigieron para usar las **clases globales del sitio** `btn btn-secondary` (outline navy) + `btn btn-primary` (dorado) + `.promoActionBtn` (equivalente a `.actionBtn` de PropertyCard: `flex:1`, `font-size .85rem`, `padding .75rem .5rem`), y `.promoActions` = `display:flex; gap:.5rem` (lado a lado en desktop, apilados en móvil ≤700px) — replica exacta de `.cardActions`. Orden: outline izquierda, dorado derecha (como en las tarjetas de modelo). El `.btn` global es rectángulo redondeado (radius `0.7rem`), NO píldora.
>
> **Arquitectura (reutilizable):** se agregó campo opcional **`modeloSlug?: string`** al tipo `promos.items` en `dev-content.ts`; cuando una promo lo trae → la tarjeta pasa a "modo modelo" (botones Ver el modelo/Cotizar enlazan a `/[silo]/[modeloSlug]`); si no → "modo genérico" (Ver modelos/Contacta → silo). Slugs reales verificados en `data/inventory.json`: **`departamento-capua`** y **`casa-noni`** (Capua es "Departamento Capua", Noni es "Casa Noni"). En `PromosPage.tsx` el `map` calcula `isModel`, `cardMsg` y `cardWaHref` por tarjeta (mensajes WhatsApp prellenados por promo/modelo, coherente con [[project_whatsapp_prefilled_messages]]). Build limpio + `firebase deploy`; verificado en vivo en `alttahomescancun.mx/jardines-del-sur-6/promociones` (2 model cards con href correcto + 2 genéricas al silo). **Mantenimiento:** al agregar una promo de modelo nueva, incluir su `modeloSlug` para que salgan los botones directos a ficha.
>
> **Nota (patrón ya existente):** teléfono en la página = `529982059044`; la página además ya tenía heroCta + ctaBox al pie (no se tocaron). El diseño "a prueba de vacío" (evergreen + noPromos) sigue intacto.

> **✅ COMPLETADO sesión 35 (2 jul 2026) — Títulos SEO de los 3 silos: limpios, coherentes y sin abreviatura (desplegado):**
>
> Florencio quiso posicionar mejor el silo de **Jardines del Sur 6** y notó que el título se veía "mal escrito" — en realidad el problema era la **abreviatura "Deptos"** del título (la descripción estaba bien, sin errores; se le aclaró). Pidió un esquema **coherente** para los 3 silos con el patrón **`[Desarrollo] | [Producto] en Cancún`** (palabra completa, mayúscula correcta, "en Cancún" al final).
>
> **Decisión "Opción A" (limpia, sin precio) vs "B" (con gancho de precio):** se eligió **A**. Razón (recomendación honesta): el objetivo AHORA es **posicionar/rankear** (el dominio sigue en el bache de re-indexación post-migración), y tener **"Cancún" literal** en el título ayuda a la relevancia para "jardines del sur 6 cancún"; el gancho de precio ("desde $X.XXM") sirve para CTR **cuando ya rankeas**, no en esta fase. El precio se sigue viendo en tarjetas/ficha.
>
> **Títulos nuevos (en producción):**
> - JdS6: **`Jardines del Sur 6 | Casas y Departamentos en Cancún`**
> - La Rioja 2: **`La Rioja 2 | Casas de Lujo en Cancún`**
> - Lirios 2: **`Lirios Residencial 2 | Departamentos en Cancún`**
>
> **⚠️ Decisión de branding (honesta):** Florencio sugirió "Departamentos **de lujo**" para Lirios; se recomendó **NO** ponerle "de lujo" → **La Rioja es el premium real** ($4M, sin Infonavit); si Lirios (accesible, con Infonavit) también dice "lujo", se diluye la distinción. Lirios queda como "Departamentos" (accesible) y La Rioja brilla como el de lujo.
>
> **Ajuste "Premium" → "de Lujo" (mismo día):** el título de La Rioja se puso primero como "Casas Premium" (por consistencia con el nombre del grupo de Ads "La Rioja 2 - Premium"), pero se **cambió a "Casas de Lujo"**. Razón honesta (Claude rectificó su propia recomendación): **"casas de lujo en cancún" es una búsqueda REAL** con volumen en México, mientras "casas premium" casi nadie lo teclea (es adjetivo de marketing, no keyword). Como el objetivo es **posicionar**, gana el término que la gente busca. El nombre del grupo de Ads es interno (el usuario no lo ve) → pesa menos que el keyword. La Rioja SÍ es de lujo ($4M, sin Infonavit) → preciso, no exagera.
>
> **Implementación:** `app/(desarrollos)/_lib/dev-content.ts` (3 × `seoTitleLead`) + `app/(desarrollos)/_lib/dev-meta.ts` — se **quitó la lógica de precio dinámico del título de silo** (antes: `${seoTitleLead} desde ${formatPriceShort(minPrice)}` → ahora: `title = dev.seoTitleLead`) + se eliminaron los imports sin uso (`getMinPriceByDev`, `formatPriceShort`). La meta-descripción de JdS6 NO se tocó (estaba correcta). Los títulos de las páginas de MODELO (buildModelMetadata) SÍ conservan el precio ("Desde $X"), no se tocaron. Build limpio + `firebase deploy`; verificados los 3 `<title>` en producción. **Pendiente Florencio:** solicitar indexación de los 3 silos en Search Console para acelerar que Google muestre los títulos nuevos.

> **✅ COMPLETADO sesión 35 (2 jul 2026) — Página de PROMOCIONES para Jardines del Sur 6 (feature nueva) + corrección dato aeropuerto:**
>
> Florencio quiso capturar la búsqueda "jardines del sur 6 promociones" (alta intención) y aparecer 1º. Se evaluó sección-en-silo vs página dedicada; **decisión: HÍBRIDO** = página dedicada **`/jardines-del-sur-6/promociones`** (apunta al keyword exacto: URL + title + H1) **+ teaser/enlace desde el silo** (banner dorado + link en el nav → le pasa autoridad interna y la gente la encuentra). Es la mejor jugada para el keyword exacto sin dividir del todo la autoridad. **Diseño a prueba de "vacío":** siempre muestra beneficios permanentes + CTA aunque no haya promo del mes → nunca queda thin (evita el castigo de página delgada).
>
> **Solo para JdS6** (decisión de Florencio: es el que más se mueve; menos mantenimiento). La estructura quedó **reutilizable** para La Rioja 2 / Lirios si algún día se quiere (solo agregar `promos` al dev + crear su ruta).
>
> **Arquitectura (archivos):** (1) tipo `promos` agregado a `DevContent` en `dev-content.ts` + datos reales de JdS6 (editable por Florencio cada mes: título, beneficios, vigencia). (2) Componente reutilizable `app/(desarrollos)/_lib/PromosPage.tsx` (recibe `slug`, lee `DEVS[slug].promos`). (3) CSS `app/(desarrollos)/promos.module.css` (paleta del sitio; hero con imagen `dev.hero.slides[0]` + overlay navy, texto blanco con sombra, **centrado en móvil** — se corrigió que solo el hero estaba centrado → ahora TODO el contenido se centra en móvil incl. tarjetas/beneficios/vigencia). (4) Ruta `app/(desarrollos)/jardines-del-sur-6/promociones/page.tsx` con su `generateMetadata` (title "Promociones en Jardines del Sur 6, Cancún | Altta Homes"). (5) Teaser en `SiloPage.tsx` (condicional `dev.promos`, banner + link en anchorNav). (6) `sitemap.ts` genera `/[slug]/promociones` para devs con `promos` (priority 0.8).
>
> **Promos reales cargadas (JdS6, julio 2026):** "La Portería de JDS" (Zona 1 minisplit / Zona 2 $5k / Zona 3 $8k / Zona 4 $10k dto., vig. 15 jul), "Si gana México, ganas tú" (minisplit 12k BTU, vig. 48 h tras el partido), Capua (2 minisplits, vig. 31 jul), Noni (2 minisplits, vig. 31 jul). Nota: minisplits NO incluyen instalación. **Refinamientos pedidos por Florencio:** todas las tarjetas muestran "Jardines del Sur 6" (título en las 2 generales, subtítulo en Capua/Noni) para reforzar el keyword; "Aplican restricciones" por tarjeta (como PropertyCard); toque creativo ⚽ en La Portería; sección "Beneficios de comprar" reordenada (1º "Mejor precio y equipamiento de zona", 2º crédito, 3º 360°). **Promos de La Rioja 2 para el futuro (NO implementadas):** Noni Elite (dto. $50k + minisplits), Noni Rioja (precio promoción), ambas vig. 31 jul.
>
> **⚠️ Corrección de dato:** el aeropuerto está a **10 min, NO a 5 min** (dato de Florencio). Corregido "5 min del aeropuerto" → "10 min" en las **3 metaDescriptions** de silos (`dev-content.ts`: JdS6, La Rioja 2, Lirios) para que sea consistente con la página de promociones. Desplegado.
>
> **Pendiente Florencio:** solicitar indexación de `/jardines-del-sur-6/promociones` en Search Console. **Mantenimiento:** cada mes editar el bloque `promos` en `dev-content.ts` (borrar vencidas, agregar nuevas, actualizar `updatedLabel`) + redeploy.

> **✅ COMPLETADO sesión 34 (1 jul 2026) — Google Analytics 4 (GA4) instalado vía GTM, verificado en Tiempo real (SIN tocar código, SIN deploy):**
>
> Florencio quiso empezar a usar GA4 para entender su tráfico (de dónde vienen las visitas, qué desarrollo interesa más) — es **complemento, NO reemplazo** de la conversión de Ads. Se instaló **por GTM** (el sitio ya tiene el contenedor `GTM-53BHDRWC` cargado con `lazyOnload`), así que **no se tocó código ni se desplegó nada**.
>
> **Lo hecho:** (1) creada propiedad GA4 **"Altta Homes Cancún - Sitio Web"**, **ID de medición `G-256GQG9139`**, flujo web `https://alttahomescancun.mx`, zona horaria Cancún, moneda MXN, sector "Mercado inmobiliario", objetivos "Generar oportunidades de venta" + "Conocer el tráfico web", Medición mejorada ON. (2) En GTM: etiqueta **"GA4 - Configuración"** tipo *Etiqueta de Google* con ID `G-256GQG9139`, activador **Initialization - All Pages**; publicada versión **v5 - GA4 Analytics**. (3) Verificado en **Informes → Tiempo real**: 1 usuario activo, página "Altta Homes Cancún | Casas y…", eventos `first_visit`/`page_view`/`session_start` disparando. ✅
>
> ⚠️ **Detalle a recordar (cosmético, NO urgente):** la propiedad GA4 quedó creada bajo la cuenta de Analytics **"ytegnof-academy"** (cuenta de otro proyecto de Florencio que dice NO usar; ID `378309827`), no bajo una cuenta propia limpia. **Funciona igual** (la medición no depende del nombre de la cuenta). Si algún día se quiere ordenar 100%: crear una cuenta GA nueva y **MOVER** la propiedad (Administrar → Propiedad → Mover propiedad) — **NUNCA borrar/recrear** (perdería el ID `G-256GQG9139` + el histórico, y habría que rehacer toda la etiqueta de GTM). Florencio estuvo tentado a borrar/recrear; se le frenó a tiempo.
>
> **✅ También en sesión 34 (limpieza GTM, sin código):** (1) **GTM renombrado** — cuenta `Jardindes del Sur Cancun` → **`Altta Homes Cancun`**; contenedor `jardinesdelsurcancun.mx` → **`alttahomescancun.mx`** (el ID `GTM-53BHDRWC` NO cambia → no se rompe nada, no requiere deploy). (2) Agregada etiqueta **"Vinculación de conversiones" (Conversion Linker)**, activador All Pages, publicada **v6 - Vinculación de conversiones** → mejora cómo Google Ads mide las conversiones (WhatsApp Click); con esto la **Calidad de Contenedor de GTM pasó de "Urgente" (rojo) a "Bueno" (azul)**. (3) "Dominios monitorizados" del diagnóstico limpiados: "Mis dominios" quedó solo con `alttahomescancun.mx` (el viejo `jardinesdelsurcancun.mx` bajó a auto-detectados).
>
> **⏳ Pendientes opcionales GA4/GTM:** (a) **Vincular GA4 ↔ Google Ads** (Analytics → Administrar → Vinculaciones con Google Ads) para ver qué hace la gente tras el clic del anuncio — el que más provecho saca; (a2) **Vincular GA4 ↔ Search Console** (acordado 13 jul 2026, hacer junto con (a)): misma pantalla de Vinculaciones → elegir la propiedad de dominio `alttahomescancun.mx` + flujo web; ⚠️ después PUBLICAR los reportes en GA4 → Informes → **Biblioteca** → colección "Search Console" → Publicar (paso que casi todos olvidan; sin él los reportes quedan ocultos). Aporta: consultas orgánicas + páginas de destino cruzadas con comportamiento/conversión = termómetro de la recuperación SEO post-migración. Solo lectura, no afecta nada, datos aparecen en ~24-48 h; (b) mover la propiedad GA4 a una cuenta propia (**MOVER, no borrar**); (c) **añadir un 2º administrador** a la cuenta GTM (único aviso de diagnóstico que quedó — es solo "info", buena práctica de respaldo por si se pierde acceso, ej. agregar `fyhwin2022@gmail.com`); (d) **NO** mover la optimización de Ads a GA4 — la campaña sigue optimizando con la conversión de WhatsApp Click. GA4 acumula histórico **desde hoy (1 jul 2026)**, no antes → no revisar reportes hasta ~1 semana.

> **✅ COMPLETADO sesión 33 (29 jun 2026) — Pulido WebView FB/IG: lightbox de galería a `dvh` (desplegado). Pendiente diagnosticar el "se ve medio raro" con captura:**
>
> Florencio pasó la explicación de Meta AI sobre por qué se rompen los sitios en el WebView de FB/IG/WhatsApp y pidió investigar qué aplica al sitio (hay campaña de Meta que manda ~25 visitas/día al sitio vía WebView → importa). **Hallazgo clave: la mayoría del consejo de Meta AI NO aplica o YA estaba resuelto.** Verificado en código: NO hay `<video>` de fondo (el hero es `<picture>`, no aplica autoplay/playsinline); el hero YA usa `svh` (`100svh`/`92svh`, la mejor unidad para in-app — fix de sesión 21 jun); NO se usa `window.open` (todo es `<a target=_blank>`, sí funciona en WebView); YA se usa `wa.me` (no `api.whatsapp.com`); NO hay `input type=date`; NO se usa Swiper (galería propia con lightbox); el reset de margin con `!important` que sugería Meta AI es FALSO (Meta no inyecta margin al body, su CSS estaba mal escrito) → NO se hizo. Los overlays de lightbox de Amenidades y modelo YA usaban `position:fixed; inset:0` (patrón ideal).
>
> **Lo único que SÍ se ajustó (riesgo cero):** las alturas de los contenedores de imagen del lightbox de galería que aún usaban `vh` viejo → se les agregó `dvh` con `vh` de respaldo primero (`height: 80vh; height: 80dvh;`). Archivos: `PropertyCard.module.css` (.lightboxOverlay 100vh→+100dvh), `AmenitiesSection.module.css` (.lbContent 80vh + móvil 75vh), `model.module.css` (.lbContent 85vh + móvil 80vh). Razón: en WebView, `100vh` cuenta el área tras la barra inferior → el botón ✕ o el borde de la foto podían quedar tapados. `dvh` se ajusta al área visible; en navegador normal `dvh≈vh` (idéntico) → NO cambia nada de lo actual. Build limpio + deploy. **NO se hizo** detección por User-Agent (`FBAN/FBAV`) ni clase `.meta-browser` ni links `intent://` (frágiles/innecesarios).
>
> **🔎 DIAGNÓSTICO del "se ve raro" (resuelto como NO accionable hoy):** Florencio pasó capturas del WebView de **Instagram en iPhone** → el sitio se ve **"aumentado/zoom" y deforme**. **CLAVE: en Chrome móvil se ve PERFECTO; solo el navegador interno de Meta lo agranda** → NO es bug del código (si lo fuera, se vería mal en todos lados). Verificado en código que las causas típicas YA están cubiertas: viewport correcto (`width=device-width, initial-scale=1`, confirmado en HTML de prod), `text-size-adjust: 100%` en `html`, hero con `overflow:hidden` (no desborda), header `fixed` (no sticky), sin `100vw` en elementos siempre-visibles (solo en lightbox). Investigación web: es **limitación documentada del in-app browser de Meta**; causa más probable = el WebView de Meta **respeta el Dynamic Type / tamaño de texto del sistema iOS e infla el texto**, mientras Chrome iOS lo ignora (→ revisar Tamaño de texto del iPhone de prueba). **NO hay fix 100% seguro:** las soluciones agresivas (`maximum-scale=1`/`user-scalable=no`) **bloquean el pinch-zoom** = inaceptable para el público (compradores/gente mayor que sí lo usa).
>
> **✅ DECISIÓN de Florencio: DEJARLO ASÍ.** El sitio es 100% FUNCIONAL en el WebView de Meta (botones, WhatsApp, info legibles); "un poco más grande" ≠ roto, y la mayoría de clientes con texto normal lo ve bien. NO vale el costo de accesibilidad. **TAREA PENDIENTE APUNTADA:** revisitar el zoom del WebView de Meta SOLO cuando exista un fix seguro que no sacrifique el pinch-zoom. **NO se cambió nada de código por esto.**
>
> **✅ CERRADO sin acción — botón flotante de WhatsApp:** Claude sugirió reacomodar el flotante verde + píldora "Informes por WhatsApp" porque en la captura parecía tapar "Hablar con un asesor". **Florencio lo revisó y decidió que se ve BIEN tal como está → NO se toca.** No es pendiente. (Queda registrado para no volver a proponerlo.)

> **✅ COMPLETADO sesión 32 (29 jun 2026) — "Cancún" agregado al logo del header (cinta apilada estilo marca, desplegado):**
>
> Florencio quería reforzar la marca completa "Altta Homes Cancún" en el logo de arriba a la izquierda del sitio (el wordmark del header, NO el title de Google). **Se le agregó "CANCÚN" como cinta apilada DEBAJO de "Altta Homes"**: chico, dorado, mayúsculas con letter-spacing — imita la cinta dorada "CANCÚN" del logo de marca (el óvalo). Eligió este estilo (apilado) sobre las alternativas "en línea pequeño" y "en línea con punto" porque suma marca SIN apretar el header en móvil (crece en alto, no en ancho).
>
> **Implementación** (`components/SiteHeader.jsx` + `SiteHeader.module.css`): el `<a className=logo>` ahora envuelve el wordmark en `.logoWordmark` (la fila "Altta"+"Homes" con su baseline/gap original) y debajo un `<span className=logoCity>Cancún</span>`. `.logo` pasó de fila baseline a **columna** (`flex-direction: column`); las props de tamaño/peso del wordmark se movieron a `.logoWordmark`. `.logoCity` = `font-size 0.6rem`, `letter-spacing 0.34em`, uppercase, `text-indent 0.34em`+`text-align center` para centrar bajo "Altta Homes". Color sobre hero oscuro (no-scrolled) = `--accent-2` con text-shadow, igual que `.logoAccent`. `aria-label` del logo actualizado a "Altta Homes Cancún". Build limpio + `firebase deploy`.
>
> **DECISIÓN SOBRE EL TITLE DE GOOGLE (no se tocó):** Florencio preguntó si cambiar el title `Altta Homes Cancún | Casas y Departamentos en Venta` a "...en Cancún" o "...Cancún Sur". **Se recomendó DEJARLO en "en Venta" y NO se cambió.** Razón: "en Cancún" repetiría "Cancún" (ya está al inicio del title — justo lo que se quitó a propósito en sesión 30); "Zona Sur" ya vive en la meta-descripción; "en Venta" es keyword transaccional que sube CTR. Además Google sigue reindexando la migración → no meter ruido. El "Cancún" que Florencio quería ver lo aporta el **site name** (ya configurado), no el title. **Pendiente sin tocar:** actualizar el dato viejo "1080 puntos" del 1er artículo del blog ([app/blog/_lib/posts.ts:74](app/blog/_lib/posts.ts#L74)) — contradice al 2º artículo que ya explica el Modelo T100 (100 pts). Se ofreció, quedó para después.

> **📌 SESIÓN 31 (28 jun 2026) — Consulta SEO post-migración: "site name" y sitelinks en cero (SIN cambios de código, solo aclaración + acción en Search Console):**
>
> Florencio observó dos cosas en los resultados de Google (móvil) y preguntó por qué. Se aclararon (NO eran errores del sitio):
>
> 1. **"Site name" (nombre del sitio) vs title tag — son DOS cosas distintas.** En el resultado de búsqueda la línea pequeña ARRIBA de la URL es el **site name**; el texto azul grande es el **title tag**. El title azul ("Altta Homes Cancún | Casas y Departamentos…") **SÍ está saliendo bien**. Lo que Florencio esperaba ver "en solitario arriba" es el site name, que todavía muestra el dominio `alttahomescancun.mx` en vez de "Altta Homes Cancún". **El código YA está correcto** — `siteName: "Altta Homes Cancún"` en [app/layout.tsx:62](app/layout.tsx#L62) (og:site_name) + JSON-LD `WebSite.name = "Altta Homes Cancún"` en [app/page.tsx:122](app/page.tsx#L122). El site name **lo decide Google** y lo toma cuando re-rastrea la home; mientras tanto usa el dominio como respaldo. **Prueba de que Google aún NO ha re-rastreado la home post-migración:** en la captura el favicon sigue siendo el monograma viejo "AH", NO la insignia ovalada nueva de la sesión 30. Favicon y site name se actualizan JUNTOS al reindexar la home. **Nada que cambiar en código.**
>
> 2. **Sitelinks en 0 (el competidor `alttahomescancun.com` muestra varios: JdS6, Lirios, La Rioja, etc.; el dominio nuevo muestra 0).** Los **sitelinks los genera Google solo** (no se ponen a mano) cuando el dominio tiene indexación + autoridad + tráfico suficientes. Que estén en 0 es el **"bache de transición" ESPERADO de la migración** (dominio nuevo a ojos de Google desde el 20 jun): se reiniciaron y vuelven en **semanas a 1-3 meses** conforme el dominio acumula autoridad. El 301 + el "Cambio de dirección" de Search Console son justo lo que transfiere la autoridad; el tráfico de Google Ads acelera. **NO es daño, no se rompió nada.**
>
> **Acción tomada por Florencio en esta sesión:** solicitó indexación en Search Console de la home + los 3 silos (`/jardines-del-sur-6`, `/la-rioja-2`, `/lirios-residencial-2`). **NO hubo cambios de código ni deploy.**
>
> **CONCLUSIÓN: solo esperar.** Termómetro real del avance = Search Console → Páginas (cuántas URLs pasan a "Indexada"); chequear ~1 vez por semana, sin obsesionarse. Tiempos esperados: indexación días–2 sem; favicon nuevo + site name días–~3 sem; sitelinks semanas–1-3 meses.

> **✅ COMPLETADO sesión 30 (27 jun 2026) — Nuevo FAVICON de marca "Altta Homes Cancún" (desplegado a producción):**
>
> Se reemplazó el favicon (antes un monograma "AH" genérico azul/dorado) por la **insignia ovalada completa de marca**: óvalo con anillo dorado metálico + "Altta" blanco + "HOMES" dorado + techo de marca + cinta dorada "CANCÚN". Refuerza el "look de empresa" del plan SEO (igualar/superar a la competidora `alttahomescancun.com` en reconocimiento de marca).
>
> **Fuente = imagen propia de Florencio**, no un redibujo de Claude. Claude primero recreó el óvalo en SVG a mano, pero NO quedaba pixel-perfect (tipografía "Altta", dorado metálico, forma exacta del techo). Solución: Florencio diseñó/refinó él mismo la imagen (`Logo Altta Homes Cancun.png`, 1254×1254, en la raíz del repo, fuera de Web-Jardines-del-Sur/) y Claude la usó como fuente directa → favicon **idéntico** a su diseño.
>
> **Decisión de Florencio (guardada en memoria `favicon-altta-oval-badge`):** rechazó explícitamente la versión minimalista "monograma AH" que Claude recomendaba como "más profesional/legible a 16px". Prioriza **igualar la marca oficial** (que se vea la palabra "Altta", que llame la atención) por encima de la legibilidad a tamaño diminuto. Para su objetivo de posicionamiento es correcto. **NO volver a proponer el monograma.** El óvalo grande también sirve como logo de header/redes; tiene además una versión **redonda** para redes/perfil/GBP (el cuadrado redondeado se queda para el favicon porque llena mejor el área de la pestaña).
>
> **Archivos (Next.js los detecta solos):** `app/icon.png` (512), `app/apple-icon.png` (180), `app/favicon.ico` (16/32/48). Se eliminó el viejo `app/icon.svg` y `public/favicon-preview-ah.svg`. Generados con `sharp`. ⚠️ **GOTCHA Next 16 + Turbopack:** el `favicon.ico` debe llevar PNGs en **RGBA** o el build falla con "Processing image failed / The PNG is not in RGBA format" — al generarlo con sharp usar `.ensureAlpha()` (la imagen fuente no tenía canal alfa). **Desplegado** (`npm run build` + `firebase deploy --only hosting`); verificado HTTP 200 en `alttahomescancun.mx/{favicon.ico,icon.png,apple-icon.png}`. Recordar: el navegador cachea el favicon fuerte (Cmd+Shift+R o incógnito para verlo).

> **✅ COMPLETADO sesión 30 (27 jun 2026) — Campaña Google Ads "WhatsApp Click" → RESUELTA como recurso de mensaje en la campaña actual (NO campaña nueva):**
>
> Se ejecutó guiado paso a paso. **Giro clave de estrategia:** el plan original (campaña de Búsqueda NUEVA y separada `Cancún - WhatsApp Click - v1`) se **descartó a mitad de construcción** porque al elegir las keywords surgió el problema real: las mejores keywords (`jardines del sur 6`, `altta homes cancun`, etc.) **YA están en la campaña actual** (`Cancún - Search - Casas y Deptos - v1`); ponerlas también en una 2ª campaña = **canibalización** (pujas contra ti mismo, subes tu propio CPC). Florencio (con buen instinto) eligió la opción más simple y mejor: **agregar el recurso de WhatsApp directamente a la campaña actual que ya jala**, usando sus top keywords sin duplicar.
>
> **Lo que quedó:** recurso de **Mensaje (WhatsApp)** a **nivel CAMPAÑA** sobre `Cancún - Search - Casas y Deptos - v1`. Config: País **México**, número **998 205 9044**, mensaje de inicio *"Hola, vi su anuncio de Altta Homes en Google y quiero informes y precios de casas y departamentos en Cancún."* (108/140), CTA **"Obtener información"**, descripción del CTA **"Informes por WhatsApp"** (decisión de Florencio sobre la mía "Informes sin costo" — quería que dijera WhatsApp explícito para que piquen; válido en MX). Estado **"Pendiente / En revisión"** = NORMAL (Google aprueba recursos de mensaje en ~1-2 días → luego "Apto" y se muestra el botón).
>
> ⚠️ **DECISIÓN IMPORTANTE — se DESMARCÓ el check "Optimiza tu campaña… agregará una acción de conversión de leads obtenidos por mensajes"** (tanto a nivel Cuenta como Campaña ese check existe). Razón: NO mover la optimización de la campaña actual (CPA ~$101 sobre WhatsApp Click web). Solo agregamos el botón; los clics se reportan en las estadísticas del recurso, sin meter una nueva conversión que altere la puja. **Regla de oro reforzada:** NUNCA configurar el recurso de mensaje desde el BANNER de notificación (lo pone a nivel **Cuenta** = afecta TODAS las campañas + cambia la conversión por defecto de la cuenta). Se hace a nivel **Campaña**, eligiendo la campaña en "Agregar a", con el check desmarcado.
>
> **Trade-off a recordar (sin cambios):** estos leads van directo a WhatsApp, **saltan el sitio → NO disparan el Meta Pixel** → no alimentan retargeting. Es complemento, no reemplazo.

> **✅ COMPLETADO sesión 30 (27 jun 2026) — Logo de empresa en Google Ads + Título SEO del home:**
> - **Logo de empresa actualizado en Google Ads** (lo hizo Florencio). ⚠️ El logo en los anuncios **solo aparece tras revisión de Google (1-3 días) + verificación de marca** (la que inició en sesión 26, tarda 1-2 sem). Hasta entonces no se ve aunque esté cargado. Vista previa: Campañas → Anuncios → "Vista previa", pero puede no mostrarlo hasta aprobado+verificado.
> - **Pendiente de marca consistente (logo):** falta ponerlo en **GBP ×3** (Jardines del Sur 6, Lirios 2, La Rioja 2) — usar la **versión REDONDA** (foto de perfil circular) + de paso actualizar ahí el **dominio nuevo** `alttahomescancun.mx`; y en **WhatsApp Business** (foto de perfil, redonda). En **redes (FB/IG)** va la marca personal "Florencio Real Estate", NO el óvalo (estrategia de 2 marcas).
> - **Título SEO del home acortado/optimizado (desplegado):** de `Altta Homes Cancún | Casas y Departamentos en la Zona Sur` → **`Altta Homes Cancún | Casas y Departamentos en Venta`** (51 car., NO se trunca en móvil). Razón (decisión de director de marketing): marca+ciudad al frente (ranking), "Casas y Departamentos" cubre ambos productos, **"en Venta"** = keyword transaccional + sube CTR, y se **quitó el "Cancún" repetido**. Cambiado en los 3 lugares de `app/layout.tsx` (title.default, openGraph.title, twitter.title). La **meta-descripción NO se tocó** (ahí se queda "Zona Sur / Polígono Sur" + los 4 desarrollos). Verificado en producción. ⚠️ Recordar: el truncado con "..." en el SERP **NO penaliza ranking** (Google lee el title completo); es solo estética/CTR. **Pendiente Florencio:** solicitar indexación de la home en Search Console para acelerar que Google muestre el título nuevo.

> **💰 CRÉDITOS PROMOCIONALES Google Ads — estado al 17 jun 2026 (afecta el TIMING de la migración):**
> - **Promo $7,000** (código `7QTVD-WKHV6-MLFY`, canjeada 31 may 2026): "gasta $7,000 → crédito $7,000". Progreso: **MXN 3,052.31 / 7,000** (~44%). Vence **30 jul 2026**. Es por **CUENTA/facturación, NO por dominio** → la migración NO la afecta. Solo seguir gastando desde esta cuenta.
> - **Promo $4,000** — ✅ **CANJEADA 17 jun 2026.** Condición: "configurar seguimiento de conversiones + registrar ≥1 conversión **antes del 17 jul 2026**". Florencio YA cumple todo (acción de conversión WhatsApp Click activa + etiqueta Google AW-18157218280 vía GTM + 11 conv. en el período). **NO crear una acción de conversión nueva** (la pantalla post-canje lo ofrece, pero duplicaría y podría diluir la optimización). Solo cerrar; el crédito se desbloquea con la próxima conversión natural.
> - **⚠️ SECUENCIA RECOMENDADA:** (1) **Canjear los $4,000 YA** con el tracking estable; (2) dejar que registre una conversión en días (caen solas); (3) **DESPUÉS** migrar el dominio. Así el crédito queda bloqueado antes del posible bache de tracking/QS de la migración. Tras migrar: **verificar que la conversión GTM siga jalando** en `alttahomescancun.mx` (no romper la condición del crédito).
>
> **💡 ESTRATEGIA INTEGRADA crédito + migración (idea de Florencio 17 jun 2026):** Los **$11,000 totales** ($7k + $4k) son el colchón ideal para financiar el bache de QS/CPA de la migración. Plan: (a) asegurar ambos créditos primero — $4k casi listo; $7k faltan ~$3,948 de gasto de CALIDAD (sin amplia) para llegar a $7,000 antes del 30 jul, vas en $3,052; (b) **migrar cuando aterrice el crédito (~fines jul)** para entrar a la transición con respaldo; (c) usar el crédito DURANTE el bache — además de absorber el costo, acelera el re-aprendizaje de Google en el dominio nuevo (más data = QS recupera más rápido); se puede subir presupuesto temporalmente. **⏱️ El crédito ganado se debe USAR en 60 días** → migrar justo cuando aterrice lo aprovecha al máximo. Convierte la migración de "decisión arriesgada" a "jugada financiada".
>
> **🚫 CALLEJÓN SIN SALIDA DESCARTADO (17 jun 2026):** Florencio consideró COPIAR el sitio a un segundo proyecto Firebase con `alttahomescancun.mx` para "evitar la migración". RECHAZADO — es peor: (1) contenido duplicado en 2 dominios → Google parte/devalúa señales; (2) los canonical tags del código (`metadataBase`/`SITE_URL` → jardinesdelsurcancun.mx) harían que el sitio nuevo NUNCA rankee (se auto-declara copia); (3) canibalización; (4) más trabajo (2 deploys para siempre). Aclarado el malentendido: migrar NO es reconstruir/copiar — `alttahomescancun.mx` YA está pegado al proyecto actual (como redirect); migrar = flipar a primario + cambiar 1 constante + redeploy. La migración con 301 es la ÚNICA forma que transfiere autoridad y posiciona el dominio nuevo.
>
> **🧭 DECISIÓN ESTRATÉGICA PENDIENTE (documentada 17 jun 2026) — Posible migración de dominio primario a `alttahomescancun.mx`:**
>
> Florencio detectó que tiene 5 dominios en Firebase Hosting y se planteó cambiar el **dominio primario** de `jardinesdelsurcancun.mx` (actual) a **`alttahomescancun.mx`** "para posicionarse mejor", invirtiendo la redirección (que el actual redirija al nuevo).
>
> **Estado actual de los dominios (Firebase Hosting):**
> - `jardinesdelsur-cancun.web.app` — Predeterminado
> - `jardinesdelsur-cancun.firebaseapp.com` — Predeterminado
> - `alttahomescancun.mx` — **Redirecciona → jardinesdelsurcancun.mx** (Conectado)
> - `jardinesdelsurcancun.com.mx` — Redirecciona → jardinesdelsurcancun.mx (Conectado)
> - **`jardinesdelsurcancun.mx` — Personalizado / PRIMARIO actual (Conectado)** ✅
>
> **Alcance técnico medido (commit base 64c59b4):** El dominio viejo está hardcodeado en **11 lugares / 9 archivos** — siempre como constante `SITE_URL` o `metadataBase`/OpenGraph: `app/robots.ts` (×2), `app/layout.tsx` (×2: metadataBase + OG url), `app/sitemap.ts`, `app/page.tsx`, `app/desarrollos-cancun/_lib/SiloPage.tsx`, `app/desarrollos-cancun/_lib/ModelPage.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/preguntas-frecuentes/page.tsx`, `app/desarrollos-cancun/jardines-del-sur-7/page.tsx`. **NO hay constante centralizada** (copy-paste). Los silos/modelos son agnósticos al dominio (salen de `inventory.json`), NO requieren adaptación.
>
> **Plan técnico — EJECUTAR EN ESTE ORDEN (el orden importa; NO desplegar el código nuevo antes de flipar Firebase, o Google ve un rato confuso):**
> 1. **(Código, NO afecta producción)** Centralizar el dominio en `lib/site.ts` (`export const SITE_URL = "https://alttahomescancun.mx"`) e importarlo en los 9 archivos que hoy lo tienen hardcodeado → futuros cambios = 1 línea. (~10 min, riesgo cero, no se despliega todavía)
> 2. **Firebase Hosting consola (esto SÍ mueve producción):** invertir — `alttahomescancun.mx` → Personalizado/primario; `jardinesdelsurcancun.mx` → Redireccionar 301 al nuevo. Esperar propagación DNS/SSL (horas).
> 3. **Recién entonces:** `npm run build` + `firebase deploy` con el dominio nuevo en el código.
> 4. **Search Console:** crear propiedad nueva de `alttahomescancun.mx`, verificar, actualizar el token `verification.google` en `app/layout.tsx:53` (el actual es del dominio viejo), enviar sitemap y usar herramienta "Cambio de dirección".
> 5. **Google Ads:** actualizar URL final de campaña + las ~10 sitelinks + página `/whatsapp` al dominio nuevo (si no, quedan con salto extra de redirección).
> 6. **GBP (3 perfiles):** re-apuntar el sitio web al dominio nuevo.
> 7. **Meta:** re-verificar dominio (`alttahomescancun.mx`) en Business Settings → Brand Safety → Domains + re-configurar/validar el **Meta Pixel** (`2016457592282966`) con el dominio nuevo.
>
> **🎯 RAZÓN ESTRATÉGICA REAL (aclarada por Florencio 17 jun 2026):**
> - `alttahomescancun.com` **NO es el sitio oficial de Altta Homes** — es de **otra asesora (competidora)**, y es la que está **mejor posicionada** para "altta homes cancun". Florencio tiene la versión **`.mx`**.
> - **"Altta Homes" es la marca paraguas que cubre los 3 desarrollos** (Jardines del Sur 6 + La Rioja 2 + Lirios). "Jardines del sur" es solo 1 de 3. El término marca es más amplio y captura intención para TODO el inventario → por eso el cambio es estratégico: poseer el término que abarca todo.
>
> **⚠️ VERDAD TÉCNICA CLAVE:** un **redirect 301 NO rankea en Google** (rebota al destino, no aparece en resultados). Mientras `alttahomescancun.mx` sea solo redirect, **NO compite** contra `alttahomescancun.com` por "altta homes cancun". Para disputarle ese posicionamiento a la competidora, `.mx` debe ser el **sitio primario vivo e indexado**. Es decir: migrar es la ÚNICA forma de competir por ese término.
>
> **Riesgo restante real:**
> - **(A) Quality Score / CPA — único costo mecánico inevitable:** el QS de Ads se mide por la URL de destino; cambiar dominio resetea el historial de "experiencia de página destino" → baja temporal de QS y subida de CPA durante ~2-4 semanas, justo tras optimizar el CPA a ~$101. Temporal y manejable si se vigila Ads de cerca durante la transición.
> - **(B) Riesgo de marca — BAJO (revisado a la baja):** Florencio es asesor **AUTORIZADO**, tiene más derecho a la marca que la competidora que ya rankea sin penalización con `.com`. El mercado ya demostró que se puede. Riesgo residual: que Altta/Sadasi oficial reclame el dominio a futuro, pero su estatus de autorizado lo hace defendible.
>
> **✅ DECISIÓN TOMADA (17 jun 2026): SÍ se migra a `alttahomescancun.mx`.** Razón: posicionamiento de largo plazo + es mejor hacerlo **ahora que lleva poco tiempo** (menos equity de SEO/QS acumulado = menos que perder en el bache de transición). Florencio acepta el costo: bache temporal de QS/CPA (~2-4 semanas) + re-configurar Meta Pixel + Search Console.
>
> **✅ ESTADO: EJECUTADA el 20 jun 2026 (sesión 29).** El sitio primario ya es `alttahomescancun.mx`; `jardinesdelsurcancun.mx` redirige 301 al nuevo. Pasos 1-4 + GTM hechos. Detalle completo en la entrada "✅ COMPLETADO sesión 29" abajo.

> **✅ COMPLETADO sesión 29 (20 jun 2026) — MIGRACIÓN DE DOMINIO EJECUTADA a `alttahomescancun.mx` (Firebase + deploy + Search Console + GTM):**
>
> Migración completa en una sola sesión, guiada paso a paso. **Producción ya vive en `alttahomescancun.mx`.** El crédito de $4,000 YA estaba depositado (condición cumplida → migrar dejó de ser riesgo para ese crédito).
>
> **Lo ejecutado:**
> 1. **Código — constante central de dominio:** creado `lib/site.ts` con `export const SITE_URL = "https://alttahomescancun.mx"`. Reemplazados los **12 hardcodeos en 10 archivos** (robots.ts ×2, layout.tsx ×2 [metadataBase + og:url], sitemap.ts, page.tsx, SiloPage.tsx, ModelPage.tsx, blog/page.tsx, blog/[slug]/page.tsx, preguntas-frecuentes/page.tsx, jardines-del-sur-7/page.tsx) por `import { SITE_URL } from "@/lib/site"`. Futuros cambios de dominio = 1 línea. **El token `verification.google` de `layout.tsx` se dejó INTACTO** (sirve para el dominio viejo; el nuevo se verificó por DNS, ver abajo).
> 2. **Firebase Hosting (flip):** en consola, "Editar dominio" → `alttahomescancun.mx` = "Entregar tráfico desde este dominio" (primario); `jardinesdelsurcancun.mx` = "Redireccionar" → `alttahomescancun.mx` (301). NO se eliminó ningún dominio (el flip se hizo con el diálogo Editar, no borrando/recreando).
> 3. **Build + deploy:** `npm run build` + `firebase deploy --only hosting --project jardinesdelsur-cancun`. Verificado en vivo: `alttahomescancun.mx` HTTP 200 + SSL; canonical/og:url/robots.txt(Host+Sitemap)/sitemap.xml todos en dominio nuevo; `jardinesdelsurcancun.mx` → 301 a `alttahomescancun.mx`.
> 4. **Search Console:** creada propiedad **tipo Dominio** de `alttahomescancun.mx`, verificada por **DNS TXT** (`google-site-verification=...GqHTftW0s`). ⚠️ El DNS de los dominios está en **Hostinger** (no en el registrador típico). GOTCHAS resueltos: (a) primero se agregó el TXT en el dominio equivocado (`alttahomescancun.com.mx`, que es OTRO dominio parqueado en Hostinger con A→2.57.91.91, NO es el sitio); el correcto es `alttahomescancun.mx` (A→199.36.158.100 de Firebase) con Nombre `@`. (b) Sitemap enviado (`sitemap.xml`, 19 URLs) — sale "No se ha podido obtener" las primeras horas, es NORMAL. (c) **Cambio de dirección** confirmado desde la propiedad vieja `jardinesdelsurcancun.mx` → nuevo `alttahomescancun.mx` (validó 301 + ambos verificados). (d) Solicitada indexación de home + 3 silos. **La propiedad vieja NO se borra** (se necesita para el Cambio de dirección + histórico; dejar ≥6 meses).
> 5. **GTM (conversiones):** contenedor `GTM-53BHDRWC`, activador **"Click - WhatsApp wa.me"** — su condición de filtro `Page Hostname contiene jardinesdelsurcancun.mx` se cambió a `alttahomescancun.mx`. Publicada versión **"v4 - Dominio Altta Homes"**. ⚠️ El tag **Meta Pixel - Base Code** dispara en **All Pages** (sin filtro de hostname) → NO necesitó cambio, ya jalaba en el dominio nuevo. (Nota: el contenedor/cuenta GTM siguen NOMBRADOS "jardinesdelsurcancun.mx" — es solo etiqueta cosmética, el ID es lo que importa, no se renombró.)
>
> **⏳ PENDIENTE post-migración. ORDEN DE PRIORIDAD (20 jun): ✅ Google Ads HECHO → ✅ Títulos SEO Fase 1 HECHO → ✅ Fase 2 (datos estructurados + modelo de marcas) HECHO → ✅ Fase 4 (acortar rutas de silos) HECHO → (PRÓXIMO) GBP ×3 + Fase 3 (autoridad/contenido: verificación de marca, reseñas, blog, backlinks) en continuo. Detalles en `plan-seo-altta-homes.md`.**
>
> **✅ FASE 1 SEO HECHA (sesión 29) — títulos brand-first + precios dinámicos (desplegado):** `og:site_name` y nombre de marca (JSON-LD RealEstateAgent + WebSite) ahora **"Altta Homes Cancún"** en todo el sitio. Títulos reescritos brand-first: home `Altta Homes Cancún | Casas y Departamentos en la Zona Sur`; silos `[Desarrollo] Cancún | ... desde $X.XXM` con **precio dinámico** (se calcula del `inventory.json` vía `formatPriceShort`+`getMinPriceByDev` en `dev-meta.ts` → nunca queda stale; ej. JdS6 ya muestra $1.77M, no el viejo $1.85M); JdS7 `Próxima Apertura a la Venta` (NO preventa). Descripciones con **"Zona Sur de Cancún"** (título, premium) + **"Polígono Sur"** (descripción, keyword) + ganchos de ubicación (5 min aeropuerto, 15 min playas, 500 m Av. Huayacán, 5 min Tren Maya) + "Chatea con un asesor autorizado de Altta Homes" + **crédito bancario antes que Infonavit** ([[feedback_credito_bancario_primero]]). Decisión "alta plusvalía" (sin "garantizada" ni cifra $627k). Plan completo y fases 2-4 en `plan-seo-altta-homes.md`. Commit `0e6c60a`.

> **✅ Disclaimer legal en tarjetas (sesión 29):** línea en el `legalLegend` de `PropertyCard.jsx` (aplica a TODAS las tarjetas): *"\*\*\* Aplican restricciones"* (versión corta con 3 asteriscos; la versión larga se acortó porque en móvil se veía cargada). Protección legal estándar. Desplegado.

> **✅ Fase 2 SEO (datos estructurados) — sesión 29:** Resultó que el JSON-LD YA estaba muy completo (silos y modelos ya tenían BreadcrumbList + Offer + Residence/OfferCatalog; el #1 no tiene NADA → ya se le gana en lo técnico). Lo único agregado: **modelo de dos marcas en el JSON-LD del home (`app/page.tsx`)** — entidad empresa **"Altta Homes Cancún"** (`RealEstateAgent`, sameAs = Google Business) + **`Person` "Florencio Hurtado"** (asesor autorizado, `jobTitle`, `worksFor` la empresa, `sameAs` = Facebook `profile.php?id=61564048801892` + Instagram `florenciorealestate`) + `employee` en el RealEstateAgent apuntando a la Persona. Estrategia: Google/web = marca empresa "Altta Homes Cancún" (limpia, para ranking); redes = marca personal "Florencio Real Estate"; se conectan vía la Persona (E-E-A-T sin diluir el nombre de la empresa). Decidido por Florencio. Lo que falta de SEO es Fase 3 (autoridad: verificación de marca en Google, reseñas, blog, backlinks) + tiempo; GBP ×3 pendiente (apuntar sitio web al dominio nuevo — JdS6/Lirios vivos, La Rioja en revisión >10 días, JdS7 por crear).
> 1. ✅ **Google Ads — URLs HECHO (sesión 29):** cambiada la **URL final del anuncio** a `https://alttahomescancun.mx` (la ruta del anuncio gráfico se actualizó sola) + **todos los sitelinks** al dominio nuevo (solo se cambió el dominio, rutas cortas `/jardines`, `/whatsapp`, etc. intactas — siguen funcionando vía redirect de firebase.json aunque luego se acorten los silos). De paso se corrigió un sitelink roto: `/nonim` (404, typo) → `/noni`. **Nombre de empresa del anuncio = "Altta Homes Cancun"** (Google lo permite porque coincide con el dominio/URL; el nombre verificado del anunciante es "Hurtado Castañeda Florencio Leonardo"). Campaña NO se pausó. ⚠️ Nota marca: en PAGADOS, la marca como nombre de empresa es defendible solo porque coincide con el dominio propio; la asociación principal va en el copy ("Asesor autorizado de Altta Homes").
> 2. ⏳ **GBP (3 perfiles) — PRÓXIMO:** apuntar el sitio web de los 3 perfiles (Jardines del Sur 6, Lirios 2, La Rioja 2) al dominio nuevo `alttahomescancun.mx`.
> 3. ✅ **Meta — HECHO (sesión 29):** dominio `alttahomescancun.mx` agregado a la **lista de autorizados** del dataset (Pixel `2016457592282966`) + **verificado** en Business Settings → Seguridad e idoneidad de la marca → Dominios (por **DNS TXT** `facebook-domain-verification=z7wrmyf1nv4d5hv0ydwzg8vneom21b` en Hostinger, Nombre `@`). El tag **Meta Pixel base dispara en All Pages → ya jalaba sin cambios** en el dominio nuevo (no se tocó). ⏳ Opcional/avanzado restante: configurar eventos iOS (AEM) del dominio — NO crítico (conversión = clic WhatsApp), para cuando se arme retargeting de Meta. Los 2 "Diagnósticos" del dataset (coincidencias avanzadas manuales + divisa en ViewContent) son pre-migración y NO urgentes (ver nota).
> 4. **Limpieza menor:** `jardinesdelsurcancun.com.mx` redirige al viejo `.mx` → doble salto; editar en Firebase para que vaya directo a `alttahomescancun.mx`.
> 5. **Títulos SEO orgánicos** (idea de Florencio + asesor externo): `og:site_name = "Altta Homes Cancún"` (Piso 1) + `title` "Asesor Autorizado | [desarrollo]" (Piso 2) + description con los 4 desarrollos. Se implementa en `layout.tsx` (home/global) y `dev-content.ts` (`metaTitle`/`metaDescription` por silo) — es Next metadata, NO HTML plano. ⚠️ **BLOQUEADO pendiente decisión de Florencio (A/B/C):** la descripción propuesta por el asesor externo dice "plusvalía inmediata **garantizada** de hasta **$627,000 MXN** al firmar" — NO publicar sin confirmar: es promesa financiera fuerte (riesgo legal + choca con rol "asesor autorizado") y el número es por modelo específico, no general del home. Opción segura (A) = mencionar los 4 desarrollos sin la cifra/garantía.
>
> **✅ FASE 4 HECHA (20 jun 2026) — rutas de silos acortadas a `/jardines-del-sur-6` (quitado `/desarrollos-cancun/`):** Florencio decidió hacerlo YA (poco equity = poco que perder, mismo argumento que la migración; dejar estructura final antes de construir autoridad). **Implementado con Route Group de Next.js:** se renombró la carpeta `app/desarrollos-cancun/` → **`app/(desarrollos)/`** (los paréntesis NO aparecen en la URL → las URLs perdieron el segmento, y TODOS los imports relativos internos quedaron intactos = riesgo mínimo). Imports por nombre corregidos a `(desarrollos)`: `sitemap.ts` (×2) y `SiloHero.jsx` (×1). Strings de URL `/desarrollos-cancun/` → `/` en todo el código (sed). En `firebase.json`: destinos de atajos actualizados + **redirect catch-all `/desarrollos-cancun/:path* → /:path*` (301)** para que las URLs largas que Google ya indexó no den 404. Verificado en vivo: `/jardines-del-sur-6` 200; `/desarrollos-cancun/jardines-del-sur-6` 301→corta; atajos `/jardines` y `/capua` siguen jalando (sitelinks de Ads NO se tocan). ⚠️ Tras esto hubo que **borrar `.next/` y rebuild** (tipos de ruta cacheados con el nombre viejo). PENDIENTE Florencio: re-enviar sitemap + re-solicitar indexación de las URLs nuevas en Search Console; GBP usar las URLs cortas nuevas. ⚠️ **GOTCHA corregido:** el `sed s|/desarrollos-cancun/|/|g` también reemplazó dentro de la LÓGICA de `SiteHeader.jsx` (`pathname.startsWith("/desarrollos-cancun/")` → `startsWith("/")` = siempre true → en el home se ocultaba el menú y el botón "Informes WhatsApp" se iba al centro). Arreglado: la detección de silo ahora es por slug (`SILO_PATH_SLUGS.includes(currentSlug)`), no por prefijo. Lección: al hacer sed masivo, revisar usos en lógica (startsWith/slice/includes), no solo hrefs.

> **▶️ PRÓXIMA SESIÓN — Ejecutar Campaña Google Ads "WhatsApp Click" (plan listo, 21 jun 2026):** Florencio decidió armarla (dominio ya migrado). Se quedó en el Paso 1 (crear campaña) por falta de tiempo. **PLAN COMPLETO para retomar:**
> - **Vehículo:** campaña NUEVA y SEPARADA de Búsqueda, objetivo "Clientes potenciales". Nombre: `Cancún - WhatsApp Click - v1`. **NUNCA** dentro de la campaña actual (CPA ~$101).
> - **Presupuesto:** ~$40/día (confirmar). Bonus: el gasto **cuenta para desbloquear el crédito de $7,000** (va en ~$3,052/7,000, límite 30 jul).
> - **Puja:** maximizar clics al inicio (hasta tener data) → luego conversiones.
> - **Ubicación:** Cancún + radio (como la campaña actual).
> - **Keywords DISTINTAS** a la campaña actual para evitar auto-competencia (misma keyword en 2 campañas = compiten en la subasta). Usar transaccionales/de contacto: `informes casas cancun whatsapp`, `asesor altta homes cancun`, `cotizar casa jardines del sur`, `casas cancun whatsapp`, etc. (exacta/frase).
> - **Recurso de mensaje de WhatsApp a nivel CAMPAÑA** (NO Cuenta): País **México** (sale "Estados Unidos" por defecto → cambiar), número **998 205 9044**, mensaje de inicio (≤140 car.) branded "Altta Homes", elegir un CTA. Verificación por código (una vez).
> - **Conversión = inicio de conversación** (clic-a-mensaje), no visita.
> - ⚠️ **NO usar el botón "Comenzar" del banner** — configuración manual para control total (regla de oro).
> - **Trade-off a recordar:** estos leads saltan el sitio → **NO disparan el Meta Pixel** → no alimentan el retargeting. Es **complemento**, no reemplazo. Medir: ¿CPA del lead directo a WhatsApp < CPA del que pasa por la web?
> - **Prerrequisitos listos:** WhatsApp Business ✅, número verificado ✅, mensajes prellenados ✅.

> **📝 BACKLOG de blog (Fase 3 SEO — apuntado 21 jun 2026):** Ideas de artículos para seguir publicando (alta intención, alineados a keywords). Reglas: crédito bancario antes que Infonavit ([[feedback_credito_bancario_primero]]), FOVISSSTE solo JdS6 ([[fovissste_scope_jds6]]), usar "Zona Sur de Cancún" + "Polígono Sur", CTA a /whatsapp + asesor autorizado.
> 1. "Plusvalía en Cancún: zonas con mejor proyección 2026" (Zona Sur, Tren Maya, aeropuerto).
> 2. "Comprar casa en Cancún con crédito bancario: guía 2026" (lidera con bancario).
> 3. "Cuánto cuesta vivir en la Zona Sur de Cancún (Polígono Sur)".
> 4. "Jardines del Sur 6 vs La Rioja 2 vs Lirios 2: cuál elegir según tu presupuesto".
> 5. "Cómo apartar tu casa en preventa en Cancún, paso a paso".
> 6. "Vivir cerca del Tren Maya: plusvalía en la Zona Sur de Cancún".
> 7. Pendiente: actualizar el 1er artículo (dice "1080 puntos" → ya es Modelo T100/100 pts).

> **💡 MEJORA OPCIONAL PENDIENTE — bloque de precio variable en departamentos (apuntado 21 jun 2026):** En casas el precio es fijo (+ promos); en departamentos VARÍA según nivel + vista (alberca vs estacionamiento) + roof garden (Lirios N3). Florencio preguntó si poner listado de precios. DECISIÓN: **NO publicar tabla completa** (se desactualiza, mata el gancho del lead, problema de disponibilidad). Mejora opcional recomendada (cero mantenimiento): en las páginas de departamentos `precio_variable` (Capua, Cedro Plus JdS6, Cedro Plus Lirios) agregar bloque que **explique los factores (nivel/vista/roof garden) + mantenga "desde $X" del inventario + CTA "Cotiza tu nivel y vista por WhatsApp"** → da confianza sin regalar precios ni desactualizarse. Pendiente, baja prioridad.

> **📄 Archivo nuevo `google.md` (21 jun 2026):** referencia con guía/reglas oficiales de Google para el proyecto (Cuenta de Google, GBP reglas clave, Ads y Search Console pendientes de llenar). Se irá llenando. Ojo: cuidar NO mezclar cuentas de Google (GBP/Ads deben ir bajo la misma cuenta correcta; apareció una `rafa401128@gmail.com` en una doc — no usar cuentas distintas para crear activos).

> **✅ Blog nuevo: cambios Infonavit 2026 / Modelo T100 (21 jun 2026):** 2º artículo en `app/blog/_lib/posts.ts`, slug `cambios-infonavit-precalificacion-mci-2026`. Tema: Infonavit actualizó la precalificación en Mi Cuenta Infonavit (MCI) — Buró ya no se consulta al inicio (hasta OCI/inscripción), resultado binario "precalifica/no" con Modelo T100 (de 1,080 pts → 100 pts), validación de datos obligatoria desde 15 jun, restricción >70% ingresos comprometidos + cuenta con atraso >12 meses. Basado en infografía de Altta Homes + investigación web (Modelo T100/MUO, curso obligatorio "Saber + para decidir mejor"). Incluye disclaimer (cambios recientes, verificar fuente oficial) + CTAs a /whatsapp y /jardines. ⚠️ Nota: el 1er artículo del blog dice "1080 puntos" — quedó desactualizado por T100 (considerar actualizarlo después). Es parte de Fase 3 SEO (contenido/autoridad). Desplegado. Florencio debe solicitar indexación de la URL nueva en Search Console.

> **✅ Jardines del Sur 7 agregado a TODA la navegación (21 jun 2026):** JdS7 faltaba en menús/footers (estaba solo en el footer del home). Agregado a: `SILO_LINKS` de `SiteHeader.jsx` (drawer "Otros desarrollos" + ahora el header de la página JdS7 muestra breadcrumb como los demás) y a los footers "Navegación" de `blog/page.tsx`, `blog/[slug]/page.tsx`, `preguntas-frecuentes/page.tsx` y la propia `jardines-del-sur-7/page.tsx` (texto "Jardines del Sur 7 · Próximamente"). Los footers de SiloPage/ModelPage usan link genérico "Desarrollos" (no listan individuales), se dejaron. DevelopmentTabs (inventario) no se tocó (JdS7 no tiene modelos aún). Desplegado.

> **✅ FIX hero cortado en navegadores in-app FB/IG (21 jun 2026):** En los WebView de Facebook/Instagram el hero del home se veía "zoom/ampliado" y el texto se cortaba por ambos lados ("Jardines"→"rdines", "Grupo Sadasi" cortado). Causa: `.subtitleDevelopments` ("Jardines del Sur 6, La Rioja 2 y Lirios Residencial 2") y `.title .trustTitle` ("con el respaldo de Grupo Sadasi") tenían **`white-space: nowrap`** en `components/Hero.module.css` → en esos WebView el texto se infla un poco, la línea nowrap ya no cabe y se desborda/corta. Fix: quitados los 3 `white-space: nowrap` (líneas ~215, ~391, ~402). En navegador normal siguen en una línea (sin cambio); en FB/IG ahora **envuelven** en vez de cortarse. El `-webkit-text-size-adjust: 100%` ya estaba (no bastaba solo). Los `nowrap` de `model.module.css` (precio/stats) se dejaron (correctos, elementos chicos). Desplegado.

> **🔮 PLANEADO — CAPI Fase 2 (server-side tracking) para subir rendimiento móvil sin trade-off (apuntado 21 jun 2026):**
>
> **Contexto:** PageSpeed móvil ~74-87 (fluctúa; desktop 99/100/100/100). El peso lo ponen los scripts de terceros (Facebook Pixel `fbevents.js` ~245 KiB + tags de Google), ya cargados con `lazyOnload`. Investigado: **Partytown (web worker) NO sirve aquí** — `strategy="worker"` no funciona con App Router y `experimental.nextScriptWorkers` no lo soporta Turbopack; Partytown manual rompería seguido el FB Pixel. La imagen hero y browserslist no dan ganancia real (Next 16 ya targetea moderno). **No hay flag mágico seguro.**
>
> **La solución correcta = server-side (Meta Conversions API):** mover eventos al servidor → el navegador deja de cargar el Pixel pesado → sube rendimiento Y mejora tracking (esquiva ad-blockers + iOS). Pero el sitio es **export estático en Firebase Hosting (sin servidor)** → requiere montar un **endpoint en Firebase Functions**.
>
> **Prerrequisitos:** (1) plan **Firebase Blaze** (pay-as-you-go; Functions no corren en Spark — casi gratis a bajo volumen pero pide tarjeta); (2) **token de acceso de CAPI** de Meta; (3) dataset ya existe (Pixel `2016457592282966`).
>
> **Scope:** Firebase Function (ej. `/api/meta-capi`) que reciba eventos del cliente y los reenvíe a Meta CAPI con datos hasheados + `event_id` para **deduplicar** con el Pixel del navegador; validar en Meta Events Manager (Test Events); para ganar RENDIMIENTO hay que además **reducir/quitar el Pixel cliente** (no solo duplicar). 
>
> **Estimado honesto:** **1-2 sesiones (~4-8 h) + pruebas** para un CAPI básico funcionando vía Firebase Functions. Si además se quita el Pixel cliente para ganar velocidad, +1 sesión de migración/verificación cuidadosa. NO es un flag, es un proyecto chico con backend. **Decisión: dejarlo para cuando Florencio quiera montar backend; el 84-87 móvil actual es bueno y sin datos de campo (CrUX) no urge.**

> **🧪 EXPERIMENTO FUTURO (post-migración) — Campaña Google Ads "click-to-WhatsApp" (apuntado 17 jun 2026):**
>
> Google ofreció el formato vía banner ("Genera más leads con los anuncios de clic para comunicarse por WhatsApp"). Florencio quiere armar una **una vez migrado el dominio** a `alttahomescancun.mx`. NO se activó desde el banner (podría crear campaña nueva / cambiar formato sin control).
>
> **Cómo funciona:** se conecta el número de WhatsApp Business a Google Ads (verificación por código una vez). El anuncio muestra botón "Enviar mensaje / Chatea por WhatsApp"; el clic abre el chat directo con mensaje prellenado; la **conversión = inicio de conversación** (clic-a-mensaje), no visita. Vive como asset en campañas de **Búsqueda** o como objetivo nativo en **Demand Gen**. Se paga por **CPC**; CPA suele ser más bajo que web→WhatsApp (menos fricción).
>
> **Prerrequisitos (casi todos listos):** WhatsApp Business activo ✅, número verificado ✅, mensajes prellenados por modelo (ya en `model-utils.ts` + `meta-ai-prompt`) ✅, bot Meta AI para respuesta rápida ✅.
>
> **Reglas para cuando se haga:**
> 1. Correrla como **campaña/experimento APARTE**, presupuesto chico (~$40-50/día). NUNCA dentro de la campaña actual optimizada a CPA ~$101.
> 2. Branding del mensaje ya como "Altta Homes Cancún" consolidado (por eso esperar a migrar).
> 3. **Trade-off a medir:** estos leads saltan el sitio y NO disparan el Meta Pixel → no alimentan el retargeting. Es COMPLEMENTO, no reemplazo de la campaña web. Comparar: ¿lead directo a WhatsApp convierte mejor que el que pasa por el sitio?
> 4. Sigue aplicando la regla de oro: NO activar desde banners de recomendación; configurar manualmente.
>
> **Detalles del formulario "Agregar mensaje / recurso de mensaje" (visto 17 jun 2026, se dejó sin guardar):** Configura tu recurso de mensaje = **WhatsApp**. GOTCHAS al retomar: (a) el campo País sale por defecto en **"Estados Unidos" → cambiar a México**; (b) Número = WhatsApp Business 998 205 9044; (c) "Mensaje de inicio" (máx 140) = mensaje branded Altta Homes; (d) seleccionar un CTA (llamado a la acción) abajo; (e) el form sugiere agregarlo a nivel **"Cuenta" (aplica a TODAS las campañas) → para el experimento controlado ponerlo a nivel CAMPAÑA**, no cuenta.

> **🎯 BACKLOG FEATURES NO URGENTES (post Google Ads launch):** Features identificadas como "alto ROI pero no bloqueantes" para hacer DESPUÉS de tener data real de conversión:
> 1. **Reviews/testimonios visibles** (alto trust, bajo esfuerzo ~1h). **CAVEAT IMPORTANTE**: el Google Business Profile del usuario es **nuevo y AÚN NO tiene estrellas/reseñas** — implementar la sección sería contraproducente porque mostraría 0 reseñas. **Acción previa requerida**: el usuario debe pedir reseñas a clientes/contactos existentes hasta tener ≥5-10 estrellas, luego integrar.
> 2. **Blog con 3-5 artículos SEO** (alto en autoridad de dominio, 3-5 días esfuerzo). Temas sugeridos: "Cuánto cuesta vivir en Polígono Sur Cancún", "Infonavit vs FOVISSSTE vs crédito bancario", "Plusvalía en Cancún zonas con mejor proyección 2026". Aumenta tráfico orgánico de keywords informativos que después convierten.
> 3. **Calculadora de financiamiento Infonavit/FOVISSSTE** (alto conversión +15-20%, 1 día). Feature comprobado en real estate: cuando el usuario calcula su mensualidad antes de contactar, llega a WhatsApp con intención más alta.
> 4. **Sticky price bar en mobile** (medio conversión, 1 hora). Cuando el usuario scrollea por la ficha del modelo, el precio se mantiene visible arriba con un botón "Cotizar" siempre disponible.
> 5. **Video del recorrido** (no solo 360°, alto engagement, esfuerzo externo). Filmar un walkthrough humano del modelo subido a YouTube/Vimeo, embebido en la página. Distinto al tour 360° (que es estático) — un video con voz narrando da otra dimensión de venta.

> **✅ COMPLETADO sesión 28 (3 jun 2026) — Revisión post-optimización + página `/whatsapp` + cosecha de keywords:**
>
> Sesión paso a paso con Florencio. **CPA real confirmado ~$101–115** (mejor que el objetivo $110–140; la optimización de sesión 26 funcionó). Insight: las búsquedas long-tail de bajo volumen traen la mitad de las conversiones y las más baratas (CPA $38).
>
> **Lo ejecutado:**
> - **5 keywords exactas cosechadas** de búsquedas reales (`[casas en jardines del sur cancun]`, `[jardines del sur 6 precios]`, `[casas jardines del sur]`, `[casas jardines del sur cancun]`, `[departamentos jardines del sur]`).
> - **Anuncio corregido:** descripción → "Crédito Infonavit y bancario. **Asesor autorizado de Altta Homes**, listo para atenderte." (quita FOVISSSTE engañoso + corrige rol). ⚠️ El anuncio vivo YA estaba mejor que lo documentado en `anuncio-perfecto.md` — verificar siempre el texto real.
> - **FOVISSSTE RESUELTO:** solo en Jardines del Sur 6, algunos deptos. NO en La Rioja ni Lirios. (Guardado en memoria.)
> - **Imágenes (image assets) NO disponibles aún** — cuenta nueva (~2 sem); Google las desbloquea con ~60-90 días. Revisar en 1-2 meses.
> - **⭐ Página `/whatsapp` creada y desplegada** (`app/whatsapp/page.tsx` + `WhatsAppRedirect.tsx`): redirección client-side a wa.me con mensaje prellenado, en dominio propio para que Google la acepte como sitelink + dispara la conversión de Ads. Deploy Firebase (commits `a8b4653`, `a5a910a`). Mensaje: "Hola, vi su anuncio en Google y quiero más información sobre las propiedades de Altta Homes en Cancún." Cambiar a futuro: `WHATSAPP_MESSAGE` en `WhatsAppRedirect.tsx` + build + `firebase deploy`.
> - **Sitelink "Informes por WhatsApp" recreado** (se había borrado) apuntando a `/whatsapp` — Google **ya NO lo rechaza** (dominio propio).
>
> **Pendiente próxima sesión (lo grande):** **La Rioja premium (Fase 4)** — grupo aparte con copy de lujo SIN Infonavit (arregla la "diferencia de clase" que detectó Florencio: el anuncio mezcla La Rioja $4M con Crédito Infonavit). Prerequisito: subir negativas de Grupo → Campaña. Detalle completo en `google-ads.md` sección "SESIÓN 28".
>
> **Nota:** la sesión 27 (crédito $7,000, presupuesto $120/día, primer apartado real desde Ads, investigación `anuncio-perfecto.md`) quedó documentada solo en `google-ads.md`, no en este context.

> **✅ COMPLETADO sesión 26 (29 may 2026) — Day of Optimization: GBP Lirios 2 + Meta AI prompt v2 + Google Ads "al 100%" (extensiones + Quality Score + 85 negatives):**
>
> **Sesión maratón de 6+ horas. Florencio pasó de novato a advertiser intermedio + ecosistema GBP duplicado.**
>
> **A) GBP Lirios 2 verificado al instante:**
> Nombre: `Lirios 2 Cancún - Asesor Autorizado Altta Homes` (Agente inmobiliario, Av. Robles 77536). Estrategia anti-duplicado validada: nombre diferenciado + categoría distinta a la del perfil pre-existente (otra asesora se adelantó capturando "LIRIOS RESIDENCIAL 2" como Constructora, NO es perfil oficial de Sadasi). Coexisten sin conflicto porque son cuentas Google distintas. Renders de Lirios subidos al perfil; fotos presenciales pendientes para próxima visita.
>
> **B) Correcciones de rol y datos:**
> - Rol oficial: cambiado de "asesor independiente" a **"asesor autorizado de Altta Homes"** en TODOS los contextos públicos (memoria, prompts Meta AI, descripciones GBP). Aplicar en futuras piezas.
> - Dirección Av. 127 SM 342 MZ 27 confirmada: es el pabellón de ventas de **Jardines del Sur 6 específicamente** (NO oficina genérica de Florencio como decía memoria vieja).
> - FOVISSSTE NO se acepta en Lirios 2 (quitado de su descripción GBP). **PENDIENTE confirmar:** ¿no se acepta en NINGÚN desarrollo o solo Lirios 2? Tema crítico para limpiar prompts Meta AI + descripciones Google Ads que mencionan FOVISSSTE.
>
> **C) Meta AI Prompt v2 (`meta-ai-prompt-whatsapp-v2.txt`):**
> Catálogo URL `https://wa.me/c/5219982059044` integrado. 9 FAQ + frases prohibidas. URLs individuales de productos guardadas pendientes de etiquetar con su modelo correspondiente.
>
> **D) Google Ads "al 100%" — 5 frentes de optimización ejecutados:**
>
> **D.1 Blindaje (Fase 1):**
> - Aplicación automática: confirmada DESACTIVADA (0 de 7 + 0 de 14)
> - 3 trampas descartadas: IA Max (+17.1%), Concordancia amplia (+13.1%), Quita redundantes (+0.7%) — la 3ra iba a borrar la MVP "residencial jardines del sur" CPA $12.90
> - Logo de marca subido para verificación (1-2 sem) — resuelve favicon ausente en anuncios
> - Nivel de optimización: 100% (estado "experto que revisa y descarta") tras aceptar logo + descartar 3
>
> **D.2 Search Terms + Negative Keywords (Fase 2):**
> - Reporte descargado: 64 clics distribuidos en ~170 búsquedas distintas
> - **~85 keywords negativas agregadas** clasificadas por categoría: competidores (cumbres, turquesa, sayab, malibu, etc.), renta, infonavit informativo, ubicaciones equivocadas (playa del carmen, tulum), zonas de la competencia
> - Conflicts detectados y omitidos: `[jardines del sur 1]`, `"residencial la rioja"`, `"residencial lirios"` (overlap con positivos)
> - **Quedaron a nivel Grupo de anuncios** (no Campaña) — al crear Grupos B y C habrá que re-aplicar a nivel Campaña o copiar a los nuevos grupos
> - Identificado MVP confirmado: `"residencial jardines del sur"` frase con CPA $12.90 (joya escondida)
>
> **D.3 Extensiones (Fase 5):**
> - **Callouts:** 4 nuevos agregados a los 5 existentes (total 9): "Recorrido Virtual 360°", "WhatsApp Inmediato", "Asesor Autorizado Altta", "50 Años Grupo Sadasi"
> - **Structured Snippets:** primer fragmento estructurado creado nivel Campaña — header "Servicios" (no había "Comodidades" en dropdown) con 6 valores: Alberca y Casa Club, Gimnasio Cerrado, Cancha de Pádel, Skate Park, Dog Park, Seguridad 24/7
> - **Sitelinks:** auditados — 11 activos, MVPs identificadas (`/lirios` CTR 16.96%, `/noni` CTR 15.31%, `/` CTR 14.81%, `/jardines` CTR 12.42%). **Fresno Elite pausado** (0% CTR, 53 impr — dead). **Modelo Capua rephraseado** (era CTR 1.39%, cambiado título "Capua desde $1.7M" + descripciones con m² y "Recorrido virtual gratis"). NO se agregaron más sitelinks (ya hay 10 activos = suficiente para rotación).
>
> **D.4 Quality Score (Fase 3):**
> - Columnas activadas: Nivel de calidad, CTR prev., Exp. página destino, Relevancia del anuncio
> - **QS 10 PERFECTO:** `[jardines del sur 6]` exacta — Superior en TODOS los sub-factores, 16.05% CTR, $7.60 CPC, 1 conv $98.85 CPA. Tener QS 10 ya pone la cuenta arriba del 95% del benchmark.
> - **QS 7-8 (8 keywords):** `[casas sadasi cancun]`, `"casas sadasi cancun"`, `[jardines del sur cancun]`, `[grupo sadasi cancun]`, `[altta homes cancun]`, `"altta homes cancun"`, `"sadasi cancun"`, `"jardines del sur cancun"` — todas saludables
> - **QS 5 — patrón detectado:** brand keywords de Sadasi/La Rioja/Lirios tienen "Exp. página destino INFERIOR al promedio". Razón: home no profundiza en "Sadasi" como marca, se siente genérico. **Oportunidad futura:** crear landings dedicadas o cambiar URL final de brand keywords a silos específicos (`/jardines`, `/la-rioja`, `/lirios`).
> - **QS 3 PAUSADA:** `"casa en venta jardines del sur"` frase — Relevancia INFERIOR + Exp INFERIOR. 0 clics 2 impr, era lastre. Si próximamente creamos Grupo B con copy específico, se reactiva.
>
> **D.5 No tocado intencionalmente (esperar 3-5 días):**
> - Fase 4 (Grupos B y C): pospuesta para próxima sesión cuando algoritmo absorba todos estos cambios. Crear ahora ensuciaría learning signal.
>
> **E) Insights de auction insights (Estadísticas de subasta):**
> Florencio lidera impression share con 29% (mejor que ARA, Catania, Inmuebles24, Hogares Unión). PERO solo aparece en top spot 12% del tiempo (amalba.mx 33%, ARA 28%). Oportunidad: subir bid en MVPs para ganar top spot.
>
> **F) Datos demográficos confirmados:**
> - 25-34 años lidera (~18 clics), 18-24 segundo lugar, 35-44 tercero
> - Sweet spot 18-44 años (target ideal real estate)
> - Para Grupo B futuro: bid +10% en 25-44, -50% en 55+
>
> **G) Estimación de impacto esperado (próximos 3-5 días):**
> | Métrica | Antes | Esperado |
> |---|---|---|
> | CTR | 8.07% | 12-15% |
> | CPC promedio | $8.91 | $6-7 |
> | CPA | $186 | $110-140 |
> | Términos basura | ~37% gasto | <10% |
>
> **⏳ Pendientes claros para próxima sesión (30 may o después):**
> 1. **Aclarar FOVISSSTE** — ¿se acepta en JdS6 o La Rioja 2 o en ninguno? Esto desbloquea limpiar prompts Meta AI + anuncios Google Ads + descripciones GBP.
> 2. **Crear GBP La Rioja 2** (misma fórmula Lirios 2: "La Rioja 2 Cancún - Asesor Autorizado Altta Homes", Agente inmobiliario, dirección del pabellón La Rioja 2 que Florencio debe pasar).
> 3. **Pasar negatives de nivel Grupo a nivel Campaña** (5 min) — para que cubran Grupos B y C futuros.
> 4. **Etiquetar las 7 URLs de productos** del catálogo WhatsApp con su modelo correspondiente, después actualizar `meta-ai-prompt-whatsapp-v3.txt` con esa data.
> 5. **Después de 3-5 días de espera:** revisar métricas reales post-optimización. Si CPA bajó a $110-140 como esperado → Fase 4 (Grupos B y C).
> 6. **Evento Lead en Meta Pixel** (10-15 min) — sigue pendiente desde sesión 25.
> 7. **Verificación de dominio en Meta** para tracking iOS — sigue pendiente.
> 8. **Fresno Elite sitelink** — vigilar si revivimos en futuro o lo dejamos pausado permanente.
> 9. **Vigilancia 24/7 callout (CTR 2.90%)** — re-evaluar en 7-14 días cuando tenga 500+ impr.
> 10. **Brand verification en Google Ads** (logo subido hoy) — esperar 1-2 sem aprobación, luego favicon aparece en anuncios.
> 11. **Fotos presenciales Lirios 2** — cuando Florencio visite el pabellón.
> 12. **Considerar:** mejorar landing page para keywords brand (Sadasi/La Rioja/Lirios) → mejoraría QS de 5 a 7-8.
>
> **Detalle completo de la sesión en `google-ads.md` sección "🚀 SESIÓN 26 — Optimización integral (29 may 2026)" + entradas de memoria actualizadas (user_florencio_role, project_meta_pixel).**

> **✅ COMPLETADO sesión 25 (28 may 2026) — CIRUGÍA Google Ads: rescate de keywords + Pixel valida con 1 lead real:**
>
> **A) Meta Pixel — VALIDADO en producción al final de la sesión ✅:**
> Verificación realizada via Meta Events Manager (no extensión) — eventos PageView llegando correctamente al dataset `Jardines del Sur Cancún - Web` (Pixel ID 2016457592282966). El setup de sesión 24 (HTML personalizado vía GTM v3) funciona sin tocar código del sitio. Cross-check adicional: Google Ads "Embudo de clientes potenciales" mostró **3 conversiones** (clicks a wa.me) entre 22-28 may, de las cuales **1 llegó como WhatsApp real** (33% click-to-message rate, healthy). Tracking de ambos sistemas confirmado en producción.
>
> **B) Detectado problema MAYOR en Google Ads — usuario aceptó 6 recomendaciones malas desde celular:**
> Entre **23 may 21:18 y 27 may 21:16**, el usuario aceptó (desde móvil, sin entender que eran trampas):
> 1. **+26 keywords en concordancia AMPLIA** (en 4 batches del 23 may + 1 del 27 may)
> 2. **-21 exactas + -7 frase BORRADAS el 27 may 21:16** ("Recomendación: Palabra clave redundante" — Google sugirió "limpiar" porque las amplias hacían "redundantes" a las exactas, lógica invertida)
>
> **Estado al detectar:** 0 exactas, 12 frase, 26 amplia. ~24h corriendo con setup tóxico, ~$87-100 MXN potencialmente desperdiciados.
>
> **C) Rescate ejecutado vía Historial de cambios → Deshacer (6 clicks, 5 min):**
> En lugar de restaurar/eliminar a mano (plan original con listas de 21 ex + 7 fr a re-agregar + 26 amplia a borrar), se usó el botón `Deshacer` de cada cambio malo en el Historial. Resultado idéntico, sin riesgo de typos, 20 min menos de trabajo.
>
> **Estado post-rescate:** 21 exactas + 19 frase + **0 amplia** = 40 keywords correctas. ~10 en "No apta - publicación limitada" (normal en brand nicho, Google reactiva con búsquedas reales).
>
> **D) Insight clave del rescate — cuánto se desperdiciaba en amplia:**
> | Métrica | Grupo (con amplia hist.) | Keywords actuales (limpias) | Atribuible a amplia |
> |---|---|---|---|
> | Clicks | 59 | 32 | **27 desperdiciados** |
> | Costo | $480 | $304 | **$176 quemados** |
> | Conversiones | 3 | 3 | **0** |
> | CPA | $160 | **$101** | — |
>
> **37% del presupuesto se quemaba en clicks irrelevantes via amplia, con CERO conversiones.** Rescate bajó CPA real de $160 → $101.
>
> **E) MVPs identificadas (las que sí convierten):**
> - `"residencial jardines del sur"` (frase) — CPA **$12.90** 🥇 (joya escondida — considerar variantes próxima sesión)
> - `[lirios residencial 2]` (exacta) — CPA **$25.38** 🥈
> - `[jardines del sur 6]` (exacta) — CPA $89.14 🥉
>
> **F) Lecciones grabadas (en `google-ads.md` sección "CIRUGÍA EXITOSA — Rescate de keywords" + memoria persistente):**
> 1. **NUNCA aceptar recomendaciones de Google Ads desde celular** — botones grandes facilitan toques accidentales
> 2. **"Nivel de optimización" mide OBEDIENCIA con Google, NO calidad** — 70-80% es saludable cuando rechazas trampas
> 3. **Aplicación automática SIEMPRE desactivada**
> 4. **Para revertir errores:** Historial de cambios → Deshacer es más limpio que restaurar a mano (funciona ~90 días)
> 5. **Recomendaciones siempre malas:** IA Max, Cambia a amplia, Aplicar todo, Quita keywords redundantes, Performance Max, Sube presupuesto, Agrega keywords nuevas (Google sugiere genericas no brand)
>
> **⏳ Pendiente al cerrar sesión 28 may:**
> 1. **Desactivar "Aplicación automática"** en Resumen (todas opciones desmarcadas, especialmente amplia + redundantes)
> 2. **Descartar individualmente** las recomendaciones malas activas (3 puntitos → Descartar → "No es relevante")
> 3. **Continuar con Meta Pixel:** verificación producción + evento Lead + verificación dominio
> 4. **Monitorear 3-5 días:** CPA real debería estabilizarse en $80-110 con keywords limpias
>
> **Detalle completo en `google-ads.md` sección "🚨 CIRUGÍA EXITOSA — Rescate de keywords (28 may 2026)".**

> **✅ COMPLETADO sesión 24 (27 may 2026 madrugada) — Meta Pixel base instalado vía GTM:**
>
> **Pixel ID:** `2016457592282966` · **Dataset:** `Jardines del Sur Cancún - Web` · **Versión GTM publicada:** `v3 - Meta Pixel Base Code` (27/05/2026, 0:20)
>
> **Método:** HTML personalizado en GTM container `GTM-53BHDRWC`, trigger `All Pages`. **CERO cambios al código del sitio** — todo vía GTM como estaba planeado en sesión 23. La etiqueta convive sin conflicto con las 2 existentes (Etiqueta de Google AW-18157218280 + WhatsApp Click conversion).
>
> **Configuración del dataset:**
> - Cuentas publicitarias conectadas: las 3 que tiene el usuario (Florencio Real Estate `8254358097993589`, Jardines del Sur Cancún `1520643452585889`, Marketing Real Estate `2180108582737946`) — el usuario eligió "Las 3, por si acaso" para flexibilidad futura
> - Coincidencias avanzadas automáticas: ACTIVADAS (sin impacto inmediato porque el sitio no tiene formularios de email/teléfono; future-proof para cuando se agregue uno)
> - CAPI (API de conversiones): DESACTIVADA — fase 3 (requiere endpoint server-side en Next.js)
> - Categorías sensibles: NINGUNA (real estate no aplica)
>
> **Verificación en modo Preview (Tag Assistant):** Las 3 etiquetas dispararon correctamente. `Meta Pixel - Base Code` activado en page load, `WhatsApp Click` activado al clickear botón wa.me (sin regresión), `Etiqueta de Google AW-18157218280` sin cambios. Warning amarillo de "Dominio desconocido whatsapp.com" es esperado (al clickear wa.me redirige a whatsapp.com fuera del dominio monitoreado) y NO indica error.
>
> **⏳ Pendientes para próxima sesión (28 may o después):**
> 1. **Verificar Pixel en producción** (5 min) — Chrome incógnito + extensión Meta Pixel Helper en `https://jardinesdelsurcancun.mx`. Esperado: ícono AZUL con `1` + Pixel ID `2016457592282966` + evento `PageView`. Si está gris diagnosticar caché, ad blocker, propagación.
> 2. **Evento `Lead` en click WhatsApp** (10-15 min) — crear segundo tag HTML personalizado con `<script>fbq('track', 'Lead');</script>`, reusar trigger existente `Click - WhatsApp wa.me`. Usar evento ESTÁNDAR `Lead` no `trackCustom` (mejor matching y optimización). Beneficios: métrica real de leads, audiencia warm para retargeting dedicado.
> 3. **Verificación de dominio en Meta** (10 min) — importante para iOS 14+ (Aggregated Event Measurement). Business Settings → Brand Safety → Domains → Add `jardinesdelsurcancun.mx`. Método DNS TXT no requiere tocar código; método meta-tag requiere agregar `<meta name="facebook-domain-verification" content="..." />` en `app/layout.tsx`.
> 4. **Audiencia de retargeting** (cuando hayan ~100 visitantes acumulados, ~1-2 semanas) — Meta Ads Manager → Audiencias personalizadas → "Tráfico del sitio web" → todos los visitantes últimos 30 días. Naming: `JdS - Web Visitors 30d`.
> 5. **Primera campaña retargeting Meta** (cuando audiencia ≥ 1,000 usuarios) — usar banner 3780×1890 que el usuario ya tiene (sesión 19, 21 may) + variantes con highlights de modelos. Presupuesto sugerido $50 MXN/día (complemento de Google Ads, no reemplazo).
> 6. **CAPI** (mes 2+, fase 3) — endpoint server-side en `app/api/meta-capi/route.ts` para tracking confiable en iOS/ad blockers.
>
> **Detalle completo del flujo + pendientes en `google-ads.md` sección "✅ COMPLETADO — Meta Pixel base instalado vía GTM (27 may 2026)".**

> **✅ COMPLETADO sesión 23 (25 may 2026) — Métricas día 2-3 Google Ads + Sitelink WhatsApp + plan Retargeting Meta:**
>
> **Métricas Google Ads acumuladas al 25 may (día 2-3):**
> - 23 clicks · 184 impresiones · CTR **12.5%** (excelente, esperábamos 3-7%) · CPC $10.40 MXN · gasto total $239 MXN
> - Hoy lunes 25 may: 5 clicks · 45 impresiones (día en curso)
> - 0 conversiones registradas — **normal** en días 1-3 de real estate (ciclo de decisión largo, ventana 30 días)
> - Sin WhatsApps de ads todavía — normal. El único contacto fue llamada de GBP (orgánico, Lead #1)
>
> **Nuevo sitelink agregado — "Informes por WhatsApp":**
> - Nivel: **Campaña**
> - Texto: `Informes por WhatsApp`
> - Descripción 1: `Respuesta inmediata con un asesor`
> - Descripción 2: `Sin costo · Cotiza hoy mismo`
> - URL: `https://wa.me/529982059044?text=Hola%2C%20vi%20su%20anuncio%20en%20Google%20y%20quiero%20informes%20sobre%20los%20modelos%20disponibles%20en%20Canc%C3%BAn.`
> - Estrategia: lead de alta intención va directo a WhatsApp sin pasar por el sitio. El texto "vi su anuncio en Google" en el mensaje pre-llenado identifica la fuente manualmente. No registra conversión en GTM (bypass del sitio) — trade-off aceptado porque el lead real vale más que el dato de conversión en esta etapa.
>
> **Extractos de sitio (Fragmento estructurado) — pendiente de aplicar:**
> - Encabezado: `Amenidades`
> - Valores: `Alberca y Casa Club` · `Gimnasio Cerrado` · `Cancha de Pádel` · `Skate Park` · `Dog Park` · `Seguridad 24/7`
>
> **Retargeting Meta — PENDIENTE (configurar en siguiente sesión):**
> - Objetivo: mostrar anuncios de Facebook/Instagram a visitantes del sitio que no convirtieron en WhatsApp
> - Usuario tiene Meta Business Manager con portafolio empresarial, pero nunca ha creado un Pixel de Meta
> - Plan: Administrador de eventos → crear Pixel → obtener ID → instalar en GTM (container `GTM-53BHDRWC`) → publicar → crear audiencia "Visitantes del sitio" → campaña retargeting
> - El Pixel se instala via GTM sin tocar el código del sitio (igual que el tag de Google Ads)
> - Con ~100 visitantes acumulados ya se puede crear la primera audiencia de retargeting
>
> **Próxima revisión (martes 26 may — Día 3 oficial):** Search Terms Report → agregar negativos → evaluar CPA real → decidir Grupo C. Ver `google-ads.md` para detalle.

> **✅ COMPLETADO sesión 22 (24 may 2026) — Google Ads primeros resultados + actualización precios + leyenda precio variable + subtítulo silos dinámico:**
>
> **Google Ads — Días 1 y 2:**
> - Campaña lanzada 23 may ~9pm. Primeras 3 horas: 4 clicks, ~15 impresiones, MXN $84.86 gastados.
> - Regla de flexibilidad 2x: Google puede gastar hasta $200/día cualquier día puntual (compensa en otros días; total mensual ≤ $100×30). El presupuesto de $205 visto en dashboard es normal.
> - Campaña inició como "Apto (limitado)" por pocos keywords → se agregaron 23 keywords de extensión de marca → campaña pasó a "Apto" + en aprendizaje.
> - **Primer lead:** 24 may ~10am — llamada de GBP (Google Business Profile), NO de la campaña. El botón de llamada del perfil de GBP genera llamadas independientes de Google Ads. Lead muy interesado, Florencio envió catálogo y cotizaciones.
> - **TRAMPA EVITADA:** Google sugirió botón "Cambiar keywords a concordancia amplia" — NO hacer nunca. SOLO exacta `[]` y frase `""`.
> - **TRAMPA EVITADA:** Google mostró "Aplicar todo" para 18 sugerencias de keywords (todas en amplia) — NO aplicar. Agregar siempre manualmente en exacta/frase.
> - **Pendiente (usuario hace en browser):** Descartar recomendaciones malas (Performance Max, Display, Socios de búsqueda). Cambiar keywords originales de Amplia → Frase/Exacta en Grupo A.
> - **Revisión Día 3 (26 may):** revisar Search Terms Report, agregar negativos, evaluar CPA real. NO cambiar estrategia de puja hasta tener datos de 3-7 días.
> - Detalle completo en `google-ads.md`.
>
> **Precios actualizados en `data/inventory.json`:**
> - **Capua Jardines del Sur 6:** $1,853,800 → **$1,777,640** MXN
> - **Cedro Plus Jardines del Sur 6:** sin cambio neto → **$2,247,700** MXN (se actualizó y se revirtió en la misma sesión)
>
> **Nueva leyenda precio variable:**
> - Aplica a los 3 modelos con `precio_variable: true`: Capua JDS6, Cedro Plus JDS6, Cedro Plus Lirios 2.
> - **En tarjetas (PropertyCard):** aparece al final de `legalLegend` (mismo bloque que `* Precio no incluye gastos`): `** El precio puede variar según nivel y ubicación`
> - **En páginas individuales (ModelPage hero):** aparece debajo del `heroPriceAmount` en `heroPriceBlock`, usando clase `.heroPriceNote` (texto blanco 50% opacity, 0.62rem italic).
> - **CSS en PropertyCard.module.css:** no hay clase especial — hereda `.legalLegend p` (Lato, 0.72rem, color `rgba(15,23,42,0.78)`).
> - **CSS en model.module.css:** `.heroPriceNote` añadida.
>
> **Subtítulo hero de silos — ahora dinámico (auto-generado desde inventario):**
> - `SiloPage.tsx` calcula al build: total de modelos, conteo por tipo (casas / departamentos), precio mínimo del desarrollo.
> - `SiloHero.jsx` acepta 3 props opcionales: `subtitleBold`, `subtitleBreakdown`, `subtitleDetail`.
> - **Jardines del Sur 6** (mezcla de tipos) → 3 líneas:
>   1. `"6 modelos · Desde $X MXN"` — blanco, bold 800 (`.subtitleDevelopments`)
>   2. `"4 casas y 2 departamentos"` — blanco 72%, semi-bold 600 (`.subtitleBreakdown`, clase nueva en `Hero.module.css`)
>   3. `"Modelos, precios e informes en minutos."` — blanco 55%, light 500 (`.subtitleDetail`)
> - **La Rioja 2 y Lirios** (un solo tipo) → 2 líneas: sin `subtitleBreakdown`, `subtitleDetail` viene de `dev-content.ts`.
> - Al cambiar precios en `inventory.json` y hacer deploy, el subtítulo se actualiza solo. Cero mantenimiento.

> **✅ COMPLETADO Google Ads launch (23 may 2026):** Tracking y primera campaña Search quedaron publicados. GTM `GTM-53BHDRWC` tiene la conversión `WhatsApp Click` verificada con Tag Assistant y publicada en producción. Campaña Google Ads `Cancún - Search - Casas y Deptos - v1` quedó **apta/en aprendizaje**, con `MXN 100/día`, objetivo `Clientes potenciales`, estrategia `Maximiza las conversiones`, ubicación `Cancún`, idioma `Español`, horario 24/7, sin Display, sin Performance Max, sin IA Max y sin concordancia amplia automática. Conversión optimizada: clicks a WhatsApp desde el sitio. No aplicar recomendaciones automáticas de Google al inicio; revisar métricas reales después de 3-7 días. Detalle completo en `google-ads.md`.

> **✅ COMPLETADO sesión 21 (22 may 2026 — tarde) — Refinamiento Distribución + validación PageSpeed:** Continuación de sesión 20. Cambios:
> - **Stats overview en Distribución**: Agregada barra de stats con iconos arriba de los niveles (recámaras + baños + m² construcción + m² terreno + niveles). CSS `.distStats`, `.distStat`, `.distStatIcon`, `.distStatValue`, `.distStatLabel`. Para deptos sin terreno, ese stat se omite. Para modelos `metros_construccion_variable: true`, label dice "m² constr. (desde)".
> - **Subtitle del hero removido**: el subtitle "X recámaras · Y baños · Z niveles + m² construcción · m² terreno" se eliminó del hero del modelo. Esa info se movió completa al stats overview de la Distribución section. El hero ahora es más limpio: título → bloque de precio → CTAs.
> - **Description uniforme en Distribución**: cambiada de "Distribución por nivel del modelo [X]" / "Distribución completa del modelo [X]" a SIEMPRE "Distribución completa del modelo {strippedName}". Usa `strippedName` (que ya quita el prefijo "Casa"/"Departamento") para no repetir el tipo. Antes decía cosas como "del modelo Departamento Cedro Plus" — redundante; ahora dice "del modelo Cedro Plus".
> - **Niveles renombrados a español natural**: en lugar de "NIVEL 1", "NIVEL 2", "NIVEL 3" ahora se usan nombres naturales del sector real estate mexicano:
>   - Nivel 1 → **"Planta Baja"**
>   - Nivel 2 → **"Planta Alta"**
>   - Nivel 3 → **"Tercer Nivel"**
>   - Para 1 solo nivel (deptos): sigue siendo "Espacios"
>   - Lógica: `const levelNames = ["Planta Baja", "Planta Alta", "Tercer Nivel"];` en ModelPage.tsx.
> - **Cedro Plus pill actualizado**: Roof garden ahora incluye metraje. "Roof garden (sólo N3)" → **"Roof garden N3 · 121.13 m²"**. Aplica a ambos: `jds6-cedro-plus` y `lirios2-cedro-plus` (replace_all en inventory.json).
> - **PageSpeed validado** en 3 tipos de página post-cambios:
>   - Home (`/`): **95 mobile / 97 desktop** ✅
>   - Silo La Rioja (`/la-rioja`): **93 mobile / 100 desktop** 🏆
>   - Modelo Capua (`/capua`): **94 mobile / 81 desktop** (desktop baja por iframe Lapentor cargando con CSS bootstrap/font-awesome de terceros — no controlable; mobile 94 sigue elite por usar preview+modal en vez de iframe directo)
>   - **Conclusión**: mobile uniformemente 93-95 (top 1% del sector). Quality Score Google Ads garantizado en máximo. Desktop 81 en modelos es por Lapentor de terceros, no afecta Quality Score significativamente.

> **✅ COMPLETADO sesión 20 (22 may 2026) — Sistema de descuentos + redesign hero modelo + catálogo amenidades:** Sesión muy productiva. Todos los 11 modelos ahora muestran "Valor avalúo + Precio con descuento" en cards y heroes. Hero del modelo rediseñado a 3 divisiones limpias.
>
> **1. Sistema de descuentos en inventory.json:** Agregado campo opcional `valor_avaluo?: number` a `InventoryProperty` (en `model-utils.ts`). Aplicado a TODOS los 11 modelos:
> - **Jardines del Sur 6**: Capua ($2,330k → $1,853,800), Cedro Plus ($2,920k → $2,247,700), Flamboyán ($2,621k → $2,225,850), Ceiba ($3,230k → $2,602,050), Tabachín ($3,300k → $2,664,750), Noni ($3,850k → $3,161,125)
> - **La Rioja 2**: Fresno Elite ($5,350k → $4,294,950), Modelo Álamo ($5,820k → $4,436,025), Noni Elite ($5,980k → $4,446,997.50), Noni ($4,490k → $4,049,375)
> - **Lirios Residencial 2**: Cedro Plus ($2,915k → $2,248,750)
>
> **2. Flag separado `precio_variable?: boolean`** (en `model-utils.ts`): Distinto a `metros_construccion_variable`. Controla si el label dice "Precio con descuento **desde**" (variable por nivel) vs "Precio con descuento" (fijo). Aplicado a los 3 deptos: Capua (m² fijos 85.34 pero precio varía por nivel), Cedro Plus Jardines (m² + precio variables), Cedro Plus Lirios (m² + precio variables). Para deptos con `precio_variable` se muestra el MAX avalúo (precio anclado más alto) y el MIN precio neto (precio más atractivo) como rango "desde". Casas no llevan `precio_variable` (precio fijo por modelo).
>
> **3. PropertyCard.jsx refactor mayor:** Soporta 3 layouts según el contexto:
> - **Layout centrado** (`hasDiscount === true`): nuevo `.headerCentered` con `.modelNameFull` (nombre completo) + `.priceAvaluoCentered` (avalúo inline con divider gold sutil 1px) + `.priceFinalRow` (label "Precio con descuento [desde]" + amount gold prominente).
> - **Layout split** (`hasSplitHeader && !hasDiscount`): wrapper `.titleCol` (modelType + modelName) a la izquierda + `.priceCol` (label "Desde" + amount) a la derecha, ambos como flex columns. Antes era CSS grid 2x2 que rompía con avalúo.
> - **Layout simple** (raro): h3 + priceBlock como antes.
> - Lógica del label: `hasDiscount ? "Precio con descuento (desde)" : isDepartamento ? "Desde" : ""`. Casas sin avalúo no muestran label (solo precio).
>
> **4. Hero del ModelPage rediseñado a 3 divisiones:**
> - **División 1: Specs unificados** — subtitle ahora tiene 2 líneas (`.subtitleLine`): línea 1 "X recámaras · Y baños · Z niveles" + línea 2 "X m² construcción · Y m² terreno". La 2da línea con color muted (62% opacity blanco). Border-bottom 1px sutil para separar.
> - **División 2: Precio (`.heroPriceBlock`)** — flex column centered, sin background ni borde rectangular (versión simplificada). Contiene: `.heroAvaluoLine` (inline "Valor avalúo $X MXN" gris), `.heroPriceLabel` (uppercase accent-2 gold "Precio con descuento [desde]"), `.heroPriceAmount` (gradient gold prominente 2.1rem con `.heroPriceCurrency` MXN sutil).
> - **División 3: CTAs** — sin cambios.
> - **Eliminado**: el viejo `.heroStats` con CONSTRUCCIÓN/TERRENO como stats separados con icon borders. Ahora los m² están en el subtitle.
> - **Pill verde "Ahorras $X"**: probado pero removido a petición del usuario (se veía "tienda de descuentos", no premium real estate).
>
> **5. Descripciones de amenidades para catálogo WhatsApp Business:** Generadas 3 versiones (1 por desarrollo) enfocadas SOLO en amenidades (no en datos de modelos), porque las colecciones del catálogo YA están organizadas por desarrollo y los modelos individuales se ven aparte. Cada entry funciona como "complemento" del desarrollo. Títulos del estilo "Amenidades · Jardines del Sur 6" para que el cliente entienda inmediatamente.

> **Nota fix link "Contacto" en drawer mobile (sesión 19, 21 may 2026):** En `components/SiteHeader.jsx` línea 185, el link "Contacto" del drawer mobile (el que aparece cuando `isInSiloContext === true`, es decir en páginas de silo o modelo) estaba apuntando a `/#contacto` (URL absoluta al home). Esto **rompía la experiencia**: el usuario estaba en `/capua` o `/jardines`, hacía click en Contacto del menú móvil, y lo sacaba de la página actual al home + scroll. **Fix**: cambiado a `#contacto` (relativo). Ahora scrollea al footer de la página actual sin navegar. Funciona porque las 3 páginas (home, silo via SiloPage.tsx, modelo via ModelPage.tsx) ya tienen `<footer id="contacto">`. La línea 200 del mismo archivo (drawer que aparece solo en home) y la línea 83 (desktop nav que también solo aparece en home) NO se tocaron porque ahí `/#contacto` apunta a la misma página (home), funciona igual.

> **Nota home AmenitiesSection refactor a "Best Of" curado (sesión 19, 21 may 2026):** Cambio del `DEFAULT_ITEMS` en `components/AmenitiesSection.jsx`. **Antes**: 6 tiles genéricos sin tag de desarrollo claro (alberca generic, gimnasio, área infantil, cancha, gimnasio exterior, vista aérea sin label). **Después**: 6 tiles curados con tag explícito por desarrollo:
> 1. ALBERCA Y CASA CLUB · Jardines del Sur 6 (large) — `/optimized/amenidades/alberca.webp`
> 2. ALBERCA · La Rioja 2 (tall) — `/larioja2/amenidades/alberca.webp`
> 3. SKATE PARK · Jardines del Sur 6 (normal) — `/jardines/amenidades/skate-park.webp`
> 4. DOG PARK · La Rioja 2 (normal) — `/larioja2/amenidades/dog-park.webp`
> 5. PÉRGOLAS Y REUNIÓN · Lirios 2 (normal) — `/lirios/amenidades/pergolas.webp`
> 6. ACCESO CON VIGILANCIA 24/7 · La Rioja 2 (wide) — `/larioja2/amenidades/acceso.webp`
>
> **Distribución 2-2-1-1**: 2 Jardines + 2 La Rioja (más 1 wide de La Rioja = 3) + 1 Lirios. La Rioja queda más representada porque es el dev premium y el más caro ($4M+). **Razón del cambio**: el home antes tenía amenidades genéricas que no diferenciaban entre los 3 desarrollos. Ahora cada tile menciona el dev específico → genera curiosidad → click hacia el silo correspondiente. **Wide tile reemplazado** de "vista aérea drone" a "acceso La Rioja 2" porque la vista aérea ya está usada como slide 1 del hero de La Rioja (evita duplicación) + el acceso comunica seguridad + brand visible. El **lightbox heredado funciona automáticamente** con las nuevas imágenes — todas son clickeables con prev/next + teclado + caption.

> **✅ COMPLETADO sesión 19 (21 may 2026) — Sitio feature-complete en los 3 silos:** Las 3 secciones de amenidades + las 3 descripciones "Sobre [Dev]" fusionadas premium + lightbox global en TODAS las amenidades + heroes optimizados. Detalles:
>
> **AmenitiesSection — Jardines del Sur 6**:
> - 5 tiles masonry: Alberca y Casa Club (large), Gimnasio Cerrado (tall), Juegos Infantiles (normal), Skate Park (normal), Áreas Verdes (wide)
> - Imágenes nuevas convertidas a WebP en `/public/jardines/amenidades/`: alberca (160KB), gimnasio (72KB), juegos-infantiles (258KB), skate-park (91KB), areas-verdes (215KB)
> - 6 extras pills: Caseta de seguridad, Área de usos múltiples, Canchas deportivas, Área para mascotas, Ejercitadores al aire libre, Estacionamiento de visitas
> - Trust row custom: 50 años Sadasi · 430,000+ viviendas · 6 modelos · 11 amenidades
>
> **AmenitiesSection — La Rioja 2**:
> - 5 tiles masonry: Alberca (large), Gimnasio (tall), Parque Principal (normal), Área para Mascotas (normal), Acceso con Vigilancia 24/7 (wide)
> - Imágenes nuevas convertidas a WebP en `/public/larioja2/amenidades/`: alberca (142KB), gimnasio (66KB), areas-verdes (190KB), dog-park (177KB), acceso (70KB)
> - 4 extras pills: Cancha de Pádel, Área de calistenia, Área de usos múltiples, Estacionamiento para visitas
> - Trust row custom: 50 años Sadasi · 430,000+ viviendas · 4 modelos premium · 24/7 vigilancia
>
> **Descripciones "Sobre [Dev]" fusionadas** (oficial Altta Homes + data específica):
> - **Jardines del Sur 6**: hook "oasis de estilo y serenidad" + 50 años Sadasi + 6 modelos + Smart Home + tagline cierre "Vivir con estilo es… vivir en Jardines del Sur."
> - **La Rioja 2**: hook "Sé parte de la historia" + plusvalía + experiencias inolvidables + 4 modelos nombrados + tour 360° + amenidades específicas (alberca, gimnasio, dog park, pádel, 24/7)
> - **Lirios Residencial 2**: ya estaba fusionado en sesión 14 (Av. 135, Santuario, "Un moderno fraccionamiento")
>
> **Heroes optimizados**:
> - Lirios: hero actualizado a `acceso-lirios-2-residencial.jpg` con branding "LIRIOS 2" visible (46KB, -36% peso vs anterior). Pérgolas movidas a `/lirios/amenidades/pergolas.webp` para mantener tile de amenidades consistente.
> - La Rioja 2: hero ahora carousel Ken Burns con 2 slides — vista aérea drone (foto real, prueba de entrega) + acceso render (branding + identidad). El componente HeroBackground ya soportaba múltiples slides con rotación. Mobile mantiene single image para LCP. Slide 2 carga lazy a 4.2s.
> - Jardines del Sur 6: hero mantiene `alberca-desktop.webp` (la decisión fue NO cambiar — la foto profesional con golden hour y casa club naranja es muy fuerte; la imagen "Alberca y Casa Club" del set nuevo se usa en su lugar como tile de amenidades).
>
> **Lightbox global en AmenitiesSection (sesión 19, 21 may 2026):** Componente `AmenitiesSection.jsx` ahora tiene lightbox completo igual al de la galería de modelo. Patrón: `useState(lightboxIndex)` + `useEffect(mounted)` para portal + `useEffect(keyboard + scroll lock)` + `useCallback(prev/next)`. Cada tile se convirtió de `<div>` a `<button type="button">` clickeable con `cursor: zoom-in` + `outline focus-visible`. Render con `createPortal(jsx, document.body)` para escapar cualquier stacking context. Lightbox tiene: overlay rgba(5,10,20,0.95), botón close, contador "X / Y" arriba, imagen `next/image` con `fill + priority`, **caption con label + desc** debajo (la galería de modelo no tiene caption, solo el lightbox de amenidades), flechas ‹ › laterales con teclado ← → / Escape. Aplica AUTOMÁTICAMENTE a las 4 secciones de amenidades (home + 3 silos). Clases CSS nuevas: `.lbOverlay`, `.lbClose`, `.lbCounter`, `.lbContent`, `.lbImage`, `.lbCaption`, `.lbNav`, `.lbNavLeft`, `.lbNavRight` + media query mobile para flechas más cercanas al borde.

> **Nota banner WhatsApp/Facebook del usuario (sesión 19, 21 may 2026):** El usuario armó un banner profesional 3780×1890 (ratio 2:1 ideal para Facebook Cover) con: 8 fotos de propiedades estilo polaroid + logo Sadasi 50 años + Altta Homes + 3 desarrollos (Jardines del Sur 6, La Rioja 2, Lirios Residencial 2) + foto personal circular con fondo blanco + saco oscuro. Diagnóstico: profesional, brand hierarchy clara, símetrico, listo para FB/IG/WhatsApp Business. No requiere cambios.

> **Nota hero Lirios 2 cambiado a imagen de acceso con branding (sesión 18, 21 may 2026):** Sustituida la imagen del hero de Lirios Residencial 2. **Antes**: `areas-comunes-4` (pérgolas/lounge area, 72 KB) — genérica, sin branding visible. **Después**: `acceso-lirios-2-residencial.jpg` (980×653 JPG) → WebP q75 effort:6 → **46 KB** (-36% peso). La nueva imagen tiene el **logo "LIRIOS 2" visible** + caseta de control de acceso + arquitectura moderna del desarrollo, comunicando identity + security + escala en un solo shot.
> - **Mismo aspect ratio** (1.5:1, 980×653) → no CLS, mismo efecto Ken Burns hereda desde Hero component.
> - **Fix paralelo**: la imagen de pérgolas estaba siendo usada DOS veces (hero + tile "Pérgolas y Áreas de Reunión" en amenidades), ambas apuntando a `/optimized/hero/hero-lirios.webp`. Al cambiar el hero a acceso, el tile de amenidades quedaría inconsistente. Solución: re-convertí `areas-comunes-4-lirios-2-residencial.jpg` a `/public/lirios/amenidades/pergolas.webp` (72 KB) y actualicé `dev-content.ts` para que el tile apunte ahí. Hero independiente de amenidades.
> - **Estado actual** (3 ubicaciones que usaban la imagen de pérgolas):
>   - `/optimized/hero/hero-lirios.webp` → **acceso** (nuevo hero)
>   - `/lirios/amenidades/pergolas.webp` → **pérgolas** (tile masonry de amenidades)
>   - `/lirios/cedro-plus/1.webp` → **pérgolas** (image #1 de la galería del modelo, copia hecha previamente)
> - **Mejora LCP esperada** en `/lirios` por 26 KB menos de hero image.

> **Nota Search Console "Error de redirección" — falso positivo (sesión 18, 21 may 2026):** Search Console marcó `https://jardinesdelsurcancun.mx/desarrollos-cancun/jardines-del-sur-6/` (con trailing slash) como "Error de redirección" detectado el 16 may. **Verificación con curl confirma que el redirect funciona correctamente HOY**: 301 → URL sin slash → 200 OK. Solo 1 redirect, sin loop, sin cadena larga. El error está obsoleto — probablemente Googlebot llegó durante los deploys de mayo 15-16 cuando estábamos editando `firebase.json` y captó un momento inconsistente. **Acción**: el usuario debe click "VALIDAR CORRECCIÓN" en Search Console para que Google re-rastree. Tarda 1-2 semanas en validar. Aplica al mismo botón para otras URLs en el mismo reporte si tienen el mismo origen temporal.

> **Nota refactor hero pages de modelo — eyebrow específico + H1 "Modelo [Name]" (sesión 17, 20 may 2026):** Mejora visual + SEO en el hero de las 11 páginas de modelo. **Cambios principales en `_lib/ModelPage.tsx`**:
> - **Eyebrow refactorizado**: antes `"CASA · CANCÚN"` (genérico, redundante con keywords ya presentes en H1/breadcrumb/title). Ahora se computa específico por modelo+dev en 2 partes (`eyebrowMain` + `eyebrowSub`):
>   - Casa: `"CASA RESIDENCIAL · [DEV.NAME.toUpperCase()] · POLÍGONO SUR CANCÚN"`
>   - Departamento: `"DEPARTAMENTO · [DEV.NAME.toUpperCase()] · POLÍGONO SUR CANCÚN"`
>   - Ejemplo Tabachín: `"CASA RESIDENCIAL · JARDINES DEL SUR 6 · POLÍGONO SUR CANCÚN"` (58 chars, el más largo)
> - **Análisis SEO documentado**: el cambio NO afecta SEO porque los keywords "casa" y "Cancún" ya están en H1, metaTitle, breadcrumb, metaDescription, URL slug y JSON-LD. El nuevo eyebrow SUMA "polígono sur" (keyword con volumen de búsqueda en Cancún) sin restar nada.
> - **H1 cambiado**: antes `<h1>Casa Tabachín<br/><em>en Jardines del Sur 6</em></h1>` (white + gold em). Ahora `<h1>Modelo Tabachín</h1>` plain. Lógica: `strippedName = nombre_modelo.replace(/^(Casa|Departamento)\s+/i, "")`, luego `heroTitle = stripped.startsWith("modelo ") ? stripped : "Modelo " + stripped`. Maneja el caso "Casa Modelo Alamo" correctamente (no genera "Modelo Modelo Alamo").
> - **JSX de eyebrow** ahora son 4 spans: `.eyebrowDot`, `.eyebrowMain`, `.eyebrowSep` (` · ` para desktop), `.eyebrowSub`. Permite display responsivo distinto.

> **Nota CSS responsive eyebrow desktop vs mobile (sesión 17):** El eyebrow tiene dos presentaciones según el viewport:
> - **Desktop (>768px)**: pill dorado completo con todo en una sola línea, igual al diseño original. Incluye `.eyebrowDot` (punto dorado al inicio), `.eyebrowMain`, ` · ` separador, `.eyebrowSub`. Background `rgba(209, 146, 0, 0.12)` + border dorado.
> - **Mobile (≤768px)**: pill removido completamente. `background: transparent; border: none; padding: 0; flex-direction: column;`. `.eyebrowDot` y `.eyebrowSep` ocultos. `.eyebrowMain` y `.eyebrowSub` en `display: block` (2 líneas centradas). Font-size unificado a `0.72rem`, letter-spacing `0.14em`. Esta config aplica uniformemente a casas y deptos — no se necesita variante específica por tipo porque "JARDINES DEL SUR 6" en casas también se desborda con el tamaño original 0.78rem.
> - **Iteración**: inicialmente probé 0.65rem (muy pequeño), luego 0.78rem (perfecto para casas cortas pero desbordaba en Jardines y Lirios), luego añadí variante `.eyebrowDepto` para deptos a 0.72rem, finalmente unifiqué TODO a 0.72rem porque "CASA RESIDENCIAL · JARDINES DEL SUR 6" también necesitaba ese tamaño.

> **⚠️ EN PROGRESO — Catálogo WhatsApp Business (sesión 16, 20 may 2026):** Se simplificó el formato del catálogo. El usuario adoptó un patrón hub-and-spoke: catálogo simple (imagen fachada + 4 líneas de info + URL corta) → click → ficha completa en el sitio. Esto es estratégicamente superior porque (1) menos texto = mejor UX mobile, (2) actualización en un solo lugar (el sitio), (3) tracking GTM funciona normal en cada click, (4) curiosity gap aumenta CTR. **Formato final establecido por el usuario** (incluye "4 Niveles" en deptos para clarificar arquitectura del edificio):
> ```
> [Nombre Modelo]
> Desde $X,XXX,XXX MXN
>
> [4 Niveles (solo deptos)]
> N recámaras · N baños · N niveles
> X m² construcción [· X m² terreno]
> [Featured highlight]
>
> Ver ficha y recorrido virtual 👇
> https://jardinesdelsurcancun.mx/<slug>
> ```
> **Listas ya generadas** (10 de 11): Capua, Cedro Plus Jardines, Cedro Plus Lirios, Flamboyán, Ceiba, Tabachín, Noni Jardines, Fresno Elite, Modelo Álamo, Noni Elite, Casa Noni (La Rioja). **Falta**: ninguna casa pendiente — todas las 11 descripciones generadas. Si el usuario quiere variaciones (más corto o más largo), ya está el patrón establecido.

> **Nota fix preload warning en consola (sesión 16, 20 may 2026):** El preload de `alberca-desktop.webp` y `alberca-mobile.webp` estaba en `app/layout.tsx` (root layout) lo que hacía que se ejecutara en TODAS las páginas, incluyendo silos y modelos donde esa imagen no se usa. Browser tiraba warning "preloaded but not used within a few seconds". **Fix**: removidos los `<link rel="preload">` del `<head>` en `app/layout.tsx` y movidos al JSX de `app/page.tsx` (home only). React 19 hoistea automáticamente los `<link>` tags al `<head>` del documento. Resultado: home sigue precargando hero correctamente; silos y modelos ya no descargan ~50 KB innecesarios + console limpia + sin penalización en Lighthouse "Best Practices".

> **Nota Firebase redirects para URLs cortas (sesión 15-16):** Creados redirects 301 en `firebase.json` para resolver dos problemas: (1) WhatsApp Business Catalog tiene límite de caracteres en el campo de enlace, (2) WhatsApp rechaza URLs con `#` en el string (validación regex). Por eso se hicieron DOS sets de redirects:
> 1. **URLs cortas al modelo (top de página)**: `/capua`, `/cedro-plus`, `/flamboyan`, `/ceiba`, `/tabachin`, `/noni`, `/fresno-elite`, `/alamo`, `/noni-elite`, `/noni-la-rioja`, `/lirios-cedro`, más silos `/jardines`, `/la-rioja`, `/lirios`.
> 2. **URLs cortas DIRECTO al tour 360°**: `/tour-capua`, `/tour-cedro-plus`, `/tour-flamboyan`, `/tour-ceiba`, `/tour-tabachin`, `/tour-noni`, `/tour-fresno-elite`, `/tour-alamo`, `/tour-noni-elite`, `/tour-noni-la-rioja`, `/tour-lirios-cedro`. El destination del 301 incluye `#recorrido` que el browser preserva al hacer redirect → llega directo al tour.

> **Nota correcciones masivas de datos inventario (sesión 15-16, 19-20 may 2026):** El usuario hizo correcciones importantes a los datos oficiales (de los planos/sales sheets de Altta Homes) que estaban inexactos en `inventory.json`:
>
> **Jardines del Sur 6**:
> - **Cedro Plus**: precio $2,100,000 → **$2,247,700**, m² 104.00 → **104.06** estándar, agregado `metros_construccion_variable: true`, agregado "Roof garden (sólo N3)" al level desc. N3 tiene 121.13 m² con roof garden.
> - **Flamboyán**: amenidades_key "2.5 Baños" → **"3 Baños"** + agregado "Vestidor". Level 1 corregido: el baño completo de PB está en **área común (sala)**, no dentro de la recámara. Layout final: PB con 1 recámara sin baño propio + baño común; N2 con principal (con baño + vestidor) + secundaria con baño. Total 3 baños completos, 3 recámaras.
>
> **La Rioja 2** (TODOS los modelos corregidos con layout oficial detallado):
> - **Fresno Elite**: precio $4,446,997 → **$4,294,950**, m² 194.80 → **191.70**, terreno 120 → **150**, **DE 3 NIVELES A 2 NIVELES** (era error), baños 3.5 → **2.5**. Layout PB: estacionamiento 2 autos, **recibidor con doble altura**, cocina con alacena, sala-comedor, medio baño, cuarto de lavado, patio posterior con terraza. Layout PA: estancia TV, baño completo, principal con baño privado + closet-vestidor, 2 secundarias con closet.
> - **Modelo Álamo**: m² 200.00 → **200.20**. Layout corregido: PB con estacionamiento 2 autos, medio baño, sala, comedor, **cocina con alacena**, cuarto de lavado, patio posterior con terraza. PA con principal (baño privado + vestidor), **2 secundarias CADA UNA con baño privado**, estancia TV, terraza. Total **3.5 baños** (correcto), 3 recámaras, cada una con su baño privado.
> - **Noni Elite**: precio $4,294,950 → **$4,446,997.50** (es el más caro ahora), m² 191.70 → **194.80**, **AHORA SON 3 NIVELES** (era 2). Baños 2.5 → **3.5**. Layout: PB con estacionamiento 2 autos, recibidor, medio baño, sala, comedor, cocina integral con **barra de granito**, alacena bajo escaleras, cuarto de lavado, patio posterior. 1er nivel: principal con baño + vestidor, 2 secundarias, baño completo, **espacio para home office**. 2do nivel: sala TV, baño completo, terraza al frente.
> - **Casa Noni (La Rioja)**: **MISMA arquitectura que Noni Elite pero sin el 2do nivel** (N3 de Noni Elite). PB + 1er nivel idénticos a Noni Elite. Recámaras 2 → **3** (corregido — antes decía 2 erróneamente). Baños 2.5 (correcto). m² 156.70 sin cambio. Precio $4,049,375 sin cambio. **Galería actualizada**: usa imagen 1 (fachada propia de Casa Noni) + imágenes 5, 6, 9, 2, 4, 7 de Casa Noni Elite (saltó 3 que era duplicada de 2, y 8/10/11 que son del 2do nivel N3 con terraza y sala TV). Total 7 imágenes ahora vs 11 antes.

> **Nota Casa Ceiba — clarificación uso de "Roof Garden" (sesión 16):** El usuario preguntó si está bien decir "Roof Garden" en Ceiba N3 cuando ese nivel también tiene una recámara, baño y estancia TV. **Respuesta**: SÍ es correcto. La arquitectura es un "torreón con roof garden" — parte construida (recámara + estancia + baño) + parte descubierta como terraza sobre el techo del N2. La terraza descubierta del N3 está sobre el techo del N2 = roof garden técnicamente correcto. Comparativa con otros modelos: Fresno Elite "Terraza al frente" en PA (NO es roof garden, es terraza techada/cubierta intermedia), Modelo Álamo "Terraza" en N2 (terraza intermedia, no azotea). Solo Ceiba (y Cedro Plus N3) son auténticos roof gardens. Ceiba es el modelo "estrella" diferenciado por este Roof Garden privado vs la competencia.

> **⚠️ EN PROGRESO — Catálogo WhatsApp Business + descripciones de modelos (sesión 15, 20 may 2026):** El usuario está armando el catálogo de WhatsApp Business con cada modelo como producto. Ya generadas las descripciones para: Departamento Capua, Departamento Cedro Plus (Jardines y Lirios), Casa Flamboyán, Casa Ceiba. **Faltan**: Casa Tabachín, Casa Noni (Jardines), Casa Fresno Elite, Casa Modelo Álamo, Casa Noni Elite, Casa Noni (La Rioja). Formato establecido por el usuario:
> ```
> [Nombre Modelo]
> 💰 Precio desde $X,XXX,XXX MXN
>
> ✨ CARACTERÍSTICAS DEL MODELO
> • [items]
>
> Visita virtual👇
> https://jardinesdelsurcancun.mx/tour-[slug]
> ```
> **Importante**: las descripciones reflejan los datos ACTUALIZADOS del `inventory.json` (corregidos durante esta sesión, ver nota siguiente). Próxima sesión: continuar con los modelos faltantes en orden Tabachín → Noni Jardines → modelos de La Rioja 2.

> **Nota Firebase redirects para URLs cortas + tour 360° (sesión 15, 20 may 2026):** Creados redirects 301 en `firebase.json` para resolver el problema de que WhatsApp Business Catalog tiene **límite de caracteres en el campo de enlace** (rechaza la URL larga `/desarrollos-cancun/<dev>/<modelo>` directa). Dos sets de redirects:
> 1. **URLs cortas al modelo (top de página)**: `/capua`, `/cedro-plus`, `/flamboyan`, `/ceiba`, `/tabachin`, `/noni`, `/fresno-elite`, `/alamo`, `/noni-elite`, `/noni-la-rioja`, `/lirios-cedro`, más silos `/jardines`, `/la-rioja`, `/lirios`.
> 2. **URLs cortas DIRECTO al tour 360°** (con anchor `#recorrido` en destination, server-side): `/tour-capua`, `/tour-cedro-plus`, `/tour-flamboyan`, `/tour-ceiba`, `/tour-tabachin`, `/tour-noni`, `/tour-fresno-elite`, `/tour-alamo`, `/tour-noni-elite`, `/tour-noni-la-rioja`, `/tour-lirios-cedro`.
> **CRÍTICO**: WhatsApp rechaza URLs con `#recorrido` en el string (validación regex). Por eso se hizo el doble set: la URL corta `/tour-X` es limpia (sin `#`), pero el destino del 301 sí lleva el `#recorrido` que el browser preserva al hacer el redirect. Esto da el efecto deseado: el usuario llega directo a la sección de recorrido virtual al hacer click en el catálogo.

> **Nota correcciones de datos Cedro Plus + Flamboyán (sesión 15, 20 may 2026):** El usuario corrigió datos importantes del inventario que estaban inexactos:
> - **Departamento Cedro Plus (aplica a ambas versiones, Jardines y Lirios)**:
>   - `metros_construccion`: 104.00 (Jardines) / 92.1 (Lirios) → **104.06 m²** estándar (PB, N1, N2) en ambos
>   - **N3 con roof garden**: 121.13 m²
>   - Agregado flag `metros_construccion_variable: true` al de **Jardines** (Lirios ya lo tenía)
>   - Agregado "Roof garden (sólo N3)" al level desc de Jardines Cedro Plus (Lirios ya lo tenía)
>   - **Precio Jardines Cedro Plus**: $2,100,000 → **$2,247,700 MXN** (corregido)
>   - **Precio Lirios Cedro Plus**: $2,248,750 MXN (sin cambio)
>   - **Diferencias intencionales** entre ambos: estacionamiento (Jardines 1 auto / Lirios 2 autos), imágenes y acabados (cada uno en su propia carpeta `/public/jardines/Modelo Cedro Plus/` vs `/public/lirios/cedro-plus/`)
>   - `dev-content.ts` highlights de Lirios actualizado: "104.06 m²" + "N3 con roof garden · 121.13 m²"
>   - `metaDescription` de Lirios actualizado al nuevo rango
> - **Casa Flamboyán** (Jardines del Sur 6):
>   - `amenidades_key`: **"2.5 Baños" → "3 Baños"** (eran 3 completos, no 2.5)
>   - Agregado "Vestidor" como amenidad
>   - Level 1 desc corregido: el baño completo de PB está en el **área común (sala), NO dentro de la recámara**. Antes decía "Recámara con área para closet"; ahora dice "Baño completo, Recámara".
>   - Level 2 desc simplificado: "Estancia de TV, Recámara principal con baño completo y vestidor, Recámara secundaria con baño completo"
>   - **Layout real corregido**: PB tiene 1 recámara (sin baño propio) + 1 baño en área común + sala/comedor/cocina/patio. N2 tiene 2 recámaras (cada una con baño) + estancia TV. Total: 3 recámaras, 3 baños completos, 1 vestidor en principal.

> **⚠️ PENDIENTE — Replicar AmenitiesSection para La Rioja 2 y Jardines del Sur 6 (sesión 14, 19 may 2026):** Lirios Residencial 2 ya tiene su sección de amenidades con datos propios (5 tiles masonry + pills "Más amenidades" + card "Equipamiento" + trust row custom). La infra ya está lista: `AmenitiesSection.jsx` acepta props con defaults, el tipo `DevContent` tiene el campo opcional `amenitiesSection`, y `SiloPage.tsx` renderiza condicionalmente `{dev.amenitiesSection && <AmenitiesSection ... />}`. **Solo falta llenar los datos** en `dev-content.ts` para:
> 1. **Jardines del Sur 6** — usar el ya existente AmenitiesSection del home como referencia, pero con datos específicos del desarrollo (alberca, gimnasio, área infantil, cancha deportiva, vista aérea — ya hay imágenes en `/public/optimized/amenidades/`). El usuario tendría que dar la lista exacta de amenidades del desarrollo.
> 2. **La Rioja 2** — requiere imágenes nuevas (no hay en `/public/`); el usuario tendría que proveer fotos del desarrollo. Las amenidades posibles según `dev-content.ts` actual: casa club, alberca, áreas verdes integradas, seguridad controlada.
>
> **Recordatorio para hacerlo**: el usuario debe pasar (a) listado completo de amenidades por desarrollo, (b) imágenes JPG o WebP de las amenidades. El flujo es: 1) convertir imágenes a WebP con `sharp` q75 effort:6, 2) ponerlas en `/public/<dev>/amenidades/`, 3) añadir el objeto `amenitiesSection` al dev en `dev-content.ts` con `header`, `items`, `extraAmenities?`, `equipment?`, `trustItems?`. Build + deploy.

> **⚠️ PENDIENTE — Configurar conversión Google Ads en GTM dashboard (sesión 10-14):** Sin cambios desde sesión 12. Esperando a que el usuario lance su primera campaña de Google Ads. **Contexto estratégico añadido en sesión 14**: el sitio ya rankea posición #3 orgánica para "lirios 2" en Google (logro grande para sitio nuevo). Esto **refuerza** la conveniencia de hacer Google Ads pronto porque:
> 1. **Doble presencia** en la SERP (ad + organic) aumenta share of voice vs competidores
> 2. **Defensa contra competidores** (inmuebles24, vivanuncios) que podrían pujar por las mismas keywords cuando vean tu ranking en herramientas como SemRush/Ahrefs
> 3. **Branded keywords baratísimas** ("lirios 2", "altta homes cancún", "sadasi cancún") — CPC $1-5 MXN, Quality Score 9-10
> 4. **Captura ambos tipos** de usuario (~65% clickean ads, ~35% van a orgánico)
>
> **Distribución del presupuesto $100/día recomendada (refinada en sesión 14)**:
> - $20-30/día — Brand defense (keywords de marca y productos específicos: "lirios 2", "altta homes cancún", "sadasi cancún", "jardines del sur cancún")
> - $30-40/día — Modelos específicos (URL final: la ficha del modelo, NO el home — sube QS y conversión)
> - $30-40/día — Zonal alto intent ("casas polígono sur cancún", "departamentos preventa cancún")
>
> **CPA esperado primer mes con esa distribución**: $30-45 MXN (mejor que Meta $60-80) porque las branded keywords convierten muy alto a costo bajísimo.
>
> Pasos de configuración (sin cambios desde sesión 12): Tag "Vinculador de conversiones" + Trigger "Click - Solo links" con `Click URL contains wa.me` + Tag "Conversión Google Ads" con ID+Label que dé el panel de Google Ads al crear la conversión.

> **Nota Lirios 2 datos m² + contenido + masonry refinado 19 may 2026 (sesión 14):** Refinamientos sobre el trabajo de sesión 13:
> - **Reordenado masonry de amenidades**: eliminado tile "Alberca", movido "Pérgolas y Áreas de Reunión" (era `wide` al final) a primer lugar como `large` tile principal. Quedan 4 tiles visuales (pérgolas/large, padel/tall, áreas verdes/normal, voleibol/normal). Alberca movido a `extraAmenities` (pills "Más amenidades incluidas") junto con Juegos infantiles, Cancha usos múltiples, Asadores, Pet Park. Total: 5 pills.
> - **Contenido "Sobre Lirios 2" reemplazado** con 4 párrafos nuevos provistos por el usuario: (1) ubicación + Av. 135 + escuelas/plazas + Santuario María Desatadora de Nudos, (2) "Residencial con control de acceso. Departamentos de tres recámaras y hasta dos lugares de estacionamiento, organizados en torres de cuatro niveles", (3) "Un moderno fraccionamiento. Cada uno de nuestros departamentos está diseñado para brindarte a ti y a tu familia la privacidad y comodidad que están buscando", (4) "Nuestro objetivo: brindar a cada familia un hogar, con arquitectura moderna y un espacio libre, seguro y hermoso".
> - **m² del Cedro Plus actualizados con flag `metros_construccion_variable`**: precio NO cambió ($2,248,750). Lo que cambió: **estándar (PB, N1, N2) son 92.1 m², solo el N3 con roof garden es 114.6 m²**. `inventory.json`: `metros_construccion: 92.1` + nuevo flag `metros_construccion_variable: true`. Tipo `InventoryProperty` en `model-utils.ts` extendido con `metros_construccion_variable?: boolean`. `PropertyCard.jsx` añade `<span className={styles.statFrom}>desde </span>` antes del número cuando el flag está activo (clase `.statFrom` añadida en `PropertyCard.module.css` con font 0.68rem, color secondary). `ModelPage.tsx` cambia el label del hero stat de "Construcción" → "Construcción desde" cuando el flag está. Solo impacta Lirios; Jardines/La Rioja no tienen el flag y se renderean igual que antes.
> - **Highlights "Lo Esencial" actualizados** en Lirios: "Departamento Cedro Plus · 92.1 m²" + "N3 con roof garden · 114.6 m²" + "3 recámaras · 2.5 baños" + "2 cajones de estacionamiento" + "Precio desde $2,248,750 MXN" + "Torres de 4 niveles · Control de acceso".
> - **Distribución (level desc) reemplazada** en `inventory.json` para `lirios2-cedro-plus`: ahora muestra como pills "Sala, Cocina, Comedor, 1 medio baño, Área de lavado, Habitación principal con área para clóset y baño completo, 2 habitaciones secundarias con clóset y baño compartido, Estacionamiento para 2 autos, Roof garden (sólo N3)". Total 9 espacios.
> - **Meta description actualizada** para reflejar el rango de m².
> - **Cleanup menor**: removido `import Image` no usado en `ModelPage.tsx` (quedó tras refactor de ModelGallery en sesión 11).

> **Nota Lirios 2 contenido refactor 19 may 2026 (sesión 13):** Sesión enfocada en actualizar el silo de Lirios Residencial 2 con contenido propio (antes compartía imágenes con Jardines del Sur 6):
> - **Hero image cambiada**: nuevo source `Lirios 2/areas-comunes-4-lirios-2-residencial (1).jpg` (153 KB JPG) recomprimido a `/public/optimized/hero/hero-lirios.webp` con `sharp` q75 effort:6 → 72 KB WebP (-53%). Mismo path = no toca `dev-content.ts` ni código; el efecto Ken Burns viene del componente Hero. Aspect ratio 980×653 (1.5:1) mantenido.
> - **Galería de Departamento Cedro Plus en Lirios**: nueva carpeta `/public/lirios/cedro-plus/` con 5 imágenes propias del modelo (1.webp = hero reused, 2.webp = Sala Cocina, 3.webp = sala, 4.webp = cocina, 5.webp = recamara). `inventory.json` línea 267-273 actualizada: `lirios2-cedro-plus.images` ahora apunta a `/lirios/cedro-plus/N.webp` en vez de `/jardines/Modelo Cedro Plus/N.webp`. **CRÍTICO no tocar**: `jds6-cedro-plus.images` sigue apuntando a `/jardines/Modelo Cedro Plus/` porque es el mismo modelo arquitectónico con acabados/renders distintos por desarrollo — son sets de imágenes intencionalmente separados.
> - **Nueva sección de amenidades en Lirios silo**: `AmenitiesSection.jsx` refactorizado para aceptar props opcionales con defaults (`items`, `header`, `trustItems`, `extraAmenities`, `equipment`). Defaults conservan el comportamiento exacto del home page (no rompe `app/page.tsx`). Props nuevos `extraAmenities` y `equipment` renderean (a) pills checkmark dorado para amenidades secundarias y (b) card con dots dorados para "Equipamiento del desarrollo". Añadidas clases CSS `.extraBlock`, `.extraEyebrow`, `.extraList`, `.extraItem`, `.equipmentBlock`, `.equipmentEyebrow`, `.equipmentList`, `.equipmentItem`, `.equipmentDot` en `AmenitiesSection.module.css`. JSDoc añadido para tipar los props opcionales y no romper el build TypeScript (alternativa a convertir .jsx → .tsx).
> - **Datos de amenidades Lirios** añadidos en `dev-content.ts`: nuevo campo opcional `amenitiesSection` en el tipo `DevContent` con `header`, `items`, `extraAmenities`, `equipment`, `trustItems`. Lirios tiene 5 tiles masonry (alberca/large, padel/tall, areas-verdes/normal, voleibol-playa/normal, pergola/wide), 4 extras (Juegos infantiles, Cancha usos múltiples, Asadores, Pet Park), 5 equipamiento (Caseta reconocimiento facial, Macrocisterna, Contenedores basura, Estacionamiento visitas geomalla, Cerco eléctrico) y trust row personalizado (50 años Sadasi, 430k viviendas, 13 amenidades+equipamiento, 4 niveles por torre).
> - **SiloPage.tsx** importa `AmenitiesSection` y renderiza condicionalmente `{dev.amenitiesSection && <AmenitiesSection ... />}` entre el cierre de `.aboutSection` y el `<footer>`. Como solo Lirios tiene `amenitiesSection` definida actualmente, solo aparece en su silo (Jardines y La Rioja se mantienen igual hasta que se quiera replicar).
> - **Imágenes amenidades convertidas a WebP**: 4 nuevos archivos en `/public/lirios/amenidades/` (alberca 79KB, areas-verdes 88KB, padel 65KB, voleibol-playa 80KB) usando `sharp` q75 effort:6. Sources originales en `Lirios 2/*.jpg` (entre 148-175 KB cada uno). Ahorro total ~50% bytes por imagen.

> **⚠️ PENDIENTE — Verificar indexación post-resubmit sitemap (sesión 12, 18 may 2026):** El sitemap fue **eliminado y re-enviado** en Search Console el 18 may con la URL completa `https://jardinesdelsurcancun.mx/sitemap.xml`. Google va a re-procesar todas las 15 URLs en 24-72h. **Acción próxima sesión**: verificar en Search Console → Sitemaps que "Páginas descubiertas" pase de 1 → 15. Verificar también en "Indexación de páginas" que las URLs marcadas como "Rastreada: actualmente sin indexar" (al menos 1 detectada: `/desarrollos-cancun/lirios-residencial-2`) ahora aparezcan como indexadas. Si Google sigue sin descubrir las 15 URLs después de 72h, considerar añadir link interno desde el home a cada página de modelo (hoy solo se accede vía los silos), o solicitar indexación manual de las 14 URLs adicionales una por una en Inspección de URLs.

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

> **Última actualización:** 27 de mayo de 2026 (sesión 24 — Meta Pixel eventos)
> **Estado:** Google Ads activo. Meta Pixel base instalado (GTM v3) + eventos ViewContent y Lead configurados vía Meta Event Setup Tool el 27 may. Dataset recibiendo datos correctamente. **PENDIENTE Meta:** verificación de dominio (iOS 14+, no urgente). **PENDIENTE Google Ads (usuario):** cambiar keywords Grupo A de Amplia → Exacta/Frase + descartar recomendaciones malas. **Pendientes no urgentes:** audiencia retargeting Meta cuando haya ~1,000 visitantes, validar indexación Search Console, reviews GBP, calculadora Infonavit/FOVISSSTE, sticky price bar.

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
| `components/PropertyCard.jsx/.module.css` | Encabezado distribución: `"Distribución:"`. Etiqueta "Nivel N:" solo aparece si hay más de 1 nivel (`levels.length > 1`). CTA: **"Cotizar ahora"** (antes "Cotizar"). Legal legend (actualizado sesión 22): `*` "Precio no incluye gastos de escrituración" en **todas** las tarjetas. `**` "Lote tipo. Esquina o excedente varía el costo." solo cuando `property.metros_terreno` (casas). `**` "El precio puede variar según nivel y ubicación" solo cuando `property.precio_variable` (departamentos Capua JDS6, Cedro Plus JDS6, Cedro Plus Lirios). Leyenda "Actualizado a FEBRERO DEL 2026" **eliminada**. Variable `isJardinesCard` ya no existe. El badge visual `statusBadge` ya no se renderiza; imágenes de cards cargan lazy |
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
| Jardines del Sur 6 | Departamento Capua | 1 nivel (depto) | Precio desde $1,777,640 |
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
21. **CRÍTICO — Rol de Florencio:** el sitio NO es el oficial de Altta Homes/Sadasi, es el sitio personal del asesor inmobiliario Florencio Hurtado. **ACTUALIZADO (9 jun 2026):** ahora cada desarrollo tiene su **propio Perfil de Google Business** con dirección propia que Florencio proporcionó (NO inventadas): Jardines del Sur 6 = Av. 127 SM 342 MZ 27 · La Rioja 2 = Av. 135 esq. Av. 127 · Lirios Residencial 2 = Av. Robles (todas en 77536 Cancún, Q.R.). Por eso ahora SÍ se muestran direcciones por desarrollo vía `dev.location` (dev-content.ts) y en el FAQ. **Sigue vigente:** NUNCA inventar una dirección — usar solo las que Florencio confirme. El footer de silos hardcodea `OFFICE_ADDRESS` (oficina JdS6) como contacto universal del negocio. *(Reemplaza la regla vieja de "solo Cancún Q.R." para La Rioja/Lirios.)*
22. **No regresar AmenitiesSection ni trust strip (430k/12/15%) a los silos.** Decisión de sesión 8: solo viven en el home. Razones: (a) hero del silo más enfocado al desarrollo específico, (b) 340 KB menos en cada silo, (c) mejor PageSpeed mobile.
23. **Hero del silo es 1 sola imagen con Ken Burns lento (28s)** — no rotación de 4 slides como el home. Si se agregan más fotos por desarrollo, NO meter 4 slides al silo: la decisión es enfocar el silo en una imagen LCP única. El home conserva los 4 slides porque es el touchpoint cinematográfico de marca.
24. **Reglas de leyendas legales en PropertyCard (actualizado sesión 22):** `*` "Precio no incluye gastos de escrituración" → siempre, en TODAS las tarjetas. `**` "Lote tipo. Esquina o excedente varía el costo." → solo cuando `property.metros_terreno` existe (casas; ningún departamento tiene terreno). `**` "El precio puede variar según nivel y ubicación" → solo cuando `property.precio_variable: true` (Capua JDS6, Cedro Plus JDS6, Cedro Plus Lirios 2). Esta misma leyenda aparece también en el hero de las páginas individuales de modelo (clase `.heroPriceNote` en `model.module.css`). NO restaurar la leyenda "Actualizado FEBRERO 2026" salvo que el usuario lo pida.
25. **Grid silo con `.modelsGrid > * { max-width: 420px; justify-self: center }`:** evita que silos con 1 sola tarjeta (Lirios hoy) se estiren al ancho del contenedor. Si se agregan más modelos a Lirios, NO eliminar este cap — sigue siendo el comportamiento correcto (cada card ≤ 420px, multi-card se centra).
26. **Imagen hero de Lirios** está en `/public/optimized/hero/hero-lirios.webp` (99 KB). Copiada desde `/Lirios 2/Hero Lirios.webp` (fuera de `/public/`, no servible). Si se recibe versión mobile más liviana en el futuro, actualizar `dev.hero.mobileImage` en `dev-content.ts` (hoy mobile y desktop son el mismo archivo).
27. **Modales y portales:** TODO modal/overlay nuevo debe usar `createPortal(jsx, document.body)` para escapar stacking contexts. Si un ancestro tiene `transform`/`filter`/`will-change`/`contain`, `position: fixed` se ancla a ESE ancestro y no al viewport. El lightbox de PropertyCard ya lo hace; `VirtualTourModal` también desde sesión 9. Usar `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []); if (!mounted) return null;` antes del `createPortal` para evitar hydration warnings.
28. **Slugify de modelos**: usar `slugifyModel(name)` de `model-utils.ts`. Aplica `lowercase + NFD + /\p{Diacritic}/gu + kebab-case`. NO escribir slugs a mano — siempre derivar del `nombre_modelo` del inventory. Si en el futuro se cambia el nombre del modelo en `inventory.json`, el slug y la URL cambian automáticamente, lo cual es **mal SEO** (URLs viejas dejan de existir). Si se renombra un modelo, mantener el slug viejo + 301 redirect en `firebase.json`.
29. **Acentos en breadcrumb del navbar**: los slugs no llevan acentos (slugify los remueve). Para mostrar el nombre del modelo CON acentos en el breadcrumb (ej. "Casa Tabachín" en vez de "casa-tabachin"), `SiteHeader.jsx` tiene un mapa `MODEL_NAMES_BY_SLUG` hardcoded. Si se agrega un modelo nuevo al inventory, **AGREGAR ENTRADA al mapa** o el breadcrumb mostrará el slug crudo.
30. **Next.js 16 params es Promise**: en páginas dinámicas (`[modelo]/page.tsx`), el parámetro `params` es `Promise<{...}>`. SIEMPRE awaitear: `const { modelo } = await params;`. Usar `params.modelo` directo es error de compilación. Aplica a `generateMetadata`, page default y cualquier función que reciba params.
31. **`output: "export"` + dynamic routes**: `generateStaticParams()` es OBLIGATORIO en rutas dinámicas porque static export pre-genera HTML al build. Cada combinación válida de params se materializa como un `.html` en `out/`. URLs no listadas → 404 en runtime.
32. **PropertyCard sigue intocable** (instrucción del usuario): para agregar links a páginas de modelo, se hizo decoración EXTERNA en `SiloPage.tsx` (la fila de pills "Ver ficha completa de cada modelo"). NO modificar PropertyCard salvo que el usuario lo pida explícitamente.
33. **Pendiente conocido — color `.h1` del modelo**: en `model.module.css`, la clase `.h1` no fija `color: #fff`, así que el texto principal del hero del modelo se ve azulado/opaco contra el fondo navy. Solo el `em` (segunda línea con el nombre del dev) sale dorado correcto. **Fix de 1 línea**: añadir `color: #fff;` a `.h1` en `model.module.css`. NO se hizo en sesión 9 por decisión del usuario (lo dejó pendiente para sesión 10 junto con revisión visual general de las 11 fichas).

---

## 10. Sesión 9 jun 2026 — SEO local, Jardines del Sur 7, FAQ, fix navegador Facebook

Sesión de crecimiento orgánico/SEO + correcciones. Todo desplegado a producción (Firebase) y verificado en vivo salvo lo marcado ⏳.

### ✅ Hecho y desplegado
1. **Fix FOVISSSTE (accuracy):** en `dev-content.ts` (Jardines del Sur 6) FOVISSSTE pasó de afirmarse para "todos los modelos" a **"unidades seleccionadas"** (párrafo intro + highlight). Coincide con la decisión del doc de Google Ads (FOVISSSTE solo en JdS6, algunos deptos). La Rioja 2 y Lirios nunca lo mencionaron.
2. **Página Jardines del Sur 7 (Próximamente):** nueva ruta `app/desarrollos-cancun/jardines-del-sur-7/page.tsx` + `proximamente.module.css`. Página standalone (NO usa SiloPage porque no hay inventario): hero, badges de estado (🏗️ obra iniciada · 📅 preventa por anunciar · 📲 informes WhatsApp · 🏆 Grupo Sadasi), texto SEO, enlaces a los 3 desarrollos activos. **SIN precios ni modelos** (decisión del usuario). Metadata + JSON-LD (WebPage + Breadcrumb + Residence). Enlazada desde footer del home + JSON-LD ItemList del home. Agregada al sitemap (`app/sitemap.ts`). Redirect corto `/jardines-7` en `firebase.json`. **Indexación solicitada en Search Console.** Se quitó toda mención de "lista de espera" (no existe una formal) → quedó "Más información / Informes por WhatsApp".
3. **Página FAQ `/preguntas-frecuentes`:** nueva ruta `app/preguntas-frecuentes/page.tsx` + `faq.module.css`. 10 preguntas en acordeón nativo `<details>` (funciona en WebView de Facebook sin JS). Schema **FAQPage** generado desde el array `FAQS` (contenido y schema sincronizados) + Breadcrumb. Enlazada desde footer del home + sitemap. **Indexación solicitada.** ⚠️ Dos respuestas dejadas genéricas (deferidas a WhatsApp) por falta de dato real: **monto de apartado** y **fechas de entrega** — si Florencio los da, especificarlas.
4. **Fix navegador interno de Facebook/Instagram (síntoma: "todo se ve más grande" + hero cortado):** causa = el WebView de Android infla el texto. Fix en `app/globals.css` → `html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }`. Refuerzo extra: hero de JdS7 usa `min-height: 82svh` además de `vh`. El `<meta viewport>` ya estaba bien (Next lo pone solo). El botón WhatsApp en ese navegador **NO necesita fix** (WhatsApp y FB son ambos de Meta → el salto funciona; el usuario lo confirmó).
5. **Ubicaciones por desarrollo (SEO local):** se agregó `dev.location` a **Lirios 2** (Av. Robles, resuelto de su link de Maps) y **La Rioja 2** (Av. 135 esq. Av. 127, dato del usuario). JdS6 ya la tenía (Av. 127). El FAQ #1 se corrigió: ya no dice que todos están en Av. 127, ahora lista las 3 ubicaciones. **Ver nota #21 actualizada.**
6. **Ancla `#amenidades` + navbar:** `AmenitiesSection.jsx` ahora tiene `id="amenidades"` (+ `scrollMarginTop: 110px`). Link "Amenidades" agregado al menú escritorio del home, al drawer móvil del home (renumerado 01-04) y al drawer móvil de silos (apunta a `/desarrollos-cancun/<slug>#amenidades` para que funcione también desde páginas de modelo).
7. **Barra de anclas sticky (solo escritorio) en páginas de desarrollo:** en `SiloPage.tsx`, debajo del hero, una barra sticky (`.anchorNav` en `silo.module.css`, `top: 56px`, `display:none` en móvil) con **Modelos · Amenidades · Ubicación · Contacto**. Tiene respaldo `@supports not (backdrop-filter)` para el navegador de FB. Se agregaron anclas `#modelos` y `#ubicacion` (sección "Sobre") con `scrollMarginTop: 110px`. NO toca el header global, NO aparece en el home.

### 🌐 Dominios (Firebase Hosting)
- `jardinesdelsurcancun.mx` = principal. `jardinesdelsurcancun.com.mx` → ya redirige (301) al principal.
- `alttahomescancun.mx` agregado como **redirección** al principal — pendiente de configurar DNS en el registrador (estaba en "Requiere configuración"). Falta agregar `alttahomescancun.com.mx`.
- Decisión SEO: dominios extra = **redirección 301** (defensa de marca + captar tecleos), NO servir contenido duplicado. No usar "altta homes" como dominio principal (riesgo de marca registrada; Florencio es asesor autorizado, no Altta Homes).

### 🏢 Perfiles de Google Business (GBP) por desarrollo
- **Jardines del Sur 6 | Altta Homes** — ✅ verificado (Av. 127).
- **Lirios Residencial 2 | Altta Homes** — ✅ verificado (Av. Robles).
- **La Rioja 2 | Altta Homes** — ⏳ creado, **en verificación** (hasta 5 días). Categoría: Agente/Promotora inmobiliaria. Se le dio lista de servicios premium (sin Infonavit) + descripción (~660 car.). Sitio web del perfil debe apuntar a `/la-rioja`.
- Recomendación pendiente: que el campo "Sitio web" de cada GBP apunte a su página específica (`/jardines`, `/lirios`, `/la-rioja`), no al home.

### ⏳ Pendientes para la próxima sesión
1. **Piloto de schema local (acordado):** cuando La Rioja 2 verifique su GBP, pedir su link de Maps y conectar cada página de desarrollo con su GBP (geo-coordenadas + `sameAs`/`hasMap`). Hacerlo **fino**: validar en Rich Results Test (0 errores), empezar SOLO por La Rioja 2 (la de menos que perder), observar 3-5 días en Search Console, luego replicar en Lirios y JdS6. Razón de la cautela del usuario: el schema mal hecho puede dar problemas (en realidad solo si NO coincide con el contenido visible o dispara acción manual; el schema válido no desindexa).
2. **BLOG (#3, el grande pendiente):** estructura `/blog` + primer artículo SEO de intención de compra (ej. "Comprar casa con Infonavit en Cancún 2026", "Plusvalía Polígono Sur"). Empezar chico (3 artículos buenos). El usuario quiere que lo redacte yo.
3. **Afinar FAQ:** monto de apartado real + fechas de entrega (si Florencio los da). Verificar precios "desde" de la pregunta 4.
4. **Dominios:** terminar DNS de `alttahomescancun.mx` y agregar `alttahomescancun.com.mx`.
5. **CP de La Rioja 2:** confirmar si es 77536 para igualar el formato de dirección de los otros.
6. **(Opcional) Mini-menú escritorio en desarrollos:** se eligió la barra de anclas; si el usuario quisiera además algo en el header, evaluarlo (riesgo de apretar el breadcrumb).
7. **Imágenes Google Ads:** se discutió subir imágenes propias (JPG/PNG, Google NO acepta WebP) vs dinámicas. Quedó pendiente; el usuario se inclinó por probar las dinámicas (reversibles, bajo riesgo a nivel grupo).

### 🔑 Notas técnicas de esta sesión (agregar al criterio general)
- **Google Ads NO acepta WebP** para recursos de imagen (solo JPG/PNG/GIF). Los renders del proyecto son WebP → hay que convertir si se suben manualmente.
- **`text-size-adjust: 100%` en `html`** es el fix canónico para el "zoom" del WebView de Facebook. No afecta Chrome/Safari.
- **Páginas nuevas standalone** (JdS7, FAQ) reutilizan `SiteHeader` + `FloatingWhatsApp` + footer de `page.module.css` para mantener consistencia sin depender del sistema de inventario/DEVS.
- **Patrón de despliegue confirmado:** `npm run build` → `firebase deploy --only hosting --project jardinesdelsur-cancun`. Verificación en vivo con `curl` a `https://jardinesdelsurcancun.mx`.
