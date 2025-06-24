/**
 * 🏋️ Workout Service
 * Business logic cho workout operations với advanced filtering và pagination
 */

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
}