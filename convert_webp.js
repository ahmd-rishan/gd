/**
 * GD Academy — PNG to WebP Batch Conversion Script
 * Run from: e:\Antigravity Web\GD
 * Uses sharp@0.35.3 (installed in node_modules)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, 'images');

const conversions = [
  // Logos / graphics (quality 90)
  { src: path.join(BASE, 'logo-symbol.png'),  dest: path.join(BASE, 'logo-symbol.webp'),  quality: 90 },
  { src: path.join(BASE, 'logo-white.png'),   dest: path.join(BASE, 'logo-white.webp'),   quality: 90 },
  { src: path.join(BASE, 'logo.png'),         dest: path.join(BASE, 'logo.webp'),          quality: 90 },
  // Placement posters — photographic content (quality 85)
  { src: path.join(BASE, 'placements', 'riluban.png'),  dest: path.join(BASE, 'placements', 'riluban.webp'),  quality: 85 },
  { src: path.join(BASE, 'placements', 'rasha.png'),    dest: path.join(BASE, 'placements', 'rasha.webp'),    quality: 85 },
  { src: path.join(BASE, 'placements', 'adil.png'),     dest: path.join(BASE, 'placements', 'adil.webp'),     quality: 85 },
  { src: path.join(BASE, 'placements', 'hiba.png'),     dest: path.join(BASE, 'placements', 'hiba.webp'),     quality: 85 },
  { src: path.join(BASE, 'placements', 'shijas.png'),   dest: path.join(BASE, 'placements', 'shijas.webp'),   quality: 85 },
  { src: path.join(BASE, 'placements', 'rinsha.png'),   dest: path.join(BASE, 'placements', 'rinsha.webp'),   quality: 85 },
  { src: path.join(BASE, 'placements', 'fayis.png'),    dest: path.join(BASE, 'placements', 'fayis.webp'),    quality: 85 },
  { src: path.join(BASE, 'placements', 'shabeeba.png'), dest: path.join(BASE, 'placements', 'shabeeba.webp'), quality: 85 },
  { src: path.join(BASE, 'placements', 'abinav.png'),   dest: path.join(BASE, 'placements', 'abinav.webp'),   quality: 85 },
  { src: path.join(BASE, 'placements', 'risla.png'),    dest: path.join(BASE, 'placements', 'risla.webp'),    quality: 85 },
  { src: path.join(BASE, 'placements', 'shamil.png'),   dest: path.join(BASE, 'placements', 'shamil.webp'),   quality: 85 },
  { src: path.join(BASE, 'placements', 'vinaya.png'),   dest: path.join(BASE, 'placements', 'vinaya.webp'),   quality: 85 },
];

async function convertAll() {
  console.log('=== GD ACADEMY IMAGE → WEBP CONVERSION ===\n');
  let totalOriginal = 0;
  let totalNew = 0;
  let errors = 0;

  for (const { src, dest, quality } of conversions) {
    const name = path.basename(src);
    try {
      const origSize = fs.statSync(src).size;
      totalOriginal += origSize;
      await sharp(src)
        .webp({ quality, effort: 4 })
        .toFile(dest);
      const newSize = fs.statSync(dest).size;
      totalNew += newSize;
      const saved = origSize - newSize;
      const pct = ((saved / origSize) * 100).toFixed(1);
      const origKB = (origSize / 1024).toFixed(0);
      const newKB = (newSize / 1024).toFixed(0);
      console.log(`✓ ${name.padEnd(22)} ${String(origKB + 'KB').padStart(7)} → ${String(newKB + 'KB').padStart(6)}  (saved ${pct}%)`);
    } catch (err) {
      errors++;
      console.error(`✗ ERROR: ${name} — ${err.message}`);
    }
  }

  const savedBytes = totalOriginal - totalNew;
  const savedMB = (savedBytes / 1024 / 1024).toFixed(2);
  const savedPct = ((savedBytes / totalOriginal) * 100).toFixed(1);
  console.log(`\n${'─'.repeat(55)}`);
  console.log(`Total original : ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total WebP     : ${(totalNew / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Bandwidth saved: ${savedMB} MB (${savedPct}%)`);
  if (errors === 0) {
    console.log(`\n✅ ALL ${conversions.length} IMAGES CONVERTED SUCCESSFULLY!`);
  } else {
    console.log(`\n⚠️  ${errors} error(s) encountered.`);
  }
}

convertAll();
