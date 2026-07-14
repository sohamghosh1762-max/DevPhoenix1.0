import fs from 'fs';
import path from 'path';

export interface StorageProvider {
  uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
}

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'public/uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string> {
    // Sanitize file name to avoid directory traversal
    const safeFileName = path.basename(fileName).replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}-${safeFileName}`;
    const filePath = path.join(this.uploadDir, uniqueName);
    
    await fs.promises.writeFile(filePath, file);
    return `/uploads/${uniqueName}`; // Web-accessible public path
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, fileName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error('Failed to delete file:', fileUrl, error);
    }
  }
}

// In the future, we can add CloudinaryStorageProvider or S3StorageProvider here.
// class CloudinaryStorageProvider implements StorageProvider { ... }

let storageProviderInstance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!storageProviderInstance) {
    // Currently using LocalStorageProvider, but can easily switch to Cloudinary/S3/Supabase Storage here.
    storageProviderInstance = new LocalStorageProvider();
  }
  return storageProviderInstance;
}
