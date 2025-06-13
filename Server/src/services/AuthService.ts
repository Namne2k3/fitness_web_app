/**
 * 🔐 Authentication Service
 * Business logic cho user authentication và management
 */

import { UserModel, IUser } from '../models/User';
import {
    hashPassword,
    comparePassword,
    generateTokens,
    generateSecureToken,
    verifyRefreshToken
} from '../config/auth';
import {
    validateLogin,
    validateRegister,
    validateUserProfile,
    validateChangePassword,
    validateEmail,
    validateResetPassword,
    validateToken
} from '../utils/validation';
import {
    calculateBMI,
    getBMICategory,
    validateBMIForGoals,
    generateHealthInsights
} from '../utils/healthCalculations';
import {
    User,
    AuthTokens,
    UserRole,
    UserProfile
} from '../types';
import { EmailService } from './EmailService';

/**
 * Registration request interface
 */
export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    profile: UserProfile;
}

/**
 * Login request interface
 */
export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean; // Optional for "Remember Me" functionality
}

/**
 * Change password request interface
 */
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

/**
 * Reset password request interface
 */
export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmNewPassword: string;
}

/**
 * Forgot password request interface
 */
export interface ForgotPasswordRequest {
    email: string;
}

/**
 * Auth response interface
 */
export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

/**
 * Authentication Service Class
 */
export class AuthService {
    /**
     * Đăng ký user mới
     */
    static async register(data: RegisterRequest): Promise<AuthResponse> {
        // Validate input data
        const validation = validateRegister(data);
        if (!validation.isValid) {
            throw new Error(validation.message || 'Validation failed');
        }

        const { email, username, password, profile } = validation.data;

        // Check if user already exists
        const existingUser = await UserModel.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                throw new Error('Email already registered');
            }
            if (existingUser.username === username.toLowerCase()) {
                throw new Error('Username already taken');
            }
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Generate email verification token
        const emailVerificationToken = generateSecureToken();

        // Create new user
        const user = new UserModel({
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password: hashedPassword,
            role: UserRole.USER,
            profile,
            isEmailVerified: false,
            emailVerificationToken,
            isActive: true
        });

        await user.save();

        // Generate JWT tokens
        const tokens = generateTokens(user._id, user.email, user.role);

        // Update last login
        await user.updateLastLogin();

        // Return user without sensitive data
        const userWithoutPassword = await UserModel.findById(user._id);

        return {
            user: userWithoutPassword!.toJSON(),
            tokens
        };
    }

    /**
     * Đăng nhập user
     */
    static async login(data: LoginRequest): Promise<AuthResponse> {
        // Validate input data
        const validation = validateLogin(data);
        if (!validation.isValid) {
            throw new Error(validation.message || 'Sai định dạng email hoặc mật khẩu');
        }

        const { email, password, rememberMe } = validation.data;

        // Find user by email (include password for comparison)
        const user = await UserModel.findOne({
            email: email.toLowerCase(),
            isActive: true
        }).select('+password');

        if (!user) {
            throw new Error('Email không tồn tại hoặc tài khoản đã bị vô hiệu hóa');
        }

        // Compare password
        const isPasswordValid = await comparePassword(password, user.password ?? '');
        if (!isPasswordValid) {
            throw new Error('Sai mật khẩu');
        }

        // Generate JWT tokens
        const tokens = generateTokens(user._id, user.email, user.role);

        // Update last login
        await user.updateLastLogin();

        // Return user without sensitive data
        const userWithoutPassword = await UserModel.findById(user._id);

        return {
            user: userWithoutPassword!.toJSON(),
            tokens
        };
    }

    /**
     * Lấy user profile theo ID
     */
    static async getUserById(userId: string): Promise<User | null> {
        const user = await UserModel.findById(userId);
        return user ? user.toJSON() : null;
    }

    /**
     * Cập nhật user profile
     */
    static async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<User> {
        // Validate profile data
        const validation = validateUserProfile(profileData);
        if (!validation.isValid) {
            throw new Error(validation.message || 'Validation failed');
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Update profile fields
        Object.assign(user.profile, validation.data);
        await user.save();

        return user.toJSON();
    }

    /**
     * Đổi mật khẩu
     */
    static async changePassword(userId: string, data: ChangePasswordRequest): Promise<void> {
        // Validate input data
        const validation = validateChangePassword(data);
        if (!validation.isValid) {
            throw new Error(validation.message || 'Validation failed');
        }

        const { currentPassword, newPassword } = validation.data;

        // Get user with password
        const user = await UserModel.findById(userId).select('+password');
        if (!user) {
            throw new Error('User not found');
        }

        // Verify current password
        const isCurrentPasswordValid = await comparePassword(currentPassword, user.password ?? '');
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const hashedNewPassword = await hashPassword(newPassword);

        // Update password
        user.password = hashedNewPassword;
        await user.save();
    }

    /**
     * Kiểm tra email có tồn tại không
     */
    static async checkEmailExists(email: string): Promise<boolean> {
        const validation = validateEmail(email);
        if (!validation.isValid) {
            throw new Error(validation.message || 'Invalid email format');
        }

        const user = await UserModel.findOne({
            email: email.toLowerCase()
        }).select('_id');

        return !!user;
    }

    /**
     * Kiểm tra username có tồn tại không
     */
    static async checkUsernameExists(username: string): Promise<boolean> {
        if (!username || username.length < 3) {
            throw new Error('Username must be at least 3 characters');
        }

        const user = await UserModel.findOne({
            username: username.toLowerCase()
        }).select('_id');

        return !!user;
    }

    /**
     * Deactivate user account
     */
    static async deactivateAccount(userId: string): Promise<void> {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.isActive = false;
        await user.save();
    }

    /**
     * Activate user account
     */
    static async activateAccount(userId: string): Promise<void> {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.isActive = true;
        await user.save();
    }

    /**
     * Verify email với verification token
     */
    static async verifyEmail(token: string): Promise<User> {
        const user = await UserModel.findOne({
            emailVerificationToken: token
        }).select('+emailVerificationToken');

        if (!user) {
            throw new Error('Invalid verification token');
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = '';
        await user.save();

        return user.toJSON();
    }

    /**
     * Resend email verification
     */
    static async resendEmailVerification(email: string): Promise<string> {
        const validation = validateEmail(email);
        if (!validation.isValid) {
            throw new Error(validation.message || 'Invalid email format');
        }

        const user = await UserModel.findOne({
            email: email.toLowerCase()
        }).select('+emailVerificationToken');

        if (!user) {
            throw new Error('User not found');
        }

        if (user.isEmailVerified) {
            throw new Error('Email already verified');
        }

        // Generate new verification token
        const emailVerificationToken = generateSecureToken();
        user.emailVerificationToken = emailVerificationToken;
        await user.save();

        return emailVerificationToken;
    }    /**
     * Get user stats với health metrics
     */
    static async getUserStats(userId: string): Promise<any> {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Calculate health metrics
        const bmi = calculateBMI(user.profile.weight, user.profile.height);
        const bmiCategory = getBMICategory(bmi);

        // BMI warnings based on fitness goals
        const bmiWarnings = validateBMIForGoals(bmi, user.profile.fitnessGoals);

        return {
            id: user._id,
            joinDate: user.createdAt,
            lastLogin: user.lastLoginAt,
            isEmailVerified: user.isEmailVerified,
            subscriptionPlan: user.subscription.plan,
            subscriptionStatus: user.subscription.status,
            healthMetrics: {
                bmi: bmi,
                bmiCategory: bmiCategory,
                weight: user.profile.weight,
                height: user.profile.height,
                age: user.profile.age
            },
            fitnessProfile: {
                experienceLevel: user.profile.experienceLevel,
                fitnessGoals: user.profile.fitnessGoals,
                bmiWarnings: bmiWarnings
            }
        };
    }

    /**
     * Get detailed health insights và recommendations
     */
    static async getHealthInsights(userId: string): Promise<any> {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Calculate health metrics
        const bmi = calculateBMI(user.profile.weight, user.profile.height);
        const bmiCategory = getBMICategory(bmi);

        // BMI warnings and recommendations
        const bmiWarnings = validateBMIForGoals(bmi, user.profile.fitnessGoals);

        // Calculate BMR and TDEE estimates (assuming average gender distribution)
        const estimatedBMR = Math.round((
            10 * user.profile.weight +
            6.25 * user.profile.height -
            5 * user.profile.age
        ) + (Math.random() > 0.5 ? 5 : -161)); // Rough gender estimation

        const recommendedCalories = {
            sedentary: Math.round(estimatedBMR * 1.2),
            light: Math.round(estimatedBMR * 1.375),
            moderate: Math.round(estimatedBMR * 1.55),
            active: Math.round(estimatedBMR * 1.725),
            veryActive: Math.round(estimatedBMR * 1.9)
        };

        // Generate fitness recommendations based on goals and BMI
        const recommendations = this.generateFitnessRecommendations(
            user.profile.fitnessGoals,
            user.profile.experienceLevel,
            bmi,
            bmiCategory
        );

        return {
            healthMetrics: {
                bmi: bmi,
                bmiCategory: bmiCategory,
                weight: user.profile.weight,
                height: user.profile.height,
                age: user.profile.age,
                estimatedBMR: estimatedBMR
            },
            calorieRecommendations: recommendedCalories,
            fitnessProfile: {
                experienceLevel: user.profile.experienceLevel,
                fitnessGoals: user.profile.fitnessGoals,
                warnings: bmiWarnings
            },
            recommendations: recommendations
        };
    }

    /**
     * Generate personalized fitness recommendations
     */
    private static generateFitnessRecommendations(
        goals: any[],
        experienceLevel: string,
        bmi: number,
        bmiCategory: string
    ): any {
        const recommendations = {
            workoutFrequency: '',
            focusAreas: [] as string[],
            cautionNotes: [] as string[],
            suggestedActivities: [] as string[]
        };

        // Workout frequency based on experience
        switch (experienceLevel) {
            case 'beginner':
                recommendations.workoutFrequency = '3-4 times per week';
                recommendations.suggestedActivities.push('Walking', 'Light cardio', 'Bodyweight exercises');
                break;
            case 'intermediate':
                recommendations.workoutFrequency = '4-5 times per week';
                recommendations.suggestedActivities.push('Weight training', 'Moderate cardio', 'Flexibility training');
                break;
            case 'advanced':
                recommendations.workoutFrequency = '5-6 times per week';
                recommendations.suggestedActivities.push('Intense training', 'Sport-specific exercises', 'Advanced techniques');
                break;
        }

        // Focus areas based on goals
        if (goals.includes('weight_loss')) {
            recommendations.focusAreas.push('Cardio training', 'Caloric deficit', 'High-intensity intervals');
        }
        if (goals.includes('muscle_gain')) {
            recommendations.focusAreas.push('Resistance training', 'Progressive overload', 'Adequate protein intake');
        }
        if (goals.includes('strength')) {
            recommendations.focusAreas.push('Compound movements', 'Heavy lifting', 'Rest and recovery');
        }

        // BMI-based cautions
        if (bmi < 18.5) {
            recommendations.cautionNotes.push('Focus on healthy weight gain through muscle building');
            recommendations.cautionNotes.push('Consult healthcare provider before intense training');
        } else if (bmi > 30) {
            recommendations.cautionNotes.push('Start with low-impact exercises');
            recommendations.cautionNotes.push('Focus on gradual weight loss');
            recommendations.cautionNotes.push('Consider medical supervision');
        }

        return recommendations;
    }

    /**
     * Refresh tokens (generate new access token from refresh token)
     */
    static async refreshToken(refreshToken: string): Promise<AuthTokens> {
        try {
            // Verify refresh token
            const { userId } = verifyRefreshToken(refreshToken);

            // Fetch user to ensure they still exist
            const user = await UserModel.findById(userId);
            if (!user || !user.isActive) {
                throw new Error('User not found or inactive');
            }

            // Generate new tokens
            return generateTokens(user._id, user.email, user.role);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    /**
     * 📧 Forgot Password - Generate và gửi reset token
     */
    static async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
        // Validate email
        const validation = validateEmail(data.email);
        if (!validation.isValid) {
            throw new Error('Email không hợp lệ');
        }

        const { email } = validation.data;

        // Find user by email
        const user = await UserModel.findOne({
            email: email.toLowerCase(),
            isActive: true
        });

        // Always return success message for security (không reveal user existence)
        if (!user) {
            return {
                message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link reset password trong vài phút.'
            };
        }

        // Generate reset token (expires in 1 hour)
        const resetToken = generateSecureToken();
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

        // Save reset token to user
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetTokenExpiry;
        await user.save();

        // TODO: Send email với reset link
        await EmailService.sendPasswordResetEmail(user.email, resetToken, user.username);
        // console.log(`🔗 Password reset token for ${email}: ${resetToken}`);
        // console.log(`🔗 Reset link: ${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`);

        return {
            message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link reset password trong vài phút.'
        };
    }

    /**
     * 🔒 Reset Password - Verify token và update password
     */
    static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
        // Validate reset password data
        const validation = validateResetPassword(data);
        if (!validation.isValid) {
            throw new Error(validation.message || 'Dữ liệu không hợp lệ');
        }

        const { token, newPassword } = validation.data;

        // Find user by reset token
        const user = await UserModel.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() }, // Token chưa expired
            isActive: true
        });

        if (!user) {
            throw new Error('Token không hợp lệ hoặc đã hết hạn');
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password và clear reset token
        user.password = hashedPassword;
        user.passwordResetToken = '';
        user.passwordResetExpires = null;
        await user.save();

        return { message: 'Mật khẩu đã được cập nhật thành công' };
    }

    /**
     * 🔍 Validate Reset Password Token - Kiểm tra token có hợp lệ không
     */
    static async validateResetToken(token: string): Promise<{
        isValid: boolean;
        message: string;
        expiresAt?: Date | undefined;
        timeRemaining?: number; // seconds
    }> {
        // Validate token format first
        const tokenValidation = validateToken(token);
        if (!tokenValidation.isValid) {
            return {
                isValid: false,
                message: 'Token không đúng định dạng'
            };
        }

        const normalizedToken = tokenValidation.data;

        // Find user by reset token
        const user = await UserModel.findOne({
            passwordResetToken: normalizedToken,
            isActive: true
        }).select('+passwordResetExpires');

        if (!user) {
            return {
                isValid: false,
                message: 'Token không tồn tại hoặc đã được sử dụng'
            };
        }

        // Check if token is expired
        const now = new Date();
        const expiresAt = user.passwordResetExpires;

        if (!expiresAt || expiresAt <= now) {
            return {
                isValid: false,
                message: 'Token đã hết hạn',
                expiresAt: expiresAt ?? undefined
            };
        }

        // Calculate time remaining
        const timeRemaining = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);

        return {
            isValid: true,
            message: 'Token hợp lệ',
            expiresAt,
            timeRemaining
        };
    }
}
