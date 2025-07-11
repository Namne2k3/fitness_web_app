/**
 * 🏃 Workout Session Repository
 * Data access layer cho workout session operations
 */

import mongoose from 'mongoose';
import { WorkoutSessionModel, IWorkoutSession, ExerciseCompletion, SetPerformance } from '../models/WorkoutSession';

export interface CreateSessionData {
    userId: mongoose.Types.ObjectId;
    workoutId: mongoose.Types.ObjectId;
    startTime: Date;
    totalDuration: number;
    pausedDuration: number;
    currentExerciseIndex: number;
    totalExercises: number;
    completedExercises: ExerciseCompletion[];
    totalCaloriesBurned: number;
    status: 'active' | 'paused' | 'completed' | 'stopped';
    completionPercentage: number;
}

export interface UpdateSessionData {
    currentExerciseIndex?: number;
    status?: 'active' | 'paused' | 'completed' | 'stopped';
    notes?: string;
    rating?: number;
    mood?: 'great' | 'good' | 'okay' | 'tired' | 'poor';
    totalDuration?: number;
    pausedDuration?: number;
    completionPercentage?: number;
    totalCaloriesBurned?: number;
    completedExercises?: ExerciseCompletion[];
    endTime?: Date;
}

export class WorkoutSessionRepository {
    /**
     * Create new workout session
     */
    static async create(sessionData: CreateSessionData): Promise<IWorkoutSession> {
        const session = new WorkoutSessionModel(sessionData);
        await session.save();
        return session;
    }

    /**
     * Find session by ID
     */
    static async findById(sessionId: string): Promise<IWorkoutSession | null> {
        return await WorkoutSessionModel.findById(sessionId);
    }

    /**
     * Find session by ID with population
     */
    static async findByIdWithPopulation(
        sessionId: string,
        populateOptions: string[] = []
    ): Promise<IWorkoutSession | null> {
        let query = WorkoutSessionModel.findById(sessionId);

        // Add population based on options
        if (populateOptions.includes('workout')) {
            query = query.populate('workoutId', 'name description category difficulty estimatedDuration exercises');
        }

        if (populateOptions.includes('exercises')) {
            query = query.populate('workoutId.exercises.exerciseId', 'name category muscleGroups equipment');
        }

        return await query.exec();
    }

    /**
     * Find session by ID and user ID
     */
    static async findByIdAndUserId(sessionId: string, userId: string): Promise<IWorkoutSession | null> {
        return await WorkoutSessionModel.findOne({
            _id: new mongoose.Types.ObjectId(sessionId),
            userId: new mongoose.Types.ObjectId(userId)
        });
    }

    /**
     * Find active session for user
     */
    static async findActiveByUserId(userId: string): Promise<IWorkoutSession | null> {
        return await WorkoutSessionModel.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            status: { $in: ['active', 'paused'] }
        })
            .populate('workoutId', 'name description category difficulty estimatedDuration exercises')
            .populate('workoutId.exercises.exerciseId', 'name category muscleGroups equipment');
    }

    /**
     * Find user sessions with pagination
     */
    static async findByUserId(
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
        const { page = 1, limit = 10, status } = options;
        const skip = (page - 1) * limit;

        const query: any = { userId: new mongoose.Types.ObjectId(userId) };
        if (status) {
            query.status = status;
        }

        const [sessions, total] = await Promise.all([
            WorkoutSessionModel.find(query)
                .populate('workoutId', 'name description category difficulty')
                .sort({ startTime: -1 })
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
    }

    /**
     * Update session by ID
     */
    static async updateById(
        sessionId: string,
        updates: UpdateSessionData
    ): Promise<IWorkoutSession | null> {
        return await WorkoutSessionModel.findByIdAndUpdate(
            sessionId,
            updates,
            { new: true, runValidators: true }
        );
    }

    /**
     * Update session by ID and user ID
     */
    static async updateByIdAndUserId(
        sessionId: string,
        userId: string,
        updates: UpdateSessionData
    ): Promise<IWorkoutSession | null> {
        return await WorkoutSessionModel.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(sessionId),
                userId: new mongoose.Types.ObjectId(userId)
            },
            updates,
            { new: true, runValidators: true }
        );
    }

    /**
     * Delete session by ID and user ID
     */
    static async deleteByIdAndUserId(sessionId: string, userId: string): Promise<boolean> {
        const result = await WorkoutSessionModel.deleteOne({
            _id: new mongoose.Types.ObjectId(sessionId),
            userId: new mongoose.Types.ObjectId(userId)
        });

        return result.deletedCount > 0;
    }

    /**
     * Get session statistics aggregation
     */
    static async getSessionStats(userId: string): Promise<any> {
        const stats = await WorkoutSessionModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalSessions: { $sum: 1 },
                    completedSessions: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    totalDuration: { $sum: '$totalDuration' },
                    totalCalories: { $sum: '$totalCaloriesBurned' },
                    averageRating: { $avg: '$rating' },
                    averageCompletion: { $avg: '$completionPercentage' }
                }
            }
        ]);

        return stats[0] || {
            totalSessions: 0,
            completedSessions: 0,
            totalDuration: 0,
            totalCalories: 0,
            averageRating: 0,
            averageCompletion: 0
        };
    }

    /**
     * Get sessions by status
     */
    static async findByStatus(
        userId: string,
        status: 'active' | 'paused' | 'completed' | 'stopped'
    ): Promise<IWorkoutSession[]> {
        return await WorkoutSessionModel.find({
            userId: new mongoose.Types.ObjectId(userId),
            status
        }).populate('workoutId', 'name description category difficulty');
    }

    /**
     * Get recent sessions
     */
    static async findRecentByUserId(
        userId: string,
        limit: number = 5
    ): Promise<IWorkoutSession[]> {
        return await WorkoutSessionModel.find({
            userId: new mongoose.Types.ObjectId(userId)
        })
            .populate('workoutId', 'name description category difficulty')
            .sort({ startTime: -1 })
            .limit(limit);
    }

    /**
     * Count sessions by user and status
     */
    static async countByUserAndStatus(
        userId: string,
        status?: 'active' | 'paused' | 'completed' | 'stopped'
    ): Promise<number> {
        const query: any = { userId: new mongoose.Types.ObjectId(userId) };
        if (status) {
            query.status = status;
        }

        return await WorkoutSessionModel.countDocuments(query);
    }

    /**
     * Update session with completed exercise
     */
    static async addCompletedExercise(
        sessionId: string,
        exerciseCompletion: ExerciseCompletion
    ): Promise<IWorkoutSession | null> {
        return await WorkoutSessionModel.findByIdAndUpdate(
            sessionId,
            {
                $push: { completedExercises: exerciseCompletion },
                $inc: { totalCaloriesBurned: exerciseCompletion.caloriesBurned }
            },
            { new: true, runValidators: true }
        );
    }

    /**
     * Get user session statistics
     */
    static async getStats(userId: string): Promise<any> {
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

        return stats[0] || {
            totalSessions: 0,
            completedSessions: 0,
            totalDuration: 0,
            totalCalories: 0,
            avgDuration: 0,
            avgCalories: 0
        };
    }
}
