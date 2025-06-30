import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

interface SiteSetting {
  id?: number;
  key: string;
  value: string;
  type: string;
  category: string;
  group_name: string;
  description?: string;
  is_public: boolean;
  sort_order: number;
  validation_rules?: string;
  updated_at?: string;
}

// Mock settings for development
function getMockSettings(): SiteSetting[] {
  return [
    // Company Info
    { key: 'company_name', value: 'Öz Mevsim Isı Sistemleri', type: 'text', category: 'basic', group_name: 'company_info', description: 'Şirket adı', is_public: true, sort_order: 1 },
    { key: 'company_description', value: 'Kombi, klima ve doğalgaz tesisatı konusunda uzman ekibimizle hizmet veriyoruz.', type: 'text', category: 'basic', group_name: 'company_info', description: 'Şirket açıklaması', is_public: true, sort_order: 2 },
    { key: 'company_slogan', value: 'Isıtma ve Soğutma Çözümlerinde Güvenilir Adres', type: 'text', category: 'basic', group_name: 'company_info', description: 'Şirket sloganı', is_public: true, sort_order: 3 },
    { key: 'company_founded_year', value: '2015', type: 'number', category: 'basic', group_name: 'company_info', description: 'Kuruluş yılı', is_public: true, sort_order: 4 },
    
    // Contact Info
    { key: 'contact_phone', value: '+90 555 123 45 67', type: 'text', category: 'basic', group_name: 'contact_info', description: 'Telefon numarası', is_public: true, sort_order: 1 },
    { key: 'contact_email', value: 'info@ozmevsim.com', type: 'email', category: 'basic', group_name: 'contact_info', description: 'E-posta adresi', is_public: true, sort_order: 2 },
    { key: 'contact_address', value: 'İstanbul, Türkiye', type: 'text', category: 'basic', group_name: 'contact_info', description: 'Adres', is_public: true, sort_order: 3 },
    { key: 'contact_working_hours', value: 'Pazartesi - Cumartesi: 08:00 - 18:00', type: 'text', category: 'basic', group_name: 'contact_info', description: 'Çalışma saatleri', is_public: true, sort_order: 4 },
    
    // Social Media
    { key: 'social_facebook', value: 'https://facebook.com/ozmevsim', type: 'url', category: 'social', group_name: 'social_media', description: 'Facebook URL', is_public: true, sort_order: 1 },
    { key: 'social_instagram', value: 'https://instagram.com/ozmevsim', type: 'url', category: 'social', group_name: 'social_media', description: 'Instagram URL', is_public: true, sort_order: 2 },
    { key: 'social_twitter', value: 'https://twitter.com/ozmevsim', type: 'url', category: 'social', group_name: 'social_media', description: 'Twitter URL', is_public: true, sort_order: 3 },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/ozmevsim', type: 'url', category: 'social', group_name: 'social_media', description: 'LinkedIn URL', is_public: true, sort_order: 4 },
    
    // SEO Settings
    { key: 'seo_title', value: 'Öz Mevsim Isı Sistemleri - Kombi ve Klima Uzmanı', type: 'text', category: 'meta', group_name: 'seo_settings', description: 'Site başlığı', is_public: true, sort_order: 1 },
    { key: 'seo_description', value: 'İstanbul\'da kombi montajı, klima kurulumu ve doğalgaz tesisatı hizmetleri. Uzman ekibimizle güvenilir çözümler.', type: 'text', category: 'meta', group_name: 'seo_settings', description: 'Site açıklaması', is_public: true, sort_order: 2 },
    { key: 'seo_keywords', value: 'kombi montajı, klima kurulumu, doğalgaz tesisatı, istanbul', type: 'text', category: 'meta', group_name: 'seo_settings', description: 'Anahtar kelimeler', is_public: true, sort_order: 3 },
    
    // System Settings
    { key: 'site_maintenance', value: 'false', type: 'boolean', category: 'system', group_name: 'system_settings', description: 'Bakım modu', is_public: false, sort_order: 1 },
    { key: 'analytics_enabled', value: 'true', type: 'boolean', category: 'system', group_name: 'system_settings', description: 'Analytics aktif', is_public: false, sort_order: 2 },
    { key: 'contact_form_enabled', value: 'true', type: 'boolean', category: 'system', group_name: 'system_settings', description: 'İletişim formu aktif', is_public: false, sort_order: 3 }
  ];
}

// GET /api/settings - Get all settings or filtered by group/category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group');
    const category = searchParams.get('category');
    const key = searchParams.get('key');
    const publicOnly = searchParams.get('public') === 'true';

    const env = process.env as any;
    
    // Development mode - use mock data
    if (!env.ozmevsim_d1 || process.env.NODE_ENV === 'development') {
      console.log('🔄 Using mock settings data for development');
      
      const mockSettings = getMockSettings();
      let filteredSettings = mockSettings;
      
      if (group) {
        filteredSettings = mockSettings.filter((s: SiteSetting) => s.group_name === group);
      }
      if (category) {
        filteredSettings = filteredSettings.filter((s: SiteSetting) => s.category === category);
      }
      if (key) {
        filteredSettings = filteredSettings.filter((s: SiteSetting) => s.key === key);
      }
      if (publicOnly) {
        filteredSettings = filteredSettings.filter((s: SiteSetting) => s.is_public);
      }

      // If requesting a single key, return just the value
      if (key && filteredSettings.length > 0) {
        const setting = filteredSettings[0];
        return NextResponse.json({
          success: true,
          data: {
            key: setting.key,
            value: setting.value,
            type: setting.type,
            category: setting.category,
            group_name: setting.group_name,
            is_public: setting.is_public
          }
        });
      }

      // Group settings by group_name for easier consumption
      const groupedSettings: Record<string, Record<string, any>> = {};
      
      filteredSettings.forEach((setting: any) => {
        if (!groupedSettings[setting.group_name]) {
          groupedSettings[setting.group_name] = {};
        }
        
        let value = setting.value;
        
        // Parse boolean values
        if (setting.type === 'boolean') {
          value = value === 'true' || value === '1' || value === true;
        }
        
        // Parse number values
        if (setting.type === 'number') {
          value = parseFloat(value) || 0;
        }
        
        // Parse JSON values
        if (setting.type === 'json' && value) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            console.warn('Failed to parse JSON setting:', setting.key, value);
          }
        }

        groupedSettings[setting.group_name][setting.key] = {
          value,
          type: setting.type,
          category: setting.category,
          description: setting.description,
          is_public: setting.is_public,
          sort_order: setting.sort_order
        };
      });

      console.log('✅ Mock settings returned:', Object.keys(groupedSettings).length, 'groups');

      return NextResponse.json({
        success: true,
        data: groupedSettings,
        count: filteredSettings.length,
        source: 'mock'
      });
    }

    let query = 'SELECT * FROM site_settings WHERE 1=1';
    const params: any[] = [];

    if (key) {
      query += ' AND key = ?';
      params.push(key);
    } else {
      if (group) {
        query += ' AND group_name = ?';
        params.push(group);
      }
      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }
      if (publicOnly) {
        query += ' AND is_public = ?';
        params.push(true);
      }
    }

    query += ' ORDER BY group_name, sort_order, key';

    console.log('🔄 Executing settings query:', query, params);
    
    const result = await env.ozmevsim_d1.prepare(query).bind(...params).all();

    if (!result.success) {
      console.error('❌ Settings query failed:', result.error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch settings'
      }, { status: 500 });
    }

    const settings = result.results || [];
    
    // If requesting a single key, return just the value
    if (key && settings.length > 0) {
      const setting = settings[0] as SiteSetting;
      return NextResponse.json({
        success: true,
        data: {
          key: setting.key,
          value: setting.value,
          type: setting.type,
          category: setting.category,
          group_name: setting.group_name,
          is_public: setting.is_public
        }
      });
    }

    // Group settings by group_name for easier consumption
    const groupedSettings: Record<string, Record<string, any>> = {};
    
    settings.forEach((setting: any) => {
      if (!groupedSettings[setting.group_name]) {
        groupedSettings[setting.group_name] = {};
      }
      
      let value = setting.value;
      
      // Parse boolean values
      if (setting.type === 'boolean') {
        value = value === 'true' || value === '1' || value === true;
      }
      
      // Parse number values
      if (setting.type === 'number') {
        value = parseFloat(value) || 0;
      }
      
      // Parse JSON values
      if (setting.type === 'json' && value) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          console.warn('Failed to parse JSON setting:', setting.key, value);
        }
      }

      groupedSettings[setting.group_name][setting.key] = {
        value,
        type: setting.type,
        category: setting.category,
        description: setting.description,
        is_public: setting.is_public,
        sort_order: setting.sort_order
      };
    });

    console.log('✅ Settings fetched successfully:', Object.keys(groupedSettings).length, 'groups');

    return NextResponse.json({
      success: true,
      data: groupedSettings,
      count: settings.length
    });

  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch settings'
    }, { status: 500 });
  }
}

// PUT /api/settings - Update a single setting or multiple settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const env = process.env as any;
    
    if (!env.ozmevsim_d1) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    // Handle bulk update
    if (body.settings && Array.isArray(body.settings)) {
      const results = [];
      
      for (const setting of body.settings) {
        if (!setting.key || setting.value === undefined) {
          continue;
        }

        const updateQuery = `
          UPDATE site_settings 
          SET value = ?, updated_at = datetime('now')
          WHERE key = ?
        `;

        const result = await env.ozmevsim_d1
          .prepare(updateQuery)
          .bind(String(setting.value), setting.key)
          .run();

        results.push({
          key: setting.key,
          success: result.success,
          changes: result.changes
        });
      }

      const successCount = results.filter(r => r.success).length;

      return NextResponse.json({
        success: successCount > 0,
        data: results,
        message: `${successCount}/${body.settings.length} settings updated successfully`
      });
    }

    // Handle single setting update
    if (!body.key || body.value === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Key and value are required'
      }, { status: 400 });
    }

    const updateQuery = `
      UPDATE site_settings 
      SET value = ?, updated_at = datetime('now')
      WHERE key = ?
    `;

    const result = await env.ozmevsim_d1
      .prepare(updateQuery)
      .bind(String(body.value), body.key)
      .run();

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update setting'
      }, { status: 500 });
    }

    if (result.changes === 0) {
      return NextResponse.json({
        success: false,
        error: 'Setting not found'
      }, { status: 404 });
    }

    console.log('✅ Setting updated:', body.key, '=', body.value);

    return NextResponse.json({
      success: true,
      data: {
        key: body.key,
        value: body.value,
        changes: result.changes
      },
      message: 'Setting updated successfully'
    });

  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update setting'
    }, { status: 500 });
  }
}

// POST /api/settings - Create a new setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const env = process.env as any;
    
    if (!env.ozmevsim_d1) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    const {
      key,
      value,
      type = 'text',
      category = 'general',
      group_name = 'general',
      description = '',
      is_public = false,
      sort_order = 0,
      validation_rules = null
    } = body;

    if (!key || value === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Key and value are required'
      }, { status: 400 });
    }

    const insertQuery = `
      INSERT INTO site_settings (
        key, value, type, category, group_name, description, 
        is_public, sort_order, validation_rules
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await env.ozmevsim_d1
      .prepare(insertQuery)
      .bind(
        key,
        String(value),
        type,
        category,
        group_name,
        description,
        is_public,
        sort_order,
        validation_rules ? JSON.stringify(validation_rules) : null
      )
      .run();

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error?.includes('UNIQUE') ? 'Setting key already exists' : 'Failed to create setting'
      }, { status: result.error?.includes('UNIQUE') ? 409 : 500 });
    }

    console.log('✅ Setting created:', key, '=', value);

    return NextResponse.json({
      success: true,
      data: {
        id: result.meta?.last_row_id,
        key,
        value,
        type,
        category,
        group_name,
        description,
        is_public,
        sort_order
      },
      message: 'Setting created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Settings create error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create setting'
    }, { status: 500 });
  }
}

// DELETE /api/settings?key=setting_key - Delete a setting
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({
        success: false,
        error: 'Setting key is required'
      }, { status: 400 });
    }

    const env = process.env as any;
    
    if (!env.ozmevsim_d1) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    const deleteQuery = 'DELETE FROM site_settings WHERE key = ?';
    
    const result = await env.ozmevsim_d1
      .prepare(deleteQuery)
      .bind(key)
      .run();

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete setting'
      }, { status: 500 });
    }

    if (result.changes === 0) {
      return NextResponse.json({
        success: false,
        error: 'Setting not found'
      }, { status: 404 });
    }

    console.log('✅ Setting deleted:', key);

    return NextResponse.json({
      success: true,
      data: { key, changes: result.changes },
      message: 'Setting deleted successfully'
    });

  } catch (error) {
    console.error('Settings delete error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete setting'
    }, { status: 500 });
  }
} 