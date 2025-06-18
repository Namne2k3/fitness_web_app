/**
 * 💪 Exercise Model
 * MongoDB schema cho exercise data với Mongoose - theo DATABASE_SCHEMA_COMPLETE.md
 */

import mongoose, { Schema, Document } from 'mongoose';
import { Exercise, ExerciseVariation } from '../types';

/**
 * Exercise document interface for Mongoose
 */
export interface IExercise extends Omit<Exercise, '_id'>, Document {
    isApprovedForUse(): boolean;
    addVariation(variation: ExerciseVariation): Promise<IExercise>;
    calculateDifficulty(): string;
    // ✅ Add virtual property to interface
    readonly hasSafetyConcerns: boolean;
    readonly variationCount: number;
}

/**
 * Exercise Variation schema
 */
const ExerciseVariationSchema = new Schema<ExerciseVariation>({
    name: {
        type: String,
        required: [true, 'Variation name is required'],
        trim: true,
        maxlength: [100, 'Variation name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Variation description is required'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    difficultyModifier: {
        type: String,
        enum: ['easier', 'harder', 'variation'],
        required: [true, 'Difficulty modifier is required']
    },
    instructions: [{
        type: String,
        required: true,
        trim: true
    }]
}, { _id: false });

/**
 * Main Exercise schema - theo DATABASE_SCHEMA_COMPLETE.md
 */
const ExerciseSchema = new Schema<IExercise>({
    name: {
        type: String,
        required: [true, 'Exercise name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Exercise name cannot exceed 100 characters'],
        index: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    instructions: [{
        type: String,
        required: [true, 'At least one instruction step is required'],
        trim: true
    }],
    category: {
        type: String,
        enum: ['strength', 'cardio', 'flexibility'],
        required: [true, 'Category is required'],
        index: true
    },
    primaryMuscleGroups: [{
        type: String,
        required: [true, 'At least one primary muscle group is required'],
        enum: [
            'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
            'core', 'abs', 'obliques', 'quadriceps', 'hamstrings', 'glutes',
            'calves', 'cardio', 'full_body'
        ]
    }],
    secondaryMuscleGroups: [{
        type: String,
        enum: [
            'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
            'core', 'abs', 'obliques', 'quadriceps', 'hamstrings', 'glutes',
            'calves', 'cardio', 'full_body'
        ]
    }],
    equipment: [{
        type: String,
        required: [true, 'At least one equipment type is required'],
        enum: [
            'bodyweight', 'dumbbells', 'barbell', 'machine', 'resistance_bands',
            'kettlebell', 'cable', 'pull_up_bar', 'medicine_ball', 'foam_roller'
        ]
    }],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: [true, 'Difficulty level is required'],
        index: true
    },

    // Media files
    images: [{
        type: String, // Cloudinary URLs
        validate: {
            validator: function (v: string) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
            },
            message: 'Invalid image URL format'
        }
    }],
    videoUrl: {
        type: String,
        validate: {
            validator: function (v: string) {
                return !v || /^https?:\/\/.+\.(mp4|webm|ogg)$/i.test(v);
            },
            message: 'Invalid video URL format'
        }
    },
    gifUrl: {
        type: String,
        validate: {
            validator: function (v: string) {
                return !v || /^https?:\/\/.+\.gif$/i.test(v);
            },
            message: 'Invalid GIF URL format'
        }
    },

    // Metrics
    caloriesPerMinute: {
        type: Number,
        min: [0, 'Calories per minute cannot be negative'],
        max: [50, 'Calories per minute cannot exceed 50'],
        default: 0
    },
    averageIntensity: {
        type: Number,
        min: [1, 'Intensity must be at least 1'],
        max: [10, 'Intensity cannot exceed 10'],
        default: 5
    },

    // Variations
    variations: [ExerciseVariationSchema],

    // Safety information
    precautions: [{
        type: String,
        trim: true,
        maxlength: [200, 'Precaution cannot exceed 200 characters']
    }],
    contraindications: [{
        type: String,
        trim: true,
        maxlength: [200, 'Contraindication cannot exceed 200 characters']
    }],

    // Admin fields
    isApproved: {
        type: Boolean,
        default: false,
        index: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ================================
// 🎯 Indexes
// ================================
ExerciseSchema.index({ name: 1 }); // unique already applied
ExerciseSchema.index({ category: 1, difficulty: 1 });
ExerciseSchema.index({ primaryMuscleGroups: 1 });
ExerciseSchema.index({ equipment: 1 });
ExerciseSchema.index({ isApproved: 1 });

// Text search index
ExerciseSchema.index({
    name: 'text',
    description: 'text',
    instructions: 'text'
});

// ================================
// 🎯 Virtual Properties
// ================================

/**
 * Calculate total variations count
 */
ExerciseSchema.virtual('variationCount').get(function (this: IExercise) {
    return this.variations?.length || 0;
});

/**
 * ✅ FIXED: Check if exercise has safety concerns
 */
ExerciseSchema.virtual('hasSafetyConcerns').get(function (this: IExercise) {
    const hasPrecautions = Array.isArray(this.precautions) && this.precautions.length > 0;
    const hasContraindications = Array.isArray(this.contraindications) && this.contraindications.length > 0;
    return hasPrecautions || hasContraindications;
});

// ================================
// 🔧 Instance Methods
// ================================

/**
 * Check if exercise is approved for general use
 */
ExerciseSchema.methods.isApprovedForUse = function (this: IExercise): boolean {
    return this.isApproved === true;
};

/**
 * Add a new variation to this exercise
 */
ExerciseSchema.methods.addVariation = async function (
    this: IExercise,
    variation: ExerciseVariation
): Promise<IExercise> {
    if (!this.variations) {
        this.variations = [];
    }
    this.variations.push(variation);
    return await this.save();
};

/**
 * ✅ FIXED: Calculate difficulty based on multiple factors
 */
ExerciseSchema.methods.calculateDifficulty = function (this: IExercise): string {
    let score = 0;

    // Base difficulty from instructions complexity
    if (this.instructions && this.instructions.length > 5) score += 1;
    if (this.instructions && this.instructions.length > 8) score += 1;

    // Equipment complexity
    if (this.equipment?.includes('bodyweight')) score += 0;
    else if (this.equipment?.includes('dumbbells')) score += 1;
    else if (this.equipment?.includes('machine')) score += 2;
    else score += 1.5;

    // Muscle groups involved
    const primaryCount = this.primaryMuscleGroups?.length || 0;
    const secondaryCount = this.secondaryMuscleGroups?.length || 0;
    const totalMuscles = primaryCount + secondaryCount;
    if (totalMuscles >= 3) score += 1;

    // ✅ FIXED: Use getter method instead of direct property access
    if (this.hasSafetyConcerns) score += 0.5;

    // Intensity factor
    if (this.averageIntensity && this.averageIntensity >= 8) score += 1;

    if (score <= 2) return 'beginner';
    if (score <= 4) return 'intermediate';
    return 'advanced';
};

// ================================
// 🔧 Static Methods
// ================================

/**
 * Find exercises by muscle groups
 */
ExerciseSchema.statics.findByMuscleGroups = function (muscleGroups: string[]) {
    return this.find({
        $or: [
            { primaryMuscleGroups: { $in: muscleGroups } },
            { secondaryMuscleGroups: { $in: muscleGroups } }
        ],
        isApproved: true
    });
};

/**
 * Find exercises by equipment
 */
ExerciseSchema.statics.findByEquipment = function (equipment: string[]) {
    return this.find({
        equipment: { $in: equipment },
        isApproved: true
    });
};

/**
 * Get exercises by difficulty level
 */
ExerciseSchema.statics.findByDifficulty = function (difficulty: string) {
    return this.find({
        difficulty: difficulty,
        isApproved: true
    });
};

// ================================
// 🔧 Middleware
// ================================

/**
 * Pre-save middleware to auto-calculate difficulty if not set
 */
ExerciseSchema.pre('save', function (this: IExercise, next) {
    if (!this.difficulty || this.isModified('instructions') || this.isModified('equipment')) {
        this.difficulty = this.calculateDifficulty() as any;
    }
    next();
});

/**
 * Pre-save validation
 */
ExerciseSchema.pre('save', function (this: IExercise, next) {
    // Ensure at least one instruction
    if (!this.instructions || this.instructions.length === 0) {
        const error = new Error('Exercise must have at least one instruction step');
        return next(error);
    }

    // Ensure primary muscle groups exist
    if (!this.primaryMuscleGroups || this.primaryMuscleGroups.length === 0) {
        const error = new Error('Exercise must target at least one primary muscle group');
        return next(error);
    }

    next();
});

/**
 * Create and export the model
 */
export const ExerciseModel = mongoose.model<IExercise>('Exercise', ExerciseSchema);

export default ExerciseModel;
