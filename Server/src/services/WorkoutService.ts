/**
 * 🏋️ Workout Service
 * Business logic cho workout operations với Repository pattern
 */

import mongoose from 'mongoose';
import { IWorkout } from '../models/Workout';
import { WorkoutRepository } from '../repositories/WorkoutRepository';
import { FilterWorkout } from '../controllers/WorkoutController';
import { CreateWorkoutDtoInput } from '../dtos/CreateWorkoutDto';
import {
    Workout,
    WorkoutExercise,
    Exercise,
    PaginatedResult
} from '../types';

/**
 * Input interface for creating a workout (without Mongoose Document properties)
 */
export interface CreateWorkoutInput extends Omit<CreateWorkoutDtoInput, 'userId'> {
    userId: string;
}

export class WorkoutService {
    /**
     * Get workouts với advanced filtering, sorting và pagination
     * @param params Filter parameters từ controller
     * @returns Paginated workout results
     */
    static async getWorkouts(params: FilterWorkout): Promise<PaginatedResult<Workout>> {
        try {
            // Delegate to repository
            const result = await WorkoutRepository.findWorkouts(params);

            // Transform to type and return
            return {
                data: result.data.map(workout => this.transformWorkoutToType(workout, params.options)),
                pagination: result.pagination,
                filters: result.filters,
                sort: result.sort || { field: 'createdAt', order: 'desc' }
            };
        } catch (error) {
            console.error('❌ Error getting workouts:', error);
            throw new Error('Failed to get workouts');
        }
    }

    /**
     * Create a new workout
     * @param workoutData Workout data to create
     * @returns Created workout
     */
    static async createWorkout(workoutData: CreateWorkoutInput): Promise<Workout> {
        try {
            // Validate input
            this.validateWorkoutInput(workoutData);

            // Transform input for repository
            const workoutInput = {
                ...workoutData,
                userId: new mongoose.Types.ObjectId(workoutData.userId),
                createdAt: new Date(),
                updatedAt: new Date(),
                // Default values
                isPublic: workoutData.isPublic ?? false,
                isSponsored: false, // Default to false, not sponsored
                likes: [],
                saves: [],
                views: 0,
                completions: 0,
                averageRating: 0,
                totalRatings: 0
            };

            // Create workout via repository
            const newWorkout = await WorkoutRepository.create(workoutInput);

            // Transform to type and return
            const options = { includeExerciseData: true, includeUserData: false };
            return this.transformWorkoutToType(newWorkout, options);
        } catch (error) {
            console.error('❌ Error creating workout:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to create workout');
        }
    }

    /**
     * Get workout by ID với options
     * @param workoutId Workout ID
     * @param options Query options
     * @returns Workout or null
     */
    static async getWorkoutById(
        workoutId: string,
        options: {
            includeUserData?: boolean;
            includeExerciseData?: boolean;
            includeAnalytics?: boolean;
        } = {}
    ): Promise<Workout | null> {
        try {
            const workout = await WorkoutRepository.findByIdWithOptions(workoutId, options);

            if (!workout) {
                return null;
            }

            return this.transformWorkoutToType(workout, options);
        } catch (error) {
            console.error('❌ Error getting workout by ID:', error);
            throw new Error('Failed to get workout');
        }
    }

    /**
     * Update workout by ID
     * @param workoutId Workout ID
     * @param updateData Update data
     * @returns Updated workout or null
     */
    static async updateWorkout(
        workoutId: string,
        updateData: Partial<CreateWorkoutInput>
    ): Promise<Workout | null> {
        try {
            // Add updatedAt timestamp
            const dataWithTimestamp = {
                ...updateData,
                updatedAt: new Date()
            };

            const updatedWorkout = await WorkoutRepository.updateById(workoutId, dataWithTimestamp);

            if (!updatedWorkout) {
                return null;
            }

            const options = { includeExerciseData: true, includeUserData: false };
            return this.transformWorkoutToType(updatedWorkout, options);
        } catch (error) {
            console.error('❌ Error updating workout:', error);
            throw new Error('Failed to update workout');
        }
    }

    /**
     * Delete workout by ID
     * @param workoutId Workout ID
     * @returns Boolean indicating success
     */
    static async deleteWorkout(workoutId: string): Promise<boolean> {
        try {
            return await WorkoutRepository.deleteById(workoutId);
        } catch (error) {
            console.error('❌ Error deleting workout:', error);
            throw new Error('Failed to delete workout');
        }
    }

    /**
     * Get workouts by user ID
     * @param userId User ID
     * @returns User's workouts
     */
    static async getUserWorkouts(userId: string): Promise<Workout[]> {
        try {
            const workouts = await WorkoutRepository.findByUserId(userId);
            const options = { includeExerciseData: true, includeUserData: false };
            return workouts.map(workout => this.transformWorkoutToType(workout, options));
        } catch (error) {
            console.error('❌ Error getting user workouts:', error);
            throw new Error('Failed to get user workouts');
        }
    }

    /**
     * Get public workouts
     * @returns Public workouts
     */
    static async getPublicWorkouts(): Promise<Workout[]> {
        try {
            const workouts = await WorkoutRepository.findPublicWorkouts();
            const options = { includeExerciseData: true, includeUserData: false };
            return workouts.map(workout => this.transformWorkoutToType(workout, options));
        } catch (error) {
            console.error('❌ Error getting public workouts:', error);
            throw new Error('Failed to get public workouts');
        }
    }

    /**
     * Get sponsored workouts
     * @returns Sponsored workouts
     */
    static async getSponsoredWorkouts(): Promise<Workout[]> {
        try {
            const workouts = await WorkoutRepository.findSponsoredWorkouts();
            const options = { includeExerciseData: true, includeUserData: false };
            return workouts.map(workout => this.transformWorkoutToType(workout, options));
        } catch (error) {
            console.error('❌ Error getting sponsored workouts:', error);
            throw new Error('Failed to get sponsored workouts');
        }
    }

    /**
     * Get popular workouts
     * @param limit Number of workouts to return
     * @returns Popular workouts
     */
    static async getPopularWorkouts(limit: number = 10): Promise<Workout[]> {
        try {
            const workouts = await WorkoutRepository.findPopularWorkouts(limit);
            const options = { includeExerciseData: true, includeUserData: false };
            return workouts.map(workout => this.transformWorkoutToType(workout, options));
        } catch (error) {
            console.error('❌ Error getting popular workouts:', error);
            throw new Error('Failed to get popular workouts');
        }
    }

    /**
     * Get workout statistics for user
     * @param userId User ID
     * @returns User workout statistics
     */
    static async getUserWorkoutStats(userId: string): Promise<any> {
        try {
            return await WorkoutRepository.getUserStats(userId);
        } catch (error) {
            console.error('❌ Error getting user workout stats:', error);
            throw new Error('Failed to get user workout statistics');
        }
    }

    /**
     * Toggle like on workout
     * @param workoutId Workout ID
     * @param userId User ID
     * @returns Like status and count
     */
    static async toggleLike(workoutId: string, userId: string): Promise<{ isLiked: boolean; likeCount: number }> {
        try {
            return await WorkoutRepository.toggleLike(workoutId, userId);
        } catch (error) {
            console.error('❌ Error toggling workout like:', error);
            throw new Error('Failed to toggle workout like');
        }
    }

    /**
     * Toggle save on workout
     * @param workoutId Workout ID
     * @param userId User ID
     * @returns Save status and count
     */
    static async toggleSave(workoutId: string, userId: string): Promise<{ isSaved: boolean; saveCount: number }> {
        try {
            return await WorkoutRepository.toggleSave(workoutId, userId);
        } catch (error) {
            console.error('❌ Error toggling workout save:', error);
            throw new Error('Failed to toggle workout save');
        }
    }

    /**
     * Increment workout views
     * @param workoutId Workout ID
     */
    static async incrementViews(workoutId: string): Promise<void> {
        try {
            await WorkoutRepository.incrementViews(workoutId);
        } catch (error) {
            console.error('❌ Error incrementing workout views:', error);
            // Don't throw error for analytics - fail silently
        }
    }

    /**
     * Increment workout completions
     * @param workoutId Workout ID
     */
    static async incrementCompletions(workoutId: string): Promise<void> {
        try {
            await WorkoutRepository.incrementCompletions(workoutId);
        } catch (error) {
            console.error('❌ Error incrementing workout completions:', error);
            // Don't throw error for analytics - fail silently
        }
    }

    /**
     * Count workouts with filters
     * @param filters Filter criteria
     * @returns Workout count
     */
    static async getWorkoutCount(filters: any = {}): Promise<number> {
        try {
            return await WorkoutRepository.count(filters);
        } catch (error) {
            console.error('❌ Error counting workouts:', error);
            throw new Error('Failed to count workouts');
        }
    }

    /**
     * Get user's workouts for MyWorkout page with enhanced data
     */
    static async getMyWorkouts(
        userId: string,
        params: {
            page?: number;
            limit?: number;
            category?: string;
            difficulty?: string;
            search?: string;
        }
    ): Promise<PaginatedResult<Workout>> {
        try {
            // Build filters object only with defined values
            const filters: any = {
                userId,
                includePrivate: true // Include user's private workouts
            };

            if (params.category) filters.category = params.category;
            if (params.difficulty) filters.difficulty = params.difficulty;
            if (params.search) filters.search = params.search;

            // Use the existing repository method with proper filtering
            const filterParams: FilterWorkout = {
                page: params.page || 1,
                limit: params.limit || 12,
                filters,
                sort: { field: 'createdAt', order: 'desc' }
            };

            const result = await WorkoutRepository.findWorkouts(filterParams);

            return {
                data: result.data.map(workout => this.transformWorkoutToType(workout, { includeExerciseData: true })),
                pagination: result.pagination,
                filters: result.filters,
                sort: result.sort || { field: 'createdAt', order: 'desc' }
            };
        } catch (error) {
            console.error('❌ Error getting user workouts:', error);
            throw new Error('Failed to get user workouts');
        }
    }

    /**
     * Get user's workout statistics - alias for getUserWorkoutStats
     */
    static async getMyWorkoutStats(userId: string) {
        return await this.getUserWorkoutStats(userId);
    }

    /**
     * Duplicate workout for user
     */
    static async duplicateWorkout(workoutId: string, userId: string): Promise<Workout> {
        try {
            const originalWorkout = await WorkoutRepository.findById(workoutId);

            if (!originalWorkout) {
                throw new Error('Workout not found');
            }

            // Create duplicate workout data
            const duplicateData = {
                name: `${originalWorkout.name} (Copy)`,
                description: originalWorkout.description,
                category: originalWorkout.category,
                difficulty: originalWorkout.difficulty,
                estimatedDuration: originalWorkout.estimatedDuration,
                exercises: originalWorkout.exercises,
                muscleGroups: originalWorkout.muscleGroups,
                equipment: originalWorkout.equipment,
                tags: originalWorkout.tags,
                caloriesBurned: originalWorkout.caloriesBurned,
                userId: new mongoose.Types.ObjectId(userId),
                isPublic: false, // Make copy private by default
                isSponsored: false,
                likes: [],
                saves: [],
                views: 0,
                completions: 0,
                averageRating: 0,
                totalRatings: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const duplicatedWorkout = await WorkoutRepository.create(duplicateData);
            const options = { includeExerciseData: true, includeUserData: false };
            return this.transformWorkoutToType(duplicatedWorkout, options);

        } catch (error) {
            console.error('❌ Error duplicating workout:', error);
            throw new Error('Failed to duplicate workout');
        }
    }

    // ===================================
    // 🔧 PRIVATE HELPER METHODS
    // ===================================

    /**
     * Transform IWorkout to Workout type với exercise data processing
     * @param workout Mongoose IWorkout document
     * @param options Transform options
     * @returns Workout type
     */
    private static transformWorkoutToType(workout: IWorkout, options: {
        includeExerciseData?: boolean;
        includeUserData?: boolean;
    } = {}): Workout {
        const workoutObj = workout.toObject ? workout.toObject() : workout;

        // Process exercises nếu có exercise data được populate
        let exercises = workoutObj.exercises || [];

        if (options.includeExerciseData && Array.isArray(exercises)) {
            // Case 1: Nếu có exerciseDetails từ aggregation (workoutObj.exerciseDetails)
            if (workoutObj.exerciseDetails && Array.isArray(workoutObj.exerciseDetails)) {
                exercises = exercises.map((ex: any) => {
                    const exerciseDetail = workoutObj.exerciseDetails.find(
                        (detail: any) => detail._id.toString() === ex.exerciseId.toString()
                    );

                    return {
                        ...ex,
                        exerciseInfo: exerciseDetail ? {
                            ...exerciseDetail,
                            _id: exerciseDetail._id?.toString?.() || exerciseDetail._id
                        } : null
                    };
                });
            }
            // Case 2: Nếu exerciseId đã được populate (từ findByIdWithOptions)
            else {
                exercises = exercises.map((ex: any) => {
                    let exerciseInfo = null;

                    // Nếu exerciseId đã được populate (là object chứ không phải string)
                    if (ex.exerciseId && typeof ex.exerciseId === 'object' && ex.exerciseId._id) {
                        const exerciseData = ex.exerciseId.toObject ? ex.exerciseId.toObject() : ex.exerciseId;
                        // Loại bỏ __v và các trường không cần thiết
                        if ('__v' in exerciseData) delete exerciseData.__v;

                        exerciseInfo = {
                            ...exerciseData,
                            _id: exerciseData._id?.toString?.() || exerciseData._id
                        };
                    }

                    return {
                        ...ex,
                        exerciseId: typeof ex.exerciseId === 'object' && ex.exerciseId._id
                            ? ex.exerciseId._id.toString()
                            : ex.exerciseId,
                        exerciseInfo
                    };
                });
            }
        }

        // Process author info nếu có user data được populate
        let authorInfo = undefined;
        if (
            options.includeUserData &&
            workoutObj.userId &&
            typeof workoutObj.userId === 'object' &&
            ('username' in workoutObj.userId || 'profile' in workoutObj.userId)
        ) {
            const userData: any = workoutObj.userId;
            authorInfo = {
                _id: userData._id?.toString?.() || userData._id,
                username: userData.username || '',
                fullName: `${userData.profile?.firstName || ''} ${userData.profile?.lastName || ''}`.trim(),
                avatar: userData.profile?.avatar || '',
                experienceLevel: userData.profile?.experienceLevel || '',
                isEmailVerified: userData.isEmailVerified ?? false
            };
        }

        const transformedWorkout = {
            _id: workoutObj._id?.toString?.() || workoutObj._id,
            userId: typeof workoutObj.userId === 'object' && '_id' in workoutObj.userId
                ? (workoutObj.userId._id?.toString?.() || workoutObj.userId._id)
                : workoutObj.userId,
            name: workoutObj.name,
            description: workoutObj.description,
            thumbnail: workoutObj.thumbnail,
            category: workoutObj.category,
            difficulty: workoutObj.difficulty,
            estimatedDuration: workoutObj.estimatedDuration,
            exercises,
            muscleGroups: workoutObj.muscleGroups || [],
            equipment: workoutObj.equipment || [],
            tags: workoutObj.tags || [],
            isPublic: workoutObj.isPublic || false,
            isSponsored: workoutObj.isSponsored || false,
            sponsorData: workoutObj.sponsorData,
            likes: workoutObj.likes || [],
            saves: workoutObj.saves || [],
            views: workoutObj.views || 0,
            completions: workoutObj.completions || 0,
            averageRating: workoutObj.averageRating || 0,
            totalRatings: workoutObj.totalRatings || 0,
            caloriesBurned: workoutObj.caloriesBurned,
            createdAt: workoutObj.createdAt,
            updatedAt: workoutObj.updatedAt,
            ...(authorInfo && { authorInfo })
        };

        // Clean up temporary fields from aggregation - exerciseDetails not needed in response
        return transformedWorkout;
    }

    /**
     * Validate workout input data
     * @param workoutData Workout data to validate
     */
    private static validateWorkoutInput(workoutData: CreateWorkoutInput): void {
        if (!workoutData.name || workoutData.name.trim().length === 0) {
            throw new Error('Workout name is required');
        }

        if (!workoutData.userId) {
            throw new Error('User ID is required');
        }

        if (!mongoose.Types.ObjectId.isValid(workoutData.userId)) {
            throw new Error('Invalid user ID format');
        }

        if (!workoutData.exercises || workoutData.exercises.length === 0) {
            throw new Error('At least one exercise is required');
        }

        // Validate each exercise
        workoutData.exercises.forEach((exercise, index) => {
            if (!exercise.exerciseId) {
                throw new Error(`Exercise ${index + 1}: Exercise ID is required`);
            }

            if (!mongoose.Types.ObjectId.isValid(exercise.exerciseId)) {
                throw new Error(`Exercise ${index + 1}: Invalid exercise ID format`);
            }

            if (exercise.sets !== undefined && exercise.sets < 1) {
                throw new Error(`Exercise ${index + 1}: Sets must be at least 1`);
            }

            if (exercise.reps !== undefined && exercise.reps < 1) {
                throw new Error(`Exercise ${index + 1}: Reps must be at least 1`);
            }
        });

        if (workoutData.estimatedDuration !== undefined && workoutData.estimatedDuration < 1) {
            throw new Error('Estimated duration must be at least 1 minute');
        }
    }
}