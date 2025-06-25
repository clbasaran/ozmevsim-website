// FAQ API for Cloudflare Pages Functions

// Database service implementation
function createDatabaseService(env) {
  if (!env?.ozmevsim_d1) {
    console.log('D1 database not available');
    return null;
  }

  return {
    async getFAQs(status = 'active') {
      try {
        const query = `SELECT id, question, answer, category, order_index as 'order', status FROM faqs WHERE status = ? ORDER BY order_index ASC`;
        const result = await env.ozmevsim_d1.prepare(query).bind(status).all();
        
        return result.results.map(row => ({
          id: row.id.toString(),
          question: row.question,
          answer: row.answer,
          category: row.category,
          order: row.order,
          isActive: row.status === 'active'
        }));
      } catch (error) {
        console.error('D1 getFAQs error:', error);
        throw error;
      }
    },

    async createFAQ(data) {
      try {
        const query = `INSERT INTO faqs (question, answer, category, order_index, status) VALUES (?, ?, ?, ?, ?)`;
        const result = await env.ozmevsim_d1.prepare(query)
          .bind(data.question, data.answer, data.category, data.order_index, data.status)
          .run();
        
        return {
          success: result.success,
          id: result.meta?.last_row_id
        };
      } catch (error) {
        console.error('D1 createFAQ error:', error);
        return { success: false, error: error.message };
      }
    },

    async updateFAQ(id, data) {
      try {
        const query = `UPDATE faqs SET question = ?, answer = ?, category = ?, order_index = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        const result = await env.ozmevsim_d1.prepare(query)
          .bind(data.question, data.answer, data.category, data.order_index, data.status, id)
          .run();
        
        return { success: result.success };
      } catch (error) {
        console.error('D1 updateFAQ error:', error);
        return { success: false, error: error.message };
      }
    },

    async deleteFAQ(id) {
      try {
        const query = `DELETE FROM faqs WHERE id = ?`;
        const result = await env.ozmevsim_d1.prepare(query).bind(id).run();
        
        return { success: result.success };
      } catch (error) {
        console.error('D1 deleteFAQ error:', error);
        return { success: false, error: error.message };
      }
    }
  };
}

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
  const { request, env } = context;
  const url = new URL(request.url);
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Debug: Log the request method
  console.log('FAQ API Request Method:', request.method);

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (request.method === 'GET') {
      // Try to get data from D1 database first
      try {
        const dbService = createDatabaseService(env);
        if (dbService) {
          const status = url.searchParams.get('status') || 'active';
          const faqs = await dbService.getFAQs(status);
          
          return new Response(JSON.stringify({
            success: true,
            data: faqs,
            total: faqs.length
          }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      } catch (dbError) {
        console.error('Database error, falling back to static data:', dbError);
      }

      // Fallback to static data
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

    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const { question, answer, category, order, status } = body;

        // Validation
        if (!question || !answer) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Question and answer are required'
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        // Get database service
        const dbService = createDatabaseService(env);
        if (!dbService) {
          throw new Error('Database not available');
        }

        // Map frontend fields to database fields
        const dbStatus = status === 'published' ? 'active' : 'active'; // Default to active

        // Create FAQ in D1
        const result = await dbService.createFAQ({
          question,
          answer,
          category: category || 'general',
          order_index: order || 0,
          status: dbStatus
        });

        if (!result.success) {
          throw new Error(result.error || 'Failed to create FAQ');
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'FAQ created successfully',
          data: { id: result.id }
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });

      } catch (error) {
        console.error('FAQ POST Error:', error);
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to create FAQ'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }

    if (request.method === 'PUT') {
      try {
        const body = await request.json();
        const { id, question, answer, category, order, status } = body;

        if (!id) {
          return new Response(JSON.stringify({
            success: false,
            error: 'FAQ ID is required'
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        const dbService = createDatabaseService(env);
        if (!dbService) {
          throw new Error('Database not available');
        }

        // Map frontend fields to database fields
        const dbStatus = status === 'published' ? 'active' : 'active';

        const updateData = {
          question,
          answer,
          category,
          order_index: order,
          status: dbStatus
        };

        const result = await dbService.updateFAQ(parseInt(id), updateData);

        if (!result.success) {
          throw new Error(result.error || 'Failed to update FAQ');
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'FAQ updated successfully'
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      } catch (error) {
        console.error('FAQ PUT Error:', error);
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to update FAQ'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }

    if (request.method === 'DELETE') {
      try {
        const id = url.searchParams.get('id');

        if (!id) {
          return new Response(JSON.stringify({
            success: false,
            error: 'FAQ ID is required'
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        const dbService = createDatabaseService(env);
        if (!dbService) {
          throw new Error('Database not available');
        }

        const result = await dbService.deleteFAQ(parseInt(id));

        if (!result.success) {
          throw new Error(result.error || 'Failed to delete FAQ');
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'FAQ deleted successfully'
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      } catch (error) {
        console.error('FAQ DELETE Error:', error);
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to delete FAQ'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
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
    console.error('FAQ API Error:', error);
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