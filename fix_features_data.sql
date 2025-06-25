-- Fix Features Data - Move features from description to features array

-- 1. BOSCH CONDENS 2200i - Fix Features
UPDATE products SET 
  description = 'Bosch Condens 2200i, son teknoloji kondenzasyon teknolojisi ile donatılmış, enerji verimliliğinde A sınıfı performans gösteren yeni nesil kombi sistemidir. Almanya''nın dünya çapında tanınan mühendislik kalitesi ile üretilen bu model, hem çevre dostu hem de ekonomik çözümler sunar.

Gelişmiş kondenzasyon teknolojisi sayesinde, geleneksel kombilere göre %30''a varan enerji tasarrufu sağlar. Özel tasarım ısı değiştiricisi, baca gazlarındaki ısıyı geri kazanarak maksimum verimlilik elde eder. Bu teknoloji sayesinde, yıllık enerji faturalarında önemli tasarruf elde edebilirsiniz.

Akıllı modülasyon sistemi, ihtiyaca göre gücü otomatik olarak ayarlar ve gereksiz enerji tüketimini önler. Elektronik kontrol ünitesi, sürekli olarak sistemi izler ve optimize eder. Kompakt tasarımı sayesinde dar alanlara kolayca monte edilebilir.',
  
  features = '["A sınıfı enerji verimliliği", "Kondenzasyon teknolojisi ile %30 tasarruf", "Akıllı modülasyon sistemi", "Kompakt ve sessiz çalışma", "Elektronik kontrol ünitesi", "Donma koruma sistemi", "Uzaktan kumanda özelliği", "Çevre dostu düşük emisyon", "Kolay kurulum ve bakım", "25 yıl yedek parça garantisi", "Dijital sıcaklık göstergesi", "Otomatik teşhis sistemi"]'
WHERE id = 2;

-- 2. Check other products and fix if needed
UPDATE products SET 
  features = '["Yerli üretim güvencesi", "Ekonomik fiyat avantajı", "Paslanmaz çelik ısı değiştiricisi", "Çift fonksiyonlu sistem", "Otomatik ateşleme", "Elektronik kontrol ünitesi", "Aşırı ısınma koruması", "Kompakt tasarım", "Geniş servis ağı", "Kolay kullanım", "Düşük bakım maliyeti", "2 yıl tam garanti"]'
WHERE id = 3 AND (features = '[]' OR features IS NULL);

UPDATE products SET 
  features = '["Modern estetik tasarım", "İleri teknoloji ısı değiştiricisi", "Akıllı kontrol sistemi", "Yenilikçi kullanıcı arayüzü", "Çok katmanlı güvenlik", "Sessiz çalışma teknolojisi", "Premium malzeme kalitesi", "Bakım kolaylığı", "Enerji optimizasyonu", "Çevre dostu teknoloji", "Uzun ömür garantisi", "Kolay montaj sistemi"]'
WHERE id = 4 AND (features = '[]' OR features IS NULL);

UPDATE products SET 
  features = '["Devrimci nitro teknolojisi", "%25 yüksek verimlilik", "Ultra temiz yanma", "Katalitik yanma sistemi", "Mikroişlemci kontrolü", "Adaptif öğrenme", "Hassas sıcaklık kontrolü", "Gelişmiş donma koruma", "Otomatik teşhis sistemi", "15+ yıl ömür", "Minimum emisyon", "Çevre dostu teknoloji"]'
WHERE id = 5 AND (features = '[]' OR features IS NULL);

UPDATE products SET 
  features = '["İyonik alev teknolojisi", "%35 verimlilik artışı", "Sıfıra yakın emisyon", "Plazma destekli yanma", "Yapay zeka kontrolü", "Tahminleme algoritmaları", "Quantum sensör teknolojisi", "Titanium alaşımlı değiştirici", "Nano-coating koruması", "Akıllı bakım sistemi", "Kendini temizleme", "20+ yıl ömür garantisi"]'
WHERE id = 6 AND (features = '[]' OR features IS NULL);

UPDATE products SET 
  features = '["Çok katmanlı izolasyon", "%40 ısı kaybı azaltma", "Aerogel nano-teknoloji", "NASA uzay teknolojisi", "Vakum izolasyon panelleri", "Termal köprü kesme", "%98 ısı geri kazanım", "Değişken geometrili değiştirici", "Magnetik nano-partiküller", "Predictive maintenance", "Ekolojik geri dönüşüm", "Ultra verimlilik"]'
WHERE id = 8 AND (features = '[]' OR features IS NULL); 