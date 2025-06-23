import { NextRequest, NextResponse } from 'next/server';

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

const defaultSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Enerji Verimliliği',
    subtitle: 'Sürdürülebilir Gelecek',
    description: 'Çevre dostu çözümlerle %40\'a varan tasarruf ve sürdürülebilir enerji sistemleri.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop',
    ctaText: 'Danışmanlık Al',
    ctaLink: '/iletisim',
    active: true,
    order: 1
  },
  {
    id: 2,
    title: '25 Yıllık Deneyim',
    subtitle: 'Güvenilir Hizmet',
    description: 'Ankara\'da 25 yıldır kesintisiz hizmet veren uzman ekibimizle kaliteli çözümler.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&h=1080&fit=crop',
    ctaText: 'Hakkımızda',
    ctaLink: '/hakkimizda',
    active: true,
    order: 2
  },
  {
    id: 3,
    title: 'Premium Markalar',
    subtitle: 'Kaliteli Ürünler',
    description: 'Vaillant, Bosch, Demirdöküm gibi dünya markalarıyla güvenilir çözümler.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
    ctaText: 'Ürünlerimiz',
    ctaLink: '/urunler',
    active: true,
    order: 3
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: defaultSlides.filter(slide => slide.active).sort((a, b) => a.order - b.order),
      count: defaultSlides.length
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

    // In a real app, you would save to database
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Hero slide added successfully',
      data: { id: Date.now(), ...data }
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
    if (!env.DB) {
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

    await env.DB.prepare(`
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
      data.isActive !== undefined ? data.isActive : (data.is_active !== undefined ? data.is_active : true),
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
    if (!env.DB) {
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

    await env.DB.prepare(`
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