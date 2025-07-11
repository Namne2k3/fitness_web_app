/**
 * 🏋️ My Workout Hooks (React Query version)
 * Đơn giản hóa: chỉ sử dụng React Query cho data fetching và mutation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MyWorkoutService, MyWorkoutFilters, MyWorkoutStats } from '../services/myWorkoutService';
import { PaginatedResult } from '../types/app.interface';
import { Workout } from '../types/workout.interface';
import { useOptimistic, useTransition } from 'react';

// ================================
// 📊 My Workout Stats Hook (React Query)
// ================================
export function useMyWorkoutStats() {
    return useQuery<MyWorkoutStats, Error>({
        queryKey: ['myWorkoutStats'],
        queryFn: () => MyWorkoutService.getMyWorkoutStats(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false
    });
}

// ================================
// 🏋️ My Workouts Data Hook (React Query)
// ================================
type MyWorkoutsResult = PaginatedResult<Workout> & { userStats: MyWorkoutStats };

export function useMyWorkouts(filters: MyWorkoutFilters = {}) {
    return useQuery<MyWorkoutsResult, Error>({
        queryKey: ['myWorkouts', filters],
        queryFn: () => MyWorkoutService.getMyWorkouts(filters),
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false
    });
}

// ================================
// 🗑️ Workout Mutations (delete/duplicate)
// ================================
export function useWorkoutDelete() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (workoutId: string) => MyWorkoutService.deleteWorkout(workoutId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myWorkouts'] });
            queryClient.invalidateQueries({ queryKey: ['myWorkoutStats'] });
        }
    });
}

export function useWorkoutDuplicate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (workoutId: string) => MyWorkoutService.duplicateWorkout(workoutId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myWorkouts'] });
            queryClient.invalidateQueries({ queryKey: ['myWorkoutStats'] });
        }
    });
}

// ================================
// ❤️ Like/Save Mutations (no optimistic)
// ================================
export function useWorkoutLike() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (workoutId: string) => MyWorkoutService.toggleLike(workoutId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myWorkouts'] });
            queryClient.invalidateQueries({ queryKey: ['myWorkoutStats'] });
        }
    });
}

export function useWorkoutSave() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (workoutId: string) => MyWorkoutService.toggleSave(workoutId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myWorkouts'] });
        }
    });
}

/**
 * ❤️ useWorkoutLikeSave (Optimistic Updates)
 * Kết hợp like/save state với optimistic update cho UX mượt mà (React 19 style)
 */

/**
 * @param workoutId - ID của workout
 * @param initial - { likes, saves, likeCount, saveCount }
 */
export function useWorkoutLikeSave(
    workoutId: string,
    initial: {
        likes: string[];
        saves: string[];
        likeCount: number;
        saveCount: number;
    }
) {
    const [isPending, startTransition] = useTransition();

    // Optimistic state: { likes, saves, likeCount, saveCount }
    const [optimisticState, updateOptimistic] = useOptimistic(
        initial,
        (state, action: { type: 'like' | 'save'; userId: string }) => {
            if (action.type === 'like') {
                const hasLiked = state.likes.includes(action.userId);
                return {
                    ...state,
                    likes: hasLiked
                        ? state.likes.filter((id) => id !== action.userId)
                        : [...state.likes, action.userId],
                    likeCount: hasLiked
                        ? state.likeCount - 1
                        : state.likeCount + 1
                };
            }
            if (action.type === 'save') {
                const hasSaved = state.saves.includes(action.userId);
                return {
                    ...state,
                    saves: hasSaved
                        ? state.saves.filter((id) => id !== action.userId)
                        : [...state.saves, action.userId],
                    saveCount: hasSaved
                        ? state.saveCount - 1
                        : state.saveCount + 1
                };
            }
            return state;
        }
    );

    // Lấy userId từ localStorage hoặc context (tùy app)
    const userId = localStorage.getItem('userId') || '';

    // Like handler (optimistic)
    const toggleLike = () => {
        updateOptimistic({ type: 'like', userId });
        startTransition(async () => {
            try {
                await MyWorkoutService.toggleLike(workoutId);
            } catch {
                // React sẽ tự revert optimistic update nếu lỗi
            }
        });
    };

    // Save handler (optimistic)
    const toggleSave = () => {
        updateOptimistic({ type: 'save', userId });
        startTransition(async () => {
            try {
                await MyWorkoutService.toggleSave(workoutId);
            } catch {
                // React sẽ tự revert optimistic update nếu lỗi
            }
        });
    };

    return {
        optimisticState,
        toggleLike,
        toggleSave,
        isPending
    };
}