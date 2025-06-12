/**
 * 🔐 Auth Mapper
 * Transform và filter sensitive data cho client responses
 */

import { IUser } from '../models/User';
import { User } from '../types';

/**
 * Safe User interface - chỉ email, username và profile
 */
export interface SafeUser {
    email: string;
    username: string;
    profile: {
        firstName: string;
        lastName: string;
        age: number;
        weight?: number;
        height?: number;
        fitnessGoals: string[];
        experienceLevel: string;
        avatar?: string;
        bio?: string;
        bmi?: number;
        fullName?: string;
    };
}

/**
 * Login response interface
 */
export interface LoginDataResponse {
    user: SafeUser;
    accessToken: string;
    refreshToken: string;
}

/**
 * Register response interface
 */
export interface RegisterDataResponse {
    user: SafeUser;
    accessToken: string;
    refreshToken: string;
    message: string;
}

/**
 * Current user response interface
 */
export interface CurrentUserResponse {
    user: SafeUser;
}

/**
 * Minimal User interface - chỉ email, username và profile
 */
export interface MinimalUser {
    email: string;
    username: string;
    profile: {
        firstName: string;
        lastName: string;
        age: number;
        weight?: number;
        height?: number;
        fitnessGoals: string[];
        experienceLevel: string;
        avatar?: string;
        bio?: string;
        bmi?: number;
        fullName?: string;
    };
}

/**
 * Public profile interface (minimal data)
 */
export interface PublicUserProfile {
    _id: string;
    username: string;
    profile: {
        firstName: string;
        lastName: string;
        fitnessGoals: string[];
        experienceLevel: string;
        avatar?: string;
        bio?: string;
    };
    createdAt: Date;
}

/**
 * Auth Mapper Class
 */
export class AuthMapper {
    /**
     * 🔹 Transform User document/object sang Safe User (loại bỏ sensitive data)
     */
    static toSafeUser(user: User | IUser): SafeUser {
        // Handle both Mongoose document and plain object
        const userObj = user instanceof Object && 'toObject' in user ? (user as IUser).toObject() : user as User;

        return {
            email: userObj.email,
            username: userObj.username,
            profile: {
                firstName: userObj.profile.firstName,
                lastName: userObj.profile.lastName,
                age: userObj.profile.age,
                weight: userObj.profile.weight,
                height: userObj.profile.height,
                fitnessGoals: userObj.profile.fitnessGoals.map((goal: any) => goal.toString()),
                experienceLevel: userObj.profile.experienceLevel.toString(),
                avatar: userObj.profile.avatar,
                bio: userObj.profile.bio,
                // Virtual field BMI (nếu có weight và height)
                ...(userObj.profile.weight && userObj.profile.height
                    ? { bmi: Number((userObj.profile.weight / Math.pow(userObj.profile.height / 100, 2)).toFixed(1)) }
                    : {}),
                fullName: `${userObj.profile.firstName} ${userObj.profile.lastName}`
            }
        };
    }

    /**
     * 🔹 Transform login response (nested structure từ AuthService)
     */
    static toLoginResponse(data: any): LoginDataResponse {
        return {
            user: this.toSafeUser(data.user),
            accessToken: data.tokens.accessToken,
            refreshToken: data.tokens.refreshToken
        };
    }

    /**
     * 🔹 Transform register response
     */
    static toRegisterResponse(data: any): RegisterDataResponse {
        return {
            user: this.toSafeUser(data.user),
            accessToken: data.tokens.accessToken,
            refreshToken: data.tokens.refreshToken,
            message: 'Account created successfully'
        };
    }

    /**
     * 🔹 Transform current user response (chỉ user data)
     */
    static toCurrentUserResponse(user: User | IUser): CurrentUserResponse {
        return {
            user: this.toSafeUser(user)
        };
    }

    /**
     * 🔹 Transform user profile cho public viewing (ít thông tin hơn)
     */
    static toPublicProfile(user: User | IUser): PublicUserProfile {
        const userObj = user instanceof Object && 'toObject' in user ? (user as IUser).toObject() : user as User;

        return {
            _id: userObj._id.toString(),
            username: userObj.username, profile: {
                firstName: userObj.profile.firstName,
                lastName: userObj.profile.lastName,
                fitnessGoals: userObj.profile.fitnessGoals.map((goal: any) => goal.toString()),
                experienceLevel: userObj.profile.experienceLevel.toString(),
                avatar: userObj.profile.avatar,
                bio: userObj.profile.bio
            },
            createdAt: userObj.createdAt
        };
    }

    /**
     * 🔹 Transform user list cho admin/search (minimal data)
     */
    static toUserList(users: (User | IUser)[]): Array<{
        _id: string;
        username: string;
        email: string;
        role: string;
        profile: {
            firstName: string;
            lastName: string;
            fullName: string;
        };
        isEmailVerified: boolean;
        subscription: {
            plan: string;
            status: string;
        };
        createdAt: Date;
        lastLoginAt?: Date;
    }> {
        return users.map(user => {
            const userObj = user instanceof Object && 'toObject' in user ? (user as IUser).toObject() : user as User;

            return {
                _id: userObj._id.toString(),
                username: userObj.username,
                email: userObj.email,
                role: userObj.role.toString(),
                profile: {
                    firstName: userObj.profile.firstName,
                    lastName: userObj.profile.lastName,
                    fullName: `${userObj.profile.firstName} ${userObj.profile.lastName}`
                },
                isEmailVerified: userObj.isEmailVerified,
                subscription: {
                    plan: userObj.subscription.plan.toString(),
                    status: userObj.subscription.status.toString()
                },
                createdAt: userObj.createdAt,
                lastLoginAt: userObj.lastLoginAt
            };
        });
    }

    /**
     * 🔹 Remove sensitive fields for logging (development/debugging)
     */
    static toLogSafeUser(user: any): any {
        const logSafe = { ...user };

        // Remove sensitive fields
        delete logSafe.password;
        delete logSafe.emailVerificationToken;
        delete logSafe.passwordResetToken;
        delete logSafe.passwordResetExpires;
        delete logSafe.__v;

        return logSafe;
    }

    /**
     * 🔹 Transform error response để không leak sensitive info
     */
    static toErrorResponse(error: any): any {
        const safeError = {
            message: error.message || 'An error occurred',
            type: error.constructor.name,
            timestamp: new Date().toISOString()
        };

        // Trong development mode, có thể include stack trace
        if (process.env.NODE_ENV === 'development') {
            (safeError as any).stack = error.stack;
        }

        return safeError;
    }
}