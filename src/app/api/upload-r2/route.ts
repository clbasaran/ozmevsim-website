import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

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

// Real R2 Upload with Cloudflare Workers/Pages Functions
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const folder = formData.get('folder') as string || 'general';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    // Get R2 bucket from environment
    const bucket = (globalThis as any).MEDIA_BUCKET;
    if (!bucket) {
      console.warn('MEDIA_BUCKET not available, falling back to local uploads');
      return await handleLocalUpload(files, folder);
    }

    const uploadedFilesData: UploadedFile[] = [];

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return NextResponse.json(
          { success: false, error: `File ${file.name} is too large. Maximum size is 10MB.` },
          { status: 400 }
        );
      }

      try {
        // Generate unique filename
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2);
        const fileExtension = file.name.split('.').pop();
        const uniqueFilename = `${folder}/${timestamp}-${randomId}.${fileExtension}`;

        // Upload to R2
        console.log(`🔄 Uploading ${file.name} to R2 as ${uniqueFilename}`);
        const arrayBuffer = await file.arrayBuffer();
        
        await bucket.put(uniqueFilename, arrayBuffer, {
          httpMetadata: {
            contentType: file.type,
          },
        });

        console.log(`✅ Successfully uploaded ${uniqueFilename} to R2`);

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
          url: `https://pub-dabb1478396c4675b4a98a12c763aec5.r2.dev/${uniqueFilename}`,
          uploadedAt: new Date().toISOString()
        };

        if (fileType === 'image') {
          uploadedFile.thumbnail = uploadedFile.url;
          // Note: In production, you might want to generate actual thumbnails
        }

        uploadedFilesData.push(uploadedFile);

      } catch (uploadError) {
        console.error(`Failed to upload ${file.name}:`, uploadError);
        return NextResponse.json(
          { success: false, error: `Failed to upload ${file.name}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: uploadedFilesData,
      message: `${uploadedFilesData.length} file(s) uploaded successfully to R2`
    });

  } catch (error) {
    console.error('R2 Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload files to R2' },
      { status: 500 }
    );
  }
}

// Fallback for local development
async function handleLocalUpload(files: File[], folder: string): Promise<NextResponse> {
  const uploadedFilesData: UploadedFile[] = [];

  for (const file of files) {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${folder}/${timestamp}-${randomId}.${fileExtension}`;

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
      url: `/uploads/${uniqueFilename}`, // Local path for development
      uploadedAt: new Date().toISOString()
    };

    if (fileType === 'image') {
      uploadedFile.thumbnail = uploadedFile.url;
    }

    uploadedFilesData.push(uploadedFile);
  }

  return NextResponse.json({
    success: true,
    data: uploadedFilesData,
    message: `${uploadedFilesData.length} file(s) prepared for local development`
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const folder = searchParams.get('folder');

  try {
    // Get R2 bucket from environment
    const bucket = (globalThis as any).MEDIA_BUCKET;
    if (!bucket) {
      console.warn('MEDIA_BUCKET not available, returning sample data for development');
      return await handleLocalMediaList(type, folder);
    }

    // List objects from R2
    const prefix = folder ? `${folder}/` : '';
    const objects = await bucket.list({ prefix });

    const files: UploadedFile[] = objects.objects.map((obj: any) => {
      const fileName = obj.key;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      
      let fileType: 'image' | 'video' | 'document' = 'document';
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(fileExtension || '')) {
        fileType = 'image';
      } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(fileExtension || '')) {
        fileType = 'video';
      }

      return {
        id: obj.key.replace(/[^a-zA-Z0-9]/g, '-'),
        name: fileName,
        originalName: fileName.split('/').pop() || fileName,
        type: fileType,
        mimeType: obj.httpMetadata?.contentType || 'application/octet-stream',
        size: obj.size,
        url: `https://pub-dabb1478396c4675b4a98a12c763aec5.r2.dev/${fileName}`,
        thumbnail: fileType === 'image' ? `https://pub-dabb1478396c4675b4a98a12c763aec5.r2.dev/${fileName}` : undefined,
        uploadedAt: obj.uploaded.toISOString()
      };
    });

    // Filter by type if specified
    const filteredFiles = type ? files.filter(file => file.type === type) : files;

    return NextResponse.json({
      success: true,
      data: filteredFiles,
      total: filteredFiles.length,
      message: `Found ${filteredFiles.length} files in R2 bucket`
    });
  } catch (error) {
    console.error('Error fetching files from R2:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch files from R2' },
      { status: 500 }
    );
  }
}

// Fallback for local development - return sample data
async function handleLocalMediaList(type: string | null, folder: string | null): Promise<NextResponse> {
  // For development, return some sample files that exist in public/uploads
  const sampleFiles: UploadedFile[] = [
    {
      id: 'sample-1',
      name: 'kombiler/bosch/codens 2200i.png',
      originalName: 'codens 2200i.png',
      type: 'image',
      mimeType: 'image/png',
      size: 184465,
      url: '/uploads/kombiler/bosch/codens 2200i.png',
      thumbnail: '/uploads/kombiler/bosch/codens 2200i.png',
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'sample-2',
      name: 'kombiler/bosch/codens 1200w.png',
      originalName: 'codens 1200w.png',
      type: 'image',
      mimeType: 'image/png',
      size: 159041,
      url: '/uploads/kombiler/bosch/codens 1200w.png',
      thumbnail: '/uploads/kombiler/bosch/codens 1200w.png',
      uploadedAt: new Date().toISOString()
    }
  ];

  // Filter by type and folder if specified
  let filteredFiles = sampleFiles;
  if (type) {
    filteredFiles = filteredFiles.filter(file => file.type === type);
  }
  if (folder) {
    filteredFiles = filteredFiles.filter(file => file.name.includes(folder));
  }

  return NextResponse.json({
    success: true,
    data: filteredFiles,
    total: filteredFiles.length,
    message: `Found ${filteredFiles.length} sample files (development mode)`
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('file');

  if (!fileName) {
    return NextResponse.json(
      { success: false, error: 'File name is required' },
      { status: 400 }
    );
  }

  try {
    // Get R2 bucket from environment
    const bucket = (globalThis as any).MEDIA_BUCKET;
    if (!bucket) {
      console.warn('MEDIA_BUCKET not available, simulating delete for development');
      return NextResponse.json({
        success: true,
        message: `File ${fileName} would be deleted (development mode)`
      });
    }

    // Delete from R2
    console.log(`🗑️ Deleting ${fileName} from R2`);
    await bucket.delete(fileName);
    console.log(`✅ Successfully deleted ${fileName} from R2`);

    return NextResponse.json({
      success: true,
      message: `File ${fileName} deleted successfully from R2`
    });

  } catch (error) {
    console.error('Error deleting file from R2:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file from R2' },
      { status: 500 }
    );
  }
} 