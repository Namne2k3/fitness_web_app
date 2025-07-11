/**
 * 🔐 Auth Repository
 * Data access layer cho authentication operations
 */

import { UserModel, IUser } from '../models/User';
import { UserRole } from '../types';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    password: string;
    role?: UserRole;
    emailVerificationToken?: string;
    profile: {
        firstName: string;
        lastName: string;
        age: number;
        gender: 'male' | 'female' | 'other';
        weight: number;
        height: number;
        fitnessGoals: string[];
        experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    };
}

export class AuthRepository {
    /**
     * Create new user account
     */
    static async createUser(userData: RegisterData): Promise<IUser> {
        const user = new UserModel(userData);
        await user.save();
        return user;
    }

    /**
     * Find user by email for authentication
     */
    static async findByEmailForAuth(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email }) as IUser | null;
    }

    /**
     * Find user by email with password for authentication
     */
    static async findByEmailWithPassword(email: string): Promise<IUser | null> {
        return await UserModel.findOne({
            email,
            isActive: true
        }).select('+password') as IUser | null;
    }

    /**
     * Find user by username for authentication
     */
    static async findByUsernameForAuth(username: string): Promise<IUser | null> {
        return await UserModel.findOne({ username }) as IUser | null;
    }

    /**
     * Find user by ID for authentication
     */
    static async findByIdForAuth(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId) as IUser | null;
    }

    /**
     * Find user by ID with password
     */
    static async findByIdWithPassword(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId).select('+password') as IUser | null;
    }

    /**
     * Check if email already exists
     */
    static async emailExists(email: string): Promise<boolean> {
        const count = await UserModel.countDocuments({ email });
        return count > 0;
    }

    /**
     * Check if username already exists
     */
    static async usernameExists(username: string): Promise<boolean> {
        const count = await UserModel.countDocuments({ username });
        return count > 0;
    }

    /**
     * Update last login time
     */
    static async updateLastLogin(userId: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            { lastLoginAt: new Date() },
            { new: true }
        ) as IUser | null;
    }

    /**
     * Update user verification status
     */
    static async updateEmailVerification(
        userId: string,
        isVerified: boolean,
        token?: string
    ): Promise<IUser | null> {
        const updateData: any = { isEmailVerified: isVerified };

        if (isVerified) {
            updateData.emailVerificationToken = undefined;
        } else if (token) {
            updateData.emailVerificationToken = token;
        }

        return await UserModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ) as IUser | null;
    }

    /**
     * Set email verification token
     */
    static async setEmailVerificationToken(userId: string, token: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            { emailVerificationToken: token },
            { new: true }
        ) as IUser | null;
    }

    /**
     * Find user by email verification token
     */
    static async findByEmailVerificationToken(token: string): Promise<IUser | null> {
        return await UserModel.findOne({ emailVerificationToken: token }) as IUser | null;
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
            { new: true }
        ) as IUser | null;
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
     * Update user password
     */
    static async updatePassword(userId: string, hashedPassword: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                password: hashedPassword,
                $unset: {
                    passwordResetToken: 1,
                    passwordResetExpires: 1
                }
            },
            { new: true }
        ) as IUser | null;
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
            { new: true }
        ) as IUser | null;
    }

    /**
     * Find user by email (without password)
     */
    static async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email }).select('-password') as IUser | null;
    }

    /**
     * Find user by ID (without password)
     */
    static async findById(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId).select('-password') as IUser | null;
    }

    /**
     * Update user activity status
     */
    static async updateActiveStatus(userId: string, isActive: boolean): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            { isActive },
            { new: true }
        ).select('-password') as IUser | null;
    }

    /**
     * Update user status (alias for updateActiveStatus)
     */
    static async updateUserStatus(userId: string, isActive: boolean): Promise<IUser | null> {
        return await this.updateActiveStatus(userId, isActive);
    }

    /**
     * Update user profile
     */
    static async updateUserProfile(userId: string, profileData: any): Promise<IUser | null> {
        const user = await UserModel.findById(userId);
        if (!user) {
            return null;
        }

        Object.assign(user.profile, profileData);
        await user.save();
        return user;
    }

    /**
     * Get user count by role
     */
    static async getUserCountByRole(role?: UserRole): Promise<number> {
        const query = role ? { role } : {};
        return await UserModel.countDocuments(query);
    }

    /**
     * Get verified user count
     */
    static async getVerifiedUserCount(): Promise<number> {
        return await UserModel.countDocuments({ isEmailVerified: true });
    }

    /**
     * Get active user count (logged in within last 30 days)
     */
    static async getActiveUserCount(): Promise<number> {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return await UserModel.countDocuments({
            lastLoginAt: { $gte: thirtyDaysAgo }
        });
    }

    /**
     * Find recently registered users
     */
    static async findRecentUsers(limit: number = 10): Promise<IUser[]> {
        return await UserModel.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit) as IUser[];
    }

    /**
     * Check if user has role
     */
    static async userHasRole(userId: string, role: UserRole): Promise<boolean> {
        const count = await UserModel.countDocuments({ _id: userId, role });
        return count > 0;
    }

    /**
     * Update user role
     */
    static async updateUserRole(userId: string, role: UserRole): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('-password') as IUser | null;
    }

    /**
     * Soft delete user (deactivate)
     */
    static async deactivateUser(userId: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            userId,
            { isActive: false },
            { new: true }
        ).select('-password') as IUser | null;
    }

    /**
     * Permanently delete user
     */
    static async deleteUser(userId: string): Promise<boolean> {
        const result = await UserModel.deleteOne({ _id: userId });
        return result.deletedCount > 0;
    }
}
