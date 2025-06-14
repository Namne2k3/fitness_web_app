/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Auth Store - Zustand
 * Quản lý state authentication global cho ứng dụng
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import AuthService from '../services/authService';
import { User, UserRole } from '../types';

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
    login: (email: string, password: string, rememberMe?: boolean) => Promise<any>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<any>;
    refreshUser: () => Promise<void>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
    resetStore: () => void; // New method to reset store state

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
                            return { success: true, user: response.data.user }; // Trả về kết quả thành công
                        } else {
                            set({
                                error: response.error || 'Login failed',
                                isLoading: false,
                            });
                            return { success: false, error: response.error || 'Login failed' }; // Trả về lỗi
                        }
                    } catch (error: any) {
                        set({
                            error: error.error || error.message || 'Login failed',
                            isLoading: false,
                        });
                        throw error; // Vẫn giữ throw error để handle ở component
                    }
                },

                /**
                 * Đăng ký user mới
                 */
                register: async (data: any) => {
                    try {

                        console.log("Check data register >>> ", data)

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
                 * Ensures both server-side and client-side logout
                 * Always attempts to reset local state even if server logout fails
                 */
                logout: async () => {
                    try {
                        set({ isLoading: true });

                        // Pre-emptively reset the store to ensure client-side logout happens immediately
                        // This should help avoid race conditions
                        const resetStore = get().resetStore;

                        // Get a reference to resetStore first
                        let response;
                        try {
                            // Try to call the server logout
                            response = await AuthService.logout();
                        } catch (serverError) {
                            console.error('Server logout failed:', serverError);
                            // Ensure we continue with local logout even if server call fails
                        }

                        // Always reset the store state regardless of server response
                        resetStore();

                        // Set loading to false after reset
                        set({ isLoading: false });

                        // Return appropriate response
                        if (response?.success) {
                            return {
                                success: true,
                                message: response.message || 'Logged out successfully'
                            };
                        } else {
                            // We still consider this a success from the user's perspective
                            // since the local logout was successful
                            return {
                                success: true,
                                message: 'Local logout completed successfully'
                            };
                        }
                    } catch (error: any) {
                        console.error('Logout process error:', error);

                        // Extra safety: always ensure store is reset even if there's an error
                        try {
                            const resetStore = get().resetStore;
                            resetStore();
                        } catch (resetError) {
                            console.error('Failed to reset store during error handling:', resetError);
                        }

                        set({
                            isLoading: false,
                            error: null,
                            // Ensure user is set to null no matter what
                            user: null,
                            isAuthenticated: false
                        });

                        // Return a partial success - local logout likely worked
                        return {
                            success: true,
                            message: 'Logged out locally, but there were some errors'
                        };
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
                    // try {
                    //     set({ isLoading: true, error: null });

                    //     const response = await AuthService.updateProfile(data);

                    //     if (response.success && response.data) {
                    //         set({
                    //             user: response.data,
                    //             isLoading: false,
                    //             error: null,
                    //         });
                    //     } else {
                    //         set({
                    //             error: response.error || 'Profile update failed',
                    //             isLoading: false,
                    //         });
                    //     }
                    // } catch (error: any) {
                    //     set({
                    //         error: error.message || 'Profile update failed',
                    //         isLoading: false,
                    //     });
                    //     throw error;
                    // }
                },

                /**
                 * Đổi mật khẩu
                 */
                changePassword: async (
                    currentPassword: string,
                    newPassword: string,
                    confirmPassword: string
                ) => {
                    // try {
                    //     set({ isLoading: true, error: null });

                    //     const response = await AuthService.changePassword({
                    //         currentPassword,
                    //         newPassword,
                    //         confirmPassword,
                    //     });

                    //     if (response.success) {
                    //         set({
                    //             isLoading: false,
                    //             error: null,
                    //         });
                    //     } else {
                    //         set({
                    //             error: response.error || 'Password change failed',
                    //             isLoading: false,
                    //         });
                    //     }
                    // } catch (error: any) {
                    //     set({
                    //         error: error.message || 'Password change failed',
                    //         isLoading: false,
                    //     });
                    //     throw error;
                    // }
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
                 */                hasAnyRole: (roles: UserRole[]): boolean => {
                    const { user } = get();
                    return user ? roles.includes(user.role) : false;
                },                /**
                 * Reset store state completely
                 * Completely clears all store state, including local storage persistence
                 * This is a critical method for ensuring proper logout
                 */                resetStore: () => {
                    // Reset the store state (without the true parameter which causes errors)
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });

                    // Clear persisted state specifically
                    try {
                        // Clear both possible Zustand store persistence keys
                        localStorage.removeItem('auth-store');
                        localStorage.removeItem('zustand-auth-store');
                        sessionStorage.removeItem('auth-store');
                        sessionStorage.removeItem('zustand-auth-store');

                        // Also clear tokens directly for extra security
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('rememberMe');
                        sessionStorage.removeItem('accessToken');
                        sessionStorage.removeItem('refreshToken');

                        console.log('✅ Successfully reset auth store and cleared all tokens');
                    } catch (error) {
                        console.error('❌ Failed to clear persisted store:', error);
                    }
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
