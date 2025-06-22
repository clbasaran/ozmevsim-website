import { NextRequest, NextResponse } from 'next/server';

// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({
        success: false,
        error: 'Key parameter required'
      }, { status: 400 });
    }

    // In a static export, we can't access KV here
    // So we'll return empty to fallback to localStorage
    return NextResponse.json({
      success: false,
      error: 'KV not available in static mode'
    }, { status: 404 });

  } catch (error) {
    console.error('KV GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { key, data } = await request.json();

    if (!key || !data) {
      return NextResponse.json({
        success: false,
        error: 'Key and data parameters required'
      }, { status: 400 });
    }

    // In a static export, we can't access KV here
    // So we'll return success to not break the flow
    return NextResponse.json({
      success: true,
      message: 'Data saved to localStorage only (static mode)'
    });

  } catch (error) {
    console.error('KV POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 