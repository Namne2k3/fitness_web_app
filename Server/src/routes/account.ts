import { Router } from "express";

import { authenticate } from "../middleware/auth";
import { AccountController } from "../controllers/AccountController";
const router = Router();

/**
 * @swagger
 * /account/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Account]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "507f1f77bcf86cd799439011"
 *                         joinDate:
 *                           type: string
 *                           format: date-time
 *                         lastLogin:
 *                           type: string
 *                           format: date-time
 *                         isEmailVerified:
 *                           type: boolean
 *                           example: true
 *                         subscriptionPlan:
 *                           type: string
 *                           example: "free"
 *                         subscriptionStatus:
 *                           type: string
 *                           example: "active"
 *                         bmi:
 *                           type: number
    *                           example: 23.1
    *                         experienceLevel:
    *                           type: string
    *                           example: "intermediate"
    *       401:
    *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/profile', authenticate, AccountController.getAccountProfile);

export default router;
