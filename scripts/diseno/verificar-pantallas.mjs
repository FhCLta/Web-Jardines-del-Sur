// Revisa paginas del sitio en celular y computadora ANTES de mostrarselas a
// Florencio. Mide lo que a ojo se escapa y deja capturas para mirarlas.
//
//   firebase serve --only hosting --port 5055     (en otra terminal, tras el build)
//   node scripts/diseno/verificar-pantallas.mjs /jardines-del-sur-7/casas /precios
//
// Opciones: --base=http://localhost:5055  --out=<carpeta de capturas>
//           --anchos=360,390,768,1280
//
// ⚠️ Con `python -m http.server` salen errores #418 de React que NO existen en
// produccion (sirve .html con otra ruta). Usar siempre firebase serve.
//
// Reporta por pagina y ancho:
//   - desborde horizontal (la pagina se mueve de lado en el celular)
//   - errores de consola
//   - texto cortado dentro de su caja
//   - palabras huerfanas (ultimo renglon de un titulo con una sola palabra)
//   - zonas de toque menores a 40 px (solo en celular; cuenta el ::after)
//   - contenedores visibles vacios
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const args = process.argv.slice(2);
const opt = (k, d) => {
  const a = args.find((x) => x.startsWith(`--${k}=`));
  return a ? a.split("=").slice(1).join("=") : d;
};
const paths = args.filter((a) => !a.startsWith("--"));
const BASE = opt("base", "http://localhost:5055");
const OUT = opt("out", path.join(os.tmpdir(), "altta-pantallas"));
const ANCHOS = opt("anchos", "360,390,1280").split(",").map(Number);
const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

if (paths.length === 0) {
  console.log("Uso: node scripts/diseno/verificar-pantallas.mjs /ruta [/otra] [--base=] [--out=]");
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
let problemas = 0;

for (const ancho of ANCHOS) {
  const celular = ancho < 768;
  for (const ruta of paths) {
    const page = await browser.newPage();
    const errores = [];
    page.on("pageerror", (e) => errores.push(e.message));
    page.on("console", (m) => m.type() === "error" && errores.push(m.text()));
    await page.setViewport({
      width: ancho,
      height: celular ? 800 : 900,
      deviceScaleFactor: 1,
      isMobile: celular,
      hasTouch: celular,
    });
    await page.goto(BASE + ruta, { waitUntil: "networkidle0" });

    // Bajar toda la pagina para que carguen las imagenes diferidas; si no, la
    // captura sale con huecos que no existen.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await new Promise((r) => setTimeout(r, 400));

    const r = await page.evaluate((celular) => {
      const visible = (el) => {
        const b = el.getBoundingClientRect();
        if (!b.width || !b.height) return false;
        if (el.closest("[hidden],[aria-hidden='true']")) return false;
        const cs = getComputedStyle(el);
        return cs.visibility !== "hidden" && cs.display !== "none";
      };
      const nombre = (el) =>
        (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 50) ||
        el.tagName.toLowerCase() + "." + String(el.className).split(" ")[0];
      const cw = document.documentElement.clientWidth;
      const out = { desborde: null, cortado: [], huerfanas: [], toque: [], vacios: [] };

      if (document.documentElement.scrollWidth > cw + 1) {
        // El culpable: el elemento mas ancho que se sale, sin contar los fijos.
        const culpables = [...document.querySelectorAll("body *")]
          .filter((e) => {
            const b = e.getBoundingClientRect();
            return b.right > cw + 1 && getComputedStyle(e).position !== "fixed";
          })
          .slice(-3)
          .map(nombre);
        out.desborde = `${document.documentElement.scrollWidth}px (${culpables.join(" | ")})`;
      }

      for (const el of document.querySelectorAll("main *, section *, header *, footer *")) {
        if (!visible(el) || !el.childNodes.length) continue;
        const cs = getComputedStyle(el);
        // Rotulos solo para lectores de pantalla (1px, recortados a proposito).
        if (el.getBoundingClientRect().width <= 2 || cs.clip !== "auto") continue;
        const tieneTexto = [...el.childNodes].some(
          (n) => n.nodeType === 3 && n.textContent.trim()
        );
        if (
          tieneTexto &&
          cs.overflowX !== "visible" &&
          el.scrollWidth > el.clientWidth + 1 &&
          cs.textOverflow !== "ellipsis"
        )
          out.cortado.push(nombre(el));
      }

      // Palabra huerfana: el ultimo renglon ocupa menos del 22% del ancho y
      // es una sola palabra. Solo en titulos, botones y etiquetas cortas.
      for (const el of document.querySelectorAll("h1,h2,h3,h4,p,.btn,button,[class*=eyebrow],[class*=Titulo],[class*=title],[class*=Badge]")) {
        if (!visible(el)) continue;
        // Solo textos cortos: en un contenedor grande el "ultimo renglon" es
        // el de otro elemento.
        if ((el.innerText || "").length > 140) continue;
        const rango = document.createRange();
        rango.selectNodeContents(el);
        const rects = [...rango.getClientRects()].filter((x) => x.width > 1);
        if (rects.length < 2) continue;
        // Un renglon = rectangulos que se enciman en vertical (piezas en fila
        // con distinto tamaño de letra NO son renglones distintos).
        const lineas = [];
        for (const x of rects.sort((a, b) => a.top - b.top)) {
          const cy = (x.top + x.bottom) / 2;
          const l = lineas.find((q) => cy > q.top && cy < q.bottom);
          if (l) {
            l.l = Math.min(l.l, x.left);
            l.r = Math.max(l.r, x.right);
          } else lineas.push({ top: x.top, bottom: x.bottom, l: x.left, r: x.right });
        }
        if (lineas.length < 2) continue;
        const ult = lineas[lineas.length - 1];
        const ancho = el.getBoundingClientRect().width;
        const palabras = (el.innerText || "").trim().split(/\s+/);
        if ((ult.r - ult.l) / ancho < 0.22 && palabras.length > 2)
          out.huerfanas.push(`${nombre(el)} → "${palabras[palabras.length - 1]}"`);
      }

      if (celular) {
        for (const a of document.querySelectorAll("main a, section a, main button, section button")) {
          if (!visible(a)) continue;
          // Migaja, pie y encabezado: patron comun del sitio, no de la pagina.
          if (a.closest("nav[aria-label=Breadcrumb], footer, header")) continue;
          const b = a.getBoundingClientRect();
          const af = getComputedStyle(a, "::after");
          let alto = b.height;
          if (af.content !== "none" && af.position === "absolute") {
            const top = parseFloat(af.top) || 0;
            const bottom = parseFloat(af.bottom) || 0;
            alto = b.height - Math.min(top, 0) - Math.min(bottom, 0);
          }
          if (alto < 40) out.toque.push(`${nombre(a)} (${Math.round(alto)}px)`);
        }
      }

      for (const el of document.querySelectorAll("main div, section div")) {
        if (!visible(el)) continue;
        const cs = getComputedStyle(el);
        const pintado =
          cs.backgroundColor !== "rgba(0, 0, 0, 0)" || parseFloat(cs.borderTopWidth) > 0;
        if (pintado && !el.textContent.trim() && !el.querySelector("img,svg,picture,video,iframe,canvas,input,select") && el.getBoundingClientRect().height > 20 && getComputedStyle(el).backgroundImage === "none")
          out.vacios.push(String(el.className).split(" ")[0] || "div");
      }
      return out;
    }, celular);

    const archivo = path.join(OUT, `${ancho}${ruta.replace(/\//g, "_") || "_inicio"}.png`);
    await page.screenshot({ path: archivo, fullPage: true });
    await page.close();

    const lineas = [];
    if (r.desborde) lineas.push(`  ✗ DESBORDE horizontal: ${r.desborde}`);
    if (errores.length) lineas.push(`  ✗ errores de consola: ${errores.join(" | ").slice(0, 300)}`);
    if (r.cortado.length) lineas.push(`  ✗ texto cortado: ${[...new Set(r.cortado)].slice(0, 6).join(" · ")}`);
    if (r.vacios.length) lineas.push(`  ! caja vacia visible: ${[...new Set(r.vacios)].slice(0, 6).join(" · ")}`);
    if (r.huerfanas.length) lineas.push(`  ! palabra huerfana: ${[...new Set(r.huerfanas)].slice(0, 6).join(" · ")}`);
    if (r.toque.length) lineas.push(`  ! toque < 40px: ${[...new Set(r.toque)].slice(0, 6).join(" · ")}`);
    problemas += lineas.filter((l) => l.includes("✗")).length;
    console.log(`${lineas.length ? "•" : "✓"} ${ancho}px ${ruta}`);
    lineas.forEach((l) => console.log(l));
  }
}
await browser.close();
console.log(`\nCapturas en ${OUT} — MIRARLAS (Read) antes de dar algo por bueno.`);
console.log(problemas ? `${problemas} problema(s) grave(s).` : "Sin problemas graves (✗). Revisar los avisos (!).");
process.exit(problemas ? 1 : 0);
