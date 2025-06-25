-- Admin Sessions Table
CREATE TABLE IF NOT EXISTS admin_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
);

-- Settings table for admin password (if not exists)
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT
);

-- Insert default admin password
INSERT OR REPLACE INTO settings (key, value, created_at) 
VALUES ('admin_password', 'mali06', datetime('now'));

-- Clean up expired sessions
DELETE FROM admin_sessions WHERE expires_at < datetime('now'); 