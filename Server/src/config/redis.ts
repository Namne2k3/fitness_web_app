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
    Redis Configuration
*/

const baseRedisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    db: parseInt(process.env.REDIS_DB || '0'),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'fitness-app:',
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    keepAlive: 30000,
    family: 4, // IPv4
    connectTimeout: 10000,
    commandTimeout: 5000,
};

export const redisConfig = process.env.REDIS_PASSWORD
    ?
    {
        ...baseRedisConfig,
        password: process.env.REDIS_PASSWORD
    }
    :
    baseRedisConfig;

/**
    Main Redis Client
*/
export const redis = new Redis(redisConfig);

/**
 * Redis Client for Sessions
 */
export const sessionRedis = new Redis({
    ...redisConfig,
    db: parseInt(process.env.SESSION_REDIS_DB || '1'),
    keyPrefix: 'session:',
})

/**
 * Redis Client for Rate Limiting
 */
export const rateLimitRedis = new Redis({
    ...redisConfig,
    db: parseInt(process.env.RATE_LIMIT_REDIS_DB || '2'),
    keyPrefix: 'rate-limit:',
});

/**
 * Redis Client for Pub/Sub
 */
export const pubSubRedis = new Redis({
    ...redisConfig,
    db: parseInt(process.env.PUBSUB_REDIS_DB || '3'),
    keyPrefix: 'pubsub:',
});

/**
 * Connection Event Handlers
 */
redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

redis.on('ready', () => {
    console.log('🚀 Redis ready for operations');
});

redis.on('error', (error) => {
    console.error('❌ Redis connection error:', error);
});

redis.on('close', () => {
    console.warn('⚠️ Redis connection closed');
});

redis.on('reconnecting', () => {
    console.log('🔄 Redis reconnecting...');
});

/**
 * Validate Redis Connection
 */
export const validateRedisConnection = async (): Promise<boolean> => {
    try {
        const pong = await redis.ping();
        if (pong === 'PONG') {
            console.log('✅ Redis connection validated');
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Redis validation failed:', error);
        return false;
    }
};

/**
 * Get Redis Info
 */
export const getRedisInfo = async (): Promise<any> => {
    try {
        const info = await redis.info();
        const memory = await redis.info('memory');
        const stats = await redis.info('stats');

        return {
            server: info,
            memory,
            stats,
            connected: true
        };
    } catch (error: any) {
        console.error('❌ Failed to get Redis info:', error);
        return { connected: false, error: error.message };
    }
};

/**
 * Graceful Redis Shutdown
 */
export const disconnectRedis = async (): Promise<void> => {
    try {
        await Promise.all([
            redis.disconnect(),
            sessionRedis.disconnect(),
            rateLimitRedis.disconnect(),
            pubSubRedis.disconnect()
        ]);
        console.log('🔒 All Redis connections closed');
    } catch (error) {
        console.error('❌ Error disconnecting Redis:', error);
    }
};

// Graceful shutdown on process termination
process.on('SIGINT', async () => {
    await disconnectRedis();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await disconnectRedis();
    process.exit(0);
});