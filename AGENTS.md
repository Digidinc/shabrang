# Shabrang Refactor Agent Notes

This repo is a single Cloudflare Pages project that serves landing, blog, book, and `/api/*` from one deploy.

## Architecture
- `/` landing page: `static/landing/`
- `/content/` blog: Astro build from `apps/site/` (base path is `/content`)
- `/book/*` book: served from R2 via `functions/book/[...path].js`
- `/api/*` GHL + access control: `functions/api/[...path].js`
- D1 schema: `infra/schema.sql`

## Key Files
- Build script: `build.sh`
- R2 upload: `upload-book-r2.sh`
- Cloudflare config: `wrangler.toml`
- Blog source: `apps/site/`
- Landing assets: `static/landing/`

## Local Workflow
1) Build:
   ```bash
   ./build.sh
   ```
2) Upload book to R2:
   ```bash
   ./upload-book-r2.sh /opt/shabrang/repo/Book/dist shabrang-assets book
   ```
3) Apply D1 schema:
   ```bash
   wrangler d1 execute shabrang-db --remote --file infra/schema.sql
   ```
4) Deploy:
   ```bash
   wrangler pages deploy dist --project-name shabrang
   ```

## Environment Variables
Store in `.dev.vars` (never commit):
- `GHL_CLIENT_ID`
- `GHL_CLIENT_SECRET`
- `GHL_LOCATION_ID`
- `GHL_REDIRECT_URI`
- `GHL_SCOPES`
- `GHL_PREMIUM_TAG`
- `GHL_TOKEN_FIELD_KEY`
- `GHL_ALLOW_CONTACT_ID_TOKEN`
- `GHL_RESEND_WORKFLOW_ID`
- `GHL_CHECKOUT_URL`
- `CLOUDFLARE_API_TOKEN` (must include Pages + D1 + R2 permissions)

## Notes
- `wrangler.toml` for Pages must not include `account_id`.
- If you move the blog to `/blog`, update `apps/site/astro.config.mjs` (`base`) and all `/content` links.
