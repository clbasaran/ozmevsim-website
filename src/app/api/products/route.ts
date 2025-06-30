import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  return new Response('{"success":true,"data":[{"id":1,"title":"Test"}]}', {
    headers: { 'Content-Type': 'application/json' }
  });
} 