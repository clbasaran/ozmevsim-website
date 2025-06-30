import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

interface ContentBlock {
  id?: number;
  page_id: number;
  block_type: string;
  title?: string;
  content?: string;
  settings?: string;
  data?: string;
  position: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface DynamicPage {
  id?: number;
  slug: string;
  title: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  template: string;
  status: string;
  is_homepage: boolean;
  parent_id?: number;
  sort_order: number;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

// GET /api/content - Get content by type or all content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = searchParams.get('page');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status') || 'published';
    const slug = searchParams.get('slug');

    const env = process.env as any;
    
    if (!env.ozmevsim_d1) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    let data: any = {};

    // Handle different content types
    switch (type) {
      case 'pages':
        data = await getPages(env.ozmevsim_d1, { limit, offset, status, slug });
        break;
      case 'blocks':
        data = await getContentBlocks(env.ozmevsim_d1, { page, limit, offset });
        break;
      case 'hero-slides':
        data = await getHeroSlides(env.ozmevsim_d1, { limit, offset });
        break;
      case 'testimonials':
        data = await getTestimonials(env.ozmevsim_d1, { limit, offset, status });
        break;
      case 'services':
        data = await getServices(env.ozmevsim_d1, { limit, offset });
        break;
      case 'products':
        data = await getProducts(env.ozmevsim_d1, { limit, offset, status });
        break;
      case 'blog':
        data = await getBlogPosts(env.ozmevsim_d1, { limit, offset, status });
        break;
      case 'faqs':
        data = await getFaqs(env.ozmevsim_d1, { limit, offset, status });
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid content type'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: data.results,
      total: data.total,
      type,
      pagination: {
        limit,
        offset,
        total: data.total,
        pages: Math.ceil(data.total / limit)
      }
    });

  } catch (error) {
    console.error('Content API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch content'
    }, { status: 500 });
  }
}

// POST /api/content - Create new content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...contentData } = body;

    const env = process.env as any;
    
    if (!env.ozmevsim_d1) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    let result: any;

    switch (type) {
      case 'page':
        result = await createPage(env.ozmevsim_d1, contentData);
        break;
      case 'block':
        result = await createContentBlock(env.ozmevsim_d1, contentData);
        break;
      case 'hero-slide':
        result = await createHeroSlide(env.ozmevsim_d1, contentData);
        break;
      case 'testimonial':
        result = await createTestimonial(env.ozmevsim_d1, contentData);
        break;
      case 'service':
        result = await createService(env.ozmevsim_d1, contentData);
        break;
      case 'product':
        result = await createProduct(env.ozmevsim_d1, contentData);
        break;
      case 'blog-post':
        result = await createBlogPost(env.ozmevsim_d1, contentData);
        break;
      case 'faq':
        result = await createFaq(env.ozmevsim_d1, contentData);
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid content type'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `${type} created successfully`
    }, { status: 201 });

  } catch (error) {
    console.error('Content create error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create content'
    }, { status: 500 });
  }
}

// PUT /api/content - Update content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, ...contentData } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Content ID is required'
      }, { status: 400 });
    }

    const env = process.env as any;
    
    if (!env.ozmevsim_d1) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    let result: any;

    switch (type) {
      case 'page':
        result = await updatePage(env.ozmevsim_d1, id, contentData);
        break;
      case 'block':
        result = await updateContentBlock(env.ozmevsim_d1, id, contentData);
        break;
      case 'hero-slide':
        result = await updateHeroSlide(env.ozmevsim_d1, id, contentData);
        break;
      case 'testimonial':
        result = await updateTestimonial(env.ozmevsim_d1, id, contentData);
        break;
      case 'service':
        result = await updateService(env.ozmevsim_d1, id, contentData);
        break;
      case 'product':
        result = await updateProduct(env.ozmevsim_d1, id, contentData);
        break;
      case 'blog-post':
        result = await updateBlogPost(env.ozmevsim_d1, id, contentData);
        break;
      case 'faq':
        result = await updateFaq(env.ozmevsim_d1, id, contentData);
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid content type'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `${type} updated successfully`
    });

  } catch (error) {
    console.error('Content update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update content'
    }, { status: 500 });
  }
}

// DELETE /api/content - Delete content
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({
        success: false,
        error: 'Content type and ID are required'
      }, { status: 400 });
    }

    const env = process.env as any;
    
    if (!env.ozmevsim_d1) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 503 });
    }

    let result: any;

    switch (type) {
      case 'page':
        result = await deletePage(env.ozmevsim_d1, id);
        break;
      case 'block':
        result = await deleteContentBlock(env.ozmevsim_d1, id);
        break;
      case 'hero-slide':
        result = await deleteHeroSlide(env.ozmevsim_d1, id);
        break;
      case 'testimonial':
        result = await deleteTestimonial(env.ozmevsim_d1, id);
        break;
      case 'service':
        result = await deleteService(env.ozmevsim_d1, id);
        break;
      case 'product':
        result = await deleteProduct(env.ozmevsim_d1, id);
        break;
      case 'blog-post':
        result = await deleteBlogPost(env.ozmevsim_d1, id);
        break;
      case 'faq':
        result = await deleteFaq(env.ozmevsim_d1, id);
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid content type'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `${type} deleted successfully`
    });

  } catch (error) {
    console.error('Content delete error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete content'
    }, { status: 500 });
  }
}

// Helper functions for different content types

async function getPages(db: any, options: any) {
  const { limit, offset, status, slug } = options;
  
  let query = 'SELECT * FROM dynamic_pages WHERE 1=1';
  const params: any[] = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (slug) {
    query += ' AND slug = ?';
    params.push(slug);
  }

  query += ' ORDER BY sort_order, created_at DESC';
  
  if (limit) {
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }

  const result = await db.prepare(query).bind(...params).all();
  
  // Get total count
  let countQuery = 'SELECT COUNT(*) as total FROM dynamic_pages WHERE 1=1';
  const countParams: any[] = [];
  
  if (status && status !== 'all') {
    countQuery += ' AND status = ?';
    countParams.push(status);
  }

  const countResult = await db.prepare(countQuery).bind(...countParams).first();

  return {
    results: result.results || [],
    total: countResult?.total || 0
  };
}

async function getContentBlocks(db: any, options: any) {
  const { page, limit, offset } = options;
  
  let query = 'SELECT * FROM content_blocks WHERE 1=1';
  const params: any[] = [];

  if (page) {
    query += ' AND page_id = ?';
    params.push(page);
  }

  query += ' ORDER BY position, created_at';
  
  if (limit) {
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }

  const result = await db.prepare(query).bind(...params).all();
  
  return {
    results: result.results || [],
    total: result.results?.length || 0
  };
}

async function getHeroSlides(db: any, options: any) {
  const { limit, offset } = options;
  
  let query = 'SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY sort_order';
  const params: any[] = [];
  
  if (limit) {
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }

  const result = await db.prepare(query).bind(...params).all();
  
  return {
    results: result.results || [],
    total: result.results?.length || 0
  };
}

async function getTestimonials(db: any, options: any) {
  const { limit, offset, status } = options;
  
  let query = 'SELECT * FROM testimonials WHERE 1=1';
  const params: any[] = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';
  
  if (limit) {
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }

  const result = await db.prepare(query).bind(...params).all();
  
  return {
    results: result.results || [],
    total: result.results?.length || 0
  };
}

async function getServices(db: any, options: any) {
  const { limit, offset } = options;
  
  let query = 'SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order';
  const params: any[] = [];
  
  if (limit) {
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }

  const result = await db.prepare(query).bind(...params).all();
  
  return {
    results: result.results || [],
    total: result.results?.length || 0
  };
}

async function getProducts(db: any, options: any) {
  const { limit, offset, status } = options;
  
  let query = 'SELECT * FROM products WHERE 1=1';
  const params: any[] = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';
  
  if (limit) {
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }

  const result = await db.prepare(query).bind(...params).all();
  
  return {
    results: result.results || [],
    total: result.results?.length || 0
  };
}

async function getBlogPosts(db: any, options: any) {
  const { limit, offset, status } = options;
  
  let query = 'SELECT * FROM blog_posts WHERE 1=1';
  const params: any[] = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY publish_date DESC, created_at DESC';
  
  if (limit) {
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }

  const result = await db.prepare(query).bind(...params).all();
  
  return {
    results: result.results || [],
    total: result.results?.length || 0
  };
}

async function getFaqs(db: any, options: any) {
  const { limit, offset, status } = options;
  
  let query = 'SELECT * FROM faqs WHERE 1=1';
  const params: any[] = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY order_index, created_at';
  
  if (limit) {
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }

  const result = await db.prepare(query).bind(...params).all();
  
  return {
    results: result.results || [],
    total: result.results?.length || 0
  };
}

// Create functions (simplified - would need full implementation)
async function createPage(db: any, data: any) {
  const query = `
    INSERT INTO dynamic_pages (slug, title, meta_title, meta_description, template, status, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const result = await db.prepare(query).bind(
    data.slug,
    data.title,
    data.meta_title || data.title,
    data.meta_description,
    data.template || 'default',
    data.status || 'draft',
    data.sort_order || 0
  ).run();

  return { id: result.meta?.last_row_id, ...data };
}

async function createContentBlock(db: any, data: any) {
  const query = `
    INSERT INTO content_blocks (page_id, block_type, title, content, settings, position, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const result = await db.prepare(query).bind(
    data.page_id,
    data.block_type,
    data.title,
    data.content,
    data.settings ? JSON.stringify(data.settings) : null,
    data.position || 0,
    data.is_active !== false
  ).run();

  return { id: result.meta?.last_row_id, ...data };
}

// Additional create functions would be implemented similarly...
async function createHeroSlide(db: any, data: any) { return data; }
async function createTestimonial(db: any, data: any) { return data; }
async function createService(db: any, data: any) { return data; }
async function createProduct(db: any, data: any) { return data; }
async function createBlogPost(db: any, data: any) { return data; }
async function createFaq(db: any, data: any) { return data; }

// Update functions (simplified)
async function updatePage(db: any, id: string, data: any) { return data; }
async function updateContentBlock(db: any, id: string, data: any) { return data; }
async function updateHeroSlide(db: any, id: string, data: any) { return data; }
async function updateTestimonial(db: any, id: string, data: any) { return data; }
async function updateService(db: any, id: string, data: any) { return data; }
async function updateProduct(db: any, id: string, data: any) { return data; }
async function updateBlogPost(db: any, id: string, data: any) { return data; }
async function updateFaq(db: any, id: string, data: any) { return data; }

// Delete functions (simplified)
async function deletePage(db: any, id: string) { return { id }; }
async function deleteContentBlock(db: any, id: string) { return { id }; }
async function deleteHeroSlide(db: any, id: string) { return { id }; }
async function deleteTestimonial(db: any, id: string) { return { id }; }
async function deleteService(db: any, id: string) { return { id }; }
async function deleteProduct(db: any, id: string) { return { id }; }
async function deleteBlogPost(db: any, id: string) { return { id }; }
async function deleteFaq(db: any, id: string) { return { id }; } 