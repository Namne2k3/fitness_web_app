/**
 * ⚠️ Error Handling Middleware
 * Centralized error handling cho toàn bộ application
 */

import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

/**
 * Custom Application Error class
 */
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Specific error classes
 */
export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden access') {
        super(message, 403);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource conflict') {
        super(message, 409);
    }
}

/**
 * Handle MongoDB CastError
 */
const handleCastError = (error: any): AppError => {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new ValidationError(message);
};

/**
 * Handle MongoDB Duplicate Key Error
 */
const handleDuplicateKeyError = (error: any): AppError => {
    const field = Object.keys(error.keyValue)[0] as string;
    const value = error.keyValue[field];
    const message = `${field} '${value}' already exists`;
    return new ConflictError(message);
};

/**
 * Handle MongoDB Validation Error
 */
const handleValidationError = (error: any): AppError => {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new ValidationError(message);
};

/**
 * Handle JWT Error
 */
const handleJWTError = (): AppError => {
    return new UnauthorizedError('Invalid token. Please log in again.');
};

/**
 * Handle JWT Expired Error
 */
const handleJWTExpiredError = (): AppError => {
    return new UnauthorizedError('Your token has expired. Please log in again.');
};

/**
 * Send error response cho development
 */
const sendErrorDev = (err: AppError, res: Response<ApiResponse>): void => {
    res.status(err.statusCode).json({
        success: false,
        error: err.message,
        data: null,
        // stack: err.stack
    });
};

/**
 * Send error response cho production
 */
const sendErrorProd = (err: AppError, res: Response<ApiResponse>): void => {
    // Operational errors - safe to send to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
            data: null
        });
    } else {
        // Programming errors - don't leak error details
        console.error('💥 ERROR:', err);

        res.status(500).json({
            success: false,
            error: 'Something went wrong!',
            data: null
        });
    }
};

/**
 * Global error handling middleware
 */
export const errorHandler = (
    error: any,
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
): void => {
    let err = { ...error };
    err.message = error.message;

    // Log error
    console.error('🚨 Error occurred:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });

    // MongoDB Cast Error
    if (error.name === 'CastError') {
        err = handleCastError(error);
    }

    // MongoDB Duplicate Key Error
    if (error.code === 11000) {
        err = handleDuplicateKeyError(error);
    }

    // MongoDB Validation Error
    if (error.name === 'ValidationError') {
        err = handleValidationError(error);
    }

    // JWT Error
    if (error.name === 'JsonWebTokenError') {
        err = handleJWTError();
    }

    // JWT Expired Error
    if (error.name === 'TokenExpiredError') {
        err = handleJWTExpiredError();
    }

    // Set default values if not set
    if (!err.statusCode) {
        err.statusCode = 500;
    }

    if (!err.isOperational) {
        err.isOperational = false;
    }

    // Send error response
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        sendErrorProd(err, res);
    }
};

/**
 * Handle 404 errors cho unmatched routes
 */
export const notFoundHandler = (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
): void => {
    const error = new NotFoundError(`Route ${req.originalUrl} not found`);
    next(error);
};

/**
 * Async error wrapper để catch errors trong async route handlers
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
