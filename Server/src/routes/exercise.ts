/**
 * 💪 Exercise Routes - API Endpoints
 * Defines exercise-related routes với proper middleware
 */

import { Router } from 'express';
import { ExerciseController } from '../controllers/ExerciseController';
import { rateLimit } from 'express-rate-limit';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();

// Rate limiting
const exerciseRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many exercise requests, please try again later'
});

// Apply rate limiting to all routes
router.use(exerciseRateLimit);

/**
 * @swagger
 * /exercises/list:
 *   post:
 *     summary: Get exercises with advanced filtering, sorting and pagination
 *     tags: [Exercises]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: number
 *                 default: 1
 *                 description: Page number for pagination
 *               limit:
 *                 type: number
 *                 default: 20
 *                 description: Number of exercises per page
 *               filters:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                     enum: [strength, cardio, flexibility]
 *                     description: Exercise category
 *                   difficulty:
 *                     type: string
 *                     enum: [beginner, intermediate, advanced]
 *                     description: Exercise difficulty level
 *                   primaryMuscleGroups:
 *                     oneOf:
 *                       - type: string
 *                       - type: array
 *                         items:
 *                           type: string
 *                     description: Primary muscle groups targeted
 *                   equipment:
 *                     oneOf:
 *                       - type: string
 *                       - type: array
 *                         items:
 *                           type: string
 *                     description: Required equipment
 *                   search:
 *                     type: string
 *                     description: Text search in name, description
 *                   isApproved:
 *                     type: boolean
 *                     default: true
 *                     description: Filter by approval status
 *                   caloriesRange:
 *                     type: object
 *                     properties:
 *                       min:
 *                         type: number
 *                       max:
 *                         type: number
 *                     description: Calories per minute range
 *               sort:
 *                 type: object
 *                 properties:
 *                   field:
 *                     type: string
 *                     enum: [name, difficulty, category, caloriesPerMinute, averageIntensity, createdAt]
 *                     default: name
 *                   order:
 *                     type: string
 *                     enum: [asc, desc]
 *                     default: asc
 *               options:
 *                 type: object
 *                 properties:
 *                   includeUserData:
 *                     type: boolean
 *                     default: false
 *                     description: Include creator user data
 *                   includeVariations:
 *                     type: boolean
 *                     default: false
 *                     description: Include exercise variations
 *           example:
 *             page: 1
 *             limit: 20
 *             filters:
 *               category: "strength"
 *               difficulty: "beginner"
 *               primaryMuscleGroups: ["chest", "triceps"]
 *               equipment: ["dumbbells"]
 *               isApproved: true
 *             sort:
 *               field: "name"
 *               order: "asc"
 *             options:
 *               includeUserData: true
 *     responses:
 *       200:
 *         description: Exercises retrieved successfully
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
 *                         $ref: '#/components/schemas/Exercise'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: number
 *                         totalPages:
 *                           type: number
 *                         totalItems:
 *                           type: number
 *                         itemsPerPage:
 *                           type: number
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPrevPage:
 *                           type: boolean
 *                     filters:
 *                       type: object
 *                       description: Applied filters
 *                     sort:
 *                       type: object
 *                       description: Applied sorting
 *                 message:
 *                   type: string
 *                   example: "Exercises retrieved successfully"
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.post(
    '/list',
    // cacheMiddleware({
    //     ttl: 900,
    //     keyGenerator: (req) => `exercises:list:${JSON.stringify(req.body)}`,
    //     // condition: (req) => req.body.filters?.isApproved
    // }),
    ExerciseController.getExercises
);

/**
 * @swagger
 * /exercises/{id}:
 *   get:
 *     summary: Get exercise by ID
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exercise ObjectId
 *     responses:
 *       200:
 *         description: Exercise retrieved successfully
 *       404:
 *         description: Exercise not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', ExerciseController.getExerciseById);

/**
 * @swagger
 * /exercises/slug/{slug}:
 *   get:
 *     summary: Get exercise by slug
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Exercise slug (URL-friendly identifier)
 *     responses:
 *       200:
 *         description: Exercise retrieved successfully
 *       404:
 *         description: Exercise not found
 *       500:
 *         description: Internal server error
 */
router.get('/slug/:slug', ExerciseController.getExerciseBySlug);

export default router;