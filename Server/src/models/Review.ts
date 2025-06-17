/**
 * ⭐ Review Model
 * MongoDB schema cho review data với Mongoose - theo DATABASE_SCHEMA_COMPLETE.md
 */

import mongoose, { Schema, Document, ObjectId } from 'mongoose';

/**
 * Review document interface for Mongoose
 */
export interface IReview extends Document {
    _id: ObjectId;
    userId: ObjectId;
    targetType: 'workout' | 'exercise' | 'gym' | 'trainer' | 'product';
    targetId: ObjectId;

    // Rating
    rating: {
        overall: number;
        quality?: number;
        value?: number;
        difficulty?: number;
        instructions?: number;
    };

    // Content
    title: string;
    content: string;
    pros: string[];
    cons: string[];

    // Media
    images: string[];
    videoUrl?: string;

    // Verification
    verified: boolean;
    verificationData?: {
        type: 'purchase' | 'completion' | 'attendance';
        date: Date;
        proof: string;
    };

    // Social
    helpful: string[];
    helpfulCount: number;
    reported: string[];
    reportCount: number;

    // Monetization
    isSponsored: boolean;
    sponsorDisclosure?: string;
    compensation?: {
        type: 'paid' | 'free_product' | 'discount';
        amount: number;
        description: string;
    };

    // Moderation
    isApproved: boolean;
    moderatedBy?: string;
    moderationNotes?: string;

    createdAt: Date;
    updatedAt: Date;

    // Methods
    markHelpful(userId: string): Promise<IReview>;
    unmarkHelpful(userId: string): Promise<IReview>;
    reportReview(userId: string): Promise<IReview>;
    calculateHelpfulnesScore(): number;
}

/**
 * Rating schema
 */
const RatingSchema = new Schema({
    overall: {
        type: Number,
        required: [true, 'Overall rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    quality: {
        type: Number,
        min: [1, 'Quality rating must be at least 1'],
        max: [5, 'Quality rating cannot exceed 5']
    },
    value: {
        type: Number,
        min: [1, 'Value rating must be at least 1'],
        max: [5, 'Value rating cannot exceed 5']
    },
    difficulty: {
        type: Number,
        min: [1, 'Difficulty rating must be at least 1'],
        max: [5, 'Difficulty rating cannot exceed 5']
    },
    instructions: {
        type: Number,
        min: [1, 'Instructions rating must be at least 1'],
        max: [5, 'Instructions rating cannot exceed 5']
    }
}, { _id: false });

/**
 * Verification Data schema
 */
const VerificationDataSchema = new Schema({
    type: {
        type: String,
        enum: ['purchase', 'completion', 'attendance'],
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Verification date is required']
    },
    proof: {
        type: String,
        required: [true, 'Verification proof is required'],
        validate: {
            validator: function (v: string) {
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Proof must be a valid URL'
        }
    }
}, { _id: false });

/**
 * Compensation schema
 */
const CompensationSchema = new Schema({
    type: {
        type: String,
        enum: ['paid', 'free_product', 'discount'],
        required: true
    },
    amount: {
        type: Number,
        min: [0, 'Compensation amount cannot be negative']
    },
    description: {
        type: String,
        required: [true, 'Compensation description is required'],
        maxlength: [200, 'Description cannot exceed 200 characters']
    }
}, { _id: false });

/**
 * Main Review schema
 */
const ReviewSchema = new Schema<IReview>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    targetType: {
        type: String,
        enum: ['workout', 'exercise', 'gym', 'trainer', 'product'],
        required: [true, 'Target type is required'],
        index: true
    },
    targetId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Target ID is required'],
        index: true
    },

    // Rating
    rating: {
        type: RatingSchema,
        required: [true, 'Rating is required']
    },

    // Content
    title: {
        type: String,
        required: [true, 'Review title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Review content is required'],
        trim: true,
        minlength: [10, 'Content must be at least 10 characters'],
        maxlength: [1000, 'Content cannot exceed 1000 characters']
    },
    pros: [{
        type: String,
        trim: true,
        maxlength: [100, 'Pro point cannot exceed 100 characters']
    }],
    cons: [{
        type: String,
        trim: true,
        maxlength: [100, 'Con point cannot exceed 100 characters']
    }],

    // Media
    images: [{
        type: String,
        validate: {
            validator: function (v: string) {
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Image must be a valid URL'
        }
    }],
    videoUrl: {
        type: String,
        validate: {
            validator: function (v: string) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Video URL must be valid'
        }
    },

    // Verification
    verified: {
        type: Boolean,
        default: false
    },
    verificationData: VerificationDataSchema,

    // Social
    helpful: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    helpfulCount: {
        type: Number,
        default: 0,
        min: [0, 'Helpful count cannot be negative']
    },
    reported: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    reportCount: {
        type: Number,
        default: 0,
        min: [0, 'Report count cannot be negative']
    },

    // Monetization
    isSponsored: {
        type: Boolean,
        default: false
    },
    sponsorDisclosure: {
        type: String,
        maxlength: [500, 'Sponsor disclosure cannot exceed 500 characters']
    },
    compensation: CompensationSchema,

    // Moderation
    isApproved: {
        type: Boolean,
        default: false,
        index: true
    },
    moderatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    moderationNotes: {
        type: String,
        maxlength: [500, 'Moderation notes cannot exceed 500 characters']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ================================
// 🔍 Indexes for Performance
// ================================

ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ targetType: 1, targetId: 1 });
ReviewSchema.index({ 'rating.overall': -1 });
ReviewSchema.index({ verified: 1 });
ReviewSchema.index({ isApproved: 1 });
ReviewSchema.index({ helpfulCount: -1 });

// Compound indexes
ReviewSchema.index({ targetType: 1, targetId: 1, 'rating.overall': -1 });
ReviewSchema.index({ isApproved: 1, verified: 1, createdAt: -1 });

// ================================
// 📊 Virtual Properties
// ================================

/**
 * Calculate helpfulness score
 */
ReviewSchema.virtual('helpfulnessScore').get(function (this: IReview) {
    if (this.helpfulCount === 0) return 0;
    const totalVotes = this.helpfulCount + this.reportCount;
    return totalVotes > 0 ? (this.helpfulCount / totalVotes) * 100 : 0;
});

/**
 * Check if review has media
 */
ReviewSchema.virtual('hasMedia').get(function (this: IReview) {
    return (this.images && this.images.length > 0) || !!this.videoUrl;
});

/**
 * Get review quality score
 */
ReviewSchema.virtual('qualityScore').get(function (this: IReview) {
    let score = 0;

    // Content length bonus
    if (this.content.length > 100) score += 1;
    if (this.content.length > 300) score += 1;

    // Pros/cons bonus
    if (this.pros.length > 0) score += 1;
    if (this.cons.length > 0) score += 1;

    // Media bonus
    if (this.hasMedia) score += 1;

    // Verification bonus
    if (this.verified) score += 2;

    // Helpfulness bonus
    if (this.helpfulnessScore > 70) score += 1;

    return Math.min(score, 10); // Max score of 10
});

// ================================
// 🔧 Instance Methods
// ================================

/**
 * Mark review as helpful by user
 */
ReviewSchema.methods.markHelpful = function (this: IReview, userId: string): Promise<IReview> {
    if (!this.helpful.includes(userId as any)) {
        this.helpful.push(userId as any);
        this.helpfulCount = this.helpful.length;
    }
    return this.save();
};

/**
 * Unmark review as helpful by user
 */
ReviewSchema.methods.unmarkHelpful = function (this: IReview, userId: string): Promise<IReview> {
    this.helpful = this.helpful.filter(id => id.toString() !== userId);
    this.helpfulCount = this.helpful.length;
    return this.save();
};

/**
 * Report review by user
 */
ReviewSchema.methods.reportReview = function (this: IReview, userId: string): Promise<IReview> {
    if (!this.reported.includes(userId as any)) {
        this.reported.push(userId as any);
        this.reportCount = this.reported.length;
    }
    return this.save();
};

/**
 * Calculate helpfulness score
 */
ReviewSchema.methods.calculateHelpfulnesScore = function (this: IReview): number {
    return this.helpfulnessScore;
};

// ================================
// 🔧 Static Methods
// ================================

/**
 * Find reviews for target
 */
ReviewSchema.statics.findForTarget = function (targetType: string, targetId: string) {
    return this.find({
        targetType: targetType,
        targetId: targetId,
        isApproved: true
    })
        .populate('userId', 'username profile.firstName profile.lastName profile.avatar')
        .sort({ helpfulCount: -1, createdAt: -1 });
};

/**
 * Find verified reviews
 */
ReviewSchema.statics.findVerified = function () {
    return this.find({
        verified: true,
        isApproved: true
    })
        .populate('userId', 'username profile.firstName profile.lastName');
};

/**
 * Find sponsored reviews
 */
ReviewSchema.statics.findSponsored = function () {
    return this.find({
        isSponsored: true,
        isApproved: true
    });
};

/**
 * Get average rating for target
 */
ReviewSchema.statics.getAverageRatingForTarget = function (targetType: string, targetId: string) {
    return this.aggregate([
        {
            $match: {
                targetType: targetType,
                targetId: new mongoose.Types.ObjectId(targetId),
                isApproved: true
            }
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating.overall' },
                totalReviews: { $sum: 1 },
                ratingDistribution: {
                    $push: '$rating.overall'
                }
            }
        }
    ]);
};

// ================================
// 🔄 Middleware Hooks
// ================================

/**
 * Pre-save middleware
 */
ReviewSchema.pre('save', function (this: IReview, next) {
    // Update counts based on arrays
    if (this.helpful) {
        this.helpfulCount = this.helpful.length;
    }
    if (this.reported) {
        this.reportCount = this.reported.length;
    }

    // Validate sponsored review requirements
    if (this.isSponsored && !this.sponsorDisclosure) {
        return next(new Error('Sponsored reviews must include disclosure'));
    }

    // Validate verification data if verified
    if (this.verified && !this.verificationData) {
        return next(new Error('Verified reviews must include verification data'));
    }

    next();
});

/**
 * Post-save middleware to update target ratings
 */
ReviewSchema.post('save', async function (this: IReview) {
    try {
        // Update average rating on target (workout, exercise, etc.)
        const targetModel = getTargetModel(this.targetType);
        if (targetModel) {
            const avgRating = await ReviewSchema.statics.getAverageRatingForTarget(
                this.targetType,
                this.targetId.toString()
            );

            if (avgRating.length > 0) {
                await targetModel.findByIdAndUpdate(this.targetId, {
                    averageRating: avgRating[0].averageRating,
                    totalRatings: avgRating[0].totalReviews
                });
            }
        }
    } catch (error) {
        console.error('Error updating target rating:', error);
    }
});

/**
 * Helper function to get target model
 */
function getTargetModel(targetType: string) {
    switch (targetType) {
        case 'workout':
            return mongoose.model('Workout');
        case 'exercise':
            return mongoose.model('Exercise');
        // Add other target types as needed
        default:
            return null;
    }
}

export const ReviewModel = mongoose.model<IReview>('Review', ReviewSchema);
