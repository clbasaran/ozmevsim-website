// FAQ API for Cloudflare Pages Functions

const faqData = [
  {
    id: '1',
    question: 'Kombi montajı ne kadar sürer?',
    answer: 'Standart kombi montajı genellikle 4-6 saat arasında tamamlanır. Mevcut tesisatın durumuna göre bu süre değişebilir.',
    category: 'montaj',
    order: 1,
    isActive: true
  },
  {
    id: '2',
    question: 'Kombi bakımı ne sıklıkla yapılmalı?',
    answer: 'Kombiler yılda en az bir kez profesyonel bakım görmelidir. Yoğun kullanım durumunda 6 ayda bir bakım önerilir.',
    category: 'bakim',
    order: 2,
    isActive: true
  },
  {
    id: '3',
    question: 'Hangi kombi markasını tercih etmeliyim?',
    answer: 'Vaillant, Buderus, Baymak gibi kaliteli markalar önerilir. Evinizin büyüklüğü ve ihtiyaçlarınıza göre seçim yapılmalıdır.',
    category: 'urun',
    order: 3,
    isActive: true
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
      
      let filteredFaqs = [...faqData];

      if (category && category !== 'all') {
        filteredFaqs = filteredFaqs.filter(faq => faq.category === category);
      }

      // Only return active FAQs
      filteredFaqs = filteredFaqs.filter(faq => faq.isActive);
      
      // Sort by order
      filteredFaqs.sort((a, b) => a.order - b.order);

      return new Response(JSON.stringify({
        success: true,
        data: filteredFaqs,
        total: filteredFaqs.length
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