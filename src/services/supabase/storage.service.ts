import { supabase } from './client';

export const storageService = {
  /**
   * Upload a file to Supabase Storage
   * @param file File object
   * @param bucket Bucket name (e.g. 'media')
   * @param folder Optional folder path (e.g. 'programs')
   * @returns Public URL of the uploaded file
   */
  async uploadFile(file: File, bucket: string = 'media', folder: string = 'uploads'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      throw new Error('Failed to upload image');
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * Delete a file from Supabase Storage
   * @param publicUrl Full public URL of the file
   * @param bucket Bucket name
   */
  async deleteFile(publicUrl: string, bucket: string = 'media'): Promise<void> {
    try {
      // Extract file path from public URL
      const urlParts = publicUrl.split(`/${bucket}/`);
      if (urlParts.length < 2) throw new Error('Invalid public URL');
      const filePath = urlParts[1];

      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) throw error;
    } catch (err) {
      console.error('Delete Error:', err);
      throw new Error('Failed to delete image');
    }
  }
};
