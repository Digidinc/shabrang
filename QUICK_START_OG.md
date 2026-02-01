# OG Images - Quick Start Guide

Generate branded social media preview cards for Shabrang CMS in 3 simple steps.

## Prerequisites

```bash
# Install Python dependencies
pip install playwright
playwright install chromium
```

## Three-Command Setup

```bash
# 1. Generate all OG images (14 posts + 4 topics)
python3 scripts/generate-og-images-playwright.py

# 2. Update post frontmatter with image paths (dry run first)
node scripts/update-post-metadata.js --dry-run
node scripts/update-post-metadata.js

# 3. Verify output
ls -lh public/images/og/
```

## Or Use Single Command

```bash
# Complete automated workflow
./scripts/og-workflow.sh
```

## Test Results

```bash
# Start dev server
npm run dev

# Visit a post
open http://localhost:3000/blog/taarof-game-theory

# View page source and look for:
<meta property="og:image" content="/images/og/taarof-game-theory.jpg" />

# Test with validators:
# - Facebook: https://developers.facebook.com/tools/debug/
# - Twitter: https://cards-dev.twitter.com/validator
```

## Preview Design

Open in browser to see design:
```bash
open public/images/og/demo-taarof.html
```

## Files Created

- **14 OG images**: `public/images/og/[post-id].jpg` (1200x630px)
- **Updated metadata**: `image: /images/og/...` in post frontmatter

## Troubleshooting

### Playwright not installed
```bash
pip install playwright
playwright install chromium
```

### Permission denied on workflow script
```bash
chmod +x scripts/og-workflow.sh
```

### Need to regenerate one image
```bash
python3 scripts/generate-og-images-playwright.py --id taarof-game-theory
```

## Full Documentation

- **Complete guide**: [docs/OG_IMAGES.md](docs/OG_IMAGES.md)
- **Implementation summary**: [OG_IMAGES_IMPLEMENTATION.md](OG_IMAGES_IMPLEMENTATION.md)
- **Scripts reference**: [scripts/README.md](scripts/README.md)

## Design Specs

- **Size**: 1200x630px (social media standard)
- **Format**: JPEG, quality 90, <300KB
- **Colors**: Dark teal background (#0D1A1A), gold accents (#C9A227)
- **Fonts**: Cinzel (title), Cormorant Garamond (tagline/category)
- **Style**: Persian miniature aesthetic, clean and minimal

That's it! 🎨
