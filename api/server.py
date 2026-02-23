#!/usr/bin/env python3
"""
Shabrang API Server
Handles Go HighLevel OAuth and contact signups for The Liquid Fortress.

Run:
  python server.py                    # Development mode (port 5000)
  gunicorn -w 4 -b 0.0.0.0:5000 server:app  # Production

Endpoints:
  GET  /api/health                    - Health check
  GET  /api/ghl/auth                  - Start OAuth flow
  GET  /api/auth/callback              - OAuth callback (receives code)
  POST /api/ghl/signup                - Add contact from landing page
"""

import json
import os
import logging
import re
import asyncio
from pathlib import Path
from datetime import datetime
from functools import wraps

from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import requests
import sys
import stripe

# Ensure shabrang_core is importable
sys.path.append(str(Path(__file__).parent.parent))
from shabrang_core.agent.sovereign import ShabrangSovereign

# Configuration
app = Flask(__name__)
CORS(app, origins=["https://shabrang.ca", "https://www.shabrang.ca", "http://localhost:*"])

# Initialize Shabrang Sovereign Agent
sovereign = ShabrangSovereign()

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths
BASE_DIR = Path(__file__).parent
TOKEN_FILE = BASE_DIR / ".ghl_tokens.json"
ENV_FILE = BASE_DIR / ".env"

# GHL Constants
GHL_AUTH_URL = "https://marketplace.gohighlevel.com/oauth/chooselocation"
GHL_TOKEN_URL = "https://services.leadconnectorhq.com/oauth/token"
GHL_API_BASE = "https://services.leadconnectorhq.com"

# Stripe Constants (Loaded from env in endpoint)
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
stripe.api_key = os.getenv("STRIPE_API_KEY")

# Default tags for Liquid Fortress signups
DEFAULT_TAGS = ["liquid-fortress", "landing-page", "chapter-1-free"]


def load_env():
    """Load environment variables from .env file into os.environ."""
    # Check multiple .env locations
    env_paths = [
        ENV_FILE,
        BASE_DIR.parent / ".env",
        Path("/opt/shabrang/.env"),
    ]

    for dotenv_path in env_paths:
        if dotenv_path.exists():
            logger.info(f"Loading env from: {dotenv_path}")
            try:
                for line in dotenv_path.read_text(encoding="utf-8").splitlines():
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    key, value = line.split("=", 1)
                    # Update process environment
                    os.environ[key.strip()] = value.strip()
            except Exception as e:
                logger.error(f"Failed to read env file: {e}")
            break

# Load env immediately so global constants work (e.g. Stripe)
load_env()


def load_tokens():
    """Load stored tokens."""
    if TOKEN_FILE.exists():
        try:
            return json.loads(TOKEN_FILE.read_text())
        except Exception as e:
            logger.error(f"Error loading tokens: {e}")
    return {}


def save_tokens(tokens):
    """Save tokens to file."""
    TOKEN_FILE.write_text(json.dumps(tokens, indent=2))
    logger.info(f"Tokens saved to: {TOKEN_FILE}")


def get_access_token():
    """Get current access token, refreshing if needed."""
    tokens = load_tokens()
    env = load_env()

    if not tokens.get("access_token"):
        return None

    # Check if token needs refresh (simple time-based check)
    # In production, check actual expiry
    if tokens.get("refresh_token"):
        # Try to use existing token first
        return tokens.get("access_token")

    return tokens.get("access_token")


def refresh_token():
    """Refresh the access token."""
    tokens = load_tokens()
    env = load_env()

    if not tokens.get("refresh_token"):
        logger.error("No refresh token available")
        return None

    payload = {
        "client_id": env.get("GHL_CLIENT_ID"),
        "client_secret": env.get("GHL_CLIENT_SECRET"),
        "grant_type": "refresh_token",
        "refresh_token": tokens["refresh_token"],
    }

    try:
        resp = requests.post(
            GHL_TOKEN_URL,
            data=payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=30
        )
        result = resp.json()

        if "access_token" in result:
            save_tokens(result)
            return result["access_token"]
        else:
            logger.error(f"Token refresh failed: {result}")
            return None
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        return None


# =============================================================================
# GHL HELPERS
# =============================================================================

def get_ghl_headers(access_token: str) -> dict:
    return {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Version": "2021-07-28",
    }

def ghl_request(method: str, path: str, params: dict | None = None, json_body: dict | None = None):
    """Call GHL API with automatic refresh on 401."""
    access_token = get_access_token()
    if not access_token:
        return None, {"error": "Not authorized"}

    headers = get_ghl_headers(access_token)
    url = f"{GHL_API_BASE}{path}"
    resp = requests.request(method, url, headers=headers, params=params, json=json_body, timeout=30)

    if resp.status_code == 401:
        new_token = refresh_token()
        if new_token:
            headers = get_ghl_headers(new_token)
            resp = requests.request(method, url, headers=headers, params=params, json=json_body, timeout=30)

    try:
        payload = resp.json()
    except Exception:
        payload = {"raw": resp.text}

    return resp, payload

def extract_chapter_html(chapter_path: Path) -> str | None:
    """Extract the inner container HTML for a chapter."""
    if not chapter_path.exists():
        return None

    text = chapter_path.read_text(encoding="utf-8")
    start_marker = '<div class="container">'
    start_idx = text.find(start_marker)
    if start_idx == -1:
        return None
    start_idx += len(start_marker)
    end_idx = text.rfind("</div>")
    if end_idx == -1 or end_idx <= start_idx:
        return None

    body = text[start_idx:end_idx].strip()

    # Remove top home icon and first H1 to avoid duplication in preview pages.
    body = re.sub(r'<div style="text-align: center;.*?</div>', '', body, flags=re.S)
    body = re.sub(r'<h1>.*?</h1>', '', body, count=1, flags=re.S)
    body = re.sub(r'<div class="nav-footer">.*?</div>', '', body, flags=re.S)

    return body.strip()

def validate_access_token(token: str) -> dict:
    """Validate a token against GHL contact + tags/custom field."""
    env = load_env()
    if not token:
        return {"valid": False, "error": "No token provided"}

    contact_id = token.split("_")[0]
    resp, payload = ghl_request("GET", f"/contacts/{contact_id}")
    if resp is None or resp.status_code >= 400:
        return {"valid": False, "error": "Contact not found"}

    contact = payload.get("contact", payload)
    if not isinstance(contact, dict):
        return {"valid": False, "error": "Invalid contact payload"}

    required_tag = env.get("GHL_PREMIUM_TAG", "shabrang-premium")
    tags = contact.get("tags", []) or []
    if required_tag and required_tag not in tags:
        return {"valid": False, "error": "No premium access"}

    token_field_key = env.get("GHL_TOKEN_FIELD_KEY", "book_access_token")
    allow_contact_id = env.get("GHL_ALLOW_CONTACT_ID_TOKEN", "true").lower() == "true"
    field_value = None
    for field in contact.get("customFields", []) or []:
        if field.get("key") == token_field_key:
            field_value = field.get("value")
            break

    if field_value:
        if field_value != token:
            return {"valid": False, "error": "Token mismatch"}
    elif not allow_contact_id:
        return {"valid": False, "error": "Token not provisioned"}
    elif token != contact_id and "_" not in token:
        return {"valid": False, "error": "Token mismatch"}

    return {
        "valid": True,
        "contact_id": contact_id,
        "name": contact.get("firstName") or contact.get("name"),
        "email": contact.get("email")
    }

# =============================================================================
# API ENDPOINTS
# =============================================================================

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    tokens = load_tokens()
    return jsonify({
        "status": "ok",
        "service": "Shabrang GHL API",
        "has_token": bool(tokens.get("access_token")),
        "timestamp": datetime.utcnow().isoformat()
    })


@app.route("/api/ghl/auth", methods=["GET"])
def start_oauth():
    """Start OAuth authorization flow - redirects to GHL."""
    env = load_env()

    client_id = env.get("GHL_CLIENT_ID")
    redirect_uri = env.get("GHL_REDIRECT_URI", "https://shabrang.ca/api/auth/callback")
    scopes = env.get("GHL_SCOPES", "contacts.readonly contacts.write locations.readonly")

    if not client_id:
        return jsonify({"error": "GHL_CLIENT_ID not configured"}), 500

    auth_url = (
        f"{GHL_AUTH_URL}?"
        f"response_type=code&"
        f"client_id={client_id}&"
        f"redirect_uri={requests.utils.quote(redirect_uri)}&"
        f"scope={requests.utils.quote(scopes)}"
    )

    return redirect(auth_url)


@app.route("/api/auth/callback", methods=["GET"])
def oauth_callback():
    """OAuth callback - exchanges code for tokens."""
    env = load_env()
    code = request.args.get("code")
    error = request.args.get("error")

    if error:
        logger.error(f"OAuth error: {error}")
        return f"""
        <html>
        <head><title>Authorization Failed</title></head>
        <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h1 style="color: #8B3535;">Authorization Failed</h1>
            <p>Error: {error}</p>
            <a href="https://shabrang.ca">Return to Shabrang</a>
        </body>
        </html>
        """, 400

    if not code:
        return jsonify({"error": "No authorization code received"}), 400

    # Exchange code for token
    payload = {
        "client_id": env.get("GHL_CLIENT_ID"),
        "client_secret": env.get("GHL_CLIENT_SECRET"),
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": env.get("GHL_REDIRECT_URI", "https://shabrang.ca/api/auth/callback"),
    }

    # Debug logging
    logger.info(f"Token exchange - Client ID: {env.get('GHL_CLIENT_ID')}")
    logger.info(f"Token exchange - Redirect URI: {payload['redirect_uri']}")
    logger.info(f"Token exchange - Code: {code[:20]}...")

    try:
        resp = requests.post(
            GHL_TOKEN_URL,
            data=payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=30
        )
        logger.info(f"Token exchange response status: {resp.status_code}")
        logger.info(f"Token exchange response: {resp.text[:200]}")
        result = resp.json()

        if "access_token" in result:
            save_tokens(result)
            logger.info(f"OAuth success! Location ID: {result.get('locationId')}")

            return f"""
            <html>
            <head>
                <title>Authorization Successful</title>
                <style>
                    body {{
                        font-family: 'Cormorant Garamond', Georgia, serif;
                        padding: 40px;
                        text-align: center;
                        background: #F5E6C8;
                        color: #1A1A18;
                    }}
                    h1 {{ color: #2D5A6B; }}
                    .success {{ color: #3D5C3D; }}
                    a {{ color: #C9A227; }}
                </style>
            </head>
            <body>
                <h1>Authorization Successful!</h1>
                <p class="success">Go HighLevel is now connected to Shabrang.</p>
                <p>Location ID: {result.get('locationId', 'N/A')}</p>
                <p><a href="https://shabrang.ca">Return to Shabrang</a></p>
            </body>
            </html>
            """
        else:
            logger.error(f"Token exchange failed: {result}")
            return jsonify({"error": "Token exchange failed", "details": result}), 400

    except Exception as e:
        logger.error(f"OAuth callback error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/ghl/signup", methods=["POST"])
def signup():
    """
    Add a contact from the landing page signup form.

    Expected JSON body:
    {
        "email": "user@example.com",
        "firstName": "John",      # optional
        "lastName": "Doe",        # optional
        "source": "landing-page"  # optional
    }
    """
    env = load_env()
    tokens = load_tokens()

    access_token = tokens.get("access_token")
    location_id = tokens.get("locationId") or env.get("GHL_LOCATION_ID")

    if not access_token:
        logger.error("No access token - need to authorize first")
        return jsonify({
            "success": False,
            "error": "Service not authorized. Please contact admin."
        }), 503

    if not location_id:
        return jsonify({
            "success": False,
            "error": "Location ID not configured"
        }), 500

    # Get request data
    data = request.get_json() or {}
    email = data.get("email", "").strip()

    if not email:
        return jsonify({
            "success": False,
            "error": "Email is required"
        }), 400

    # Validate email format (basic check)
    if "@" not in email or "." not in email:
        return jsonify({
            "success": False,
            "error": "Invalid email format"
        }), 400

    # Build contact payload
    contact_payload = {
        "locationId": location_id,
        "email": email,
        "tags": DEFAULT_TAGS,
        "source": data.get("source", "Landing Page - The Liquid Fortress"),
    }

    if data.get("firstName"):
        contact_payload["firstName"] = data["firstName"].strip()
    if data.get("lastName"):
        contact_payload["lastName"] = data["lastName"].strip()

    # Call GHL API to upsert contact
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Version": "2021-07-28",
    }

    try:
        resp = requests.post(
            f"{GHL_API_BASE}/contacts/upsert",
            headers=headers,
            json=contact_payload,
            timeout=15
        )

        result = resp.json()

        if resp.status_code == 200 or resp.status_code == 201:
            contact = result.get("contact", result)
            logger.info(f"Contact added/updated: {email}")
            
            # Trigger Sovereign Fulfillment (Bridge Sync Flask -> Async Agent)
            try:
                customer_data = {
                    "email": email,
                    "name": f"{contact.get('firstName', '')} {contact.get('lastName', '')}".strip(),
                    "contactId": contact.get("id"),
                    "source": "api-signup"
                }
                # Create a new loop for this thread if needed, or use asyncio.run
                asyncio.run(sovereign.handle_new_customer(customer_data))
            except Exception as e:
                logger.error(f"Failed to trigger sovereign fulfillment: {e}")

            return jsonify({
                "success": True,
                "message": "Welcome to The Liquid Fortress! Check your email for Chapter 1.",
                "contactId": contact.get("id")
            })

        elif resp.status_code == 401:
            # Token expired - try to refresh
            logger.warning("Token expired, attempting refresh...")
            new_token = refresh_token()
            if new_token:
                # Retry with new token
                headers["Authorization"] = f"Bearer {new_token}"
                resp = requests.post(
                    f"{GHL_API_BASE}/contacts/upsert",
                    headers=headers,
                    json=contact_payload,
                    timeout=15
                )
                if resp.status_code in (200, 201):
                    return jsonify({
                        "success": True,
                        "message": "Welcome to The Liquid Fortress! Check your email for Chapter 1."
                    })

            return jsonify({
                "success": False,
                "error": "Authorization expired. Please try again later."
            }), 503

        else:
            logger.error(f"GHL API error: {resp.status_code} - {result}")
            return jsonify({
                "success": False,
                "error": "Unable to process signup. Please try again."
            }), 500

    except requests.Timeout:
        logger.error("GHL API timeout")
        return jsonify({
            "success": False,
            "error": "Request timed out. Please try again."
        }), 504

    except Exception as e:
        logger.error(f"Signup error: {e}")
        return jsonify({
            "success": False,
            "error": "An error occurred. Please try again."
        }), 500


@app.route("/api/ghl/status", methods=["GET"])
def ghl_status():
    """Check GHL connection status (admin only in production)."""
    tokens = load_tokens()
    env = load_env()

    return jsonify({
        "connected": bool(tokens.get("access_token")),
        "location_id": tokens.get("locationId") or env.get("GHL_LOCATION_ID"),
        "has_refresh_token": bool(tokens.get("refresh_token")),
    })


@app.route("/api/ghl/validate", methods=["POST"])
def ghl_validate():
    """Validate a premium access token."""
    data = request.get_json() or {}
    token = data.get("token") or request.args.get("token")
    result = validate_access_token(token)
    status = 200 if result.get("valid") else 403
    return jsonify(result), status


@app.route("/api/ghl/resend", methods=["POST"])
def ghl_resend():
    """Resend access link via GHL workflow (requires workflow id)."""
    env = load_env()
    data = request.get_json() or {}
    email = (data.get("email") or "").strip()

    if not email:
        return jsonify({"success": False, "error": "Email required"}), 400

    workflow_id = env.get("GHL_RESEND_WORKFLOW_ID")
    if not workflow_id:
        return jsonify({"success": False, "error": "Resend workflow not configured"}), 501

    location_id = env.get("GHL_LOCATION_ID")
    if not location_id:
        return jsonify({"success": False, "error": "Location ID not configured"}), 500

    resp, payload = ghl_request(
        "GET",
        "/contacts/search",
        params={"locationId": location_id, "email": email}
    )
    if resp is None or resp.status_code >= 400:
        return jsonify({"success": False, "error": "Contact lookup failed"}), 502

    contacts = payload.get("contacts", [])
    if not contacts:
        return jsonify({"success": True})  # avoid leaking membership info

    contact = contacts[0]
    required_tag = env.get("GHL_PREMIUM_TAG", "shabrang-premium")
    if required_tag and required_tag not in (contact.get("tags", []) or []):
        return jsonify({"success": True})

    resp, payload = ghl_request(
        "POST",
        f"/contacts/{contact.get('id')}/workflow/{workflow_id}"
    )
    if resp is None or resp.status_code >= 400:
        return jsonify({"success": False, "error": "Workflow trigger failed"}), 502

    return jsonify({"success": True})


@app.route("/api/ghl/checkout", methods=["GET"])
def ghl_checkout():
    """Redirect to the configured GHL checkout URL."""
    env = load_env()
    checkout_url = env.get("GHL_CHECKOUT_URL")
    if not checkout_url:
        return jsonify({
            "error": "Checkout URL not configured",
            "details": "Set GHL_CHECKOUT_URL in /opt/shabrang/repo/api/.env"
        }), 404
    return redirect(checkout_url)


@app.route("/api/book/chapter/<int:chapter_num>", methods=["GET"])
def book_chapter(chapter_num: int):
    """Return full chapter HTML for premium users."""
    token = request.args.get("token") or request.headers.get("X-Access-Token")
    access = validate_access_token(token)
    if not access.get("valid"):
        return jsonify(access), 403

    chapter_path = Path(f"/opt/shabrang/repo/Book/chapter{chapter_num}.html")
    content = extract_chapter_html(chapter_path)
    if not content:
        return jsonify({"valid": True, "error": "Chapter not found"}), 404

    return jsonify({
        "valid": True,
        "chapter": chapter_num,
        "html": content
    })


@app.route("/api/checkout", methods=["POST"])
def checkout():
    """
    Handle checkout for books or academy.
    Supports Stripe, TON, and SOL.
    """
    data = request.get_json() or {}
    email = data.get("email")
    plan = data.get("plan", "book-physical")
    currency = data.get("currency", "STRIPE")
    
    if not email:
        return jsonify({"success": False, "error": "Email is required"}), 400

    logger.info(f"Checkout initiated: {email} for {plan} via {currency}")
    
    # Process through Sovereign Agent (orchestrates payments and fulfillment)
    # Note: Flask is sync, sovereign methods are async. Use asyncio.run or loop.
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(sovereign.process_checkout(plan, currency, data))
        loop.close()
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Checkout error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/checkout/status", methods=["GET"])
def checkout_status():
    """Check payment/fulfillment status for a user."""
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email required"}), 400
        
    # Query Notion or GHL via Sovereign Agent
    return jsonify({"status": "processing", "email": email})


@app.route("/api/stripe/webhook", methods=["POST"])
def stripe_webhook():
    """
    Handle Stripe Webhooks (e.g. successful payments).
    """
    payload = request.get_data()
    sig_header = request.headers.get("Stripe-Signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        logger.error(f"Invalid payload: {e}")
        return "Invalid payload", 400
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid signature: {e}")
        return "Invalid signature", 400

    # Handle the event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        
        # Extract customer info
        customer_email = session.get("customer_details", {}).get("email")
        customer_name = session.get("customer_details", {}).get("name")
        client_ref = session.get("client_reference_id")
        
        logger.info(f"💰 Payment Received: {customer_email} ({customer_name})")
        
        # Trigger Sovereign
        try:
             # Use the same event loop strategy or asyncio.run
             asyncio.run(sovereign.handle_new_customer({
                 "email": customer_email,
                 "name": customer_name,
                 "source": "stripe-checkout",
                 "client_ref": client_ref,
                 "amount_total": session.get("amount_total"),
                 "currency": session.get("currency")
             }))
        except Exception as e:
             logger.error(f"Sovereign trigger failed: {e}")
             return jsonify(success=False), 500

    return jsonify(success=True)


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    env = load_env()

    print("\n" + "="*50)
    print("  SHABRANG API SERVER")
    print("  The Liquid Fortress - GHL Integration")
    print("="*50)

    tokens = load_tokens()
    if tokens.get("access_token"):
        print(f"  GHL Status: Connected (Location: {tokens.get('locationId', 'N/A')})")
    else:
        print("  GHL Status: Not connected")
        print(f"  To authorize, visit: http://localhost:5000/api/ghl/auth")

    print("="*50 + "\n")

    app.run(host="0.0.0.0", port=5000, debug=True)
