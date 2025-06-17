/**
 * 📊 Analytics Model
 * MongoDB schema cho analytics data với Mongoose - theo DATABASE_SCHEMA_COMPLETE.md
 */

import mongoose, { Schema, Document } from 'mongoose';

/**
 * Analytics document interface for Mongoose
 */
export interface IAnalytics extends Document {
    _id: string;
    date: Date; // daily aggregation date, indexed

    // User Metrics
    userMetrics: {
        totalUsers: number;
        activeUsers: number; // last 30 days
        newUsers: number; // registered today
        premiumUsers: number;
        retentionRate: number; // %
        churnRate: number; // %
    };

    // Content Metrics
    contentMetrics: {
        totalWorkouts: number;
        publicWorkouts: number;
        sponsoredContent: number;
        totalReviews: number;
        averageRating: number;
        contentEngagement: number; // overall engagement score
    };

    // Revenue Metrics
    revenueMetrics: {
        dailyRevenue: number;
        sponsoredContentRevenue: number;
        subscriptionRevenue: number;
        averageRevenuePerUser: number;
        conversionRate: number; // free to paid
    };

    // Performance Metrics
    performanceMetrics: {
        pageViews: number;
        uniqueVisitors: number;
        averageSessionDuration: number; // minutes
        bounceRate: number; // %
        loadTime: number; // average page load time
    };

    // Geographic Data
    geoMetrics: Array<{
        country: string;
        city: string;
        users: number;
        revenue: number;
    }>;

    // Top Content
    topContent: {
        mostViewedWorkouts: string[];
        mostLikedContent: string[];
        topRatedReviews: string[];
        trendingTags: string[];
    };

    createdAt: Date;
    updatedAt: Date;

    // Methods
    calculateGrowthRate(): number;
    getTopMetrics(): any;
}

/**
 * User Metrics schema
 */
const UserMetricsSchema = new Schema({
    totalUsers: { type: Number, required: true, min: 0 },
    activeUsers: { type: Number, required: true, min: 0 },
    newUsers: { type: Number, required: true, min: 0 },
    premiumUsers: { type: Number, required: true, min: 0 },
    retentionRate: { type: Number, required: true, min: 0, max: 100 },
    churnRate: { type: Number, required: true, min: 0, max: 100 }
}, { _id: false });

/**
 * Content Metrics schema
 */
const ContentMetricsSchema = new Schema({
    totalWorkouts: { type: Number, required: true, min: 0 },
    publicWorkouts: { type: Number, required: true, min: 0 },
    sponsoredContent: { type: Number, required: true, min: 0 },
    totalReviews: { type: Number, required: true, min: 0 },
    averageRating: { type: Number, min: 1, max: 5 },
    contentEngagement: { type: Number, required: true, min: 0 }
}, { _id: false });

/**
 * Revenue Metrics schema
 */
const RevenueMetricsSchema = new Schema({
    dailyRevenue: { type: Number, required: true, min: 0 },
    sponsoredContentRevenue: { type: Number, required: true, min: 0 },
    subscriptionRevenue: { type: Number, required: true, min: 0 },
    averageRevenuePerUser: { type: Number, required: true, min: 0 },
    conversionRate: { type: Number, required: true, min: 0, max: 100 }
}, { _id: false });

/**
 * Performance Metrics schema
 */
const PerformanceMetricsSchema = new Schema({
    pageViews: { type: Number, required: true, min: 0 },
    uniqueVisitors: { type: Number, required: true, min: 0 },
    averageSessionDuration: { type: Number, required: true, min: 0 },
    bounceRate: { type: Number, required: true, min: 0, max: 100 },
    loadTime: { type: Number, required: true, min: 0 }
}, { _id: false });

/**
 * Geographic Metrics schema
 */
const GeoMetricsSchema = new Schema({
    country: { type: String, required: true },
    city: { type: String, required: true },
    users: { type: Number, required: true, min: 0 },
    revenue: { type: Number, required: true, min: 0 }
}, { _id: false });

/**
 * Top Content schema
 */
const TopContentSchema = new Schema({
    mostViewedWorkouts: [{ type: Schema.Types.ObjectId, ref: 'Workout' }],
    mostLikedContent: [{ type: Schema.Types.ObjectId, ref: 'SponsoredContent' }],
    topRatedReviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    trendingTags: [{ type: String }]
}, { _id: false });

/**
 * Main Analytics schema
 */
const AnalyticsSchema = new Schema<IAnalytics>({
    date: {
        type: Date,
        required: [true, 'Date is required'],
        unique: true, // Only one analytics document per day
        index: true
    },

    // User Metrics
    userMetrics: {
        type: UserMetricsSchema,
        required: true
    },

    // Content Metrics
    contentMetrics: {
        type: ContentMetricsSchema,
        required: true
    },

    // Revenue Metrics
    revenueMetrics: {
        type: RevenueMetricsSchema,
        required: true
    },

    // Performance Metrics
    performanceMetrics: {
        type: PerformanceMetricsSchema,
        required: true
    },

    // Geographic Data
    geoMetrics: [GeoMetricsSchema],

    // Top Content
    topContent: {
        type: TopContentSchema,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ================================
// 🔍 Indexes for Performance
// ================================

AnalyticsSchema.index({ date: -1 }); // for time-series queries
AnalyticsSchema.index({ 'revenueMetrics.dailyRevenue': -1 });
AnalyticsSchema.index({ 'userMetrics.activeUsers': -1 });

// ================================
// 📊 Virtual Properties
// ================================

/**
 * Calculate total revenue
 */
AnalyticsSchema.virtual('totalRevenue').get(function (this: IAnalytics) {
    return this.revenueMetrics.sponsoredContentRevenue + this.revenueMetrics.subscriptionRevenue;
});

/**
 * Calculate user engagement rate
 */
AnalyticsSchema.virtual('userEngagementRate').get(function (this: IAnalytics) {
    if (this.userMetrics.totalUsers === 0) return 0;
    return (this.userMetrics.activeUsers / this.userMetrics.totalUsers) * 100;
});

// ================================
// 🔧 Instance Methods
// ================================

/**
 * Calculate growth rate compared to previous day
 */
AnalyticsSchema.methods.calculateGrowthRate = async function (this: IAnalytics): Promise<number> {
    const previousDay = new Date(this.date);
    previousDay.setDate(previousDay.getDate() - 1);

    const previousAnalytics = await AnalyticsModel.findOne({ date: previousDay });

    if (!previousAnalytics) return 0;

    const currentRevenue = this.totalRevenue;
    const previousRevenue = previousAnalytics.totalRevenue;

    if (previousRevenue === 0) return currentRevenue > 0 ? 100 : 0;

    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
};

/**
 * Get top metrics summary
 */
AnalyticsSchema.methods.getTopMetrics = function (this: IAnalytics): any {
    return {
        activeUsers: this.userMetrics.activeUsers,
        newUsers: this.userMetrics.newUsers,
        dailyRevenue: this.revenueMetrics.dailyRevenue,
        pageViews: this.performanceMetrics.pageViews,
        conversionRate: this.revenueMetrics.conversionRate,
        engagementRate: this.userEngagementRate
    };
};

// ================================
// 🔧 Static Methods
// ================================

/**
 * Get analytics for date range
 */
AnalyticsSchema.statics.getDateRange = function (startDate: Date, endDate: Date) {
    return this.find({
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({ date: 1 });
};

/**
 * Get revenue trend for last N days
 */
AnalyticsSchema.statics.getRevenueTrend = function (days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.aggregate([
        {
            $match: {
                date: { $gte: startDate }
            }
        },
        {
            $project: {
                date: 1,
                dailyRevenue: '$revenueMetrics.dailyRevenue',
                sponsoredRevenue: '$revenueMetrics.sponsoredContentRevenue',
                subscriptionRevenue: '$revenueMetrics.subscriptionRevenue'
            }
        },
        {
            $sort: { date: 1 }
        }
    ]);
};

/**
 * Get user growth metrics
 */
AnalyticsSchema.statics.getUserGrowthMetrics = function () {
    return this.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' }
                },
                totalUsers: { $last: '$userMetrics.totalUsers' },
                newUsersSum: { $sum: '$userMetrics.newUsers' },
                avgActiveUsers: { $avg: '$userMetrics.activeUsers' },
                avgRetentionRate: { $avg: '$userMetrics.retentionRate' }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        }
    ]);
};

// ================================
// 🔄 Middleware Hooks
// ================================

/**
 * Pre-save middleware
 */
AnalyticsSchema.pre('save', function (this: IAnalytics, next) {
    // Ensure date is at beginning of day
    this.date.setHours(0, 0, 0, 0);

    // Validate metric consistency
    if (this.userMetrics.premiumUsers > this.userMetrics.totalUsers) {
        return next(new Error('Premium users cannot exceed total users'));
    }

    if (this.contentMetrics.publicWorkouts > this.contentMetrics.totalWorkouts) {
        return next(new Error('Public workouts cannot exceed total workouts'));
    }

    next();
});

export const AnalyticsModel = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
