/**
 * 🤖 ChatBot Service
 * Service layer for ChatBot API calls theo API Usage Guide
 * 
 * API Endpoints:
 * - POST /api/chat - Send message to ChatBot
 * - GET /api/health - Check ChatBot API health
 */

import { ChatMessage, ChatBotRequest, ChatBotResponse, ChatBotHealthResponse } from '../types/chatbot.interface';
import api from './api';

/**
 * ChatBot API service theo API Usage Guide
 */
export class ChatBotService {
    private static readonly STREAM_DELAY = 50; // ms between chunks for UX simulation

    /**
     * Send message to ChatBot API
     * @param message - User message
     * @param conversationId - Optional conversation ID
     * @returns Promise with ChatBot response
     */
    static async sendMessage(
        message: string,
        conversationId?: string
    ): Promise<ChatBotResponse> {
        try {
            const request: ChatBotRequest = {
                message,
                conversation_id: conversationId
            };

            const response = await api.post('/chat', request);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (response.data as any).data as ChatBotResponse;
        } catch (error) {
            console.error('❌ ChatBot API Error:', error);
            throw new Error('Failed to send message to ChatBot');
        }
    }

    /**
     * Send message với streaming simulation cho better UX
     * @param messages - Chat conversation history
     * @param onChunk - Callback for each response chunk
     * @param onComplete - Callback when stream is complete
     * @param onError - Callback for errors
     */
    static async sendMessageWithStreaming(
        messages: ChatMessage[],
        onChunk: (chunk: string) => void,
        onComplete: (fullResponse: string, conversationId?: string) => void,
        onError: (error: Error) => void
    ): Promise<void> {
        try {
            // Get the latest user message
            const latestMessage = messages[messages.length - 1];
            if (!latestMessage || latestMessage.role !== 'user') {
                throw new Error('No user message found');
            }

            // Get conversation ID from previous messages
            const conversationId = this.extractConversationId(messages);

            // Call ChatBot API
            const response = await this.sendMessage(latestMessage.content, conversationId);

            // Simulate streaming for better UX
            await this.simulateStreaming(
                response.reply,
                onChunk,
                () => onComplete(response.reply, response.conversation_id)
            );

        } catch (error) {
            console.error('❌ ChatBot Service Error:', error);

            // Fallback to mock response if API fails
            await this.sendMockMessage(messages, onChunk, onComplete, onError);
        }
    }

    /**
     * Check ChatBot API health
     * @returns Promise with health status
     */
    static async checkHealth(): Promise<ChatBotHealthResponse> {
        try {
            const response = await api.get('/health');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (response.data as any).data as ChatBotHealthResponse;
        } catch (error) {
            console.error('❌ ChatBot Health Check Error:', error);
            throw new Error('ChatBot health check failed');
        }
    }

    /**
     * Simulate streaming response for better UX
     */
    private static async simulateStreaming(
        fullResponse: string,
        onChunk: (chunk: string) => void,
        onComplete: () => void
    ): Promise<void> {
        const words = fullResponse.split(' ');

        for (let i = 0; i < words.length; i++) {
            const word = words[i] + (i < words.length - 1 ? ' ' : '');

            onChunk(word);

            // Variable delay for more natural feeling
            const delay = Math.random() * 100 + 30;
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        onComplete();
    }

    /**
     * Extract conversation ID from messages
     * Uses conversation_id from the most recent message if available
     */
    private static extractConversationId(messages: ChatMessage[]): string | undefined {
        // Find conversation ID from the most recent messages
        for (const message of messages.reverse()) {
            if (message.conversation_id) {
                return message.conversation_id;
            }
        }
        return undefined;
    }

    /**
     * Fallback mock message when API fails
     */
    private static async sendMockMessage(
        _messages: ChatMessage[],
        onChunk: (chunk: string) => void,
        onComplete: (fullResponse: string) => void,
        onError: (error: Error) => void
    ): Promise<void> {
        try {
            // Mock streaming response
            const mockResponses = [
                "Xin lỗi, tôi đang gặp vấn đề kỹ thuật tạm thời. ",
                "Tuy nhiên, tôi vẫn có thể giúp bạn với một số thông tin cơ bản! ",
                "Đây là một số gợi ý về tập luyện:\n\n",
                "🏃‍♂️ **Cardio**: Chạy bộ, đạp xe, bơi lội giúp cải thiện sức khỏe tim mạch\n",
                "💪 **Strength**: Tập tạ, push-up, squat giúp xây dựng cơ bắp\n",
                "🧘‍♀️ **Flexibility**: Yoga, stretching giúp tăng độ dẻo dai\n\n",
                "Hãy thử lại sau để được tư vấn chi tiết hơn! 🌟"
            ];

            let fullResponse = '';

            for (let i = 0; i < mockResponses.length; i++) {
                await new Promise(resolve => setTimeout(resolve, this.STREAM_DELAY * (i + 1)));

                const chunk = mockResponses[i];
                fullResponse += chunk;
                onChunk(chunk);
            }

            onComplete(fullResponse);
        } catch (error) {
            onError(error as Error);
        }
    }

    /**
     * Generate contextual response based on user input (for offline mode)
     */
    static generateContextualResponse(userInput: string): string[] {
        const input = userInput.toLowerCase();

        if (input.includes('tập luyện') || input.includes('workout') || input.includes('gym')) {
            return [
                "Tuyệt vời! Tập luyện là chìa khóa cho sức khỏe tốt. ",
                "Để lập kế hoạch hiệu quả, tôi cần biết:\n\n",
                "• Mục tiêu cụ thể của bạn\n",
                "• Thời gian có thể dành ra\n",
                "• Thiết bị/địa điểm tập\n",
                "• Mức độ kinh nghiệm hiện tại\n\n",
                "Hãy chia sẻ thông tin này nhé! 💪"
            ];
        }

        if (input.includes('dinh dưỡng') || input.includes('ăn uống') || input.includes('nutrition')) {
            return [
                "Dinh dưỡng chiếm 70% thành công trong fitness! ",
                "Tôi có thể tư vấn:\n\n",
                "🥗 Thực đơn phù hợp mục tiêu\n",
                "⏰ Thời điểm ăn tối ưu\n",
                "💊 Thực phẩm bổ sung cần thiết\n",
                "📊 Tính toán calo và macro\n\n",
                "Bạn muốn bắt đầu từ đâu? "
            ];
        }

        if (input.includes('giảm cân') || input.includes('weight loss')) {
            return [
                "Giảm cân an toàn và bền vững cần kết hợp: ",
                "💪 Tập luyện đều đặn + 🥗 Chế độ ăn khoa học\n\n",
                "Tôi sẽ giúp bạn:\n",
                "• Tính toán deficit calo phù hợp\n",
                "• Lập kế hoạch tập luyện hiệu quả\n",
                "• Theo dõi tiến độ khoa học\n\n",
                "Mục tiêu giảm bao nhiêu kg trong bao lâu? "
            ];
        }

        if (input.includes('tăng cơ') || input.includes('muscle') || input.includes('bulk')) {
            return [
                "Tăng cơ cần chiến lược rõ ràng! ",
                "Yếu tố quan trọng:\n\n",
                "🏋️ Tập luyện kháng lực (3-4 lần/tuần)\n",
                "🥩 Protein đủ (1.6-2.2g/kg cân nặng)\n",
                "😴 Nghỉ ngơi phục hồi (7-9h ngủ)\n",
                "📈 Progressive overload\n\n",
                "Bạn đã có kinh nghiệm tập tạ chưa? "
            ];
        }

        // Default response
        return [
            "Cảm ơn bạn đã chia sẻ! ",
            "Tôi là AI trợ lý fitness, sẵn sàng hỗ trợ bạn với:\n\n",
            "🏋️ **Kế hoạch tập luyện**: Cardio, Strength, HIIT\n",
            "🥗 **Dinh dưỡng thể thao**: Thực đơn, macro, timing\n",
            "🎯 **Mục tiêu cụ thể**: Giảm cân, tăng cơ, endurance\n",
            "🔥 **Động lực**: Tips duy trì thói quen\n\n",
            "Bạn muốn bắt đầu từ chủ đề nào? "
        ];
    }

    /**
     * Save chat thread to local storage
     */
    static saveChatToStorage(messages: ChatMessage[]): void {
        try {
            const chatData = {
                id: Date.now().toString(),
                messages,
                timestamp: new Date().toISOString()
            };

            const existingChats = JSON.parse(localStorage.getItem('fitness_chat_history') || '[]');
            existingChats.unshift(chatData);

            // Keep only last 10 conversations
            const limitedChats = existingChats.slice(0, 10);
            localStorage.setItem('fitness_chat_history', JSON.stringify(limitedChats));
        } catch (error) {
            console.error('Failed to save chat to storage:', error);
        }
    }

    /**
     * Load chat history from local storage
     */
    static loadChatHistory(): ChatMessage[][] {
        try {
            const chatHistory = JSON.parse(localStorage.getItem('fitness_chat_history') || '[]');
            return chatHistory.map((chat: { messages: ChatMessage[] }) => chat.messages);
        } catch (error) {
            console.error('Failed to load chat history:', error);
            return [];
        }
    }

    /**
     * Clear chat history
     */
    static clearChatHistory(): void {
        localStorage.removeItem('fitness_chat_history');
    }
}
