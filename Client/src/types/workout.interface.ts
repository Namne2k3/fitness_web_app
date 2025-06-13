import { Rating } from "./review.interface";
import { SponsorData } from "./sponsor.interface";

export interface Workout {
    readonly id: string;
    userId: string;
    name: string;
    description?: string;
    exercises: Exercise[];
    duration: number; // minutes
    difficulty: DifficultyLevel;
    tags: string[];
    category: WorkoutCategory;
    caloriesBurned?: number;
    isPublic: boolean;
    isSponsored: boolean;
    sponsorData?: SponsorData;
    ratings: Rating[];
    averageRating: number;
    totalRatings: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkoutFormData {
    name: string;
    description?: string;
    exercises: Omit<Exercise, 'id'>[];
    duration: number;
    difficulty: DifficultyLevel;
    category: WorkoutCategory;
    tags: string[];
    isPublic: boolean;
}

export interface Exercise {
    id: string;
    name: string;
    description?: string;
    instructions: string[];
    sets: number;
    reps?: number;
    duration?: number; // seconds
    weight?: number; // kg
    restTime: number; // seconds
    muscleGroups: MuscleGroup[];
    equipment?: Equipment[];
    imageUrl?: string;
    videoUrl?: string;
}

export enum DifficultyLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced'
}

export enum WorkoutCategory {
    STRENGTH = 'strength',
    CARDIO = 'cardio',
    FLEXIBILITY = 'flexibility',
    HIIT = 'hiit',
    YOGA = 'yoga',
    PILATES = 'pilates',
    CROSSFIT = 'crossfit'
}

export enum MuscleGroup {
    CHEST = 'chest',
    BACK = 'back',
    SHOULDERS = 'shoulders',
    BICEPS = 'biceps',
    TRICEPS = 'triceps',
    CORE = 'core',
    LEGS = 'legs',
    GLUTES = 'glutes',
    CALVES = 'calves'
}

export enum Equipment {
    BARBELL = 'barbell',
    DUMBBELL = 'dumbbell',
    KETTLEBELL = 'kettlebell',
    RESISTANCE_BAND = 'resistance_band',
    PULL_UP_BAR = 'pull_up_bar',
    YOGA_MAT = 'yoga_mat',
    NONE = 'none'
}

export interface WorkoutFilters {
    category?: WorkoutCategory[];
    difficulty?: DifficultyLevel[];
    duration?: [number, number];
    equipment?: Equipment[];
    muscleGroups?: MuscleGroup[];
    tags?: string[];
    isSponsored?: boolean;
}