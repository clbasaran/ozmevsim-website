import { NextRequest, NextResponse } from 'next/server';

// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { updates, timestamp, source } = await request.json();

    if (!updates || !timestamp) {
      return NextResponse.json({
        success: false,
        error: 'Updates and timestamp required'
      }, { status: 400 });
    }

    // Log the admin changes for developer to pickup
    console.log('=== ADMIN CHANGES RECEIVED ===');
    console.log('Timestamp:', timestamp);
    console.log('Source:', source);
    console.log('Updates:', JSON.stringify(updates, null, 2));

    // In a real implementation, this would:
    // 1. Save to a database or file
    // 2. Trigger a webhook to rebuild site
    // 3. Send notification to developer

    return NextResponse.json({
      success: true,
      message: 'Admin changes logged successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Admin sync error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Return info about admin sync system
  return NextResponse.json({
    message: 'Admin sync endpoint active',
    status: 'ready',
    production: process.env.NODE_ENV === 'production'
  });
} 