import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    // Get database service
    const dbService = createDatabaseService();
    if (!dbService) {
      throw new Error('Database not available');
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';

    // Fetch blog posts from D1
    const posts = await dbService.getBlogPosts(status);

    return NextResponse.json({
      success: true,
      data: posts
    });

  } catch (error: any) {
    console.error('Blog GET API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
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
    if (!dbService) {
      throw new Error('Database not available');
    }

    // Create blog post in D1
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
      id: result.id
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
    if (!dbService) {
      throw new Error('Database not available');
    }

    const result = await dbService.updateBlogPost(parseInt(id), updateData);

    if (!result.success) {
      throw new Error(result.error || 'Failed to update blog post');
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully'
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
    if (!dbService) {
      throw new Error('Database not available');
    }

    const result = await dbService.deleteBlogPost(parseInt(id));

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete blog post');
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error: any) {
    console.error('Blog DELETE API Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
} 