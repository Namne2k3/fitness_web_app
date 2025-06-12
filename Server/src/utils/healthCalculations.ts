/**
 * 🏥 Health Calculations Utilities
 * BMI, BMR, TDEE và các tính toán sức khỏe khác
 */

import { FitnessGoal } from '../types';

// ================================
// 📊 Core Health Calculations
// ================================

/**
 * Tính toán BMI từ cân nặng và chiều cao
 * @param weight - Cân nặng tính bằng kg
 * @param height - Chiều cao tính bằng cm
 * @returns BMI value với 1 chữ số thập phân
 * @throws Error nếu weight hoặc height <= 0
 */
export const calculateBMI = (weight: number, height: number): number => {
    if (weight <= 0 || height <= 0) {
        throw new Error('Weight and height must be positive numbers');
    }

    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

/**
 * Phân loại BMI theo WHO standards
 * @param bmi - BMI value
 * @returns BMI category
 */
export const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
};

/**
 * Tính toán BMR (Basal Metabolic Rate) - Mifflin-St Jeor Equation
 * @param weight - Cân nặng (kg)
 * @param height - Chiều cao (cm)
 * @param age - Tuổi
 * @param gender - Giới tính ('male' | 'female')
 * @returns BMR in calories per day
 */
export const calculateBMR = (
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female'
): number => {
    const baseBMR = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
};

/**
 * Tính toán TDEE (Total Daily Energy Expenditure)
 * @param bmr - Basal Metabolic Rate
 * @param activityLevel - Activity level multiplier
 * @returns TDEE in calories per day
 */
export const calculateTDEE = (bmr: number, activityLevel: number): number => {
    return Math.round(bmr * activityLevel);
};

/**
 * Get activity level multipliers theo research-backed standards
 */
export const ACTIVITY_LEVELS = {
    SEDENTARY: 1.2,        // Little to no exercise
    LIGHT: 1.375,          // Light exercise 1-3 days/week
    MODERATE: 1.55,        // Moderate exercise 3-5 days/week
    ACTIVE: 1.725,         // Heavy exercise 6-7 days/week
    VERY_ACTIVE: 1.9       // Very heavy exercise, physical job
} as const;

/**
 * Activity level descriptions cho UI
 */
export const ACTIVITY_DESCRIPTIONS = {
    SEDENTARY: 'Little to no exercise, desk job',
    LIGHT: 'Light exercise 1-3 days/week',
    MODERATE: 'Moderate exercise 3-5 days/week',
    ACTIVE: 'Heavy exercise 6-7 days/week',
    VERY_ACTIVE: 'Very heavy exercise, physical job'
} as const;

// ================================
// 🎯 Health Validation & Recommendations
// ================================

/**
 * Validate BMI range for fitness goals
 * @param bmi - BMI value
 * @param fitnessGoals - Array of fitness goals
 * @returns Validation warnings if any
 */
export const validateBMIForGoals = (bmi: number, fitnessGoals: FitnessGoal[]): string[] => {
    const warnings: string[] = [];

    if (bmi < 18.5 && fitnessGoals.includes(FitnessGoal.WEIGHT_LOSS)) {
        warnings.push('BMI indicates underweight. Weight loss goals may not be appropriate.');
    }

    if (bmi > 30 && fitnessGoals.includes(FitnessGoal.MUSCLE_GAIN)) {
        warnings.push('Consider combining muscle gain with weight management goals.');
    }

    if (bmi > 35) {
        warnings.push('BMI indicates severe obesity. Consult healthcare provider before starting intense exercise.');
    }

    if (bmi < 16) {
        warnings.push('BMI indicates severe underweight. Medical supervision recommended.');
    }

    return warnings;
};

/**
 * Get BMI health risk level
 * @param bmi - BMI value
 * @returns Risk level string
 */
export const getBMIRiskLevel = (bmi: number): string => {
    if (bmi < 16) return 'Severe underweight - High risk';
    if (bmi < 18.5) return 'Underweight - Moderate risk';
    if (bmi < 25) return 'Normal weight - Low risk';
    if (bmi < 30) return 'Overweight - Moderate risk';
    if (bmi < 35) return 'Obese Class I - High risk';
    if (bmi < 40) return 'Obese Class II - Very high risk';
    return 'Obese Class III - Extremely high risk';
};

/**
 * Calculate ideal weight range dựa trên height
 * @param height - Height in cm
 * @returns Object với min và max ideal weight
 */
export const calculateIdealWeightRange = (height: number): { min: number; max: number } => {
    const heightInMeters = height / 100;
    const minWeight = Math.round(18.5 * heightInMeters * heightInMeters * 10) / 10;
    const maxWeight = Math.round(24.9 * heightInMeters * heightInMeters * 10) / 10;

    return { min: minWeight, max: maxWeight };
};

/**
 * Calculate body fat percentage estimate (rough estimation)
 * @param bmi - BMI value
 * @param age - Age in years
 * @param gender - Gender
 * @returns Estimated body fat percentage
 */
export const estimateBodyFat = (bmi: number, age: number, gender: 'male' | 'female'): number => {
    let bodyFat: number;

    if (gender === 'male') {
        bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
    } else {
        bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
    }

    return Math.max(0, Math.round(bodyFat * 10) / 10);
};

/**
 * Get calorie recommendations cho different goals
 * @param tdee - Total Daily Energy Expenditure
 * @param goal - Fitness goal
 * @returns Calorie recommendation object
 */
export const getCalorieRecommendations = (tdee: number, goal: FitnessGoal): {
    calories: number;
    description: string;
    macroSplit?: { protein: number; carbs: number; fats: number };
} => {
    switch (goal) {
        case FitnessGoal.WEIGHT_LOSS:
            return {
                calories: Math.round(tdee * 0.8), // 20% caloric deficit
                description: 'Moderate caloric deficit for sustainable weight loss',
                macroSplit: { protein: 35, carbs: 35, fats: 30 }
            };

        case FitnessGoal.MUSCLE_GAIN:
            return {
                calories: Math.round(tdee * 1.15), // 15% caloric surplus
                description: 'Moderate caloric surplus for muscle building',
                macroSplit: { protein: 30, carbs: 45, fats: 25 }
            };

        case FitnessGoal.STRENGTH:
            return {
                calories: Math.round(tdee * 1.05), // Small surplus
                description: 'Small caloric surplus to support strength gains',
                macroSplit: { protein: 25, carbs: 50, fats: 25 }
            };

        case FitnessGoal.ENDURANCE:
            return {
                calories: Math.round(tdee * 1.1), // Moderate surplus
                description: 'Adequate calories to fuel endurance training',
                macroSplit: { protein: 20, carbs: 60, fats: 20 }
            };

        default:
            return {
                calories: tdee,
                description: 'Maintenance calories for general fitness',
                macroSplit: { protein: 25, carbs: 45, fats: 30 }
            };
    }
};

/**
 * Calculate water intake recommendation
 * @param weight - Weight in kg
 * @param activityLevel - Activity level multiplier
 * @returns Recommended daily water intake in liters
 */
export const calculateWaterIntake = (weight: number, activityLevel: number): number => {
    // Base formula: 35ml per kg of body weight
    let baseWater = weight * 0.035;

    // Adjust based on activity level
    if (activityLevel >= ACTIVITY_LEVELS.ACTIVE) {
        baseWater *= 1.3; // 30% more for active individuals
    } else if (activityLevel >= ACTIVITY_LEVELS.MODERATE) {
        baseWater *= 1.15; // 15% more for moderately active
    }

    return Math.round(baseWater * 10) / 10;
};

/**
 * Generate health insights summary
 * @param weight - Weight in kg
 * @param height - Height in cm
 * @param age - Age in years
 * @param gender - Gender
 * @param activityLevel - Activity level
 * @param fitnessGoals - Array of fitness goals
 * @returns Comprehensive health insights
 */
export const generateHealthInsights = (
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female',
    activityLevel: number,
    fitnessGoals: FitnessGoal[]
) => {
    const bmi = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(bmi);
    const bmiRisk = getBMIRiskLevel(bmi);
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const idealWeight = calculateIdealWeightRange(height);
    const bodyFat = estimateBodyFat(bmi, age, gender);
    const waterIntake = calculateWaterIntake(weight, activityLevel);
    const warnings = validateBMIForGoals(bmi, fitnessGoals);

    // Get calorie recommendations cho primary goal
    const primaryGoal = fitnessGoals[0] || FitnessGoal.GENERAL_FITNESS;
    const calorieRec = getCalorieRecommendations(tdee, primaryGoal);

    return {
        bmi: {
            value: bmi,
            category: bmiCategory,
            riskLevel: bmiRisk,
            idealWeightRange: idealWeight
        },
        metabolism: {
            bmr,
            tdee,
            activityLevel: Object.keys(ACTIVITY_LEVELS).find(
                key => ACTIVITY_LEVELS[key as keyof typeof ACTIVITY_LEVELS] === activityLevel
            ) || 'MODERATE'
        },
        bodyComposition: {
            estimatedBodyFat: bodyFat,
            bodyFatCategory: getBodyFatCategory(bodyFat, gender)
        },
        recommendations: {
            calories: calorieRec,
            waterIntake: {
                liters: waterIntake,
                description: `${waterIntake}L daily, adjust based on climate and sweat rate`
            }
        },
        warnings,
        fitnessGoals
    };
};

/**
 * Get body fat category
 * @param bodyFat - Body fat percentage
 * @param gender - Gender
 * @returns Body fat category
 */
const getBodyFatCategory = (bodyFat: number, gender: 'male' | 'female'): string => {
    if (gender === 'male') {
        if (bodyFat < 6) return 'Essential fat';
        if (bodyFat < 14) return 'Athletic';
        if (bodyFat < 18) return 'Fitness';
        if (bodyFat < 25) return 'Average';
        return 'Obese';
    } else {
        if (bodyFat < 14) return 'Essential fat';
        if (bodyFat < 21) return 'Athletic';
        if (bodyFat < 25) return 'Fitness';
        if (bodyFat < 32) return 'Average';
        return 'Obese';
    }
};
