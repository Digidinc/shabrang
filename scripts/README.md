# Shabrang CMS Scripts

Utility scripts for content management, RSS generation, and OG image generation.

## Table of Contents

- [Content Management](#content-management)
- [OG Image Generation](#og-image-generation)
- [RSS Feed Generation](#rss-feed-generation)

## Content Management

### Create New Content

```bash
# Create new blog post
npm run content:new-blog

# Create new topic page
npm run content:new-topic

# Create new River post (philosophical)
npm run content:new-river
```

### Process Content

```bash
# Process inbox (convert drafts to published)
npm run content:process-inbox

# Sanitize content (clean HTML, fix wikilinks)
npm run content:sanitize

# Generate content report (stats, broken links)
npm run content:report

# Validate all wikilinks
npm run validate
```

### Media Management

```bash
# Sync media files from source to public
npm run content:sync-media
```

## OG Image Generation

Generate 1200x630px Open Graph preview images for social media sharing.

### Quick Start

```bash
# Full workflow (recommended for first-time setup)
./scripts/og-workflow.sh

# Or step-by-step:
./scripts/og-workflow.sh --setup      # Install dependencies
./scripts/og-workflow.sh --generate   # Generate all images
./scripts/og-workflow.sh --update     # Update post metadata
```

### Individual Commands

```bash
# Generate all OG images
python3 scripts/generate-og-images-playwright.py

# Generate single image
python3 scripts/generate-og-images-playwright.py --id taarof-game-theory

# Update post frontmatter (dry run first)
node scripts/update-post-metadata.js --dry-run
node scripts/update-post-metadata.js

# Alternative: Generate HTML templates for manual screenshots
node scripts/prepare-og-files.js
```

### File Structure

| File | Purpose |
|------|---------|
| `og-template.html` | Base HTML template (1200x630px) |
| `og-image-data.json` | Post metadata for all OG images |
| `generate-og-images-playwright.py` | Main Python generator (recommended) |
| `update-post-metadata.js` | Adds image paths to frontmatter |
| `og-workflow.sh` | Complete automation workflow |
| `prepare-og-files.js` | Node.js helper for manual workflow |

### Requirements

- **Python 3** + pip
- **Playwright**: `pip install playwright && playwright install chromium`
- **Node.js** (for metadata updates)

### Design Specs

- **Dimensions**: 1200x630px (required by social platforms)
- **Format**: JPEG (quality 90, target <300KB)
- **Colors**: Shabrang brand (dark teal background, gold accents)
- **Fonts**: Cinzel (title), Cormorant Garamond (tagline/category)

See [docs/OG_IMAGES.md](/docs/OG_IMAGES.md) for complete documentation.

## RSS Feed Generation

```bash
# Generate RSS feed (runs automatically on build)
npm run prebuild

# Or manually:
npx tsx scripts/generate-rss.ts
```

## Other Scripts

### Content Ingestion

```bash
# Ingest external content sources
node scripts/ingest.js
```

### Validation

```bash
# Validate all wikilinks and internal references
npm run validate
```

## Development

All scripts assume they're run from the project root:

```bash
# From project root
npm run <script-name>
./scripts/<script-name>.sh
python3 scripts/<script-name>.py
```

## Troubleshooting

### Playwright Not Installed

```bash
pip install playwright
playwright install chromium
```

### Permission Denied on Shell Scripts

```bash
chmod +x scripts/*.sh
```

### Node Module Not Found

```bash
npm install
```

### Python Module Not Found

```bash
pip3 install -r requirements.txt  # If exists
# Or install individually:
pip3 install playwright
```

## Contributing

When adding new scripts:

1. Add descriptive comments at top of file
2. Include usage examples in docstring
3. Update this README with new script
4. Make shell scripts executable: `chmod +x script.sh`
5. Test from project root before committing
