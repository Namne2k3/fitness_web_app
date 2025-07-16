/**
 * 🏃 Workout Session Types
 * Type definitions for workout session tracking
 */

export interface SetPerformance {
    setIndex: number;
    reps: number;
    weight: number; // in kg
    duration: number; // in seconds
    restTime: number; // in seconds
    completedAt: Date;
    notes?: string;
}

export interface ExerciseCompletion {
    exerciseId: string;
    exerciseIndex: number;
    sets: SetPerformance[];
    totalDuration: number; // in seconds
    caloriesBurned: number;
    isCompleted: boolean;
    startedAt: Date;
    completedAt?: Date;
}

export interface WorkoutSession {
    _id: string;
    userId: string;
    workoutId: string;

    // Session timing
    startTime: Date;
    endTime?: Date;
    totalDuration: number; // in seconds
    pausedDuration: number; // in seconds

    // Progress tracking
    currentExerciseIndex: number;
    totalExercises: number;
    completedExercises: ExerciseCompletion[];

    // Performance metrics
    totalCaloriesBurned: number;
    averageHeartRate?: number;
    maxHeartRate?: number;

    // Session status
    status: 'active' | 'paused' | 'completed' | 'stopped';
    completionPercentage: number; // 0-100

    // Session metadata
    notes?: string;
    rating?: number; // 1-5 stars
    mood?: 'great' | 'good' | 'okay' | 'tired' | 'poor';

    // Timestamps
    createdAt: Date;
    updatedAt: Date;

    // Virtual properties (if populated by backend)
    actualDuration?: number;
    caloriesPerMinute?: number;
    isInProgress?: boolean;

    // Populated workout data (if needed)
    workoutInfo?: {
        _id: string;
        name: string;
        thumbnail?: string;
        estimatedDuration?: number;
        difficulty: string;
        exercises: unknown[];
    };
}

export interface CreateWorkoutSessionRequest {
    workoutId: string;
    totalExercises: number;
}

export interface UpdateExerciseProgressRequest {
    exerciseIndex: number;
    setIndex: number;
    reps: number;
    weight: number;
    duration: number;
    restTime?: number;
    notes?: string;
}

export interface CompleteExerciseRequest {
    exerciseIndex: number;
    caloriesBurned: number;
}

export interface CompleteSessionRequest {
    notes?: string;
    rating?: number;
    mood?: 'great' | 'good' | 'okay' | 'tired' | 'poor';
}

export interface UpdateSessionRequest {
    notes?: string;
    rating?: number;
    mood?: 'great' | 'good' | 'okay' | 'tired' | 'poor';
    averageHeartRate?: number;
    maxHeartRate?: number;
}

export enum WorkoutSessionStatus {
    ACTIVE = 'active',
    PAUSED = 'paused',
    COMPLETED = 'completed',
    STOPPED = 'stopped'
}

export enum WorkoutMood {
    GREAT = 'great',
    GOOD = 'good',
    OKAY = 'okay',
    TIRED = 'tired',
    POOR = 'poor'
}

export interface WorkoutSessionFilters {
    status?: WorkoutSessionStatus[];
    dateRange?: [Date, Date];
    minDuration?: number;
    maxDuration?: number;
    minCalories?: number;
    maxCalories?: number;
    rating?: number[];
    mood?: WorkoutMood[];
}

export interface WorkoutSessionStats {
    totalSessions: number;
    completedSessions: number;
    totalWorkoutTime: number; // in seconds
    totalCaloriesBurned: number;
    averageRating: number;
    averageDuration: number; // in seconds
    mostFrequentMood: WorkoutMood;
    completionRate: number; // percentage
}
