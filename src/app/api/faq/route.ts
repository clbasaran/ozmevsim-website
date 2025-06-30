import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      {
        id: 1,
        question: 'Kombi bakımı ne sıklıkla yapılmalıdır?',
        answer: 'Kombiler yılda en az bir kez profesyonel bakım yapılmalıdır.'
      }
    ]
  });
} 