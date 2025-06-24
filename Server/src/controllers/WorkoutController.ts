import { Request, Response, NextFunction } from 'express';

import { RequestWithUser, ApiResponse } from '../types';
import { ResponseHelper, requireAuth, validateRequiredFields } from '../utils/responseHelper';
import { WorkoutService } from '../services/WorkoutService';

/**
 * 🏋️ Workout Controller Class
 * Handles workout-related API endpoints with pagination and filtering
 */

export interface FilterWorkout {
    page?: number;
    limit?: number;
    filters?: {
        category?: string;
        difficulty?: string;
        includePrivate?: boolean;
        duration?: { min?: number; max?: number };
        equipment?: string | string[];
        muscleGroups?: string | string[];
        search?: string;
        isSponsored?: boolean;
        userId?: string;
        minRating?: number;
        tags?: string | string[];
    };
    sort?: { field: string; order: 'asc' | 'desc' };
    options?: {
        includeUserData?: boolean;
        includeExerciseData?: boolean;
    };
}

export interface RequestBodyFilterWorkout extends Request {
    body: FilterWorkout;
}

export class WorkoutController {
    /**
     * Get all workouts with advanced filtering, sorting and pagination
     * @route POST /api/v1/workouts/list
     */
    static async getWorkouts(
        req: RequestBodyFilterWorkout,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await WorkoutService.getWorkouts(req.body);

            res.status(200).json({
                success: true,
                data: result,
                message: 'Workouts retrieved successfully'
            });

        } catch (error) {
            next(error);
        }
    } static async createWorkout(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check authentication
            if (!requireAuth(res, req.user)) {
                return;
            }

            const workoutData = req.body;
            const userId = req.user!._id;

            // Validate required fields
            const validation = validateRequiredFields(workoutData, [
                'name',
                'description',
                'category',
                'difficulty',
                'estimatedDuration',
                'exercises'
            ]);

            if (!validation.isValid) {
                return ResponseHelper.badRequest(res, `Missing required fields: ${validation.missingFields.join(', ')}`);
            }

            // Add userId to workout data
            const workoutWithUser = {
                ...workoutData,
                userId
            };

            const result = await WorkoutService.createWorkout(workoutWithUser);

            res.status(201).json({
                success: true,
                data: result,
                message: 'Workout created successfully'
            });

        } catch (error) {
            next(error);
        }
    }
}