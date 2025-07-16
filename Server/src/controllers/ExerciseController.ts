import { Request, Response, NextFunction } from 'express';

import { RequestWithUser, ApiResponse } from '../types';
import { ResponseHelper } from '../utils/responseHelper';
import { ExerciseService } from '../services/ExerciseService';

/**
 * 💪 Exercise Controller Class
 * Handles exercise-related API endpoints with pagination and filtering
 */

export interface FilterExercise {
    page?: number;
    limit?: number;
    filters?: {
        category?: 'strength' | 'cardio' | 'flexibility';
        difficulty?: 'beginner' | 'intermediate' | 'advanced';
        primaryMuscleGroups?: string | string[];
        secondaryMuscleGroups?: string | string[];
        equipment?: string | string[];
        search?: string;
        isApproved?: boolean;
        createdBy?: string;
        caloriesRange?: { min?: number; max?: number };
        intensityRange?: { min?: number; max?: number };
    };
    sort?: { field: string; order: 'asc' | 'desc' };
    options?: {
        includeUserData?: boolean;
        includeVariations?: boolean;
    };
}

export interface RequestBodyFilterExercise extends Request {
    body: FilterExercise;
}

export class ExerciseController {
    /**
     * Get all exercises with advanced filtering, sorting and pagination
     * @route POST /exercises/list
     */
    static async getExercises(
        req: RequestBodyFilterExercise,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await ExerciseService.getExercises(req.body);

            res.status(200).json({
                success: true,
                data: result,
                message: 'Exercises retrieved successfully'
            });

        } catch (error) {
            next(error);
        }
    }    /**
     * Get exercise by ID
     * @route GET /exercises/:id
     */
    static async getExerciseById(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({
                    success: false,
                    data: null,
                    message: 'Exercise ID is required'
                });
                return;
            }

            const exercise = await ExerciseService.getExerciseById(id);

            if (!exercise) {
                res.status(404).json({
                    success: false,
                    data: null,
                    message: 'Exercise not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: exercise,
                message: 'Exercise retrieved successfully'
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get exercise by slug
     * @route GET /exercises/slug/:slug
     */
    static async getExerciseBySlug(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { slug } = req.params;

            if (!slug) {
                res.status(400).json({
                    success: false,
                    data: null,
                    message: 'Exercise slug is required'
                });
                return;
            }

            const exercise = await ExerciseService.getExerciseBySlug(slug);

            if (!exercise) {
                res.status(404).json({
                    success: false,
                    data: null,
                    message: 'Exercise not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: exercise,
                message: 'Exercise retrieved successfully'
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all exercises (không phân trang)
     * @route GET /exercises/all
     */
    static async getAllExercises(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const exercises = await ExerciseService.getAllExercises();

            res.status(200).json({
                success: true,
                data: exercises,
                message: 'All exercises retrieved successfully'
            });

        } catch (error) {
            next(error);
        }
    }
}