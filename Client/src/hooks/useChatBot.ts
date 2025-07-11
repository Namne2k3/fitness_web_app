/**
 * 🤖 useChatBot Hook (React Query version)
 * Đơn giản hóa: chỉ sử dụng React Query cho chat messaging
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ChatMessage } from '../types/chatbot.interface';
import { ChatBotService } from '../services/chatBotService';

// ================================
// 💬 Chat History State
// ================================
export function useChatHistory() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            content: 'Chào mừng bạn đến với AI Fitness Assistant! 🏋️‍♂️ Tôi sẵn sàng giúp bạn với mọi câu hỏi về tập luyện và sức khỏe.',
            role: 'assistant',
            timestamp: new Date(),
        }
    ]);

    const addMessage = (message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
    };

    const updateMessage = (messageId: string, updates: Partial<ChatMessage>) => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, ...updates } : msg
        ));
    };

    const clearMessages = () => {
        setMessages([{
            id: 'welcome',
            content: 'Chào mừng bạn đến với AI Fitness Assistant! 🏋️‍♂️ Tôi sẵn sàng giúp bạn với mọi câu hỏi về tập luyện và sức khỏe.',
            role: 'assistant',
            timestamp: new Date(),
        }]);
        ChatBotService.clearChatHistory();
    };

    return {
        messages,
        addMessage,
        updateMessage,
        clearMessages
    };
}

// ================================
// 📤 Send Message Mutation
// ================================
export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ content, messages }: {
            content: string;
            messages: ChatMessage[];
        }) => {
            console.log(messages);
            // Generate contextual response
            const responseChunks = ChatBotService.generateContextualResponse(content);
            const fullResponse = responseChunks.join('');

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                content: fullResponse,
                chunks: responseChunks
            };
        },
        onSuccess: (data, variables) => {
            // Save to local storage
            ChatBotService.saveChatToStorage(variables.messages);

            // Optionally invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
        },
        onError: (error) => {
            console.error('Chat error:', error);
        }
    });
}

// ================================
// 🤖 Main ChatBot Hook
// ================================
export function useChatBot() {
    const { messages, addMessage, updateMessage, clearMessages } = useChatHistory();
    const sendMessageMutation = useSendMessage();

    const sendMessage = async (content: string) => {
        if (!content.trim() || sendMessageMutation.isPending) return;

        // Add user message immediately
        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            content: content.trim(),
            role: 'user',
            timestamp: new Date(),
        };
        addMessage(userMessage);

        // Create bot message placeholder
        const botMessageId = `bot-${Date.now()}`;
        const botMessage: ChatMessage = {
            id: botMessageId,
            content: '',
            role: 'assistant',
            timestamp: new Date(),
            isStreaming: true,
        };
        addMessage(botMessage);

        try {
            // Send message via mutation
            const result = await sendMessageMutation.mutateAsync({
                content: content.trim(),
                messages: [...messages, userMessage]
            });

            // Simulate streaming by updating content gradually
            let accumulatedContent = '';
            for (const chunk of result.chunks) {
                await new Promise(resolve => setTimeout(resolve, 100));
                accumulatedContent += chunk;
                updateMessage(botMessageId, { content: accumulatedContent });
            }

            // Mark streaming as complete
            updateMessage(botMessageId, {
                content: result.content,
                isStreaming: false
            });

        } catch (error) {
            // Update bot message with error
            console.error('Error sending message:', error);
            updateMessage(botMessageId, {
                content: 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.',
                isStreaming: false
            });
        }
    };

    return {
        messages,
        isLoading: sendMessageMutation.isPending,
        error: sendMessageMutation.error?.message || null,
        sendMessage,
        clearChat: clearMessages,
        retryLastMessage: () => {
            // Simple retry - just clear error state
            sendMessageMutation.reset();
        }
    };
}
