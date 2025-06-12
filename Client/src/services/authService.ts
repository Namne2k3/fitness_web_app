/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Authentication Service
 * Xử lý các chức năng authentication và authorization
 */

import { api } from './api';
import {
    User,
    LoginFormData,
    RegisterFormData,
    ApiResponse
} from '../types';

/**
 * Interface cho auth response
 */
interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

/**
 * Interface cho forgot password request
 */
interface ForgotPasswordData {
    email: string;
}

/**
 * Interface cho reset password request
 */
interface ResetPasswordData {
    token: string;
    password: string;
    confirmPassword: string;
}

/**
 * Interface cho change password request
 */
interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Authentication Service Class
 */
export class AuthService {
    /**
     * Đăng ký user mới
     * @param data - Dữ liệu đăng ký
     * @returns Promise với thông tin user và tokens
     */
    static async register(data: RegisterFormData): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<AuthResponse>('/auth/register', data);

        if (response.success && response.data) {
            // Lưu tokens vào localStorage
            this.saveTokens(response.data.accessToken, response.data.refreshToken);
        }

        return response;
    }

    /**
     * Đăng nhập user
     * @param data - Email và password
     * @returns Promise với thông tin user và tokens
     */
    static async login(data: LoginFormData): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<AuthResponse>('/auth/login', data);

        if (response.success && response.data) {
            // Lưu tokens vào localStorage
            this.saveTokens(response.data.accessToken, response.data.refreshToken);

            // Lưu remember me preference
            if (data.rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
        }

        return response;
    }

    /**
     * Đăng xuất user
     * @returns Promise
     */
    static async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Log error nhưng vẫn clear local storage
            console.error('Logout error:', error);
        } finally {
            // Xóa tokens khỏi localStorage
            this.clearTokens();
        }
    }

    /**
     * Refresh access token
     * @returns Promise với access token mới
     */
    static async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post<{ accessToken: string }>('/auth/refresh', {
            refreshToken,
        });

        if (response.success && response.data) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }

        return response;
    }

    /**
     * Lấy thông tin user hiện tại
     * @returns Promise với thông tin user
     */
    static async getCurrentUser(): Promise<ApiResponse<User>> {
        return api.get<User>('/auth/me');
    }

    /**
     * Cập nhật profile user
     * @param data - Dữ liệu profile mới
     * @returns Promise với thông tin user đã cập nhật
     */
    static async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
        return api.patch<User>('/auth/profile', data);
    }

    /**
     * Đổi mật khẩu
     * @param data - Mật khẩu hiện tại và mật khẩu mới
     * @returns Promise
     */
    static async changePassword(data: ChangePasswordData): Promise<ApiResponse<void>> {
        return api.post<void>('/auth/change-password', data);
    }

    /**
     * Quên mật khẩu - gửi email reset
     * @param data - Email để reset password
     * @returns Promise
     */
    static async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse<void>> {
        return api.post<void>('/auth/forgot-password', data);
    }

    /**
     * Reset mật khẩu với token
     * @param data - Token và mật khẩu mới
     * @returns Promise
     */
    static async resetPassword(data: ResetPasswordData): Promise<ApiResponse<void>> {
        return api.post<void>('/auth/reset-password', data);
    }

    /**
     * Verify email với token
     * @param token - Verification token
     * @returns Promise
     */
    static async verifyEmail(token: string): Promise<ApiResponse<void>> {
        return api.post<void>('/auth/verify-email', { token });
    }

    /**
     * Gửi lại email verification
     * @returns Promise
     */
    static async resendVerification(): Promise<ApiResponse<void>> {
        return api.post<void>('/auth/resend-verification');
    }

    /**
     * Google OAuth login
     * @param token - Google access token
     * @returns Promise với thông tin user và tokens
     */
    static async googleLogin(token: string): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<AuthResponse>('/auth/google', { token });

        if (response.success && response.data) {
            this.saveTokens(response.data.accessToken, response.data.refreshToken);
        }

        return response;
    }

    /**
     * Facebook OAuth login
     * @param token - Facebook access token
     * @returns Promise với thông tin user và tokens
     */
    static async facebookLogin(token: string): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<AuthResponse>('/auth/facebook', { token });

        if (response.success && response.data) {
            this.saveTokens(response.data.accessToken, response.data.refreshToken);
        }

        return response;
    }

    /**
     * Kiểm tra xem user có đăng nhập không
     * @returns boolean
     */
    static isAuthenticated(): boolean {
        const token = localStorage.getItem('accessToken');
        if (!token) return false;

        try {
            // Decode JWT để kiểm tra expiry
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;

            return payload.exp > currentTime;
        } catch (error) {
            console.error('Error decoding token:', error);
            return false;
        }
    }

    /**
     * Lấy access token từ localStorage
     * @returns string | null
     */
    static getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    /**
     * Lấy refresh token từ localStorage
     * @returns string | null
     */
    static getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    /**
     * Lưu tokens vào localStorage
     * @param accessToken - Access token
     * @param refreshToken - Refresh token
     */
    private static saveTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    /**
     * Xóa tokens khỏi localStorage
     */
    private static clearTokens(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('rememberMe');
    }

    /**
     * Decode JWT token để lấy payload
     * @param token - JWT token
     * @returns Decoded payload hoặc null
     */
    static decodeToken(token: string): any | null {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    /**
     * Lấy user ID từ access token
     * @returns string | null
     */
    static getUserIdFromToken(): string | null {
        const token = this.getAccessToken();
        if (!token) return null;

        const payload = this.decodeToken(token);
        return payload?.userId || null;
    }

    /**
     * Lấy user role từ access token
     * @returns string | null
     */
    static getUserRoleFromToken(): string | null {
        const token = this.getAccessToken();
        if (!token) return null;

        const payload = this.decodeToken(token);
        return payload?.role || null;
    }
}

export default AuthService;
