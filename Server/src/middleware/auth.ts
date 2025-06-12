/**
 * 🛡️ Authentication Middleware
 * JWT token validation and user authorization
 */

import { Request, Response, NextFunction } from 'express';

import { UserModel } from '../models/User';
import { verifyAccessToken, extractTokenFromHeader } from '../config/auth';
import { RequestWithUser, UserRole, ApiResponse } from '../types';

/**
 * Middleware to authenticate JWT token
 */
export const authenticate = async (
    req: RequestWithUser,
    res: Response<ApiResponse>,
    next: NextFunction
): Promise<void> => {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Access token required',
                data: null
            });
            return;
        }

        // Verify token
        const payload = verifyAccessToken(token);

        // Get user from database
        const user = await UserModel.findById(payload.userId).select('-password');

        if (!user) {
            res.status(401).json({
                success: false,
                error: 'User not found',
                data: null
            });
            return;
        }

        // Attach user to request
        req.user = user;
        next();

    } catch (error) {
        console.error('🔐 Authentication error:', error);

        res.status(401).json({
            success: false,
            error: error instanceof Error ? error.message : 'Authentication failed',
            data: null
        });
    }
};

/**
 * Middleware to authorize specific roles
 */
export const authorize = (...roles: UserRole[]) => {
    return (req: RequestWithUser, res: Response<ApiResponse>, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required',
                data: null
            });
            return;
        }

        // Check if user has required role
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: 'Insufficient permissions',
                data: null
            });
            return;
        }

        next();
    };
};

/**
 * Optional authentication - không throw error nếu token không có
 */
export const optionalAuth = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);

        if (token) {
            const payload = verifyAccessToken(token);
            const user = await UserModel.findById(payload.userId).select('-password');

            if (user) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Ignore errors for optional auth
        next();
    }
};
