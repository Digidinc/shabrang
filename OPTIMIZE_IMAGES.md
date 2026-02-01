# Quick Start: Image Optimization

## Run Image Optimization Now

```bash
# 1. Optimize all images (recommended for first run)
npm run images:optimize-all

# 2. Or optimize specific directories
npm run images:optimize              # Just public/images
node scripts/optimize-images.js public/brand         # Brand images
node scripts/optimize-images.js public/images/chapters  # Chapter images
node scripts/optimize-images.js public/images/landing   # Landing images
```

## What This Does

✅ Converts PNG/JPG → WebP (60-85% size reduction)
✅ Compresses images to <100KB target
✅ Resizes to max 2400x2400px
✅ Creates .original backups
✅ Generates .meta.json with dimensions

## Expected Results

**Before:** ~101MB total
**After:** ~15-20MB total
**Savings:** ~85MB (85% reduction)

### Per-Image Examples
- `poster.png`: 7.3MB → 150KB (98% reduction)
- Chapter images: 1.5-2.4MB → 50-100KB each (95% reduction)
- Brand images: Already small, ~10-20% reduction

## Safety

- Original files backed up as `.original`
- Can revert anytime: `mv file.png.original file.png`
- WebP created alongside originals (doesn't replace)

## After Optimization

1. **Test the build:**
   ```bash
   npm run build
   npm run start
   ```

2. **Verify images load:**
   - Open http://localhost:3000
   - Check homepage hero image
   - Check book chapter images
   - Open DevTools → Network → Filter: Img

3. **Check Core Web Vitals:**
   - Chrome DevTools → Lighthouse
   - Run performance audit
   - Look for LCP <2.5s, CLS <0.1

## Commit Changes

```bash
git add public/images/**/*.webp
git add public/brand/**/*.webp
git add scripts/optimize-images.js
git add docs/IMAGE_OPTIMIZATION.md
git commit -m "feat: Add WebP image optimization (85% size reduction)"
```

## Full Documentation

See `/docs/IMAGE_OPTIMIZATION.md` for detailed guide.
