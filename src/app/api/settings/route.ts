import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    const env = process.env as any;
    
    // Try to get from database first
    if (env.DB) {
      try {
        console.log('🔄 Fetching site settings from D1 database...');
        const result = await env.DB.prepare(`
          SELECT key, value 
          FROM settings
        `).all();

        if (result.results && result.results.length > 0) {
          console.log('✅ Found site settings in database:', result.results.length);
          
          // Transform database format to settings object
          const settings: any = { ...defaultSettings };
          result.results.forEach((row: any) => {
            settings[row.key] = row.value;
          });

          return NextResponse.json({ 
            success: true, 
            data: settings,
            source: 'database'
          });
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    // Fallback to default settings
    console.log('📁 Using default site settings');
    return NextResponse.json({ 
      success: true, 
      data: defaultSettings,
      source: 'default'
    });
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const env = process.env as any;
    const data = await request.json();
    
    if (!env.DB) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available' 
      });
    }

    // Save settings to database
    try {
      console.log('💾 Saving site settings to D1 database...');
      
      // Create settings table if it doesn't exist
      await env.DB.prepare(`
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
          await env.DB.prepare(`
            INSERT OR REPLACE INTO settings (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
          `).bind(key, String(value)).run();
          
          console.log(`✅ Saved setting: ${key} = ${value}`);
        }
      }

      console.log('✅ Site settings saved to database');

      return NextResponse.json({ 
        success: true, 
        message: 'Settings saved successfully',
        data: data
      });
    } catch (dbError) {
      console.error('Database save error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to save settings' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    );
  }
} 