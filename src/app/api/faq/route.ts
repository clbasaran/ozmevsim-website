import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering and edge runtime
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Memory storage for FAQs
let memoryStorage: any[] = [
  {
    id: 1,
    question: 'Kombi bakımı ne sıklıkla yapılmalıdır?',
    answer: 'Kombiler yılda en az bir kez profesyonel bakım yapılmalıdır. Bu sayede verimliliği korunur ve arıza riski azalır.',
    category: 'bakım',
    order: 1,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    question: 'Hangi kombi markası en iyisidir?',
    answer: 'Her markanın kendine özgü avantajları vardır. Vaillant, Bosch, Buderus gibi Avrupa markaları kalite ve dayanıklılıkta öne çıkar.',
    category: 'ürün',
    order: 2,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status') || 'active';

    let allFaqs = memoryStorage.filter(f => f.status === status);

    if (id) {
      const numericId = parseInt(id);
      const faq = allFaqs.find(f => f.id === numericId);
      
      if (!faq) {
        return NextResponse.json(
          { success: false, error: 'FAQ not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: faq,
        source: 'memory'
      });
    }

    return NextResponse.json({
      success: true,
      data: allFaqs,
      source: 'memory',
      count: allFaqs.length
    });

  } catch (error: any) {
    console.error('FAQ API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, category, order, status } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    const newFaq = {
      id: Date.now(),
      question,
      answer,
      category: category || 'genel',
      order: order || 0,
      status: status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryStorage.push(newFaq);

    return NextResponse.json({
      success: true,
      data: newFaq,
      source: 'memory'
    });

  } catch (error: any) {
    console.error('FAQ POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, question, answer, category, order, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'FAQ ID is required' },
        { status: 400 }
      );
    }

    const faqIndex = memoryStorage.findIndex(f => f.id === parseInt(id));
    if (faqIndex === -1) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    memoryStorage[faqIndex] = {
      ...memoryStorage[faqIndex],
      question: question || memoryStorage[faqIndex].question,
      answer: answer || memoryStorage[faqIndex].answer,
      category: category || memoryStorage[faqIndex].category,
      order: order !== undefined ? order : memoryStorage[faqIndex].order,
      status: status || memoryStorage[faqIndex].status,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: memoryStorage[faqIndex],
      source: 'memory'
    });

  } catch (error: any) {
    console.error('FAQ PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
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
        { error: 'FAQ ID is required' },
        { status: 400 }
      );
    }

    const faqIndex = memoryStorage.findIndex(f => f.id === parseInt(id));
    if (faqIndex === -1) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    memoryStorage.splice(faqIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'FAQ deleted successfully',
      source: 'memory'
    });

  } catch (error: any) {
    console.error('FAQ DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
} 