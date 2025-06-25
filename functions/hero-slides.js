// Cloudflare Functions API for hero slides
export async function onRequestGet(context) {
  try {
    const { env } = context;
    
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
          const slides = result.results.map(slide => ({
            id: slide.id,
            title: slide.title,
            subtitle: slide.subtitle,
            description: slide.description,
            image: slide.background_image,
            ctaText: slide.primary_cta_text,
            ctaLink: slide.primary_cta_href,
            active: slide.is_active === 1,
            order: slide.sort_order || 0
          }));

          return Response.json({
            success: true,
            data: slides,
            count: slides.length,
            source: 'database'
          });
        }
      } catch (error) {
        console.error('Database error:', error);
      }
    }

    return Response.json({
      success: false,
      error: 'Database not available',
      data: [],
      count: 0,
      source: 'none'
    }, { status: 503 });

  } catch (error) {
    console.error('Hero slides API error:', error);
    return Response.json({
      success: false,
      error: 'Failed to fetch hero slides'
    }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const slideData = await request.json();

    // Validation
    for (const field of ['title', 'subtitle', 'description']) {
      if (!slideData[field]) {
        return Response.json({
          success: false,
          error: `${field} is required`
        }, { status: 400 });
      }
    }

    if (env.ozmevsim_d1) {
      try {
        console.log('💾 Saving new hero slide to D1 database...');
        const stats = Array.isArray(slideData.stats) ? JSON.stringify(slideData.stats) : '[]';
        const now = new Date().toISOString();

        const result = await env.ozmevsim_d1.prepare(`
          INSERT INTO hero_slides (
            title, subtitle, description, background_image, stats,
            primary_cta_text, primary_cta_href, secondary_cta_text, secondary_cta_href,
            is_active, sort_order, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          slideData.title,
          slideData.subtitle,
          slideData.description || '',
          slideData.backgroundImage || slideData.background_image || '',
          stats,
          slideData.primaryCTA?.text || slideData.primary_cta_text || '',
          slideData.primaryCTA?.href || slideData.primary_cta_href || '',
          slideData.secondaryCTA?.text || slideData.secondary_cta_text || '',
          slideData.secondaryCTA?.href || slideData.secondary_cta_href || '',
          slideData.isActive !== undefined ? (slideData.isActive ? 1 : 0) : 1,
          slideData.sort_order || 0,
          now,
          now
        ).run();

        console.log('✅ Hero slide saved to database with ID:', result.meta.last_row_id);
        return Response.json({
          success: true,
          message: 'Hero slide added successfully to database',
          data: {
            id: result.meta.last_row_id,
            ...slideData,
            created_at: now
          }
        });
      } catch (error) {
        console.error('Database save error:', error);
      }
    }

    return Response.json({
      success: true,
      message: 'Hero slide added successfully (no database)',
      data: {
        id: Date.now(),
        ...slideData
      }
    });
  } catch (error) {
    console.error('Hero slides POST error:', error);
    return Response.json({
      success: false,
      error: 'Failed to add hero slide'
    }, { status: 500 });
  }
}

export async function onRequestPut(context) {
  try {
    const { env, request } = context;
    
    if (!env.ozmevsim_d1) {
      return Response.json({
        success: false,
        error: 'Database not available'
      });
    }

    const slideData = await request.json();
    if (!slideData.id) {
      return Response.json({
        success: false,
        error: 'Hero slide ID is required'
      });
    }

    const stats = Array.isArray(slideData.stats) ? JSON.stringify(slideData.stats) : slideData.stats || '[]';

    await env.ozmevsim_d1.prepare(`
      UPDATE hero_slides SET
        title = ?, subtitle = ?, description = ?, background_image = ?, stats = ?,
        primary_cta_text = ?, primary_cta_href = ?, secondary_cta_text = ?, secondary_cta_href = ?,
        is_active = ?, sort_order = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      slideData.title,
      slideData.subtitle,
      slideData.description || '',
      slideData.backgroundImage || slideData.background_image || '',
      stats,
      slideData.primaryCTA?.text || slideData.primary_cta_text || '',
      slideData.primaryCTA?.href || slideData.primary_cta_href || '',
      slideData.secondaryCTA?.text || slideData.secondary_cta_text || '',
      slideData.secondaryCTA?.href || slideData.secondary_cta_href || '',
      slideData.isActive !== undefined ? (slideData.isActive ? 1 : 0) : slideData.is_active !== undefined ? slideData.is_active : 1,
      slideData.sort_order || 0,
      new Date().toISOString(),
      slideData.id
    ).run();

    return Response.json({
      success: true,
      data: slideData
    });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return Response.json({
      success: false,
      error: 'Failed to update hero slide'
    });
  }
}

export async function onRequestDelete(context) {
  try {
    const { env, request } = context;
    
    if (!env.ozmevsim_d1) {
      return Response.json({
        success: false,
        error: 'Database not available'
      });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return Response.json({
        success: false,
        error: 'Hero slide ID is required'
      });
    }

    await env.ozmevsim_d1.prepare(`
      DELETE FROM hero_slides WHERE id = ?
    `).bind(id).run();

    return Response.json({
      success: true,
      message: 'Hero slide deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return Response.json({
      success: false,
      error: 'Failed to delete hero slide'
    });
  }
} 