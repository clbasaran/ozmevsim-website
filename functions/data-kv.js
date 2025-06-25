// Cloudflare KV Data Management API
export async function onRequest(context) {
  const { request, env } = context;
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
    const key = url.searchParams.get('key');
    
    if (request.method === 'GET') {
      if (!key) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Key parameter required'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const data = await env.SITE_DATA.get(key);
      
      return new Response(JSON.stringify({
        success: true,
        data: data ? JSON.parse(data) : null
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (request.method === 'PUT' || request.method === 'POST') {
      if (!key) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Key parameter required'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const body = await request.json();
      
      await env.SITE_DATA.put(key, JSON.stringify({
        ...body,
        lastUpdated: new Date().toISOString()
      }));

      return new Response(JSON.stringify({
        success: true,
        message: 'Data saved successfully'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (request.method === 'DELETE') {
      if (!key) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Key parameter required'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      await env.SITE_DATA.delete(key);

      return new Response(JSON.stringify({
        success: true,
        message: 'Data deleted successfully'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
} 