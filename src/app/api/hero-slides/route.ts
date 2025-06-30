import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  order: number;
}

// Global storage for development
let developmentSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Öz Mevsim Isı Sistemleri",
    subtitle: "Profesyonel Mühendislik Hizmetleri",
    description: "Ankara'da 15+ yıllık deneyimle kombi, klima ve ısı sistemi kurulum, bakım ve onarım hizmetleri.",
    image: "/images/kombi-montaj-hero.jpg",
    ctaText: "Hizmetlerimizi Keşfedin",
    ctaLink: "/hizmetler",
    active: true,
    order: 1
  },
  {
    id: 2,
    title: "Güvenilir Teknik Servis",
    subtitle: "7/24 Acil Müdahale",
    description: "Tüm marka kombi ve klima sistemleri için hızlı ve güvenilir teknik servis hizmeti.",
    image: "/images/kombi-montaj-hero.jpg",
    ctaText: "İletişime Geçin",
    ctaLink: "/iletisim",
    active: true,
    order: 2
  }
];

export async function GET(request: NextRequest) {
  try {
    const env = process.env as any;
    let slides: HeroSlide[] = [];
    let source = 'unknown';
    
    // Try to get from database first
    if (env.ozmevsim_d1) {
      try {
        console.log('🔄 Fetching hero slides from D1 database...');
        const result = await env.ozmevsim_d1.prepare(`
          SELECT * FROM hero_slides 
          WHERE is_active = 1 
          ORDER BY sort_order ASC, id ASC
        `).all();

        if (result.results && result.results.length > 0) {
          console.log('✅ Found hero slides in database:', result.results.length);
          
          // Transform database format to API format
          slides = result.results.map((row: any) => ({
            id: row.id,
            title: row.title,
            subtitle: row.subtitle,
            description: row.description,
            image: row.background_image,
            ctaText: row.primary_cta_text,
            ctaLink: row.primary_cta_href,
            active: row.is_active === 1,
            order: row.sort_order || 0
          }));
          
          source = 'database';
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    // Fallback to memory storage
    if (slides.length === 0) {
      slides = developmentSlides.filter(slide => slide.active);
      source = 'memory';
      console.log('🔧 Using memory storage for hero slides:', slides.length);
    }

    return NextResponse.json({ 
      success: true, 
      data: slides,
      count: slides.length,
      source: source
    });
  } catch (error) {
    console.error('Hero slides API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero slides' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const env = process.env as any;
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'subtitle', 'description'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const newSlide: HeroSlide = {
      id: Date.now(),
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      image: data.backgroundImage || data.background_image || data.image || '',
      ctaText: data.primaryCTA?.text || data.primary_cta_text || data.ctaText || '',
      ctaLink: data.primaryCTA?.href || data.primary_cta_href || data.ctaLink || '',
      active: data.isActive !== undefined ? data.isActive : data.active !== undefined ? data.active : true,
      order: data.sort_order || data.order || developmentSlides.length + 1
    };

    let savedToDatabase = false;

    // Save to database if available
    if (env.ozmevsim_d1) {
      try {
        console.log('💾 Saving new hero slide to D1 database...');
        
        const stats = Array.isArray(data.stats) ? JSON.stringify(data.stats) : '[]';
        const timestamp = new Date().toISOString();
        
        const result = await env.ozmevsim_d1.prepare(`
          INSERT INTO hero_slides (
            title, subtitle, description, background_image, stats,
            primary_cta_text, primary_cta_href, secondary_cta_text, secondary_cta_href,
            is_active, sort_order, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          newSlide.title,
          newSlide.subtitle,
          newSlide.description,
          newSlide.image,
          stats,
          newSlide.ctaText,
          newSlide.ctaLink,
          data.secondaryCTA?.text || data.secondary_cta_text || '',
          data.secondaryCTA?.href || data.secondary_cta_href || '',
          newSlide.active ? 1 : 0,
          newSlide.order,
          timestamp,
          timestamp
        ).run();

        console.log('✅ Hero slide saved to database with ID:', result.meta.last_row_id);
        newSlide.id = result.meta.last_row_id;
        savedToDatabase = true;
      } catch (dbError) {
        console.error('Database save error:', dbError);
      }
    }

    // Always add to memory storage for immediate access
    developmentSlides.push(newSlide);
    console.log('✅ Hero slide added to memory storage. Total slides:', developmentSlides.length);

    return NextResponse.json({ 
      success: true, 
      message: 'Hero slide added successfully',
      data: newSlide,
      source: savedToDatabase ? 'database+memory' : 'memory'
    });
  } catch (error) {
    console.error('Hero slides POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add hero slide' },
      { status: 500 }
    );
  }
}

// PUT - Update hero slide
export async function PUT(request: NextRequest) {
  try {
    const env = process.env as any;
    if (!env.ozmevsim_d1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available' 
      });
    }

    const data: any = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Hero slide ID is required' 
      });
    }

    // Stringify stats array
    const stats = Array.isArray(data.stats) ? JSON.stringify(data.stats) : data.stats || '[]';

    await env.ozmevsim_d1.prepare(`
      UPDATE hero_slides SET
        title = ?, subtitle = ?, description = ?, background_image = ?, stats = ?,
        primary_cta_text = ?, primary_cta_href = ?, secondary_cta_text = ?, secondary_cta_href = ?,
        is_active = ?, sort_order = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      data.title,
      data.subtitle,
      data.description || '',
      data.backgroundImage || data.background_image || '',
      stats,
      data.primaryCTA?.text || data.primary_cta_text || '',
      data.primaryCTA?.href || data.primary_cta_href || '',
      data.secondaryCTA?.text || data.secondary_cta_text || '',
      data.secondaryCTA?.href || data.secondary_cta_href || '',
      data.isActive !== undefined ? (data.isActive ? 1 : 0) : (data.is_active !== undefined ? data.is_active : 1),
      data.sort_order || 0,
      new Date().toISOString(),
      data.id
    ).run();

    return NextResponse.json({ 
      success: true, 
      data: data 
    });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update hero slide' 
    });
  }
}

// DELETE - Delete hero slide
export async function DELETE(request: NextRequest) {
  try {
    const env = process.env as any;
    if (!env.ozmevsim_d1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available' 
      });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Hero slide ID is required' 
      });
    }

    await env.ozmevsim_d1.prepare(`
      DELETE FROM hero_slides WHERE id = ?
    `).bind(id).run();

    return NextResponse.json({ 
      success: true, 
      message: 'Hero slide deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete hero slide' 
    });
  }
} 