/**
 * Test AccountService với React 19 patterns
 * Kiểm tra API calls và error handling
 */

import { AccountService } from '../services/accountService';

/**
 * Test basic AccountService functionality
 */
export async function testAccountService() {
    console.log('🧪 Testing AccountService...');

    try {
        // Test getAccountProfile
        console.log('📊 Testing getAccountProfile...');
        const profileResponse = await AccountService.getAccountProfile();

        if (profileResponse.success && profileResponse.data) {
            console.log('✅ getAccountProfile success:', {
                id: profileResponse.data.id,
                bmi: profileResponse.data.healthMetrics.bmi,
                experienceLevel: profileResponse.data.fitnessProfile.experienceLevel,
                subscriptionPlan: profileResponse.data.subscriptionPlan
            });
        } else {
            console.log('❌ getAccountProfile failed:', profileResponse.error);
        }

        return profileResponse;
    } catch (error) {
        console.error('❌ AccountService test failed:', error);
        throw error;
    }
}

/**
 * Test update profile functionality
 */
export async function testUpdateProfile() {
    console.log('🧪 Testing updateProfile...');

    try {
        const updateData = {
            profile: {
                weight: 75,
                fitnessGoals: ['muscle_gain', 'strength']
            },
            preferences: {
                theme: 'dark' as const,
                notifications: {
                    workoutReminders: true,
                    sponsoredContent: false
                }
            }
        };

        const response = await AccountService.updateProfile(updateData);

        if (response.success) {
            console.log('✅ updateProfile success');
        } else {
            console.log('❌ updateProfile failed:', response.error);
        }

        return response;
    } catch (error) {
        console.error('❌ updateProfile test failed:', error);
        throw error;
    }
}

/**
 * Test workout stats functionality
 */
export async function testWorkoutStats() {
    console.log('🧪 Testing getWorkoutStats...');

    try {
        const response = await AccountService.getWorkoutStats();

        if (response.success && response.data) {
            console.log('✅ getWorkoutStats success:', {
                totalWorkouts: response.data.totalWorkouts,
                totalDuration: response.data.totalDuration,
                weeklyProgress: response.data.weeklyProgress
            });
        } else {
            console.log('❌ getWorkoutStats failed:', response.error);
        }

        return response;
    } catch (error) {
        console.error('❌ getWorkoutStats test failed:', error);
        throw error;
    }
}

/**
 * Test username availability check
 */
export async function testUsernameAvailability(username: string) {
    console.log(`🧪 Testing checkUsernameAvailability for: ${username}`);

    try {
        const response = await AccountService.checkUsernameAvailability(username);

        if (response.success && response.data) {
            console.log(`✅ Username "${username}" available:`, response.data.available);
        } else {
            console.log('❌ checkUsernameAvailability failed:', response.error);
        }

        return response;
    } catch (error) {
        console.error('❌ checkUsernameAvailability test failed:', error);
        throw error;
    }
}

/**
 * Run all AccountService tests
 */
export async function runAllAccountTests() {
    console.log('🚀 Running all AccountService tests...');

    const results = {
        profile: null as any,
        update: null as any,
        stats: null as any,
        username: null as any
    };

    try {
        // Test core functionality
        results.profile = await testAccountService();

        // Test update (if user is authenticated)
        if (results.profile?.success) {
            results.update = await testUpdateProfile();
            results.stats = await testWorkoutStats();
            results.username = await testUsernameAvailability('testuser123');
        }

        console.log('🎉 All AccountService tests completed!');
        return results;
    } catch (error) {
        console.error('❌ AccountService test suite failed:', error);
        throw error;
    }
}

/**
 * React 19 compatible test component
 */
export function AccountServiceTester() {
    const handleRunTests = async () => {
        try {
            await runAllAccountTests();
        } catch (error) {
            console.error('Test failed:', error);
        }
    };

    return (
        <div style= {{ padding: '20px', border: '1px solid #ccc', margin: '10px' }
}>
    <h3>AccountService Tester </h3>
        < button onClick = { handleRunTests } >
            Run All Tests
                </button>
                < p > Check console for test results </p>
                    </div>
    );
}

export default testAccountService;
