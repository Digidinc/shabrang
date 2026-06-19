# Shabrang — شبرنگ

Persian art, philosophy, and the story of a civilization that survived.

```
https://shabrang.ca
```

## What is Shabrang?

Shabrang (شبرنگ — the night-colored horse) is a bilingual content platform for the Iranian diaspora.
It publishes The Liquid Fortress book, Persian art analysis, and cultural essays through a Next.js static site deployed to Cloudflare Pages.

## Quick Start

```bash
git clone https://github.com/Digidinc/shabrang.git
cd shabrang
npm install
npm run dev      # localhost:3000
npm run build    # Static export → out/
```

## Deployment

```bash
npm run build
npx wrangler pages deploy out --project-name shabrang
```

Three separate CF Pages projects:

| Project | URL | Contents |
|---------|-----|----------|
| `shabrang` | shabrang.ca | Main site (Next.js) |
| `shabrang-book` | shabrang-book.pages.dev | Book reader (audio, infographics, gating) |
| `shabrang-inkwell` | shabrang-inkwell.pages.dev | Astro CMS (experimental) |

## Content Structure

```
content/
├── en/
│   ├── books/liquid-fortress/    # 30 chapters + appendices
│   ├── art/                      # 20 Persian artifact analyses
│   ├── blog/                     # 80+ cultural essays
│   ├── concepts/                 # Philosophy glossary
│   └── topics/                   # Pillar pages
└── fa/                           # Farsi translations (same structure)
```

Add content: drop markdown in `content/en/{type}/` with frontmatter → `npm run build`.

## Frontmatter Reference

```yaml
---
id: slug-here
title: "Title"
author: Kay Hermes
date: 2026-01-01
lang: en
status: published
tags: [persian-philosophy, coherence]
abstract: "One paragraph."
perspective: both          # both | kasra | river
# For books only:
reader_url: https://shabrang-book.pages.dev/
---
```

`perspective` controls visibility: `kasra` = analytical, `river` = mystical, `both` = always shown.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, React 19, TailwindCSS 4 |
| Content | Markdown + YAML frontmatter |
| Routing | Static export, `trailingSlash: true` |
| Images | `next/image` with `unoptimized: true` |
| Hosting | Cloudflare Pages |
| Build | `output: 'export'` → `out/` |
| i18n | `/` = English, `/fa/` = Farsi |

## Key Commands

```bash
npm run dev          # dev server
npm run build        # static export
npm run deploy       # build + deploy (if configured)
```

## Current State (2026-06-19)

### Working
- Home page with book, gallery, essential reading sections
- `/books/liquid-fortress/` overview + 30 chapter pages
- `/art/` gallery (20 artifacts, en + fa)
- `/blog/` (80+ essays, en + fa)
- `/topics/` pillar pages
- Book reader at `shabrang-book.pages.dev` (TTS, infographics, free/premium gating)
- Bilingual routing (en at root, fa at `/fa/`)
- `reader_url` frontmatter wires book overview CTA to dedicated reader

### Planned / Open
- D1-backed comments system (replacing placeholder "Dialectic" section)
- `read.shabrang.ca` custom domain for book reader
- Farsi language toggle surface (content exists, no UI switch yet)
- Funnel from Persian culture content → mupot

## Docs

| File | What it covers |
|------|---------------|
| `docs/ARCHITECTURE.md` | System diagram, routing, CF Pages setup |
| `docs/CONTRIBUTING.md` | How to add content, frontmatter, conventions |
| `docs/BRAND.md` | Color palette, typography, voice |
| `docs/CONTENT_PIPELINE.md` | Content ingestion flow |
| `CLAUDE.md` | Agent instructions for this codebase |

## License

**Content:** CC BY-NC-SA 4.0 — attribution required, no commercial use
**Code:** MIT

**Author:** Hadi Servat (Kay Hermes) — [shabrang.ca](https://shabrang.ca)
