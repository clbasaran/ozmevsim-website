import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

// Note: File uploads now redirected to R2 for Edge runtime compatibility
// This endpoint provides fallback information

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload request received - redirecting to R2 upload...');
    
    // In Edge runtime, redirect to R2 upload API
    return NextResponse.json({
      success: false,
      error: 'Please use /api/upload-r2 for file uploads in production',
      redirect: '/api/upload-r2'
    }, { status: 400 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Upload failed'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Use /api/upload-r2 for file uploads',
    endpoints: {
      upload: '/api/upload-r2',
      media: '/api/media'
    }
  });
} 