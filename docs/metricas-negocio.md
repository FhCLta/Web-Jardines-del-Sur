# Métricas del negocio — bitácora para cruzar datos

> **Para qué existe:** hoy los números viven repartidos en cuatro paneles que no
> se hablan entre sí — Google Ads, Meta, Search Console y el CRM. Este documento
> los junta en un solo lugar y con el mismo formato, para poder responder la
> pregunta que de verdad importa:
>
> **¿qué fuente produce COMPRADORES, no clics?**
>
> Es también la semilla de la integración con el CRM: la estructura de abajo está
> pensada para que esos datos se puedan cargar después sin rehacerla.

---

## 1. Resultados de venta

**Inicio en la empresa: 18 de mayo de 2026.**

| Periodo | Ventas | Escrituras | Posición en el equipo |
|---|---|---|---|
| Acumulado a la fecha (< 3 meses) | **15** | **11** | — |
| Junio 2026 | — | — | **1er lugar** 🥇 |
| Julio 2026 | — | — | **1er lugar** 🥇 |
| Agosto 2026 | en curso | en curso | mes bajo (obra de casa propia + mudanza) |

> Pendiente de desglosar ventas y escrituras **por mes** y **por desarrollo**.
> Ese desglose es el que permite cruzar contra el gasto publicitario del mismo
> periodo.

---

## 2. Rendimiento por fuente — el hueco que hay que llenar

Hoy se sabe **cuántos leads** trae cada fuente, pero **no cuántos compran**. Esa
es la métrica que falta y la razón principal para conectar el CRM.

| Fuente | Leads | Citas | Ventas | Escrituras | Costo/venta |
|---|---|---|---|---|---|
| Google Ads | ? | ? | ? | ? | ? |
| Meta Ads | ? | ? | ? | ? | ? |
| SEO / orgánico | ? | ? | ? | ? | ? |
| Referidos / directo | ? | ? | ? | ? | ? |

**Por qué importa:** una fuente puede traer muchos leads baratos que no cierran,
y otra pocos leads caros que sí. Sin esta tabla, el presupuesto se asigna por
costo por conversación — que es una señal incompleta.

### Lo que ya se sabe (Google Ads, poda de julio 2026)

Las búsquedas por **nombre de desarrollo** convierten muchísimo mejor que las de
marca:

| Keyword | CPA |
|---|---|
| `[oficina de ventas jardines del sur 6]` | **$0.47** |
| `[jardines del sur 6]` | **$87** |
| `[altta homes cancun]` | $435 (defensa de marca) |

Línea base de CPA sana: **$87–105**. Presupuesto: $150/día (tope).

---

## 3. Métricas del sitio (Search Console)

### Migración de dominio — `jardinesdelsurcancun.mx` → `alttahomescancun.mx`

Cambio de dirección iniciado el **20 jun 2026** (Google honra la señal ~180 días,
hasta ~mediados de diciembre).

| Ventana de 3 meses | Dominio viejo | Dominio nuevo |
|---|---|---|
| Clics | 149 | **265** |
| Impresiones | 8,260 | 6,710 |
| CTR | 1.8% | **4.0%** |
| Posición media | 8.2 | 8.4 |

**Conclusión (12 ago 2026): la migración salió bien.** Más clics en menos tiempo,
CTR duplicado, misma posición. **No re-litigar el cambio de dominio.**

### Consultas clave

| Consulta | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| jardines del sur 7 | 51 / 30 | 107 / 79 | **47.7%** | **1.32** |
| jardines del sur 7 cancun | 8 / 10 | 12 / 14 | **66.7%** | **1.21** |
| altta homes cancun | 26 | 174 | 14.9% | — |
| jardines del sur 6 | 14 | 584 | 2.4% | — |

> Los pares de cifras vienen de dos lecturas distintas (Search Console a 3 meses
> y el reporte de posiciones). Conviene fijar **una sola ventana** en las
> próximas actualizaciones para que las series sean comparables.

### Frentes a recuperar tras la migración

| Consulta | Antes | Ahora | Estado |
|---|---|---|---|
| `jardines del sur 6` | 1,476 impresiones | 584 | ⏳ recuperando |
| Lirios + La Rioja | 18 clics | 6 | ⏳ recuperando |

El CTR de "jardines del sur 6" **mejoró** (2.4% vs 1.8%): falta visibilidad, no
atractivo. Las tres páginas nuevas ya indexadas (`/promociones`,
`/la-rioja-2/promociones`, `/jardines-del-sur-6/departamentos`) atacan justo esos
frentes.

---

## 4. Datos que aportaría el CRM

El CRM de Florencio es **desarrollado a la medida, con código propio** (no es un
producto comprado). Ahí viven las métricas que aquí faltan:

- **% de cierre** por etapa y por fuente
- **Efectividad** por tipo de prospecto
- Tiempo del ciclo: primer contacto → cita → apartado → escrituración
- Motivos de pérdida

**El objetivo de la integración:** cerrar el círculo desde el anuncio hasta la
escritura, para poder decir con datos *"la campaña A produjo 32 leads, 8 citas y
3 ventas"* en lugar de solo *"32 conversaciones"*.

**Pendiente de definir antes de integrar:** con qué está hecho el CRM, si expone
API o base de datos, y qué identificador común permitiría cruzar un lead del
sitio con un registro del CRM.

---

## Cómo mantener esto

- **Mensual:** agregar la fila de ventas y escrituras del mes.
- **Al cambiar campañas:** anotar el CPA y qué se modificó (el detalle fino vive
  en `google-ads.md`).
- **Trimestral:** actualizar las cifras de Search Console con la **misma ventana**
  de tiempo, para que las series se puedan comparar.

Regla: **si un número no se puede comparar contra el mismo número del periodo
anterior, no sirve.** Mejor pocas métricas consistentes que muchas sueltas.
