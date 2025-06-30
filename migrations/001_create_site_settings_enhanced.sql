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