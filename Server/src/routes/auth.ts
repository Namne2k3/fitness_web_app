/**
 * 🔐 Authentication Routes
 * Express routes cho authentication endpoints
 */

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and account management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             email: "john.doe@example.com"
 *             username: "johndoe"
 *             password: "password123"
 *             confirmPassword: "password123"
 *             profile:
 *               firstName: "John"
 *               lastName: "Doe"
 *               age: 25
 *               weight: 75
 *               height: 180
 *               fitnessGoals: ["muscle_gain", "strength"]
 *               experienceLevel: "intermediate"
 *               bio: "Fitness enthusiast passionate about strength training"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Email or username already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "john.doe@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
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
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/me', authenticate, AuthController.getMe);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileInput'
 *           example:
 *             firstName: "John"
 *             lastName: "Doe"
 *             age: 26
 *             weight: 77
 *             height: 180
 *             fitnessGoals: ["muscle_gain", "strength", "endurance"]
 *             experienceLevel: "advanced"
 *             bio: "Experienced fitness enthusiast focusing on strength and endurance"
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/profile', authenticate, AuthController.updateProfile);

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "newpassword123"
 *               confirmNewPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/change-password', authenticate, AuthController.changePassword);

/**
 * @swagger
 * /auth/check-email:
 *   post:
 *     summary: Check if email exists
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Email availability checked
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
 *                         exists:
 *                           type: boolean
 *                           example: false
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/check-email', AuthController.checkEmail);

/**
 * @swagger
 * /auth/check-username:
 *   post:
 *     summary: Check if username exists
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 example: "johndoe"
 *     responses:
 *       200:
 *         description: Username availability checked
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
 *                         exists:
 *                           type: boolean
 *                           example: false
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/check-username', AuthController.checkUsername);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "abc123def456ghi789"
 *     responses:
 *       200:
 *         description: Email verified successfully
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
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/verify-email', AuthController.verifyEmail);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend email verification
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/resend-verification', AuthController.resendVerification);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/logout', authenticate, AuthController.logout);

/**
 * @swagger
 * /auth/deactivate:
 *   delete:
 *     summary: Deactivate user account
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Account deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.delete('/deactivate', authenticate, AuthController.deactivateAccount);

/**
 * @swagger
 * /auth/health-insights:
 *   get:
 *     summary: Get detailed health insights and fitness recommendations
 *     description: Retrieve personalized health metrics, BMI analysis, calorie recommendations, and fitness suggestions based on user profile
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Health insights retrieved successfully
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
 *                         healthMetrics:
 *                           type: object
 *                           properties:
 *                             bmi:
 *                               type: number
 *                               example: 23.1
 *                               description: Body Mass Index
 *                             bmiCategory:
 *                               type: string
 *                               example: "Normal weight"
 *                               enum: ["Underweight", "Normal weight", "Overweight", "Obese"]
 *                             weight:
 *                               type: number
 *                               example: 70
 *                               description: Weight in kg
 *                             height:
 *                               type: number
 *                               example: 175
 *                               description: Height in cm
 *                             age:
 *                               type: number
 *                               example: 25
 *                             estimatedBMR:
 *                               type: number
 *                               example: 1750
 *                               description: Estimated Basal Metabolic Rate
 *                         calorieRecommendations:
 *                           type: object
 *                           properties:
 *                             sedentary:
 *                               type: number
 *                               example: 2100
 *                             light:
 *                               type: number
 *                               example: 2400
 *                             moderate:
 *                               type: number
 *                               example: 2700
 *                             active:
 *                               type: number
 *                               example: 3000
 *                             veryActive:
 *                               type: number
 *                               example: 3300
 *                         fitnessProfile:
 *                           type: object
 *                           properties:
 *                             experienceLevel:
 *                               type: string
 *                               example: "intermediate"
 *                             fitnessGoals:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               example: ["muscle_gain", "strength"]
 *                             warnings:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               example: []
 *                         recommendations:
 *                           type: object
 *                           properties:
 *                             workoutFrequency:
 *                               type: string
 *                               example: "4-5 times per week"
 *                             focusAreas:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               example: ["Resistance training", "Progressive overload"]
 *                             cautionNotes:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               example: []
 *                             suggestedActivities:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               example: ["Weight training", "Moderate cardio"]
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/health-insights', authenticate, AuthController.getHealthInsights);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Token refreshed successfully
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
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *                         expiresIn:
 *                           type: number
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', AuthController.refreshToken);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent (if email exists)
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
 *                     message:
 *                       type: string
 *                       example: "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link reset password trong vài phút."
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid email format
 */
router.post('/forgot-password', AuthController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: "abc123def456..."
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "NewPassword123"
 *               confirmNewPassword:
 *                 type: string
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                     message:
 *                       type: string
 *                       example: "Mật khẩu đã được cập nhật thành công"
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid token or validation errors
 *       404:
 *         description: Token not found or expired
 */
router.post('/reset-password', AuthController.resetPassword);

/**
 * @swagger
 * /auth/validate-reset-token/{token}:
 *   get:
 *     summary: Validate reset password token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Reset password token to validate
 *     responses:
 *       200:
 *         description: Token validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     isValid:
 *                       type: boolean
 *                     message:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                     timeRemaining:
 *                       type: number
 *                       description: Seconds until expiry
 *       400:
 *         description: Invalid request
 */
router.get('/validate-reset-token/:token', AuthController.validateResetToken);

export default router;
