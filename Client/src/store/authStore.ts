/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Auth Store - Zustand
 * Quản lý state authentication global cho ứng dụng
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, UserRole } from '../types';
import AuthService from '../services/authService';

/**
 * Interface cho Auth State
 */
interface AuthState {
    // State properties
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;

    // Google/Facebook OAuth
    googleLogin: (token: string) => Promise<void>;
    facebookLogin: (token: string) => Promise<void>;

    // User management
    updateProfile: (data: Partial<User>) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;

    // Utility methods
    hasRole: (role: UserRole) => boolean;
    hasAnyRole: (roles: UserRole[]) => boolean;
}

/**
 * Auth Store Implementation
 */
export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,

                /**
                 * Đăng nhập user
                 */
                login: async (email: string, password: string, rememberMe = false) => {
                    try {
                        set({ isLoading: true, error: null });

                        const response = await AuthService.login({
                            email,
                            password,
                            rememberMe,
                        });

                        if (response.success && response.data) {
                            set({
                                user: response.data.user,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null,
                            });
                        } else {
                            set({
                                error: response.error || 'Login failed',
                                isLoading: false,
                            });
                        }
                    } catch (error: any) {
                        set({
                            error: error.message || 'Login failed',
                            isLoading: false,
                        });
                        throw error;
                    }
                },

                /**
                 * Đăng ký user mới
                 */
                register: async (data: any) => {
                    try {
                        set({ isLoading: true, error: null });

                        const response = await AuthService.register(data);

                        if (response.success && response.data) {
                            set({
                                user: response.data.user,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null,
                            });
                        } else {
                            set({
                                error: response.error || 'Registration failed',
                                isLoading: false,
                            });
                        }
                    } catch (error: any) {
                        set({
                            error: error.message || 'Registration failed',
                            isLoading: false,
                        });
                        throw error;
                    }
                },

                /**
                 * Đăng xuất user
                 */
                logout: async () => {
                    try {
                        set({ isLoading: true });

                        await AuthService.logout();

                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: null,
                        });
                    } catch (error: any) {
                        // Log error nhưng vẫn clear state
                        console.error('Logout error:', error);
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: null,
                        });
                    }
                },

                /**
                 * Google OAuth login
                 */
                googleLogin: async (token: string) => {
                    try {
                        set({ isLoading: true, error: null });

                        const response = await AuthService.googleLogin(token);

                        if (response.success && response.data) {
                            set({
                                user: response.data.user,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null,
                            });
                        } else {
                            set({
                                error: response.error || 'Google login failed',
                                isLoading: false,
                            });
                        }
                    } catch (error: any) {
                        set({
                            error: error.message || 'Google login failed',
                            isLoading: false,
                        });
                        throw error;
                    }
                },

                /**
                 * Facebook OAuth login
                 */
                facebookLogin: async (token: string) => {
                    try {
                        set({ isLoading: true, error: null });

                        const response = await AuthService.facebookLogin(token);

                        if (response.success && response.data) {
                            set({
                                user: response.data.user,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null,
                            });
                        } else {
                            set({
                                error: response.error || 'Facebook login failed',
                                isLoading: false,
                            });
                        }
                    } catch (error: any) {
                        set({
                            error: error.message || 'Facebook login failed',
                            isLoading: false,
                        });
                        throw error;
                    }
                },

                /**
                 * Refresh thông tin user từ server
                 */
                refreshUser: async () => {
                    try {
                        set({ isLoading: true, error: null });

                        const response = await AuthService.getCurrentUser();

                        if (response.success && response.data) {
                            set({
                                user: response.data,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null,
                            });
                        } else {
                            // Token không hợp lệ, logout
                            set({
                                user: null,
                                isAuthenticated: false,
                                isLoading: false,
                                error: null,
                            });
                        }
                    } catch (error: any) {
                        // Token không hợp lệ, logout
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: null,
                        });
                    }
                },

                /**
                 * Cập nhật profile user
                 */
                updateProfile: async (data: Partial<User>) => {
                    try {
                        set({ isLoading: true, error: null });

                        const response = await AuthService.updateProfile(data);

                        if (response.success && response.data) {
                            set({
                                user: response.data,
                                isLoading: false,
                                error: null,
                            });
                        } else {
                            set({
                                error: response.error || 'Profile update failed',
                                isLoading: false,
                            });
                        }
                    } catch (error: any) {
                        set({
                            error: error.message || 'Profile update failed',
                            isLoading: false,
                        });
                        throw error;
                    }
                },

                /**
                 * Đổi mật khẩu
                 */
                changePassword: async (
                    currentPassword: string,
                    newPassword: string,
                    confirmPassword: string
                ) => {
                    try {
                        set({ isLoading: true, error: null });

                        const response = await AuthService.changePassword({
                            currentPassword,
                            newPassword,
                            confirmPassword,
                        });

                        if (response.success) {
                            set({
                                isLoading: false,
                                error: null,
                            });
                        } else {
                            set({
                                error: response.error || 'Password change failed',
                                isLoading: false,
                            });
                        }
                    } catch (error: any) {
                        set({
                            error: error.message || 'Password change failed',
                            isLoading: false,
                        });
                        throw error;
                    }
                },

                /**
                 * Clear error state
                 */
                clearError: () => {
                    set({ error: null });
                },

                /**
                 * Set loading state
                 */
                setLoading: (loading: boolean) => {
                    set({ isLoading: loading });
                },

                /**
                 * Kiểm tra user có role cụ thể không
                 */
                hasRole: (role: UserRole): boolean => {
                    const { user } = get();
                    return user?.role === role;
                },

                /**
                 * Kiểm tra user có bất kỳ role nào trong danh sách không
                 */
                hasAnyRole: (roles: UserRole[]): boolean => {
                    const { user } = get();
                    return user ? roles.includes(user.role) : false;
                },
            }),
            {
                name: 'auth-store',
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                }),
            }
        ),
        { name: 'auth-store' }
    )
);

/**
 * Initialize auth store khi app khởi động
 */
export const initializeAuth = async () => {
    const { refreshUser } = useAuthStore.getState();

    // Kiểm tra xem có token không
    if (AuthService.isAuthenticated()) {
        try {
            await refreshUser();
        } catch (error) {
            console.error('Failed to initialize auth:', error);
        }
    }
};

export default useAuthStore;
