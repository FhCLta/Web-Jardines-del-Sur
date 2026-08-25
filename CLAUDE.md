@AGENTS.md

# Sitio de Altta Homes Cancún — contexto permanente

Florencio Hurtado, **asesor inmobiliario independiente** de Altta Homes (marca de
vivienda de Grupo Sadasi) en Cancún. Trabaja solo: vende y mantiene este sitio.

- **Producción:** https://alttahomescancun.mx
- **Stack:** Next.js 16 con `output: export` (sitio estático) + Firebase Hosting.
- **Desarrollos:** Jardines del Sur 6, La Rioja 2 y Lirios Residencial 2 (con
  precios) y **Jardines del Sur 7**, en obra, preventa sep–oct 2026.

---

## 1. Reglas que no se rompen

1. **No commitear ni desplegar sin que Florencio lo pida.** Editar y compilar sí;
   publicar no.
2. **Verificar en producción lo que se publique.** No dar por bueno un cambio
   porque compiló: comprobarlo contra la URL real.
3. **Los precios no se cambian sin orden suya.** Ver §2.
4. **El `<title>` del home NO nombra un solo desarrollo.** Nombrarlo perjudica a
   La Rioja y Lirios. El término "jardines del sur cancun" lo trabaja la página
   `/jardines-del-sur-cancun`.
5. **Antes de escribir código, leer la guía correspondiente en
   `node_modules/next/dist/docs/`** (ver AGENTS.md): esta versión de Next tiene
   cambios de ruptura respecto al conocimiento previo.

---

## 2. Precios — fuente única

`data/precios.json` alimenta **a la vez** la web y el cotizador. Nunca se edita
un precio en un componente.

```bash
node scripts/gen-cotizador-precios.mjs   # tras tocar precios.json
node scripts/check-precios.mjs           # SIEMPRE al final: debe decir "TODO EN ORDEN"
```

- El campo `web` de una variante marca cuál alimenta la ficha pública.
- **Descuento vencido = quitarlo del cotizador.** Publicarlo es la mitad del
  trabajo; retirarlo al vencer es la otra, o se cotiza un precio que ya no
  existe. Detalle en `docs/actualizar-promociones.md`.
- "PROMO" significa dos cosas: en departamentos es la **vista** (variante
  permanente); en casas, una promoción real. No modelarlos igual.

---

## 3. Publicar

```bash
npm run build
firebase deploy --only hosting     # el sitio
firebase deploy --only functions   # la CAPI de Meta — despliegue DISTINTO
```

Después del deploy se commitea también `.firebase/hosting.*.cache`.

---

## 4. Qué leer y cuándo (no leer todo cada sesión)

| Si el tema es… | Leer |
|---|---|
| Promociones del mes | `docs/actualizar-promociones.md` |
| Jardines del Sur 7, preventa, estrategia | `docs/jds7-lanzamiento.md` |
| Números del negocio, Search Console, CPA | `docs/metricas-negocio.md` |
| El dominio viejo / la hipótesis de confianza | `docs/prueba-dominio.md` (CERRADA) |
| Segundo sitio o dominios | `sites/RIESGOS.md` |
| El cotizador | `docs/cotizador-context.md` |
| Historia de decisiones pasadas | `context.md` (lo reciente está arriba) |

`context.md` son 1,500+ líneas: leer solo la parte de arriba salvo que se
busque algo concreto.

---

## 5. Reglas de contenido y SEO

**Competir contra uno mismo NO es compartir palabras.** Dos páginas compiten
cuando responden la MISMA pregunta. Hoy 11 páginas llevan "Jardines del Sur 6"
en el `<title>` y ese desarrollo no se hundió. Las fichas, promociones y precios
de un desarrollo **deben** llevar su nombre en título y H1.

**La única restricción real:** el hub `/jardines-del-sur-cancun` no debe reclamar
"jardines del sur 7" en su `<title>` ni en su `<h1>` — es del mismo tipo que
`/jardines-del-sur-7`, que va en posición 1.32. Mencionarlo en el cuerpo suma.
El reparto completo de términos, con su evidencia, en `docs/jds7-lanzamiento.md` §4.

**Un rótulo que no cuadra es peor que ningún rótulo.** Es el error que más veces
ha aparecido en este proyecto: texto fijo describiendo un número que varía
("desde" donde hay algo más barato, "precio por m²" que era un mínimo). Al tocar
cualquier cifra, revisar que su etiqueta siga siendo cierta.

**Las fotos de obra nunca reemplazan el hero.** Van en su propia sección "Avance
de obra" con fecha.

---

## 6. Cómo trabaja Florencio

- Explicar **en español llano**, sin jerga y sin dar por entendido lo técnico.
- **Una cosa a la vez.** No cerrar los mensajes con listas de pendientes: lo
  abruman. Si hay varias cosas abiertas, se menciona la que sigue y ya.
- Revisa en vivo y manda capturas. El ciclo que funciona: captura → un arreglo
  concreto → build y deploy → siguiente.
- **Cazar los errores midiendo, no leyendo el código.** Varias veces esta
  semana el problema no se veía en el CSS y sí en el navegador.

---

## 7. Deuda técnica conocida

- **El pie de página está copiado en 12 archivos.** Cualquier cambio hay que
  hacerlo en los 12. Candidato a extraer a un `<SiteFooter />` único.
- La migaja de pan del encabezado usa mapas de nombres (`MODEL_NAMES_BY_SLUG` y
  `SECTION_NAMES_BY_SLUG` en `components/SiteHeader.jsx`): una subpágina nueva
  hay que darla de alta ahí o saldrá en minúsculas.
