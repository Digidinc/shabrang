# Shabrang API Server

Go HighLevel integration for The Liquid Fortress landing page.

## Quick Start

### 1. Setup Python Environment

```bash
cd /opt/shabrang/repo/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your GHL credentials
```

### 3. Run Development Server

```bash
python server.py
```

The server will start at `http://localhost:5000`

### 4. Authorize with Go HighLevel

Visit: `http://localhost:5000/api/ghl/auth`

This will redirect you to GHL to authorize the app. After authorization, you'll be redirected back and tokens will be saved.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/ghl/auth` | GET | Start OAuth flow |
| `/api/auth/callback` | GET | OAuth callback (receives code) |
| `/api/ghl/signup` | POST | Add contact from landing page |
| `/api/ghl/status` | GET | Check connection status |

### Signup Endpoint

```bash
curl -X POST https://shabrang.ca/api/ghl/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "firstName": "John"}'
```

Response:
```json
{
  "success": true,
  "message": "Welcome to The Liquid Fortress! Check your email for Chapter 1."
}
```

## Production Deployment

### 1. Install Service

```bash
# Create log directory
sudo mkdir -p /var/log/shabrang-api
sudo chown www-data:www-data /var/log/shabrang-api

# Copy service file
sudo cp shabrang-api.service /etc/systemd/system/

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable shabrang-api
sudo systemctl start shabrang-api

# Check status
sudo systemctl status shabrang-api
```

### 2. Update Nginx

Copy `nginx.conf.shabrang` to `/etc/nginx/sites-available/shabrang` and reload nginx:

```bash
sudo cp ../nginx.conf.shabrang /etc/nginx/sites-available/shabrang
sudo ln -sf /etc/nginx/sites-available/shabrang /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Verify

```bash
curl https://shabrang.ca/api/health
```

## GHL Credentials

- **Client ID**: `67846d120881b82f3526b403-m5udioec`
- **Location ID**: `GH7DEHSQgknGHmLCSzo3`
- **Redirect URI**: `https://shabrang.ca/api/auth/callback`

## Tags Applied to Contacts

All signups receive these tags:
- `liquid-fortress`
- `landing-page`
- `chapter-1-free`

## Troubleshooting

### Token Expired
Run `/api/ghl/auth` again to re-authorize.

### Check Logs
```bash
sudo journalctl -u shabrang-api -f
tail -f /var/log/shabrang-api/error.log
```

### Test Connection
```bash
curl http://localhost:5000/api/ghl/status
```
