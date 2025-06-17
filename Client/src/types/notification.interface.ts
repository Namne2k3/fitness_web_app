
/**
 * Notification interface matching DATABASE_SCHEMA_COMPLETE.md
 */
export interface Notification {
    readonly _id: string;
    userId: string; // ref: 'User', indexed
    type: NotificationType;
    title: string; // notification title
    message: string; // notification content

    // Targeting
    priority: NotificationPriority;
    category: string; // notification category

    // Media
    icon?: string; // notification icon
    image?: string; // optional image

    // Action
    actionUrl?: string; // click destination
    actionText?: string; // button text

    // Status
    isRead: boolean; // default: false
    readAt?: Date;
    delivered: boolean; // delivery status
    deliveredAt?: Date;

    // Channels
    channels: NotificationChannels;

    // Metadata
    data?: Record<string, any>; // additional data
    expiresAt?: Date; // auto-delete date

    createdAt: Date;
    updatedAt: Date;
}

/**
 * Notification channels
 */
export interface NotificationChannels {
    inApp: boolean; // show in app
    email: boolean; // send email
    push: boolean; // push notification
    sms: boolean; // SMS notification
}

/**
 * Notification types enum
 */
export enum NotificationType {
    WORKOUT_REMINDER = 'workout_reminder',
    NEW_CONTENT = 'new_content',
    SPONSORED_OFFER = 'sponsored_offer',
    SOCIAL = 'social',
    SYSTEM = 'system',
    ACHIEVEMENT = 'achievement',
    SUBSCRIPTION = 'subscription',
    SECURITY = 'security'
}

/**
 * Notification priority levels
 */
export enum NotificationPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent'
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
    userId: string;
    workoutReminders: boolean;
    newContent: boolean;
    sponsoredOffers: boolean;
    socialUpdates: boolean;
    achievements: boolean;
    subscriptionUpdates: boolean;
    securityAlerts: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    quietHours: QuietHours;
}

/**
 * Quiet hours configuration
 */
export interface QuietHours {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    timezone: string;
}

/**
 * Notification template
 */
export interface NotificationTemplate {
    id: string;
    name: string;
    type: NotificationType;
    title: string;
    message: string;
    icon?: string;
    actionText?: string;
    variables: string[]; // template variables like {{userName}}
    channels: NotificationChannels;
    isActive: boolean;
}

/**
 * Bulk notification data
 */
export interface BulkNotificationData {
    templateId: string;
    targetUsers: string[]; // user IDs
    variables: Record<string, string>; // template variable values
    scheduledAt?: Date;
    priority: NotificationPriority;
    channels: NotificationChannels;
}

/**
 * Notification statistics
 */
export interface NotificationStats {
    sent: number;
    delivered: number;
    read: number;
    clicked: number;
    failed: number;
    deliveryRate: number; // %
    readRate: number; // %
    clickRate: number; // %
}

/**
 * Notification query filters
 */
export interface NotificationFilters {
    userId?: string;
    type?: NotificationType;
    priority?: NotificationPriority;
    isRead?: boolean;
    delivered?: boolean;
    startDate?: Date;
    endDate?: Date;
    category?: string;
    sortBy?: 'createdAt' | 'priority' | 'readAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

/**
 * Push notification payload
 */
export interface PushNotificationPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    image?: string;
    data?: Record<string, any>;
    actions?: NotificationAction[];
    requireInteraction?: boolean;
    silent?: boolean;
    tag?: string;
    timestamp?: number;
}

/**
 * Notification action
 */
export interface NotificationAction {
    action: string;
    title: string;
    icon?: string;
}

/**
 * Email notification data
 */
export interface EmailNotificationData {
    to: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
    attachments?: EmailAttachment[];
    templateId?: string;
    templateData?: Record<string, any>;
}

/**
 * Email attachment
 */
export interface EmailAttachment {
    filename: string;
    content: string | Buffer;
    contentType: string;
}

/**
 * SMS notification data
 */
export interface SMSNotificationData {
    to: string;
    message: string;
    templateId?: string;
    templateData?: Record<string, any>;
}
