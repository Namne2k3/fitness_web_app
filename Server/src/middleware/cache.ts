// Server/src/middleware/cache.ts
import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../services/CacheService';

interface CacheOptions {
    ttl?: number;
    keyGenerator?: (req: Request) => string;
    condition?: (req: Request) => boolean;
}

/**
 * Cache middleware for API responses
 */
export const cacheMiddleware = (options: CacheOptions = {}) => {
    const {
        ttl = 3600,
        keyGenerator = (req) => `api:${req.method}:${req.originalUrl}`,
        condition = () => true
    } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        // Skip caching if condition not met
        if (!condition(req)) {
            return next();
        }

        // Skip caching for non-GET requests
        if (req.method !== 'GET' && req.method !== 'POST') {
            return next();
        }

        const cacheKey = keyGenerator(req);

        try {
            // Check cache
            const cached = await CacheService.getWithCache(
                cacheKey,
                async () => null, // Don't fetch, just check cache
                ttl
            );

            if (cached) {
                res.set('X-Cache', 'HIT');
                return res.json(cached);
            }

            // Cache miss - intercept response
            const originalJson = res.json;
            res.json = function (data: any) {
                // Cache successful responses
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    CacheService.warmUp(cacheKey, data, ttl).catch(console.error);
                }

                res.set('X-Cache', 'MISS');
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            console.error('❌ Cache middleware error:', error);
            next();
        }
    };
};

/**
 * Cache invalidation middleware
 */
export const invalidateCacheMiddleware = (patterns: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Store original end function
        const originalEnd = res.end;

        res.end = function (chunk?: any, encoding?: any) {
            // Invalidate cache after successful write operations
            if (res.statusCode >= 200 && res.statusCode < 300) {
                if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
                    patterns.forEach(pattern => {
                        CacheService.invalidate(pattern).catch(console.error);
                    });
                }
            }

            // Call original end function and return its result to match Express signature
            // @ts-ignore
            return originalEnd.call(this, chunk, encoding);
        } as typeof res.end;

        next();
    };
};