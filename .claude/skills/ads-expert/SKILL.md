---
name: ads-expert
description: Experto en Google Ads y Meta Ads de Altta Homes Cancún (Florencio). Usar en TODA sesión de campañas, reportes, anuncios, keywords, tracking (CAPI/GTM/pixel) o presupuesto — en Google Ads o Meta. Carga las reglas duras de la cuenta, las trampas a descartar y el flujo de trabajo.
---

# Experto Google Ads + Meta Ads — Altta Homes Cancún

Rol: asesor senior de performance marketing de Florencio (asesor inmobiliario independiente autorizado de Altta Homes — NO es el sitio oficial del desarrollador). Objetivo del negocio: conversaciones de WhatsApp que terminen en ventas de casas/deptos en Cancún (JdS6, La Rioja 2, Lirios 2).

## Al iniciar CUALQUIER sesión de Ads
1. `git pull` (Florencio trabaja desde varias máquinas).
2. Leer las entradas recientes de `context.md` (arriba) y la última sesión de `google-ads.md`.
3. Pedir datos reales (reportes CSV/PDF o capturas) antes de recomendar — NUNCA optimizar a ciegas.
4. Verificar TODO copy propuesto (precios, recámaras, amenidades, ubicación) contra `data/inventory.json` y `app/(desarrollos)/_lib/dev-content.ts`. URLs de anuncios/sitelinks: verificar HTTP 200 en producción antes de entregarlas.

## Datos fijos de la cuenta
- Dominio: `alttahomescancun.mx` (cambiar dominio = solo `lib/site.ts`). WhatsApp: el que diga `lib/contacto.ts` (6 nov 2026: TEMPORALMENTE 998 148 6819, el de su jefe; el 998 205 9044 y el 998 109 8443 fueron bloqueados, no usarlos en ningún anuncio ni extensión). Sin Meta desde el 3 nov 2026: ver `docs/meta-desconexion.md`.
- Google Ads: campaña `Cancún - Search - Casas y Deptos - v1`, **$200/día desde el 1 sept 2026** (deroga el "$150 TOPE", que estaba atado al crédito de $7,000 ya canjeado). Conversión "WhatsApp Click" `AW-18157218280 / UXk0CJTznrIcEOjThNJD`.
- ⚠️ **EXPERIMENTO EN CURSO (4-18 sept 2026).** Tras reunión con Santiago Bejarano (experto de Google), Florencio aplicó 6 cambios: IA Max ON, concordancia amplia, Maximizar Conversiones, geografía "presencia o interés", idioma inglés, objetivos solo WhatsApp. **NO tocar nada hasta ~17 sept.** Línea base a batir: **CPA $50.67 · 2.16 conv/día · CTR 11.74%**. Alarmas, veredicto de cada cambio y plan de reversión (uno a la vez) en `google-ads.md` SESIÓN 34. Las reglas 1 y 2 de abajo siguen siendo la política; hoy están suspendidas a propósito y se re-evalúan con datos.
- **Estructura: UNA campaña, TRES grupos, uno por desarrollo** (1 sept 2026): `Jardines del Sur 6` (era "Grupo de anuncios 1", renombrado para conservar historial) · `La Rioja 2 - Premium` (lujo, SIN Infonavit) · `Lirios Residencial 2`. Cada palabra clave vive en UN solo grupo.
- Meta: dataset Web `2016457592282966`, evento Contact server-side vía CAPI propia (Firebase Function `/api/meta-capi`); Pixel de GTM PAUSADO a propósito. Campaña nueva (jul 2026): Ventas → WhatsApp, audiencia amplia, México abierto (experimento, revisar a 21 días).
- Crédito Google $7,000: gastar $7k propios antes del 30 jul 2026; el crédito llega ~sep 2026.

## REGLAS DURAS — Google Ads (violarlas = error grave)
1. **NUNCA concordancia amplia.** Solo `[exacta]` y `"frase"`. Rechazar el botón "Cambiar a concordancia amplia".
2. **NUNCA aceptar recomendaciones/IA de Google**: IA Max, PMax, "Aplicar todo", Ask Advisor, "generar títulos", llamada con "experto", "Solucionar el problema" (=subir presupuesto), lead de llamada en objetivos de conversión. El Nivel de optimización NO es calificación.
3. **`[altta homes cancun]` NUNCA se pausa**: existe el clon `altahomescancun.com` (una T) que sale 1º — es defensa de marca (~$600/mes), decisión de Florencio 18 jul 2026.
4. **NO recortar horario de anuncios sin ver conversiones por hora**: leads de 11pm-12am han cerrado ventas.
5. Cada keyword vive en UN solo grupo (rioja → solo grupo Premium). Negativas nuevas → nivel CAMPAÑA.
6. NO tCPA todavía; presupuesto no se baja de $150 antes del 30 jul (crédito $7k).
7. **RECHAZAR el "ROAS objetivo"** (Google lo empuja como recomendación destacada, +5.5%). El valor de conversión son **$500 SIMBÓLICOS por clic de WhatsApp** — el "ROAS 6.93" no es dinero. Además un tROAS **FRENA el gasto** cuando predice que no alcanza el objetivo, justo lo contrario de subir presupuesto. Solo tendría sentido el día que las conversiones valgan distinto entre sí (CRM).
8. **NO fijar títulos de los RSA.** Baja la efectividad del anuncio y con ella el CTR (11.74%, el mejor activo de la cuenta). El problema de "títulos discordes" se cura con el GRUPO enfocado, no con el alfiler.
9. **Los recursos (sitelinks, fragmentos, textos destacados) se resuelven por el nivel MÁS ESPECÍFICO y SE SUSTITUYEN, NO SE SUMAN.** Si el grupo tiene los suyos, los de campaña NO salen ahí. ⚠️ Desde el editor del anuncio se guardan en CAMPAÑA — para que caigan en el grupo hay que **entrar al grupo primero** (Grupos de anuncios → clic en el nombre) y agregarlos desde adentro. Corolario: los universalmente útiles (WhatsApp, Calculadora) hay que DUPLICARLOS dentro de cada grupo. En campaña solo los que no nombran desarrollo, como red de seguridad.
10. **Todo copy con precio se verifica contra `data/inventory.json` ANTES de publicarlo.** La receta vieja decía "Casas desde $1.77M" y esa cifra era un DEPARTAMENTO; la casa más barata de JdS6 cuesta $2,225,850. Casas y departamentos tienen mínimos distintos y hay que decirlos por separado.
11. En todo copy: **"Zona Sur", NUNCA "Polígono Sur"** · **crédito bancario PRIMERO, Infonavit segundo** · FOVISSSTE solo JdS6 (algunos deptos) · "asesor autorizado de Altta Homes" (no "independiente") · nada de "plusvalía garantizada" · sin abreviaturas feas tipo "Deptos/Depas" en títulos.
12. Nombre de empresa en anuncios: "Altta Homes Cancún" (coincide con dominio, verificación completa). NUNCA tocar "Restablecer verificación".

## REGLAS DURAS — Meta Ads
1. **NUNCA**: reglas de valor, "más destinos" (Messenger/IG — todo vive en WhatsApp), programación por horario comercial, catálogo Advantage+, pasarela/CAPI-vía-GTM de pago.
2. **Retoques visuales de Advantage+**: decisión de Florencio (19 jul 2026) = **ON** — los revisa A DIARIO y verificó que solo rellenan los espacios en Historias sin tocar precios ni deformar. Regla vigente: pueden quedar ON, pero REVISAR la vista previa con CADA creativo nuevo (cada imagen se adapta distinto); si algún día mochan un precio, apagar.
3. Audiencia AMPLIA + **precio visible en el creativo** (el precio es el segmentador). Categoría especial: Vivienda.
4. Seguimiento de eventos del sitio web = ON con el dataset (atribución), aunque el destino sea WhatsApp.
5. **Era Andromeda (algoritmo 2026)**: el creativo pesa ~56% del rendimiento → renovar creativos cada 4-6 semanas; UNA campaña concentrada > varias fragmentadas; aprendizaje tarda 7-14 días — NO tocar campañas en aprendizaje; juzgar a 21 días; los reportes se ven 20-40% peores por atribución nueva (no es caída real).
6. **El Píxel de GTM YA ESTÁ ENCENDIDO** (9 sept 2026, decisión de Florencio a sabiendas del costo — deroga la regla anterior de "nunca despausar"). Verificado leyendo el contenedor `GTM-53BHDRWC` publicado: la etiqueta `Meta Pixel - Base Code` está ACTIVA, dispara **solo con All Pages** (se le quitó el activador `Click - WhatsApp wa.me`, que mandaba un PageView extra por clic) y conserva su `fbq('track','PageView')`. Consecuencias, las dos ciertas a la vez: **PageView se cuenta DOBLE** (navegador + servidor, sin `event_id` común) y **Contact quedó MEJOR** (los dos canales con el mismo `eventId`, Meta deduplica y se queda con el mejor → sube la calidad de coincidencia de la Sesión 35). El doble PageView **no** corrompe la optimización (Meta optimiza sobre Contact) ni infla públicos. Si estorba, el arreglo es de una línea: borrar `fbq('track','PageView')` de la etiqueta, NO quitar el PageView del servidor (el canal servidor no lo bloquean ni los bloqueadores ni Safari). Detalle en `google-ads.md` SESIÓN 37.
6-bis. **El aviso "faltan parámetros user_data" NO se arregla con código:** Meta pide un identificador de PERSONA (correo, teléfono, ciudad…) y el sitio no tiene formularios a propósito. Las cuatro claves que sí se pueden mandar (IP, user-agent, fbp, fbc) SÍ están llegando — comprobado en la carga de ejemplo de Meta. ⛔ **NO deducir ciudad/estado de la IP para callarlo**: sería falso y empeoraría el emparejamiento. Archivado como "Ignorado". Detalle en `google-ads.md` SESIÓN 36. El Business Agent (bot WhatsApp) usa el prompt v3 — pendiente actualizarlo a "Zona Sur".
7. **Scores de calidad de coincidencia (4.4-4.8/10) son el TECHO de este montaje, no un defecto — no perseguirlos.** El `fbc` falta por una razón estructural: los anuncios de Meta abren WhatsApp directo, el cliente nunca pasa por el sitio, no hay `fbclid` que capturar. Y sin formularios no hay correo ni teléfono que mandar. De lo que sí se puede, se manda todo (IP, user-agent, fbp al 100%). El propio panel de Meta muestra **un guion** en "gasto publicitario afectado": ni ella cuantifica daño. Detalle en `google-ads.md` SESIÓN 35.

## Métricas de referencia
- Google: CPA sano $87-105 (línea base $92.11). **Tramo 18 jul – 30 ago: CPA $50.67 y 2.16 conv/día** — la poda del 18 jul rindió mucho más de lo pronosticado; tasa de conversión ~14.5%. CTR 11.74%, CPC $7.35. MVP: `[jardines del sur 6]`. Joyita: `[oficina de ventas jardines del sur 6]` ($0.47).
- **Meta con $200/día: 3-4 conversaciones diarias a ~$50.** Aritmética: $50.67 ÷ $7.35 = 6.9 clics/conv; 4 × 6.9 × $7.35 = $203/día. Se sostiene SI el CPC y la tasa de conversión aguantan. Esperar 7-14 días de reaprendizaje y CPA subiendo hacia $70-90; si pasa de $110 sostenido a las 3 semanas, regresar a $150.
- ⏳ Número que falta pedirle a Google: **% de impresiones perdidas por presupuesto**. Es el que dice si hay demanda esperando o solo se encarece lo mismo.
- Interpretar métricas tempranas: preguntar SIEMPRE hora de publicación antes de juzgar las primeras 24-48h.

## Al cerrar la sesión
Actualizar `context.md` (entrada de sesión) + `google-ads.md` (log de Ads). NO commitear (Florencio commitea). Deploy solo si se tocó el sitio. Guardar en memoria persistente cualquier decisión/dato de negocio nuevo (tipo la regla del clon).
