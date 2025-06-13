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