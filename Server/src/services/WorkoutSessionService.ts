/**
 * 🏃 Workout Session Service
 * Business logic cho workout session tracking và real-time progress
 */

import mongoose from 'mongoose';
import { IWorkoutSession, ExerciseCompletion, SetPerformance } from '../models/WorkoutSession';
import { WorkoutSessionRepository } from '../repositories/WorkoutSessionRepository';
import { WorkoutRepository } from '../repositories/WorkoutRepository';

/**
 * Input interface for creating workout session
 */
export interface CreateSessionInput {
    userId: string;
    workoutId: string;
}

/**
 * Input interface for updating workout session
 */
export interface UpdateSessionInput {
    currentExerciseIndex?: number;
    status?: 'active' | 'paused' | 'completed' | 'stopped';
    notes?: string;
    rating?: number;
    mood?: 'great' | 'good' | 'okay' | 'tired' | 'poor';
}

/**
 * Input interface for completing an exercise
 */
export interface CompleteExerciseInput {
    exerciseId: string;
    exerciseIndex: number;
    sets: SetPerformance[];
    caloriesBurned: number;
    notes?: string;
}

export class WorkoutSessionService {
    /**
     * Start a new workout session
     */
    static async startSession(data: CreateSessionInput): Promise<IWorkoutSession> {
        try {
            const { userId, workoutId } = data;

            // Validate workout exists
            const workout = await WorkoutRepository.findById(workoutId);
            if (!workout) {
                throw new Error('Workout not found');
            }

            // Check if user has active session
            const activeSession = await WorkoutSessionRepository.findActiveByUserId(userId);

            if (activeSession) {
                throw new Error('You already have an active workout session. Please complete or stop it first.');
            }

            // Create new session với đúng type từ Repository
            const sessionData: import('../repositories/WorkoutSessionRepository').CreateSessionData = {
                userId: new mongoose.Types.ObjectId(userId),
                workoutId: new mongoose.Types.ObjectId(workoutId),
                startTime: new Date(),
                totalDuration: 0,
                pausedDuration: 0,
                currentExerciseIndex: 0,
                totalExercises: workout.exercises.length,
                completedExercises: [],
                totalCaloriesBurned: 0,
                status: 'active' as const,
                completionPercentage: 0
            };

            const session = await WorkoutSessionRepository.create(sessionData);

            // Populate workout information
            const populatedSession = await WorkoutSessionRepository.findByIdWithPopulation(
                session._id.toString(),
                ['workoutId']
            );

            return populatedSession || session;

        } catch (error) {
            console.error('Error starting workout session:', error);
            throw new Error(`Failed to start session: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get current active session for user
     */
    static async getActiveSession(userId: string): Promise<IWorkoutSession | null> {
        try {
            const session = await WorkoutSessionRepository.findActiveByUserId(userId);
            return session;
        } catch (error) {
            console.error('Error getting active session:', error);
            throw new Error(`Failed to get active session: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get session by ID
     */
    static async getSessionById(sessionId: string, userId?: string): Promise<IWorkoutSession | null> {
        try {
            if (userId) {
                const session = await WorkoutSessionRepository.findByIdAndUserId(sessionId, userId);
                if (session) {
                    // Populate workout information
                    return await WorkoutSessionRepository.findByIdWithPopulation(
                        sessionId,
                        ['workoutId']
                    );
                }
                return null;
            } else {
                return await WorkoutSessionRepository.findByIdWithPopulation(sessionId, ['workoutId']);
            }
        } catch (error) {
            console.error('Error getting session by ID:', error);
            throw new Error(`Failed to get session: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update session progress
     */
    static async updateSession(
        sessionId: string,
        userId: string,
        updates: UpdateSessionInput
    ): Promise<IWorkoutSession> {
        try {
            const session = await WorkoutSessionRepository.findByIdAndUserId(sessionId, userId);

            if (!session) {
                throw new Error('Session not found or access denied');
            }

            // Prepare update data
            const updateData: any = { ...updates };

            // Update completion percentage if currentExerciseIndex changed
            if (updates.currentExerciseIndex !== undefined) {
                updateData.completionPercentage = Math.round(
                    (updates.currentExerciseIndex / session.totalExercises) * 100
                );
            }

            // Set end time if completing
            if (updates.status === 'completed' || updates.status === 'stopped') {
                updateData.endTime = new Date();
                updateData.totalDuration = Math.round(
                    (updateData.endTime.getTime() - session.startTime.getTime()) / 1000
                ) - (session.pausedDuration || 0);
            }

            const updatedSession = await WorkoutSessionRepository.updateByIdAndUserId(
                sessionId,
                userId,
                updateData
            );

            if (!updatedSession) {
                throw new Error('Failed to update session');
            }

            return updatedSession;
        } catch (error) {
            console.error('Error updating session:', error);
            throw new Error(`Failed to update session: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Complete an exercise within session
     */
    static async completeExercise(
        sessionId: string,
        userId: string,
        exerciseData: CompleteExerciseInput
    ): Promise<IWorkoutSession> {
        try {
            const session = await WorkoutSessionRepository.findByIdAndUserId(sessionId, userId);

            if (!session || !['active', 'paused'].includes(session.status)) {
                throw new Error('Active session not found');
            }

            const completedExercise: ExerciseCompletion = {
                exerciseId: exerciseData.exerciseId as any, // Type assertion for ObjectId
                exerciseIndex: exerciseData.exerciseIndex,
                sets: exerciseData.sets,
                totalDuration: exerciseData.sets.reduce((total, set) => total + set.duration, 0),
                caloriesBurned: exerciseData.caloriesBurned,
                isCompleted: true,
                startedAt: new Date(),
                completedAt: new Date()
            };

            // Calculate new totals
            const newTotalCalories = (session.totalCaloriesBurned || 0) + exerciseData.caloriesBurned;
            const newCompletedCount = session.completedExercises.length + 1;
            const newCompletionPercentage = Math.round((newCompletedCount / session.totalExercises) * 100);

            // Prepare update data
            const updateData: any = {
                totalCaloriesBurned: newTotalCalories,
                currentExerciseIndex: exerciseData.exerciseIndex + 1,
                completionPercentage: newCompletionPercentage
            };

            // Check if workout is completed
            if (newCompletedCount >= session.totalExercises) {
                updateData.status = 'completed';
                updateData.endTime = new Date();
                updateData.totalDuration = Math.round(
                    (updateData.endTime.getTime() - session.startTime.getTime()) / 1000
                ) - (session.pausedDuration || 0);
            }

            // Add completed exercise and update session
            const updatedSession = await WorkoutSessionRepository.addCompletedExercise(
                sessionId,
                completedExercise
            );

            if (!updatedSession) {
                throw new Error('Failed to add completed exercise');
            }

            // Update other fields if needed
            await WorkoutSessionRepository.updateByIdAndUserId(sessionId, userId, updateData);

            return await WorkoutSessionRepository.findByIdAndUserId(sessionId, userId) as IWorkoutSession;

        } catch (error) {
            console.error('Error completing exercise:', error);
            throw new Error(`Failed to complete exercise: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }



    /**
     * Stop session
     */
    static async stopSession(sessionId: string, userId: string): Promise<IWorkoutSession> {
        try {
            const session = await WorkoutSessionRepository.findByIdAndUserId(sessionId, userId);

            if (!session || !['active', 'paused'].includes(session.status)) {
                throw new Error('Active session not found');
            }

            const endTime = new Date();
            const totalDuration = Math.round(
                (endTime.getTime() - session.startTime.getTime()) / 1000
            ) - (session.pausedDuration || 0);

            const updatedSession = await WorkoutSessionRepository.updateByIdAndUserId(
                sessionId,
                userId,
                {
                    status: 'stopped',
                    endTime,
                    totalDuration
                }
            );

            if (!updatedSession) {
                throw new Error('Failed to stop session');
            }

            return updatedSession;
        } catch (error) {
            console.error('Error stopping session:', error);
            throw new Error(`Failed to stop session: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get user's session history
     */
    static async getUserSessions(
        userId: string,
        options: {
            page?: number;
            limit?: number;
            status?: string;
        } = {}
    ): Promise<{
        sessions: IWorkoutSession[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        try {
            const { page = 1, limit = 10, status } = options;

            const filterOptions: { page: number; limit: number; status?: string } = { page, limit };
            if (status) {
                filterOptions.status = status;
            }

            const result = await WorkoutSessionRepository.findByUserId(userId, filterOptions);

            return result;
        } catch (error) {
            console.error('Error getting user sessions:', error);
            throw new Error(`Failed to get sessions: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get session statistics
     */
    static async getSessionStats(userId: string): Promise<any> {
        try {
            const result = await WorkoutSessionRepository.getStats(userId);

            return {
                totalSessions: result.totalSessions,
                completedSessions: result.completedSessions,
                completionRate: result.totalSessions > 0
                    ? Math.round((result.completedSessions / result.totalSessions) * 100)
                    : 0,
                totalDuration: Math.round(result.totalDuration / 60), // convert to minutes
                totalCalories: Math.round(result.totalCalories),
                avgDuration: Math.round(result.avgDuration / 60), // convert to minutes
                avgCalories: Math.round(result.avgCalories)
            };
        } catch (error) {
            console.error('Error getting session stats:', error);
            throw new Error(`Failed to get session statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }



    /**
     * Complete workout session
     */
    static async completeSession(
        sessionId: string,
        userId: string,
        completionData: { rating?: number; notes?: string; mood?: string }
    ): Promise<IWorkoutSession> {
        try {
            const session = await WorkoutSessionRepository.findByIdAndUserId(sessionId, userId);

            if (!session || !['active', 'paused'].includes(session.status)) {
                throw new Error('Active session not found');
            }

            const endTime = new Date();
            const totalDuration = Math.round(
                (endTime.getTime() - session.startTime.getTime()) / 1000
            ) - (session.pausedDuration || 0);

            const updateData: any = {
                status: 'completed',
                endTime,
                totalDuration,
                completionPercentage: 100,
                ...completionData
            };

            const updatedSession = await WorkoutSessionRepository.updateByIdAndUserId(
                sessionId,
                userId,
                updateData
            );

            if (!updatedSession) {
                throw new Error('Failed to complete session');
            }

            return updatedSession;
        } catch (error) {
            console.error('Error completing session:', error);
            throw new Error(`Failed to complete session: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Pause workout session
     */
    static async pauseSession(sessionId: string, userId: string): Promise<IWorkoutSession> {
        try {
            const session = await WorkoutSessionRepository.findByIdAndUserId(sessionId, userId);

            if (!session || session.status !== 'active') {
                throw new Error('Active session not found');
            }

            const updatedSession = await WorkoutSessionRepository.updateByIdAndUserId(
                sessionId,
                userId,
                { status: 'paused' }
            );

            if (!updatedSession) {
                throw new Error('Failed to pause session');
            }

            return updatedSession;
        } catch (error) {
            console.error('Error pausing session:', error);
            throw new Error(`Failed to pause session: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Resume workout session
     */
    static async resumeSession(sessionId: string, userId: string): Promise<IWorkoutSession> {
        try {
            const session = await WorkoutSessionRepository.findByIdAndUserId(sessionId, userId);

            if (!session || session.status !== 'paused') {
                throw new Error('Paused session not found');
            }

            const updatedSession = await WorkoutSessionRepository.updateByIdAndUserId(
                sessionId,
                userId,
                { status: 'active' }
            );

            if (!updatedSession) {
                throw new Error('Failed to resume session');
            }

            return updatedSession;
        } catch (error) {
            console.error('Error resuming session:', error);
            throw new Error(`Failed to resume session: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update exercise progress
     */
    static async updateExerciseProgress(
        sessionId: string,
        userId: string,
        exerciseIndex: number,
        progressData: any
    ): Promise<IWorkoutSession> {
        try {
            const session = await WorkoutSessionRepository.findByIdAndUserId(sessionId, userId);

            if (!session || !['active', 'paused'].includes(session.status)) {
                throw new Error('Active session not found');
            }

            // Update current exercise index
            const updateData: any = {
                currentExerciseIndex: exerciseIndex,
                completionPercentage: Math.round((exerciseIndex / session.totalExercises) * 100)
            };

            const updatedSession = await WorkoutSessionRepository.updateByIdAndUserId(
                sessionId,
                userId,
                updateData
            );

            if (!updatedSession) {
                throw new Error('Failed to update exercise progress');
            }

            return updatedSession;
        } catch (error) {
            console.error('Error updating exercise progress:', error);
            throw new Error(`Failed to update exercise progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Toggle pause/resume session
     */
    static async togglePause(sessionId: string, userId: string): Promise<IWorkoutSession> {
        try {
            const session = await WorkoutSessionRepository.findByIdAndUserId(sessionId, userId);

            if (!session || !['active', 'paused'].includes(session.status)) {
                throw new Error('Active or paused session not found');
            }

            const newStatus = session.status === 'active' ? 'paused' : 'active';

            const updatedSession = await WorkoutSessionRepository.updateByIdAndUserId(
                sessionId,
                userId,
                { status: newStatus }
            );

            if (!updatedSession) {
                throw new Error('Failed to toggle session pause');
            }

            return updatedSession;
        } catch (error) {
            console.error('Error toggling session pause:', error);
            throw new Error(`Failed to toggle session pause: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Delete session
     */
    static async deleteSession(sessionId: string, userId: string): Promise<boolean> {
        try {
            const session = await WorkoutSessionRepository.findByIdAndUserId(sessionId, userId);

            if (!session) {
                return false;
            }

            await WorkoutSessionRepository.deleteByIdAndUserId(sessionId, userId);
            return true;
        } catch (error) {
            console.error('Error deleting session:', error);
            throw new Error(`Failed to delete session: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get session history (alias for getUserSessions)
     */
    static async getSessionHistory(
        filters: any,
        page: number = 1,
        limit: number = 10
    ): Promise<{
        sessions: IWorkoutSession[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        try {
            const userId = filters.userId;
            return await this.getUserSessions(userId, { page, limit, status: filters.status });
        } catch (error) {
            console.error('Error getting session history:', error);
            throw new Error(`Failed to get session history: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
