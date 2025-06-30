import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const STATIC_FAQ = [
  {
    id: 1,
    question: 'Kombi bakımı ne sıklıkla yapılmalıdır?',
    answer: 'Kombiler yılda en az bir kez profesyonel bakım yapılmalıdır.',
    category: 'bakım',
    order: 1,
    status: 'active'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: STATIC_FAQ,
    source: 'static',
    count: STATIC_FAQ.length
  });
} 