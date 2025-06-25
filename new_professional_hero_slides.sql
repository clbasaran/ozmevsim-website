-- Eski hero slide'ları sil
DELETE FROM hero_slides;

-- Yeni profesyonel hero slide'ları ekle
INSERT INTO hero_slides (title, subtitle, description, background_image, primary_cta_text, primary_cta_href, secondary_cta_text, secondary_cta_href, is_active, sort_order, stats) VALUES

-- 1. Öz Mevsim Isı Sistemleri - Mühendislik Çözümleri
('Öz Mevsim Isı Sistemleri', 'Mühendislik Çözümleri', '25+ yıllık deneyimle Ankara''da kombi, klima ve doğalgaz sistemleri kurulum hizmetleri. Profesyonel ekibimizle güvenilir çözümler sunuyoruz.', 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1920&h=1080&fit=crop', 'İletişim', '/iletisim', 'Randevu Al', '/randevu', 1, 1, '[{"value": "25+", "label": "Yıl Deneyim"}, {"value": "10.000+", "label": "Mutlu Müşteri"}, {"value": "%99", "label": "Müşteri Memnuniyeti"}, {"value": "7/24", "label": "Destek"}]'),

-- 2. Enerji Verimliliği - Sürdürülebilir Gelecek  
('Enerji Verimliliği', 'Sürdürülebilir Gelecek', 'Çevre dostu çözümlerle A+++ enerji verimliliği. 50+ yıl garanti ile enerji tasarrufu ve sürdürülebilir yaşam için ideal sistemler.', 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1920&h=1080&fit=crop', 'Projeler', '/projeler', 'Enerji Verimliliği', '/hizmetler', 1, 2, '[{"value": "%40", "label": "Tasarruf"}, {"value": "50+", "label": "Yıl Garanti"}, {"value": "60%", "label": "LEED Sertifikası"}, {"value": "A+++", "label": "Enerji Sınıfı"}]'),

-- 3. İş Ortaklarımız - Güvenilir Markalar
('İş Ortaklarımız', 'Güvenilir Markalar', 'Dünya lideri markaların yetkili bayisi olarak kaliteli ürünler ve güvenilir hizmet sunuyoruz. Bosch, Vaillant, Buderus, Baymak, ECA, Demirdöküm.', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=1080&fit=crop', 'Ürünleri İncele', '/urunler', 'Fiyat Al', '/randevu', 1, 3, '[{"value": "6+", "label": "Global Marka"}, {"value": "1000+", "label": "Ürün Çeşidi"}, {"value": "%100", "label": "Orijinal Ürün"}, {"value": "10+", "label": "Yıl Garanti"}]');
