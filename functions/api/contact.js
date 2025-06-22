// Contact API for Cloudflare Pages Functions with D1 Database
// This replaces the mock data with real D1 database operations

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
    // Check if D1 database is available
    if (!env.DB) {
      throw new Error('Database not available');
    }

    if (request.method === 'GET') {
      const status = url.searchParams.get('status');
      
      // Build SQL query
      let query = 'SELECT * FROM contact_messages';
      let params = [];
      
      if (status && status !== 'all') {
        query += ' WHERE status = ?';
        params.push(status);
      }
      
      query += ' ORDER BY created_at DESC';
      
      // Execute query
      const stmt = env.DB.prepare(query);
      const result = await stmt.bind(...params).all();

      return new Response(JSON.stringify({
        success: true,
        data: result.results || []
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    if (request.method === 'POST') {
      const body = await request.json();
      const { name, email, phone, subject, message } = body;
      
      // Basic validation
      if (!name || !email || !message) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Name, email and message are required'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid email format'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Insert into D1 database
      const stmt = env.DB.prepare(`
        INSERT INTO contact_messages (name, email, phone, subject, message, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      const result = await stmt.bind(
        name,
        email,
        phone || '',
        subject || '',
        message,
        'unread'
      ).run();

      if (!result.success) {
        throw new Error('Failed to save contact message');
      }

      // Return success response
      return new Response(JSON.stringify({
        success: true,
        message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
        data: {
          id: result.meta.last_row_id,
          submittedAt: new Date().toISOString()
        }
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
    console.error('Contact API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error: ' + error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
} 