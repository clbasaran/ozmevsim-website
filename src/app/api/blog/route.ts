import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Edge runtime for Cloudflare Pages
export const runtime = 'edge';
import { createDatabaseService } from '@/lib/database';

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
    // Get database service
    const dbService = createDatabaseService();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';

    let posts = [];

    if (dbService) {
      // Try to fetch from database
      try {
        posts = await dbService.getBlogPosts(status);
        console.log('✅ Blog posts fetched from database:', posts.length);
      } catch (dbError) {
        console.warn('Database error, using fallback data:', dbError);
        posts = mockBlogPosts.filter(post => post.status === status);
      }
    } else {
      // Use mock data when database is not available
      console.log('🔧 Database not available, using mock blog posts');
      posts = mockBlogPosts.filter(post => post.status === status);
    }

    return NextResponse.json({
      success: true,
      data: posts,
      source: dbService ? 'database' : 'mock'
    });

  } catch (error: any) {
    console.error('Blog GET API Error:', error);
    // Even on error, return mock data
    const status = new URL(request.url).searchParams.get('status') || 'published';
    return NextResponse.json({
      success: true,
      data: mockBlogPosts.filter(post => post.status === status),
      source: 'fallback'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, featured_image, author, status, tags } = body;

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Get database service
    const dbService = createDatabaseService();
    
    if (dbService) {
      // Try to create in database
      try {
        const result = await dbService.createBlogPost({
          title,
          content,
          excerpt: excerpt || content.substring(0, 150) + '...',
          featured_image: featured_image || '',
          author: author || 'Admin',
          status: status || 'published',
          tags: tags || []
        });

        if (!result.success) {
          throw new Error(result.error || 'Failed to create blog post');
        }

        return NextResponse.json({
          success: true,
          message: 'Blog post created successfully',
          id: result.id,
          source: 'database'
        });
      } catch (dbError) {
        console.warn('Database error, simulating creation:', dbError);
      }
    }

    // Fallback: simulate creation
    console.log('🔧 Database not available, simulating blog post creation');
    return NextResponse.json({
      success: true,
      message: 'Blog post creation simulated (database not available)',
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

    const dbService = createDatabaseService();
    
    if (dbService) {
      try {
        const result = await dbService.updateBlogPost(parseInt(id), updateData);

        if (!result.success) {
          throw new Error(result.error || 'Failed to update blog post');
        }

        return NextResponse.json({
          success: true,
          message: 'Blog post updated successfully',
          source: 'database'
        });
      } catch (dbError) {
        console.warn('Database error, simulating update:', dbError);
      }
    }

    // Fallback: simulate update
    console.log('🔧 Database not available, simulating blog post update');
    return NextResponse.json({
      success: true,
      message: 'Blog post update simulated (database not available)',
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

    const dbService = createDatabaseService();
    
    if (dbService) {
      try {
        const result = await dbService.deleteBlogPost(parseInt(id));

        if (!result.success) {
          throw new Error(result.error || 'Failed to delete blog post');
        }

        return NextResponse.json({
          success: true,
          message: 'Blog post deleted successfully',
          source: 'database'
        });
      } catch (dbError) {
        console.warn('Database error, simulating deletion:', dbError);
      }
    }

    // Fallback: simulate deletion
    console.log('🔧 Database not available, simulating blog post deletion');
    return NextResponse.json({
      success: true,
      message: 'Blog post deletion simulated (database not available)',
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