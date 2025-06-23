-- Add missing columns to team_members table
ALTER TABLE team_members ADD COLUMN photo TEXT;
ALTER TABLE team_members ADD COLUMN email TEXT;
ALTER TABLE team_members ADD COLUMN phone TEXT;
ALTER TABLE team_members ADD COLUMN linkedin TEXT;
ALTER TABLE team_members ADD COLUMN twitter TEXT;
ALTER TABLE team_members ADD COLUMN experience TEXT;
ALTER TABLE team_members ADD COLUMN education TEXT;
ALTER TABLE team_members ADD COLUMN certifications TEXT; -- JSON array
ALTER TABLE team_members ADD COLUMN specializations TEXT; -- JSON array
ALTER TABLE team_members ADD COLUMN location TEXT;
ALTER TABLE team_members ADD COLUMN languages TEXT; -- JSON array
ALTER TABLE team_members ADD COLUMN achievements TEXT; -- JSON array
ALTER TABLE team_members ADD COLUMN years_of_experience INTEGER DEFAULT 0;

-- Update team_members position column to be NOT NULL
UPDATE team_members SET position = 'Ekip Üyesi' WHERE position IS NULL;

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

-- Update services table structure to match our API
ALTER TABLE services ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE services ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Insert some default data for hero slides
INSERT OR IGNORE INTO hero_slides (
  title, subtitle, description, background_image, stats,
  primary_cta_text, primary_cta_href, secondary_cta_text, secondary_cta_href,
  is_active, sort_order
) VALUES (
  'Konforlu Yaşamın Adresi',
  'Modern Isı Sistemleri Uzmanı',
  '25 yıllık deneyimle Ankara''da kombi, klima, doğalgaz sistemleri kurulum hizmetleri.',
  '/images/kombi-montaj-hero.jpg',
  '[{"value":"25+","label":"Yıl Deneyim"},{"value":"2500+","label":"Proje"},{"value":"100%","label":"Müşteri Memnuniyeti"},{"value":"7/24","label":"Destek"}]',
  'Hemen Ara',
  '/iletisim',
  'Ücretsiz Keşif',
  '/randevu',
  TRUE,
  1
);

-- Insert some default references
INSERT OR IGNORE INTO references (
  title, description, client, location, category, completed_date, image, status, featured, rating
) VALUES 
(
  'Luxury Residence VRF Klima Sistemi',
  'Lüks konut projesinde 200 daireli komplekste VRF klima sistemlerinin kurulumu ve bakımı.',
  'Luxury Residence',
  'Ankara, Çayyolu',
  'Konut',
  '2023-12-15',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
  'active',
  TRUE,
  5
),
(
  'Çankaya Belediyesi Hizmet Binası',
  'Belediye hizmet binasında kombi ve radyatör sistemi kurulumu.',
  'Çankaya Belediyesi',
  'Ankara, Çankaya',
  'Kamu',
  '2023-12-20',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600',
  'active',
  FALSE,
  4
),
(
  'AVM Merkezi Klima Sistemi',
  'Büyük alışveriş merkezinde merkezi klima sisteminin kurulumu ve 24/7 bakım hizmeti.',
  'Armada AVM',
  'Ankara, Söğütözü',
  'Ticari',
  '2023-11-30',
  'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600',
  'active',
  TRUE,
  5
); 