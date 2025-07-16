/**
 * 🏃 Workout Session Controller
 * Handles workout session tracking, progress và real-time updates
 */

import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { ResponseHelper, requireAuth } from '../utils/responseHelper';
import { ApiResponse, RequestWithUser } from '../types';
import { WorkoutSessionService, CreateSessionInput, UpdateSessionInput } from '../services/WorkoutSessionService';

export class WorkoutSessionController {
    /**
     * Start a new workout session
     * @route POST /api/v1/workout-sessions/start
     */
    static async startSession(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check authentication
            if (!requireAuth(res, req.user)) return;

            const userId = req.user!._id.toString();
            const { workoutId } = req.body;

            // Validate workoutId
            if (!workoutId || !mongoose.Types.ObjectId.isValid(workoutId)) {
                return ResponseHelper.badRequest(res, 'Valid workout ID is required');
            }

            const sessionData: CreateSessionInput = {
                userId,
                workoutId
            };

            const session = await WorkoutSessionService.startSession(sessionData);

            ResponseHelper.success(res, session, 'Workout session started successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get current active session for user
     * @route GET /api/v1/workout-sessions/active
     */
    static async getActiveSession(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check authentication
            if (!requireAuth(res, req.user)) return;

            const userId = req.user!._id.toString();
            const session = await WorkoutSessionService.getActiveSession(userId);

            if (!session) {
                return ResponseHelper.notFound(res, 'No active workout session found');
            }

            ResponseHelper.success(res, session, 'Active session retrieved successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Update workout session progress
     * @route PUT /api/v1/workout-sessions/:id
     */
    static async updateSession(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check authentication
            if (!requireAuth(res, req.user)) return;

            const { id } = req.params;
            const userId = req.user!._id.toString();

            // Validate session ID
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return ResponseHelper.badRequest(res, 'Valid session ID is required');
            }

            const updateData: UpdateSessionInput = {
                ...req.body
            };

            const session = await WorkoutSessionService.updateSession(id, userId, updateData);

            ResponseHelper.success(res, session, 'Session updated successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Complete workout session
     * @route POST /api/v1/workout-sessions/:id/complete
     */
    static async completeSession(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check authentication
            if (!requireAuth(res, req.user)) return;

            const { id } = req.params;
            const userId = req.user!._id.toString();
            const { rating, notes, mood } = req.body;

            // Validate session ID
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return ResponseHelper.badRequest(res, 'Valid session ID is required');
            }

            // Chuẩn hóa completionData với type safety
            const completionData: { rating?: number; notes?: string; mood?: string } = {};

            if (rating !== undefined) {
                const ratingNum = Number(rating);
                if (!isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5) {
                    completionData.rating = ratingNum;
                }
            }

            if (notes && typeof notes === 'string') {
                completionData.notes = notes.trim();
            }

            if (mood && typeof mood === 'string') {
                const validMoods = ['great', 'good', 'okay', 'tired', 'poor'];
                if (validMoods.includes(mood)) {
                    completionData.mood = mood as 'great' | 'good' | 'okay' | 'tired' | 'poor';
                }
            }

            const session = await WorkoutSessionService.completeSession(id, userId, completionData);

            ResponseHelper.success(res, session, 'Workout session completed successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Pause workout session
     * @route POST /api/v1/workout-sessions/:id/pause
     */
    static async pauseSession(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check authentication
            if (!requireAuth(res, req.user)) return;

            const { id } = req.params;
            const userId = req.user!._id.toString();

            // Validate session ID
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return ResponseHelper.badRequest(res, 'Valid session ID is required');
            }

            const session = await WorkoutSessionService.pauseSession(id, userId);

            ResponseHelper.success(res, session, 'Workout session paused');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Resume workout session
     * @route POST /api/v1/workout-sessions/:id/resume
     */
    static async resumeSession(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check authentication
            if (!requireAuth(res, req.user)) return;

            const { id } = req.params;
            const userId = req.user!._id.toString();

            // Validate session ID
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return ResponseHelper.badRequest(res, 'Valid session ID is required');
            }

            const session = await WorkoutSessionService.resumeSession(id, userId);

            ResponseHelper.success(res, session, 'Workout session resumed');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Stop workout session (without completing)
     * @route POST /api/v1/workout-sessions/:id/stop
     */
    static async stopSession(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check authentication
            if (!requireAuth(res, req.user)) return;

            const { id } = req.params;
            const userId = req.user!._id.toString();

            // Validate session ID
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return ResponseHelper.badRequest(res, 'Valid session ID is required');
            }

            const session = await WorkoutSessionService.stopSession(id, userId);

            ResponseHelper.success(res, session, 'Workout session stopped');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get workout session by ID
     * @route GET /api/v1/workout-sessions/:id
     */
    static async getSessionById(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check authentication
            if (!requireAuth(res, req.user)) return;

            const { id } = req.params;
            const userId = req.user!._id.toString();

            // Validate session ID
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return ResponseHelper.badRequest(res, 'Valid session ID is required');
            }

            const session = await WorkoutSessionService.getSessionById(id, userId);

            if (!session) {
                return ResponseHelper.notFound(res, 'Workout session not found');
            }

            ResponseHelper.success(res, session, 'Session retrieved successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get user's workout session history
     * @route GET /api/v1/workout-sessions/history
     */
    static async getSessionHistory(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check authentication
            if (!requireAuth(res, req.user)) return;

            const userId = req.user!._id.toString();

            // Parse query parameters
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string;

            const filters: any = { userId };
            if (status && ['completed', 'stopped'].includes(status)) {
                filters.status = status;
            }

            const result = await WorkoutSessionService.getSessionHistory(filters, page, limit);

            ResponseHelper.success(res, result, 'Session history retrieved successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Update exercise progress in session
     * @route POST /api/v1/workout-sessions/:id/exercise/:exerciseIndex/complete
     */
    static async updateExerciseProgress(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check authentication
            if (!requireAuth(res, req.user)) return;

            const { id, exerciseIndex } = req.params;
            const userId = req.user!._id.toString();
            const exerciseData = req.body;

            // Validate IDs
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return ResponseHelper.badRequest(res, 'Valid session ID is required');
            }

            if (!exerciseIndex) {
                return ResponseHelper.badRequest(res, 'Exercise index is required');
            }

            const exerciseIdx = parseInt(exerciseIndex);
            if (isNaN(exerciseIdx) || exerciseIdx < 0) {
                return ResponseHelper.badRequest(res, 'Valid exercise index is required');
            }

            const session = await WorkoutSessionService.updateExerciseProgress(
                id,
                userId,
                exerciseIdx,
                exerciseData
            );

            ResponseHelper.success(res, session, 'Exercise progress updated successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get session statistics
     * @route GET /api/v1/workout-sessions/stats
     */
    static async getSessionStats(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check authentication
            if (!requireAuth(res, req.user)) return;

            const userId = req.user!._id.toString();
            const stats = await WorkoutSessionService.getSessionStats(userId);

            ResponseHelper.success(res, stats, 'Session statistics retrieved successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get session by ID
     * @route GET /api/v1/workout-sessions/:id
     */
    static async getSession(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!requireAuth(res, req.user)) return;

            const userId = req.user!._id.toString();
            const { id } = req.params;

            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return ResponseHelper.badRequest(res, 'Valid session ID is required');
            }

            const session = await WorkoutSessionService.getSessionById(id, userId);

            if (!session) {
                return ResponseHelper.notFound(res, 'Session not found');
            }

            ResponseHelper.success(res, session, 'Session retrieved successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Complete an exercise in session
     * @route POST /api/v1/workout-sessions/:id/complete-exercise
     */
    static async completeExercise(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!requireAuth(res, req.user)) return;

            const userId = req.user!._id.toString();
            const { id } = req.params;
            const exerciseData = req.body;

            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return ResponseHelper.badRequest(res, 'Valid session ID is required');
            }

            const session = await WorkoutSessionService.completeExercise(id, userId, exerciseData);

            ResponseHelper.success(res, session, 'Exercise completed successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Toggle pause/resume session
     * @route POST /api/v1/workout-sessions/:id/toggle-pause
     */
    static async togglePause(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!requireAuth(res, req.user)) return;

            const userId = req.user!._id.toString();
            const { id } = req.params;

            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return ResponseHelper.badRequest(res, 'Valid session ID is required');
            }

            const session = await WorkoutSessionService.togglePause(id, userId);

            ResponseHelper.success(res, session, 'Session pause toggled successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get user's session history
     * @route GET /api/v1/workout-sessions
     */
    static async getUserSessions(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!requireAuth(res, req.user)) return;

            const userId = req.user!._id.toString();
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string;

            const result = await WorkoutSessionService.getUserSessions(userId, {
                page,
                limit,
                status
            });

            ResponseHelper.success(res, result, 'Sessions retrieved successfully');

        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete session
     * @route DELETE /api/v1/workout-sessions/:id
     */
    static async deleteSession(
        req: RequestWithUser,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!requireAuth(res, req.user)) return;

            const userId = req.user!._id.toString();
            const { id } = req.params;

            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return ResponseHelper.badRequest(res, 'Valid session ID is required');
            }

            const deleted = await WorkoutSessionService.deleteSession(id, userId);

            if (!deleted) {
                return ResponseHelper.notFound(res, 'Session not found');
            }

            ResponseHelper.success(res, null, 'Session deleted successfully');

        } catch (error) {
            next(error);
        }
    }
}
