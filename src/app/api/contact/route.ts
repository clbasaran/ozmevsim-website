import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering and edge runtime
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: [],
      source: 'static',
      count: 0,
      message: 'Contact messages endpoint ready'
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch messages',
        data: [],
        count: 0
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Name, email and message are required' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
      data: {
        id: Date.now(),
        name,
        email,
        phone: phone || '',
        message,
        created_at: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Contact POST Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Mesaj gönderilirken bir hata oluştu' 
      },
      { status: 500 }
    );
  }
} 