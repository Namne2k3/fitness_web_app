/**
 * 🧪 ChatBot API Test Script
 * Manual testing script for ChatBot API endpoints
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';
const CHATBOT_BASE_URL = `${API_BASE_URL}/chatbot`;

/**
 * Test configuration
 */
const testConfig = {
    // You need to get a real JWT token from login
    authToken: 'your-jwt-token-here',
    userId: 'test-user-id',
    timeout: 30000
};

/**
 * Test helper function
 */
const makeRequest = async (method: string, endpoint: string, data?: any, requireAuth: boolean = true) => {
    const config: any = {
        method,
        url: `${CHATBOT_BASE_URL}${endpoint}`,
        timeout: testConfig.timeout,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (requireAuth) {
        config.headers['Authorization'] = `Bearer ${testConfig.authToken}`;
    }

    if (data) {
        config.data = data;
    }

    try {
        const response = await axios(config);
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Test 1: Health Check
 */
export const testHealthCheck = async () => {
    console.log('🏥 Testing Health Check...');
    const result = await makeRequest('GET', '/health', null, false);

    if (result.success) {
        console.log('✅ Health check passed:', result.data);
    } else {
        console.log('❌ Health check failed:', result.error);
    }

    return result;
};

/**
 * Test 2: Send Message
 */
export const testSendMessage = async () => {
    console.log('💬 Testing Send Message...');

    const testMessage = {
        message: 'Hello! Can you help me with a workout plan for weight loss?'
    };

    const result = await makeRequest('POST', '/message', testMessage);

    if (result.success) {
        console.log('✅ Message sent successfully:', result.data);
        return result.data.data?.conversation_id;
    } else {
        console.log('❌ Message failed:', result.error);
        return null;
    }
};

/**
 * Test 3: Send Follow-up Message
 */
export const testFollowUpMessage = async (conversationId: string) => {
    console.log('🔄 Testing Follow-up Message...');

    const followUpMessage = {
        message: 'What exercises should I do for cardio?',
        conversation_id: conversationId
    };

    const result = await makeRequest('POST', '/message', followUpMessage);

    if (result.success) {
        console.log('✅ Follow-up message sent successfully:', result.data);
    } else {
        console.log('❌ Follow-up message failed:', result.error);
    }

    return result;
};

/**
 * Test 4: Get Conversations
 */
export const testGetConversations = async () => {
    console.log('📋 Testing Get Conversations...');

    const result = await makeRequest('GET', '/conversations');

    if (result.success) {
        console.log('✅ Conversations retrieved successfully:', result.data);
    } else {
        console.log('❌ Get conversations failed:', result.error);
    }

    return result;
};

/**
 * Test 5: Get Configuration
 */
export const testGetConfig = async () => {
    console.log('⚙️ Testing Get Configuration...');

    const result = await makeRequest('GET', '/config');

    if (result.success) {
        console.log('✅ Configuration retrieved successfully:', result.data);
    } else {
        console.log('❌ Get configuration failed:', result.error);
    }

    return result;
};

/**
 * Test 6: Test Connection
 */
export const testConnection = async () => {
    console.log('🔗 Testing Connection...');

    const result = await makeRequest('POST', '/test');

    if (result.success) {
        console.log('✅ Connection test passed:', result.data);
    } else {
        console.log('❌ Connection test failed:', result.error);
    }

    return result;
};

/**
 * Test 7: Error Handling
 */
export const testErrorHandling = async () => {
    console.log('🚨 Testing Error Handling...');

    // Test empty message
    const emptyMessageResult = await makeRequest('POST', '/message', { message: '' });
    console.log('Empty message test:', emptyMessageResult.success ? '❌ Should have failed' : '✅ Correctly failed');

    // Test too long message
    const longMessage = 'x'.repeat(3000);
    const longMessageResult = await makeRequest('POST', '/message', { message: longMessage });
    console.log('Long message test:', longMessageResult.success ? '❌ Should have failed' : '✅ Correctly failed');

    // Test invalid conversation ID
    const invalidConvResult = await makeRequest('POST', '/message', {
        message: 'Test',
        conversation_id: 'invalid-id'
    });
    console.log('Invalid conversation ID test:', invalidConvResult);
};

/**
 * Run all tests
 */
export const runAllTests = async () => {
    console.log('🚀 Starting ChatBot API Tests...\n');

    // Check if auth token is set
    if (testConfig.authToken === 'your-jwt-token-here') {
        console.log('⚠️  Warning: Please set a real JWT token in testConfig.authToken');
        console.log('   You can get one by logging in through the auth API\n');
    }

    try {
        // Test 1: Health Check
        await testHealthCheck();
        console.log('');

        // Test 2: Send Message
        const conversationId = await testSendMessage();
        console.log('');

        // Test 3: Follow-up Message (if conversation ID exists)
        if (conversationId) {
            await testFollowUpMessage(conversationId);
            console.log('');
        }

        // Test 4: Get Conversations
        await testGetConversations();
        console.log('');

        // Test 5: Get Configuration
        await testGetConfig();
        console.log('');

        // Test 6: Test Connection
        await testConnection();
        console.log('');

        // Test 7: Error Handling
        await testErrorHandling();
        console.log('');

        console.log('🎉 All tests completed!');

    } catch (error) {
        console.error('💥 Test execution failed:', error);
    }
};

/**
 * Interactive test menu
 */
export const runInteractiveTest = async () => {
    console.log('🤖 ChatBot API Interactive Test Menu');
    console.log('=====================================');
    console.log('1. Health Check');
    console.log('2. Send Message');
    console.log('3. Get Conversations');
    console.log('4. Get Configuration');
    console.log('5. Test Connection');
    console.log('6. Error Handling Tests');
    console.log('7. Run All Tests');
    console.log('0. Exit');

    // Note: In a real implementation, you'd use readline or prompts
    // For now, we'll just run all tests
    await runAllTests();
};

// Export for use in other files
export default {
    testHealthCheck,
    testSendMessage,
    testFollowUpMessage,
    testGetConversations,
    testGetConfig,
    testConnection,
    testErrorHandling,
    runAllTests,
    runInteractiveTest
};
