# Architecture

## Three CF Pages Projects

```
Digidinc/shabrang (Next.js)          → shabrang.ca
  Main site: home, art, blog, books,
  topics, bilingual routing

shabrang-book.pages.dev              → (book reader, separate repo)
  TTS + infographics + chapter gating
  wired from main site via reader_url frontmatter

shabrang-inkwell.pages.dev           → (Astro CMS, experimental)
  Astro/Inkwell CMS fork
  shows essays, art, book — independent deploy
```

## Main Site (Next.js)

### Build

```
content/{lang}/**/*.md
    ↓
src/lib/content.ts — parse frontmatter + body, build backlinks index
    ↓
Next.js (output: 'export') — static HTML to out/
    ↓
npx wrangler pages deploy out --project-name shabrang
```

### Routing

```
/                     → [lang=en] → ShabrangHome
/fa/                  → [lang=fa] → ShabrangHome
/art/                 → [lang]/art/page.tsx → MuseumIndex
/art/[id]             → [lang]/art/[id]/page.tsx → ArtifactPage
/books/               → [lang]/books/page.tsx → BooksIndex
/books/liquid-fortress/          → BooksLiquidFortress
/books/liquid-fortress/chapter/[slug] → ChapterPage
/blog/                → [lang]/blog/page.tsx
/blog/[id]            → [lang]/blog/[id]/page.tsx
/topics/              → [lang]/topics/
/topics/[id]          → [lang]/topics/[id]/
```

`trailingSlash: true` in `next.config.ts` — required for CF Pages directory routing.
`unoptimized: true` — static export doesn't support Next.js image optimization.

### Perspective Filtering

`perspective: both | kasra | river` in frontmatter.
`matchesPerspectiveView(perspective, 'kasra')` filters all public-facing lists.
`river` content: rendered but `robots: noindex`.

### Bilingual

`getLanguages()` returns `['en', 'fa']` from `content/` subdirectories.
`getLangBasePath('en')` → `''`, `getLangBasePath('fa')` → `/fa`.
English lives at `/`, not `/en/` — the `[lang]` catch-all handles both.

## Content Schema

Every file needs:
```yaml
---
id: unique-slug
title: "..."
lang: en
status: published       # draft | published | archived
perspective: both       # both | kasra | river
date: YYYY-MM-DD
---
```

Art files also support:
```yaml
artifact_type: "Textile Archive"
level: "3"
```

Book chapters support:
```yaml
reader_url: https://shabrang-book.pages.dev/chapters/01-enigma
```

## Components

```
src/components/
├── pages/
│   ├── ShabrangHome.tsx    # home — featured posts + art + chapters
│   └── MuseumIndex.tsx     # /art gallery grid
├── ArtSidebar.tsx          # left sidebar on art detail pages
├── PageShell.tsx           # 3-col layout (left / main / right)
├── TableOfContents.tsx     # right panel TOC on detail pages
├── InlineToc.tsx           # inline TOC above body on mobile
├── MarkdownContent.tsx     # rendered HTML + glossary tooltips
├── Header.tsx              # sticky top nav
└── GitHubDialectic.tsx     # DEAD — do not use (Worker URL gone)
```

`PageShell` props: `leftMobile`, `leftDesktop`, `right`, `children`.

## Wikilinks & Glossary

`[[term]]` in markdown → resolved via `getGlossary(lang, { basePath, view })`.
Glossary built from all content files' `id` + `title`.
Rendered as `<span class="wikilink" data-id="...">` with hover tooltip.

## CSS / Styling

TailwindCSS 4. Custom design tokens in `src/app/globals.css`:

```css
--color-shabrang-gold:     #C9A227
--color-shabrang-teal:     #2D9CDB
--color-shabrang-ink:      #E8DCC8
--color-shabrang-ink-dim:  #9B8E7A
--color-shabrang-bg:       #0B1020
--color-shabrang-surface:  #111827
```

Use `shabrang-*` Tailwind tokens. `border-shabrang-teal/30` works (opacity modifier supported).
Do NOT use `frc-*` class names — all removed.

## Comments / Dialectic

`GitHubDialectic.tsx` is dead — original Worker URL no longer exists.
Current: placeholder "coming soon" section on art pages.

Planned D1 Worker (`workers/dialectic/`):
- `GET /comments?pageId=` → approved comments
- `POST /comments` → submit (pending queue)
- D1: `comments(id, page_id, body, status, created_at)`

## Deployment

```bash
npm run build
npx wrangler pages deploy out --project-name shabrang
```

Push to Digidinc/shabrang main then deploy locally. No GitHub Actions CI.
