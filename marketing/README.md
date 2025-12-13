# The Liquid Fortress - Marketing & GHL Integration

## Overview
Landing page and Go HighLevel CRM integration for "The Liquid Fortress" book by Shabrang Publishing.

## Task for Server Claude
Set up the Go HighLevel OAuth flow and contact API endpoint on `ngn.digid.ca`.

### What Needs to Be Done

1. **Complete OAuth Flow**
   - The OAuth redirect URI is: `https://ngn.digid.ca/rest/oauth2-credential/callback`
   - Create a handler at this endpoint to capture the `code` parameter
   - Exchange the code for access/refresh tokens
   - Store tokens securely (file or database)

2. **Create Contact API Endpoint**
   - Endpoint: `POST /api/ghl/signup` (or similar)
   - Accepts: `{ "email": "...", "firstName": "...", "lastName": "..." }`
   - Uses GHL SDK to upsert contact with tags: `["liquid-fortress", "landing-page", "chapter-1-free"]`
   - Returns success/error JSON

3. **Update Landing Page Form**
   - Connect the signup form in `index.html` to the new API endpoint

## GHL Credentials (from .env)
```
GHL_CLIENT_ID=67846d120881b82f3526b403-m5udioec
GHL_CLIENT_SECRET=3742d67a-43c5-4b4b-9d71-d15dea5add6f
GHL_LOCATION_ID=GH7DEHSQgknGHmLCSzo3
GHL_REDIRECT_URI=https://ngn.digid.ca/rest/oauth2-credential/callback
```

## OAuth URL to Authorize
```
https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&client_id=67846d120881b82f3526b403-m5udioec&redirect_uri=https%3A%2F%2Fngn.digid.ca%2Frest%2Foauth2-credential%2Fcallback&scope=contacts.readonly+contacts.write+locations.readonly
```

## Files in This Folder

| File | Description |
|------|-------------|
| `index.html` | Landing page with ALETTE Persian miniature styling |
| `ghl_sdk.py` | GHL integration using official Python SDK |
| `ghl_oauth.py` | OAuth helper (manual code exchange) |
| `ghl_signup.py` | Original contact management script |
| `images/` | Landing page images (hero, chapters, logo) |

## SDK Installation
```bash
pip install gohighlevel-api-client
```

## SDK Usage Example
```python
from highlevel import HighLevel
from highlevel.services.contacts import Contacts
from highlevel.services.contacts.models.contacts import UpsertContactDto

# Initialize with access token
client = HighLevel(location_access_token="YOUR_ACCESS_TOKEN")
contacts = Contacts(client)

# Add contact
contact_data = UpsertContactDto(
    locationId="GH7DEHSQgknGHmLCSzo3",
    email="user@example.com",
    firstName="John",
    tags=["liquid-fortress", "landing-page"]
)
result = contacts.upsert_contact(contact_data)
```

## Token Exchange (after OAuth callback)
```python
from highlevel.services.oauth import Oauth
from highlevel.services.oauth.models.oauth import GetAccessCodebodyDto

oauth = Oauth(client)
request_body = GetAccessCodebodyDto(
    client_id="67846d120881b82f3526b403-m5udioec",
    client_secret="3742d67a-43c5-4b4b-9d71-d15dea5add6f",
    grant_type="authorization_code",
    code="CODE_FROM_CALLBACK",
    redirect_uri="https://ngn.digid.ca/rest/oauth2-credential/callback",
    user_type="Location"
)
tokens = oauth.get_access_token(request_body)
# Save tokens['access_token'] and tokens['refresh_token']
```

## Landing Page Details
- **Style**: ALETTE color palette (Persian miniature flat style)
- **Colors**: Sand #F5E6C8, Gold #C9A227, Teal #2D5A6B, Crimson #8B3535, Black #1A1A18
- **Sections**: Hero, Mystery, Quote, Framework, 30 Chapters, Sample, Gallery, Media, Author, Signup
- **Form Action**: Currently `#` - needs to point to GHL API endpoint

## Location Info (verified working)
- Location Name: Shabrang.ca
- Location ID: GH7DEHSQgknGHmLCSzo3
- Address: 380 Essa Road, Barrie, Ontario, L4N 9G7
