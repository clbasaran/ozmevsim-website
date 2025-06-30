-- Öz Mevsim Website Database Schema
-- Created for ozmevsim-d1 Cloudflare D1 Database

-- 1. Products (Ürünler) Tablosu
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price REAL,
  image_url TEXT,
  category TEXT,
  brand TEXT,
  model TEXT,
  features TEXT, -- JSON string
  specifications TEXT, -- JSON string
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Blog Posts Tablosu
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  category TEXT DEFAULT 'general',
  author TEXT DEFAULT 'Admin',
  publish_date TEXT,
  read_time INTEGER DEFAULT 5,
  featured_image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published',
  tags TEXT, -- JSON array as string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. FAQ Tablosu
CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Testimonials (Referanslar) Tablosu
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  avatar TEXT,
  location TEXT,
  service TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Services (Hizmetler) Tablosu
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'cog',
  features TEXT, -- JSON array
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 6. Contact Messages Tablosu
CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  replied_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Team Members Tablosu
CREATE TABLE IF NOT EXISTS team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  photo TEXT,
  email TEXT,
  phone TEXT,
  linkedin TEXT,
  twitter TEXT,
  experience TEXT,
  education TEXT,
  certifications TEXT, -- JSON array
  specializations TEXT, -- JSON array
  location TEXT,
  languages TEXT, -- JSON array
  achievements TEXT, -- JSON array
  years_of_experience INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 8. Portfolio/Projects Tablosu
CREATE TABLE IF NOT EXISTS portfolio (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  gallery_images TEXT, -- JSON array as string
  client_name TEXT,
  completion_date DATE,
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. Site Settings Tablosu
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'text', -- text, json, boolean, number
  category TEXT,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Media/Upload Tablosu
CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  original_name TEXT,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  alt_text TEXT,
  category TEXT,
  uploaded_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler oluştur (performans için)
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_faqs_status ON faqs(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio(status);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);

-- Başlangıç verilerini ekle
INSERT OR IGNORE INTO site_settings (key, value, type, category, description) VALUES
('site_title', 'Öz Mevsim Isı Sistemleri', 'text', 'general', 'Site başlığı'),
('site_description', 'Kombi, klima ve ısı pompası uzmanı', 'text', 'general', 'Site açıklaması'),
('contact_email', 'info@ozmevsim.com', 'text', 'contact', 'İletişim e-postası'),
('contact_phone', '+90 532 XXX XX XX', 'text', 'contact', 'İletişim telefonu'),
('contact_address', 'İstanbul, Türkiye', 'text', 'contact', 'İletişim adresi'),
('hero_title', 'Konforlu Yaşamın Adresi', 'text', 'homepage', 'Ana sayfa hero başlığı'),
('hero_subtitle', 'Modern ısıtma ve soğutma çözümleri', 'text', 'homepage', 'Ana sayfa hero alt başlığı');

-- References table
CREATE TABLE IF NOT EXISTS references (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  client TEXT NOT NULL,
  location TEXT,
  category TEXT DEFAULT 'Genel',
  completed_date TEXT,
  image TEXT,
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT FALSE,
  rating INTEGER DEFAULT 5,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Hero Slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT,
  background_image TEXT,
  stats TEXT, -- JSON array
  primary_cta_text TEXT,
  primary_cta_href TEXT,
  secondary_cta_text TEXT,
  secondary_cta_href TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

 

-- Migration: 001_create_site_settings_enhanced.sql
-- Migration: 001_create_site_settings_enhanced.sql
-- Description: Enhanced site settings table for dynamic configuration
-- Author: AI Assistant
-- Date: 2024-01-20

-- Enhanced site_settings table (extend existing)
ALTER TABLE site_settings ADD COLUMN group_name TEXT DEFAULT 'general';
ALTER TABLE site_settings ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
ALTER TABLE site_settings ADD COLUMN validation_rules TEXT; -- JSON
ALTER TABLE site_settings ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_site_settings_group ON site_settings(group_name);
CREATE INDEX IF NOT EXISTS idx_site_settings_public ON site_settings(is_public);

-- Insert comprehensive site settings
INSERT OR REPLACE INTO site_settings (key, value, type, category, group_name, description, is_public, sort_order) VALUES
-- Company Information
('company_name', 'Öz Mevsim Isı Sistemleri Mühendislik', 'text', 'company', 'company_info', 'Şirket adı', TRUE, 1),
('company_slogan', 'Güvenilir Isı Çözümleri', 'text', 'company', 'company_info', 'Şirket sloganı', TRUE, 2),
('company_description', '25 yıllık deneyimle Ankara''da kombi, klima ve doğalgaz sistemleri kurulum hizmetleri sunuyoruz.', 'textarea', 'company', 'company_info', 'Şirket açıklaması', TRUE, 3),
('company_logo', '/Mevsim-4.png', 'image', 'company', 'company_info', 'Şirket logosu', TRUE, 4),
('company_favicon', '/favicon.ico', 'image', 'company', 'company_info', 'Site favicon', TRUE, 5),
('company_founded_year', '1998', 'number', 'company', 'company_info', 'Kuruluş yılı', TRUE, 6),
('company_experience', '25+', 'text', 'company', 'company_info', 'Deneyim yılı', TRUE, 7),
('company_employee_count', '45+', 'text', 'company', 'company_info', 'Çalışan sayısı', TRUE, 8),
('company_project_count', '10.000+', 'text', 'company', 'company_info', 'Proje sayısı', TRUE, 9),
('company_customer_count', '2.500+', 'text', 'company', 'company_info', 'Müşteri sayısı', TRUE, 10),
('company_satisfaction_rate', '%98', 'text', 'company', 'company_info', 'Müşteri memnuniyet oranı', TRUE, 11),

-- Contact Information
('contact_phone', '+90 312 357 0600', 'tel', 'contact', 'contact_info', 'Ana telefon', TRUE, 20),
('contact_email', 'info@ozmevsim.com', 'email', 'contact', 'contact_info', 'Ana e-posta', TRUE, 21),
('contact_address', 'Kuşcağız Mahallesi, Sanatoryum Caddesi No:221/A, Keçiören, Ankara', 'textarea', 'contact', 'contact_info', 'Adres', TRUE, 22),
('contact_working_hours', 'Pazartesi - Cumartesi: 08:00 - 18:00', 'text', 'contact', 'contact_info', 'Çalışma saatleri', TRUE, 23),
('contact_emergency_phone', '+90 532 446 7367', 'tel', 'contact', 'contact_info', 'Acil durum telefonu', TRUE, 24),
('contact_whatsapp', '+90 532 446 7367', 'tel', 'contact', 'contact_info', 'WhatsApp numarası', TRUE, 25),
('contact_fax', '+90 212 555 0124', 'tel', 'contact', 'contact_info', 'Faks numarası', TRUE, 26),
('contact_website', 'www.ozmevsim.com', 'url', 'contact', 'contact_info', 'Website', TRUE, 27),
('contact_coordinates_lat', '39.9334', 'number', 'contact', 'contact_info', 'Enlem koordinatı', FALSE, 28),
('contact_coordinates_lng', '32.8597', 'number', 'contact', 'contact_info', 'Boylam koordinatı', FALSE, 29),

-- Social Media
('social_facebook', 'https://facebook.com/ozmevsim', 'url', 'social', 'social_media', 'Facebook URL', TRUE, 30),
('social_instagram', 'https://instagram.com/ozmevsim', 'url', 'social', 'social_media', 'Instagram URL', TRUE, 31),
('social_twitter', 'https://twitter.com/ozmevsim', 'url', 'social', 'social_media', 'Twitter URL', TRUE, 32),
('social_linkedin', 'https://linkedin.com/company/ozmevsim', 'url', 'social', 'social_media', 'LinkedIn URL', TRUE, 33),
('social_youtube', 'https://youtube.com/ozmevsim', 'url', 'social', 'social_media', 'YouTube URL', TRUE, 34),
('social_tiktok', 'https://tiktok.com/@ozmevsim', 'url', 'social', 'social_media', 'TikTok URL', TRUE, 35),

-- SEO Settings
('seo_site_title', 'Öz Mevsim Isı Sistemleri Mühendislik', 'text', 'seo', 'seo_settings', 'Site başlığı', TRUE, 40),
('seo_site_description', '25 yıllık deneyimle Ankara''da kombi, klima, doğalgaz sistemleri kurulum hizmetleri.', 'textarea', 'seo', 'seo_settings', 'Site açıklaması', TRUE, 41),
('seo_keywords', 'kombi kurulumu, klima montajı, doğalgaz sistemleri, ısı sistemleri, mühendislik, Ankara', 'textarea', 'seo', 'seo_settings', 'Anahtar kelimeler', TRUE, 42),
('seo_og_image', '/og-image.jpg', 'image', 'seo', 'seo_settings', 'Open Graph resmi', TRUE, 43),
('seo_twitter_image', '/twitter-image.jpg', 'image', 'seo', 'seo_settings', 'Twitter resmi', TRUE, 44),
('seo_robots', 'index, follow', 'text', 'seo', 'seo_settings', 'Robots meta tag', FALSE, 45),
('seo_google_analytics', '', 'text', 'seo', 'seo_settings', 'Google Analytics ID', FALSE, 46),
('seo_google_tag_manager', '', 'text', 'seo', 'seo_settings', 'Google Tag Manager ID', FALSE, 47),

-- Email Settings
('email_smtp_host', '', 'text', 'email', 'email_settings', 'SMTP Host', FALSE, 50),
('email_smtp_port', '587', 'number', 'email', 'email_settings', 'SMTP Port', FALSE, 51),
('email_smtp_username', '', 'text', 'email', 'email_settings', 'SMTP Kullanıcı Adı', FALSE, 52),
('email_smtp_password', '', 'password', 'email', 'email_settings', 'SMTP Şifre', FALSE, 53),
('email_from_name', 'Öz Mevsim', 'text', 'email', 'email_settings', 'Gönderen Adı', FALSE, 54),
('email_from_address', 'noreply@ozmevsim.com', 'email', 'email', 'email_settings', 'Gönderen E-posta', FALSE, 55),

-- System Settings
('system_maintenance_mode', 'false', 'boolean', 'system', 'system_settings', 'Bakım modu', FALSE, 60),
('system_registration_enabled', 'true', 'boolean', 'system', 'system_settings', 'Kayıt açık', FALSE, 61),
('system_email_notifications', 'true', 'boolean', 'system', 'system_settings', 'E-posta bildirimleri', FALSE, 62),
('system_sms_notifications', 'false', 'boolean', 'system', 'system_settings', 'SMS bildirimleri', FALSE, 63),
('system_timezone', 'Europe/Istanbul', 'text', 'system', 'system_settings', 'Zaman dilimi', FALSE, 64),
('system_language', 'tr', 'text', 'system', 'system_settings', 'Dil', FALSE, 65),
('system_date_format', 'DD/MM/YYYY', 'text', 'system', 'system_settings', 'Tarih formatı', FALSE, 66),
('system_time_format', '24', 'text', 'system', 'system_settings', 'Saat formatı', FALSE, 67);

-- Rollback function (for down migration)
-- To rollback this migration, run:
-- DELETE FROM site_settings WHERE group_name IN ('company_info', 'contact_info', 'social_media', 'seo_settings', 'email_settings', 'system_settings');
-- ALTER TABLE site_settings DROP COLUMN group_name;
-- ALTER TABLE site_settings DROP COLUMN is_public;
-- ALTER TABLE site_settings DROP COLUMN validation_rules;
-- ALTER TABLE site_settings DROP COLUMN sort_order; 

-- Migration: 002_create_dynamic_pages.sql
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

-- Migration: 003_create_menu_system.sql
-- Migration: 003_create_menu_system.sql
-- Description: Dynamic menu management system
-- Author: AI Assistant
-- Date: 2024-01-20

-- Menu Locations table (header, footer, sidebar, etc.)
CREATE TABLE IF NOT EXISTS menu_locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  max_depth INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items table
CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  location_key TEXT NOT NULL,
  parent_id INTEGER,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  target TEXT DEFAULT '_self', -- _self, _blank, _parent, _top
  icon TEXT, -- Icon name or class
  description TEXT,
  css_classes TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  visibility TEXT DEFAULT 'public', -- public, authenticated, admin
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (location_key) REFERENCES menu_locations(key),
  FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_location ON menu_items(location_key);
CREATE INDEX IF NOT EXISTS idx_menu_items_parent ON menu_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_position ON menu_items(location_key, position);
CREATE INDEX IF NOT EXISTS idx_menu_items_active ON menu_items(is_active);

-- Insert default menu locations
INSERT OR IGNORE INTO menu_locations (key, name, description, max_depth, is_active) VALUES
('header', 'Ana Menü', 'Site üst kısmında görünen ana navigasyon menüsü', 2, TRUE),
('footer', 'Footer Menü', 'Site alt kısmında görünen footer menüsü', 1, TRUE),
('sidebar', 'Yan Menü', 'Sidebar widget alanında görünen menü', 2, TRUE),
('mobile', 'Mobil Menü', 'Mobil cihazlarda görünen hamburger menü', 2, TRUE),
('admin', 'Admin Menü', 'Admin panelinde görünen menü', 3, TRUE);

-- Insert default header menu items
INSERT OR IGNORE INTO menu_items (location_key, parent_id, title, url, icon, position, is_active, visibility) VALUES
-- Main navigation
('header', NULL, 'Ana Sayfa', '/', 'home', 1, TRUE, 'public'),
('header', NULL, 'Hakkımızda', '/hakkimizda', 'info-circle', 2, TRUE, 'public'),
('header', NULL, 'Hizmetler', '/hizmetler', 'cog', 3, TRUE, 'public'),
('header', NULL, 'Ürünler', '/urunler', 'cube', 4, TRUE, 'public'),
('header', NULL, 'Projeler', '/projeler', 'building-office', 5, TRUE, 'public'),
('header', NULL, 'Referanslar', '/referanslar', 'star', 6, TRUE, 'public'),
('header', NULL, 'Blog', '/blog', 'document-text', 7, TRUE, 'public'),
('header', NULL, 'S.S.S', '/sss', 'question-mark-circle', 8, TRUE, 'public'),
('header', NULL, 'İletişim', '/iletisim', 'phone', 9, TRUE, 'public');

-- Insert submenu items for services
INSERT OR IGNORE INTO menu_items (location_key, parent_id, title, url, icon, position, is_active, visibility) VALUES
(SELECT 'header', id, 'Kombi Montajı', '/hizmetler/kombi-montaji', 'fire', 1, TRUE, 'public' FROM menu_items WHERE title = 'Hizmetler' AND location_key = 'header'),
(SELECT 'header', id, 'Klima Kurulumu', '/hizmetler/klima-kurulumu', 'snowflake', 2, TRUE, 'public' FROM menu_items WHERE title = 'Hizmetler' AND location_key = 'header'),
(SELECT 'header', id, 'Doğalgaz Tesisatı', '/hizmetler/dogalgaz-tesisati', 'bolt', 3, TRUE, 'public' FROM menu_items WHERE title = 'Hizmetler' AND location_key = 'header'),
(SELECT 'header', id, 'IoT Hizmetleri', '/hizmetler/iot', 'wifi', 4, TRUE, 'public' FROM menu_items WHERE title = 'Hizmetler' AND location_key = 'header');

-- Insert footer menu items
INSERT OR IGNORE INTO menu_items (location_key, parent_id, title, url, icon, position, is_active, visibility) VALUES
-- Company links
('footer', NULL, 'Hakkımızda', '/hakkimizda', NULL, 1, TRUE, 'public'),
('footer', NULL, 'Hizmetlerimiz', '/hizmetler', NULL, 2, TRUE, 'public'),
('footer', NULL, 'Ürünlerimiz', '/urunler', NULL, 3, TRUE, 'public'),
('footer', NULL, 'Referanslarımız', '/referanslar', NULL, 4, TRUE, 'public'),
('footer', NULL, 'İletişim', '/iletisim', NULL, 5, TRUE, 'public'),
-- Legal links
('footer', NULL, 'Gizlilik Politikası', '/gizlilik', NULL, 10, TRUE, 'public'),
('footer', NULL, 'Kullanım Şartları', '/kullanim-sartlari', NULL, 11, TRUE, 'public'),
('footer', NULL, 'Çerez Politikası', '/cerez-politikasi', NULL, 12, TRUE, 'public'),
('footer', NULL, 'KVKK', '/kvkk', NULL, 13, TRUE, 'public');

-- Insert admin menu items
INSERT OR IGNORE INTO menu_items (location_key, parent_id, title, url, icon, position, is_active, visibility) VALUES
-- Admin navigation
('admin', NULL, 'Dashboard', '/admin', 'home', 1, TRUE, 'admin'),
('admin', NULL, 'Sayfa Yönetimi', '/admin/pages', 'document-text', 2, TRUE, 'admin'),
('admin', NULL, 'İçerik Yönetimi', '/admin/content', 'cube', 3, TRUE, 'admin'),
('admin', NULL, 'Medya Kütüphanesi', '/admin/media', 'photo', 4, TRUE, 'admin'),
('admin', NULL, 'Site Ayarları', '/admin/settings', 'cog', 5, TRUE, 'admin'),
('admin', NULL, 'Raporlar', '/admin/reports', 'chart-bar', 6, TRUE, 'admin'),
('admin', NULL, 'Yedekleme', '/admin/backup', 'folder', 7, TRUE, 'admin');

-- Insert admin submenu items
INSERT OR IGNORE INTO menu_items (location_key, parent_id, title, url, icon, position, is_active, visibility) VALUES
-- Page management submenus
(SELECT 'admin', id, 'Hakkımızda', '/admin/pages/about', NULL, 1, TRUE, 'admin' FROM menu_items WHERE title = 'Sayfa Yönetimi' AND location_key = 'admin'),
(SELECT 'admin', id, 'Ürünler', '/admin/pages/products', NULL, 2, TRUE, 'admin' FROM menu_items WHERE title = 'Sayfa Yönetimi' AND location_key = 'admin'),
(SELECT 'admin', id, 'Referanslar', '/admin/pages/references', NULL, 3, TRUE, 'admin' FROM menu_items WHERE title = 'Sayfa Yönetimi' AND location_key = 'admin'),
(SELECT 'admin', id, 'İletişim', '/admin/pages/contact', NULL, 4, TRUE, 'admin' FROM menu_items WHERE title = 'Sayfa Yönetimi' AND location_key = 'admin'),
(SELECT 'admin', id, 'Blog', '/admin/pages/blog', NULL, 5, TRUE, 'admin' FROM menu_items WHERE title = 'Sayfa Yönetimi' AND location_key = 'admin'),
(SELECT 'admin', id, 'SSS', '/admin/pages/faq', NULL, 6, TRUE, 'admin' FROM menu_items WHERE title = 'Sayfa Yönetimi' AND location_key = 'admin'),
(SELECT 'admin', id, 'Müşteri Yorumları', '/admin/pages/testimonials', NULL, 7, TRUE, 'admin' FROM menu_items WHERE title = 'Sayfa Yönetimi' AND location_key = 'admin'),

-- Content management submenus
(SELECT 'admin', id, 'Ana Sayfa', '/admin/pages/home', NULL, 1, TRUE, 'admin' FROM menu_items WHERE title = 'İçerik Yönetimi' AND location_key = 'admin'),
(SELECT 'admin', id, 'Hizmetler', '/admin/pages/services', NULL, 2, TRUE, 'admin' FROM menu_items WHERE title = 'İçerik Yönetimi' AND location_key = 'admin'),
(SELECT 'admin', id, 'Katalog', '/admin/pages/catalog', NULL, 3, TRUE, 'admin' FROM menu_items WHERE title = 'İçerik Yönetimi' AND location_key = 'admin'),
(SELECT 'admin', id, 'Tüm İçerikler', '/admin/content', NULL, 4, TRUE, 'admin' FROM menu_items WHERE title = 'İçerik Yönetimi' AND location_key = 'admin'),

-- Settings submenus
(SELECT 'admin', id, 'Genel Ayarlar', '/admin/settings/general', NULL, 1, TRUE, 'admin' FROM menu_items WHERE title = 'Site Ayarları' AND location_key = 'admin'),
(SELECT 'admin', id, 'SEO Ayarları', '/admin/settings/seo', NULL, 2, TRUE, 'admin' FROM menu_items WHERE title = 'Site Ayarları' AND location_key = 'admin');

-- Rollback queries (for down migration)
-- DROP TABLE IF EXISTS menu_items;
-- DROP TABLE IF EXISTS menu_locations; 

-- Migration: 004_create_media_library.sql
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

