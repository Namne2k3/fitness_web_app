/**
 * 👤 Account Repository
 * Data access layer cho account operations
 */

import mongoose from 'mongoose';
import { UserModel, IUser } from '../models/User';
import { UserProfile, UserPreferences } from '../types';

export interface CreateUserData {
    email: string;
    username: string;
    password: string;
    role?: 'user' | 'trainer' | 'admin';
    emailVerificationToken?: string;
    profile: Partial<UserProfile>;
    preferences?: Partial<UserPreferences>;
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    weight?: number;
    height?: number;
    fitnessGoals?: string[];
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    avatar?: string;
    bio?: string;
    medicalConditions?: string[];
}

export interface UpdatePreferencesData {
    contentTypes?: string[];
    notifications?: {
        workoutReminders?: boolean;
        newContent?: boolean;
        sponsoredOffers?: boolean;
        socialUpdates?: boolean;
        email?: boolean;
        push?: boolean;
    };
    privacy?: {
        profileVisibility?: 'public' | 'friends' | 'private';
        showRealName?: boolean;
        allowMessages?: boolean;
        shareWorkouts?: boolean;
        trackingConsent?: boolean;
    };
    theme?: 'light' | 'dark' | 'auto';
    language?: 'vi' | 'en';
    units?: 'metric' | 'imperial';
}

export class AccountRepository {
    /**
     * Create new user account
     */
    static async create(userData: CreateUserData): Promise<IUser> {
        const user = new UserModel(userData);
        await user.save();
        return user;
    }

    /**
     * Find user by ID
     */
    static async findById(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId).select('-password') as IUser | null;
    }

    /**
     * Find user by ID including password (for authentication)
     */
    static async findByIdWithPassword(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId) as IUser | null;
    }

    /**
     * Find user by email
     */
    static async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email }).select('-password') as IUser | null;
    }

    /**
     * Find user by email including password (for authentication)
     */
    static async findByEmailWithPassword(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email }) as IUser | null;
    }

    /**
     * Find user by username
     */
    static async findByUsername(username: string): Promise<IUser | null> {
        return await UserModel.findOne({ username }).select('-password') as IUser | null;
    }

    /**
     * Find user by username including password (for authentication)
     */
    static async findByUsernameWithPassword(username: string): Promise<IUser | null> {
        return await UserModel.findOne({ username }) as IUser | null;
    }

    /**
     * Find user by email verification token
     */
    static async findByEmailVerificationToken(token: string): Promise<IUser | null> {
        return await UserModel.findOne({ emailVerificationToken: token }) as IUser | null;
    }

    /**
     * Find user by password reset token
     */
    static async findByPasswordResetToken(token: string): Promise<IUser | null> {
        return await UserModel.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() }
        }) as IUser | null;
    }

    /**
     * Update user by ID
     */
    static async updateById(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            updates,
            { new: true, runValidators: true }
        ).select('-password') as IUser | null;
    }

    /**
     * Update user profile
     */
    static async updateProfile(userId: string, profileData: UpdateProfileData): Promise<IUser | null> {
        const updates = Object.keys(profileData).reduce((acc, key) => {
            acc[`profile.${key}`] = profileData[key as keyof UpdateProfileData];
            return acc;
        }, {} as any);

        return await UserModel.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password') as IUser | null;
    }

    /**
     * Update user preferences
     */
    static async updatePreferences(userId: string, preferencesData: UpdatePreferencesData): Promise<IUser | null> {
        const updates = Object.keys(preferencesData).reduce((acc, key) => {
            if (typeof preferencesData[key as keyof UpdatePreferencesData] === 'object') {
                // Handle nested objects
                const nestedObj = preferencesData[key as keyof UpdatePreferencesData] as any;
                Object.keys(nestedObj).forEach(nestedKey => {
                    acc[`preferences.${key}.${nestedKey}`] = nestedObj[nestedKey];
                });
            } else {
                acc[`preferences.${key}`] = preferencesData[key as keyof UpdatePreferencesData];
            }
            return acc;
        }, {} as any);

        return await UserModel.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password') as IUser | null;
    }

    /**
     * Update user password
     */
    static async updatePassword(userId: string, hashedPassword: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true, runValidators: true }
        ).select('-password') as IUser | null;
    }

    /**
     * Update email verification status
     */
    static async updateEmailVerification(userId: string, isVerified: boolean): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                isEmailVerified: isVerified,
                emailVerificationToken: isVerified ? undefined : undefined
            },
            { new: true, runValidators: true }
        ).select('-password') as IUser | null;
    }

    /**
     * Set email verification token
     */
    static async setEmailVerificationToken(userId: string, token: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            { emailVerificationToken: token },
            { new: true, runValidators: true }
        ).select('-password') as IUser | null;
    }

    /**
     * Set password reset token
     */
    static async setPasswordResetToken(
        userId: string,
        token: string,
        expiresAt: Date
    ): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                passwordResetToken: token,
                passwordResetExpires: expiresAt
            },
            { new: true, runValidators: true }
        ).select('-password') as IUser | null;
    }

    /**
     * Clear password reset token
     */
    static async clearPasswordResetToken(userId: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                $unset: {
                    passwordResetToken: 1,
                    passwordResetExpires: 1
                }
            },
            { new: true, runValidators: true }
        ).select('-password') as IUser | null;
    }

    /**
     * Update last login time
     */
    static async updateLastLogin(userId: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            { lastLoginAt: new Date() },
            { new: true, runValidators: true }
        ).select('-password') as IUser | null;
    }

    /**
     * Update user activity status
     */
    static async updateActiveStatus(userId: string, isActive: boolean): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            { isActive },
            { new: true, runValidators: true }
        ).select('-password') as IUser | null;
    }

    /**
     * Delete user account
     */
    static async deleteById(userId: string): Promise<boolean> {
        const result = await UserModel.deleteOne({ _id: userId });
        return result.deletedCount > 0;
    }

    /**
     * Check if email exists
     */
    static async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
        const query: any = { email };
        if (excludeUserId) {
            query._id = { $ne: new mongoose.Types.ObjectId(excludeUserId) };
        }

        const count = await UserModel.countDocuments(query);
        return count > 0;
    }

    /**
     * Check if username exists
     */
    static async usernameExists(username: string, excludeUserId?: string): Promise<boolean> {
        const query: any = { username };
        if (excludeUserId) {
            query._id = { $ne: new mongoose.Types.ObjectId(excludeUserId) };
        }

        const count = await UserModel.countDocuments(query);
        return count > 0;
    }

    /**
     * Get user statistics
     */
    static async getUserStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        verifiedUsers: number;
        trainerUsers: number;
    }> {
        const stats = await UserModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    activeUsers: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                    },
                    verifiedUsers: {
                        $sum: { $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0] }
                    },
                    trainerUsers: {
                        $sum: { $cond: [{ $eq: ['$role', 'trainer'] }, 1, 0] }
                    }
                }
            }
        ]);

        return stats[0] || {
            totalUsers: 0,
            activeUsers: 0,
            verifiedUsers: 0,
            trainerUsers: 0
        };
    }

    /**
     * Find users by role
     */
    static async findByRole(
        role: 'user' | 'trainer' | 'admin',
        options: { page?: number; limit?: number } = {}
    ): Promise<{
        users: IUser[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const { page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            UserModel.find({ role })
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit) as Promise<IUser[]>,
            UserModel.countDocuments({ role })
        ]);

        return {
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    /**
     * Find users by activity status
     */
    static async findByActiveStatus(isActive: boolean): Promise<IUser[]> {
        return await UserModel.find({ isActive }).select('-password') as IUser[];
    }

    /**
     * Find users created in date range
     */
    static async findByDateRange(startDate: Date, endDate: Date): Promise<IUser[]> {
        return await UserModel.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).select('-password') as IUser[];
    }

    /**
     * Search users by name or username
     */
    static async searchUsers(
        searchTerm: string,
        options: { page?: number; limit?: number } = {}
    ): Promise<{
        users: IUser[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const { page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;

        const searchRegex = new RegExp(searchTerm, 'i');
        const query = {
            $or: [
                { username: searchRegex },
                { 'profile.firstName': searchRegex },
                { 'profile.lastName': searchRegex },
                { email: searchRegex }
            ]
        };

        const [users, total] = await Promise.all([
            UserModel.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit) as Promise<IUser[]>,
            UserModel.countDocuments(query)
        ]);

        return {
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
}
