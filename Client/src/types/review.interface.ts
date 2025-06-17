
/**
 * Review rating structure
 */
export interface ReviewRating {
    overall: number; // 1-5, required
    quality?: number; // 1-5
    value?: number; // 1-5 (value for money)
    difficulty?: number; // 1-5 (accuracy of difficulty rating)
    instructions?: number; // 1-5 (clarity of instructions)
}

/**
 * Review verification data
 */
export interface VerificationData {
    type: 'purchase' | 'completion' | 'attendance';
    date: Date;
    proof?: string; // verification document URL
}

/**
 * Review compensation data
 */
export interface ReviewCompensation {
    type: 'paid' | 'free_product' | 'discount';
    amount?: number;
    description?: string;
}

/**
 * Review interface matching DATABASE_SCHEMA_COMPLETE.md
 */
export interface Review {
    readonly _id: string;
    userId: string; // ref: 'User'
    targetType: ReviewTargetType; // type of reviewed item
    targetId: string; // reference to reviewed item

    // Rating
    rating: ReviewRating;

    // Content
    title: string; // review title, max 100
    content: string; // review text, max 1000
    pros?: string[]; // positive points
    cons?: string[]; // negative points

    // Media
    images?: string[]; // Cloudinary URLs
    videoUrl?: string;

    // Verification
    verified: boolean; // verified purchase/completion
    verificationData?: VerificationData;

    // Social
    helpful: string[]; // user IDs who marked as helpful
    helpfulCount: number; // denormalized count
    reported: string[]; // user IDs who reported
    reportCount: number;

    // Monetization
    isSponsored: boolean;
    sponsorDisclosure?: string; // required if sponsored
    compensation?: ReviewCompensation;

    // Moderation
    isApproved: boolean;
    moderatedBy?: string; // ref: 'User' (admin)
    moderationNotes?: string;

    createdAt: Date;
    updatedAt: Date;
}

export enum ReviewTargetType {
    WORKOUT = 'workout',
    EXERCISE = 'exercise',
    GYM = 'gym',
    TRAINER = 'trainer',
    PRODUCT = 'product'
}

/**
 * Form data for creating reviews
 */
export interface ReviewFormData {
    targetId: string;
    targetType: ReviewTargetType;
    rating: ReviewRating;
    title: string;
    content: string;
    pros?: string[];
    cons?: string[];
    images?: File[];
    videoFile?: File;
    isSponsored: boolean;
    sponsorDisclosure?: string;
    compensation?: ReviewCompensation;
}

/**
 * Review filter options
 */
export interface ReviewFilters {
    targetType?: ReviewTargetType;
    targetId?: string;
    userId?: string;
    minRating?: number;
    maxRating?: number;
    verified?: boolean;
    isSponsored?: boolean;
    isApproved?: boolean;
    sortBy?: 'createdAt' | 'rating' | 'helpfulCount';
    sortOrder?: 'asc' | 'desc';
}