const fs = require('fs');
const path = require('path');

// API key should be set via environment variable
const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is not set');
  process.exit(1);
}
const OUT_DIR = path.join(process.cwd(), 'public/images/artifacts');

const artifacts = [
  { id: 'aineh-kari-mirrors', prompt: 'Intricate Persian mirror-work (Aineh-kari) with geometric reflections.' },
  { id: 'damascus-steel-sword', prompt: 'A curved Shamshir sword made of watered Damascus steel.' },
  { id: 'fin-garden-layout', prompt: 'An aerial geometric layout of the Fin Garden with water channels.' },
  { id: 'floating-man-concept', prompt: 'A symbolic human figure suspended in a void, representing Avicennas floating man.' },
  { id: 'gate-of-all-nations', prompt: 'The Lamassu guardian statues from the Gate of All Nations in Persepolis.' },
  { id: 'gold-daric', prompt: 'An Achaemenid Gold Daric coin showing a royal archer.' },
  { id: 'golistan-saadi-ms', prompt: 'An illuminated manuscript page from Saadis Golistan with floral borders.' },
  { id: 'haft-rang-tile', prompt: 'A vibrant seven-colored (Haft-Rang) Persian tile with floral motifs.' },
  { id: 'homa-bird-sigil', prompt: 'The legendary Homa bird with its wings spread, symbolizing sovereignty.' },
  { id: 'khayyam-rubaiyat-ms', prompt: 'A manuscript page of Omar Khayyams quatrains with a wine cup and roses.' },
  { id: 'lion-sun-symbol', prompt: 'The Lion and Sun (Shir-o-Khorshid) ancient Persian emblem.' },
  { id: 'maragha-observatory-tools', prompt: 'Ancient astronomical tools from the Maragha Observatory.' },
  { id: 'peacock-throne', prompt: 'The jeweled Peacock Throne (Takht-e Tavoos) of the Persian monarchs.' },
  { id: 'sasanian-silver-plate', prompt: 'A Sasanian silver plate showing a royal hunt scene with ink outlines.' },
  { id: 'seven-valleys-map', prompt: 'A symbolic map showing seven distinct valleys or stages of a journey.' },
  { id: 'simurgh-miniature', prompt: 'The mythical Simurgh bird with multicolored feathers in a mountain setting.' },
  { id: 'taq-kasra-arch', prompt: 'The massive brick arch of Taq Kasra, the Sasanian palace.' },
  { id: 'zurkhaneh-meel', prompt: 'Wooden Zurkhaneh clubs (Meel) used in the Heroic Sport.' }
];

async function generateImage(artifact) {
  console.log(`Synthesizing (Shabrang Cosmetic): ${artifact.id}...`);
  
  const fullPrompt = `A professional Persian Miniature / Siah Qalam style illustration of ${artifact.prompt}. 
  STYLE RULES: 
  - Background: Warm aged parchment (#F5E6C8).
  - Outlines: Clean coal black (#1A1A18) ink outlines on all figures.
  - Colors: Solid color fills only. Deep teal (#1A4A4A) for flow, Persian crimson (#8B3535) for energy, Antique gold (#C9A227) for value.
  - Composition: Flat perspective (NO 3D, NO depth). Symmetrical and balanced. 
  - Frame: Simple geometric Persian border frame in teal and gold.
  - Atmosphere: High contrast, minimalist, suitable for a manuscript box.
  - NO glow, NO neon, NO 3D rendering.`;

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: fullPrompt,
        n: 1,
        size: '1024x1024'
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const imageUrl = data.data[0].url;
    const imgRes = await fetch(imageUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    
    fs.writeFileSync(path.join(OUT_DIR, `${artifact.id}.png`), buffer);
    console.log(`SUCCESS: Saved ${artifact.id}.png`);
  } catch (err) {
    console.error(`ERROR [${artifact.id}]:`, err.message);
  }
}

async function run() {
  for (const art of artifacts) {
    await generateImage(art);
    // 3 seconds pause between generations to respect rate limits
    await new Promise(r => setTimeout(r, 3000));
  }
}

run();
