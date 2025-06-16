/**
 * Custom Hook cho Account Profile với React 19 patterns
 * Sử dụng use() hook và Suspense cho optimal performance
 */

import { use, useMemo } from 'react';
import { AccountService, AccountProfile } from '../services/accountService';

// ✅ Global cache để tránh fetch liên tục
let globalProfilePromise: Promise<AccountProfile> | null = null;

/**
 * Hook để fetch account profile với React 19 use() pattern
 * @returns Account profile data
 */
export function useAccountProfile(): AccountProfile {
    // ✅ Sử dụng global cache để tránh tạo Promise mới liên tục
    const profilePromise = useMemo(() => {
        if (!globalProfilePromise) {
            globalProfilePromise = AccountService.getAccountProfile().then(response => {
                if (!response.success || !response.data) {
                    // Reset cache nếu có lỗi
                    globalProfilePromise = null;
                    throw new Error(response.error || 'Failed to fetch account profile');
                }
                return response.data;
            }).catch(error => {
                // Reset cache nếu có lỗi
                globalProfilePromise = null;
                throw error;
            });
        }
        return globalProfilePromise;
    }, []); // Empty deps - chỉ tạo 1 lần

    // use() hook sẽ suspend component cho đến khi Promise resolve
    const profile = use(profilePromise);

    return profile;
}

/**
 * Function để clear cache và force refetch
 */
export function clearAccountProfileCache(): void {
    globalProfilePromise = null;
}

/**
 * Hook để tạo fresh profile promise (force refetch)
 * @returns Function để refresh profile
 */
export function useRefreshAccountProfile(): () => Promise<AccountProfile> {
    return useMemo(() => {
        return () => {
            // Clear cache và tạo promise mới
            globalProfilePromise = null;
            globalProfilePromise = AccountService.getAccountProfile().then(response => {
                if (!response.success || !response.data) {
                    globalProfilePromise = null;
                    throw new Error(response.error || 'Failed to fetch account profile');
                }
                return response.data;
            }).catch(error => {
                globalProfilePromise = null;
                throw error;
            });
            return globalProfilePromise;
        };
    }, []);
}

/**
 * Hook để tạo optimized profile promise (có thể cache)
 * @param dependencies - Dependencies để trigger refetch
 * @returns Promise cho profile data
 */
export function useAccountProfilePromise(dependencies: unknown[] = []): Promise<AccountProfile> {
    return useMemo(() =>
        AccountService.getAccountProfile().then(response => {
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to fetch account profile');
            }
            return response.data;
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        dependencies
    );
}

/**
 * Utility function để validate BMI warnings
 * @param bmi - BMI value
 * @param fitnessGoals - User's fitness goals
 * @returns Array of warning messages
 */
export function getBMIWarnings(bmi: number, fitnessGoals: string[]): string[] {
    const warnings: string[] = [];

    if (bmi < 18.5) {
        warnings.push('BMI below normal range. Consider consulting a healthcare provider.');
        if (fitnessGoals.includes('weight_loss')) {
            warnings.push('Weight loss goal may not be suitable for your current BMI.');
        }
    } else if (bmi > 25) {
        warnings.push('BMI above normal range. Consider a balanced approach to fitness.');
        if (fitnessGoals.includes('muscle_gain')) {
            warnings.push('Focus on lean muscle gain rather than overall weight gain.');
        }
    }

    return warnings;
}

/**
 * Utility function để format BMI category
 * @param bmi - BMI value
 * @returns Human-readable BMI category
 */
export function formatBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

/**
 * Utility function để calculate ideal weight range
 * @param height - Height in cm
 * @returns Object với min và max ideal weight
 */
export function calculateIdealWeightRange(height: number): { min: number; max: number } {
    const heightInMeters = height / 100;
    const minBMI = 18.5;
    const maxBMI = 24.9;

    return {
        min: Math.round(minBMI * heightInMeters * heightInMeters),
        max: Math.round(maxBMI * heightInMeters * heightInMeters)
    };
}

export default useAccountProfile;
