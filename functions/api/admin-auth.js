export async function onRequest(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { method } = request;

    if (method === 'POST') {
      // Login authentication
      const body = await request.json();
      const { password } = body;

      if (!password) {
        return Response.json({
          success: false,
          error: 'Şifre gerekli'
        }, { 
          status: 400,
          headers: corsHeaders 
        });
      }

      // Get admin password from database
      const stmt = env.ozmevsim_d1.prepare('SELECT value FROM settings WHERE key = ?');
      const result = await stmt.bind('admin_password').first();

      let correctPassword = 'mali06'; // Fallback password
      if (result && result.value) {
        correctPassword = result.value;
      } else {
        // Create admin password in database if not exists
        const insertStmt = env.ozmevsim_d1.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)');
        await insertStmt.bind('admin_password', 'mali06', new Date().toISOString()).run();
      }

      if (password === correctPassword) {
        // Generate a simple session token
        const sessionToken = btoa(Date.now() + '_' + Math.random().toString(36));
        
        // Store session in database (expires in 24 hours)
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        const sessionStmt = env.ozmevsim_d1.prepare('INSERT OR REPLACE INTO admin_sessions (token, expires_at, created_at) VALUES (?, ?, ?)');
        await sessionStmt.bind(sessionToken, expiresAt, new Date().toISOString()).run();

        return Response.json({
          success: true,
          token: sessionToken,
          message: 'Giriş başarılı'
        }, { 
          status: 200,
          headers: corsHeaders 
        });
      } else {
        return Response.json({
          success: false,
          error: 'Hatalı şifre'
        }, { 
          status: 401,
          headers: corsHeaders 
        });
      }
    }

    if (method === 'GET') {
      // Verify session token
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return Response.json({
          success: false,
          authenticated: false,
          error: 'Token gerekli'
        }, { 
          status: 401,
          headers: corsHeaders 
        });
      }

      const token = authHeader.replace('Bearer ', '');
      
      // Check token in database
      const stmt = env.ozmevsim_d1.prepare('SELECT * FROM admin_sessions WHERE token = ? AND expires_at > ?');
      const session = await stmt.bind(token, new Date().toISOString()).first();

      if (session) {
        return Response.json({
          success: true,
          authenticated: true,
          message: 'Geçerli oturum'
        }, { 
          status: 200,
          headers: corsHeaders 
        });
      } else {
        return Response.json({
          success: false,
          authenticated: false,
          error: 'Geçersiz veya süresi dolmuş token'
        }, { 
          status: 401,
          headers: corsHeaders 
        });
      }
    }

    return Response.json({
      success: false,
      error: 'Desteklenmeyen method'
    }, { 
      status: 405,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Admin auth error:', error);
    return Response.json({
      success: false,
      error: 'Sunucu hatası'
    }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
} 