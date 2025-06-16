import { AccountService } from '../services/AccountService';
import { RequestWithUser, ApiResponse } from "@/types";
import { Request, Response, NextFunction } from 'express';
import { ResponseHelper, requireAuth } from '../utils/responseHelper';

export class AccountController {
    /**
        * Get user profile
        * @route GET /api/v1/account/profile
    */
    static async getAccountProfile(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // ✅ Sử dụng helper function
            if (!requireAuth(res, req.user)) return;

            // TypeScript assertion - req.user guaranteed to exist after requireAuth
            const stats = await AccountService.getUserProfile(req.user!._id);

            // ✅ Sử dụng ResponseHelper thay vì manual res.status
            ResponseHelper.success(res, stats, 'User stats retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}