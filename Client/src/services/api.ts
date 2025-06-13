/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Service Configuration
 * Cấu hình axios instance và interceptors cho API calls
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types';
import { TokenService } from './tokenService';

/**
 * Base API configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
const API_TIMEOUT = 10000; // 10 seconds

/**
 * Tạo axios instance với cấu hình mặc định
 */
const createApiInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: API_TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
        },
    });    // Request interceptor để thêm auth token
    instance.interceptors.request.use(
        (config) => {
            // Sử dụng TokenService thay vì localStorage trực tiếp
            const authHeader = TokenService.getAuthHeader();
            if (authHeader.Authorization) {
                config.headers.Authorization = authHeader.Authorization;

                if (import.meta.env.DEV) {
                    console.log('🔗 API Request with auth:', {
                        url: config.url,
                        method: config.method,
                        hasAuth: !!authHeader.Authorization
                    });
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor để handle errors và refresh token
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        }, async (error) => {
            const originalRequest = error.config;

            // Handle 401 Unauthorized - Refresh token nếu cần
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = TokenService.getRefreshToken();
                    if (refreshToken) {
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                            refreshToken,
                        });

                        // Handle both flat and nested response structures
                        const tokens = response.data.tokens || response.data.data?.tokens || response.data.data;
                        const newAccessToken = tokens.accessToken || tokens.accessToken; if (newAccessToken) {
                            // Update tokens trong TokenService - maintain current storage preference (localStorage/sessionStorage)
                            const rememberMe = TokenService.isRememberMeEnabled();
                            TokenService.saveTokens(newAccessToken, refreshToken, rememberMe);

                            // Retry original request với token mới
                            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                            return instance(originalRequest);
                        } else {
                            throw new Error('No access token in refresh response');
                        }
                    }
                } catch (refreshError) {
                    console.error('❌ Refresh token failed:', refreshError);
                    // Refresh failed, clear tokens và redirect to login
                    TokenService.clearTokens();
                    window.location.href = '/login';
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export const apiClient = createApiInstance();

/**
 * Generic API request wrapper với error handling
 */
export const apiRequest = async <T>(
    config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response = await apiClient.request<ApiResponse<T>>(config);
        return response.data;
    } catch (error: any) {
        // Format error response
        if (error.response?.data) {
            throw error.response.data;
        }

        // Network or other errors
        throw {
            success: false,
            error: error.message || 'Network error occurred',
            data: null,
        };
    }
};

/**
 * HTTP Methods helpers
 */
export const api = {
    /**
     * GET request
     */
    get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
        return apiRequest<T>({ ...config, method: 'GET', url });
    },

    /**
     * POST request
     */
    post: async <T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> => {
        return apiRequest<T>({ ...config, method: 'POST', url, data });
    },

    /**
     * PUT request
     */
    put: async <T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> => {
        return apiRequest<T>({ ...config, method: 'PUT', url, data });
    },

    /**
     * PATCH request
     */
    patch: async <T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> => {
        return apiRequest<T>({ ...config, method: 'PATCH', url, data });
    },

    /**
     * DELETE request
     */
    delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
        return apiRequest<T>({ ...config, method: 'DELETE', url });
    },
};

/**
 * File upload helper
 */
export const uploadFile = async (
    url: string,
    file: File,
    onProgress?: (progress: number) => void
): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest<{ url: string }>({
        method: 'POST',
        url,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(progress);
            }
        },
    });
};

export default api;
