interface Env {
  MEDIA_BUCKET: any; // R2Bucket type from Cloudflare Workers
}

export const onRequestGet = async (context: any) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': '86400',
  };

  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const filePath = url.searchParams.get('file');

    if (!filePath) {
      return new Response('File path is required', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Check if R2 bucket is available
    if (!env.MEDIA_BUCKET) {
      console.error('MEDIA_BUCKET not found in environment');
      return new Response('R2 bucket not configured', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    console.log('Attempting to get file:', filePath);
    
    // Get file from R2
    const object = await env.MEDIA_BUCKET.get(filePath);
    
    if (!object) {
      console.log('File not found in R2:', filePath);
      return new Response('File not found', { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    // Set appropriate headers
    const headers = new Headers(corsHeaders);
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
    headers.set('Content-Length', object.size.toString());
    headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year cache

    if (object.httpEtag) {
      headers.set('ETag', object.httpEtag);
    }

    console.log('Successfully serving file:', filePath, 'Size:', object.size);
    return new Response(object.body, { headers });

  } catch (error) {
    console.error('R2 Proxy error:', error);
    return new Response('Internal server error: ' + (error as Error).message, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
};

export const onRequestOptions = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    },
  });
}; 