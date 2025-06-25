// Blog API for Cloudflare Pages Functions

const blogPosts = [
  {
    id: '1',
    title: 'Kış Aylarında Kombi Verimliliğini Artırmanın 10 Yolu',
    slug: 'kis-aylarinda-kombi-verimliligini-artirmanin-10-yolu',
    excerpt: 'Soğuk kış aylarında enerji faturalarınızı düşürürken evinizi sıcak tutmanın pratik yollarını keşfedin.',
    content: 'Kış aylarında artan doğalgaz faturaları ailelerin en büyük endişelerinden biri. İşte kombi verimliliğinizi artırarak hem tasarruf edebileceğiniz hem de çevreyi koruyabileceğiniz 10 etkili yöntem...',
    category: 'tips',
    author: 'Murat Özkan',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    publishDate: '2024-03-15',
    readTime: 8,
    views: 1250,
    tags: ['enerji tasarrufu', 'kombi', 'kış bakımı', 'verimlilik'],
    featuredImage: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&h=400&fit=crop',
    featured: true,
    status: 'published',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Yeni Nesil Akıllı Termostat Teknolojileri',
    slug: 'yeni-nesil-akilli-termostat-teknolojileri',
    excerpt: 'IoT destekli akıllı termostatlarla evinizin ısıtma sistemini nasıl optimize edebileceğinizi öğrenin.',
    content: 'Teknolojinin hızla gelişmesiyle birlikte ev ısıtma sistemleri de akıllanıyor. Yeni nesil akıllı termostatlar...',
    category: 'technology',
    author: 'Ayşe Demir',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    publishDate: '2024-03-12',
    readTime: 6,
    views: 890,
    tags: ['akıllı sistem', 'termostat', 'IoT', 'teknoloji'],
    featuredImage: 'https://images.unsplash.com/photo-1558618666-fbd25c85cd64?w=600&h=400&fit=crop',
    featured: false,
    status: 'published',
    createdAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-03-12T10:00:00Z'
  }
];

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
    if (request.method === 'GET') {
      // Try D1 first, fallback to static data
      try {
        const category = url.searchParams.get('category');
        const status = url.searchParams.get('status') || 'published';
        const featured = url.searchParams.get('featured');

        let query = 'SELECT * FROM blog_posts WHERE status = ?';
        let params = [status];

        if (category && category !== 'all') {
          query += ' AND category = ?';
          params.push(category);
        }

        if (featured === 'true') {
          query += ' AND featured = 1';
        }

        query += ' ORDER BY created_at DESC';

        const stmt = env.ozmevsim_d1.prepare(query);
        const { results } = await stmt.bind(...params).all();

        // Parse JSON fields
        const processedPosts = results.map(post => ({
          ...post,
          tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : (post.tags || []),
          featured: Boolean(post.featured)
        }));

        return new Response(JSON.stringify({
          success: true,
          data: processedPosts,
          total: processedPosts.length
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });

      } catch (dbError) {
        console.log('D1 not available, using static data:', dbError);
        
        // Fallback to static data
        const blogPosts = [
          {
            id: '1',
            title: 'Kış Aylarında Kombi Verimliliğini Artırmanın 10 Yolu',
            slug: 'kis-aylarinda-kombi-verimliligini-artirmanin-10-yolu',
            excerpt: 'Soğuk kış aylarında enerji faturalarınızı düşürürken evinizi sıcak tutmanın pratik yollarını keşfedin.',
            content: 'Kış aylarında artan doğalgaz faturaları ailelerin en büyük endişelerinden biri. İşte kombi verimliliğinizi artırarak hem tasarruf edebileceğiniz hem de çevreyi koruyabileceğiniz 10 etkili yöntem...',
            category: 'tips',
            author: 'Murat Özkan',
            authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            publishDate: '2024-03-15',
            readTime: 8,
            views: 1250,
            tags: ['enerji tasarrufu', 'kombi', 'kış bakımı', 'verimlilik'],
            featuredImage: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&h=400&fit=crop',
            featured: true,
            status: 'published',
            createdAt: '2024-03-15T10:00:00Z',
            updatedAt: '2024-03-15T10:00:00Z'
          },
          {
            id: '2',
            title: 'Yeni Nesil Akıllı Termostat Teknolojileri',
            slug: 'yeni-nesil-akilli-termostat-teknolojileri',
            excerpt: 'IoT destekli akıllı termostatlarla evinizin ısıtma sistemini nasıl optimize edebileceğinizi öğrenin.',
            content: 'Teknolojinin hızla gelişmesiyle birlikte ev ısıtma sistemleri de akıllanıyor. Yeni nesil akıllı termostatlar...',
            category: 'technology',
            author: 'Ayşe Demir',
            authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            publishDate: '2024-03-12',
            readTime: 6,
            views: 890,
            tags: ['akıllı sistem', 'termostat', 'IoT', 'teknoloji'],
            featuredImage: 'https://images.unsplash.com/photo-1558618666-fbd25c85cd64?w=600&h=400&fit=crop',
            featured: false,
            status: 'published',
            createdAt: '2024-03-12T10:00:00Z',
            updatedAt: '2024-03-12T10:00:00Z'
          }
        ];

      const category = url.searchParams.get('category');
      const status = url.searchParams.get('status');
      const featured = url.searchParams.get('featured');

      let filteredPosts = [...blogPosts];

      if (category && category !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }

      if (status && status !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.status === status);
      }

      if (featured === 'true') {
        filteredPosts = filteredPosts.filter(post => post.featured);
      }

      return new Response(JSON.stringify({
        success: true,
        data: filteredPosts,
        total: filteredPosts.length
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    } else if (request.method === 'POST') {
      const body = await request.json();
      const { 
        title, 
        slug, 
        excerpt, 
        content, 
        category, 
        author, 
        publishDate, 
        readTime, 
        tags, 
        featuredImage,
        featured,
        status 
      } = body;

      // Validation
      if (!title || !content) {
        return new Response(JSON.stringify({
          error: 'Title and content are required'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Generate slug if not provided
      const postSlug = slug || title.toLowerCase()
        .replace(/[^a-z0-9ğüşıöç\s]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');

      // Create blog post in D1
      const stmt = env.ozmevsim_d1.prepare(`
        INSERT INTO blog_posts (
          title, slug, excerpt, content, category, author, 
          publish_date, read_time, tags, featured_image, 
          featured, status, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `);

      const result = await stmt.bind(
        title,
        postSlug,
        excerpt || '',
        content,
        category || 'general',
        author || 'Admin',
        publishDate || new Date().toISOString().split('T')[0],
        readTime || 5,
        JSON.stringify(tags || []),
        featuredImage || '',
        featured ? 1 : 0,
        status || 'published'
      ).run();

      if (!result.success) {
        throw new Error('Failed to create blog post');
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Blog post created successfully',
        id: result.meta.last_row_id
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } else if (request.method === 'PUT') {
      const body = await request.json();
      const { 
        id, 
        title, 
        slug, 
        excerpt, 
        content, 
        category, 
        author, 
        publishDate, 
        readTime, 
        tags, 
        featuredImage,
        featured,
        status 
      } = body;

      if (!id) {
        return new Response(JSON.stringify({
          error: 'Blog post ID is required'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Update blog post in D1
      const stmt = env.ozmevsim_d1.prepare(`
        UPDATE blog_posts 
        SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, 
            author = ?, publish_date = ?, read_time = ?, tags = ?, 
            featured_image = ?, featured = ?, status = ?, updated_at = datetime('now')
        WHERE id = ?
      `);

      const result = await stmt.bind(
        title,
        slug,
        excerpt || '',
        content,
        category || 'general',
        author || 'Admin',
        publishDate || new Date().toISOString().split('T')[0],
        readTime || 5,
        JSON.stringify(tags || []),
        featuredImage || '',
        featured ? 1 : 0,
        status || 'published',
        id
      ).run();

      if (!result.success) {
        throw new Error('Failed to update blog post');
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Blog post updated successfully'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } else if (request.method === 'DELETE') {
      const body = await request.json();
      const { id } = body;

      if (!id) {
        return new Response(JSON.stringify({
          error: 'Blog post ID is required'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Delete blog post from D1
      const stmt = env.ozmevsim_d1.prepare('DELETE FROM blog_posts WHERE id = ?');
      const result = await stmt.bind(id).run();

      if (!result.success) {
        throw new Error('Failed to delete blog post');
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Blog post deleted successfully'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } else {
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
    }

  } catch (error) {
    console.error('Blog API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
} 