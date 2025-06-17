/**
 * 💰 Sponsored Content Model
 * MongoDB schema cho sponsored content data với Mongoose - theo DATABASE_SCHEMA_COMPLETE.md
 */

import mongoose, { Schema, Document, ObjectId } from 'mongoose';

/**
 * Sponsored Content interfaces
 */
export interface ISponsoredContent extends Document {
    _id: string;
    title: string;
    content: string;
    excerpt?: string;
    author: ObjectId; // User ID
    type: 'review' | 'guide' | 'promotion' | 'comparison';
    status: 'draft' | 'pending' | 'published' | 'archived';
    category: string;
    tags: string[];

    // Monetization
    sponsor: {
        company: string;
        contactEmail: string;
        website: string;
        logo: string;
    };
    campaign: {
        campaignId: string;
        rate: number;
        paymentStatus: 'pending' | 'paid' | 'cancelled';
        contractUrl: string;
    };

    // Target & Performance
    targetAudience: {
        ageRange: [number, number];
        fitnessLevels: string[];
        interests: string[];
        geoLocation: string[];
    };

    // Media
    featuredImage?: string;
    gallery?: string[];
    videoUrl?: string;

    // SEO
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];

    // Analytics
    analytics: {
        views: number;
        clicks: number;
        shares: number;
        likes: number;
        comments: number;
        conversionRate: number;
        revenue: number;
        ctr: number;
        engagement: number;
    };

    // Publishing
    publishedAt?: Date;
    scheduledAt?: Date;
    expiresAt?: Date;

    createdAt: Date;
    updatedAt: Date;

    // Methods
    incrementViews(): Promise<ISponsoredContent>;
    incrementClicks(): Promise<ISponsoredContent>;
    calculateEngagement(): number;
    isPublished(): boolean;
}

/**
 * Sponsor schema
 */
const SponsorSchema = new Schema({
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    contactEmail: {
        type: String,
        required: [true, 'Contact email is required'],
        validate: {
            validator: function (v: string) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    website: {
        type: String,
        validate: {
            validator: function (v: string) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Website must be a valid URL'
        }
    },
    logo: {
        type: String,
        validate: {
            validator: function (v: string) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Logo must be a valid URL'
        }
    }
}, { _id: false });

/**
 * Campaign schema
 */
const CampaignSchema = new Schema({
    campaignId: {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
        required: [true, 'Campaign ID is required']
    },
    rate: {
        type: Number,
        required: [true, 'Payment rate is required'],
        min: [0, 'Rate cannot be negative']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending'
    },
    contractUrl: {
        type: String,
        validate: {
            validator: function (v: string) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Contract URL must be valid'
        }
    }
}, { _id: false });

/**
 * Target Audience schema
 */
const TargetAudienceSchema = new Schema({
    ageRange: {
        type: [Number],
        validate: {
            validator: function (v: number[]) {
                return v.length === 2 && v[0] <= v[1] && v[0] >= 13 && v[1] <= 100;
            },
            message: 'Age range must be [min, max] where min <= max and within 13-100'
        }
    },
    fitnessLevels: [{
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
    }],
    interests: [{
        type: String,
        trim: true
    }],
    geoLocation: [{
        type: String,
        trim: true
    }]
}, { _id: false });

/**
 * Analytics schema
 */
const AnalyticsSchema = new Schema({
    views: { type: Number, default: 0, min: 0 },
    clicks: { type: Number, default: 0, min: 0 },
    shares: { type: Number, default: 0, min: 0 },
    likes: { type: Number, default: 0, min: 0 },
    comments: { type: Number, default: 0, min: 0 },
    conversionRate: { type: Number, default: 0, min: 0, max: 100 },
    revenue: { type: Number, default: 0, min: 0 },
    ctr: { type: Number, default: 0, min: 0, max: 100 },
    engagement: { type: Number, default: 0, min: 0 }
}, { _id: false });

/**
 * Main Sponsored Content schema
 */
const SponsoredContentSchema = new Schema<ISponsoredContent>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [100, 'Content must be at least 100 characters']
    },
    excerpt: {
        type: String,
        maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required'],
        index: true
    },
    type: {
        type: String,
        enum: ['review', 'guide', 'promotion', 'comparison'],
        required: [true, 'Content type is required']
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'published', 'archived'],
        default: 'draft',
        index: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        index: true
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'Tag cannot exceed 50 characters']
    }],

    // Monetization
    sponsor: {
        type: SponsorSchema,
        required: [true, 'Sponsor information is required']
    },
    campaign: {
        type: CampaignSchema,
        required: [true, 'Campaign information is required']
    },

    // Target & Performance
    targetAudience: TargetAudienceSchema,

    // Media
    featuredImage: {
        type: String,
        validate: {
            validator: function (v: string) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Featured image must be a valid URL'
        }
    },
    gallery: [{
        type: String,
        validate: {
            validator: function (v: string) {
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Gallery image must be a valid URL'
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

    // SEO
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    metaTitle: {
        type: String,
        maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
        type: String,
        maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
        type: String,
        trim: true
    }],

    // Analytics
    analytics: {
        type: AnalyticsSchema,
        default: () => ({})
    },

    // Publishing
    publishedAt: Date,
    scheduledAt: {
        type: Date,
        index: true
    },
    expiresAt: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ================================
// 🔍 Indexes for Performance
// ================================

SponsoredContentSchema.index({ author: 1, status: 1 });
SponsoredContentSchema.index({ status: 1, publishedAt: -1 });
SponsoredContentSchema.index({ category: 1, type: 1 });
SponsoredContentSchema.index({ tags: 1 });
SponsoredContentSchema.index({ slug: 1 }); // unique already creates index
SponsoredContentSchema.index({ 'campaign.campaignId': 1 });
SponsoredContentSchema.index({ 'analytics.views': -1 });
SponsoredContentSchema.index({ scheduledAt: 1 });

// Text search index
SponsoredContentSchema.index({
    title: 'text',
    content: 'text',
    tags: 'text'
});

// ================================
// 📊 Virtual Properties
// ================================

/**
 * Check if content is published and visible
 */
SponsoredContentSchema.virtual('isVisible').get(function (this: ISponsoredContent) {
    return this.status === 'published' &&
        (!this.expiresAt || this.expiresAt > new Date());
});

/**
 * Calculate reading time (assuming 200 words per minute)
 */
SponsoredContentSchema.virtual('readingTime').get(function (this: ISponsoredContent) {
    const wordCount = this.content.split(' ').length;
    return Math.ceil(wordCount / 200);
});

// ================================
// 🔧 Instance Methods
// ================================

/**
 * Increment view count
 */
SponsoredContentSchema.methods.incrementViews = function (this: ISponsoredContent): Promise<ISponsoredContent> {
    this.analytics.views = (this.analytics.views || 0) + 1;
    this.analytics.engagement = this.calculateEngagement();
    return this.save();
};

/**
 * Increment click count
 */
SponsoredContentSchema.methods.incrementClicks = function (this: ISponsoredContent): Promise<ISponsoredContent> {
    this.analytics.clicks = (this.analytics.clicks || 0) + 1;
    this.analytics.ctr = this.analytics.views > 0 ?
        (this.analytics.clicks / this.analytics.views) * 100 : 0;
    this.analytics.engagement = this.calculateEngagement();
    return this.save();
};

/**
 * Calculate engagement score
 */
SponsoredContentSchema.methods.calculateEngagement = function (this: ISponsoredContent): number {
    const { views, clicks, shares, likes, comments } = this.analytics;

    if (views === 0) return 0;

    // Weighted engagement score
    const engagementScore = (
        (clicks * 2) +      // Clicks are weighted more
        (shares * 3) +      // Shares are valuable
        (likes * 1) +       // Likes are basic engagement
        (comments * 4)      // Comments are highest engagement
    ) / views;

    return Math.round(engagementScore * 100) / 100;
};

/**
 * Check if content is published
 */
SponsoredContentSchema.methods.isPublished = function (this: ISponsoredContent): boolean {
    return this.status === 'published';
};

// ================================
// 🔧 Static Methods
// ================================

/**
 * Find published content by category
 */
SponsoredContentSchema.statics.findPublishedByCategory = function (category: string) {
    return this.find({
        category: category,
        status: 'published',
        $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: { $gt: new Date() } }
        ]
    }).sort({ publishedAt: -1 });
};

/**
 * Find trending content (high engagement)
 */
SponsoredContentSchema.statics.findTrending = function (limit = 10) {
    return this.find({
        status: 'published',
        'analytics.engagement': { $gt: 0 }
    })
        .sort({ 'analytics.engagement': -1 })
        .limit(limit);
};

/**
 * Find content by sponsor
 */
SponsoredContentSchema.statics.findBySponsor = function (company: string) {
    return this.find({
        'sponsor.company': company,
        status: 'published'
    }).sort({ publishedAt: -1 });
};

// ================================
// 🔄 Middleware Hooks
// ================================

/**
 * Pre-save middleware
 */
SponsoredContentSchema.pre('save', function (this: ISponsoredContent, next) {
    // Auto-generate slug from title if not provided
    if (!this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Set published date when status changes to published
    if (this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }

    // Auto-generate meta title/description if not provided
    if (!this.metaTitle) {
        this.metaTitle = this.title.substring(0, 60);
    }

    if (!this.metaDescription && this.excerpt) {
        this.metaDescription = this.excerpt.substring(0, 160);
    }

    next();
});

export const SponsoredContentModel = mongoose.model<ISponsoredContent>('SponsoredContent', SponsoredContentSchema);
