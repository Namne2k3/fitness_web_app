/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExerciseCategory, ExerciseVariation } from "./exercise.interface";

export interface Workout {
    readonly _id: string;
    userId: string;
    name: string;
    description?: string;
    thumbnail?: string; // optional image URL for workout thumbnail
    category?: string; // ['strength', 'cardio', 'flexibility', etc.]
    difficulty: DifficultyLevel;
    estimatedDuration?: number; // minutes
    tags: string[];
    isPublic: boolean;

    // Embedded Exercises Array
    exercises: WorkoutExercise[];    // Monetization
    isSponsored?: boolean;
    sponsorData?: {
        sponsorId: string;
        campaignId: string;
        rate: number;
        type: 'review' | 'guide' | 'promotion';
        disclosure: string;
    };// Social Features
    likes?: string[]; // user IDs who liked - OPTIONAL to match Server
    likeCount?: number; // denormalized for performance - OPTIONAL
    saves?: string[]; // user IDs who saved - OPTIONAL  
    saveCount?: number; // OPTIONAL
    shares?: number; // share count - OPTIONAL

    // Analytics
    views?: number; // view count - OPTIONAL
    completions?: number; // completion count - OPTIONAL
    averageRating?: number; // calculated from reviews - OPTIONAL
    totalRatings?: number; // OPTIONAL

    // Metadata
    muscleGroups?: string[]; // targeted muscle groups - OPTIONAL
    equipment?: string[]; // required equipment - OPTIONAL
    caloriesBurned?: number; // estimated calories - OPTIONAL

    createdAt: Date;
    updatedAt: Date;

    // Author information (populated from userId)
    authorInfo?: {
        _id: string;
        username: string;
        fullName?: string;
        avatar?: string;
        experienceLevel?: string;
        isEmailVerified?: boolean;
    };
}

export interface WorkoutFormData {
    name: string;
    description?: string;
    thumbnail?: string;
    exercises: WorkoutExercise[]; // Changed from Omit<Exercise, 'id'>[]
    duration: number;
    difficulty: DifficultyLevel;
    category: WorkoutCategory;
    tags: string[];
    isPublic: boolean;
}

// Exercise Definition - theo DATABASE_SCHEMA_COMPLETE.md  
export interface WorkoutExerciseTemplate {
    readonly id: string;
    name: string; // unique, required
    description?: string;
    instructions: string[]; // step-by-step
    category: ExerciseCategory;
    primaryMuscleGroups: MuscleGroup[]; // main muscles
    secondaryMuscleGroups?: MuscleGroup[]; // supporting muscles
    equipment: Equipment[]; // required equipment
    difficulty: DifficultyLevel;

    // Media
    images?: string[]; // Cloudinary URLs
    videoUrl?: string; // demo video
    gifUrl?: string; // animated demonstration

    // Metrics
    caloriesPerMinute?: number; // average calories burned
    averageIntensity?: number; // 1-10 scale

    // Variations
    variations?: ExerciseVariation[];

    // Safety
    precautions?: string[]; // safety warnings
    contraindications?: string[]; // medical conditions to avoid

    // Admin
    isApproved?: boolean; // admin approval
    createdBy?: string; // ref: 'User'

    createdAt?: Date;
    updatedAt?: Date;
}

// WorkoutExercise - instance của exercise trong workout
/**
 * WorkoutExercise - instance của exercise trong workout
 * Nếu backend trả về includeExerciseData, sẽ có trường exerciseInfo chứa toàn bộ object Exercise đã populate
 */
export interface WorkoutExercise {
    exerciseId: string; // ref to Exercise (always string)
    order: number; // sequence in workout
    sets: number; // required
    reps?: number;
    duration?: number; // seconds for time-based
    weight?: number; // kg
    restTime?: number; // seconds between sets
    notes?: string;
    completed?: boolean; // for workout tracking
    /**
     * Nếu gọi API với includeExerciseData, backend sẽ trả về exerciseInfo chứa toàn bộ dữ liệu của exercise
     */
    exerciseInfo?: ExerciseFull | null;
}

/**
 * Định nghĩa đầy đủ cho dữ liệu Exercise trả về từ backend (dùng cho exerciseInfo)
 * Có thể mở rộng nếu backend trả về thêm trường
 */
export interface ExerciseFull {
    _id: string;
    name: string;
    description?: string;
    instructions?: string[];
    category?: string;
    primaryMuscleGroups?: string[];
    secondaryMuscleGroups?: string[];
    equipment?: string[];
    difficulty?: string;
    images?: string[];
    videoUrl?: string;
    gifUrl?: string;
    caloriesPerMinute?: number;
    averageIntensity?: number;
    variations?: any[];
    precautions?: string[];
    contraindications?: string[];
    isApproved?: boolean;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
    slug: string;
    // Có thể bổ sung thêm các trường khác nếu backend trả về
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
    // Upper Body
    CHEST = 'chest',
    BACK = 'back',
    SHOULDERS = 'shoulders',
    BICEPS = 'biceps',
    TRICEPS = 'triceps',
    FOREARMS = 'forearms',
    TRAPS = 'traps',
    LATS = 'lats',

    // Core
    CORE = 'core',
    RECTUS_ABDOMINIS = 'rectus_abdominis',
    OBLIQUES = 'obliques',
    TRANSVERSE_ABDOMINIS = 'transverse_abdominis',
    ERECTOR_SPINAE = 'erector_spinae',

    // Lower Body
    QUADRICEPS = 'quadriceps',
    HAMSTRINGS = 'hamstrings',
    GLUTES = 'glutes',
    CALVES = 'calves',
    HIP_FLEXORS = 'hip_flexors',

    // Full Body / System
    FULL_BODY = 'full_body',
    CARDIOVASCULAR = 'cardiovascular',

    // Legacy for backward compatibility
    LEGS = 'legs'
}

export enum Equipment {
    // Free Weights
    BARBELL = 'barbell',
    DUMBBELL = 'dumbbell',
    KETTLEBELL = 'kettlebell',
    WEIGHT_PLATES = 'weight_plates',

    // Machines & Racks
    SQUAT_RACK = 'squat_rack',
    BENCH = 'bench',
    PULL_UP_BAR = 'pull_up_bar',

    // Accessories
    RESISTANCE_BAND = 'resistance_band',
    YOGA_MAT = 'yoga_mat',
    YOGA_BLOCK = 'yoga_block',

    // Bodyweight
    BODYWEIGHT = 'bodyweight',
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