/**
 * 🏃 Workout Session Routes
 * Express routes cho workout session tracking và real-time progress
 */

import { Router } from 'express';
import { WorkoutSessionController } from '../controllers/WorkoutSessionController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /workout-sessions/start:
 *   post:
 *     summary: Start a new workout session
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workoutId
 *             properties:
 *               workoutId:
 *                 type: string
 *                 description: ID of workout to start
 *     responses:
 *       200:
 *         description: Session started successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/start', authenticate, WorkoutSessionController.startSession);

/**
 * @swagger
 * /workout-sessions/active:
 *   get:
 *     summary: Get current active session
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active session retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/active', authenticate, WorkoutSessionController.getActiveSession);

/**
 * @swagger
 * /workout-sessions/{id}:
 *   get:
 *     summary: Get session by ID
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session retrieved
 *       404:
 *         description: Session not found
 */
router.get('/:id', authenticate, WorkoutSessionController.getSession);

/**
 * @swagger
 * /workout-sessions/{id}:
 *   put:
 *     summary: Update session progress
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentExerciseIndex:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, paused, completed, stopped]
 *               notes:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               mood:
 *                 type: string
 *                 enum: [great, good, okay, tired, poor]
 *     responses:
 *       200:
 *         description: Session updated
 *       404:
 *         description: Session not found
 */
router.put('/:id', authenticate, WorkoutSessionController.updateSession);

/**
 * @swagger
 * /workout-sessions/{id}/complete-exercise:
 *   post:
 *     summary: Complete an exercise in session
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exerciseId
 *               - exerciseIndex
 *               - sets
 *               - caloriesBurned
 *             properties:
 *               exerciseId:
 *                 type: string
 *               exerciseIndex:
 *                 type: number
 *               sets:
 *                 type: array
 *                 items:
 *                   type: object
 *               caloriesBurned:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Exercise completed
 *       404:
 *         description: Session not found
 */
router.post('/:id/complete-exercise', authenticate, WorkoutSessionController.completeExercise);

/**
 * @swagger
 * /workout-sessions/{id}/toggle-pause:
 *   post:
 *     summary: Pause/Resume session
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session pause toggled
 *       404:
 *         description: Session not found
 */
router.post('/:id/toggle-pause', authenticate, WorkoutSessionController.togglePause);

/**
 * @swagger
 * /workout-sessions/{id}/stop:
 *   post:
 *     summary: Stop session
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session stopped
 *       404:
 *         description: Session not found
 */
router.post('/:id/stop', authenticate, WorkoutSessionController.stopSession);

/**
 * @swagger
 * /workout-sessions:
 *   get:
 *     summary: Get user's session history
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, paused, completed, stopped]
 *     responses:
 *       200:
 *         description: Sessions retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, WorkoutSessionController.getUserSessions);

/**
 * @swagger
 * /workout-sessions/stats:
 *   get:
 *     summary: Get session statistics
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', authenticate, WorkoutSessionController.getSessionStats);

/**
 * @swagger
 * /workout-sessions/{id}:
 *   delete:
 *     summary: Delete session
 *     tags: [Workout Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session deleted
 *       404:
 *         description: Session not found
 */
router.delete('/:id', authenticate, WorkoutSessionController.deleteSession);

export default router;
