/**
 * 💬 Chat Thread Model
 * MongoDB schema for managing chat threads
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IChatThread extends Document {
    openaiThreadId: string;
    userId: mongoose.Types.ObjectId;
    title: string;
    isActive: boolean;
    lastMessageAt: Date;
    messageCount: number;
    metadata: {
        assistantId?: string;
        vectorStoreIds?: string[];
        tags?: string[];
    };
}

const ChatThreadSchema = new Schema<IChatThread>({
    openaiThreadId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    messageCount: {
        type: Number,
        default: 0,
        min: 0
    },
    metadata: {
        assistantId: String,
        vectorStoreIds: [String],
        tags: [String]
    }
}, {
    timestamps: true
});

// Indexes for performance
ChatThreadSchema.index({ userId: 1, isActive: 1, lastMessageAt: -1 });
ChatThreadSchema.index({ openaiThreadId: 1, userId: 1 });

// Virtual for message relationship
ChatThreadSchema.virtual('messages', {
    ref: 'ChatMessage',
    localField: '_id',
    foreignField: 'threadId'
});

// Update lastMessageAt when new message is added
ChatThreadSchema.methods.updateLastMessage = function() {
    this.lastMessageAt = new Date();
    this.messageCount += 1;
    return this.save();
};

export const ChatThreadModel = mongoose.model<IChatThread>('ChatThread', ChatThreadSchema);
