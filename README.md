# Shabrang Cloudflare Pages (Refactor)

Single Cloudflare Pages project that serves:
- `/` landing page
- `/content/` blog (Astro build)
- `/book/` book pages (served from R2)
- `/api/*` GHL + book access API (Pages Functions)

## Repo Layout

- `apps/site/` Astro blog (base `/content`)
- `functions/api/` API gateway (GHL OAuth, signup, access, webhook)
- `functions/book/` Book content from R2
- `static/landing/` Landing page assets
- `infra/schema.sql` D1 schema
- `build.sh` Build + assemble output
- `upload-book-r2.sh` R2 upload helper

## Build

1) Place assets:
- Landing: `static/landing/`

2) Build:
```bash
cd /home/mumega/shabrang-refactor
./build.sh
```

Output: `dist/`

Astro source lives in `apps/site/` and builds into `/content/`.

## Database (D1)

Apply `infra/schema.sql` to the D1 database bound as `DB`.

## R2 (optional for book)

Upload the book to the `STORAGE` bucket under the `book/` prefix
(example: `book/chapter1.html`). The `/book/*` route is served from R2
via `functions/book/[...path].js`.

Upload script (uses `wrangler`):
```bash
./upload-book-r2.sh /opt/shabrang/repo/Book/dist shabrang-assets book
```

## Required environment variables

- `GHL_CLIENT_ID`
- `GHL_CLIENT_SECRET`
- `GHL_LOCATION_ID`
- `GHL_REDIRECT_URI` (default: `https://shabrang.ca/api/auth/callback`)
- `GHL_SCOPES` (default: `contacts.readonly contacts.write locations.readonly`)
- `GHL_PREMIUM_TAG` (default: `shabrang-premium`)
- `GHL_TOKEN_FIELD_KEY` (default: `book_access_token`)
- `GHL_ALLOW_CONTACT_ID_TOKEN` (default: `true`)
- `GHL_RESEND_WORKFLOW_ID`
- `GHL_CHECKOUT_URL`

## API Endpoints

- `GET /api/health`
- `GET /api/ghl/auth`
- `GET /api/auth/callback`
- `POST /api/ghl/signup`
- `GET /api/ghl/status`
- `POST /api/ghl/validate`
- `POST /api/ghl/resend`
- `GET /api/ghl/checkout`
- `POST /api/ghl-webhook`
- `GET /api/book/chapter/:num`
