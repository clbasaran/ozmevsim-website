import { NextRequest, NextResponse } from 'next/server';

// Edge runtime for Cloudflare Pages
export const runtime = 'edge';
import { createDatabaseService } from '@/lib/database';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

// In-memory storage (in production, use a database)
let faqs: FAQ[] = [
  {
    id: '1',
    question: 'Kombi montajı ne kadar sürer?',
    answer: 'Standart bir kombi montajı genellikle 2-4 saat arasında tamamlanır. Bu süre, montaj yerinin hazırlık durumu, boru çekimi gerekliliği ve kombi tipine göre değişiklik gösterebilir.',
    category: 'Montaj',
    order: 1,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    question: 'Kombi bakımı ne sıklıkla yapılmalı?',
    answer: 'Kombinizin verimli çalışması ve uzun ömürlü olması için yılda en az bir kez profesyonel bakım yaptırmanız önerilir. Yoğun kullanım durumunda 6 ayda bir bakım yapılabilir.',
    category: 'Bakım',
    order: 2,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    question: 'Hangi kombi markası daha iyi?',
    answer: 'Vaillant, Bosch, Demirdöküm, Buderus gibi markalar kalite ve güvenilirlik açısından öne çıkar. Marka seçimi, bütçeniz, evinizin büyüklüğü ve ısıtma ihtiyacınıza göre değişir. Uzman ekibimiz size en uygun seçeneği önerebilir.',
    category: 'Ürün Seçimi',
    order: 3,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '4',
    question: 'Kombi arızaları için garanti süresi nedir?',
    answer: 'Yeni kombi satışlarında 2 yıl üretici garantisi, montaj işçiliğinde 1 yıl garanti sunuyoruz. Bakım ve onarım hizmetlerimizde ise 6 ay işçilik garantisi veriyoruz.',
    category: 'Garanti',
    order: 4,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '5',
    question: 'Acil durumlarda hizmet veriyor musunuz?',
    answer: 'Evet, 7/24 acil servis hizmeti sunuyoruz. Kombi arızaları, su kaçakları ve ısıtma sistemlerindeki acil durumlar için hızlı müdahale ekibimiz mevcuttur.',
    category: 'Hizmet',
    order: 5,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
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
    const status = searchParams.get('status') || 'active';

    // Fetch FAQs from D1
    const faqs = await dbService.getFAQs(status);

    return NextResponse.json({
      success: true,
      data: faqs
    });

  } catch (error: any) {
    console.error('FAQ GET API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, category, order_index, status } = body;

    // Validation
    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    // Get database service
    const dbService = createDatabaseService();
    if (!dbService) {
      throw new Error('Database not available');
    }

    // Create FAQ in D1
    const result = await dbService.createFAQ({
      question,
      answer,
      category: category || 'general',
      order_index: order_index || 0,
      status: status || 'active'
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to create FAQ');
    }

    return NextResponse.json({
      success: true,
      message: 'FAQ created successfully',
      id: result.id
    });

  } catch (error: any) {
    console.error('FAQ POST API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const faqIndex = faqs.findIndex(faq => faq.id === id);
    if (faqIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 }
      );
    }

    faqs[faqIndex] = {
      ...faqs[faqIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: faqs[faqIndex],
      message: 'FAQ updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update FAQ' },
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
        { success: false, error: 'FAQ ID is required' },
        { status: 400 }
      );
    }

    const faqIndex = faqs.findIndex(faq => faq.id === id);
    if (faqIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 }
      );
    }

    faqs.splice(faqIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
} 