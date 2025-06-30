import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering and edge runtime
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'İletişim API aktif',
      data: {
        phone: '0312 357 0600',
        email: 'info@ozmevsim.com',
        address: 'Ankara, Türkiye'
      }
    });
  } catch (error: any) {
    console.error('Contact GET API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'API erişim hatası'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, subject } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({
        success: false,
        error: 'İsim, e-posta ve mesaj alanları zorunludur'
      }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Geçerli bir e-posta adresi giriniz'
      }, { status: 400 });
    }

    // Log to console (since we're using static mode)
    console.log('📧 İletişim Formu:', {
      name,
      email,
      phone,
      subject: subject || 'Genel Bilgi',
      message,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Mesajınız alındı. En kısa sürede size dönüş yapacağız.',
      source: 'static'
    });

  } catch (error: any) {
    console.error('Contact POST API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyiniz.'
    }, { status: 500 });
  }
} 