import { NextRequest, NextResponse } from 'next/server';

// Edge runtime for Cloudflare Pages
export const runtime = 'edge';
import { createDatabaseService } from '@/lib/database';

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  service?: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'closed';
  source: 'website' | 'phone' | 'email' | 'referral';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// In-memory storage (in production, use a database)
let inquiries: ContactInquiry[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '0532 123 45 67',
    subject: 'Kombi Montajı',
    message: 'Yeni aldığım kombiyi monte ettirmek istiyorum. Ne zaman gelebilirsiniz?',
    service: 'Kombi Montajı',
    urgency: 'medium',
    status: 'new',
    source: 'website',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Zeynep Kaya',
    email: 'zeynep@example.com',
    phone: '0533 987 65 43',
    subject: 'Acil Kombi Arızası',
    message: 'Kombinim çalışmıyor, evde sıcak su yok. Acil müdahale gerekiyor.',
    service: 'Kombi Onarımı',
    urgency: 'urgent',
    status: 'contacted',
    source: 'website',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    notes: 'Müşteri ile görüşüldü, bugün saat 14:00\'te randevu verildi.'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Get database service
    const dbService = createDatabaseService();
    if (!dbService) {
      throw new Error('Database not available');
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;

    // Fetch contact messages from D1
    const messages = await dbService.getContactMessages(status);

    return NextResponse.json({
      success: true,
      data: messages
    });

  } catch (error: any) {
    console.error('Contact GET API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
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
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Get database service
    const dbService = createDatabaseService();
    if (!dbService) {
      throw new Error('Database not available');
    }

    // Save contact message to D1
    const result = await dbService.createContactMessage({
      name,
      email,
      phone: phone || '',
      subject: subject || '',
      message
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to save message');
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      id: result.id
    });

  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const inquiryIndex = inquiries.findIndex(inquiry => inquiry.id === id);
    if (inquiryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    inquiries[inquiryIndex] = {
      ...inquiries[inquiryIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: inquiries[inquiryIndex],
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

    const inquiryIndex = inquiries.findIndex(inquiry => inquiry.id === id);
    if (inquiryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    inquiries.splice(inquiryIndex, 1);

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