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
- Dominio: `alttahomescancun.mx` (cambiar dominio = solo `lib/site.ts`). WhatsApp: 998 205 9044.
- Google Ads: campaña `Cancún - Search - Casas y Deptos - v1`, $150/día (TOPE — no subir), conversión "WhatsApp Click" `AW-18157218280 / UXk0CJTznrIcEOjThNJD`. Grupos: Grupo de anuncios 1 (general/portafolio) + La Rioja 2 - Premium (lujo, SIN Infonavit, sitelinks propios de grupo).
- Meta: dataset Web `2016457592282966`, evento Contact server-side vía CAPI propia (Firebase Function `/api/meta-capi`); Pixel de GTM PAUSADO a propósito. Campaña nueva (jul 2026): Ventas → WhatsApp, audiencia amplia, México abierto (experimento, revisar a 21 días).
- Crédito Google $7,000: gastar $7k propios antes del 30 jul 2026; el crédito llega ~sep 2026.

## REGLAS DURAS — Google Ads (violarlas = error grave)
1. **NUNCA concordancia amplia.** Solo `[exacta]` y `"frase"`. Rechazar el botón "Cambiar a concordancia amplia".
2. **NUNCA aceptar recomendaciones/IA de Google**: IA Max, PMax, "Aplicar todo", Ask Advisor, "generar títulos", llamada con "experto", "Solucionar el problema" (=subir presupuesto), lead de llamada en objetivos de conversión. El Nivel de optimización NO es calificación.
3. **`[altta homes cancun]` NUNCA se pausa**: existe el clon `altahomescancun.com` (una T) que sale 1º — es defensa de marca (~$600/mes), decisión de Florencio 18 jul 2026.
4. **NO recortar horario de anuncios sin ver conversiones por hora**: leads de 11pm-12am han cerrado ventas.
5. Cada keyword vive en UN solo grupo (rioja → solo grupo Premium). Negativas nuevas → nivel CAMPAÑA.
6. NO tCPA todavía; presupuesto no se baja de $150 antes del 30 jul (crédito $7k).
7. En todo copy: **"Zona Sur", NUNCA "Polígono Sur"** · **crédito bancario PRIMERO, Infonavit segundo** · FOVISSSTE solo JdS6 (algunos deptos) · "asesor autorizado de Altta Homes" (no "independiente") · nada de "plusvalía garantizada" · sin abreviaturas feas tipo "Deptos/Depas" en títulos.
8. Nombre de empresa en anuncios: "Altta Homes Cancún" (coincide con dominio, verificación completa). NUNCA tocar "Restablecer verificación".

## REGLAS DURAS — Meta Ads
1. **NUNCA**: reglas de valor, "más destinos" (Messenger/IG — todo vive en WhatsApp), programación por horario comercial, catálogo Advantage+, pasarela/CAPI-vía-GTM de pago.
2. **Retoques visuales de Advantage+ = OFF** (deforma renders y puede mochar los precios de la imagen).
3. Audiencia AMPLIA + **precio visible en el creativo** (el precio es el segmentador). Categoría especial: Vivienda.
4. Seguimiento de eventos del sitio web = ON con el dataset (atribución), aunque el destino sea WhatsApp.
5. **Era Andromeda (algoritmo 2026)**: el creativo pesa ~56% del rendimiento → renovar creativos cada 4-6 semanas; UNA campaña concentrada > varias fragmentadas; aprendizaje tarda 7-14 días — NO tocar campañas en aprendizaje; juzgar a 21 días; los reportes se ven 20-40% peores por atribución nueva (no es caída real).
6. NUNCA reactivar el Pixel en GTM sin coordinar event_id (duplicaría PageView). El Business Agent (bot WhatsApp) usa el prompt v3 — pendiente actualizarlo a "Zona Sur".
7. Scores de calidad de coincidencia 5.9/4.4 son normales (sitio sin formularios) — no perseguirlos.

## Métricas de referencia
- Google: CPA sano $87-105 (línea base $92.11; tras poda 18 jul esperar ~$95-105). CTR ~9%. MVP: `[jardines del sur 6]` ($87). Joyita: `[oficina de ventas jardines del sur 6]` ($0.47).
- Presupuesto $150/día ≈ 43-47 conversaciones/mes. "Limitado por presupuesto" = normal, no tocar.
- Interpretar métricas tempranas: preguntar SIEMPRE hora de publicación antes de juzgar las primeras 24-48h.

## Al cerrar la sesión
Actualizar `context.md` (entrada de sesión) + `google-ads.md` (log de Ads). NO commitear (Florencio commitea). Deploy solo si se tocó el sitio. Guardar en memoria persistente cualquier decisión/dato de negocio nuevo (tipo la regla del clon).
