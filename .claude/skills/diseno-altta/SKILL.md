---
name: diseno-altta
description: Diseño del sitio alttahomescancun.mx y del cotizador para que se vea espectacular a la primera en celular y en computadora. Usar SIEMPRE antes de crear o cambiar una página, sección, tarjeta, botón, texto visible o estilo (CSS) del sitio o del cotizador — aunque el cambio parezca chico. Trae el sistema de diseño, las reglas de celular que ya costaron correcciones y el flujo de verificación con capturas.
---

# Diseño Altta Homes — espectacular a la primera

Florencio revisa **en su celular** y manda capturas. Cada detalle que él
encuentra primero es una vuelta de más. La meta de esta skill: que lo que se
le entregue ya esté medido y mirado en 360, 390 y 1280 px.

## 1. Antes de diseñar: reusar, no inventar

El sitio ya tiene piezas aprobadas. Una sección nueva se arma con ellas; un
estilo nuevo solo si ninguna sirve.

| Necesito… | Usar |
|---|---|
| Encabezado de página de desarrollo | `SiloHero` / el hero de `CatalogPage.tsx` (logo en placa, etiqueta con punto, título serif con línea `em` dorada, 2 botones) |
| Página "Casas/Departamentos en X" | `CatalogPage` (tiene modo `preventa` para desarrollos sin precio) |
| Tarjeta de modelo | `components/PropertyCard.jsx` (prop `origen` para marcar de qué página vino el lead) |
| Casas \| Departamentos | `components/SiloTiposTabs` (los dos paneles van en el HTML: Google ve el cerrado) |
| Título de sección | `.sectionHeader`: etiqueta `.text-accent` + `h2` + `p` corto |
| Tabla de precios | `app/precios/TablaPrecios.tsx` |
| Botón | `.btn .btn-primary` (dorado) / secundario con borde |
| Tarjetas chicas de enlace | `.relatedCard` de `model.module.css` |

**Sistema de diseño** (`app/globals.css`, no escribir colores sueltos):
- Azul marino `--primary #1A365D` (texto fuerte, títulos) · dorado `--accent #D19200`,
  `--accent-2 #E8B43A` (sobre fondo oscuro), `--accent-deep #A37200` (enlaces de texto).
- Gris de apoyo `--text-secondary #6B7280`. Fondo `--background #F7FAFC`, tarjetas `#fff`.
- Letras: **Playfair** (`--font-display`) para títulos de tarjeta y h3 elegantes;
  **Montserrat** (`--font-montserrat`) para etiquetas, botones y cifras;
  **Lato** para párrafos.
- Radios `--radius-md/lg/xl`, sombras `--shadow-soft/lift/gold`.
- Etiquetas en MAYÚSCULAS con `letter-spacing` 0.12–0.18em, 0.68–0.78rem.
- Rojo solo para "Agotado". Dorado para buenas noticias ("Llegará más adelante").

## 2. Reglas de celular (cada una salió de una corrección real)

1. **Diseñar a 360 px primero.** Nada puede mover la página de lado.
2. **Ninguna palabra sola en el último renglón.** Ya hay reglas globales
   (`h1–h6` con `text-wrap: balance`, `p, li` con `pretty`, `.btn` con
   `balance`), pero en textos centrados cortos (notas, intros, etiquetas,
   chips) poner `text-wrap: balance` explícito: `pretty` no siempre alcanza.
3. **Flecha pegada:** `texto →` (espacio que no se corta), nunca `texto →`.
   Igual un "·" nunca al final de un renglón: el separador va dentro del bloque
   que no se parte.
4. **Nombres de desarrollo enteros:** si "Jardines del Sur 6" puede partirse
   dejando "6." solo, usar espacios duros en ese texto visible
   (`Jardines del Sur 6`). Nunca en title/description/WhatsApp.
5. **Zona de toque ≥ 44 px.** Enlaces de texto: `position: relative` +
   `::after { content:""; position:absolute; inset:-12px -8px }`.
   ⚠️ NO en `.btn`: ya usa `::after` para el brillo.
6. **Tarjetas apiladas en celular:** valores alineados como el resto de la
   tarjeta (izquierda o centro), nunca un precio pegado a la derecha y
   descolgado. El precio no se separa de su "desde" ni de "MXN" (`nowrap`).
7. **Chips y etiquetas:** `max-width: 100%`, centradas, `balance`. Si en 360 no
   caben en un renglón, primero bajar `letter-spacing` en un `@media
   (max-width: 380–420px)`; partir en dos es el último recurso.
8. **Nada vacío a la vista:** una caja solo se pinta si tiene contenido (la
   caja de metros salía vacía en modelos sin precio).
9. **Enlaces secundarios al final** de la sección, no entre el título y el
   contenido (el "Ver precios" tapaba los modelos).
10. **En computadora revisar las cuadrículas de 2 columnas:** un nombre en
    fila con el precio se partía ("Casa / Tabachín").

## 3. Reglas de texto (las que más veces fallaron)

- **Un rótulo que no cuadra es peor que ninguno:** "Desde Por anunciar",
  "disponibles" en algo que no se vende, "desde" donde hay algo más barato.
  Al tocar una cifra o un estado, revisar su etiqueta.
- Español llano, frases cortas. Nada de promesas que Florencio no aprobó
  (ver `docs/jds7-lanzamiento.md` §5 para Jardines del Sur 7).
- El desarrollo va explícito en título y H1 de toda página nueva.

## 4. SEO: el diseño no toca lo que Google lee

- **Nunca** cambiar title, H1, description ni canonical de una página que ya
  existe sin orden de Florencio. `/jardines-del-sur-7` es su #1: solo AGREGAR.
- Cambiar CSS, espacios duros o flechas no cambia el SEO, pero **se comprueba**,
  no se supone:

```bash
npm run build && python3 scripts/diseno/comparar-seo.py
```

Esperado: `IGUALES: N de N` más solo las páginas nuevas o cambiadas a propósito.

## 5. El cotizador (`public/cotizador/`) tiene sus propias trampas

- **Imprimir:** la prueba buena es ⌘P en Chrome real. Chrome sin ventana
  (headless) ignora el `zoom` del body: sus conteos de páginas mienten.
- **Compartir como imagen/PDF:** probar con el **botón real** (cambia los
  controles por texto con `body.generando-imagen`). Llamar a html2canvas por
  fuera da capturas que no representan nada. `windowWidth` no reacomoda,
  solo recorta.
- Fechas en `dd/mm/aaaa`. Lo que se ve en la app, la impresión y la imagen
  compartida debe verse igual de bien en los tres.
- Florencio ya hizo pruebas en su celular: no pedirle que repita una prueba
  que ya contó.

## 6. Flujo de verificación (antes de enseñarle nada)

```bash
npm run build
firebase serve --only hosting --port 5055          # en otra terminal
node scripts/diseno/verificar-pantallas.mjs /ruta/nueva /ruta/que/cambio
```

⚠️ No usar `python -m http.server`: da errores #418 de React que no existen.

El script revisa 360, 390 y 1280 px (`--anchos=` para otros) y reporta:
desborde horizontal, errores de consola, texto cortado (✗ graves), cajas
vacías, palabras huérfanas y toques < 40 px (! avisos). Deja capturas de
página completa.

**Después, MIRAR las capturas** (Read de los PNG, recortando con sharp las
zonas que cambiaron). El script encuentra lo medible; el ojo encuentra lo feo:
algo desbalanceado, un hueco grande, un color que no es del sitio, dos
enlaces dorados que compiten, jerarquía de títulos confusa.

Checklist al mirar:
- [ ] Primer pantallazo en 390: ¿se entiende qué es y qué hacer?
- [ ] Ninguna palabra, flecha o "·" solo en un renglón.
- [ ] Nada vacío, nada cortado, nada pegado al borde.
- [ ] Los números alineados y completos ($, MXN, "desde").
- [ ] En 1280: cuadrículas parejas, nombres sin partir.
- [ ] El texto dice la verdad sobre el dato que acompaña.

Solo con todo en verde se le muestra a Florencio. Publicar sigue la regla de
siempre: sin su visto bueno no se hace deploy; tras el deploy se verifica en
producción.
