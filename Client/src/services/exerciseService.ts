/**
 * 💪 Exercise Service
 * API calls cho exercise operations với React Query integration
 */

import { Exercise, PaginatedResult } from '../types';
import { api } from './api';

export interface ExerciseListParams {
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

export class ExerciseService {
    /**
     * ✅ React Query: Get exercises với stable query key generation
     */
    static async getExercises(params: ExerciseListParams): Promise<PaginatedResult<Exercise>> {
        const response = await api.post<PaginatedResult<Exercise>>('/exercises/list', params);
        return response.data ?? { data: [], pagination: undefined, sort: undefined };
    }

    /**
     * ✅ React Query: Generate stable query key
     */
    static getExercisesQueryKey(params: ExerciseListParams): (string | ExerciseListParams)[] {
        return ['exercises', 'list', params];
    }

    /**
     * Search exercises by name - For autocomplete
     */
    static async searchExercises(query: string): Promise<Exercise[]> {
        const response = await this.getExercises({
            page: 1,
            limit: 10,
            filters: { search: query, isApproved: true }
        });
        return response.data;
    }

    /**
     * Get exercise by ID
     */
    static async getExercise(id: string): Promise<Exercise> {
        const response = await api.get<Exercise>(`/exercises/${id}`);
        if (!response.data) {
            throw new Error('Exercise not found');
        }
        return response.data;
    }

    /**
     * ✅ React Query: Generate stable query key for single exercise
     */
    static getExerciseQueryKey(id: string): (string | string)[] {
        return ['exercises', 'detail', id];
    }
}
