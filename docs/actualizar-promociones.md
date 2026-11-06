# Cómo actualizar las promociones del mes

**Regla de oro: se edita UN solo archivo y se actualizan TODAS las páginas.**
No hay que tocar el hub, ni el sitemap, ni los enlaces. Todo se alimenta del
mismo lugar.

---

## 1. El único archivo que se edita

```
app/(desarrollos)/_lib/dev-content.ts
```

Dentro de cada desarrollo hay un bloque `promos`. Hoy (nov 2026) lo tienen
los tres que se venden: `jardines-del-sur-6`, `la-rioja-2` y
`lirios-residencial-2`.

```ts
promos: {
  updatedLabel: "Promociones vigentes · agosto 2026",   // ← el mes
  vence: "2026-08-31",                                    // ← último día (AAAA-MM-DD)
  nota: "Los minisplits no incluyen instalación. …",     // ← letra chica
  items: [
    {
      modelo: "Modelo Capua",                 // como se ve en la tarjeta
      modeloSlug: "departamento-capua",       // slug de la ficha del modelo
      ubicaciones: "Jardines del Sur 6 · Ocelote N, O, P y Q",
      beneficios: ["2 minisplits de 12,000 BTU"],   // una línea por beneficio
      vigencia: "31 de agosto de 2026",
    },
  ],
},
```

### Qué actualizar cada mes

1. **`updatedLabel`** → el mes nuevo. Se ve como insignia dorada en el hero.
2. **`vence`** → el último día del mes de la promoción, en `AAAA-MM-DD`. Es el
   que manda en el aviso con cuenta regresiva de las tarjetas (ver abajo).
3. **`vigencia`** de cada item → la fecha nueva, escrita para el cliente.
4. **`items`** → agrega, borra o cambia las promociones que correspondan.
5. **`ubicaciones`** → las manzanas/lotes/unidades del mes.

### Reglas de contenido

- **`modeloSlug` debe existir.** Es lo que activa los botones "Ver el modelo" y
  "Cotizar ahora". Si no coincide con una ficha real, el botón lleva a un 404.
  Los slugs válidos salen del inventario: `departamento-capua`, `casa-noni`,
  `casa-modelo-alamo`, `casa-noni-elite`, etc.
- **No pongas jerga interna.** "Sign up" o "certificado" no le dicen nada al
  cliente. En la web se escribe **"al firmar tu expediente de venta dentro del
  mes de vigencia"**.
- **Un beneficio por línea** en `beneficios`. Se pintan como lista con viñeta.

---

## 2. Qué se actualiza solo (no lo toques)

Al editar ese archivo, se actualizan **a la vez**:

| Página | Qué muestra |
|---|---|
| `/promociones` | El hub: todas las promos agrupadas por desarrollo |
| `/jardines-del-sur-6/promociones` | Solo las de ese desarrollo |
| `/la-rioja-2/promociones` | Solo las de ese desarrollo |
| `sitemap.xml` | Las entradas de promociones |
| Silo de cada desarrollo | El enlace "Ver promociones →" |
| Tarjeta de cada modelo con promoción (en todas las páginas donde salga) | Insignia "Promoción [mes]", panel con cuenta regresiva y botón "Pregunta por la promoción" |

Además:

- **El aviso de las tarjetas se apaga solo.** Cuenta hacia `vence` y al pasar
  la medianoche de ese día (hora de Cancún) desaparece del navegador del
  cliente aunque la web no se haya vuelto a publicar; el botón regresa a
  "Cotizar ahora". No vuelve a salir hasta que se carguen las del mes nuevo con
  otro `vence`. A propósito no dice CUÁL es la promoción: invita a preguntar
  por WhatsApp. Lleva "Aplican restricciones" y la vigencia, que Altta exige en
  toda publicación digital, y "En unidades seleccionadas" cuando la promoción
  no es de todos los lotes. Código: `app/(desarrollos)/_lib/promo-tarjeta.ts`
  y `components/PropertyCard.jsx`.
- **Un desarrollo aparece o desaparece solo.** Si le agregas un bloque `promos`
  a Lirios, entra al hub, al sitemap y a su propio silo sin tocar nada más. Si
  se lo quitas, desaparece de todos lados.
- **La insignia del mes en el hub** solo se muestra si los desarrollos coinciden
  en `updatedLabel`. Si uno dice agosto y otro julio, se oculta en vez de
  mentirle a la mitad de las promociones. Es una señal de que se te olvidó
  actualizar uno.

---

## 3. Si la promoción cambia el PRECIO

Ojo: hay dos tipos de promoción y se manejan distinto.

| Tipo | Ejemplo | Dónde va |
|---|---|---|
| **Regalo / equipamiento** | minisplits, paquete de paneles | Solo en `dev-content.ts`. **No toca el cotizador.** |
| **Descuento sobre el precio** | "Descuento de $50,000" | En `dev-content.ts` **y además** en `data/precios.json` |

⚠️ **Descuento en un departamento:** `promocion.bono_extra` solo existe para
casas (en departamentos "PROMO" ya es la vista). El cotizador todavía no puede
ofrecer un descuento de departamento como opción; mientras no se construya,
el asesor lo captura a mano en el bono. Caso real: Capua de Jardines del Sur 6,
noviembre 2026 (−$40,000).

Un descuento real es una variante de precio, así que también va en la fuente
única de precios:

```bash
# 1. editar data/precios.json  (campo `promocion: { bono_extra: 50000 }`)
# 2. regenerar el catálogo del cotizador
node scripts/gen-cotizador-precios.mjs
# 3. verificar que web y cotizador siguen cuadrando
node scripts/check-precios.mjs
```

### ⚠️ REGLA: cuando un descuento vence, hay que quitarlo del cotizador

**Publicar un descuento es la mitad del trabajo. La otra mitad es retirarlo el
día que vence.** Si no se quita, el cotizador sigue ofreciendo esa variante y le
cotizas a un cliente **un precio que ya no existe** — y lo peor es que nadie se
entera hasta que hay que sostener ese número frente a él.

No es hipotético: en agosto de 2026 el cotizador todavía traía `NONI PROMO`
(Jardines 6) y `FRESNO ELITE PROMO` (La Rioja 2), ambas con −$50,000, cuando
ninguna de las dos seguía en la hoja del mes. Se detectaron al comparar la hoja
contra el catálogo.

**Cómo se retira:**

```bash
# 1. en data/precios.json, borrar el campo `promocion` de ese modelo
# 2. regenerar y verificar
node scripts/gen-cotizador-precios.mjs
node scripts/check-precios.mjs
```

Quitar la variante **no mueve el precio público**: la web siempre publica la
variante base, así que `check-precios.mjs` debe seguir dando "TODO EN ORDEN" y
los precios del sitio no deben cambiar ni un peso. Si cambian, algo se hizo mal.

**Al revés también aplica:** el descuento que aparece nuevo en la hoja del mes
hay que darlo de alta en `precios.json`, no solo en la tarjeta de la web. Si no,
la página promete un descuento que el cotizador no aplica.

> **Regla corta:** cada mes, antes de publicar, compara la hoja de promociones
> contra las variantes `promocion` de `data/precios.json`. Lo que no esté en la
> hoja, se quita. Lo que esté y falte, se agrega.

---

## 4. Publicar

```bash
npm run build
firebase deploy --only hosting
```

### Antes de dar por terminado

- Abre `/promociones` y confirma que están las promociones nuevas y **ninguna
  vencida**.
- Revisa que la insignia del mes diga el mes correcto.
- Prueba un botón "Cotizar ahora" (que abra WhatsApp con el mensaje correcto) y
  uno de "Ver el modelo" (que no dé 404).
- **Compara la hoja del mes contra las variantes `promocion` de
  `data/precios.json`**: lo que ya no esté en la hoja hay que retirarlo, o el
  cotizador seguirá ofreciendo un precio vencido (ver la regla de la sección 3).
- Si hubo cambios de precio, corre `node scripts/check-precios.mjs`.

### Search Console

Solo hace falta pedir indexación cuando **creas una página nueva** (por ejemplo,
el día que Lirios estrene promociones). Para cambios de contenido en páginas que
ya existen, Google las revisita solo.

---

## 5. Por qué el hub no es un copy-paste

`/promociones` tiene título genérico, entradilla propia y preguntas frecuentes
que las otras dos no tienen. **Eso es a propósito**: si las tres páginas fueran
casi iguales, Google elegiría una y hundiría las demás. El hub ataca búsquedas
de ciudad ("promociones casas en Cancún") y las de desarrollo atacan las de
marca ("promociones jardines del sur 6").

Si algún día agregas contenido al hub, que sea contenido **propio** — no copies
texto de las páginas por desarrollo.
