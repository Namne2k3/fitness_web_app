import { ExperienceLevel, Gender, User } from "./user.interface";

export interface SponsoredContent {
    readonly id: string;
    title: string;
    content: string;
    excerpt: string;
    authorId: string;
    author: User;
    sponsor: Sponsor;
    type: ContentType;
    category: ContentCategory;
    tags: string[];
    featuredImage?: string;
    gallery?: string[];
    metadata: ContentMetadata;
    analytics: ContentAnalytics;
    status: ContentStatus;
    isApproved: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export enum ContentStatus {
    DRAFT = 'draft',
    PENDING_REVIEW = 'pending_review',
    APPROVED = 'approved',
    PUBLISHED = 'published',
    REJECTED = 'rejected',
    ARCHIVED = 'archived'
}

// Business and Analytics types
export interface ContentAnalytics {
    views: number;
    uniqueViews: number;
    clicks: number;
    shares: number;
    likes: number;
    comments: number;
    engagementRate: number;
    conversionRate?: number;
    revenue?: number;
    lastUpdated: Date;
}

export interface ContentMetadata {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    readingTime: number; // minutes
    targetAudience: TargetAudience;
    relatedContent?: string[];
}

export interface TargetAudience {
    ageRange: [number, number];
    gender?: Gender[];
    fitnessLevel: ExperienceLevel[];
    interests: string[];
    location?: string[];
}

export enum ContentCategory {
    GYM_REVIEW = 'gym_review',
    SUPPLEMENT_REVIEW = 'supplement_review',
    EQUIPMENT_REVIEW = 'equipment_review',
    TRAINER_REVIEW = 'trainer_review',
    NUTRITION_GUIDE = 'nutrition_guide',
    WORKOUT_GUIDE = 'workout_guide',
    PRODUCT_PROMOTION = 'product_promotion'
}

export interface Sponsor {
    id: string;
    companyName: string;
    logo: string;
    website: string;
    contactEmail: string;
    tier: SponsorTier;
    campaign: Campaign;
    isActive: boolean;
}

export enum SponsorTier {
    BRONZE = 'bronze',
    SILVER = 'silver',
    GOLD = 'gold',
    PLATINUM = 'platinum'
}

export interface SponsorData {
    sponsorId: string;
    sponsorName: string;
    sponsorLogo: string;
    campaignId: string;
    campaignName: string;
    dealValue: number; // Amount paid for sponsorship
    contractStartDate: Date;
    contractEndDate: Date;
    promotionalText?: string;
    callToAction?: string;
    trackingUrl?: string;
    impressions: number;
    clicks: number;
    conversions: number;
    isActive: boolean;
}

export interface Campaign {
    id: string;
    name: string;
    description: string;
    budget: number;
    startDate: Date;
    endDate: Date;
    targetAudience: TargetAudience;
    goals: CampaignGoal[];
}

export enum CampaignGoal {
    BRAND_AWARENESS = 'brand_awareness',
    LEAD_GENERATION = 'lead_generation',
    SALES = 'sales',
    ENGAGEMENT = 'engagement'
}

export enum ContentType {
    REVIEW = 'review',
    TUTORIAL = 'tutorial',
    GUIDE = 'guide',
    PROMOTION = 'promotion',
    COMPARISON = 'comparison'
}