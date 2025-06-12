/**
 * 🔐 Auth Mapper Demo
 * Demonstrating how AuthMapper filters sensitive data
 */

import { AuthMapper } from '../mappers/authMapper';

/**
 * Demo - Before và After comparison
 */
export function demoAuthMapper() {
    console.log('\n🔐 ========== AUTH MAPPER DEMO ==========\n');

    // ================================
    // 📋 MOCK RAW USER DATA (từ database)
    // ================================
    const rawUserFromDB = {
        _id: '64a1b2c3d4e5f6789abcdef0',
        email: 'john.doe@example.com',
        username: 'john_fitness',
        password: '$2b$12$X8Y9Z.ABC.hashedPasswordHere12345',  // 🚨 SENSITIVE
        role: 'user',
        profile: {
            firstName: 'John',
            lastName: 'Doe',
            age: 28,
            weight: 75,
            height: 180,
            fitnessGoals: ['BUILD_MUSCLE', 'LOSE_WEIGHT'],
            experienceLevel: 'INTERMEDIATE',
            avatar: 'https://cloudinary.com/avatar1.jpg',
            bio: 'Fitness enthusiast from Ho Chi Minh City'
        },
        preferences: {
            notifications: {
                workoutReminders: true,
                newContent: true,
                sponsoredOffers: false,
                socialUpdates: true,
                email: true,
                push: false
            },
            privacy: {
                profileVisibility: 'public',
                workoutVisibility: 'friends',
                showInLeaderboards: true,
                allowDirectMessages: true
            },
            theme: 'dark'
        },
        subscription: {
            plan: 'PREMIUM',
            status: 'ACTIVE',
            features: ['unlimited_workouts', 'nutrition_tracking', 'personal_trainer'],
            startDate: new Date('2025-01-01'),
            endDate: new Date('2025-12-31')
        },
        isEmailVerified: true,
        emailVerificationToken: 'abc123-verification-token-xyz789',  // 🚨 SENSITIVE
        passwordResetToken: 'reset-token-12345',                     // 🚨 SENSITIVE 
        passwordResetExpires: new Date('2025-06-15'),                // 🚨 SENSITIVE
        lastLoginAt: new Date('2025-06-12T08:30:00Z'),
        isActive: true,
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedAt: new Date('2025-06-12T08:30:00Z'),
        __v: 0  // 🚨 MONGODB INTERNAL
    };

    // ================================
    // 📋 RAW LOGIN RESPONSE (từ AuthService)
    // ================================
    const rawLoginResponse = {
        user: rawUserFromDB,
        tokens: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGExYjJjM2Q0ZTVmNjc4OWFiY2RlZjAiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTgyMTc2MDAsImV4cCI6MTcxODIyNDgwMH0.signature123',
            refreshToken: 'refresh_token_random_string_here_12345'
        }
    };

    console.log('📋 RAW USER DATA (từ Database):');
    console.log('=====================================');
    console.log(JSON.stringify(rawUserFromDB, null, 2));

    console.log('\n🚨 SENSITIVE DATA FOUND:');
    console.log('========================');
    console.log('- password:', rawUserFromDB.password);
    console.log('- emailVerificationToken:', rawUserFromDB.emailVerificationToken);
    console.log('- passwordResetToken:', rawUserFromDB.passwordResetToken);
    console.log('- passwordResetExpires:', rawUserFromDB.passwordResetExpires);
    console.log('- __v:', rawUserFromDB.__v);

    // ================================
    // 🔹 APPLY AUTH MAPPER TRANSFORMATION  
    // ================================
    console.log('\n🔄 APPLYING AUTH MAPPER...\n');

    // Transform với AuthMapper
    const safeLoginResponse = AuthMapper.toLoginResponse(rawLoginResponse);
    const publicProfile = AuthMapper.toPublicProfile(rawUserFromDB as any);
    const logSafeUser = AuthMapper.toLogSafeUser(rawUserFromDB);

    // ================================
    // 📋 RESULTS
    // ================================
    console.log('✅ SAFE LOGIN RESPONSE (cho Client):');
    console.log('=====================================');
    console.log(JSON.stringify(safeLoginResponse, null, 2));

    console.log('\n✅ PUBLIC PROFILE (cho Guest users):');
    console.log('=====================================');
    console.log(JSON.stringify(publicProfile, null, 2));

    console.log('\n✅ LOG SAFE USER (cho Development):');
    console.log('===================================');
    console.log(JSON.stringify(logSafeUser, null, 2));

    // ================================
    // 📊 SUMMARY
    // ================================
    console.log('\n📊 SECURITY COMPARISON:');
    console.log('========================');
    console.log('🚨 Raw User có SENSITIVE data:');
    console.log('  - password: ✓');
    console.log('  - emailVerificationToken: ✓');
    console.log('  - passwordResetToken: ✓');
    console.log('  - passwordResetExpires: ✓');
    console.log('  - __v: ✓');

    console.log('\n✅ Safe User KHÔNG có sensitive data:');
    console.log('  - password: ✗ (removed)');
    console.log('  - tokens: ✗ (removed)');
    console.log('  - internal fields: ✗ (removed)');

    console.log('\n🎯 Public Profile CÒN ÍT data hơn:');
    console.log('  - age: ✗ (hidden)');
    console.log('  - weight: ✗ (hidden)');
    console.log('  - height: ✗ (hidden)');
    console.log('  - preferences: ✗ (hidden)');
    console.log('  - subscription: ✗ (hidden)');

    console.log('\n🔐 CALCULATED BMI:');
    console.log('==================');
    const bmi = 75 / Math.pow(180 / 100, 2);
    console.log(`BMI = weight(${rawUserFromDB.profile.weight}) / height(${rawUserFromDB.profile.height / 100})² = ${bmi.toFixed(1)}`);
    console.log(`BMI Category: ${bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}`);

    console.log('\n🎉 ========== DEMO COMPLETE ==========\n');
}

// ================================
// 📊 USAGE EXAMPLES
// ================================
export function usageExamples() {
    console.log('\n📚 ========== USAGE EXAMPLES ==========\n');

    console.log('🔹 1. LOGIN ENDPOINT:');
    console.log(`
// AuthController.ts
const result = await AuthService.login(req.body);
const safeResponse = AuthMapper.toLoginResponse(result);

res.json({
    success: true, 
    data: safeResponse  // ✅ No sensitive data
});
    `);

    console.log('🔹 2. GET CURRENT USER:');
    console.log(`
// AuthController.ts  
const user = await AuthService.getUserById(req.user._id);
const safeResponse = AuthMapper.toCurrentUserResponse(user);

res.json({
    success: true,
    data: safeResponse  // ✅ Safe user profile
});
    `);

    console.log('🔹 3. PUBLIC PROFILE API:');
    console.log(`
// UserController.ts
const user = await UserService.getByUsername(username);
const publicProfile = AuthMapper.toPublicProfile(user);

res.json({
    success: true,
    data: publicProfile  // ✅ Only public information
});
    `);

    console.log('🔹 4. ADMIN USER LIST:');
    console.log(`
// AdminController.ts
const users = await UserService.getAllUsers();
const userList = AuthMapper.toUserList(users);

res.json({
    success: true,
    data: userList  // ✅ Minimal user data
});
    `);

    console.log('🔹 5. ERROR LOGGING (Development):');
    console.log(`
// ErrorHandler.ts
const logSafeUser = AuthMapper.toLogSafeUser(req.user);
console.log('Error for user:', logSafeUser);  // ✅ No sensitive data in logs
    `);

    console.log('\n✅ ========== ALL EXAMPLES COMPLETE ==========\n');
}

// Export demo functions
export default {
    demoAuthMapper,
    usageExamples
};
