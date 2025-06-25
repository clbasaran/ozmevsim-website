-- Mevcut test verilerini sil
DELETE FROM hero_slides;

-- Gerçek hero slide verilerini ekle
INSERT INTO hero_slides (title, subtitle, description, image, cta_text, cta_link, active, order_num) VALUES
('Ankara''nın Güvenilir Isı Sistemleri Uzmanı', '25+ Yıllık Deneyim, Kaliteli Hizmet', 'Kombi, klima ve doğalgaz tesisatı kurulum, bakım ve onarım hizmetleri. 7/24 servis desteği ile yanınızdayız.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop', 'Hemen Randevu Al', '/randevu', 1, 1),

('Profesyonel Kombi Servisi', 'Tüm Marka ve Modeller', 'Vaillant, Bosch, Demirdöküm, Baymak ve tüm markalarda uzman servis. Garantili işçilik, orijinal yedek parça.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop', 'Kombi Servisi', '/hizmetler', 1, 2),

('Enerji Verimli Klima Sistemleri', 'Montaj ve Bakım Hizmetleri', 'A++ enerji sınıfı klima sistemleri ile hem tasarruf edin hem de çevreyi koruyun. Profesyonel montaj garantili.', 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1920&h=1080&fit=crop', 'Klima Sistemleri', '/urunler', 1, 3);
