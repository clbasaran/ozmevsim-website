import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'İletişim API aktif'
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Mesaj alındı'
  });
} 