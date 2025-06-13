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
    ApiResponse
} from '../types';

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
            // Xóa tokens khỏi localStorage thông qua TokenService
            TokenService.clearTokens();
            localStorage.removeItem('rememberMe');
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
    }

    /**
     * Lấy thông tin user hiện tại
     * @returns Promise với thông tin user
     */
    static async getCurrentUser(): Promise<ApiResponse<User>> {
        return api.get<User>('/auth/me');
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
}

export default AuthService;
