#!/usr/bin/env python3
"""
Go HighLevel integration for The Liquid Fortress landing page.
Handles email signups and adds contacts to GHL CRM.

Usage:
  python ghl_signup.py "email@example.com"                    # Add contact with email only
  python ghl_signup.py "email@example.com" "First" "Last"     # Add contact with name
  python ghl_signup.py --test                                  # Test API connection
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, Optional
import requests


# Configuration
GHL_API_BASE = "https://rest.gohighlevel.com/v1"
TAGS = ["liquid-fortress", "landing-page", "chapter-1-free"]


def load_env() -> Dict[str, str]:
    """Load environment variables from .env files."""
    env = dict(os.environ)

    # Check multiple possible .env locations
    env_paths = [
        Path(__file__).parent / ".env",
        Path(__file__).parent.parent.parent / ".env",  # FRC2 root
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


def get_headers(api_key: str) -> Dict[str, str]:
    return {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }


def test_connection(api_key: str, location_id: str) -> bool:
    """Test the GHL API connection."""
    url = f"{GHL_API_BASE}/locations/{location_id}"
    try:
        resp = requests.get(url, headers=get_headers(api_key), timeout=10)
        resp.raise_for_status()
        data = resp.json()
        print(f"Connected to: {data.get('name', 'Unknown')}")
        print(f"Location ID: {data.get('id')}")
        return True
    except Exception as e:
        print(f"Connection failed: {e}", file=sys.stderr)
        return False


def add_contact(
    api_key: str,
    location_id: str,
    email: str,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    tags: Optional[list] = None,
    source: str = "Landing Page - The Liquid Fortress"
) -> Dict:
    """
    Add a new contact to Go HighLevel CRM.

    Returns:
        dict with 'success' bool and either 'contact' data or 'error' message
    """
    url = f"{GHL_API_BASE}/contacts"

    payload = {
        "locationId": location_id,
        "email": email,
        "source": source,
        "tags": tags or TAGS,
    }

    if first_name:
        payload["firstName"] = first_name
    if last_name:
        payload["lastName"] = last_name

    try:
        resp = requests.post(
            url,
            headers=get_headers(api_key),
            json=payload,
            timeout=15
        )

        if resp.status_code == 200:
            contact = resp.json().get("contact", resp.json())
            return {"success": True, "contact": contact}
        elif resp.status_code == 400:
            # Contact might already exist
            error_data = resp.json()
            if "duplicate" in str(error_data).lower():
                return {"success": True, "message": "Contact already exists", "data": error_data}
            return {"success": False, "error": error_data}
        else:
            resp.raise_for_status()

    except requests.HTTPError as e:
        return {"success": False, "error": str(e), "status": resp.status_code}
    except Exception as e:
        return {"success": False, "error": str(e)}

    return {"success": False, "error": "Unknown error"}


def get_contacts(api_key: str, location_id: str, limit: int = 20) -> Dict:
    """Get list of contacts from GHL."""
    url = f"{GHL_API_BASE}/contacts"
    params = {"locationId": location_id, "limit": limit}

    try:
        resp = requests.get(url, headers=get_headers(api_key), params=params, timeout=15)
        resp.raise_for_status()
        return {"success": True, "contacts": resp.json().get("contacts", [])}
    except Exception as e:
        return {"success": False, "error": str(e)}


def main():
    env = load_env()
    api_key = env.get("GHL_AGENCY_API_KEY") or env.get("GHL_API_KEY")
    location_id = env.get("GHL_LOCATION_ID")

    if not api_key:
        print("Missing GHL_AGENCY_API_KEY in .env file", file=sys.stderr)
        sys.exit(2)
    if not location_id:
        print("Missing GHL_LOCATION_ID in .env file", file=sys.stderr)
        sys.exit(2)

    # Handle command line arguments
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    if sys.argv[1] == "--test":
        success = test_connection(api_key, location_id)
        sys.exit(0 if success else 1)

    if sys.argv[1] == "--list":
        result = get_contacts(api_key, location_id)
        if result["success"]:
            contacts = result["contacts"]
            print(f"Found {len(contacts)} contacts:")
            for c in contacts:
                print(f"  - {c.get('email', 'N/A')} ({c.get('firstName', '')} {c.get('lastName', '')})")
        else:
            print(f"Error: {result['error']}", file=sys.stderr)
        sys.exit(0 if result["success"] else 1)

    # Add contact
    email = sys.argv[1]
    first_name = sys.argv[2] if len(sys.argv) > 2 else None
    last_name = sys.argv[3] if len(sys.argv) > 3 else None

    print(f"Adding contact: {email}")
    result = add_contact(api_key, location_id, email, first_name, last_name)

    if result["success"]:
        print("Contact added successfully!")
        if "contact" in result:
            contact = result["contact"]
            print(f"  ID: {contact.get('id', 'N/A')}")
            print(f"  Email: {contact.get('email', 'N/A')}")
        elif "message" in result:
            print(f"  Note: {result['message']}")
    else:
        print(f"Failed to add contact: {result.get('error', 'Unknown error')}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
