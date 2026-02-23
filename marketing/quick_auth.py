#!/usr/bin/env python3
"""
Quick GHL Authentication URL Generator for Shabrang Dashboard Setup

This script generates the OAuth URL you need to authorize your GHL integration.
After authorization, you'll be able to create the comprehensive marketing dashboard.

Usage:
  python quick_auth.py

Then visit the generated URL in your browser to authorize.
"""

import urllib.parse
import os
from pathlib import Path

# OAuth base URL (GHL)
GHL_AUTH_URL = "https://marketplace.gohighlevel.com/oauth/chooselocation"

# Required scopes for full marketing dashboard functionality
DEFAULT_SCOPES = [
    "contacts.readonly",
    "contacts.write",
    "locations.readonly",
    "campaigns.readonly",
    "campaigns.write",
    "opportunities.readonly",
    "workflows.readonly",
    "workflows.write"
]


def load_env() -> dict:
    """Load environment variables from .env files."""
    env = dict(os.environ)
    env_paths = [
        Path(__file__).parent / ".env",
        Path(__file__).parent.parent.parent / ".env",
        Path.cwd() / ".env",
    ]
    for dotenv_path in env_paths:
        if dotenv_path.exists():
            for line in dotenv_path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                env.setdefault(key.strip(), value.strip())
    return env


def generate_auth_url(client_id: str, redirect_uri: str, scopes: list[str]) -> str:
    """Generate the complete OAuth authorization URL."""

    params = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": " ".join(scopes),
    }

    auth_url = f"{GHL_AUTH_URL}?{urllib.parse.urlencode(params)}"
    return auth_url


def main():
    env = load_env()
    client_id = env.get("GHL_CLIENT_ID")
    redirect_uri = env.get("GHL_REDIRECT_URI", "http://localhost:3000/callback")
    scopes = (env.get("GHL_SCOPES") or "").split() or DEFAULT_SCOPES

    if not client_id:
        print("Missing GHL_CLIENT_ID in .env (or environment).")
        print("Set it, then re-run: python quick_auth.py")
        raise SystemExit(1)

    print("🔑 GoHighLevel OAuth Authorization for Shabrang Dashboard")
    print("=" * 60)
    print()
    print("This URL will authorize your GHL account to connect with the Shabrang marketing system.")
    print("After authorization, you'll be able to create comprehensive marketing dashboards.")
    print()
    print("📋 Required Permissions:")
    for scope in scopes:
        print(f"  • {scope}")
    print()
    print("🔗 Authorization URL:")
    print(generate_auth_url(client_id, redirect_uri, scopes))
    print()
    print("📝 Instructions:")
    print("1. Copy and paste the URL above into your browser")
    print("2. Select your GoHighLevel location")
    print("3. Click 'Authorize' to grant permissions")
    print("4. You'll be redirected to the callback URL")
    print("5. Copy the 'code' parameter from the redirect URL")
    print("6. Use that code to complete the authorization")
    print()
    print("🎯 Next: Create your marketing dashboard in GHL!")
    print("   Follow the guide in: ghl_dashboard_setup.md")

if __name__ == "__main__":
    main()
