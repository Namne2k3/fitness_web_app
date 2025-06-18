/**
 * 🏋️ Workout Routes
 * Express routes cho workout-related endpoints với advanced filtering
 */

import { Router } from 'express';
import { WorkoutController } from '../controllers/WorkoutController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: Workout management and discovery API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WorkoutFilters:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           enum: [strength, cardio, flexibility, hiit, crosstraining, sports, recovery]
 *           description: Workout category filter
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Difficulty level filter
 *         includePrivate:
 *           type: boolean
 *           default: false
 *           description: Include private workouts (for authenticated users)
 *         duration:
 *           type: object
 *           properties:
 *             min:
 *               type: number
 *               minimum: 5
 *               description: Minimum duration in minutes
 *             max:
 *               type: number
 *               maximum: 300
 *               description: Maximum duration in minutes
 *         equipment:
 *           oneOf:
 *             - type: string
 *             - type: array
 *               items:
 *                 type: string
 *           description: Required equipment filter
 *         muscleGroups:
 *           oneOf:
 *             - type: string
 *             - type: array
 *               items:
 *                 type: string
 *           description: Target muscle groups filter
 *         search:
 *           type: string
 *           maxLength: 100
 *           description: Text search in workout name and description
 *         isSponsored:
 *           type: boolean
 *           description: Filter sponsored content
 *         userId:
 *           type: string
 *           description: Filter workouts by specific user
 *         minRating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Minimum average rating
 *         tags:
 *           oneOf:
 *             - type: string
 *             - type: array
 *               items:
 *                 type: string
 *           description: Workout tags filter
 *     
 *     WorkoutListRequest:
 *       type: object
 *       properties:
 *         page:
 *           type: number
 *           minimum: 1
 *           default: 1
 *           description: Page number for pagination
 *         limit:
 *           type: number
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           description: Number of items per page
 *         filters:
 *           $ref: '#/components/schemas/WorkoutFilters'
 *         sort:
 *           type: object
 *           properties:
 *             field:
 *               type: string
 *               enum: [createdAt, likeCount, views, averageRating, difficulty, estimatedDuration, name]
 *               default: createdAt
 *             order:
 *               type: string
 *               enum: [asc, desc]
 *               default: desc
 *         options:
 *           type: object
 *           properties:
 *             includeUserData:
 *               type: boolean
 *               default: false
 *               description: Include author information
 *             includeExerciseData:
 *               type: boolean
 *               default: false
 *               description: Include exercise details in workout
 *     
 *     WorkoutExercise:
 *       type: object
 *       properties:
 *         exerciseId:
 *           type: string
 *           description: Reference to Exercise document
 *         order:
 *           type: number
 *           description: Sequence in workout
 *         sets:
 *           type: number
 *           minimum: 1
 *         reps:
 *           type: number
 *           minimum: 1
 *         duration:
 *           type: number
 *           description: Duration in seconds for time-based exercises
 *         weight:
 *           type: number
 *           description: Weight in kg
 *         restTime:
 *           type: number
 *           description: Rest time in seconds
 *         notes:
 *           type: string
 *           maxLength: 200
 *         completed:
 *           type: boolean
 *           default: false
 *         exerciseInfo:
 *           type: object
 *           description: Populated exercise information (when includeExerciseData=true)
 *           properties:
 *             name:
 *               type: string
 *             category:
 *               type: string
 *             primaryMuscleGroups:
 *               type: array
 *               items:
 *                 type: string
 *             equipment:
 *               type: array
 *               items:
 *                 type: string
 *             difficulty:
 *               type: string
 *     
 *     Workout:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         name:
 *           type: string
 *           maxLength: 100
 *         description:
 *           type: string
 *           maxLength: 500
 *         category:
 *           type: string
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         estimatedDuration:
 *           type: number
 *           description: Duration in minutes
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         isPublic:
 *           type: boolean
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WorkoutExercise'
 *         isSponsored:
 *           type: boolean
 *         sponsorData:
 *           type: object
 *           properties:
 *             sponsorId:
 *               type: string
 *             campaignId:
 *               type: string
 *             rate:
 *               type: number
 *             type:
 *               type: string
 *               enum: [review, guide, promotion]
 *             disclosure:
 *               type: string
 *         likeCount:
 *           type: number
 *         saveCount:
 *           type: number
 *         shares:
 *           type: number
 *         views:
 *           type: number
 *         completions:
 *           type: number
 *         averageRating:
 *           type: number
 *         totalRatings:
 *           type: number
 *         muscleGroups:
 *           type: array
 *           items:
 *             type: string
 *         equipment:
 *           type: array
 *           items:
 *             type: string
 *         caloriesBurned:
 *           type: number
 *         authorInfo:
 *           type: object
 *           description: Author information (when includeUserData=true)
 *           properties:
 *             username:
 *               type: string
 *             fullName:
 *               type: string
 *             avatar:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     PaginatedWorkoutResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout'
 *             pagination:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 totalItems:
 *                   type: number
 *                 itemsPerPage:
 *                   type: number
 *                 hasNextPage:
 *                   type: boolean
 *                 hasPrevPage:
 *                   type: boolean
 *             filters:
 *               $ref: '#/components/schemas/WorkoutFilters'
 *             sort:
 *               type: object
 *               properties:
 *                 field:
 *                   type: string
 *                 order:
 *                   type: string
 *         message:
 *           type: string
 *           example: "Workouts retrieved successfully"
 */

/**
 * @swagger
 * /workouts/list:
 *   post:
 *     summary: Get workouts with advanced filtering and pagination
 *     tags: [Workouts]
 *     description: |
 *       Retrieve workouts with comprehensive filtering, sorting, and pagination capabilities.
 *       Supports text search, category filtering, difficulty levels, equipment requirements,
 *       muscle group targeting, and more. Can include author and exercise details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutListRequest'
 *           examples:
 *             basic_request:
 *               summary: Basic workout listing
 *               value:
 *                 page: 1
 *                 limit: 10
 *                 sort:
 *                   field: "createdAt"
 *                   order: "desc"
 *             filtered_request:
 *               summary: Filtered workout search
 *               value:
 *                 page: 1
 *                 limit: 20
 *                 filters:
 *                   category: "strength"
 *                   difficulty: "intermediate"
 *                   duration:
 *                     min: 30
 *                     max: 60
 *                   muscleGroups: ["chest", "shoulders"]
 *                   equipment: "dumbbells"
 *                   minRating: 4.0
 *                   search: "upper body"
 *                 sort:
 *                   field: "averageRating"
 *                   order: "desc"
 *                 options:
 *                   includeUserData: true
 *                   includeExerciseData: true
 *             sponsored_content:
 *               summary: Sponsored workout content
 *               value:
 *                 page: 1
 *                 limit: 15
 *                 filters:
 *                   isSponsored: true
 *                   category: "cardio"
 *                 sort:
 *                   field: "views"
 *                   order: "desc"
 *             user_workouts:
 *               summary: User-specific workouts
 *               value:
 *                 page: 1
 *                 limit: 10
 *                 filters:
 *                   userId: "507f1f77bcf86cd799439011"
 *                   includePrivate: true
 *                 sort:
 *                   field: "createdAt"
 *                   order: "desc"
 *                 options:
 *                   includeExerciseData: true
 *     responses:
 *       200:
 *         description: Workouts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedWorkoutResponse'
 *             examples:
 *               success_response:
 *                 summary: Successful workout retrieval
 *                 value:
 *                   success: true
 *                   data:
 *                     data:
 *                       - _id: "507f1f77bcf86cd799439011"
 *                         userId: "507f1f77bcf86cd799439012"
 *                         name: "Upper Body Strength Training"
 *                         description: "Comprehensive upper body workout targeting chest, shoulders, and arms"
 *                         category: "strength"
 *                         difficulty: "intermediate"
 *                         estimatedDuration: 45
 *                         tags: ["strength", "upper-body", "muscle-building"]
 *                         isPublic: true
 *                         exercises:
 *                           - exerciseId: "507f1f77bcf86cd799439013"
 *                             order: 1
 *                             sets: 3
 *                             reps: 12
 *                             weight: 20
 *                             restTime: 60
 *                             exerciseInfo:
 *                               name: "Dumbbell Bench Press"
 *                               category: "strength"
 *                               primaryMuscleGroups: ["chest", "shoulders", "triceps"]
 *                               equipment: ["dumbbells", "bench"]
 *                               difficulty: "intermediate"
 *                         isSponsored: false
 *                         likeCount: 127
 *                         saveCount: 45
 *                         views: 1250
 *                         averageRating: 4.5
 *                         totalRatings: 89
 *                         muscleGroups: ["chest", "shoulders", "triceps"]
 *                         equipment: ["dumbbells", "bench"]
 *                         caloriesBurned: 220
 *                         authorInfo:
 *                           username: "fitness_coach_john"
 *                           fullName: "John Smith"
 *                           avatar: "https://res.cloudinary.com/demo/image/upload/v1234567890/avatars/john.jpg"
 *                         createdAt: "2024-01-15T10:30:00.000Z"
 *                         updatedAt: "2024-01-20T14:22:00.000Z"
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 15
 *                       totalItems: 147
 *                       itemsPerPage: 10
 *                       hasNextPage: true
 *                       hasPrevPage: false
 *                     filters:
 *                       category: "strength"
 *                       difficulty: "intermediate"
 *                     sort:
 *                       field: "averageRating"
 *                       order: "desc"
 *                   message: "Workouts retrieved successfully"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Invalid pagination parameters: page must be >= 1"
 *               data: null
 *       401:
 *         description: Authentication required for private content access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Authentication required to access private workouts"
 *               data: null
 *       422:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               success: false
 *               error: "Validation failed"
 *               data: null
 *               errors:
 *                 limit: "Limit must be between 1 and 100"
 *                 "filters.duration.min": "Duration minimum must be at least 5 minutes"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Failed to retrieve workouts"
 *               data: null
 */
router.post('/list', WorkoutController.getWorkouts);

export default router;