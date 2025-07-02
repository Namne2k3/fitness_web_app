/**
 * 🎯 Custom React Query Hooks for Workouts
 * React Query implementation for workout data fetching
 */

import { useQuery, UseQueryResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkoutService, WorkoutListParams, WorkoutListResponse } from '../services/workoutService';
import { Workout } from '../types/workout.interface';

/**
 * ✅ Hook để fetch danh sách workouts với React Query
 */
export const useWorkouts = (
    params: WorkoutListParams
): UseQueryResult<WorkoutListResponse, Error> => {
    return useQuery({
        queryKey: ['workouts', params],
        queryFn: () => WorkoutService.getWorkouts(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            // Don't retry for 4xx errors
            if (error?.message?.includes('404') || error?.message?.includes('400')) {
                return false;
            }
            return failureCount < 2;
        }
    });
};

/**
 * ✅ Hook để fetch single workout by ID
 */
export const useWorkout = (
    workoutId: string
): UseQueryResult<Workout, Error> => {
    return useQuery({
        queryKey: ['workout', workoutId],
        queryFn: () => WorkoutService.getWorkoutById(workoutId),
        enabled: !!workoutId, // Only run if workoutId exists
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            // Don't retry for 404 errors
            if (error?.message?.includes('404')) {
                return false;
            }
            return failureCount < 2;
        }
    });
};

/**
 * ✅ Hook để search workouts (with debouncing)
 */
export const useWorkoutSearch = (
    query: string,
    enabled: boolean = true
): UseQueryResult<Workout[], Error> => {
    return useQuery({
        queryKey: ['workouts', 'search', query],
        queryFn: () => WorkoutService.searchWorkouts(query, 10),
        enabled: enabled && query.length > 2, // Only search if query is longer than 2 chars
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false
    });
};

/**
 * ✅ Hook để get trending workouts
 */
export const useTrendingWorkouts = (
    limit: number = 6
): UseQueryResult<Workout[], Error> => {
    return useQuery({
        queryKey: ['workouts', 'trending', limit],
        queryFn: () => WorkoutService.getTrendingWorkouts(limit),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false
    });
};

/**
 * ✅ Mutation hook cho creating workout
 */
export const useCreateWorkout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: WorkoutService.createWorkout,
        onSuccess: () => {
            // Invalidate và refetch workouts list
            queryClient.invalidateQueries({ queryKey: ['workouts'] });
        },
        onError: (error) => {
            console.error('Failed to create workout:', error);
        }
    });
};

/**
 * ✅ Mutation hook cho liking workout
 */
export const useLikeWorkout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ workoutId }: { workoutId: string }) =>
            WorkoutService.toggleLike(workoutId),
        onSuccess: (_, variables) => {
            // Invalidate specific workout và workouts list
            queryClient.invalidateQueries({ queryKey: ['workout', variables.workoutId] });
            queryClient.invalidateQueries({ queryKey: ['workouts'] });
        }
    });
};

/**
 * ✅ Mutation hook cho saving workout
 */
export const useSaveWorkout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ workoutId }: { workoutId: string }) =>
            WorkoutService.toggleSave(workoutId),
        onSuccess: (_, variables) => {
            // Invalidate specific workout và workouts list
            queryClient.invalidateQueries({ queryKey: ['workout', variables.workoutId] });
            queryClient.invalidateQueries({ queryKey: ['workouts'] });
        }
    });
};

/**
 * ✅ Helper function để generate stable query keys
 */
export const workoutQueryKeys = {
    all: ['workouts'] as const,
    lists: () => [...workoutQueryKeys.all, 'list'] as const,
    list: (params: WorkoutListParams) => [...workoutQueryKeys.lists(), params] as const,
    details: () => [...workoutQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...workoutQueryKeys.details(), id] as const,
    search: (query: string) => [...workoutQueryKeys.all, 'search', query] as const,
    trending: (limit: number) => [...workoutQueryKeys.all, 'trending', limit] as const,
};

/**
 * ✅ Prefetch utility cho workout detail
 */
export const usePrefetchWorkout = () => {
    const queryClient = useQueryClient();

    return (workoutId: string) => {
        queryClient.prefetchQuery({
            queryKey: workoutQueryKeys.detail(workoutId),
            queryFn: () => WorkoutService.getWorkoutById(workoutId),
            staleTime: 10 * 60 * 1000, // 10 minutes
        });
    };
};

export default {
    useWorkouts,
    useWorkout,
    useWorkoutSearch,
    useTrendingWorkouts,
    useCreateWorkout,
    useLikeWorkout,
    useSaveWorkout,
    usePrefetchWorkout,
    workoutQueryKeys
};
