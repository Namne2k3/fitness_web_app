/**
 * 🏋️ My Workout Service
 * API service cho My Workouts functionality với React Query integration
 */

import { api } from './api';
import { Workout, WorkoutFilters } from '../types/workout.interface';
import { PaginatedResult, ApiResponse } from '../types/app.interface';

// ================================
// 📊 My Workout Stats Interface
// ================================
export interface MyWorkoutStats {
    totalWorkouts: number;
    totalPublicWorkouts: number;
    totalPrivateWorkouts: number;
    totalSponsoredWorkouts: number;
    totalLikes: number;
    totalSaves: number;
    totalViews: number;
    averageRating: number;
    completedWorkouts: number;
    totalCaloriesBurned: number;
    totalExerciseTime: number;
    monthlyProgress: Array<{
        month: string;
        workouts: number;
        calories: number;
    }>;
    categoryBreakdown: Array<{
        category: string;
        count: number;
    }>;
    difficultyBreakdown: Array<{
        difficulty: string;
        count: number;
    }>;
}

// ================================
// 📝 My Workout Filters Interface
// ================================
export interface MyWorkoutFilters extends WorkoutFilters {
    // Add specific filters for My Workouts
    status?: 'draft' | 'published' | 'archived';
    sponsorStatus?: 'sponsored' | 'not-sponsored' | 'all';
    socialFilter?: 'liked' | 'saved' | 'popular' | 'all';
}

// ================================
// 🔄 My Workout Service Class
// ================================
export class MyWorkoutService {
    private static readonly BASE_URL = '/workouts';

    /**
     * Get user's personal workouts với filtering và pagination
     * @param filters - Filter options for my workouts
     * @returns Paginated result với user workout stats
     */
    static async getMyWorkouts(
        filters: MyWorkoutFilters = {}
    ): Promise<PaginatedResult<Workout> & { userStats: MyWorkoutStats }> {
        try {
            const {
                page = 1,
                limit = 12,
                category,
                difficulty,
                tags,
                search,
                isPublic,
                sortBy = 'createdAt',
                sortOrder = 'desc',
                ...otherFilters
            } = filters;

            const requestBody = {
                page,
                limit,
                filters: {
                    ...(category && { category }),
                    ...(difficulty && { difficulty }),
                    ...(tags && { tags }),
                    ...(search && { search }),
                    ...(isPublic !== undefined && { includePrivate: !isPublic }),
                    ...otherFilters
                },
                sort: {
                    field: sortBy,
                    order: sortOrder
                },
                options: {
                    includeUserData: false, // We already know it's our workout
                    includeExerciseData: true // Include exercise details
                }
            };

            const response = await api.post(`${this.BASE_URL}/my-workouts`, requestBody);
            return response.data.data;

        } catch (error) {
            console.error('Error fetching my workouts:', error);
            throw new Error('Failed to fetch your workouts');
        }
    }

    /**
     * Get user workout statistics
     * @returns User workout statistics and analytics
     */
    static async getMyWorkoutStats(): Promise<MyWorkoutStats> {
        try {
            const response = await api.get(`${this.BASE_URL}/my-stats`);
            return response.data.data;

        } catch (error) {
            console.error('Error fetching workout stats:', error);
            throw new Error('Failed to fetch workout statistics');
        }
    }

    /**
     * Toggle like status for a workout
     * @param workoutId - Workout ID to toggle like
     * @returns Updated like status and count
     */
    static async toggleLike(workoutId: string): Promise<{
        isLiked: boolean;
        likeCount: number;
    }> {
        try {
            const response = await api.post(`${this.BASE_URL}/${workoutId}/like`);
            return response.data.data;

        } catch (error) {
            console.error('Error toggling workout like:', error);
            throw new Error('Failed to update like status');
        }
    }

    /**
     * Toggle save status for a workout
     * @param workoutId - Workout ID to toggle save
     * @returns Updated save status and count
     */
    static async toggleSave(workoutId: string): Promise<{
        isSaved: boolean;
        saveCount: number;
    }> {
        try {
            const response = await api.post(`${this.BASE_URL}/${workoutId}/save`);
            return response.data.data;

        } catch (error) {
            console.error('Error toggling workout save:', error);
            throw new Error('Failed to update save status');
        }
    }

    /**
     * Delete a workout (soft delete)
     * @param workoutId - Workout ID to delete
     * @returns Success confirmation
     */
    static async deleteWorkout(workoutId: string): Promise<{ success: boolean }> {
        try {
            const response = await api.delete(`${this.BASE_URL}/${workoutId}`);
            return response.data;

        } catch (error) {
            console.error('Error deleting workout:', error);
            throw new Error('Failed to delete workout');
        }
    }

    /**
     * Duplicate a workout
     * @param workoutId - Workout ID to duplicate
     * @returns Newly created workout copy
     */
    static async duplicateWorkout(workoutId: string): Promise<Workout> {
        try {
            const response = await api.post(`${this.BASE_URL}/${workoutId}/duplicate`);
            return response.data.data;

        } catch (error) {
            console.error('Error duplicating workout:', error);
            throw new Error('Failed to duplicate workout');
        }
    }

    /**
     * Get workout performance analytics
     * @param workoutId - Workout ID
     * @returns Performance analytics data
     */
    static async getWorkoutAnalytics(workoutId: string): Promise<{
        views: number;
        likes: number;
        saves: number;
        completions: number;
        rating: number;
        engagement: number;
        recentActivity: Array<{
            type: 'view' | 'like' | 'save' | 'complete';
            count: number;
            date: string;
        }>;
    }> {
        try {
            const response = await api.get(`${this.BASE_URL}/${workoutId}/analytics`);
            return response.data.data;

        } catch (error) {
            console.error('Error fetching workout analytics:', error);
            throw new Error('Failed to fetch workout analytics');
        }
    }
}

// ================================
// 🎯 Quick Filters for My Workouts
// ================================
export const MY_WORKOUT_QUICK_FILTERS = {
    ALL: { label: 'Tất cả', filters: {} },
    RECENT: {
        label: 'Gần đây',
        filters: { sortBy: 'createdAt', sortOrder: 'desc' }
    },
    POPULAR: {
        label: 'Phổ biến',
        filters: { sortBy: 'likeCount', sortOrder: 'desc' }
    },
    PUBLIC: {
        label: 'Công khai',
        filters: { isPublic: true }
    },
    PRIVATE: {
        label: 'Riêng tư',
        filters: { isPublic: false }
    },
    SPONSORED: {
        label: 'Tài trợ',
        filters: { sponsorStatus: 'sponsored' }
    }
} as const;

// ================================
// 📊 Category Icons & Colors
// ================================
export const WORKOUT_CATEGORY_CONFIG = {
    strength: {
        label: 'Sức mạnh',
        icon: '🏋️',
        color: '#1976d2',
        gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
    },
    cardio: {
        label: 'Tim mạch',
        icon: '🏃',
        color: '#f44336',
        gradient: 'linear-gradient(135deg, #f44336 0%, #ff7961 100%)'
    },
    flexibility: {
        label: 'Dẻo dai',
        icon: '🧘',
        color: '#4caf50',
        gradient: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
    },
    sports: {
        label: 'Thể thao',
        icon: '⚽',
        color: '#ff9800',
        gradient: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)'
    },
    yoga: {
        label: 'Yoga',
        icon: '🕉️',
        color: '#9c27b0',
        gradient: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)'
    },
    hiit: {
        label: 'HIIT',
        icon: '⚡',
        color: '#ff5722',
        gradient: 'linear-gradient(135deg, #ff5722 0%, #ff8a65 100%)'
    }
} as const;

// ================================
// 🎯 Difficulty Levels Config
// ================================
export const DIFFICULTY_CONFIG = {
    beginner: {
        label: 'Người mới',
        color: '#4caf50',
        icon: '🌱'
    },
    intermediate: {
        label: 'Trung cấp',
        color: '#ff9800',
        icon: '💪'
    },
    advanced: {
        label: 'Nâng cao',
        color: '#f44336',
        icon: '🔥'
    }
} as const;

// ================================
// 🏃 Workout Session Methods
// ================================

/**
 * Get a specific workout by ID
 */
export async function getWorkoutById(workoutId: string): Promise<Workout> {
    const response = await api.get<ApiResponse<Workout>>(`/workouts/${workoutId}`);

    if (!response.data?.data) {
        throw new Error('Workout not found');
    }

    return response.data.data;
}

/**
 * Save workout session data
 */
export interface WorkoutSessionData {
    workoutId: string;
    startTime: Date;
    endTime: Date;
    totalDuration: number;
    completedSets: Array<{
        exerciseIndex: number;
        setIndex: number;
        reps: number;
        weight: number;
        duration: number;
        completedAt: Date;
    }>;
    caloriesBurned: number;
    status: 'completed' | 'stopped';
}

export async function saveWorkoutSession(sessionData: WorkoutSessionData): Promise<void> {
    await api.post('/workout-sessions', sessionData);
}

/**
 * Get workout session history
 */
export async function getWorkoutSessions(): Promise<WorkoutSessionData[]> {
    const response = await api.get<ApiResponse<WorkoutSessionData[]>>('/workout-sessions');
    return response.data?.data || [];
}
