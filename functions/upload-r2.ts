interface Env {
  MEDIA_BUCKET: any; // R2Bucket type from Cloudflare Workers
  R2_PUBLIC_URL: string;
}

interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  type: 'image' | 'video' | 'document';
  mimeType: string;
  size: number;
  url: string;
  thumbnail?: string;
  uploadedAt: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export const onRequestPost = async (context: any) => {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const folder = formData.get('folder') as string || 'general';

    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No files provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const uploadedFilesData: UploadedFile[] = [];

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `File ${file.name} is too large. Maximum size is 10MB.` 
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2);
      const fileExtension = file.name.split('.').pop();
      const uniqueFilename = `${folder}/${timestamp}-${randomId}.${fileExtension}`;

      // Upload to R2
      await env.MEDIA_BUCKET.put(uniqueFilename, file.stream(), {
        httpMetadata: {
          contentType: file.type,
        },
      });

      const fileType: 'image' | 'video' | 'document' = 
        file.type.startsWith('image/') ? 'image' :
        file.type.startsWith('video/') ? 'video' : 'document';

      const uploadedFile: UploadedFile = {
        id: `${timestamp}-${randomId}`,
        name: uniqueFilename,
        originalName: file.name,
        type: fileType,
        mimeType: file.type,
        size: file.size,
        url: `/api/r2-proxy?file=${encodeURIComponent(uniqueFilename)}`,
        uploadedAt: new Date().toISOString()
      };

      if (fileType === 'image') {
        uploadedFile.thumbnail = uploadedFile.url;
        uploadedFile.dimensions = { width: 800, height: 600 };
      }

      uploadedFilesData.push(uploadedFile);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: uploadedFilesData,
        message: `${uploadedFilesData.length} file(s) uploaded successfully to R2`
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('R2 Upload error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to upload files to R2' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestGet = async (context: any) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const folder = url.searchParams.get('folder');

    // List objects from R2
    const objects = await env.MEDIA_BUCKET.list({ 
      prefix: folder || undefined,
      limit: 100 
    });

    const files: UploadedFile[] = objects.objects.map((obj: any) => {
      const fileType: 'image' | 'video' | 'document' = 
        obj.httpMetadata?.contentType?.startsWith('image/') ? 'image' :
        obj.httpMetadata?.contentType?.startsWith('video/') ? 'video' : 'document';

      const file: UploadedFile = {
        id: obj.key.split('/').pop()?.split('.')[0] || obj.key,
        name: obj.key,
        originalName: obj.key.split('/').pop() || obj.key,
        type: fileType,
        mimeType: obj.httpMetadata?.contentType || 'application/octet-stream',
        size: obj.size,
        url: `/api/r2-proxy?file=${encodeURIComponent(obj.key)}`,
        uploadedAt: obj.uploaded.toISOString()
      };

      if (fileType === 'image') {
        file.thumbnail = file.url;
      }

      return file;
    });

    // Filter by type if specified
    const filteredFiles = type ? files.filter(f => f.type === type) : files;

    return new Response(
      JSON.stringify({
        success: true,
        data: filteredFiles,
        total: filteredFiles.length,
        message: `Found ${filteredFiles.length} files in R2 bucket`
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('R2 List error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch files from R2' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 