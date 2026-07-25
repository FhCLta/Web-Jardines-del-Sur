/**
 * Genera el folleto PDF de una página-catálogo con puppeteer (Chrome del
 * sistema). A diferencia de window.print(), page.pdf() SÍ embebe los <a href>
 * absolutos como hipervínculos clicables y respeta @page { margin:0 }.
 *
 * FLUJO (cuando cambien precios/fotos):
 *   1. node scripts/gen-brochure-img.mjs   (solo si cambiaron imágenes)
 *   2. npm run build
 *   3. sirve out/ en un puerto local:  (cd out && python3 -m http.server 8321)
 *   4. node scripts/gen-brochure-pdf.mjs jardines-del-sur-6 casas 8321
 *   5. npm run build   (copia el PDF nuevo de public/ a out/)
 *   6. deploy
 *
 * Uso: node scripts/gen-brochure-pdf.mjs <slug> <kind> [puerto]
 */
import { createRequire } from "node:module";
import path from "node:path";

const ROOT = "/Users/florencioleonardohurtadocastaneda/Documents/Git_Web Jardines/Web-Jardines-del-Sur";
const require = createRequire(ROOT + "/");
const puppeteer = require("puppeteer-core");

const slug = process.argv[2] || "jardines-del-sur-6";
const kind = process.argv[3] || "casas";
const port = process.argv[4] || "8321";

const url = `http://localhost:${port}/${slug}/${kind}.html`;
const out = path.join(ROOT, "public", "brochure-pdf", `${slug}-${kind}.pdf`);

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
});

const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle0" });

await page.pdf({
  path: out,
  printBackground: true,
  preferCSSPageSize: true, // respeta @page { size: letter; margin: 0 }
});

await browser.close();

const { statSync } = await import("node:fs");
const kb = (statSync(out).size / 1024).toFixed(0);
console.log(`PDF generado: ${out}  (${kb} KB)  desde ${url}`);
