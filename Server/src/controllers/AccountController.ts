import { AccountService } from '../services/AccountService';
import { RequestWithUser, ApiResponse } from "@/types";
import { Request, Response, NextFunction } from 'express';

export class AccountController {
    /**
        * Get user stats
        * @route GET /api/v1/account/stats
    */
    static async getAccountStats(
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

            const stats = await AccountService.getUserStats(req.user._id);

            res.status(200).json({
                success: true,
                data: stats,
                message: 'User stats retrieved successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}