/**
 * 💪 Exercise Repository
 * Data access layer cho Exercise operations
 */

import mongoose from 'mongoose';
import { ExerciseModel, IExercise } from '../models/Exercise';
import { PaginatedResult } from '../types';
import { FilterExercise } from '../controllers/ExerciseController';

export class ExerciseRepository {
    /**
     * Find exercises với advanced filtering và pagination
     */
    static async findExercises(params: FilterExercise): Promise<PaginatedResult<IExercise>> {
        const {
            page = 1,
            limit = 10,
            filters = {},
            sort = { field: 'name', order: 'asc' },
            options = {}
        } = params;

        // Build MongoDB Query
        const query: any = {};

        // Basic filters
        if (filters.category) {
            query.category = { $in: Array.isArray(filters.category) ? filters.category : [filters.category] };
        }

        if (filters.difficulty) {
            query.difficulty = { $in: Array.isArray(filters.difficulty) ? filters.difficulty : [filters.difficulty] };
        }

        // Approval filter (default to approved only)
        if (filters.isApproved !== undefined) {
            query.isApproved = filters.isApproved;
        } else {
            query.isApproved = true;
        }

        // Creator filter
        if (filters.createdBy) {
            query.createdBy = new mongoose.Types.ObjectId(filters.createdBy);
        }

        // Primary muscle groups filter
        if (filters.primaryMuscleGroups) {
            query.primaryMuscleGroups = {
                $in: Array.isArray(filters.primaryMuscleGroups)
                    ? filters.primaryMuscleGroups
                    : [filters.primaryMuscleGroups]
            };
        }

        // Secondary muscle groups filter
        if (filters.secondaryMuscleGroups) {
            query.secondaryMuscleGroups = {
                $in: Array.isArray(filters.secondaryMuscleGroups)
                    ? filters.secondaryMuscleGroups
                    : [filters.secondaryMuscleGroups]
            };
        }

        // Equipment filter
        if (filters.equipment) {
            query.equipment = {
                $in: Array.isArray(filters.equipment) ? filters.equipment : [filters.equipment]
            };
        }

        // Calories per minute range filter
        if (filters.caloriesRange) {
            query.caloriesPerMinute = {
                $gte: filters.caloriesRange.min || 0,
                $lte: filters.caloriesRange.max || 1000
            };
        }

        // Intensity range filter
        if (filters.intensityRange) {
            query.averageIntensity = {
                $gte: filters.intensityRange.min || 1,
                $lte: filters.intensityRange.max || 10
            };
        }

        // Enhanced Search Logic với Partial Matching
        if (filters.search) {
            const searchTerm = filters.search.trim();
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { instructions: { $elemMatch: { $regex: searchTerm, $options: 'i' } } },
                { primaryMuscleGroups: { $elemMatch: { $regex: searchTerm, $options: 'i' } } },
                { secondaryMuscleGroups: { $elemMatch: { $regex: searchTerm, $options: 'i' } } },
                { equipment: { $elemMatch: { $regex: searchTerm, $options: 'i' } } }
            ];
        }

        // Build Sort Options
        const sortOptions: any = {};

        // Handle sorting
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
            case 'caloriesPerMinute':
                sortOptions.caloriesPerMinute = sort.order === 'desc' ? -1 : 1;
                break;
            case 'averageIntensity':
                sortOptions.averageIntensity = sort.order === 'desc' ? -1 : 1;
                break;
            case 'createdAt':
                sortOptions.createdAt = sort.order === 'desc' ? -1 : 1;
                break;
            default:
                sortOptions.name = 1;
        }

        // Pagination Setup
        const skip = (page - 1) * limit;

        // Execute Query với Aggregation Pipeline
        const aggregationPipeline: any[] = [
            { $match: query },
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
        const result = await ExerciseModel.aggregate(aggregationPipeline);

        // Process Results
        const exercises = result[0]?.data || [];
        const totalItems = result[0]?.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: exercises,
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
     * Find exercise by ID
     */
    static async findById(id: string): Promise<IExercise | null> {
        return await ExerciseModel.findById(id);
    }

    /**
     * Find exercise by slug
     */
    static async findBySlug(slug: string): Promise<IExercise | null> {
        return await ExerciseModel.findOne({ slug });
    }

    /**
     * Create new exercise
     */
    static async create(exerciseData: any): Promise<IExercise> {
        const exercise = new ExerciseModel(exerciseData);
        return await exercise.save();
    }

    /**
     * Update exercise by ID
     */
    static async updateById(id: string, updateData: any): Promise<IExercise | null> {
        return await ExerciseModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    /**
     * Delete exercise by ID
     */
    static async deleteById(id: string): Promise<boolean> {
        const result = await ExerciseModel.findByIdAndDelete(id);
        return result !== null;
    }

    /**
     * Count exercises with filters
     */
    static async count(filters: any = {}): Promise<number> {
        return await ExerciseModel.countDocuments(filters);
    }

    /**
     * Find exercises by multiple IDs
     */
    static async findByIds(ids: string[]): Promise<IExercise[]> {
        const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
        return await ExerciseModel.find({ _id: { $in: objectIds } });
    }

    /**
     * Find exercises by category
     */
    static async findByCategory(category: string): Promise<IExercise[]> {
        return await ExerciseModel.find({ category, isApproved: true });
    }

    /**
     * Find exercises by muscle groups
     */
    static async findByMuscleGroups(muscleGroups: string[]): Promise<IExercise[]> {
        return await ExerciseModel.find({
            $or: [
                { primaryMuscleGroups: { $in: muscleGroups } },
                { secondaryMuscleGroups: { $in: muscleGroups } }
            ],
            isApproved: true
        });
    }

    /**
     * Find exercises by equipment
     */
    static async findByEquipment(equipment: string[]): Promise<IExercise[]> {
        return await ExerciseModel.find({
            equipment: { $in: equipment },
            isApproved: true
        });
    }
}
