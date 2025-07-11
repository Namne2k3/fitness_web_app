/**
 * 🤖 ChatBot Repository
 * Data access layer cho chatbot operations (minimal, mainly for logging)
 */

export interface ChatMessage {
    message: string;
    user_id?: string;
    conversation_id?: string;
    timestamp: Date;
}

export interface ChatResponse {
    reply: string;
    conversation_id: string;
    timestamp: string; // ISO string to match external API
}

export interface ChatLog {
    id: string;
    userId?: string;
    conversationId: string;
    userMessage: string;
    botResponse: string;
    timestamp: Date;
    responseTime: number; // in milliseconds
    successful: boolean;
    errorMessage?: string;
}

export class ChatBotRepository {
    // Since this service primarily interacts with external AI APIs,
    // this repository is minimal and mainly for logging purposes

    /**
     * Log chat interaction for analytics
     * Note: In a real implementation, you might store these in MongoDB
     * or send to an analytics service
     */
    static async logChatInteraction(log: Omit<ChatLog, 'id'>): Promise<void> {
        // For now, just console log
        // In production, you would store this in a database or analytics service
        console.log('💬 Chat Interaction:', {
            conversationId: log.conversationId,
            userId: log.userId,
            messageLength: log.userMessage.length,
            responseLength: log.botResponse.length,
            responseTime: log.responseTime,
            successful: log.successful,
            timestamp: log.timestamp
        });
    }

    /**
     * Generate unique conversation ID
     */
    static generateConversationId(): string {
        return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Validate chat request
     */
    static validateChatRequest(request: { message: string; user_id?: string; conversation_id?: string; }): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!request.message || request.message.trim().length === 0) {
            errors.push('Message is required');
        }

        if (request.message && request.message.length > 1000) {
            errors.push('Message cannot exceed 1000 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Create chat response object
     */
    static createChatResponse(
        reply: string,
        conversationId: string
    ): ChatResponse {
        return {
            reply,
            conversation_id: conversationId,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get health check data
     */
    static getHealthData(): {
        status: string;
        timestamp: Date;
        service: string;
    } {
        return {
            status: 'healthy',
            timestamp: new Date(),
            service: 'chatbot'
        };
    }

    /**
     * Format error response
     */
    static createErrorResponse(
        error: string,
        conversationId?: string
    ): {
        error: string;
        message: string;
        timestamp: Date;
        conversation_id?: string;
    } {
        return {
            error: 'Chatbot Error',
            message: error,
            timestamp: new Date(),
            ...(conversationId && { conversation_id: conversationId })
        };
    }

    /**
     * Clean and sanitize user input
     */
    static sanitizeInput(input: string): string {
        return input
            .trim()
            .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
            .substring(0, 1000);   // Limit to 1000 characters
    }

    /**
     * Check if message is potentially harmful
     */
    static isMessageSafe(message: string): boolean {
        const harmful_patterns = [
            /hack/i,
            /attack/i,
            /exploit/i,
            /malware/i,
            /virus/i,
            /<script/i,
            /javascript:/i,
            /on\w+=/i  // onclick, onload, etc.
        ];

        return !harmful_patterns.some(pattern => pattern.test(message));
    }

    /**
     * Extract fitness-related keywords
     */
    static extractFitnessKeywords(message: string): string[] {
        const fitnessKeywords = [
            'workout', 'exercise', 'fitness', 'gym', 'training',
            'cardio', 'strength', 'muscle', 'weight', 'diet',
            'nutrition', 'calories', 'protein', 'running',
            'cycling', 'swimming', 'yoga', 'pilates',
            'bodybuilding', 'crossfit', 'hiit', 'stretching'
        ];

        const keywords: string[] = [];
        const lowerMessage = message.toLowerCase();

        fitnessKeywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) {
                keywords.push(keyword);
            }
        });

        return keywords;
    }

    /**
     * Calculate response metrics
     */
    static calculateMetrics(
        startTime: number,
        endTime: number,
        successful: boolean
    ): {
        responseTime: number;
        timestamp: Date;
        successful: boolean;
    } {
        return {
            responseTime: endTime - startTime,
            timestamp: new Date(),
            successful
        };
    }
}
