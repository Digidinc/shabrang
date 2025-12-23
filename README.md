# Shabrang Cloudflare Pages

Single Cloudflare Pages project that serves:
- `/` landing page
- `/content/` blog (Astro build)
- `/book/` book pages (static or R2)
- `/api/*` GHL + book access API (Pages Functions)

## Build

1) Place assets:
- Landing: `static/landing/`
- Book (optional): `static/book/` (large; can serve from R2 instead)

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

If you do not include `static/book/`, upload the book to the `STORAGE` bucket
under the `book/` prefix (example: `book/chapter1.html`). The `/book/*` route
is served from R2 via `functions/book/[...path].js`.

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
