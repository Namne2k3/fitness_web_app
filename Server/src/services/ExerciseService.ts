/**
 * 💪 Exercise Service
 * Business logic cho exercise operations với advanced filtering và pagination
 */

import { ExerciseModel, IExercise } from '../models/Exercise';
import { UserModel } from '../models/User';
import { FilterExercise } from '../controllers/ExerciseController';
import {
    Exercise,
    PaginatedResult
} from '../types';

export class ExerciseService {
    /**
     * Get exercises với advanced filtering, sorting và pagination
     * @param params Filter parameters từ controller
     * @returns Paginated exercise results
     */
    static async getExercises(params: FilterExercise): Promise<PaginatedResult<Exercise>> {
        try {
            const {
                page = 1,
                limit = 20,
                filters = {},
                sort = { field: 'name', order: 'asc' },
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

            // Approval filter (default to approved only)
            if (filters.isApproved !== undefined) {
                query.isApproved = filters.isApproved;
            } else {
                query.isApproved = true; // Default: only show approved exercises
            }

            // Creator filter
            if (filters.createdBy) {
                query.createdBy = filters.createdBy;
            }

            // Primary muscle groups filter
            if (filters.primaryMuscleGroups) {
                const muscleGroupsArray = Array.isArray(filters.primaryMuscleGroups)
                    ? filters.primaryMuscleGroups
                    : [filters.primaryMuscleGroups];
                query.primaryMuscleGroups = { $in: muscleGroupsArray };
            }

            // Secondary muscle groups filter
            if (filters.secondaryMuscleGroups) {
                const secondaryMuscleGroupsArray = Array.isArray(filters.secondaryMuscleGroups)
                    ? filters.secondaryMuscleGroups
                    : [filters.secondaryMuscleGroups];
                query.secondaryMuscleGroups = { $in: secondaryMuscleGroupsArray };
            }

            // Equipment filter
            if (filters.equipment) {
                const equipmentArray = Array.isArray(filters.equipment)
                    ? filters.equipment
                    : [filters.equipment];
                query.equipment = { $in: equipmentArray };
            }

            // Calories per minute range filter
            if (filters.caloriesRange) {
                const caloriesQuery: any = {};
                if (filters.caloriesRange.min !== undefined) {
                    caloriesQuery.$gte = filters.caloriesRange.min;
                }
                if (filters.caloriesRange.max !== undefined) {
                    caloriesQuery.$lte = filters.caloriesRange.max;
                }
                if (Object.keys(caloriesQuery).length > 0) {
                    query.caloriesPerMinute = caloriesQuery;
                }
            }

            // Intensity range filter
            if (filters.intensityRange) {
                const intensityQuery: any = {};
                if (filters.intensityRange.min !== undefined) {
                    intensityQuery.$gte = filters.intensityRange.min;
                }
                if (filters.intensityRange.max !== undefined) {
                    intensityQuery.$lte = filters.intensityRange.max;
                }
                if (Object.keys(intensityQuery).length > 0) {
                    query.averageIntensity = intensityQuery;
                }
            }

            // Search filter (text search)
            if (filters.search) {
                query.$text = { $search: filters.search };
            }

            // ================================
            // 📊 Build Sort Options
            // ================================
            const sortOptions: any = {};

            // Handle sorting
            switch (sort.field) {
                case 'name':
                    sortOptions.name = sort.order === 'asc' ? 1 : -1;
                    break;
                case 'difficulty':
                    sortOptions.difficulty = sort.order === 'asc' ? 1 : -1;
                    break;
                case 'category':
                    sortOptions.category = sort.order === 'asc' ? 1 : -1;
                    break;
                case 'caloriesPerMinute':
                    sortOptions.caloriesPerMinute = sort.order === 'asc' ? 1 : -1;
                    break;
                case 'averageIntensity':
                    sortOptions.averageIntensity = sort.order === 'asc' ? 1 : -1;
                    break;
                case 'createdAt':
                    sortOptions.createdAt = sort.order === 'asc' ? 1 : -1;
                    break;
                case 'updatedAt':
                    sortOptions.updatedAt = sort.order === 'asc' ? 1 : -1;
                    break;
                default:
                    sortOptions.name = 1; // Default sort by name ascending
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
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'creator',
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
            const result = await ExerciseModel.aggregate(aggregationPipeline);

            // ================================
            // 📊 Process Results
            // ================================
            const exercises = result[0]?.data || [];
            const totalItems = result[0]?.totalCount[0]?.count || 0;
            const totalPages = Math.ceil(totalItems / limit);

            // Post-process exercises để thêm virtual fields nếu cần
            const processedExercises = exercises.map((exercise: any) => {
                // Flatten creator data if included
                if (options.includeUserData && exercise.creator?.length > 0) {
                    exercise.creator = exercise.creator[0];
                } else if (options.includeUserData) {
                    exercise.creator = null;
                }

                return exercise;
            });

            // ================================
            // 📦 Return Paginated Result
            // ================================
            return {
                data: processedExercises,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                filters: filters, // Return applied filters
                sort: sort // Return applied sort
            };

        } catch (error) {
            console.error('Error in ExerciseService.getExercises:', error);
            throw error;
        }
    }
}