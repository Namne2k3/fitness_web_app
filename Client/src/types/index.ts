/**
 * Core types for Fitness Web App
 * Định nghĩa các interface và types cơ bản cho ứng dụng
 */

// User related types
export interface User {
    readonly id: string;
    email: string;
    username: string;
    avatar?: string;
    profile: UserProfile;
    preferences: UserPreferences;
    isVerified: boolean;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    age: number;
    weight: number; // kg
    height: number; // cm
    gender: Gender;
    fitnessGoals: FitnessGoal[];
    experienceLevel: ExperienceLevel;
    medicalConditions?: string[];
}

export interface UserPreferences {
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    theme: 'light' | 'dark' | 'auto';
    language: 'vi' | 'en';
    units: 'metric' | 'imperial';
}

export enum UserRole {
    USER = 'user',
    TRAINER = 'trainer',
    ADMIN = 'admin',
    SPONSOR = 'sponsor'
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}

export enum FitnessGoal {
    WEIGHT_LOSS = 'weight_loss',
    MUSCLE_GAIN = 'muscle_gain',
    STRENGTH = 'strength',
    ENDURANCE = 'endurance',
    FLEXIBILITY = 'flexibility',
    GENERAL_FITNESS = 'general_fitness'
}

export enum ExperienceLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced'
}

// Workout related types
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

// Sponsored Content types
export interface SponsoredContent {
    readonly id: string;
    title: string;
    content: string;
    excerpt: string;
    authorId: string;
    author: User;
    sponsor: Sponsor;
    type: ContentType;
    category: ContentCategory;
    tags: string[];
    featuredImage?: string;
    gallery?: string[];
    metadata: ContentMetadata;
    analytics: ContentAnalytics;
    status: ContentStatus;
    isApproved: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Sponsor {
    id: string;
    companyName: string;
    logo: string;
    website: string;
    contactEmail: string;
    tier: SponsorTier;
    campaign: Campaign;
    isActive: boolean;
}

export interface SponsorData {
    sponsorId: string;
    sponsorName: string;
    sponsorLogo: string;
    campaignId: string;
    campaignName: string;
    dealValue: number; // Amount paid for sponsorship
    contractStartDate: Date;
    contractEndDate: Date;
    promotionalText?: string;
    callToAction?: string;
    trackingUrl?: string;
    impressions: number;
    clicks: number;
    conversions: number;
    isActive: boolean;
}

export interface Campaign {
    id: string;
    name: string;
    description: string;
    budget: number;
    startDate: Date;
    endDate: Date;
    targetAudience: TargetAudience;
    goals: CampaignGoal[];
}

export enum ContentType {
    REVIEW = 'review',
    TUTORIAL = 'tutorial',
    GUIDE = 'guide',
    PROMOTION = 'promotion',
    COMPARISON = 'comparison'
}

export enum ContentCategory {
    GYM_REVIEW = 'gym_review',
    SUPPLEMENT_REVIEW = 'supplement_review',
    EQUIPMENT_REVIEW = 'equipment_review',
    TRAINER_REVIEW = 'trainer_review',
    NUTRITION_GUIDE = 'nutrition_guide',
    WORKOUT_GUIDE = 'workout_guide',
    PRODUCT_PROMOTION = 'product_promotion'
}

export enum SponsorTier {
    BRONZE = 'bronze',
    SILVER = 'silver',
    GOLD = 'gold',
    PLATINUM = 'platinum'
}

export enum ContentStatus {
    DRAFT = 'draft',
    PENDING_REVIEW = 'pending_review',
    APPROVED = 'approved',
    PUBLISHED = 'published',
    REJECTED = 'rejected',
    ARCHIVED = 'archived'
}

export enum CampaignGoal {
    BRAND_AWARENESS = 'brand_awareness',
    LEAD_GENERATION = 'lead_generation',
    SALES = 'sales',
    ENGAGEMENT = 'engagement'
}

// Review and Rating types
export interface Review {
    readonly id: string;
    userId: string;
    user: User;
    targetId: string;
    targetType: ReviewTargetType;
    rating: DetailedRating;
    title: string;
    content: string;
    pros?: string[];
    cons?: string[];
    images?: string[];
    isVerified: boolean;
    isSponsored: boolean;
    helpfulCount: number;
    unhelpfulCount: number;
    replies: ReviewReply[];
    createdAt: Date;
    updatedAt: Date;
}

export interface DetailedRating {
    overall: number;
    quality?: number;
    value?: number;
    service?: number;
    cleanliness?: number;
    equipment?: number;
    staff?: number;
}

export interface Rating {
    userId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
}

export interface ReviewReply {
    id: string;
    userId: string;
    user: User;
    content: string;
    createdAt: Date;
}

export enum ReviewTargetType {
    GYM = 'gym',
    TRAINER = 'trainer',
    SUPPLEMENT = 'supplement',
    EQUIPMENT = 'equipment',
    WORKOUT = 'workout'
}

// Business and Analytics types
export interface ContentAnalytics {
    views: number;
    uniqueViews: number;
    clicks: number;
    shares: number;
    likes: number;
    comments: number;
    engagementRate: number;
    conversionRate?: number;
    revenue?: number;
    lastUpdated: Date;
}

export interface ContentMetadata {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    readingTime: number; // minutes
    targetAudience: TargetAudience;
    relatedContent?: string[];
}

export interface TargetAudience {
    ageRange: [number, number];
    gender?: Gender[];
    fitnessLevel: ExperienceLevel[];
    interests: string[];
    location?: string[];
}

// Notification types
export interface NotificationSettings {
    email: boolean;
    push: boolean;
    sms: boolean;
    workoutReminders: boolean;
    sponsoredContent: boolean;
    newFeatures: boolean;
    marketing: boolean;
}

export interface PrivacySettings {
    profileVisibility: 'public' | 'friends' | 'private';
    workoutVisibility: 'public' | 'friends' | 'private';
    allowDataCollection: boolean;
    allowPersonalization: boolean;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T | undefined | null;
    message?: string;
    error?: string;
    metadata?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Form types
export interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterFormData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    age: number;
    weight: number;
    height: number;
    gender: Gender;
    fitnessGoals: FitnessGoal[];
    experienceLevel: ExperienceLevel;
    agreeToTerms: boolean;
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

export interface ReviewFormData {
    targetId: string;
    targetType: ReviewTargetType;
    rating: DetailedRating;
    title: string;
    content: string;
    pros?: string[];
    cons?: string[];
    images?: File[];
}

// Error types
export interface AppError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

export interface ValidationError {
    field: string;
    message: string;
}

// Filter and Search types
export interface WorkoutFilters {
    category?: WorkoutCategory[];
    difficulty?: DifficultyLevel[];
    duration?: [number, number];
    equipment?: Equipment[];
    muscleGroups?: MuscleGroup[];
    tags?: string[];
    isSponsored?: boolean;
}

export interface SearchParams {
    query?: string;
    filters?: WorkoutFilters;
    sortBy?: 'name' | 'rating' | 'difficulty' | 'duration' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

// Utility types
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
