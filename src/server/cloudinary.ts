import 'server-only';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  size: number;
  format: string;
  duration?: number;
}

/**
 * Faz upload de um arquivo de áudio para o Cloudinary
 * @param buffer Buffer do arquivo de áudio
 * @param originalName Nome original do arquivo
 * @returns Informações do arquivo no Cloudinary
 */
export async function uploadAudioToCloudinary(
  buffer: Buffer,
  originalName: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video', // Para arquivos de áudio/vídeo
        folder: 'physionote/sessions', // Organizar em pasta
        public_id: `session-${randomUUID()}`, // ID único
        invalidate: true, // Invalida cache do CDN
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Upload failed: no result returned'));
          return;
        }

        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          size: result.bytes,
          format: result.format,
          duration: result.duration,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deleta um arquivo de áudio do Cloudinary
 * @param publicId ID público do arquivo no Cloudinary
 */
export async function deleteAudioFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
  } catch (error) {
    console.error('Failed to delete audio from Cloudinary:', error);
    throw error;
  }
}

/**
 * Obtém informações de um arquivo no Cloudinary
 * @param publicId ID público do arquivo
 */
export async function getCloudinaryResourceInfo(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId, { resource_type: 'video' });
    return result;
  } catch (error) {
    console.error('Failed to get Cloudinary resource info:', error);
    throw error;
  }
}

/**
 * Verifica se o Cloudinary está configurado corretamente
 */
export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}
