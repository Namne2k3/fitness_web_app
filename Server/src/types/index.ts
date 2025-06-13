import { Request } from 'express';
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
    emailVerificationToken?: string; // For email verification
    profile: UserProfile;
    lastLoginAt?: Date; // Last login timestamp
    preferences: UserPreferences;
    subscription: UserSubscription;
    isActive: boolean; // Account status
    passwordResetToken?: string; // For password reset
    passwordResetExpires?: Date; // For password reset expiration
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    age: number;
    weight: number; // kg
    height: number; // cm
    fitnessGoals: FitnessGoal[];
    experienceLevel: ExperienceLevel;
    avatar?: string; // Cloudinary URL
    bio?: string;
    // Virtual properties (calculated)
    bmi?: number; // Calculated from weight and height
    fullName?: string; // firstName + lastName
}

export interface UserPreferences {
    contentTypes: ContentType[];
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    theme: 'light' | 'dark' | 'auto';
}

export interface UserSubscription {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    startDate: Date;
    endDate?: Date;
    features: string[];
}

// ================================
// 🏋️ Workout Types
// ================================

export interface Workout {
    readonly _id: string;
    userId: string;
    name: string;
    description?: string;
    exercises: Exercise[];
    duration: number; // minutes
    caloriesBurned: number;
    difficulty: DifficultyLevel;
    tags: string[];
    isPublic: boolean;
    likes: WorkoutLike[];
    reviews: WorkoutReview[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Exercise {
    _id?: string;
    name: string;
    description?: string;
    muscle_groups: MuscleGroup[];
    equipment: Equipment[];
    sets: ExerciseSet[];
    instructions: string[];
    tips?: string[];
    images?: string[]; // Cloudinary URLs
    videos?: string[]; // Cloudinary URLs
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
    title: string;
    content: string;
    excerpt?: string;
    author: string; // User ID
    sponsor: SponsorData;
    metadata: ContentMetadata;
    analytics: ContentAnalytics;
    status: ContentStatus;
    publishDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface SponsorData {
    company: string;
    campaign: string;
    contactEmail: string;
    rate: number; // USD
    type: SponsoredContentType;
    tier: SponsorTier;
    contract: {
        startDate: Date;
        endDate: Date;
        terms: string;
    };
}

export interface ContentMetadata {
    tags: string[];
    category: ContentCategory;
    targetAudience: {
        ageRange: [number, number];
        experienceLevel: ExperienceLevel[];
        interests: string[];
    };
    seoKeywords: string[];
    featuredImage?: string;
}

export interface ContentAnalytics {
    views: number;
    clicks: number;
    shares: number;
    likes: number;
    comments: number;
    engagement: number; // calculated metric
    revenue: number;
    conversionRate: number;
}

// ================================
// 📊 Review System Types
// ================================

export interface Review {
    readonly _id: string;
    targetId: string; // gym, trainer, product ID
    targetType: ReviewTarget;
    userId: string;
    rating: ReviewRating;
    title: string;
    content: string;
    images?: string[];
    videos?: string[];
    helpful: number;
    notHelpful: number;
    sponsored: boolean;
    verifiedPurchase: boolean;
    status: ReviewStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface ReviewRating {
    overall: number; // 1-5
    quality: number;
    value: number;
    service: number;
    atmosphere?: number; // for gyms
    cleanliness?: number; // for gyms
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
// 📝 Enums
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
    ADVANCED = 'advanced',
    EXPERT = 'expert'
}

export enum DifficultyLevel {
    EASY = 'easy',
    MODERATE = 'moderate',
    HARD = 'hard',
    EXTREME = 'extreme'
}

export enum FitnessGoal {
    WEIGHT_LOSS = 'weight_loss',
    MUSCLE_GAIN = 'muscle_gain',
    STRENGTH = 'strength',
    ENDURANCE = 'endurance',
    FLEXIBILITY = 'flexibility',
    GENERAL_FITNESS = 'general_fitness'
}

export enum MuscleGroup {
    CHEST = 'chest',
    BACK = 'back',
    SHOULDERS = 'shoulders',
    ARMS = 'arms',
    LEGS = 'legs',
    CORE = 'core',
    CARDIO = 'cardio'
}

export enum Equipment {
    BODYWEIGHT = 'bodyweight',
    DUMBBELLS = 'dumbbells',
    BARBELL = 'barbell',
    MACHINE = 'machine',
    RESISTANCE_BANDS = 'resistance_bands',
    KETTLEBELL = 'kettlebell',
    CABLE = 'cable'
}

export enum ContentType {
    WORKOUT = 'workout',
    NUTRITION = 'nutrition',
    REVIEW = 'review',
    GUIDE = 'guide',
    NEWS = 'news'
}

export enum SponsoredContentType {
    REVIEW = 'review',
    GUIDE = 'guide',
    PROMOTION = 'promotion',
    TUTORIAL = 'tutorial'
}

export enum ContentCategory {
    GYM_REVIEW = 'gym_review',
    EQUIPMENT_REVIEW = 'equipment_review',
    SUPPLEMENT_REVIEW = 'supplement_review',
    TRAINER_REVIEW = 'trainer_review',
    WORKOUT_GUIDE = 'workout_guide',
    NUTRITION_GUIDE = 'nutrition_guide'
}

export enum ContentStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    APPROVED = 'approved',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
    REJECTED = 'rejected'
}

export enum SponsorTier {
    TIER1 = 'tier1', // Premium: $300-500/post
    TIER2 = 'tier2', // Standard: $150-300/post
    TIER3 = 'tier3'  // Entry: $50-150/post
}

export enum ReviewTarget {
    GYM = 'gym',
    TRAINER = 'trainer',
    EQUIPMENT = 'equipment',
    SUPPLEMENT = 'supplement',
    APP = 'app'
}

export enum ReviewStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    FLAGGED = 'flagged'
}

export enum SubscriptionPlan {
    FREE = 'free',
    PREMIUM = 'premium',
    TRAINER = 'trainer',
    BUSINESS = 'business'
}

export enum SubscriptionStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired'
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
    workoutVisibility: 'public' | 'friends' | 'private';
    showInLeaderboards: boolean;
    allowDirectMessages: boolean;
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
// 🎯 Form Data Types (for React 19 Actions)
// ================================

export interface WorkoutFormData {
    name: string;
    description?: string;
    exercises: Exercise[];
    duration: number;
    difficulty: DifficultyLevel;
    tags: string[];
    isPublic: boolean;
}

export interface SponsoredContentFormData {
    title: string;
    content: string;
    excerpt?: string;
    sponsor: Partial<SponsorData>;
    metadata: Partial<ContentMetadata>;
}

export interface ReviewFormData {
    targetId: string;
    targetType: ReviewTarget;
    rating: Partial<ReviewRating>;
    title: string;
    content: string;
    images?: string[];
}

export interface UserRegistrationData {
    email: string;
    username: string;
    password: string;
    profile: Partial<UserProfile>;
}

export interface UserLoginData {
    email: string;
    password: string;
}
