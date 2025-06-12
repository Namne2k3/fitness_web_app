/**
 * 🧪 BMI Calculation Tests
 * Test BMI calculation và health metrics functionality
 */

import { calculateBMI, getBMICategory, validateBMIForGoals } from '../utils/healthCalculations';
import { FitnessGoal } from '../types';

// Test BMI calculations
console.log('🧪 Testing BMI Calculations...\n');

// Test case 1: Normal BMI
const weight1 = 70; // kg
const height1 = 175; // cm
const bmi1 = calculateBMI(weight1, height1);
console.log(`📊 Case 1 - Weight: ${weight1}kg, Height: ${height1}cm`);
console.log(`   BMI: ${bmi1}`);
console.log(`   Category: ${getBMICategory(bmi1)}\n`);

// Test case 2: Underweight
const weight2 = 50; // kg
const height2 = 170; // cm
const bmi2 = calculateBMI(weight2, height2);
console.log(`📊 Case 2 - Weight: ${weight2}kg, Height: ${height2}cm`);
console.log(`   BMI: ${bmi2}`);
console.log(`   Category: ${getBMICategory(bmi2)}\n`);

// Test case 3: Overweight
const weight3 = 85; // kg
const height3 = 165; // cm
const bmi3 = calculateBMI(weight3, height3);
console.log(`📊 Case 3 - Weight: ${weight3}kg, Height: ${height3}cm`);
console.log(`   BMI: ${bmi3}`);
console.log(`   Category: ${getBMICategory(bmi3)}\n`);

// Test BMI validation for fitness goals
console.log('🎯 Testing BMI validation for fitness goals...\n');

const goals1 = [FitnessGoal.WEIGHT_LOSS, FitnessGoal.STRENGTH];
const warnings1 = validateBMIForGoals(bmi2, goals1); // Underweight với weight loss goal
console.log(`Goals: ${goals1.join(', ')}`);
console.log(`BMI: ${bmi2} (${getBMICategory(bmi2)})`);
console.log(`Warnings: ${warnings1.length > 0 ? warnings1.join(', ') : 'None'}\n`);

const goals2 = [FitnessGoal.MUSCLE_GAIN];
const warnings2 = validateBMIForGoals(32, goals2); // Obese với muscle gain goal
console.log(`Goals: ${goals2.join(', ')}`);
console.log(`BMI: 32 (${getBMICategory(32)})`);
console.log(`Warnings: ${warnings2.length > 0 ? warnings2.join(', ') : 'None'}\n`);

// Example user profile data
console.log('👤 Example User Profile with BMI:\n');
const exampleUser = {
    profile: {
        firstName: 'John',
        lastName: 'Doe',
        age: 28,
        weight: 75,
        height: 180,
        fitnessGoals: [FitnessGoal.MUSCLE_GAIN, FitnessGoal.STRENGTH],
        experienceLevel: 'intermediate'
    }
};

const userBMI = calculateBMI(exampleUser.profile.weight, exampleUser.profile.height);
const userCategory = getBMICategory(userBMI);
const userWarnings = validateBMIForGoals(userBMI, exampleUser.profile.fitnessGoals);

console.log(`User: ${exampleUser.profile.firstName} ${exampleUser.profile.lastName}`);
console.log(`Age: ${exampleUser.profile.age}, Weight: ${exampleUser.profile.weight}kg, Height: ${exampleUser.profile.height}cm`);
console.log(`BMI: ${userBMI} (${userCategory})`);
console.log(`Goals: ${exampleUser.profile.fitnessGoals.join(', ')}`);
console.log(`Experience: ${exampleUser.profile.experienceLevel}`);
console.log(`Health Warnings: ${userWarnings.length > 0 ? userWarnings.join(', ') : 'None'}`);

console.log('\n✅ BMI Tests completed successfully!');
