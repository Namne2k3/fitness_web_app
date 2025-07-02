/**
 * 👤 User Model
 * MongoDB schema cho user data với Mongoose
 */

import mongoose, { Schema, Document } from 'mongoose';
import {
    User,
    UserProfile,
    UserPreferences,
    UserSubscription,
    UserRole,
    ExperienceLevel,
    SubscriptionPlan,
    SubscriptionStatus,
    Gender
} from '../types';
import { NextFunction } from 'express';

/**
 * User document interface for Mongoose
 */
export interface IUser extends Omit<User, '_id'>, Document {
    hasRole(role: UserRole): boolean;
    canAccessPremium(): boolean;
    updateLastLogin(): Promise<IUser>;
}

export enum FitnessGoal {
    WEIGHT_LOSS = 'weight_loss',
    MUSCLE_GAIN = 'muscle_gain',
    STRENGTH = 'strength',
    ENDURANCE = 'endurance',
    FLEXIBILITY = 'flexibility',
    GENERAL_FITNESS = 'general_fitness'
}

/**
 * User Profile schema
 */
const UserProfileSchema = new Schema<UserProfile>({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [13, 'Must be at least 13 years old'],
        max: [120, 'Age cannot exceed 120']
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
        required: [true, 'Gender is required']
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [20, 'Weight must be at least 20kg'],
        max: [500, 'Weight cannot exceed 500kg']
    },
    height: {
        type: Number,
        required: [true, 'Height is required'],
        min: [100, 'Height must be at least 100cm'],
        max: [250, 'Height cannot exceed 250cm']
    }, fitnessGoals: [{
        type: String,
        required: true
    }],
    experienceLevel: {
        type: String,
        enum: Object.values(ExperienceLevel),
        required: [true, 'Experience level is required'],
        default: ExperienceLevel.BEGINNER
    }, avatar: {
        type: String,
        validate: {
            validator: function (v: string) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Avatar must be a valid URL'
        }
    }, bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    medicalConditions: [{
        type: String
    }]
}, { _id: false });

/**
 * User Preferences schema
 */
const UserPreferencesSchema = new Schema({
    contentTypes: [{
        type: String,
        enum: ['workout', 'nutrition', 'review', 'guide', 'news']
    }],
    notifications: {
        workoutReminders: { type: Boolean, default: true },
        newContent: { type: Boolean, default: true },
        sponsoredOffers: { type: Boolean, default: false },
        socialUpdates: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
    },
    privacy: {
        profileVisibility: {
            type: String,
            enum: ['public', 'friends', 'private'],
            default: 'public'
        },
        showRealName: { type: Boolean, default: true },
        allowMessages: { type: Boolean, default: true },
        shareWorkouts: { type: Boolean, default: true },
        trackingConsent: { type: Boolean, default: false }
    },
    theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto'
    },
    language: {
        type: String,
        enum: ['vi', 'en'],
        default: 'vi'
    },
    units: {
        type: String,
        enum: ['metric', 'imperial'],
        default: 'metric'
    }
}, { _id: false });

/**
 * User Subscription schema
 */
const UserSubscriptionSchema = new Schema<UserSubscription>({
    plan: {
        type: String,
        enum: ['free', 'premium', 'pro'],
        default: 'free'
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    stripeCustomerId: {
        type: String
    },
    stripeSubscriptionId: {
        type: String
    },
    cancelAtPeriodEnd: {
        type: Boolean,
        default: false
    },
    features: [{
        type: String
    }]
}, { _id: false });

/**
 * Main User schema
 */
const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v: string) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Vui lòng nhập địa chỉ email hợp lệ'
        }
    },
    username: {
        type: String,
        required: [true, 'Username là bắt buộc'],
        unique: true,
        trim: true,
        minlength: [3, 'Username phải có ít nhất 3 ký tự'],
        maxlength: [30, 'Username không được vượt quá 30 ký tự'],
        validate: {
            validator: function (v: string) {
                return /^[a-zA-Z0-9_]+$/.test(v);
            },
            message: 'Username chỉ có thể chứa chữ cái, số và dấu gạch dưới'
        }
    },
    password: {
        type: String,
        required: [true, 'Password là bắt buộc'],
        minlength: [6, 'Password phải có ít nhất 6 ký tự'],
        select: false // Don't include password in queries by default
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    lastLoginAt: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },

    // Embedded schemas
    profile: {
        type: UserProfileSchema,
        required: true
    },
    preferences: {
        type: UserPreferencesSchema,
        default: () => ({})
    },
    subscription: {
        type: UserSubscriptionSchema,
        default: () => ({})
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.emailVerificationToken;
            delete ret.passwordResetToken;
            delete ret.passwordResetExpiry;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// ================================
// 📊 Virtual Properties
// ================================

/**
 * Calculate BMI from height and weight
 */
UserSchema.virtual('profile.bmi').get(function (this: IUser) {
    if (!this.profile || !this.profile.height || !this.profile.weight) {
        return null;
    }
    const heightInMeters = this.profile.height / 100;
    return Math.round((this.profile.weight / (heightInMeters * heightInMeters)) * 10) / 10;
});

/**
 * Get full name
 */
UserSchema.virtual('profile.fullName').get(function (this: IUser) {
    if (!this.profile || !this.profile.firstName || !this.profile.lastName) {
        return '';
    }
    return `${this.profile.firstName} ${this.profile.lastName}`;
});

/**
 * Check if subscription is active
 */
UserSchema.virtual('subscription.isActive').get(function (this: IUser) {
    if (!this.subscription || !this.subscription.status) {
        return false;
    }
    return this.subscription.status === SubscriptionStatus.ACTIVE &&
        (!this.subscription.endDate || this.subscription.endDate > new Date());
});

// ================================
// 🔍 Indexes for Performance
// ================================

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ 'profile.experienceLevel': 1 });
UserSchema.index({ 'subscription.plan': 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ lastLoginAt: -1 });

// Compound indexes
UserSchema.index({ isActive: 1, role: 1 });
UserSchema.index({ 'profile.fitnessGoals': 1, 'profile.experienceLevel': 1 });

// ================================
// 🔧 Instance Methods
// ================================

/**
 * Check if user has specific role
 */
UserSchema.methods.hasRole = function (this: IUser, role: UserRole): boolean {
    return this.role === role;
};

/**
 * Check if user can access premium features
 */
UserSchema.methods.canAccessPremium = function (this: IUser): boolean {
    return this.subscription.plan !== SubscriptionPlan.FREE &&
        this.subscription.status === SubscriptionStatus.ACTIVE;
};

/**
 * Update last login timestamp
 */
UserSchema.methods.updateLastLogin = function (this: IUser): Promise<IUser> {
    this.lastLoginAt = new Date();
    return this.save();
};

// ================================
// 🔧 Static Methods
// ================================

/**
 * Find users by fitness goals
 */
UserSchema.statics.findByFitnessGoals = function (goals: FitnessGoal[]) {
    return this.find({
        'profile.fitnessGoals': { $in: goals },
        isActive: true
    });
};

/**
 * Find users by experience level
 */
UserSchema.statics.findByExperienceLevel = function (level: ExperienceLevel) {
    return this.find({
        'profile.experienceLevel': level,
        isActive: true
    });
};

// ================================
// 🔄 Middleware Hooks
// ================================

/**
 * Pre-save middleware
 */
UserSchema.pre('save', function (this: IUser, next) {
    // Set default fitness goals if empty
    if (!this.profile.fitnessGoals || this.profile.fitnessGoals.length === 0) {
        this.profile.fitnessGoals = [FitnessGoal.GENERAL_FITNESS];
    }

    next();
});

/**
 * Pre-remove middleware
 */
// UserSchema.pre('remove', function (this: IUser, next: NextFunction) {
//     // Here you can clean up related data when user is deleted
//     // For example: delete user's workouts, reviews, etc.
//     next();
// });

export const UserModel = mongoose.model('User', UserSchema);
