# Open Graph Image Generation Guide

## Overview

This document describes the automated Open Graph (OG) image generation system for Shabrang CMS. OG images are 1200x630px social media preview cards that appear when posts are shared on platforms like Facebook, Twitter, and LinkedIn.

## Brand Requirements

All OG images follow Shabrang's Persian miniature aesthetic:

### Colors (Shabrang Dark Theme)
- **Background**: `#0D1A1A` (Dark teal parchment)
- **Gold**: `#C9A227` (Primary accent, borders)
- **Gold Light**: `#D4A84B` (Tagline, highlights)
- **Teal**: `#2D5A6B` (Category text, decorative elements)
- **Ink**: `#F5E6C8` (Title text, off-white)

### Typography
- **Title**: Cinzel (700 weight, 64px) — Elegant serif display font
- **Tagline/Category**: Cormorant Garamond (300/400 weight) — Classic serif

### Design Elements
- Gold decorative border frame with corner accents
- Shabrang logo (spiral attractor) in top-left
- Centered title with tagline and category
- Subtle diagonal line pattern overlay (3% opacity)
- NO gradients, NO glow effects, NO forbidden colors (purple, red, green)

## File Structure

```
scripts/
├── og-template.html                    # Base HTML template (1200x630)
├── og-image-data.json                  # Content data for all posts
├── prepare-og-files.js                 # Node.js helper (optional)
├── generate-og-images-playwright.py    # Main Python generator
└── generate-og-images.js               # Node.js generator (legacy)

public/images/og/
├── taarof-game-theory.jpg              # Generated OG images
├── adab-social-handshake.jpg
├── qanats-decentralized-grid.jpg
└── [post-id].jpg
```

## Template Design

The `og-template.html` file is a standalone 1200x630px HTML page that uses:
- Google Fonts (Cinzel + Cormorant Garamond)
- Inline SVG for Shabrang logo
- URL parameters for dynamic content
- CSS custom properties for brand colors

### URL Parameters
```
file:///path/to/og-template.html?
  title=Post%20Title%20Here&
  tagline=Shabrang%20%E2%80%94%20The%20Liquid%20Fortress&
  category=Persian%20Social%20Customs
```

## Generation Methods

### Method 1: Python + Playwright (Recommended)

**Advantages**: Fully automated, consistent, batch processing

**Requirements**:
```bash
pip install playwright
playwright install chromium
```

**Usage**:
```bash
# Generate all OG images
python3 scripts/generate-og-images-playwright.py

# Generate single image
python3 scripts/generate-og-images-playwright.py --id taarof-game-theory
```

**How it works**:
1. Reads `og-image-data.json` for post metadata
2. Launches headless Chromium browser
3. Navigates to template with URL parameters
4. Waits for fonts to load
5. Takes 1200x630 screenshot as JPEG (quality 90)
6. Saves to `public/images/og/[post-id].jpg`

### Method 2: Node.js Helper + Manual Screenshots

**Advantages**: No Python dependency, more control

**Usage**:
```bash
# Generate individual HTML files
node scripts/prepare-og-files.js

# Then screenshot manually or with Playwright CLI
npx playwright screenshot \
  "file://$(pwd)/public/images/og/taarof-game-theory.html" \
  "public/images/og/taarof-game-theory.jpg" \
  --viewport-size=1200,630
```

### Method 3: Manual Browser Screenshots

**Advantages**: No dependencies, visual verification

**Steps**:
1. Open `scripts/og-template.html` in browser
2. Append URL parameters: `?title=...&tagline=...&category=...`
3. Set browser window to exactly 1200x630px
4. Take screenshot (cmd+shift+4 on Mac, Windows Snipping Tool)
5. Save as `public/images/og/[post-id].jpg`

## Content Data

All post metadata is stored in `scripts/og-image-data.json`:

```json
[
  {
    "id": "taarof-game-theory",
    "title": "Taarof: A Game Theoretic Analysis",
    "tagline": "Shabrang — The Liquid Fortress",
    "category": "Persian Social Customs",
    "type": "blog"
  },
  ...
]
```

### Adding New Posts

To generate OG images for new posts:

1. **Add entry to `og-image-data.json`**:
```json
{
  "id": "your-post-slug",
  "title": "Your Post Title",
  "tagline": "Shabrang — The Liquid Fortress",
  "category": "Persian Engineering",
  "type": "blog"
}
```

2. **Generate image**:
```bash
python3 scripts/generate-og-images-playwright.py --id your-post-slug
```

3. **Update post frontmatter**:
```yaml
---
id: your-post-slug
title: "Your Post Title"
image: /images/og/your-post-slug.jpg  # Add this line
---
```

## Category Display Names

Standard categories used in OG images:

| Category Key | Display Name |
|--------------|--------------|
| `persian-engineering` | Persian Engineering |
| `persian-philosophy` | Persian Philosophy |
| `persian-literature` | Persian Literature |
| `persian-social-customs` | Persian Social Customs |
| `ethics` | Ethics |
| `game-theory` | Game Theory |
| `architecture` | Architecture |
| `default` | μ-Stack |

For topic pages, use `"Topic Hub"` as the category.

## Priority Posts

The initial batch includes 14 OG images:

### Blog Posts (10)
1. `taarof-game-theory` — Taarof: A Game Theoretic Analysis
2. `adab-social-handshake` — Adab: The Social Handshake Protocol
3. `qanats-decentralized-grid` — Qanats: The First Decentralized Grid
4. `shahnameh-civilizational-hard-drive` — Shahnameh: A Civilizational Hard Drive
5. `simurgh-swarm-intelligence` — Simurgh: Swarm Intelligence
6. `persian-rug-quantum-nft` — Persian Rug as Quantum NFT
7. `biological-pulse-of-nowruz` — The Biological Pulse of Nowruz
8. `fana-noise-removal` — Fana: Signal from Noise
9. `avicennas-cpu-logic` — Avicenna's CPU: Logic Gates in Medieval Baghdad
10. `miniature-painting-high-res-soul` — Persian Miniature: High-Resolution Soul

### Topic Pages (4)
1. `persian-engineering` — Persian Engineering & Architecture
2. `persian-philosophy` — Persian Philosophy & Mysticism
3. `persian-literature` — Persian Literature & Poetry
4. `persian-social-customs` — Persian Social Customs

## Metadata Integration

### Blog Post Frontmatter

Add OG image to post metadata:

```yaml
---
id: taarof-game-theory
title: "Taarof: A Game Theoretic Analysis"
date: 2026-03-07
author: Kasra (The Architect)
image: /images/og/taarof-game-theory.jpg  # Add this
tags: [taarof, adab, ethics, game-theory, communication]
---
```

### Next.js Metadata API

For dynamic routes, update metadata generation:

```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.abstract,
    openGraph: {
      title: post.title,
      description: post.abstract,
      images: [
        {
          url: post.image || '/images/og/default.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.abstract,
      images: [post.image || '/images/og/default.jpg'],
    },
  };
}
```

## Testing

### Card Validators

Test generated OG images with official validators:

- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

### Manual Verification

1. Open generated image: `public/images/og/[post-id].jpg`
2. Verify:
   - Dimensions: 1200x630px
   - File size: <300KB
   - Brand colors: Dark teal background, gold accents
   - Text legibility: Title readable at small sizes
   - Logo: Shabrang spiral visible in top-left

## Troubleshooting

### Fonts Not Loading
- Template uses Google Fonts CDN
- Playwright script waits 1000ms for fonts
- If still missing, increase `page.wait_for_timeout()` value

### Images Too Large
- Default JPEG quality: 90
- Reduce in `generate-og-images-playwright.py`: `quality=80`
- Or use PNG: `type="png"` (larger file, better quality)

### Title Text Overflow
- Max recommended: 60 characters
- Font size: 64px (can reduce to 56px for long titles)
- Edit `og-template.html` `.title { font-size: 56px; }`

### Wrong Colors
- All colors must match `src/lib/colors.ts` → `SHABRANG_COLORS`
- Dark theme values: parchment `#0D1A1A`, gold `#C9A227`, teal `#2D5A6B`
- Never use FRC colors (void `#0B1020`) — this is Shabrang, not FRC!

## File Size Optimization

Target: <300KB per image (best practice for social sharing)

**Current settings**:
- Format: JPEG
- Quality: 90
- Dimensions: 1200x630 (required by social platforms)

**If too large**:
```python
# In generate-og-images-playwright.py
page.screenshot(path=output_path, type="jpeg", quality=80)  # Reduce from 90
```

## Future Enhancements

- [ ] Default OG image for posts without custom images
- [ ] Automated metadata injection script
- [ ] CI/CD integration: auto-generate on new post commit
- [ ] A/B test different category colors for engagement
- [ ] Persian/Farsi language variant templates
- [ ] Dynamic author attribution in corner
- [ ] Post-specific icon/symbol integration

## References

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Docs](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Playwright Python Docs](https://playwright.dev/python/)
- [Shabrang Brand Guide](/docs/BRAND.md)
- [Shabrang Color System](/src/lib/colors.ts)
