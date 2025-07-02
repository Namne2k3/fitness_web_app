/**
 * 📸 Upload Controller
 * Handle file uploads using CloudinaryService
 */

import { Request, Response, NextFunction } from 'express';
import { CloudinaryService } from '../services/CloudinaryService';
import { ResponseHelper } from '../utils/responseHelper';
import { ApiResponse } from '../types';

export class UploadController {
    /**
     * Upload single image
     */
    static async uploadImage(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.file) {
                return ResponseHelper.badRequest(res, 'No file provided');
            }

            const imageUrl = await CloudinaryService.uploadImage(
                req.file,
                req.body.folder || 'fitness-app/images'
            );

            ResponseHelper.success(res, {
                imageUrl,
                publicId: CloudinaryService.extractPublicId(imageUrl)
            }, 'Image uploaded successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Upload single video
     */
    static async uploadVideo(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.file) {
                return ResponseHelper.badRequest(res, 'No file provided');
            }

            const videoUrl = await CloudinaryService.uploadVideo(
                req.file,
                req.body.folder || 'fitness-app/videos'
            );

            ResponseHelper.success(res, {
                videoUrl,
                publicId: CloudinaryService.extractPublicId(videoUrl)
            }, 'Video uploaded successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Upload multiple images
     */
    static async uploadMultipleImages(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
                return ResponseHelper.badRequest(res, 'No files provided');
            }

            const imageUrls = await CloudinaryService.uploadMultipleImages(
                req.files as Express.Multer.File[],
                req.body.folder || 'fitness-app/images'
            );

            const results = imageUrls.map(url => ({
                imageUrl: url,
                publicId: CloudinaryService.extractPublicId(url)
            }));

            ResponseHelper.success(res, {
                images: results,
                count: results.length
            }, 'Images uploaded successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete file by public ID
     */
    static async deleteFile(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { publicId } = req.params;

            if (!publicId) {
                return ResponseHelper.badRequest(res, 'Public ID is required');
            }

            await CloudinaryService.deleteFile(publicId);

            ResponseHelper.success(res, null, 'File deleted successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete multiple files
     */
    static async deleteMultipleFiles(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { publicIds } = req.body;

            if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
                return ResponseHelper.badRequest(res, 'Public IDs array is required');
            }

            await CloudinaryService.deleteMultipleFiles(publicIds);

            ResponseHelper.success(res, {
                deletedCount: publicIds.length
            }, 'Files deleted successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Generate optimized image URL
     */
    static async generateOptimizedUrl(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { publicId } = req.params;
            const { width, height, quality } = req.query;

            if (!publicId) {
                return ResponseHelper.badRequest(res, 'Public ID is required');
            }

            const optimizedUrl = CloudinaryService.generateOptimizedImageUrl(
                publicId,
                width ? parseInt(width as string) : undefined,
                height ? parseInt(height as string) : undefined,
                quality as string || 'auto'
            );

            ResponseHelper.success(res, {
                originalPublicId: publicId,
                optimizedUrl
            }, 'Optimized URL generated successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get file information
     */
    static async getFileInfo(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { publicId } = req.params;

            if (!publicId) {
                return ResponseHelper.badRequest(res, 'Public ID is required');
            }

            const fileInfo = await CloudinaryService.getFileInfo(publicId);

            ResponseHelper.success(res, {
                fileInfo
            }, 'File information retrieved successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Check if file exists
     */
    static async checkFileExists(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { publicId } = req.params;

            if (!publicId) {
                return ResponseHelper.badRequest(res, 'Public ID is required');
            }

            const exists = await CloudinaryService.fileExists(publicId);

            ResponseHelper.success(res, {
                publicId,
                exists
            }, 'File existence checked successfully');

        } catch (error) {
            next(error);
        }
    }
}
