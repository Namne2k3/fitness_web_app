/**
 * 🔧 Redis Middleware Collection
 * Express middleware for caching, rate limiting, and session management
 */

import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../services/CacheService';
import { rateLimitRedis } from '../config/redis';

/**
 * Cache Middleware Options
 */
interface CacheMiddlewareOptions {
    ttl?: number;
    keyGenerator?: (req: Request) => string;
    condition?: (req: Request) => boolean;
    skipMethods?: string[];
    skipStatusCodes?: number[];
}

/**
 * Rate Limit Middleware Options
 */
interface RateLimitOptions {
    windowMs: number;
    max: number;
    keyGenerator?: (req: Request) => string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    onLimitReached?: (req: Request, res: Response) => void;
}

/**
 * Cache Middleware for API responses
 */
export const cacheMiddleware = (options: CacheMiddlewareOptions = {}) => {
    const {
        ttl = 3600,
        keyGenerator = (req) => `api:${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`,
        condition = () => true,
        skipMethods = ['POST', 'PUT', 'PATCH', 'DELETE'],
        skipStatusCodes = [400, 401, 403, 404, 500]
    } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        // Skip if condition not met
        if (!condition(req)) {
            return next();
        }

        // Skip for certain HTTP methods
        if (skipMethods.includes(req.method)) {
            return next();
        }

        const cacheKey = keyGenerator(req);

        try {
            // Check cache for GET requests
            if (req.method === 'GET') {
                const cached = await CacheService.get(cacheKey);
                
                if (cached) {
                    res.set({
                        'X-Cache': 'HIT',
                        'X-Cache-Key': cacheKey,
                        'Content-Type': 'application/json'
                    });
                    return res.json(cached);
                }
            }

            // Intercept response to cache it
            const originalJson = res.json;
            const originalSend = res.send;

            res.json = function(data: any) {
                // Cache successful responses
                if (!skipStatusCodes.includes(res.statusCode)) {
                    CacheService.set(cacheKey, data, { ttl }).catch(console.error);
                }
                
                res.set({
                    'X-Cache': 'MISS',
                    'X-Cache-Key': cacheKey
                });
                
                return originalJson.call(this, data);
            };

            res.send = function(data: any) {
                // Try to parse and cache JSON responses
                if (res.get('Content-Type')?.includes('application/json')) {
                    try {
                        const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
                        if (!skipStatusCodes.includes(res.statusCode)) {
                            CacheService.set(cacheKey, jsonData, { ttl }).catch(console.error);
                        }
                    } catch (e) {
                        // Not JSON, skip caching
                    }
                }
                
                res.set({
                    'X-Cache': 'MISS',
                    'X-Cache-Key': cacheKey
                });
                
                return originalSend.call(this, data);
            };

            next();
        } catch (error) {
            console.error('❌ Cache middleware error:', error);
            next();
        }
    };
};

/**
 * Cache Invalidation Middleware
 */
export const invalidateCacheMiddleware = (patterns: string[] | ((req: Request) => string[])) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const originalEnd = res.end;

        res.end = function(chunk?: any, encoding?: any) {
            // Invalidate cache after successful write operations
            if (res.statusCode >= 200 && res.statusCode < 300) {
                if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
                    const invalidationPatterns = typeof patterns === 'function' ? patterns(req) : patterns;
                    
                    invalidationPatterns.forEach(pattern => {
                        CacheService.invalidatePattern(pattern).catch(console.error);
                    });
                }
            }

            originalEnd.call(this, chunk, encoding);
        };

        next();
    };
};

/**
 * Advanced Rate Limiting Middleware with Redis
 */
export const rateLimitMiddleware = (options: RateLimitOptions) => {
    const {
        windowMs,
        max,
        keyGenerator = (req) => `rate-limit:${req.ip}`,
        skipSuccessfulRequests = false,
        skipFailedRequests = false,
        onLimitReached
    } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        const key = keyGenerator(req);
        const windowSeconds = Math.ceil(windowMs / 1000);

        try {
            // Get current count
            const current = await rateLimitRedis.get(key);
            const count = current ? parseInt(current) : 0;

            // Check if limit exceeded
            if (count >= max) {
                res.set({
                    'X-RateLimit-Limit': max.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': new Date(Date.now() + windowMs).toISOString(),
                    'Retry-After': windowSeconds.toString()
                });

                if (onLimitReached) {
                    onLimitReached(req, res);
                }

                return res.status(429).json({
                    success: false,
                    error: 'Too many requests, please try again later.',
                    data: null
                });
            }

            // Increment counter
            const pipeline = rateLimitRedis.pipeline();
            pipeline.incr(key);
            pipeline.expire(key, windowSeconds);
            await pipeline.exec();

            const newCount = count + 1;
            const remaining = Math.max(0, max - newCount);

            // Set rate limit headers
            res.set({
                'X-RateLimit-Limit': max.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': new Date(Date.now() + windowMs).toISOString()
            });

            // Track requests after response
            const originalEnd = res.end;
            res.end = function(chunk?: any, encoding?: any) {
                const shouldSkip = 
                    (skipSuccessfulRequests && res.statusCode < 400) ||
                    (skipFailedRequests && res.statusCode >= 400);

                if (shouldSkip) {
                    // Decrement counter if we should skip this request
                    rateLimitRedis.decr(key).catch(console.error);
                }

                originalEnd.call(this, chunk, encoding);
            };

            next();
        } catch (error) {
            console.error('❌ Rate limit middleware error:', error);
            // Continue without rate limiting if Redis fails
            next();
        }
    };
};

/**
 * User-specific Rate Limiting
 */
export const userRateLimitMiddleware = (options: Omit<RateLimitOptions, 'keyGenerator'>) => {
    return rateLimitMiddleware({
        ...options,
        keyGenerator: (req: any) => {
            const userId = req.user?.id || req.user?._id;
            return userId ? `rate-limit:user:${userId}` : `rate-limit:ip:${req.ip}`;
        }
    });
};

/**
 * API Endpoint Rate Limiting
 */
export const endpointRateLimitMiddleware = (options: Omit<RateLimitOptions, 'keyGenerator'>) => {
    return rateLimitMiddleware({
        ...options,
        keyGenerator: (req) => `rate-limit:endpoint:${req.route?.path || req.path}:${req.ip}`
    });
};

/**
 * Session Activity Middleware
 */
export const sessionActivityMiddleware = () => {
    return async (req: any, res: Response, next: NextFunction) => {
        if (req.session && req.sessionID) {
            try {
                // Update session activity timestamp
                const sessionKey = `session:activity:${req.sessionID}`;
                await rateLimitRedis.setex(sessionKey, 1800, Date.now().toString()); // 30 minutes
                
                // Update user activity if authenticated
                if (req.user) {
                    const userActivityKey = `user:activity:${req.user.id || req.user._id}`;
                    await rateLimitRedis.setex(userActivityKey, 3600, Date.now().toString()); // 1 hour
                }
            } catch (error) {
                console.error('❌ Session activity middleware error:', error);
            }
        }
        
        next();
    };
};

/**
 * Cache Warming Middleware
 */
export const cacheWarmingMiddleware = (warmupFunctions: Array<() => Promise<void>>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Warm up cache in background for first request
        if (req.headers['x-cache-warmup'] === 'true') {
            Promise.all(warmupFunctions.map(fn => fn().catch(console.error)))
                .then(() => console.log('🔥 Cache warmed up'))
                .catch(error => console.error('❌ Cache warmup failed:', error));
        }
        
        next();
    };
};

/**
 * Response Time Tracking Middleware
 */
export const responseTimeMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();
        
        res.on('finish', async () => {
            const duration = Date.now() - start;
            const key = `response-time:${req.method}:${req.route?.path || req.path}`;
            
            try {
                // Store response time for analytics
                await rateLimitRedis.lpush(key, duration.toString());
                await rateLimitRedis.ltrim(key, 0, 99); // Keep last 100 measurements
                await rateLimitRedis.expire(key, 3600); // 1 hour TTL
            } catch (error) {
                console.error('❌ Response time tracking error:', error);
            }
        });
        
        next();
    };
};

/**
 * Health Check Middleware
 */
export const healthCheckMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.path === '/health' || req.path === '/health/redis') {
            try {
                const start = Date.now();
                await rateLimitRedis.ping();
                const latency = Date.now() - start;
                
                const info = await rateLimitRedis.info('memory');
                const memoryMatch = info.match(/used_memory_human:(.+)/);
                const memoryUsage = memoryMatch ? memoryMatch[1].trim() : 'Unknown';
                
                return res.json({
                    success: true,
                    data: {
                        redis: {
                            status: 'healthy',
                            latency: `${latency}ms`,
                            memoryUsage
                        },
                        timestamp: new Date().toISOString()
                    }
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Redis health check failed',
                    data: null
                });
            }
        }
        
        next();
    };
};

export default {
    cacheMiddleware,
    invalidateCacheMiddleware,
    rateLimitMiddleware,
    userRateLimitMiddleware,
    endpointRateLimitMiddleware,
    sessionActivityMiddleware,
    cacheWarmingMiddleware,
    responseTimeMiddleware,
    healthCheckMiddleware
};
