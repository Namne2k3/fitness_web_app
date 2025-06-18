/**
 * 🏋️ Workout Model
 * MongoDB schema cho workout data với Mongoose - theo DATABASE_SCHEMA_COMPLETE.md
 */

import mongoose, { Schema, Document } from 'mongoose';
import { Workout, WorkoutExercise } from '../types';

/**
 * Workout document interface for Mongoose
 */
export interface IWorkout extends Omit<Workout, '_id'>, Document {
    // Virtual properties
    exerciseCount: number;
    totalEstimatedTime: number;
    hasRatings: boolean;

    // Instance methods
    isOwnedBy(userId: string): boolean;
    addLike(userId: string): Promise<IWorkout>;
    removeLike(userId: string): Promise<IWorkout>;
    addSave(userId: string): Promise<IWorkout>;
    removeSave(userId: string): Promise<IWorkout>;
    incrementViews(): Promise<IWorkout>;
    calculateTotalCalories(): number;
}

/**
 * Workout Exercise schema - embedded trong workout
 */
const WorkoutExerciseSchema = new Schema<WorkoutExercise>({
    exerciseId: {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
        required: [true, 'Exercise ID is required']
    },
    order: {
        type: Number,
        required: [true, 'Exercise order is required'],
        min: [1, 'Order must be at least 1']
    },
    sets: {
        type: Number,
        required: [true, 'Number of sets is required'],
        min: [1, 'Must have at least 1 set'],
        max: [20, 'Cannot exceed 20 sets']
    },
    reps: {
        type: Number,
        min: [1, 'Reps must be at least 1'],
        max: [1000, 'Reps cannot exceed 1000']
    },
    duration: {
        type: Number, // seconds for time-based exercises
        min: [1, 'Duration must be at least 1 second'],
        max: [7200, 'Duration cannot exceed 2 hours']
    },
    weight: {
        type: Number, // kg
        min: [0, 'Weight cannot be negative'],
        max: [1000, 'Weight cannot exceed 1000kg']
    },
    restTime: {
        type: Number, // seconds between sets
        min: [0, 'Rest time cannot be negative'],
        max: [600, 'Rest time cannot exceed 10 minutes'],
        default: 60
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { _id: false });

/**
 * Sponsor Data schema - embedded trong workout
 */
const SponsorDataSchema = new Schema({
    sponsorId: {
        type: Schema.Types.ObjectId,
        ref: 'Sponsor',
        required: true
    },
    campaignId: {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    rate: {
        type: Number,
        required: [true, 'Payment rate is required'],
        min: [0, 'Rate cannot be negative']
    },
    type: {
        type: String,
        enum: ['review', 'guide', 'promotion'],
        required: [true, 'Sponsor type is required']
    },
    disclosure: {
        type: String,
        required: [true, 'Disclosure text is required'],
        maxlength: [500, 'Disclosure cannot exceed 500 characters']
    }
}, { _id: false });

/**
 * Main Workout schema - theo DATABASE_SCHEMA_COMPLETE.md
 */
const WorkoutSchema = new Schema<IWorkout>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    name: {
        type: String,
        required: [true, 'Workout name is required'],
        trim: true,
        maxlength: [100, 'Workout name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
        type: String,
        enum: ['strength', 'cardio', 'flexibility', 'hiit', 'crosstraining', 'sports', 'recovery'],
        index: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: [true, 'Difficulty level is required'],
        index: true
    },
    estimatedDuration: {
        type: Number, // minutes
        min: [1, 'Duration must be at least 1 minute'],
        max: [480, 'Duration cannot exceed 8 hours']
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'Tag cannot exceed 50 characters']
    }],
    isPublic: {
        type: Boolean,
        default: false,
        index: true
    },

    // Embedded Exercises Array
    exercises: [WorkoutExerciseSchema],

    // Monetization
    isSponsored: {
        type: Boolean,
        default: false,
        index: true
    },
    sponsorData: SponsorDataSchema,

    // Social Features
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    likeCount: {
        type: Number,
        default: 0,
        min: [0, 'Like count cannot be negative']
    },
    saves: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    saveCount: {
        type: Number,
        default: 0,
        min: [0, 'Save count cannot be negative']
    },
    shares: {
        type: Number,
        default: 0,
        min: [0, 'Share count cannot be negative']
    },

    // Analytics
    views: {
        type: Number,
        default: 0,
        min: [0, 'View count cannot be negative']
    },
    completions: {
        type: Number,
        default: 0,
        min: [0, 'Completion count cannot be negative']
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    totalRatings: {
        type: Number,
        default: 0,
        min: [0, 'Rating count cannot be negative']
    },

    // Metadata
    muscleGroups: [{
        type: String,
        enum: [
            'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
            'core', 'abs', 'obliques', 'quadriceps', 'hamstrings', 'glutes',
            'calves', 'cardio', 'full_body'
        ]
    }],
    equipment: [{
        type: String,
        enum: [
            'bodyweight', 'dumbbells', 'barbell', 'machine', 'resistance_bands',
            'kettlebell', 'cable', 'pull_up_bar', 'medicine_ball', 'foam_roller'
        ]
    }],
    caloriesBurned: {
        type: Number,
        min: [0, 'Calories burned cannot be negative'],
        max: [5000, 'Calories burned seems too high']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ================================
// 🔍 Indexes for Performance
// ================================

WorkoutSchema.index({ userId: 1, createdAt: -1 });
WorkoutSchema.index({ category: 1, difficulty: 1 });
WorkoutSchema.index({ tags: 1 });
WorkoutSchema.index({ isPublic: 1, isSponsored: 1 });
WorkoutSchema.index({ muscleGroups: 1 });
WorkoutSchema.index({ averageRating: -1 });
WorkoutSchema.index({ likeCount: -1 });

// Text search index
WorkoutSchema.index({
    name: 'text',
    description: 'text',
    tags: 'text'
});

// ================================
// 📊 Virtual Properties
// ================================

/**
 * Calculate total exercise count
 */
WorkoutSchema.virtual('exerciseCount').get(function (this: IWorkout) {
    return this.exercises ? this.exercises.length : 0;
});

/**
 * Calculate total estimated time including rest
 */
WorkoutSchema.virtual('totalEstimatedTime').get(function (this: IWorkout) {
    if (!this.exercises || this.exercises.length === 0) return 0;

    let totalTime = 0;
    this.exercises.forEach(exercise => {
        // Estimate time per set (30 seconds per set + rest time)
        const timePerSet = 30 + (exercise.restTime || 60);
        totalTime += (exercise.sets * timePerSet);
    });

    return Math.round(totalTime / 60); // Convert to minutes
});

/**
 * Check if workout has been rated
 */
WorkoutSchema.virtual('hasRatings').get(function (this: IWorkout) {
    return this.totalRatings && this.totalRatings > 0;
});

// ================================
// 🔧 Instance Methods
// ================================

/**
 * Check if workout is owned by specific user
 */
WorkoutSchema.methods.isOwnedBy = function (this: IWorkout, userId: string): boolean {
    return this.userId.toString() === userId;
};

/**
 * Add like from user
 */
WorkoutSchema.methods.addLike = function (this: IWorkout, userId: string): Promise<IWorkout> {
    if (!this.likes) {
        this.likes = [];
    }
    if (!this.likes.includes(userId as any)) {
        this.likes.push(userId as any);
        this.likeCount = this.likes.length;
    }
    return this.save();
};

/**
 * Remove like from user
 */
WorkoutSchema.methods.removeLike = function (this: IWorkout, userId: string): Promise<IWorkout> {
    if (!this.likes) {
        this.likes = [];
    }
    this.likes = this.likes.filter(id => id.toString() !== userId);
    this.likeCount = this.likes.length;
    return this.save();
};

/**
 * Add save from user
 */
WorkoutSchema.methods.addSave = function (this: IWorkout, userId: string): Promise<IWorkout> {
    if (!this.saves) {
        this.saves = [];
    }
    if (!this.saves.includes(userId as any)) {
        this.saves.push(userId as any);
        this.saveCount = this.saves.length;
    }
    return this.save();
};

/**
 * Remove save from user
 */
WorkoutSchema.methods.removeSave = function (this: IWorkout, userId: string): Promise<IWorkout> {
    if (!this.saves) {
        this.saves = [];
    }
    this.saves = this.saves.filter(id => id.toString() !== userId);
    this.saveCount = this.saves.length;
    return this.save();
};

/**
 * Increment view count
 */
WorkoutSchema.methods.incrementViews = function (this: IWorkout): Promise<IWorkout> {
    this.views = (this.views || 0) + 1;
    return this.save();
};

/**
 * Calculate total calories for the workout
 */
WorkoutSchema.methods.calculateTotalCalories = function (this: IWorkout): number {
    if (!this.exercises || this.exercises.length === 0) return 0;

    // Basic calculation: ~5 calories per minute of exercise
    const estimatedMinutes = (this as any).totalEstimatedTime || this.estimatedDuration || 30;
    return Math.round(estimatedMinutes * 5);
};

// ================================
// 🔧 Static Methods
// ================================

/**
 * Find public workouts by difficulty
 */
WorkoutSchema.statics.findPublicByDifficulty = function (difficulty: string) {
    return this.find({
        difficulty: difficulty,
        isPublic: true
    }).populate('userId', 'username profile.firstName profile.lastName');
};

/**
 * Find trending workouts (most liked in last 30 days)
 */
WorkoutSchema.statics.findTrending = function (limit = 10) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.find({
        isPublic: true,
        createdAt: { $gte: thirtyDaysAgo }
    })
        .sort({ likeCount: -1, views: -1 })
        .limit(limit)
        .populate('userId', 'username profile.firstName profile.lastName');
};

/**
 * Find workouts by muscle groups
 */
WorkoutSchema.statics.findByMuscleGroups = function (muscleGroups: string[]) {
    return this.find({
        muscleGroups: { $in: muscleGroups },
        isPublic: true
    });
};

/**
 * Find sponsored workouts
 */
WorkoutSchema.statics.findSponsored = function () {
    return this.find({
        isSponsored: true,
        isPublic: true
    }).populate('sponsorData.sponsorId');
};

// ================================
// 🔄 Middleware Hooks
// ================================

/**
 * Pre-save middleware
 */
WorkoutSchema.pre('save', function (this: IWorkout, next) {
    // Auto-calculate muscle groups from exercises
    if (this.exercises && this.exercises.length > 0) {
        // This would require populating exercises to get muscle groups
        // For now, ensure array exists
        if (!this.muscleGroups) {
            this.muscleGroups = [];
        }
    }

    // Auto-calculate calories if not set
    if (!this.caloriesBurned) {
        this.caloriesBurned = this.calculateTotalCalories();
    }

    // Ensure like/save counts match array lengths
    if (this.likes) {
        this.likeCount = this.likes.length;
    }
    if (this.saves) {
        this.saveCount = this.saves.length;
    }

    next();
});

/**
 * Pre-validate middleware
 */
WorkoutSchema.pre('validate', function (this: IWorkout, next) {
    // Ensure exercises array is not empty
    if (!this.exercises || this.exercises.length === 0) {
        return next(new Error('Workout must contain at least one exercise'));
    }

    // Validate sponsored workout has sponsor data
    if (this.isSponsored && !this.sponsorData) {
        return next(new Error('Sponsored workout must have sponsor data'));
    }

    next();
});

export const WorkoutModel = mongoose.model<IWorkout>('Workout', WorkoutSchema);
