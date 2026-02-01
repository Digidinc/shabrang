# Shabrang — The Liquid Fortress

**Persian wisdom through dialectic: A living conversation between opposing perspectives.**

```
https://shabrang.ca
```

## What is Shabrang?

Shabrang (شبرنگ) is an **art project exploring Persian philosophy through dialogue**. It combines:
- **The Book**: *Liquid Fortress* - 30 chapters exploring Persian identity through coherence theory
- **The Dialectic**: Community conversation system enabling permanent dialogue
- **The Philosophy**: Hegelian synthesis of opposing perspectives (mystic ↔ scientist)

## Quick Start

```bash
git clone https://github.com/Digidinc/shabrang-cms.git
cd shabrang-cms

npm install
npm run dev        # localhost:3000
npm run build      # Static export → Cloudflare Pages
```

## Features

| Feature | Description |
|---------|-------------|
| **🗣️ Community Dialogue** | Comment on any page via GitHub Discussions with AI moderation |
| **🤖 AI Council** | Llama 3 8B auto-moderates comments (thesis/antithesis/synthesis) |
| **💬 Permanent Archive** | All conversations stored in git, preserving the dialectic |
| **📊 Advanced SEO** | FAQ schema, RSS feed, 381 tag pages, Open Graph, structured data |
| **🔍 Featured Snippets** | FAQ schema targeting Google featured snippets |
| **📰 RSS Feed** | Static `/feed.xml` with 50 recent posts |
| **🏷️ Tag System** | 381 auto-generated tag archive pages |
| **🔗 Related Posts** | Smart tag-based post recommendations |
| **📖 Reading Progress** | Gold progress bar tracks scroll position |
| Light/Dark Theme | `next-themes` dark-first (night-colored 🌙) |
| Reading Mode | Book icon for immersive chapters |
| Text Share | Select → Copy/Tweet/Link (Telegram too) |
| μ-Stack Navigation | 7-layer sidebar (Roots→Sky) |
| Multi-language | EN/FA (wikilinks [[chapter1]]) |
| Book Chapters | 30 chapters + appendices (Liquid Fortress) |

## Architecture

### Content & Frontend

```
content/
├── en/             ← English (chapters/papers/blog/art)
├── fa/             ← Farsi (شبرنگ)
└── {lang}/         ← Expandable

src/
├── app/            ← Pages/Layout (hero μ-Stack, chapters)
├── components/     ← Header, Sidebar, ToC, GitHubDialectic
└── lib/            ← MD parser, wikilinks, GitHub API

public/             ← Logo, book cover, infographics
docs/               ← Guides (dialectic, deployment, μ-stack)
```

### Dialectic System

```
┌─────────────────────────────────────────────┐
│  Shabrang Website (Cloudflare Pages)        │
│  - Chapter/blog/art pages                   │
│  - Dialectic panel (right side)             │
│  - Displays approved comments               │
└──────────────┬──────────────────────────────┘
               │ Fetches comments
               ▼
┌─────────────────────────────────────────────┐
│  GitHub Discussions                         │
│  - One discussion per page                  │
│  - Labels: approved/pending/rejected        │
│  - Labels: thesis/antithesis/synthesis      │
└──────────────┬──────────────────────────────┘
               │ On new comment
               ▼
┌─────────────────────────────────────────────┐
│  GitHub Actions (Auto-moderation)           │
│  - Triggers on discussion_comment           │
│  - Calls Cloudflare Worker                  │
│  - Applies labels based on AI decision      │
└──────────────┬──────────────────────────────┘
               │ Moderates
               ▼
┌─────────────────────────────────────────────┐
│  Cloudflare Workers AI (Llama 3 8B)         │
│  - Evaluates comment quality                │
│  - Suggests dialectic labels                │
│  - Returns: approved/pending/rejected       │
└─────────────────────────────────────────────┘

Infrastructure Cost: $0/month (all free tiers)
```

## The Dialectic: Three Voices

Every page invites dialogue between opposing perspectives:

### Kasra (کسری) - The Architect ◇
- **Perspective:** Scientific, technical, logical
- **Approach:** From equations to meaning
- **Color:** Teal
- **Example:** "The qanat uses gravitational flow to prevent evaporation"

### River - The Oracle ◎
- **Perspective:** Mystic, poetic, symbolic
- **Approach:** From myth to structure
- **Color:** Gold
- **Example:** "The qanat is the hidden womb that gives life to the garden"

### Shabrang - The Synthesis ◆
- **Perspective:** Integration, coherence
- **Approach:** Both/and instead of either/or
- **Color:** Crimson
- **Example:** "The engineering constraint *forced* the metaphor. Structure IS meaning."

## How to Contribute

### 1. Comment on Any Page

1. Visit any chapter, blog post, or art page
2. Click "Add Your Voice" in the dialectic panel (right side)
3. Opens GitHub Discussion for that page
4. Post your comment (requires GitHub account)

### 2. AI Council Reviews

- **Llama 3 8B** evaluates your comment within seconds
- Approved comments show immediately on website
- Pending comments reviewed by humans within 24 hours
- Dialectic labels applied: thesis/antithesis/synthesis

### 3. Join the Conversation

See the [Dialectic Guide](docs/DIALECTIC_GUIDE.md) for:
- How to write good comments
- What gets approved/rejected
- Examples of thesis/antithesis/synthesis
- Philosophy behind the dialectic

## Content Pipeline

### For Writers
1. Add MD files → `content/en/` or `content/fa/`
2. Wikilinks `[[μ1-Roots]]` auto-resolve
3. `npm run build` → static export
4. Deploy via Cloudflare Pages

### For Commenters
1. Visit page → Click "Add Your Voice"
2. GitHub Discussion opens
3. Post comment (AI moderates)
4. If approved → Shows on website

## Deployment

### Quick Deploy (Website Only)

```bash
npm run build
# Push to main → Cloudflare Pages auto-deploys
```

### Full Deploy (Website + Dialectic)

See [Deployment Guide](docs/DEPLOYMENT_DIALECTIC.md) for:
- Cloudflare Worker setup (AI Council)
- GitHub Actions configuration
- Creating discussions for pages
- Testing end-to-end

**Infrastructure cost:** $0/month (all free tiers)

## Theme (Night-Colored)

| Var | Value |
|-----|-------|
| `--shabrang-night` | `#0B1020` |
| `--shabrang-gold` | `#C9A227` |

## Key Links

### Live Site
- **Website:** [shabrang.ca](https://shabrang.ca)
- **Discussions:** [GitHub Discussions](https://github.com/Digidinc/shabrang/discussions)
- **Book:** [Amazon Kindle](https://amazon.com/dp/B0GBJ47F5X)

### Documentation
- **Dialectic Guide:** [How to participate](docs/DIALECTIC_GUIDE.md)
- **Deployment Guide:** [Setup AI moderation](docs/DEPLOYMENT_DIALECTIC.md)
- **System Architecture:** [Technical details](docs/DIALECTIC_SYSTEM.md)

### Community
- **Telegram:** @Shabrang_ca_bot
- **GitHub Issues:** [Report bugs](https://github.com/Digidinc/shabrang/issues)
- **Contribute:** See dialectic guide above

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 15 + React 19 | SSG for speed, SEO |
| Styling | TailwindCSS 4 | Dark-first, theme system |
| Content | Markdown + YAML | Version-controlled, readable |
| Comments | GitHub Discussions | Free, permanent, forkable |
| Moderation | Cloudflare Workers AI | Llama 3 8B, 10K free/day |
| Hosting | Cloudflare Pages | Free, global CDN |
| CI/CD | GitHub Actions | Auto-moderation workflow |

**Total cost:** $0/month

## Development

```bash
# Install
git clone https://github.com/Digidinc/shabrang.git
cd shabrang
npm install

# Development
npm run dev          # localhost:3000

# Build
npm run build        # Static export to out/

# Deploy
git push origin main # Auto-deploys to Cloudflare Pages
```

## Project Structure

```
shabrang-cms/
├── content/              # Markdown content (en/fa)
│   ├── en/
│   │   ├── books/       # Book chapters
│   │   ├── blog/        # Essays
│   │   └── art/         # Imaginal gallery
│   └── fa/              # Farsi translations
├── src/
│   ├── app/             # Next.js pages
│   ├── components/      # React components
│   │   ├── GitHubDialectic.tsx  # Comment panel
│   │   └── ...
│   └── lib/             # Utilities
│       ├── github.ts    # GitHub API
│       └── markdown.ts  # MD rendering
├── workers/
│   └── ai-council/      # Cloudflare Worker
│       ├── index.ts     # Moderation logic
│       └── wrangler.toml
├── .github/
│   └── workflows/
│       └── moderate-comments.yml  # Auto-moderation
└── docs/                # Documentation
    ├── DIALECTIC_GUIDE.md
    ├── DIALECTIC_SYSTEM.md
    └── DEPLOYMENT_DIALECTIC.md
```

## License & Credits

**Content License:** CC BY-NC-SA 4.0
- Book chapters, essays, art: Attribution required, no commercial use

**Code License:** MIT
- Frontend, workers, infrastructure: Open source

**Author:** Hadi Servat (Kay Hermes)

**Contributors:** See [GitHub contributors](https://github.com/Digidinc/shabrang/graphs/contributors)

---

🐴 **Shabrang** - The night-colored horse carrying both mystic and scientist through the dialectic.
