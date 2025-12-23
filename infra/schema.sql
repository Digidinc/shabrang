-- Users table (synced from GHL contacts)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    ghl_contact_id TEXT UNIQUE,
    access_level TEXT DEFAULT 'free',  -- 'free', 'premium', 'admin'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Access tokens for authentication
CREATE TABLE IF NOT EXISTS access_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Content access log
CREATE TABLE IF NOT EXISTS content_access (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    content_slug TEXT NOT NULL,
    accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- GHL webhook events log
CREATE TABLE IF NOT EXISTS ghl_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    contact_id TEXT,
    payload TEXT,
    processed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- GHL OAuth tokens (single row)
CREATE TABLE IF NOT EXISTS ghl_tokens (
    id TEXT PRIMARY KEY,
    access_token TEXT,
    refresh_token TEXT,
    location_id TEXT,
    expires_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_ghl ON users(ghl_contact_id);
CREATE INDEX IF NOT EXISTS idx_tokens_token ON access_tokens(token);
CREATE INDEX IF NOT EXISTS idx_tokens_expires ON access_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_ghl_tokens_updated ON ghl_tokens(updated_at);
