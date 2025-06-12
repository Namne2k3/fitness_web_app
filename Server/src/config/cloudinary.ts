/**
 * ☁️ Cloudinary Configuration
 * File upload service for images and videos
 */

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfig } from '../types';

/**
 * Cloudinary configuration
 */
const createCloudinaryConfig = (): CloudinaryConfig => ({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
    secure: true
});

/**
 * Initialize Cloudinary
 */
export const initializeCloudinary = (): void => {
    const config = createCloudinaryConfig();

    // Validate required configuration
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
        console.warn('⚠️ Cloudinary configuration incomplete. File uploads will be disabled.');
        return;
    }

    cloudinary.config(config);
    console.log('✅ Cloudinary initialized successfully');
};

/**
 * Upload image to Cloudinary
 */
export const uploadImage = async (
    file: Express.Multer.File,
    folder: string = 'fitness-app'
): Promise<string> => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder,
            resource_type: 'image',
            transformation: [
                { width: 1200, height: 800, crop: 'limit' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });

        return result.secure_url;
    } catch (error) {
        console.error('❌ Error uploading image to Cloudinary:', error);
        throw new Error('Failed to upload image');
    }
};

/**
 * Upload video to Cloudinary
 */
export const uploadVideo = async (
    file: Express.Multer.File,
    folder: string = 'fitness-app/videos'
): Promise<string> => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder,
            resource_type: 'video',
            transformation: [
                { width: 1280, height: 720, crop: 'limit' },
                { quality: 'auto' },
                { format: 'mp4' }
            ]
        });

        return result.secure_url;
    } catch (error) {
        console.error('❌ Error uploading video to Cloudinary:', error);
        throw new Error('Failed to upload video');
    }
};

/**
 * Delete file from Cloudinary
 */
export const deleteFile = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`🗑️ File deleted from Cloudinary: ${publicId}`);
    } catch (error) {
        console.error('❌ Error deleting file from Cloudinary:', error);
        throw new Error('Failed to delete file');
    }
};

/**
 * Generate transformation URL
 */
export const generateTransformationUrl = (
    publicId: string,
    transformations: any
): string => {
    return cloudinary.url(publicId, transformations);
};

export { cloudinary };
