/**
 * 🤖 ChatBot Routes
 * API endpoints theo ChatBot API Usage Guide
 * 
 * Endpoints:
 * - POST /api/chat - Gửi message đến ChatBot
 * - GET /api/health - Kiểm tra trạng thái ChatBot API
 */

import { Router } from 'express';
import { ChatBotController } from '../controllers/ChatBotController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route POST /api/chat
 * @desc Gửi message đến ChatBot API
 * @access Private
 * @body { message: string, conversation_id?: string }
 * @response { reply: string, conversation_id?: string, timestamp: string }
 */
router.post('/chat',
    authenticate,
    ChatBotController.sendMessage
);

/**
 * @route GET /api/health
 * @desc Kiểm tra trạng thái health của ChatBot API
 * @access Public
 * @response { status: "healthy", gemini_api: "connected", timestamp: string }
 */
router.get('/health',
    ChatBotController.getHealthStatus
);

export default router;
