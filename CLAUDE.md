# Shabrang

Persian culture, diaspora stories, and The Liquid Fortress book.

## What This Is

Next.js 15 static export site for shabrang.ca — Iranian diaspora audience.
Goals: Persian art/culture content, The Liquid Fortress book, mupot upsell.

## Commands

```bash
npm run dev        # Dev server
npm run build      # Static export → out/
npx wrangler pages deploy out/ --project-name shabrang  # Deploy to CF Pages
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout — Persian fonts (Cinzel, Cormorant, Vazirmatn) |
| `src/app/page.tsx` | Home — ShabrangHome component |
| `src/lib/content.ts` | Content loading — `getBook`, `getBooks`, `getBookChapters` |
| `src/lib/bookChapters.ts` | Chapter derivation from markdown H1 headings |
| `src/lib/schema.ts` | JSON-LD schema — Organization = Shabrang |
| `content/en/books/liquid-fortress/` | The Liquid Fortress chapters |

## Palette (ALETTE Persian)

- Parchment `#F5E6C8` — `bg-shabrang-parchment`
- Gold `#C9A227` — `bg-shabrang-gold`
- Teal `#2D5A6B` — `bg-shabrang-teal`
- Crimson `#8B3535` — `bg-shabrang-crimson`

## Rules

- No FRC content — this is Shabrang, not fractalresonance.com
- All canonicals point to `shabrang.ca`
- Persian audience — use Vazirmatn for Persian text (`lang="fa"`)
- Chapters derived from H1 headings (`#`) in book markdown — not H2
