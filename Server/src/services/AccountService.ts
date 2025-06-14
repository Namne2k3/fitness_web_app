import { UserModel } from "../models/User";
import { calculateBMI, getBMICategory, validateBMIForGoals } from "../utils/healthCalculations";

export class AccountService {
    /**
        * Get user stats với health metrics
        */
    static async getUserStats(userId: string): Promise<any> {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Calculate health metrics
        const bmi = calculateBMI(user.profile.weight, user.profile.height);
        const bmiCategory = getBMICategory(bmi);

        // BMI warnings based on fitness goals
        const bmiWarnings = validateBMIForGoals(bmi, user.profile.fitnessGoals);

        return {
            id: user._id,
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

