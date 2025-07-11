/**
 * 🧪 ChatBot API Test
 * Test script to verify ChatBot API integration
 */

import { ChatBotService } from '../services/ChatBotService';
import { ChatBotRequest } from '../types/chatbot.types';

/**
 * Test ChatBot API integration
 */
export const testChatBotAPI = async (): Promise<void> => {
    console.log('🧪 Testing ChatBot API integration...');

    try {
        // Test 1: Health check
        console.log('\n1. Testing health check...');
        const healthStatus = await ChatBotService.getHealthStatus();
        console.log('✅ Health check:', healthStatus);

        // Test 2: Send test message
        console.log('\n2. Testing message sending...');
        const testRequest: ChatBotRequest = {
            message: 'Hello, this is a test message from fitness app!',
            user_id: 'test-user-123',
            conversation_id: undefined
        };

        const response = await ChatBotService.sendMessage(testRequest);
        console.log('✅ Message response:', response);

        // Test 3: Send follow-up message
        console.log('\n3. Testing follow-up message...');
        const followUpRequest: ChatBotRequest = {
            message: 'Can you help me with a workout plan?',
            user_id: 'test-user-123',
            conversation_id: response.conversation_id
        };

        const followUpResponse = await ChatBotService.sendMessage(followUpRequest);
        console.log('✅ Follow-up response:', followUpResponse);

        console.log('\n🎉 All tests passed successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

/**
 * Test with various scenarios
 */
export const testChatBotScenarios = async (): Promise<void> => {
    console.log('🧪 Testing various ChatBot scenarios...');

    const scenarios = [
        {
            name: 'Fitness Question',
            message: 'What is the best exercise for weight loss?',
            user_id: 'test-user-fitness',
            conversation_id: undefined
        },
        {
            name: 'Nutrition Question',
            message: 'How much protein should I eat daily?',
            user_id: 'test-user-nutrition',
            conversation_id: undefined
        },
        {
            name: 'General Health',
            message: 'Tips for staying motivated to exercise?',
            user_id: 'test-user-motivation',
            conversation_id: undefined
        }
    ];

    for (const scenario of scenarios) {
        try {
            console.log(`\n📝 Testing: ${scenario.name}`);
            const response = await ChatBotService.sendMessage(scenario);
            console.log(`✅ Response: ${response.reply.substring(0, 100)}...`);
        } catch (error) {
            console.error(`❌ Failed ${scenario.name}:`, error);
        }
    }
};

// Run tests if this file is executed directly
// Note: This will be handled by the test runner or manually called
