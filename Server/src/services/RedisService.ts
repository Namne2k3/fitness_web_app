import { redis } from '../config/redis';

export class RedisService {
    /**
     * Set key with optional TTL
     */
    static async set(
        key: string,
        value: any,
        ttl?: number
    ): Promise<void> {
        try {
            const serializedValue = JSON.stringify(value);

            if (ttl) {

                // tức là chỗ này có một option nếu user truyền ttl thì apply ttl
                await redis.setex(key, ttl, serializedValue);
            }
            // không thì sử dụng ttl mặc định trong config  
            else {
                await redis.set(key, serializedValue);
            }
        } catch (error) {
            console.error(`❌ Redis SET error for key ${key}:`, error);
            throw error;
        }
    }

    /**
     * Get key value
     */
    static async get<T = any>(key: string): Promise<T | null> {
        try {
            const value = await redis.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`❌ Redis GET error for key ${key}:`, error);
            return null;
        }
    }

    /**
     * Delete key
     */
    static async del(key: string): Promise<boolean> {
        try {
            const result = await redis.del(key);
            return result > 0;
        } catch (error) {
            console.error(`❌ Redis DEL error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Check if key exists
     */
    static async exists(key: string): Promise<boolean> {
        try {
            const result = await redis.exists(key);
            return result === 1;
        } catch (error) {
            console.error(`❌ Redis EXISTS error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Set TTL for existing key
     */
    static async expire(key: string, ttl: number): Promise<boolean> {
        try {
            const result = await redis.expire(key, ttl);
            return result === 1;
        } catch (error) {
            console.error(`❌ Redis EXPIRE error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Get TTL for key
     */
    static async ttl(key: string): Promise<number> {
        try {
            return await redis.ttl(key);
        } catch (error) {
            console.error(`❌ Redis TTL error for key ${key}:`, error);
            return -1;
        }
    }

    /**
     * Increment counter
     */
    static async incr(key: string, amount: number = 1): Promise<number> {
        try {
            if (amount === 1) {
                return await redis.incr(key);
            } else {
                return await redis.incrby(key, amount);
            }
        } catch (error) {
            console.error(`❌ Redis INCR error for key ${key}:`, error);
            throw error;
        }
    }

    /**
     * Get multiple keys
     */
    static async mget<T = any>(keys: string[]): Promise<(T | null)[]> {
        try {
            const values = await redis.mget(...keys);
            return values.map(value => value ? JSON.parse(value) : null);
        } catch (error) {
            console.error(`❌ Redis MGET error:`, error);
            return keys.map(() => null);
        }
    }

    /**
     * Set multiple keys
     */
    static async mset(keyValuePairs: Record<string, any>): Promise<void> {
        try {
            const serializedPairs: string[] = [];

            Object.entries(keyValuePairs).forEach(([key, value]) => {
                serializedPairs.push(key, JSON.stringify(value));
            });

            await redis.mset(...serializedPairs);
        } catch (error) {
            console.error(`❌ Redis MSET error:`, error);
            throw error;
        }
    }

    /**
     * Get keys by pattern
     */
    static async keys(pattern: string): Promise<string[]> {
        try {
            return await redis.keys(pattern);
        } catch (error) {
            console.error(`❌ Redis KEYS error for pattern ${pattern}:`, error);
            return [];
        }
    }

    /**
     * Flush database (use with caution!)
     */
    static async flushdb(): Promise<void> {
        try {
            await redis.flushdb();
            console.log('⚠️ Redis database flushed');
        } catch (error) {
            console.error(`❌ Redis FLUSHDB error:`, error);
            throw error;
        }
    }
}