# Shabrang Refactor - Agent Notes

**Status:** ⚠️ Refactor ready; deploy pending (needs Pages API token)
**Live URL:** https://shabrang.pages.dev (after deploy)
**Blog URL:** https://shabrang.ca/content or https://blog.shabrang.ca/content (choose one)

This repo is a unified Cloudflare Pages project serving landing, blog, book, and APIs.

## Current Deployment

| Path | Source | Handler |
|------|--------|---------|
| `/` | `static/landing/` | Static HTML |
| `/content/` | `apps/site/` (Astro) | Static build |
| `/book/*` | R2 bucket | `functions/book/[[path]].js` |
| `/api/*` | Pages Functions | `functions/api/[[path]].js` |

## Key Resources

**Cloudflare:**
- Pages Project: `shabrang`
- D1 Database: `shabrang-db` (`22db9a55-f30e-40c6-b0f3-08c6a855c9f9`)
- R2 Bucket: `shabrang-assets`
- Account ID: `e39eaf94f33092c4efd029d94ae1e9dd`

**Notion:**
- Blog Database: `b629baa772e94f8d991babbead93580d`
- Sync script: `/home/mumega/contentngn/core/notion-sync/notion_sync.py`

## Build & Deploy Workflow

### 1. Sync blog content from Notion (if updated)
```bash
cd /home/mumega/contentngn
python3 core/notion-sync/notion_sync.py sites/shabrang/notion-config.json

# Copy synced posts to refactor
cp -r .dev/shabrang/src/content/posts/* /home/mumega/shabrang-refactor/apps/site/src/content/posts/
```

### 2. Build the site
```bash
cd /home/mumega/shabrang-refactor
./build.sh
```
Output: `dist/` directory ready for deployment

### 3. Deploy to Cloudflare Pages
```bash
export CLOUDFLARE_API_TOKEN=<token-with-pages-d1-r2>

wrangler pages deploy dist --project-name=shabrang --commit-dirty=true
```

### 4. Upload book to R2 (one-time or when book updates)
```bash
./upload-book-r2.sh /opt/shabrang/repo/Book/dist shabrang-assets book
```

## Important Files

| File | Purpose |
|------|---------|
| `wrangler.toml` | Cloudflare bindings (D1, R2, vars) |
| `build.sh` | Build Astro + copy static files to dist/ |
| `upload-book-r2.sh` | Upload book chapters to R2 |
| `infra/schema.sql` | D1 database schema |
| `apps/site/astro.config.mjs` | Astro config (base: '/content') |
| `.dev.vars` | Local env vars (gitignored) |
| `automation/setup_command_center.py` | Creates Sheets + Docs command center |
| `automation/command-center.json` | Stored IDs for command center |

## Environment Variables

Set in Cloudflare Pages → Settings → Environment Variables (Production):

```
GHL_CLIENT_ID=693d69ef08454b8bf72550f2-mjg8quur
GHL_CLIENT_SECRET=<secret>
GHL_LOCATION_ID=GH7DEHSQgknGHmLCSzo3
GHL_REDIRECT_URI=https://shabrang.ca/api/auth/callback
GHL_PREMIUM_TAG=shabrang-premium
ENVIRONMENT=production
```

## Design System Status

Landing and book are standalone HTML/CSS. The blog uses Astro layouts. There is
no shared master layout yet across `/`, `/content`, and `/book`.

**Suggested refactor:** move landing into Astro and extract shared CSS tokens
so future event pages and content share a single theme.

## Common Tasks

### Add new blog post
1. Create in Notion database
2. Run sync script
3. Build + deploy

### Update landing page
1. Edit `static/landing/index.html`
2. Build + deploy

### Update book chapters
1. Edit `/opt/shabrang/repo/Book/`
2. Upload to R2 via script

### Check API health
```bash
curl https://shabrang.pages.dev/api/health
```

### Initialize command center
```bash
python3 automation/setup_command_center.py
```

## Troubleshooting

**Images not loading:** Copy to `apps/site/public/` before building
**API 404:** Check Functions syntax uses `[[path]]` not `[...path]`
**522 Error:** DNS CNAME must point to `shabrang.pages.dev`
**D1 connection error:** Check bindings in wrangler.toml match dashboard

## Resident AI Architecture

See `AI_ARCHITECTURE.md` for full technical specification.

**Philosophy:** Working memory approach (not RAG) - book + FRC + 16D loaded as core memory

**Verified AI Tools:**
- **Veo 3** - Text-to-video with native audio (deepmind.google/models/veo/)
- **Gemini 3 Pro** - Production content generation (ai.google.dev/gemini-api/docs/gemini-3)
- **Gemini Flash** - Development/testing (cheap: $0.075/1M tokens)
- **Nano Banana Pro** - Image generation with excellent text rendering (ai.google.dev/gemini-api/docs/nanobanana)
- **LLM Council** - Multi-model consensus for planning (github.com/karpathy/llm-council)
- **Gemini File Search** - Optional RAG fallback (ai.google.dev/gemini-api/docs/file-search)

**Auto-Publishing Flow:**
1. LLM Council generates weekly plan (Sunday 8 PM)
2. Telegram notification for approval
3. AI executes via GHL social scheduler
4. Engagement tracked in D1

**Cost:** ~$50-100/month active, or $300/month with Google AI Ultra

**Next Phase:** Media indexing (slides, videos, podcasts, audiobook) + translation system

## References

- AI Architecture: `AI_ARCHITECTURE.md`
- Model/tool sources: `docs/model-sources.md`

## Migration Status

⏳ Cloudflare Pages deploy (needs Pages API token)
✅ D1 database created and schema applied
✅ R2 bucket created
✅ Blog syncing from Notion
⏳ Custom domain setup (optional)
✅ Book chapters uploaded to R2
⏳ VPS can be decommissioned once DNS fully migrated
