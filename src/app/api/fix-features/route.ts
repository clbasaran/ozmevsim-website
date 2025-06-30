import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const env = process.env as any;
    
    if (!env.ozmevsim_d1) {
      return NextResponse.json({ success: false, error: 'Database not available' }, { status: 500 });
    }

    const db = env.ozmevsim_d1 as any;

    // Fix features for all products
    const updates = [
      {
        id: 2,
        features: '["A sınıfı enerji verimliliği", "Kondenzasyon teknolojisi ile %30 tasarruf", "Akıllı modülasyon sistemi", "Kompakt ve sessiz çalışma", "Elektronik kontrol ünitesi", "Donma koruma sistemi", "Uzaktan kumanda özelliği", "Çevre dostu düşük emisyon", "Kolay kurulum ve bakım", "25 yıl yedek parça garantisi", "Dijital sıcaklık göstergesi", "Otomatik teşhis sistemi"]',
        description: 'Bosch Condens 2200i, son teknoloji kondenzasyon teknolojisi ile donatılmış, enerji verimliliğinde A sınıfı performans gösteren yeni nesil kombi sistemidir. Almanya\'nın dünya çapında tanınan mühendislik kalitesi ile üretilen bu model, hem çevre dostu hem de ekonomik çözümler sunar.\n\nGelişmiş kondenzasyon teknolojisi sayesinde, geleneksel kombilere göre %30\'a varan enerji tasarrufu sağlar. Özel tasarım ısı değiştiricisi, baca gazlarındaki ısıyı geri kazanarak maksimum verimlilik elde eder.'
      },
      {
        id: 3,
        features: '["Yerli üretim güvencesi", "Ekonomik fiyat avantajı", "Paslanmaz çelik ısı değiştiricisi", "Çift fonksiyonlu sistem", "Otomatik ateşleme", "Elektronik kontrol ünitesi", "Aşırı ısınma koruması", "Kompakt tasarım", "Geniş servis ağı", "Kolay kullanım", "Düşük bakım maliyeti", "2 yıl tam garanti"]'
      },
      {
        id: 4,
        features: '["Modern estetik tasarım", "İleri teknoloji ısı değiştiricisi", "Akıllı kontrol sistemi", "Yenilikçi kullanıcı arayüzü", "Çok katmanlı güvenlik", "Sessiz çalışma teknolojisi", "Premium malzeme kalitesi", "Bakım kolaylığı", "Enerji optimizasyonu", "Çevre dostu teknoloji", "Uzun ömür garantisi", "Kolay montaj sistemi"]'
      },
      {
        id: 5,
        features: '["Devrimci nitro teknolojisi", "%25 yüksek verimlilik", "Ultra temiz yanma", "Katalitik yanma sistemi", "Mikroişlemci kontrolü", "Adaptif öğrenme", "Hassas sıcaklık kontrolü", "Gelişmiş donma koruma", "Otomatik teşhis sistemi", "15+ yıl ömür", "Minimum emisyon", "Çevre dostu teknoloji"]'
      },
      {
        id: 6,
        features: '["İyonik alev teknolojisi", "%35 verimlilik artışı", "Sıfıra yakın emisyon", "Plazma destekli yanma", "Yapay zeka kontrolü", "Tahminleme algoritmaları", "Quantum sensör teknolojisi", "Titanium alaşımlı değiştirici", "Nano-coating koruması", "Akıllı bakım sistemi", "Kendini temizleme", "20+ yıl ömür garantisi"]'
      },
      {
        id: 8,
        features: '["Çok katmanlı izolasyon", "%40 ısı kaybı azaltma", "Aerogel nano-teknoloji", "NASA uzay teknolojisi", "Vakum izolasyon panelleri", "Termal köprü kesme", "%98 ısı geri kazanım", "Değişken geometrili değiştirici", "Magnetik nano-partiküller", "Predictive maintenance", "Ekolojik geri dönüşüm", "Ultra verimlilik"]'
      }
    ];

    const results = [];
    for (const update of updates) {
      const query = update.description 
        ? `UPDATE products SET features = ?, description = ? WHERE id = ?`
        : `UPDATE products SET features = ? WHERE id = ?`;
      
      const params = update.description 
        ? [update.features, update.description, update.id]
        : [update.features, update.id];
        
      const result = await db.prepare(query).bind(...params).run();
      results.push({ id: update.id, success: result.success });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Features updated successfully',
      results 
    });

  } catch (error: any) {
    console.error('Fix features error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 