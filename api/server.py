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
  GET  /api/ghl/callback              - OAuth callback (receives code)
  POST /api/ghl/signup                - Add contact from landing page
"""

import json
import os
import logging
from pathlib import Path
from datetime import datetime
from functools import wraps

from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import requests

# Configuration
app = Flask(__name__)
CORS(app, origins=["https://shabrang.ca", "https://www.shabrang.ca", "http://localhost:*"])

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

# Default tags for Liquid Fortress signups
DEFAULT_TAGS = ["liquid-fortress", "landing-page", "chapter-1-free"]


def load_env():
    """Load environment variables from .env file."""
    env = dict(os.environ)

    # Check multiple .env locations
    env_paths = [
        ENV_FILE,
        BASE_DIR.parent / ".env",
        Path("/opt/shabrang/.env"),
    ]

    for dotenv_path in env_paths:
        if dotenv_path.exists():
            logger.info(f"Loading env from: {dotenv_path}")
            for line in dotenv_path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                env.setdefault(key.strip(), value.strip())
            break

    return env


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
    redirect_uri = env.get("GHL_REDIRECT_URI", "https://shabrang.ca/api/ghl/callback")
    scopes = "contacts.readonly contacts.write locations.readonly"

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


@app.route("/api/ghl/callback", methods=["GET"])
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
        "redirect_uri": env.get("GHL_REDIRECT_URI", "https://shabrang.ca/api/ghl/callback"),
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
