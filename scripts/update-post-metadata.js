/**
 * Update Blog Post and Topic Metadata with OG Image Paths
 *
 * Adds "image: /images/og/[post-id].jpg" to frontmatter
 *
 * Usage:
 *   node scripts/update-post-metadata.js
 *   node scripts/update-post-metadata.js --dry-run
 */

const fs = require('fs');
const path = require('path');

const ogData = require('./og-image-data.json');

const DRY_RUN = process.argv.includes('--dry-run');

function updateFrontmatter(filePath, postId) {
  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if image field already exists
  if (content.match(/^image:\s*/m)) {
    console.log(`   ℹ️  Already has image field, skipping`);
    return false;
  }

  // Find end of frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.log(`   ⚠️  No frontmatter found`);
    return false;
  }

  const [fullMatch, frontmatterContent] = frontmatterMatch;
  const frontmatterEnd = content.indexOf('---', 4) + 3;

  // Add image field before closing ---
  const imageLine = `image: /images/og/${postId}.jpg`;
  const newFrontmatter = `---\n${frontmatterContent}\n${imageLine}\n---`;

  const newContent = newContent = content.substring(0, 4) + frontmatterContent + '\n' + imageLine + '\n' + content.substring(frontmatterEnd);

  if (DRY_RUN) {
    console.log(`   🔍 DRY RUN: Would add "${imageLine}"`);
    return true;
  }

  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`   ✅ Added: ${imageLine}`);
  return true;
}

function main() {
  console.log('📝 Updating post metadata with OG image paths\n');

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let successCount = 0;
  let totalCount = 0;

  for (const item of ogData) {
    const { id, title, type } = item;
    const contentDir = type === 'topic' ? 'topics' : 'blog';
    const filePath = path.join(__dirname, '..', 'content', 'en', contentDir, `${id}.md`);

    console.log(`${++totalCount}. ${title}`);
    console.log(`   File: content/en/${contentDir}/${id}.md`);

    if (updateFrontmatter(filePath, id)) {
      successCount++;
    }

    console.log();
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (DRY_RUN) {
    console.log(`\n🔍 DRY RUN: Would update ${successCount}/${totalCount} files`);
    console.log('\nRun without --dry-run to apply changes');
  } else {
    console.log(`\n✨ Updated ${successCount}/${totalCount} files`);
    console.log('\n📋 Next steps:');
    console.log('   1. Review changes: git diff content/');
    console.log('   2. Generate OG images: python3 scripts/generate-og-images-playwright.py');
    console.log('   3. Test metadata: npm run dev → inspect <meta> tags');
    console.log('   4. Validate with Facebook/Twitter card validators\n');
  }
}

main();
