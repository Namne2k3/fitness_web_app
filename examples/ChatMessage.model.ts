/**
 * 💬 Chat Message Model
 * MongoDB schema for storing chat messages
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage extends Document {
    threadId: mongoose.Types.ObjectId;
    openaiMessageId: string;
    role: 'user' | 'assistant';
    content: string;
    userId: mongoose.Types.ObjectId;
    attachments: Array<{
        name: string;
        url: string;
        type: string;
        size: number;
    }>;
    metadata: {
        tokens?: number;
        model?: string;
        processingTime?: number;
        citations?: Array<{
            fileId: string;
            fileName: string;
            pageNumber?: number;
        }>;
    };
    isEdited: boolean;
    editedAt?: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
    threadId: {
        type: Schema.Types.ObjectId,
        ref: 'ChatThread',
        required: true,
        index: true
    },
    openaiMessageId: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 10000
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    attachments: [{
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        }
    }],
    metadata: {
        tokens: Number,
        model: String,
        processingTime: Number,
        citations: [{
            fileId: String,
            fileName: String,
            pageNumber: Number
        }]
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: Date
}, {
    timestamps: true
});

// Indexes for performance
ChatMessageSchema.index({ threadId: 1, createdAt: -1 });
ChatMessageSchema.index({ userId: 1, role: 1, createdAt: -1 });
ChatMessageSchema.index({ openaiMessageId: 1 });

// Virtual for thread relationship
ChatMessageSchema.virtual('thread', {
    ref: 'ChatThread',
    localField: 'threadId',
    foreignField: '_id',
    justOne: true
});

// Method to mark as edited
ChatMessageSchema.methods.markAsEdited = function() {
    this.isEdited = true;
    this.editedAt = new Date();
    return this.save();
};

export const ChatMessageModel = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
