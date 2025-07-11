/**
 * 🤖 ChatBot Types & Interfaces
 * TypeScript definitions theo ChatBot API Usage Guide
 * 
 * API Contract:
 * - Input: { message, user_id?, conversation_id? }
 * - Output: { reply, conversation_id?, timestamp }
 */

// ================================
// 📤 Request Types (gửi đến external ChatBot API)
// ================================

/**
 * Model: ChatRequest - theo API Usage Guide
 * Request gửi đến external ChatBot API (Python Gemini server)
 */
export interface ChatRequest {
    message: string;                // Required: User message/prompt
    user_id?: string | undefined;              // Optional: User ID for personalization
    conversation_id?: string | undefined;      // Optional: Conversation ID for history
}

/**
 * Internal request từ client đến TrackMe backend
 * Chỉ chứa message và conversation_id (user_id sẽ extract từ authentication)
 */
export interface ClientChatRequest {
    message: string;
    conversation_id?: string;
}

// ================================
// 📥 Response Types (nhận từ external API)
// ================================

/**
 * Model: ChatResponse - theo API Usage Guide
 * Response từ external ChatBot API
 */
export interface ChatResponse {
    reply: string;                 // AI response từ Gemini
    conversation_id?: string;      // Conversation ID (auto-generated nếu không có)
    timestamp: string;             // ISO timestamp
}

/**
 * Model: ErrorResponse - theo API Usage Guide
 * Response khi có lỗi từ ChatBot API
 */
export interface ChatErrorResponse {
    error: string;                 // Error type
    message: string;               // Error description  
    timestamp: string;             // ISO timestamp
}

// ================================
// 🏥 Health Check Types - theo API Usage Guide
// ================================

/**
 * Health check response từ /api/health endpoint
 */
export interface ChatHealthResponse {
    status: 'healthy';             // Status indicator
    gemini_api: 'connected';       // Gemini API connection status
    timestamp: string;             // ISO timestamp
}
