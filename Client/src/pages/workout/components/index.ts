/**
 * 📦 Workout Components - Barrel Exports
 * Centralized exports for all workout-related components
 */

export { default as WorkoutCard } from './WorkoutCard';
export { default as WorkoutFilters } from './WorkoutFilters';  // ✅ Simplified version
export { default as WorkoutGrid } from './WorkoutGrid';        // ✅ Updated with Pagination
export { default as WorkoutHeader } from './WorkoutHeader';    // ✅ Simplified version
export { default as WorkoutsSkeleton } from './WorkoutsSkeleton';

// Type exports for component props
export type { default as WorkoutCardProps } from './WorkoutCard';
export type { default as WorkoutFiltersProps } from './WorkoutFilters';
export type { default as WorkoutGridProps } from './WorkoutGrid';
export type { default as WorkoutHeaderProps } from './WorkoutHeader';
export type { default as WorkoutsSkeletonProps } from './WorkoutsSkeleton';
