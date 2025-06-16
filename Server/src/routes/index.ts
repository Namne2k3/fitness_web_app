/**
 * 🚏 Main Routes Index
 * Central routing configuration cho toàn bộ API
 */

import { Router } from 'express';
import authRoutes from './auth';
import systemRoutes from './system';
import accountRoutes from './account';
import { ResponseHelper } from '../utils/responseHelper';

const router = Router();

/**
 * API Health Check
 */
router.get('/health', (req, res) => {
    const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    };

    ResponseHelper.success(res, healthData, '🏋️ Fitness App API is running!');
});

/**
 * API Routes
 */
router.use('/auth', authRoutes);
router.use('/system', systemRoutes);
router.use('/account', accountRoutes)

/**
 * 404 Handler cho undefined routes
 */
router.use('*', (req, res) => {
    ResponseHelper.notFound(res, `Route ${req.originalUrl} not found`);
});

export default router;
