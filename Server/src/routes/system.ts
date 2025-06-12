/**
 * 🖥️ System Routes
 * Routes cho system monitoring, health checks và admin functions
 */

import { Router } from 'express';
import { SystemController } from '../controllers/SystemController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: System
 *   description: System monitoring and health tools
 */

/**
 * @swagger
 * /system/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "healthy"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     database:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "connected"
 *                         name:
 *                           type: string
 *                     uptime:
 *                       type: string
 *                     version:
 *                       type: string
 */
router.get('/health', SystemController.healthCheck);

/**
 * @swagger
 * /system/status:
 *   get:
 *     summary: Detailed system status
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Detailed system information
 */
router.get('/status', SystemController.getSystemStatus);

/**
 * @swagger
 * /system/bmi-tool:
 *   get:
 *     summary: BMI calculation tool information
 *     tags: [System]
 *     responses:
 *       200:
 *         description: BMI tool information and examples
 */
router.get('/bmi-tool', SystemController.getBMITools);

/**
 * @swagger
 * /system/calculate-bmi:
 *   post:
 *     summary: Calculate BMI
 *     tags: [System]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weight
 *               - height
 *             properties:
 *               weight:
 *                 type: number
 *                 minimum: 20
 *                 maximum: 500
 *                 description: Weight in kg
 *                 example: 70
 *               height:
 *                 type: number
 *                 minimum: 100
 *                 maximum: 250
 *                 description: Height in cm
 *                 example: 175
 *     responses:
 *       200:
 *         description: BMI calculation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     bmi:
 *                       type: number
 *                       example: 22.9
 *                     category:
 *                       type: object
 *                       properties:
 *                         category:
 *                           type: string
 *                           example: "Normal weight"
 *                         status:
 *                           type: string
 *                           example: "healthy"
 *                         description:
 *                           type: string
 *                         recommendations:
 *                           type: array
 *                           items:
 *                             type: string
 *       400:
 *         description: Invalid input data
 */
router.post('/calculate-bmi', SystemController.calculateBMI);

/**
 * @swagger
 * /system/docs:
 *   get:
 *     summary: API documentation endpoints
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Available API endpoints documentation
 */
// router.get('/docs', SystemController.getAPIEndpoints);

export default router;
