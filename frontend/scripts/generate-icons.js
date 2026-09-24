import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [192, 512];
const PUBLIC_DIR = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

const generateIcon = async (size) => {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="512" height="512" fill="#0f0f0f" />
      
      <!-- Border -->
      <rect x="16" y="16" width="480" height="480" rx="24" fill="none" stroke="#22c55e" stroke-width="8" />
      
      <!-- Dumbbell Shape -->
      <!-- Center Bar -->
      <rect x="226" y="110" width="60" height="20" fill="#22c55e" />
      <!-- Inner Weights -->
      <rect x="186" y="80" width="40" height="80" rx="8" fill="#22c55e" />
      <rect x="286" y="80" width="40" height="80" rx="8" fill="#22c55e" />
      <!-- Outer Weights -->
      <rect x="156" y="90" width="30" height="60" rx="6" fill="#22c55e" />
      <rect x="326" y="90" width="30" height="60" rx="6" fill="#22c55e" />

      <!-- Letter M -->
      <text x="256" y="320" font-size="200" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="#22c55e">M</text>
      
      <!-- Bottom Text -->
      <text x="256" y="440" font-size="36" font-family="Arial, sans-serif" font-weight="bold" letter-spacing="4" text-anchor="middle" dominant-baseline="central" fill="#ffffff">MUSCLE DIET</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(PUBLIC_DIR, `icon-${size}.png`));
};

const run = async () => {
  try {
    for (const size of sizes) {
      await generateIcon(size);
    }
    console.log("✅ Icons generated: icon-192.png, icon-512.png");
  } catch (error) {
    console.error("Error generating icons:", error);
  }
};

run();
