export interface User {
    readonly _id: string;
    email: string;
    username: string;
    role: UserRole;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    lastLoginAt?: Date;
    isActive: boolean;
    profile: UserProfile;
    preferences: UserPreferences;
    subscription: UserSubscription;
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
    avatar?: string; // Cloudinary URL
    bio?: string; // max 500 chars
    medicalConditions?: string[];
}

export interface UserPreferences {
    contentTypes?: string[];
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    theme: 'light' | 'dark' | 'auto';
    language: 'vi' | 'en';
    units: 'metric' | 'imperial';
}

export interface UserSubscription {
    plan: 'free' | 'premium' | 'pro';
    status: 'active' | 'cancelled' | 'expired';
    startDate?: Date;
    endDate?: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    cancelAtPeriodEnd?: boolean;
    features?: string[]; // enabled features
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
    showRealName: boolean;
    allowMessages: boolean;
    shareWorkouts: boolean;
    trackingConsent: boolean;
}