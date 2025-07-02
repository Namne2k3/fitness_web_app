/**
 * ☁️ CloudinaryService - File Upload Service
 * Service layer cho tất cả Cloudinary operations
 */

import { cloudinary } from '../config/cloudinary';

export class CloudinaryService {
    /**
     * Upload image to Cloudinary
     */
    static async uploadImage(
        file: Express.Multer.File,
        folder: string = 'fitness-app'
    ): Promise<string> {
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
    }

    /**
     * Upload video to Cloudinary
     */
    static async uploadVideo(
        file: Express.Multer.File,
        folder: string = 'fitness-app/videos'
    ): Promise<string> {
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
    }

    /**
     * Delete file from Cloudinary
     */
    static async deleteFile(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`🗑️ File deleted from Cloudinary: ${publicId}`);
        } catch (error) {
            console.error('❌ Error deleting file from Cloudinary:', error);
            throw new Error('Failed to delete file');
        }
    }

    /**
     * Generate transformation URL
     */
    static generateTransformationUrl(
        publicId: string,
        transformations: any
    ): string {
        return cloudinary.url(publicId, transformations);
    }

    /**
     * Upload multiple images
     */
    static async uploadMultipleImages(
        files: Express.Multer.File[],
        folder: string = 'fitness-app'
    ): Promise<string[]> {
        try {
            const uploadPromises = files.map(file =>
                this.uploadImage(file, folder)
            );

            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('❌ Error uploading multiple images:', error);
            throw new Error('Failed to upload multiple images');
        }
    }

    /**
     * Get file info from Cloudinary
     */
    static async getFileInfo(publicId: string): Promise<any> {
        try {
            const result = await cloudinary.api.resource(publicId);
            return result;
        } catch (error) {
            console.error('❌ Error getting file info from Cloudinary:', error);
            throw new Error('Failed to get file info');
        }
    }

    /**
     * Upload with custom transformations
     */
    static async uploadWithTransformations(
        file: Express.Multer.File,
        folder: string,
        transformations: any[]
    ): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder,
                transformation: transformations
            });

            return result.secure_url;
        } catch (error) {
            console.error('❌ Error uploading with transformations:', error);
            throw new Error('Failed to upload with transformations');
        }
    }

    /**
     * Generate optimized image URL
     */
    static generateOptimizedImageUrl(
        publicId: string,
        width?: number,
        height?: number,
        quality: string = 'auto'
    ): string {
        const transformations: any = {
            quality,
            format: 'webp'
        };

        if (width) transformations.width = width;
        if (height) transformations.height = height;
        if (width && height) transformations.crop = 'fill';

        return cloudinary.url(publicId, transformations);
    }

    /**
     * Extract public ID from Cloudinary URL
     */
    static extractPublicId(cloudinaryUrl: string): string {
        try {
            if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') {
                throw new Error('Invalid Cloudinary URL provided');
            }

            // Extract public ID from Cloudinary URL
            const parts = cloudinaryUrl.split('/');
            const filename = parts[parts.length - 1];

            if (!filename) {
                throw new Error('No filename found in URL');
            }

            const publicId = filename.split('.')[0];

            if (!publicId) {
                throw new Error('No public ID found in filename');
            }

            // Handle folders in public ID
            const folderIndex = parts.findIndex(part => part === 'image' || part === 'video');
            if (folderIndex !== -1 && folderIndex + 2 < parts.length) {
                const folderParts = parts.slice(folderIndex + 2, -1);
                return folderParts.length > 0 ? `${folderParts.join('/')}/${publicId}` : publicId;
            }

            return publicId;
        } catch (error) {
            console.error('❌ Error extracting public ID:', error);
            throw new Error('Failed to extract public ID from URL');
        }
    }

    /**
     * Delete multiple files from Cloudinary
     */
    static async deleteMultipleFiles(publicIds: string[]): Promise<void> {
        try {
            if (!publicIds || publicIds.length === 0) {
                return;
            }

            await cloudinary.api.delete_resources(publicIds);
            console.log(`🗑️ Batch deleted ${publicIds.length} files from Cloudinary`);
        } catch (error) {
            console.error('❌ Error batch deleting files from Cloudinary:', error);
            throw new Error('Failed to batch delete files');
        }
    }

    /**
     * Check if file exists in Cloudinary
     */
    static async fileExists(publicId: string): Promise<boolean> {
        try {
            await cloudinary.api.resource(publicId);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get folder contents from Cloudinary
     */
    static async getFolderContents(folderPath: string): Promise<any> {
        try {
            const result = await cloudinary.api.resources({
                type: 'upload',
                prefix: folderPath,
                max_results: 100
            });

            return result;
        } catch (error) {
            console.error('❌ Error getting folder contents from Cloudinary:', error);
            throw new Error('Failed to get folder contents');
        }
    }
}