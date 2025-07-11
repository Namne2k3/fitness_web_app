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
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       properties:
 *         exerciseId:
 *           type: string
 *           description: Reference to Exercise document
 *         order:
 *           type: number
 *           description: Sequence order in workout
 *         sets:
 *           type: number
 *           description: Number of sets
 *         reps:
 *           type: number
 *           description: Number of repetitions per set
 *         duration:
 *           type: number
 *           description: Duration in seconds for time-based exercises
 *         weight:
 *           type: number
 *           description: Weight in kg
 *         restTime:
 *           type: number
 *           description: Rest time between sets in seconds
 *         notes:
 *           type: string
 *           description: Additional notes for the exercise
 *         completed:
 *           type: boolean
 *           description: Whether exercise is completed
 *       required:
 *         - exerciseId
 *         - sets
 * 
 *     Workout:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Workout unique identifier
 *         userId:
 *           type: string
 *           description: Owner user ID
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Workout name
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Workout description
 *         category:
 *           type: string
 *           enum: [strength, cardio, flexibility, sports, martial_arts, yoga, pilates, crossfit, hiit, bodyweight]
 *           description: Workout category
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Difficulty level
 *         estimatedDuration:
 *           type: number
 *           description: Estimated duration in minutes
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Workout tags for categorization
 *         isPublic:
 *           type: boolean
 *           description: Whether workout is public
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *           description: Array of exercises in workout
 *         isSponsored:
 *           type: boolean
 *           description: Whether workout contains sponsored content
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
 *         muscleGroups:
 *           type: array
 *           items:
 *             type: string
 *           description: Targeted muscle groups
 *         equipment:
 *           type: array
 *           items:
 *             type: string
 *           description: Required equipment
 *         caloriesBurned:
 *           type: number
 *           description: Estimated calories burned
 *         likeCount:
 *           type: number
 *           description: Number of likes
 *         saveCount:
 *           type: number
 *           description: Number of saves
 *         views:
 *           type: number
 *           description: Number of views
 *         averageRating:
 *           type: number
 *           description: Average rating from reviews
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - description
 *         - category
 *         - difficulty
 *         - estimatedDuration
 *         - exercises
 * 
 *     WorkoutFilter:
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
 *           type: object
 *           properties:
 *             category:
 *               type: string
 *               enum: [strength, cardio, flexibility, sports, martial_arts, yoga, pilates, crossfit, hiit, bodyweight]
 *               description: Filter by workout category
 *             difficulty:
 *               type: string
 *               enum: [beginner, intermediate, advanced]
 *               description: Filter by difficulty level
 *             includePrivate:
 *               type: boolean
 *               default: false
 *               description: Include private workouts (requires authentication)
 *             duration:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   description: Minimum duration in minutes
 *                 max:
 *                   type: number
 *                   description: Maximum duration in minutes
 *             equipment:
 *               oneOf:
 *                 - type: string
 *                 - type: array
 *                   items:
 *                     type: string
 *               description: Filter by required equipment
 *             muscleGroups:
 *               oneOf:
 *                 - type: string
 *                 - type: array
 *                   items:
 *                     type: string
 *               description: Filter by targeted muscle groups
 *             search:
 *               type: string
 *               description: Text search in workout name, description, and tags
 *             isSponsored:
 *               type: boolean
 *               description: Filter sponsored/non-sponsored content
 *             userId:
 *               type: string
 *               description: Filter workouts by specific user
 *             minRating:
 *               type: number
 *               minimum: 1
 *               maximum: 5
 *               description: Minimum average rating
 *             tags:
 *               oneOf:
 *                 - type: string
 *                 - type: array
 *                   items:
 *                     type: string
 *               description: Filter by tags
 *         sort:
 *           type: object
 *           properties:
 *             field:
 *               type: string
 *               enum: [createdAt, updatedAt, name, difficulty, estimatedDuration, likeCount, saveCount, views, averageRating]
 *               default: createdAt
 *               description: Field to sort by
 *             order:
 *               type: string
 *               enum: [asc, desc]
 *               default: desc
 *               description: Sort order
 *         options:
 *           type: object
 *           properties:
 *             includeUserData:
 *               type: boolean
 *               default: false
 *               description: Include user/author information
 *             includeExerciseData:
 *               type: boolean
 *               default: false
 *               description: Include detailed exercise information
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
 *               type: object
 *               description: Applied filters
 *             sort:
 *               type: object
 *               description: Applied sorting
 *         message:
 *           type: string
 *           example: "Workouts retrieved successfully"
 * 
 *     CreateWorkoutRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Workout name
 *           example: "Upper Body Strength Training"
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Workout description
 *           example: "A comprehensive upper body workout focusing on chest, shoulders, and arms"
 *         category:
 *           type: string
 *           enum: [strength, cardio, flexibility, sports, martial_arts, yoga, pilates, crossfit, hiit, bodyweight]
 *           description: Workout category
 *           example: "strength"
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Difficulty level
 *           example: "intermediate"
 *         estimatedDuration:
 *           type: number
 *           description: Estimated duration in minutes
 *           example: 45
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Workout tags
 *           example: ["upper-body", "strength", "gym"]
 *         isPublic:
 *           type: boolean
 *           description: Whether workout is public
 *           example: true
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *           description: Array of exercises
 *         muscleGroups:
 *           type: array
 *           items:
 *             type: string
 *           description: Targeted muscle groups
 *           example: ["chest", "shoulders", "triceps"]
 *         equipment:
 *           type: array
 *           items:
 *             type: string
 *           description: Required equipment
 *           example: ["barbell", "dumbbells", "bench"]
 *         caloriesBurned:
 *           type: number
 *           description: Estimated calories burned
 *           example: 350
 *         isSponsored:
 *           type: boolean
 *           description: Whether workout contains sponsored content
 *           example: false
 *         sponsorData:
 *           type: object
 *           description: Sponsor information (if isSponsored is true)
 *       required:
 *         - name
 *         - description
 *         - category
 *         - difficulty
 *         - estimatedDuration
 *         - exercises
 */

/**
 * @swagger
 * /workouts/list:
 *   post:
 *     summary: Get workouts with advanced filtering
 *     description: |
 *       Retrieve paginated list of workouts with advanced filtering, sorting, and search capabilities.
 *       Supports filtering by category, difficulty, duration, equipment, muscle groups, and more.
 *       Can include user data and detailed exercise information based on options.
 *     tags: [Workouts]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutFilter'
 *           examples:
 *             basic:
 *               summary: Basic pagination
 *               value:
 *                 page: 1
 *                 limit: 10
 *             filtered:
 *               summary: Filtered search
 *               value:
 *                 page: 1
 *                 limit: 20
 *                 filters:
 *                   category: "strength"
 *                   difficulty: "intermediate"
 *                   duration:
 *                     min: 30
 *                     max: 60
 *                   equipment: ["dumbbells", "barbell"]
 *                   search: "upper body"
 *                 sort:
 *                   field: "averageRating"
 *                   order: "desc"
 *                 options:
 *                   includeUserData: true
 *             sponsored:
 *               summary: Sponsored content only
 *               value:
 *                 page: 1
 *                 limit: 10
 *                 filters:
 *                   isSponsored: true
 *                   minRating: 4
 *                 sort:
 *                   field: "views"
 *                   order: "desc"
 *     responses:
 *       200:
 *         description: Workouts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedWorkoutResponse'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   success: true
 *                   data:
 *                     data:
 *                       - _id: "675a1234567890abcdef1234"
 *                         name: "Upper Body Strength Training"
 *                         description: "Comprehensive upper body workout"
 *                         category: "strength"
 *                         difficulty: "intermediate"
 *                         estimatedDuration: 45
 *                         likeCount: 12
 *                         averageRating: 4.5
 *                         createdAt: "2024-12-12T10:00:00Z"
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 5
 *                       totalItems: 48
 *                       itemsPerPage: 10
 *                       hasNextPage: true
 *                       hasPrevPage: false
 *                   message: "Workouts retrieved successfully"
 *       400:
 *         description: Bad request - Invalid filter parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Invalid filter parameters"
 *               data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/list', WorkoutController.getWorkouts);

/**
 * @swagger
 * /workouts/my-workouts:
 *   post:
 *     summary: Get user's personal workouts (My Workouts)
 *     description: |
 *       Retrieve paginated list of user's personal workouts with advanced filtering, sorting, and search capabilities.
 *       Supports filtering by category, difficulty, duration, equipment, muscle groups, and more.
 *       Can include user data and detailed exercise information based on options.
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutFilter'
 *           examples:
 *             basic:
 *               summary: Basic pagination
 *               value:
 *                 page: 1
 *                 limit: 10
 *             filtered:
 *               summary: Filtered search
 *               value:
 *                 page: 1
 *                 limit: 20
 *                 filters:
 *                   category: "strength"
 *                   difficulty: "intermediate"
 *                   duration:
 *                     min: 30
 *                     max: 60
 *                   equipment: ["dumbbells", "barbell"]
 *                   search: "upper body"
 *                 sort:
 *                   field: "averageRating"
 *                   order: "desc"
 *                 options:
 *                   includeUserData: true
 *             sponsored:
 *               summary: Sponsored content only
 *               value:
 *                 page: 1
 *                 limit: 10
 *                 filters:
 *                   isSponsored: true
 *                   minRating: 4
 *                 sort:
 *                   field: "views"
 *                   order: "desc"
 *     responses:
 *       200:
 *         description: User's workouts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedWorkoutResponse'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   success: true
 *                   data:
 *                     data:
 *                       - _id: "675a1234567890abcdef1234"
 *                         name: "Upper Body Strength Training"
 *                         description: "Comprehensive upper body workout"
 *                         category: "strength"
 *                         difficulty: "intermediate"
 *                         estimatedDuration: 45
 *                         likeCount: 12
 *                         averageRating: 4.5
 *                         createdAt: "2024-12-12T10:00:00Z"
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 5
 *                       totalItems: 48
 *                       itemsPerPage: 10
 *                       hasNextPage: true
 *                       hasPrevPage: false
 *                   message: "Workouts retrieved successfully"
 *       400:
 *         description: Bad request - Invalid filter parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Invalid filter parameters"
 *               data: null
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Authentication required"
 *               data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/my-workouts', authenticate, WorkoutController.getMyWorkouts);

/**
 * @swagger
 * /workouts/my-stats:
 *   get:
 *     summary: Get user workout statistics
 *     description: |
 *       Retrieve workout statistics for the authenticated user, including total workouts, total duration, and estimated calories burned.
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User workout statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalWorkouts:
 *                       type: number
 *                       example: 25
 *                     totalDuration:
 *                       type: number
 *                       example: 120
 *                     totalCaloriesBurned:
 *                       type: number
 *                       example: 3500
 *                 message:
 *                   type: string
 *                   example: "Workout statistics retrieved successfully"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Authentication required"
 *               data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/my-stats', authenticate, WorkoutController.getMyWorkoutStats);

/**
 * @swagger
 * /workouts/{id}:
 *   get:
 *     summary: Get workout by ID
 *     description: |
 *       Fetch a single workout by its ID with optional populated data.
 *       Returns comprehensive workout information including exercises and metadata.
 *       Automatically increments view count for analytics.
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Workout retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *                 message:
 *                   type: string
 *                   example: "Workout retrieved successfully"
 *       400:
 *         description: Invalid workout ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Workout not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', WorkoutController.getWorkoutById);

/**
 * @swagger
 * /workouts/{id}/like:
 *   post:
 *     summary: Toggle workout like status
 *     description: |
 *       Like or unlike a workout. Requires authentication.
 *       Returns updated workout data including new like count.
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Workout like status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *                 message:
 *                   type: string
 *                   example: "Workout like status updated"
 *       400:
 *         description: Invalid workout ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Workout not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Authentication required"
 *               data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/like', authenticate, WorkoutController.toggleLike);

/**
 * @swagger
 * /workouts/{id}/save:
 *   post:
 *     summary: Toggle workout save status
 *     description: |
 *       Save or unsave a workout to user's profile. Requires authentication.
 *       Returns updated workout data including new save count.
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Workout save status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *                 message:
 *                   type: string
 *                   example: "Workout save status updated"
 *       400:
 *         description: Invalid workout ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Workout not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Authentication required"
 *               data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/save', authenticate, WorkoutController.toggleSave);

/**
 * @swagger
 * /workouts/{id}/duplicate:
 *   post:
 *     summary: Duplicate a workout
 *     description: |
 *       Create a copy of an existing workout for the authenticated user.
 *       The duplicated workout will be marked as private by default and have "(Copy)" appended to the name.
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the workout to duplicate
 *         schema:
 *           type: string
 *           example: "675a1234567890abcdef5678"
 *     responses:
 *       201:
 *         description: Workout duplicated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *                 message:
 *                   type: string
 *                   example: "Workout duplicated successfully"
 *       400:
 *         description: Bad request - Invalid workout ID
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/duplicate', authenticate, WorkoutController.duplicateWorkout);

/**
 * @swagger
 * /workouts:
 *   post:
 *     summary: Create a new workout
 *     description: |
 *       Create a new workout with exercises, targeting specific muscle groups.
 *       Requires authentication. Can be marked as public/private and sponsored.
 *       Automatically calculates estimated calories burned and validates exercise data.
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkoutRequest'
 *           examples:
 *             strength_workout:
 *               summary: Strength training workout
 *               value:
 *                 name: "Upper Body Power Session"
 *                 description: "High-intensity upper body workout focusing on compound movements"
 *                 category: "strength"
 *                 difficulty: "advanced"
 *                 estimatedDuration: 60
 *                 tags: ["upper-body", "compound", "power"]
 *                 isPublic: true
 *                 exercises:
 *                   - exerciseId: "675a1234567890abcdef5678"
 *                     order: 1
 *                     sets: 4
 *                     reps: 6
 *                     weight: 80
 *                     restTime: 180
 *                     notes: "Focus on explosive movement"
 *                   - exerciseId: "675a1234567890abcdef5679"
 *                     order: 2
 *                     sets: 3
 *                     reps: 8
 *                     weight: 60
 *                     restTime: 120
 *                 muscleGroups: ["chest", "shoulders", "triceps", "back"]
 *                 equipment: ["barbell", "dumbbells", "bench"]
 *                 caloriesBurned: 420
 *             cardio_workout:
 *               summary: HIIT cardio workout
 *               value:
 *                 name: "20-Minute HIIT Blast"
 *                 description: "Quick but intense cardio session"
 *                 category: "hiit"
 *                 difficulty: "intermediate"
 *                 estimatedDuration: 20
 *                 tags: ["hiit", "cardio", "fat-burn"]
 *                 isPublic: true
 *                 exercises:
 *                   - exerciseId: "675a1234567890abcdef5680"
 *                     order: 1
 *                     sets: 4
 *                     duration: 30
 *                     restTime: 30
 *                     notes: "All-out effort"
 *                 muscleGroups: ["full-body"]
 *                 equipment: ["none"]
 *                 caloriesBurned: 180
 *             sponsored_workout:
 *               summary: Sponsored workout content
 *               value:
 *                 name: "ProGym Equipment Showcase"
 *                 description: "Workout featuring latest ProGym equipment"
 *                 category: "strength"
 *                 difficulty: "beginner"
 *                 estimatedDuration: 45
 *                 tags: ["equipment-review", "beginner-friendly"]
 *                 isPublic: true
 *                 isSponsored: true
 *                 sponsorData:
 *                   sponsorId: "675a1234567890abcdef9999"
 *                   campaignId: "675a1234567890abcdef8888"
 *                   rate: 250
 *                   type: "review"
 *                   disclosure: "This workout is sponsored by ProGym Equipment"
 *                 exercises:
 *                   - exerciseId: "675a1234567890abcdef5681"
 *                     order: 1
 *                     sets: 3
 *                     reps: 12
 *                     weight: 40
 *                     restTime: 90
 *                 muscleGroups: ["legs", "glutes"]
 *                 equipment: ["ProGym Smart Squat Rack"]
 *                 caloriesBurned: 300
 *     responses:
 *       201:
 *         description: Workout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *                 message:
 *                   type: string
 *                   example: "Workout created successfully"
 *             example:
 *               success: true
 *               data:
 *                 _id: "675a1234567890abcdef1234"
 *                 userId: "675a1234567890abcdef0001"
 *                 name: "Upper Body Power Session"
 *                 description: "High-intensity upper body workout"
 *                 category: "strength"
 *                 difficulty: "advanced"
 *                 estimatedDuration: 60
 *                 isPublic: true
 *                 exercises:
 *                   - exerciseId: "675a1234567890abcdef5678"
 *                     order: 1
 *                     sets: 4
 *                     reps: 6
 *                     weight: 80
 *                     restTime: 180
 *                 likeCount: 0
 *                 saveCount: 0
 *                 views: 0
 *                 createdAt: "2024-12-12T10:00:00Z"
 *                 updatedAt: "2024-12-12T10:00:00Z"
 *               message: "Workout created successfully"
 *       400:
 *         description: Bad request - Missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_fields:
 *                 summary: Missing required fields
 *                 value:
 *                   success: false
 *                   error: "Missing required fields: name, exercises"
 *                   data: null
 *               invalid_exercise:
 *                 summary: Invalid exercise data
 *                 value:
 *                   success: false
 *                   error: "Exercise ID 675a1234567890abcdef5678 not found"
 *                   data: null
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Authentication required"
 *               data: null
 *       422:
 *         description: Validation error - Invalid field values
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Validation failed
 *                 value:
 *                   success: false
 *                   error:
 *                     name: "Name must be between 1 and 100 characters"
 *                     difficulty: "Difficulty must be one of: beginner, intermediate, advanced"
 *                     estimatedDuration: "Duration must be a positive number"
 *                   data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authenticate, WorkoutController.createWorkout);

// ===================================
// MyWorkout Routes
// ===================================

/**
 * @swagger
 * /workouts/my-workouts:
 *   get:
 *     summary: Get user's workouts for MyWorkout page
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 12
 *         description: Number of workouts per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by workout category
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Filter by difficulty level
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in workout name, description, and tags
 *     responses:
 *       200:
 *         description: User workouts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Workout'
 *                           - type: object
 *                             properties:
 *                               isLiked:
 *                                 type: boolean
 *                               isSaved:
 *                                 type: boolean
 *                               sponsorData:
 *                                 type: object
 *                               reviewStats:
 *                                 type: object
 *                                 properties:
 *                                   averageRating:
 *                                     type: number
 *                                   totalReviews:
 *                                     type: number
 *                     pagination:
 *                       $ref: '#/components/schemas/PaginationInfo'
 *       401:
 *         description: Unauthorized
 */
router.get('/my-workouts', authenticate, WorkoutController.getMyWorkouts);

/**
 * @swagger
 * /workouts/my-stats:
 *   get:
 *     summary: Get user's workout statistics
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workout statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalWorkouts:
 *                       type: number
 *                     totalTimeMinutes:
 *                       type: number
 *                     totalCalories:
 *                       type: number
 *                     averageRating:
 *                       type: number
 *                     byCategory:
 *                       type: object
 *                     byDifficulty:
 *                       type: object
 *                     recentActivity:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/my-stats', authenticate, WorkoutController.getMyWorkoutStats);

/**
 * @swagger
 * /workouts/{id}/like:
 *   post:
 *     summary: Toggle like status on workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout ID
 *     responses:
 *       200:
 *         description: Like status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     isLiked:
 *                       type: boolean
 *                     likeCount:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 */
router.post('/:id/like', authenticate, WorkoutController.toggleLike);

/**
 * @swagger
 * /workouts/{id}/save:
 *   post:
 *     summary: Toggle save status on workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout ID
 *     responses:
 *       200:
 *         description: Save status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     isSaved:
 *                       type: boolean
 *                     saveCount:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 */
router.post('/:id/save', authenticate, WorkoutController.toggleSave);

/**
 * @swagger
 * /workouts/{id}/duplicate:
 *   post:
 *     summary: Duplicate a workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout ID to duplicate
 *     responses:
 *       200:
 *         description: Workout duplicated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 */
router.post('/:id/duplicate', authenticate, WorkoutController.duplicateWorkout);

export default router;