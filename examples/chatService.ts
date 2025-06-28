/**
 * 💬 Frontend Chat Service
 * Service for handling chat operations from React components
 */

import api from './api';

export interface ChatResponse {
    id: string;
    content: string;
    timestamp: string;
}

export interface FileUploadResponse {
    fileId: string;
    vectorStoreId?: string;
    url?: string;
}

export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    attachments?: Array<{
        name: string;
        url: string;
        type: string;
    }>;
}

class ChatService {
    private baseUrl = '/ai';

    /**
     * Create new chat thread
     */
    async createThread(): Promise<string> {
        try {
            const response = await api.post(`${this.baseUrl}/chat/thread`);
            return response.data.data.threadId;
        } catch (error) {
            console.error('Failed to create thread:', error);
            throw new Error('Failed to create chat thread');
        }
    }

    /**
     * Send message to AI
     */
    async sendMessage(threadId: string, message: string): Promise<ChatResponse> {
        try {
            const response = await api.post(`${this.baseUrl}/chat/message`, {
                threadId,
                message
            });
            
            return response.data.data;
        } catch (error) {
            console.error('Failed to send message:', error);
            throw new Error('Failed to send message');
        }
    }

    /**
     * Get chat messages with pagination
     */
    async getMessages(
        threadId: string,
        page: number = 1,
        limit: number = 20
    ): Promise<{
        messages: Message[];
        total: number;
        pages: number;
    }> {
        try {
            const response = await api.get(`${this.baseUrl}/chat/messages/${threadId}`, {
                params: { page, limit }
            });
            
            return response.data.data;
        } catch (error) {
            console.error('Failed to get messages:', error);
            throw new Error('Failed to load messages');
        }
    }

    /**
     * Upload file for AI training
     */
    async uploadFile(
        file: File,
        metadata?: {
            description?: string;
            tags?: string[];
            category?: string;
        }
    ): Promise<FileUploadResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            if (metadata?.description) {
                formData.append('description', metadata.description);
            }
            
            if (metadata?.tags) {
                formData.append('tags', metadata.tags.join(','));
            }
            
            if (metadata?.category) {
                formData.append('category', metadata.category);
            }

            const response = await api.post(`${this.baseUrl}/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            return response.data.data;
        } catch (error) {
            console.error('Failed to upload file:', error);
            throw new Error('Failed to upload file');
        }
    }

    /**
     * Get user's uploaded files
     */
    async getUserFiles(
        page: number = 1,
        limit: number = 10
    ): Promise<{
        files: any[];
        total: number;
        pages: number;
    }> {
        try {
            const response = await api.get(`${this.baseUrl}/files`, {
                params: { page, limit }
            });
            
            return response.data.data;
        } catch (error) {
            console.error('Failed to get files:', error);
            throw new Error('Failed to load files');
        }
    }

    /**
     * Delete uploaded file
     */
    async deleteFile(fileId: string): Promise<void> {
        try {
            await api.delete(`${this.baseUrl}/files/${fileId}`);
        } catch (error) {
            console.error('Failed to delete file:', error);
            throw new Error('Failed to delete file');
        }
    }

    /**
     * Get available assistants
     */
    async getAssistants(): Promise<any[]> {
        try {
            const response = await api.get(`${this.baseUrl}/assistants`);
            return response.data.data;
        } catch (error) {
            console.error('Failed to get assistants:', error);
            throw new Error('Failed to load assistants');
        }
    }

    /**
     * Create new assistant
     */
    async createAssistant(assistantData: {
        name: string;
        instructions: string;
        model?: string;
        tools?: Array<any>;
        vectorStoreIds?: string[];
        temperature?: number;
        metadata?: any;
    }): Promise<any> {
        try {
            const response = await api.post(`${this.baseUrl}/assistants`, assistantData);
            return response.data.data;
        } catch (error) {
            console.error('Failed to create assistant:', error);
            throw new Error('Failed to create assistant');
        }
    }

    /**
     * Update assistant
     */
    async updateAssistant(
        assistantId: string,
        updates: Partial<{
            name: string;
            instructions: string;
            tools: Array<any>;
            vectorStoreIds: string[];
            temperature: number;
        }>
    ): Promise<any> {
        try {
            const response = await api.put(`${this.baseUrl}/assistants/${assistantId}`, updates);
            return response.data.data;
        } catch (error) {
            console.error('Failed to update assistant:', error);
            throw new Error('Failed to update assistant');
        }
    }

    /**
     * Get vector stores
     */
    async getVectorStores(
        page: number = 1,
        limit: number = 10
    ): Promise<{
        vectorStores: any[];
        total: number;
        pages: number;
    }> {
        try {
            const response = await api.get(`${this.baseUrl}/vector-stores`, {
                params: { page, limit }
            });
            
            return response.data.data;
        } catch (error) {
            console.error('Failed to get vector stores:', error);
            throw new Error('Failed to load vector stores');
        }
    }

    /**
     * Create new vector store
     */
    async createVectorStore(data: {
        name: string;
        description?: string;
        metadata?: any;
    }): Promise<any> {
        try {
            const response = await api.post(`${this.baseUrl}/vector-stores`, data);
            return response.data.data;
        } catch (error) {
            console.error('Failed to create vector store:', error);
            throw new Error('Failed to create vector store');
        }
    }
}

export const chatService = new ChatService();
