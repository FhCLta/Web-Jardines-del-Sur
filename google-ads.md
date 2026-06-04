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

### ✅ COMPLETADO — Fase 2 Meta eventos configurados (27 may 2026)

**1. ✅ Pixel verificado en producción**
- `PageView` activo, 13+ eventos recibidos — confirmado en Events Manager
- Dataset `Jardines del Sur Cancún - Web` (ID `2016457592282966`) recibiendo datos correctamente

**2. ✅ Eventos `ViewContent` y `Lead` configurados vía Meta Event Setup Tool**
- Configurados sin tocar código ni GTM — directamente desde Events Manager usando la herramienta visual
- `ViewContent` por URL: home, 3 silos (Jardines del Sur 6, La Rioja 2, Lirios Residencial 2) + páginas de modelos individuales
- `ViewContent` por botón: "ver modelos precios"
- `Lead`: todos los botones de WhatsApp del sitio
- Método: `Configuración manual` vía Navegador — confirmado con prueba en `Probar eventos` (Ver contenido × 4 + PageView procesados)
- 3 cuentas publicitarias conectadas al dataset pueden usar estos datos

### ⏳ PENDIENTES — Fase 2 Meta (restantes)

**3. Verificación de dominio (importante para iOS 14+)**
- Pendiente: no se encontró la sección en la UI de Meta Business Manager (cambió de ubicación)
- Opciones: (a) meta-tag en `app/layout.tsx` con código `facebook-domain-verification` o (b) registro DNS TXT en proveedor del dominio
- Sin esto, atribución en usuarios iOS está limitada (Aggregated Event Measurement)
- No urgente — no bloquea el tracking actual

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

---

## 🚨 CIRUGÍA EXITOSA — Rescate de keywords (28 may 2026)

### El daño detectado
Entre el **23 may 21:18** y **27 may 21:16**, el usuario aceptó (desde celular, sin entender que eran trampas) **6 recomendaciones automáticas malas** de Google Ads que:
1. **Agregaron 26 keywords en concordancia AMPLIA** (en 4 batches del 23 may entre 21:18-21:29 + 1 batch del 27 may 21:15)
2. **BORRARON 21 exactas + 7 frase el 27 may 21:16** — recomendación etiquetada como "Palabra clave redundante" (Google sugirió "limpiar" porque las amplias hacían "redundantes" a las exactas — exactamente al revés de lo correcto)

**Estado al detectar (28 may):**
- 0 exactas activas 🚨
- 12 frase activas
- 26 amplia activas (TODAS las búsquedas pasaban por amplia)
- ~24h corriendo con setup tóxico, ~$87-100 MXN potencialmente desperdiciados

### Método de rescate (clave para el futuro)
**Historial de cambios → checkbox del cambio → botón `Deshacer`.**

Mucho más limpio y rápido que restaurar/eliminar a mano. Google revierte exactamente la operación atómica (incluyendo "agregó X keywords" o "quitó Y keywords + Z frase").

Originalmente preparé plan de restauración manual (listas de 21 exactas + 7 frase a re-agregar + 26 amplia a borrar). El usuario descubrió `Deshacer` en el Historial → 6 clicks resolvieron 20 min de trabajo manual, sin riesgo de typos.

### Lo que se deshizo (6 cambios, en orden cronológico inverso)
1. **27 may 21:16** — "Palabra clave redundante" (restauró 21 exactas + 7 frase + 1 amplia)
2. **27 may 21:15** — "Concordancia amplia" (quitó 1 amplia: "residencial jardines del sur")
3. **23 may 21:29** — "Concordancia amplia" (quitó 7 amplia)
4. **23 may 21:28** — "Concordancia amplia" (quitó 1 amplia: "cancun jardines del sur")
5. **23 may 21:24** — "Concordancia amplia" (quitó 4 amplia)
6. **23 may 21:18** — "Concordancia amplia" (quitó 14 amplia)

### Lo que NO se tocó (los buenos)
- **23 may 19:21** — Creación campaña + 11 exactas + 7 frase + 1 anuncio (manual)
- **23 may 22:40** — Brand extension manual (10 exactas + 12 frase) — la planificada en sesión 22

### Estado final post-rescate ✅
| Tipo | Cantidad |
|---|---|
| Exactas `[ ]` | **21** |
| Frase `" "` | **19** |
| Amplia | **0** |
| **Total** | **40 keywords correctas** |

De las 40, **~10 están en "No apta - publicación limitada"** — NORMAL en brand keywords nicho en Cancún (ya documentado en sesión 22). Google las reactiva automáticamente cuando hay búsquedas reales. NO requieren acción.

Lista de las "No aptas":
- "altta homes jardines del sur" (frase + exacta)
- [la rioja 2 altta homes]
- [sadasi cancun casas]
- [casas de jardines del sur cancun]
- [lirios residencial 2] (curioso: ya generó 1 conv y aún así está limitada, normal en sporadic-search keywords)
- "jardines del sur sadasi" (frase + exacta)
- [lirios residencial 2 cancun]
- [sadasi jardines del sur]

### 💡 Insight clave — cuánto se desperdiciaba en amplia
Reporte de palabras clave del periodo 12-28 may:

| Métrica | Grupo total (con amplia históricas) | Keywords actuales (sin amplia) | Diferencia atribuible a amplia |
|---|---|---|---|
| Clicks | 59 | 32 | **27 clicks desperdiciados** |
| Costo | $480 MXN | $304 MXN | **$176 MXN quemados** |
| Conversiones | 3 | 3 | **0 conv generadas por amplia** |
| CPA | $160 | **$101** | — |

→ **37% del presupuesto se quemaba en clicks irrelevantes via amplia, con CERO conversiones.** El rescate bajó el CPA real de $160 → $101 (mejora del 37%).

### 🏆 MVPs identificadas (las que sí convierten)
| Keyword | Tipo | Clics | CTR | Conv | CPA |
|---|---|---|---|---|---|
| `"residencial jardines del sur"` | Frase | 4 | 8.89% | 1 | **$12.90** 🥇 |
| `[lirios residencial 2]` | Exacta | 2 | 40% | 1 | **$25.38** 🥈 |
| `[jardines del sur 6]` | Exacta | 12 | 17.91% | 1 | $89.14 🥉 |

**"residencial jardines del sur" en frase = joya escondida.** CPA $12.90 brutal para real estate. Considerar agregar variantes ("residencial sur cancun", "fraccionamiento residencial jardines del sur", etc.) en próxima sesión.

### 📚 Lecciones grabadas (críticas, no repetir)
1. **NUNCA aceptar recomendaciones de Google Ads desde celular.** Los botones grandes facilitan toques accidentales y muchas recomendaciones son trampas. Desde celular: solo MIRAR métricas.
2. **El "Nivel de optimización" NO mide calidad** — mide obediencia con Google. 70-80% es saludable cuando rechazas trampas. 100% suele significar que aceptaste recomendaciones malas.
3. **Aplicación automática SIEMPRE desactivada.** Lo que aplique automáticamente Google a tu cuenta NO lo controlas y suele incluir amplia.
4. **Para revertir errores en Google Ads:** Historial de cambios → checkbox del cambio → `Deshacer`. Más limpio y rápido que restaurar a mano. Funciona para cambios de los últimos ~90 días.
5. **Recomendaciones siempre malas (DESCARTAR sistemáticamente):**
   - "Activa IA Max para Búsqueda"
   - "Cambia palabras clave a concordancia amplia"
   - "Aplicar todo" en lista de recomendaciones
   - "Quita palabras clave redundantes" (Google considera redundantes las exactas si hay amplias — lógica invertida)
   - "Activa Performance Max"
   - "Sube tu presupuesto" (subir solo cuando CPA esté bajo y estable ≥7 días)
   - "Agrega palabras clave nuevas" (Google sugiere generic, no brand)

### ⏳ Pendiente blindaje (al cerrar sesión 28 may)
1. **Desactivar "Aplicación automática"** en panel de Resumen → desmarcar TODAS las opciones (especialmente "Agrega palabras clave de concordancia amplia" y "Quite palabras clave redundantes")
2. **Recorrer Recomendaciones** → descartar individualmente todas las trampas conocidas (3 puntitos → Descartar → razón "No es relevante")
3. **Reglas mentales del usuario** (grabar):
   - "Desde celular: solo MIRAR métricas, JAMÁS tocar botones azules"
   - "Desde PC: 'Aplicar todo' NUNCA. Solo aplicar UNA recomendación si entiendo qué hace"
4. **Monitorear 3-5 días:** el CPA real debería estabilizarse en $80-110 con keywords limpias. Si sube ≥$200 sostenido, revisar Search Terms para agregar negative keywords.

---

## 🚀 SESIÓN 26 — Optimización integral (29 may 2026)

Sesión maratón. Florencio pasó de "novato Google Ads" a "advertiser intermedio" en 6+ horas. Se ejecutaron 5 fases de optimización + GBP Lirios 2 + Meta AI prompt v2.

### Estado al inicio (post sesión 25)
- 21 exactas + 19 frase + 0 amplia (cirugía exitosa de ayer)
- CPA $186 con 3 conv en 64 clics
- CTR 8.02% (excelente)
- 0 negative keywords agregadas
- Aplicación automática: estado desconocido
- Quality Score: nunca visto
- Extensiones: 5 callouts + 11 sitelinks + 0 structured snippets

### Estado al cierre (post sesión 26)
- 21 exactas + 18 frase activas (pausada `"casa en venta jardines del sur"` QS 3) + 0 amplia
- ~85 keywords NEGATIVAS agregadas a nivel Grupo
- Aplicación automática CONFIRMADA off (0/7 + 0/14)
- 3 trampas descartadas: IA Max, Concordancia amplia, Quita redundantes
- Logo subido para brand verification
- 9 callouts (5 + 4 nuevos)
- 10 sitelinks activos (Fresno Elite pausado por 0% CTR, Capua rephraseado)
- 1 structured snippet creado (header "Servicios" con 6 amenidades)
- Quality Score visible en columnas
- Nivel de optimización: 100% (estado "experto")

### Fase 1 — Blindaje
**Aplicación automática:**
- Confirmada en 0 de 7 (Mantén tus anuncios) + 0 de 14 (Expande tu empresa)
- Botones "Seleccionar todas" identificados como peligro máximo
- Lección crítica: las trampas que aceptó por accidente sesión 23-25 NO vinieron de auto-application, vinieron de aceptación manual desde móvil

**3 recomendaciones descartadas:**
1. **"Activa IA Max para Búsqueda"** (+17.1%) → trampa: Display + YouTube + Discover sin control
2. **"Agrega palabras clave de concordancia amplia"** (+13.1%) → la trampa que causó el desastre de sesión 22-25
3. **"Quite palabras clave redundantes"** (+0.7%) → iba a borrar la MVP `"residencial jardines del sur"` CPA $12.90

**Logo de marca subido:**
- Resuelve el favicon ausente en anuncios documentado desde sesión 22
- Aprobación esperada en 1-2 semanas
- Beneficio esperado: +3-8% CTR cuando aparezca el logo

### Fase 2 — Search Terms + Negative Keywords (la cirugía preventiva)

**Reporte descargado y analizado:**
- 64 clics distribuidos en ~170 búsquedas distintas
- $559 invertidos, identificado ~$140 quemado en clicks que nunca iban a convertir
- 3 conversiones identificadas: `[jardines del sur 6]` exacta ($72.75), `[lirios residencial 2]` exacta ($60.68), 1 conv en "Otros términos" probablemente `"residencial jardines del sur"` frase ($12.90 — la MVP)

**~85 keywords negativas agregadas** clasificadas por categoría:

*Competidores reales identificados (constructoras + agregadores):*
ara, ruba, cadu, javer, amalba, catania, inmuebles24, hogaresunion, hogares-sm, arbolada, cumbres, turquesa, kulkana, sayab, sense, malibu, real valencia, gran kabah, gran via, las americas, altai, las torres, sacbe, balam, lakin, calakmul, kusamil, maderas, ciudad maderas, ciudad natura, cd natura, santa fe, trovit, urbi, urbana park, liverté, lausana, rio cancun, aqua, palmaris, villa marino, villas del rey, villas del mar, marina turquesa, izamal, sarabi, jade, mayakoba, monteverde, los santos cancun, prado norte, rincon del prado, real oasis, vassari, wolf towers, punta ikal, terraquia, kalam, vista real, privada sacbe, privadas sacbe, privadas balam, privadas lakin, privadas en cancun, privadas turquesa, privadas cancun, rio residencial, inmobiliaria cerca de mi, residenciales cancun, residencial cumbres, residencial turquesa, residencial sense, residencial malibu, residencial arbolada, residencial aqua, residencial real valencia, residencial kulkana, residencial altai, casas javer, jardin del sur (singular).

*Renta / intención equivocada:*
renta, alquiler, alquilar.

*Infonavit informativo:*
casas de infonavit, infonavit puntos, como sacar, como se saca.

*Ubicaciones equivocadas:*
playa del carmen, tulum, puerto morelos, isla mujeres, zona hotelera.

*Fases viejas Jardines del Sur:*
`[jardines del sur 4]`, `[jardines del sur 5]`, `[jardines del sur 7]`, `"jardines 3"`, `"jardines 4"`, `"jardines del sir"` (typo).

*Genéricos sobre-amplios:*
casas baratas.

**Conflictos detectados y omitidos correctamente:**
- `[jardines del sur 1]` — overlap con positivo
- `[jardines del sur 2]`, `[jardines del sur 3]` — posible overlap con positivos `[jardines del sur 2 cancun]` y `[jardines del sur 3 cancun]`
- `"residencial la rioja"`, `"residencial lirios"`, `"residencial jardines del sur"` — overlap con keywords MVPs

**Nivel actual: GRUPO de anuncios.** Pendiente subir a nivel CAMPAÑA para que cubran Grupos B y C futuros.

### Fase 5 — Extensiones (callouts + snippets + sitelinks)

**Callouts (Texto destacado) — 4 nuevos agregados:**
- "Recorrido Virtual 360°" (22 chars)
- "WhatsApp Inmediato" (18 chars)
- "Asesor Autorizado Altta" (23 chars)
- "50 Años Grupo Sadasi" (20 chars)

Total: 9 callouts en rotación. Mejor performer actual: "Crédito Infonavit" (CTR 10.58%). Peor: "Vigilancia 24/7" (2.90%) — dejado por poca data, re-evaluar 7-14 días.

**Structured Snippets — PRIMER fragmento creado a nivel Campaña:**
- Header: **`Servicios`** (no había "Comodidades" en dropdown para categoría Agente inmobiliario)
- Valores (6):
  1. Alberca y Casa Club
  2. Gimnasio Cerrado
  3. Cancha de Pádel
  4. Skate Park
  5. Dog Park
  6. Seguridad 24/7

**Sitelinks — auditoría completa de los 11 existentes:**

MVPs (CTR >10%, mantener intactos):
- `/lirios` (Lirios Residencial 2) — **16.96% CTR** 👑
- `/noni` (Casa Noni) — 15.31% CTR
- `/` (Ver Modelos y Precios) — 14.81% CTR
- `/jardines` (Jardines del Sur 6) — 12.42% CTR

OK (CTR 5-10%, vigilar):
- `/la-rioja` (La Rioja 2 Cancún) — 8.70% CTR
- `/alamo` (Modelo Álamo) — 8.16% CTR
- `/cedro-plus` (Modelo Cedro Plus) — 7.69% CTR (solo 26 impr, poca data)
- `/ceiba` (Casa Ceiba) — 5.13% CTR
- `/noni-elite` (Noni Elite) — 5.13% CTR

**ACCIONES de la sesión:**
- **PAUSADO** `/fresno-elite` (Fresno Elite) — 0 clicks 53 impr **0% CTR** (perro muerto)
- **REPHRASEADO** `/capua` (Modelo Capua) — era CTR 1.39%, cambiado:
  - Título antes: "Modelo Capua" → ahora: `Capua desde $1.7M`
  - Desc 1: "Departamento de 3 recámaras" → `Depto 3 recámaras, 85 m²`
  - Desc 2: "Ver precio y recorrido virtual" → `Recorrido virtual gratis`
  - Espera CTR esperado: 6-9% post-rephrase

NO se agregaron más sitelinks (10 activos = suficiente, Google muestra max 4-6 por ad).

### Fase 3 — Quality Score (educativo + 1 acción)

**4 columnas activadas:**
1. Nivel de calidad
2. CTR previsto
3. Exp. en página de destino
4. Relevancia del anuncio

**Hallazgos:**

🏆 **QS 10 PERFECTO** — `[jardines del sur 6]` exacta
- Superior en TODOS los sub-factores
- 13 clics · 81 impr · 16.05% CTR · $7.60 CPC
- 1 conv · $98.85 CPA
- Estado: intocable

🟢 **QS 7-8** (8 keywords, todas brand):
- `[casas sadasi cancun]` (8), `"casas sadasi cancun"` (8)
- `[jardines del sur cancun]` (7), `[grupo sadasi cancun]` (7), `[altta homes cancun]` (7), `"altta homes cancun"` (7), `"sadasi cancun"` (7), `"jardines del sur cancun"` (7)

🟡 **QS 5** (4 keywords) — **PATRÓN DETECTADO**:
- `[sadasi cancun]`, `"la rioja 2"`, `[lirios residencial 2]`, `"sadasi cancun"`
- TODAS con sub-factor "Exp. en página de destino: INFERIOR al promedio"
- Causa raíz: home `jardinesdelsurcancun.mx` no profundiza en "Sadasi" como marca, se siente genérico para esas búsquedas brand
- **Oportunidad futura (no urgente):**
  1. Cambiar URL final de keywords brand para apuntar a silos específicos (`/jardines`, `/la-rioja`, `/lirios`) en lugar del home
  2. Crear sección "Respaldo Sadasi 50 años · 430,000+ viviendas" más prominente en home
  3. Crear landing dedicada `/sobre-sadasi` solo si las brand keywords vuelven dominantes en spend

🚨 **QS 3 PAUSADA** — `"casa en venta jardines del sur"` frase
- Relevancia INFERIOR + Exp INFERIOR (combo malo)
- 0 clics 2 impr — era lastre que arrastraba QS de grupo
- Razón probable de mismatch: anuncio dice "casas y departamentos" (genérico), keyword es intención de COMPRA específica
- Plan: re-activar SOLO si creamos Grupo B con copy específico por modelo

### Insights de Auction Insights (Estadísticas de subasta)

**Competidores identificados:**
1. **Florencio (TÚ)** — 29% impression share 🥇
2. ara.com.mx — 23%
3. cataniaresidencial.mx — 22%
4. inmuebles24.com — 22%
5. hogaresunion.com — 20%

**Top spot %:**
- amalba.mx — 33% (puja agresivo)
- ara.com.mx — 28%
- inmuebles24.com — 27%
- cataniaresidencial.mx — 25%
- **Florencio — 12%** ⚠️ (oportunidad: subir bid en MVPs)

### Datos demográficos confirmados

- 25-34 años: 18 clics (sweet spot)
- 18-24 años: ~14 clics
- 35-44 años: ~12 clics
- 45-54 años: ~9 clics
- 55-64 años: ~2 clics
- 65+: ~2 clics
- Desconocido: ~14 clics

Para Grupos B y C futuros: bid +10% en 25-44, -50% en 55+.

### Métricas comparativas — antes vs esperado

| Métrica | Antes (12-29 may) | Esperado post-cambios (3-5 días) |
|---|---|---|
| CTR | 8.07% | **12-15%** |
| CPC promedio | $8.91 | **$6-7** |
| % conversión | 4.55% | **6-8%** |
| CPA | $186 | **$110-140** |
| Términos basura del gasto | ~37% | **<10%** |

### Lecciones grabadas en esta sesión

1. **Nivel de optimización 100% NO significa obedecer a Google.** Significa "addressed" — aplicar O descartar. 100% con todas las trampas descartadas = estado ideal.
2. **No optimizar con poca data** — error #1 de principiantes. Para juzgar un callout/keyword necesitas mínimo 500-1000 impresiones. Antes son ruido.
3. **Quality Score 5 con conversión > QS 10 sin conversión.** La conversión gana sobre QS siempre.
4. **El patrón "Exp página INFERIOR" en brand keywords** revela oportunidad de mejorar landing experience para SEO + Ads.
5. **Una keyword en QS 3 arrastra el QS promedio de toda la cuenta.** Pausar lastres es tan importante como crear ganadoras.
6. **Los sitelinks son la extensión que más performance da** — 13-17% CTR vs callouts 7-10%. Priorizar siempre tenerlos bien optimizados.
7. **"Apto (limitado)" NO es enfermedad** — significa "te limitas voluntariamente a brand, tu CPA es 37% mejor que si te abrieras".

### Pendientes claros para próxima sesión

**Antes que nada (cuando regrese):**
1. **Aclarar scope de FOVISSSTE** — ¿NO se acepta en ningún desarrollo o solo en Lirios 2? Afecta Meta AI prompts + descripciones GBP + anuncios Google Ads
2. **Subir negatives de Grupo a Campaña** (5 min, esencial antes de crear Grupos B y C)

**Lista corta (próxima sesión):**
3. Crear GBP La Rioja 2 (misma fórmula validada con Lirios 2)
4. Esperar 3-5 días para Fase 4 (Grupos B y C) — algoritmo procesando cambios de hoy
5. Si CPA real bajó a $110-140 → proceder con Fase 4
6. Si CPA real sigue >$180 → diagnosticar qué nuevos términos basura no negatamos

**Lista larga (futuro):**
7. Etiquetar 7 URLs de productos del catálogo WhatsApp con su modelo (v3 del prompt Meta AI)
8. Configurar evento `Lead` en Meta Pixel
9. Verificación de dominio en Meta (iOS tracking)
10. Mejorar landing experience para brand keywords (Sadasi/La Rioja/Lirios) → subiría QS de 5 a 7-8
11. Brand verification de Google Ads (ya enviado, esperar 1-2 sem)
12. Vigilar performance de los 4 callouts nuevos cuando salgan de "En revisión"
13. Re-evaluar callout "Vigilancia 24/7" (CTR 2.90%) cuando tenga 500+ impr
14. Re-evaluar Fresno Elite sitelink (pausado) — solo reactivar si entra a un Grupo B con copy específico
15. Fotos presenciales Lirios 2 GBP (cuando Florencio visite el pabellón)

---

## 🎁 SESIÓN 27 — Crédito promocional $7,000 + subida de presupuesto a $120/día (2 jun 2026)

### La oferta promocional (CONFIRMADA en cuenta)
- **Oferta:** Obtén un crédito de **MXN $7,000** cuando inviertas **MXN $7,000** en Google Ads
- **Código:** `7QTVD-WKHV6-MLFY`
- **Estado:** Ya canjeada y activa (contando gasto automáticamente)
- **Vence:** **30 jul 2026** (fecha límite para cumplir el requisito de inversión)
- **Progreso al 2 jun:** invertido **$1,133.28** de $7,000 → faltan **$5,866.72**
- **Naturaleza:** es CRÉDITO publicitario, no reembolso. El crédito NO cubre el requisito de inversión en sí; se gasta $7,000 de dinero propio → luego se recibe $7,000 de crédito para gasto FUTURO. Verificación posterior tarda hasta 35 días; el crédito luego tiene su propia ventana (~60 días) para gastarse.

### La matemática
- Faltan **$5,866.72** en **~58 días** (2 jun → 30 jul) = **~$101/día** requerido.
- Es prácticamente el presupuesto actual de $100/día → **el crédito es casi "dinero gratis"**: se va a gastar ~$5,867 en la campaña de marca que ya funciona (CPA ~$100-140) de todos modos. No requiere distorsionar la estrategia ni comprar tráfico basura.

### Decisión tomada — Presupuesto $100 → $120/día
- **Razón:** margen cero a $100/día (requerido $101 vs tope $100). Subir a $120 como COLCHÓN para garantizar llegar a $7,000 antes del 30 jul.
- **NO se subió a $150** (sobrematar; no hay bono por llegar antes, el deadline es fijo; riesgo de tráfico de peor calidad).
- **$120 es un TECHO, no objetivo:** si el volumen de marca está topado, Google no inventará búsquedas; gastará lo que haya. Bajo "Maximiza conversiones", más presupuesto = pujas más agresivas = más chance de ganar top-spot (hoy solo 12% vs competidores 28-33%).

### Qué vigilar
- **CPA:** al subir presupuesto el algoritmo puja más alto. Si CPA se queda en $100-140 → OK. Si se dispara >$180 sostenido → regresar a $100/día.
- **NO bajar presupuesto ni pausar la campaña** o se queda corto del $7,000.
- **Revisión a ~7 días (≈9 jun):** si va parejo para llegar al $7,000 → no tocar. Si va corto (volumen de marca no llena $120) → evaluar Fase 4 (Grupos B/C) para abrir inventario — decidir con datos, no por la promo.
- **Recordatorio clave: ~23 jul** verificar progreso 1 semana antes del vencimiento del 30 jul.
- **Timing del crédito:** se gasta el $7,000 propio (≈ ahora hasta jul) → verificación hasta 35 días → **el crédito de $7,000 llega aprox. septiembre 2026**. Es un "plus"/bonus, no afecta la operación actual.

### Estado final de la revisión (2 jun)
- ✅ **Presupuesto $120/día APLICADO** (confirmado por Florencio en cuenta).
- ✅ **Recursos de precios — DECLINADOS** (decisión de Florencio, correcta): doble mantenimiento (Google Ads NO sincroniza con la web), riesgo de precio viejo en anuncio + posible rechazo de Google si no coincide con la landing. Los precios viven en `inventory.json`/la página (fuente de verdad). **Alternativa elegida:** mostrar precio vía **titular redondeado "desde $X"** (bajo mantenimiento) + la página.
- ⏳ **Por descartar (3 puntitos → Descartar → "No es relevante"):** "Establece un CPA objetivo" (muy temprano, <15 conv, y limitaría el gasto justo cuando se necesita para la promo) + "Suba listas de Segmentación por clientes" (no hay lista de contactos; upsell de IA).
- ℹ️ **Perfil de Google Business sale "Patrocinado"** = recursos de ubicación (GBP vinculado a Ads). Se deja activo: beneficio de confianza/visibilidad > el tema de tracking. Nota: parte de leads llegarán por llamada del perfil (sin tracking de WhatsApp), como el Lead #1.

### 🎉 HITO — Primer APARTADO desde Google Ads (validación del canal)
- Un lead de Google Ads **visitó e hizo un apartado**. Embudo completo probado: anuncio → WhatsApp → visita → apartado.
- **Esto cambia la estrategia:** antes "no expandir solo por la promo"; ahora la expansión (Fase 4) está **justificada con datos** — el canal cierra ventas reales. ROI estimado enorme (~$1,133 invertidos vs comisión de asesor en decenas de miles).
- ⚠️ Es n=1 y un apartado aún no es venta cerrada. Buenísima señal, pero expandir con disciplina (negativas + vigilar CPA).
- **PENDIENTE preguntar a Florencio:** ¿de qué modelo/desarrollo fue el apartado? ¿Cuántos leads totales de Google Ads? (para calcular ROI y lead→apartado rate).

### 📄 Investigación documentada — `anuncio-perfecto.md`
Guía profesional creada (anatomía del anuncio, reglas RSA 2026, copywriting de conversión, palancas de más clicks/más leads, benchmarks) + **auditoría del anuncio actual**. Hallazgos clave abajo.

---

## 📋 PLAN PARA MAÑANA (3 jun) — Actualizar la campaña

> Detalle completo y textos listos para copiar en `anuncio-perfecto.md`. Esto es el resumen accionable.

### A) Correcciones URGENTES del anuncio (Grupo A — bajo esfuerzo, alto impacto)
1. 🚨 **Descripción 3:** "asesor **independiente** certificado" → **"asesor autorizado de Altta Homes"**. (Quedó copy viejo; ya se corrigió en todo lo demás en sesión 26.)
2. 🚨 **Titular #7** "Recorrido Virtual 360° Disponible" = **33 caracteres** (límite 30). Verificar si está rechazado y recortar a `Recorrido Virtual 360°` (22).
3. ⚠️ **Descripción 4:** "plusvalía **garantizada**" (claim absoluta riesgosa) → `alta plusvalía` / `plusvalía proyectada`.
4. ⚠️ **Descripción 2:** menciona **FOVISSSTE** sin confirmar → resolver pendiente FOVISSSTE antes de afirmarlo (o quitarlo por ahora).

### B) Mejoras del anuncio (variedad + assets)
5. Agregar 4-5 **titulares nuevos** (ángulos que faltan: ubicación, amenidades, financiamiento, urgencia). Lista ≤30 car. en `anuncio-perfecto.md` §6.
6. Subir **4+ imágenes** (renders WebP que ya existen) como assets — suben CTR en 2026. (Antes descartado; reactivar.)
7. Crear **2º RSA** en Grupo A para A/B test (+6.6% conv promedio).

### C) Preparar crecimiento (cuando Florencio confirme capacidad de atender más leads)
8. Subir las **~85 negativas de nivel Grupo → nivel Campaña** (esencial ANTES de crear B y C).
9. **Fase 4:** Grupo C (zonal alto intent) + Grupo B (modelos), con URL final a fichas específicas (`/tabachin`, `/capua`...). El crédito $7k subsidia el experimento.
10. Cambiar URL final de keywords de modelo → su ficha (no al home) — puede duplicar conversión.

### Lo que NO hacer
- NO "Aplicar" recomendaciones de Google (todo manual).
- NO bajar presupuesto ni pausar (rompe el avance hacia el $7,000).
- NO concordancia amplia, NO IA Max, NO Performance Max, NO tCPA todavía.

---

## ✅ SESIÓN 28 — Revisión post-optimización + página /whatsapp + cosecha de keywords (3 jun 2026)

Sesión paso a paso con Florencio (5 días después de la 26/27). Se revisó data real y se ejecutaron varias mejoras. Florencio aportó 2 insights propios muy buenos: cosechar búsquedas reales como exactas, y la "diferencia de clase" (mezclar La Rioja $4M con Crédito Infonavit se ve mal).

### A) Data real confirmada (periodo 12 may – 1/3 jun)
- 116 clics · ~1,312–1,576 impr · CTR **8.84–9.01%** · CPC ~$8.7–9.0
- **10–11 conversiones · CPA ~$101–115** → en rango esperado (incluso mejor que el objetivo $110–140). La optimización de la sesión 26 funcionó.
- **Insight clave:** las "Otros términos de búsqueda" (long-tail de bajo volumen) trajeron **5 conv a CPA $38.63** = la mitad de las conversiones y las más baratas. Las búsquedas chiquitas SÍ valen.
- MVPs confirmadas en el reporte de términos: `[jardines del sur 6]` (2 conv, $83 CPA, QS 10), `[lirios residencial 2]` ($75), `residencial jardines del sur` ($14), `casas en jardines del sur cancun` ($15.86).
- Cuenta limpia: casi todos los competidores con **0 clics** (negativas de sesión 26 funcionando). Única fuga nueva detectada: `inmobiliarias en cancún` ($10.73) → pendiente negativar `inmobiliarias`.

### B) Cosecha de keywords (search-term harvesting)
Agregadas **5 exactas nuevas** al Grupo A, sacadas de búsquedas reales relevantes (quedaron "En revisión"; varias saldrán "volumen bajo" = normal):
```
[casas en jardines del sur cancun]   ← convirtió
[jardines del sur 6 precios]
[casas jardines del sur]
[casas jardines del sur cancun]
[departamentos jardines del sur]
```
Criterio enseñado: lo que dice *jardines del sur / sadasi / lirios / la rioja* se cosecha como `[exacta]`; lo de competidores se bloquea como negativa.

### C) Anuncio (RSA) corregido
- Descripción #4 cambiada → **"Crédito Infonavit y bancario. Asesor autorizado de Altta Homes, listo para atenderte."** (quita FOVISSSTE engañoso + corrige el rol).
- ⚠️ **El anuncio vivo ya estaba MÁS evolucionado que lo documentado en `anuncio-perfecto.md`.** Los errores viejos ("asesor independiente", "plusvalía garantizada") YA NO existían; los títulos reales (Sadasi Cancun, Casas Polígono Sur, La Rioja 2, etc.) son distintos y mejores. **Lección: verificar siempre el texto REAL antes de editar.**
- Calidad del anuncio: Excelente (pasa a "Pendiente" temporal tras editar = normal).

### D) FOVISSSTE — RESUELTO (pendiente abierto desde sesión 26)
Florencio confirmó: **FOVISSSTE solo en Jardines del Sur 6, solo algunos departamentos.** NO en La Rioja 2 ni Lirios. → En piezas generales usar solo "Infonavit y bancario"; FOVISSSTE solo en piezas específicas de JdS6. Guardado en memoria persistente.

### E) Imágenes (image assets) — NO disponibles aún
El menú "+" de Recursos NO muestra "Imagen". Causa: cuenta nueva (~2 semanas). Google desbloquea imágenes con ~60–90 días de historial. **Pendiente revisar en ~1-2 meses.**

### F) ⭐ Página `/whatsapp` creada y publicada (solución al rechazo de wa.me)
- **Problema:** Google rechaza sitelinks cuyo *final URL* es `wa.me` (dominio externo, no coincide con el del sitio).
- **Solución (código):** se creó la ruta `/whatsapp` en el sitio Next.js:
  - `app/whatsapp/page.tsx` (server, noindex) + `app/whatsapp/WhatsAppRedirect.tsx` (client).
  - Redirección **client-side** a `wa.me` → Google ve una página de **dominio propio** (la acepta).
  - Dispara la **conversión de Google Ads** (`AW-18157218280 / UXk0CJTznrIcEOjThNJD`) vía gtag antes de redirigir.
  - Mensaje prellenado actual: *"Hola, vi su anuncio en Google y quiero más información sobre las propiedades de Altta Homes en Cancún."*
  - **Para cambiar el mensaje a futuro:** editar `WHATSAPP_MESSAGE` en `app/whatsapp/WhatsAppRedirect.tsx`, luego `next build` + `firebase deploy --only hosting`.
- **Deploy:** Firebase Hosting (`output: "export"` → `out/` → `firebase deploy --only hosting --project jardinesdelsur-cancun`). Commits `a8b4653` + `a5a910a` en `main`. Verificado en vivo (200 + contenido correcto) en `https://jardinesdelsurcancun.mx/whatsapp`.

### G) Sitelink "Informes por WhatsApp" recreado
- Se había borrado (no estaba en los 12 sitelinks vivos). Recreado a nivel **Campaña** con la URL nueva:
  - Texto: `Informes por WhatsApp` · URL: `https://jardinesdelsurcancun.mx/whatsapp`
  - Desc 1: `Respuesta inmediata con un asesor` · Desc 2: `Sin costo · Cotiza hoy mismo`
- Quedó "En revisión" (esta vez **se aprobará** por ser dominio propio).
- Nota: como dispara la conversión en `/whatsapp`, este sí debería contar (a diferencia del wa.me directo viejo que no trackeaba).

### Presupuesto
- $120/día (decisión sesión 27 por el crédito $7,000). Sin cambios.

### ⏳ Pendientes para la próxima sesión
1. **La Rioja premium (Fase 4)** — separar La Rioja en su grupo con copy de lujo SIN Infonavit, apuntando a `/la-rioja`. Resuelve la "diferencia de clase" que detectó Florencio (el anuncio de marca mezcla La Rioja $4M con Crédito Infonavit y se ve mal). **Es lo de mayor impacto pendiente.**
2. **Subir negativas de Grupo → Campaña** (prerequisito de Fase 4; ~5 min).
3. Negativar `inmobiliarias` (fuga detectada).
4. Verificar que el sitelink WhatsApp + las 5 keywords nuevas quedaron **aprobadas**.
5. Llenar **"Nombre de la empresa"** en el anuncio (está vacío → sale nombre genérico de la URL).
6. Imágenes: revisar en ~1-2 meses cuando se desbloqueen.
7. Heredados: Grupos B/C, etiquetar URLs catálogo WhatsApp (prompt Meta v3), evento Lead Meta Pixel, verificación dominio Meta, brand verification Google Ads (logo).

---

## 🏗️ SESIÓN 28 (cont.) — Grupo "La Rioja 2 - Premium" creado + estrategia de 4 grupos (3 jun 2026)

Florencio decidió arrancar la **Fase 4 de una vez** (separar La Rioja para matar la "diferencia de clase" que él detectó: el anuncio de marca mezclaba La Rioja $4M con "Crédito Infonavit" y se veía mal).

### ✅ Grupo creado: `La Rioja 2 - Premium`
(en la campaña `Cancún - Search - Casas y Deptos - v1`)
- **Estado:** Apto. Anuncio: "Pendiente" (en revisión, normal).
- **Keywords (6, exacta/frase):** `[la rioja 2 cancun]`, `[la rioja 2]`, `[la rioja 2 altta homes]`, `"la rioja cancun"`, `"residencial la rioja"`, `"la rioja 2 residencial"`
- **URL final:** `https://jardinesdelsurcancun.mx/la-rioja`
- **Ruta gráfica (display path):** `La-Rioja-2 / Premium`
- **RSA PREMIUM (SIN Infonavit)** — 15 títulos + 4 descripciones, puro lujo/plusvalía/exclusividad:
  - *Títulos:* La Rioja 2 Residencial · La Rioja 2 · Altta Homes · Casas Premium La Rioja 2 · La Rioja 2 · Zona Premium · Casas de Lujo en La Rioja 2 · La Rioja 2 Alta Plusvalía · Vive en La Rioja 2 Cancún · Alta Plusvalía en Cancún · Residencial de Lujo · Exclusividad y Seguridad · Respaldo Grupo Sadasi · Recorrido Virtual 360° · Agenda tu Visita Hoy · Informes por WhatsApp · Cotiza con un Asesor
  - *Descripciones:* "Residencial premium en Polígono Sur Cancún. Casas con amplios espacios y alta plusvalía." / "La Rioja 2 de Altta Homes con respaldo Grupo Sadasi. Recorrido virtual 360° por WhatsApp." / "Exclusividad, seguridad 24/7 y amenidades de lujo. Agenda tu visita con un asesor." / "Inversión con alta plusvalía en la zona de mayor crecimiento de Cancún. Cotiza hoy."

### Lecciones de esta parte
- **El asistente rellena el anuncio con IA genérica que VUELVE a mezclar desarrollos** (puso "Precios desde $1,777,640" = precio barato de Jardines, y "Departamentos Lirios"). Hay que **borrarlos** y poner el copy premium. = el mismo "feo" que estamos arreglando.
- **Ad Strength:** pedía "incluya palabras clave populares en sus títulos" → meter `La Rioja 2` en ~7 títulos lo sube de Deficiente/Promedio. Es **guía, NO requisito** — el anuncio corre igual aunque quede en Promedio.
- **Nombre de empresa:** usar `Jardines del Sur Cancún` (coincide con dominio). **NO** "Altta Homes Cancún" → riesgo de política de marca registrada (Florencio es asesor autorizado, no Altta Homes).
- **Campo "productos o servicios para promocionar":** dejar VACÍO (solo alimenta sugerencias IA que no usamos).

### 🎯 Estrategia de 4 grupos (visión de Florencio, validada)
```
Campaña Cancún - Search  ($120/día COMPARTIDOS entre los 4 grupos)
├── Grupo General      → anuncio menciona los 3 devs → home. Keywords: marca amplia
│                         (altta homes, sadasi, grupo sadasi, polígono sur). [= el actual "Grupo de anuncios 1"]
├── Jardines del Sur 6 → /jardines  (valor / Infonavit).         [POR CREAR]
├── La Rioja 2         → /la-rioja  (premium, sin Infonavit).     [✅ CREADO HOY]
└── Lirios 2           → /lirios    (departamentos).              [POR CREAR]
```
**Conceptos aclarados con Florencio (importantes):**
- **El presupuesto es de la CAMPAÑA, no por grupo.** Los 4 grupos COMPARTEN los $120/día → más grupos **NO gasta más**, solo organiza a dónde va el dinero.
- **Más grupos = mejor EFICIENCIA** (Quality Score↑, CPC↓, CPA↓), NO más volumen de leads (eso necesita más keywords/presupuesto).
- **El anuncio General SÍ menciona los 3 desarrollos** (texto) y va al home; lo que se separa son las **keywords** (targeting). El anuncio actual del Grupo 1 ya es así → ese se vuelve el "General".
- **Keyword duplicada en 2 grupos:** Google NO reparte el tráfico; elige UNO por subasta (mayor Ad Rank/Quality Score). Riesgo: a veces gana el grupo equivocado → sale el anuncio genérico en vez del premium. **Regla: cada keyword en UN solo grupo.**

### ⏳ Pendientes de la estructura (próximas sesiones)
1. **Mañana (tras aprobación del grupo nuevo):** quitar las keywords de La Rioja del "Grupo de anuncios 1" (Palabras clave → filtrar `rioja` → Quitar). **NO hacerlo hoy** = evita un gap mientras el anuncio premium está en revisión.
2. **5 sitelinks a nivel GRUPO para La Rioja** (tapan los de campaña, que incluyen Capua/Cedro Plus/Jardines): La Rioja 2 Cancún (`/la-rioja`), Modelo Álamo (`/alamo`), Casa Fresno Elite (`/fresno-elite`), Noni Elite (`/noni-elite`), Informes por WhatsApp (`/whatsapp`).
3. Crear grupo **Jardines del Sur 6** (`/jardines`) + grupo **Lirios 2** (`/lirios`), cada uno con sus keywords específicas + RSA enfocado (Jardines puede llevar Infonavit; Lirios enfoque deptos).
4. Renombrar "Grupo de anuncios 1" → **"General"** y dejarle solo keywords de marca amplia.
5. **2º RSA por grupo** (A/B test, +6.6% conv) — pero hasta tener datos (~1-2 semanas), NO ahora.
6. Subir negativas de Grupo → Campaña (para que protejan a TODOS los grupos nuevos).
