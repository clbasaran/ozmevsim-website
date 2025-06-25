-- Admin Sessions table for authentication
CREATE TABLE IF NOT EXISTS admin_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add admin password to existing settings table (using updated_at instead of created_at)
INSERT OR REPLACE INTO settings (key, value, updated_at) 
VALUES ('admin_password', 'mali06', CURRENT_TIMESTAMP); 