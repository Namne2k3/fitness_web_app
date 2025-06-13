/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * AuthContext - React 19
 * Context Provider cho authentication sử dụng React 19 features
 */

import { createContext, useContext, ReactNode } from 'react';
import { useActionState, useOptimistic } from 'react';
import { User, UserRole, UserProfile, FitnessGoal, ExperienceLevel, RegisterFormData } from '../types'; // Added UserProfile, FitnessGoal, ExperienceLevel, RegisterFormData
import useAuthStore from '../store/authStore';

// Define a common state type for action hooks
interface ActionHookState<T = null> {
    success: boolean;
    error?: string | null;
    data?: T;
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
    logoutAction: () => void;
    // logoutState: ActionHookState; // Expose action state (optional, as it's simple)
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
    } = useAuthStore();

    // React 19: Login action với useActionState
    const [loginState, loginAction, loginPending] = useActionState(
        async (_prevState: ActionHookState, formData: FormData): Promise<ActionHookState> => {
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            const rememberMe = formData.get('rememberMe') === 'true';

            try {
                const resultLogin = await login(email, password, rememberMe);
                return { success: resultLogin.success };
            } catch (err) {
                return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
            }
        },
        { success: false, error: null }
    );

    // React 19: Register action
    const [registerState, registerAction] = useActionState(
        async (_prevState: ActionHookState, formData: FormData): Promise<ActionHookState> => {
            try {
                const fitnessGoalsString = formData.get('fitnessGoals') as string;
                let fitnessGoals: FitnessGoal[] = [];
                if (fitnessGoalsString) {
                    try {
                        fitnessGoals = JSON.parse(fitnessGoalsString);
                    } catch (parseError) {
                        console.error("Failed to parse fitnessGoals:", parseError);
                        return { success: false, error: "Invalid format for fitness goals." };
                    }
                }

                const registerData: RegisterFormData = { // Using RegisterFormData for stricter typing
                    email: formData.get('email') as string,
                    username: formData.get('username') as string,
                    password: formData.get('password') as string,
                    confirmPassword: formData.get('confirmPassword') as string,
                    // profile fields are now directly part of RegisterFormData
                    firstName: formData.get('firstName') as string,
                    lastName: formData.get('lastName') as string,
                    age: Number(formData.get('age')),
                    weight: Number(formData.get('weight')),
                    height: Number(formData.get('height')),
                    gender: formData.get('gender') as UserProfile['gender'], // Assuming gender is also collected
                    fitnessGoals: fitnessGoals,
                    experienceLevel: formData.get('experienceLevel') as ExperienceLevel,
                    // bio: formData.get('bio') as string || '', // Assuming bio is part of UserProfile if collected
                    agreeToTerms: formData.get('agreeToTerms') === 'true', // Assuming agreeToTerms is collected
                };

                // The register function from authStore should handle the profile nesting
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
    );

    const [_logoutState, logoutAction] = useActionState( // logoutState might not be needed externally
        async (): Promise<ActionHookState> => {
            try {
                await logout();
                // Reset login state when logging out to prevent navigation issues
                resetLoginState();
                return { success: true };
            } catch (err) {
                return { success: false, error: err instanceof Error ? err.message : 'Logout failed' };
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
                                // @ts-expect-error: bio may not be in UserProfile type, but allow for extension
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
        error: storeError ?? loginState.error ?? registerState.error ?? updateProfileState.error ?? null, // Combine errors and ensure type is string | null
        loginAction,
        loginState,
        loginPending, // <-- expose loginPending
        registerAction,
        registerState,
        logoutAction,
        // logoutState, // if needed
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
