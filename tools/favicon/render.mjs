// Renders favicon PNGs from the SVG masters (sharp, from the site's own deps).
import sharp from 'sharp';
const [dir, out] = process.argv.slice(2);
const jobs = [
  ['icon-small.svg', 16, 'icon-16.png'],
  ['icon.svg', 32, 'icon-32.png'],
  ['icon.svg', 48, 'icon-48.png'],
  ['icon.svg', 96, 'icon-96.png'],
  ['icon.svg', 192, 'icon-192.png'],
  ['icon.svg', 512, 'icon-512.png'],
  ['icon-square.svg', 180, 'apple-touch-icon.png'],
];
for (const [src, size, name] of jobs) {
  await sharp(`${dir}/${src}`, { density: Math.max(72, (72 * size * 4) / 512) })
    .resize(size, size, { kernel: 'lanczos3' })
    .png({ compressionLevel: 9 })
    .toFile(`${out}/${name}`);
  console.log(name, size);
}
