import { AccountRepository } from "../repositories/AccountRepository";
import { calculateBMI, getBMICategory, validateBMIForGoals } from "../utils/healthCalculations";

export class AccountService {
    /**
     * Get user profile với health metrics
     */
    static async getUserProfile(userId: string): Promise<any> {
        // Delegate data access to repository
        const user = await AccountRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Business logic: Calculate health metrics
        const bmi = calculateBMI(user.profile.weight, user.profile.height);
        const bmiCategory = getBMICategory(bmi);

        // Business logic: BMI warnings based on fitness goals
        const bmiWarnings = validateBMIForGoals(bmi, user.profile.fitnessGoals);

        return {
            // id: user._id,
            joinDate: user.createdAt,
            lastLogin: user.lastLoginAt,
            isEmailVerified: user.isEmailVerified,
            subscriptionPlan: user.subscription.plan,
            subscriptionStatus: user.subscription.status,
            healthMetrics: {
                bmi: bmi,
                bmiCategory: bmiCategory,
                weight: user.profile.weight,
                height: user.profile.height,
                age: user.profile.age
            },
            fitnessProfile: {
                experienceLevel: user.profile.experienceLevel,
                fitnessGoals: user.profile.fitnessGoals,
                bmiWarnings: bmiWarnings
            }
        };
    }
}

