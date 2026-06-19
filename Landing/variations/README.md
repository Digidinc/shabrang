## Landing variations

This folder is intended to hold **deployable** landing-page variations.

If you’re using **Next.js** for these variations, you typically have two options:

### Option A (recommended): Static export (no Node server)

Build each Next.js variation as a static site and copy the exported output into:

- `Landing/variations/realistic/`
- `Landing/variations/miniature/`

For Next.js 13+ you can use `output: "export"` and set a `basePath` so assets and links work under the subpath:

- Realistic: `basePath: "/variations/realistic"`
- Miniature: `basePath: "/variations/miniature"`

In addition, set:

- `trailingSlash: true` so the export produces `.../index.html` files that work well with Nginx directory indexes.
- `images: { unoptimized: true }` for static export compatibility.

After export, the folder you deploy should contain an `index.html` (plus `_next/` and other assets).

### Option B: Run Next.js server(s) and reverse-proxy via Nginx

If you need SSR, each variation needs a running Node process (on separate ports or separate apps), plus Nginx `location` blocks that `proxy_pass` to them. In that case, you still want `basePath` set so URLs are under `/variations/<name>`.

