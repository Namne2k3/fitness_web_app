/**
 * 🖥️ System Controller
 * HTTP request handlers cho system monitoring, health checks và admin functions
 */

import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiResponse } from '../types';
import {
    generateHealthInsights,
    calculateBMI,
    getBMICategory,
    ACTIVITY_LEVELS
} from '../utils/healthCalculations';
import { ResponseHelper, validateRequired } from '../utils/responseHelper';

/**
 * System Controller Class
 */
export class SystemController {
    /**
     * Health check endpoint
     * @route GET /system/health
     */
    static async healthCheck(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check database connection
            const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';

            // Get system info
            const systemInfo = {
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                version: '1.0.0',
                uptime: process.uptime(),
                memory: {
                    used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                    total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                    external: Math.round(process.memoryUsage().external / 1024 / 1024)
                },
                database: {
                    status: dbStatus,
                    host: process.env.MONGODB_URI ? 'Connected' : 'Not configured'
                },
                services: {
                    authentication: 'Active',
                    healthCalculations: 'Active',
                    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured'
                }
            };

            ResponseHelper.success(res, systemInfo, 'Fitness App API is running! 🏋️‍♂️');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Detailed system status
     * @route GET /system/status
     */
    static async getSystemStatus(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const status = {
                server: {
                    status: 'Online',
                    uptime: `${Math.floor(process.uptime() / 60)} minutes`,
                    nodeVersion: process.version,
                    platform: process.platform,
                    arch: process.arch
                },
                database: {
                    status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
                    name: mongoose.connection.name || 'Unknown',
                    host: mongoose.connection.host || 'Unknown',
                    collections: mongoose.connection.db ?
                        await mongoose.connection.db.listCollections().toArray() : []
                },
                memory: {
                    heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
                    heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
                    external: `${Math.round(process.memoryUsage().external / 1024 / 1024)} MB`,
                    arrayBuffers: `${Math.round(process.memoryUsage().arrayBuffers / 1024 / 1024)} MB`
                },
                environment: {
                    NODE_ENV: process.env.NODE_ENV || 'development',
                    PORT: process.env.PORT || '5000',
                    API_VERSION: process.env.API_VERSION || 'v1'
                }
            };

            res.status(200).json({
                success: true,
                data: status,
                message: 'System status retrieved successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get BMI calculation tools và reference data
     * @route GET /system/bmi-tools
     */
    static async getBMITools(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const bmiData = {
                categories: {
                    underweight: 'BMI < 18.5',
                    normal: 'BMI 18.5 - 24.9',
                    overweight: 'BMI 25 - 29.9',
                    obese: 'BMI ≥ 30'
                },
                examples: [
                    { weight: 50, height: 170, bmi: calculateBMI(50, 170), category: getBMICategory(calculateBMI(50, 170)) },
                    { weight: 70, height: 175, bmi: calculateBMI(70, 175), category: getBMICategory(calculateBMI(70, 175)) },
                    { weight: 80, height: 180, bmi: calculateBMI(80, 180), category: getBMICategory(calculateBMI(80, 180)) },
                    { weight: 100, height: 170, bmi: calculateBMI(100, 170), category: getBMICategory(calculateBMI(100, 170)) }
                ], activityLevels: ACTIVITY_LEVELS,
                formula: 'BMI = weight(kg) / height(m)²',
                usage: 'Use POST /system/calculate-bmi to calculate BMI for specific values'
            };

            res.status(200).json({
                success: true,
                data: bmiData,
                message: 'BMI tools and reference data retrieved successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Calculate BMI cho specific values
     * @route POST /system/calculate-bmi
     */
    static async calculateBMI(
        req: Request<{}, ApiResponse, { weight: number; height: number }>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { weight, height } = req.body;            // Validation using helper
            if (!validateRequired(res, { weight, height })) return;

            if (weight <= 0 || height <= 0) {
                ResponseHelper.badRequest(res, 'Weight and height must be positive numbers');
                return;
            }

            if (weight < 20 || weight > 500) {
                ResponseHelper.badRequest(res, 'Weight must be between 20kg and 500kg');
                return;
            }

            if (height < 100 || height > 250) {
                ResponseHelper.badRequest(res, 'Height must be between 100cm and 250cm');
                return;
            }

            const bmi = calculateBMI(weight, height);
            const category = getBMICategory(bmi); const result = {
                input: { weight, height },
                bmi: bmi,
                category: category,
                interpretation: {
                    status: category,
                    range: getBMIRange(category),
                    recommendations: getBMIRecommendations(bmi)
                }
            };

            ResponseHelper.success(res, result, 'BMI calculated successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Generate comprehensive health insights
     * @route POST /system/health-insights
     */
    static async generateHealthInsights(
        req: Request<{}, ApiResponse, {
            weight: number;
            height: number;
            age: number;
            gender: 'male' | 'female';
            activityLevel: keyof typeof ACTIVITY_LEVELS;
            fitnessGoals: string[];
        }>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { weight, height, age, gender, activityLevel, fitnessGoals } = req.body;

            // Validation
            if (!weight || !height || !age || !gender || !activityLevel) {
                res.status(400).json({
                    success: false,
                    error: 'All fields are required: weight, height, age, gender, activityLevel',
                    data: null
                });
                return;
            }

            // Convert activityLevel string to number
            const activityMultiplier = ACTIVITY_LEVELS[activityLevel];
            if (!activityMultiplier) {
                res.status(400).json({
                    success: false,
                    error: `Invalid activity level. Must be one of: ${Object.keys(ACTIVITY_LEVELS).join(', ')}`,
                    data: null
                });
                return;
            }

            // Convert fitnessGoals strings to enum values
            const goals = fitnessGoals || [];

            const insights = generateHealthInsights(
                weight,
                height,
                age,
                gender,
                activityMultiplier,
                goals as any[]
            );

            res.status(200).json({
                success: true,
                data: insights,
                message: 'Health insights generated successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get system configuration
     * @route GET /system/config
     */
    static async getSystemConfig(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const config = {
                api: {
                    version: process.env.API_VERSION || 'v1',
                    environment: process.env.NODE_ENV || 'development',
                    baseUrl: `${req.protocol}://${req.get('host')}/api/v1`
                },
                features: {
                    authentication: true,
                    healthCalculations: true,
                    bmiTracking: true,
                    userProfiles: true,
                    cloudinaryUpload: !!process.env.CLOUDINARY_CLOUD_NAME
                },
                limits: {
                    maxFileSize: '10mb',
                    rateLimitWindow: '15 minutes',
                    rateLimitRequests: 100
                },
                supportedFormats: {
                    images: ['jpeg', 'jpg', 'png', 'webp'],
                    videos: ['mp4', 'webm']
                }
            };

            res.status(200).json({
                success: true,
                data: config,
                message: 'System configuration retrieved successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get API endpoints documentation
     * @route GET /system/endpoints
     */
    static async getAPIEndpoints(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const endpoints = {
                authentication: {
                    register: 'POST /auth/register',
                    login: 'POST /auth/login',
                    profile: 'GET /auth/me',
                    updateProfile: 'PUT /auth/profile',
                    changePassword: 'PUT /auth/change-password',
                    healthInsights: 'GET /auth/health-insights',
                    userStats: 'GET /auth/stats',
                    logout: 'POST /auth/logout'
                },
                system: {
                    health: 'GET /system/health',
                    status: 'GET /system/status',
                    bmiTools: 'GET /system/bmi-tools',
                    calculateBMI: 'POST /system/calculate-bmi',
                    healthInsights: 'POST /system/health-insights',
                    config: 'GET /system/config',
                    endpoints: 'GET /system/endpoints'
                },
                documentation: {
                    swagger: 'GET /api-docs',
                    swaggerJson: 'GET /api-docs.json'
                }
            };

            res.status(200).json({
                success: true,
                data: endpoints,
                message: 'API endpoints retrieved successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

// ================================
// 🔧 Helper Functions
// ================================

/**
 * Get BMI range for category
 */
function getBMIRange(category: string): string {
    switch (category) {
        case 'Underweight': return '< 18.5';
        case 'Normal weight': return '18.5 - 24.9';
        case 'Overweight': return '25 - 29.9';
        case 'Obese': return '≥ 30';
        default: return 'Unknown';
    }
}

/**
 * Get BMI recommendations
 */
function getBMIRecommendations(bmi: number): string[] {
    const recommendations: string[] = [];

    if (bmi < 18.5) {
        recommendations.push('Consider consulting a healthcare provider for weight gain guidance');
        recommendations.push('Focus on nutrient-dense foods and strength training');
        recommendations.push('Monitor your health regularly');
    } else if (bmi < 25) {
        recommendations.push('Maintain your current healthy weight');
        recommendations.push('Continue regular physical activity');
        recommendations.push('Follow a balanced diet');
    } else if (bmi < 30) {
        recommendations.push('Consider gradual weight loss through diet and exercise');
        recommendations.push('Increase physical activity to 150+ minutes per week');
        recommendations.push('Focus on portion control and healthy food choices');
    } else {
        recommendations.push('Consult healthcare provider for weight management plan');
        recommendations.push('Start with low-impact exercises');
        recommendations.push('Consider professional nutritional guidance');
        recommendations.push('Monitor health markers regularly');
    }

    return recommendations;
}
