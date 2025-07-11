/**
 * 🏃 Workout Session Service
 * Business logic cho workout session tracking và real-time progress
 */

import mongoose from 'mongoose';
import { WorkoutSessionModel, IWorkoutSession, ExerciseCompletion, SetPerformance } from '../models/WorkoutSession';
import { WorkoutModel } from '../models/Workout';
import { ExerciseModel } from '../models/Exercise';

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
            const workout = await WorkoutModel.findById(workoutId);
            if (!workout) {
                throw new Error('Workout not found');
            }

            // Check if user has active session
            const activeSession = await WorkoutSessionModel.findOne({
                userId: new mongoose.Types.ObjectId(userId),
                status: { $in: ['active', 'paused'] }
            });

            if (activeSession) {
                throw new Error('You already have an active workout session. Please complete or stop it first.');
            }

            // Create new session
            const session = new WorkoutSessionModel({
                userId: new mongoose.Types.ObjectId(userId),
                workoutId: new mongoose.Types.ObjectId(workoutId),
                startTime: new Date(),
                totalDuration: 0,
                pausedDuration: 0,
                currentExerciseIndex: 0,
                totalExercises: workout.exercises.length,
                completedExercises: [],
                totalCaloriesBurned: 0,
                status: 'active',
                completionPercentage: 0
            });

            await session.save();
            await session.populate('workoutId', 'name description category difficulty estimatedDuration');

            return session;

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
            const session = await WorkoutSessionModel.findOne({
                userId: new mongoose.Types.ObjectId(userId),
                status: { $in: ['active', 'paused'] }
            })
                .populate('workoutId', 'name description category difficulty estimatedDuration exercises')
                .populate('workoutId.exercises.exerciseId', 'name category muscleGroups equipment');

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
            const query: any = { _id: new mongoose.Types.ObjectId(sessionId) };
            if (userId) {
                query.userId = new mongoose.Types.ObjectId(userId);
            }

            const session = await WorkoutSessionModel.findOne(query)
                .populate('workoutId', 'name description category difficulty estimatedDuration exercises')
                .populate('workoutId.exercises.exerciseId', 'name category muscleGroups equipment');

            return session;

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
            const session = await WorkoutSessionModel.findOne({
                _id: new mongoose.Types.ObjectId(sessionId),
                userId: new mongoose.Types.ObjectId(userId)
            });

            if (!session) {
                throw new Error('Session not found or access denied');
            }

            // Update fields
            Object.assign(session, updates);

            // Update completion percentage if currentExerciseIndex changed
            if (updates.currentExerciseIndex !== undefined) {
                session.completionPercentage = Math.round(
                    (updates.currentExerciseIndex / session.totalExercises) * 100
                );
            }

            // Set end time if completing
            if (updates.status === 'completed' || updates.status === 'stopped') {
                session.endTime = new Date();
                session.totalDuration = Math.round(
                    (session.endTime.getTime() - session.startTime.getTime()) / 1000
                ) - session.pausedDuration;
            }

            await session.save();
            return session;

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
            const session = await WorkoutSessionModel.findOne({
                _id: new mongoose.Types.ObjectId(sessionId),
                userId: new mongoose.Types.ObjectId(userId),
                status: { $in: ['active', 'paused'] }
            });

            if (!session) {
                throw new Error('Active session not found');
            }

            const completedExercise: ExerciseCompletion = {
                exerciseId: new mongoose.Types.ObjectId(exerciseData.exerciseId),
                exerciseIndex: exerciseData.exerciseIndex,
                sets: exerciseData.sets,
                totalDuration: exerciseData.sets.reduce((total, set) => total + set.duration, 0),
                caloriesBurned: exerciseData.caloriesBurned,
                isCompleted: true,
                startedAt: new Date(),
                completedAt: new Date()
            };

            // Add to completed exercises
            session.completedExercises.push(completedExercise);

            // Update totals
            session.totalCaloriesBurned += exerciseData.caloriesBurned;
            session.currentExerciseIndex = exerciseData.exerciseIndex + 1;
            session.completionPercentage = Math.round(
                (session.completedExercises.length / session.totalExercises) * 100
            );

            // Check if workout is completed
            if (session.completedExercises.length >= session.totalExercises) {
                session.status = 'completed';
                session.endTime = new Date();
                session.totalDuration = Math.round(
                    (session.endTime.getTime() - session.startTime.getTime()) / 1000
                ) - session.pausedDuration;
            }

            await session.save();
            return session;

        } catch (error) {
            console.error('Error completing exercise:', error);
            throw new Error(`Failed to complete exercise: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Pause/Resume session
     */
    static async togglePause(sessionId: string, userId: string): Promise<IWorkoutSession> {
        try {
            const session = await WorkoutSessionModel.findOne({
                _id: new mongoose.Types.ObjectId(sessionId),
                userId: new mongoose.Types.ObjectId(userId),
                status: { $in: ['active', 'paused'] }
            });

            if (!session) {
                throw new Error('Active session not found');
            }

            if (session.status === 'active') {
                session.status = 'paused';
                // Note: pause time tracking would need additional fields
            } else {
                session.status = 'active';
            }

            await session.save();
            return session;

        } catch (error) {
            console.error('Error toggling pause:', error);
            throw new Error(`Failed to toggle pause: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Stop session
     */
    static async stopSession(sessionId: string, userId: string): Promise<IWorkoutSession> {
        try {
            const session = await WorkoutSessionModel.findOne({
                _id: new mongoose.Types.ObjectId(sessionId),
                userId: new mongoose.Types.ObjectId(userId),
                status: { $in: ['active', 'paused'] }
            });

            if (!session) {
                throw new Error('Active session not found');
            }

            session.status = 'stopped';
            session.endTime = new Date();
            session.totalDuration = Math.round(
                (session.endTime.getTime() - session.startTime.getTime()) / 1000
            ) - session.pausedDuration;

            await session.save();
            return session;

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
            const skip = (page - 1) * limit;

            const query: any = { userId: new mongoose.Types.ObjectId(userId) };
            if (status) {
                query.status = status;
            }

            const [sessions, total] = await Promise.all([
                WorkoutSessionModel.find(query)
                    .populate('workoutId', 'name description category difficulty')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                WorkoutSessionModel.countDocuments(query)
            ]);

            return {
                sessions,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };

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
            const stats = await WorkoutSessionModel.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: null,
                        totalSessions: { $sum: 1 },
                        completedSessions: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                        },
                        totalDuration: { $sum: '$totalDuration' },
                        totalCalories: { $sum: '$totalCaloriesBurned' },
                        avgDuration: { $avg: '$totalDuration' },
                        avgCalories: { $avg: '$totalCaloriesBurned' }
                    }
                }
            ]);

            const result = stats[0] || {
                totalSessions: 0,
                completedSessions: 0,
                totalDuration: 0,
                totalCalories: 0,
                avgDuration: 0,
                avgCalories: 0
            };

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
     * Delete session
     */
    static async deleteSession(sessionId: string, userId: string): Promise<boolean> {
        try {
            const result = await WorkoutSessionModel.deleteOne({
                _id: new mongoose.Types.ObjectId(sessionId),
                userId: new mongoose.Types.ObjectId(userId)
            });

            return result.deletedCount > 0;

        } catch (error) {
            console.error('Error deleting session:', error);
            throw new Error(`Failed to delete session: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
