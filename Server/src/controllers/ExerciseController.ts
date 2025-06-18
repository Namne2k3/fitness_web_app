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
    }
}