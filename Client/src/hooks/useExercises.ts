/**
 * 🎯 Custom React Query Hooks for Exercises
 * Thay thế React 19 use() hook với React Query
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ExerciseService, ExerciseListParams } from '../services/exerciseService';
import { Exercise, PaginatedResult } from '../types';

/**
 * ✅ Hook để fetch danh sách exercises với React Query
 */
export const useExercises = (
    params: ExerciseListParams
): UseQueryResult<PaginatedResult<Exercise>, Error> => {
    return useQuery({
        queryKey: ExerciseService.getExercisesQueryKey(params),
        queryFn: () => ExerciseService.getExercises(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            // Retry up to 3 times, but not for 4xx errors
            if (error.message.includes('4')) return false;
            return failureCount < 3;
        }
    });
};

/**
 * ✅ Hook để fetch single exercise
 */
export const useExercise = (
    exerciseId: string
): UseQueryResult<Exercise, Error> => {
    return useQuery({
        queryKey: ExerciseService.getExerciseQueryKey(exerciseId),
        queryFn: () => ExerciseService.getExercise(exerciseId),
        enabled: !!exerciseId, // Only run if exerciseId exists
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false
    });
};

/**
 * ✅ Hook để search exercises (with debouncing)
 */
export const useExerciseSearch = (
    query: string,
    enabled: boolean = true
): UseQueryResult<Exercise[], Error> => {
    return useQuery({
        queryKey: ['exercises', 'search', query],
        queryFn: () => ExerciseService.searchExercises(query),
        enabled: enabled && query.trim().length > 0,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false
    });
};