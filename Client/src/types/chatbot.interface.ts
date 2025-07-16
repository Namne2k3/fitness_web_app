/**
 * 🤖 ChatBot Types & Interfaces
 * Type definitions theo ChatBot API Usage Guide
 * 
 * API Contract:
 * - Input: { message, conversation_id? }
 * - Output: { reply, conversation_id?, timestamp }
 */

// ================================
// 📤 Request Types
// ================================

/**
 * Request gửi đến backend ChatBot API
 */
export interface ChatBotRequest {
    message: string;                // Required: User message
    conversation_id?: string;       // Optional: Conversation ID for history
}

// ================================
// 📥 Response Types
// ================================

/**
 * Response từ backend ChatBot API
 */
export interface ChatBotResponse {
    reply: string;                  // AI response from Gemini
    conversation_id?: string;       // Conversation ID (auto-generated if not provided)
    timestamp: string;              // ISO timestamp
}

/**
 * Health check response
 */
export interface ChatBotHealthResponse {
    status: 'healthy';              // Health status
    gemini_api: 'connected';        // Gemini API connection status
    timestamp: string;              // ISO timestamp
}

// ================================
// 🎨 UI Component Types
// ================================

/**
 * UI Chat Message for display
 */
export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    isStreaming?: boolean;
    conversation_id?: string;
}

/**
 * UI Chat Thread for conversation management
 */
export interface ChatThread {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}

/**
 * ChatBot UI Configuration
 */
export interface ChatConfig {
    maxMessages: number;
    enableTyping: boolean;
    enableQuickActions: boolean;
    theme: 'light' | 'dark' | 'auto';
}

// ================================
// 🚀 Quick Actions
// ================================

export interface QuickAction {
    id: string;
    label: string;
    prompt: string;
    icon?: string;
    category: 'workout' | 'nutrition' | 'general' | 'motivation';
}

export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
    {
        id: 'workout-plan',
        label: '💪 Lập kế hoạch tập luyện',
        prompt: 'Giúp tôi lập kế hoạch tập luyện phù hợp với mục tiêu của tôi',
        category: 'workout'
    },
    // {
    //     id: 'nutrition-advice',
    //     label: '🥗 Tư vấn dinh dưỡng',
    //     prompt: 'Tư vấn chế độ dinh dưỡng phù hợp cho việc tập luyện',
    //     category: 'nutrition'
    // },
    {
        id: 'exercise-form',
        label: '🏃‍♂️ Hướng dẫn động tác',
        prompt: 'Hướng dẫn tôi cách thực hiện động tác tập luyện đúng cách',
        category: 'workout'
    },
    {
        id: 'motivation',
        label: '🔥 Động lực tập luyện',
        prompt: 'Cho tôi một số lời khuyên để duy trì động lực tập luyện',
        category: 'motivation'
    },
    // {
    //     id: 'injury-prevention',
    //     label: '🛡️ Phòng chống chấn thương',
    //     prompt: 'Làm thế nào để tránh chấn thương khi tập luyện?',
    //     category: 'workout'
    // },
    // {
    //     id: 'weight-loss',
    //     label: '⚖️ Giảm cân hiệu quả',
    //     prompt: 'Tư vấn cách giảm cân an toàn và hiệu quả',
    //     category: 'nutrition'
    // }
    {
        id: 'advice-some-exercise',
        label: '🏋️‍♂️ Gợi ý bài tập',
        prompt: 'Gợi ý cho tôi một số bài tập phù hợp với mục tiêu của tôi',
        category: 'workout'
    }
];

// ================================
// 📝 System Prompts
// ================================

export const SYSTEM_PROMPTS = {
    fitness_assistant: `Bạn là một AI trợ lý fitness chuyên nghiệp và thân thiện. Nhiệm vụ của bạn là:

1. Tư vấn về tập luyện, dinh dưỡng và sức khỏe
2. Đưa ra lời khuyên khoa học và an toàn
3. Động viên và hỗ trợ người dùng đạt mục tiêu
4. Trả lời bằng tiếng Việt một cách tự nhiên và dễ hiểu
5. Luôn khuyến khích tham khảo ý kiến chuyên gia khi cần thiết

Phong cách: Thân thiện, chuyên nghiệp, tích cực và có trách nhiệm.`,

    workout_planner: `Bạn là chuyên gia lập kế hoạch tập luyện. Hãy:

1. Đánh giá mức độ fitness hiện tại của người dùng
2. Tạo kế hoạch tập luyện phù hợp với mục tiêu
3. Đưa ra lịch tập chi tiết theo tuần/tháng
4. Hướng dẫn cách theo dõi tiến độ
5. Điều chỉnh kế hoạch dựa trên phản hồi

Luôn ưu tiên an toàn và tính bền vững của kế hoạch.`,

    nutrition_advisor: `Bạn là chuyên gia dinh dưỡng thể thao. Nhiệm vụ:

1. Tư vấn chế độ ăn phù hợp với mục tiêu tập luyện
2. Đưa ra thực đơn cụ thể và thực tế
3. Giải thích vai trò của các dưỡng chất
4. Tư vấn về thực phẩm bổ sung (supplement)
5. Hướng dẫn timing dinh dưỡng quanh thời gian tập

Luôn dựa trên khoa học dinh dưỡng và phù hợp với người Việt.`
};
