
/**
 * Analytics interface matching DATABASE_SCHEMA_COMPLETE.md
 */
export interface Analytics {
    readonly _id: string;
    date: Date; // daily aggregation date, indexed

    // User Metrics
    userMetrics: UserMetrics;

    // Content Metrics
    contentMetrics: ContentMetrics;

    // Revenue Metrics
    revenueMetrics: RevenueMetrics;

    // Performance Metrics
    performanceMetrics: PerformanceMetrics;

    // Geographic Data
    geoMetrics: GeoMetric[];

    // Top Content
    topContent: TopContent;

    createdAt: Date;
    updatedAt: Date;
}

/**
 * User metrics structure
 */
export interface UserMetrics {
    totalUsers: number;
    activeUsers: number; // last 30 days
    newUsers: number; // registered today
    premiumUsers: number;
    retentionRate: number; // %
    churnRate: number; // %
}

/**
 * Content metrics structure
 */
export interface ContentMetrics {
    totalWorkouts: number;
    publicWorkouts: number;
    sponsoredContent: number;
    totalReviews: number;
    averageRating: number;
    contentEngagement: number; // overall engagement score
}

/**
 * Revenue metrics structure
 */
export interface RevenueMetrics {
    dailyRevenue: number;
    sponsoredContentRevenue: number;
    subscriptionRevenue: number;
    averageRevenuePerUser: number;
    conversionRate: number; // free to paid
}

/**
 * Performance metrics structure
 */
export interface PerformanceMetrics {
    pageViews: number;
    uniqueVisitors: number;
    averageSessionDuration: number; // minutes
    bounceRate: number; // %
    loadTime: number; // average page load time
}

/**
 * Geographic metric
 */
export interface GeoMetric {
    country: string;
    city: string;
    users: number;
    revenue: number;
}

/**
 * Top content tracking
 */
export interface TopContent {
    mostViewedWorkouts: string[]; // ObjectIds
    mostLikedContent: string[]; // ObjectIds
    topRatedReviews: string[]; // ObjectIds
    trendingTags: string[];
}

/**
 * Analytics dashboard data
 */
export interface AnalyticsDashboard {
    currentPeriod: Analytics;
    previousPeriod: Analytics;
    trends: AnalyticsTrends;
    charts: AnalyticsCharts;
}

/**
 * Analytics trends
 */
export interface AnalyticsTrends {
    userGrowth: number; // % change
    revenueGrowth: number; // % change
    engagementGrowth: number; // % change
    performanceChange: number; // % change
}

/**
 * Analytics charts data
 */
export interface AnalyticsCharts {
    userGrowthChart: ChartData[];
    revenueChart: ChartData[];
    contentEngagementChart: ChartData[];
    geoDistributionChart: GeoChartData[];
}

/**
 * Chart data point
 */
export interface ChartData {
    date: string;
    value: number;
    label?: string;
}

/**
 * Geographic chart data
 */
export interface GeoChartData {
    location: string;
    value: number;
    percentage: number;
}

/**
 * Analytics query filters
 */
export interface AnalyticsFilters {
    startDate: Date;
    endDate: Date;
    metrics?: ('user' | 'content' | 'revenue' | 'performance')[];
    groupBy?: 'day' | 'week' | 'month' | 'year';
    countries?: string[];
    contentTypes?: string[];
}

/**
 * Real-time analytics data
 */
export interface RealTimeAnalytics {
    activeUsers: number;
    currentSessions: number;
    pageViewsToday: number;
    revenueToday: number;
    topPages: PageMetric[];
    recentActivities: RecentActivity[];
    lastUpdated: Date;
}

/**
 * Page metric for real-time analytics
 */
export interface PageMetric {
    path: string;
    views: number;
    uniqueViews: number;
    bounceRate: number;
}

/**
 * Recent activity tracking
 */
export interface RecentActivity {
    type: 'signup' | 'workout_created' | 'review_posted' | 'content_published';
    userId?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
