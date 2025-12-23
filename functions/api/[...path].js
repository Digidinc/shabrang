const GHL_AUTH_URL = "https://marketplace.gohighlevel.com/oauth/chooselocation";
const GHL_TOKEN_URL = "https://services.leadconnectorhq.com/oauth/token";
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const DEFAULT_TAGS = ["liquid-fortress", "landing-page", "chapter-1-free"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...headers },
  });
}

function htmlResponse(body, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8", ...headers },
  });
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function getTokens(env) {
  if (!env.DB) return null;
  return await env.DB.prepare(
    "SELECT access_token, refresh_token, location_id, expires_at FROM ghl_tokens WHERE id = ?"
  ).bind("default").first();
}

async function saveTokens(env, payload) {
  if (!env.DB) return null;
  const expiresAt = payload.expires_in
    ? new Date(Date.now() + payload.expires_in * 1000).toISOString()
    : null;
  const locationId = payload.locationId || payload.location_id || null;
  await env.DB.prepare(`
    INSERT INTO ghl_tokens (id, access_token, refresh_token, location_id, expires_at, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      access_token = excluded.access_token,
      refresh_token = excluded.refresh_token,
      location_id = excluded.location_id,
      expires_at = excluded.expires_at,
      updated_at = CURRENT_TIMESTAMP
  `).bind(
    "default",
    payload.access_token || null,
    payload.refresh_token || null,
    locationId,
    expiresAt
  ).run();
  return {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    location_id: locationId,
    expires_at: expiresAt,
  };
}

async function refreshToken(env, refreshTokenValue) {
  if (!refreshTokenValue) return null;
  const body = new URLSearchParams({
    client_id: env.GHL_CLIENT_ID || "",
    client_secret: env.GHL_CLIENT_SECRET || "",
    grant_type: "refresh_token",
    refresh_token: refreshTokenValue,
  });

  const response = await fetch(GHL_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  if (!payload.access_token) return null;
  return await saveTokens(env, payload);
}

function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, String(value));
    }
  });
  const query = qs.toString();
  return query ? `?${query}` : "";
}

async function ghlRequest(env, method, path, { params, json } = {}) {
  let tokens = await getTokens(env);
  if (!tokens || !tokens.access_token) {
    return { response: null, payload: { error: "Not authorized" }, status: 503 };
  }

  const url = `${GHL_API_BASE}${path}${buildQuery(params)}`;
  const headers = {
    Authorization: `Bearer ${tokens.access_token}`,
    "Content-Type": "application/json",
    Version: "2021-07-28",
  };

  let response = await fetch(url, {
    method,
    headers,
    body: json ? JSON.stringify(json) : undefined,
  });

  if (response.status === 401) {
    const refreshed = await refreshToken(env, tokens.refresh_token);
    if (refreshed?.access_token) {
      headers.Authorization = `Bearer ${refreshed.access_token}`;
      response = await fetch(url, {
        method,
        headers,
        body: json ? JSON.stringify(json) : undefined,
      });
    }
  }

  const rawText = await response.text();
  let payload = {};
  try {
    payload = JSON.parse(rawText);
  } catch {
    payload = { raw: rawText };
  }

  return { response, payload, status: response.status };
}

function extractChapterHtml(text) {
  const startMarker = '<div class="container">';
  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return null;
  const start = startIndex + startMarker.length;
  const end = text.lastIndexOf("</div>");
  if (end === -1 || end <= start) return null;
  let body = text.slice(start, end).trim();
  body = body.replace(/<div style="text-align: center;.*?<\/div>/s, "");
  body = body.replace(/<h1>.*?<\/h1>/s, "");
  body = body.replace(/<div class="nav-footer">.*?<\/div>/s, "");
  return body.trim();
}

async function fetchChapterSource(env, request, chapterNum) {
  const key = `book/chapter${chapterNum}.html`;
  if (env.STORAGE) {
    const obj = await env.STORAGE.get(key);
    if (obj) {
      return await obj.text();
    }
  }
  if (env.ASSETS) {
    const url = new URL(`/book/chapter${chapterNum}.html`, request.url);
    const response = await env.ASSETS.fetch(url);
    if (response.ok) {
      return await response.text();
    }
  }
  return null;
}

function getTokenFromRequest(request, url) {
  return url.searchParams.get("token") || request.headers.get("X-Access-Token");
}

async function logWebhookEvent(env, eventType, contactId, payload) {
  if (!env.DB) return;
  await env.DB.prepare(
    "INSERT INTO ghl_events (event_type, contact_id, payload) VALUES (?, ?, ?)"
  ).bind(eventType, contactId || null, JSON.stringify(payload)).run();
}

async function ensureUser(env, { email, name, contactId }) {
  if (!env.DB || !email) return;
  const existing = await env.DB.prepare(
    "SELECT id FROM users WHERE email = ? OR ghl_contact_id = ?"
  ).bind(email, contactId || null).first();
  if (existing) return;
  await env.DB.prepare(
    "INSERT INTO users (id, email, name, ghl_contact_id, access_level) VALUES (?, ?, ?, ?, ?)"
  ).bind(
    crypto.randomUUID(),
    email,
    name || null,
    contactId || null,
    "free"
  ).run();
}

async function updateAccessLevel(env, contactId, accessLevel) {
  if (!env.DB || !contactId) return;
  await env.DB.prepare(
    "UPDATE users SET access_level = ?, updated_at = CURRENT_TIMESTAMP WHERE ghl_contact_id = ?"
  ).bind(accessLevel, contactId).run();
}

async function validateAccessToken(env, token) {
  if (!token) return { valid: false, error: "No token provided" };

  const contactId = token.split("_")[0];
  const { response, payload } = await ghlRequest(env, "GET", `/contacts/${contactId}`);
  if (!response) {
    return { valid: false, error: payload.error || "Service not authorized" };
  }
  if (response.status >= 400) {
    return { valid: false, error: "Contact not found" };
  }

  const contact = payload.contact || payload;
  if (!contact || typeof contact !== "object") {
    return { valid: false, error: "Invalid contact payload" };
  }

  const requiredTag = env.GHL_PREMIUM_TAG || "shabrang-premium";
  const tags = contact.tags || [];
  if (requiredTag && !tags.includes(requiredTag)) {
    return { valid: false, error: "No premium access" };
  }

  const tokenFieldKey = env.GHL_TOKEN_FIELD_KEY || "book_access_token";
  const allowContactId = (env.GHL_ALLOW_CONTACT_ID_TOKEN || "true").toLowerCase() === "true";
  let fieldValue = null;
  const customFields = contact.customFields || [];
  for (const field of customFields) {
    if (field.key === tokenFieldKey) {
      fieldValue = field.value;
      break;
    }
  }

  if (fieldValue) {
    if (fieldValue !== token) {
      return { valid: false, error: "Token mismatch" };
    }
  } else if (!allowContactId) {
    return { valid: false, error: "Token not provisioned" };
  } else if (token !== contactId && !token.includes("_")) {
    return { valid: false, error: "Token mismatch" };
  }

  return {
    valid: true,
    contact_id: contactId,
    name: contact.firstName || contact.name,
    email: contact.email,
  };
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (path === "/api/health" && method === "GET") {
    const tokens = await getTokens(env);
    return jsonResponse({
      status: "ok",
      service: "Shabrang GHL API",
      has_token: Boolean(tokens?.access_token),
      timestamp: new Date().toISOString(),
    });
  }

  if ((path === "/api/ghl-webhook" || path === "/api/ghl/webhook") && method === "GET") {
    return jsonResponse({ status: "ok", service: "shabrang-ghl-webhook" });
  }

  if (path === "/api/ghl/auth" && method === "GET") {
    const clientId = env.GHL_CLIENT_ID;
    if (!clientId) {
      return jsonResponse({ error: "GHL_CLIENT_ID not configured" }, 500);
    }
    const redirectUri = env.GHL_REDIRECT_URI || "https://shabrang.ca/api/auth/callback";
    const scopes = env.GHL_SCOPES || "contacts.readonly contacts.write locations.readonly";
    const authUrl =
      `${GHL_AUTH_URL}?response_type=code&client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scopes)}`;
    return Response.redirect(authUrl, 302);
  }

  if (path === "/api/auth/callback" && method === "GET") {
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    if (error) {
      return htmlResponse(
        `<html><head><title>Authorization Failed</title></head><body style="font-family: sans-serif; padding: 40px; text-align: center;">
        <h1 style="color: #8B3535;">Authorization Failed</h1><p>Error: ${error}</p>
        <a href="https://shabrang.ca">Return to Shabrang</a></body></html>`,
        400
      );
    }
    if (!code) {
      return jsonResponse({ error: "No authorization code received" }, 400);
    }

    const body = new URLSearchParams({
      client_id: env.GHL_CLIENT_ID || "",
      client_secret: env.GHL_CLIENT_SECRET || "",
      grant_type: "authorization_code",
      code,
      redirect_uri: env.GHL_REDIRECT_URI || "https://shabrang.ca/api/auth/callback",
    });

    const response = await fetch(GHL_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const payload = await response.json();
    if (!response.ok || !payload.access_token) {
      return jsonResponse({ error: "Token exchange failed", details: payload }, 400);
    }

    await saveTokens(env, payload);

    return htmlResponse(`
      <html><head><title>Authorization Successful</title>
        <style>
          body { font-family: 'Cormorant Garamond', Georgia, serif; padding: 40px; text-align: center; background: #F5E6C8; color: #1A1A18; }
          h1 { color: #2D5A6B; }
          .success { color: #3D5C3D; }
          a { color: #C9A227; }
        </style>
      </head>
      <body>
        <h1>Authorization Successful!</h1>
        <p class="success">Go HighLevel is now connected to Shabrang.</p>
        <p>Location ID: ${payload.locationId || "N/A"}</p>
        <p><a href="https://shabrang.ca">Return to Shabrang</a></p>
      </body></html>
    `);
  }

  if (path === "/api/ghl/signup" && method === "POST") {
    const data = await readJson(request);
    const email = (data.email || "").trim();
    if (!email) {
      return jsonResponse({ success: false, error: "Email is required" }, 400);
    }
    if (!email.includes("@") || !email.includes(".")) {
      return jsonResponse({ success: false, error: "Invalid email format" }, 400);
    }

    const tokens = await getTokens(env);
    const locationId = tokens?.location_id || env.GHL_LOCATION_ID;
    if (!tokens?.access_token) {
      return jsonResponse({ success: false, error: "Service not authorized." }, 503);
    }
    if (!locationId) {
      return jsonResponse({ success: false, error: "Location ID not configured" }, 500);
    }

    const contactPayload = {
      locationId,
      email,
      tags: DEFAULT_TAGS,
      source: data.source || "Landing Page - The Liquid Fortress",
    };
    if (data.firstName) contactPayload.firstName = data.firstName.trim();
    if (data.lastName) contactPayload.lastName = data.lastName.trim();

    const { response, payload } = await ghlRequest(env, "POST", "/contacts/upsert", {
      json: contactPayload,
    });

    if (response && (response.status === 200 || response.status === 201)) {
      const contact = payload.contact || payload;
      return jsonResponse({
        success: true,
        message: "Welcome to The Liquid Fortress! Check your email for Chapter 1.",
        contactId: contact?.id,
      });
    }

    return jsonResponse(
      { success: false, error: "Unable to process signup. Please try again." },
      response ? response.status : 500
    );
  }

  if (path === "/api/ghl/status" && method === "GET") {
    const tokens = await getTokens(env);
    return jsonResponse({
      connected: Boolean(tokens?.access_token),
      location_id: tokens?.location_id || env.GHL_LOCATION_ID || null,
      has_refresh_token: Boolean(tokens?.refresh_token),
    });
  }

  if (path === "/api/ghl/validate" && method === "POST") {
    const data = await readJson(request);
    const token = data.token || url.searchParams.get("token");
    const result = await validateAccessToken(env, token);
    return jsonResponse(result, result.valid ? 200 : 403);
  }

  if (path === "/api/ghl/resend" && method === "POST") {
    const data = await readJson(request);
    const email = (data.email || "").trim();
    if (!email) {
      return jsonResponse({ success: false, error: "Email required" }, 400);
    }

    const workflowId = env.GHL_RESEND_WORKFLOW_ID;
    if (!workflowId) {
      return jsonResponse({ success: false, error: "Resend workflow not configured" }, 501);
    }

    const locationId = env.GHL_LOCATION_ID;
    if (!locationId) {
      return jsonResponse({ success: false, error: "Location ID not configured" }, 500);
    }

    const search = await ghlRequest(env, "GET", "/contacts/search", {
      params: { locationId, email },
    });
    if (!search.response || search.response.status >= 400) {
      return jsonResponse({ success: false, error: "Contact lookup failed" }, 502);
    }

    const contacts = search.payload.contacts || [];
    if (!contacts.length) {
      return jsonResponse({ success: true });
    }

    const contact = contacts[0];
    const requiredTag = env.GHL_PREMIUM_TAG || "shabrang-premium";
    if (requiredTag && !(contact.tags || []).includes(requiredTag)) {
      return jsonResponse({ success: true });
    }

    const trigger = await ghlRequest(env, "POST", `/contacts/${contact.id}/workflow/${workflowId}`);
    if (!trigger.response || trigger.response.status >= 400) {
      return jsonResponse({ success: false, error: "Workflow trigger failed" }, 502);
    }

    return jsonResponse({ success: true });
  }

  if (path === "/api/ghl/checkout" && method === "GET") {
    const checkoutUrl = env.GHL_CHECKOUT_URL;
    if (!checkoutUrl) {
      return jsonResponse({
        error: "Checkout URL not configured",
        details: "Set GHL_CHECKOUT_URL in Cloudflare env vars",
      }, 404);
    }
    return Response.redirect(checkoutUrl, 302);
  }

  if (path.startsWith("/api/book/chapter/") && method === "GET") {
    const chapterNum = parseInt(path.split("/").pop(), 10);
    if (!Number.isFinite(chapterNum)) {
      return jsonResponse({ valid: false, error: "Invalid chapter" }, 400);
    }
    const token = getTokenFromRequest(request, url);
    const access = await validateAccessToken(env, token);
    if (!access.valid) {
      return jsonResponse(access, 403);
    }

    const source = await fetchChapterSource(env, request, chapterNum);
    if (!source) {
      return jsonResponse({ valid: true, error: "Chapter not found" }, 404);
    }
    const html = extractChapterHtml(source);
    if (!html) {
      return jsonResponse({ valid: true, error: "Chapter not available" }, 404);
    }

    return jsonResponse({ valid: true, chapter: chapterNum, html });
  }

  if ((path === "/api/ghl/webhook" || path === "/api/ghl-webhook") && method === "POST") {
    const body = await readJson(request);
    const eventType = body.type || "unknown";

    await logWebhookEvent(env, eventType, body.contactId || null, body);

    switch (eventType) {
      case "contact.created":
      case "ContactCreate": {
        const fullName = `${body.firstName || ""} ${body.lastName || ""}`.trim();
        await ensureUser(env, {
          email: body.email,
          name: fullName,
          contactId: body.contactId,
        });
        break;
      }
      case "payment.received":
      case "PaymentReceived":
      case "order.completed":
        await updateAccessLevel(env, body.contactId, "premium");
        break;
      case "contact.tag.added":
      case "ContactTagUpdate": {
        const premiumTag = env.GHL_PREMIUM_TAG || "shabrang-premium";
        const tags = body.tags || [];
        if (tags.includes(premiumTag)) {
          await updateAccessLevel(env, body.contactId, "premium");
        }
        break;
      }
      default:
        break;
    }

    return jsonResponse({ success: true, message: `Processed ${eventType}` });
  }

  return jsonResponse({ error: "Not found" }, 404);
}
