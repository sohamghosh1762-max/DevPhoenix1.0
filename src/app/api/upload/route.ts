import { NextRequest } from 'next/server';
import { apiResponse } from '@/lib/api-utils';
import { getStorageProvider } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB limit
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/zip', 'application/x-zip-compressed'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return apiResponse.badRequest('No file uploaded', 'FILE_REQUIRED');
    }

    if (file.size > MAX_SIZE) {
      return apiResponse.badRequest('File size exceeds the 10MB limit', 'FILE_TOO_LARGE');
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return apiResponse.badRequest(
        `Invalid file type: ${file.type}. Only JPG, PNG, GIF, PDF, and ZIP are allowed.`,
        'INVALID_TYPE'
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Save file using the abstract storage provider
    const storage = getStorageProvider();
    const fileUrl = await storage.uploadFile(buffer, file.name, file.type);

    return apiResponse.success({ url: fileUrl });
  } catch (error: any) {
    console.error('File upload API error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
