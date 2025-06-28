/**
 * 🗂️ Vector Store Service
 * Service for managing OpenAI Vector Stores
 */

import { openai } from '../config/openai';
import { VectorStoreModel, IVectorStore } from '../models/VectorStore';

export class VectorStoreService {
    /**
     * Create new Vector Store
     */
    static async createVectorStore(data: {
        name: string;
        description?: string;
        createdBy: string;
        metadata?: any;
    }): Promise<IVectorStore> {
        try {
            // Create Vector Store in OpenAI
            const openaiVectorStore = await openai.beta.vectorStores.create({
                name: data.name,
                metadata: data.metadata || {}
            });

            // Save to database
            const vectorStore = new VectorStoreModel({
                name: data.name,
                openaiVectorStoreId: openaiVectorStore.id,
                description: data.description,
                createdBy: data.createdBy,
                status: 'active',
                fileCount: 0,
                metadata: data.metadata || {}
            });

            await vectorStore.save();

            console.log(`✅ Vector Store "${data.name}" created successfully`);
            return vectorStore;

        } catch (error) {
            console.error('❌ Failed to create vector store:', error);
            throw new Error('Failed to create vector store');
        }
    }

    /**
     * Get default vector store for fitness content
     */
    static async getDefaultVectorStore(): Promise<IVectorStore | null> {
        return await VectorStoreModel.findOne({
            status: 'active',
            'metadata.isDefault': true
        }).sort({ createdAt: -1 });
    }

    /**
     * Add file to Vector Store
     */
    static async addFileToVectorStore(
        vectorStoreId: string,
        fileId: string
    ): Promise<void> {
        try {
            const vectorStore = await VectorStoreModel.findOne({
                openaiVectorStoreId: vectorStoreId
            });

            if (!vectorStore) {
                throw new Error('Vector Store not found');
            }

            // Add file to OpenAI Vector Store
            await openai.beta.vectorStores.files.create(vectorStoreId, {
                file_id: fileId
            });

            // Update file count
            vectorStore.fileCount += 1;
            await vectorStore.save();

            console.log(`✅ File added to Vector Store "${vectorStore.name}"`);

        } catch (error) {
            console.error('❌ Failed to add file to vector store:', error);
            throw error;
        }
    }

    /**
     * Remove file from Vector Store
     */
    static async removeFileFromVectorStore(
        vectorStoreId: string,
        fileId: string
    ): Promise<void> {
        try {
            const vectorStore = await VectorStoreModel.findOne({
                openaiVectorStoreId: vectorStoreId
            });

            if (!vectorStore) {
                throw new Error('Vector Store not found');
            }

            // Remove file from OpenAI Vector Store
            await openai.beta.vectorStores.files.del(vectorStoreId, fileId);

            // Update file count
            vectorStore.fileCount = Math.max(0, vectorStore.fileCount - 1);
            await vectorStore.save();

            console.log(`✅ File removed from Vector Store "${vectorStore.name}"`);

        } catch (error) {
            console.error('❌ Failed to remove file from vector store:', error);
            throw error;
        }
    }

    /**
     * Get Vector Store files
     */
    static async getVectorStoreFiles(
        vectorStoreId: string,
        page: number = 1,
        limit: number = 20
    ): Promise<{
        files: any[];
        total: number;
        pages: number;
    }> {
        try {
            const vectorStore = await VectorStoreModel.findOne({
                openaiVectorStoreId: vectorStoreId
            });

            if (!vectorStore) {
                throw new Error('Vector Store not found');
            }

            // Get files from OpenAI
            const response = await openai.beta.vectorStores.files.list(vectorStoreId, {
                limit: limit,
                after: page > 1 ? `file_${(page - 1) * limit}` : undefined
            });

            return {
                files: response.data,
                total: vectorStore.fileCount,
                pages: Math.ceil(vectorStore.fileCount / limit)
            };

        } catch (error) {
            console.error('❌ Failed to get vector store files:', error);
            throw error;
        }
    }

    /**
     * Search in Vector Store
     */
    static async searchVectorStore(
        vectorStoreId: string,
        query: string,
        limit: number = 5
    ): Promise<any[]> {
        try {
            // This would typically be done through the Assistant API
            // when running a query with file_search tool enabled
            
            console.log(`🔍 Searching Vector Store for: "${query}"`);
            
            // For now, return empty array as search is handled by Assistant
            return [];

        } catch (error) {
            console.error('❌ Failed to search vector store:', error);
            throw error;
        }
    }

    /**
     * Create default fitness vector store
     */
    static async createDefaultFitnessVectorStore(createdBy: string): Promise<IVectorStore> {
        return await this.createVectorStore({
            name: 'Fitness Knowledge Base',
            description: 'Default vector store for fitness-related documents and knowledge',
            createdBy,
            metadata: {
                isDefault: true,
                category: 'fitness',
                version: '1.0'
            }
        });
    }

    /**
     * Get user's vector stores
     */
    static async getUserVectorStores(
        userId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{
        vectorStores: IVectorStore[];
        total: number;
        pages: number;
    }> {
        const skip = (page - 1) * limit;
        
        const [vectorStores, total] = await Promise.all([
            VectorStoreModel.find({ createdBy: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('createdBy', 'name email'),
            VectorStoreModel.countDocuments({ createdBy: userId })
        ]);

        return {
            vectorStores,
            total,
            pages: Math.ceil(total / limit)
        };
    }

    /**
     * Delete Vector Store
     */
    static async deleteVectorStore(
        vectorStoreId: string,
        userId: string
    ): Promise<void> {
        try {
            const vectorStore = await VectorStoreModel.findOne({
                _id: vectorStoreId,
                createdBy: userId
            });

            if (!vectorStore) {
                throw new Error('Vector Store not found or unauthorized');
            }

            // Delete from OpenAI
            await openai.beta.vectorStores.del(vectorStore.openaiVectorStoreId);

            // Delete from database
            await VectorStoreModel.findByIdAndDelete(vectorStoreId);

            console.log(`✅ Vector Store "${vectorStore.name}" deleted successfully`);

        } catch (error) {
            console.error('❌ Failed to delete vector store:', error);
            throw error;
        }
    }
}
