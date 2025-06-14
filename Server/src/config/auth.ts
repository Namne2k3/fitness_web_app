/**
 * 🔐 Authentication Configuration
 * JWT token generation and validation
 */

import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { JWTPayload, AuthTokens, UserRole } from '../types';

/**
 * JWT Configuration
 */
const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    expiresIn: process.env.JWT_EXPIRE || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
};

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
    return jwt.sign(payload, JWT_CONFIG.secret as Secret, {
        expiresIn: JWT_CONFIG.expiresIn
    } as SignOptions);
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_CONFIG.refreshSecret as Secret, {
        expiresIn: JWT_CONFIG.refreshExpiresIn
    } as SignOptions);
};

/**
 * Generate both access and refresh tokens
 */

// export const generateTokens = (
//     userId: string,
//     email: string,
//     role: UserRole = UserRole.USER
// ): AuthTokens => {
//     const accessToken = generateAccessToken({ userId, email, role });
//     const refreshToken = generateRefreshToken(userId);

//     // Extract expiration time from token
//     const decoded = jwt.decode(accessToken) as any;
//     const expiresIn = decoded.exp - decoded.iat;

//     return {
//         accessToken,
//         refreshToken,
//         expiresIn
//     };
// };

export const generateTokens = (
    userId: string,
    email: string,
    role: string,
    rememberMe = false
): AuthTokens => {
    const accessToken = jwt.sign(
        { userId, email, role },
        JWT_CONFIG.secret as string,
        { expiresIn: '15m' } // Access token luôn có thời hạn ngắn
    );

    const refreshToken = jwt.sign(
        { userId, email, tokenType: 'refresh' },
        JWT_CONFIG.refreshSecret as string,
        { expiresIn: rememberMe ? '30d' : '1d' } // Refresh token có thời hạn dài hơn nếu rememberMe=true
    );

    return { accessToken, refreshToken };
};

/**
 * Verify JWT access token
 */
export const verifyAccessToken = (token: string): JWTPayload => {
    try {
        return jwt.verify(token, JWT_CONFIG.secret) as JWTPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        throw new Error('Token verification failed');
    }
};

/**
 * Verify JWT refresh token
 */
export const verifyRefreshToken = (token: string): { userId: string } => {
    try {
        return jwt.verify(token, JWT_CONFIG.refreshSecret) as { userId: string };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Refresh token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid refresh token');
        }
        throw new Error('Refresh token verification failed');
    }
};

/**
 * Hash password với bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password với hashed password
 */
export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1] || null;
};

/**
 * Generate secure random token (cho password reset, email verification)
 */
export const generateSecureToken = (length: number = 32): string => {
    // ✅ Generate hex token (64 characters for 32 bytes)
    return crypto.randomBytes(length).toString('hex');
};
