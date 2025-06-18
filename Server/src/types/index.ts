import { FitnessGoal } from '@/models/User';
import { Request } from 'express';
import { ObjectId } from 'mongoose';
/**
 * 🏋️ Fitness Web App - Core TypeScript Type Definitions
 * Following React 19 and coding standards best practices
 */

// ================================
// 👤 User Types
// ================================

export interface User {
    readonly _id: string;
    email: string;
    username: string;
    role: UserRole;
    password?: string; // Optional for responses
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date | null;
    lastLoginAt?: Date;
    isActive: boolean;
    profile: UserProfile;
    preferences: UserPreferences;
    subscription: UserSubscription;
    createdAt: Date;
    updatedAt: Date;
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    age: number;
    gender: Gender;
    weight: number; // kg
    height: number; // cm
    fitnessGoals: FitnessGoal[]; // fitness objectives
    experienceLevel: ExperienceLevel;
    avatar?: string; // Cloudinary URL
    bio?: string; // max 500 chars
    medicalConditions?: string[];
    // Virtual properties (calculated)
    bmi?: number; // Calculated from weight and height
    fullName?: string; // firstName + lastName
}

export interface UserPreferences {
    contentTypes: string[];
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    theme: 'light' | 'dark' | 'auto';
    language?: 'vi' | 'en';
    units?: 'metric' | 'imperial';
}

export interface UserSubscription {
    plan: 'free' | 'premium' | 'pro';
    status: 'active' | 'cancelled' | 'expired';
    startDate: Date;
    endDate?: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    cancelAtPeriodEnd?: boolean;
    features: string[];
}

// ================================
// 🏋️ Workout Types
// ================================

export interface Workout {
    _id: ObjectId;
    userId: ObjectId; // ref: 'User', indexed
    name: string; // required, max 100
    description?: string; // max 500
    category?: string; // ['strength', 'cardio', 'flexibility', etc.]
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedDuration?: number; // minutes
    tags: string[]; // indexed
    isPublic: boolean; // default: false

    // Embedded Exercises Array
    exercises: WorkoutExercise[];

    // Monetization
    isSponsored?: boolean; // default: false
    sponsorData?: {
        sponsorId: string; // ref: 'Sponsor'
        campaignId: string; // ref: 'Campaign'
        rate: number; // payment rate
        type: 'review' | 'guide' | 'promotion';
        disclosure: string; // required disclosure text
    };

    // Social Features
    likes?: string[]; // user IDs who liked
    likeCount?: number; // denormalized for performance
    saves?: string[]; // user IDs who saved
    saveCount?: number;
    shares?: number; // share count

    // Analytics
    views?: number; // view count
    completions?: number; // completion count
    averageRating?: number; // calculated from reviews
    totalRatings?: number;

    // Metadata
    muscleGroups?: string[]; // targeted muscle groups
    equipment?: string[]; // required equipment
    caloriesBurned?: number; // estimated calories

    createdAt: Date;
    updatedAt: Date;
}

export interface WorkoutExercise {
    exerciseId: ObjectId; // ref: 'Exercise'
    order: number; // sequence in workout
    sets: number; // required
    reps?: number;
    duration?: number; // seconds for time-based
    weight?: number; // kg
    restTime?: number; // seconds between sets
    notes?: string;
    completed?: boolean; // for workout tracking
}

export interface Exercise {
    _id?: string;
    name: string; // unique, required
    description?: string;
    instructions: string[]; // step-by-step
    category: 'strength' | 'cardio' | 'flexibility';
    primaryMuscleGroups: string[]; // main muscles
    secondaryMuscleGroups?: string[]; // supporting muscles
    equipment: string[]; // required equipment
    difficulty: 'beginner' | 'intermediate' | 'advanced';

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

export interface ExerciseVariation {
    name: string;
    description: string;
    difficultyModifier: 'easier' | 'harder' | 'variation';
    instructions: string[];
}

export interface ExerciseSet {
    setNumber: number;
    reps: number;
    weight?: number; // kg
    duration?: number; // seconds for time-based exercises
    restTime: number; // seconds
    notes?: string;
}

export interface WorkoutLike {
    _id: string;
    userId: string;
    workoutId: string;
    isLiked: boolean;
    createdAt: Date;
}

export interface WorkoutReview {
    _id: string;
    userId: string;
    workoutId: string;
    rating: number; // 1-5
    comment?: string;
    helpful: number;
    createdAt: Date;
}

// ================================
// 💰 Sponsored Content Types
// ================================

export interface SponsoredContent {
    readonly _id: string;
    title: string; // required, max 200
    content: string; // rich text content
    excerpt?: string; // short description
    author: string; // ref: 'User', indexed

    // Content Type
    type: 'review' | 'guide' | 'promotion' | 'comparison';
    status: 'draft' | 'pending' | 'published' | 'archived';
    category: string; // content category
    tags: string[]; // searchable tags

    // Monetization
    sponsor: {
        company: string; // sponsor company name
        contactEmail: string;
        website: string;
        logo: string; // Cloudinary URL
    };
    campaign: {
        campaignId: string; // ref: 'Campaign'
        rate: number; // payment per post
        paymentStatus: 'pending' | 'paid' | 'cancelled';
        contractUrl: string; // signed contract
    };

    // Target & Performance
    targetAudience: {
        ageRange: [number, number]; // [min, max]
        fitnessLevels: string[];
        interests: string[];
        geoLocation: string[]; // country/city codes
    };

    // Media
    featuredImage?: string; // Cloudinary URL
    gallery?: string[]; // additional images
    videoUrl?: string;

    // SEO
    slug: string; // URL-friendly, unique
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];

    // Analytics (embedded for performance)
    analytics: {
        views: number;
        clicks: number; // clicks on sponsor links
        shares: number;
        likes: number;
        comments: number;
        conversionRate: number; // calculated metric
        revenue: number; // generated revenue
        ctr: number; // click-through rate
        engagement: number; // overall engagement score
    };

    // Publishing
    publishedAt?: Date;
    scheduledAt?: Date; // for scheduled posts
    expiresAt?: Date; // auto-archive date

    createdAt: Date;
    updatedAt: Date;
}

// ================================
// 📊 Review System Types (Updated to match DATABASE_SCHEMA_COMPLETE.md)
// ================================

export interface Review {
    readonly _id: string;
    userId: string; // ref: 'User', indexed
    targetType: 'workout' | 'exercise' | 'gym' | 'trainer' | 'product';
    targetId: string; // reference to reviewed item

    // Rating
    rating: {
        overall: number; // 1-5, required
        quality?: number; // 1-5
        value?: number; // 1-5 (value for money)
        difficulty?: number; // 1-5 (accuracy of difficulty rating)
        instructions?: number; // 1-5 (clarity of instructions)
    };

    // Content
    title: string; // review title, max 100
    content: string; // review text, max 1000
    pros: string[]; // positive points
    cons: string[]; // negative points

    // Media
    images: string[]; // Cloudinary URLs
    videoUrl?: string;

    // Verification
    verified: boolean; // verified purchase/completion
    verificationData?: {
        type: 'purchase' | 'completion' | 'attendance';
        date: Date;
        proof: string; // verification document URL
    };

    // Social
    helpful: string[]; // users who marked as helpful
    helpfulCount: number; // denormalized count
    reported: string[]; // users who reported
    reportCount: number;

    // Monetization
    isSponsored: boolean;
    sponsorDisclosure?: string; // required if sponsored
    compensation?: {
        type: 'paid' | 'free_product' | 'discount';
        amount: number;
        description: string;
    };

    // Moderation
    isApproved: boolean;
    moderatedBy?: string; // ref: 'User' (admin)
    moderationNotes?: string;

    createdAt: Date;
    updatedAt: Date;
}

// ================================
// 🔐 Authentication Types
// ================================

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
}

export interface JWTPayload {
    userId: string;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}

// ================================
// 📡 API Response Types
// ================================

export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
    pagination?: PaginationInfo;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

// ✅ ADD: PaginatedResult interface để match với client
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
    filters?: any; // Applied filters
    sort?: { field: string; order: 'asc' | 'desc' };
}

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    data?: any;
}

// ================================
// 🔧 Utility Types
// ================================

export interface RequestWithUser extends Request {
    user?: User;
}

export interface FileUpload {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}

// ================================
// 📝 Enums (Updated to match DATABASE_SCHEMA_COMPLETE.md)
// ================================

export enum UserRole {
    USER = 'user',
    TRAINER = 'trainer',
    ADMIN = 'admin',
    SPONSOR = 'sponsor'
}

export enum ExperienceLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced'
}

// Muscle Groups enum (expanded from database schema)
export enum MuscleGroup {
    CHEST = 'chest',
    BACK = 'back',
    SHOULDERS = 'shoulders',
    BICEPS = 'biceps',
    TRICEPS = 'triceps',
    FOREARMS = 'forearms',
    CORE = 'core',
    ABS = 'abs',
    OBLIQUES = 'obliques',
    QUADRICEPS = 'quadriceps',
    HAMSTRINGS = 'hamstrings',
    GLUTES = 'glutes',
    CALVES = 'calves',
    CARDIO = 'cardio',
    FULL_BODY = 'full_body'
}

// Equipment enum (expanded from database schema)
export enum Equipment {
    BODYWEIGHT = 'bodyweight',
    DUMBBELLS = 'dumbbells',
    BARBELL = 'barbell',
    MACHINE = 'machine',
    RESISTANCE_BANDS = 'resistance_bands',
    KETTLEBELL = 'kettlebell',
    CABLE = 'cable',
    PULL_UP_BAR = 'pull_up_bar',
    MEDICINE_BALL = 'medicine_ball',
    FOAM_ROLLER = 'foam_roller'
}

// Content types for sponsored content
export enum SponsoredContentType {
    REVIEW = 'review',
    GUIDE = 'guide',
    PROMOTION = 'promotion',
    COMPARISON = 'comparison'
}

// Content status
export enum ContentStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    PUBLISHED = 'published',
    ARCHIVED = 'archived'
}

// Subscription plans
export enum SubscriptionPlan {
    FREE = 'free',
    PREMIUM = 'premium',
    PRO = 'pro'
}

// Subscription status
export enum SubscriptionStatus {
    ACTIVE = 'active',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired'
}

// Exercise categories
export enum ExerciseCategory {
    STRENGTH = 'strength',
    CARDIO = 'cardio',
    FLEXIBILITY = 'flexibility'
}

// Workout categories
export enum WorkoutCategory {
    STRENGTH = 'strength',
    CARDIO = 'cardio',
    FLEXIBILITY = 'flexibility',
    HIIT = 'hiit',
    CROSSTRAINING = 'crosstraining',
    SPORTS = 'sports',
    RECOVERY = 'recovery'
}

// Payment status for campaigns
export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    CANCELLED = 'cancelled'
}

// Verification types for reviews
export enum VerificationType {
    PURCHASE = 'purchase',
    COMPLETION = 'completion',
    ATTENDANCE = 'attendance'
}

// Compensation types for sponsored reviews
export enum CompensationType {
    PAID = 'paid',
    FREE_PRODUCT = 'free_product',
    DISCOUNT = 'discount'
}

// ================================
// 🔧 Additional Interfaces
// ================================

export interface NotificationSettings {
    workoutReminders: boolean;
    newContent: boolean;
    sponsoredOffers: boolean;
    socialUpdates: boolean;
    email: boolean;
    push: boolean;
}

export interface PrivacySettings {
    profileVisibility: 'public' | 'friends' | 'private';
    showRealName?: boolean;
    allowMessages?: boolean;
    shareWorkouts?: boolean;
    trackingConsent?: boolean;
}

export interface DatabaseConfig {
    uri: string;
    options: {
        useNewUrlParser: boolean;
        useUnifiedTopology: boolean;
        maxPoolSize: number;
        serverSelectionTimeoutMS: number;
        socketTimeoutMS: number;
    };
}

export interface CloudinaryConfig {
    cloud_name: string;
    api_key: string;
    api_secret: string;
    secure: boolean;
}

// ================================
// 🎯 Form Data Types (for React 19 Actions) - Updated
// ================================

export interface WorkoutFormData {
    name: string;
    description?: string;
    category?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedDuration?: number;
    exercises: WorkoutExercise[];
    tags: string[];
    isPublic: boolean;
    muscleGroups?: string[];
    equipment?: string[];
}

export interface SponsoredContentFormData {
    title: string;
    content: string;
    excerpt?: string;
    type: 'review' | 'guide' | 'promotion' | 'comparison';
    category: string;
    tags: string[];
    sponsor: {
        company: string;
        contactEmail: string;
        website?: string;
        logo?: string;
    };
    campaign: {
        campaignId: string;
        rate: number;
    };
    targetAudience?: {
        ageRange: [number, number];
        fitnessLevels: string[];
        interests: string[];
        geoLocation: string[];
    };
    featuredImage?: string;
    videoUrl?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
}

export interface ReviewFormData {
    targetId: string;
    targetType: 'workout' | 'exercise' | 'gym' | 'trainer' | 'product';
    rating: {
        overall: number;
        quality?: number;
        value?: number;
        difficulty?: number;
        instructions?: number;
    };
    title: string;
    content: string;
    pros?: string[];
    cons?: string[];
    images?: string[];
    videoUrl?: string;
    isSponsored?: boolean;
    sponsorDisclosure?: string;
}

export interface UserRegistrationData {
    email: string;
    username: string;
    password: string;
    profile: {
        firstName: string;
        lastName: string;
        age: number;
        gender: Gender;
        weight: number;
        height: number;
        fitnessGoals?: string[];
        experienceLevel: ExperienceLevel;
    };
}

export interface UserLoginData {
    email: string;
    password: string;
}
