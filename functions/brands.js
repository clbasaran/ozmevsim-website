export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (request.method === 'GET') {
      // Get all active brands
      const { results } = await env.ozmevsim_d1.prepare(`
        SELECT id, name, logo_url, alt_text, website_url, is_active, sort_order 
        FROM brands 
        WHERE is_active = 1 
        ORDER BY sort_order ASC
      `).all();

      return new Response(JSON.stringify({
        success: true,
        data: results,
        count: results.length,
        source: 'database'
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    if (request.method === 'POST') {
      // Add new brand
      const data = await request.json();
      
      const { results } = await env.ozmevsim_d1.prepare(`
        INSERT INTO brands (name, logo_url, alt_text, website_url, is_active, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        data.name,
        data.logo_url,
        data.alt_text || `${data.name} Logo`,
        data.website_url || '',
        data.is_active !== undefined ? data.is_active : 1,
        data.sort_order || 0
      ).run();

      return new Response(JSON.stringify({
        success: true,
        data: { id: results.meta.last_row_id },
        message: 'Brand added successfully'
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    if (request.method === 'PUT') {
      // Update brand
      const data = await request.json();
      const brandId = url.pathname.split('/').pop();
      
      await env.ozmevsim_d1.prepare(`
        UPDATE brands 
        SET name = ?, logo_url = ?, alt_text = ?, website_url = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        data.name,
        data.logo_url,
        data.alt_text,
        data.website_url,
        data.is_active,
        data.sort_order,
        brandId
      ).run();

      return new Response(JSON.stringify({
        success: true,
        message: 'Brand updated successfully'
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    if (request.method === 'DELETE') {
      // Delete brand
      const brandId = url.pathname.split('/').pop();
      
      await env.ozmevsim_d1.prepare(`
        DELETE FROM brands WHERE id = ?
      `).bind(brandId).run();

      return new Response(JSON.stringify({
        success: true,
        message: 'Brand deleted successfully'
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
    console.error('Brands API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
} 