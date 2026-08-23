# La corazonada del dominio — y cómo probarla cuando haya tiempo

> **Estado: EN PAUSA, documentado a propósito.** No hay nada que ejecutar hoy.
> Este documento existe para que la pregunta no se vuelva a discutir desde cero
> dentro de tres meses. Escrito el **23 ago 2026**.
>
> Versión visual del plan (misma información, más fácil de seguir paso a paso):
> https://claude.ai/code/artifact/97e883b7-55f0-4277-a6ac-108220634627

---

## 1. La pregunta

**¿El nombre `jardinesdelsurcancun.mx` hace que la gente confíe más y escriba más
que `alttahomescancun.mx`?**

Florencio lo siente desde hace meses. No es una idea tonta: es una **hipótesis
sin probar**, y estar atorado con una hipótesis que no se puede medir es
genuinamente incómodo. De ahí que el tema regrese una y otra vez.

El dato que la alimenta:

| Dominio | Clientes que compraron | Ventana |
|---|---|---|
| `jardinesdelsurcancun.mx` | **3** (uno compró 4 casas) | 11 may – 20 jun · 5.7 semanas |
| `alttahomescancun.mx` | **1** (mal en buró) | 20 jun – hoy · 9 semanas |

Es real y no hay que descartarlo. Pero son 4 casos: **con esa muestra la
pregunta probablemente nunca se conteste mirando al pasado.** Solo se puede
contestar hacia adelante, midiendo.

---

## 2. Lo que YA quedó resuelto (no re-litigar)

Investigado el 18 ago 2026 contra el código y contra producción:

- **La migración está bien ejecutada.** Verificado URL por URL: cada dirección
  vieja cae en su equivalente nueva y los 404 siguen siendo 404. No hay bug de
  redirects que culpar.
- **Los clics subieron** (149 → 265) y el **CTR se duplicó** (1.8% → 4.0%).
- En `jardines del sur 6`, mismo término y misma gente, el **CTR mejoró con el
  dominio nuevo** (1.8% → 2.4%). Si el dominio de nombre exacto fuera lo que
  hace clic a la gente, ese número tenía que bajar.
- **Junio y julio —los dos meses de 1er lugar del equipo— son post-migración.**
- **El error real fue otro:** el 20 jun (commit `0e6c60a`) los títulos pasaron a
  marca y "Jardines del Sur Cancún" desapareció del sitio entero. Ver
  `metricas-negocio.md`. **Ya está corregido** con `/jardines-del-sur-cancun`.

**Conclusión honesta:** lo que se perdió se perdió por los títulos, no por el
dominio. Lo que queda sin probar es si el nombre, además, genera más confianza.

---

## 3. El plan, para cuando haya tiempo

Cinco fases **con compuerta**: si una contesta la pregunta, el plan termina ahí.

### Fase 0 · La prueba que no cuesta nada ← EMPEZAR AQUÍ

Riesgo cero. Una tarde. No toca ningún dominio.

1. Del CRM, de los 3 clientes del dominio viejo: **qué compró cada uno**,
   **cuándo escribió por primera vez** (no cuándo firmó) y **si ya lo conocía**.
   Si los tres compraron JdS6, era el producto y no el dominio.
2. En Google Ads, **en la misma campaña y el mismo grupo de anuncios**, crear un
   segundo anuncio. Mismo grupo para que compita por las mismas palabras clave,
   el mismo público y el mismo presupuesto — campaña aparte cambia la subasta y
   ya no se mide lo mismo.

   | | Anuncio A (el actual) | Anuncio B (el nuevo) |
   |---|---|---|
   | Título 1 | Altta Homes Cancún | **Jardines del Sur Cancún** 📌 |
   | Ruta visible | la actual | `JardinesDelSur` / `Cancun` |
   | Todo lo demás | — | idéntico |

   ⚠️ **Hay que FIJAR el título en la posición 1** (el ícono del alfiler). Los
   anuncios adaptables mezclan los títulos solos; sin fijarlo, Google revuelve y
   nunca se sabe cuál se mostró. Sin ese paso la prueba no vale.

   ⚠️ **Límites reales de Google Ads:** cada tramo de la ruta visible tope
   **15 caracteres**. `Jardines-del-Sur` son 16 y lo rechaza; `JardinesDelSur`
   son 14 y pasa. El título `Jardines del Sur Cancún` son 23, dentro del tope
   de 30. Se vería: `alttahomescancun.mx/JardinesDelSur/Cancun`

3. Dejarlo correr **dos semanas mínimo**, y hasta que el anuncio nuevo junte al
   menos **500 impresiones**. Con menos, cualquier diferencia es azar.

4. **Comparar TASAS, no totales.** Google no reparte las impresiones mitad y
   mitad: le da más al que cree mejor, así que el ganador tendrá más de todo y
   eso solo no prueba nada. Lo comparable es:
   - **CTR** — de los que lo vieron, cuántos le picaron
   - **Tasa de conversión** — de los que entraron, cuántos escribieron

> **Compuerta:** si el anuncio con el nombre gana, **nunca fue el dominio — eran
> las palabras**, y ya se pueden usar hoy sin comprar ni mover nada. El plan
> termina aquí y se ahorran las otras cuatro fases.

### Fase 1 · La landing, todavía sin dominio
Riesgo cero. Vive en la URL `.web.app`.
- Segundo sitio de Firebase **en el mismo proyecto** (`firebase hosting:sites:create`),
  para que pueda usar la misma función de Meta CAPI. Proyecto aparte obligaría a
  redesplegar la función — riesgo R4 de `sites/RIESGOS.md`.
- **Una sola página en su propia carpeta.** Nunca apuntando a `out/`, o se
  publica el sitio completo con `/cotizador` dentro.
- **Verificar la CAPI con una llamada real.** No asumir.

### Fase 2 · Conectar el dominio
Riesgo **bajo y reversible** — la única fase del plan que no es riesgo cero.
- Apuntar `jardinesdelsurcancun.mx` a la landing y quitar el 301.
- `noindex` en la página **y** `Disallow: /` en su robots.txt. Las dos cosas.
- Verificar el dominio nuevo en Meta Business Manager.
- **Qué cuesta:** ese dominio hoy alimenta la consolidación del principal; al
  servir contenido propio deja de hacerlo. Se revierte poniendo el redirect.

### Fase 3 · El A/B **dentro de Meta**
Riesgo cero. 2–3 semanas o 60 conversaciones.
- Prueba A/B nativa: mismo público, mismo presupuesto, misma creatividad.
- **Lo único distinto es el dominio de destino.**

> ⚠️ **No comparar contra Google Ads.** Quien busca y quien es interrumpido
> convierten distinto siempre. Comparar canales mide el canal, no el dominio.
> Ese fue el error de diseño de la primera versión de esta prueba.

### Fase 4 · Leer el resultado
Se compara **costo por conversación de WhatsApp**, no clics.

---

## 4. Los umbrales — escritos ANTES de ver los números

Esto es lo que evita que el resultado se interprete a conveniencia.

| Diferencia a favor del nombre viejo | Qué significa | Qué se hace |
|---|---|---|
| **< 15%** | Ruido | Se revierte el dominio al 301 y **el tema queda cerrado** |
| **15 – 40%** | Efecto real | Todo Meta a la landing. **El orgánico no se toca** |
| **> 40%** | Efecto grande | Igual no se migra. **Reevaluar en enero**, con la preventa corrida |

---

## 5. Lo que falla en silencio

Estas cuatro no avisan cuando se rompen. El sitio se ve perfecto mientras no
registra nada.

- [ ] **El `rewrite` de `/api/meta-capi`** en el sitio nuevo. Sin él los eventos
      van a un 404 y el componente se traga el error por diseño (`.catch(() => {})`).
      Se comprueba con una llamada real, viéndola llegar a Meta.
- [ ] **Verificación del dominio nuevo en Meta.** Hoy solo está verificado
      `alttahomescancun.mx`; sin el otro se cae la atribución en iOS.
- [ ] **El `noindex`, comprobado en el HTML ya publicado.** No basta con haberlo
      escrito en el código.
- [ ] **La carpeta que publica el segundo sitio.** Si apunta a `out/`, publica el
      sitio entero incluido el cotizador con la lista de precios y bonos.

---

## 6. Tres reglas que ningún dato cambia

1. **El dominio principal no se mueve antes de que abra Jardines del Sur 7.**
   Es el único error de esta lista que no se puede deshacer.
2. **La landing va con `noindex`, sin excepción.** Es lo único que garantiza que
   no compita contra el sitio propio. Sin `noindex` deja de ser prueba y pasa a
   ser apuesta.
3. **La CAPI se verifica con una llamada real, no se asume.** Es la que falla
   callada; sin ese evento confirmado la prueba entera puede correr semanas
   midiendo nada.

---

## 7. Por qué NO se hace una segunda web indexada

Se evaluó a fondo y la respuesta es aritmética, no de reglas de Google:

- Dos sitios indexados con el mismo contenido: Google **elige uno y esconde el
  otro**. No da dos posiciones.
- El competidor con un sitio parecido **no compite contra sí mismo**; pone el
  100% de su esfuerzo, su contenido y sus enlaces en un solo lugar. Con dos
  sitios propios, todo eso se parte a la mitad.
- El **1.32 en "jardines del sur 7"** salió de concentración: una página, un
  dominio, todas las señales al mismo sitio. Repartirse es lo contrario.
- La versión que sí funcionaría es **mover, no copiar** (sacar Jardines del Sur
  del sitio principal y llevarlo al otro dominio) — pero eso reinicia la
  autoridad desde cero, justo antes de la preventa.

Los dominios defensivos siguen cumpliendo su función **estando estacionados**:
ser el dueño es lo que bloquea a los demás, construir encima no agrega defensa.
Ver `jds7-lanzamiento.md` §6.
