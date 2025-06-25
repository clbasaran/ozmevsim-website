// Default settings
const defaultSettings = {
  site_name: 'Ankara Doğalgaz Tesisatı | Kombi Servisi | Klima - Özmevsim',
  site_description: 'Ankara\'da doğalgaz tesisatı, kombi satış-servis ve klima sistemleri. 7/24 servis ✓ Uygun fiyat ✓ Garantili işçilik. ☎ 0312 357 0600',
  site_url: 'https://ozmevsim.com',
  admin_email: 'admin@ozmevsim.com',
  timezone: 'Europe/Istanbul',
  language: 'tr',
  date_format: 'DD/MM/YYYY',
  contact_phone: '+90 312 357 0600',
  contact_email: 'info@ozmevsim.com',
  address: 'Kuşcağız Mahallesi Sanatoryum Caddesi No:221/A Keçiören, Ankara'
};

export async function onRequestGet(context) {
  try {
    const { env } = context;
    
    // Try to get from database first
    if (env.ozmevsim_d1 || env['ozmevsim-d1']) {
      const DB = env.ozmevsim_d1 || env['ozmevsim-d1'];
      try {
        console.log('🔄 Fetching site settings from D1 database...');
        const result = await DB.prepare(`
          SELECT key, value 
          FROM settings
        `).all();

        if (result.results && result.results.length > 0) {
          console.log('✅ Found site settings in database:', result.results.length);
          
          // Transform database format to settings object
          const settings = { ...defaultSettings };
          result.results.forEach((row) => {
            settings[row.key] = row.value;
          });

          return new Response(JSON.stringify({ 
            success: true, 
            data: settings,
            source: 'database'
          }), {
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    // Fallback to default settings
    console.log('📁 Using default site settings');
    return new Response(JSON.stringify({ 
      success: true, 
      data: defaultSettings,
      source: 'default'
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Settings API error:', error);
    return new Response(JSON.stringify({
      success: false, 
      error: 'Failed to fetch settings'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const data = await request.json();
    
    const DB = env.ozmevsim_d1 || env['ozmevsim-d1'];
    
    if (!DB) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Database not available' 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Save settings to database
    try {
      console.log('💾 Saving site settings to D1 database...');
      
      // Create settings table if it doesn't exist
      await DB.prepare(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
      
      // Update or insert each setting
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string' || typeof value === 'boolean') {
          await DB.prepare(`
            INSERT OR REPLACE INTO settings (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
          `).bind(key, String(value)).run();
          
          console.log(`✅ Saved setting: ${key} = ${value}`);
        }
      }

      console.log('✅ Site settings saved to database');

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Settings saved successfully',
        data: data
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (dbError) {
      console.error('Database save error:', dbError);
      return new Response(JSON.stringify({
        success: false, 
        error: 'Failed to save settings'
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (error) {
    console.error('Settings POST error:', error);
    return new Response(JSON.stringify({
      success: false, 
      error: 'Failed to save settings'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
} 