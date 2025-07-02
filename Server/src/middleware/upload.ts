/**
 * 📁 Upload Middleware
 * Multer middleware for file uploads
 */

import multer from 'multer';
import path from 'path';
import { Request } from 'express';

/**
 * File filter function
 */
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
    // Allowed image types
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

    // Allowed video types
    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];

    const isImage = allowedImageTypes.includes(file.mimetype);
    const isVideo = allowedVideoTypes.includes(file.mimetype);

    if (isImage || isVideo) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${[...allowedImageTypes, ...allowedVideoTypes].join(', ')}`));
    }
};

/**
 * Multer storage configuration
 */
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        // Temporary storage - files will be uploaded to Cloudinary
        cb(null, 'uploads/temp');
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
});

/**
 * Upload middleware configuration
 */
export const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
        files: 10 // Maximum 10 files
    }
});

/**
 * Single file upload middleware
 */
export const uploadSingle = (fieldName: string) => {
    return uploadMiddleware.single(fieldName);
};

/**
 * Multiple files upload middleware
 */
export const uploadMultiple = (fieldName: string, maxCount: number = 10) => {
    return uploadMiddleware.array(fieldName, maxCount);
};

/**
 * Fields upload middleware for different field names
 */
export const uploadFields = (fields: { name: string; maxCount: number }[]) => {
    return uploadMiddleware.fields(fields);
};
