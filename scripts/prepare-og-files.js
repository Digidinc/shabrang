/**
 * Prepare individual HTML files for OG image generation
 * Each file is a complete standalone HTML page ready for screenshotting
 */

const fs = require('fs');
const path = require('path');

const ogData = require('./og-image-data.json');
const templatePath = path.join(__dirname, 'og-template.html');
const ogDir = path.join(__dirname, '..', 'public', 'images', 'og');

// Ensure directory exists
if (!fs.existsSync(ogDir)) {
  fs.mkdirSync(ogDir, { recursive: true });
}

const template = fs.readFileSync(templatePath, 'utf-8');

console.log('🎨 Preparing OG image HTML files\n');

ogData.forEach((item, index) => {
  const { id, title, tagline, category } = item;

  // Replace placeholders in template
  const html = template
    .replace(/<h1 class="title" id="title">.*?<\/h1>/s, `<h1 class="title" id="title">${title}</h1>`)
    .replace(/<div class="tagline" id="tagline">.*?<\/div>/s, `<div class="tagline" id="tagline">${tagline}</div>`)
    .replace(/<div class="category" id="category">.*?<\/div>/s, `<div class="category" id="category">${category}</div>`);

  const htmlPath = path.join(ogDir, `${id}.html`);
  fs.writeFileSync(htmlPath, html);

  console.log(`${index + 1}. ✅ ${id}.html — "${title}"`);
});

console.log(`\n✨ Created ${ogData.length} HTML files in ${ogDir}`);
console.log('\n📋 Next: Use browser automation to screenshot each HTML file at 1200x630');
console.log('   Example: Open file://' + path.join(ogDir, 'taarof-game-theory.html'));
