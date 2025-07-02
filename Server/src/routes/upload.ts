/**
 * 📸 Upload Routes
 * Routes for file upload operations using CloudinaryService
 */

import { Router } from 'express';
import { UploadController } from '../controllers/UploadController';
import { authenticate } from '../middleware/auth';
import { uploadMiddleware, uploadSingle, uploadMultiple } from '../middleware/upload';

const router = Router();

/**
 * @route POST /api/v1/upload/image
 * @desc Upload single image
 * @access Private
 */
router.post('/image',
    authenticate,
    uploadMiddleware.single('image'),
    UploadController.uploadImage
);

/**
 * @route POST /api/v1/upload/video
 * @desc Upload single video
 * @access Private
 */
router.post('/video',
    authenticate,
    uploadMiddleware.single('video'),
    UploadController.uploadVideo
);

/**
 * @route POST /api/v1/upload/images
 * @desc Upload multiple images
 * @access Private
 */
router.post('/images',
    authenticate,
    uploadMiddleware.array('images', 10), // Max 10 images
    UploadController.uploadMultipleImages
);

/**
 * @route DELETE /api/v1/upload/:publicId
 * @desc Delete file by public ID
 * @access Private
 */
router.delete('/:publicId',
    authenticate,
    UploadController.deleteFile
);

/**
 * @route DELETE /api/v1/upload/batch
 * @desc Delete multiple files
 * @access Private
 */
router.delete('/batch',
    authenticate,
    UploadController.deleteMultipleFiles
);

/**
 * @route GET /api/v1/upload/optimize/:publicId
 * @desc Generate optimized image URL
 * @access Private
 */
router.get('/optimize/:publicId',
    authenticate,
    UploadController.generateOptimizedUrl
);

/**
 * @route GET /api/v1/upload/info/:publicId
 * @desc Get file information
 * @access Private
 */
router.get('/info/:publicId',
    authenticate,
    UploadController.getFileInfo
);

/**
 * @route GET /api/v1/upload/exists/:publicId
 * @desc Check if file exists
 * @access Private
 */
router.get('/exists/:publicId',
    authenticate,
    UploadController.checkFileExists
);

export default router;
