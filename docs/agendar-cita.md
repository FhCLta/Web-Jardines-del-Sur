# Agendar cita (`/agendar-cita`)

Página creada el 9 nov 2026, a pedido de Florencio. Sirve para dos cosas:

1. **Botón de "Reserva" de los perfiles de Google.** Google no acepta ahí un
   link directo a WhatsApp (sus políticas prohíben vínculos de mensajería en
   los "vínculos de empresa local"), pero sí una página propia donde el cliente
   elige día y hora.
2. **Página propia para Google** con las dos oficinas, el horario y los cuatro
   desarrollos. Cada página de desarrollo la enlaza desde su sección de
   ubicación ("Agenda tu cita").

## Plan A — lo que está hecho (sin servidor)

El cliente elige desarrollo, oficina, día y hora, escribe su nombre y toca
"Enviar mi cita por WhatsApp". Se abre WhatsApp con el mensaje ya escrito y le
llega a Florencio, que confirma en ese chat:

> Hola, quiero agendar una cita para conocer La Rioja 2 el martes 10 de
> noviembre a las 11:00 a. m. en las casas muestra de La Rioja 2 (Av. 135 esq.
> Av. 127). Mi nombre es Ana López. Vi su perfil en Google.

- **No guarda nada ni aparta horarios.** Si dos clientes piden la misma hora,
  Florencio le propone otra a uno. La página lo dice.
- **Horario:** `app/agendar-cita/horario.ts`, un solo lugar del que salen los
  botones Y el texto de la página. Lunes a sábado 9:00–18:00, domingo
  10:00–18:00, cada 30 min (las oficinas cierran a las 7; la última cita a las
  6 deja una hora). Hoy solo ofrece horas que empiecen al menos 1 hora después
  de ahora, en hora de Cancún aunque el teléfono del cliente esté en otra zona.
- **Oficinas:** Jardines del Sur 6 (atiende también Jardines del Sur 7: la obra
  no está abierta a visitas) y casas muestra de La Rioja 2. Lirios Residencial
  2 abre oficina "próximamente": hasta entonces el cliente elige oficina.
  Cuando abra, se agrega en `OFICINAS` y en `DESARROLLOS` de `page.tsx`.
- Los días se calculan en el navegador (en el servidor saldrían congelados en
  el día de la compilación); antes de eso se ve "Cargando los próximos días…".

### Links para los perfiles de Google (campo "Reserva")

Links cortos (9 nov 2026), uno por perfil. Abren la misma página de citas con
su desarrollo ya elegido y el mensaje termina en "Vi su perfil en Google":

| Perfil | Link |
|---|---|
| Jardines del Sur 6 | `https://alttahomescancun.mx/cita/jardines-6` |
| Jardines del Sur 7 | `https://alttahomescancun.mx/cita/jardines-7` |
| La Rioja 2 | `https://alttahomescancun.mx/cita/la-rioja-2` |
| Lirios Residencial 2 | `https://alttahomescancun.mx/cita/lirios-2` |

- Son páginas de verdad (`app/cita/[clave]/page.tsx`), no redirecciones:
  Google rechaza acortadores y pide que el link responda 200.
- No se indexan (`noindex`) y su canonical es `/agendar-cita`: así no hay cinco
  páginas iguales compitiendo en Google. No van en el sitemap.
- Los links largos (`/agendar-cita?desarrollo=la-rioja-2&desde=google`) siguen
  funcionando, por si alguno ya quedó guardado.

El WhatsApp directo (`https://wa.me/529987043388`) va en el campo **Chat** del
perfil, no en Reserva.

## Plan B — con servidor (pendiente, si hace falta)

**Cuándo:** si la página se usa y empiezan a empalmarse citas.

**Qué cambia para el cliente:** solo ve horarios libres. Para Florencio: cada
cita aparece sola en su Google Calendar, y le sigue llegando por WhatsApp.

**Cómo se haría:**

1. **Una función en Firebase** (el proyecto ya tuvo una, la de Meta, así que
   ya está en el plan de pago por uso; con este volumen cabe en lo gratuito).
   Dos acciones: "¿qué horas están libres este día?" y "aparta esta hora".
2. **Google Calendar como agenda.** La función lee los horarios ocupados del
   calendario de Florencio (API freebusy) y crea un evento por cita. Si él
   aparta una hora para otra cosa en su calendario, tampoco se ofrece. Se
   conecta una sola vez: una cuenta de servicio de Google Cloud con permiso
   sobre ese calendario.
3. **La página** pide a la función los horarios del día elegido en lugar de
   calcularlos sola; al enviar, primero aparta la hora y después abre WhatsApp
   como hoy. La dirección y los links de los perfiles NO cambian.
4. **Protección contra citas falsas:** un límite de citas por teléfono y por
   día, y un campo trampa invisible. Sin CAPTCHA al abrir la página: Google
   no acepta un link de reserva que pida CAPTCHA.
5. **Aviso de privacidad:** al guardar nombre y teléfono hace falta, y el sitio
   todavía no tiene uno (ver el escrito del formulario de datos de clientes).

**Lo que NO se hace:** mandar la confirmación automática por WhatsApp. Eso
necesita la API de WhatsApp, que es de Meta, y la web se desconectó de Meta el
3 nov 2026 (`docs/meta-desconexion.md`). La confirmación la sigue escribiendo
Florencio.
