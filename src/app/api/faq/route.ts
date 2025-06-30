import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
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
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';

    let faqData = [];

    if (dbService) {
      // Try to fetch from database
      try {
        faqData = await dbService.getFAQs(status);
        console.log('✅ FAQs fetched from database:', faqData.length);
      } catch (dbError) {
        console.warn('Database error, using fallback data:', dbError);
        faqData = faqs.filter(faq => faq.status === 'published');
      }
    } else {
      // Use mock data when database is not available
      console.log('🔧 Database not available, using mock FAQs');
      faqData = faqs.filter(faq => faq.status === 'published');
    }

    return NextResponse.json({
      success: true,
      data: faqData,
      source: dbService ? 'database' : 'mock'
    });

  } catch (error: any) {
    console.error('FAQ GET API Error:', error);
    // Even on error, return mock data
    return NextResponse.json({
      success: true,
      data: faqs.filter(faq => faq.status === 'published'),
      source: 'fallback'
    });
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
    
    if (dbService) {
      // Try to create in database
      try {
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
          id: result.id,
          source: 'database'
        });
      } catch (dbError) {
        console.warn('Database error, simulating creation:', dbError);
      }
    }

    // Fallback: simulate creation
    console.log('🔧 Database not available, simulating FAQ creation');
    return NextResponse.json({
      success: true,
      message: 'FAQ creation simulated (database not available)',
      id: Date.now(),
      source: 'mock'
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'FAQ ID is required' },
        { status: 400 }
      );
    }

    const dbService = createDatabaseService();
    
    if (dbService) {
      try {
        const result = await dbService.updateFAQ(parseInt(id), updateData);

        if (!result.success) {
          throw new Error(result.error || 'Failed to update FAQ');
        }

        return NextResponse.json({
          success: true,
          message: 'FAQ updated successfully',
          source: 'database'
        });
      } catch (dbError) {
        console.warn('Database error, simulating update:', dbError);
      }
    }

    // Fallback: simulate update
    console.log('🔧 Database not available, simulating FAQ update');
    return NextResponse.json({
      success: true,
      message: 'FAQ update simulated (database not available)',
      source: 'mock'
    });
  } catch (error: any) {
    console.error('FAQ PUT API Error:', error);
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

    const dbService = createDatabaseService();
    if (!dbService) {
      throw new Error('Database not available');
    }

    const result = await dbService.deleteFAQ(parseInt(id));

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete FAQ');
    }

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