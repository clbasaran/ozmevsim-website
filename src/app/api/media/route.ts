import { NextRequest, NextResponse } from 'next/server';

// Note: Using Node.js runtime for fs operations (not compatible with Cloudflare Pages)
// This will fallback to Functions
import fs from 'fs';
import path from 'path';

interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  type: 'image' | 'video' | 'document';
  mimeType: string;
  size: number;
  url: string;
  thumbnail?: string;
  alt?: string;
  caption?: string;
  folder?: string;
  uploadedAt: string;
  uploadedBy: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

function getFileType(filename: string): 'image' | 'video' | 'document' {
  const ext = path.extname(filename).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
    return 'image';
  }
  if (['.mp4', '.avi', '.mov', '.wmv', '.flv'].includes(ext)) {
    return 'video';
  }
  return 'document';
}

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.avi': 'video/avi',
    '.mov': 'video/quicktime',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

function scanDirectory(dirPath: string, baseUrl: string = '/uploads'): MediaFile[] {
  const files: MediaFile[] = [];
  
  try {
    if (!fs.existsSync(dirPath)) {
      return files;
    }

    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        const subFiles = scanDirectory(itemPath, `${baseUrl}/${item}`);
        files.push(...subFiles);
      } else if (stat.isFile()) {
        const relativePath = path.relative(path.join(process.cwd(), 'public'), itemPath);
        const urlPath = '/' + relativePath.replace(/\\/g, '/');
        
        const file: MediaFile = {
          id: Buffer.from(itemPath).toString('base64'),
          name: item,
          originalName: item,
          type: getFileType(item),
          mimeType: getMimeType(item),
          size: stat.size,
          url: urlPath,
          thumbnail: getFileType(item) === 'image' ? urlPath : undefined,
          alt: path.parse(item).name,
          caption: '',
          folder: path.basename(path.dirname(itemPath)),
          uploadedAt: stat.mtime.toISOString(),
          uploadedBy: 'System',
          dimensions: getFileType(item) === 'image' ? { width: 800, height: 600 } : undefined
        };
        
        files.push(file);
      }
    }
  } catch (error) {
    console.error('Error scanning directory:', error);
  }
  
  return files;
}

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const mediaFiles = scanDirectory(uploadsDir);
    
    return NextResponse.json({
      success: true,
      data: mediaFiles
    });
  } catch (error) {
    console.error('Error fetching media files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media files' },
      { status: 500 }
    );
  }
} 