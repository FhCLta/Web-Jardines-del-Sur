# 📊 Google Ads — Setup & Tracking

> Documento vivo. Se actualiza en cada sesión con decisiones tomadas, configuraciones aplicadas, y resultados reales.

**Inicio del setup:** 23 de mayo de 2026
**Cuenta:** Google Ads de Florencio Hurtado
**GTM Container:** `GTM-53BHDRWC`
**Sitio:** https://jardinesdelsurcancun.mx
**Presupuesto inicial:** $100 MXN/día ($3,000 MXN/mes)
**Objetivo:** Maximizar conversiones "WhatsApp Click" (clicks a `wa.me/529982059044`)

---

## 🎯 Estrategia acordada

### Estructura de campaña
- **1 Campaña** tipo "Búsqueda" (Search Network only — sin Display, sin Performance Max)
- **3 Grupos de anuncios** que comparten el presupuesto de $100/día:
  - **Grupo A — Brand defense** (~$20-30/día): protege rankings orgánicos
  - **Grupo B — Modelos específicos** (~$30-40/día): bottom funnel, alta intención
  - **Grupo C — Zonal alto intent** (~$30-40/día): captura tráfico nuevo

### Estrategia de puja
- **Fase inicial (semanas 1-2):** CPC manual mejorado, sin CPA objetivo
- **Fase aprendizaje (semana 3, después de ~15 conversiones):** Cambiar a "Maximizar conversiones"
- **Fase optimización (mes 2+):** Si llegamos a 30+ conversiones/mes, cambiar a "CPA objetivo $50 MXN"

### Configuración técnica
- **Ubicación:** Cancún + 25 km radio (NO toda Quintana Roo ni México)
- **Idioma:** Español
- **Horario:** 8:00 - 21:00 (cuando puedes responder WhatsApp)
- **Día:** Lunes a Sábado (Domingo opcional)
- **Dispositivos:** Mobile +0%, Desktop -20%, Tablet -30%
- **Concordancia keywords:** Solo `"frase"` y `[exacta]` — **NUNCA amplia**
- **Ventana de conversión:** 30 días (estándar para real estate)

### Métricas objetivo
- **CPA inicial (semana 1-2):** $60-90 MXN (algoritmo aprende)
- **CPA estable (mes 2+):** $40-60 MXN
- **CPA ideal:** $30-50 MXN
- **Conversaciones esperadas/mes:** 50-80
- **CTR esperado:** 3-7% (alto por keywords bottom-funnel)
- **Quality Score esperado:** 8-10 (gracias a velocidad 94 mobile + landing pages específicas)

---

## ✅ PASO 1: Crear acción de conversión "WhatsApp Click"

### Estado: ⏳ EN PROGRESO

### Configuración a aplicar:
- **Tipo:** Sitio web
- **Categoría:** Cliente potencial (Lead)
- **Nombre:** `WhatsApp Click`
- **Valor:** Sin valor (o $500 MXN simbólico — el bidding usa CPA, no value)
- **Recuento:** Una (no "Cada una" — evita inflar métricas si el mismo usuario hace varios clicks)
- **Ventana de conversión click:** 30 días
- **Ventana de conversión engaged-view:** 1 día
- **Modelo de atribución:** Basado en datos (data-driven)
- **Método de configuración:** Usa Google Tag Manager

### ✅ Conversión creada — Datos para GTM

- **Nombre de la conversión:** `WhatsApp Click`
- **Conversion ID:** `18157218280` (o con prefijo: `AW-18157218280`)
- **Conversion Label:** `UXk0CJTznrIcEOjThNJD`
- **Categoría:** Contacto
- **Valor:** $500 MXN (símbolico, mismo valor cada conversión)
- **Recuento:** Una
- **Ventana posclic:** 30 días
- **Ventana vista interesada:** 3 días
- **Atribución:** Basado en datos

### Próximo paso:
Configurar tag en GTM con esos 2 valores (PASO 2).

---

## ✅ PASO 2: Configurar conversión en GTM

### Estado: ✅ COMPLETADO Y PUBLICADO — 23/05/2026, 18:37

### 🎉 Resumen final:
- **Versión publicada:** `Versión 2 - v1 - WhatsApp Conversion Tracking`
- **Fecha publicación:** 23/05/2026, 18:37
- **Usuario:** florencioh.real.estate@gmail.com
- **Elementos publicados:** 2 etiquetas + 1 activador + 6 variables
- **Verificación:** ✅ Tag Assistant confirmó disparo correcto (1 activación en jardinesdelsurcancun.mx)

### Workaround usado para el bug del botón Guardar:
El botón "Guardar" del trigger no se activaba con la sección "Habilite este activador..." vacía. Solución:
- Llenar la sección de arriba con: `{{Page Hostname}}` contiene `jardinesdelsurcancun.mx`
- Esto funciona como filtro de página (siempre verdadero en producción)
- Y la condición real de WhatsApp queda en la sección de abajo: `{{Click URL}}` contiene `wa.me`

### ✅ Lo que YA está hecho:

#### 2.0 Etiqueta de Google (tag base) — CREADA
- **Nombre:** `Etiqueta de Google AW-18157218280`
- **Tipo:** Etiqueta de Google
- **ID de etiqueta:** `AW-18157218280`
- **Activador:** Initialization - All Pages ✅ (carga en todas las páginas)
- **Status:** Guardada (no publicada todavía)

#### 2.1 Tag de conversión "WhatsApp Click" — CREADA
- **Nombre:** `WhatsApp Click`
- **Tipo:** Seguimiento de conversiones de Google Ads
- **ID de conversión:** `18157218280`
- **Etiqueta de conversión:** `UXk0CJTznrIcEOjThNJD`
- **Importada automáticamente** desde Google Ads (botón "Configurar en Google Tag Manager")
- **Status:** Configurada pero falta el último paso de guardado

#### 2.2 Variable integrada "Click URL" — ACTIVADA
- Activada en GTM → Variables integradas
- Bonus opcional: si también activaron "Click Text" y "Click Element" para debug futuro

#### 2.3 Trigger "Click - WhatsApp wa.me" — ✅ CONFIGURADO Y PUBLICADO
- **Nombre:** `Click - WhatsApp wa.me`
- **Tipo:** Solo enlaces (Clic - Solo enlaces)
- **Esperar etiquetas:** ✅ Marcado (tiempo: 2000 ms)
- **Comprobar validación:** ✅ Marcado
- **Activación:** Algunos clics en enlaces ✅
- **Sección "Habilite este activador..." (de arriba):** `{{Page Hostname}}` contiene `jardinesdelsurcancun.mx`
- **Sección "Ejecute este activador..." (de abajo):**
  - Variable: `{{Click URL}}` ✅
  - Operador: `contiene` ✅
  - Valor: `wa.me` ✅

### 🟠 Pendiente cuando el usuario regrese:

### ⚠️ ISSUE IDENTIFICADO 23 may 2026 noche
El usuario llegó hasta el final del trigger pero el botón **"Guardar" del trigger NO se activó** (queda gris) aunque todo está correctamente configurado:
- ✅ Nombre: "Click - WhatsApp wa.me"
- ✅ Esperar etiquetas + Comprobar validación marcados
- ✅ Algunos clics en enlaces seleccionado
- ✅ Sección "Habilite este activador..." (de arriba) VACÍA
- ✅ Sección "Ejecute este activador..." (de abajo): `{{Click URL}}` + `contiene` + `wa.me`

Intentó: click fuera del campo, Tab, borrar y reescribir wa.me — no funciona.

### 🔧 Troubleshooting al retomar — Probar en este orden:

**1. Refrescar la página de GTM (F5)**
- Los cambios DEBERÍAN haberse autoguardado parcialmente
- Si no, re-configurar el trigger desde cero (5 min)

**2. Eliminar y recrear el trigger** (si refresh no resuelve):
- Volver a Activadores → Click - WhatsApp wa.me → Eliminar
- Crear nuevo activador desde 0:
  - Nombre: `Click - WhatsApp wa.me`
  - Tipo: Solo enlaces
  - Esperar etiquetas: ✅
  - Comprobar validación: ✅
  - Activar en: Algunos clics en enlaces
  - Condición (sección DE ABAJO, NO la de arriba):
    - `{{Click URL}}` contiene `wa.me`
  - Guardar

**3. Si el botón Guardar SIGUE gris después de recrear:**
- Posible causa: la sección "Habilite este activador..." de arriba está siendo detectada con "contiene" sin valor (condición incompleta invisible)
- Solución: Ver si hay un botón `-` o ícono trash al lado derecho de esa sección de arriba para eliminarla por completo
- Alternativa: probar en otro navegador (Chrome incognito) para descartar cache

**4. Si nada funciona — workaround:**
- Configurar el trigger SIN "Esperar etiquetas" ni "Comprobar validación" (desmarcarlos)
- Esto puede que active el botón Guardar
- Las opciones son recomendadas pero NO obligatorias para que funcione el tracking

### Acciones después de Guardar el trigger:

1. **Editor del tag "WhatsApp Click"** automáticamente regresa:
   - El trigger "Click - WhatsApp wa.me" aparece en la sección "Activación" ✅
   - Click **"Guardar"** (botón azul arriba a la derecha del editor del tag)

2. **PAUSA antes de publicar** — pasamos al PASO 3 (verificar con Tag Assistant) ANTES de publicar.

### Si todo va bien, deberías ver en el dashboard de GTM:
- En "Cambios del espacio de trabajo": **3 cambios pendientes**
  - Etiqueta "Etiqueta de Google AW-18157218280" — Añadido
  - Etiqueta "WhatsApp Click" — Añadido
  - Activador "Click - WhatsApp wa.me" — Añadido

### NO toques "Publicar" aún:
- Necesitamos verificar primero con Tag Assistant
- Si publicamos antes de verificar y hay error, queda en producción con un bug
- Mejor verificar en modo Vista previa → publicar después

### Acciones en GTM Container `GTM-53BHDRWC`:

#### 2.1 Variable: Conversion Linker
- **Tipo:** Vinculador de conversiones
- **Trigger:** All Pages
- **Por qué:** Permite que Google asocie correctamente los clicks via `gclid`

#### 2.2 Trigger: WhatsApp Click
- **Tipo:** Click - Solo links
- **Esperar etiquetas:** Sí
- **Activar en:** Algunos clicks en enlaces
- **Condición:** `Click URL` → **contiene** → `wa.me`
- **Nombre:** `Click - WhatsApp wa.me`

#### 2.3 Tag: Google Ads Conversion
- **Tipo:** Seguimiento de conversiones de Google Ads
- **Conversion ID:** (del paso 1)
- **Conversion Label:** (del paso 1)
- **Trigger:** El trigger creado en 2.2
- **Nombre:** `GAds - WhatsApp Click Conversion`

#### 2.4 Publicar contenedor
- Click en "Publicar" arriba a la derecha en GTM
- Versión: `v1 - WhatsApp Conversion Tracking`

---

## ⏸ PASO 3: Verificar tracking con Tag Assistant

### Estado: ⏸ PENDIENTE

### Pasos:
1. Abrir Google Tag Assistant: https://tagassistant.google.com
2. Click en "Add domain" → pegar `https://jardinesdelsurcancun.mx`
3. Click en "Connect"
4. Esperar que abra el sitio en pestaña nueva con Tag Assistant overlay
5. Hacer click en cualquier botón de WhatsApp (FAB, CTA, etc.)
6. Confirmar en Tag Assistant que aparezca:
   - ✅ GTM container cargó
   - ✅ Trigger "Click - WhatsApp wa.me" se disparó
   - ✅ Tag "GAds - WhatsApp Click Conversion" se ejecutó

Si los 3 checks salen verdes, el tracking funciona.

---

## ⏸ PASO 4: Crear campaña Search

### Estado: ⏸ PENDIENTE

### Detalles a configurar (resumen):

**Campaña:**
- Tipo: Búsqueda
- Objetivo: "Conversiones" o "Cliente potencial"
- Sin objetivo de campaña (configuración sin orientación recomendada para más control)
- Nombre: `Jardines del Sur Cancún - Search`

**Configuración:**
- Redes: Solo Búsqueda (NO Display, NO partners de búsqueda)
- Ubicación: Cancún + 25 km
- Idioma: Español
- Audience segments: Skip por ahora
- Presupuesto: $100 MXN/día
- Estrategia de puja: CPC manual mejorado (primera fase)
- Horario: 8:00-21:00 L-S

**Grupos de anuncios:** (ver sección abajo)

---

## 🗝️ Keywords por grupo

### Grupo A — Brand Defense ($20-30/día)
```
"altta homes cancun"
"altta homes precios"
"sadasi cancun"
"grupo sadasi cancun"
"casas altta homes"
"departamentos altta homes"
"jardines del sur cancun"
"jardines del sur 6"
```

### Grupo B — Modelos Específicos ($30-40/día)
```
"casa tabachin"
"casa flamboyan"
"casa ceiba"
"casa noni cancun"
"departamento capua"
"departamento cedro plus"
"casa fresno elite"
"casa modelo alamo"
"la rioja 2 cancun"
"lirios residencial 2"
"lirios residencial cancun"
```

### Grupo C — Zonal Alto Intent ($30-40/día)
```
"casas en venta poligono sur cancun"
"departamentos en venta poligono sur"
"casas residenciales sur cancun"
"casa preventa cancun sur"
"departamentos preventa cancun"
"casas en venta avenida huayacan"
"casas avenida huayacan cancun"
"casas en preventa cancun"
"departamentos en preventa cancun"
"comprar casa cancun poligono sur"
```

---

## 🚫 Negative Keywords (Globales — aplica a todos los grupos)

### Renta / Alquiler
```
renta
rentas
alquiler
alquilar
arrendamiento
```

### Calidad baja
```
remate
remates
casas recuperadas
infonavit puntos
infonavit economico
fovissste consulta
```

### Empleo / Informativo
```
empleo
empleos
vacantes
trabajo
contratacion
arquitecto
planos gratis
tutorial
como
diy
```

### Ubicaciones que NO queremos
```
playa del carmen
tulum
puerto morelos
isla mujeres
cancun centro
zona hotelera
benito juarez
puerto aventuras
```

### Otros
```
gratis
gratuito
maqueta
constructor
construir
```

---

## 📝 Copy de anuncios (RSA — Responsive Search Ads)

### Plantilla Grupo A (Brand Defense)
**Títulos:**
1. Altta Homes Cancún Oficial
2. Casas y Deptos desde $1.85M
3. Atención por WhatsApp Directa
4. 3 Desarrollos · Polígono Sur
5. Cotiza con un Asesor Hoy
6. Sadasi — 50 Años de Trayectoria
7. Recorrido Virtual 360° Disponible
8. Precios con Descuento Aplicado

**Descripciones:**
1. 3 desarrollos Altta Homes. Casas y departamentos en Polígono Sur Cancún. Cotización por WhatsApp inmediata.
2. 50 años respaldo Grupo Sadasi. Recorridos virtuales 360°, precios oficiales, financiamiento Infonavit/FOVISSSTE.
3. Asesor independiente certificado. Información actualizada de cada modelo. Visitas agendadas en minutos.
4. Inversión inmobiliaria con plusvalía garantizada en zona de mayor crecimiento de Cancún.

**URL Final:** `https://jardinesdelsurcancun.mx`

### Plantilla Grupo B (Modelos Específicos)
Por cada modelo, anuncio dedicado con su URL específica:

Ejemplo para Casa Tabachín:
**Títulos:**
1. Casa Tabachín — Jardines Sur 6
2. 3 Recámaras desde $2.66M MXN
3. Recorrido Virtual 360° Disponible
4. 116 m² · 2 Niveles · 2.5 Baños
5. Smart Home Ready · 2 Estacionamientos

**Descripciones:**
1. 116m² de construcción, 120m² terreno, 2 niveles. Vestidor en recámara principal. Polígono Sur Cancún.
2. Recorrido virtual 360° + galería profesional. Atención inmediata por WhatsApp. Valor avalúo $3.3M.

**URL Final:** `https://jardinesdelsurcancun.mx/tabachin`

(Repetir para cada modelo con su precio, m², y URL corta correspondiente)

### Plantilla Grupo C (Zonal)
**Títulos:**
1. Casas Polígono Sur Cancún
2. Preventa desde $1.85M MXN
3. Av. Huayacán · Sadasi
4. Recorrido Virtual 360°
5. Atención por WhatsApp Hoy

**Descripciones:**
1. Casas y departamentos en preventa en Polígono Sur Cancún. 11 modelos disponibles. Avenida Huayacán.
2. Respaldo Grupo Sadasi 50 años. Infonavit, FOVISSSTE, crédito bancario. Cotización inmediata.

**URL Final:** `https://jardinesdelsurcancun.mx/jardines` o `/la-rioja` o `/lirios` según relevancia

---

## 📊 Métricas a monitorear (semanal)

| Métrica | Meta | Cómo medir |
|---------|------|------------|
| **Impresiones** | 500-1500/semana | Tab Visión General de campaña |
| **CTR** | 3-7% | Tab Visión General |
| **CPC promedio** | $5-15 MXN | Tab Visión General |
| **Conversiones** | 10-20/semana | Tab Conversiones |
| **CPA** | $40-90 MXN | Conversiones |
| **Quality Score** | 7-10 | Tab Keywords |
| **Impression Share** | >50% en marca, >20% otros | Tab Visión General |

---

## 📅 Roadmap de optimización

### Semana 1 (días 1-7)
- ✅ Setup completo (conversión + GTM + campaña)
- Lanzar campaña con CPC manual mejorado
- Verificar que el tracking registra conversiones
- NO hacer cambios — dejar que el algoritmo recopile datos
- **Análisis al día 7:** primer pulse check

### Semana 2 (días 8-14)
- Revisar Search Terms Report (qué buscaron exactamente los usuarios)
- Agregar negative keywords nuevas según términos irrelevantes
- Pausar keywords con CTR <2% después de 100+ impresiones
- Subir pujas en keywords con CTR >7% y conversión
- **Análisis al día 14:** definir si CPA está en rango

### Semana 3 (días 15-21)
- Si tenemos 15+ conversiones: cambiar a "Maximizar conversiones"
- Si CPA es alto, revisar landing page experience por grupo
- A/B test de copy en grupo con menor CTR
- **Análisis al día 21:** optimización fina

### Semana 4 (días 22-30)
- Si CPA estable y >30 conversiones: cambiar a "CPA objetivo $50"
- Escalar presupuesto solo si CPA bajo control
- Empezar a planear semana 5+ (escalabilidad o nuevos formatos)

---

## 🔄 Log de cambios y aprendizajes

### 23 may 2026 — Inicio de setup
- Decisión: empezar de 0 con la guía paso a paso
- Confirmado: presupuesto $100/día (no escalar al inicio aunque algunos reportes presionen a $15K/mes)
- Confirmado: NO usar Performance Max al inicio (Search puro)
- Documento `google-ads.md` creado para tracking continuo
- **PASO 1 COMPLETADO**: acción de conversión "WhatsApp Click" creada en Google Ads
  - Conversion ID: `18157218280`
  - Conversion Label: `UXk0CJTznrIcEOjThNJD`
  - Categoría: Contacto
  - Valor: $500 MXN (símbolo)
  - Recuento: Una
  - Ventana posclic: 30 días
- **PASO 2 — 95% completado**: configuración en GTM
  - ✅ Etiqueta de Google creada y guardada (AW-18157218280)
  - ✅ Tag de conversión "WhatsApp Click" creado con ID + Label correctos
  - ✅ Variable integrada "Click URL" activada
  - ✅ Trigger "Click - WhatsApp wa.me" 95% configurado (tipo Solo enlaces, Algunos clics en enlaces, condición {{Click URL}} contiene)
  - 🟠 Pausa por cita del usuario — falta escribir `wa.me` en el valor de la condición, guardar trigger, guardar tag, y verificar con Tag Assistant (PASO 3)

### Próximo retomar (al volver de la cita)
1. **Abrir GTM** (tagmanager.google.com) y entrar al container `GTM-53BHDRWC`
2. **Verificar estado** — si el trigger "Click - WhatsApp wa.me" aún existe:
   - Si sí: abrirlo y intentar Guardar de nuevo (puede que ya esté guardado)
   - Si no: re-crearlo siguiendo troubleshooting documentado arriba
3. **Si el botón Guardar sigue gris**, seguir la guía troubleshooting arriba (refresh → recrear → quitar checkboxes opcionales → cambiar de browser)
4. Guardar tag "WhatsApp Click" después de Guardar trigger
5. Activar modo "Vista previa" en GTM (botón "Vista previa" arriba derecha)
6. Probar con Tag Assistant: visitar `https://jardinesdelsurcancun.mx` en la pestaña conectada
7. Hacer click en cualquier botón WhatsApp del sitio
8. Verificar en Tag Assistant que:
   - ✅ Etiqueta "WhatsApp Click" se haya disparado (fired)
   - ✅ Conversión se envió a Google Ads
9. Si todo OK → publicar contenedor en GTM (botón "Enviar" / "Publicar" arriba derecha)
   - Nombre de versión: `v1 - WhatsApp Conversion Tracking`
   - Descripción: "Tracking de conversión WhatsApp Click vía wa.me + etiqueta base de Google Ads"
10. Empezar PASO 4: crear la campaña Search en Google Ads

---

## 🤔 Notas para análisis futuro

(Espacio para insights del usuario y mi análisis de resultados a medida que avancemos)

---

## ✅ CIERRE FINAL — Campaña Google Ads publicada

### Fecha
- **Publicada:** 23 de mayo de 2026
- **Estado inicial tras publicar:** Apta, en aprendizaje
- **Diagnóstico mostrado por Google Ads:** la nueva estrategia de ofertas está en aprendizaje

### Campaña publicada
- **Nombre:** `Cancún - Search - Casas y Deptos - v1`
- **Tipo:** Búsqueda
- **Objetivo:** Clientes potenciales
- **Objetivo de conversión:** Contactos
- **Estrategia de oferta:** Maximiza las conversiones
- **CPA objetivo:** No configurado
- **Presupuesto:** `MXN 100.00/día`
- **Límite mensual esperado:** aprox. `MXN 3,000 - 3,040/mes`
- **Nivel de optimización al cierre:** aprox. 90.1%
- **Recomendaciones de Google:** NO aplicar automáticamente, especialmente las de más keywords, concordancia amplia, IA Max o más presupuesto.

### Conversión usada por la campaña
- **Nombre:** `WhatsApp Click`
- **Qué cuenta como conversión:** click del usuario en un botón/enlace de WhatsApp dentro de `jardinesdelsurcancun.mx`.
- **Nota importante:** la conversión mide el click hacia WhatsApp; no puede confirmar si el usuario finalmente envió el mensaje.
- **Conversion ID:** `18157218280`
- **Conversion Label:** `UXk0CJTznrIcEOjThNJD`
- **Tracking:** GTM publicado y verificado con Tag Assistant antes de lanzar campaña.

### Configuración clave aplicada
- **Red:** Búsqueda.
- **No usar:** Display, Performance Max, IA Max, generador IA de anuncios/keywords, concordancia amplia automática.
- **Ubicación:** Cancún, Quintana Roo, México.
- **Opciones de ubicación:** Presencia, no "presencia o interés".
- **Idioma:** Español.
- **Horario:** Todo el día / 24-7.
- **Razón del horario 24-7:** Florencio ha cerrado operaciones con leads que escribieron tarde, 11 PM - 12 AM. No limitar a horario laboral estándar hasta tener datos reales por hora.
- **Segmentos de público:** sin agregar audiencias limitantes; observación solamente.
- **Anuncios políticos UE:** No.

### Estimación inicial mostrada por Google
- Con `MXN 100/día`, Google estimó aprox.:
  - **30-32 conversiones semanales**
  - **CPA estimado:** `MXN 21-23` por conversión
  - **Costo semanal:** `MXN 700`
- Esto es solo una estimación; validar con datos reales después de 3-7 días.

### Grupo de anuncios inicial
- **Grupo:** Brand defense / Grupo de anuncios 1.
- **Propósito:** capturar búsquedas de marca y desarrollos: Jardines del Sur, Altta Homes, Sadasi, Lirios, La Rioja.
- **Concordancia:** exacta `[ ]` y frase `" "`.
- **Regla:** no convertir a concordancia amplia aunque Google lo recomiende.

### Recursos configurados
- **Títulos:** 15/15 cargados.
- **Descripciones:** 4/4 cargadas.
- **Calidad del anuncio:** Excelente.
- **Vínculos a sitios:** se trabajaron con URLs únicas para evitar duplicados. Usar silos y modelos cuando aplique:
  - Home: `https://jardinesdelsurcancun.mx`
  - Jardines: `https://jardinesdelsurcancun.mx/jardines`
  - La Rioja: `https://jardinesdelsurcancun.mx/la-rioja`
  - Lirios: `https://jardinesdelsurcancun.mx/lirios`
  - Modelos: `/capua`, `/cedro-plus`, `/tabachin`, `/ceiba`, `/noni`, `/fresno-elite`, `/alamo`, `/noni-elite`, `/noni-la-rioja`, `/lirios-cedro`
- **Textos destacados:** agregados a nivel campaña. Ejemplos usados/recomendados:
  - Atención Personalizada
  - Casa Club y Alberca
  - Crédito Infonavit
  - Vigilancia 24/7
  - Asesoría Sin Costo
  - Recorridos Virtuales

### Recursos NO configurados a propósito
- **Imágenes:** no necesarias en Search; esta campaña es principalmente texto.
- **Llamadas:** no activar por ahora, para no mezclar objetivo. WhatsApp es la conversión principal.
- **Formularios de clientes potenciales:** no activar por ahora.
- **Precios:** no activar por ahora porque pueden cambiar.
- **Promociones:** no activar salvo que exista una promoción oficial con fecha clara.
- **Plantilla de seguimiento / sufijo URL:** vacío.

### Qué hacer ahora
1. Esperar a que Google revise y empiece a entregar impresiones.
2. No tocar la campaña durante las primeras 48-72 horas salvo error crítico.
3. Revisar al día 3:
   - Impresiones
   - Clics
   - CTR
   - CPC promedio
   - Conversiones `WhatsApp Click`
   - Costo por conversión
4. Revisar al día 7:
   - Términos de búsqueda reales
   - Agregar keywords negativas nuevas
   - Detectar keywords que gastan sin convertir
   - Confirmar si el CPA real se acerca al estimado.

### Qué NO hacer al inicio
- No aplicar recomendaciones automáticas de Google.
- No subir presupuesto porque Google lo sugiera.
- No activar IA Max.
- No activar Performance Max.
- No cambiar a concordancia amplia.
- No pausar por falta de conversiones en las primeras horas; la campaña está en aprendizaje.

---

## 📊 SESIÓN 2 — Día 0/1 (23 may 2026 noche → 24 may 2026 madrugada)

### Hora real de publicación
**~21:00 hrs** del 23 may 2026.
⚠️ Importante para próximas sesiones: el filtro "Todo el período" / "Hoy" en Google Ads NO muestra la hora de inicio — siempre preguntar al usuario para no malinterpretar la velocidad de entrega.

### Datos al cierre de sesión (~00:30 del 24 may, ~3.5h de campaña)
| Métrica | Valor | Lectura |
|---|---|---|
| Impresiones | 20 | Buen ritmo (~5.7/hora) |
| Clics | 8 | Saludable |
| **CTR** | **40%** | 🟢 Excepcional (vs 3-7% esperado) |
| CPC promedio | $25.58 | Alto pero esperado en aprendizaje |
| Costo total | $204.63 | Google está usando el "2x diario" permitido |
| Conversiones | 0 | Normal en primeras horas |
| Estado | Apto (limitado por keywords relevantes) | Se resolverá cuando aprueben las 23 nuevas |

### Performance de Sitelinks — insight clave
**3 de los primeros 4 clics se fueron por sitelinks**, no por el headline principal:

| Sitelink | Impr | Clics | CTR | CPC |
|---|---|---|---|---|
| Ver Modelos y Precios | 3 | 1 | 33% | $8.07 |
| Jardines del Sur 6 | 3 | 1 | 33% | $8.07 |
| Lirios Residencial 2 | 3 | 1 | 33% | $8.07 |
| Fresno Elite | 2 | 0 | 0% | — |
| Modelo Álamo | 2 | 0 | 0% | — |

- Sitelinks CPC $8 vs Headline CPC ~$63
- Valida estrategia de URLs únicas por desarrollo (silos)
- **Revisar día 7:** si Fresno Elite y Modelo Álamo siguen en 0 clics con 20+ imp, reemplazar por otros sitelinks de modelos

### ✅ Acción ejecutada — Brand-extension keywords al Grupo A

Agregadas **23 keywords** (12 exacta + 11 frase) al Grupo A:
```
[casas sadasi cancun]              "casas sadasi cancun"
[jardines del sur 1]               "jardines del sur 1"
[jardines del sur 2 cancun]        "jardines del sur 2 cancun"
[jardines del sur 3 cancun]        "jardines del sur 3 cancun"
[casas de jardines del sur cancun] "casas de jardines del sur cancun"
[sadasi jardines del sur]          "sadasi jardines del sur"
[altta homes jardines del sur]     "altta homes jardines del sur"
[fraccionamiento jardines del sur] "fraccionamiento jardines del sur"
[residencial jardines del sur]     "residencial jardines del sur"
[grupo sadasi cancun]              "grupo sadasi cancun"
[casa venta jardines del sur]      "casa en venta jardines del sur"
                                   "jardines del sur casas"
```

**Estado:** En revisión por Google (1-24h, normalmente <12h).
**Estado individual:** varias marcadas "No apta - Volumen de búsquedas bajo" → es **normal** en brand muy específica; Google reactiva automáticamente cuando alguien busca.

### 🚨 Problema descubierto (PENDIENTE arreglar sábado 24 may)

Las **keywords ORIGINALES del Grupo A** se quedaron en **concordancia AMPLIA** por error en el setup inicial:
- `altta homes cancun` → Amplia
- `altta homes cancún` (con tilde) → Amplia
- `casa ceiba jardines del sur` → Amplia
- `sadasi cancun casas` → Amplia
- `casas jardines del sur cancun` → Amplia
- `lirios residencial cancun` → Amplia
- `jardines del sur 6` → Amplia
- `la rioja 2` → Amplia
- `departamentos lirios cancun` → Amplia
- (Revisar lista completa en panel — pueden ser más)

**Acción sábado:** abrir Grupo A → Palabras clave → click en cada keyword amplia → editar concordancia → cambiar a **Frase** (más conservador) o **Exacta** (más estricto). NO eliminar, solo cambiar tipo de concordancia.

### Trampas de Google detectadas y evitadas correctamente
1. ❌ Botón **"Cambiar las palabras clave a la concordancia amplia"** (apareció al pegar el bloque brand-extension) — IGNORADO
2. ❌ Sugerencia **"Aplicar todo"** en Recomendaciones (18 keywords todas en amplia) — DESCARTADO
3. ❌ Crear Performance Max / Expansión Display / Socios de búsqueda — PENDIENTE descartar

### 📌 Pendientes — Sábado 24 may
1. Descartar 3 recomendaciones malas en panel (30 seg)
2. Cambiar ~10 keywords AMPLIA originales del Grupo A a Frase/Exacta (5-10 min)
3. Revisar verificación de marca en Admin → Empresa (favicon ausente en anuncios)
4. Confirmar que el estado de campaña pasó de "Apto (limitado)" a "Apto"
5. NO crear Grupo C todavía — esperar día 3 con más datos

### 📌 Pendientes — Martes 26 may (Día 3 — primera revisión real)
1. **Search Terms Report:** ver qué términos exactos buscaron los usuarios
2. **Negative keywords:** agregar según términos irrelevantes detectados
3. **CPA real:** evaluar si hubo conversiones y a qué costo
4. **Decisión Grupo C:** crear Zonal Alto Intent si el volumen del Grupo A sigue insuficiente
5. **Pausar keywords con 50+ impresiones y 0 clics** (si las hay)

### Sobre el favicon ausente en anuncio
- **Estético, NO afecta CTR ni conversiones**
- Causa probable: verificación de marca pendiente en Google Ads (Admin → Empresa)
- También puede tardar 1-2 semanas en aparecer aunque esté verificada
- Prioridad: BAJA (no bloquea nada)

### Aprendizajes consolidados de esta sesión
1. **Brand keywords muy nicho en Cancún → poco volumen:** muchas variantes terminan en "No apta - Volumen bajo". Es normal en mercados medianos como Cancún. Google las mantiene y reactiva cuando hay búsquedas reales.
2. **Sitelinks específicos por desarrollo > home genérica:** CPC $8 vs $63. Mantener silos.
3. **Hora de inicio importa para interpretar métricas tempranas** (anotar siempre).
4. **Zona horaria del reporte:** GMT-6 (hora central de México) — confirmar al exportar datos.
5. **"Maximiza conversiones" sin target funciona razonable en arranque** aunque el plan original decía CPC manual — no cambiar ahora, evaluar día 14.

### Próxima sesión: Sábado 24 may
Tareas concretas, en este orden:
1. Login a Google Ads → revisar status de las 23 keywords nuevas (¿ya aprobadas?)
2. Recomendaciones → descartar las 3 malas
3. Grupo A → corregir keywords en amplia
4. Verificación de marca (Admin → Empresa)
5. Si todo OK → cerrar sesión y esperar día 3

---

## 📞 LEADS RECIBIDOS (registro manual)

### Lead #1 — Sábado 24 may 2026, ~10:20 AM
- **Canal:** LLAMADA telefónica (no WhatsApp)
- **Fuente real:** Google Business Profile (botón de llamada del perfil de empresa en Google Maps/Search local)
- **NO atribuible a Google Ads** (la campaña Search no tiene extensión de llamada activada)
- **Estado:** Muy interesado, ya se le envió catálogo y cotizaciones
- **Modelos cotizados:** Cedro Plus, Capua Jardines del Sur 6
- **Resultado pendiente:** seguir el seguimiento de venta

### Implicaciones para análisis
- El CPA real de Google Ads **NO** se afecta por este lead (no vino de la campaña)
- Esto SÍ valida que el Google Business Profile está funcionando como canal orgánico
- Si llegan 2-3 llamadas más esta semana, evaluar **agregar extensión de llamadas a la campaña Search** (Google sí cuenta llamadas como conversión cuando vienen del anuncio)

### Cómo distinguir leads de Google Ads vs orgánico (recordatorio)
1. **WhatsApp con texto "vi su anuncio en Google..."** → vino del sitelink directo "Informes por WhatsApp" (agregado sesión 23)
2. **WhatsApp con texto genérico** "Hola, quiero más información sobre las casas y departamentos de Altta Homes en Cancún" → vino del FAB/Header/Hero/Footer del sitio (puede ser ads o orgánico)
3. **WhatsApp con texto específico de modelo** ("Hola, quiero cotizar la casa modelo Tabachín en Jardines del Sur 6") → vino de la ficha del modelo o tour 360°
4. **Llamada telefónica** → siempre de Google Business Profile (orgánico), porque la campaña Ads NO tiene call extension
5. **Pregunta directa** al lead: "¿Cómo se enteró de los desarrollos?" sigue siendo lo más confiable

---

## 📊 SESIÓN 3 — Día 2-3 (25 may 2026)

### Métricas acumuladas al 25 may 2026
| Métrica | Valor | Lectura |
|---|---|---|
| Impresiones | 184 | Buen volumen para brand keywords en Cancún |
| Clics | 23 | CTR **12.5%** — excelente (esperábamos 3-7%) |
| CPC promedio | $10.40 MXN | Dentro del rango esperado ($5-15) |
| Gasto total | $239 MXN | ~2.5 días de campaña, normal |
| Conversiones | 0 | Normal en días 1-3 de real estate |
| Hoy (lun 25 may) | 5 clics · 45 imp | Día en curso |

### ✅ Nuevo recurso — Sitelink "Informes por WhatsApp"
- **Nivel:** Campaña
- **Texto:** `Informes por WhatsApp`
- **Descripción 1:** `Respuesta inmediata con un asesor`
- **Descripción 2:** `Sin costo · Cotiza hoy mismo`
- **URL final:** `https://wa.me/529982059044?text=Hola%2C%20vi%20su%20anuncio%20en%20Google%20y%20quiero%20informes%20sobre%20los%20modelos%20disponibles%20en%20Canc%C3%BAn.`
- **Rationale:** lead de alta intención va directo a WhatsApp sin pasar por el sitio. El texto "vi su anuncio en Google" en el mensaje pre-llenado = tracking manual de fuente. No registra conversión en GTM — trade-off aceptado: lead real > dato de conversión en esta etapa temprana.
- **IMPORTANTE:** si el algoritmo empieza a recibir muchos clicks por sitelink sin conversiones registradas, puede afectar la optimización. Evaluar en semana 3.

### ⏳ Pendiente — Extractos de sitio (Fragmento estructurado)
Recomendación de Google pendiente de aplicar manualmente:
- **Encabezado:** `Amenidades`
- **Valores:** `Alberca y Casa Club` · `Gimnasio Cerrado` · `Cancha de Pádel` · `Skate Park` · `Dog Park` · `Seguridad 24/7`

### ✅ COMPLETADO — Meta Pixel base instalado vía GTM (27 may 2026)

**Pixel ID:** `2016457592282966`
**Dataset name:** `Jardines del Sur Cancún - Web`
**Versión GTM publicada:** `v3 - Meta Pixel Base Code` (27/05/2026, 0:20)
**Método:** HTML personalizado en GTM container `GTM-53BHDRWC`, trigger `All Pages` — cero cambios al código del sitio.

**Cuentas publicitarias conectadas al dataset:**
- Florencio Real Estate (8254358097993589)
- Jardines del Sur Cancún (1520643452585889)
- Marketing Real Estate (2180108582737946)

**Configuración aplicada:**
- ✅ Coincidencias avanzadas automáticas: ACTIVADAS (hashea email/teléfono client-side si en futuro hay formularios)
- ❌ API de conversiones (CAPI): DESACTIVADA (fase 2, requiere setup del servidor)
- ❌ Categorías sensibles: NINGUNA (real estate no aplica)
- ✅ Evento base: `PageView` automático en cada carga

**Verificación en modo Preview (GTM + Tag Assistant):**
- ✅ `Meta Pixel - Base Code` → Activado en page load
- ✅ `WhatsApp Click` → Activado al clickear botón wa.me (sigue funcionando, sin regresión)
- ✅ `Etiqueta de Google AW-18157218280` → Activado (sin cambios)
- ✅ 0 etiquetas no activadas indeseadas

**Flujo objetivo:**
```
Usuario busca en Google → entra al sitio → Pixel de Meta se activa
→ abre Facebook/Instagram → le aparece el anuncio de Altta Homes
```

### ⏳ PENDIENTES — Fase 2 Meta (próximas sesiones)

**1. Verificar Pixel en producción (5 min — al despertar 28 may)**
- Abrir Chrome en incógnito → visitar `https://jardinesdelsurcancun.mx`
- Extensión Meta Pixel Helper debe mostrar ícono AZUL con `1` + Pixel ID `2016457592282966` + evento `PageView`
- Si está GRIS: diagnosticar caché, ad blocker, propagación GTM
- En Meta Events Manager → dataset `Jardines del Sur Cancún - Web` → la barra "Eventos totales" debe empezar a moverse de 0

**2. Evento `Lead` en click WhatsApp (10-15 min)**
- Crear segundo tag en GTM: tipo HTML personalizado
- Snippet: `<script>fbq('track', 'Lead');</script>`
- Trigger: reusar `Click - WhatsApp wa.me` que ya existe
- Beneficios: métrica de leads real (no solo tráfico), permite audiencia "Quienes sí clickearon WhatsApp" (warm leads para campaña dedicada)
- Importante: usar `fbq('track', 'Lead')` (evento estándar de Meta), NO `trackCustom` — el estándar tiene mejor matching y optimización

**3. Verificación de dominio en Meta Business Manager (10 min — importante para iOS 14+)**
- Business Settings → Brand Safety → Domains → Add `jardinesdelsurcancun.mx`
- Método recomendado: meta-tag en `<head>` (requiere cambio en `app/layout.tsx`) o registro DNS TXT (sin tocar código)
- Sin esto, la atribución en usuarios iOS está limitada a 8 eventos prioritarios (Aggregated Event Measurement)
- Después de verificar: configurar prioridad de eventos en Events Manager

**4. Audiencia de retargeting (cuando hayan ~100 visitantes acumulados, ~1-2 semanas)**
- Meta Ads Manager → Audiencias → Crear audiencia personalizada → "Tráfico del sitio web"
- Regla: "Todos los visitantes del sitio web · últimos 30 días"
- Naming sugerido: `JdS - Web Visitors 30d`
- Audiencia "warm" adicional cuando se implemente evento Lead: `JdS - Lead Clickers 30d`

**5. Primera campaña de retargeting Meta (cuando audiencia ≥ 1,000 usuarios)**
- Tipo: Conversiones (objetivo: Lead) o Tráfico al sitio
- Audiencia: `JdS - Web Visitors 30d` EXCLUYENDO `JdS - Lead Clickers 30d` (para no perseguir a los que ya clickearon)
- Presupuesto inicial sugerido: $50 MXN/día (complemento de Google Ads, no reemplazo)
- Creativos: usar el banner 3780×1890 que el usuario ya tiene (sesión 19, 21 may) + 2-3 variantes con highlights de modelos

**6. CAPI (API de conversiones) — fase 3 (mes 2+, si Pixel performance lo justifica)**
- Requiere endpoint server-side que reciba eventos del sitio y los reenvíe a Meta vía API
- Beneficio: tracking confiable en iOS, ad blockers, navegadores con cookies bloqueadas
- Implementación en Next.js: Route handler en `app/api/meta-capi/route.ts` + fetch desde cliente o desde server al disparar eventos
- Considerar después de tener Pixel funcionando ≥ 1 mes con suficientes datos para justificar el setup

### Aprendizajes de esta sesión
1. **CTR 12.5% valida que las keywords de marca son muy relevantes** — usuarios que buscan Altta Homes / Sadasi / Jardines del Sur hacen click
2. **0 WhatsApps en día 2-3 es normal en real estate** — ciclo de decisión largo; la ventana de conversión es 30 días
3. **Sitelink directo wa.me = válido para leads de alta intención** — el texto pre-llenado hace tracking manual de fuente
4. **Google Ads captura intención → Meta Retargeting persigue al visitante** — complementarios, no competidores

### Próxima revisión: Martes 26 may (Día 3 oficial)
1. **Search Terms Report** — ver qué términos exactos buscaron los 23 usuarios
2. **Negative keywords** — agregar según términos irrelevantes detectados
3. **Evaluar conversiones** — ¿llegó algún WhatsApp rastreable?
4. **Decidir Grupo C** (Zonal alto intent) — si el volumen de Grupo A sigue bajo
5. **Pausar keywords** con 50+ impresiones y 0 clics
6. ✅ **Meta Pixel base instalado el 27 may madrugada** — ver sección "COMPLETADO — Meta Pixel base" arriba. Pendientes de fase 2 ahí mismo.
