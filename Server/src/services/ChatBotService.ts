/**
 * 🤖 ChatBot Service
 * Service để tương tác với external ChatBot API (Python Gemini server)
 * 
 * Theo ChatBot API Usage Guide:
 * - Chỉ là proxy đến external Python API
 * - Không truy cập database TrackMe
 * - Input: { message, user_id?, conversation_id? }
 * - Output: { reply, conversation_id?, timestamp }
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ChatRequest, ChatResponse, ChatErrorResponse, ChatHealthResponse } from '../types/chatbot.types';

export class ChatBotService {
    private static readonly API_URL = process.env.CHATBOT_API_URL || 'http://localhost:8000';
    private static readonly API_TIMEOUT = parseInt(process.env.CHATBOT_API_TIMEOUT || '30000');
    private static readonly MAX_RETRIES = parseInt(process.env.CHATBOT_MAX_RETRIES || '3');
    private static readonly API_TOKEN = process.env.CHATBOT_API_TOKEN;

    private static apiClient: AxiosInstance = axios.create({
        baseURL: this.API_URL,
        timeout: this.API_TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(this.API_TOKEN && { 'x-auth-token': this.API_TOKEN })
        }
    });

    /**
     * Gửi message đến external ChatBot API
     * @param request - ChatRequest theo API spec
     * @returns ChatResponse từ external API
     */
    static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
        try {
            console.log(`🤖 Sending message to ChatBot API: ${this.API_URL}/api/chat`);
            console.log(`📝 Message length: ${request.message.length} chars`);

            // Gửi request đến external Python API theo đúng format
            const response = await this.apiClient.post<ChatResponse>('http://0.0.0.0:8000/api/chat', {
                message: request.message,
                user_id: request.user_id,
                conversation_id: request.conversation_id
            });

            console.log(`✅ ChatBot API response received`);
            console.log(`💬 Reply length: ${response.data.reply.length} chars`);

            return response.data;

        } catch (error) {
            console.error('❌ ChatBot API Error:', error);

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ChatErrorResponse>;

                // External API trả về error response
                if (axiosError.response?.data) {
                    const errorData = axiosError.response.data;
                    throw new Error(`ChatBot API Error: ${errorData.message || errorData.error}`);
                }

                // Network/timeout errors
                if (axiosError.code === 'ECONNREFUSED') {
                    throw new Error('ChatBot API is not available');
                }

                if (axiosError.code === 'ECONNABORTED') {
                    throw new Error('ChatBot API request timeout');
                }

                throw new Error(`ChatBot API Error: ${axiosError.message}`);
            }

            // Generic error
            throw new Error('Failed to communicate with ChatBot API');
        }
    }

    /**
     * Kiểm tra trạng thái health của ChatBot API
     * @returns ChatHealthResponse
     */
    static async checkHealth(): Promise<ChatHealthResponse> {
        try {
            console.log(`🏥 Checking ChatBot API health: ${this.API_URL}/api/health`);

            const response = await this.apiClient.get<ChatHealthResponse>('/api/health');

            console.log(`✅ ChatBot API is healthy`);
            return response.data;

        } catch (error) {
            console.error('❌ ChatBot Health Check Failed:', error);

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;

                if (axiosError.code === 'ECONNREFUSED') {
                    throw new Error('ChatBot API is not available');
                }

                if (axiosError.code === 'ECONNABORTED') {
                    throw new Error('ChatBot API health check timeout');
                }
            }

            throw new Error('ChatBot API health check failed');
        }
    }

    /**
     * Retry logic cho ChatBot API calls
     * @param request - ChatRequest
     * @param retryCount - số lần retry hiện tại
     * @returns ChatResponse
     */
    static async sendMessageWithRetry(request: ChatRequest, retryCount: number = 0): Promise<ChatResponse> {
        try {
            return await this.sendMessage(request);
        } catch (error) {
            console.error(`❌ ChatBot API attempt ${retryCount + 1} failed:`, error);

            if (retryCount < this.MAX_RETRIES) {
                const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
                console.log(`🔄 Retrying in ${delay}ms... (attempt ${retryCount + 2}/${this.MAX_RETRIES + 1})`);

                await new Promise(resolve => setTimeout(resolve, delay));
                return this.sendMessageWithRetry(request, retryCount + 1);
            }

            // Max retries exceeded
            throw error;
        }
    }

    /**
     * Validate ChatBot API configuration
     */
    static validateConfig(): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!this.API_URL) {
            errors.push('CHATBOT_API_URL is not configured');
        }

        if (!this.API_URL.startsWith('http')) {
            errors.push('CHATBOT_API_URL must be a valid HTTP/HTTPS URL');
        }

        if (this.API_TIMEOUT <= 0) {
            errors.push('CHATBOT_API_TIMEOUT must be a positive number');
        }

        if (this.MAX_RETRIES < 0) {
            errors.push('CHATBOT_MAX_RETRIES must be non-negative');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}
