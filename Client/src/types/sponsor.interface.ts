
/**
 * 💰 Sponsor & Review Types 
 * TypeScript interfaces cho Sponsored Content và Review data - updated với React 19 patterns
 */

// ================================
// 🎯 UI Helper Types for MyWorkout  
// ================================
export interface SponsorBadgeProps {
    sponsor: SponsorInfo;
    campaign: CampaignInfo;
    compact?: boolean;
    showRate?: boolean;
}

export interface ReviewBadgeProps {
    review: import('./review.interface').Review;
    compact?: boolean;
    showRating?: boolean;
}

export interface SponsorCardProps {
    sponsoredContent: SponsoredContent;
    onView?: () => void;
    onClick?: () => void;
}

// ================================
// 📊 Analytics Types for MyWorkout
// ================================
export interface SponsorAnalytics {
    totalSponsored: number;
    totalRevenue: number;
    averageRate: number;
    topSponsors: Array<{
        company: string;
        totalPaid: number;
        contentCount: number;
    }>;
    monthlyRevenue: Array<{
        month: string;
        revenue: number;
        contentCount: number;
    }>;
}

export interface ReviewAnalytics {
    totalReviews: number;
    averageRating: number;
    verifiedReviews: number;
    sponsoredReviews: number;
    ratingDistribution: Array<{
        rating: number;
        count: number;
    }>;
    monthlyReviews: Array<{
        month: string;
        reviews: number;
        averageRating: number;
    }>;
}

// ================================
// 🔄 Workout Integration Types
// ================================
export interface WorkoutWithSponsorData {
    workout: import('./workout.interface').Workout;
    sponsoredContent?: SponsoredContent[];
    reviews?: import('./review.interface').Review[];
    sponsorAnalytics?: {
        totalRevenue: number;
        avgRating: number;
        reviewCount: number;
    };
}

/**
 * Sponsored Content interface matching DATABASE_SCHEMA_COMPLETE.md
 */
export interface SponsoredContent {
    readonly _id: string;
    title: string; // required, max 200
    content: string; // rich text content
    excerpt: string; // short description
    author: string; // ref: 'User', indexed

    // Content Type
    type: SponsoredContentType;
    status: ContentStatus;
    category: string; // content category
    tags: string[]; // searchable tags

    // Monetization
    sponsor: SponsorInfo;
    campaign: CampaignInfo;

    // Target & Performance
    targetAudience: TargetAudience;

    // Media
    featuredImage?: string; // Cloudinary URL
    gallery: string[]; // additional images
    videoUrl?: string;

    // SEO
    slug: string; // URL-friendly, unique
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];

    // Analytics (embedded for performance)
    analytics: ContentAnalytics;

    // Publishing
    publishedAt?: Date;
    scheduledAt?: Date; // for scheduled posts
    expiresAt?: Date; // auto-archive date

    createdAt: Date;
    updatedAt: Date;
}

/**
 * Sponsor information
 */
export interface SponsorInfo {
    company: string; // sponsor company name
    contactEmail: string;
    website: string;
    logo: string; // Cloudinary URL
}

/**
 * Campaign information
 */
export interface CampaignInfo {
    campaignId: string; // ref: 'Campaign'
    rate: number; // payment per post
    paymentStatus: PaymentStatus;
    contractUrl?: string; // signed contract
}

/**
 * Target audience for content
 */
export interface TargetAudience {
    ageRange: [number, number]; // [min, max]
    fitnessLevels: string[];
    interests: string[];
    geoLocation: string[]; // country/city codes
}

/**
 * Content analytics
 */
export interface ContentAnalytics {
    views: number;
    clicks: number; // clicks on sponsor links
    shares: number;
    likes: number;
    comments: number;
    conversionRate: number; // calculated metric
    revenue: number; // generated revenue
    ctr: number; // click-through rate
    engagement: number; // overall engagement score
}

/**
 * Campaign interface matching DATABASE_SCHEMA_COMPLETE.md
 */
export interface Campaign {
    readonly _id: string;
    name: string; // campaign name, required
    description: string;
    sponsor: CampaignSponsor;

    // Campaign Details
    type: CampaignType;
    budget: number; // total budget
    ratePerPost: number; // payment per content piece
    maxPosts: number; // maximum posts allowed

    // Targeting
    targeting: CampaignTargeting;

    // Requirements
    requirements: CampaignRequirements;

    // Legal
    contract: CampaignContract;

    // Status
    status: CampaignStatus;
    startDate: Date;
    endDate: Date;

    // Performance
    metrics: CampaignMetrics;

    createdAt: Date;
    updatedAt: Date;
}

/**
 * Campaign sponsor details
 */
export interface CampaignSponsor {
    company: string; // sponsor company
    contactPerson: string;
    email: string;
    phone?: string;
    website: string;
}

/**
 * Campaign targeting options
 */
export interface CampaignTargeting {
    demographics: {
        ageRange: [number, number];
        gender: string[];
        location: string[];
    };
    interests: string[];
    fitnessLevels: string[];
    minFollowers: number; // minimum follower count
}

/**
 * Campaign requirements
 */
export interface CampaignRequirements {
    contentGuidelines: string;
    mandatoryHashtags: string[];
    disclosureText: string;
    submissionDeadline: Date;
    revisionRounds: number; // allowed revisions
}

/**
 * Campaign contract details
 */
export interface CampaignContract {
    terms: string;
    signedContract?: string; // document URL
    exclusivityPeriod: number; // days
    usageRights: string; // content usage rights
}

/**
 * Campaign metrics
 */
export interface CampaignMetrics {
    totalPosts: number;
    totalViews: number;
    totalEngagement: number;
    totalClicks: number;
    costPerClick: number;
    roi: number; // return on investment
}

/**
 * Enums
 */
export enum SponsoredContentType {
    REVIEW = 'review',
    GUIDE = 'guide',
    PROMOTION = 'promotion',
    COMPARISON = 'comparison'
}

export enum ContentStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    PUBLISHED = 'published',
    ARCHIVED = 'archived'
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    CANCELLED = 'cancelled'
}

export enum CampaignType {
    REVIEW = 'review',
    GUIDE = 'guide',
    PROMOTION = 'promotion',
    EVENT = 'event'
}

export enum CampaignStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    PAUSED = 'paused',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

/**
 * Form data interfaces
 */
export interface SponsoredContentFormData {
    title: string;
    content: string;
    excerpt: string;
    type: SponsoredContentType;
    category: string;
    tags: string[];
    sponsor: SponsorInfo;
    campaign: CampaignInfo;
    targetAudience: TargetAudience;
    featuredImage?: File;
    gallery?: File[];
    videoFile?: File;
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
    scheduledAt?: Date;
    expiresAt?: Date;
}

export interface CampaignFormData {
    name: string;
    description: string;
    sponsor: CampaignSponsor;
    type: CampaignType;
    budget: number;
    ratePerPost: number;
    maxPosts: number;
    targeting: CampaignTargeting;
    requirements: CampaignRequirements;
    contract: CampaignContract;
    startDate: Date;
    endDate: Date;
}