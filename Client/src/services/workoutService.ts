/**
 * 🏋️ Workout Service - React 19 Implementation
 * API calls cho workout operations với advanced filtering
 */

import { DifficultyLevel, Workout, WorkoutCategory, WorkoutExercise } from '../types/workout.interface';
import { api } from './api';

export interface WorkoutFilters {
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
}

export interface WorkoutListParams {
    page?: number;
    limit?: number;
    filters?: WorkoutFilters;
    sort?: { field: string; order: 'asc' | 'desc' };
    options?: {
        includeUserData?: boolean;
        includeExerciseData?: boolean;
    };
}

export interface WorkoutListResponse {
    data: Workout[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
    filters?: WorkoutFilters;
    sort?: { field: string; order: 'asc' | 'desc' };
}

/**
 * Workout Service Class với React 19 patterns
 */
export class WorkoutService {    /**
     * Create a new workout
     * Returns Promise cho useMutation hook
     */
    static async createWorkout(workoutData: {
        status: string;
        name: string;
        description: string;
        thumbnail?: string;
        category: WorkoutCategory;
        difficulty: DifficultyLevel;
        estimatedDuration: number;
        tags: string[];
        isPublic: boolean;
        muscleGroups: string[];
        equipment: string[];
        caloriesBurned: number;
        exercises: WorkoutExercise[];
    }): Promise<Workout> {
        try {
            // ✅ In development, create mock workout response
            // if (import.meta.env.DEV) {
            //     console.log('🔗 WorkoutService.createWorkout (DEV MODE - Mock Response):', workoutData);                // Create mock workout that matches Workout interface
            //     const mockWorkout: Workout = {
            //         _id: `workout_${Date.now()}`,
            //         userId: 'current_user_id', // In real app, get from auth context
            //         name: workoutData.name,
            //         description: workoutData.description,
            //         category: workoutData.category,
            //         difficulty: workoutData.difficulty,
            //         estimatedDuration: workoutData.estimatedDuration,
            //         tags: workoutData.tags,
            //         isPublic: workoutData.isPublic,
            //         exercises: workoutData.exercises,
            //         muscleGroups: workoutData.muscleGroups,
            //         equipment: workoutData.equipment,
            //         caloriesBurned: workoutData.caloriesBurned,
            //         views: 0,
            //         completions: 0,
            //         averageRating: 0,
            //         totalRatings: 0,
            //         likeCount: 0,
            //         saveCount: 0,
            //         shares: 0,
            //         isSponsored: false,
            //         createdAt: new Date(),
            //         updatedAt: new Date()
            //     };

            //     // Simulate API delay
            //     await new Promise(resolve => setTimeout(resolve, 1000));

            //     return mockWorkout;
            // }

            console.log("🔗 WorkoutService.createWorkout (API Call):", workoutData);
            const response = await api.post<Workout>('/workouts', workoutData);
            // const response = { success: false, data: null, error: 'mock' };
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to create workout');
            }

            return response.data;
        } catch (error) {
            console.error('❌ WorkoutService.createWorkout Error:', error);
            throw error instanceof Error ? error : new Error('Failed to create workout');
        }
    }/**
     * Get workouts với advanced filtering và pagination
     * Returns Promise cho use() hook
     */
    static async getWorkouts(params: WorkoutListParams = {}): Promise<WorkoutListResponse> {
        try {
            // ✅ In development, use mock data first để tránh API calls liên tục
            // if (import.meta.env.DEV) {
            //     console.log('🔗 WorkoutService.getWorkouts (DEV MODE - Using Mock Data):', params);
            //     return this.getMockWorkouts(params);
            // }

            const requestBody: WorkoutListParams = {
                page: 1,
                limit: 12,
                sort: { field: 'createdAt', order: 'desc' },
                options: {
                    includeUserData: true,
                    includeExerciseData: false
                },
                ...params
            }; const response = await api.post<WorkoutListResponse>('/workouts/list', requestBody);

            // Type assertion for API response
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to fetch workouts');
            }

            // Transform server response to match client expectations
            const serverData = response.data;
            return {
                data: serverData.data || [],
                pagination: {
                    currentPage: serverData.pagination.currentPage || 1,
                    totalPages: serverData.pagination.totalPages || 1,
                    totalItems: serverData.pagination.totalItems || 0,
                    itemsPerPage: serverData.pagination.itemsPerPage || 12,
                    hasNextPage: serverData.pagination.hasNextPage || false,
                    hasPrevPage: serverData.pagination.hasPrevPage || false
                }
            };
        } catch (error) {
            console.error('❌ WorkoutService.getWorkouts failed:', error);

            // Fallback to mock data in development
            // if (import.meta.env.DEV) {
            //     console.warn('API call failed, using mock data for development');
            //     return this.getMockWorkouts(params);
            // }

            throw new Error(
                error instanceof Error ? error.message : 'Failed to fetch workouts'
            );
        }
    }

    /**
     * Get workout by ID
     */
    static async getWorkoutById(workoutId: string): Promise<Workout> {
        try {
            const response = await api.get<Workout>(`/workouts/${workoutId}`);

            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to fetch workout');
            }

            // Transform server data to client format if needed
            const serverData = response.data;

            const workout: Workout = {
                _id: serverData._id,
                userId: serverData.userId,
                name: serverData.name,
                description: serverData.description || '',
                thumbnail: serverData.thumbnail || '',
                category: serverData.category || '',
                difficulty: serverData.difficulty,
                estimatedDuration: serverData.estimatedDuration || 0,
                tags: serverData.tags || [],
                isPublic: serverData.isPublic || false,
                exercises: serverData.exercises || [],
                isSponsored: serverData.isSponsored || false,
                sponsorData: serverData.sponsorData,
                likes: serverData.likes || [],
                likeCount: serverData.likeCount || 0,
                saves: serverData.saves || [],
                saveCount: serverData.saveCount || 0,
                shares: serverData.shares || 0,
                views: serverData.views || 0,
                completions: serverData.completions || 0,
                averageRating: serverData.averageRating || 0,
                totalRatings: serverData.totalRatings || 0,
                muscleGroups: serverData.muscleGroups || [],
                equipment: serverData.equipment || [],
                caloriesBurned: serverData.caloriesBurned || 0,
                createdAt: new Date(serverData.createdAt),
                updatedAt: new Date(serverData.updatedAt),
                authorInfo: serverData.authorInfo
            };

            return workout;
        } catch (error) {
            console.error('❌ WorkoutService.getWorkoutById failed:', error);
            throw new Error(
                error instanceof Error ? error.message : 'Failed to fetch workout'
            );
        }
    }

    /**
     * Search workouts (for autocomplete/suggestions)
     */
    static async searchWorkouts(query: string, limit: number = 5): Promise<Workout[]> {
        try {
            const params: WorkoutListParams = {
                page: 1,
                limit,
                filters: { search: query },
                sort: { field: 'averageRating', order: 'desc' }
            };

            const response = await this.getWorkouts(params);
            return response.data;
        } catch (error) {
            console.error('❌ WorkoutService.searchWorkouts failed:', error);
            return []; // Return empty array on search failure
        }
    }

    /**
     * Get trending workouts
     */
    static async getTrendingWorkouts(limit: number = 6): Promise<Workout[]> {
        try {
            const params: WorkoutListParams = {
                page: 1,
                limit,
                sort: { field: 'views', order: 'desc' },
                filters: { isSponsored: false }
            };

            const response = await this.getWorkouts(params);
            return response.data;
        } catch (error) {
            console.error('❌ WorkoutService.getTrendingWorkouts failed:', error);
            return [];
        }
    }

    /**
     * Get sponsored workouts
     */
    static async getSponsoredWorkouts(limit: number = 3): Promise<Workout[]> {
        try {
            const params: WorkoutListParams = {
                page: 1,
                limit,
                sort: { field: 'createdAt', order: 'desc' },
                filters: { isSponsored: true }
            };

            const response = await this.getWorkouts(params);
            return response.data;
        } catch (error) {
            console.error('❌ WorkoutService.getSponsoredWorkouts failed:', error);
            return [];
        }
    }

    /**
     * Toggle workout like (for useOptimistic)
     */
    static async toggleLike(workoutId: string): Promise<{ liked: boolean; likeCount: number }> {
        try {
            const response = await api.post<{ liked: boolean; likeCount: number }>(
                `/workouts/${workoutId}/like`
            );

            if (!response.success) {
                throw new Error(response.error || 'Failed to toggle like');
            }

            return response.data as { liked: boolean; likeCount: number };
        } catch (error) {
            console.error('❌ WorkoutService.toggleLike failed:', error);
            throw error;
        }
    }    /**
     * Toggle workout save (for useOptimistic)
     */
    static async toggleSave(workoutId: string): Promise<{ saved: boolean; saveCount: number }> {
        try {
            const response = await api.post<{ saved: boolean; saveCount: number }>(
                `/workouts/${workoutId}/save`
            );

            if (!response.success) {
                throw new Error(response.error || 'Failed to toggle save');
            }

            return response.data as { saved: boolean; saveCount: number };
        } catch (error) {
            console.error('❌ WorkoutService.toggleSave failed:', error);
            throw error;
        }
    }

    /**
     * Mock data for development fallback
     */
    // private static getMockWorkouts(params: WorkoutListParams): WorkoutListResponse {
    //     const mockWorkouts: Workout[] = [
    //         {
    //             _id: 'mock-1',
    //             name: 'Morning Cardio Blast',
    //             description: 'High-intensity morning workout to kickstart your day',
    //             category: 'cardio',
    //             difficulty: 'intermediate' as DifficultyLevel,
    //             estimatedDuration: 30,
    //             exercises: [
    //                 {
    //                     exerciseId: 'ex-1',
    //                     order: 1,
    //                     sets: 3,
    //                     reps: 15,
    //                     duration: 0,
    //                     weight: 0,
    //                     restTime: 60,
    //                     notes: 'Keep your core tight',
    //                     completed: false
    //                 }
    //             ],
    //             muscleGroups: ['cardio', 'full-body'],
    //             equipment: ['none'],
    //             tags: ['morning', 'cardio', 'beginner-friendly'],
    //             isPublic: true,
    //             isSponsored: false,
    //             likes: [],
    //             likeCount: 45,
    //             saves: [],
    //             saveCount: 23,
    //             shares: 12,
    //             views: 1250,
    //             completions: 89,
    //             averageRating: 4.5,
    //             totalRatings: 67,
    //             caloriesBurned: 280,
    //             createdAt: new Date('2024-01-15'),
    //             updatedAt: new Date('2024-01-15'),
    //             userId: 'user-1'
    //         },
    //         {
    //             _id: 'mock-2',
    //             name: 'Strength Training Fundamentals',
    //             description: 'Learn the basics of strength training with proper form',
    //             category: 'strength',
    //             difficulty: 'beginner' as DifficultyLevel,
    //             estimatedDuration: 45,
    //             exercises: [
    //                 {
    //                     exerciseId: 'ex-2',
    //                     order: 1,
    //                     sets: 3,
    //                     reps: 10,
    //                     duration: 0,
    //                     weight: 20,
    //                     restTime: 90,
    //                     notes: 'Focus on form over weight',
    //                     completed: false
    //                 }
    //             ],
    //             muscleGroups: ['chest', 'arms', 'core'],
    //             equipment: ['dumbbells', 'bench'],
    //             tags: ['strength', 'beginner', 'fundamentals'],
    //             isPublic: true,
    //             isSponsored: true,
    //             sponsorData: {
    //                 sponsorId: 'sponsor-1',
    //                 campaignId: 'campaign-1',
    //                 rate: 250,
    //                 type: 'guide',
    //                 disclosure: 'This workout is sponsored by FitGear Pro'
    //             },
    //             likes: [],
    //             likeCount: 78,
    //             saves: [],
    //             saveCount: 45,
    //             shares: 23,
    //             views: 2100,
    //             completions: 156,
    //             averageRating: 4.8,
    //             totalRatings: 89,
    //             caloriesBurned: 320,
    //             createdAt: new Date('2024-01-10'),
    //             updatedAt: new Date('2024-01-12'),
    //             userId: 'user-2'
    //         }
    //     ];

    //     // Apply filters to mock data
    //     let filteredWorkouts = [...mockWorkouts];

    //     if (params.filters?.search) {
    //         const searchTerm = params.filters.search.toLowerCase(); filteredWorkouts = filteredWorkouts.filter(w =>
    //             w.name.toLowerCase().includes(searchTerm) ||
    //             (w.description?.toLowerCase().includes(searchTerm) || false)
    //         );
    //     }

    //     if (params.filters?.category) {
    //         filteredWorkouts = filteredWorkouts.filter(w => w.category === params.filters?.category);
    //     }

    //     if (params.filters?.difficulty) {
    //         filteredWorkouts = filteredWorkouts.filter(w => w.difficulty === params.filters?.difficulty);
    //     }

    //     if (params.filters?.isSponsored !== undefined) {
    //         filteredWorkouts = filteredWorkouts.filter(w => w.isSponsored === params.filters?.isSponsored);
    //     }

    //     // Apply pagination
    //     const page = params.page || 1;
    //     const limit = params.limit || 12;
    //     const startIndex = (page - 1) * limit;
    //     const endIndex = startIndex + limit;
    //     const paginatedWorkouts = filteredWorkouts.slice(startIndex, endIndex);

    //     return {
    //         data: paginatedWorkouts,
    //         pagination: {
    //             currentPage: page,
    //             totalPages: Math.ceil(filteredWorkouts.length / limit),
    //             totalItems: filteredWorkouts.length,
    //             itemsPerPage: limit,
    //             hasNextPage: endIndex < filteredWorkouts.length,
    //             hasPrevPage: page > 1
    //         }
    //     };
    // }

    /**
     * Toggle like for workout - Mock implementation for now
     * TODO: Replace with actual API call when backend is ready
     */
    // static async toggleLike(workoutId: string): Promise<void> {
    //     try {
    //         // TODO: Implement actual API call
    //         // await api.post(`/workouts/${workoutId}/like`);

    //         // Mock implementation
    //         await new Promise(resolve => setTimeout(resolve, 200));
    //         console.log(`Toggled like for workout: ${workoutId}`);
    //     } catch (error) {
    //         console.error('❌ WorkoutService.toggleLike failed:', error);
    //         throw new Error('Failed to toggle like');
    //     }
    // }

    /**
     * Toggle save for workout - Mock implementation for now
     * TODO: Replace with actual API call when backend is ready
     */
    // static async toggleSave(workoutId: string): Promise<void> {
    //     try {
    //         // TODO: Implement actual API call
    //         // await api.post(`/workouts/${workoutId}/save`);

    //         // Mock implementation
    //         await new Promise(resolve => setTimeout(resolve, 200));
    //         console.log(`Toggled save for workout: ${workoutId}`);
    //     } catch (error) {
    //         console.error('❌ WorkoutService.toggleSave failed:', error);
    //         throw new Error('Failed to toggle save');
    //     }
    // }
}

export default WorkoutService;