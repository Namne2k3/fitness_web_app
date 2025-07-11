/**
 * 🏋️ Workout Service
 * Business logic cho workout operations với advanced filtering và pagination
 */

import mongoose from 'mongoose';
import { WorkoutModel, IWorkout } from '../models/Workout';
import { ExerciseModel } from '../models/Exercise';
import { UserModel } from '../models/User';
import { FilterWorkout } from '../controllers/WorkoutController';
import { CreateWorkoutDtoInput } from '../dtos/CreateWorkoutDto';
import {
    Workout,
    WorkoutExercise,
    Exercise,
    PaginatedResult
} from '../types';

/**
 * Input interface for creating a workout (without Mongoose Document properties)
 */
export interface CreateWorkoutInput extends Omit<CreateWorkoutDtoInput, 'userId'> {
    userId: string;
}

export class WorkoutService {
    /**
     * Get workouts với advanced filtering, sorting và pagination
     * @param params Filter parameters từ controller
     * @returns Paginated workout results
     */
    static async getWorkouts(params: FilterWorkout): Promise<PaginatedResult<Workout>> {
        try {
            const {
                page = 1,
                limit = 10,
                filters = {},
                sort = { field: 'createdAt', order: 'desc' },
                options = {}
            } = params;

            // ================================
            // 🔍 Build MongoDB Query
            // ================================
            const query: any = {};

            // Basic filters
            if (filters.category) {
                query.category = filters.category;
            }

            if (filters.difficulty) {
                query.difficulty = filters.difficulty;
            }

            // Privacy filter
            if (!filters.includePrivate) {
                query.isPublic = true;
            }

            // User-specific workouts
            if (filters.userId) {
                query.userId = filters.userId;
            }

            // Duration range filter
            if (filters.duration) {
                const durationQuery: any = {};
                if (filters.duration.min !== undefined) {
                    durationQuery.$gte = filters.duration.min;
                }
                if (filters.duration.max !== undefined) {
                    durationQuery.$lte = filters.duration.max;
                }
                if (Object.keys(durationQuery).length > 0) {
                    query.estimatedDuration = durationQuery;
                }
            }

            // Equipment filter
            if (filters.equipment) {
                const equipmentArray = Array.isArray(filters.equipment)
                    ? filters.equipment
                    : [filters.equipment];
                query.equipment = { $in: equipmentArray };
            }

            // Muscle groups filter
            if (filters.muscleGroups) {
                const muscleGroupsArray = Array.isArray(filters.muscleGroups)
                    ? filters.muscleGroups
                    : [filters.muscleGroups];
                query.muscleGroups = { $in: muscleGroupsArray };
            }

            // Search filter (text search)
            if (filters.search) {
                query.$text = { $search: filters.search };
            }

            // Sponsored content filter
            if (filters.isSponsored !== undefined) {
                query.isSponsored = filters.isSponsored;
            }

            // Minimum rating filter
            if (filters.minRating) {
                query.averageRating = { $gte: filters.minRating };
            }

            // Tags filter
            if (filters.tags) {
                const tagsArray = Array.isArray(filters.tags)
                    ? filters.tags
                    : [filters.tags];
                query.tags = { $in: tagsArray };
            }

            // ================================
            // 📊 Build Sort Options
            // ================================
            const sortOptions: any = {};

            // Handle sorting
            switch (sort.field) {
                case 'createdAt':
                    sortOptions.createdAt = sort.order === 'asc' ? 1 : -1;
                    break;
                case 'likeCount':
                    sortOptions.likeCount = sort.order === 'asc' ? 1 : -1;
                    break;
                case 'views':
                    sortOptions.views = sort.order === 'asc' ? 1 : -1;
                    break;
                case 'averageRating':
                    sortOptions.averageRating = sort.order === 'asc' ? 1 : -1;
                    break;
                case 'difficulty':
                    sortOptions.difficulty = sort.order === 'asc' ? 1 : -1;
                    break;
                case 'estimatedDuration':
                    sortOptions.estimatedDuration = sort.order === 'asc' ? 1 : -1;
                    break;
                case 'name':
                    sortOptions.name = sort.order === 'asc' ? 1 : -1;
                    break;
                default:
                    sortOptions.createdAt = -1; // Default sort by newest
            }

            // ================================
            // 📄 Pagination Setup
            // ================================
            const skip = (page - 1) * limit;

            // ================================
            // 📊 Execute Query với Aggregation Pipeline
            // ================================
            const aggregationPipeline: any[] = [
                // Match stage
                { $match: query },

                // Add user data if requested
                ...(options.includeUserData ? [{
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'author',
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

                // Add exercise details if requested
                ...(options.includeExerciseData ? [{
                    $lookup: {
                        from: 'exercises',
                        localField: 'exercises.exerciseId',
                        foreignField: '_id',
                        as: 'exerciseDetails'
                    }
                }] : []),

                // Sort stage
                { $sort: sortOptions },

                // Facet stage cho pagination
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

            const workouts = result[0]?.data || [];
            const totalCount = result[0]?.totalCount[0]?.count || 0;

            // ================================
            // 🔄 Process Results
            // ================================

            // Transform results nếu cần
            const processedWorkouts = await Promise.all(
                workouts.map(async (workout: any) => {
                    // Populate exercise details nếu được yêu cầu
                    if (options.includeExerciseData && workout.exerciseDetails) {
                        workout.exercises = workout.exercises.map((workoutEx: WorkoutExercise) => {
                            const exerciseDetail = workout.exerciseDetails.find(
                                (ex: Exercise) => ex!._id!.toString() === workoutEx.exerciseId.toString()
                            );

                            return {
                                ...workoutEx,
                                exerciseInfo: exerciseDetail ? {
                                    name: exerciseDetail.name,
                                    category: exerciseDetail.category,
                                    primaryMuscleGroups: exerciseDetail.primaryMuscleGroups,
                                    equipment: exerciseDetail.equipment,
                                    difficulty: exerciseDetail.difficulty
                                } : null
                            };
                        });

                        // Remove exerciseDetails từ response
                        delete workout.exerciseDetails;
                    }

                    // Format author information
                    if (options.includeUserData && workout.author && workout.author.length > 0) {
                        const author = workout.author[0];
                        workout.authorInfo = {
                            username: author.username,
                            fullName: `${author.profile?.firstName || ''} ${author.profile?.lastName || ''}`.trim(),
                            avatar: author.profile?.avatar
                        };
                        delete workout.author;
                    }

                    return workout;
                })
            );

            // ================================
            // 📊 Calculate Pagination Meta
            // ================================
            const totalPages = Math.ceil(totalCount / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;

            // ================================
            // 📤 Return Results
            // ================================
            return {
                data: processedWorkouts,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalCount,
                    itemsPerPage: limit,
                    hasNextPage,
                    hasPrevPage
                },
                filters: filters, // Echo back applied filters
                sort: sort
            };

        } catch (error) {
            console.error('Error in WorkoutService.getWorkouts:', error);
            throw new Error(`Failed to retrieve workouts: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }    /**
     * Create new workout với validated data
     * @param workoutData Validated workout data from DTO
     * @returns Created workout document
     */
    static async createWorkout(workoutData: CreateWorkoutInput): Promise<IWorkout> {
        try {
            // Create default values for optional fields
            const workoutInput = {
                ...workoutData,
                isPublic: workoutData.isPublic ?? false,
                tags: workoutData.tags ?? [],
                views: 0,
                likeCount: 0,
                saveCount: 0,
                shares: 0,
                completions: 0,
                totalRatings: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                // Auto-calculate fields if not provided
                muscleGroups: workoutData.muscleGroups ?? [],
                equipment: workoutData.equipment ?? [],
                caloriesBurned: workoutData.caloriesBurned ?? 0
            };

            // Validate and process workout data
            const newWorkout = new WorkoutModel(workoutInput);
            await newWorkout.save();

            // Populate related data if needed
            await newWorkout.populate('exercises.exerciseId');
            await newWorkout.populate('userId');

            return newWorkout;
        } catch (error) {
            console.error('Error creating workout:', error);
            throw new Error(`Failed to create workout: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get workout by ID với enhanced data options
     * @param workoutId - ID của workout cần lấy
     * @param options - Options để include thêm data
     * @returns Single workout với populated data
     */
    static async getWorkoutById(
        workoutId: string,
        options: {
            includeUserData?: boolean;
            includeExerciseData?: boolean;
            includeAnalytics?: boolean;
        } = {}
    ): Promise<Workout | null> {
        try {
            const {
                includeUserData = false,
                includeExerciseData = false,
                includeAnalytics = false
            } = options;

            // Build query with populate
            const populateFields: any[] = [];

            if (includeUserData) {
                populateFields.push({
                    path: 'userId',
                    select: '-password'
                });
            }

            if (includeExerciseData) {
                populateFields.push({
                    path: 'exercises.exerciseId'
                    // Không dùng select để lấy toàn bộ dữ liệu exercise
                });
            }


            // Execute query
            const workoutDoc = await WorkoutModel.findById(workoutId).populate(populateFields).exec();
            if (!workoutDoc) {
                return null;
            }

            // Convert to plain JS object
            const workout = workoutDoc.toObject();

            // --- Populate exerciseInfo for each exercise if includeExerciseData ---
            let exercises = Array.isArray(workout.exercises) ? workout.exercises.map((ex: any) => ({ ...ex })) : [];
            if (includeExerciseData && Array.isArray(exercises)) {
                exercises = exercises.map((ex: any) => {
                    // Nếu đã populate, exerciseId là object, trả về toàn bộ object (loại bỏ __v nếu muốn)
                    let exerciseInfo = null;
                    if (ex.exerciseId && typeof ex.exerciseId === 'object' && ex.exerciseId._id) {
                        // Convert to plain object nếu là Mongoose Document
                        let e = ex.exerciseId.toObject ? ex.exerciseId.toObject() : ex.exerciseId;
                        // Optionally loại bỏ các trường không cần thiết
                        if ('__v' in e) delete e.__v;
                        exerciseInfo = {
                            ...e,
                            _id: e._id?.toString?.() || e._id
                        };
                    }
                    return {
                        ...ex,
                        exerciseId: typeof ex.exerciseId === 'object' && ex.exerciseId._id ? ex.exerciseId._id.toString() : ex.exerciseId,
                        exerciseInfo
                    };
                });
            }

            // --- Populate authorInfo if includeUserData ---

            let authorInfo = undefined;
            if (
                includeUserData &&
                workout.userId &&
                typeof workout.userId === 'object' &&
                // Check if userId is a populated user object (not just ObjectId)
                ('username' in workout.userId || 'profile' in workout.userId)
            ) {
                const u: any = workout.userId;
                authorInfo = {
                    _id: u._id?.toString?.() || u._id,
                    username: u.username || '',
                    fullName: `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim(),
                    avatar: u.profile?.avatar || '',
                    experienceLevel: u.profile?.experienceLevel || '',
                    isEmailVerified: u.isEmailVerified ?? false
                };
            }

            // Build result object for client

            const result = {
                _id: workout._id?.toString?.() || workout._id,
                userId:
                    typeof workout.userId === 'object' && '_id' in workout.userId
                        ? (workout.userId._id?.toString?.() || workout.userId._id)
                        : workout.userId,
                name: workout.name,
                description: workout.description,
                thumbnail: workout.thumbnail,
                category: workout.category,
                difficulty: workout.difficulty,
                estimatedDuration: workout.estimatedDuration,
                tags: workout.tags || [],
                isPublic: workout.isPublic,
                exercises,
                isSponsored: workout.isSponsored,
                sponsorData: workout.sponsorData,
                likes: workout.likes || [],
                likeCount: workout.likeCount || 0,
                saves: workout.saves || [],
                saveCount: workout.saveCount || 0,
                shares: workout.shares || 0,
                views: workout.views || 0,
                completions: workout.completions || 0,
                averageRating: workout.averageRating || 0,
                totalRatings: workout.totalRatings || 0,
                muscleGroups: workout.muscleGroups || [],
                equipment: workout.equipment || [],
                caloriesBurned: workout.caloriesBurned || 0,
                createdAt: workout.createdAt,
                updatedAt: workout.updatedAt,
                ...(authorInfo ? { authorInfo } : {})
            };

            // Increment view count if analytics enabled
            if (includeAnalytics) {
                await WorkoutModel.findByIdAndUpdate(
                    workoutId,
                    { $inc: { views: 1 } },
                    { new: false }
                );
            }

            return result as Workout;

        } catch (error) {
            console.error('Error fetching workout by ID:', error);
            throw new Error(`Failed to fetch workout: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get user workout statistics and analytics
     * @param userId User ID to get stats for
     * @returns User workout statistics
     */
    static async getUserWorkoutStats(userId: string): Promise<{
        totalWorkouts: number;
        totalDuration: number;
        totalExercises: number;
        averageRating: number;
        totalLikes: number;
        totalSaves: number;
        totalViews: number;
        totalCompletions: number;
        byCategory: Record<string, number>;
        byDifficulty: Record<string, number>;
        recentActivity: {
            lastWorkoutDate: Date | null;
            workoutsThisWeek: number;
            workoutsThisMonth: number;
        };
    }> {
        try {
            // Validate userId
            if (!userId) {
                throw new Error('User ID is required');
            }

            // Get all user workouts for aggregation
            const aggregationPipeline = [
                {
                    $match: { userId: new mongoose.Types.ObjectId(userId) }
                },
                {
                    $group: {
                        _id: null,
                        totalWorkouts: { $sum: 1 },
                        totalDuration: { $sum: '$estimatedDuration' },
                        totalExercises: { $sum: { $size: '$exercises' } },
                        totalLikes: { $sum: '$likeCount' },
                        totalSaves: { $sum: '$saveCount' },
                        totalViews: { $sum: '$views' },
                        totalCompletions: { $sum: '$completions' },
                        totalRatings: { $sum: '$totalRatings' },
                        averageRatingSum: { $sum: { $multiply: ['$averageRating', '$totalRatings'] } },
                        categories: { $push: '$category' },
                        difficulties: { $push: '$difficulty' },
                        lastWorkout: { $max: '$createdAt' }
                    }
                }
            ];

            const result = await WorkoutModel.aggregate(aggregationPipeline);
            const stats = result[0] || {
                totalWorkouts: 0,
                totalDuration: 0,
                totalExercises: 0,
                totalLikes: 0,
                totalSaves: 0,
                totalViews: 0,
                totalCompletions: 0,
                totalRatings: 0,
                averageRatingSum: 0,
                categories: [],
                difficulties: [],
                lastWorkout: null
            };

            // Calculate average rating
            const averageRating = stats.totalRatings > 0
                ? Number((stats.averageRatingSum / stats.totalRatings).toFixed(1))
                : 0;

            // Count by category
            const byCategory: Record<string, number> = {};
            stats.categories.forEach((category: string) => {
                byCategory[category] = (byCategory[category] || 0) + 1;
            });

            // Count by difficulty
            const byDifficulty: Record<string, number> = {};
            stats.difficulties.forEach((difficulty: string) => {
                byDifficulty[difficulty] = (byDifficulty[difficulty] || 0) + 1;
            });

            // Recent activity calculations
            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            const [workoutsThisWeek, workoutsThisMonth] = await Promise.all([
                WorkoutModel.countDocuments({
                    userId: new mongoose.Types.ObjectId(userId),
                    createdAt: { $gte: weekAgo }
                }),
                WorkoutModel.countDocuments({
                    userId: new mongoose.Types.ObjectId(userId),
                    createdAt: { $gte: monthAgo }
                })
            ]);

            return {
                totalWorkouts: stats.totalWorkouts,
                totalDuration: stats.totalDuration,
                totalExercises: stats.totalExercises,
                averageRating,
                totalLikes: stats.totalLikes,
                totalSaves: stats.totalSaves,
                totalViews: stats.totalViews,
                totalCompletions: stats.totalCompletions,
                byCategory,
                byDifficulty,
                recentActivity: {
                    lastWorkoutDate: stats.lastWorkout,
                    workoutsThisWeek,
                    workoutsThisMonth
                }
            };

        } catch (error) {
            console.error('Error getting user workout stats:', error);
            throw new Error(`Failed to get workout stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get user's workouts for MyWorkout page with enhanced data
     */
    static async getMyWorkouts(
        userId: string,
        params: {
            page?: number;
            limit?: number;
            category?: string;
            difficulty?: string;
            search?: string;
        }
    ): Promise<PaginatedResult<Workout & {
        sponsorData?: any;
        reviewStats?: {
            averageRating: number;
            totalReviews: number;
        };
        isLiked?: boolean;
        isSaved?: boolean;
    }>> {
        try {
            const { page = 1, limit = 12, category, difficulty, search } = params;
            const skip = (page - 1) * limit;

            // Build query
            const query: any = { userId: new mongoose.Types.ObjectId(userId) };

            if (category) {
                query.category = category;
            }

            if (difficulty) {
                query.difficulty = difficulty;
            }

            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } }
                ];
            }

            // Get workouts with enhanced data
            const workouts = await WorkoutModel.find(query)
                .populate('exercises.exerciseId', 'name category muscleGroups')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const totalWorkouts = await WorkoutModel.countDocuments(query);

            // Enhanced workouts with sponsor and review data
            const enhancedWorkouts = await Promise.all(
                workouts.map(async (workout) => {
                    // Get sponsor data if sponsored
                    let sponsorData = null;
                    // if (workout.isSponsored && workout.sponsorId) {
                    //     // Giả sử có SponsoredContentModel
                    //     sponsorData = await SponsoredContentModel.findById(workout.sponsorId);
                    // }

                    // Get review stats
                    // const reviewStats = await ReviewModel.aggregate([
                    //     { $match: { targetType: 'workout', targetId: workout._id } },
                    //     {
                    //         $group: {
                    //             _id: null,
                    //             averageRating: { $avg: '$rating.overall' },
                    //             totalReviews: { $sum: 1 }
                    //         }
                    //     }
                    // ]);

                    return {
                        ...workout,
                        sponsorData,
                        reviewStats: {
                            averageRating: 0, // reviewStats[0]?.averageRating || 0,
                            totalReviews: 0 // reviewStats[0]?.totalReviews || 0
                        },
                        isLiked: workout.likes?.includes(userId) || false,
                        isSaved: workout.saves?.includes(userId) || false
                    };
                })
            );

            return {
                data: enhancedWorkouts as any,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalWorkouts / limit),
                    totalItems: totalWorkouts,
                    itemsPerPage: limit,
                    hasNextPage: page < Math.ceil(totalWorkouts / limit),
                    hasPrevPage: page > 1
                }
            };

        } catch (error) {
            console.error('Error getting user workouts:', error);
            throw new Error(`Failed to get user workouts: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get user's workout statistics - alias for getUserWorkoutStats for MyWorkout page
     */
    static async getMyWorkoutStats(userId: string) {
        return await this.getUserWorkoutStats(userId);
    }

    /**
     * Toggle like status on workout
     */
    static async toggleLike(workoutId: string, userId: string) {
        // try {
        //     const workout = await WorkoutModel.findById(workoutId);

        //     if (!workout) {
        //         throw new Error('Workout not found');
        //     }

        //     const userObjectId = new mongoose.Types.ObjectId(userId);
        //     const isCurrentlyLiked = workout.likes?.some(id => id.equals(userObjectId));

        //     if (isCurrentlyLiked) {
        //         // Unlike
        //         workout.likes = workout.likes?.filter(id => !id.equals(userObjectId)) || [];
        //         workout.likeCount = Math.max((workout.likeCount || 0) - 1, 0);
        //     } else {
        //         // Like
        //         workout.likes = workout.likes || [];
        //         workout.likes.push(userObjectId);
        //         workout.likeCount = (workout.likeCount || 0) + 1;
        //     }

        //     await workout.save();

        //     return {
        //         isLiked: !isCurrentlyLiked,
        //         likeCount: workout.likeCount || 0
        //     };

        // } catch (error) {
        //     console.error('Error toggling like:', error);
        //     throw new Error(`Failed to toggle like: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // }
    }

    /**
     * Toggle save status on workout
     */
    static async toggleSave(workoutId: string, userId: string) {
        // try {
        //     const workout = await WorkoutModel.findById(workoutId);

        //     if (!workout) {
        //         throw new Error('Workout not found');
        //     }

        //     const userObjectId = new mongoose.Types.ObjectId(userId);
        //     const isCurrentlySaved = workout.saves?.some(id => id.equals(userObjectId));

        //     if (isCurrentlySaved) {
        //         // Unsave
        //         workout.saves = workout.saves?.filter(id => !id.equals(userObjectId)) || [];
        //         workout.saveCount = Math.max((workout.saveCount || 0) - 1, 0);
        //     } else {
        //         // Save
        //         workout.saves = workout.saves || [];
        //         workout.saves.push(userObjectId);
        //         workout.saveCount = (workout.saveCount || 0) + 1;
        //     }

        //     await workout.save();

        //     return {
        //         isSaved: !isCurrentlySaved,
        //         saveCount: workout.saveCount || 0
        //     };

        // } catch (error) {
        //     console.error('Error toggling save:', error);
        //     throw new Error(`Failed to toggle save: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // }
    }

    /**
     * Duplicate workout for user
     */
    static async duplicateWorkout(workoutId: string, userId: string): Promise<Workout> {
        try {
            const originalWorkout = await WorkoutModel.findById(workoutId)
                .populate('exercises.exerciseId')
                .lean();

            if (!originalWorkout) {
                throw new Error('Workout not found');
            }

            // Create duplicate workout
            const duplicateData = {
                ...originalWorkout,
                _id: undefined,
                name: `${originalWorkout.name} (Copy)`,
                userId: new mongoose.Types.ObjectId(userId),
                isPublic: false, // Make copy private by default
                likes: [],
                saves: [],
                likeCount: 0,
                saveCount: 0,
                views: 0,
                completions: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const duplicatedWorkout = new WorkoutModel(duplicateData);
            await duplicatedWorkout.save();

            // Populate exercise data for response
            await duplicatedWorkout.populate('exercises.exerciseId', 'name category muscleGroups');

            return duplicatedWorkout.toObject() as Workout;

        } catch (error) {
            console.error('Error duplicating workout:', error);
            throw new Error(`Failed to duplicate workout: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}