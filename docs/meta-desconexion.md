# Desconexión de la web del portafolio de Meta "Florencio Real Estate"

**Decisión de Florencio (3 nov 2026):** la web se separa de todo lo de Meta
(Facebook, Instagram, Píxel, Conversiones) para conectarla más adelante a un
portafolio/usuario nuevo. **El botón de WhatsApp se queda** (solo cambiará el
número). Contexto: dos números de WhatsApp Business bloqueados en una semana
(998 205 9044 el 28 oct, 998 109 8443 después) y movimientos raros en el
portafolio el 28 oct (app del CRM, administrador "WA Not Available", socio
"unknown" con acceso total al catálogo).

Todo lo de Meta apuntaba al mismo píxel/dataset: **2016457592282966**.

## Hecho en la web (commit de esta fecha)

- Fuera el rastreador `components/MetaContactTracker.jsx` (cookies `_fbp`/`_fbc`,
  avisos de visita y de clic a WhatsApp).
- Fuera el puente `/api/meta-capi` de `firebase.json` y el código de la función
  (`functions/`). La dirección ya responde 404.
- Fuera los íconos de Facebook e Instagram del pie (queda la línea
  "Florencio Hurtado · Asesor inmobiliario"; desde el 3 nov 2026 dice solo
  "Altta Homes Cancún") y el `sameAs` a esas redes en los
  datos del inicio. Títulos, descripciones y H1: sin cambio (43 de 44 páginas
  idénticas; la del inicio solo perdió esos dos links en su JSON-LD).

## Pendiente — lo hace Florencio (fuera del repo)

1. **Google Tag Manager (GTM-53BHDRWC):** pausar o borrar la etiqueta del Píxel
   de Meta (carga `fbevents.js` con el 2016457592282966). **Solo esa**: en el
   mismo contenedor viven Google Ads (AW-18157218280) y Analytics
   (G-256GQG9139), que se quedan. Publicar el contenedor.
2. **Meta Business → Seguridad de la marca → Dominios:** quitar
   `alttahomescancun.mx` del portafolio. Sin esto, un portafolio nuevo no podrá
   verificar la web.
3. **DNS del dominio:** borrar el registro TXT
   `facebook-domain-verification=z7wrmyf1nv4d5hv0ydwzg8vneom21b` (después del
   paso 2). Los otros dos TXT (`hosting-site=…` y `google-site-verification=…`)
   **NO se tocan**: son de Firebase y de Google.
4. **Meta Business:** revocar el token de Conversiones (usuario del sistema / app)
   y, si se desea, quitar la app del CRM y los socios "unknown".

## Cerrado también (3 nov 2026, con confirmación de Florencio)

- Función `metacapi` borrada de Firebase; secreto `META_CAPI_TOKEN` destruido;
  archivo local `../meta-capi-token.txt` borrado.
- En Meta: dominio quitado del portafolio, píxel quitado de GTM (versión 9
  "v9 - Sin Meta"), TXT `facebook-domain-verification` borrado del DNS
  (Hostinger), token del "Conversions API System User" revocado y el usuario
  sin activos. El conjunto de datos 2016457592282966 no se puede borrar
  (Meta no lo permite): queda apagado y sin nada conectado.
- Recomendación dada: NO borrar el portafolio ni la página por ahora
  (es la evidencia del 28 oct para apelar); congelarlo un mes.

## Para reconectar con un portafolio nuevo

El código quedó en el historial de git (commit anterior a esta desconexión).
Con el píxel y el token del portafolio nuevo se restaura en ~1 hora: rastreador,
función, `rewrites` y verificación de dominio nueva. Antes de reconectar,
conectar el CRM solo por la API oficial y con permisos mínimos.
