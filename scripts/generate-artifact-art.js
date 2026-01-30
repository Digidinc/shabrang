const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'public/images/artifacts');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const artifacts = [
  { id: 'cyrus-cylinder', color: '#C9A227', icon: 'cylinder' },
  { id: 'qanat-mother-well', color: '#1A4A4A', icon: 'well' },
  { id: 'winged-figure-pasargadae', color: '#C9A227', icon: 'angel' },
  { id: 'shahnameh-tahmasp', color: '#8B3535', icon: 'book' },
  { id: 'qashqai-tribal-rug', color: '#8B3535', icon: 'rug' },
  { id: 'turquoise-dome-isfahan', color: '#1A4A4A', icon: 'dome' },
  { id: 'dervish-sikka', color: '#C9A227', icon: 'hat' },
  { id: 'rostam-relief-archetype', color: '#C9A227', icon: 'warrior' },
  { id: 'persian-astrolabe', color: '#C9A227', icon: 'stars' },
  { id: 'ardabil-carpet', color: '#1A4A4A', icon: 'carpet' },
  { id: 'aineh-kari-mirrors', color: '#FFFEF9', icon: 'mirror' },
  { id: 'damascus-steel-sword', color: '#4A4A45', icon: 'sword' },
  { id: 'fin-garden-layout', color: '#3D5C3D', icon: 'garden' },
  { id: 'floating-man-concept', color: '#9370DB', icon: 'man' },
  { id: 'gate-of-all-nations', color: '#C9A227', icon: 'gate' },
  { id: 'gold-daric', color: '#C9A227', icon: 'coin' },
  { id: 'golistan-saadi-ms', color: '#8B3535', icon: 'ms' },
  { id: 'haft-rang-tile', color: '#1A4A4A', icon: 'tile' },
  { id: 'homa-bird-sigil', color: '#C9A227', icon: 'bird' },
  { id: 'khayyam-rubaiyat-ms', color: '#8B3535', icon: 'quatrain' },
  { id: 'lion-sun-symbol', color: '#C9A227', icon: 'lion' },
  { id: 'maragha-observatory-tools', color: '#4A4A45', icon: 'observatory' },
  { id: 'peacock-throne', color: '#C9A227', icon: 'throne' },
  { id: 'sasanian-silver-plate', color: '#C9A227', icon: 'plate' },
  { id: 'seven-valleys-map', color: '#9370DB', icon: 'map' },
  { id: 'simurgh-miniature', color: '#C9A227', icon: 'simurgh' },
  { id: 'taq-kasra-arch', color: '#C9A227', icon: 'arch' },
  { id: 'zurkhaneh-meel', color: '#C9A227', icon: 'meel' }
];

function generateSVG(art) {
  const { id, color, icon } = art;
  
  return `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1A1A18;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0D0D0C;stop-opacity:1" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.1"/>
    </pattern>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="1000" fill="url(#bgGrad)" />
  <rect width="800" height="1000" fill="url(#grid)" />
  
  <!-- Ornamental Border -->
  <rect x="40" y="40" width="720" height="920" fill="none" stroke="${color}" stroke-width="2" opacity="0.3" />
  <rect x="60" y="60" width="680" height="880" fill="none" stroke="${color}" stroke-width="1" opacity="0.1" />
  
  <!-- Main Symbol Container -->
  <circle cx="400" cy="450" r="250" fill="none" stroke="${color}" stroke-width="1" opacity="0.2" />
  
  <!-- Procedural Geometry (Star) -->
  <g transform="translate(400, 450)">
    ${Array.from({length: 8}).map((_, i) => `
      <rect x="-150" y="-150" width="300" height="300" 
            fill="none" stroke="${color}" stroke-width="2" 
            transform="rotate(${i * 45})" opacity="0.4" />
    `).join('')}
  </g>
  
  <!-- Central Icon/ID -->
  <text x="400" y="470" font-family="Cinzel, serif" font-size="24" fill="${color}" text-anchor="middle" letter-spacing="10" opacity="0.8">
    ${id.toUpperCase().replace(/-/g, ' ')}
  </text>
  
  <text x="400" y="520" font-family="monospace" font-size="12" fill="${color}" text-anchor="middle" letter-spacing="2" opacity="0.5">
    SOVEREIGN OS // ARTIFACT NODE
  </text>

  <!-- Corner Brackets -->
  <path d="M 40 100 L 40 40 L 100 40" fill="none" stroke="${color}" stroke-width="4" />
  <path d="M 700 40 L 760 40 L 760 100" fill="none" stroke="${color}" stroke-width="4" />
  <path d="M 760 900 L 760 960 L 700 960" fill="none" stroke="${color}" stroke-width="4" />
  <path d="M 100 960 L 40 960 L 40 900" fill="none" stroke="${color}" stroke-width="4" />
</svg>
`;
}

artifacts.forEach(art => {
  const svg = generateSVG(art);
  fs.writeFileSync(path.join(OUT_DIR, `${art.id}.svg`), svg);
});

console.log(`Generated ${artifacts.length} procedural artifact SVGs.`);
