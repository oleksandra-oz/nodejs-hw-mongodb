import cloudinary from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';

cloudinary.v2.config({
  cloud_name: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVar('CLOUDINARY_API_KEY'),
  api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
});

export const uploadToCloudinary = async (filePath) => {
  try {
    console.log('Uploading to Cloudinary:', filePath); // Дебагування
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: 'contacts_photos',
      transformation: [{ width: 200, height: 200, crop: 'fill' }],
    });
    console.log('Cloudinary result:', result); // Дебагування
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};