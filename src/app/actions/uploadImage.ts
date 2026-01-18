'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadImage(base64Data: string, mimeType: string): Promise<UploadResult> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return { success: false, error: 'Cloudinary 설정이 없습니다.' };
    }

    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: 'recipe-ratio-app',
      resource_type: 'image',
    });

    return {
      success: true,
      url: result.secure_url,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.',
    };
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete image:', error);
  }
}
