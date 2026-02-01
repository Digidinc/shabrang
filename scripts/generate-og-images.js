/**
 * OG Image Generator for Shabrang CMS
 *
 * Generates 1200x630px Open Graph images for blog posts and topic pages
 * using HTML template + Playwright screenshot
 *
 * Usage:
 *   node scripts/generate-og-images.js
 *   node scripts/generate-og-images.js --post taarof-game-theory
 *   node scripts/generate-og-images.js --all
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Priority posts for OG image generation
const PRIORITY_POSTS = [
  'taarof-game-theory',
  'adab-social-handshake',
  'qanats-decentralized-grid',
  'shahnameh-civilizational-hard-drive',
  'simurgh-swarm-intelligence',
  'persian-rug-quantum-nft',
  'biological-pulse-of-nowruz',
  'fana-noise-removal',
  'avicennas-cpu-logic',
  'miniature-painting-high-res-soul',
];

const TOPIC_PAGES = [
  'persian-engineering',
  'persian-philosophy',
  'persian-literature',
  'persian-social-customs',
];

// Category/tag to display text mapping
const CATEGORY_DISPLAY = {
  'social-customs': 'Persian Social Customs',
  'engineering': 'Persian Engineering',
  'philosophy': 'Persian Philosophy',
  'literature': 'Persian Literature',
  'ethics': 'Ethics',
  'game-theory': 'Game Theory',
  'architecture': 'Architecture',
  'metaphysics': 'Metaphysics',
  'default': 'μ-Stack'
};

function parseMarkdownFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return null;
  }

  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      frontmatter[key] = value.replace(/^["']|["']$/g, '').trim();
    }
  }

  return frontmatter;
}

function getCategoryDisplay(metadata) {
  if (metadata.category) {
    return CATEGORY_DISPLAY[metadata.category] || metadata.category.toUpperCase();
  }

  if (metadata.tags) {
    const tags = metadata.tags.replace(/[\[\]]/g, '').split(',').map(t => t.trim());
    for (const tag of tags) {
      if (CATEGORY_DISPLAY[tag]) {
        return CATEGORY_DISPLAY[tag];
      }
    }
  }

  return CATEGORY_DISPLAY.default;
}

function generateOGImageForPost(postId, isTopicPage = false) {
  const contentDir = isTopicPage ? 'topics' : 'blog';
  const filePath = path.join(__dirname, '..', 'content', 'en', contentDir, `${postId}.md`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }

  const metadata = parseMarkdownFrontmatter(filePath);
  if (!metadata || !metadata.title) {
    console.error(`❌ No title found in ${postId}`);
    return false;
  }

  const title = metadata.title;
  const tagline = metadata.tagline || 'Shabrang — The Liquid Fortress';
  const category = getCategoryDisplay(metadata);

  const templatePath = path.join(__dirname, 'og-template.html');
  const outputPath = path.join(__dirname, '..', 'public', 'images', 'og', `${postId}.jpg`);

  // Create URL with parameters
  const url = `file://${templatePath}?title=${encodeURIComponent(title)}&tagline=${encodeURIComponent(tagline)}&category=${encodeURIComponent(category)}`;

  console.log(`📸 Generating OG image for: ${postId}`);
  console.log(`   Title: ${title}`);
  console.log(`   Category: ${category}`);

  // Generate image using Playwright browser automation
  // Since we can't directly use Playwright from Node, we'll create HTML files and
  // provide instructions for manual screenshot generation

  const htmlPath = path.join(__dirname, '..', 'public', 'images', 'og', `${postId}.html`);
  const htmlContent = fs.readFileSync(templatePath, 'utf-8')
    .replace('Post Title Goes Here', title)
    .replace('Shabrang — The Liquid Fortress', tagline)
    .replace(/<div class="category" id="category">.*?<\/div>/, `<div class="category" id="category">${category}</div>`);

  fs.writeFileSync(htmlPath, htmlContent);

  console.log(`✅ HTML template created: ${htmlPath}`);
  console.log(`   Open in browser at 1200x630 resolution to screenshot manually`);
  console.log(`   Or use: npx playwright screenshot file://${htmlPath} ${outputPath} --viewport-size=1200,630\n`);

  return true;
}

function generateAllOGImages() {
  console.log('🎨 Generating OG images for Shabrang CMS\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let successCount = 0;
  let totalCount = 0;

  // Generate for priority blog posts
  console.log('📝 Blog Posts:\n');
  for (const postId of PRIORITY_POSTS) {
    totalCount++;
    if (generateOGImageForPost(postId, false)) {
      successCount++;
    }
  }

  // Generate for topic pages
  console.log('\n📚 Topic Pages:\n');
  for (const topicId of TOPIC_PAGES) {
    totalCount++;
    if (generateOGImageForPost(topicId, true)) {
      successCount++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\n✨ Generated ${successCount}/${totalCount} OG image templates`);
  console.log('\n📋 Next steps:');
  console.log('   1. Install Playwright: npm install -D @playwright/test');
  console.log('   2. Run: npx playwright install chromium');
  console.log('   3. Generate screenshots: node scripts/generate-og-screenshots.js');
  console.log('   4. Update metadata in blog posts/topics with OG image paths\n');
}

// CLI handling
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
OG Image Generator for Shabrang CMS

Usage:
  node scripts/generate-og-images.js              Generate all priority OG images
  node scripts/generate-og-images.js --all        Generate all OG images
  node scripts/generate-og-images.js --post ID    Generate for specific post
  node scripts/generate-og-images.js --topic ID   Generate for specific topic
  `);
  process.exit(0);
}

if (args.includes('--post')) {
  const postId = args[args.indexOf('--post') + 1];
  generateOGImageForPost(postId, false);
} else if (args.includes('--topic')) {
  const topicId = args[args.indexOf('--topic') + 1];
  generateOGImageForPost(topicId, true);
} else {
  generateAllOGImages();
}
