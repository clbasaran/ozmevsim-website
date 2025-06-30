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