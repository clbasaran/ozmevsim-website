import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({
        success: false,
        error: 'Şifre gerekli'
      }, { status: 400 });
    }

    // Forward to Cloudflare Function
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://35552196.ozmevsim-website.pages.dev';
    const response = await fetch(`${baseUrl}/api/admin-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password })
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });

  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'Token gerekli'
      }, { status: 401 });
    }

    // Forward to Cloudflare Function
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://35552196.ozmevsim-website.pages.dev';
    const response = await fetch(`${baseUrl}/api/admin-auth`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      }
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });

  } catch (error) {
    console.error('Admin auth verify error:', error);
    return NextResponse.json({
      success: false,
      authenticated: false,
      error: 'Sunucu hatası'
    }, { status: 500 });
  }
} 