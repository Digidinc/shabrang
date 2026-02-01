#!/usr/bin/env node

/**
 * Image Optimization Script for Shabrang CMS
 *
 * This script:
 * 1. Converts PNG/JPG images to WebP format
 * 2. Compresses images to target <100KB where possible
 * 3. Generates metadata files with dimensions for components
 * 4. Keeps original images as backups
 *
 * Usage:
 *   node scripts/optimize-images.js [directory]
 *   node scripts/optimize-images.js public/images/chapters
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
  webpQuality: 85,
  maxWidth: 2400, // Max width for images
  maxHeight: 2400, // Max height for images
  targetSizeKB: 100, // Target file size in KB
  formats: ['.png', '.jpg', '.jpeg'],
  backupSuffix: '.original',
};

/**
 * Process a single image file
 */
async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (!CONFIG.formats.includes(ext)) {
    return null;
  }

  const dir = path.dirname(filePath);
  const basename = path.basename(filePath, ext);
  const webpPath = path.join(dir, `${basename}.webp`);
  const backupPath = `${filePath}${CONFIG.backupSuffix}`;
  const metadataPath = path.join(dir, `${basename}.meta.json`);

  try {
    // Get image metadata
    const metadata = await sharp(filePath).metadata();

    console.log(`Processing: ${path.relative(process.cwd(), filePath)}`);
    console.log(`  Original: ${metadata.format} ${metadata.width}x${metadata.height}`);

    // Create backup if it doesn't exist
    try {
      await fs.access(backupPath);
    } catch {
      await fs.copyFile(filePath, backupPath);
      console.log(`  Backup created: ${path.basename(backupPath)}`);
    }

    // Calculate resize dimensions if needed
    let width = metadata.width;
    let height = metadata.height;

    if (width > CONFIG.maxWidth || height > CONFIG.maxHeight) {
      const ratio = Math.min(CONFIG.maxWidth / width, CONFIG.maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
      console.log(`  Resizing to: ${width}x${height}`);
    }

    // Convert to WebP
    const webpStats = await sharp(filePath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: CONFIG.webpQuality })
      .toFile(webpPath);

    const webpSizeKB = Math.round(webpStats.size / 1024);
    console.log(`  WebP created: ${webpSizeKB}KB (${Math.round((1 - webpStats.size / metadata.size) * 100)}% smaller)`);

    // If WebP is still too large, try with lower quality
    if (webpSizeKB > CONFIG.targetSizeKB) {
      const lowerQuality = Math.max(70, CONFIG.webpQuality - 15);
      const optimizedStats = await sharp(filePath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: lowerQuality })
        .toFile(webpPath);

      const optimizedSizeKB = Math.round(optimizedStats.size / 1024);
      console.log(`  Re-optimized with quality ${lowerQuality}: ${optimizedSizeKB}KB`);
    }

    // Also optimize the original PNG/JPG
    if (ext === '.png') {
      await sharp(filePath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .png({ compressionLevel: 9, quality: 85 })
        .toFile(filePath + '.tmp');

      await fs.rename(filePath + '.tmp', filePath);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(filePath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85, progressive: true })
        .toFile(filePath + '.tmp');

      await fs.rename(filePath + '.tmp', filePath);
    }

    // Save metadata for components
    const imageMetadata = {
      original: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size,
      },
      optimized: {
        width: width,
        height: height,
        format: 'webp',
        size: webpStats.size,
      },
      generatedAt: new Date().toISOString(),
    };

    await fs.writeFile(metadataPath, JSON.stringify(imageMetadata, null, 2));

    return {
      path: filePath,
      originalSize: metadata.size,
      optimizedSize: webpStats.size,
      savings: metadata.size - webpStats.size,
      width: width,
      height: height,
    };

  } catch (error) {
    console.error(`  Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Process all images in a directory recursively
 */
async function processDirectory(dirPath) {
  const results = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        const subResults = await processDirectory(fullPath);
        results.push(...subResults);
      } else if (entry.isFile()) {
        const result = await processImage(fullPath);
        if (result) {
          results.push(result);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message);
  }

  return results;
}

/**
 * Generate summary report
 */
function generateReport(results) {
  if (results.length === 0) {
    console.log('\nNo images processed.');
    return;
  }

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
  const totalSavings = totalOriginal - totalOptimized;
  const savingsPercent = Math.round((totalSavings / totalOriginal) * 100);

  console.log('\n' + '='.repeat(60));
  console.log('OPTIMIZATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Images processed: ${results.length}`);
  console.log(`Original size:    ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized size:   ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings:    ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${savingsPercent}%)`);
  console.log('='.repeat(60));

  // Show largest files
  const sorted = [...results].sort((a, b) => b.optimizedSize - a.optimizedSize);
  console.log('\nLargest optimized files:');
  sorted.slice(0, 10).forEach((r, i) => {
    const sizeKB = Math.round(r.optimizedSize / 1024);
    console.log(`  ${i + 1}. ${path.basename(r.path)}: ${sizeKB}KB (${r.width}x${r.height})`);
  });
}

/**
 * Main execution
 */
async function main() {
  const targetDir = process.argv[2] || 'public/images';
  const fullPath = path.resolve(process.cwd(), targetDir);

  console.log('Shabrang CMS Image Optimizer');
  console.log('='.repeat(60));
  console.log(`Target directory: ${fullPath}`);
  console.log(`WebP quality: ${CONFIG.webpQuality}`);
  console.log(`Max dimensions: ${CONFIG.maxWidth}x${CONFIG.maxHeight}`);
  console.log('='.repeat(60));
  console.log('');

  try {
    await fs.access(fullPath);
  } catch {
    console.error(`Error: Directory not found: ${fullPath}`);
    process.exit(1);
  }

  const results = await processDirectory(fullPath);
  generateReport(results);

  console.log('\nDone! Original files backed up with .original suffix.');
  console.log('Metadata files created with .meta.json extension.');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
