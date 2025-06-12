/**
 * 🔐 Authentication Controller
 * HTTP request handlers cho authentication endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService, RegisterRequest, LoginRequest, ChangePasswordRequest } from '../services/AuthService';
import { ApiResponse, RequestWithUser } from '../types';
import { AuthMapper } from '../mappers/authMapper';

/**
 * Authentication Controller Class
 */
export class AuthController {
    /**
     * Đăng ký user mới
     * @route POST /api/v1/auth/register
     */    static async register(
    req: Request<{}, ApiResponse, RegisterRequest>,
    res: Response<ApiResponse>,
    next: NextFunction
): Promise<void> {
        try {
            const result = await AuthService.register(req.body);

            // 🔹 Transform data với AuthMapper để loại bỏ sensitive info
            const safeResponse = AuthMapper.toRegisterResponse(result);

            res.status(201).json({
                success: true,
                data: safeResponse,
                message: 'User registered successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Đăng nhập user
     * @route POST /api/v1/auth/login
     */
    static async login(
        req: Request<{}, ApiResponse, LoginRequest>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await AuthService.login(req.body);

            // 🔹 Transform data với AuthMapper để loại bỏ sensitive info
            const safeResponse = AuthMapper.toLoginResponse(result);

            res.status(200).json({
                success: true,
                data: safeResponse,
                message: 'Login successful'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy thông tin user hiện tại
     * @route GET /api/v1/auth/me
     */    static async getMe(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                    data: null
                });
                return;
            }

            const user = await AuthService.getUserById(req.user._id);

            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                    data: null
                });
                return;
            }

            // 🔹 Transform user data để loại bỏ sensitive info
            const safeResponse = AuthMapper.toCurrentUserResponse(user);

            res.status(200).json({
                success: true,
                data: safeResponse,
                message: 'User profile retrieved successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cập nhật profile user
     * @route PUT /api/v1/auth/profile
     */
    static async updateProfile(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                    data: null
                });
                return;
            }

            const updatedUser = await AuthService.updateProfile(req.user._id, req.body);

            res.status(200).json({
                success: true,
                data: { user: updatedUser },
                message: 'Profile updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Đổi mật khẩu
     * @route PUT /api/v1/auth/change-password
     */
    static async changePassword(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                    data: null
                });
                return;
            }

            await AuthService.changePassword(req.user._id, req.body);

            res.status(200).json({
                success: true,
                data: null,
                message: 'Password changed successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Kiểm tra email có tồn tại không
     * @route POST /api/v1/auth/check-email
     */
    static async checkEmail(
        req: Request<{}, ApiResponse, { email: string }>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email } = req.body;
            const exists = await AuthService.checkEmailExists(email);

            res.status(200).json({
                success: true,
                data: { exists },
                message: exists ? 'Email already exists' : 'Email available'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Kiểm tra username có tồn tại không
     * @route POST /api/v1/auth/check-username
     */
    static async checkUsername(
        req: Request<{}, ApiResponse, { username: string }>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { username } = req.body;
            const exists = await AuthService.checkUsernameExists(username);

            res.status(200).json({
                success: true,
                data: { exists },
                message: exists ? 'Username already taken' : 'Username available'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Verify email với token
     * @route POST /api/v1/auth/verify-email
     */
    static async verifyEmail(
        req: Request<{}, ApiResponse, { token: string }>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { token } = req.body;
            const user = await AuthService.verifyEmail(token);

            res.status(200).json({
                success: true,
                data: { user },
                message: 'Email verified successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Gửi lại email verification
     * @route POST /api/v1/auth/resend-verification
     */
    static async resendVerification(
        req: Request<{}, ApiResponse, { email: string }>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email } = req.body;
            const token = await AuthService.resendEmailVerification(email);

            // In production, send email here instead of returning token
            res.status(200).json({
                success: true,
                data: {
                    message: 'Verification email sent',
                    // TODO: Remove token from response in production
                    ...(process.env.NODE_ENV === 'development' && { token })
                },
                message: 'Verification email sent successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Logout user (client-side token invalidation)
     * @route POST /api/v1/auth/logout
     */
    static async logout(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // In a more advanced setup, you might want to blacklist the token
            // For now, we'll just return a success message
            // The client should remove the token from storage

            res.status(200).json({
                success: true,
                data: null,
                message: 'Logged out successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Deactivate user account
     * @route DELETE /api/v1/auth/deactivate
     */
    static async deactivateAccount(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                    data: null
                });
                return;
            }

            await AuthService.deactivateAccount(req.user._id);

            res.status(200).json({
                success: true,
                data: null,
                message: 'Account deactivated successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get user stats
     * @route GET /api/v1/auth/stats
     */
    static async getUserStats(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                    data: null
                });
                return;
            }

            const stats = await AuthService.getUserStats(req.user._id);

            res.status(200).json({
                success: true,
                data: stats,
                message: 'User stats retrieved successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get health insights và recommendations
     * @route GET /api/v1/auth/health-insights
     */
    static async getHealthInsights(
        req: Request & { user?: any },
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                    data: null
                });
                return;
            }

            const insights = await AuthService.getHealthInsights(req.user._id);

            res.status(200).json({
                success: true,
                data: insights,
                message: 'Health insights retrieved successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}
