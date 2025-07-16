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

            const response = await api.post('http://localhost:3000/api/v1/chat', request);

            return (response.data as ChatBotResponse);
        } catch (error) {
            console.error('❌ ChatBot API Error:', error);
            throw new Error('Failed to send message to ChatBot');
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
