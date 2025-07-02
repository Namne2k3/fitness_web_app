import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { RequestWithUser, ApiResponse } from '../types';
import { ResponseHelper, requireAuth } from '../utils/responseHelper';
import { WorkoutService, CreateWorkoutInput } from '../services/WorkoutService';
import { CreateWorkoutDto } from '../dtos/CreateWorkoutDto';

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
    }    /**
     * Create a new workout with robust validation
     * @route POST /api/v1/workouts
     */
    static async createWorkout(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<any> {
        try {
            // Check authentication
            if (!requireAuth(res, req.user)) {
                return;
            }

            const userId = req.user!._id;

            // Validate request body using DTO
            const workoutDto = new CreateWorkoutDto(req.body);

            const validation = workoutDto.getValidationResult();

            if (!validation.isValid) {
                return ResponseHelper.badRequest(
                    res,
                    `Validation failed: ${validation.errors.join(', ')}`
                );
            }

            // Get validated data
            const validatedData = workoutDto.getValidatedData();
            if (!validatedData) {
                return ResponseHelper.badRequest(res, 'Invalid workout data provided');
            }

            // Add userId to workout data
            const workoutWithUser: CreateWorkoutInput = {
                ...validatedData,
                userId
            };

            // Create workout through service
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

    /**
     * Get workout by ID with enhanced data
     * @route GET /api/v1/workouts/:id
     */
    static async getWorkoutById(
        req: Request<{ id: string }>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;

            // Validate ObjectId format
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return ResponseHelper.badRequest(res, 'Invalid workout ID format');
            }

            // Get workout with enhanced data
            const workout = await WorkoutService.getWorkoutById(id, {
                includeUserData: true,
                includeExerciseData: true,
                includeAnalytics: true
            });

            if (!workout) {
                return ResponseHelper.notFound(res, 'Workout not found');
            }

            ResponseHelper.success(res, workout, 'Workout retrieved successfully');

        } catch (error) {
            next(error);
        }
    }
}