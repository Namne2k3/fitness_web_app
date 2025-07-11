/**
 * 🏃 Workout Session Model
 * MongoDB schema cho workout session tracking với Mongoose
 */

import mongoose, { Schema, Document, ObjectId } from 'mongoose';

/**
 * Individual set performance interface
 */
export interface SetPerformance {
    setIndex: number;
    reps: number;
    weight: number; // in kg
    duration: number; // in seconds
    restTime: number; // in seconds
    completedAt: Date;
    notes?: string;
}

/**
 * Exercise completion interface
 */
export interface ExerciseCompletion {
    exerciseId: ObjectId;
    exerciseIndex: number;
    sets: SetPerformance[];
    totalDuration: number; // in seconds
    caloriesBurned: number;
    isCompleted: boolean;
    startedAt: Date;
    completedAt?: Date;
}

/**
 * Workout Session document interface
 */
export interface IWorkoutSession extends Document {
    _id: ObjectId;
    userId: ObjectId;
    workoutId: ObjectId;

    // Session timing
    startTime: Date;
    endTime?: Date;
    totalDuration: number; // in seconds
    pausedDuration: number; // in seconds

    // Progress tracking
    currentExerciseIndex: number;
    totalExercises: number;
    completedExercises: ExerciseCompletion[];

    // Performance metrics
    totalCaloriesBurned: number;
    averageHeartRate?: number;
    maxHeartRate?: number;

    // Session status
    status: 'active' | 'paused' | 'completed' | 'stopped';
    completionPercentage: number; // 0-100

    // Session metadata
    notes?: string;
    rating?: number; // 1-5 stars
    mood?: 'great' | 'good' | 'okay' | 'tired' | 'poor';

    createdAt: Date;
    updatedAt: Date;
}

/**
 * Set Performance Schema
 */
const SetPerformanceSchema = new Schema({
    setIndex: {
        type: Number,
        required: true,
        min: 0
    },
    reps: {
        type: Number,
        required: true,
        min: 0
    },
    weight: {
        type: Number,
        required: true,
        min: 0,
        max: 1000
    },
    duration: {
        type: Number,
        required: true,
        min: 0
    },
    restTime: {
        type: Number,
        default: 0,
        min: 0
    },
    completedAt: {
        type: Date,
        required: true
    },
    notes: {
        type: String,
        maxlength: 200
    }
}, { _id: false });

/**
 * Exercise Completion Schema
 */
const ExerciseCompletionSchema = new Schema({
    exerciseId: {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    exerciseIndex: {
        type: Number,
        required: true,
        min: 0
    },
    sets: [SetPerformanceSchema],
    totalDuration: {
        type: Number,
        required: true,
        min: 0
    },
    caloriesBurned: {
        type: Number,
        required: true,
        min: 0
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    startedAt: {
        type: Date,
        required: true
    },
    completedAt: {
        type: Date
    }
}, { _id: false });

/**
 * Workout Session Schema
 */
const WorkoutSessionSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    workoutId: {
        type: Schema.Types.ObjectId,
        ref: 'Workout',
        required: true,
        index: true
    },
    startTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    totalDuration: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    pausedDuration: {
        type: Number,
        default: 0,
        min: 0
    },
    currentExerciseIndex: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    totalExercises: {
        type: Number,
        required: true,
        min: 1
    },
    completedExercises: [ExerciseCompletionSchema],
    totalCaloriesBurned: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    averageHeartRate: {
        type: Number,
        min: 30,
        max: 220
    },
    maxHeartRate: {
        type: Number,
        min: 30,
        max: 220
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'completed', 'stopped'],
        required: true,
        default: 'active'
    },
    completionPercentage: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100
    },
    notes: {
        type: String,
        maxlength: 1000
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    mood: {
        type: String,
        enum: ['great', 'good', 'okay', 'tired', 'poor']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ================================
// 📊 Indexes
// ================================
WorkoutSessionSchema.index({ userId: 1, createdAt: -1 });
WorkoutSessionSchema.index({ workoutId: 1, createdAt: -1 });
WorkoutSessionSchema.index({ status: 1 });
WorkoutSessionSchema.index({ userId: 1, status: 1 });

// ================================
// 🧮 Virtual Properties
// ================================

// Calculate actual workout duration (excluding paused time)
WorkoutSessionSchema.virtual('actualDuration').get(function () {
    return this.totalDuration - this.pausedDuration;
});

// Calculate average calories per minute
WorkoutSessionSchema.virtual('caloriesPerMinute').get(function () {
    const actualMinutes = (this.totalDuration - this.pausedDuration) / 60;
    return actualMinutes > 0 ? this.totalCaloriesBurned / actualMinutes : 0;
});

// Check if session is in progress
WorkoutSessionSchema.virtual('isInProgress').get(function () {
    return this.status === 'active' || this.status === 'paused';
});

// ================================
// 📋 Instance Methods
// ================================

/**
 * Calculate completion percentage based on completed exercises
 */
WorkoutSessionSchema.methods.calculateCompletionPercentage = function (): number {
    if (this.totalExercises === 0) return 0;

    const completedCount = this.completedExercises.filter(
        (ex: ExerciseCompletion) => ex.isCompleted
    ).length;

    return Math.round((completedCount / this.totalExercises) * 100);
};

/**
 * Update completion percentage
 */
WorkoutSessionSchema.methods.updateCompletion = function (): void {
    this.completionPercentage = this.calculateCompletionPercentage();
};

/**
 * Complete the workout session
 */
WorkoutSessionSchema.methods.completeSession = function (): void {
    this.status = 'completed';
    this.endTime = new Date();
    this.updateCompletion();
};

/**
 * Pause the workout session
 */
WorkoutSessionSchema.methods.pauseSession = function (): void {
    this.status = 'paused';
};

/**
 * Resume the workout session
 */
WorkoutSessionSchema.methods.resumeSession = function (): void {
    this.status = 'active';
};

// ================================
// 📋 Static Methods
// ================================

/**
 * Get active session for user
 */
WorkoutSessionSchema.statics.getActiveSession = function (userId: string) {
    return this.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        status: { $in: ['active', 'paused'] }
    });
};

/**
 * Get user's workout history
 */
WorkoutSessionSchema.statics.getUserHistory = function (
    userId: string,
    limit: number = 10,
    skip: number = 0
) {
    return this.find({
        userId: new mongoose.Types.ObjectId(userId),
        status: 'completed'
    })
        .populate('workoutId', 'name thumbnail estimatedDuration')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
};

export const WorkoutSessionModel = mongoose.model<IWorkoutSession>('WorkoutSession', WorkoutSessionSchema);
