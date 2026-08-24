# La corazonada del dominio — por qué no se puede medir y qué sí se puede probar

> **Estado: la pregunta del dominio queda CERRADA por no ser medible; lo único
> que sigue vivo es una prueba de PALABRAS en Google Ads (§4).** Escrito el
> **23 ago 2026**, corregido el **24 ago 2026**.
>
> **Qué cambió el 24 ago:** el plan original suponía que la prueba se corría en
> Meta con una landing. Los anuncios de Meta abren **WhatsApp directo**, así que
> el cliente **nunca ve el dominio** — se caen las fases 1, 2 y 3. Ver §3.
>
> ⚠️ **Versión visual DESACTUALIZADA** (describe el plan de 5 fases, anterior a
> esta corrección — no seguirla):
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

## 3. ⛔ Corrección (24 ago 2026): las fases 1, 2 y 3 se caen

La versión original de este plan asumía que la prueba se corría **en Meta, con
una landing**. **No aplica.**

**El motivo:** los anuncios de Meta de Florencio son de **clic para enviar
mensaje** — abren WhatsApp directo. **Nunca hay página de aterrizaje, así que el
cliente nunca ve el dominio.** Todo el tráfico de Meta es ciego al dominio: da
exactamente igual cuál esté conectado.

Eso tumba las tres fases que dependían de Meta:

| Fase | Qué era | Por qué se cae |
|---|---|---|
| **1** · La landing en `.web.app` | Construir la página de destino | Se construía **para Meta**. Sin anuncios que la abran, no tiene a quién recibir |
| **2** · Conectar el dominio | Apuntar `jardinesdelsurcancun.mx` a la landing | Se conectaba **para que Meta lo mostrara**. Nadie lo vería |
| **3** · El A/B dentro de Meta | La medición misma | **No hay nada que medir**: el dominio no aparece en ningún punto del recorrido |

> ⚠️ **Meta y Google son canales distintos y no se mezclan.** Lo de arriba aplica
> **solo a Meta**, por cómo están armados esos anuncios. Google Ads sí manda a la
> web y sí muestra el dominio — por eso es el único lugar donde queda algo que
> probar. Cualquier conclusión de un canal **no se traslada al otro**.

**Lo que sobrevive: la fase 0, y solo en Google.**

---

## 4. Lo que queda por hacer

Dos tareas independientes. Ninguna toca un dominio, ninguna cuesta dinero
adicional, y **cada una contesta una pregunta distinta**.

### 4.1 · El repaso del CRM — media hora, riesgo cero

De los **3 clientes del dominio viejo**, sacar: **qué compró cada uno**, **cuándo
escribió por primera vez** (no cuándo firmó) y **si ya conocía el desarrollo**.

> **Qué contesta:** si los tres compraron Jardines del Sur 6, **era el producto,
> no el dominio** — y la corazonada queda explicada sin gastar nada más.

Es la única pieza que mira a los 3 casos de frente en vez de teorizar sobre
ellos. Hacerla primero.

### 4.2 · El segundo anuncio en Google Ads — parte de la campaña de septiembre

**Ojo con lo que este anuncio prueba de verdad:** el dominio que Google muestra
es `alttahomescancun.mx` **en los dos anuncios**. Lo único distinto son **el
título y la ruta visible**. Entonces esto **no prueba el dominio: prueba las
palabras**. Y eso está bien — es justo la pregunta accionable, porque las
palabras se pueden usar hoy sin comprar ni mover nada.

En la **misma campaña y el mismo grupo de anuncios** (mismo grupo para que
compita por las mismas palabras clave, el mismo público y el mismo presupuesto —
campaña aparte cambia la subasta y ya no se mide lo mismo):

| | Anuncio A (el actual) | Anuncio B (el nuevo) |
|---|---|---|
| Título 1 | Altta Homes Cancún | **Jardines del Sur Cancún** 📌 |
| Ruta visible | la actual | `JardinesDelSur` / `Cancun` |
| Todo lo demás | — | idéntico |

⚠️ **Hay que FIJAR el título en la posición 1** (el ícono del alfiler). Los
anuncios adaptables mezclan los títulos solos; sin fijarlo, Google revuelve y
nunca se sabe cuál se mostró. **Sin ese paso la prueba no vale.**

⚠️ **Límites reales de Google Ads:** cada tramo de la ruta visible tope **15
caracteres**. `Jardines-del-Sur` son 16 y lo rechaza; `JardinesDelSur` son 14 y
pasa. El título `Jardines del Sur Cancún` son 23, dentro del tope de 30. Se
vería: `alttahomescancun.mx/JardinesDelSur/Cancun`

**Cuánto dejarlo correr:** dos semanas mínimo, y hasta que el anuncio nuevo junte
al menos **500 impresiones**. Con menos, cualquier diferencia es azar.

**Cómo leerlo — TASAS, no totales.** Google no reparte las impresiones mitad y
mitad: le da más al que cree mejor, así que el ganador tendrá más de todo y eso
solo no prueba nada. Lo comparable es:

- **CTR** — de los que lo vieron, cuántos le picaron
- **Tasa de conversión** — de los que entraron, cuántos escribieron

| Diferencia a favor del título con el nombre | Qué significa | Qué se hace |
|---|---|---|
| **< 15%** | Ruido | Se deja el anuncio actual y **el tema queda cerrado** |
| **≥ 15%** | Las palabras sí pesan | Meter "Jardines del Sur Cancún" en más títulos y anuncios. **No se toca ningún dominio** |

> **La compuerta, sin cambios:** si el anuncio con el nombre gana, **nunca fue el
> dominio — eran las palabras**, y ya se pueden usar hoy.

**Dónde vive esta tarea:** ya no es un proyecto aparte. Es **un renglón del
montaje de la campaña de Google de septiembre** ($200/día, desarrollos como
grupos de anuncios). Va en el grupo de **más volumen**, que es donde 500
impresiones llegan rápido.

---

## 5. ¿Y el dominio? En la práctica, ya no es medible

Sin Meta, la única forma de que un cliente **vea** un dominio distinto sería
construir la landing (fase 1), conectarle el dominio (fase 2) y mandarle **tráfico
de Google Ads**. Técnicamente se puede: ahí el dominio de destino sí se muestra.
Pero la aritmética no da:

- Google va a **$200 MXN/día** con CPA histórico de **$87–105** → alrededor de
  **2 conversaciones al día** en toda la cuenta.
- Partido en dos brazos, y usando solo el grupo con volumen, quedan **menos de
  una conversación diaria por brazo**.
- Para distinguir una diferencia del 15% en tasa de conversión hacen falta
  **cientos de conversiones por brazo**. A ese ritmo son **meses** — corriendo
  justo encima de la preventa de Jardines del Sur 7.

**Conclusión honesta:** la pregunta del dominio **no se puede contestar con el
volumen que hay hoy**. No es que la respuesta sea "no"; es que **medirla cuesta
más de lo que vale saberla**. Lo que sí se puede contestar, barato y esta misma
semana, es si **las palabras** ayudan — y eso es §4.2.

Si algún día el volumen de Google sube mucho, o si los anuncios de Meta dejan de
ir directo a WhatsApp, este documento se reabre. Mientras tanto: **cerrado por
falta de forma de medirlo, no por falta de interés.**

---

## 6. Las reglas que siguen en pie

1. **El dominio principal no se mueve antes de que abra Jardines del Sur 7.**
   Es el único error de esta lista que no se puede deshacer. **Vigente siempre.**
2. **Los dominios defensivos se quedan estacionados.** Ser el dueño es lo que
   bloquea a los demás; construir encima no agrega defensa. Ver §7.

**Y si algún día se retoma la landing** (solo tendría sentido con un canal que sí
muestre el dominio), estas dos vuelven a aplicar tal cual:

- **`noindex` sin excepción**, comprobado en el HTML ya publicado — no basta con
  haberlo escrito en el código. Es lo único que garantiza que no compita contra
  el sitio propio.
- **La CAPI se verifica con una llamada real, no se asume.** Es la que falla
  callada (`.catch(() => {})` por diseño): el sitio se ve perfecto mientras no
  registra nada. Sin ese evento confirmado, la prueba entera puede correr semanas
  midiendo nada. Ver `sites/RIESGOS.md` R4.

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
