// Server/src/services/CacheService.ts

import { RedisService } from "./RedisService";


export class CacheService {
    private static readonly DEFAULT_TTL = 900; // 15 minutes

    /**
     * Get data with cache-aside pattern
     */
    static async getWithCache<T>(
        key: string,
        fetchFunction: () => Promise<T>,
        ttl: number = this.DEFAULT_TTL
    ): Promise<T> {
        try {
            // 1. Try to get from cache
            const cached = await RedisService.get<T>(key);
            if (cached !== null) {
                console.log(`🎯 Cache HIT for key: ${key}`);
                return cached;
            }

            // 2. Cache miss - fetch from source
            console.log(`❌ Cache MISS for key: ${key}`);
            const data = await fetchFunction();

            // 3. Store in cache for next time
            await RedisService.set(key, data, ttl);

            return data;
        } catch (error) {
            console.error(`❌ Cache error for key ${key}:`, error);
            // Fallback to direct fetch if cache fails
            return await fetchFunction();
        }
    }

    /**
     * Invalidate cache by key or pattern
     */
    static async invalidate(keyOrPattern: string): Promise<void> {
        try {
            if (keyOrPattern.includes('*')) {
                // Pattern-based invalidation
                const keys = await RedisService.keys(keyOrPattern);
                if (keys.length > 0) {
                    await Promise.all(keys.map(key => RedisService.del(key)));
                    console.log(`🗑️ Invalidated ${keys.length} keys matching: ${keyOrPattern}`);
                }
            } else {
                // Single key invalidation
                await RedisService.del(keyOrPattern);
                console.log(`🗑️ Invalidated cache key: ${keyOrPattern}`);
            }
        } catch (error) {
            console.error(`❌ Cache invalidation error:`, error);
        }
    }

    /**
     * Warm up cache with data
     */
    static async warmUp<T>(
        key: string,
        data: T,
        ttl: number = this.DEFAULT_TTL
    ): Promise<void> {
        try {
            await RedisService.set(key, data, ttl);
            console.log(`🔥 Cache warmed up for key: ${key}`);
        } catch (error) {
            console.error(`❌ Cache warm-up error for key ${key}:`, error);
        }
    }
}