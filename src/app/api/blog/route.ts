import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'tips' | 'news' | 'technology' | 'maintenance';
  author: string;
  authorAvatar: string;
  publishDate: string;
  readTime: number;
  views: number;
  tags: string[];
  featuredImage: string;
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// Mock data for development
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Kombi Bakımının Önemi ve Yapılması Gerekenler',
    slug: 'kombi-bakiminin-onemi',
    excerpt: 'Kombinizin uzun ömürlü olması ve verimli çalışması için düzenli bakım şarttır. İşte bilmeniz gerekenler...',
    content: 'Kombi bakımı, ısıtma sisteminizin verimli çalışması için kritik öneme sahiptir...',
    category: 'maintenance',
    author: 'Öz Mevsim Teknik Ekip',
    authorAvatar: '/images/team/tech-team.jpg',
    publishDate: '2024-01-15',
    readTime: 5,
    views: 245,
    tags: ['kombi', 'bakım', 'enerji verimliliği'],
    featuredImage: '/images/blog/kombi-bakim.jpg',
    featured: true,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Yeni Nesil Kombi Teknolojileri',
    slug: 'yeni-nesil-kombi-teknolojileri',
    excerpt: 'Teknolojinin gelişmesiyle kombi sistemleri de evrimleşiyor. En son teknolojiler hakkında bilgi alın...',
    content: 'Modern kombi teknolojileri, enerji verimliliği ve kullanıcı konforu açısından büyük avantajlar sunuyor...',
    category: 'technology',
    author: 'Öz Mevsim Teknik Ekip',
    authorAvatar: '/images/team/tech-team.jpg',
    publishDate: '2024-01-10',
    readTime: 7,
    views: 189,
    tags: ['teknoloji', 'kombi', 'enerji'],
    featuredImage: '/images/blog/yeni-teknoloji.jpg',
    featured: false,
    status: 'published',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';

    // Edge runtime için database access
    const env = (globalThis as any).process?.env;
    let posts = mockBlogPosts.filter(post => post.status === status);

    // D1 database varsa kullan
    if (env?.ozmevsim_d1) {
      try {
        const { results } = await env.ozmevsim_d1.prepare(`
          SELECT * FROM blog_posts WHERE status = ? ORDER BY created_at DESC
        `).bind(status).all();
        
        if (results && results.length > 0) {
          posts = results;
        }
      } catch (dbError) {
        console.warn('Database error, using mock data:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      data: posts,
      source: env?.ozmevsim_d1 ? 'database' : 'mock'
    });

  } catch (error: any) {
    console.error('Blog GET API Error:', error);
    return NextResponse.json({
      success: true,
      data: mockBlogPosts.filter(post => post.status === 'published'),
      source: 'fallback'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, featured_image, author, status, tags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const env = (globalThis as any).process?.env;
    
    if (env?.ozmevsim_d1) {
      try {
        const result = await env.ozmevsim_d1.prepare(`
          INSERT INTO blog_posts (title, content, excerpt, featured_image, author, status, tags, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          title,
          content,
          excerpt || content.substring(0, 150) + '...',
          featured_image || '',
          author || 'Admin',
          status || 'published',
          JSON.stringify(tags || []),
          new Date().toISOString(),
          new Date().toISOString()
        ).run();

        return NextResponse.json({
          success: true,
          message: 'Blog post created successfully',
          id: result.meta.last_row_id,
          source: 'database'
        });
      } catch (dbError) {
        console.warn('Database error:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post creation simulated',
      id: Date.now(),
      source: 'mock'
    });

  } catch (error: any) {
    console.error('Blog POST API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const env = (globalThis as any).process?.env;
    
    if (env?.ozmevsim_d1) {
      try {
        const result = await env.ozmevsim_d1.prepare(`
          UPDATE blog_posts 
          SET title = ?, content = ?, excerpt = ?, author = ?, status = ?, updated_at = ?
          WHERE id = ?
        `).bind(
          updateData.title,
          updateData.content,
          updateData.excerpt,
          updateData.author,
          updateData.status,
          new Date().toISOString(),
          parseInt(id)
        ).run();

        return NextResponse.json({
          success: true,
          message: 'Blog post updated successfully',
          source: 'database'
        });
      } catch (dbError) {
        console.warn('Database error:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post update simulated',
      source: 'mock'
    });
  } catch (error: any) {
    console.error('Blog PUT API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const env = (globalThis as any).process?.env;
    
    if (env?.ozmevsim_d1) {
      try {
        const result = await env.ozmevsim_d1.prepare(`
          DELETE FROM blog_posts WHERE id = ?
        `).bind(parseInt(id)).run();

        return NextResponse.json({
          success: true,
          message: 'Blog post deleted successfully',
          source: 'database'
        });
      } catch (dbError) {
        console.warn('Database error:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deletion simulated',
      source: 'mock'
    });
  } catch (error: any) {
    console.error('Blog DELETE API Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
} 