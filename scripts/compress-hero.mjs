/**
 * Comprime la imagen hero mobile con mayor compresión WebP.
 * Usa sharp que ya viene como dependencia de Next.js.
 * 
 * Ejecutar: node scripts/compress-hero.mjs
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const images = [
  {
    input: path.join(root, 'public/optimized/hero/alberca-mobile.webp'),
    output: path.join(root, 'public/optimized/hero/alberca-mobile.webp'),
    width: 750,   // Suficiente para móviles 2x (375px * 2)
    quality: 65,   // Más compresión sin pérdida visual perceptible
  },
  {
    input: path.join(root, 'public/optimized/hero/alberca-desktop.webp'),
    output: path.join(root, 'public/optimized/hero/alberca-desktop.webp'),
    width: 1440,  // Suficiente para pantallas de escritorio
    quality: 72,
  },
];

for (const img of images) {
  const before = (await sharp(img.input).metadata()).size;
  
  await sharp(img.input)
    .resize(img.width, null, { withoutEnlargement: true })
    .webp({ quality: img.quality, effort: 6 })
    .toBuffer()
    .then(buffer => sharp(buffer).toFile(img.output));

  const after = (await sharp(img.output).metadata()).size;
  console.log(
    `✅ ${path.basename(img.output)}: ${(before/1024).toFixed(1)} KiB → ${(after/1024).toFixed(1)} KiB (ahorro: ${((before-after)/1024).toFixed(1)} KiB)`
  );
}

console.log('\n🎉 Imágenes hero comprimidas exitosamente.');
