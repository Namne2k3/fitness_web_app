import { Request, Response, NextFunction } from 'express';

import { RequestWithUser, ApiResponse } from '../types';
import { ResponseHelper, requireAuth, validateRequired } from '../utils/responseHelper';
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
    }
}