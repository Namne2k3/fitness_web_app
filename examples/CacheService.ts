/**
 * 🗄️ Cache Service
 * Comprehensive caching service for MERN Fitness App
 */

import { redis } from '../config/redis';

export interface CacheOptions {
    ttl?: number;
    prefix?: string;
    serialize?: boolean;
    compress?: boolean;
}

export interface CacheStats {
    hits: number;
    misses: number;
    hitRatio: number;
    totalKeys: number;
    memoryUsage: string;
}

export class CacheService {
    private static readonly DEFAULT_TTL = 3600; // 1 hour
    private static readonly DEFAULT_PREFIX = 'cache:';
    private static readonly STATS_KEY = 'cache:stats';

    /**
     * Set cache value with options
     */
    static async set(
        key: string,
        value: any,
        options: CacheOptions = {}
    ): Promise<void> {
        try {
            const {
                ttl = this.DEFAULT_TTL,
                prefix = this.DEFAULT_PREFIX,
                serialize = true
            } = options;

            const cacheKey = `${prefix}${key}`;
            const cacheValue = serialize ? JSON.stringify(value) : value;

            if (ttl > 0) {
                await redis.setex(cacheKey, ttl, cacheValue);
            } else {
                await redis.set(cacheKey, cacheValue);
            }

            console.log(`📦 Cache SET: ${cacheKey} (TTL: ${ttl}s)`);
        } catch (error) {
            console.error(`❌ Cache SET error for key ${key}:`, error);
            throw error;
        }
    }

    /**
     * Get cache value
     */
    static async get<T = any>(
        key: string,
        options: CacheOptions = {}
    ): Promise<T | null> {
        try {
            const {
                prefix = this.DEFAULT_PREFIX,
                serialize = true
            } = options;

            const cacheKey = `${prefix}${key}`;
            const value = await redis.get(cacheKey);

            if (value === null) {
                await this.recordCacheMiss();
                console.log(`❌ Cache MISS: ${cacheKey}`);
                return null;
            }

            await this.recordCacheHit();
            console.log(`🎯 Cache HIT: ${cacheKey}`);

            return serialize ? JSON.parse(value) : value;
        } catch (error) {
            console.error(`❌ Cache GET error for key ${key}:`, error);
            await this.recordCacheMiss();
            return null;
        }
    }

    /**
     * Cache-aside pattern implementation
     */
    static async getWithFallback<T>(
        key: string,
        fetchFunction: () => Promise<T>,
        options: CacheOptions = {}
    ): Promise<T> {
        try {
            // Try to get from cache first
            const cached = await this.get<T>(key, options);
            if (cached !== null) {
                return cached;
            }

            // Cache miss - fetch from source
            console.log(`🔄 Cache MISS - Fetching data for key: ${key}`);
            const data = await fetchFunction();

            // Store in cache for next time
            await this.set(key, data, options);

            return data;
        } catch (error) {
            console.error(`❌ Cache fallback error for key ${key}:`, error);
            // If cache fails, still try to fetch from source
            return await fetchFunction();
        }
    }

    /**
     * Delete cache key
     */
    static async del(
        key: string,
        options: CacheOptions = {}
    ): Promise<boolean> {
        try {
            const { prefix = this.DEFAULT_PREFIX } = options;
            const cacheKey = `${prefix}${key}`;
            
            const result = await redis.del(cacheKey);
            
            if (result > 0) {
                console.log(`🗑️ Cache DEL: ${cacheKey}`);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error(`❌ Cache DEL error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Check if key exists in cache
     */
    static async exists(
        key: string,
        options: CacheOptions = {}
    ): Promise<boolean> {
        try {
            const { prefix = this.DEFAULT_PREFIX } = options;
            const cacheKey = `${prefix}${key}`;
            
            const result = await redis.exists(cacheKey);
            return result === 1;
        } catch (error) {
            console.error(`❌ Cache EXISTS error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Set expiration for existing key
     */
    static async expire(
        key: string,
        ttl: number,
        options: CacheOptions = {}
    ): Promise<boolean> {
        try {
            const { prefix = this.DEFAULT_PREFIX } = options;
            const cacheKey = `${prefix}${key}`;
            
            const result = await redis.expire(cacheKey, ttl);
            return result === 1;
        } catch (error) {
            console.error(`❌ Cache EXPIRE error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Get TTL for key
     */
    static async ttl(
        key: string,
        options: CacheOptions = {}
    ): Promise<number> {
        try {
            const { prefix = this.DEFAULT_PREFIX } = options;
            const cacheKey = `${prefix}${key}`;
            
            return await redis.ttl(cacheKey);
        } catch (error) {
            console.error(`❌ Cache TTL error for key ${key}:`, error);
            return -1;
        }
    }

    /**
     * Invalidate cache by pattern
     */
    static async invalidatePattern(
        pattern: string,
        options: CacheOptions = {}
    ): Promise<number> {
        try {
            const { prefix = this.DEFAULT_PREFIX } = options;
            const searchPattern = `${prefix}${pattern}`;
            
            const keys = await redis.keys(searchPattern);
            
            if (keys.length === 0) {
                return 0;
            }

            const result = await redis.del(...keys);
            console.log(`🗑️ Cache invalidated ${result} keys matching: ${searchPattern}`);
            
            return result;
        } catch (error) {
            console.error(`❌ Cache invalidation error for pattern ${pattern}:`, error);
            return 0;
        }
    }

    /**
     * Get multiple keys at once
     */
    static async mget<T = any>(
        keys: string[],
        options: CacheOptions = {}
    ): Promise<(T | null)[]> {
        try {
            const { prefix = this.DEFAULT_PREFIX, serialize = true } = options;
            const cacheKeys = keys.map(key => `${prefix}${key}`);
            
            const values = await redis.mget(...cacheKeys);
            
            return values.map(value => {
                if (value === null) {
                    return null;
                }
                return serialize ? JSON.parse(value) : value;
            });
        } catch (error) {
            console.error(`❌ Cache MGET error:`, error);
            return keys.map(() => null);
        }
    }

    /**
     * Set multiple keys at once
     */
    static async mset(
        keyValuePairs: Record<string, any>,
        options: CacheOptions = {}
    ): Promise<void> {
        try {
            const {
                ttl = this.DEFAULT_TTL,
                prefix = this.DEFAULT_PREFIX,
                serialize = true
            } = options;

            const pipeline = redis.pipeline();
            
            Object.entries(keyValuePairs).forEach(([key, value]) => {
                const cacheKey = `${prefix}${key}`;
                const cacheValue = serialize ? JSON.stringify(value) : value;
                
                if (ttl > 0) {
                    pipeline.setex(cacheKey, ttl, cacheValue);
                } else {
                    pipeline.set(cacheKey, cacheValue);
                }
            });
            
            await pipeline.exec();
            console.log(`📦 Cache MSET: ${Object.keys(keyValuePairs).length} keys`);
        } catch (error) {
            console.error(`❌ Cache MSET error:`, error);
            throw error;
        }
    }

    /**
     * Increment counter
     */
    static async incr(
        key: string,
        amount: number = 1,
        options: CacheOptions = {}
    ): Promise<number> {
        try {
            const { prefix = this.DEFAULT_PREFIX } = options;
            const cacheKey = `${prefix}${key}`;
            
            if (amount === 1) {
                return await redis.incr(cacheKey);
            } else {
                return await redis.incrby(cacheKey, amount);
            }
        } catch (error) {
            console.error(`❌ Cache INCR error for key ${key}:`, error);
            throw error;
        }
    }

    /**
     * Record cache hit for statistics
     */
    private static async recordCacheHit(): Promise<void> {
        try {
            await redis.hincrby(this.STATS_KEY, 'hits', 1);
        } catch (error) {
            // Ignore stats errors
        }
    }

    /**
     * Record cache miss for statistics
     */
    private static async recordCacheMiss(): Promise<void> {
        try {
            await redis.hincrby(this.STATS_KEY, 'misses', 1);
        } catch (error) {
            // Ignore stats errors
        }
    }

    /**
     * Get cache statistics
     */
    static async getStats(): Promise<CacheStats> {
        try {
            const stats = await redis.hmget(this.STATS_KEY, 'hits', 'misses');
            const hits = parseInt(stats[0] || '0');
            const misses = parseInt(stats[1] || '0');
            const total = hits + misses;
            const hitRatio = total > 0 ? (hits / total) * 100 : 0;

            const info = await redis.info('memory');
            const memoryMatch = info.match(/used_memory_human:(.+)/);
            const memoryUsage = memoryMatch ? memoryMatch[1].trim() : 'Unknown';

            const totalKeys = await redis.dbsize();

            return {
                hits,
                misses,
                hitRatio: Math.round(hitRatio * 100) / 100,
                totalKeys,
                memoryUsage
            };
        } catch (error) {
            console.error('❌ Failed to get cache stats:', error);
            return {
                hits: 0,
                misses: 0,
                hitRatio: 0,
                totalKeys: 0,
                memoryUsage: 'Unknown'
            };
        }
    }

    /**
     * Clear all cache statistics
     */
    static async clearStats(): Promise<void> {
        try {
            await redis.del(this.STATS_KEY);
            console.log('📊 Cache statistics cleared');
        } catch (error) {
            console.error('❌ Failed to clear cache stats:', error);
        }
    }

    /**
     * Flush all cache data (use with caution!)
     */
    static async flush(): Promise<void> {
        try {
            await redis.flushdb();
            console.log('⚠️ Cache flushed - all data cleared');
        } catch (error) {
            console.error('❌ Failed to flush cache:', error);
            throw error;
        }
    }
}
