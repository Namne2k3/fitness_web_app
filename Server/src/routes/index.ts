/**
 * 🚏 Main Routes Index
 * Central routing configuration cho toàn bộ API
 */

import { Router } from 'express';
import authRoutes from './auth';
import systemRoutes from './system';
import accountRoutes from './account';

const router = Router();

/**
 * API Health Check
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            version: '1.0.0'
        },
        message: '🏋️ Fitness App API is running!'
    });
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
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`,
        data: null
    });
});

export default router;
