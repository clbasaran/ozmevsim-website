import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Default for development
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    console.log('🔐 Admin login attempt');

    if (!password) {
      return NextResponse.json({
        success: false,
        error: 'Şifre gerekli'
      }, { status: 400 });
    }

    // Simple password check (in production, use hashed passwords)
    if (password === ADMIN_PASSWORD) {
      // Generate JWT token
      const token = jwt.sign(
        { 
          admin: true, 
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        },
        JWT_SECRET
      );

      console.log('✅ Admin login successful');

      return NextResponse.json({
        success: true,
        token: token,
        message: 'Giriş başarılı'
      });
    } else {
      console.log('❌ Admin login failed - wrong password');
      return NextResponse.json({
        success: false,
        error: 'Geçersiz şifre'
      }, { status: 401 });
    }

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
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'Token gerekli'
      }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (decoded.admin) {
        console.log('✅ Admin token verified');
        return NextResponse.json({
          success: true,
          authenticated: true,
          admin: true
        });
      } else {
        return NextResponse.json({
          success: false,
          authenticated: false,
          error: 'Invalid token'
        }, { status: 401 });
      }
    } catch (jwtError) {
      console.log('❌ Invalid or expired token');
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'Token geçersiz veya süresi dolmuş'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Admin auth verify error:', error);
    return NextResponse.json({
      success: false,
      authenticated: false,
      error: 'Sunucu hatası'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🚪 Admin logout');
    
    // For logout, we just return success. 
    // Client-side will remove the token from localStorage
    return NextResponse.json({
      success: true,
      message: 'Çıkış başarılı'
    });

  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json({
      success: false,
      error: 'Çıkış hatası'
    }, { status: 500 });
  }
} 