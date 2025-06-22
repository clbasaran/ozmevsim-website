import { NextRequest, NextResponse } from 'next/server';

// Note: Using Node.js runtime for fs operations (not compatible with Cloudflare Pages)
// This will fallback to Functions
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

// In-memory storage for uploaded files metadata
let uploadedFiles: UploadedFile[] = [];

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

    const uploadedFilesData: UploadedFile[] = [];

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return NextResponse.json(
          { success: false, error: `File ${file.name} is too large. Maximum size is 10MB.` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const fileExtension = path.extname(file.name);
      const uniqueFilename = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Determine file type
      let fileType: 'image' | 'video' | 'document' = 'document';
      if (file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
      }

      // Create file metadata
      const uploadedFile: UploadedFile = {
        id: uuidv4(),
        name: uniqueFilename,
        originalName: file.name,
        type: fileType,
        mimeType: file.type,
        size: file.size,
        url: `/uploads/${folder}/${uniqueFilename}`,
        uploadedAt: new Date().toISOString()
      };

      // For images, try to get dimensions (simplified)
      if (fileType === 'image') {
        uploadedFile.thumbnail = uploadedFile.url;
        // In a real implementation, you'd use a library like sharp to get dimensions
        uploadedFile.dimensions = { width: 800, height: 600 };
      }

      uploadedFiles.push(uploadedFile);
      uploadedFilesData.push(uploadedFile);
    }

    return NextResponse.json({
      success: true,
      data: uploadedFilesData,
      message: `${uploadedFilesData.length} file(s) uploaded successfully`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const folder = searchParams.get('folder');

  try {
    let filteredFiles = [...uploadedFiles];

    if (type && type !== 'all') {
      filteredFiles = filteredFiles.filter(file => file.type === type);
    }

    if (folder) {
      filteredFiles = filteredFiles.filter(file => file.url.includes(`/uploads/${folder}/`));
    }

    return NextResponse.json({
      success: true,
      data: filteredFiles,
      total: filteredFiles.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'File ID is required' },
        { status: 400 }
      );
    }

    const fileIndex = uploadedFiles.findIndex(file => file.id === id);
    if (fileIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    // Remove from array (in production, you'd also delete the physical file)
    uploadedFiles.splice(fileIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
} 