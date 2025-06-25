const defaultReferences = [
  {
    id: 1,
    title: 'Residence Villa Kompleksi',
    description: 'Ankara\'nın prestijli bölgelerinden birinde yer alan villa kompleksimizde 50 villa için kombi ve radyatör sistemleri kurduk. Vaillant ecoTEC Plus kombiler ve Purmo panel radyatörler ile mükemmel ısıtma konforu sağladık.',
    client: 'Residence İnşaat',
    location: 'Çankaya, Ankara',
    category: 'Residential',
    completedDate: '2023-11-15',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    status: 'active',
    featured: true,
    rating: 5,
    createdAt: '2023-11-15T10:00:00Z',
    updatedAt: '2023-11-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Botanik Plaza Ofis Binası',
    description: 'Botanik\'te 25 katlı modern ofis binasında merkezi ısıtma sistemi kurulumu gerçekleştirdik. Bosch kondansing kazanlar ve akıllı kontrol sistemleri ile enerji verimliliği %35 artırıldı.',
    client: 'Botanik Plaza Yapı',
    location: 'Botanik, Ankara',
    category: 'Commercial',
    completedDate: '2023-10-20',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    status: 'active',
    featured: true,
    rating: 5,
    createdAt: '2023-10-20T10:00:00Z',
    updatedAt: '2023-10-20T10:00:00Z'
  },
  {
    id: 3,
    title: 'Sanayi Fabrikası Enerji Sistemi',
    description: 'Organize Sanayi Bölgesi\'nde 5000 m² kapalı alana sahip üretim tesisinde endüstriyel ısıtma sistemi kurulumu. Buderus endüstriyel kazanlar ve ısı geri kazanım sistemi ile %40 enerji tasarrufu sağlandı.',
    client: 'ASO Makine San.',
    location: 'Sincan OSB, Ankara',
    category: 'Industrial',
    completedDate: '2023-09-30',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
    status: 'active',
    featured: true,
    rating: 5,
    createdAt: '2023-09-30T10:00:00Z',
    updatedAt: '2023-09-30T10:00:00Z'
  },
  {
    id: 4,
    title: 'Konutkent Sitesi Doğalgaz Dönüşümü',
    description: 'Keçiören\'de 200 konutluk sitede eski kalorifer sisteminden modern kombi sistemlerine geçiş projesi. Her daireye Vaillant ecoTEC Pro kombiler kuruldu ve %50 enerji tasarrufu sağlandı.',
    client: 'Konutkent Yönetimi',
    location: 'Keçiören, Ankara',
    category: 'Residential',
    completedDate: '2023-08-15',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    status: 'active',
    featured: true,
    rating: 4,
    createdAt: '2023-08-15T10:00:00Z',
    updatedAt: '2023-08-15T10:00:00Z'
  },
  {
    id: 5,
    title: 'Capitol AVM Klima Sistemi',
    description: 'Ankara\'nın en büyük alışveriş merkezlerinden Capitol AVM\'de 50000 m² alana VRV klima sistemi kurulumu. Daikin VRV sistemi ile %30 enerji verimliliği artışı sağlandı.',
    client: 'Capitol AVM',
    location: 'Çukurambar, Ankara',
    category: 'Commercial',
    completedDate: '2023-07-10',
    image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&h=600&fit=crop',
    status: 'active',
    featured: false,
    rating: 5,
    createdAt: '2023-07-10T10:00:00Z',
    updatedAt: '2023-07-10T10:00:00Z'
  },
  {
    id: 6,
    title: 'Gazi Üniversitesi Teknokent',
    description: 'Gazi Üniversitesi Teknokent binasında akıllı ısıtma ve soğutma sistemi kurulumu. IoT sensörleri ve akıllı kontrol sistemi ile %45 enerji tasarrufu elde edildi.',
    client: 'Gazi Üniversitesi',
    location: 'Maltepe, Ankara',
    category: 'Institutional',
    completedDate: '2023-06-20',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
    status: 'active',
    featured: false,
    rating: 5,
    createdAt: '2023-06-20T10:00:00Z',
    updatedAt: '2023-06-20T10:00:00Z'
  }
];

export async function onRequest(context) {
  const { request } = context;
  
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const url = new URL(request.url);
    const featured = url.searchParams.get('featured');
    const category = url.searchParams.get('category');
    const limit = url.searchParams.get('limit');
    
    let filteredReferences = defaultReferences;

    // Filter by featured status
    if (featured === 'true') {
      filteredReferences = filteredReferences.filter(ref => ref.featured);
    }

    // Filter by category
    if (category) {
      filteredReferences = filteredReferences.filter(ref => 
        ref.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredReferences = filteredReferences.slice(0, limitNum);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      data: filteredReferences,
      count: filteredReferences.length,
      total: defaultReferences.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in references function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch references'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 