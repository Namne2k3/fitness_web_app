/**
 * 🗄️ Database Configuration
 * MongoDB connection with proper error handling and monitoring
 */

import mongoose from 'mongoose';
import { DatabaseConfig } from '../types';

/**
 * Database configuration với environment variables
 */
const createDatabaseConfig = (): DatabaseConfig => {
    const uri = process.env.NODE_ENV === 'test'
        ? process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/fitness-app-test'
        : process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-app';

    return {
        uri,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        }
    };
};

/**
 * Kết nối database với retry logic
 */
export const connectDatabase = async (): Promise<void> => {
    try {
        const config = createDatabaseConfig();

        console.log('🔄 Connecting to MongoDB...');

        await mongoose.connect(config.uri, config.options);

        console.log('✅ MongoDB connected successfully');
        console.log(`📍 Database: ${mongoose.connection.name}`);

        // Connection event handlers
        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔒 MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Database connection failed:', error);

        // Retry connection after 5 seconds
        setTimeout(connectDatabase, 5000);
    }
};

/**
 * Disconnect database (chủ yếu cho testing)
 */
export const disconnectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        console.log('🔒 Database disconnected');
    } catch (error) {
        console.error('❌ Error disconnecting database:', error);
    }
};

/**
 * Clear database (chỉ cho testing)
 */
export const clearDatabase = async (): Promise<void> => {
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('clearDatabase can only be used in test environment');
    }

    try {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection!.deleteMany({});
        }

        console.log('🧹 Test database cleared');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        throw error;
    }
};

/**
 * Check database health
 */
export const checkDatabaseHealth = (): boolean => {
    return mongoose.connection.readyState === 1;
};
