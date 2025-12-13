#!/usr/bin/env python3
"""
Go HighLevel OAuth Helper for getting access tokens.

Steps:
1. Create an app in GHL Marketplace (Settings > Integrations > Marketplace)
2. Get your Client ID and Client Secret
3. Run: python ghl_oauth.py --auth
4. Authorize in browser, copy the code from redirect URL
5. Run: python ghl_oauth.py --token YOUR_CODE

Environment variables needed in .env:
  GHL_CLIENT_ID=your_client_id
  GHL_CLIENT_SECRET=your_client_secret
  GHL_REDIRECT_URI=http://localhost:3000/callback (or your redirect URI)
"""

import os
import sys
import json
import webbrowser
from pathlib import Path
from urllib.parse import urlencode
import requests


GHL_AUTH_URL = "https://marketplace.gohighlevel.com/oauth/chooselocation"
GHL_TOKEN_URL = "https://services.leadconnectorhq.com/oauth/token"

# Scopes needed for contact management
SCOPES = [
    "contacts.readonly",
    "contacts.write",
    "locations.readonly",
    "forms.readonly",
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


def get_auth_url(client_id: str, redirect_uri: str) -> str:
    """Generate the OAuth authorization URL."""
    params = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": " ".join(SCOPES),
    }
    return f"{GHL_AUTH_URL}?{urlencode(params)}"


def exchange_code_for_token(client_id: str, client_secret: str, code: str, redirect_uri: str) -> dict:
    """Exchange authorization code for access token."""
    payload = {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
    }

    resp = requests.post(
        GHL_TOKEN_URL,
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=30
    )

    return resp.json()


def refresh_access_token(client_id: str, client_secret: str, refresh_token: str) -> dict:
    """Refresh an expired access token."""
    payload = {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    }

    resp = requests.post(
        GHL_TOKEN_URL,
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=30
    )

    return resp.json()


def save_tokens(tokens: dict, path: Path = None):
    """Save tokens to a file."""
    if path is None:
        path = Path(__file__).parent / ".ghl_tokens.json"
    path.write_text(json.dumps(tokens, indent=2))
    print(f"Tokens saved to: {path}")


def load_tokens(path: Path = None) -> dict:
    """Load tokens from file."""
    if path is None:
        path = Path(__file__).parent / ".ghl_tokens.json"
    if path.exists():
        return json.loads(path.read_text())
    return {}


def main():
    env = load_env()

    client_id = env.get("GHL_CLIENT_ID")
    client_secret = env.get("GHL_CLIENT_SECRET")
    redirect_uri = env.get("GHL_REDIRECT_URI", "http://localhost:3000/callback")

    if len(sys.argv) < 2:
        print(__doc__)
        print("\nCommands:")
        print("  --auth     Open browser to authorize (needs GHL_CLIENT_ID)")
        print("  --token CODE   Exchange auth code for access token")
        print("  --refresh      Refresh the access token")
        print("  --show         Show current tokens")
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "--auth":
        if not client_id:
            print("Missing GHL_CLIENT_ID in .env file")
            print("\nTo set up OAuth:")
            print("1. Go to GHL > Settings > Integrations > Marketplace")
            print("2. Create a new app or use existing")
            print("3. Copy Client ID and Client Secret to .env")
            sys.exit(1)

        auth_url = get_auth_url(client_id, redirect_uri)
        print(f"Opening browser to authorize...")
        print(f"\nAuth URL: {auth_url}")
        print(f"\nAfter authorizing, copy the 'code' parameter from the redirect URL")
        print(f"Then run: python {sys.argv[0]} --token YOUR_CODE")
        webbrowser.open(auth_url)

    elif cmd == "--token":
        if len(sys.argv) < 3:
            print("Usage: python ghl_oauth.py --token YOUR_AUTH_CODE")
            sys.exit(1)

        if not client_id or not client_secret:
            print("Missing GHL_CLIENT_ID or GHL_CLIENT_SECRET in .env")
            sys.exit(1)

        code = sys.argv[2]
        print(f"Exchanging code for token...")

        result = exchange_code_for_token(client_id, client_secret, code, redirect_uri)

        if "access_token" in result:
            print("\nSuccess! Access token obtained.")
            print(f"Token type: {result.get('token_type')}")
            print(f"Expires in: {result.get('expires_in')} seconds")
            print(f"Location ID: {result.get('locationId')}")
            save_tokens(result)

            # Update .env with access token
            print("\nAdd this to your .env file:")
            print(f"GHL_ACCESS_TOKEN={result['access_token']}")
        else:
            print(f"Error: {json.dumps(result, indent=2)}")
            sys.exit(1)

    elif cmd == "--refresh":
        tokens = load_tokens()
        refresh_token = tokens.get("refresh_token")

        if not refresh_token:
            print("No refresh token found. Run --auth first.")
            sys.exit(1)

        if not client_id or not client_secret:
            print("Missing GHL_CLIENT_ID or GHL_CLIENT_SECRET in .env")
            sys.exit(1)

        print("Refreshing access token...")
        result = refresh_access_token(client_id, client_secret, refresh_token)

        if "access_token" in result:
            print("Token refreshed successfully!")
            save_tokens(result)
            print(f"\nNew access token: {result['access_token'][:50]}...")
        else:
            print(f"Error: {json.dumps(result, indent=2)}")
            sys.exit(1)

    elif cmd == "--show":
        tokens = load_tokens()
        if tokens:
            print("Current tokens:")
            print(f"  Access Token: {tokens.get('access_token', 'N/A')[:50]}...")
            print(f"  Refresh Token: {tokens.get('refresh_token', 'N/A')[:30]}...")
            print(f"  Location ID: {tokens.get('locationId', 'N/A')}")
            print(f"  User Type: {tokens.get('userType', 'N/A')}")
        else:
            print("No tokens saved. Run --auth to get started.")

    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)


if __name__ == "__main__":
    main()
