-- Migration: 002_create_dynamic_pages.sql
-- Description: Dynamic page management system
-- Author: AI Assistant
-- Date: 2024-01-20

-- Dynamic Pages table
CREATE TABLE IF NOT EXISTS dynamic_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  template TEXT DEFAULT 'default', -- default, landing, custom
  status TEXT DEFAULT 'draft', -- draft, published, archived
  is_homepage BOOLEAN DEFAULT FALSE,
  parent_id INTEGER,
  sort_order INTEGER DEFAULT 0,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES dynamic_pages(id)
);

-- Content Blocks table for page builder
CREATE TABLE IF NOT EXISTS content_blocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id INTEGER NOT NULL,
  block_type TEXT NOT NULL, -- hero, text, image, gallery, video, testimonials, services, contact, custom
  title TEXT,
  content TEXT, -- Main content (HTML/Markdown)
  settings TEXT, -- JSON settings for the block
  data TEXT, -- JSON data for dynamic content
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES dynamic_pages(id) ON DELETE CASCADE
);

-- Page Templates table
CREATE TABLE IF NOT EXISTS page_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  template_data TEXT, -- JSON template structure
  preview_image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dynamic_pages_slug ON dynamic_pages(slug);
CREATE INDEX IF NOT EXISTS idx_dynamic_pages_status ON dynamic_pages(status);
CREATE INDEX IF NOT EXISTS idx_dynamic_pages_parent ON dynamic_pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_content_blocks_page ON content_blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_content_blocks_type ON content_blocks(block_type);
CREATE INDEX IF NOT EXISTS idx_content_blocks_position ON content_blocks(page_id, position);

-- Insert default page templates
INSERT OR IGNORE INTO page_templates (name, display_name, description, template_data, is_active) VALUES
('default', 'Varsayılan Sayfa', 'Standart sayfa şablonu', '{"blocks": [{"type": "hero", "required": false}, {"type": "text", "required": true}]}', TRUE),
('landing', 'Landing Page', 'Özel landing sayfası şablonu', '{"blocks": [{"type": "hero", "required": true}, {"type": "services", "required": false}, {"type": "testimonials", "required": false}, {"type": "contact", "required": true}]}', TRUE),
('service', 'Hizmet Sayfası', 'Hizmet detay sayfası şablonu', '{"blocks": [{"type": "hero", "required": true}, {"type": "text", "required": true}, {"type": "gallery", "required": false}, {"type": "contact", "required": true}]}', TRUE),
('product', 'Ürün Sayfası', 'Ürün detay sayfası şablonu', '{"blocks": [{"type": "hero", "required": true}, {"type": "text", "required": true}, {"type": "image", "required": false}, {"type": "contact", "required": true}]}', TRUE);

-- Insert default dynamic pages
INSERT OR IGNORE INTO dynamic_pages (slug, title, meta_title, meta_description, template, status, is_homepage, sort_order, published_at) VALUES
('/', 'Ana Sayfa', 'Öz Mevsim - Isı Sistemleri Mühendislik', '25 yıllık deneyimle Ankara''da kombi, klima, doğalgaz sistemleri kurulum hizmetleri.', 'landing', 'published', TRUE, 1, datetime('now')),
('hakkimizda', 'Hakkımızda', 'Hakkımızda - Öz Mevsim', 'Öz Mevsim Isı Sistemleri hakkında bilgi edinin. 25 yıllık deneyim, uzman ekip.', 'default', 'published', FALSE, 2, datetime('now')),
('hizmetler', 'Hizmetlerimiz', 'Hizmetlerimiz - Öz Mevsim', 'Kombi montajı, klima kurulumu, doğalgaz tesisatı ve daha fazlası.', 'service', 'published', FALSE, 3, datetime('now')),
('urunler', 'Ürünlerimiz', 'Ürünlerimiz - Öz Mevsim', 'Kaliteli kombi, klima ve ısı pompası ürünleri.', 'product', 'published', FALSE, 4, datetime('now')),
('referanslar', 'Referanslarımız', 'Referanslarımız - Öz Mevsim', 'Tamamladığımız projeler ve müşteri referansları.', 'default', 'published', FALSE, 5, datetime('now')),
('iletisim', 'İletişim', 'İletişim - Öz Mevsim', 'Bizimle iletişime geçin. Ücretsiz keşif ve teklif.', 'default', 'published', FALSE, 6, datetime('now'));

-- Insert default content blocks for homepage
INSERT OR IGNORE INTO content_blocks (page_id, block_type, title, content, settings, position, is_active) VALUES
(1, 'hero', 'Ana Hero', 'Hero slider content', '{"autoplay": true, "interval": 5000, "showStats": true}', 1, TRUE),
(1, 'services', 'Hizmetlerimiz', 'Services section', '{"showAll": false, "limit": 3, "layout": "grid"}', 2, TRUE),
(1, 'testimonials', 'Müşteri Yorumları', 'Customer testimonials', '{"showAll": false, "limit": 3, "autoplay": true}', 3, TRUE),
(1, 'contact', 'İletişim', 'Contact form and info', '{"showForm": true, "showMap": true, "showInfo": true}', 4, TRUE);

-- Insert content blocks for about page
INSERT OR IGNORE INTO content_blocks (page_id, block_type, title, content, settings, position, is_active) VALUES
(2, 'hero', 'Hakkımızda Hero', 'About us hero section', '{"showStats": true, "background": "/images/about-hero.jpg"}', 1, TRUE),
(2, 'text', 'Şirket Hikayesi', '<h2>25 Yıllık Deneyim</h2><p>1998 yılında kurulan Öz Mevsim Isı Sistemleri...</p>', '{"layout": "two-column"}', 2, TRUE),
(2, 'image', 'Ekip Fotoğrafı', '', '{"image": "/images/team.jpg", "alt": "Öz Mevsim Ekibi", "caption": "Uzman ekibimiz"}', 3, TRUE);

-- Rollback queries (for down migration)
-- DROP TABLE IF EXISTS content_blocks;
-- DROP TABLE IF EXISTS page_templates;
-- DROP TABLE IF EXISTS dynamic_pages; 