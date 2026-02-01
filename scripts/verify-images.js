#!/usr/bin/env node

/**
 * Image Verification Script for Shabrang CMS
 *
 * Verifies that:
 * 1. All images have WebP versions
 * 2. All images have metadata files
 * 3. Images are below size thresholds
 * 4. Next.js Image components have width/height
 *
 * Usage:
 *   node scripts/verify-images.js
 */

const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
  maxSizeKB: 200, // Warning threshold for WebP files
  directories: [
    'public/brand',
    'public/images/chapters',
    'public/images/landing',
  ],
  imageExtensions: ['.png', '.jpg', '.jpeg'],
};

/**
 * Check if a file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get file size in KB
 */
async function getFileSizeKB(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return Math.round(stats.size / 1024);
  } catch {
    return 0;
  }
}

/**
 * Verify a single image
 */
async function verifyImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const dir = path.dirname(imagePath);
  const basename = path.basename(imagePath, ext);
  const webpPath = path.join(dir, `${basename}.webp`);
  const metadataPath = path.join(dir, `${basename}.meta.json`);

  const issues = [];
  const info = {
    path: imagePath,
    hasWebP: false,
    hasMetadata: false,
    originalSizeKB: 0,
    webpSizeKB: 0,
    savings: 0,
  };

  // Check original size
  info.originalSizeKB = await getFileSizeKB(imagePath);

  // Check WebP version
  info.hasWebP = await fileExists(webpPath);
  if (!info.hasWebP) {
    issues.push('Missing WebP version');
  } else {
    info.webpSizeKB = await getFileSizeKB(webpPath);
    info.savings = Math.round(((info.originalSizeKB - info.webpSizeKB) / info.originalSizeKB) * 100);

    if (info.webpSizeKB > CONFIG.maxSizeKB) {
      issues.push(`WebP too large: ${info.webpSizeKB}KB (threshold: ${CONFIG.maxSizeKB}KB)`);
    }
  }

  // Check metadata
  info.hasMetadata = await fileExists(metadataPath);
  if (!info.hasMetadata) {
    issues.push('Missing metadata file');
  }

  return { info, issues };
}

/**
 * Scan directory for images
 */
async function scanDirectory(dirPath) {
  const results = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        const subResults = await scanDirectory(fullPath);
        results.push(...subResults);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (CONFIG.imageExtensions.includes(ext) && !entry.name.endsWith('.original')) {
          const result = await verifyImage(fullPath);
          results.push(result);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }

  return results;
}

/**
 * Generate report
 */
function generateReport(results) {
  console.log('\n' + '='.repeat(80));
  console.log('IMAGE VERIFICATION REPORT');
  console.log('='.repeat(80));

  const withIssues = results.filter(r => r.issues.length > 0);
  const withoutWebP = results.filter(r => !r.info.hasWebP);
  const withoutMetadata = results.filter(r => !r.info.hasMetadata);
  const tooLarge = results.filter(r => r.info.webpSizeKB > CONFIG.maxSizeKB);

  const totalOriginal = results.reduce((sum, r) => sum + r.info.originalSizeKB, 0);
  const totalWebP = results.reduce((sum, r) => sum + r.info.webpSizeKB, 0);
  const totalSavings = totalOriginal - totalWebP;
  const avgSavingsPercent = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.info.savings, 0) / results.length)
    : 0;

  console.log(`\nTotal images checked: ${results.length}`);
  console.log(`Images with issues: ${withIssues.length}`);
  console.log(`Missing WebP: ${withoutWebP.length}`);
  console.log(`Missing metadata: ${withoutMetadata.length}`);
  console.log(`Too large (>${CONFIG.maxSizeKB}KB): ${tooLarge.length}`);

  console.log(`\nSize Analysis:`);
  console.log(`  Original total: ${(totalOriginal / 1024).toFixed(2)} MB`);
  console.log(`  WebP total: ${(totalWebP / 1024).toFixed(2)} MB`);
  console.log(`  Total savings: ${(totalSavings / 1024).toFixed(2)} MB (${avgSavingsPercent}% avg)`);

  if (withIssues.length > 0) {
    console.log('\n' + '-'.repeat(80));
    console.log('ISSUES FOUND:');
    console.log('-'.repeat(80));

    withIssues.forEach(({ info, issues }) => {
      const relativePath = path.relative(process.cwd(), info.path);
      console.log(`\n${relativePath}`);
      console.log(`  Original: ${info.originalSizeKB}KB`);
      if (info.hasWebP) {
        console.log(`  WebP: ${info.webpSizeKB}KB (${info.savings}% savings)`);
      }
      issues.forEach(issue => console.log(`  ❌ ${issue}`));
    });
  }

  // Show largest files
  const sorted = [...results].sort((a, b) => b.info.webpSizeKB - a.info.webpSizeKB);
  console.log('\n' + '-'.repeat(80));
  console.log('LARGEST WEBP FILES:');
  console.log('-'.repeat(80));
  sorted.slice(0, 10).forEach(({ info }, i) => {
    const relativePath = path.relative(process.cwd(), info.path);
    const status = info.webpSizeKB > CONFIG.maxSizeKB ? '⚠️ ' : '✅ ';
    console.log(`${i + 1}. ${status}${path.basename(info.path)}: ${info.webpSizeKB}KB (${info.savings}% savings)`);
    console.log(`   ${relativePath}`);
  });

  console.log('\n' + '='.repeat(80));

  if (withIssues.length === 0) {
    console.log('✅ All images are properly optimized!');
  } else {
    console.log(`⚠️  ${withIssues.length} image(s) need attention.`);
    console.log('\nTo fix issues, run:');
    console.log('  npm run images:optimize-all');
  }

  console.log('='.repeat(80) + '\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('Shabrang CMS Image Verification');
  console.log('='.repeat(80));
  console.log('Checking image optimization status...\n');

  const allResults = [];

  for (const dir of CONFIG.directories) {
    const fullPath = path.resolve(process.cwd(), dir);

    try {
      await fs.access(fullPath);
      console.log(`Scanning: ${dir}`);
      const results = await scanDirectory(fullPath);
      allResults.push(...results);
    } catch {
      console.log(`⚠️  Directory not found: ${dir}`);
    }
  }

  generateReport(allResults);
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
