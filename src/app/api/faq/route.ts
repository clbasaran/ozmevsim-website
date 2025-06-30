import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const STATIC_FAQ = [
  {
    id: 1,
    question: 'Kombi bakımı ne sıklıkla yapılmalıdır?',
    answer: 'Kombiler yılda en az bir kez profesyonel bakım yapılmalıdır. Bu bakım, kombinizin güvenli ve verimli çalışmasını sağlar.',
    category: 'bakım',
    order: 1,
    status: 'active'
  },
  {
    id: 2,
    question: 'Klima temizliği neden önemlidir?',
    answer: 'Klima temizliği, cihazın verimliliğini artırır ve sağlıklı hava kalitesi sağlar. Yılda 2-3 kez temizlik önerilir.',
    category: 'klima',
    order: 2,
    status: 'active'
  },
  {
    id: 3,
    question: 'Doğalgaz tesisatında hangi kontroller yapılmalı?',
    answer: 'Doğalgaz tesisatında kaçak kontrolü, boru kontrolü ve cihaz bağlantı kontrolü düzenli olarak yapılmalıdır.',
    category: 'doğalgaz',
    order: 3,
    status: 'active'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';

    let faqs = STATIC_FAQ.filter(faq => faq.status === status);

    // Filter static data if needed
    if (category) {
      faqs = faqs.filter(faq => faq.category === category);
    }

    return NextResponse.json({
      success: true,
      data: faqs,
      source: 'static',
      count: faqs.length
    });

  } catch (error: any) {
    console.error('FAQ API Error:', error);
    return NextResponse.json({
      success: true,
      data: STATIC_FAQ.filter(faq => faq.status === 'active'),
      source: 'fallback',
      count: STATIC_FAQ.filter(faq => faq.status === 'active').length
    });
  }
} 