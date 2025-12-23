const MIME_TYPES = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "application/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  eot: "application/vnd.ms-fontobject",
  xml: "application/xml; charset=utf-8",
};

function contentTypeFor(pathname) {
  const ext = pathname.split(".").pop()?.toLowerCase();
  return (ext && MIME_TYPES[ext]) || "application/octet-stream";
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const rawPath = Array.isArray(params.path) ? params.path.join("/") : params.path;

  if (url.pathname === "/book") {
    return Response.redirect(`${url.origin}/book/`, 301);
  }

  const normalized = rawPath ? rawPath.replace(/^\/+/, "") : "";
  const key = normalized
    ? `book/${normalized.replace(/\/$/, "")}${normalized.endsWith("/") ? "index.html" : ""}`
    : "book/index.html";

  if (!env.STORAGE) {
    return new Response("Book storage not configured", { status: 500 });
  }

  const obj = await env.STORAGE.get(key);
  if (!obj) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", contentTypeFor(key));
  headers.set("Cache-Control", "public, max-age=604800");

  return new Response(obj.body, { status: 200, headers });
}
