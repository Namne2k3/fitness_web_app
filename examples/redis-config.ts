/**
 * 🔧 Redis Configuration
 * Complete Redis setup for MERN Fitness App
 */

import Redis from 'ioredis';
import { RedisOptions } from 'ioredis';

/**
 * Redis Configuration Interface
 */
interface RedisConfig extends RedisOptions {
    host: string;
    port: number;
    password?: string;
    db: number;
    keyPrefix: string;
}

/**
 * Base Redis Configuration
 */
const baseRedisConfig: RedisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'fitness-app:',
    
    // Connection settings
    connectTimeout: 10000,
    commandTimeout: 5000,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    keepAlive: 30000,
    family: 4, // IPv4
    
    // Reconnection settings
    retryDelayOnClusterDown: 300,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    
    // Performance settings
    enableReadyCheck: true,
    maxLoadingTimeout: 5000,
};

/**
 * Main Redis Client for general caching
 */
export const redis = new Redis({
    ...baseRedisConfig,
    db: 0,
    keyPrefix: 'cache:',
});

/**
 * Redis Client for Session Management
 */
export const sessionRedis = new Redis({
    ...baseRedisConfig,
    db: 1,
    keyPrefix: 'session:',
});

/**
 * Redis Client for Rate Limiting
 */
export const rateLimitRedis = new Redis({
    ...baseRedisConfig,
    db: 2,
    keyPrefix: 'rate-limit:',
});

/**
 * Redis Client for Pub/Sub
 */
export const pubSubRedis = new Redis({
    ...baseRedisConfig,
    db: 3,
    keyPrefix: 'pubsub:',
});

/**
 * Redis Client for Background Jobs
 */
export const queueRedis = new Redis({
    ...baseRedisConfig,
    db: 4,
    keyPrefix: 'queue:',
});

/**
 * Connection Event Handlers
 */
const setupEventHandlers = (client: Redis, name: string) => {
    client.on('connect', () => {
        console.log(`✅ ${name} Redis connected`);
    });

    client.on('ready', () => {
        console.log(`🚀 ${name} Redis ready`);
    });

    client.on('error', (error) => {
        console.error(`❌ ${name} Redis error:`, error);
    });

    client.on('close', () => {
        console.warn(`⚠️ ${name} Redis connection closed`);
    });

    client.on('reconnecting', (ms) => {
        console.log(`🔄 ${name} Redis reconnecting in ${ms}ms`);
    });

    client.on('end', () => {
        console.log(`🔚 ${name} Redis connection ended`);
    });
};

// Setup event handlers for all clients
setupEventHandlers(redis, 'Main');
setupEventHandlers(sessionRedis, 'Session');
setupEventHandlers(rateLimitRedis, 'RateLimit');
setupEventHandlers(pubSubRedis, 'PubSub');
setupEventHandlers(queueRedis, 'Queue');

/**
 * Validate Redis Connection
 */
export const validateRedisConnection = async (): Promise<boolean> => {
    try {
        const results = await Promise.all([
            redis.ping(),
            sessionRedis.ping(),
            rateLimitRedis.ping(),
            pubSubRedis.ping(),
            queueRedis.ping()
        ]);

        const allConnected = results.every(result => result === 'PONG');
        
        if (allConnected) {
            console.log('✅ All Redis connections validated');
            return true;
        } else {
            console.error('❌ Some Redis connections failed');
            return false;
        }
    } catch (error) {
        console.error('❌ Redis validation failed:', error);
        return false;
    }
};

/**
 * Get Redis Information
 */
export const getRedisInfo = async () => {
    try {
        const [info, memory, stats, clients] = await Promise.all([
            redis.info('server'),
            redis.info('memory'),
            redis.info('stats'),
            redis.info('clients')
        ]);

        return {
            server: parseRedisInfo(info),
            memory: parseRedisInfo(memory),
            stats: parseRedisInfo(stats),
            clients: parseRedisInfo(clients),
            databases: {
                cache: await redis.dbsize(),
                session: await sessionRedis.dbsize(),
                rateLimit: await rateLimitRedis.dbsize(),
                pubsub: await pubSubRedis.dbsize(),
                queue: await queueRedis.dbsize()
            }
        };
    } catch (error) {
        console.error('❌ Failed to get Redis info:', error);
        return null;
    }
};

/**
 * Parse Redis INFO command output
 */
const parseRedisInfo = (info: string): Record<string, string> => {
    const result: Record<string, string> = {};
    
    info.split('\r\n').forEach(line => {
        if (line && !line.startsWith('#')) {
            const [key, value] = line.split(':');
            if (key && value) {
                result[key] = value;
            }
        }
    });
    
    return result;
};

/**
 * Graceful Redis Shutdown
 */
export const disconnectRedis = async (): Promise<void> => {
    try {
        console.log('🔄 Disconnecting Redis clients...');
        
        await Promise.all([
            redis.disconnect(),
            sessionRedis.disconnect(),
            rateLimitRedis.disconnect(),
            pubSubRedis.disconnect(),
            queueRedis.disconnect()
        ]);
        
        console.log('🔒 All Redis connections closed gracefully');
    } catch (error) {
        console.error('❌ Error disconnecting Redis:', error);
    }
};

/**
 * Redis Health Check
 */
export const redisHealthCheck = async () => {
    const start = Date.now();
    
    try {
        await redis.ping();
        const latency = Date.now() - start;
        
        const info = await getRedisInfo();
        
        return {
            status: 'healthy',
            latency: `${latency}ms`,
            info,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
};

// Graceful shutdown handlers
process.on('SIGINT', async () => {
    console.log('📡 Received SIGINT, shutting down Redis connections...');
    await disconnectRedis();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('📡 Received SIGTERM, shutting down Redis connections...');
    await disconnectRedis();
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
    console.error('💥 Uncaught Exception:', error);
    await disconnectRedis();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    await disconnectRedis();
    process.exit(1);
});

export default {
    redis,
    sessionRedis,
    rateLimitRedis,
    pubSubRedis,
    queueRedis,
    validateRedisConnection,
    getRedisInfo,
    disconnectRedis,
    redisHealthCheck
};
