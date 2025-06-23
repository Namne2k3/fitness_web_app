
/**
 * Exercise variation interface
 */
export interface ExerciseVariation {
    name: string;
    description: string;
    difficultyModifier: 'easier' | 'harder' | 'variation';
    instructions: string[];
}

/**
 * Exercise interface matching DATABASE_SCHEMA_COMPLETE.md
 */
export interface Exercise {
    _id: string;
    name: string; // unique, required
    slug?: string; // URL-friendly unique identifier, auto-generated from name
    description: string;
    instructions: string[]; // step-by-step
    category: ExerciseCategory;
    primaryMuscleGroups: string[]; // main muscles
    secondaryMuscleGroups: string[]; // supporting muscles
    equipment: string[]; // required equipment
    difficulty: 'beginner' | 'intermediate' | 'advanced';

    // Media
    images: string[]; // Cloudinary URLs
    videoUrl?: string; // demo video
    gifUrl?: string; // animated demonstration

    // Metrics
    caloriesPerMinute?: number; // average calories burned
    averageIntensity?: number; // 1-10 scale

    // Social features
    likeCount?: number; // like count for social features
    isLiked?: boolean; // current user liked status
    isBookmarked?: boolean; // current user bookmark status

    // Variations
    variations: ExerciseVariation[];

    // Safety
    precautions: string[]; // safety warnings
    contraindications: string[]; // medical conditions to avoid

    // Admin
    isApproved: boolean; // admin approval
    createdBy: string; // ref: 'User'

    createdAt: Date;
    updatedAt: Date;
}

/**
 * Exercise categories enum
 */
export enum ExerciseCategory {
    STRENGTH = 'strength',
    CARDIO = 'cardio',
    FLEXIBILITY = 'flexibility',
    BALANCE = 'balance',
    SPORTS = 'sports',
    REHABILITATION = 'rehabilitation'
}

/**
 * Exercise form data for creation/editing
 */
export interface ExerciseFormData {
    name: string;
    description: string;
    instructions: string[];
    category: ExerciseCategory;
    primaryMuscleGroups: string[];
    secondaryMuscleGroups?: string[];
    equipment: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    images?: File[];
    videoFile?: File;
    gifFile?: File;
    caloriesPerMinute?: number;
    averageIntensity?: number;
    variations?: ExerciseVariation[];
    precautions?: string[];
    contraindications?: string[];
}

/**
 * Exercise filter options
 */
export interface ExerciseFilters {
    category?: ExerciseCategory;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    primaryMuscleGroups?: string[];
    equipment?: string[];
    isApproved?: boolean;
    searchQuery?: string;
    sortBy?: 'name' | 'difficulty' | 'caloriesPerMinute' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Exercise search result
 */
export interface ExerciseSearchResult {
    exercises: Exercise[];
    total: number;
    page: number;
    totalPages: number;
    filters: ExerciseFilters;
}
