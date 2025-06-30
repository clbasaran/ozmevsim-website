import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

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

    // Development mode - simple password check
    if (process.env.NODE_ENV === 'development') {
      // Accept any password in development
      const token = 'dev-admin-token-' + Date.now();
      
      console.log('🔑 Development login successful with password:', password);
      
      return NextResponse.json({
        success: true,
        token: token,
        message: 'Giriş başarılı (Development Mode)'
      });
    }

    // Production mode - forward to Cloudflare Function
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://2c88a784.ozmevsim-website.pages.dev';
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

    // Development mode - simple token check
    if (process.env.NODE_ENV === 'development') {
      // Accept any dev token in development
      if (authHeader.includes('dev-admin-token')) {
        console.log('🔑 Development token verified:', authHeader);
        return NextResponse.json({
          success: true,
          authenticated: true,
          user: { role: 'admin', name: 'Dev Admin' }
        });
      }
    }

    // Production mode - forward to Cloudflare Function
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://2c88a784.ozmevsim-website.pages.dev';
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