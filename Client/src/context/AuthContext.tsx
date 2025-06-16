/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * AuthContext - React 19
 * Context Provider cho authentication sử dụng React 19 features
 */

import { createContext, useContext, ReactNode } from 'react';
import { useActionState, useOptimistic } from 'react';
import { User, UserRole, UserProfile, FitnessGoal, ExperienceLevel } from '../types';
import useAuthStore from '../store/authStore';
import { useEffect } from 'react';
import TokenService from '../services/tokenService';
import AuthService from '../services/authService';

// Define a common state type for action hooks
interface ActionHookState<T = null> {
    success: boolean;
    error?: string | null;
    data?: T;
    message?: string; // Add message field for success messages
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null; // This will be the error from the Zustand store
    loginAction: (formData: FormData) => void;
    loginState: ActionHookState; // Expose action state
    loginPending: boolean; // <-- expose isPending for login
    registerAction: (formData: FormData) => void;
    registerState: ActionHookState; // Expose action state
    registerPending: boolean; // <-- expose isPending for register
    logoutAction: () => void;
    logoutState: ActionHookState; // Expose action state (optional, as it's simple)
    logoutPending: boolean; // <-- expose isPending for logout
    updateProfileAction: (formData: FormData) => void;
    updateProfileState: ActionHookState; // Expose action state
    clearError: () => void;
    hasRole: (role: UserRole) => boolean;
}

// Tạo context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    // Sử dụng Zustand store
    const {
        user,
        isAuthenticated,
        isLoading,
        error: storeError, // Rename to avoid conflict with action errors
        login,
        register,
        logout,
        updateProfile,
        clearError,
        hasRole,
        refreshUser, // <-- import refreshUser action
        resetStore, // <-- import resetStore action
    } = useAuthStore();

    // ✅ Sync token với user state
    useEffect(() => {
        const syncAuthState = async () => {
            const hasToken = AuthService.isAuthenticated();

            // Case 1: Có token nhưng không có user data
            if (hasToken && !user && !isLoading) {
                console.log('🔄 Token exists but no user data, refreshing...');
                try {
                    await refreshUser();
                } catch (error) {
                    console.error('❌ Failed to refresh user, clearing tokens');
                    // Clear tokens nếu không thể refresh
                    TokenService.clearTokens();
                    resetStore();
                }
            }

            // Case 2: Không có token nhưng có user data
            if (!hasToken && user) {
                console.log('🧹 No token but user data exists, clearing user');
                resetStore();
            }
        };

        syncAuthState();
    }, [user, isLoading]); // Dependency on user and loading state

    // React 19: Login action với useActionState
    const [loginState, loginAction, loginPending] = useActionState(
        async (_prevState: ActionHookState, formData: FormData): Promise<ActionHookState> => {
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            const rememberMe = formData.get('rememberMe') == 'on' ? true : false; // Assuming rememberMe is a boolean string

            try {
                const resultLogin = await login(email, password, rememberMe);

                // trả về new state cho loginState với success và error
                return { success: resultLogin.success };
            } catch (err) {
                return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
            }
        },

        // Initial state mặc định ban đầu cho loginState
        { success: false, error: null }
    );    // React 19: Register action với nested profile structure
    const [registerState, registerAction, registerPending] = useActionState(
        async (_prevState: ActionHookState, formData: FormData): Promise<ActionHookState> => {
            try {
                console.log("Check formData:", formData);

                // Parse profile JSON from FormData
                const profileString = formData.get('profile') as string;
                let profile;
                try {
                    profile = JSON.parse(profileString);
                } catch (parseError) {
                    console.error("Failed to parse profile:", parseError);
                    return { success: false, error: "Invalid format for profile data." };
                }

                // Create nested register data structure
                const registerData = {
                    email: formData.get('email') as string,
                    username: formData.get('username') as string,
                    password: formData.get('password') as string,
                    confirmPassword: formData.get('confirmPassword') as string,
                    profile: profile
                };

                console.log("Parsed registration data:", registerData);

                // The register function from authStore should handle the nested structure
                await register(registerData);
                return { success: true };
            } catch (err) {
                return { success: false, error: err instanceof Error ? err.message : 'Registration failed' };
            }
        },
        { success: false, error: null }
    );

    // React 19: Logout action    // For type safety, define a reset function for login state
    const [_, resetLoginState] = useActionState<ActionHookState>(
        async (_prevState) => {
            return { success: false, error: null };
        },
        { success: false, error: null }
    ); const [logoutState, logoutAction, logoutPending] = useActionState(
        async (): Promise<ActionHookState> => {
            try {
                // First reset login state - this is important to prevent navigation issues
                resetLoginState();

                // Wait for the logout result from the store
                const result = await logout();

                // We consider logout always successful from UI perspective
                // Even if server request failed, we've already cleared client-side state
                if (result?.success) {
                    return {
                        success: true,
                        data: null,
                        message: result.message || 'Logout successful'
                    };
                }

                // If something went wrong but we got a result - it's still a success from UI perspective
                if (result) {
                    console.warn('Partial logout success:', result);
                    return {
                        success: true,
                        message: 'You have been logged out'
                    };
                }

                // Always return success even if there was an issue
                // The user is effectively logged out on the client side
                return {
                    success: true,
                    message: 'You have been logged out'
                };
            } catch (err) {
                console.error('Logout error:', err);

                // Even on error, we want the user to be logged out client-side
                // Try to manually clear storage as a last resort
                try {
                    localStorage.removeItem('auth-store');
                    sessionStorage.removeItem('auth-store');
                    localStorage.removeItem('accessToken');
                    sessionStorage.removeItem('accessToken');
                } catch (clearError) {
                    console.error('Failed to clear storage manually:', clearError);
                }

                // Return success from user perspective
                return {
                    success: true,
                    message: 'You have been logged out'
                };
            }
        },
        { success: false, error: null }
    );

    // React 19: Profile update action with optimistic updates
    const [optimisticUser, addOptimisticUpdate] = useOptimistic<User | null, Partial<User>>(
        user,
        (currentUserState, profileUpdate: Partial<User>) => {
            if (!currentUserState) {
                // Should not happen if a user is logged in to update profile
                return profileUpdate as User; // Or handle error appropriately
            }
            // Deep merge for profile, shallow for other top-level User fields
            return {
                ...currentUserState,
                ...profileUpdate,
                profile: {
                    ...currentUserState.profile,
                    ...(profileUpdate.profile || {}),
                },
            };
        }
    );

    const [updateProfileState, updateProfileAction] = useActionState(
        async (_prevState: ActionHookState, formData: FormData): Promise<ActionHookState> => {
            try {
                const profileDataToUpdate: Partial<User> = {};
                const userProfileDataToUpdate: Partial<UserProfile> = {};

                for (const [key, value] of formData.entries()) {
                    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
                        continue; // Skip empty or null values
                    }

                    // Check if the key belongs to UserProfile
                    if (['firstName', 'lastName', 'age', 'weight', 'height', 'gender', 'fitnessGoals', 'experienceLevel', 'medicalConditions', 'bio'].includes(key)) {
                        switch (key) {
                            case 'fitnessGoals':
                                try {
                                    userProfileDataToUpdate.fitnessGoals = JSON.parse(value as string) as FitnessGoal[];
                                } catch (parseError) {
                                    console.error(`Failed to parse ${key}:`, parseError);
                                    return { success: false, error: `Invalid format for ${key}.` };
                                }
                                break;
                            case 'age':
                                userProfileDataToUpdate.age = Number(value);
                                break;
                            case 'weight':
                                userProfileDataToUpdate.weight = Number(value);
                                break;
                            case 'height':
                                userProfileDataToUpdate.height = Number(value);
                                break;
                            case 'gender':
                                userProfileDataToUpdate.gender = value as UserProfile['gender'];
                                break;
                            case 'experienceLevel':
                                userProfileDataToUpdate.experienceLevel = value as ExperienceLevel;
                                break;
                            case 'medicalConditions':
                                try {
                                    userProfileDataToUpdate.medicalConditions = JSON.parse(value as string) as string[];
                                } catch (parseError) {
                                    console.error(`Failed to parse ${key}:`, parseError);
                                    return { success: false, error: `Invalid format for ${key}.` };
                                }
                                break;
                            case 'firstName':
                                userProfileDataToUpdate.firstName = value as string;
                                break;
                            case 'lastName':
                                userProfileDataToUpdate.lastName = value as string;
                                break;
                            case 'bio':
                                userProfileDataToUpdate.bio = value as string;
                                break;
                            default:
                                break;
                        }
                    } else {
                        // For direct User fields (e.g., username, email, avatar)
                        switch (key) {
                            case 'username':
                                profileDataToUpdate.username = value as string;
                                break;
                            case 'email':
                                profileDataToUpdate.email = value as string;
                                break;
                            case 'avatar':
                                profileDataToUpdate.avatar = value as string;
                                break;
                            default:
                                break;
                        }
                    }
                }

                if (Object.keys(userProfileDataToUpdate).length > 0) {
                    // Type assertion: we know this is a partial update, but backend expects full UserProfile
                    profileDataToUpdate.profile = userProfileDataToUpdate as UserProfile;
                }

                if (Object.keys(profileDataToUpdate).length === 0) {
                    return { success: true, error: "No changes to update." };
                }

                addOptimisticUpdate(profileDataToUpdate);
                await updateProfile(profileDataToUpdate);
                return { success: true };
            } catch (err) {
                return { success: false, error: err instanceof Error ? err.message : 'Profile update failed' };
            }
        },
        { success: false, error: null }
    );

    // Context value
    const contextValue: AuthContextType = {
        user: optimisticUser, // Use optimistic user for UI
        isAuthenticated,
        isLoading,
        error: storeError
            ?? loginState.error
            ?? registerState.error
            ?? updateProfileState.error
            ?? logoutState.error
            ?? null, // Combine errors and ensure type is string | null
        loginAction,
        loginState, loginPending, // <-- expose loginPending
        registerAction,
        registerState,
        registerPending, // <-- expose registerPending
        logoutAction,
        logoutState, // if needed
        logoutPending,
        updateProfileAction,
        updateProfileState,
        clearError, // This clears the storeError
        hasRole,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// Custom hook để sử dụng AuthContext
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
