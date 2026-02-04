/**
 * Generates Open Graph image: 1200×630, dark gradient, logo left, "Weather App" right.
 * Run: node scripts/generate-og-image.mjs
 */
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "src", "components", "icons", "img", "opengraph-image.png");

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#2d2d2d"/>
      <stop offset="100%" style="stop-color:#0a0a0a"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <!-- Logo: two white rounded squares, staggered diagonally, left side -->
  <rect x="120" y="215" width="140" height="140" rx="24" fill="#ffffff"/>
  <rect x="200" y="295" width="140" height="140" rx="24" fill="#ffffff"/>
  <!-- Text: Weather App, right side, vertically centered -->
  <text x="580" y="340" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="72" font-weight="700" fill="#ffffff">Weather App</text>
</svg>
`;

const buffer = Buffer.from(svg);
const png = await sharp(buffer)
  .resize(W, H)
  .png()
  .toBuffer();

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, png);
console.log("Written:", OUT);
