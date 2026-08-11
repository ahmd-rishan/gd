const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'images');

async function generateBlogImages() {
  console.log("=== GENERATING BLOG COVER WEBP IMAGES ===");

  const blogs = [
    {
      name: 'blog-1-trends.webp',
      title: 'Digital Marketing Trends 2026',
      badge: 'TRENDS 2026',
      bg1: '#0536A9',
      bg2: '#0066FF',
      accent: '#38BDF8'
    },
    {
      name: 'blog-2-ai.webp',
      title: 'AI in Digital Marketing',
      badge: 'AI &amp; AUTOMATION',
      bg1: '#0F172A',
      bg2: '#7B2CBF',
      accent: '#C77DFF'
    },
    {
      name: 'blog-3-strategy.webp',
      title: 'Digital Marketing Strategy',
      badge: 'STRATEGY GUIDE',
      bg1: '#04143D',
      bg2: '#0284C7',
      accent: '#38BDF8'
    },
    {
      name: 'blog-4-seo.webp',
      title: 'SEO &amp; Search in 2026',
      badge: 'SEO &amp; AEO',
      bg1: '#071C50',
      bg2: '#059669',
      accent: '#34D399'
    }
  ];

  for (const blog of blogs) {
    const svg = `
      <svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${blog.bg1}" />
            <stop offset="100%" stop-color="${blog.bg2}" />
          </linearGradient>
        </defs>

        <rect width="800" height="500" fill="url(#bg)" />
        
        <g stroke="white" stroke-width="1" opacity="0.06">
          <line x1="0" y1="100" x2="800" y2="100" />
          <line x1="0" y1="200" x2="800" y2="200" />
          <line x1="0" y1="300" x2="800" y2="300" />
          <line x1="0" y1="400" x2="800" y2="400" />
          <line x1="200" y1="0" x2="200" y2="500" />
          <line x1="400" y1="0" x2="400" y2="500" />
          <line x1="600" y1="0" x2="600" y2="500" />
        </g>

        <circle cx="700" cy="100" r="160" fill="${blog.accent}" opacity="0.15" />
        <circle cx="100" cy="400" r="120" fill="${blog.accent}" opacity="0.1" />

        <rect x="60" y="60" width="680" height="380" rx="16" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />

        <rect x="90" y="95" width="160" height="34" rx="17" fill="${blog.accent}" />
        <text x="170" y="117" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle" letter-spacing="1">${blog.badge}</text>

        <text x="90" y="200" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#FFFFFF">${blog.title}</text>
        
        <text x="90" y="245" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.8)">GD Academy — Practical Digital Skills</text>

        <rect x="90" y="280" width="120" height="4" rx="2" fill="${blog.accent}" />
      </svg>
    `;

    const outputPath = path.join(outputDir, blog.name);
    await sharp(Buffer.from(svg))
      .webp({ quality: 85 })
      .toFile(outputPath);

    console.log(`✓ Generated ${blog.name} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
  }
}

generateBlogImages().catch(err => {
  console.error("❌ Error generating blog images:", err);
  process.exit(1);
});
