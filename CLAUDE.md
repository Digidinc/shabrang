# Shabrang

Persian art, philosophy, and the story of a civilization that survived.

## What This Is

Next.js 15 static export site for shabrang.ca — Iranian diaspora audience.
Content: Persian art analysis, The Liquid Fortress book (30 chapters), 80+ cultural essays.

## Commands

```bash
npm run dev        # Dev server (localhost:3000)
npm run build      # Static export → out/
npx wrangler pages deploy out --project-name shabrang  # Deploy to CF Pages
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app/[lang]/page.tsx` | Home — ShabrangHome with featured art + posts |
| `src/app/[lang]/art/[id]/page.tsx` | Art detail page |
| `src/components/pages/ShabrangHome.tsx` | Home component |
| `src/components/ArtSidebar.tsx` | Left sidebar on art pages (sticky top-14) |
| `src/lib/content.ts` | All content loading — `getArtItems`, `getBlogPosts`, etc. |
| `src/lib/markdown.ts` | Markdown render + TOC extraction + wikilink resolution |
| `src/app/globals.css` | Tailwind tokens + `shabrang-*` color vars |

## Design Tokens

```css
--color-shabrang-gold:     #C9A227   → bg/text/border-shabrang-gold
--color-shabrang-teal:     #2D9CDB   → bg/text/border-shabrang-teal
--color-shabrang-ink:      #E8DCC8   → text-shabrang-ink
--color-shabrang-ink-dim:  #9B8E7A   → text-shabrang-ink-dim
--color-shabrang-bg:       #0B1020   → bg-shabrang-bg
```

Opacity modifiers work: `border-shabrang-teal/30`, `bg-shabrang-gold/10`.
`frc-*` class names: REMOVED. Do not use them.

## Rules

1. No FRC content — this is Shabrang, not fractalresonance.com
2. All canonicals point to `shabrang.ca`
3. Persian audience — use `lang="fa"` + Vazirmatn font for Farsi text
4. `trailingSlash: true` in next.config.ts — do not remove (CF Pages routing)
5. `perspective: both | kasra | river` in frontmatter — public pages filter to `kasra`
6. `GitHubDialectic.tsx` is dead — do not import it anywhere

## Content Frontmatter

```yaml
---
id: slug
title: "..."
lang: en
status: published
perspective: both
date: YYYY-MM-DD
tags: [tag1, tag2]
abstract: "One paragraph."
# Art only:
artifact_type: "Textile Archive"
level: "3"
# Books only (wires CTA to reader):
reader_url: https://shabrang-book.pages.dev/...
---
```

## Open Work

- D1 comments Worker (replaces dead GitHubDialectic)
- Farsi language toggle in UI
- Custom domain for book reader (read.shabrang.ca)
- Funnel from content → mupot
