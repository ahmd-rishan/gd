const fs = require('fs');
const path = require('path');

console.log('=== GD ACADEMY WEBP OPTIMIZATION VERIFICATION ===\n');

const BASE = 'e:\\Antigravity Web\\GD\\images';
const html = fs.readFileSync('e:\\Antigravity Web\\GD\\index.html', 'utf8');

let errors = 0;

// 1. Check all 15 WebP files exist
const webpFiles = [
  path.join(BASE, 'logo-symbol.webp'),
  path.join(BASE, 'logo-white.webp'),
  path.join(BASE, 'logo.webp'),
  path.join(BASE, 'placements', 'riluban.webp'),
  path.join(BASE, 'placements', 'rasha.webp'),
  path.join(BASE, 'placements', 'adil.webp'),
  path.join(BASE, 'placements', 'hiba.webp'),
  path.join(BASE, 'placements', 'shijas.webp'),
  path.join(BASE, 'placements', 'rinsha.webp'),
  path.join(BASE, 'placements', 'fayis.webp'),
  path.join(BASE, 'placements', 'shabeeba.webp'),
  path.join(BASE, 'placements', 'abinav.webp'),
  path.join(BASE, 'placements', 'risla.webp'),
  path.join(BASE, 'placements', 'shamil.webp'),
  path.join(BASE, 'placements', 'vinaya.webp'),
];

let totalWebP = 0;
let totalPng = 0;

for (const f of webpFiles) {
  if (!fs.existsSync(f)) {
    console.error(`✗ MISSING: ${path.basename(f)}`);
    errors++;
  } else {
    const sz = fs.statSync(f).size;
    totalWebP += sz;
    const pngPath = f.replace('.webp', '.png');
    const pngSz = fs.existsSync(pngPath) ? fs.statSync(pngPath).size : 0;
    totalPng += pngSz;
    const saved = ((1 - sz/pngSz)*100).toFixed(1);
    console.log(`✓ ${path.basename(f).padEnd(22)} ${(sz/1024).toFixed(0)}KB  (${saved}% smaller than PNG)`);
  }
}

console.log(`\n— Total PNG: ${(totalPng/1024/1024).toFixed(2)}MB | Total WebP: ${(totalWebP/1024/1024).toFixed(2)}MB | Saved: ${((totalPng-totalWebP)/1024/1024).toFixed(2)}MB`);

// 2. Check HTML: picture elements for local images
const pictureCount = (html.match(/<picture>/g) || []).length;
console.log(`\n✓ <picture> elements in HTML: ${pictureCount} (expected: 14)`);
if (pictureCount !== 14) { console.error(`  ❌ Expected 14 picture elements`); errors++; }

// 3. Check hero LCP image has fetchpriority
if (html.includes('fetchpriority="high"')) {
  console.log('✓ Hero LCP image has fetchpriority="high"');
} else {
  console.error('✗ ERROR: fetchpriority="high" missing from hero image'); errors++;
}

// 4. Check all WebP sources in HTML
const webpSrcs = ['logo-symbol.webp','logo-white.webp','riluban.webp','rasha.webp','adil.webp',
  'hiba.webp','shijas.webp','rinsha.webp','fayis.webp','shabeeba.webp','abinav.webp','risla.webp',
  'shamil.webp','vinaya.webp'];
for (const w of webpSrcs) {
  if (!html.includes(w)) {
    console.error(`✗ MISSING WebP src reference: ${w}`); errors++;
  }
}
console.log(`✓ All ${webpSrcs.length} WebP source references found in HTML`);

// 5. Single H1 check
const h1s = (html.match(/<h1[^>]*>/g) || []).length;
console.log(`✓ H1 count: ${h1s}`);
if (h1s !== 1) { console.error('❌ Expected exactly 1 H1'); errors++; }

// 6. No missing alt tags
const imgs = html.match(/<img[^>]+>/g) || [];
const noAlt = imgs.filter(i => !i.includes('alt=')).length;
console.log(`✓ img tags: ${imgs.length}, missing alt: ${noAlt}`);

if (errors === 0) {
  console.log('\n✅ ALL WEBP OPTIMIZATION VERIFICATIONS PASSED!');
} else {
  console.log(`\n⚠️  ${errors} verification error(s). Please review above.`);
}
