# Shabrang - Cloudflare Pages

**Status:** ⚠️ Refactor ready; deploy pending (needs Pages API token)
**Primary URL:** https://shabrang.pages.dev (after deploy)
**Blog URL:** https://shabrang.ca/content or https://blog.shabrang.ca/content (choose one)

## Architecture

Single Cloudflare Pages project serving:
- `/` - Landing page (The Liquid Fortress marketing)
- `/content/` - Blog (Astro + MDX, synced from Notion)
- `/book/` - Book chapters (served from R2 storage)
- `/api/*` - API (GHL integration, auth, webhooks)

**Stack:**
- **Pages** - Static site hosting + serverless functions
- **D1** - SQLite database (users, tokens, events)
- **R2** - Object storage (book HTML files, images)
- **Workers** - API routes via Pages Functions

## Deployment Info

| Service | Resource | ID/URL |
|---------|----------|--------|
| Pages Project | `shabrang` | https://shabrang.pages.dev |
| D1 Database | `shabrang-db` | `22db9a55-f30e-40c6-b0f3-08c6a855c9f9` |
| R2 Bucket | `shabrang-assets` | Storage for book/images |
| Custom Domain | optional | CNAME → shabrang.pages.dev |

## Directory Structure

```
shabrang-refactor/
├── apps/site/              # Astro blog source
│   ├── src/
│   │   ├── content/posts/  # MDX blog posts (synced from Notion)
│   │   ├── layouts/        # Page layouts
│   │   └── pages/          # Astro pages
│   ├── public/             # Static assets (logo, images)
│   └── astro.config.mjs    # Astro config (base: '/content')
├── functions/
│   ├── api/[[path]].js     # API routes (GHL, auth, webhooks)
│   └── book/[[path]].js    # Book content from R2
├── static/
│   ├── landing/            # Landing page HTML/CSS/JS
│   └── book/               # Book static files (optional)
├── infra/
│   └── schema.sql          # D1 database schema
├── dist/                   # Build output (deployed to Pages)
├── build.sh                # Build script
├── upload-book-r2.sh       # R2 upload helper
└── wrangler.toml           # Cloudflare configuration
```

## Build & Deploy

### 1. Build locally
```bash
cd /home/mumega/shabrang-refactor
./build.sh
```
Output → `dist/`

### 2. Deploy to Cloudflare Pages
```bash
export CLOUDFLARE_API_TOKEN=<token-with-pages-d1-r2>

wrangler pages deploy dist --project-name=shabrang
```

### 3. Upload book to R2 (optional)
```bash
./upload-book-r2.sh /opt/shabrang/repo/Book/dist shabrang-assets book
```

## Database Setup (D1)

The D1 database is created and schema applied (re-run if needed).

**Tables:**
- `users` - User accounts (synced from GHL contacts)
- `access_tokens` - Auth tokens for book access
- `ghl_tokens` - GHL OAuth tokens
- `ghl_events` - Webhook event log
- `content_access` - Content access tracking

**Re-apply schema:**
```bash
wrangler d1 execute shabrang-db --file=infra/schema.sql --remote
```

## Environment Variables

Set in Cloudflare Pages → Settings → Environment Variables:

**GHL Integration:**
- `GHL_CLIENT_ID` - GoHighLevel OAuth client ID
- `GHL_CLIENT_SECRET` - GHL OAuth secret
- `GHL_LOCATION_ID` - `GH7DEHSQgknGHmLCSzo3`
- `GHL_REDIRECT_URI` - `https://shabrang.ca/api/auth/callback`
- `GHL_SCOPES` - OAuth scopes
- `GHL_PREMIUM_TAG` - Tag for premium users (default: `shabrang-premium`)
- `GHL_TOKEN_FIELD_KEY` - Custom field for book tokens
- `GHL_ALLOW_CONTACT_ID_TOKEN` - Allow contactId as token
- `GHL_RESEND_WORKFLOW_ID` - Workflow for resending access
- `GHL_CHECKOUT_URL` - Book purchase URL

**Other:**
- `ENVIRONMENT` - `production`

## API Endpoints

All endpoints are accessible at the Pages domain or your configured custom domain.

### GHL Integration
- `GET /api/health` - Health check
- `GET /api/ghl/auth` - Initiate GHL OAuth
- `GET /api/auth/callback` - OAuth callback handler
- `POST /api/ghl/signup` - Create/update contact
- `GET /api/ghl/status` - Check user access status
- `POST /api/ghl/validate` - Validate access token
- `POST /api/ghl/resend` - Resend access email
- `GET /api/ghl/checkout` - Redirect to checkout
- `POST /api/ghl-webhook` - GHL webhook receiver

### Book Access
- `GET /api/book/chapter/:num` - Get book chapter (auth required)

## Content Management

### Blog Posts (Notion Sync)

Blog content is managed in Notion and synced to the repo:

**Notion Database:** `b629baa772e94f8d991babbead93580d`

**Sync command:**
```bash
cd /home/mumega/contentngn
python3 core/notion-sync/notion_sync.py sites/shabrang/notion-config.json
```

This syncs Notion pages → MDX files in `apps/site/src/content/posts/`

**Then rebuild and deploy:**
```bash
cd /home/mumega/shabrang-refactor
./build.sh
wrangler pages deploy dist --project-name=shabrang
```

### Landing Page

Edit: `static/landing/index.html`

### Book Chapters

Edit: `/opt/shabrang/repo/Book/` then upload to R2:
```bash
./upload-book-r2.sh /opt/shabrang/repo/Book/dist shabrang-assets book
```

## Design System Status

The landing page and book are currently standalone HTML/CSS. The blog uses its
own Astro layout. There is no shared master layout or theme across all sections
yet.

**Recommended next step:** move the landing into Astro and extract shared CSS
tokens (colors/typography/spacing) so future pages and events use one design
system.

## Custom Domain Setup

**Optional:** configure `shabrang.ca` or `blog.shabrang.ca`

**DNS Record:**
- Type: CNAME
- Name: blog
- Target: shabrang.pages.dev
- Proxy: ON (orange cloud)

## Troubleshooting

### 522 Error
DNS still pointing to VPS instead of Cloudflare. Update CNAME to `shabrang.pages.dev`

### Images not loading
Ensure images are in `apps/site/public/` before building

### Styles not loading
Check `base` path in `apps/site/astro.config.mjs` (should be `/content`)

### API not working
Check environment variables are set in Cloudflare Pages dashboard

### Book chapters 404
Upload book files to R2 using `./upload-book-r2.sh`

## Migration from VPS

**Before (VPS):**
- Landing, Book, API → nginx on 5.161.216.149
- Manual deploys via git pull + restart

**After (Cloudflare Pages):**
- Everything on Cloudflare
- Zero server costs
- Global CDN
- Auto-deploy on git push (when connected to GitHub)

**VPS can be shut down** once all content is migrated and DNS updated.
