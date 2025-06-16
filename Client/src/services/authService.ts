/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Authentication Service
 * Xử lý các chức năng authentication và authorization với React 19 patterns
 */

import { api } from './api';
import { TokenService } from './tokenService';
import {
    User,
    LoginFormData,
    RegisterFormData,
} from '../types';
import { ApiResponse } from '../types/app.interface';

/**
 * Interface cho server auth response (nested structure)
 */

/**
 * Interface cho client auth response (flat structure)
 */
interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
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
        const response = await api.post<AuthResponse>('/auth/register', data); if (response.success && response.data) {
            // For new registrations, default to not remembering (sessionStorage)
            TokenService.saveTokens(
                response.data.accessToken,
                response.data.refreshToken,
                false
            );

            // Trả về flat structure cho client
            return {
                success: true,
                data: {
                    user: response.data.user,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken
                }
            };
        }

        return {
            success: false,
            error: response.error || 'Registration failed',
            data: undefined
        };
    }

    /**
     * Đăng nhập user
     * @param data - Email và password
     * @returns Promise với thông tin user và tokens
     */
    static async login(data: LoginFormData): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<AuthResponse>('/auth/login', data); if (response.success && response.data) {
            // Lưu tokens vào localStorage hoặc sessionStorage dựa vào rememberMe flag
            TokenService.saveTokens(
                response.data.accessToken,
                response.data.refreshToken,
                !!data.rememberMe // Convert to boolean if undefined
            );

            // Trả về flat structure cho client
            return {
                success: true,
                data: {
                    user: response.data.user,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken
                }
            };
        }

        return {
            success: false,
            error: response.error || 'Login failed',
            data: undefined
        };
    }    /**
     * Đăng xuất user
     * @returns Promise với kết quả logout
     */
    static async logout(): Promise<ApiResponse<null>> {
        try {
            // Even if there's no token, we should still proceed with local logout
            // but just log instead of returning false
            const hasToken = TokenService.getAccessToken() !== null;

            if (!hasToken) {
                console.log('No active token found, proceeding with local logout');
            }

            // Try to call the server endpoint (uncomment when server endpoint is ready)
            // If server is unreachable or returns error, we still want to clear client-side data
            const serverMessage = 'Logged out successfully';

            // if (hasToken) {
            //     try {
            //         // Attempt to call server endpoint
            //         const response = await api.post<null>('/auth/logout');
            //         serverMessage = response.message || serverMessage;
            //     } catch (serverError) {
            //         // If server call fails, log but continue with client-side logout
            //         console.warn('Server logout failed, proceeding with client-side logout', serverError);
            //     }
            // }

            // Always clear tokens regardless of server response
            TokenService.clearTokens();

            // Return success even if server call failed - client is "logged out" locally
            return {
                success: true,
                message: serverMessage,
                data: null
            };
        } catch (error) {
            console.error('Logout error:', error);

            // Even on error, try to clear tokens as a last resort
            try {
                TokenService.clearTokens();
            } catch (clearError) {
                console.error('Failed to clear tokens during error handling:', clearError);
            }

            // Return failure instead of throwing error to make logout more robust
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unexpected logout error',
                data: null
            };
        }
    }

    /**
     * Refresh access token
     * @returns Promise với access token mới
     */
    static async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
        const refreshToken = TokenService.getRefreshToken();

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post<{ accessToken: string }>('/auth/refresh', {
            refreshToken,
        });

        if (response.success && response.data) {
            // Update access token
            TokenService.saveTokens(response.data.accessToken, refreshToken);
        }

        return response;
    }    /**
     * Lấy thông tin user hiện tại
     * @returns Promise với thông tin user
     */
    static async getCurrentUser(): Promise<ApiResponse<User>> {
        const response = await api.get<{ user: User }>('/auth/me');

        if (response.success && response.data) {
            // ✅ Extract user from nested structure
            return {
                success: true,
                data: response.data.user, // Extract user from { user: User }
                message: response.message
            };
        }

        return {
            success: false,
            error: response.error || 'Failed to get current user',
            data: undefined
        };
    }

    /**
     * Google OAuth login
     * @param token - Google access token
     * @returns Promise với thông tin user và tokens
     */
    static async googleLogin(token: string): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<AuthResponse>('/auth/google', { token });

        if (response.success && response.data) {
            // Lưu tokens
            TokenService.saveTokens(
                response.data.accessToken,
                response.data.refreshToken
            );

            // Trả về flat structure
            return {
                success: true,
                data: {
                    user: response.data.user,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken
                }
            };
        }

        return response as ApiResponse<AuthResponse>;
    }

    /**
     * Facebook OAuth login
     * @param token - Facebook access token
     * @returns Promise với thông tin user và tokens
     */
    static async facebookLogin(token: string): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<AuthResponse>('/auth/facebook', { token });

        if (response.success && response.data) {
            // Lưu tokens
            TokenService.saveTokens(
                response.data.accessToken,
                response.data.refreshToken
            );

            // Trả về flat structure
            return {
                success: true,
                data: {
                    user: response.data.user,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken
                }
            };
        }

        return response as ApiResponse<AuthResponse>;
    }

    /**
     * Kiểm tra xem user có đăng nhập không
     * @returns boolean
     */
    static isAuthenticated(): boolean {
        const token = TokenService.getAccessToken();
        if (!token) return false;

        // Kiểm tra token còn hạn không
        return TokenService.isTokenValid(token);
    }

    /**
     * Lấy access token
     * @returns string | null
     */
    static getAccessToken(): string | null {
        return TokenService.getAccessToken();
    }

    /**
     * Lấy refresh token
     * @returns string | null
     */
    static getRefreshToken(): string | null {
        return TokenService.getRefreshToken();
    }

    /**
     * Lấy user ID từ access token
     * @returns string | null
     */
    static getUserIdFromToken(): string | null {
        const token = this.getAccessToken();
        if (!token) return null;

        const payload = TokenService.decodeToken(token);
        if (!payload) return null;

        // Type assertion to access custom JWT claims
        const customPayload = payload as any;
        return customPayload.sub || customPayload.userId || null;
    }

    /**
     * Lấy user role từ access token
     * @returns string | null
     */
    static getUserRoleFromToken(): string | null {
        const token = this.getAccessToken();
        if (!token) return null;

        const payload = TokenService.decodeToken(token);
        if (!payload) return null;

        // Type assertion to access custom JWT claims
        const customPayload = payload as any;
        return customPayload.role || null;
    }

    /**
     * 📧 Forgot Password - Gửi email reset password
     * @param email - Email address để reset password
     * @returns Promise với kết quả request
     */
    static async forgotPassword(email: string): Promise<{ message: string }> {
        const response = await api.post<{ message: string }>('/auth/forgot-password', { email });

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.error || 'Failed to send reset password email');
    }

    /**
     * 🔒 Reset Password - Đặt lại mật khẩu với token
     * @param data - Token và mật khẩu mới
     * @returns Promise với kết quả reset
     */
    static async resetPassword(data: {
        token: string;
        newPassword: string;
        confirmNewPassword: string;
    }): Promise<{ message: string }> {
        const response = await api.post<{ message: string }>('/auth/reset-password', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${data.token}`,
            },
        });

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.error || 'Failed to reset password');
    }

    /**
     * 🔍 Validate Reset Password Token
     * @param token - Reset password token
     * @returns Promise với kết quả validation
     */
    static async validateResetToken(token: string): Promise<{
        isValid: boolean;
        message: string;
        expiresAt?: string;
        timeRemaining?: number;
    }> {
        const response = await api.get<{
            isValid: boolean;
            message: string;
            expiresAt?: string;
            timeRemaining?: number;
        }>(`/auth/validate-reset-token/${token}`);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.error || 'Failed to validate token');
    }
}

export default AuthService;

// Export named instance để consistent với import patterns
export const authService = AuthService;
