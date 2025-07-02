/**
 * ☁️ Cloudinary Configuration
 * Configuration và initialization cho Cloudinary service
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
 * Export configured cloudinary instance
 */
export { cloudinary };
