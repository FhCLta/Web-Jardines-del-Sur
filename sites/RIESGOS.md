# Riesgos de publicar un segundo sitio en `jardinesdelsurcancun.com.mx`

Análisis hecho el **14 ago 2026**, revisando el código real del proyecto (no
genérico). 16 riesgos identificados: **4 altos, 7 medios, 5 bajos.**

**Resumen en una línea:** el riesgo grande es de SEO y de medición, y **casi
todo se neutraliza con dos decisiones** — publicar el sitio 2 con `noindex` y
separarle el seguimiento.

---

## 🔴 RIESGOS ALTOS

### R1 · Canibalizar el primer lugar que ya tienes

**Qué pasa:** `alttahomescancun.mx` es hoy **#1 en Google para "jardines del sur
7"** — 51 clics con 107 impresiones = **47.7% de CTR**, y 66.7% en "jardines del
sur 7 cancun" (Search Console, 3 meses al 12 ago 2026). Si el sitio 2 publica
las mismas páginas de forma indexable, Google ve dos sitios del mismo dueño
compitiendo por el mismo término, **elige uno y hunde el otro**.

**Por qué duele especialmente:** Jardines del Sur 7 **abre venta en
septiembre-octubre 2026**. Ese primer lugar es el activo orgánico más valioso
del negocio justo antes de su mejor momento. Perderlo por competir contra uno
mismo sería el peor resultado posible.

**Mitigación:** `noindex` en el sitio 2. Riesgo eliminado, no reducido.
Alternativa: canónica cruzada apuntando al sitio 1 (consolida en vez de
competir), pero es una *sugerencia* para Google, no una orden — `noindex` sí es
vinculante.

---

### R2 · Sitemap y robots del sitio 2 apuntando al sitio 1

**Qué pasa:** `app/sitemap.ts` y `app/robots.ts` construyen todas las URLs con
`SITE_URL`. Si el sitio 2 se compila sin cambiar esa variable, publicaría en
`jardinesdelsurcancun.com.mx/sitemap.xml` **una lista de URLs de
alttahomescancun.mx**, y su `robots.txt` declararía el host equivocado.

**Consecuencia:** Google recibe señales contradictorias sobre qué sitio es cuál.
Es de los errores que más ensucian una propiedad y cuesta meses limpiar.

**Mitigación:** `SITE_URL` por variable de entorno **antes** del primer
despliegue, y verificar el `sitemap.xml` y el `robots.txt` compilados de cada
sitio antes de conectar dominios.

---

### R3 · Medición mezclada: no vas a poder comparar

**Qué pasa:** están escritos a fuego en el código:

| Dónde | Qué |
|---|---|
| `app/layout.tsx` | `GTM_ID = "GTM-53BHDRWC"` |
| `app/whatsapp/WhatsAppRedirect.tsx` | `ADS_ID = "AW-18157218280"` + etiqueta de conversión |
| `components/MetaContactTracker.jsx` | dataset de Meta `2016457592282966` |

Los dos sitios dispararían **el mismo contenedor, la misma conversión y el mismo
dataset**. Las visitas, los clics a WhatsApp y los eventos `Contact` de ambos
quedarían indistinguibles.

**Consecuencia:** se pierde el motivo mismo de hacer el sitio 2 — no se podría
saber cuál convierte mejor. Y peor: la campaña de Google Ads optimizaría con
conversiones de los dos sitios revueltas.

**Mitigación:** decidir por sitio si el seguimiento va junto o separado. Como
mínimo, mandar un parámetro que identifique el origen.

---

### R4 · La CAPI de Meta se rompe en silencio en el sitio 2

**Qué pasa:** `MetaContactTracker` manda los eventos a **`/api/meta-capi`**, que
existe gracias a un `rewrite` declarado en `firebase.json` — y ese rewrite está
en la configuración **del sitio 1**.

Si el sitio 2 se publica sin su propio rewrite, **todas sus llamadas dan 404** y
los eventos se pierden.

**Y lo grave es cómo falla:** el componente atrapa los errores en silencio
(`.catch(() => {})`, por diseño, para no romper la navegación). **No hay aviso
en pantalla ni en consola.** El sitio se vería perfecto mientras no registra
absolutamente nada.

**Mitigación:** replicar el rewrite en el bloque de hosting del sitio 2, y
**verificarlo con una llamada real** al endpoint después de desplegar — como se
hizo al arreglar el bug del `fbc`.

---

## 🟠 RIESGOS MEDIOS

### R5 · Se pierde la consolidación que hoy aporta el `.com.mx`

**Estado actual verificado:**

```
jardinesdelsurcancun.com.mx → 301 → jardinesdelsurcancun.mx → 301 → alttahomescancun.mx
```

Ese dominio hoy **suma** al principal. Al servir contenido propio, deja de
sumar. **Reversible** volviendo a poner la redirección.

**De paso:** hoy son **dos saltos**. Conviene apuntarlo directo a
`alttahomescancun.mx` (un solo salto) — es mejor **aunque se cancele todo este
proyecto**. Cambio de un campo en la consola de Firebase.

---

### R6 · Todas las canónicas y el JSON-LD apuntarían al sitio equivocado

**Qué pasa:** `app/layout.tsx` usa `metadataBase: new URL(SITE_URL)`, y 14
archivos más construyen canónicas, Open Graph y JSON-LD con esa misma constante.

Sin config por sitio, **todo el sitio 2 declararía como canónica la URL del
sitio 1**.

**Ojo — esto puede ser bueno o malo:** apuntar al sitio 1 es exactamente la
estrategia de "canónica cruzada" si se elige esa vía. **El riesgo es que pase
por accidente y no por decisión**, mezclado con un sitemap que dice otra cosa
(R2). Señales contradictorias es peor que cualquiera de las dos opciones bien
hecha.

---

### R7 · El cotizador se publicaría en el sitio 2

**Qué pasa:** el cotizador vive en `public/cotizador/`, y `public/` se copia
entera en cada compilación. Aparecería en
`jardinesdelsurcancun.com.mx/cotizador`.

Trae `noindex` propio, así que Google no lo indexaría — pero es una **herramienta
interna con la lista de precios y bonos**, expuesta en un segundo dominio sin
que nadie lo haya decidido. Y el `robots.txt` del sitio 2 tendría que repetir su
`Disallow`.

**Mitigación:** excluirlo de la compilación del sitio 2, y replicar el
`Disallow: /cotizador` en su `robots.txt`.

---

### R8 · Desincronización de despliegue

**Qué pasa:** se despliega un sitio y se olvida el otro. A la semana muestran
precios distintos. **Es el riesgo con más probabilidad de todos** — no depende de
código sino de memoria.

**Consecuencia de negocio:** el mismo modelo con dos precios públicos distintos
en dos sitios del mismo asesor. Es exactamente el problema que se resolvió al
unificar el cotizador con la web.

**Mitigación:** un solo comando `deploy:all` + extender `check-precios.mjs` para
comparar los dos `out/` y **fallar** si un precio no coincide.

---

### R9 · Confusión con el competidor del `.com`

**Contexto verificado:** `jardinesdelsurcancun.com` (sin `.mx`) **es de la
competencia** — otro asesor vendiendo los mismos modelos de JdS6, WhatsApp
998 119 8101, sin identificarse como Altta Homes.

Tener un `jardinesdelsurcancun.com.mx` propio y un `jardinesdelsurcancun.com`
ajeno, con contenido parecido, **es una receta para que el cliente se equivoque
de sitio** — en cualquiera de las dos direcciones.

**Mitigación:** que el sitio 2 identifique de forma clara y visible "asesor
autorizado de Altta Homes" y el teléfono correcto.

---

### R10 · Alta y verificación en Search Console

El sitio 2 necesita su propia propiedad para poder medirse. Sin eso no hay datos
de rendimiento — y sin datos, el experimento no sirve para decidir nada.

---

### R11 · Interferencia con el Cambio de Dirección en curso

Hay un **Cambio de Dirección activo** en Search Console:
`jardinesdelsurcancun.mx` → `alttahomescancun.mx`, iniciado el 20 jun 2026
(Google honra la señal ~180 días, hasta ~mediados de diciembre).

El `.com.mx` es una propiedad distinta y no está en ese traslado, **pero hoy
alimenta la cadena**. Sacarlo mientras el traslado sigue en curso añade ruido en
el peor momento.

**Mitigación:** si se hace, mejor **después de diciembre**, cuando el traslado
haya terminado. O directamente con `noindex`, que no participa del juego de
señales.

---

## 🟡 RIESGOS BAJOS

### R12 · Doble tiempo de compilación y despliegue
Cada publicación tarda el doble. Con 18 páginas es menor, pero se nota al iterar.

### R13 · Costos de Firebase
Más hosting y más ancho de banda. Al volumen actual el plan gratuito lo cubre;
conviene vigilarlo si el sitio 2 recibe tráfico pagado.

### R14 · Mantenimiento y superficie de error
Todo cambio de diseño hay que revisarlo en **dos** sitios. Cada verificación
visual, cada prueba en celular, se duplica.

### R15 · Dilución de marca
Dos sitios para el mismo negocio. Para un cliente que ve los dos, no queda claro
cuál es "el oficial".

### R16 · Encabezados de caché y `cleanUrls`
El bloque de hosting del sitio 2 debe replicar el `cleanUrls`, `trailingSlash` y
las cabeceras de caché del sitio 1. Si no, el sitio 2 se comporta distinto —
**y las rutas relativas del cotizador dependen de ese `cleanUrls`** (ver el
`<base href="/cotizador/">`).

---

## Cómo queda el riesgo según la decisión de indexación

| | Sitio 2 con `noindex` | Sitio 2 indexable |
|---|---|---|
| R1 canibalización | **eliminado** | **ALTO** — arriesga el #1 de JdS7 |
| R2 sitemap/robots | menor | ALTO |
| R6 canónicas | menor | ALTO |
| R11 cambio de dirección | no aplica | MEDIO |
| R3, R4 medición | **igual de altos** | igual de altos |
| R8 desincronización | **igual de alto** | igual de alto |

**Con `noindex`, los riesgos de SEO prácticamente desaparecen** y quedan solo los
de medición y operación — que son técnicos y se resuelven con trabajo, no con
apuestas.

---

## Recomendación

1. **Empezar en la URL `.web.app`**, sin tocar ningún dominio. Riesgo cero y
   permite ver el sitio funcionando de verdad.
2. **Publicar con `noindex`**, como bandera de configuración reversible.
3. **Separar la medición desde el día uno** (R3) y **verificar la CAPI con una
   llamada real** (R4) — es la que falla en silencio.
4. **Un solo comando de despliegue** y el `check-precios` extendido (R8).
5. **Conectar el dominio solo al final**, y de preferencia después de diciembre,
   cuando termine el Cambio de Dirección (R11).

Y una nota honesta: si el sitio 2 va a ser `noindex`, **no aporta nada de SEO**.
Su valor es servir de página de aterrizaje para campañas y de URL fácil de
dictar. Vale la pena tenerlo claro antes de invertir el trabajo — con ese
objetivo, una sola landing puede bastar y sale mucho más barata que replicar el
sitio entero.
