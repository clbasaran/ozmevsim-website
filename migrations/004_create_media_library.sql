-- Migration: 004_create_media_library.sql
-- Description: Enhanced media library management system
-- Author: AI Assistant
-- Date: 2024-01-20

-- Extend existing media table or create new one
-- First, let's enhance the existing media table
ALTER TABLE media ADD COLUMN folder_id INTEGER;
ALTER TABLE media ADD COLUMN title TEXT;
ALTER TABLE media ADD COLUMN description TEXT;
ALTER TABLE media ADD COLUMN tags TEXT; -- JSON array
ALTER TABLE media ADD COLUMN metadata TEXT; -- JSON metadata (dimensions, duration, etc.)
ALTER TABLE media ADD COLUMN thumbnail_path TEXT;
ALTER TABLE media ADD COLUMN is_public BOOLEAN DEFAULT TRUE;
ALTER TABLE media ADD COLUMN download_count INTEGER DEFAULT 0;
ALTER TABLE media ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Media Folders table for organization
CREATE TABLE IF NOT EXISTS media_folders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id INTEGER,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES media_folders(id) ON DELETE CASCADE
);

-- Media Collections table (for galleries, etc.)
CREATE TABLE IF NOT EXISTS media_collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'gallery', -- gallery, slider, grid
  settings TEXT, -- JSON settings
  is_public BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Media Collection Items (many-to-many relationship)
CREATE TABLE IF NOT EXISTS media_collection_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  collection_id INTEGER NOT NULL,
  media_id INTEGER NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collection_id) REFERENCES media_collections(id) ON DELETE CASCADE,
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE,
  UNIQUE(collection_id, media_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder_id);
CREATE INDEX IF NOT EXISTS idx_media_category_enhanced ON media(category);
CREATE INDEX IF NOT EXISTS idx_media_public ON media(is_public);
CREATE INDEX IF NOT EXISTS idx_media_folders_parent ON media_folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_media_folders_slug ON media_folders(slug);
CREATE INDEX IF NOT EXISTS idx_media_collections_slug ON media_collections(slug);
CREATE INDEX IF NOT EXISTS idx_media_collection_items_collection ON media_collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_media_collection_items_media ON media_collection_items(media_id);

-- Add foreign key constraint to media table
-- Note: SQLite doesn't support adding foreign keys to existing tables, so we'll handle this in application logic

-- Insert default media folders
INSERT OR IGNORE INTO media_folders (name, slug, parent_id, description, is_public, sort_order) VALUES
('Genel', 'general', NULL, 'Genel medya dosyaları', TRUE, 1),
('Ürünler', 'products', NULL, 'Ürün görselleri ve dökümanları', TRUE, 2),
('Markalar', 'brands', NULL, 'Marka logoları', TRUE, 3),
('Hero Görselleri', 'hero-images', NULL, 'Ana sayfa slider görselleri', TRUE, 4),
('Blog', 'blog', NULL, 'Blog yazıları için görseller', TRUE, 5),
('Sertifikalar', 'certificates', NULL, 'Şirket sertifikaları', TRUE, 6),
('Referanslar', 'references', NULL, 'Proje referans görselleri', TRUE, 7),
('PDF Dökümanlar', 'pdf-documents', NULL, 'Katalog ve dökümanlar', TRUE, 8);

-- Insert product subfolders
INSERT OR IGNORE INTO media_folders (name, slug, parent_id, description, is_public, sort_order) VALUES
('Kombiler', 'kombiler', (SELECT id FROM media_folders WHERE slug = 'products'), 'Kombi ürün görselleri', TRUE, 1),
('Klimalar', 'klimalar', (SELECT id FROM media_folders WHERE slug = 'products'), 'Klima ürün görselleri', TRUE, 2),
('Isı Pompaları', 'isi-pompalari', (SELECT id FROM media_folders WHERE slug = 'products'), 'Isı pompası görselleri', TRUE, 3),
('Radyatörler', 'radyatorler', (SELECT id FROM media_folders WHERE slug = 'products'), 'Radyatör görselleri', TRUE, 4);

-- Insert brand subfolders
INSERT OR IGNORE INTO media_folders (name, slug, parent_id, description, is_public, sort_order) VALUES
('Vaillant', 'vaillant', (SELECT id FROM media_folders WHERE slug = 'brands'), 'Vaillant marka görselleri', TRUE, 1),
('Bosch', 'bosch', (SELECT id FROM media_folders WHERE slug = 'brands'), 'Bosch marka görselleri', TRUE, 2),
('Demirdöküm', 'demirdokum', (SELECT id FROM media_folders WHERE slug = 'brands'), 'Demirdöküm marka görselleri', TRUE, 3),
('Baymak', 'baymak', (SELECT id FROM media_folders WHERE slug = 'brands'), 'Baymak marka görselleri', TRUE, 4),
('ECA', 'eca', (SELECT id FROM media_folders WHERE slug = 'brands'), 'ECA marka görselleri', TRUE, 5),
('Buderus', 'buderus', (SELECT id FROM media_folders WHERE slug = 'brands'), 'Buderus marka görselleri', TRUE, 6);

-- Insert default media collections
INSERT OR IGNORE INTO media_collections (name, slug, description, type, settings, is_public) VALUES
('Ana Sayfa Slider', 'homepage-slider', 'Ana sayfada görünen slider görselleri', 'slider', '{"autoplay": true, "interval": 5000, "showDots": true, "showArrows": true}', TRUE),
('Ürün Galerisi', 'product-gallery', 'Tüm ürün görselleri galerisi', 'gallery', '{"columns": 4, "lightbox": true, "showTitles": true}', TRUE),
('Referans Projeleri', 'reference-projects', 'Tamamlanan proje görselleri', 'grid', '{"columns": 3, "showOverlay": true, "hoverEffect": "zoom"}', TRUE),
('Sertifikalar', 'certificates-gallery', 'Şirket sertifikaları galerisi', 'gallery', '{"columns": 3, "lightbox": true, "showTitles": true}', TRUE),
('Ekip Fotoğrafları', 'team-photos', 'Ekip ve ofis fotoğrafları', 'gallery', '{"columns": 4, "lightbox": true, "showTitles": false}', TRUE);

-- Update existing media records with folder assignments (if any exist)
UPDATE media SET 
  folder_id = (SELECT id FROM media_folders WHERE slug = 'brands'),
  title = filename,
  is_public = TRUE
WHERE file_path LIKE '%/brands/%';

UPDATE media SET 
  folder_id = (SELECT id FROM media_folders WHERE slug = 'products'),
  title = filename,
  is_public = TRUE
WHERE file_path LIKE '%/products/%';

UPDATE media SET 
  folder_id = (SELECT id FROM media_folders WHERE slug = 'pdf-documents'),
  title = filename,
  is_public = TRUE
WHERE mime_type = 'application/pdf';

UPDATE media SET 
  folder_id = (SELECT id FROM media_folders WHERE slug = 'general'),
  title = filename,
  is_public = TRUE
WHERE folder_id IS NULL;

-- Insert sample media collection items (if media exists)
-- This would be done after actual media files are uploaded

-- Rollback queries (for down migration)
-- DELETE FROM media_collection_items;
-- DELETE FROM media_collections;
-- DELETE FROM media_folders;
-- ALTER TABLE media DROP COLUMN folder_id;
-- ALTER TABLE media DROP COLUMN title;
-- ALTER TABLE media DROP COLUMN description;
-- ALTER TABLE media DROP COLUMN tags;
-- ALTER TABLE media DROP COLUMN metadata;
-- ALTER TABLE media DROP COLUMN thumbnail_path;
-- ALTER TABLE media DROP COLUMN is_public;
-- ALTER TABLE media DROP COLUMN download_count;
-- ALTER TABLE media DROP COLUMN updated_at; 