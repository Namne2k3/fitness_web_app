/**
 * 🤖 ChatBot Controller
 * HTTP request handlers cho ChatBot endpoints theo API Usage Guide
 * 
 * Endpoints:
 * - POST /api/chat - Gửi message đến ChatBot
 * - GET /api/health - Kiểm tra trạng thái ChatBot API
 */

import { Request, Response, NextFunction } from 'express';
import { ChatBotService } from '../services/ChatBotService';
import { ClientChatRequest, ChatRequest, ChatResponse } from '../types/chatbot.types';
import { ApiResponse, RequestWithUser } from '../types';
import { ResponseHelper, requireAuth } from '../utils/responseHelper';

/**
 * ChatBot Controller Class
 */
export class ChatBotController {
    /**
     * Gửi message đến ChatBot API
     * @route POST /api/chat
     */
    static async sendMessage(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Require authentication để có user_id
            if (!requireAuth(res, req.user)) return;

            const { message, conversation_id }: ClientChatRequest = req.body;

            // Validation
            if (!message || typeof message !== 'string' || message.trim().length === 0) {
                ResponseHelper.badRequest(res, 'Message is required and cannot be empty');
                return;
            }

            if (message.length > 2000) {
                ResponseHelper.badRequest(res, 'Message is too long (max 2000 characters)');
                return;
            }

            // Prepare request theo API spec
            const chatRequest: ChatRequest = {
                message: message.trim(),
                user_id: req.user!._id.toString(),
                conversation_id: conversation_id || undefined
            };

            const response = await ChatBotService.sendMessageWithRetry(chatRequest);

            console.log(`🤖 Processing ChatBot message for user: ${chatRequest.user_id}`);

            // Trả về response theo đúng API spec
            ResponseHelper.success(res, {
                reply: response.reply,
                conversation_id: response.conversation_id,
                timestamp: response.timestamp
            }, 'Message sent successfully');

        } catch (error) {
            console.error('❌ ChatBot Controller Error:', error);

            // Trả về error response theo API spec
            ResponseHelper.badRequest(res, 'Failed to process ChatBot request');
        }
    }

    /**
     * Kiểm tra trạng thái health của ChatBot API
     * @route GET /api/health
     */
    static async getHealthStatus(
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            console.log('🏥 Checking ChatBot API health...');

            // Kiểm tra config trước
            const configValidation = ChatBotService.validateConfig();
            if (!configValidation.valid) {
                ResponseHelper.badRequest(res, `ChatBot configuration invalid: ${configValidation.errors.join(', ')}`);
                return;
            }

            // Gọi health check API
            const healthResponse = await ChatBotService.checkHealth();

            // Trả về health response theo API spec
            ResponseHelper.success(res, {
                status: healthResponse.status,
                gemini_api: healthResponse.gemini_api,
                timestamp: healthResponse.timestamp
            }, 'ChatBot API is healthy');

        } catch (error) {
            console.error('❌ ChatBot Health Check Error:', error);

            // Trả về unhealthy status
            ResponseHelper.badRequest(res, 'ChatBot API is unhealthy');
        }
    }
}
