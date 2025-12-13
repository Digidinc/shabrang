#!/usr/bin/env python3
"""
Go HighLevel integration using the official Python SDK.
Handles OAuth and contact management for The Liquid Fortress landing page.

Usage:
  python ghl_sdk.py --auth                    # Start OAuth flow
  python ghl_sdk.py --token CODE              # Exchange code for access token
  python ghl_sdk.py --add "email@example.com" # Add a contact
  python ghl_sdk.py --list                    # List contacts
  python ghl_sdk.py --test                    # Test connection

Requires:
  pip install gohighlevel-api-client
"""

import json
import os
import sys
import webbrowser
from pathlib import Path
from typing import Optional

from highlevel import HighLevel
from highlevel.services.oauth import Oauth
from highlevel.services.oauth.models.oauth import GetAccessCodebodyDto
from highlevel.services.contacts import Contacts
from highlevel.services.contacts.models.contacts import CreateContactDto, UpsertContactDto


# Configuration
SCOPES = "contacts.readonly contacts.write locations.readonly"
TAGS = ["liquid-fortress", "landing-page", "chapter-1-free"]
TOKEN_FILE = Path(__file__).parent / ".ghl_tokens.json"


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


def save_tokens(tokens: dict):
    """Save tokens to file."""
    TOKEN_FILE.write_text(json.dumps(tokens, indent=2))
    print(f"Tokens saved to: {TOKEN_FILE}")


def load_tokens() -> dict:
    """Load tokens from file."""
    if TOKEN_FILE.exists():
        return json.loads(TOKEN_FILE.read_text())
    return {}


def get_client(env: dict, tokens: dict = None) -> HighLevel:
    """Create a HighLevel client."""
    tokens = tokens or load_tokens()

    return HighLevel(
        client_id=env.get("GHL_CLIENT_ID"),
        client_secret=env.get("GHL_CLIENT_SECRET"),
        location_access_token=tokens.get("access_token"),
    )


def start_oauth(env: dict):
    """Start the OAuth authorization flow."""
    client_id = env.get("GHL_CLIENT_ID")
    redirect_uri = env.get("GHL_REDIRECT_URI", "http://localhost:3000/callback")

    if not client_id:
        print("Missing GHL_CLIENT_ID in .env file")
        sys.exit(1)

    # Use SDK to generate auth URL
    oauth = Oauth(get_client(env))
    auth_url = oauth.get_authorization_url(
        client_id=client_id,
        redirect_uri=redirect_uri,
        scope=SCOPES
    )

    print("Opening browser to authorize...")
    print(f"\nAuth URL: {auth_url}")
    print(f"\nAfter authorizing, copy the 'code' parameter from the redirect URL")
    print(f"Then run: python {sys.argv[0]} --token YOUR_CODE")
    webbrowser.open(auth_url)


def exchange_token(env: dict, code: str):
    """Exchange authorization code for access token."""
    client_id = env.get("GHL_CLIENT_ID")
    client_secret = env.get("GHL_CLIENT_SECRET")
    redirect_uri = env.get("GHL_REDIRECT_URI", "http://localhost:3000/callback")

    if not client_id or not client_secret:
        print("Missing GHL_CLIENT_ID or GHL_CLIENT_SECRET in .env")
        sys.exit(1)

    client = get_client(env)
    oauth = Oauth(client)

    request_body = GetAccessCodebodyDto(
        client_id=client_id,
        client_secret=client_secret,
        grant_type="authorization_code",
        code=code,
        redirect_uri=redirect_uri,
        user_type="Location"
    )

    print("Exchanging code for token...")
    result = oauth.get_access_token(request_body)

    if hasattr(result, 'model_dump'):
        result = result.model_dump()
    elif hasattr(result, '__dict__'):
        result = result.__dict__

    if isinstance(result, dict) and result.get("access_token"):
        print("\nSuccess! Access token obtained.")
        print(f"Location ID: {result.get('locationId')}")
        print(f"Expires in: {result.get('expires_in')} seconds")
        save_tokens(result)

        print("\nYou can now add contacts:")
        print(f"  python {sys.argv[0]} --add \"email@example.com\"")
    else:
        print(f"Error: {result}")
        sys.exit(1)


def add_contact(env: dict, email: str, first_name: Optional[str] = None, last_name: Optional[str] = None):
    """Add a contact using the SDK."""
    tokens = load_tokens()
    location_id = tokens.get("locationId") or env.get("GHL_LOCATION_ID")

    if not tokens.get("access_token"):
        print("No access token. Run --auth first to authenticate.")
        sys.exit(1)

    if not location_id:
        print("Missing location ID. Run --auth to get one or set GHL_LOCATION_ID in .env")
        sys.exit(1)

    client = get_client(env, tokens)
    contacts = Contacts(client)

    # Use upsert to handle duplicates gracefully
    contact_data = UpsertContactDto(
        locationId=location_id,
        email=email,
        firstName=first_name,
        lastName=last_name,
        tags=TAGS,
        source="Landing Page - The Liquid Fortress"
    )

    print(f"Adding contact: {email}")

    try:
        result = contacts.upsert_contact(contact_data)

        if hasattr(result, 'model_dump'):
            result = result.model_dump()
        elif hasattr(result, '__dict__'):
            result = result.__dict__

        print("Contact added/updated successfully!")
        if isinstance(result, dict):
            contact = result.get("contact", result)
            print(f"  ID: {contact.get('id', 'N/A')}")
            print(f"  Email: {contact.get('email', email)}")
        return result
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


def list_contacts(env: dict):
    """List contacts from GHL."""
    tokens = load_tokens()
    location_id = tokens.get("locationId") or env.get("GHL_LOCATION_ID")

    if not tokens.get("access_token"):
        print("No access token. Run --auth first.")
        sys.exit(1)

    client = get_client(env, tokens)
    contacts = Contacts(client)

    print(f"Fetching contacts for location: {location_id}")

    try:
        result = contacts.get_contacts(location_id=location_id, limit=20)

        if hasattr(result, 'model_dump'):
            result = result.model_dump()
        elif hasattr(result, '__dict__'):
            result = result.__dict__

        contact_list = result.get("contacts", []) if isinstance(result, dict) else []
        print(f"\nFound {len(contact_list)} contacts:")
        for c in contact_list:
            if isinstance(c, dict):
                email = c.get('email', 'N/A')
                name = f"{c.get('firstName', '')} {c.get('lastName', '')}".strip() or "No name"
                print(f"  - {email} ({name})")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


def test_connection(env: dict):
    """Test the GHL connection."""
    tokens = load_tokens()

    if tokens.get("access_token"):
        print("Access token found!")
        print(f"  Location ID: {tokens.get('locationId', 'N/A')}")
        print(f"  Token prefix: {tokens['access_token'][:30]}...")

        # Try to list contacts as a test
        try:
            client = get_client(env, tokens)
            contacts = Contacts(client)
            location_id = tokens.get("locationId") or env.get("GHL_LOCATION_ID")
            result = contacts.get_contacts(location_id=location_id, limit=1)
            print("\nAPI connection: OK")
        except Exception as e:
            print(f"\nAPI connection test failed: {e}")
    else:
        print("No access token found.")
        print("Run --auth to start the OAuth flow.")


def main():
    env = load_env()

    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "--auth":
        start_oauth(env)

    elif cmd == "--token":
        if len(sys.argv) < 3:
            print("Usage: python ghl_sdk.py --token YOUR_AUTH_CODE")
            sys.exit(1)
        exchange_token(env, sys.argv[2])

    elif cmd == "--add":
        if len(sys.argv) < 3:
            print("Usage: python ghl_sdk.py --add \"email@example.com\" [FirstName] [LastName]")
            sys.exit(1)
        email = sys.argv[2]
        first_name = sys.argv[3] if len(sys.argv) > 3 else None
        last_name = sys.argv[4] if len(sys.argv) > 4 else None
        add_contact(env, email, first_name, last_name)

    elif cmd == "--list":
        list_contacts(env)

    elif cmd == "--test":
        test_connection(env)

    else:
        print(f"Unknown command: {cmd}")
        print("Use --auth, --token, --add, --list, or --test")
        sys.exit(1)


if __name__ == "__main__":
    main()
