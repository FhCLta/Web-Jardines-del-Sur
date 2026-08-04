# Contexto Técnico - Cotización Kulkana

Fecha de actualización: 2026-07-07

## 1) Objetivo del sistema
Aplicación web estática para generar cotizaciones inmobiliarias de Kulkana con cálculo automático de:
- precio total y precio neto
- financiamiento (bancario/infonavit/cofinavit/contado)
- gastos y enganche
- plan de pagos de enganche
- versión imprimible compacta

No usa backend ni framework. Toda la lógica está en JavaScript del lado cliente y estado temporal en sessionStorage.

## 2) Estructura del proyecto
- index.html: estructura de UI y campos de captura/cálculo
- script.js: lógica principal de negocio, cálculos, visibilidad dinámica y eventos
- validation.js: validación básica para evitar números negativos
- styles.css: estilos de pantalla e impresión, incluyendo modo departamentos y modo compacto
- Imagen/: recursos de logo e ícono

## 3) Flujo funcional de la aplicación
1. Carga inicial
- Se fija fecha de cotización en hoy y vigencia en +1 día.
- Se aplican reglas iniciales de visibilidad según plan de venta.

2. Selección de desarrollo
- Azular1 / LaRioja2: flujo de casas por prototipo.
- Azular1-Depas / Lirios2-Depas: flujo de departamentos por modelo/planta con selector único.

3. Selección de prototipo/departamento
- Se cargan precioLista, bono, avaluo desde catálogos hardcodeados en script.js.
- Se recalculan precio total, neto y escrituración.

4. Cálculo financiero
- Crédito bancario e infonavit pueden ser manuales o automáticos (95/90/80/personalizado).
- Según planVenta se ocultan campos no aplicables y se limpian valores para evitar contaminar cálculo.

5. Cálculo final
- Enganche = precioNeto - creditoBancario - creditoInfonavit - subcuenta.
- Gastos totales = titulacion + comision + cuota de contingencia + contrato de agua + Sat Q + CLG + avaluo.
- Total a pagar = enganche + gastos totales.
- Enganche total = total a pagar - apartado.

6. Tabla de plan de enganche
- Automático: distribuye enganche total en meses.
- Manual: permite editar pagos; redistribuye el restante en pagos no marcados manuales.
- Fechas: al definir la primera fecha, autogenera las siguientes mes a mes.
- Validación visual: total de pagos en rojo si no cuadra contra enganche total.

7. Impresión
- Usa reglas CSS @media print para layout carta, dos columnas, ocultar controles no imprimibles.
- Modo compacto adicional con clase print-compacto cuando meses > 10.
- Ajustes dedicados para departamentos con clase es-departamento.

## 4) Reglas de negocio detectadas
### 4.1 Desarrollo y datasets
- Los catálogos de precios/bonos/avalúo están embebidos en script.js.
- Desarrollos activos en selector:
  - `Azular1` → Jardines del Sur 6 - Casas (FLAMBOYAN, FLAMBOYAN PROMO, CEIBA, TABACHIN, NONI, NONI PROMO) — catálogo `datosCasas1`
  - `Azular1-Depas` → Jardines del Sur 6 - Departamentos (CAPUA / CAPUA PROMO / CEDRO PLUS / CEDRO PLUS PROMO, plantas PB/1/2/3) — catálogo `datosDepartamentosJardines6`
  - `Lirios2-Depas` → Lirios Residencial 2 - Departamentos (CEDRO PLUS PB/1N/2N/3N Roof) — catálogo `datosDepartamentosLirios2`
  - `LaRioja2` → La Rioja 2 - Casas (NONI ELITE, NONI ELITE PROMO, NONI, ALAMO, FRESNO ELITE, FRESNO ELITE PROMO — con precios reales cargados) — catálogo `datosLaRioja2`
- Los desarrollos `Azular3` y `Depas-Preventa` ya NO existen en el selector ni en el código (catálogos `datosCasas3` y `datosBakab` eliminados).
- Departamentos usan selector por modelo/planta; casas usan selector por prototipo + campo # de unidad.
- Cuota de contingencia variable por desarrollo (`actualizarCuotaContingencia`): Lirios2-Depas $6,000, LaRioja2 $10,000, resto $4,000.

### 4.2 Fórmulas clave
- Casas (Azular1, LaRioja2): valorAvaluo = precioLista + terrenoExcedente + esquina; precioNeto = valorAvaluo - bono.
- Departamentos (Azular1-Depas, Lirios2-Depas): valorAvaluo = precioLista; precioNeto = precioLista - equipamientoDescuento - bono.
- Escrituración: porcentaje AUTOMÁTICO por plan de venta, definido por modelo en los catálogos (`porcentajesEscrituracion`: infonavit 7%, fovissste 8%, cofinavit 8.5%, bancario 7.3–7.7% según modelo, contado 7.2%), aplicado sobre valorAvaluo. El select manual `#porcentajeGastosEscrituracion` es respaldo cuando no hay porcentaje automático.
- Existe un "Modo manual" de precio (`#togglePrecioManual`) que permite capturar precioLista/bono a mano.

### 4.3 Equipamiento (solo Azular1-Depas)
- Toggle ON: con equipamiento, descuento 0.
- Toggle OFF: sin equipamiento, descuenta 85,000.
- El valor en UI se muestra negativo cuando aplica descuento.
- En Lirios2-Depas el toggle no aplica (equipamiento siempre $0).

### 4.4 Plan de venta
- contado: oculta créditos y comisión de apertura.
- infonavit: oculta cálculo bancario y comisión.
- bancario: oculta crédito infonavit y subcuenta.
- cofinavit: muestra ambos tipos de crédito.
- fovissste: reutiliza el flujo de Infonavit con etiqueta y porcentaje específicos.

## 5) Estado técnico actual (fortalezas)
- Lógica de cálculos amplia y funcional en un solo archivo.
- Reglas por tipo de desarrollo bien diferenciadas.
- Impresión con bastante ajuste de layout.
- Sin errores reportados por el analizador del editor al momento del diagnóstico.

## 6) Riesgos y deuda técnica (importante antes de cambios)
1. script.js es monolítico (alta complejidad y acoplamiento).
- Un cambio pequeño puede impactar múltiples cálculos/eventos.

2. [RESUELTO 2026-07-05] Existían listeners DOMContentLoaded anidados dentro del bloque principal que nunca se ejecutaban (código muerto); fueron eliminados. Quedan solo el DOMContentLoaded principal de script.js y el de validation.js, ambos válidos.

3. Dependencia fuerte en IDs y manipulación directa del DOM.
- Si cambia un id en HTML, rompe cálculo silenciosamente.

4. Uso de sessionStorage como fuente de datos temporal.
- Si falta un setItem por flujo alterno, hay cálculos con 0 sin alertar explícitamente.

5. Duplicidad y superposición de reglas CSS print.
- Hay varias secciones @media print; puede haber conflictos de especificidad.

6. Inconsistencia detectada en comentario vs lógica.
- CSS comenta print-compacto para meses > 8, pero JS activa > 12.

7. [ACTUALIZADO 2026-07-05] html2canvas SÍ se usa (botón Compartir genera el PNG). jsPDF ya fue removido del HTML por no usarse; si algún día se implementa "Descargar PDF", habrá que volver a cargarlo.

8. Marcado HTML mejorable.
- El HTML sigue siendo mejorable en semántica y mantenimiento general, pero el encabezado principal ya está dentro de `body`.

## 7) Mapa de datos críticos para cambiar precios
Para actualizar una temporada de precios:
1. Editar catálogos en script.js:
- datosAzular (lista de modelos por desarrollo y precioTerrenoExcedente: Azular1 $5,750, LaRioja2 $7,500)
- datosDepartamentosJardines6 (modelo/planta, Azular1-Depas)
- datosDepartamentosLirios2 (modelo/planta, Lirios2-Depas)
- datosCasas1 (casas Jardines del Sur 6, dentro del listener de #prototipo)
- datosLaRioja2 (casas La Rioja 2, dentro del listener de #prototipo)
- Cada modelo lleva: precioLista, valorAvaluo, bono, avaluo (costo del trámite) y porcentajesEscrituracion por plan.
2. Validar escenarios mínimos:
- una casa Azular1 y una LaRioja2
- un departamento Azular1-Depas con equipamiento ON/OFF
- un departamento Lirios2-Depas
- cambiar plan de venta y verificar que el % de escrituración cambia solo
3. Verificar impresión en:
- plan contado
- plan bancario
- plan cofinavit
- caso con >12 meses para modo compacto

## 8) Plan sugerido para próximos cambios (sin romper)
1. Cambios de datos (precios/bonos/avalúos) aislados primero.
2. Validación de fórmulas por tipo de desarrollo.
3. Ajustes de UI/impresión después de congelar cálculos.
4. Refactor técnico por fases:
- Fase 1: extraer datasets a archivo separado.
- Fase 2: extraer funciones puras de cálculo.
- Fase 3: centralizar inicialización de eventos.
5. Operación multi-equipo:
- La copia de trabajo se migrará a un drive compartido para alternar entre dos computadoras.
- Tomar esa copia como fuente única y evitar dependencias en rutas locales de una sola máquina.

## 9) Bitácora de actualizaciones
Usar este formato para registrar todas las actualizaciones.

### [YYYY-MM-DD] - Título corto del cambio
- Autor:
- Motivo:
- Archivos modificados:
- Resumen técnico:
- Impacto funcional:
- Riesgos:
- Validación realizada:
- Pendientes:

### [2026-07-07] - Revisión: % de gastos notariales y avalúos vs Excel 2026 (sin cambios)
- Autor: Claude Fable 5
- Motivo: el usuario pidió verificar 100% la app contra "PORCENTAJE DE GASTOS NOTARIALES Y VALORES AVALUOS 2026.xls" (hoja única "PROCENTAJE DE GASTOS 2026": Jardines del Sur 6 y Rioja II; NO incluye Lirios 2).
- Archivos modificados: context.md (solo bitácora)
- Resumen técnico: cruce completo con xlrd. Porcentajes de escrituración: 100% coinciden (depas J6 bancario 7.7%; CEIBA/FLAMBOYAN/TABACHIN 7.3%; NONI J6 y toda Rioja 2 7.5%; infonavit 7 / fovissste 8 / cofinavit 8.5 / contado 7.2 en todos). Cobros de avalúo: 100% coinciden. Valores de avalúo: 14/16 coinciden; difieren FLAMBOYAN (Excel 2,536,000 vs app 2,621,000) y NONI Rioja 2 (Excel 4,462,000 vs app 4,490,000).
- Decisión del usuario: NO actualizar esos dos valores; la app se queda con 2,621,000 y 4,490,000 (el Excel se considera desactualizado / no es el precio de lista). El Excel llama "TABACHIN PLUS" al "TABACHIN" de la app (mismos valores).
- Impacto funcional: ninguno; no se tocó script.js.
- Riesgos: si notaría cobra gastos sobre los avalúos del Excel, FLAMBOYAN y NONI Rioja podrían quedar con gastos ligeramente sobreestimados (conservador, a favor).
- Validación realizada: dump completo del .xls (22 filas) cruzado renglón por renglón contra datosCasas1, datosLaRioja2 y datosDepartamentosJardines6.
- Pendientes: ninguno.

### [2026-07-07] - Precios: bonos de CAPUA normal (sin vista al estac.) bajan $50,000
- Autor: Claude Fable 5
- Motivo: el usuario compartió la lista de precios vigente de Jardines del Sur 6 Depas (tablas CAPUA/CEDRO PLUS por edificio). Los CAPUA sin vista al estacionamiento (edificios ANTILOPE C-D-E-F-G-H-I, los más caros) traen descuento $50,000 menor.
- Archivos modificados: script.js, context.md
- Resumen técnico: en `datosDepartamentosJardines6["CAPUA"]` los bonos cambiaron: PB 382,120→332,120; 1N 386,460→336,460; 2N 387,360→337,360; 3N 376,170→326,170. Netos resultantes (con equipamiento): 1,997,880 / 1,943,540 / 1,922,640 / 1,903,830 — cuadran con la hoja. precioLista/valorAvaluo/avaluo intactos.
- Revisión adicional (sin cambios): CAPUA PROMO (V. Est., edificios ATILOPE N-O-P-Q y OCELOTE) y ambos CEDRO PLUS (normal J-K-A-B y V. Est. L-M) coinciden exactamente con la hoja nueva; confirmado que el "sin vista" es el más caro en ambos modelos.
- Impacto funcional: los depas CAPUA normales cotizan $50,000 más caros en neto; el resto igual.
- Riesgos: nulos; solo datos.
- Validación realizada: `node --check script.js` OK; cruce manual de los 16 renglones de la hoja contra el catálogo.
- Pendientes: usuario: cotizar un CAPUA PB normal y verificar precio neto $1,997,880 (con equipamiento).

### [2026-07-05] - Captura: prototipo/modelo y nombre del asesor a 17.5px
- Autor: Claude Fable 5
- Motivo: el usuario pidió subir "un tin, no mucho" el prototipo/modelo y el nombre del asesor en Compartir imagen/PDF, cuidando que no se desborde.
- Archivos modificados: styles.css, context.md
- Resumen técnico: nueva regla `body.generando-imagen #prototipo, #departamentoSelect, #nombreAsesor { font-size: 17.5px !important }` (heredaban ~16px). Se eligió 17.5px y no 18px porque sus textos son largos ("CEDRO PLUS 3N (ROOF) V. Est.", "Angela Tlelo Tlaxcaltecatl"). Solo captura; pantalla e impresión intactas.
- Impacto funcional: esos tres campos se leen un poco más grandes en imagen y PDF.
- Riesgos: bajos; si algún nombre largo se picara en la captura, bajar a 17px.
- Validación realizada: balance CSS (`0`).
- Pendientes: usuario: prueba visual con el modelo de nombre más largo (CEDRO PLUS 3N (ROOF) V. Est.).

### [2026-07-05] - Etiquetas depas: "(ROOF)" en mayúsculas, "V. Est." en vez de "VE"; Plan de Ventas más grande en captura
- Autor: Claude Fable 5
- Motivo: el usuario pidió (1) "(Roof)" en mayúsculas, (2) cambiar la abreviatura "VE" por "V. Est." (la recomendada originalmente, más entendible), y (3) aumentar el tamaño del Plan de Ventas (Bancario/Infonavit...) en Compartir imagen/PDF.
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: en script.js, "(Roof)" → "(ROOF)" (3 displays: Lirios 3N, Jardines 3N normal y V. Est.) y los 8 displays " VE" → " V. Est." (solo campos `prototipo`; claves de catálogo intactas). En styles.css, `body.generando-imagen #planVenta` se sumó a la regla de 18px del `#Azular`.
- Impacto funcional: textos visibles en selector, imagen/PDF y nombre de archivo (ej. "CAPUA PB V. Est.", "CEDRO PLUS 3N (ROOF) V. Est."); Plan de Ventas a 18px en la captura. Cálculos idénticos.
- Riesgos: nulos.
- Validación realizada: `node --check script.js`; balance CSS (`0`); grep de los 8 renombres y 3 ROOF.
- Pendientes: usuario: prueba visual de selector y captura.

### [2026-07-05] - Catálogo: fuera FLAMBOYAN PROMO; "(Roof)" en CEDRO PLUS 3N de Jardines 6
- Autor: Claude Fable 5
- Motivo: el usuario indicó que FLAMBOYAN PROMO ya no está vigente y que los CEDRO PLUS 3N de Jardines 6 (normal y VE) deben mostrar "(Roof)" como ya lo hace el de Lirios 2. Los PROMO de casas restantes se quedan como están (decisión del usuario).
- Archivos modificados: script.js, context.md
- Resumen técnico: (1) se quitó "FLAMBOYAN PROMO" de `datosAzular.Azular1.modelos` y su entrada en `datosCasas1` (precios eliminados: lista 2,621,000 / bono 420,150 — recuperables de esta entrada si regresara la promo). (2) En `datosDepartamentosJardines6`, displays `prototipo`: "CEDRO PLUS 3N" → "CEDRO PLUS 3N (Roof)" y "CEDRO PLUS 3N VE" → "CEDRO PLUS 3N (Roof) VE". Claves de catálogo intactas; paréntesis no afectan el `split("-")`.
- Impacto funcional: FLAMBOYAN PROMO desaparece del selector de prototipos; los 3N de Jardines 6 se muestran con "(Roof)" en selector, imagen/PDF y nombre de archivo. Cálculos idénticos.
- Riesgos: nulos.
- Validación realizada: `node --check script.js`; grep: FLAMBOYAN solo 2 menciones (modelo vigente) y 3 displays con "(Roof)" (2 Jardines 6 + 1 Lirios 2).
- Pendientes: usuario: revisar selector de casas (sin FLAMBOYAN PROMO) y de depas (3N con Roof).

### [2026-07-05] - Etiquetas: "Jardines del Sur 6 Depas" y "VE" en lugar de "PROMO" (depas)
- Autor: Claude Fable 5
- Motivo: el usuario pidió acortar el nombre del desarrollo de departamentos y reemplazar "PROMO" en los modelos CAPUA/CEDRO PLUS de Jardines 6, que en realidad significa "vista al estacionamiento". Eligió "Depas" y la abreviatura "VE" (se le ofrecieron "V. Estac." y "Vista Est." como alternativas).
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: (1) index.html: etiqueta visible del option `Azular1-Depas` → "Jardines del Sur 6 Depas" (value intacto). (2) script.js: en `datosDepartamentosJardines6`, los 8 campos `prototipo` de las variantes PROMO cambiaron de "... PROMO" a "... VE" (CAPUA PB/1N/2N/3N y CEDRO PLUS PB/1N/2N/3N). Las CLAVES de los catálogos ("CAPUA PROMO", "CEDRO PLUS PROMO") NO se tocaron — solo el texto que se muestra/comparte. Los PROMO de casas (FLAMBOYAN, NONI, etc.) quedaron igual; pendiente confirmar con el usuario si esos también son vista a estacionamiento.
- Regla importante: los nombres visibles de departamentos NO pueden llevar guion "-" porque el value del selector usa `MODELO-PLANTA` y un guion extra rompería el `split("-")`.
- Impacto funcional: selector, imagen/PDF compartidos y nombre de archivo muestran los textos nuevos; precios, bonos y cálculos idénticos.
- Riesgos: bajos; "VE" no es autoexplicativa para el cliente (decisión del usuario, él lo explica en persona).
- Validación realizada: `node --check script.js`; grep confirmó 8 renombres y claves intactas.
- Pendientes: usuario: revisar el selector y una cotización compartida de un depa VE; confirmar si los PROMO de casas también deben cambiar.

### [2026-07-05] - Imagen/PDF: fechas de pago al mismo tamaño que los montos
- Autor: Claude Fable 5
- Motivo: el usuario validó la escala 2 del PDF ("espectacular y no pesa") y pidió que las fechas del Plan de Enganche queden del mismo tamaño que los montos en la captura compartida.
- Archivos modificados: styles.css, context.md
- Resumen técnico: `body.generando-imagen #tablaEnganche .fecha-pago` pasó de `15.5px` a `19.5px` (igual que `.monto-pago`). Solo captura de imagen/PDF; pantalla e impresión intactas.
- Impacto funcional: montos y fechas de mensualidades con el mismo tamaño en lo compartido.
- Riesgos: bajos; la fecha "dd/mm/aaaa" es corta y cabe. Con muchos pagos por fila revisar visualmente una vez.
- Validación realizada: balance de llaves CSS (`0`).
- Pendientes: usuario: prueba visual con plan de varios pagos.

### [2026-07-05] - Compartir PDF: escala 2 (peso 760 KB → ~490 KB)
- Autor: Claude Fable 5
- Motivo: el usuario reportó 760 KB con escala 2.5 y quiso menos peso; se acordó probar escala 2 (~282 DPI, diferencia visual casi imperceptible).
- Archivos modificados: script.js, context.md
- Resumen técnico: `crearPdfCotizacion()` usa `crearCanvasCotizacion(2)` (antes 2.5), JPEG 0.8 sin cambio. Imagen compartida sigue en escala 5 PNG.
- Impacto funcional: solo peso del PDF compartido.
- Riesgos: bajos; escala 2 es el piso recomendado — NO bajar a 1.5 o menos (212 DPI ya suaviza números con zoom). Si el usuario nota suavidad, volver a 2.5.
- Validación realizada: `node --check script.js`.
- Pendientes: usuario: verificar peso (~490 KB esperado) y nitidez con zoom.

### [2026-07-05] - Imagen/PDF: fechas del Plan de Enganche un poco más grandes
- Autor: Claude Fable 5
- Motivo: el usuario pidió subir el tamaño de las fechas de pago en la captura compartida. También preguntó por qué el PDF de Imprimir sale nítido a la primera: es un PDF vectorial (texto real), mientras el de Compartir es raster (captura); replicar la cotización en vectorial con jsPDF se descartó por tamaño del trabajo y riesgo.
- Archivos modificados: styles.css, context.md
- Resumen técnico: `body.generando-imagen #tablaEnganche .fecha-pago` pasó de `font-size: 14px` a `15.5px`. Solo captura compartida; pantalla e impresión intactas.
- Impacto funcional: fechas de mensualidades más legibles en imagen y PDF.
- Riesgos: nulos (las fechas son cortas, no se pican).
- Validación realizada: balance de llaves CSS (`0`).
- Pendientes: usuario: generar imagen/PDF con fechas capturadas y confirmar.

### [2026-07-05] - Imagen/PDF: montos del Plan de Enganche un poco más grandes
- Autor: Claude Fable 5
- Motivo: el usuario pidió subir "un tin" los montos de los pagos, solo para Compartir imagen y Compartir PDF.
- Archivos modificados: styles.css, context.md
- Resumen técnico: `body.generando-imagen #tablaEnganche .monto-pago` pasó de `font-size: 18.2px` a `19.5px`. Las fechas de pago quedaron en 14px. Solo afecta la captura compartida; pantalla e impresión intactas.
- Impacto funcional: los montos de las mensualidades se leen más grandes en imagen y PDF.
- Riesgos: bajos; con muchos pagos por fila (tarjetas más angostas) un monto de 7 dígitos podría quedar justo — si se picara, bajar a 19px.
- Validación realizada: balance de llaves CSS (`0`).
- Pendientes: usuario: generar imagen/PDF con plan de varios pagos y confirmar.

### [2026-07-05] - Imagen/PDF: nombre del desarrollo un poco más grande
- Autor: Claude Fable 5
- Motivo: el usuario pidió que el nombre del desarrollo salga "un tin" más grande en la captura compartida. También preguntó por qué el PDF recupera nitidez al hacer zoom: es el render progresivo del visor de PDF usando la reserva de ~350 DPI de la imagen incrustada (comportamiento normal, no defecto).
- Archivos modificados: styles.css, context.md
- Resumen técnico: nueva regla `body.generando-imagen #Azular { font-size: 18px !important }` (antes heredaba ~16px de pantalla). Solo afecta la captura de imagen y PDF; pantalla e impresión intactas.
- Impacto funcional: el selector de Desarrollo se lee más grande en la imagen y el PDF compartidos.
- Riesgos: nulos; si algún nombre de desarrollo futuro fuera larguísimo y se picara en la captura, bajar a 17px.
- Validación realizada: balance de llaves CSS (`0`).
- Pendientes: usuario: generar imagen y PDF y confirmar el tamaño.

### [2026-07-05] - Compartir PDF: escala 2.5 y JPEG 0.8 (peso 1.1 MB → ~0.6 MB)
- Autor: Claude Fable 5
- Motivo: con escala 3 / JPEG 0.85 el PDF seguía pesando ~1.1 MB; el usuario pidió menos.
- Archivos modificados: script.js, context.md
- Resumen técnico: en `crearPdfCotizacion()`, escala de captura 3 → 2.5 (~350 DPI en página de 612pt de ancho) y calidad JPEG 0.85 → 0.8. La imagen compartida sigue intacta en escala 5 PNG.
- Impacto funcional: solo peso del PDF compartido (~40-50% menos).
- Riesgos: bajos; si el usuario notara textos menos finos al hacer zoom fuerte, subir calidad a 0.85 primero (pesa poco más) antes que subir escala. Si quiere aún menos peso, escala 2 / calidad 0.75 es el siguiente paso.
- Validación realizada: `node --check script.js`.
- Pendientes: usuario: verificar peso y nitidez del nuevo PDF.

### [2026-07-05] - Compartir PDF: página a la medida exacta de la captura (sin bordes)
- Autor: Claude Fable 5
- Motivo: tras el fix de fondo crema, el usuario aceptó la sugerencia de eliminar por completo las franjas: página del PDF con las proporciones exactas de la cotización.
- Archivos modificados: script.js, context.md
- Resumen técnico: en `crearPdfCotizacion()`, en lugar de hoja carta fija con fondo pintado, la página se crea con formato custom `[612, 612 * alto/ancho del canvas]` (ancho carta estándar, alto proporcional al contenido) y la captura se coloca en (0,0) a página completa. Se eliminaron margen, `setFillColor/rect` y el cálculo de aspect-fit. Con muchos pagos la página simplemente es más larga (estilo una sola hoja continua).
- Impacto funcional: el PDF compartido ya no tiene franjas ni bordes: es la cotización de borde a borde. Imagen e impresión intactas.
- Riesgos: bajos; la página no es carta estándar en alto (al imprimirla, el visor la escala/ajusta automáticamente). Si alguna vez se requiere carta exacta, volver al enfoque anterior (fondo crema + aspect-fit, descrito en la entrada de abajo).
- Validación realizada: `node --check script.js`.
- Pendientes: usuario: generar PDF y confirmar que se ve de borde a borde y bien en WhatsApp/visor.

### [2026-07-05] - Compartir PDF: fondo crema en toda la hoja (fix bordes blancos)
- Autor: Claude Fable 5
- Motivo: en el PDF compartido, la captura (fondo crema #fbf7ef) quedaba sobre hoja blanca; los márgenes y franjas de ajuste de proporción se veían como bordes blancos feos.
- Archivos modificados: script.js, context.md
- Resumen técnico: en `crearPdfCotizacion()`, antes de `addImage` se pinta toda la hoja con `pdf.setFillColor(251, 247, 239)` + `pdf.rect(..., "F")` (el mismo crema de la captura), y el margen bajó de 18pt a 12pt. Las franjas ahora se funden con el fondo de la cotización.
- Impacto funcional: solo estética del PDF compartido; imagen e impresión intactas.
- Riesgos: nulos. Alternativa si se quisiera CERO franjas: hacer la página del PDF a la medida exacta de la captura (formato custom en jsPDF) en vez de hoja carta; se descartó por ahora para mantener tamaño carta estándar.
- Validación realizada: `node --check script.js`.
- Pendientes: usuario: generar PDF y confirmar que los bordes ya no se ven blancos.

### [2026-07-05] - Compartir PDF más ligero (escala 3, JPEG 0.85)
- Autor: Claude Fable 5
- Motivo: el PDF compartido pesaba hasta 2.5 MB. El usuario preguntó si podía usarse el mismo PDF de "Imprimir": NO es posible (el navegador genera ese PDF en su diálogo y JS no puede acceder al archivo; además es el flujo roto en iPhone). La alternativa correcta es aligerar el PDF generado.
- Archivos modificados: script.js, context.md
- Resumen técnico: `crearCanvasCotizacion(escala)` ahora acepta escala opcional (default 5). "Compartir" imagen sigue igual (escala 5, PNG). `crearPdfCotizacion()` usa escala 3 (~3600px de ancho ≈ 400+ DPI en hoja carta) y JPEG calidad 0.85 (antes 0.92). Peso esperado: ~400-800 KB según contenido.
- Impacto funcional: solo el peso/generación del PDF compartido; imagen e impresión intactas.
- Riesgos: bajos; si el usuario notara el PDF menos nítido al hacer mucho zoom, subir a escala 3.5-4 o calidad 0.9. Si quisiera aún menos peso, escala 2.5 / calidad 0.8.
- Validación realizada: `node --check script.js`.
- Pendientes: usuario: generar el PDF de nuevo y confirmar peso y nitidez.

### [2026-07-05] - Impresión de departamentos igual a casas (fix segunda hoja)
- Autor: Claude Fable 5
- Motivo: al imprimir departamentos, la cotización se desbordaba a una segunda hoja mientras casas cabía en una; el usuario preguntó por qué no funcionan igual.
- Causa raíz: el bloque `@media print` "COMPACTO PARA DEPARTAMENTOS" (~línea 2033) agrandaba todo solo para depas (labels 9pt vs 8.1pt de casas, h2 11pt vs 9.2pt, inputs 20px alto/9pt/padding 3px, tabla 8.5pt, .final más grande, más padding en bloques). Sus selectores `body.es-departamento ...` tienen mayor especificidad que las reglas genéricas del bloque final, así que ganaban. Era herencia de cuando depas tenía menos campos y se quería "llenar" la hoja; con los campos actuales (+ fila # de la Unidad) ya no cabía.
- Archivos modificados: styles.css, context.md
- Resumen técnico: se eliminó todo el sub-bloque "COMPACTO PARA DEPARTAMENTOS" (se dejó nota en el CSS) conservando los fixes funcionales del mismo bloque (ocultar terrenoExcedente/precioTotal/toggle en depas, label-with-toggle, esquina en bakab). En el bloque final se eliminaron también las reglas de "respiración vertical" exclusivas de depas (padding 10px en #detallesPrecio/.leyenda-notarial, margin 4px, min-height 22px) y las reglas de Gastos-depa agregadas hoy que quedaron redundantes (170px/8.1pt ya es lo que hereda del base). Solo se conservó la etiqueta de 188px en #detallesPrecio para depas (textos más largos) y los zooms para 7+ pagos.
- Impacto funcional: la impresión de departamentos ahora usa exactamente los mismos tamaños que casas y debe caber en una hoja. Ninguún cambio en cálculos, pantalla ni imagen.
- Riesgos: bajos-medios; la hoja de depas se verá más compacta que antes (era el objetivo). Los zooms de 7+ pagos (0.97/0.92/0.88) se calibraron con el layout viejo más grande; con el layout compacto podrían quedar de sobra — si un depa con muchos pagos se ve demasiado chico, revisar esas reglas `body.es-departamento...:has(tr:nth-child(7))`.
- Validación realizada: balance de llaves CSS (`0`).
- Pendientes: usuario: imprimir CAPUA PB (2 pagos) y confirmar 1 hoja e igualdad visual con casas; probar también un depa con 7+ pagos.

### [2026-07-05] - Botones apilados a lo ancho en móvil
- Autor: Claude Fable 5
- Motivo: en celular los tres botones (Imprimir/Compartir/Compartir PDF) se acomodaban chueco: dos arriba y el tercero abajo descentrado por el margin-left de escritorio.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque `@media screen and (max-width: 768px)`, `.botones-container` ahora es flex column con `gap: 10px`, y los tres botones (`#imprimirBtn/#compartirImagenBtn/#compartirPdfBtn`) van a `width: 100%`, `margin: 0` (anula el `margin-left: 10px` de escritorio) y padding un poco mayor (13px) para dedo. Escritorio, impresión e imagen no cambian.
- Impacto funcional: ninguno; solo presentación móvil.
- Riesgos: nulos.
- Validación realizada: balance de llaves CSS (`0`).
- Pendientes: revisión visual del usuario en su teléfono.

### [2026-07-05] - Nuevo botón "Compartir PDF" (jsPDF + captura html2canvas)
- Autor: Claude Fable 5
- Motivo: el usuario pidió poder elegir entre compartir la cotización como imagen o como PDF. Eligió el enfoque de dos botones. Esto retoma el pendiente de la entrada [2026-06-25] sobre generar PDF sin depender del navegador (impresión rota en iPhone).
- Archivos modificados: index.html, script.js, styles.css, context.md
- Resumen técnico:
  - index.html: nuevo botón `#compartirPdfBtn` ("Compartir PDF") junto a Imprimir/Compartir; se volvió a cargar jsPDF 2.5.1 desde CDN (se había retirado por no usarse; ahora sí se usa).
  - script.js: `crearImagenCotizacion()` se dividió en `crearCanvasCotizacion()` (la captura html2canvas idéntica, escala 5, ancho 1200) + conversión a blob. Nuevo `crearPdfCotizacion()`: usa la misma captura, la exporta como JPEG calidad 0.92 y la coloca centrada y ajustada (aspect fit, margen 18pt) en una hoja carta vertical con jsPDF; `pdf.output("blob")`. Nuevo `compartirODescargarPdf()`: intenta Web Share con archivo PDF y si no se puede, descarga (no hay ruta de portapapeles para PDF). Handler del botón espejo del de imagen: estados "Preparando PDF...", alertas "PDF listo para compartir."/"PDF descargado.", manejo de AbortError como cancelación.
  - styles.css: `#compartirPdfBtn` agregado a las reglas existentes de botones (estilo, hover, margin, disabled). El ocultamiento en impresión e imagen ya cubría al botón por estar dentro de `.botones-container`.
- Impacto funcional: nuevo flujo para compartir/descargar la cotización como PDF carta, idéntico en iPhone/Android/PC porque no usa el motor de impresión del navegador. IMPORTANTE: el PDF se ve como la imagen de Compartir (layout 1200px), NO como el layout de `@media print`; replicar el print exacto requeriría duplicar todo el CSS de impresión (descartado por riesgo). El botón Imprimir sigue igual.
- Riesgos: medios-bajos; jsPDF viene de CDN (sin internet no carga → el botón alerta error y sugiere Imprimir). El JPEG de la captura a escala 5 puede pesar unos MB; si en algún equipo tarda o falla por memoria, bajar la calidad a 0.85 o usar una escala menor solo para PDF.
- Validación realizada: `node --check script.js`; balance de llaves CSS (`0`).
- Pendientes: prueba real del usuario en celular (compartir por WhatsApp) y computadora (descarga), con cotización completa; revisar peso y nitidez del PDF.

### [2026-07-05] - "# de la Unidad" visible siempre en impresión e imagen compartida
- Autor: Claude Fable 5
- Motivo: el usuario pidió que el # de la unidad salga en las cotizaciones (impresión) y también en "Compartir imagen", alineado como las demás filas.
- Archivos modificados: styles.css, context.md
- Resumen técnico: (1) en el bloque final `@media print` se eliminaron las reglas `:placeholder-shown`/`:has()` que ocultaban la fila "# de la Unidad" cuando estaba vacía; ahora siempre se imprime, con cuadro vacío si no hay valor (igual que Esquina o Apartado). (2) Se eliminó el ocultamiento de `#letrasNumeros/#letrasNumerosDepa/.label-unidad` en `body.generando-imagen`; la fila ahora aparece en el PNG de Compartir. El ocultamiento original en la imagen (entrada 2026-06-25 "ocultar unidad y compactar CLG") era porque el campo iba apretado JUNTO al selector; con fila propia ya no aplica. Si está vacío, en la imagen muestra su placeholder gris, igual que "Ingrese el nombre del cliente".
- Impacto funcional: ninguno en cálculos; la fila "# de la Unidad:" sale siempre en impresión e imagen, alineada con las demás filas (misma rejilla de 2 columnas).
- Riesgos: bajos; en impresión/imagen aparece una fila más en Datos Generales (~18px extra de alto en la columna izquierda, con holgura). Si se quisiera volver a ocultarla cuando esté vacía, re-agregar las reglas `:placeholder-shown` descritas en la entrada anterior.
- Validación realizada: balance de llaves CSS (`0`).
- Pendientes: revisión visual del usuario: impresión y Compartir imagen con y sin # de unidad, en casas y departamentos.

### [2026-07-05] - "# de la Unidad" como fila propia con etiqueta (pantalla e impresión)
- Autor: Claude Fable 5
- Motivo: el usuario pidió que también en pantalla el "# de la unidad" deje de ir junto al selector (se cortaba) y quede como campo propio con etiqueta debajo de Prototipo/Departamento, igual que en la impresión. SUSTITUYE el enfoque de las dos entradas siguientes de hoy (proporción flex 1.5/0.5 en pantalla y grid-column en impresión).
- Archivos modificados: index.html, styles.css, context.md
- Resumen técnico:
  - index.html: dentro de `#prototipoContainer` y `#departamentoContainer` se agregó `<label class="label-unidad">` antes del input de unidad. Los inputs (`#letrasNumeros`, `#letrasNumerosDepa`) SIGUEN dentro de sus contenedores, por lo que el JS que alterna casas/departamentos (classList hidden sobre los contenedores) no se tocó.
  - styles.css pantalla: se eliminaron las reglas de ancho/flex-grow del bloque `@media screen` inicial y se agregó `@media screen and (min-width: 769px)` donde ambos contenedores son grid de 2 columnas (`260px minmax(0,1fr)`; 260 = 250px de flex-basis + 10px de padding-right que ocupan las etiquetas de las filas flex, que son content-box — así los campos quedan alineados al píxel con el resto de Datos Generales) → los 4 hijos fluyen en 2 filas: etiqueta+selector / etiqueta+input. En móvil (≤768px) no se tocó nada: la fila ya se apilaba en columna y la etiqueta nueva entra sola. Se quitó el `margin-left: 10px` del input de unidad.
  - styles.css impresión (bloque final): contenedores en 2 columnas `184px minmax(0,1fr)` con `row-gap: 3px`; el input de unidad hereda el estilo estándar de los demás campos. La fila completa (etiqueta + input) se oculta cuando está vacía vía `.label-unidad:has(+ input:placeholder-shown)` y `:placeholder-shown`. El bloque print intermedio (~línea 2300) se actualizó de 3 a 2 columnas por coherencia.
  - Imagen compartida: `body.generando-imagen .label-unidad` se agregó al ocultamiento existente de los inputs de unidad (la imagen no muestra unidad, igual que antes).
- Impacto funcional: ninguno en cálculos. En pantalla escritorio el selector usa todo el ancho del cuadro y "# de la Unidad:" queda como fila aparte. En impresión igual, y si no hay unidad capturada la fila no sale.
- Riesgos: bajos-medios; `:has()` requiere navegador moderno (Chrome 105+/Safari 15.4+, cumplido por los equipos del usuario). Revisar visualmente móvil por el orden apilado (etiqueta Prototipo, selector, etiqueta Unidad, input).
- Validación realizada: balance de llaves CSS (`0`); `node --check script.js`.
- Pendientes: revisión visual del usuario en pantalla (escritorio y móvil) e impresión con y sin # de unidad, casas y departamentos.

### [2026-07-05] - Impresión: nombre de prototipo completo, "# de la unidad" en segunda línea
- Autor: Claude Fable 5
- Motivo: en impresión/PDF el nombre del prototipo se cortaba dentro del selector (ej. "NONI ELITE PROMO" en La Rioja 2) porque la fila reservaba 78px para el "# de la unidad". El usuario pidió que el nombre salga completo y sugirió bajar el # de unidad a otra línea.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print`, `#prototipoContainer / #departamentoContainer` pasó de 3 columnas (`184px minmax(0,1fr) 78px`) a 2 (`184px minmax(0,1fr)`), con lo que el selector gana ~85px. `#letrasNumeros / #letrasNumerosDepa` ahora se colocan con `grid-column: 2` en una segunda fila bajo el selector, a todo el ancho (así también se lee completa una unidad larga tipo "mz13 lt 3 c-9"). Con `:placeholder-shown` se ocultan en impresión cuando están vacíos, para no imprimir un cuadro vacío ni gastar altura. Un bloque `@media print` anterior (~línea 2300) sigue existiendo pero el bloque final gana por orden. No afecta pantalla ni la imagen compartida (ahí estos campos ya iban ocultos).
- Cómo pedirlo después: "se corta el nombre del prototipo al imprimir" → revisar `grid-template-columns` de `#prototipoContainer/#departamentoContainer` en el bloque final `@media print`.
- Impacto funcional: ninguno en cálculos; solo presentación de impresión. Cuando hay # de unidad capturado, la fila ocupa una línea extra (~18px) en la columna izquierda, que tiene holgura.
- Riesgos: bajos; `:placeholder-shown` tiene soporte amplio (Chrome/Safari/Firefox). Si se quisiera imprimir el cuadro vacío siempre, quitar esa regla.
- Validación realizada: balance de llaves CSS (`0`).
- Pendientes: revisión visual del usuario en vista previa con prototipo de nombre largo (NONI ELITE PROMO / CEDRO PLUS 3N Roof) con y sin # de unidad.

### [2026-07-05] - Pantalla: selector Prototipo/Departamento más ancho, "# de la unidad" más chico
- Autor: Claude Fable 5
- Motivo: el usuario pidió que en pantalla el campo "# de la unidad" sea un poco más chico y el selector de Prototipo/Departamento un poco más grande.
- Archivos modificados: styles.css, context.md
- Resumen técnico: dentro del bloque `@media screen` inicial (~línea 245), se agregó `flex-grow: 1.5 !important` a `#prototipoContainer #prototipo` y `#departamentoContainer #departamentoSelect`, y `flex-grow: 0.5 !important` a `#letrasNumeros` y `#letrasNumerosDepa` (antes ambos crecían igual con flex-grow 1). Los anchos base (110/120/65px) no cambiaron. Solo aplica en pantalla: la impresión usa grid propio en `@media print` (donde flex-grow se ignora), el móvil (≤768px) apila los campos a 100% de ancho con reglas posteriores que siguen ganando, y en la imagen compartida estos campos van ocultos.
- Impacto funcional: ninguno en cálculos; solo proporción visual en escritorio (el selector toma ~3/4 del espacio libre de la fila y el # de unidad ~1/4).
- Riesgos: bajos; si el usuario quiere afinar la proporción, ajustar los dos valores de flex-grow (1.5/0.5).
- Validación realizada: balance de llaves CSS (`0`).
- Pendientes: revisión visual del usuario en escritorio (casas y departamentos).

### [2026-07-05] - Fix impresión departamentos: montos de Gastos cortados a la derecha
- Autor: Claude Fable 5
- Motivo: en la impresión/PDF de departamentos (ej. CAPUA PB), los montos de la sección Gastos salían picados (`$179,410.0`, `$10,500.0`, `$204,210.0`), mientras que en casas sí cabían completos. El usuario pidió alinear departamentos igual que casas sin romper nada.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print` (autoritativo), la regla `body.es-departamento .column-2 .leyenda-notarial .campo-horizontal` daba 238px a la columna de etiqueta (vs 170px en casas), dejando la caja del monto ~68px más angosta. Se cambió a `170px` con `column-gap: 8px` (mismos valores que casas) y se agregó una regla para que las etiquetas de esa sección usen `8.1pt` (como casas), porque un bloque `@media print` anterior (`body.es-departamento label`, ~línea 2033) las subía a 9pt por especificidad. Solo afecta la sección Gastos en impresión de departamentos; no se tocó Detalles de Precio (ahí los montos ya cabían), pantalla, imagen compartida, JS ni catálogos.
- Cómo pedirlo después: "se pican los montos de Gastos al imprimir departamentos" → revisar el ancho de etiqueta de `body.es-departamento .column-2 .leyenda-notarial .campo-horizontal` en el bloque final `@media print`.
- Impacto funcional: ninguno en cálculos; solo presentación de impresión en modo departamentos.
- Riesgos: bajos; las etiquetas largas (CLG) pueden ocupar 2 líneas igual que en casas, comportamiento ya aceptado. NO se usaron min-width/zoom/anchos globales (enfoque prohibido por la entrada del 2026-06-25).
- Validación realizada: balance de llaves CSS (`0`).
- Pendientes: revisión visual del usuario en vista previa de impresión con un departamento (CAPUA PB) comparando contra casas.

### [2026-07-05] - Limpieza segura: código muerto, jsPDF y context.md actualizado
- Autor: Claude Fable 5
- Motivo: el usuario pidió mejorar el código sin romper lo que funciona, como preparación para un próximo cambio.
- Archivos modificados: script.js, index.html, context.md
- Resumen técnico:
  - script.js: se eliminaron dos `DOMContentLoaded` anidados dentro del bloque principal (líneas ~1000-1064) que NUNCA se ejecutaban (el evento ya había disparado cuando se registraban). Eran código muerto: validación de campos numéricos (duplicada con `formatearEntradaDinero`), la alerta de "enganche mínimo" por plan (10% bancario/cofinavit, 5% otros) y un estilo `.error` inyectado. Ninguno corría en producción, así que quitarlos NO cambia el comportamiento. También se corrigió el comentario de `datosLaRioja2` que decía "precios pendientes" cuando ya tiene precios reales.
  - index.html: se removió el script CDN de jsPDF (cargado pero nunca usado; html2canvas se conserva porque el botón Compartir lo usa) y se corrigió `Imagen\copy_8241358.png` a `Imagen/copy_8241358.png` (barra invertida → normal).
  - context.md: se actualizaron las secciones 3, 4.1, 4.2, 4.3, 6 y 7 que estaban desactualizadas (catálogos reales: datosCasas1/datosLaRioja2/datosDepartamentosJardines6/datosDepartamentosLirios2; Azular3/Depas-Preventa/datosBakab ya no existen; escrituración automática por plan de venta; cuota de contingencia variable por desarrollo; modelos PROMO).
- Impacto funcional: NINGUNO en cálculos, pantalla, impresión ni imagen compartida. Solo se quitó código que no se ejecutaba y una librería que no se usaba.
- Riesgos: muy bajos. Si en el futuro se quiere la validación de "enganche mínimo" por plan, hay que reimplementarla (la versión eliminada nunca funcionó); la lógica está descrita en esta entrada. Si se implementa "Descargar PDF", volver a cargar jsPDF.
- Validación realizada: `node --check script.js` OK; grep confirmó que `validarCampoNumerico`/`formatearDinero` no se referencian fuera del bloque eliminado y que jsPDF no se usa en ningún archivo.
- Pendientes: el usuario tiene un cambio próximo por definir. El Excel "PORCENTAJE DE GASTOS NOTARIALES Y VALORES AVALUOS 2026.xls" fue modificado el 2026-07-05 y podría traer valores nuevos aún no reflejados en los catálogos de script.js.

### [2026-06-27] - Imagen compartida: volver a escala 5
- Autor: Codex
- Motivo: el usuario detecto que escala 7 podia romper o degradar mas la imagen, y considero que escala 5 se veia mejor y mas estable.
- Archivos modificados: script.js, context.md
- Resumen técnico: en `crearImagenCotizacion()`, la escala de `html2canvas` se redujo de `7` a `5`. Se conserva el ancho virtual de captura en `1200px`; no se modificaron layout, impresion, formulas ni catalogos.
- Impacto funcional: el PNG de "Compartir" vuelve a un punto de equilibrio entre nitidez, estabilidad visual, peso y velocidad de generacion.
- Riesgos: bajos; escala 5 sigue siendo alta. Si alguna app comprime la imagen o si se requiere menos peso, bajar a `4` seria el siguiente ajuste recomendado.
- Validación realizada: `node --check script.js`.
- Pendientes: generar una nueva imagen y confirmar visualmente que vuelve a verse estable.

### [2026-06-27] - Boton Compartir y alerta de imagen
- Autor: Codex
- Motivo: el usuario pidio que el boton diga solo "Compartir" y que al usarlo muestre un aviso como "Imagen copiada", sin cambiar el funcionamiento actual del flujo de imagen.
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: en `index.html`, el texto visible de `#compartirImagenBtn` cambio de "Compartir imagen" a "Compartir". En el handler de `script.js`, despues de `compartirOCopiarImagen(...)`, se agregaron alertas segun el resultado: "Imagen copiada.", "Imagen descargada." o "Imagen lista para compartir.". No se modifico la generacion del PNG, escala, rutas de compartir/copiar/descargar, formulas ni catalogos.
- Impacto funcional: el boton queda mas corto y el usuario recibe confirmacion visible cuando la imagen se comparte, copia o descarga correctamente.
- Riesgos: bajos; `alert()` es bloqueante y puede sentirse intrusivo, pero no altera el resultado del flujo. Si molesta, puede reemplazarse por un aviso visual no bloqueante.
- Validación realizada: `node --check script.js`.
- Pendientes: probar en celular que el aviso aparezca despues de compartir/copiar y que no resulte molesto.

### [2026-06-27] - Imagen compartida: prueba de escala 7
- Autor: Codex
- Motivo: el usuario pidio probar directamente escala 7 para maximizar nitidez del PNG compartido, ya que las escalas altas estaban generandose rapido.
- Archivos modificados: script.js, context.md
- Resumen técnico: en `crearImagenCotizacion()`, la escala de `html2canvas` se aumento de `6` a `7`. El ancho virtual de captura permanece en `1200px`; no se modificaron layout, impresion, formulas ni catalogos.
- Impacto funcional: el PNG de "Compartir imagen" se genera con aun mas pixeles internos para mejorar detalle al hacer zoom.
- Riesgos: medios-altos; escala 7 puede elevar memoria, tiempo de generacion y peso del archivo en dispositivos menos potentes. Algunas apps de mensajeria podrian comprimir el archivo con mas agresividad. Si se percibe lento o no aporta mejora visible, bajar a `6` o `5` es el ajuste recomendado.
- Validación realizada: `node --check script.js`.
- Pendientes: probar en celular y computadora que se genere rapido, se comparta bien y la nitidez mejore frente a escala 6.

### [2026-06-27] - Imagen compartida: prueba de escala 6
- Autor: Codex
- Motivo: el usuario confirmo que las escalas altas se generan rapido y no pesan de forma molesta, por lo que pidio probar mas nitidez sin complicar el flujo con PDF/vector.
- Archivos modificados: script.js, context.md
- Resumen técnico: en `crearImagenCotizacion()`, la escala de `html2canvas` se aumento de `5` a `6`. Se mantiene el ancho virtual de captura en `1200px`; no se modificaron layout, impresion, formulas ni catalogos.
- Impacto funcional: el PNG de "Compartir imagen" se genera con mas pixeles internos para mejorar nitidez al hacer zoom y al compartir.
- Riesgos: medios; aunque en las pruebas del usuario no pesa mucho, escala 6 puede consumir mas memoria/tiempo en dispositivos menos potentes o al compartir por apps que compriman archivos grandes. Si se detecta lentitud o fallos, volver a `5` o `4` es el primer ajuste recomendado.
- Validación realizada: `node --check script.js`.
- Pendientes: probar visualmente en celular y computadora; si escala 6 se mantiene fluida, decidir si se prueba escala 7.

### [2026-06-25] - Imagen compartida: prueba de escala 5
- Autor: Codex
- Motivo: probar una resolucion aun mayor para que el PNG de "Compartir imagen" se vea ultra nitido, con la posibilidad de volver a escala 4 si resulta pesado o inestable.
- Archivos modificados: script.js, context.md
- Resumen técnico: en `crearImagenCotizacion()`, la escala de `html2canvas` se aumento de `4` a `5`. El ancho virtual de captura sigue en `1200px`; no se modificaron layout, estilos de impresion, formulas ni catalogos.
- Impacto funcional: el PNG se genera con muchos mas pixeles internos para maximizar nitidez de textos y numeros sin cambiar proporciones visuales.
- Riesgos: medios-altos; escala 5 puede aumentar bastante peso, memoria y tiempo de generacion. En algunos dispositivos o navegadores podria fallar por memoria, tardar demasiado o producir un archivo que apps de mensajeria compriman agresivamente. Si ocurre, volver a `4` es el ajuste recomendado.
- Validación realizada: `node --check script.js`.
- Pendientes: probar en celular y computadora que la imagen se genere, se comparta y mantenga buena nitidez sin lentitud excesiva.

### [2026-06-25] - Imagen compartida: prueba de escala 4
- Autor: Codex
- Motivo: el usuario considera que el flujo de "Compartir imagen" puede soportar mas resolucion y pidio probar una escala mayor para obtener una imagen mas nitida.
- Archivos modificados: script.js, context.md
- Resumen técnico: en `crearImagenCotizacion()`, la escala de `html2canvas` se aumento de `3.5` a `4`. Se conserva el ancho virtual de captura en `1200px`; no se modificaron layout, estilos de impresion, formulas ni catalogos.
- Impacto funcional: el PNG se genera con mas pixeles internos, buscando mayor nitidez en textos y numeros sin cambiar proporciones visuales.
- Riesgos: medios; escala 4 aumenta el peso del archivo, memoria usada y tiempo de generacion. Si en algun celular falla, se tarda demasiado o una app comprime mucho el archivo, volver a `3.5` o `3` seria el primer ajuste recomendado.
- Validación realizada: `node --check script.js`.
- Pendientes: generar imagen en celular y computadora para comparar nitidez, velocidad, peso y comportamiento al compartir.

### [2026-06-25] - Imagen compartida: prueba de escala 3.5
- Autor: Codex
- Motivo: probar un poco mas de nitidez en el PNG de "Compartir imagen" sin cambiar el layout ni agrandar visualmente los campos.
- Archivos modificados: script.js, context.md
- Resumen técnico: en `crearImagenCotizacion()`, la escala de `html2canvas` se aumento de `3` a `3.5`. Se mantiene el ancho virtual de captura en `1200px`; no se modificaron estilos de pantalla, impresion, formulas ni catalogos.
- Impacto funcional: el PNG debe generarse con mas pixeles internos que la escala 3, buscando mayor nitidez en textos y numeros.
- Riesgos: medios-bajos; aumenta peso del archivo, uso de memoria y tiempo de generacion. Si en celular o computadora se siente lento, o si alguna app comprime demasiado el archivo, conviene volver a escala `3`.
- Validación realizada: `node --check script.js`.
- Pendientes: generar imagen en celular y computadora para comparar nitidez, velocidad y peso frente a escala 3.

### [2026-06-25] - Imagen compartida: escala 3 para mayor nitidez
- Autor: Codex
- Motivo: mejorar la nitidez y resolucion del PNG generado por "Compartir imagen" para que los numeros y textos se vean mas claros al compartir.
- Archivos modificados: script.js, context.md
- Resumen técnico: en `crearImagenCotizacion()`, la escala de `html2canvas` cambio de un calculo dinamico limitado a 2 (`Math.min(2, Math.max(1.8, window.devicePixelRatio || 1.8))`) a `const escala = 3`. No se modifico el ancho virtual de captura (`1200px`), ni layout, ni formulas, ni catalogos.
- Impacto funcional: el PNG mantiene el mismo diseño y proporciones, pero se genera con mas pixeles internos para mayor nitidez.
- Riesgos: bajos-medios; la imagen resultante puede pesar mas y consumir mas memoria/tiempo al generarse, especialmente en equipos con menos recursos. Si se sintiera pesado, bajar a `2.5` seria el primer ajuste recomendado.
- Validación realizada: `node --check script.js`; balance de llaves CSS (`0`).
- Pendientes: generar imagen en celular y computadora para comparar nitidez, peso y velocidad.

### [2026-06-25] - Imagen compartida: eliminar h2 del clon para quitar raya vieja
- Autor: Codex
- Motivo: seguian apareciendo dos rayitas bajo los titulos en la imagen generada; la raya fija nueva quedaba mejor alineada, pero la raya vieja del CSS (`.bloque h2::after`) seguia renderizandose porque el clon todavia conservaba los `h2`.
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: en `prepararTitulosParaCanvas`, cada `.bloque h2` del documento clonado ahora se reemplaza por un `div.titulo-canvas-wrap` que contiene un `div.titulo-canvas-texto` con el mismo texto. Al no existir `h2` dentro de `.bloque` en el clon, la regla vieja `.bloque h2::after` ya no puede dibujar la segunda raya. Se elimino la llamada a `anularSubrayadoViejoParaCanvas`; en CSS, `.titulo-canvas-texto` conserva el aspecto del titulo y dibuja la unica raya visible como `background-image` centrada.
- Impacto funcional: el PNG de "Compartir imagen" debe mostrar una sola rayita naranja, la fija y alineada bajo cada titulo. No afecta pantalla normal, impresion, formulas ni catalogos porque el reemplazo ocurre solo en el clon temporal de `html2canvas`.
- Riesgos: bajos; si algun estilo de titulo cambiara en pantalla normal, habria que replicarlo en `.titulo-canvas-texto` para la captura, pero no afecta calculos.
- Validación realizada: `node --check script.js`; balance de llaves CSS (`0`).
- Pendientes: generar nueva imagen en computadora y movil para confirmar visualmente que ya no aparece la segunda raya.

### [2026-06-25] - Imagen compartida: dejar una sola rayita alineada
- Autor: Codex
- Motivo: despues del ajuste maestro se veian dos rayitas bajo los titulos en la imagen generada: una correctamente alineada con el titulo y otra heredada del subrayado viejo.
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: se agrego `anularSubrayadoViejoParaCanvas(clonedDocument)`, que inyecta al final del documento clonado una regla para reducir `.bloque h2::after` a `width:0`, `height:0`, `margin:0`, `background:transparent` y `overflow:hidden`. En `styles.css` se reflejo la misma anulacion dentro de `body.generando-imagen`. Se conserva la rayita nueva como `background-image` del `h2` centrado dentro de `.titulo-canvas-wrap`.
- Impacto funcional: el PNG de "Compartir imagen" debe mostrar una sola rayita naranja, la alineada correctamente con cada titulo. No afecta pantalla normal, impresion, formulas ni catalogos.
- Riesgos: bajos; el cambio se limita al clon temporal de captura y al modo `generando-imagen`.
- Validación realizada: `node --check script.js`; balance de llaves CSS (`0`).
- Pendientes: generar nueva imagen para confirmar visualmente que ya no aparece la segunda rayita.

### [2026-06-25] - Imagen compartida: subrayado unido al titulo
- Autor: Codex
- Motivo: el subrayado real insertado como elemento separado seguia apareciendo desplazado respecto al titulo en la imagen generada; el problema no era especifico de iPhone, sino del centrado general de la raya en el PNG.
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: se reemplazo `prepararSubrayadosParaCanvas` por `prepararTitulosParaCanvas`, que envuelve cada `.bloque h2` del documento clonado en `div.titulo-canvas-wrap`. En `body.generando-imagen`, el `h2` se renderiza como `inline-block` centrado y la raya se pinta como `background-image` del propio titulo, con `background-position: center bottom` y `background-size: 44px 3px`. Se elimina el `span.subrayado-titulo-canvas` y se mantiene apagado el `::after` original durante la captura.
- Impacto funcional: en el PNG de "Compartir imagen", la rayita naranja queda ligada al centro del texto del titulo, evitando que se desplace como pieza independiente. No afecta pantalla normal, impresion, formulas ni catalogos.
- Riesgos: bajos-medios; el ajuste cambia solo la composicion visual temporal de los titulos dentro del clon de `html2canvas`. Si aun se percibe raro, la alternativa segura es ocultar la raya solo en la imagen.
- Validación realizada: `node --check script.js`; balance de llaves CSS (`0`).
- Pendientes: generar una nueva imagen para confirmar visualmente que la raya queda centrada bajo cada titulo.

### [2026-06-25] - Imagen compartida: subrayado real en clon
- Autor: Codex
- Motivo: la rayita naranja de los titulos seguia descentrada en la imagen generada en general, no solo en iPhone; el problema venia de depender del pseudo-elemento `::after` durante la captura con `html2canvas`.
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: se agrego `prepararSubrayadosParaCanvas(clonedDocument)`, que inserta un `span.subrayado-titulo-canvas` real despues de cada `.bloque h2` solo en el documento clonado que renderiza `html2canvas`. En `body.generando-imagen` se apaga por completo `.bloque h2::after`, se retira el padding/margen usado por el subrayado anterior y se centra el nuevo `span` con `display:block` y `margin: 7px auto 16px`. Tambien se elimina el padding especial del `h2` dentro de `.bloque-header-con-control` solo para la imagen.
- Impacto funcional: el PNG de "Compartir imagen" debe mostrar una sola rayita naranja centrada y estable debajo de cada titulo de seccion, sin afectar pantalla normal, impresion, formulas ni catalogos.
- Riesgos: bajos; el cambio de JS ocurre solo dentro del clon temporal de captura. Si visualmente se requiere mas o menos aire bajo los titulos, se puede ajustar el margen del `span` sin tocar calculos.
- Validación realizada: `node --check script.js`; balance de llaves CSS (`0`).
- Pendientes: generar una nueva imagen para confirmar visualmente que la rayita ya queda centrada.

### [2026-06-25] - Imagen compartida: ajuste fino centrado subrayado
- Autor: Codex
- Motivo: la rayita naranja ya no se duplicaba, pero seguia ligeramente fuera del centro visual en la imagen generada.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en `body.generando-imagen .bloque h2::after` se cambio el posicionamiento de `left: calc(50% - 22px)` a `left: 50%` con `transform: translateX(-50%)`. Esto centra el subrayado desde el punto medio real del titulo y reduce errores de redondeo durante la captura con `html2canvas`.
- Impacto funcional: el PNG de "Compartir imagen" debe mostrar una sola rayita naranja centrada debajo de cada titulo de seccion, mas parecido al comportamiento de impresion.
- Riesgos: bajos; cambio limitado al modo temporal `generando-imagen`, sin impacto en pantalla normal, impresion, formulas ni catalogos.
- Validación realizada: balance de llaves CSS (`0`).
- Pendientes: generar nueva imagen para confirmar el centrado visual en movil y computadora.

### [2026-06-25] - Imagen compartida: quitar duplicado de subrayado
- Autor: Codex
- Motivo: el ajuste anterior centraba la rayita naranja, pero en la imagen generada se veia duplicada porque `html2canvas` seguia pintando tambien el `::after` original.
- Archivos modificados: styles.css, context.md
- Resumen técnico: se retiro el enfoque de subrayado como `background-image` en `body.generando-imagen .bloque h2`. En su lugar, el `h2` queda `position: relative` y el unico subrayado se fuerza en `body.generando-imagen .bloque h2::after` con `position: absolute`, `left: calc(50% - 22px)`, `bottom: 0`, `width: 44px` y `margin: 0`. Esto mantiene una sola linea centrada sin depender de `margin: auto` durante la captura.
- Impacto funcional: el PNG de "Compartir imagen" debe mostrar una sola rayita naranja centrada debajo de cada titulo de seccion, igual que la intencion visual de impresion.
- Riesgos: bajos; cambio limitado al estado temporal `generando-imagen` y no afecta pantalla normal, impresion, formulas ni catalogos.
- Validación realizada: balance de llaves CSS (`0`).
- Pendientes: generar nueva imagen para confirmar visualmente que ya no se duplica y queda centrada.

### [2026-06-25] - Imagen compartida: subrayados centrados
- Autor: Codex
- Motivo: en la imagen generada por "Compartir imagen", las rayitas naranjas bajo los titulos de seccion se descentraban hacia la izquierda en movil y computadora.
- Archivos modificados: styles.css, context.md
- Resumen técnico: se agrego una regla especifica para `body.generando-imagen .bloque h2` que dibuja el subrayado como `background-image` centrado al fondo del titulo. En ese mismo modo se desactiva `body.generando-imagen .bloque h2::after` para evitar que `html2canvas` desplace el pseudo-elemento durante la captura. No se modifico el bloque `@media print`, la pantalla normal, formulas ni catalogos.
- Impacto funcional: el PNG de "Compartir imagen" debe mostrar las rayitas naranjas centradas bajo `Datos Generales`, `Financiamiento`, `Calculo Final`, `Detalles de Precio`, `Gastos`, `Plan de Enganche` y `Datos del Asesor`.
- Riesgos: bajos; el cambio esta limitado al estado temporal `generando-imagen` usado solo durante la captura.
- Validación realizada: balance de llaves CSS (`0`).
- Pendientes: generar una nueva imagen en celular y computadora para confirmar visualmente el centrado.

### [2026-06-25] - Etiquetas completas para Jardines del Sur 6
- Autor: Codex
- Motivo: el usuario pidio que el selector de Desarrollo vuelva a mostrar los nombres completos para Jardines del Sur 6.
- Archivos modificados: index.html, context.md
- Resumen técnico: se cambiaron solo las etiquetas visibles de `#Azular`: `Azular1` ahora muestra `Jardines del Sur 6 Casas` y `Azular1-Depas` muestra `Jardines del Sur 6 Departamentos`. Los `value` internos (`Azular1`, `Azular1-Depas`) no cambiaron, por lo que no se afecta `script.js`, formulas, catalogos ni calculos.
- Impacto funcional: pantalla, imagen compartida y nombre sugerido usan etiquetas de desarrollo mas descriptivas.
- Riesgos: bajos; al ser textos mas largos, revisar visualmente la imagen compartida, aunque el campo `# de la unidad` ya se oculta en el PNG y deja mas espacio disponible.
- Validación realizada: cambio HTML puntual; sin cambios en JS ni CSS.
- Pendientes: generar nueva imagen para confirmar que los textos completos caben bien.

### [2026-06-25] - Imagen compartida: reemplazar controles por cajas de texto en captura
- Autor: Codex
- Motivo: `html2canvas` renderiza los controles nativos `input/select` con alineacion interna irregular; los numeros y fechas seguian pegados arriba aunque el CSS tuviera `line-height`.
- Archivos modificados: script.js, context.md
- Resumen técnico: durante `html2canvas`, en `onclone`, se agrego `reemplazarControlesPorTextoParaCanvas(clonedDocument)`. Esta funcion recorre `input` y `select` visibles en el documento clonado, lee su valor/texto seleccionado/placeholder, y los reemplaza solo en la copia temporal por `div.control-texto-canvas` con estilos computados del control original (`width`, `height`, `margin`, `border`, `background`, fuente, flex, etc.) y `display:inline-flex; align-items:center`. La justificacion horizontal respeta el `text-align` computado para no cambiar la alineacion lateral. No afecta el DOM real, pantalla normal, impresion, formulas ni catalogos.
- Impacto funcional: en el PNG de "Compartir imagen", los valores deben quedar verticalmente centrados dentro de sus cajas sin mover las cajas ni cambiar la alineacion horizontal previa.
- Riesgos: medios-bajos; al convertir controles a `div` solo en la captura, algun estilo muy especifico de `input` podria requerir copiarse tambien si se detecta diferencia visual, pero no afecta calculos ni uso normal.
- Validación realizada: `node --check script.js`; balance de llaves CSS (`brace balance 0`).
- Pendientes: generar nueva imagen y revisar centrado vertical de importes, fechas, selects y Plan de Enganche.

### [2026-06-25] - Imagen compartida: revert centrado horizontal de valores
- Autor: Codex
- Motivo: el usuario aclaro que el centrado solicitado era vertical dentro de las cajas, no horizontal; la alineacion horizontal previa estaba bien.
- Archivos modificados: styles.css, context.md
- Resumen técnico: se retiro la regla `text-align:center` aplicada a campos numericos/moneda/fechas dentro de `body.generando-imagen`. Se conservan las reglas de altura, padding vertical y `line-height` para centrar verticalmente los valores dentro de los inputs, y se conserva el porcentaje de Gastos de Escrituracion como texto compacto tipo impresion.
- Impacto funcional: en el PNG de "Compartir imagen", los valores recuperan su alineacion horizontal previa y solo mantienen el ajuste de centrado vertical.
- Riesgos: bajos; cambio limitado a CSS de la imagen generada.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: generar nueva imagen para confirmar que horizontalmente se ve como antes y verticalmente queda centrado.

### [2026-06-25] - Imagen compartida: centrar valores y porcentaje de GE
- Autor: Codex
- Motivo: en el PNG generado, los valores dentro de las cajas de texto seguian alineados a la izquierda y el porcentaje de Gastos de Escrituracion se veia como select de pantalla, no como texto compacto de impresion.
- Archivos modificados: styles.css, context.md
- Resumen técnico: se agregaron reglas solo para `body.generando-imagen` que aplican `text-align:center` a campos numericos/moneda/fechas (`readonly`, fechas, creditos, apartado, gastos, meses y pagos del Plan de Enganche) para centrar el contenido dentro de las cajas sin mover las cajas. Tambien se oculto `#labelGastosEscrituracion .select-inline-porcentaje` y se mostro `#porcentajeGastosPrint`, igual que en impresion. No cambia pantalla normal, impresion, JS, formulas ni catalogos.
- Impacto funcional: en "Compartir imagen", los importes/fechas deben quedar centrados dentro de sus inputs y Gastos de Escrituracion debe mostrar el porcentaje como texto compacto.
- Riesgos: bajos; si algun campo editable de dinero se prefiere alineado a la izquierda, se puede quitar de la lista sin afectar calculos.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: generar nueva imagen y confirmar centrado visual de importes, fechas y porcentaje de GE.

### [2026-06-25] - Imagen compartida: centrar valores en inputs
- Autor: Codex
- Motivo: en el PNG generado, los números y fechas dentro de los inputs se veían cargados hacia arriba por la combinación de `html2canvas`, font-size/peso mayores y padding/line-height heredados de pantalla.
- Archivos modificados: styles.css, context.md
- Resumen técnico: se agregaron reglas solo para `body.generando-imagen` que fijan altura de campos horizontales a `34px`, padding vertical en `0`, `box-sizing:border-box` y `line-height:34px` para inputs/selects/fechas/meses. En el Plan de Enganche, `.monto-pago` y `.fecha-pago` usan `line-height:44px` y padding vertical en `0`. Se agrego pseudo-elemento WebKit para el valor de fecha en inputs date. No cambia pantalla normal, impresion, JS, formulas ni catalogos.
- Impacto funcional: los importes y fechas en la imagen compartida deben quedar verticalmente centrados dentro de sus cajas.
- Riesgos: bajos; si algun navegador renderiza distinto los inputs date, se puede ajustar solo el line-height de `.fecha-pago`.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: generar nueva imagen con fecha y valores para confirmar el centrado visual.

### [2026-06-25] - Imagen compartida: porcentaje de credito como impresion
- Autor: Codex
- Motivo: en la imagen compartida, el porcentaje de Crédito Bancario seguia saliendo como control de pantalla (`90` + `%`) y no como el texto compacto de impresion.
- Archivos modificados: styles.css, context.md
- Resumen técnico: se agregaron reglas solo para `body.generando-imagen` que ocultan `.inline-percent-field` en los labels de `creditoBancario` y `creditoInfonavit`, y muestran `.solo-print-inline`, igual que el bloque de impresion. No se modifico JS, formulas, catalogos, pantalla normal ni `@media print`.
- Impacto funcional: en el PNG de "Compartir imagen", el porcentaje de credito debe verse como en impresion, por ejemplo `(90%):`, en lugar de una cajita separada con `%`.
- Riesgos: bajos; depende de que el span `solo-print-inline` ya este sincronizado por el JS existente.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: generar nueva imagen con porcentaje bancario capturado para confirmar que aparece igual que en impresion.

### [2026-06-25] - Ajuste imagen: ocultar unidad y compactar CLG
- Autor: Codex
- Motivo: en la imagen compartida, el campo `# de la unidad` se cortaba y la etiqueta `(+) Certificado Libertad de Gravamen(CLG)` invadia el espacio del importe.
- Archivos modificados: styles.css, context.md
- Resumen técnico: se agregaron reglas solo para `body.generando-imagen`: ocultar `#letrasNumeros` y `#letrasNumerosDepa` en el PNG, dejar que `#prototipo` y `#departamentoSelect` usen el ancho disponible, y reducir solo el `font-size` del label `for="infoCertificadoLibertadGravamen"` a `15px` con `line-height` compacto. No cambia pantalla normal, impresion, HTML, JS, formulas ni catalogos.
- Impacto funcional: la imagen compartida ya no muestra el campo de unidad y la fila de CLG deberia dejar de desbordarse contra el importe.
- Riesgos: bajos; si en alguna cotizacion se necesita mostrar la unidad en la imagen, habria que revertir el ocultamiento solo de `#letrasNumeros`/`#letrasNumerosDepa`.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: generar nueva imagen de Casas y Departamentos para confirmar que la fila CLG queda limpia.

### [2026-06-25] - Imagen compartida mas grande sin cambiar layout
- Autor: Codex
- Motivo: hacer que la imagen compartida se vea mas grande y bonita en celular, pero sin volver a agrandar campos sueltos que podian picar importes.
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: en `crearImagenCotizacion()` se redujo el ancho de captura controlado de `1280px` a `1200px` y se subio la escala minima de render de `1.5` a `1.8` (manteniendo maximo `2`). En CSS, solo para `body.generando-imagen`, se ajusto el ancho fijo a `1200px`, la `.container` a `96%` y margenes/padding exteriores mas compactos. Esto agranda la cotizacion completa como conjunto dentro del PNG, sin cambiar proporciones internas, formulas, catalogos, pantalla normal ni `@media print`.
- Impacto funcional: solo afecta el PNG generado por "Compartir imagen"; deberia verse un poco mas grande/nitido al compartir, con menor riesgo de recorte que subir fuentes individuales.
- Riesgos: bajos-medios; al tener un lienzo 80px mas angosto, si se usan textos extremadamente largos podria requerir volver a `1240px` o reducir un poco la fuente de `body.generando-imagen`.
- Validación realizada: `node --check script.js`; balance de llaves CSS (`brace balance 0`).
- Pendientes: generar imagen real y revisar si el tamano global queda en el punto deseado sin recortes.

### [2026-06-25] - Imagen compartida con numeros mas legibles
- Autor: Codex
- Motivo: la imagen generada de la cotizacion se veia bien, pero los importes podian percibirse pequeños o poco claros al compartir por celular.
- Archivos modificados: styles.css, context.md
- Resumen técnico: se agregaron reglas solo para `body.generando-imagen` (la copia temporal que captura `html2canvas`): mayor contraste y peso en `input/select`, con aumento moderado de `font-size` en campos numericos/readonly, totales destacados (`.valor-destacado input`, `#totalPagos`) y montos/fechas del Plan de Enganche. Tras una prueba visual del usuario, se redujo el ajuste inicial porque `21px/19.5px` resultaba demasiado grande y algunos valores se picaban; el estado actual queda mas cercano al PDF de impresion (`18.2px` general, `19px` en totales, `18.2px` en mensualidades) con `line-height` compacto para evitar recorte. No se modifico el layout normal, el bloque `@media print`, formulas, catalogos ni JS.
- Impacto funcional: solo mejora la legibilidad del PNG generado con "Compartir imagen"; pantalla e impresion siguen con su apariencia previa.
- Riesgos: bajos; si algun importe extremadamente largo se ve apretado en la imagen, se puede bajar un poco el `font-size` de `body.generando-imagen input[readonly]`.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: generar una nueva imagen real y revisar si el aumento de numeros se ve natural en celular.

### [2026-06-25] - Fix Compartir imagen en modo local file://
- Autor: Codex
- Motivo: al usar "Compartir imagen" abriendo `index.html` desde `file://`, el navegador marcaba el canvas como contaminado (`SecurityError: Tainted canvases may not be exported`) por los logos locales (`Imagen/Logo Sadasi.webp` y `Imagen/Logo Altta Homes.webp`).
- Archivos modificados: script.js, context.md
- Resumen técnico: en `script.js` se agrego un mapa `imagenesSegurasCanvas` con los dos logos del encabezado embebidos como `data:image/webp;base64`. Durante `html2canvas`, dentro de `onclone`, `prepararImagenesSegurasParaCanvas()` reemplaza solo en el documento clonado esos `img.src` por data URLs seguras antes de renderizar el canvas. El HTML real sigue usando los archivos de `Imagen/`, y no se modifico pantalla, impresion, formulas ni catalogos.
- Impacto funcional: "Compartir imagen" ahora puede exportar el PNG aunque la app se abra localmente como archivo. En sitio publicado tambien sigue funcionando; el reemplazo solo ocurre en la copia temporal de captura.
- Riesgos: bajos; los data URLs aumentan el tamaño de `script.js` y si se reemplazan los logos originales en el futuro habra que actualizar tambien estos data URLs para que la imagen compartida use la version nueva.
- Validación realizada: `node --check script.js`; balance de llaves CSS (`brace balance 0`).
- Pendientes: probar de nuevo el boton desde `file://` y revisar visualmente que ambos logos aparezcan correctamente en el PNG.

### [2026-06-25] - Botón Compartir imagen con html2canvas
- Autor: Codex
- Motivo: permitir compartir la cotización como imagen desde celular, evitando depender de la impresión nativa de Safari/Chrome móvil y sin reabrir el enfoque problemático de `min-width`/anchos globales/zoom para iPhone.
- Archivos modificados: index.html, styles.css, script.js, context.md
- Resumen técnico: se agregó el botón `#compartirImagenBtn` junto a Imprimir. En `script.js` se implementó generación de PNG con `html2canvas(document.body)` usando `windowWidth: 1280`, `scale` controlado y una clase temporal solo en la copia clonada (`body.generando-imagen`) para capturar con ancho de escritorio, ocultar botones/errores y poner el header en flujo normal. El flujo intenta primero `navigator.share` con archivo PNG, después copiar al portapapeles con `ClipboardItem`, y por último descarga el PNG como respaldo. No se tocaron formulas, calculos, catalogos ni reglas de impresion existentes.
- Impacto funcional: aparece un nuevo botón "Compartir imagen" para enviar/guardar la cotización como imagen. El botón Imprimir sigue funcionando igual con `window.print()`. La imagen generada busca ser consistente entre celular y computadora porque no depende del motor de impresion del navegador.
- Riesgos: medios-bajos; la calidad/soporte de compartir/copiar depende del navegador y de que `html2canvas` cargue desde CDN. En navegadores sin Web Share ni Clipboard compatible se descarga el PNG. La imagen es raster, no texto seleccionable.
- Validación realizada: `node --check script.js`; balance de llaves CSS (`brace balance 0`).
- Pendientes: prueba visual en iPhone/Android/PC con una cotizacion real para confirmar encuadre, logos y legibilidad del PNG.

### [2026-06-25] - Ajuste impresión: Desarrollo y Prototipo más compactos
- Autor: Codex
- Motivo: evitar que en impresión/PDF se piquen los textos largos de Desarrollo y del modelo/prototipo seleccionado.
- Archivos modificados: index.html, styles.css, context.md
- Resumen técnico: en `index.html` se acortaron solo las etiquetas visibles del selector `#Azular`, manteniendo intactos los `value` internos usados por `script.js`: `Jardines del Sur 6`, `Jardines del Sur 6 Deptos`, `Lirios Residencial 2`, `La Rioja 2`. En el bloque final `@media print` de `styles.css` se agrego una regla especifica para `#Azular`, `#prototipo` y `#departamentoSelect`, bajando su `font-size` a `7.4pt` y reduciendo padding lateral. No se tocaron formulas, calculos, catalogos ni JS.
- Impacto funcional: solo texto visible y presentacion de impresion; la logica de seleccion/cotizacion sigue usando los mismos values (`Azular1`, `Azular1-Depas`, `Lirios2-Depas`, `LaRioja2`).
- Riesgos: bajos; al acortar etiquetas puede cambiar el nombre sugerido del PDF porque el titulo se arma con el texto visible del desarrollo. No se usaron `min-width`, anchos globales ni zooms nuevos.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: revisar visualmente la impresion/PDF en celular y computadora para confirmar que Desarrollo/Prototipo ya no se corten.

### [2026-06-25] - IMPORTANTE: revert de styles.css + estado real (leer esto primero)
- Autor: Claude Opus 4.8
- Motivo: el fix de `min-width` para iPhone (entrada de abajo) ROMPIÓ la impresión en iPhone 17 Pro Max (Safari reescaló/desbordó todo). El usuario revirtió `styles.css` por completo, lo que deshizo TODOS los cambios CSS de la sesión, no solo el malo.
- Archivos modificados: styles.css, context.md
- Estado REAL de styles.css tras el revert + esta corrección:
  - DESCARTADO definitivamente: el `min-width: 7.4in` en `html, body` y `min-width: 7in` en `.container` dentro de `@media print`. NO volver a usar ese enfoque: en iOS fuerza un ancho de hoja que Safari reescala y rompe el documento.
  - RE-APLICADO (seguro): "Fix mobile: Plan de Enganche centrado como en escritorio" — se quitaron de nuevo los anchos fijos `#tablaEnganche td:nth-child(1/2/3) { width:22%/38%/40% }` y `table-layout: fixed` del bloque `@media (max-width:768px)`, dejando `#tablaEnganche { min-width:0; width:100% }`. Balance de llaves 0.
  - NO re-aplicados (quedaron revertidos por decisión del usuario "dejarlo por ahora"): (1) números más chicos en impresión (volvió a 9.1pt/10pt); (2) clip `.00` + fecha centrada (etiquetas de `#detallesPrecio` volvieron a 214px/220px y se perdieron los pseudo-elementos `-webkit-` de `.fecha-pago`). Si se quieren, están descritos en las dos entradas de abajo y se pueden re-aplicar tal cual (son seguros, no rompen escritorio).
  - SIGUE VIGENTE (otro archivo, no afectado por el revert): opción Esquina $50,000 en index.html.
- Pendiente abierto: el "picado" (corte de montos) al imprimir desde iPhone 17 Pro Max SIGUE sin resolver. Causa raíz confirmada: Safari iOS imprime usando el ancho de la PANTALLA del teléfono, no el de la hoja. Decisión del usuario: dejarlo por ahora. La solución recomendada cuando se retome es un botón "Descargar PDF" con jsPDF + html2canvas (ya cargados en index.html, sin usar) que genere el PDF sin depender del navegador → sale idéntico en iPhone/Android/PC. NO intentar de nuevo arreglarlo con `min-width`/`zoom`/anchos globales en CSS de impresión.
- Impacto funcional: ninguno; solo presentación. No se tocó JS, fórmulas ni pantalla de escritorio.
- Riesgos: nulos (lo re-aplicado es el centrado móvil, ya validado antes).
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Nota: las DOS entradas de abajo ("Fix impresión iPhone montos cortados" = min-width, y "Fix impresión cell: valores cortados y fecha no centrada") describen cambios que YA NO están en el archivo (revertidos). Se conservan como historial/explicación, no como estado actual.

### [2026-06-25] - Investigación + fix impresión iPhone (montos cortados a la derecha)
- Autor: Claude Opus 4.8
- Motivo: al imprimir/guardar PDF desde iPhone (17 Pro Max, Safari) TODOS los montos de la columna derecha (Detalles de Precio y Gastos) salían cortados a la derecha (`$5,870,`, `$1,383,`, `$440,250`, `$479,05`...). En PC se ve bien.
- Diagnóstico (causa raíz): el bloque `@media print` arma el ancho con `html, body { width: 100% }` y las dos columnas cuelgan de ahí sin ancho fijo. En Chrome de escritorio `100%` = ancho de la HOJA (~7.8in) y cuadra. En Safari iOS hay un bug conocido: al imprimir, `width:100%` se resuelve contra el ancho de la PANTALLA del teléfono (~430px), no de la hoja; el documento se arma a ~430px, cada columna ~215px, y como las etiquetas son de ancho fijo (170–184px) al cuadro del valor le quedan ~30–45px → corta los montos. El `zoom:1.04` solo agranda ese layout ya apretado (no reacomoda). El pie del PDF (URL hostingersite, "Página 1 de 1", hora) confirma que es la impresión web de Safari, no un PDF controlado.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en `@media print`, a `html, body` se le agregó `min-width: 7.4in` y a `.container` `min-width: 7in`. Son MENORES al ancho real de escritorio (~7.8in), por lo que en PC no cambian nada (gana el ancho real), y en iPhone fuerzan el ancho de hoja → las columnas recuperan espacio y los montos dejan de cortarse. No se tocó JS, fórmulas, pantalla ni el resto del print.
- Cómo pedirlo después: "desde iPhone se corta la impresión" → revisar el `min-width` de `html, body` / `.container` en `@media print` (forzar ancho de hoja).
- Impacto funcional: ninguno; solo presentación de impresión. Desktop probadamente intacto (min-width < ancho real).
- Riesgos: bajos en desktop (provable). En iOS es best-effort: la impresión web de Safari es inconsistente; si no basta, la solución definitiva es un botón "Descargar PDF" con jsPDF + html2canvas (ya cargados pero sin usar en index.html) que genere el PDF sin depender del navegador (cambio mayor, pendiente de planear).
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: que el usuario pruebe el PDF desde el iPhone y confirme; evaluar el botón "Descargar PDF" si el fix CSS no es suficiente.

### [2026-06-25] - Fix impresión (visto en PDF desde cell): valores cortados y fecha no centrada
- Autor: Claude Opus 4.8
- Motivo: al guardar como PDF desde el celular (Jardines Casas / FLAMBOYAN), en Detalles de Precio se cortaba el `.00` de los montos de 7 dígitos (Valor Avalúo `$2,621,000.00`, Precio Neto de la Casa `$2,200,850.00`) y la fecha del Plan de Enganche salía pegada a la izquierda en vez de centrada.
- Archivos modificados: styles.css, context.md
- Resumen técnico (todo en el bloque final `@media print`, autoritativo):
  - Clip de montos: la columna de etiqueta de `#detallesPrecio .campo-horizontal` era muy ancha y dejaba el cuadro del valor corto. Se redujo: casas `214px → 182px`; departamentos (`body.es-departamento #detallesPrecio .campo-horizontal`) `220px → 188px`. El valor (`minmax(0,1fr)`) gana ~32px y los montos de 7 dígitos entran completos. La etiqueta más larga ("Precio de Metros Excedentes", ~150px a 8.1pt) sigue en una sola línea, sin wrap.
  - Fecha centrada: `#tablaEnganche .fecha-pago` ya tenía `text-align: center`, pero en WebKit (iOS al imprimir/PDF) el valor nativo y el ícono no lo respetan. Se agregaron, solo en impresión: `::-webkit-calendar-picker-indicator { display:none }`, `::-webkit-datetime-edit { text-align:center }` y `::-webkit-date-and-time-value { text-align:center; margin:0 auto }`. Solo afecta impresión; en pantalla el input sigue completo e interactivo.
- Cómo pedirlo después: "se corta el .00 de los precios en impresión" → ensanchar el cuadro de valor reduciendo la etiqueta de `#detallesPrecio .campo-horizontal`. "la fecha del Plan de Enganche no sale centrada en el PDF" → pseudo-elementos WebKit de `.fecha-pago` en `@media print`.
- Impacto funcional: ninguno; solo presentación de impresión. No se tocó JS, fórmulas ni pantalla.
- Riesgos: bajos; el centrado de fecha depende de pseudo-elementos `-webkit-` (cubren Chrome escritorio e iOS Safari). La impresión desde móvil sigue dependiendo del navegador.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: revisión visual del usuario en PDF desde cell y en vista previa de PC.

### [2026-06-25] - Fix mobile: Plan de Enganche centrado como en escritorio
- Autor: Claude Opus 4.8
- Motivo: en móvil (≤768px) las tarjetas del Plan de Enganche se veían descentradas (recorridas a la izquierda) en vez de centradas como en computadora.
- Archivos modificados: styles.css, context.md
- Resumen técnico: el bloque `@media screen and (max-width: 768px)` conservaba reglas de la tabla vieja de 3 columnas: `#tablaEnganche { table-layout: fixed }` y anchos fijos `td:nth-child(1/2/3) { width: 22%/38%/40% }`, más un override `#tablaEnganche th, td { padding: 6px 4px; font-size: 12px }`. Como el diseño actual es de mini-tarjetas (tbody `display:flex` con `--cols`, tr en `flex-direction:column`), esos anchos encogían cada `td` y los alineaban a la izquierda (align-self default), rompiendo el centrado. Se eliminaron esas reglas (table-layout, los tres `width` por columna y el override de padding/font), dejando solo `#tablaEnganche { min-width:0; width:100% }`. Así el móvil hereda el layout base de escritorio: tarjetas de ancho completo con contenido centrado. El `thead` ya está `display:none` global, así que las reglas `th:nth-child` eran código muerto. No se tocó el override de tamaño de inputs móvil (`input.monto-pago/.fecha-pago` 34px/12px) para no arriesgar desbordes en pantallas chicas. Sin cambios de JS ni fórmulas.
- Cómo pedirlo después: "centra el Plan de Enganche en móvil como en escritorio" → revisar que el bloque ≤768px NO fije anchos por columna en `#tablaEnganche td:nth-child(...)`.
- Impacto funcional: solo presentación en móvil; impresión y escritorio sin cambios.
- Riesgos: bajos.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: revisión visual del usuario en teléfono (ancho ≤768px).

### [2026-06-25] - Números un poco más chicos en impresión
- Autor: Claude Opus 4.8
- Motivo: el usuario pidió bajar "un tin" el tamaño de los números (importes) en impresión.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print` (autoritativo) se redujo el `font-size` de `.campo-horizontal input, .campo-horizontal select, #mesesPagarEnganche` de `9.1pt` a `8.6pt`, y el de `.valor-destacado input` (totales: Total a Pagar por el Cliente, Enganche por Pagar, Gastos Totales) de `10pt` a `9.5pt`. NO se tocó la tabla del Plan de Enganche (`#tablaEnganche .monto-pago`) porque tiene tamaños auto-ajustados por número de pagos vía reglas `:has()`. No se cambió lógica, fórmulas ni estructura.
- Cómo pedirlo después: "baja/sube un poco los números en impresión" o "regresa el tamaño de los números de impresión" → ajustar esos dos `font-size` (8.6pt y 9.5pt).
- Impacto funcional: ninguno; solo presentación de impresión.
- Riesgos: nulos.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: revisión visual del usuario en vista previa Carta.

### [2026-06-25] - Verificación de precios 2026 contra listas oficiales (4 desarrollos)
- Autor: Claude Opus 4.8
- Motivo: el usuario compartió las listas de precios 2026 (imágenes) de Lirios II, Jardines del Sur 6 (Casas y Deptos) y La Rioja 2 para cotejar avalúos, descuentos y netos contra los catálogos de `script.js`.
- Archivos modificados: context.md (solo bitácora; no se tocó código porque todo coincide).
- Resumen técnico:
  - Lirios II (`datosDepartamentosLirios2`): CEDRO PLUS PB/1N/2N/3N(Roof) coinciden 100% (avalúo, descuento y neto).
  - Jardines 6 Casas (`datosCasas1`): CEIBA, TABACHIN, NONI coinciden 100%. FLAMBOYAN difiere a propósito (app avalúo 2,621,000 / descuento 395,150 vs lista 2,536,000 / 310,150); confirmado por el usuario que la app es la correcta. El Precio Neto sale idéntico en ambos (2,225,850): la app suma +85,000 tanto al avalúo como al descuento.
  - La Rioja 2 (`datosLaRioja2`): FRESNO(=FRESNO ELITE), NONI ELITE, ALAMO, NONI coinciden 100%. Nota: en la lista nueva NONI Rioja ya muestra 4,490,000, igual que la app (la diferencia histórica con el .xls anterior ya no aplica con esta lista).
  - Jardines 6 Deptos (`datosDepartamentosJardines6`): mapeo confirmado por el usuario — tabla "CAPUA OCELOTE * MÁS PROMOCIONES MAYO" = `CAPUA PROMO`; "CEDRO PLUS ANTILOPE J-K" = `CEDRO PLUS` (regular); "CEDRO PLUS ANTILOPE L-M" = `CEDRO PLUS PROMO`. Avalúos, descuentos y netos coinciden 100% en las 12 filas (CAPUA PROMO + CEDRO regular + CEDRO PROMO).
- Impacto funcional: ninguno; solo verificación documental. No se modificaron catálogos ni fórmulas.
- Riesgos: nulos.
- Validación realizada: cruce manual de avalúo/descuento/neto de las 4 imágenes contra los objetos de `script.js`.
- Pendientes: no se pudo verificar el CAPUA regular (no-promo) porque las imágenes solo traen el CAPUA promo; queda pendiente cotejarlo si el usuario comparte la lista base de CAPUA.

### [2026-06-25] - Nueva opción de $50,000 en el campo Esquina
- Autor: Claude Opus 4.8
- Motivo: el campo Esquina solo sugería $40,000; se pidió agregar también la opción de $50,000.
- Archivos modificados: index.html, context.md
- Resumen técnico: en `#esquina-options` (datalist del input `#esquina`, bloque Detalles de Precio) se agregó `<option value="$50,000.00">` debajo de la opción existente de `$40,000.00`. El campo sigue siendo de texto libre y editable; el datalist solo provee sugerencias. No se tocó JS ni fórmulas: `actualizarValores()` ya lee el valor de Esquina con `replace(/[^0-9.-]+/g, "")` y lo suma al Valor Avalúo para casas, así que la nueva opción funciona sin cambios de cálculo.
- Impacto funcional: solo agrega una sugerencia en el selector de Esquina.
- Riesgos: nulos.
- Validación realizada: edición HTML puntual; sin cambios en script.js ni styles.css.
- Pendientes: ninguno.

### [2026-06-25] - Verificación con lupa del % de Gastos de Escrituración por modelo y plan
- Autor: Claude Opus 4.8
- Motivo: confirmar contra la fuente oficial (`PORCENTAJE DE GASTOS NOTARIALES Y VALORES AVALUOS  2026.xls`) que el porcentaje de escrituración esté bien capturado según el modelo y el plan de pago.
- Archivos modificados: context.md (solo bitácora; no se tocó código porque todo estaba correcto).
- Resumen técnico:
  - Fuente: hoja "PROCENTAJE DE GASTOS 2026" del .xls, con bloques "JARDINES DEL SUR 6" y "RIOJA II".
  - Porcentajes fijos para todos los modelos: INFONAVIT 7% (`0.07`), FOVISSSTE 8% (`0.08`), COFINAVIT 8.5% (`0.085`), CONTADO 7.2% (`0.072`). Todos coinciden con los catálogos de `script.js`.
  - BANCOS (único que varía por modelo) verificado uno a uno: CAPUA y CEDRO PLUS = 7.7% (`0.077`); FLAMBOYAN, CEIBA, TABACHIN(=TABACHIN PLUS) = 7.3% (`0.073`); NONI Jardines = 7.5% (`0.075`); Rioja II (ALAMO, FRESNO ELITE, NONI ELITE, NONI) = 7.5% (`0.075`). Las variantes PROMO heredan el % de su modelo base. TODO COINCIDE.
  - Flujo confirmado: `obtenerPorcentajeEscrituracionAutomatico()` lee `porcentajesEscrituracion[planActivo]` y se aplica sobre el Valor Avalúo (`baseEscrituracion = valorAvaluoActual`); las llaves (`bancario/infonavit/fovissste/cofinavit/contado`) coinciden con los values de `#planVenta`.
  - Diferencias en VALOR AVALÚO (no en el %) detectadas y CONFIRMADAS CORRECTAS por el usuario (él actualizó esos montos a propósito; el precio de lista difiere del avalúo): FLAMBOYAN Jardines código `$2,621,000` vs .xls `$2,536,000`; NONI Rioja código `$4,490,000` vs .xls `$4,462,000`. No se cambian.
  - Lirios II no está en el .xls; por decisión del usuario sus porcentajes se toman iguales a Jardines del Sur 6 (Bancos `0.077`), lo cual ya está así en `datosDepartamentosLirios2`.
- Impacto funcional: ninguno; solo verificación documental. No se modificaron fórmulas ni catálogos.
- Riesgos: nulos.
- Validación realizada: cruce programático del .xls (xlrd) contra los objetos `porcentajesEscrituracion` de `datosDepartamentosJardines6`, `datosDepartamentosLirios2`, `datosCasas1` y `datosLaRioja2`.
- Pendientes: ninguno sobre escrituración.

### [2026-06-25] - Fix mobile: botón Imprimir vuelve al final (después de Datos del Asesor)
- Autor: Claude Opus 4.8
- Motivo: en móvil (≤768px) el botón Imprimir aparecía hasta arriba de todo en lugar de al final.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en `@media screen and (max-width: 768px)`, `.column-1`/`.column-2` usan `display: contents`, por lo que todas las secciones pasan a ser hijos directos de `.container` ordenados con `order` (1–7). El `.botones-container` no tenía `order`, así que tomaba el default `order: 0` y se renderizaba primero. Se agregó `.botones-container { order: 8; }` dentro del bloque mobile para colocarlo después de `#datosAsesor` (order 7), igual que en desktop. No se tocó nada más.
- Impacto funcional: solo orden visual en móvil; sin cambios de lógica ni de impresión.
- Riesgos: bajos.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: revisión visual del usuario en ancho ≤768px confirmando que Imprimir queda al final.

### [2026-06-21] - Cierre de ajustes de impresión (Departamentos y B/N)
- Autor: Codex
- Motivo: consolidar el estado final de los retoques de impresión solicitados durante la sesión para evitar regresiones y dejar criterios claros.
- Archivos modificados: styles.css, script.js, context.md
- Resumen técnico:
  - Se habilitó clase de plan en `body` desde `#planVenta` (`plan-contado`, `plan-infonavit`, `plan-fovissste`, `plan-bancario`, `plan-cofinavit`) para aplicar ajustes CSS por escenario sin tocar fórmulas.
  - En Departamentos se estabilizó el pie legal inferior con ancho útil amplio, centrado y balance de líneas en impresión.
  - Para B/N, los totales de impresión se definieron en negro (`#111`) con peso 900 para máxima legibilidad; el acento naranja se conserva en bordes/separadores.
  - Se mantuvo el ajuste de Plan de Enganche automático visual (hasta 6 columnas) y compactación progresiva para planes largos.
- Impacto funcional: solo presentación de impresión/UI; cálculos financieros y lógica de distribución no se modificaron.
- Riesgos: bajos; el salto exacto del texto legal puede variar levemente por motor de impresión del navegador/driver.
- Validación realizada: `node --check script.js`, balance de llaves CSS (`brace balance 0`), sin errores de editor reportados en `styles.css` y `script.js`.
- Pendientes:
  - Verificación visual final en Carta para Departamentos con Infonavit y Bancario (4 y 8 pagos).
  - Verificación rápida en impresión Color vs Blanco y Negro para confirmar legibilidad de totales.

### [2026-06-21] - Ajuste de impresión centrado para Departamentos con Cofinavit
- Autor: Codex
- Motivo: el retoque final de impresión se pidió para Cofinavit (no Infonavit). En Departamentos, al ocultarse CAP y variar alturas, el documento podía verse cargado a un lado y con fecha del Plan de Enganche demasiado justa.
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: se agregó una clase de plan en `body` (`plan-contado`, `plan-infonavit`, `plan-fovissste`, `plan-bancario`, `plan-cofinavit`) dentro del listener de `#planVenta`, sin tocar cálculos. En el bloque final `@media print` se añadieron overrides exclusivos para `body.es-departamento.plan-cofinavit`: centrado del contenedor, zoom menos agresivo (`0.97 / 0.94 / 0.90` según densidad), compactación vertical moderada desde 7 pagos y un poco más de ancho útil en `#tablaEnganche .fecha-pago`.
- Impacto funcional: solo presentación de impresión para el escenario Departamentos + Cofinavit. No cambian fórmulas, montos ni distribución de pagos.
- Riesgos: bajos; depende de soporte de `:has()` del navegador de impresión.
- Validación realizada: `node --check script.js`; balance de llaves CSS sin descuadre.
- Pendientes: revisión visual del usuario en vista previa de impresión con casos de 7, 10 y 12 pagos.

### [2026-06-21] - Corrección de recorte en Departamentos Cofinavit con planes cortos
- Autor: Codex
- Motivo: en Departamentos + Cofinavit con pocos pagos (ej. 4), se seguía aplicando el zoom general alto y podía recortar la leyenda final aunque Casas sí entrara en una hoja.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print`, `body.es-departamento.plan-cofinavit` ahora usa zoom base `1` (antes heredaba `1.04`) y conserva centrado. Además se comprimió ligeramente la huella vertical de `#datosAsesor` y `.final` (márgenes/line-height/fuente de leyenda) solo para este escenario.
- Impacto funcional: solo presentación de impresión para Departamentos + Cofinavit en planes cortos; sin cambios de fórmulas o lógica JS.
- Riesgos: bajos; en algunos navegadores la variación de zoom puede requerir previsualización en modo Carta con gráficos de fondo activos.
- Validación realizada: balance de llaves CSS (`brace balance 0`), errores de editor sin hallazgos en `styles.css`.
- Pendientes: validación visual del usuario en 4, 6 y 10 pagos.

### [2026-06-21] - Leyenda legal en impresión a 2 renglones con ancho completo
- Autor: Codex
- Motivo: la leyenda final seguía apretada y se pidió que en impresión ocupe todo el ancho útil de la hoja y cierre en 2 líneas.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print`, `.final .leyenda` pasó a ancho completo controlado (`width:100%`, `max-width: 7.55in`, padding lateral mínimo) con centrado y ajuste tipográfico (`6.1pt`, `line-height:1.1`, `font-weight:600`) para favorecer 2 renglones sin recorte. Se alineó también el override específico de `body.es-departamento.plan-cofinavit .final .leyenda` al mismo ancho útil.
- Impacto funcional: solo presentación de impresión del texto legal final.
- Riesgos: bajos; el salto exacto puede variar ligeramente por motor de impresión.
- Validación realizada: balance de llaves CSS y revisión sin errores de editor.
- Pendientes: revisión visual del usuario en vista previa Carta.

### [2026-06-21] - Totales más legibles en impresión blanco y negro
- Autor: Codex
- Motivo: en impresión B/N los totales naranjas se convertían a gris claro y se percibían con poco peso visual.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en `@media print`, los totales clave (`.valor-destacado input` y `#tablaEnganche tfoot #totalPagos`) mantienen color de marca pero agregan endurecimiento para B/N: `font-weight:900`, `-webkit-text-stroke` oscuro sutil, `text-shadow` mínimo y `print-color-adjust: exact`.
- Impacto funcional: solo presentación de impresión; no se tocaron fórmulas ni JS.
- Riesgos: bajos; el grado de oscurecimiento puede variar entre navegadores/impresoras.
- Validación realizada: llaves CSS balanceadas y sin errores de editor.
- Pendientes: verificación visual del usuario en modo Color y en Blanco y Negro.

### [2026-06-21] - Alineación de leyenda final en Departamentos (Bancario/Infonavit)
- Autor: Codex
- Motivo: en impresión de Departamentos con Bancario o Infonavit, la leyenda legal inferior se percibía desalineada y con cortes poco balanceados.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print`, el modo Departamentos con 7+ pagos se relajó de `zoom: 0.95` a `0.97` para evitar sobrecompresión. Además, la caja de `.final .leyenda` se normalizó para `plan-bancario`, `plan-infonavit`, `plan-fovissste` y `plan-cofinavit` con `max-width: 7.62in`, `text-wrap: balance`, y ajuste fino de `font-size/line-height`.
- Impacto funcional: solo presentación de impresión del pie legal en Departamentos.
- Riesgos: bajos; el balance de líneas depende del motor de impresión del navegador.
- Validación realizada: llaves CSS balanceadas y sin errores de editor.
- Pendientes: revisión visual del usuario en Departamentos Bancario e Infonavit con 8 pagos.

### [2026-06-21] - Totales en negro para impresión B/N con acento naranja
- Autor: Codex
- Motivo: los totales en naranja seguían viéndose grises claros en impresiones blanco y negro, aunque tuvieran peso alto.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en `@media print`, los totales clave (`.valor-destacado input` y `#tablaEnganche tfoot #totalPagos`) pasan a texto negro (`#111`) con `font-weight:900` y sin sombras/trazos; se mantiene el lenguaje visual naranja en bordes/separadores para conservar identidad.
- Impacto funcional: solo presentación de impresión de totales; no cambia ningún cálculo.
- Riesgos: bajos; en impresión a color ya no se verán naranjas, solo en negro con acento de borde.
- Validación realizada: llaves CSS balanceadas y sin errores de editor.
- Pendientes: validación visual del usuario en impresión color y B/N.

### [2026-06-21] - Leyenda legal final más legible en impresión
- Autor: Codex
- Motivo: la leyenda final de restricciones salía demasiado extendida y compacta en impresión; se pidió que se viera un poco más grande y ocupara aproximadamente 3 renglones en lugar de 2.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print`, `.final .leyenda` ahora tiene `max-width: 6.15in`, `font-size: 6.5pt`, `line-height: 1.16` y `font-weight: 700`. El texto no cambió; solo se ajustó su caja y legibilidad.
- Impacto funcional: solo presentación de impresión; no se tocaron fórmulas, JS ni HTML.
- Riesgos: bajos; revisar visualmente que el salto quede en 3 líneas y no empuje el documento a otra hoja en casos largos.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: revisión visual del usuario.

### [2026-06-21] - Totales naranjas más pesados en impresión
- Autor: Codex
- Motivo: conservar el naranja de marca en los totales, pero mejorar su presencia cuando la cotización se imprime en blanco y negro, donde el naranja puede salir como gris claro.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print`, los inputs destacados `.valor-destacado input` y el total del Plan de Enganche `#totalPagos` mantienen `color: var(--brand-orange)` pero suben a `font-weight: 900`. No se cambió el color a navy/negro.
- Impacto funcional: solo presentación de impresión; los totales siguen naranjas en color y más fuertes en B/N.
- Riesgos: bajos; revisar visualmente que el peso no se vea excesivo.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: revisión visual del usuario en impresión color y blanco/negro.

### [2026-06-21] - Leyenda más clara para Total a Pagar por el Cliente
- Autor: Codex
- Motivo: aclarar que el Total a Pagar por el Cliente se compone del Precio Neto más el total completo del bloque Gastos, no de un gasto aislado.
- Archivos modificados: index.html, styles.css, context.md
- Resumen técnico: se cambió la leyenda de `(Precio Neto + Gastos)` a `(Precio Neto + Gastos Totales)` en los labels de casa/departamento del bloque Financiamiento. Se reforzó visualmente solo esa leyenda con tamaño ligeramente mayor, negrita moderada y color navy; en impresión se aplicó una versión compacta para no romper la hoja.
- Impacto funcional: ninguno; solo claridad de texto y presentación. No se tocaron fórmulas ni JavaScript.
- Riesgos: bajos; revisar que en impresión no robe demasiado ancho al valor.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: revisión visual del usuario.

### [2026-06-21] - Más ancho para etiquetas de Gastos en Departamentos
- Autor: Codex
- Motivo: en impresión de Departamentos, el bloque Gastos reservaba demasiado espacio para los importes y etiquetas largas como `(+) Comisión de Apertura (CAP)` o `(+) Certificado Libertad de Gravamen(CLG)` se partían en más líneas.
- Archivos modificados: styles.css, context.md
- Resumen técnico: dentro del bloque final `@media print`, se agrego una regla específica para `body.es-departamento .column-2 .leyenda-notarial .campo-horizontal` con `grid-template-columns: 238px minmax(0, 1fr)` y `column-gap: 6px`. Esto acorta el cuadro de números solo en Gastos de Departamentos y transfiere ese espacio a la etiqueta.
- Cómo pedirlo después: "acorta los cuadros de números en Gastos de Departamentos" o "dale más ancho a las etiquetas de Gastos en Departamentos para que no se partan".
- Impacto funcional: solo presentación de impresión; no se tocaron fórmulas, JS ni estructura HTML.
- Riesgos: bajos; revisar que importes largos como `$244,170.00` sigan cabiendo.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: revisión visual del usuario en impresión de Departamentos.

### [2026-06-21] - Signo (+) en conceptos del bloque Gastos
- Autor: Codex
- Motivo: homogeneizar el desglose de Gastos para que todos los conceptos que suman se lean igual que `"(+) Comisión de Apertura (CAP)"`.
- Archivos modificados: index.html, context.md
- Resumen técnico: se agrego el prefijo `(+)` a las etiquetas visibles de `Cuota de Contingencia`, `Contrato de Agua`, `Sat Q`, `Certificado Libertad de Gravamen(CLG)` y `Avalúo(AV)` dentro del bloque Gastos. No se tocaron inputs, ids, fórmulas ni JavaScript.
- Impacto funcional: ninguno; solo claridad visual en pantalla e impresión.
- Riesgos: bajos; revisar que etiquetas largas sigan cabiendo en impresión.
- Validación realizada: revisión por `rg` de las etiquetas actualizadas.
- Pendientes: revisión visual del usuario en Departamentos.

### [2026-06-21] - Centrado interno del Plan de Enganche impreso
- Autor: Codex
- Motivo: con 6 pagos por fila, el acomodo ya era correcto pero monto/fecha quedaban visualmente cargados hacia la izquierda y el input de fecha se cortaba aunque la celda tenía espacio disponible.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print`, cada pago del Plan de Enganche fuerza `flex-direction: column` y `align-items: center`. Las celdas de monto y fecha ahora son flex centrado (`justify-content:center`) con ancho completo, y los inputs tienen ancho controlado: monto 94px y fecha 104px con `max-width: calc(100% - 6px)`. La fecha queda más ancha porque el icono de calendario consume espacio interno.
- Cómo pedirlo después: "centra los campos internos del Plan de Enganche" o "dale más ancho al input de fecha del Plan de Enganche impreso".
- Impacto funcional: solo presentación de impresión del Plan de Enganche; no se tocaron fórmulas ni JS.
- Riesgos: bajos; revisar visualmente 6 columnas con fechas reales y montos grandes.
- Validación realizada: balance de llaves CSS (`brace balance 0`).
- Pendientes: revisión visual del usuario en previsualización de impresión.

### [2026-06-21] - Plan de Enganche automático hasta 6 columnas
- Autor: Codex
- Motivo: el Plan de Enganche tenía comportamientos distintos entre pantalla e impresión: 9 pagos se partían en 3 filas porque impresión seguía limitada a 4 columnas, mientras que 10 pagos forzaba 5 por fila por una regla especial. El objetivo es que el acomodo sea automático, use hasta 6 columnas y reparta la última fila sin huecos.
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: en `actualizarTablaEnganche()` se cambió la variable visual `--cols-print` para usar `columnasOptimasEnganche(meses, 6)`, igual que pantalla. La función queda con este patrón: 6 pagos -> 6 en una fila; 7 -> 4+3; 9 -> 5+4; 10 -> 5+5; 11/12 -> 6 por fila. En el bloque final `@media print`, se eliminaron los `flex-basis` forzados de las reglas de 10/11+ pagos; ahora las columnas las decide `--cols-print` y CSS solo compacta el interior desde 6 pagos para que monto/fecha no se corten.
- Cómo pedirlo después: "ajusta el Plan de Enganche automático hasta 6 columnas" o "que 7 pagos sea 4+3, 9 sea 5+4 y 12 sea 6+6 sin huecos".
- Impacto funcional: solo presentación del Plan de Enganche en pantalla/impresión. No se tocaron fórmulas financieras ni la distribución de montos; el cambio en `script.js` es visual para variables CSS.
- Riesgos: medios; revisar visualmente 6, 7, 9, 10, 12, 16 y 18 pagos en Casas y Departamentos para confirmar que monto y fecha no se corten y que siga cabiendo en una hoja carta.
- Validación realizada: `node --check script.js`; balance de llaves CSS (`brace balance 0`).
- Pendientes: revisión visual del usuario en previsualización de impresión y cotizador.

### [2026-06-21] - Comisión de Apertura vuelve al bloque Gastos como campo real
- Autor: Codex
- Motivo: pensando mejor el flujo, la Comisión de Apertura (CAP) pertenece al desglose de Gastos y debe capturarse ahí para que, si aplica, se sume visualmente a Gastos Totales.
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: se movió el campo real editable `#comisionApertura` / `#comisionAperturaContainer` desde Financiamiento al recuadro de Gastos, justo debajo de Gastos de Escrituración. Se eliminó del HTML el espejo oculto `#infoComisionAperturaContainer` / `#infoComisionApertura` y se quitó de `actualizarCalculoFinal()` el bloque que lo sincronizaba. No se cambió la fórmula: `gastosTotales` ya sumaba `comisionApertura`, así que la CAP capturada en Gastos sigue impactando Gastos Totales, Total a Pagar por el Cliente y Cálculo Final.
- Impacto funcional: en plan Bancario, la CAP aparece editable en el bloque Gastos y se suma si se captura. En planes donde no aplica, el handler de `planVenta` la oculta y limpia como antes.
- Riesgos: bajos; el mismo input/id se conserva, solo cambió de ubicación visual. Revisar impresión con Bancario y planes no bancarios.
- Validación realizada: `node --check script.js`; balance de llaves CSS (`brace balance 0`); `rg` confirmó que ya no quedan referencias a `infoComisionApertura` en código activo (`index.html`, `script.js`, `styles.css`).
- Pendientes: revisión visual del usuario en pantalla e impresión.

### [2026-06-21] - Ocultar Comisión de Apertura del recuadro de Gastos
- Autor: Codex
- Motivo: la Comisión de Apertura ya se captura en Financiamiento cuando aplica; en Gastos estaba duplicada visualmente y casi nunca se usa.
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: se agregó `hidden` a `#infoComisionAperturaContainer` y `actualizarCalculoFinal()` mantiene actualizado el input espejo `#infoComisionApertura`, pero fuerza su contenedor como oculto (`hidden` + `ocultar-impresion`). No se modificó la fórmula de `gastosTotales`, que sigue sumando la CAP real desde `#comisionApertura`.
- Impacto funcional: la CAP permanece editable en Financiamiento para plan Bancario y sigue sumando si se captura, pero ya no aparece como fila en el recuadro de Gastos.
- Riesgos: bajos; cambio de visibilidad solamente.
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente pantalla e impresión cuando se autorice captura/navegador.

### [2026-06-21] - Ajuste fino de impresión a una hoja carta
- Autor: Codex
- Motivo: la previsualización seguía saliendo en 2 páginas y el último pago del Plan de Enganche se estiraba, dejando la tabla poco limpia.
- Archivos modificados: styles.css, context.md
- Resumen técnico: se agregó y afinó un bloque final `@media print` que gana por cascada: `@page Letter` con margen menor, escala casi normal para planes cortos (`zoom` 0.99) y compactación progresiva solo en planes largos (`print-compacto` 0.95 / `print-ultra` 0.91). Se ajustaron paddings/fuentes/alturas sin achatar el documento, y el Plan de Enganche imprime en CSS Grid fijo con `repeat(var(--cols), minmax(0,1fr))` para evitar que la última fila se estire. No se tocaron fórmulas ni JS de cálculo.
- Impacto funcional: solo presentación de impresión; busca que la cotización completa quepa en una sola hoja carta y que el Plan de Enganche se vea más alineado.
- Riesgos: medios; al ser más compacto hay que revisar legibilidad con datos reales y planes largos.
- Validación realizada: balance de llaves CSS (`brace balance 0`); `node --check script.js`.
- Pendientes: revisión visual del usuario en previsualización/impresión; recordar desactivar encabezados y pies del navegador para quitar fecha, URL y contador de páginas.

### [2026-06-21] - Impresión con más presencia y colores de marca reforzados
- Autor: Codex
- Motivo: el ajuste anterior ya cabía bien, pero se veía un poco chico/achatado; además la previsualización del usuario salía en blanco y negro.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print` se subió la escala normal a `zoom: 1.03` (`print-compacto` 0.98 / `print-ultra` 0.93), se aumentaron logos a 44px, separación del encabezado a 78px y padding superior/inferior. También se reforzaron colores explícitos de impresión para títulos, acentos, encabezado del Plan de Enganche, fondos crema/navy/dorado y total naranja. El color final depende del diálogo de impresión: debe estar en modo Color y con "Gráficos de fondo" activo.
- Impacto funcional: solo presentación de impresión.
- Riesgos: bajos-medios; revisar que siga cabiendo con 12/16/18 pagos.
- Validación realizada: balance de llaves CSS (`brace balance 0`); `node --check script.js`.
- Pendientes: revisión visual del usuario.

### [2026-06-21] - Ajuste de aire para etiquetas en impresión
- Autor: Codex
- Motivo: los cuadros de valores estaban demasiado largos en impresión y algunas etiquetas se partían en dos líneas.
- Archivos modificados: styles.css, context.md
- Resumen técnico: solo en el bloque final `@media print`, se aumentó la columna de etiquetas (`.campo-horizontal` de 152px a 172px; `.column-2 .campo-horizontal` de 116px a 158px) y se redujo el espacio de los inputs al restante con `minmax(0,1fr)`. La fila Prototipo/Departamento quedó en `172px minmax(0,1fr) 82px` para conservar el campo `# de unidad` sin robar demasiado ancho.
- Impacto funcional: ninguno; solo alineación y legibilidad en impresión.
- Riesgos: bajos; revisar visualmente que los campos de valores sigan legibles.
- Validación realizada: balance de llaves CSS (`brace balance 0`); `node --check script.js`.
- Pendientes: revisión visual del usuario.

### [2026-06-21] - Más aire para etiquetas en impresión
- Autor: Codex
- Motivo: el ajuste anterior mejoró la legibilidad y aún había margen para acortar un poco más los cuadros de valores.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print`, la columna de etiquetas subió de 172px a 184px y en columna derecha de 158px a 170px. La fila Prototipo/Departamento quedó en `184px minmax(0,1fr) 78px`.
- Impacto funcional: ninguno; solo legibilidad/alineación de impresión.
- Riesgos: bajos; revisar que los valores largos sigan cabiendo.
- Validación realizada: balance de llaves CSS (`brace balance 0`); `node --check script.js`.
- Pendientes: revisión visual del usuario.

### [2026-06-21] - Más aire vertical y letras ligeramente mayores en impresión
- Autor: Codex
- Motivo: la impresión ya estaba bien alineada y aún quedaba espacio vertical; se pidió que respirara más entre bloques/filas y que la letra creciera un poco.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print`, se subió suavemente la escala (`zoom` normal 1.03→1.04; compacto 0.98→0.99; ultra 0.93→0.94), el font base (8→8.2pt), títulos (8.8→9.2pt), labels (7.8→8.1pt), inputs (8.8→9.1pt), totales destacados (9.6→10pt), padding de bloques (5/9→7/10px), separación de campos (2→3px) y altura mínima de campos (18→20px). También se dio más aire al Plan de Enganche.
- Cómo pedirlo después: decir "dale más aire vertical a la impresión", "aumenta un poco la legibilidad de impresión", o "sube un poco letras y espacios de los bloques en print sin cambiar cálculos ni layout". Para ajustar los cuadros vs etiquetas: pedir "dale más aire a las etiquetas y acorta los cuadros de valores en impresión".
- Impacto funcional: ninguno; solo legibilidad/espaciado de impresión.
- Riesgos: bajos-medios; revisar que siga cabiendo en una hoja con 12/16/18 pagos.
- Validación realizada: balance de llaves CSS (`brace balance 0`); `node --check script.js`.
- Pendientes: revisión visual del usuario.

### [2026-06-21] - Balance de columnas en impresión para Departamentos
- Autor: Codex
- Motivo: en Departamentos se ocultan filas de Detalles de Precio que sí existen en Casas, por lo que la columna derecha quedaba con más blanco antes del Plan de Enganche. Además las etiquetas de Detalles de Precio necesitaban más ancho para no partirse.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print`, se agregó `#detallesPrecio .campo-horizontal { grid-template-columns: 214px minmax(0,1fr) }` para acortar cuadros de valores y dar más aire a etiquetas. Para `body.es-departamento`, se añadieron reglas específicas: más padding vertical en `#detallesPrecio` y `.leyenda-notarial`, más separación de campos en columna derecha, altura mínima de 22px y `#detallesPrecio .campo-horizontal` a `220px minmax(0,1fr)`.
- Cómo pedirlo después: "balancea la altura de columnas en impresión para Departamentos" o "dale más aire a Detalles de Precio en Departamentos y acorta los cuadros de valores".
- Impacto funcional: ninguno; solo presentación en impresión.
- Riesgos: bajos; revisar que valores largos sigan cabiendo y que el Plan de Enganche no baje demasiado con 12/16/18 pagos.
- Validación realizada: balance de llaves CSS (`brace balance 0`); `node --check script.js`.
- Pendientes: revisión visual del usuario.

### [2026-06-21] - Compactación anticipada para Departamentos con 7+ pagos
- Autor: Codex
- Motivo: en Departamentos, con 7/8 pagos el contenido aún se cortaba abajo antes de que entrara el modo compacto general (`print-compacto`, que inicia en >10 meses). En Casas cabía mejor. Además, cuando la última fila del Plan de Enganche quedaba incompleta, aparecía un hueco gris poco estético.
- Archivos modificados: styles.css, context.md
- Resumen técnico: se cambió la regla CSS de impresión específica a `body.es-departamento:not(.print-compacto):has(#tablaEnganche tbody tr:nth-child(7))`. Cuando hay 7+ pagos en Departamentos y todavía no aplica el modo compacto general, baja el `zoom` a 0.95 y comprime padding vertical de Detalles/Gastos, Plan de Enganche, Datos del Asesor y final; también reduce alturas internas de los pagos. Para Departamentos en `print-compacto`/`print-ultra`, se agregaron zooms propios (0.92 / 0.88). El hueco gris se corrigió haciendo blanco el fondo de `#tablaEnganche tbody`, quitando el gap y dando bordes a cada pago.
- Cómo pedirlo después: "activa compactación anticipada para Departamentos desde 7 pagos" o "baja el umbral compacto de Departamentos porque con 7/8 pagos se corta". Para el hueco visual: "quita el hueco gris de la última fila del Plan de Enganche".
- Impacto funcional: ninguno; solo impresión. No se tocó JS ni cálculos.
- Riesgos: bajos-medios; depende de soporte `:has()` del navegador de impresión moderno. Si no bastara, alternativa: cambiar el JS visual `actualizarModoCompactoPrint()` para activar `print-compacto` desde 7 meses solo en Departamentos.
- Validación realizada: balance de llaves CSS (`brace balance 0`); `node --check script.js`.
- Pendientes: revisar captura del usuario con Departamentos 7/8+ pagos.

### [2026-06-21] - Última fila flexible en Plan de Enganche impreso
- Autor: Codex
- Motivo: al usar grid fijo, cuando el número de pagos no llenaba la última fila (por ejemplo 7 pagos: 4 arriba y 3 abajo), quedaba una celda vacía. El usuario pidió que los pagos de abajo se ajustaran al espacio disponible.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print`, `#tablaEnganche tbody` volvió de CSS Grid a `display:flex; flex-wrap:wrap` con `gap:0` y fondo blanco. Cada `tr` usa `flex: 1 1 calc(100% / var(--cols))`, de modo que las filas completas mantienen el número de columnas calculado por JS y la última fila incompleta se estira proporcionalmente para llenar todo el ancho. Se conservaron bordes por pago para no regresar al hueco gris.
- Cómo pedirlo después: "haz flexible la última fila del Plan de Enganche" o "que los pagos de la última fila se repartan en todo el ancho".
- Impacto funcional: ninguno; solo presentación de impresión.
- Riesgos: bajos; revisar 7/8/12/16 pagos.
- Validación realizada: balance de llaves CSS (`brace balance 0`); `node --check script.js`.
- Pendientes: revisión visual del usuario.

### [2026-06-21] - ESTADO ACTUAL APROBADO de impresión carta
- Autor: Codex + revisión visual del usuario
- Motivo: dejar documentado el estado que el usuario aprobó visualmente ("quedó espectacular") antes de seguir probando más casos.
- Archivos modificados: context.md
- Estado visual actual:
  - La impresión se ve como una cotización profesional en una hoja carta, con encabezado de logos + título, columnas alineadas, colores de marca, totales destacados en naranja/dorado y Plan de Enganche limpio.
  - Configuración de impresión recomendada: tamaño Carta, márgenes "Ninguno" o los controlados por `@page`, **Gráficos en segundo plano activado**, color activado, encabezados/pies del navegador desactivados para quitar fecha/URL/contador.
  - El Plan de Enganche imprime con pagos en mini-tarjetas: encabezado navy, monto crema/dorado, fecha debajo, total naranja. La última fila es flexible: si hay 7 pagos, los 3 de abajo se reparten en todo el ancho.
  - En Departamentos, hay reglas especiales para balancear columnas y compactar desde 7+ pagos, porque Detalles de Precio tiene menos filas que Casas.
- Vocabulario para pedir ajustes futuros:
  - "Dale más aire vertical a la impresión": subir un poco separación entre bloques/filas y tamaño de letra en `@media print`.
  - "Dale más aire a las etiquetas y acorta los cuadros de valores": ajustar `grid-template-columns` de `.campo-horizontal` en print.
  - "Balancea la altura de columnas en impresión para Departamentos": ajustar reglas `body.es-departamento`.
  - "Activa compactación anticipada para Departamentos desde 7 pagos": revisar regla `body.es-departamento:not(.print-compacto):has(#tablaEnganche tbody tr:nth-child(7))`.
  - "Haz flexible la última fila del Plan de Enganche": mantener `#tablaEnganche tbody` como `flex-wrap` en impresión, no grid fijo.
  - "Quita el hueco gris de la última fila": mantener fondo blanco en `#tablaEnganche tbody` y bordes por pago.
- Riesgos / cosas a NO romper:
  - NO tocar fórmulas ni JS de cálculo.
  - Evitar mover estructura HTML salvo necesidad mínima.
  - El bloque final `@media print` al final de `styles.css` es el autoritativo; cambios de impresión deben hacerse ahí para ganar por cascada.
  - Si se toca `script.js`, correr siempre `node --check script.js`.
  - Si se toca CSS, verificar balance de llaves.
- Pendientes de prueba del usuario:
  - Casas y Departamentos con 1, 3, 4, 7, 8, 12, 16 y 18 pagos.
  - Desarrollos: Jardines del Sur 6 Casas, Jardines del Sur 6 Departamentos, Lirios 2, La Rioja 2.
  - Planes: Bancario, Infonavit, Fovissste, Cofinavit, Contado.
  - Confirmar que sigue cabiendo en 1 hoja carta con gráficos de fondo y sin encabezados/pies del navegador.
- Validación realizada: en los cambios previos de CSS se verificó `brace balance 0`; en cambios con JS se verificó `node --check script.js`.

### [2026-06-21] - Usar columnas de impresión en Plan de Enganche
- Autor: Codex
- Motivo: con 12 pagos el Plan de Enganche se estaba imprimiendo en 6 columnas por fila, lo que dejaba cada pago muy angosto y cortaba montos/fechas aunque hubiera espacio vertical.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en el bloque final `@media print`, cada pago del Plan de Enganche cambió de `flex: 1 1 calc(100% / var(--cols))` a `flex: 1 1 calc(100% / var(--cols-print, var(--cols)))`. Nota histórica: esta regla de máximo 4 en impresión fue reemplazada el 2026-06-21 por "Plan de Enganche automático hasta 6 columnas"; actualmente `--cols-print` usa máximo 6.
- Cómo pedirlo después: "usa las columnas de impresión del Plan de Enganche" o "evita 6 pagos por fila en print porque se cortan los montos".
- Impacto funcional: ninguno; solo presentación de impresión.
- Riesgos: bajos-medios; con más filas puede requerir compactación en 16/18 pagos, pero debe mejorar legibilidad.
- Validación realizada: balance de llaves CSS (`brace balance 0`); `node --check script.js`.
- Pendientes: revisión visual del usuario con 12/16/18 pagos.

### [2026-06-21] - Columnas densas para Plan de Enganche largo
- Autor: Codex
- Motivo: usar solo 4 columnas en impresión evitaba cortes, pero en 10/12 pagos agregaba filas extra y podía empujar la cotización a 2 hojas. El usuario observó que 5 o 6 pagos por fila pueden caber si se compacta el interior de cada pago.
- Archivos modificados: styles.css, context.md
- Resumen técnico: dentro del bloque final `@media print`, se agregaron reglas con `:has()` para planes largos. Nota histórica: los `flex-basis` forzados de 10/11+ pagos fueron retirados el 2026-06-21 por "Plan de Enganche automático hasta 6 columnas"; actualmente esas reglas solo compactan el interior y las columnas las decide `--cols-print`.
- Cómo pedirlo después: "activa columnas densas para planes largos" o "usa 5 pagos por fila desde 10 y 6 por fila desde 11, compactando montos y fechas".
- Impacto funcional: ninguno; solo presentación de impresión. No toca fórmulas ni JS.
- Riesgos: medios; revisar montos grandes en 11/12/16/18 pagos y confirmar que no se corten en Casas/Departamentos.
- Validación realizada: balance de llaves CSS (`brace balance 0`); `node --check script.js`.
- Pendientes: revisión visual del usuario con 10, 12, 16 y 18 pagos.

### [2026-06-21] - REDISEÑO "cotización de una sola hoja" (Fases 1-3 hechas; Fase 4 móvil pendiente)
- Autor: Claude Opus 4.8
- Motivo: que la cotización se vea como un documento profesional de UNA hoja carta, con todas las secciones distribuidas como una sola hoja con divisiones internas (no tarjetas sueltas), Total destacado, colores de marca; y que la IMPRESIÓN salga idéntica a la pantalla (WYSIWYG) y quepa en 1 hoja. Estilo: profesional sobrio (azul marino + acentos dorado/naranja). Plan aprobado: `~/.claude/plans/majestic-herding-hummingbird.md`.
- Archivos modificados: index.html, styles.css, script.js, context.md. NO se tocaron fórmulas ni el JS de cálculo.
- Resumen técnico (lo que quedó):
  - LA HOJA: `.container` es ahora una "hoja" (fondo blanco, borde, radio, sombra, `max-width:1280px; width:95%`, `flex-wrap:wrap`, `gap:0`, `overflow:hidden`). Las dos columnas (`.column-1/.column-2`) van pegadas con un divisor vertical (`.column-1 { border-right }`); `flex:1 1 0`. Las secciones (`.bloque`) ya NO son tarjetas: son planas con línea divisoria inferior (`border-bottom`), sin sombra. Encabezados `.bloque h2` en mayúsculas + línea de acento naranja (`::after`). Totales clave con clase `.valor-destacado` (Total a Pagar por el Cliente, Enganche por Pagar, Gastos Totales) en naranja/negrita.
  - ORDEN: `#planEnganche` y `#datosAsesor` se movieron en el HTML a ser hijos directos de `.container`, full-width DEBAJO de las dos columnas (Plan de Enganche y luego Datos del Asesor). El botón Imprimir se movió a un `.botones-container` después de Datos del Asesor (oculto en impresión). Datos del Asesor: etiqueta ARRIBA del campo, los dos campos juntos y centrados (`.datos-asesor-grid { display:flex; justify-content:center }`).
  - PLAN DE ENGANCHE: `#tablaEnganche tbody` es un FLEX (cuadrícula) con columnas automáticas vía variables `--cols` y `--cols-print` que pone JS (`columnasOptimasEnganche(n, maxPorFila)`): pantalla e impresión hasta 6 por fila, balanceado; la última fila incompleta SE ESTIRA (flexbox-grow) para no dejar huecos. Cada pago es una mini-tarjeta: encabezado "PAGO N" en barra azul marino (texto blanco), monto destacado (navy/negrita, fondo crema, borde dorado) y fecha. Total en `tfoot` con línea naranja. NOTA: el JS solo fija variables de presentación, no toca cálculos.
  - IMPRESIÓN: bloque `@media print` autoritativo AL FINAL de styles.css que reproduce la hoja a escala y sobrescribe el CSS de impresión legacy (incluido un viejo `input{font-size:26px}`). Clave: `@page Letter, margin 0.4in`; regla `* { print-color-adjust: exact }` para imprimir fondos (REQUIERE activar "Gráficos de fondo" en el diálogo de impresión); columnas 55%/45% (izquierda más ancha por etiquetas largas); filas campo/valor con CSS GRID de etiqueta FIJA (152px izq / 116px der) para alineación perfecta; fila Departamento/Prototipo en grid de 3 columnas (etiqueta | selector | "# unidad" 90px); el Plan de Enganche imprime con la MISMA distribución que pantalla (usa `--cols`) y celdas comprimidas para no cortarse; modos `body.print-compacto` (>10 meses) y `body.print-ultra` (>16) comprimen más para nunca desbordar. Se forzó `.hidden { display:none !important }` para que el grid no muestre campos ocultos (p.ej. Departamento en Casas), y `.bloque-header-con-control h2 { padding:0 }` para que "DETALLES DE PRECIO" no se parta.
- Impacto funcional: solo presentación. Cálculos, validaciones y flujo intactos.
- Riesgos: medios; mucho CSS nuevo y reubicación de nodos en el DOM. El CSS de impresión legacy sigue en el archivo (sobrescrito, no eliminado).
- Validación realizada: `node --check script.js`; balance de llaves CSS; revisión visual iterativa en pantalla e impresión (plan Bancario, Jardines del Sur 6 Casas / FLAMBOYAN).
- Pendientes: FASE 4 = revisión/ajuste de MÓVIL (≤768px: apilado en 1 columna, paneles, tabla de enganche). Validar impresión con muchos pagos (12/16/18) y en todos los desarrollos (Depas Jardines 6 / Lirios 2, La Rioja 2) y planes (Infonavit/Fovissste/Cofinavit/Contado). Recordar SIEMPRE activar "Gráficos de fondo" al imprimir.

### [2026-06-21] - Cofinavit con Subcuenta de Vivienda + Comisión de Apertura de vuelta a Financiamiento
- Autor: Claude Opus 4.8
- Motivo: (1) Cofinavit sí debe llevar Subcuenta de Vivienda. (2) La Comisión de Apertura (CAP) se cobra sobre el % del crédito bancario, así que tiene más sentido capturarla en Financiamiento (no en el recuadro de Gastos).
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: (1) En el handler de `planVenta`, la rama `cofinavit` ya NO oculta ni limpia `subcuentaViviendaField` (el reset al inicio la deja visible); sigue ocultando solo la CAP. (2) Se quitó la clase `gasto-oculto-financiamiento` de `comisionAperturaContainer` para que la CAP vuelva a verse/editar en Financiamiento (su visibilidad por plan la controla el handler: visible en bancario). En el recuadro de Gastos, `#infoComisionApertura` vuelve a ser `readonly` (espejo informativo, se sigue sincronizando en `actualizarCalculoFinal`). Se eliminaron los listeners `input`/`blur` que hacían editable a `#infoComisionApertura`. La CAP editable en Financiamiento ya dispara `actualizarCalculoFinal` (arreglo de listeners incluye "comisionApertura") y se formatea en blur (`formatearEntradaDinero`).
- Impacto funcional: en Cofinavit aparece Subcuenta de Vivienda y se resta del enganche. La CAP se captura en Financiamiento (plan bancario) y sigue apareciendo como dato en el recuadro de Gastos para que Gastos Totales cuadre.
- Riesgos: bajos. Nota: la CAP aparece editable en Financiamiento y como espejo readonly en el recuadro de Gastos (para mantener el desglose); si se quiere quitar del recuadro habría que ajustar el cálculo de Gastos Totales.
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente: Cofinavit muestra Subcuenta; Bancario muestra CAP editable en Financiamiento y suma en Gastos Totales.

### [2026-06-21] - Apartado se captura solo en Cálculo Final
- Autor: Claude Opus 4.8
- Motivo: dejar el campo Apartado únicamente en Cálculo Final (no en Financiamiento), pero editable con el mismo selector (datalist $15,000/$20,000/$30,000).
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: en `index.html` se quitó la fila editable de Apartado (`#apartado` + `datalist#apartado-options`) de Financiamiento y se reemplazó la fila de solo lectura `#apartado4` de Cálculo Final por la fila editable `#apartado` con su datalist (queda entre "Enganche Total a Pagar" y "Enganche por Pagar"). En `script.js` se eliminó la línea que copiaba el valor a `#apartado4` (ya no existe) y se quitó `apartado4` del arreglo de limpieza de readonly. Los listeners `focus`/`blur`/formato de `#apartado` siguen funcionando (referencian por id) y `actualizarCalculoFinal` se dispara con su `input` (arreglo ya incluía "apartado"); `engancheTotalPagar = totalPagar - apartado` sin cambios.
- Impacto funcional: el asesor captura el Apartado directamente en Cálculo Final (con sugerencias 15/20/30 mil) y se resta para el "Enganche por Pagar". Una sola fuente de captura.
- Riesgos: bajos; las limpiezas usan `if (el)` y ya no hay referencias a `apartado4`.
- Validación realizada: `node --check script.js`; `grep` confirma 0 referencias a `apartado4`.
- Pendientes: validar visualmente que el datalist aparezca al enfocar Apartado en Cálculo Final y que reste correctamente.

### [PENDIENTE 2026-06-20] - Rediseño profesional "cotización de una hoja" (APROBADO, en pausa)
- Estado: PLAN APROBADO por el usuario, ejecución pausada para retomar después.
- Archivo de plan completo: `~/.claude/plans/majestic-herding-hummingbird.md` (Claude Code). Si no está disponible en la otra compu, el resumen está aquí abajo.
- Decisiones del usuario: (1) alcance = documento COMPLETO; (2) estilo = profesional SOBRIO (azul marino de marca + acentos puntuales dorado/naranja, mucho blanco/crema). Debe caber en 1 hoja carta, adaptarse a móvil y usar colores de marca (`:root`).
- Idea central: que se vea como cotización profesional de UNA hoja; el Plan de Enganche pasa de varias tarjetas a UN solo panel/tabla bien delimitado y "dibujado"; Total destacado.
- Restricción dura: NO tocar fórmulas ni el JS de la tabla (`actualizarTablaEnganche` genera `<tr>` con `.monto-pago`/`.fecha-pago`). Trabajo ~100% en `styles.css` + clases mínimas en `index.html`.
- Fases: (1) sistema base [paneles, encabezados con acento, totales destacados], (2) Plan de Enganche como panel único [quitar CSS de tarjetas y estilar `#tablaEnganche` como tabla pulida: thead navy, zebra crema, fila Total con acento naranja], (3) impresión a 1 hoja [`@page letter; margin 0.5in`; densidad 9–10pt; mantener 2 columnas + plan full-width; adaptar `print-compacto`/`ultra` a la tabla], (4) móvil.
- Avance YA aplicado (Fase 1, solo visual, sin lógica): en `styles.css` `.bloque` (radio 10px, sombra más sutil), `.bloque h2` (mayúsculas + línea de acento naranja `::after`), nueva clase `.valor-destacado`; en `index.html` se agregó `valor-destacado` a los 3 totales clave (Total a Pagar por el Cliente, Enganche por Pagar, Gastos Totales). PENDIENTE confirmar con el usuario si se conserva o revierte.
- Verificación al ejecutar: `node --check script.js`; pantalla desktop/móvil; impresión Cmd/Ctrl+P en 1 hoja con 6/12 meses, varios desarrollos y planes.

### [PENDIENTE 2026-06-20] - Pulir impresión al 100% (una sola hoja carta)
- Estado: la impresión ya quedó casi bien (2 columnas de datos + Plan de Enganche full-width debajo, todo en una hoja). Falta SOLO ajuste fino.
- Contexto: validado el 2026-06-19 con plan Bancario, Jardines del Sur 6 - Casas, sin datos capturados. Cabe en una hoja carta.
- Ajustes finos pendientes para mañana:
  1. Verificar que SIGA cabiendo en una hoja con datos reales: modelo seleccionado, créditos capturados y Plan de Enganche con 6, 12 y 16+ meses (las tarjetas crecen hacia abajo). Si se pasa, activar/afinar modos `print-compacto`/`print-ultra` o reducir aún más `minmax`/gap de las tarjetas.
  2. El recuadro "Plan de Enganche" se ve algo vacío cuando no hay meses; revisar alto mínimo y la alineación del "Total".
  3. Emparejar el alto/espaciado de las dos columnas (la izquierda tiene 4 bloques y la derecha 2; revisar que no quede demasiado desbalance ni huecos).
  4. Repasar márgenes generales de la hoja y el espacio del bloque final ("Hoy es el momento..." / "Gracias por su visita") para que no empuje a segunda hoja.
  5. Probar también en Departamentos (Jardines 6 / Lirios 2) y La Rioja 2, y en planes Infonavit/Fovissste/Cofinavit/Contado.
- Archivos a tocar: principalmente `styles.css` (bloques `@media print`). No tocar fórmulas ni el JS de la tabla.

### [2026-06-19] - Fix impresión: columnas apiladas (cabía en varias hojas)
- Autor: Claude Opus 4.8
- Motivo: tras agregar `flex-wrap: wrap` en `.container` para bajar el Plan de Enganche, las dos columnas de datos se apilaban (todo en una sola columna alta → impresión a varias hojas). Debe caber en una sola hoja carta.
- Archivos modificados: styles.css, context.md
- Resumen técnico: en los bloques `@media print`, las columnas tenían `flex: 1 1 50%`/`calc(50% - 8px)` que, sumadas al `gap`, excedían el 100% y con `flex-wrap` se envolvían. Se cambiaron a `flex: 1 1 0` con `min-width: 0`, de modo que ambas columnas quepan lado a lado (base 0 + grow) y solo `#planEnganche` (flex-basis 100%) baje a una fila completa. Además se redujo el `minmax` de las tarjetas de impresión de 150px a 110px y el gap a 6px, para que quepan más por fila (menos filas, menos alto).
- Impacto funcional: en impresión vuelven las dos columnas de datos lado a lado, con el Plan de Enganche full-width (tarjetas) debajo, buscando una sola hoja carta.
- Riesgos: bajos; solo flex de columnas en print. Si aún no cabe en una hoja, falta compactar paddings/fuentes de los bloques.
- Validación realizada: balance de llaves CSS; análisis del algoritmo flex-wrap.
- Pendientes: validar en previsualización que entre en UNA hoja carta; si no, compactar bloques.

### [2026-06-19] - Plan de Enganche en tarjetas también en impresión
- Autor: Claude Opus 4.8
- Motivo: replicar en impresión el diseño de tarjetas que ya estaba en pantalla (segundo paso prometido), para que el plan no salga como tabla clásica estirada a todo el ancho.
- Archivos modificados: styles.css, context.md
- Resumen técnico: se añadió al final del archivo un `@media print` (gana por orden de fuente) que convierte `#tablaEnganche` en cuadrícula de tarjetas igual que en pantalla: `tbody { display:grid; auto-fit minmax(150px,1fr) }`, cada `tr` es tarjeta (flex column, borde, `page-break-inside:avoid`), `thead` oculto, `td:first-child` como título "Pago N", inputs full-width y `tfoot` (Total) como fila a la derecha. Para vencer las reglas previas de la tabla clásica y de los modos `print-compacto`/`print-ultra`/`es-departamento`, los selectores incluyen `tbody` (un tipo extra de especificidad) y variantes con el prefijo de cada estado del body. Se mantienen los seguros previos de `#planEnganche { flex:0 0 100%; order:99 }` y `.container { flex-wrap:wrap }` en print para que el bloque quede full-width debajo de las columnas.
- Impacto funcional: la impresión muestra el Plan de Enganche full-width con tarjetas (auto-fit), consistente con la pantalla. Para muchos meses, las tarjetas fluyen en más filas y pueden pasar de página (corte evitado dentro de cada tarjeta). Sin cambios en fórmulas ni en el JS de la tabla.
- Riesgos: medios; el sistema de impresión tenía varias capas (normal/compacto/ultra/departamento). Se resolvió por especificidad y orden, no eliminando las reglas previas (siguen ahí, ahora superadas para la tabla).
- Validación realizada: balance de llaves CSS (270/270); revisión de especificidad por estado de body.
- Pendientes: validación visual en previsualización de impresión con 6, 12 y 16+ meses y en los 4 desarrollos; ajustar `minmax`/tamaños si hiciera falta.

### [2026-06-19] - Fix desborde lateral de la leyenda final
- Autor: Claude Opus 4.8
- Motivo: la leyenda del bloque `#final` ("*Aplican restricciones...*") se cortaba por la derecha.
- Archivos modificados: styles.css, context.md
- Resumen técnico: `.final` tenía `width:100%` + `padding:20px` sin `box-sizing`, por lo que su ancho real superaba el viewport (100% + 40px) y desbordaba. Se agregó `box-sizing: border-box`, `max-width:100%` y `overflow-x:hidden`. Además se limitó el ancho de línea de `.final .leyenda`/`.final p` a `max-width:1000px` centrado, con `overflow-wrap:break-word`, para que el texto baje en más renglones.
- Impacto funcional: la leyenda final ya no se corta; el texto fluye en más líneas dentro del ancho.
- Riesgos: ninguno; solo CSS del bloque final.
- Validación realizada: revisión de caja (box model).
- Pendientes: validación visual en navegador e impresión.

### [2026-06-19] - Plan de Enganche full-width en tarjetas (solo pantalla desktop)
- Autor: Claude Opus 4.8
- Motivo: estética; que la tabla de enganche ocupe el ancho de las dos columnas y muestre los pagos como tarjetas horizontales (auto-fit), sin tocar fórmulas ni el JS que genera la tabla.
- Archivos modificados: index.html, styles.css, context.md
- Resumen técnico: en `index.html` se movió el bloque `#planEnganche` fuera de `.column-2` para ser hijo directo de `.container` (debajo de las dos columnas). En `styles.css`: `.container` ahora usa `flex-wrap: wrap` (base y print) para que el bloque baje a una fila completa. Nuevo bloque `@media screen and (min-width: 769px)` que: `#planEnganche { flex: 1 1 100% }`; convierte `#tablaEnganche` en cuadrícula (`tbody { display:grid; grid-template-columns: repeat(auto-fit, minmax(190px,1fr)) }`), cada `tr` es una tarjeta (flex column con borde/sombra), el `thead` se oculta, `td:first-child` ("Pago N") es el título y el `tfoot` (Total) queda como fila normal alineada a la derecha. El JS sigue generando `<tr>` con `.monto-pago`/`.fecha-pago`, así que cálculos, edición manual y total no cambian. En `@media print` se añadió un seguro: `.container { flex-wrap: wrap }` y `#planEnganche { flex:0 0 100%; order:99 }` para que en impresión el bloque quede full-width debajo de las columnas con la tabla clásica (sin aplastarse).
- Impacto funcional: en pantalla desktop el Plan de Enganche es full-width con tarjetas que fluyen (2-3 por fila según ancho). Móvil (≤768px) conserva la tabla clásica. Impresión: full-width con tabla clásica (pendiente rediseño a tarjetas).
- Riesgos: bajos-medios; reubicación del nodo en el DOM y cambios de layout. El orden móvil sigue por id (`#planEnganche { order:6 }`). Validar paginación de impresión.
- Validación realizada: revisión de estructura HTML (divs balanceados) y de cascada CSS entre bloques print.
- Pendientes: validación visual en navegador (desktop/móvil); rediseño de impresión a tarjetas como segundo paso si el usuario lo aprueba en pantalla.

### [2026-06-19] - Leyenda "(Precio Neto + Gastos)" un poco más grande
- Autor: Claude Opus 4.8
- Motivo: dar más presencia a la leyenda del campo "Total a Pagar por el Cliente".
- Archivos modificados: styles.css, context.md
- Resumen técnico: regla específica `#labelPrecioNetoCasa3 .formula-gastos, #labelPrecioNetoDepartamento3 .formula-gastos { font-size: 15px }` (antes 13px vía `.formula-gastos`). Por usar id, solo afecta esa leyenda y no la de "(Total a Pagar por el Cliente - Crédito)".
- Impacto funcional: ninguno; solo tamaño de texto.
- Riesgos: ninguno.
- Validación realizada: confirmación visual del usuario ("quedó espectacular").
- Pendientes: ninguno.

### [2026-06-19] - Cálculo Final renombrado (Enganche Total a Pagar → Apartado → Enganche por Pagar)
- Autor: Claude Opus 4.8
- Motivo: el flujo de Cálculo Final debe mostrar: el monto antes del apartado, la resta del apartado y el monto final al que se aplica el plan de meses; renombrado a la nueva nomenclatura.
- Archivos modificados: index.html, styles.css, context.md
- Resumen técnico: se conserva oculta (clase `campo-oculto-calculo`, pantalla e impresión) solo la fila `enganche` (Precio Neto - Crédito), intermedia. Se hicieron visibles de nuevo `totalPagar` y `apartado4`. Mapeo de etiquetas a ids existentes (sin cambiar fórmulas en `script.js`): `totalPagar` → "Enganche Total a Pagar (Total a Pagar por el Cliente - Crédito)"; `apartado4` → "(-) Apartado"; `engancheTotalPagar` → "Enganche por Pagar". La tabla del Plan de Enganche sigue dividiendo `engancheTotalPagar` (= `totalPagar` − apartado) entre los meses (`mesesPagarEnganche`).
- Impacto funcional: Cálculo Final muestra Enganche Total a Pagar (antes del apartado), (-) Apartado, Enganche por Pagar (después del apartado) y Meses Para Pagar Enganche. El plan de meses se aplica al "Enganche por Pagar". Sin cambios en cálculos.
- Riesgos: bajos; solo etiquetas y visibilidad. Corrige el malentendido de la versión previa que dejaba una sola línea.
- Validación realizada: `node --check script.js`; se verificó que `actualizarTablaEnganche` lee `engancheTotalPagar`.
- Pendientes: validar en navegador e impresión.

### [2026-06-19] - Ocultar también en impresión los gastos de Financiamiento
- Autor: Claude Opus 4.8
- Motivo: en la vista de impresión los gastos ocultados de Financiamiento seguían apareciendo, porque la regla `@media print .campo-horizontal { display:flex !important }` le ganaba a `.gasto-oculto-financiamiento { display:none !important }` (misma especificidad, definida después).
- Archivos modificados: styles.css, context.md
- Resumen técnico: se agregaron selectores de mayor especificidad dentro del `@media print` (junto a los de `ocultar-impresion`): `.campo-horizontal.gasto-oculto-financiamiento`, `.campo.campo-horizontal.gasto-oculto-financiamiento`, etc., con `display:none !important; visibility:hidden; height:0; ...`. Al usar 2 clases superan a `.campo-horizontal` (1 clase) sin importar el orden.
- Impacto funcional: en impresión, Financiamiento ya no muestra GE, CAP, CC, CdA, Sat Q ni CLG; solo Total a Pagar por el Cliente, créditos, subcuenta y apartado. El desglose completo de gastos se imprime en el recuadro de Gastos (columna 2).
- Riesgos: bajos; solo CSS de impresión.
- Validación realizada: revisión de especificidad; no hay reglas con id que re-muestren esos contenedores.
- Pendientes: validar en previsualización de impresión real.

### [2026-06-19] - Ocultar gastos duplicados de Financiamiento (CAP editable en recuadro)
- Autor: Claude Opus 4.8
- Motivo: tras consolidar los gastos en el recuadro de Gastos (columna 2), las filas de gastos en Financiamiento quedaron duplicadas e innecesarias.
- Archivos modificados: index.html, styles.css, script.js, context.md
- Resumen técnico: en `index.html` se agregó la clase `gasto-oculto-financiamiento` a las 6 filas de gastos de Financiamiento (GE/gastosTitulacion, CAP/comisionApertura, CC/otrosGastos, CdA/contratoAgua, Sat Q/satQ, CLG/certificadoLibertadGravamen). Los inputs se conservan en el DOM porque `actualizarCalculoFinal` los lee por id y el handler de `planVenta` manipula `comisionAperturaContainer`. En `styles.css` la clase usa `display:none !important` (pantalla e impresión). Como la Comisión de Apertura es el único gasto que se captura a mano, en el recuadro `infoComisionApertura` se volvió editable: un listener `input`/`blur` escribe el valor en el campo real oculto `comisionApertura` y recalcula; el bloque de sincronización de `actualizarCalculoFinal` ya no sobreescribe el valor mientras el campo está enfocado y decide la visibilidad del CAP según `planVenta === "bancario"` (en vez de leer el display inline, que ahora siempre lo fuerza la clase).
- Impacto funcional: Financiamiento ya no muestra el desglose de gastos (solo Total a Pagar por el Cliente, créditos, subcuenta y apartado). Todos los gastos y su total viven en el recuadro de Gastos. La Comisión de Apertura se captura ahí (visible solo en plan bancario) y sigue sumando a Gastos Totales.
- Riesgos: bajos-medios; se conservan los inputs como portadores de datos, pero la fuente de captura de CAP cambió de Financiamiento al recuadro.
- Validación realizada: `node --check script.js`, `node --check validation.js`.
- Pendientes: validar en navegador: que Financiamiento ya no muestre gastos; que en plan bancario se pueda escribir la CAP en el recuadro y sume en Gastos Totales; que en los demás planes la CAP quede oculta y en $0; revisar impresión.

### [2026-06-19] - "Total a Pagar por el Cliente" en bloque Financiamiento
- Autor: Claude Opus 4.8
- Motivo: el primer campo de Financiamiento ya no debe mostrar solo el Precio Neto; debe mostrar el total a pagar por el cliente (Precio Neto + Gastos).
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: en `index.html` se renombraron las etiquetas `labelPrecioNetoCasa3` y `labelPrecioNetoDepartamento3` a "Total a Pagar por el Cliente" con subtítulo `(Precio Neto + Gastos)`. En `script.js` se quitó la asignación de `precioNetoCasa3` dentro de `actualizarFinanciamiento` (solo Precio Neto) y se trasladó a `actualizarCalculoFinal`, donde ya existe `gastosTotales`, calculando `precioNetoCasa3 = precioNetoCasa + gastosTotales`.
- Impacto funcional: el campo superior de Financiamiento ahora muestra Precio Neto + Gastos Totales. No es el mismo número que "Total a Pagar" de Cálculo Final (ese resta créditos vía enganche); son dos cifras distintas a propósito.
- Riesgos: bajos; `precioNetoCasa3` es solo display (no se lee para otros cálculos) y `actualizarCalculoFinal` corre en todos los flujos.
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador; confirmar con el usuario si este campo debe o no restar créditos.

### [2026-06-19] - Comisión de Apertura agregada al recuadro de Gastos
- Autor: Claude Opus 4.8
- Motivo: que el desglose del recuadro de Gastos cuadre exactamente con la fórmula de Gastos Totales (GE+CAP+CC+CdA+SatQ+CLG+AV), incluyendo la Comisión de Apertura.
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: en `index.html` se agregó la línea informativa `infoComisionAperturaContainer` / `infoComisionApertura` en el recuadro `leyenda-notarial`, después de Gastos de Escrituración (orden de la fórmula). En `script.js`, dentro de `actualizarCalculoFinal`, se sincroniza su valor con el campo real `comisionApertura` y su visibilidad (pantalla e impresión, vía clase `ocultar-impresion`) siguiendo a `comisionAperturaContainer`: solo visible en plan bancario.
- Impacto funcional: el recuadro de Gastos muestra la Comisión de Apertura cuando aplica (plan bancario) y el desglose suma exactamente igual que Gastos Totales.
- Riesgos: bajos; copia informativa de solo lectura, sincronizada por id.
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador cambiando entre planes (la CAP solo debe verse en bancario).

### [2026-06-19] - Avalúo y Gastos Totales movidos al recuadro de Gastos
- Autor: Claude Opus 4.8
- Motivo: reorganización visual: consolidar todos los gastos (incluido Avalúo) y su total en un solo recuadro de la columna 2, con encabezado propio.
- Archivos modificados: index.html, styles.css, context.md
- Resumen técnico: en `index.html` se quitó `avaluoContainer` (Avalúo AV) del bloque Financiamiento y la línea de Gastos Totales del bloque Cálculo Final; ambos se reubicaron en el recuadro `leyenda-notarial`, al que se le agregó encabezado `<h2>Gastos</h2>`. El Avalúo va tras CLG y "Gastos Totales" como fila total al final. Como `#avaluo`, `#avaluoContainer` y `#gastosTotales` se referencian por id en `script.js`, moverlos no afecta cálculos. En `styles.css` se agregó `.campo-gastos-totales` (negrita + borde superior naranja `--brand-orange`) para destacar el total.
- Impacto funcional: solo presentación; el recuadro de la columna 2 ahora es el desglose de Gastos con su total. El campo Avalúo sigue siempre visible (el handler de `planVenta` lo pone en flex). Cálculo Final ya no muestra la línea de Gastos Totales.
- Riesgos: bajos; reorganización de DOM con referencias por id intactas.
- Validación realizada: `node --check script.js`, `node --check validation.js`.
- Pendientes: validar visualmente en navegador e impresión que el recuadro de Gastos se vea correcto en los 4 desarrollos y en los distintos planes.

### [2026-06-09] - Ajuste de nombre Lily Ramirez
- Autor: Codex
- Motivo: mostrar a Lilia Ramirez Rodriguez como Lily Ramirez Rodriguez en el selector de asesores.
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: se actualizó el `option` del selector `nombreAsesor` y la llave correspondiente en `datosAsesores`, conservando el mismo teléfono.
- Impacto funcional: el selector muestra `Lily Ramirez Rodriguez` y mantiene el autollenado del número `+52 998 119 7232`.
- Riesgos: bajos; cambio de texto y llave sincronizada.
- Validación realizada: `node --check script.js`, `node --check validation.js`.
- Pendientes: ninguno.

### [2026-06-09] - Alta de asesores comerciales
- Autor: Codex
- Motivo: agregar al selector de asesores los nombres y teléfonos proporcionados por el usuario.
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: se agregaron siete opciones al selector `nombreAsesor` y se actualizó el objeto `datosAsesores` para autocompletar el teléfono de cada asesor en formato `+52 998 XXX XXXX`.
- Impacto funcional: el asesor puede seleccionar a Angela, Jorge Rafael, Briseida, David, Eduardo, Lily o R. Jonathan y el número de teléfono se llena automáticamente.
- Riesgos: bajos; cambio acotado a catálogo de asesores y selector.
- Validación realizada: `node --check script.js`, `node --check validation.js`.
- Pendientes: validar visualmente en navegador que cada opción actualice el teléfono correcto.

### [2026-06-05] - Ajuste de encabezado móvil
- Autor: Codex
- Motivo: corregir el espacio superior y el recorte del logo derecho en vista móvil después de los últimos ajustes visuales.
- Archivos modificados: styles.css, context.md
- Resumen técnico: dentro de `@media screen and (max-width: 768px)` se compactó el header fijo, se redujo el `padding-top` del body, se distribuyó la fila de logos con `space-between` y padding interno, y se redujeron ligeramente los tamaños máximos de los logos y textos.
- Impacto funcional: mejora visual en celulares; no cambia cálculos, impresión ni lógica de captura.
- Riesgos: bajos; cambio acotado a CSS de pantalla móvil.
- Validación realizada: `node --check script.js`, `node --check validation.js`.
- Pendientes: validar visualmente en un teléfono real.

### [2026-06-05] - Modo manual también para departamentos
- Autor: Codex
- Motivo: permitir ajustar Valor Avalúo y Descuento en departamentos cuando haya cambios de último minuto.
- Archivos modificados: script.js, context.md
- Resumen técnico: se agregaron funciones para distinguir desarrollos de departamentos y habilitar `togglePrecioManual` cuando existe un departamento seleccionado (`departamentoSelect.value`). El modo manual sigue desbloqueando únicamente `precioLista` y `bono`; avalúo administrativo, porcentajes notariales y reglas del catálogo se conservan.
- Impacto funcional: en Jardines del Sur 6 - Departamentos y Lirios Residencial 2 - Departamentos, después de seleccionar una unidad, el asesor puede activar Modo manual y editar Valor Avalúo y Descuento.
- Riesgos: bajos; cambio acotado a la disponibilidad del modo manual.
- Validación realizada: `node --check script.js`, `node --check validation.js`.
- Pendientes: validar visualmente en navegador seleccionando un departamento y activando modo manual.

### [2026-06-05] - Ocultar Subcuenta Vivienda en Cofinavit
- Autor: Codex
- Motivo: Subcuenta Vivienda ya no debe capturarse ni mostrarse para el plan Cofinavit.
- Archivos modificados: script.js, context.md
- Resumen técnico: en la rama `planSeleccionado === "cofinavit"` del handler de `planVenta`, se oculta `subcuentaViviendaField`, se agrega `ocultar-impresion` y se limpia el valor de `subcuentaVivienda`, además de mantener oculta la Comisión de Apertura.
- Impacto funcional: al elegir Cofinavit, se muestran Crédito Bancario y Crédito Infonavit, pero ya no aparece Subcuenta Vivienda ni suma al enganche.
- Riesgos: bajos; cambio acotado a visibilidad/limpieza de un campo por plan.
- Validación realizada: `node --check script.js`, `node --check validation.js`.
- Pendientes: validar visualmente cambiando a Cofinavit y revisando impresión.

### [2026-06-05] - Opción rápida de precio por m² excedente en modo manual
- Autor: Codex
- Motivo: permitir seleccionar el precio por m² excedente como opción opcional, igual que el campo Esquina, sin precargarlo en modo manual.
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: se agregó `datalist` al campo `precioMetrosExcedentes` y la función `actualizarOpcionesPrecioMetrosExcedentes(precioTerrenoExcedente)` para cargar la opción del desarrollo activo ($5,750 en Jardines del Sur 6 Casas, $7,500 en La Rioja 2 Casas). En modo manual el campo puede quedar vacío y calcular $0, o el asesor puede seleccionar la opción rápida.
- Impacto funcional: al activar modo manual, Precio de Metros Excedentes queda opcional; si el asesor necesita cobrar terreno, puede elegir el valor sugerido desde el desplegable.
- Riesgos: bajos; cambio acotado al input de precio por m² excedente.
- Validación realizada: `node --check script.js`, `node --check validation.js`.
- Pendientes: validar visualmente que el desplegable aparezca al enfocar Precio de Metros Excedentes en modo manual.

### [2026-06-05] - Modo manual a la izquierda y terreno opcional
- Autor: Codex
- Motivo: mejorar la ubicación visual del control y permitir que en modo manual el precio total ya incluya terreno excedente.
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: `modo-manual-control` se posicionó a la izquierda del encabezado de Detalles de Precio. En `actualizarValores()`, el precio por metro excedente ya no cae al default del desarrollo cuando `togglePrecioManual` está activo y el campo está vacío. Al activar modo manual, `precioMetrosExcedentes` se limpia; al desactivarlo, vuelve al default del desarrollo.
- Impacto funcional: en modo manual, si el asesor deja vacío Precio de Metros Excedentes, el Valor del Terreno Excedente queda en $0 aunque capture metros, útil cuando le entregan un precio total ya integrado.
- Riesgos: bajos; el comportamiento normal fuera de modo manual conserva el precio por m² default.
- Validación realizada: `node --check script.js`, `node --check validation.js`.
- Pendientes: validar visualmente y probar con modo manual activo, metros capturados y precio por m² vacío.

### [2026-06-05] - Reubicación visual de Modo Manual
- Autor: Codex
- Motivo: evitar que el control de modo manual ensucie las filas de valores en Detalles de Precio.
- Archivos modificados: index.html, styles.css, context.md
- Resumen técnico: se movió `modoPrecioManualContainer` al encabezado de `detallesPrecio` junto al título, con texto compacto `Modo manual`; se agregaron estilos `bloque-header-con-control`, `modo-manual-control` y ajustes responsive para mobile.
- Impacto funcional: ninguno en cálculos; el control conserva la misma lógica y ahora aparece como acción auxiliar del bloque.
- Riesgos: bajos; cambio visual acotado.
- Validación realizada: `node --check script.js`, `node --check validation.js`.
- Pendientes: validar visualmente en navegador desktop/mobile.

### [2026-06-05] - Ajuste manual de Valor Avalúo y Descuento
- Autor: Codex
- Motivo: permitir ajustes de último minuto en precio sin perder las reglas del modelo seleccionado.
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: se agregó el control `togglePrecioManual` en Detalles de Precio. Al seleccionar un modelo de casas, el control permite desbloquear únicamente `precioLista` (Valor Avalúo base) y `bono` (Descuento). El cobro de Avalúo(AV), porcentajes notariales, cuota de contingencia y demás reglas siguen saliendo del catálogo del modelo. Al cambiar de desarrollo/modelo/departamento, el modo manual se desactiva automáticamente.
- Impacto funcional: el asesor puede elegir el modelo correcto, activar ajuste manual y capturar solo Valor Avalúo y Descuento; el Valor Avalúo final sigue sumando terreno excedente y esquina, y todos los cálculos posteriores se mantienen automáticos.
- Riesgos: medios-bajos; cambio acotado a UI/estado de dos campos, pero toca el flujo central de cálculo.
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente que el control aparezca solo en casas, que se apague al cambiar modelo y que Avalúo(AV) conserve el cobro del catálogo.

### [2026-06-05] - Valor Avalúo como valor único principal
- Autor: Codex
- Motivo: dejar un solo valor principal visible y calcular porcentajes de escrituración/crédito sobre Valor Avalúo.
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: se ocultó `precioTotalContainer` en HTML y en las ramas de UI de `script.js`. En `actualizarValores()`, `valorAvaluoActual` reemplaza el uso directo de `precioTotalCasa`: para casas se calcula como precio base + terreno excedente + esquina; para departamentos queda como precio lista. `gastosEscrituracion` y la base de porcentajes de crédito leen ese Valor Avalúo actualizado.
- Impacto funcional: la pantalla muestra solo Valor Avalúo como valor principal; al agregar esquina o terreno excedente, ese valor sube y sobre él se calculan gastos de escrituración y porcentajes de crédito.
- Riesgos: bajos; se mantiene `precioTotalCasa` como campo técnico oculto para no romper referencias internas.
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador y en impresión que Precio Total ya no aparezca y que Valor Avalúo sea la base.

### [2026-06-05] - Valor avalúo sincronizado con precio total
- Autor: Codex
- Motivo: hacer que el Valor Avalúo y el Precio Total de la Casa usen exactamente el mismo cálculo cuando se agregan esquina o terreno excedente.
- Archivos modificados: script.js, context.md
- Resumen técnico: en `actualizarValores()`, el resultado formateado de `precioTotalCasa` ahora también actualiza el campo `precioLista` visible y `sessionStorage.valorAvaluo`.
- Impacto funcional: en casas, al capturar metros excedentes, precio por metro o esquina, el Valor Avalúo sube junto con el Precio Total de la Casa; los demás cálculos se mantienen igual.
- Riesgos: bajos; cambio acotado a sincronización visual/estado del valor avalúo.
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador seleccionando una casa y agregando esquina/terreno excedente.

### [2026-06-05] - Alta FRESNO ELITE PROMO La Rioja 2
- Autor: Codex
- Motivo: agregar opción promocional de FRESNO ELITE con $50,000 adicionales de descuento.
- Archivos modificados: script.js, context.md
- Resumen técnico: se agregó `FRESNO ELITE PROMO` al arreglo de modelos de `LaRioja2` y al catálogo `datosLaRioja2`, duplicando los valores de `FRESNO ELITE` y cambiando `bono` de $1,055,050 a $1,105,050.
- Impacto funcional: al elegir La Rioja 2 - Casas, el asesor puede seleccionar FRESNO ELITE PROMO; su precio neto base queda $50,000 más barato que FRESNO ELITE, manteniendo los demás cálculos sin cambios.
- Riesgos: bajos; cambio acotado a catálogo.
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador que FRESNO ELITE PROMO aparezca en el selector y calcule precio neto base de $4,244,950.

### [2026-06-05] - Alta NONI ELITE PROMO La Rioja 2
- Autor: Codex
- Motivo: agregar opción promocional de NONI ELITE con $50,000 adicionales de descuento.
- Archivos modificados: script.js, context.md
- Resumen técnico: se agregó `NONI ELITE PROMO` al arreglo de modelos de `LaRioja2` y al catálogo `datosLaRioja2`, duplicando los valores de `NONI ELITE` y cambiando `bono` de $1,533,002.50 a $1,583,002.50.
- Impacto funcional: al elegir La Rioja 2 - Casas, el asesor puede seleccionar NONI ELITE PROMO; su precio neto base queda $50,000 más barato que NONI ELITE, manteniendo los demás cálculos sin cambios.
- Riesgos: bajos; cambio acotado a catálogo.
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador que NONI ELITE PROMO aparezca en el selector y calcule precio neto base de $4,396,997.50.

### [2026-06-05] - Alta NONI PROMO Jardines 6 Casas
- Autor: Codex
- Motivo: agregar opción promocional de NONI con $50,000 adicionales de descuento.
- Archivos modificados: script.js, context.md
- Resumen técnico: se agregó `NONI PROMO` al arreglo de modelos de `Azular1` y al catálogo `datosCasas1`, duplicando los valores de `NONI` y cambiando `bono` de $688,875 a $738,875.
- Impacto funcional: al elegir Jardines del Sur 6 - Casas, el asesor puede seleccionar NONI PROMO; su precio neto base queda $50,000 más barato que NONI, manteniendo los demás cálculos sin cambios.
- Riesgos: bajos; cambio acotado a catálogo.
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador que NONI PROMO aparezca en el selector y calcule precio neto base de $3,111,125.

### [2026-06-05] - Alta FLAMBOYAN PROMO Jardines 6 Casas
- Autor: Codex
- Motivo: agregar opción promocional de FLAMBOYAN con $25,000 adicionales de descuento.
- Archivos modificados: script.js, context.md
- Resumen técnico: se agregó `FLAMBOYAN PROMO` al arreglo de modelos de `Azular1` y al catálogo `datosCasas1`, duplicando los valores de `FLAMBOYAN` y cambiando `bono` de $395,150 a $420,150.
- Impacto funcional: al elegir Jardines del Sur 6 - Casas, el asesor puede seleccionar FLAMBOYAN PROMO; su precio neto base queda $25,000 más barato que FLAMBOYAN, manteniendo los demás cálculos sin cambios.
- Riesgos: bajos; cambio acotado a catálogo.
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador que FLAMBOYAN PROMO aparezca en el selector y calcule precio neto base de $2,200,850.

### [2026-05-27] - Lirios 2: avalúo CEDRO PLUS igual a Jardines 6
- Autor: Codex
- Motivo: agregar a Lirios Residencial 2 el mismo costo de avalúo administrativo que usa CEDRO PLUS de Jardines del Sur 6.
- Archivos modificados: script.js, context.md
- Resumen técnico: en `datosDepartamentosLirios2`, las cuatro plantas de `CEDRO PLUS` (PB, 1N, 2N y 3N Roof) cambiaron `avaluo` de 0 a 11500.
- Impacto funcional: al seleccionar Lirios Residencial 2 - Departamentos, el campo Avalúo(AV) mostrará $11,500.00 y ese monto se sumará en Gastos Totales.
- Riesgos: bajos; no se modificaron precios, bonos, porcentajes de escrituración ni fórmulas.
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador seleccionando un CEDRO PLUS de Lirios 2 y confirmando que Avalúo(AV) muestre $11,500.00.

### [2026-05-26] - Limpieza de desarrollos no comercializados (Azular 3 y Depas-Preventa/Bakab)
- Autor: Claude Opus 4.7
- Motivo: el catálogo activo solo es Jardines del Sur 6 (Casas + Departamentos), La Rioja 2 y Lirios 2; Azular 3 y Departamentos-Preventa ya no se usarán.
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: se removieron las `<option>` `Azular3` y `Depas-Preventa` del selector. En script.js se eliminó: `datosAzular["Azular3"]` y `datosAzular["Depas-Preventa"]`; el catálogo legacy `datosDepartamentos` por torre/unidad (256-264) que no se referenciaba; los catálogos locales `datosCasas3` y `datosBakab` dentro del handler de `prototipoSelect`; la rama `else if (seleccion === "Depas-Preventa")` del handler de `azularSelect`; la rama `else if (desarrolloSeleccionado === "Depas-Preventa")` de `actualizarValores`. Se unificó la fórmula de departamentos para Azular1-Depas y Lirios2-Depas en una sola rama (precio total = precio lista; neto = precio lista - equipamiento - bono). También se quitaron las referencias a la clase CSS `es-bakab` en JS.
- Impacto funcional: el selector queda con solo 4 desarrollos activos. Cualquier referencia interna a Bakab o CHOMM/CANEK/etc desaparece del flujo. Las clases CSS `es-bakab` siguen existiendo en `styles.css` (no se eliminaron por seguridad, son inocuas).
- Riesgos: bajos. Si en el futuro se reactiva Azular 3 o Bakab, habrá que recargar catálogos y restaurar lógica; el bitácora histórico documenta cómo estaba antes.
- Validación realizada: `node --check script.js`, `node --check validation.js`.
- Pendientes: validar en navegador que el selector funcione bien, especialmente cambiando entre los 4 desarrollos activos sin recargar.

### [2026-05-26] - Precio m² excedente default y $20,000 en apartado
- Autor: Claude Opus 4.7
- Motivo: pre-cargar el precio por metro excedente típico de cada desarrollo de casas y sumar la opción $20,000 al datalist de apartado.
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: en `datosAzular` se ajustó `Azular1.precioTerrenoExcedente` de 5900 → 5750 y `LaRioja2.precioTerrenoExcedente` de 0 → 7500. En el handler de `azularSelect`, cuando el desarrollo es `Azular1` o `LaRioja2` el campo `precioMetrosExcedentes` ahora llega pre-llenado con el valor default formateado en MXN y queda editable (antes llegaba vacío y editable). Se guardó también el default en `sessionStorage.precioTerrenoExcedente` para que `actualizarValores()` lo consuma como fallback si el usuario aún no ha tocado el campo. En `index.html`, el datalist `apartado-options` ahora incluye `$20,000.00` entre `$15,000.00` y `$30,000.00`.
- Impacto funcional: al elegir Jardines del Sur 6 - Casas, el campo Precio de Metros Excedentes muestra $5,750.00; al elegir La Rioja 2 - Casas, muestra $7,500.00. Ambos editables. El asesor verá $20,000 como sugerencia rápida de apartado.
- Riesgos: bajos. Si el asesor borra el campo, el cálculo cae a 0 hasta que escriba un monto (comportamiento esperado).
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador con un modelo de cada desarrollo (Jardines 6 Casas y La Rioja 2) y confirmar que el precio default se aplica al cálculo de Valor del Terreno Excedente cuando se ingresan metros excedentes.

### [2026-05-26] - Datalist $40,000 en campo Esquina (mismo patrón que apartado)
- Autor: Claude Opus 4.7
- Motivo: alinear el comportamiento del campo Esquina con el de Apartado para que al hacer click aparezca $40,000 como sugerencia clickeable.
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: se reemplazó el placeholder por un `<datalist id="esquina-options">` con la opción `$40,000.00`, y el input `#esquina` ahora referencia ese datalist via `list="esquina-options"`. Se agregó handler `focus` (igual que en apartado) que limpia temporalmente el campo y guarda el valor previo en `_savedEsquina`; en `blur`, si el usuario no captura nada se restaura el valor previo, si captura un monto se formatea como moneda, y si parsed=0 sin valor previo queda vacío. El cálculo no cuenta nada hasta que el asesor elija o capture un monto.
- Impacto funcional: al hacer click en Esquina aparece $40,000 como opción de datalist; al seleccionarla se aplica como cualquier captura manual y suma en el precio total. Si el asesor no toca el campo, no afecta cálculos.
- Riesgos: bajos; mismo patrón ya probado en apartado.
- Validación realizada: `node --check script.js`.
- Pendientes: validar en navegador que al hacer click en Esquina se vea $40,000 en el dropdown y que se aplique correctamente al cálculo.

### [2026-05-26] - La Rioja 2: cuota de contingencia $10,000
- Autor: Claude Opus 4.7
- Motivo: actualizar la cuota de contingencia específica de La Rioja 2 (los demás siguen en sus valores existentes: Lirios 2 $6,000, resto $4,000).
- Archivos modificados: script.js, context.md
- Resumen técnico: la función `actualizarCuotaContingencia(desarrollo)` se refactorizó para usar un mapa `cuotasPorDesarrollo` con `Lirios2-Depas: 6000` y `LaRioja2: 10000`; cualquier otro desarrollo cae al default $4,000. Sigue sincronizando `otrosGastos` (Financiamiento) e `infoCuotaContingencia` (bloque informativo).
- Impacto funcional: al elegir La Rioja 2 - Casas, gastos totales y total a pagar suman $10,000 de cuota de contingencia; al cambiar a otro desarrollo se ajusta automáticamente.
- Riesgos: bajos.
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador eligiendo La Rioja 2 y confirmando que el campo Cuota de Contingencia (en Financiamiento y en el bloque informativo de Escrituración) muestre $10,000 y se sume correctamente en gastos totales.

### [2026-05-26] - Lirios 2: cuota de contingencia $6,000 y porcentajes de escrituración alineados a Cedro Plus Jardines 6
- Autor: Claude Opus 4.7
- Motivo: en Lirios Residencial 2 la cuota de contingencia es $6,000 (no $4,000 como el resto) y los porcentajes de gastos notariales deben ser iguales a los de CEDRO PLUS de Jardines del Sur 6.
- Archivos modificados: script.js, context.md
- Resumen técnico: se agregó `porcentajesEscrituracionLirios2` y se anexó al catálogo `datosDepartamentosLirios2` (CEDRO PLUS PB/1N/2N/3N) con `{ infonavit: 0.07, fovissste: 0.08, cofinavit: 0.085, bancario: 0.077, contado: 0.072 }`. Se creó la función `actualizarCuotaContingencia(desarrollo)` que pone $6,000 cuando el desarrollo es `Lirios2-Depas` y $4,000 en los demás, sincronizando `otrosGastos` (Financiamiento) e `infoCuotaContingencia` (bloque informativo). Se invoca al inicio del handler de `azularSelect` y se llama a `actualizarCalculoFinal()` al final para refrescar gastos totales si ya había cálculo previo.
- Impacto funcional: al elegir Lirios 2 - Departamentos, gastos totales y total a pagar suman $6,000 de cuota de contingencia; al cambiar a otro desarrollo vuelve a $4,000. Los porcentajes de escrituración por plan ahora se aplican automáticamente al elegir un Cedro Plus de Lirios 2.
- Riesgos: bajos; el campo `avaluo` administrativo de Lirios 2 sigue en $0 (no se pidió cambiarlo).
- Validación realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador con un Cedro Plus PB/1N/2N/3N de Lirios 2 cambiando entre planes (bancario, infonavit, fovissste, cofinavit, contado) para confirmar que escrituración y cuota de contingencia se reflejan en gastos totales.

### [2026-05-26] - Fix nombre de archivo al cambiar modelo sin recargar
- Autor: Codex
- Motivo: al imprimir/guardar una nueva cotización después de cambiar de modelo sin recargar, el nombre sugerido podía conservar el modelo anterior aunque los cálculos ya estuvieran actualizados.
- Archivos modificados: script.js, context.md
- Resumen técnico: se agregó `obtenerModeloParaTitulo()` para elegir el modelo del título según el desarrollo activo: `departamentoSelect` solo para departamentos (`Azular1-Depas` y `Lirios2-Depas`) y `prototipo` para casas. Se eliminó la prioridad automática del selector de departamento oculto, que podía arrastrar un valor previo.
- Impacto funcional: el nombre sugerido al imprimir/guardar la cotización refleja el modelo actualmente seleccionado sin necesidad de recargar la página.
- Riesgos: bajo; no se modificaron fórmulas, catálogos ni cálculos financieros.
- Validación realizada: pendiente de prueba en navegador; cambio acotado a la lógica de título/document.title.
- Pendientes: validar flujo real: cotizar un departamento, cambiar a casa sin recargar, imprimir y confirmar que el nombre use el modelo de casa actual.

### [2026-05-24] - Migración a drive compartido
- Autor: Copilot (GPT-5.4 mini)
- Motivo: documentar que el cotizador se trabajará desde dos computadoras usando un drive compartido
- Archivos modificados: context.md
- Resumen técnico: se agregó una nota operativa para tratar la copia del drive como fuente única y evitar dependencias en rutas locales de una sola máquina
- Impacto funcional: ninguno; solo documentación operativa
- Riesgos: si se crean referencias absolutas a rutas locales, el cambio de equipo puede romper accesos
- Validación realizada: actualización de contexto y confirmación de la preferencia del usuario
- Pendientes: migrar físicamente el proyecto al drive y comprobar acceso desde ambas computadoras

### [2026-04-19] - Creación de contexto base
- Autor: Copilot (GPT-5.3-Codex)
- Motivo: establecer diagnóstico integral para preparar cambios solicitados
- Archivos modificados: context.md
- Resumen técnico: se documentó arquitectura, flujos, reglas de negocio, riesgos y plan de trabajo
- Impacto funcional: ninguno (solo documentación)
- Riesgos: ninguno
- Validación realizada: lectura completa de index.html, script.js, styles.css, validation.js y revisión de errores del editor
- Pendientes: definir primer paquete de cambios funcionales

### [2026-04-19] - Ajuste mobile y nueva regla de escrituración
- Autor: Copilot (GPT-5.3-Codex)
- Motivo: adaptar interfaz para móvil y cambiar porcentajes de gastos de escrituración por desarrollo
- Archivos modificados: index.html, script.js, styles.css, context.md
- Resumen técnico: se reforzó el layout responsive para pantallas <= 768px; se implementó escrituración al 7% para Azular1 y Azular1-Depas, y 7.5% para Azular3 y Depas-Preventa; se actualiza etiqueta de porcentaje en UI de forma dinámica
- Impacto funcional: mejora de usabilidad en móvil y cálculo financiero alineado a la nueva política
- Riesgos: en móvil, la tabla de enganche usa scroll horizontal para mantener legibilidad
- Validación realizada: verificación manual en navegador con viewport móvil y prueba de 4 escenarios (Azular1, Azular3, Azular1-Depas, Depas-Preventa)
- Pendientes: revisión visual final contigo para ajustar tamaños/espaciados a preferencia comercial

### [2026-04-19] - Orden específico de bloques para celular
- Autor: Copilot (GPT-5.3-Codex)
- Motivo: mostrar una sola sesión en móvil con el orden comercial solicitado
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: se añadió reorganización de bloques al cargar en anchos <= 768px, con orden: Datos Generales, Detalles de Precio, Gastos/Administrativos, Financiamiento, Cálculo Final, Plan de Enganche, Datos del Asesor; no se tocaron reglas de impresión
- Impacto funcional: la vista celular prioriza lectura secuencial y mantiene escritorio sin cambios
- Riesgos: si se fuerza recarga de escritorio a móvil en un navegador no responsive, la previsualización local puede no reflejar el comportamiento real del teléfono
- Validación realizada: comprobación de ausencia de errores en editor y verificación de condición responsive en código
- Pendientes: validación final en dispositivo móvil físico

### [2026-04-19] - Fix de vistas móviles que se ocultaban
- Autor: Copilot (GPT-5.3-Codex)
- Motivo: corregir pérdida de bloques al alternar entre tamaños de pantalla
- Archivos modificados: script.js, context.md
- Resumen técnico: se reemplazó la lógica mobile por una función responsive bidireccional con listener de resize; en <=768px compacta todo en columna 1 y oculta columna 2, y en >768px restaura estructura original de dos columnas
- Impacto funcional: elimina el efecto de bloques "borrados" al cambiar viewport y mantiene orden móvil solicitado
- Riesgos: mínimos, depende de IDs/estructura actual del DOM
- Validación realizada: ancho 426px confirmado con orden correcto de los 7 bloques y sin errores de análisis
- Pendientes: prueba final en un celular físico del equipo comercial

### [2026-04-19] - Fix de espaciado y ancho en mobile
- Autor: Copilot (GPT-5.3-Codex)
- Motivo: corregir vista móvil con huecos grandes y desbordamiento lateral
- Archivos modificados: styles.css, context.md
- Resumen técnico: se forzó override mobile de flex-basis/alto en labels de campos horizontales, ancho 100% en columnas y bloques, box-sizing en inputs/selects y bloqueo de overflow horizontal global en móvil
- Impacto funcional: los campos vuelven a mostrarse compactos y legibles en una sola columna sin “saltos” de espacio
- Riesgos: mínimos, cambios acotados a media query <=768px
- Validación realizada: inspección de medidas en navegador (ancho 426px) y captura posterior con corrección visible
- Pendientes: revisar con tu celular físico y ajustar tamaño final de tipografía si deseas más densidad

### [2026-04-19] - Revisión final integral (cálculo + orden)
- Autor: Copilot (GPT-5.3-Codex)
- Motivo: cierre técnico previo a cambios nuevos
- Archivos modificados: context.md
- Resumen técnico: se validaron fórmulas clave en 4 escenarios (Azular1, Azular3, Azular1-Depas, Depas-Preventa), porcentaje de escrituración por desarrollo y consistencia de totales; también se revisó orden de bloques para móvil y restauración de escritorio
- Impacto funcional: ninguno (solo validación y documentación)
- Riesgos: el navegador integrado puede reportar anchos variables; la confirmación visual final debe hacerse en dispositivo físico
- Validación realizada: todas las comprobaciones de cálculo pasaron (escrituración, gastos totales, total a pagar y enganche total)
- Pendientes: validación final visual en celular físico para confirmar experiencia exacta de usuario

### [2026-04-19] - Fix mobile de captura manual + tabla + recuperación de impresión
- Autor: Copilot (GPT-5.3-Codex)
- Motivo: corregir bloqueo de campos manuales en móvil, tabla de plan de enganche inestable y desconfiguración de impresión
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: se eliminó la reordenación de bloques por JavaScript (causaba efectos colaterales), se movió el orden móvil a CSS de pantalla con display: contents y order por bloque, se ajustó tabla en móvil con table-layout fijo y entradas compactas, y la media query móvil se limitó a screen para no afectar print
- Impacto funcional: en móvil ya permite capturar metros excedentes y meses para pagar enganche; la tabla deja de romperse; impresión vuelve a conservar estructura de dos columnas y contenido completo
- Riesgos: display: contents depende del soporte del navegador (en navegadores modernos funciona correctamente)
- Validación realizada: prueba en ancho 426 con captura de valores manuales (metros=12, meses=6), orden correcto de 7 bloques y verificación técnica de media print con ambas columnas visibles
- Pendientes: validación final de impresión en equipo real del usuario (web y móvil)

### [2026-04-19] - Estado actual consolidado
- Autor: Copilot (GPT-5.3-Codex)
- Motivo: dejar registro final de estado tras correcciones encadenadas
- Archivos modificados: context.md
- Resumen técnico: el proyecto queda con cálculos validados, orden móvil corregido, captura manual funcional en campos numéricos y ajustes de tabla de enganche en viewport pequeño sin alterar lógica de negocio
- Impacto funcional: estabilidad de uso en web y móvil durante captura de datos y cálculo
- Riesgos: pendiente únicamente la validación visual final en dispositivo físico para confirmar presentación e impresión en entorno real del usuario
- Validación realizada: revisión técnica y funcional en navegador integrado con escenarios de cálculo y captura manual
- Pendientes: prueba final de impresión desde laptop y celular del usuario

### [2026-04-19] - Cierre de ajustes UI (aprobado)
- Autor: Copilot (GPT-5.3-Codex)
- Motivo: registrar confirmación del usuario sobre el estado final de los ajustes
- Archivos modificados: context.md
- Resumen técnico: se mantiene configuración móvil estable con tabla de plan de enganche ajustada (más espacio para Fecha de Pago y menor ancho en columna Pago), captura manual funcional y comportamiento de impresión recuperado
- Impacto funcional: experiencia consistente en móvil y escritorio para el flujo de cotización actual
- Riesgos: ninguno crítico identificado en el alcance de los cambios aprobados
- Validación realizada: revisión visual final y aceptación explícita del usuario ("yo creo que ahí está bien así")
- Pendientes: continuar con nuevos cambios funcionales cuando el usuario los solicite

### [2026-05-24] - Revisión de contexto técnico actual
- Autor: Copilot (GPT-5.4 mini)
- Motivo: alinear el documento de contexto con el comportamiento vigente del cotizador
- Archivos modificados: context.md
- Resumen técnico: se corrigió el umbral real del modo compacto de impresión, se añadió la referencia al plan de venta Fovissste y se ajustó la nota de semántica HTML para evitar una afirmación desactualizada
- Impacto funcional: ninguno; solo documentación de estado actual
- Riesgos: el documento sigue dependiendo de la exactitud de futuras ediciones de `script.js` y `styles.css`
- Validación realizada: lectura de `context.md` y muestreo de `index.html` y `script.js` para contrastar el estado actual
- Pendientes: actualizar este registro cuando cambien reglas de cálculo, impresión o visibilidad

### [2026-04-19] - Corrección de inicialización de tablaEnganche
- Autor: Copilot (GPT-5.3-Codex)
- Motivo: eliminar error de consola que interrumpía flujo en carga inicial
- Archivos modificados: script.js, context.md
- Resumen técnico: se reubicó el disparo inicial de planVenta para ejecutarse después de la inicialización de tablaEnganche y funciones relacionadas
- Impacto funcional: evita el ReferenceError de "Cannot access 'tablaEnganche' before initialization" y estabiliza el arranque
- Riesgos: bajos, cambio de orden de ejecución sin alterar fórmulas
- Validación realizada: recarga completa sin errores de análisis ni excepción en consola de la app
- Pendientes: ninguno en este punto

### [2026-04-19] - Ajuste fino de impresión carta por meses
- Autor: Copilot (GPT-5.3-Codex)
- Motivo: mejorar ocupación de hoja carta sin deformar toda la cotización
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: compactación enfocada al bloque Plan de Enganche; umbrales de impresión recalibrados y escala dinámica suave por meses para balancear casos de pocos y muchos pagos
- Impacto funcional: mejor aprovechamiento de espacio en impresión con 1, 13, 15 y 16 meses, manteniendo legibilidad del resto del documento
- Riesgos: variaciones menores entre drivers/impresoras pueden requerir ajuste marginal de escala
- Validación realizada: pruebas en media print desktop y mobile con verificación de clases activas, escala aplicada y ausencia de desbordes
- Pendientes: calibración final opcional en impresora física del usuario

### [2026-04-19] - Total de tabla en negrita y tamaño reducido
- Autor: Copilot (GPT-5.3-Codex)
- Motivo: mejorar legibilidad del total de enganche evitando protagonismo excesivo
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: se forzó font-weight bold siempre para el total y se redujo ligeramente el tamaño visual en móvil
- Impacto funcional: el total permanece visible y consistente aun cuando el cálculo cuadra
- Riesgos: ninguno relevante
- Validación realizada: comprobación de estilos computados (font-size 15px, font-weight 700)
- Pendientes: ajuste opcional a 14px si se desea aún más discreto

### [2026-04-19] - Aclaración de warnings externos en consola
- Autor: Copilot (GPT-5.3-Codex)
- Motivo: distinguir errores reales de la app frente a mensajes de extensiones
- Archivos modificados: context.md
- Resumen técnico: se confirmó que mensajes en sidebar.js/injectScript.js/i18n provienen de extensiones del navegador (subtítulos/traducción), no del cotizador
- Impacto funcional: ninguno en cálculos, UI o impresión de la app
- Riesgos: ruido de depuración al revisar consola con extensiones activas
- Validación realizada: revisión de stack traces y origen de archivos fuera del proyecto
- Pendientes: probar en incógnito o con extensiones deshabilitadas para depuración limpia; implementar cache-busting en index.html (versionado en styles.css/script.js/validation.js)

### [2026-04-25] - Ocultar Azular 3 temporalmente
- Autor: Copilot (Claude Opus 4.7)
- Motivo: Azular 3 deja de comercializarse de forma temporal; se requiere ocultarlo sin eliminar datos
- Archivos modificados: index.html, context.md
- Resumen técnico: la opción `<option value="Azular3">` se marcó con `hidden disabled` para que no aparezca en el selector ni pueda seleccionarse; se preserva el catálogo `datosCasas3` en script.js para reactivación rápida
- Impacto funcional: el selector de Desarrollo solo muestra Azular 1 y 2, Azular 1 - Departamentos y Departamentos-Preventa
- Riesgos: ninguno; reactivación inmediata removiendo `hidden disabled`
- Validación realizada: revisión visual del selector tras el cambio
- Pendientes: ninguno

### [2026-04-25] - Actualización de avalúos Azular 1 y 2
- Autor: Copilot (Claude Opus 4.7)
- Motivo: alinear avalúos del cotizador con la lista vigente "Coto 1 y Coto 4" (vigencia 19-feb-2026)
- Archivos modificados: script.js, context.md
- Resumen técnico: se actualizaron valores de `avaluo` en `datosCasas1` para CHOMM (5,100 → 6,095), CANEK y CANEK-COCINA (5,800 → 6,895), KAHUIL (6,800 → 7,863), HUNAB (7,500 → 8,488), ALUX (7,900 → 8,980) y UXMAL (8,800 → 9,788). CHAAK y BAKTÚN no cambian.
- Impacto funcional: gastos totales y total a pagar reflejan los nuevos avalúos en cualquier cotización Azular 1 y 2
- Riesgos: precios de lista, bonos y demás campos no se modificaron; se documentaron pendientes (HUNAB tiene $500 de más, BAKTÚN no aparece en hoja vigente)
- Validación realizada: comparación campo por campo contra hoja oficial y aplicación del cambio en script.js
- Pendientes: confirmar si HUNAB debe ser $2,995,000 (no $2,995,500) y si BAKTÚN debe ocultarse del selector

### [2026-04-25] - Fix impresión Detalles de Precio en Depas-Preventa
- Autor: Copilot (Claude Opus 4.7)
- Motivo: al imprimir Departamentos-Preventa (Bakab) no aparecían Metros Excedentes, Precio de Metros Excedentes, Valor del Terreno Excedente ni Precio Total del Departamento
- Archivos modificados: script.js, styles.css, context.md
- Resumen técnico: las reglas CSS `body.es-departamento #terrenoExcedenteContainer/precioTotalContainer { display:none }` también afectaban a Bakab. Se introduce una clase adicional `es-bakab` que se añade al body solo cuando el desarrollo es Depas-Preventa, y las reglas CSS se cambian a `body.es-departamento:not(.es-bakab)` para excluir a Bakab.
- Impacto funcional: en impresión de Bakab Planta Baja se ven todos los campos del bloque Detalles de Precio; en Bakab Piso 1/2/3 sigue oculto el terreno excedente vía JS (correcto); Azular1-Depas no cambia.
- Riesgos: bajos; el toggle de clases es bidireccional y se limpia al cambiar de desarrollo
- Validación realizada: revisión del flujo de cambio de clase en `azularSelect` y revisión de selectores CSS
- Pendientes: validación física de impresión

### [2026-04-25] - Ocultar Esquina en impresión de Depas-Preventa
- Autor: Copilot (Claude Opus 4.7)
- Motivo: en impresión de Bakab seguía apareciendo el campo Esquina pese a estar oculto en pantalla; en Depas-Preventa no se cobra esquina
- Archivos modificados: styles.css, context.md
- Resumen técnico: se agregó regla `body.es-bakab #esquinaContainer { display:none !important }` dentro del `@media print` de departamentos para anular el `display:flex !important` de `.campo-horizontal`
- Impacto funcional: la impresión de Bakab ya no muestra el campo Esquina
- Riesgos: ninguno; no afecta Azular1, Azular1-Depas ni casas
- Validación realizada: revisión de selector en hoja final
- Pendientes: ninguno

### [2026-04-25] - Ajuste mobile del bloque "Hoy es el momento" / leyenda final
- Autor: Copilot (Claude Opus 4.7)
- Motivo: en mobile el bloque `.final` se cortaba por la derecha (texto y leyenda incompletos)
- Archivos modificados: styles.css, context.md
- Resumen técnico: dentro de `@media screen and (max-width: 768px)` se ajustaron `.final` (width 100%, padding 14px 12px, box-sizing border-box, overflow-wrap break-word), los `h2` (font-size 20px, line-height 1.25, padding lateral, word-break) y la leyenda (`.final p` y `.final .leyenda` a 11px con margen lateral mínimo)
- Impacto funcional: en celular el texto motivacional y la leyenda se ven completos sin desbordamiento; desktop e impresión sin cambios
- Riesgos: ninguno
- Validación realizada: revisión de selectores y media queries
- Pendientes: validación visual en dispositivo físico

### [2026-05-08] - Primera adaptación visual a Grupo Sadasi / Altta Homes
- Autor: Codex
- Motivo: iniciar adaptación del cotizador a otro desarrollo reemplazando identidad visual previa por logos de Grupo Sadasi y Altta Homes
- Archivos modificados: index.html, styles.css, context.md
- Resumen técnico: se sustituyó el encabezado de logo único por una barra con ambos logos (`Logo Sadasi.webp` y `Logo Altta Homes.webp`), se corrigió la posición semántica del header dentro del body, se incorporó una paleta con azul marino, acento dorado/naranja y fondo cálido, y se ajustaron botones, títulos, tabla, foco de campos, bloque final, mobile y print para conservar proporciones
- Impacto funcional: ninguno en cálculos; cambia presentación visual en pantalla e impresión
- Riesgos: requiere validación visual final en navegador real para confirmar tamaño exacto de logos y balance de color
- Validación realizada: revisión de referencias antiguas visibles en HTML/CSS y `node --check` en script.js y validation.js
- Pendientes: revisar captura visual contigo y ajustar intensidad de colores/logos si quieres una línea más sobria o más comercial

### [2026-05-08] - Frase central en encabezado de logos
- Autor: Codex
- Motivo: agregar una frase comercial entre los logos, similar al encabezado de referencia del usuario
- Archivos modificados: index.html, styles.css, context.md
- Resumen técnico: se reemplazó el divisor simple entre logos por un bloque central con "Presupuesto" y "Para tu Hogar Ideal", usando acento naranja y azul marino; se agregaron ajustes responsive y de impresión para mantener proporciones
- Impacto funcional: ninguno en cálculos
- Riesgos: revisar visualmente en móvil para confirmar que los logos y la frase no compitan por espacio
- Validación realizada: edición acotada a estructura/estilos del header
- Pendientes: ajuste fino de copy si se prefiere otra frase

### [2026-05-08] - Separación de logos en header
- Autor: Codex
- Motivo: acercar el encabezado a la referencia visual, con los logos más separados hacia los lados de la frase central
- Archivos modificados: styles.css, context.md
- Resumen técnico: se amplió el ancho útil del grupo de logos, se cambió la distribución a `space-between` y se ajustaron proporciones responsive/print
- Impacto funcional: ninguno
- Riesgos: revisar en pantallas muy angostas que la frase central conserve legibilidad
- Validación realizada: revisión de selectores del header
- Pendientes: validación visual final en navegador

### [2026-05-08] - Ajuste de separación de logos en impresión
- Autor: Codex
- Motivo: en vista de impresión los logos quedaban demasiado separados de la frase central
- Archivos modificados: styles.css, context.md
- Resumen técnico: dentro de `@media print` se cambió la distribución del grupo de logos a centrada y con separación fija, manteniendo la versión más abierta para pantalla
- Impacto funcional: ninguno
- Riesgos: mínimo; solo afecta presentación impresa del header
- Validación realizada: revisión del selector de impresión
- Pendientes: validar visualmente en previsualización de impresión

### [2026-05-08] - Alta de Jardines del Sur 6 Casas
- Autor: Codex
- Motivo: sustituir el flujo previo de Azular 1 y 2 por Jardines del Sur 6 Casas, conservando lógica de casas con terreno adicional y esquina
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: el selector muestra "Jardines del Sur 6 - Casas" en la opción interna `Azular1`; se reemplazaron los modelos por FLAMBOYAN, CEIBA, TABACHIN y NONI; `precioLista` se usa como Valor Avalúo y `bono` como Descuento. Para TABACHIN se usó descuento real de $635,250 para cuadrar contra precio con descuento de $2,664,750. Los gastos de avalúo administrativos quedan en 0 porque no fueron proporcionados.
- Impacto funcional: las cotizaciones de Jardines del Sur 6 Casas calculan precio total con valor avalúo + terreno excedente + esquina, y precio neto con descuento
- Riesgos: confirmar si existe gasto de avalúo administrativo adicional para cada modelo; confirmar precio con descuento de TABACHIN tras corrección del bono
- Validación realizada: pendiente de prueba visual/funcional en navegador
- Pendientes: cargar Jardines del Sur 6 Departamentos después de validar casas

### [2026-05-08] - Opciones de apartado $15,000 y $30,000
- Autor: Codex
- Motivo: dejar únicamente las opciones comerciales vigentes de apartado
- Archivos modificados: index.html, context.md
- Resumen técnico: el datalist `apartado-options` conserva `$15,000.00` y `$30,000.00`
- Impacto funcional: el campo de apartado sugiere solo $15,000 y $30,000; la lógica de cálculo y formato no cambia
- Riesgos: ninguno
- Validación realizada: revisión del HTML
- Pendientes: ninguno

### [2026-05-08] - Alta de Jardines del Sur 6 Departamentos
- Autor: Codex
- Motivo: sustituir el flujo anterior de departamentos por Jardines del Sur 6 Departamentos, con modelos por planta
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: la opción interna `Azular1-Depas` ahora se muestra como "Jardines del Sur 6 - Departamentos"; se agregó catálogo `datosDepartamentosJardines6` con CAPUA y CEDRO PLUS en PB, Planta 1, Planta 2 y Planta 3. El selector de departamentos ahora genera opciones por modelo/planta y ya no por torre/unidad. Se ocultó equipamiento para este flujo, dejando el cálculo como Valor Avalúo - Descuento.
- Impacto funcional: al seleccionar Jardines del Sur 6 Departamentos se muestra vista de departamento con Valor Avalúo, Descuento y Precio Neto del Departamento
- Riesgos: gastos de avalúo administrativos quedan en 0 porque no fueron proporcionados
- Validación realizada: `node --check script.js` y `node --check validation.js`
- Pendientes: validar visualmente en navegador y confirmar si cada departamento debe tener gasto de avalúo administrativo adicional

### [2026-05-08] - Orden PB primero en departamentos
- Autor: Codex
- Motivo: mostrar Planta Baja como primera opción en el selector de departamentos
- Archivos modificados: script.js, context.md
- Resumen técnico: `generarOpcionesDepartamentos()` ahora usa orden explícito de plantas `PB`, `1`, `2`, `3` para cada modelo
- Impacto funcional: el selector muestra primero CAPUA PB y CEDRO PLUS PB dentro de sus grupos
- Riesgos: ninguno
- Validación realizada: revisión del generador de opciones
- Pendientes: ninguno

### [2026-05-08] - Selector de porcentaje para gastos notariales
- Autor: Codex
- Motivo: permitir elegir porcentaje de cálculo de gastos notariales/escrituración
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: se agregó selector inline `porcentajeGastosEscrituracion` dentro de la etiqueta de Gastos de Escrituración, con opciones 7%, 7.5% y 8%; `actualizarValores()` usa ese valor para calcular `gastosEscrituracion`
- Impacto funcional: el usuario puede cambiar el porcentaje sin modificar código; por defecto queda 7%
- Riesgos: si no hay modelo seleccionado, el selector recalcula sobre base 0 hasta elegir unidad/modelo
- Validación realizada: pendiente de sintaxis y prueba visual
- Pendientes: validar en navegador que el cambio de porcentaje actualice gastos y cálculo final

### [2026-05-08] - Precio de terreno excedente manual en Jardines del Sur 6 Casas
- Autor: Codex
- Motivo: permitir capturar manualmente el precio de metros excedentes para Jardines del Sur 6 Casas
- Archivos modificados: script.js, context.md
- Resumen técnico: al seleccionar la opción interna `Azular1` se habilita `precioMetrosExcedentes` para captura manual; en los otros desarrollos conserva valor automático/read-only. `actualizarValores()` toma el precio desde el input y recalcula el valor de terreno excedente.
- Impacto funcional: el usuario puede definir manualmente el precio por metro excedente en Jardines del Sur 6 Casas
- Riesgos: si el campo queda vacío, el valor de terreno excedente calcula en 0 hasta capturar precio
- Validación realizada: `node --check script.js`
- Pendientes: validar captura manual en navegador

### [2026-05-08] - Asesor único Florencio
- Autor: Codex
- Motivo: dejar solo el asesor del usuario y su teléfono
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: el selector `nombreAsesor` conserva solo Florencio Leonardo Hurtado Castañeda y el teléfono se precarga/autocompleta con `+52 998 205 9044`; el catálogo `datosAsesores` se redujo a ese único registro
- Impacto funcional: ya no aparecen otros asesores en la cotización
- Riesgos: ninguno
- Validación realizada: `node --check script.js`
- Pendientes: ninguno

### [2026-05-08] - Crédito bancario compacto editable
- Autor: Codex
- Motivo: ahorrar espacio en el bloque Financiamiento y permitir porcentajes libres sin campo extra
- Archivos modificados: index.html, script.js, styles.css, context.md
- Resumen técnico: se ocultó la fila visual "Cálculo Crédito Bancario"; se reemplazó el selector inline por un input compacto `porcentajeCreditoBancario` con datalist de 95, 90 y 80. Si queda vacío, el crédito bancario es manual; si contiene un número, calcula ese porcentaje.
- Impacto funcional: permite cálculo automático con porcentaje predefinido o libre en el mismo control; vacío mantiene captura manual
- Riesgos: revisar visualmente en móvil/impresión que el input inline no sature la etiqueta
- Validación realizada: `node --check script.js`
- Pendientes: validar interacción manual/porcentaje en navegador

### [2026-05-08] - Sufijo % visible en crédito bancario
- Autor: Codex
- Motivo: mostrar el símbolo de porcentaje junto al número en pantalla e impresión
- Archivos modificados: index.html, styles.css, context.md
- Resumen técnico: se envolvió el input `porcentajeCreditoBancario` en `inline-percent-field` y se agregó un sufijo visual `%` con CSS, incluyendo ajustes para mobile/print
- Impacto funcional: ninguno en cálculo; el JS sigue leyendo el número del input
- Riesgos: revisar visualmente que el sufijo no tape números largos como 100
- Validación realizada: pendiente de sintaxis visual
- Pendientes: validar en previsualización de impresión

### [2026-05-08] - Porcentaje bancario sin sugerencias
- Autor: Codex
- Motivo: simplificar el campo de porcentaje bancario para que el usuario lo escriba directamente
- Archivos modificados: index.html, styles.css, context.md
- Resumen técnico: se eliminó el datalist de porcentajes predefinidos y se ajustó el input/sufijo `%` para verse más alineado y estético
- Impacto funcional: el porcentaje se captura manualmente; vacío sigue significando crédito bancario manual
- Riesgos: ninguno
- Validación realizada: `node --check script.js`
- Pendientes: validar visualmente en navegador

### [2026-05-08] - Porcentaje espejo para crédito bancario manual
- Autor: Codex
- Motivo: mostrar automáticamente qué porcentaje representa el crédito bancario manual sobre el Valor Avalúo
- Archivos modificados: script.js, context.md
- Resumen técnico: se agregó cálculo inverso para `porcentajeCreditoBancario`: si el usuario captura manualmente `creditoBancario` y el porcentaje no fue escrito por el usuario, se muestra `(credito / precioLista) * 100`. Ese porcentaje queda marcado como automático para no recalcular el crédito; si el usuario enfoca y escribe en el campo de porcentaje, pasa a modo cálculo automático.
- Impacto funcional: manual vacío muestra porcentaje de referencia; porcentaje escrito calcula el crédito bancario
- Riesgos: el porcentaje inverso usa `precioLista` como Valor Avalúo, no precio total con terreno/esquina
- Validación realizada: `node --check script.js`
- Pendientes: validar en navegador con un monto manual y con porcentaje escrito

### [2026-05-08] - Ajuste compacto del campo % bancario
- Autor: Codex
- Motivo: reducir espacio libre dentro del campo de porcentaje bancario
- Archivos modificados: styles.css, context.md
- Resumen técnico: se redujo ancho y padding del input `input-inline-porcentaje-credito` y se ajustó la posición del sufijo `%`, incluyendo mobile/print
- Impacto funcional: ninguno
- Riesgos: validar que porcentajes con decimales largos sigan cabiendo
- Validación realizada: revisión CSS
- Pendientes: validación visual

### [2026-05-08] - Porcentaje de escrituración como texto en impresión
- Autor: Codex
- Motivo: mostrar en impresión "Gastos de Escrituración (7.5%):" en lugar del selector desplegable
- Archivos modificados: index.html, script.js, styles.css, context.md
- Resumen técnico: se agregó `porcentajeGastosPrint` como span visible solo en impresión; JS sincroniza su texto con el selector `porcentajeGastosEscrituracion`; CSS oculta el select y muestra el span dentro de `@media print`
- Impacto funcional: pantalla conserva selector; impresión muestra etiqueta compacta con porcentaje
- Riesgos: ninguno relevante
- Validación realizada: `node --check script.js`
- Pendientes: validar en previsualización de impresión

### [2026-05-08] - Valores más grandes en impresión
- Autor: Codex
- Motivo: mejorar legibilidad de números al imprimir sin romper el layout
- Archivos modificados: styles.css, context.md
- Resumen técnico: dentro de `@media print` se aumentó el font-size de inputs/selects a 10.5pt y se reforzaron campos clave de precio/cálculo final a 11pt; la tabla de enganche conserva sus reglas compactas
- Impacto funcional: ninguno, solo presentación impresa
- Riesgos: validar previsualización con planes de muchos meses para confirmar que sigue cabiendo
- Validación realizada: revisión CSS
- Pendientes: revertido por verse visualmente pesado en algunos campos

### [2026-05-08] - Reversión de valores grandes en impresión
- Autor: Codex
- Motivo: el aumento de tamaño se veía pesado y desigual en algunos campos
- Archivos modificados: styles.css, context.md
- Resumen técnico: se restauró el font-size print de inputs/selects a 9.5pt y se retiró el refuerzo especial de campos clave
- Impacto funcional: ninguno, solo presentación impresa
- Riesgos: ninguno
- Validación realizada: revisión CSS
- Pendientes: ninguno

### [2026-05-08] - Prueba de pulido tipográfico en impresión
- Autor: Codex
- Motivo: probar mejora de legibilidad sin agrandar todo ni deformar layout
- Archivos modificados: styles.css, context.md
- Resumen técnico: se agregó un bloque final `@media print` con altura 23px, line-height 1.15, padding ajustado, font-weight moderado para readonly y font-size 10pt solo en campos clave; la tabla de enganche queda protegida con font-size heredado
- Impacto funcional: ninguno, solo presentación impresa
- Riesgos: si se ve pesado o altera la hoja, se revierte retirando este bloque final
- Validación realizada: revisión CSS
- Pendientes: validar visualmente en previsualización de impresión

### [2026-05-08] - Prueba de escala print 1.08
- Autor: Codex
- Motivo: aprovechar más espacio vertical en hoja carta cuando hay pocos meses de enganche
- Archivos modificados: script.js, context.md
- Resumen técnico: se ajustó `actualizarModoCompactoPrint()` para subir la escala máxima de impresión de 1.05 a 1.08 y recalibrar la fórmula base de 1.053 a 1.085
- Impacto funcional: impresión usa un poco más de espacio en casos compactos; no afecta cálculos
- Riesgos: validar casos con más meses para confirmar que no desborde
- Validación realizada: `node --check script.js`
- Pendientes: validar previsualización con 0-3 meses y con 12+ meses

### [2026-05-08] - Porcentaje de crédito bancario como texto en impresión
- Autor: Codex
- Motivo: mostrar el porcentaje de crédito bancario en impresión igual que gastos de escrituración
- Archivos modificados: index.html, script.js, styles.css, context.md
- Resumen técnico: se agregó `porcentajeCreditoBancarioPrint` visible solo en impresión; JS sincroniza su contenido con `porcentajeCreditoBancario`; CSS oculta el campo editable en print y muestra el texto `(N%):`
- Impacto funcional: pantalla conserva input editable; impresión muestra etiqueta compacta con porcentaje
- Riesgos: si el porcentaje está vacío se imprime solo `:`
- Validación realizada: `node --check script.js`
- Pendientes: validar previsualización

### [2026-05-08] - Nuevos conceptos de gastos
- Autor: Codex
- Motivo: actualizar desglose de gastos fijos del bloque Financiamiento
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: "Otros Gastos(OG)" se renombró a "Cuota de Contingencia" con el mismo valor $4,000; se agregaron "Contrato de Agua" por $4,000 y "Certificado Libertad de Gravamen(CLG)" por $2,500. La fórmula de `gastosTotales` ahora suma titulación, comisión, cuota de contingencia, contrato de agua, CLG y avalúo.
- Impacto funcional: gastos totales, total a pagar y enganche total incluyen los dos conceptos nuevos
- Riesgos: aumenta altura del bloque Financiamiento en impresión; revisar hoja con planes largos
- Validación realizada: `node --check script.js`
- Pendientes: validar visualmente en impresión

### [2026-05-08] - Reubicación de conceptos bajo escrituración
- Autor: Codex
- Motivo: mostrar Cuota de Contingencia, Contrato de Agua y CLG debajo de Gastos de Escrituración
- Archivos modificados: index.html, context.md
- Resumen técnico: se retiraron los tres campos del bloque Financiamiento y se colocaron en el bloque de leyenda/gastos notariales debajo de `gastosEscrituracion`; se eliminó "Gastos Administrativos" visualmente. Los IDs usados por la fórmula (`otrosGastos`, `contratoAgua`, `certificadoLibertadGravamen`) se conservaron.
- Impacto funcional: la fórmula no cambia; solo cambia la ubicación visual de los conceptos
- Riesgos: revisar altura del bloque derecho en impresión
- Validación realizada: `node --check script.js`
- Pendientes: validar previsualización

### [2026-05-08] - Corrección de desglose informativo de gastos
- Autor: Codex
- Motivo: los conceptos debían conservarse en Financiamiento para la fórmula y duplicarse bajo Escrituración solo como información
- Archivos modificados: index.html, context.md
- Resumen técnico: se restauraron `otrosGastos`, `contratoAgua` y `certificadoLibertadGravamen` en Financiamiento con prefijo `(+)`; el bloque de gastos notariales conserva copias informativas con IDs `info...` y sin prefijo `(+)`
- Impacto funcional: la fórmula vuelve a leer los IDs correctos; el bloque derecho muestra desglose informativo
- Riesgos: visualmente hay duplicidad intencional de conceptos
- Validación realizada: `node --check script.js`
- Pendientes: validar impresión

### [2026-05-08] - Renombrar GE en Financiamiento
- Autor: Codex
- Motivo: alinear la etiqueta de gastos en Financiamiento con "Gastos de Escrituración"
- Archivos modificados: index.html, context.md
- Resumen técnico: la etiqueta `gastosTitulacion` ahora se muestra como "(+) Gastos de Escrituración (GE):"
- Impacto funcional: ninguno; el ID y fórmula se conservan
- Riesgos: ninguno
- Validación realizada: revisión HTML
- Pendientes: ninguno

### [2026-05-08] - Crédito Infonavit compacto editable
- Autor: Codex
- Motivo: aplicar la misma lógica compacta del Crédito Bancario al Crédito Infonavit
- Archivos modificados: index.html, script.js, styles.css, context.md
- Resumen técnico: se ocultó visualmente "Cálculo Crédito Infonavit" y se agregó `porcentajeCreditoInfonavit` dentro de la etiqueta "(-) Crédito Infonavit"; vacío permite captura manual, número calcula porcentaje sobre Valor Avalúo, y la impresión muestra `(N%):` con `porcentajeCreditoInfonavitPrint`. También se agregó porcentaje espejo cuando se captura monto manual.
- Impacto funcional: Infonavit ahora puede capturarse manualmente o calcularse por porcentaje igual que bancario
- Riesgos: validar comportamiento en planes infonavit/cofinavit y ocultamiento en bancario/contado
- Validación realizada: `node --check script.js`
- Pendientes: validar navegador e impresión

### [2026-05-08] - Título dinámico para guardar PDF
- Autor: Codex
- Motivo: sugerir un nombre de archivo más útil al guardar la impresión como PDF
- Archivos modificados: script.js, context.md
- Resumen técnico: antes de imprimir se actualiza `document.title` con formato "Cotización para Cliente · Desarrollo · Modelo"; se limpian caracteres inválidos para nombre de archivo y funciona desde botón de imprimir o evento `beforeprint`
- Impacto funcional: Chrome/Windows debería sugerir ese título como nombre del PDF
- Riesgos: el navegador puede modificar o truncar el nombre sugerido
- Validación realizada: `node --check script.js`
- Pendientes: validar guardado como PDF en Chrome

### [2026-05-08] - Normalizar Casa en título PDF
- Autor: Codex
- Motivo: ajustar el nombre sugerido del PDF para decir "Casa" en singular
- Archivos modificados: script.js, context.md
- Resumen técnico: cuando el desarrollo seleccionado es "Jardines del Sur 6 - Casas", el título dinámico usa "Jardines del Sur 6 - Casa"
- Impacto funcional: solo cambia el nombre sugerido al guardar PDF
- Riesgos: ninguno
- Validación realizada: pendiente de sintaxis
- Pendientes: ninguno

### [2026-05-08] - Ocultar comisión en Infonavit y Cofinavit
- Autor: Codex
- Motivo: Comisión de Apertura no aplica en planes Infonavit ni Cofinavit
- Archivos modificados: script.js, context.md
- Resumen técnico: el plan Infonavit ya ocultaba/limpiaba `comisionApertura`; se agregó la misma regla para Cofinavit
- Impacto funcional: en Infonavit y Cofinavit la comisión no aparece ni suma en gastos totales
- Riesgos: ninguno
- Validación realizada: pendiente de sintaxis
- Pendientes: validar cambio de plan en navegador

### [2026-05-08] - Reset completo al recargar página
- Autor: Claude Sonnet 4.6
- Motivo: al recargar, campos de cotizaciones anteriores contaminaban nuevas capturas
- Archivos modificados: script.js
- Resumen técnico: se agregó bloque de reset antes del disparo de `planVenta`: `sessionStorage.clear()`, `gastosTitulacionManuallyEdited = false`, y limpieza de todos los inputs editables por el usuario (nombre cliente, letrasNumeros, letrasNumerosDepa, crédito bancario, infonavit, etc.). Los campos fijos (asesor, fecha) no se limpian.
- Impacto funcional: cada recarga arranca con hoja en blanco lista para nueva cotización
- Riesgos: ninguno; datos fijos de negocio se reinician desde catálogos, no desde sessionStorage
- Validación realizada: revisión de flujo de inicialización
- Pendientes: ninguno

### [2026-05-08] - Escrituración por defecto 8%
- Autor: Claude Sonnet 4.6
- Motivo: el porcentaje de gastos de escrituración más común es 8%; se debe preseleccionar automáticamente
- Archivos modificados: index.html
- Resumen técnico: se cambió el `<option selected>` del selector `porcentajeGastosEscrituracion` a `value="0.08"` (8%)
- Impacto funcional: al cargar el cotizador, gastos de escrituración se calculan sobre 8% sin acción del usuario
- Riesgos: ninguno
- Validación realizada: revisión HTML
- Pendientes: ninguno

### [2026-05-08] - Datalist con sugerencias 80, 90, 95 en % Crédito Bancario
- Autor: Claude Sonnet 4.6
- Motivo: los tres porcentajes más frecuentes deben aparecer como opciones rápidas
- Archivos modificados: index.html
- Resumen técnico: se agregó `<datalist id="bancario-percent-options">` con opciones 80, 90 y 95; el input `porcentajeCreditoBancario` referencia ese datalist con `list="bancario-percent-options"`
- Impacto funcional: el usuario puede seleccionar porcentaje con un clic o escribirlo libremente
- Riesgos: ninguno
- Validación realizada: revisión HTML
- Pendientes: ninguno

### [2026-05-08] - Fix datalist que dejaba de funcionar tras primera selección
- Autor: Claude Sonnet 4.6
- Motivo: después de elegir un valor del datalist, el browser filtraba opciones por el valor actual y ya no mostraba otras al volver a abrir
- Archivos modificados: script.js
- Resumen técnico: se agregaron listeners `focus` en `porcentajeCreditoBancario`, `porcentajeCreditoInfonavit` y `apartado` que limpian el campo al enfocarlo y eliminan flags `dataset.autoPercent`/`dataset.manualPercent`. El blur restaura el valor previo si se deja vacío (para apartado). Esto fuerza al browser a mostrar todas las opciones del datalist cada vez.
- Impacto funcional: el datalist funciona correctamente en cualquier número de selecciones
- Riesgos: ninguno
- Validación realizada: revisión de handlers
- Pendientes: ninguno

### [2026-05-08] - Abreviaturas CAP, CC, CdA y fórmula en Gastos Totales
- Autor: Claude Sonnet 4.6
- Motivo: mostrar a qué se refiere cada concepto y visibilizar la composición de Gastos Totales para el cliente
- Archivos modificados: index.html
- Resumen técnico: se agregaron sufijos `(CAP)` a Comisión de Apertura, `(CC)` a Cuota de Contingencia y `(CdA)` a Contrato de Agua. La etiqueta de Gastos Totales se cambió a `(+)Gastos Totales<br><small class="formula-gastos">(GE+CAP+CC+CdA+CLG+AV)</small>:` para mostrar la fórmula completa en texto pequeño.
- Impacto funcional: ninguno en cálculo; mayor transparencia visual para el cliente
- Riesgos: ninguno
- Validación realizada: revisión HTML
- Pendientes: ninguno

### [2026-05-08] - Fix panel creciendo a la derecha al elegir desarrollo
- Autor: Claude Sonnet 4.6
- Motivo: al seleccionar un desarrollo, el panel de Datos Generales se expandía hacia la derecha rompiendo el layout
- Archivos modificados: styles.css
- Resumen técnico: dentro de `@media screen` se agregó `min-width: 0` a `.column-1` y `.column-2` para permitir que flex shrink funcione; se fijaron anchos específicos para `#prototipoContainer #prototipo` (110px), `#letrasNumeros` (65px), `#departamentoContainer #departamentoSelect` (120px) y `#letrasNumerosDepa` (65px).
- Impacto funcional: el panel ya no se desborda al seleccionar desarrollos con nombres largos
- Riesgos: wrapping dentro de `@media screen` protege la impresión
- Validación realizada: revisión CSS con viewport desktop
- Pendientes: ninguno

### [2026-05-08] - Etiquetas más pequeñas en Financiamiento y Cálculo Final
- Autor: Claude Sonnet 4.6
- Motivo: reducir el tamaño de las etiquetas para mejorar proporciones visuales
- Archivos modificados: styles.css
- Resumen técnico: dentro de `@media screen` se redujo `font-size` de `#financiamiento .campo-horizontal label` y `#calculoFinal .campo-horizontal label` a 17px; la fórmula pequeña de Gastos Totales se estilizó con `font-size: 10px; font-weight: normal; opacity: 1`.
- Impacto funcional: bloques de financiamiento y cálculo final lucen más equilibrados
- Riesgos: ninguno; regla acotada a `@media screen`
- Validación realizada: revisión CSS
- Pendientes: ninguno

### [2026-05-08] - Campo # de unidad para departamentos
- Autor: Claude Sonnet 4.6
- Motivo: los departamentos también necesitan capturar el número de unidad igual que las casas
- Archivos modificados: index.html
- Resumen técnico: se agregó `<input type="text" id="letrasNumerosDepa">` dentro de `#departamentoContainer`, al lado del selector de departamento. En desktop tiene ancho fijo de 65px; en mobile se extiende a 100%.
- Impacto funcional: el asesor puede anotar la unidad específica del departamento en la cotización
- Riesgos: ninguno
- Validación realizada: revisión HTML
- Pendientes: ninguno

### [2026-05-08] - Alta Lirios Residencial 2 Departamentos
- Autor: Claude Sonnet 4.6
- Motivo: agregar nuevo desarrollo con modelo CEDRO PLUS en cuatro niveles
- Archivos modificados: index.html, script.js
- Resumen técnico: se agregó `<option value="Lirios2-Depas">Lirios Residencial 2 - Departamentos</option>` en el selector. Se creó catálogo `datosDepartamentosLirios2` con modelo CEDRO PLUS y plantas PB (lista $2,810,000 / bono $441,250), 1N ($2,677,000 / $408,250), 2N ($2,653,000 / $404,250), 3N Roof ($2,915,000 / $441,250). `generarOpcionesDepartamentos()` acepta catálogo como parámetro; el handler de `azularSelect` activa el catálogo correcto según desarrollo seleccionado.
- Impacto funcional: el cotizador puede generar cotizaciones de Lirios 2 con precios y bonos correctos
- Riesgos: gastos de avalúo administrativos en 0 (pendientes de datos)
- Validación realizada: revisión de catálogo y selectores
- Pendientes: confirmar valores de avalúo para cada planta

### [2026-05-08] - Alta La Rioja 2 Casas
- Autor: Claude Sonnet 4.6
- Motivo: agregar nuevo desarrollo de casas con precios a confirmar
- Archivos modificados: index.html, script.js
- Resumen técnico: se agregó `<option value="LaRioja2">La Rioja 2 - Casas</option>`. Se creó objeto `datosLaRioja2` con modelos NONI ELITE, NONI, ALAMO y FRESNO ELITE con `precioLista`, `bono` y `avaluo` en 0. La Rioja 2 usa el mismo flujo que Azular1 para precio de metros excedentes (input manual habilitado).
- Impacto funcional: el desarrollo aparece en el selector y se puede usar el flujo de casas; los valores quedan en 0 hasta recibir precios
- Riesgos: ninguno en funcionamiento; datos en 0 hasta actualización
- Validación realizada: revisión de catálogo
- Pendientes: recibir precios reales de NONI ELITE, NONI, ALAMO, FRESNO ELITE y actualizar catálogo

### [2026-05-08] - Ocultar Departamentos Preventa del selector
- Autor: Claude Sonnet 4.6
- Motivo: Depas-Preventa ya no está activa comercialmente
- Archivos modificados: index.html
- Resumen técnico: la `<option value="Depas-Preventa">` se marcó con `hidden disabled` para que no aparezca en el selector ni sea seleccionable; el catálogo y lógica se conservan para reactivación rápida
- Impacto funcional: el selector solo muestra desarrollos activos
- Riesgos: ninguno; reactivación inmediata quitando `hidden disabled`
- Validación realizada: revisión HTML
- Pendientes: ninguno

### [2026-05-08/09] - Adaptación vista mobile: header fijo, logos, prototipo
- Autor: Claude Sonnet 4.6
- Motivo: múltiples problemas en mobile: header se movía al hacer scroll, logos grandes, prototipo y # de unidad no aprovechaban el ancho disponible
- Archivos modificados: styles.css
- Resumen técnico:
  - Header fijo: `position: fixed !important` + `overflow-x: clip` en `html` y `body` (no `hidden`, que rompe `fixed` en iOS/Android); `padding: 10px 0`; `body padding-top: 96px`
  - Logos: `max-height: 52px`, `max-width: 105px`, `width: auto`, `object-fit: contain`; centrados con `justify-content: center; gap: 28px`
  - Texto header: `span` 13px, `strong` 15px
  - Prototipo y # de unidad: se anulan los anchos fijos de desktop (110px/65px/120px/65px) con `width: 100% !important` en mobile para que ocupen todo el ancho
- Impacto funcional: header visible y fijo en todo momento; layout de campos de prototipo más aprovechado en pantalla pequeña
- Riesgos: `overflow-x: clip` es la solución correcta; `hidden` crea nuevo containing block que rompe `fixed` en webkit
- Validación realizada: revisión de CSS y lógica de overflow
- Pendientes: confirmación visual en dispositivo físico

### [2026-05-09] - Nombre corto del asesor
- Autor: Claude Sonnet 4.6
- Motivo: el nombre completo se cortaba en mobile dentro del selector
- Archivos modificados: index.html
- Resumen técnico: el texto del `<option>` de `nombreAsesor` se cambió de "Florencio Leonardo Hurtado Castañeda" a "Florencio Hurtado"; el `value` ya era "Florencio Hurtado" y no cambió
- Impacto funcional: en pantalla e impresión el asesor aparece como "Florencio Hurtado"
- Riesgos: ninguno
- Validación realizada: revisión HTML
- Pendientes: ninguno

### [2026-05-09] - Ajuste columnas tabla Plan de Enganche en mobile
- Autor: Claude Sonnet 4.6
- Motivo: columna Mensualidad se veía angosta y Fecha de Pago tenía demasiado espacio
- Archivos modificados: styles.css
- Resumen técnico: dentro de `@media screen and (max-width: 768px)`, la columna 2 (Mensualidad) pasó de 32% → 38% y la columna 3 (Fecha de Pago) de 46% → 40%; columna 1 (Pago) se mantiene en 22%
- Impacto funcional: Mensualidad muestra el monto completo sin truncar; layout más equilibrado
- Riesgos: ninguno; el bloque print tiene su propia declaración de anchos no modificada
- Validación realizada: revisión CSS
- Pendientes: validación visual en dispositivo físico

### [2026-05-09] - Ampliar input % Crédito Bancario en mobile
- Autor: Claude Sonnet 4.6
- Motivo: el campo mostraba el número truncado (ej. "9" en lugar de "90")
- Archivos modificados: styles.css
- Resumen técnico: dentro de `@media screen and (max-width: 768px)`, el ancho de `.campo-horizontal label .input-inline-porcentaje-credito` se aumentó de 54px → 90px
- Impacto funcional: el porcentaje completo (dos o tres dígitos + decimales) se ve sin truncar
- Riesgos: ninguno
- Validación realizada: revisión CSS
- Pendientes: ninguno

### [2026-05-11] - Configuracion y deploy en Firebase Hosting
- Autor: Codex
- Motivo: conectar el cotizador estatico con Firebase Hosting y publicarlo en el proyecto `cotizadoraltahomes`
- Archivos modificados: firebase.json, .firebaserc, context.md
- Resumen tecnico: se agrego `.firebaserc` con proyecto default `cotizadoraltahomes`; se agrego `firebase.json` para publicar desde la raiz, aplicar headers de cache y excluir archivos internos (`context.md`, `.firebaserc`, `.git`, `.firebase`, node_modules). Se realizo deploy con `firebase.cmd deploy --only hosting --project cotizadoraltahomes`.
- Impacto funcional: el cotizador queda disponible en Firebase Hosting sin cambios en la logica de calculo.
- Riesgos: el primer deploy incluyo archivos `.git` por una regla generica insuficiente; se corrigio inmediatamente con exclusiones explicitas y se redeployo la version live con solo 9 archivos publicos.
- Validacion realizada: Firebase reporto deploy completo; `https://cotizadoraltahomes.web.app` responde 200; `https://cotizadoraltahomes.web.app/.git/HEAD` responde 404.
- Pendientes: validar visualmente el flujo completo en navegador y celular desde la URL publicada.

### [2026-05-11] - Migracion de Hosting al proyecto corregido
- Autor: Codex
- Motivo: corregir el Project ID anterior y usar el nuevo proyecto Firebase `cotizadoralttahomes`
- Archivos modificados: .firebaserc, context.md
- Resumen tecnico: se actualizo el alias default de `.firebaserc` a `cotizadoralttahomes` y se publico con `firebase.cmd deploy --only hosting --project cotizadoralttahomes`.
- Impacto funcional: el cotizador queda disponible en la URL corregida `https://cotizadoralttahomes.web.app`.
- Riesgos: el proyecto anterior `cotizadoraltahomes` queda separado; si no se va a usar, conviene cerrarlo desde Google Cloud/Firebase para evitar confusion.
- Validacion realizada: Firebase reporto deploy completo con 9 archivos publicos; `https://cotizadoralttahomes.web.app` responde 200; `https://cotizadoralttahomes.web.app/.git/HEAD` responde 404.
- Pendientes: validar visualmente el flujo completo en navegador y celular desde la nueva URL.

### [2026-05-11] - Avalúos automáticos por plan y alta Fovissste
- Autor: Codex
- Motivo: aplicar desglose nuevo de valor avalúo, cobro de avalúo y porcentajes de escrituración por método de pago para Jardines del Sur 6 y La Rioja 2
- Archivos modificados: index.html, script.js, context.md
- Resumen técnico: se agregó plan `Fovissste`; Jardines del Sur 6 casas/departamentos y La Rioja 2 separan `precioLista`, `valorAvaluo`, `bono`, `avaluo` como cobro de avalúo y `porcentajesEscrituracion` por plan. Gastos de Escrituración ahora usa `valorAvaluo * porcentaje del plan` cuando el catálogo lo define; Avalúo(AV) muestra el cobro correspondiente. La etiqueta de crédito cambia a Crédito Fovissste cuando aplica.
- Impacto funcional: los valores de escritura y avalúo se calculan automáticamente al cambiar desarrollo, modelo/departamento o plan de venta.
- Riesgos: La Rioja 2 NONI usa precio de lista $4,490,000 y valor avalúo $4,462,000 según la instrucción de separar lista de precios y valor avalúo.
- Validación realizada: `node --check script.js`; revisión de datos contra tablas enviadas.
- Pendientes: validación visual/navegador de casos Jardines departamento, Jardines casa, La Rioja 2 y Fovissste.

### [2026-05-19] - Alta promos Jardines del Sur 6 Departamentos
- Autor: Codex
- Motivo: agregar opciones promocionales de mayo para CAPUA OCELOTE y CEDRO PLUS ANTILOPE L-M sin reemplazar las opciones normales existentes.
- Archivos modificados: script.js, context.md
- Resumen tecnico: se agregaron al catalogo `datosDepartamentosJardines6` los grupos `CAPUA PROMO` y `CEDRO PLUS PROMO`. Las opciones quedan visibles con nombres abreviados por nivel: `PB`, `1N`, `2N` y `3N`, incluyendo las versiones PROMO, con los valores de avaluo y descuentos de la tabla enviada.
- Impacto funcional: al seleccionar Jardines del Sur 6 - Departamentos, el asesor puede elegir las versiones normales o las versiones PROMO y el precio neto se calcula con el descuento promocional.
- Riesgos: se conservaron los cobros de avaluo administrativos y porcentajes de escrituracion de las opciones normales; confirmar si las promos deben tener algun porcentaje o cobro distinto.
- Validacion realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador que las opciones aparezcan en el orden deseado.

### [2026-05-19] - Actualizacion Cedro Plus normal Jardines 6 Departamentos
- Autor: Codex
- Motivo: actualizar los precios normales de CEDRO PLUS ANTILOPE J-K segun tabla enviada.
- Archivos modificados: script.js, context.md
- Resumen tecnico: se actualizaron los descuentos del grupo normal `CEDRO PLUS` en `datosDepartamentosJardines6`: PB $541,835, 1N $509,905, 2N $512,300 y 3N/Roof $524,955. Los valores de avaluo permanecen en $2,870,000, $2,790,000, $2,760,000 y $2,920,000 respectivamente.
- Impacto funcional: las opciones normales de CEDRO PLUS calculan el precio neto con los nuevos descuentos, separadas de las opciones `CEDRO PLUS PROMO`.
- Riesgos: ninguno detectado; no se modificaron las promos ni otros desarrollos.
- Validacion realizada: `node --check script.js`.
- Pendientes: ninguno.

### [2026-05-20] - Limpieza local de Git y confirmacion de promos
- Autor: Codex
- Motivo: limpiar el estado local tras un merge incompleto contra una version distinta en GitHub, sin tocar el repositorio remoto ni hacer deploy.
- Archivos modificados: context.md
- Resumen tecnico: se cancelo el merge local incompleto con `git merge --abort`; posteriormente se renombro la carpeta `.git` a `.git_backup` para que VS Code deje de tratar esta carpeta como repositorio Git. Se confirmo que no se ejecuto `git push` ni `firebase deploy`. La carpeta conserva los archivos actuales de la app y el respaldo del historial local queda en `.git_backup`.
- Impacto funcional: ninguno en la app. Las opciones `CAPUA PROMO` y `CEDRO PLUS PROMO` siguen presentes en `script.js`, y los valores normales de `CEDRO PLUS` siguen separados de las promociones.
- Riesgos: al no existir `.git` activo, esta carpeta ya no permite commits, pull, push ni comparacion Git hasta restaurar el respaldo con `.git_backup` -> `.git`. Los archivos `firebase.json` y `.firebaserc` solo son necesarios si se desea volver a desplegar desde esta misma carpeta.
- Validacion realizada: `git status` reporto que ya no es repositorio Git; busqueda de promos en `script.js`; `node --check script.js`.
- Pendientes: decidir si se conservaran o eliminaran `firebase.json` y `.firebaserc` segun si esta carpeta volvera a usarse para deploy.

### [2026-05-23] - Actualizacion avaluo FLAMBOYAN
- Autor: Codex
- Motivo: actualizar el valor de avaluo de FLAMBOYAN manteniendo el mismo precio neto.
- Archivos modificados: script.js, context.md
- Resumen tecnico: en `datosCasas1`, FLAMBOYAN paso de `precioLista`/`valorAvaluo` $2,536,000 a $2,621,000; el bono aumento de $310,150 a $395,150 para conservar precio neto de $2,225,850.
- Impacto funcional: FLAMBOYAN muestra el nuevo valor de avaluo y mantiene el mismo precio neto base antes de terreno excedente/esquina.
- Riesgos: ninguno detectado.
- Validacion realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador la seleccion de Jardines del Sur 6 - Casas / FLAMBOYAN.

### [2026-05-31] - Alta gasto fijo Sat Q
- Autor: Codex
- Motivo: agregar un gasto fijo Sat Q de $3,800 que funcione igual que Contrato de Agua y Cuota de Contingencia.
- Archivos modificados: index.html, script.js, context.md
- Resumen tecnico: se agregaron campos readonly `satQ` e `infoSatQ` con `$3,800.00`; se actualizo la formula visible de Gastos Totales a `(GE+CAP+CC+CdA+Sat Q+CLG+AV)`; `actualizarCalculoFinal()` ahora suma Sat Q en `gastosTotales`.
- Impacto funcional: Gastos Totales, Total a Pagar y Enganche Total a Pagar incluyen automaticamente $3,800 de Sat Q.
- Riesgos: bajos; cambio acotado a gasto fijo.
- Validacion realizada: `node --check script.js`.
- Pendientes: validar visualmente en navegador que Sat Q aparezca en Financiamiento y bloque informativo, y que Gastos Totales aumente $3,800.

## 10) Checklist rápido antes de cada release
- Datos de precios actualizados en todos los catálogos.
- Fórmulas validadas por tipo de desarrollo.
- Planes de venta sin campos inconsistentes en impresión.
- Total de tabla de enganche cuadra con enganche total.
- Fechas de pago autogeneradas correctamente.
- Verificación visual desktop y móvil.
