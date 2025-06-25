// Testimonials API for Cloudflare Pages Functions

const testimonials = [
  {
    id: '1',
    name: 'Mehmet Yılmaz',
    company: 'Ev Sahibi',
    rating: 5,
    comment: 'Öz Mevsim ekibi çok profesyonel. Kombi montajını hızlı ve temiz bir şekilde tamamladılar.',
    date: '2024-03-10',
    location: 'Ankara, Çankaya',
    service: 'Kombi Montajı',
    featured: true,
    status: 'approved'
  },
  {
    id: '2',
    name: 'Ayşe Kaya',
    company: 'Ev Sahibi',
    rating: 5,
    comment: 'Klima montajı için aradım, çok memnun kaldım. Fiyatları da uygun.',
    date: '2024-03-08',
    location: 'Ankara, Keçiören',
    service: 'Klima Montajı',
    featured: true,
    status: 'approved'
  },
  {
    id: '3',
    name: 'Ali Demir',
    company: 'İş Yeri Sahibi',
    rating: 4,
    comment: 'Doğalgaz tesisatı kurulumu için çalıştık. İşlerini iyi yapıyorlar.',
    date: '2024-03-05',
    location: 'Ankara, Mamak',
    service: 'Doğalgaz Tesisatı',
    featured: false,
    status: 'approved'
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
      const featured = url.searchParams.get('featured');
      const service = url.searchParams.get('service');
      
      let filteredTestimonials = [...testimonials];

      // Only return approved testimonials
      filteredTestimonials = filteredTestimonials.filter(t => t.status === 'approved');

      if (featured === 'true') {
        filteredTestimonials = filteredTestimonials.filter(t => t.featured);
      }

      if (service && service !== 'all') {
        filteredTestimonials = filteredTestimonials.filter(t => 
          t.service.toLowerCase().includes(service.toLowerCase())
        );
      }

      // Sort by date (newest first)
      filteredTestimonials.sort((a, b) => new Date(b.date) - new Date(a.date));

      return new Response(JSON.stringify({
        success: true,
        data: filteredTestimonials,
        total: filteredTestimonials.length
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