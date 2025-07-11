/**
 * 🏋️ Workout Repository
 * Data access layer cho Workout operations
 */

import mongoose from 'mongoose';
import { WorkoutModel, IWorkout } from '../models/Workout';
import { PaginatedResult } from '../types';
import { FilterWorkout } from '../controllers/WorkoutController';

export class WorkoutRepository {
    /**
     * Find workouts với advanced filtering và pagination
     */
    static async findWorkouts(params: FilterWorkout): Promise<PaginatedResult<IWorkout>> {
        const {
            page = 1,
            limit = 10,
            filters = {},
            sort = { field: 'createdAt', order: 'desc' },
            options = {}
        } = params;

        // Build MongoDB Query
        const query: any = {};

        // User filter
        if (filters.userId) {
            query.userId = new mongoose.Types.ObjectId(filters.userId);
        }

        // Category filter
        if (filters.category) {
            query.category = { $in: Array.isArray(filters.category) ? filters.category : [filters.category] };
        }

        // Difficulty filter
        if (filters.difficulty) {
            query.difficulty = { $in: Array.isArray(filters.difficulty) ? filters.difficulty : [filters.difficulty] };
        }

        // Public filter (use includePrivate to determine)
        if (filters.includePrivate === false || filters.includePrivate === undefined) {
            query.isPublic = true;
        }

        // Sponsored filter
        if (filters.isSponsored !== undefined) {
            query.isSponsored = filters.isSponsored;
        }

        // Duration range filter
        if (filters.duration) {
            query.estimatedDuration = {
                $gte: filters.duration.min || 0,
                $lte: filters.duration.max || 300
            };
        }

        // Muscle groups filter
        if (filters.muscleGroups) {
            query.muscleGroups = {
                $in: Array.isArray(filters.muscleGroups) ? filters.muscleGroups : [filters.muscleGroups]
            };
        }

        // Equipment filter
        if (filters.equipment) {
            query.equipment = {
                $in: Array.isArray(filters.equipment) ? filters.equipment : [filters.equipment]
            };
        }

        // Rating filter
        if (filters.minRating !== undefined) {
            query.averageRating = { $gte: filters.minRating };
        }

        // Tags filter
        if (filters.tags) {
            query.tags = {
                $in: Array.isArray(filters.tags) ? filters.tags : [filters.tags]
            };
        }

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.trim();
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { tags: { $elemMatch: { $regex: searchTerm, $options: 'i' } } },
                { muscleGroups: { $elemMatch: { $regex: searchTerm, $options: 'i' } } },
                { equipment: { $elemMatch: { $regex: searchTerm, $options: 'i' } } }
            ];
        }

        // Build Sort Options
        const sortOptions: any = {};

        switch (sort.field) {
            case 'name':
                sortOptions.name = sort.order === 'desc' ? -1 : 1;
                break;
            case 'category':
                sortOptions.category = sort.order === 'desc' ? -1 : 1;
                break;
            case 'difficulty':
                sortOptions.difficulty = sort.order === 'desc' ? -1 : 1;
                break;
            case 'estimatedDuration':
                sortOptions.estimatedDuration = sort.order === 'desc' ? -1 : 1;
                break;
            case 'averageRating':
                sortOptions.averageRating = sort.order === 'desc' ? -1 : 1;
                break;
            case 'likeCount':
                sortOptions.likeCount = sort.order === 'desc' ? -1 : 1;
                break;
            case 'saveCount':
                sortOptions.saveCount = sort.order === 'desc' ? -1 : 1;
                break;
            case 'views':
                sortOptions.views = sort.order === 'desc' ? -1 : 1;
                break;
            case 'createdAt':
                sortOptions.createdAt = sort.order === 'desc' ? -1 : 1;
                break;
            default:
                sortOptions.createdAt = -1;
        }

        // Pagination Setup
        const skip = (page - 1) * limit;

        // Execute Query với Aggregation Pipeline
        const aggregationPipeline: any[] = [
            { $match: query },
            ...(options.includeUserData ? [{
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [{
                        $project: {
                            username: 1,
                            'profile.firstName': 1,
                            'profile.lastName': 1,
                            'profile.avatar': 1
                        }
                    }]
                }
            }] : []),
            ...(options.includeExerciseData ? [{
                $lookup: {
                    from: 'exercises',
                    localField: 'exercises.exerciseId',
                    foreignField: '_id',
                    as: 'exerciseDetails'
                }
            }] : []),
            { $sort: sortOptions },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            }
        ];

        // Execute aggregation
        const result = await WorkoutModel.aggregate(aggregationPipeline);

        // Process Results
        const workouts = result[0]?.data || [];
        const totalItems = result[0]?.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: workouts,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            filters: filters,
            sort: sort
        };
    }

    /**
     * Find workout by ID
     */
    static async findById(id: string): Promise<IWorkout | null> {
        return await WorkoutModel.findById(id).populate('exercises.exerciseId');
    }

    /**
     * Find workout by ID với populate options
     */
    static async findByIdWithOptions(
        id: string,
        options: {
            includeUserData?: boolean;
            includeExerciseData?: boolean;
        } = {}
    ): Promise<any> {
        let query = WorkoutModel.findById(id);

        if (options.includeUserData) {
            query = query.populate('userId', 'username profile.firstName profile.lastName profile.avatar') as any;
        }

        if (options.includeExerciseData) {
            // Populate toàn bộ exercise data để có đủ thông tin như gifUrl, images, etc.
            query = query.populate('exercises.exerciseId') as any;
        }

        return await query.exec();
    }

    /**
     * Create new workout
     */
    static async create(workoutData: any): Promise<IWorkout> {
        const workout = new WorkoutModel(workoutData);
        const savedWorkout = await workout.save();
        // Populate exercises for the saved workout
        return await WorkoutModel.findById(savedWorkout._id).populate('exercises.exerciseId') as IWorkout;
    }

    /**
     * Update workout by ID
     */
    static async updateById(id: string, updateData: any): Promise<IWorkout | null> {
        return await WorkoutModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('exercises.exerciseId');
    }

    /**
     * Delete workout by ID
     */
    static async deleteById(id: string): Promise<boolean> {
        const result = await WorkoutModel.findByIdAndDelete(id);
        return result !== null;
    }

    /**
     * Find workouts by user ID
     */
    static async findByUserId(userId: string): Promise<IWorkout[]> {
        return await WorkoutModel.find({ userId: new mongoose.Types.ObjectId(userId) })
            .populate('exercises.exerciseId');
    }

    /**
     * Find public workouts
     */
    static async findPublicWorkouts(): Promise<IWorkout[]> {
        return await WorkoutModel.find({ isPublic: true })
            .populate('exercises.exerciseId');
    }

    /**
     * Find sponsored workouts
     */
    static async findSponsoredWorkouts(): Promise<IWorkout[]> {
        return await WorkoutModel.find({ isSponsored: true })
            .populate('exercises.exerciseId');
    }

    /**
     * Find popular workouts (by likes/saves)
     */
    static async findPopularWorkouts(limit: number = 10): Promise<IWorkout[]> {
        return await WorkoutModel.find({ isPublic: true })
            .sort({ likeCount: -1, saveCount: -1 })
            .limit(limit)
            .populate('exercises.exerciseId');
    }

    /**
     * Count workouts with filters
     */
    static async count(filters: any = {}): Promise<number> {
        return await WorkoutModel.countDocuments(filters);
    }

    /**
     * Get user workout statistics
     */
    static async getUserStats(userId: string): Promise<any> {
        const stats = await WorkoutModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalWorkouts: { $sum: 1 },
                    totalDuration: { $sum: '$estimatedDuration' },
                    totalExercises: { $sum: { $size: '$exercises' } },
                    avgRating: { $avg: '$averageRating' },
                    totalLikes: { $sum: '$likeCount' },
                    totalSaves: { $sum: '$saveCount' },
                    totalViews: { $sum: '$views' },
                    totalCompletions: { $sum: '$completions' }
                }
            }
        ]);

        const categoryStats = await WorkoutModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        const difficultyStats = await WorkoutModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]);

        const recentActivity = await WorkoutModel.findOne(
            { userId: new mongoose.Types.ObjectId(userId) },
            {},
            { sort: { createdAt: -1 } }
        );

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const workoutsThisWeek = await WorkoutModel.countDocuments({
            userId: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: weekAgo }
        });

        const workoutsThisMonth = await WorkoutModel.countDocuments({
            userId: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: monthAgo }
        });

        const baseStats = stats[0] || {
            totalWorkouts: 0,
            totalDuration: 0,
            totalExercises: 0,
            avgRating: 0,
            totalLikes: 0,
            totalSaves: 0,
            totalViews: 0,
            totalCompletions: 0
        };

        return {
            ...baseStats,
            averageRating: baseStats.avgRating || 0,
            byCategory: categoryStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            byDifficulty: difficultyStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            recentActivity: {
                lastWorkoutDate: recentActivity?.createdAt || null,
                workoutsThisWeek,
                workoutsThisMonth
            }
        };
    }

    /**
     * Toggle like on workout
     */
    static async toggleLike(workoutId: string, userId: string): Promise<{ isLiked: boolean; likeCount: number }> {
        const workout = await WorkoutModel.findById(workoutId);
        if (!workout) {
            throw new Error('Workout not found');
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const isCurrentlyLiked = workout.likes?.some(id => id.toString() === userId);

        if (isCurrentlyLiked) {
            // Unlike
            workout.likes = workout.likes?.filter(id => id.toString() !== userId) || [];
            workout.likeCount = Math.max((workout.likeCount || 0) - 1, 0);
        } else {
            // Like
            workout.likes = workout.likes || [];
            (workout.likes as any).push(userObjectId);
            workout.likeCount = (workout.likeCount || 0) + 1;
        }

        await workout.save();

        return {
            isLiked: !isCurrentlyLiked,
            likeCount: workout.likeCount || 0
        };
    }

    /**
     * Toggle save on workout
     */
    static async toggleSave(workoutId: string, userId: string): Promise<{ isSaved: boolean; saveCount: number }> {
        const workout = await WorkoutModel.findById(workoutId);
        if (!workout) {
            throw new Error('Workout not found');
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const isCurrentlySaved = workout.saves?.some(id => id.toString() === userId);

        if (isCurrentlySaved) {
            // Unsave
            workout.saves = workout.saves?.filter(id => id.toString() !== userId) || [];
            workout.saveCount = Math.max((workout.saveCount || 0) - 1, 0);
        } else {
            // Save
            workout.saves = workout.saves || [];
            (workout.saves as any).push(userObjectId);
            workout.saveCount = (workout.saveCount || 0) + 1;
        }

        await workout.save();

        return {
            isSaved: !isCurrentlySaved,
            saveCount: workout.saveCount || 0
        };
    }

    /**
     * Increment view count
     */
    static async incrementViews(workoutId: string): Promise<void> {
        await WorkoutModel.findByIdAndUpdate(workoutId, { $inc: { views: 1 } });
    }

    /**
     * Increment completion count
     */
    static async incrementCompletions(workoutId: string): Promise<void> {
        await WorkoutModel.findByIdAndUpdate(workoutId, { $inc: { completions: 1 } });
    }
}
