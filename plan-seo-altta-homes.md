# Plan SEO — Posicionar `alttahomescancun.mx` y superar al #1

> **Objetivo:** que `alttahomescancun.mx` (Altta Homes Cancún, asesor autorizado Florencio) le gane a `alttahomescancun.com` (otra asesora, hoy #1 para "altta homes cancun"). Creado 20 jun 2026, sesión 29, tras migración de dominio. Relacionado: `context.md` sesión 29. **v2** — incorpora feedback de Florencio (precios dinámicos, look de empresa, alta plusvalía, ubicación).

---

## 1. Análisis del competidor #1 (`alttahomescancun.com`)

**Cómo se ve en Google ("altta homes cancun"):**
- Nombre de sitio: `altta homes cancun` + favicon + ✓ marca verificada
- Título azul: `Casas en Cancun - ALTTA HOMES CANCUN`
- Descripción: "Casas en venta en cancun. Jardines del sur 6, La rioja residencial, lirios residencial, maderos residencial..."
- **Sitelinks orgánicos:** JARDINES DEL SUR 6, Lirios Residencial 2, La Rioja Residencial, Agenda una Cita, La Rioja 2

**FORTALEZAS (por qué está #1):**
- Autoridad/antigüedad acumulada para el término marca.
- Marca verificada en Google (✓).
- Más desarrollos listados (JdS5, JdS6, La Rioja 2, La Rioja Residencial, Lirios 2/3, Maderos, Campestre La Joya).
- URLs cortas y planas (`/jardines-del-sur-6`).

**DEBILIDADES (lo que explotamos para superarlo):**
1. ❌ **Títulos pésimos:** title = nombre crudo ("JARDINES DEL SUR 6"). Desperdician el espacio. **Aquí ganamos fácil.**
2. ❌ **Sin meta descriptions por página.**
3. ❌ **CERO datos estructurados (JSON-LD).**
4. ❌ Hecho en constructor de sitios → probablemente lento.

---

## 2. Tus VENTAJAS actuales

1. ✅ **JSON-LD `RealEstateAgent` + `OfferCatalog`** — el competidor NO tiene nada.
2. ✅ **Meta descriptions por página** (`dev-content.ts`).
3. ✅ **Next.js estático en CDN de Firebase** → rápido (mejores Core Web Vitals).
4. ✅ **Dominio que coincide con la marca** (`alttahomescancun.mx`).
5. ✅ **Recorridos 360° + galerías** por modelo.
6. ✅ **Asesor AUTORIZADO** → identidad defendible.

**El #1 gana por autoridad/tiempo, no por SEO.** Con mejores títulos + ventaja técnica + tiempo, es alcanzable.

---

## 3. Estrategia de presentación (decisión de Florencio)

- **En Google = look de EMPRESA.** El título y el nombre de sitio muestran la **marca "Altta Homes Cancún"** (como el #1). NADA de "Asesor Autorizado" en el título.
- **El rol de asesor va ABAJO**, en la descripción, suave: *"Chatea con un asesor autorizado de Altta Homes"*. Esto evita problemas de política (no se hace pasar por la desarrolladora) y aun captura la búsqueda "asesor altta homes cancun".
- **En redes sociales = Florencio se muestra** (estrategia personal). En Google = empresa.

---

## 4. Estrategia de títulos ("dos pisos")

- **Piso 1 (nombre de sitio, arriba):** `og:site_name` → **"Altta Homes Cancún"** en TODAS las páginas.
- **Piso 2 (link azul):** el `title` de cada página, marca + keyword.

### Títulos propuestos

| Página | `title` | Largo aprox. |
|---|---|---|
| **Home** | `Altta Homes Cancún \| Casas y Departamentos en la Zona Sur de Cancún` | 67 |
| **Jardines del Sur 6** | `Jardines del Sur 6 Cancún \| Casas y Deptos desde $[precio]` | ~55 |
| **La Rioja 2** | `La Rioja 2 Cancún \| Casas Residenciales Premium $[precio]` | ~55 |
| **Lirios Residencial 2** | `Lirios Residencial 2 Cancún \| Departamentos $[precio]` | ~52 |
| **Jardines del Sur 7** | `Jardines del Sur 7 Cancún \| Próxima Apertura a la Venta` | 55 |

- ✅ Los **4 desarrollos** cubiertos (cada uno su título + el home los lista en la descripción).
- ✅ **JdS7 = "Próxima apertura a la venta"**, NO preventa.
- ✅ Look de empresa/marca, profesional — mejor que el genérico del #1.

### 🔄 PRECIOS DINÁMICOS (importante — Florencio)
El `$[precio]` **NO se escribe a mano.** Se calcula automáticamente del **`data/inventory.json`** (el mismo archivo que alimenta las tarjetas y fichas), tomando el precio mínimo "desde" de cada desarrollo.
- **Resultado:** cuando actualices precios en `inventory.json` y se redespliega (igual que ya actualizas la web), **el título se actualiza solo** → nunca muestra info falsa.
- Se implementa en el `generateMetadata` de cada silo (lee inventario en build, formatea "$X.XXM").
- JdS7 sin precio aún → solo "Próxima Apertura" (cuando haya precios, se agrega solo).

---

## 5. Meta descriptions (mencionan SÍ o SÍ los 4 desarrollos + ubicación + alta plusvalía)

**Home** (versión base, se afina a ~155 caracteres en implementación):
```
Casas y departamentos con alta plusvalía en la Zona Sur de Cancún (Polígono
Sur): Jardines del Sur 6, La Rioja 2, Lirios Residencial 2 y Jardines del
Sur 7 (próxima apertura). Chatea con un asesor autorizado de Altta Homes.
Crédito bancario e Infonavit.
```

> **Orden de financiamiento (decisión Florencio):** SIEMPRE **crédito bancario primero, Infonavit segundo** en todo el copy (descripciones, títulos, Ads, GBP). Atrae mejor perfil de comprador y refuerza el posicionamiento premium. NO liderar con Infonavit. (FOVISSSTE solo se menciona en Jardines del Sur 6, donde aplica.)

> **Zona Sur vs Polígono Sur (decisión Florencio):** en el **título** se usa **"Zona Sur de Cancún"** (suena premium/estatus); en la **descripción y contenido** se mantiene **"Polígono Sur"** porque es una keyword real que ya se trabaja en Ads/GBP. Así se gana el look aspiracional sin perder el tráfico de búsqueda.

**Por desarrollo:** afinar las actuales de `dev-content.ts` agregando los **ganchos de ubicación** + "Chatea con un asesor autorizado de Altta Homes".

### 📍 Ganchos de ubicación (Polígono Sur Cancún)
A incluir en descripciones / contenido (refuerzan SEO local):
- ✅ A **5 min del Aeropuerto Internacional de Cancún**
- ✅ A **15 min de las playas**
- ✅ A **500 m de Avenida Huayacán**
- ✅ A **5 min del Tren Maya**

### Plusvalía
- ✅ Usar **"alta plusvalía"** / "zona de alta plusvalía" (decisión de Florencio).
- ❌ NO usar "plusvalía garantizada" ni cifras exactas ($627k) en el home (riesgo legal/credibilidad). Si se quiere una cifra concreta, va en la página del modelo específico y solo con aval.

---

## 6. Datos estructurados (JSON-LD) — donde el #1 NO tiene nada

1. **Reforzar `RealEstateAgent`** en home: `name: "Altta Homes Cancún"`, `sameAs` (GBP, redes), `areaServed: Cancún`.
2. **`OfferCatalog`/`ItemList`** con los 4 desarrollos + modelos.
3. **`BreadcrumbList`** por página → ayuda a sitelinks + breadcrumbs en resultados.
4. **`Product`/`Offer`** por modelo con precio (dinámico) + moneda MXN.

---

## 7. Sitelinks orgánicos (los sub-links del #1)

**No se crean a mano** — Google los genera con confianza + estructura clara. Para ganarlos:
- Navegación clara y consistente ✅ ya la tienes.
- `BreadcrumbList` (punto 6).
- Autoridad para el término marca (punto 8 + tiempo).

---

## 8. Autoridad y contenido (lo que cierra la brecha con el #1)

1. **Blog** — de 1 a 4-5 artículos SEO (Infonavit, plusvalía Polígono Sur, etc.).
2. **Reseñas Google Business** — cuando haya ≥5-10 estrellas.
3. **Backlinks** — directorios inmobiliarios, redes.
4. **Marca verificada en Google** — completar (logo subido en Ads, sesión 26).
5. **Cobertura de inventario** — el #1 lista más desarrollos; agregar páginas de los que tengas disponibles.

---

## 9. Plan de implementación por fases

**FASE 1 — Títulos + descripciones + precios dinámicos (Claude, código) — 🔥 ALTO IMPACTO, BAJO ESFUERZO**
- `app/layout.tsx`: `og:site_name = "Altta Homes Cancún"`, `title.default`, `title.template = "%s | Altta Homes Cancún"`, description home.
- `dev-content.ts` + `generateMetadata` de silos: títulos con **precio dinámico** desde `inventory.json` + descripciones con ubicación + "chatea con asesor autorizado".
- `jardines-del-sur-7/page.tsx`: title/description "próxima apertura".
- Build + deploy + re-solicitar indexación de las 5 páginas.
- ✅ **Decisiones tomadas:** look de empresa, "alta plusvalía", precios dinámicos, ubicación (5 min aeropuerto, 15 min playas, 500 m Huayacán, 5 min Tren Maya).

**FASE 2 — Datos estructurados (Claude)** — reforzar JSON-LD, BreadcrumbList, Product/Offer.

**FASE 3 — Autoridad/contenido (Florencio + Claude)** — blog, reseñas, backlinks, verificación de marca.

**FASE 4 — (Opcional/cosmético) Acortar rutas de silos** (`/jardines-del-sur-6`). El #1 las usa cortas, pero su #1 es por autoridad, NO por las URLs. Beneficio SEO ≈ 0. Hacerlo APARTE cuando el dominio asiente (~4-8 sem). Scope en `context.md`.

---

## 10. Cómo medir el avance

- **Search Console** (`alttahomescancun.mx`): posición media para "altta homes cancun", "jardines del sur 6", etc.; impresiones; CTR.
- Aparición de **sitelinks orgánicos** propios.
- Ranking vs `alttahomescancun.com`.
- Revisar a las 2, 4 y 8 semanas.

---

## 11. Resumen ejecutivo

| Palanca | Impacto SEO | Esfuerzo | Quién |
|---|---|---|---|
| **Títulos + descripciones + precio dinámico** (Fase 1) | 🔥 Alto | Bajo | Claude |
| **Datos estructurados** (Fase 2) | Medio | Bajo-medio | Claude |
| **Autoridad/contenido** (Fase 3) | 🔥 Alto | Alto/lento | Florencio + Claude |
| Acortar URLs (Fase 4) | ~0 | Alto | (opcional) |

**Orden:** Fase 1 (lista para ejecutar) → Fase 2 → Fase 3 (continuo) → Fase 4 (opcional, al final).

**La jugada que más te acerca al #1: Fase 1 (títulos) + Fase 3 (autoridad). NO acortar URLs.**
