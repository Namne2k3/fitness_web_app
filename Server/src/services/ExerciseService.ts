/**
 * 💪 Exercise Service
 * Business logic cho exercise operations với advanced filtering và pagination
 */

import { ExerciseRepository } from '../repositories/ExerciseRepository';
import { FilterExercise } from '../controllers/ExerciseController';
import {
    Exercise,
    PaginatedResult
} from '../types';

export class ExerciseService {
    /**
     * Get exercises với advanced filtering, sorting và pagination
     * @param params Filter parameters từ controller
     * @returns Paginated exercise results
     */
    static async getExercises(params: FilterExercise): Promise<PaginatedResult<Exercise>> {
        try {
            // Delegate to repository
            return await ExerciseRepository.findExercises(params);
        } catch (error) {
            console.error('❌ Error getting exercises:', error);
            throw new Error('Failed to get exercises');
        }
    }

    /**
     * Get single exercise by ID
     * @param id Exercise ObjectId
     * @returns Exercise document
     */
    static async getExerciseById(id: string): Promise<Exercise | null> {
        try {
            return await ExerciseRepository.findById(id);
        } catch (error) {
            console.error('❌ Error getting exercise by ID:', error);
            throw new Error('Failed to get exercise');
        }
    }

    /**
     * Get single exercise by slug
     * @param slug Exercise slug
     * @returns Exercise document
     */
    static async getExerciseBySlug(slug: string): Promise<Exercise | null> {
        try {
            return await ExerciseRepository.findBySlug(slug);
        } catch (error) {
            console.error('❌ Error getting exercise by slug:', error);
            throw new Error('Failed to get exercise');
        }
    }

    /**
     * Create new exercise
     * @param exerciseData Exercise data
     * @returns Created exercise
     */
    static async createExercise(exerciseData: Partial<Exercise>): Promise<Exercise> {
        try {
            return await ExerciseRepository.create(exerciseData);
        } catch (error) {
            console.error('❌ Error creating exercise:', error);
            throw new Error('Failed to create exercise');
        }
    }

    /**
     * Update exercise
     * @param id Exercise ID
     * @param updateData Update data
     * @returns Updated exercise
     */
    static async updateExercise(id: string, updateData: Partial<Exercise>): Promise<Exercise | null> {
        try {
            return await ExerciseRepository.updateById(id, updateData);
        } catch (error) {
            console.error('❌ Error updating exercise:', error);
            throw new Error('Failed to update exercise');
        }
    }

    /**
     * Delete exercise
     * @param id Exercise ID
     * @returns Success status
     */
    static async deleteExercise(id: string): Promise<boolean> {
        try {
            return await ExerciseRepository.deleteById(id);
        } catch (error) {
            console.error('❌ Error deleting exercise:', error);
            throw new Error('Failed to delete exercise');
        }
    }

    /**
     * Get exercises by category
     * @param category Exercise category
     * @returns Exercises in category
     */
    static async getExercisesByCategory(category: string): Promise<Exercise[]> {
        try {
            return await ExerciseRepository.findByCategory(category);
        } catch (error) {
            console.error('❌ Error getting exercises by category:', error);
            throw new Error('Failed to get exercises by category');
        }
    }

    /**
     * Get exercises by muscle groups
     * @param muscleGroups Muscle groups
     * @returns Exercises targeting muscle groups
     */
    static async getExercisesByMuscleGroups(muscleGroups: string[]): Promise<Exercise[]> {
        try {
            return await ExerciseRepository.findByMuscleGroups(muscleGroups);
        } catch (error) {
            console.error('❌ Error getting exercises by muscle groups:', error);
            throw new Error('Failed to get exercises by muscle groups');
        }
    }

    /**
     * Get exercises by equipment
     * @param equipment Equipment list
     * @returns Exercises using equipment
     */
    static async getExercisesByEquipment(equipment: string[]): Promise<Exercise[]> {
        try {
            return await ExerciseRepository.findByEquipment(equipment);
        } catch (error) {
            console.error('❌ Error getting exercises by equipment:', error);
            throw new Error('Failed to get exercises by equipment');
        }
    }

    /**
     * Get exercises by IDs
     * @param ids Exercise IDs
     * @returns Exercises matching IDs
     */
    static async getExercisesByIds(ids: string[]): Promise<Exercise[]> {
        try {
            return await ExerciseRepository.findByIds(ids);
        } catch (error) {
            console.error('❌ Error getting exercises by IDs:', error);
            throw new Error('Failed to get exercises by IDs');
        }
    }

    /**
     * Count exercises with filters
     * @param filters Filter criteria
     * @returns Count of exercises
     */
    static async countExercises(filters: any = {}): Promise<number> {
        try {
            return await ExerciseRepository.count(filters);
        } catch (error) {
            console.error('❌ Error counting exercises:', error);
            throw new Error('Failed to count exercises');
        }
    }
}