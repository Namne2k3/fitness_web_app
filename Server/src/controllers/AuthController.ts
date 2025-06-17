/**
 * 🔐 Authentication Controller
 * HTTP request handlers cho authentication endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService, RegisterRequest, LoginRequest, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../services/AuthService';
import { ApiResponse, RequestWithUser } from '../types';
import { AuthMapper } from '../mappers/authMapper';
import { ResponseHelper, requireAuth, checkEmailExists, checkUsernameExists } from '../utils/responseHelper';

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

            // ✅ Sử dụng ResponseHelper
            ResponseHelper.created(res, safeResponse, 'User registered successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Đăng nhập user
     * @route POST /api/v1/auth/login
     */    static async login(
        req: Request<{}, ApiResponse, LoginRequest>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // const { email, password, rememberMe } = req.body;
            const result = await AuthService.login(req.body);

            // 🔹 Transform data với AuthMapper để loại bỏ sensitive info
            const safeResponse = AuthMapper.toLoginResponse(result);

            // ✅ Sử dụng ResponseHelper
            ResponseHelper.success(res, safeResponse, 'Đăng nhập thành công');
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
            // ✅ Sử dụng helper function  
            if (!requireAuth(res, req.user)) return;

            // TypeScript assertion - req.user guaranteed to exist after requireAuth
            const user = await AuthService.getUserById(req.user!._id);

            if (!user) {
                ResponseHelper.notFound(res, 'User not found');
                return;
            }

            // 🔹 Transform user data để loại bỏ sensitive info
            const safeResponse = AuthMapper.toCurrentUserResponse(user);

            ResponseHelper.success(res, safeResponse, 'User profile retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cập nhật profile user
     * @route PUT /api/v1/auth/profile
     */    static async updateProfile(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!requireAuth(res, req.user)) return;

            const updatedUser = await AuthService.updateProfile(req.user!._id, req.body);

            ResponseHelper.success(res, { user: updatedUser }, 'Profile updated successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Đổi mật khẩu
     * @route PUT /api/v1/auth/change-password
     */    static async changePassword(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!requireAuth(res, req.user)) return;

            await AuthService.changePassword(req.user!._id, req.body);

            ResponseHelper.success(res, null, 'Password changed successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Kiểm tra email có tồn tại không
     * @route POST /api/v1/auth/check-email
     */    static async checkEmail(
        req: Request<{}, ApiResponse, { email: string }>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email } = req.body;
            const exists = await AuthService.checkEmailExists(email);

            // ✅ Sử dụng helper function  
            checkEmailExists(res, exists);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Kiểm tra username có tồn tại không
     * @route POST /api/v1/auth/check-username
     */    static async checkUsername(
        req: Request<{}, ApiResponse, { username: string }>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { username } = req.body;
            const exists = await AuthService.checkUsernameExists(username);

            // ✅ Sử dụng helper function
            checkUsernameExists(res, exists);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Verify email với token
     * @route POST /api/v1/auth/verify-email
     */    static async verifyEmail(
        req: Request<{}, ApiResponse, { token: string }>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { token } = req.body;
            const user = await AuthService.verifyEmail(token);

            ResponseHelper.success(res, { user }, 'Email verified successfully');
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
     */    static async logout(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // In a more advanced setup, you might want to blacklist the token
            // For now, we'll just return a success message
            // The client should remove the token from storage

            ResponseHelper.success(res, null, 'Logged out successfully');
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

    /**
     * Refresh access token using refresh token
     * @route POST /api/v1/auth/refresh
     */    static async refreshToken(
        req: Request<{}, ApiResponse, { refreshToken: string }>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                ResponseHelper.badRequest(res, 'Refresh token is required');
                return;
            }

            const tokens = await AuthService.refreshToken(refreshToken);

            ResponseHelper.success(res, { tokens }, 'Token refreshed successfully');
        } catch (error) {
            ResponseHelper.unauthorized(res, error instanceof Error ? error.message : 'Invalid refresh token');
        }
    }

    /**
     * 📧 Forgot Password - Gửi email reset password
     * @route POST /api/v1/auth/forgot-password
     */
    static async forgotPassword(
        req: Request<{}, ApiResponse, ForgotPasswordRequest>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await AuthService.forgotPassword(req.body);

            res.status(200).json({
                success: true,
                data: result,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 🔒 Reset Password - Đặt lại mật khẩu với token
     * @route POST /api/v1/auth/reset-password
     */
    static async resetPassword(
        req: Request<{}, ApiResponse, ResetPasswordRequest>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await AuthService.resetPassword(req.body);

            res.status(200).json({
                success: true,
                data: result,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * 🔍 Validate Reset Password Token
     * @route GET /api/v1/auth/validate-reset-token/:token
     */
    static async validateResetToken(
        req: Request<{ token: string }>,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            const { token } = req.params;

            if (!token) {
                res.status(400).json({
                    success: false,
                    error: 'Token là bắt buộc',
                    data: null
                });
                return;
            }

            const result = await AuthService.validateResetToken(token);

            res.status(200).json({
                success: true,
                data: result,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}
