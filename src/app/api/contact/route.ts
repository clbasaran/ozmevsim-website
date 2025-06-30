import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering and edge runtime
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Memory storage for contact messages
let memoryStorage: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'unread';

    let messages = memoryStorage.filter(m => m.status === status);

    return NextResponse.json({
      success: true,
      data: messages,
      source: 'memory',
      count: messages.length
    });

  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Ad, email ve mesaj alanları zorunludur.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz.' },
        { status: 400 }
      );
    }

    const newMessage = {
      id: Date.now(),
      name,
      email,
      phone: phone || '',
      subject: subject || 'Genel Sorgu',
      message,
      status: 'unread',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryStorage.push(newMessage);

    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
      data: newMessage,
      source: 'memory'
    });

  } catch (error: any) {
    console.error('Contact POST Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const inquiryIndex = memoryStorage.findIndex(inquiry => inquiry.id === id);
    if (inquiryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    memoryStorage[inquiryIndex] = {
      ...memoryStorage[inquiryIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: memoryStorage[inquiryIndex],
      message: 'Inquiry updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update inquiry' },
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
        { success: false, error: 'Inquiry ID is required' },
        { status: 400 }
      );
    }

    const inquiryIndex = memoryStorage.findIndex(inquiry => inquiry.id === id);
    if (inquiryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    memoryStorage.splice(inquiryIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
} 