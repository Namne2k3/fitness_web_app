/**
 * 📤 Response Helper Utility
 * Centralized response handling để tái sử dụng và consistency
 */

import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * Response Helper Class với các phương thức có sẵn
 */
export class ResponseHelper {
    /**
     * ✅ Success Response (200)
     * @param res Express Response object
     * @param data Data to return
     * @param message Success message
     */
    static success<T = any>(
        res: Response<ApiResponse<T>>,
        data: T,
        message: string = 'Operation successful'
    ): void {
        res.status(200).json({
            success: true,
            data,
            message
        });
    }

    /**
     * ✅ Created Response (201)
     * @param res Express Response object
     * @param data Created resource data
     * @param message Success message
     */
    static created<T = any>(
        res: Response<ApiResponse<T>>,
        data: T,
        message: string = 'Resource created successfully'
    ): void {
        res.status(201).json({
            success: true,
            data,
            message
        });
    }

    /**
     * ✅ No Content Response (204)
     * @param res Express Response object
     */
    static noContent(res: Response): void {
        res.status(204).send();
    }

    /**
     * ❌ Bad Request Error (400)
     * @param res Express Response object
     * @param error Error message
     */
    static badRequest(
        res: Response<ApiResponse>,
        error: string = 'Bad request'
    ): void {
        res.status(400).json({
            success: false,
            error,
            data: null
        });
    }

    /**
     * 🔐 Unauthorized Error (401)
     * @param res Express Response object
     * @param error Error message
     */
    static unauthorized(
        res: Response<ApiResponse>,
        error: string = 'Unauthorized access'
    ): void {
        res.status(401).json({
            success: false,
            error,
            data: null
        });
    }

    /**
     * 🚫 Forbidden Error (403)
     * @param res Express Response object
     * @param error Error message
     */
    static forbidden(
        res: Response<ApiResponse>,
        error: string = 'Forbidden access'
    ): void {
        res.status(403).json({
            success: false,
            error,
            data: null
        });
    }

    /**
     * 🔍 Not Found Error (404)
     * @param res Express Response object
     * @param error Error message
     */
    static notFound(
        res: Response<ApiResponse>,
        error: string = 'Resource not found'
    ): void {
        res.status(404).json({
            success: false,
            error,
            data: null
        });
    }

    /**
     * ⚡ Conflict Error (409)
     * @param res Express Response object
     * @param error Error message
     */
    static conflict(
        res: Response<ApiResponse>,
        error: string = 'Resource conflict'
    ): void {
        res.status(409).json({
            success: false,
            error,
            data: null
        });
    }

    /**
     * 📝 Validation Error (422)
     * @param res Express Response object
     * @param error Error message hoặc validation errors object
     */
    static validationError(
        res: Response<ApiResponse>,
        error: string | Record<string, string> = 'Validation failed'
    ): void {
        res.status(422).json({
            success: false,
            error: typeof error === 'string' ? error : 'Validation failed',
            data: null,
            ...(typeof error === 'object' && { errors: error })
        });
    }

    /**
     * 🚨 Internal Server Error (500)
     * @param res Express Response object
     * @param error Error message
     */
    static internalError(
        res: Response<ApiResponse>,
        error: string = 'Internal server error'
    ): void {
        res.status(500).json({
            success: false,
            error,
            data: null
        });
    }

    /**
     * 🔧 Custom Status Response
     * @param res Express Response object
     * @param statusCode HTTP status code
     * @param success Success flag
     * @param data Response data
     * @param messageOrError Message for success, error for failure
     */
    static custom<T = any>(
        res: Response<ApiResponse<T | null>>,
        statusCode: number,
        success: boolean,
        data: T | null,
        messageOrError: string
    ): void {
        if (success) {
            res.status(statusCode).json({
                success: true,
                data,
                message: messageOrError
            });
        } else {
            res.status(statusCode).json({
                success: false,
                error: messageOrError,
                data: null
            });
        }
    }

    /**
     * 📊 Paginated Response
     * @param res Express Response object
     * @param data Array of items
     * @param pagination Pagination info
     * @param message Success message
     */
    static paginated<T = any>(
        res: Response<ApiResponse<{
            items: T[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        }>>,
        data: T[],
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        },
        message: string = 'Data retrieved successfully'
    ): void {
        res.status(200).json({
            success: true,
            data: {
                items: data,
                pagination: {
                    ...pagination,
                    hasNext: pagination.page < pagination.totalPages,
                    hasPrev: pagination.page > 1
                }
            },
            message
        });
    }
}

/**
 * 🔧 Additional Helper Functions
 */

/**
 * Check if email already exists helper
 */
export const checkEmailExists = (res: Response<ApiResponse>, exists: boolean): void => {
    if (exists) {
        ResponseHelper.conflict(res, 'Email already exists');
        return;
    }
    ResponseHelper.success(res, { available: true }, 'Email is available');
};

/**
 * Check if username already exists helper
 */
export const checkUsernameExists = (res: Response<ApiResponse>, exists: boolean): void => {
    if (exists) {
        ResponseHelper.conflict(res, 'Username already exists');
        return;
    }
    ResponseHelper.success(res, { available: true }, 'Username is available');
};

/**
 * Authentication required helper
 */
export const requireAuth = (res: Response<ApiResponse>, user: any): boolean => {
    if (!user) {
        ResponseHelper.unauthorized(res, 'User not authenticated');
        return false;
    }
    return true;
};

/**
 * Validation helper cho common validations
 */
export const validateRequired = (res: Response<ApiResponse>, fields: Record<string, any>): boolean => {
    const missingFields: string[] = [];

    Object.entries(fields).forEach(([key, value]) => {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            missingFields.push(key);
        }
    });

    if (missingFields.length > 0) {
        ResponseHelper.badRequest(res, `Missing required fields: ${missingFields.join(', ')}`);
        return false;
    }

    return true;
};
