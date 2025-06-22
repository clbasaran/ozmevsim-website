// Blog API for Cloudflare Pages Functions

const blogPosts = [
  {
    id: '1',
    title: 'Kış Aylarında Kombi Verimliliğini Artırmanın 10 Yolu',
    slug: 'kis-aylarinda-kombi-verimliligini-artirmanin-10-yolu',
    excerpt: 'Soğuk kış aylarında enerji faturalarınızı düşürürken evinizi sıcak tutmanın pratik yollarını keşfedin.',
    content: 'Kış aylarında artan doğalgaz faturaları ailelerin en büyük endişelerinden biri. İşte kombi verimliliğinizi artırarak hem tasarruf edebileceğiniz hem de çevreyi koruyabileceğiniz 10 etkili yöntem...',
    category: 'tips',
    author: 'Murat Özkan',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    publishDate: '2024-03-15',
    readTime: 8,
    views: 1250,
    tags: ['enerji tasarrufu', 'kombi', 'kış bakımı', 'verimlilik'],
    featuredImage: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&h=400&fit=crop',
    featured: true,
    status: 'published',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Yeni Nesil Akıllı Termostat Teknolojileri',
    slug: 'yeni-nesil-akilli-termostat-teknolojileri',
    excerpt: 'IoT destekli akıllı termostatlarla evinizin ısıtma sistemini nasıl optimize edebileceğinizi öğrenin.',
    content: 'Teknolojinin hızla gelişmesiyle birlikte ev ısıtma sistemleri de akıllanıyor. Yeni nesil akıllı termostatlar...',
    category: 'technology',
    author: 'Ayşe Demir',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    publishDate: '2024-03-12',
    readTime: 6,
    views: 890,
    tags: ['akıllı sistem', 'termostat', 'IoT', 'teknoloji'],
    featuredImage: 'https://images.unsplash.com/photo-1558618666-fbd25c85cd64?w=600&h=400&fit=crop',
    featured: false,
    status: 'published',
    createdAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-03-12T10:00:00Z'
  }
];

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (request.method === 'GET') {
      const category = url.searchParams.get('category');
      const status = url.searchParams.get('status');
      const featured = url.searchParams.get('featured');

      let filteredPosts = [...blogPosts];

      if (category && category !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }

      if (status && status !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.status === status);
      }

      if (featured === 'true') {
        filteredPosts = filteredPosts.filter(post => post.featured);
      }

      return new Response(JSON.stringify({
        success: true,
        data: filteredPosts,
        total: filteredPosts.length
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
} 