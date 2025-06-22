// Cloudflare Functions version of admin-sync
export async function onRequestPost(context: any) {
  try {
    const request = context.request;
    const { updates, timestamp, source } = await request.json();

    if (!updates || !timestamp) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Updates and timestamp required'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log the admin changes for developer to pickup
    console.log('=== ADMIN CHANGES RECEIVED ===');
    console.log('Timestamp:', timestamp);
    console.log('Source:', source);
    console.log('Updates:', JSON.stringify(updates, null, 2));

    // In a real implementation, this would:
    // 1. Save to KV store
    // 2. Trigger rebuild
    // 3. Send notification

    return new Response(JSON.stringify({
      success: true,
      message: 'Admin changes logged successfully',
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Admin sync error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestGet() {
  return new Response(JSON.stringify({
    message: 'Admin sync endpoint active',
    status: 'ready',
    type: 'cloudflare-function'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
} 