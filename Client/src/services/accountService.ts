/**
 * Account Service
 * Xử lý các API calls liên quan đến account/profile với React 19 patterns
 */

import { api } from './api';
import { ApiResponse } from '../types/app.interface';

/**
 * Interface cho account profile response từ server
 */
export interface AccountProfile {
    id?: string;
    joinDate: string;
    lastLogin: string;
    isEmailVerified: boolean;
    subscriptionPlan: string;
    subscriptionStatus: string;
    healthMetrics: {
        bmi: number;
        bmiCategory: string;
        weight: number;
        height: number;
        age: number;
    };
    fitnessProfile: {
        experienceLevel: string;
        fitnessGoals: string[];
        bmiWarnings?: string[];
    };
}

/**
 * Interface cho cập nhật profile
 */
export interface UpdateProfileData {
    profile?: {
        firstName?: string;
        lastName?: string;
        age?: number;
        weight?: number;
        height?: number;
        gender?: string;
        fitnessGoals?: string[];
        experienceLevel?: string;
        medicalConditions?: string[];
    };
    preferences?: {
        notifications?: {
            email?: boolean;
            push?: boolean;
            sms?: boolean;
            workoutReminders?: boolean;
            sponsoredContent?: boolean;
            newFeatures?: boolean;
            marketing?: boolean;
        };
        privacy?: {
            profileVisibility?: 'public' | 'friends' | 'private';
            workoutVisibility?: 'public' | 'friends' | 'private';
            allowDataCollection?: boolean;
            allowPersonalization?: boolean;
        };
        theme?: 'light' | 'dark' | 'auto';
        language?: 'vi' | 'en';
        units?: 'metric' | 'imperial';
    };
}

/**
 * Account Service Class
 */
export class AccountService {
    /**
     * Lấy thông tin profile của user hiện tại
     * @returns Promise với account profile data
     */
    static async getAccountProfile(): Promise<ApiResponse<AccountProfile>> {
        try {
            const response = await api.get<AccountProfile>('/account/profile');
            return response;
        } catch (error) {
            console.error('Failed to fetch account profile:', error);
            throw error;
        }
    }

    /**
     * Cập nhật thông tin profile
     * @param data - Dữ liệu cập nhật profile
     * @returns Promise với profile đã cập nhật
     */
    static async updateProfile(data: UpdateProfileData): Promise<ApiResponse<AccountProfile>> {
        try {
            const response = await api.put<AccountProfile>('/account/profile', data);
            return response;
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    }

    /**
     * Upload avatar cho user
     * @param file - File ảnh avatar
     * @returns Promise với URL avatar mới
     */
    static async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await api.post<{ avatarUrl: string }>(
                '/account/avatar',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response;
        } catch (error) {
            console.error('Failed to upload avatar:', error);
            throw error;
        }
    }

    /**
     * Xóa avatar của user
     * @returns Promise với kết quả xóa
     */
    static async deleteAvatar(): Promise<ApiResponse<null>> {
        try {
            const response = await api.delete<null>('/account/avatar');
            return response;
        } catch (error) {
            console.error('Failed to delete avatar:', error);
            throw error;
        }
    }

    /**
     * Thay đổi mật khẩu
     * @param oldPassword - Mật khẩu cũ
     * @param newPassword - Mật khẩu mới
     * @returns Promise với kết quả thay đổi
     */
    static async changePassword(
        oldPassword: string,
        newPassword: string
    ): Promise<ApiResponse<null>> {
        try {
            const response = await api.put<null>('/account/password', {
                oldPassword,
                newPassword,
            });
            return response;
        } catch (error) {
            console.error('Failed to change password:', error);
            throw error;
        }
    }

    /**
     * Xóa tài khoản (soft delete)
     * @param password - Mật khẩu xác nhận
     * @returns Promise với kết quả xóa
     */
    static async deleteAccount(password: string): Promise<ApiResponse<null>> {
        try {
            const response = await api.delete<null>('/account', {
                data: { password },
            });
            return response;
        } catch (error) {
            console.error('Failed to delete account:', error);
            throw error;
        }
    }

    /**
     * Lấy thống kê workout của user
     * @returns Promise với workout statistics
     */
    static async getWorkoutStats(): Promise<ApiResponse<{
        totalWorkouts: number;
        totalDuration: number;
        averageDuration: number;
        favoriteExercises: string[];
        weeklyGoal: number;
        weeklyProgress: number;
        monthlyStats: {
            month: string;
            workouts: number;
            duration: number;
        }[];
    }>> {
        try {
            const response = await api.get('/account/workout-stats');
            return response;
        } catch (error) {
            console.error('Failed to fetch workout stats:', error);
            throw error;
        }
    }

    /**
     * Cập nhật thiết lập thông báo
     * @param settings - Thiết lập thông báo mới
     * @returns Promise với kết quả cập nhật
     */
    static async updateNotificationSettings(
        settings: UpdateProfileData['preferences']['notifications']
    ): Promise<ApiResponse<null>> {
        try {
            const response = await api.put<null>('/account/notifications', settings);
            return response;
        } catch (error) {
            console.error('Failed to update notification settings:', error);
            throw error;
        }
    }

    /**
     * Cập nhật thiết lập quyền riêng tư
     * @param settings - Thiết lập privacy mới
     * @returns Promise với kết quả cập nhật
     */
    static async updatePrivacySettings(
        settings: UpdateProfileData['preferences']['privacy']
    ): Promise<ApiResponse<null>> {
        try {
            const response = await api.put<null>('/account/privacy', settings);
            return response;
        } catch (error) {
            console.error('Failed to update privacy settings:', error);
            throw error;
        }
    }

    /**
     * Lấy lịch sử hoạt động
     * @param page - Số trang
     * @param limit - Số items per page
     * @returns Promise với activity history
     */
    static async getActivityHistory(
        page: number = 1,
        limit: number = 20
    ): Promise<ApiResponse<{
        activities: {
            id: string;
            type: 'workout' | 'profile_update' | 'achievement' | 'login';
            description: string;
            timestamp: string;
            metadata?: Record<string, unknown>;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>> {
        try {
            const response = await api.get(
                `/account/activity?page=${page}&limit=${limit}`
            );
            return response;
        } catch (error) {
            console.error('Failed to fetch activity history:', error);
            throw error;
        }
    }

    /**
     * Kiểm tra tính khả dụng của username
     * @param username - Username cần kiểm tra
     * @returns Promise với kết quả kiểm tra
     */
    static async checkUsernameAvailability(
        username: string
    ): Promise<ApiResponse<{ available: boolean }>> {
        try {
            const response = await api.get<{ available: boolean }>(
                `/account/check-username?username=${encodeURIComponent(username)}`
            );
            return response;
        } catch (error) {
            console.error('Failed to check username availability:', error);
            throw error;
        }
    }

    /**
     * Gửi lại email xác thực
     * @returns Promise với kết quả gửi email
     */
    static async resendVerificationEmail(): Promise<ApiResponse<null>> {
        try {
            const response = await api.post<null>('/account/resend-verification');
            return response;
        } catch (error) {
            console.error('Failed to resend verification email:', error);
            throw error;
        }
    }

    /**
     * Xuất dữ liệu cá nhân (GDPR compliance)
     * @returns Promise với link download dữ liệu
     */
    static async exportPersonalData(): Promise<ApiResponse<{ downloadUrl: string }>> {
        try {
            const response = await api.post<{ downloadUrl: string }>('/account/export-data');
            return response;
        } catch (error) {
            console.error('Failed to export personal data:', error);
            throw error;
        }
    }
}

export default AccountService;

// Export named instance để consistent với import patterns
export const accountService = AccountService;