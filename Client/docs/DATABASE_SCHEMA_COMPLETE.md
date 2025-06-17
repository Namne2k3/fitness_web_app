# 🏋️ TrackMe Fitness App - Complete Database Schema

> **📊 Comprehensive Database Architecture Documentation**
> 
> Complete schema overview for TrackMe Fitness Web App with MongoDB + Mongoose

---

## 📋 Quick Overview

### Tech Stack
- **Database**: MongoDB (NoSQL)
- **ODM**: Mongoose
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React 19 + TypeScript

### Collections Summary
```javascript
Users (👤)           // User accounts, profiles, preferences
Workouts (🏋️)        // Exercise routines, user workouts
Exercises (💪)       // Exercise database with instructions
SponsoredContent (💰) // Monetized content and reviews
Reviews (⭐)         // User reviews and ratings
Analytics (📊)       // Performance metrics
Campaigns (📈)       // Marketing campaigns
Sponsors (🏢)        // Business partners
Notifications (🔔)   // User notifications
```

---

## 👤 Users Collection

### Schema Structure
```javascript
{
  _id: ObjectId,
  email: String, // unique, indexed
  username: String, // unique, indexed
  password: String, // hashed, select: false
  role: String, // ['user', 'trainer', 'admin', 'sponsor']
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLoginAt: Date,
  isActive: Boolean,
  
  // Embedded Profile
  profile: {
    firstName: String, // required, max 50
    lastName: String, // required, max 50
    age: Number, // 13-120, required
    gender: String, // ['male', 'female', 'other']
    weight: Number, // 20-500 kg
    height: Number, // 100-250 cm
    fitnessGoals: [String], // fitness objectives
    experienceLevel: String, // ['beginner', 'intermediate', 'advanced']
    avatar: String, // Cloudinary URL
    bio: String, // max 500 chars
    medicalConditions: [String]
  },
  
  // Embedded Preferences
  preferences: {
    contentTypes: [String],
    notifications: {
      workoutReminders: Boolean,
      newContent: Boolean,
      sponsoredOffers: Boolean,
      socialUpdates: Boolean,
      email: Boolean,
      push: Boolean
    },
    privacy: {
      profileVisibility: String, // ['public', 'friends', 'private']
      showRealName: Boolean,
      allowMessages: Boolean,
      shareWorkouts: Boolean,
      trackingConsent: Boolean
    },
    theme: String, // ['light', 'dark', 'auto']
    language: String, // ['vi', 'en']
    units: String // ['metric', 'imperial']
  },
  
  // Embedded Subscription
  subscription: {
    plan: String, // ['free', 'premium', 'pro']
    status: String, // ['active', 'cancelled', 'expired']
    startDate: Date,
    endDate: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    cancelAtPeriodEnd: Boolean,
    features: [String] // enabled features
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
```javascript
// Primary indexes
{ email: 1 } // unique
{ username: 1 } // unique
{ "profile.experienceLevel": 1 }
{ "subscription.plan": 1 }
{ role: 1 }
{ createdAt: -1 }

// Compound indexes
{ isActive: 1, role: 1 }
{ "profile.fitnessGoals": 1, "profile.experienceLevel": 1 }
```

### Virtual Properties
```javascript
// BMI calculation
profile.bmi: weight / (height/100)²

// Full name
profile.fullName: firstName + " " + lastName

// Subscription check
subscription.isActive: status === 'active' && endDate > now()
```

---

## 🏋️ Workouts Collection

### Schema Structure
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: 'User', indexed
  name: String, // required, max 100
  description: String, // max 500
  category: String, // ['strength', 'cardio', 'flexibility', etc.]
  difficulty: String, // ['beginner', 'intermediate', 'advanced']
  estimatedDuration: Number, // minutes
  tags: [String], // indexed
  isPublic: Boolean, // default: false
  
  // Embedded Exercises Array
  exercises: [{
    exerciseId: ObjectId, // ref: 'Exercise'
    order: Number, // sequence in workout
    sets: Number, // required
    reps: Number,
    duration: Number, // seconds for time-based
    weight: Number, // kg
    restTime: Number, // seconds between sets
    notes: String,
    completed: Boolean // for workout tracking
  }],
  
  // Monetization
  isSponsored: Boolean, // default: false
  sponsorData: {
    sponsorId: ObjectId, // ref: 'Sponsor'
    campaignId: ObjectId, // ref: 'Campaign'
    rate: Number, // payment rate
    type: String, // ['review', 'guide', 'promotion']
    disclosure: String // required disclosure text
  },
  
  // Social Features
  likes: [ObjectId], // user IDs who liked
  likeCount: Number, // denormalized for performance
  saves: [ObjectId], // user IDs who saved
  saveCount: Number,
  shares: Number, // share count
  
  // Analytics
  views: Number, // view count
  completions: Number, // completion count
  averageRating: Number, // calculated from reviews
  totalRatings: Number,
  
  // Metadata
  muscleGroups: [String], // targeted muscle groups
  equipment: [String], // required equipment
  caloriesBurned: Number, // estimated calories
  
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
```javascript
{ userId: 1, createdAt: -1 }
{ category: 1, difficulty: 1 }
{ tags: 1 }
{ isPublic: 1, isSponsored: 1 }
{ muscleGroups: 1 }
{ averageRating: -1 }
{ likeCount: -1 }

// Text search
{ name: "text", description: "text", tags: "text" }
```

---

## 💪 Exercises Collection

### Schema Structure
```javascript
{
  _id: ObjectId,
  name: String, // unique, required
  description: String,
  instructions: [String], // step-by-step
  category: String, // ['strength', 'cardio', 'flexibility']
  primaryMuscleGroups: [String], // main muscles
  secondaryMuscleGroups: [String], // supporting muscles
  equipment: [String], // required equipment
  difficulty: String, // ['beginner', 'intermediate', 'advanced']
  
  // Media
  images: [String], // Cloudinary URLs
  videoUrl: String, // demo video
  gifUrl: String, // animated demonstration
  
  // Metrics
  caloriesPerMinute: Number, // average calories burned
  averageIntensity: Number, // 1-10 scale
  
  // Variations
  variations: [{
    name: String,
    description: String,
    difficultyModifier: String, // ['easier', 'harder', 'variation']
    instructions: [String]
  }],
  
  // Safety
  precautions: [String], // safety warnings
  contraindications: [String], // medical conditions to avoid
  
  // Admin
  isApproved: Boolean, // admin approval
  createdBy: ObjectId, // ref: 'User'
  
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
```javascript
{ name: 1 } // unique
{ category: 1, difficulty: 1 }
{ primaryMuscleGroups: 1 }
{ equipment: 1 }
{ isApproved: 1 }

// Text search
{ name: "text", description: "text", instructions: "text" }
```

---

## 💰 Sponsored Content Collection

### Schema Structure
```javascript
{
  _id: ObjectId,
  title: String, // required, max 200
  content: String, // rich text content
  excerpt: String, // short description
  author: ObjectId, // ref: 'User', indexed
  
  // Content Type
  type: String, // ['review', 'guide', 'promotion', 'comparison']
  status: String, // ['draft', 'pending', 'published', 'archived']
  category: String, // content category
  tags: [String], // searchable tags
  
  // Monetization
  sponsor: {
    company: String, // sponsor company name
    contactEmail: String,
    website: String,
    logo: String // Cloudinary URL
  },
  campaign: {
    campaignId: ObjectId, // ref: 'Campaign'
    rate: Number, // payment per post
    paymentStatus: String, // ['pending', 'paid', 'cancelled']
    contractUrl: String // signed contract
  },
  
  // Target & Performance
  targetAudience: {
    ageRange: [Number], // [min, max]
    fitnessLevels: [String],
    interests: [String],
    geoLocation: [String] // country/city codes
  },
  
  // Media
  featuredImage: String, // Cloudinary URL
  gallery: [String], // additional images
  videoUrl: String,
  
  // SEO
  slug: String, // URL-friendly, unique
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  
  // Analytics (embedded for performance)
  analytics: {
    views: Number,
    clicks: Number, // clicks on sponsor links
    shares: Number,
    likes: Number,
    comments: Number,
    conversionRate: Number, // calculated metric
    revenue: Number, // generated revenue
    ctr: Number, // click-through rate
    engagement: Number // overall engagement score
  },
  
  // Publishing
  publishedAt: Date,
  scheduledAt: Date, // for scheduled posts
  expiresAt: Date, // auto-archive date
  
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
```javascript
{ author: 1, status: 1 }
{ status: 1, publishedAt: -1 }
{ category: 1, type: 1 }
{ tags: 1 }
{ slug: 1 } // unique
{ "campaign.campaignId": 1 }
{ "analytics.views": -1 }
{ scheduledAt: 1 } // for publishing automation

// Text search
{ title: "text", content: "text", tags: "text" }
```

---

## ⭐ Reviews Collection

### Schema Structure
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: 'User', indexed
  targetType: String, // ['workout', 'exercise', 'gym', 'trainer', 'product']
  targetId: ObjectId, // reference to reviewed item
  
  // Rating
  rating: {
    overall: Number, // 1-5, required
    quality: Number, // 1-5
    value: Number, // 1-5 (value for money)
    difficulty: Number, // 1-5 (accuracy of difficulty rating)
    instructions: Number // 1-5 (clarity of instructions)
  },
  
  // Content
  title: String, // review title, max 100
  content: String, // review text, max 1000
  pros: [String], // positive points
  cons: [String], // negative points
  
  // Media
  images: [String], // Cloudinary URLs
  videoUrl: String,
  
  // Verification
  verified: Boolean, // verified purchase/completion
  verificationData: {
    type: String, // ['purchase', 'completion', 'attendance']
    date: Date,
    proof: String // verification document URL
  },
  
  // Social
  helpful: [ObjectId], // users who marked as helpful
  helpfulCount: Number, // denormalized count
  reported: [ObjectId], // users who reported
  reportCount: Number,
  
  // Monetization
  isSponsored: Boolean,
  sponsorDisclosure: String, // required if sponsored
  compensation: {
    type: String, // ['paid', 'free_product', 'discount']
    amount: Number,
    description: String
  },
  
  // Moderation
  isApproved: Boolean,
  moderatedBy: ObjectId, // ref: 'User' (admin)
  moderationNotes: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
```javascript
{ userId: 1, createdAt: -1 }
{ targetType: 1, targetId: 1 }
{ "rating.overall": -1 }
{ verified: 1 }
{ isApproved: 1 }
{ helpfulCount: -1 }

// Compound for target reviews
{ targetType: 1, targetId: 1, "rating.overall": -1 }
```

---

## 📊 Analytics Collection

### Schema Structure
```javascript
{
  _id: ObjectId,
  date: Date, // daily aggregation date, indexed
  
  // User Metrics
  userMetrics: {
    totalUsers: Number,
    activeUsers: Number, // last 30 days
    newUsers: Number, // registered today
    premiumUsers: Number,
    retentionRate: Number, // %
    churnRate: Number // %
  },
  
  // Content Metrics
  contentMetrics: {
    totalWorkouts: Number,
    publicWorkouts: Number,
    sponsoredContent: Number,
    totalReviews: Number,
    averageRating: Number,
    contentEngagement: Number // overall engagement score
  },
  
  // Revenue Metrics
  revenueMetrics: {
    dailyRevenue: Number,
    sponsoredContentRevenue: Number,
    subscriptionRevenue: Number,
    averageRevenuePerUser: Number,
    conversionRate: Number // free to paid
  },
  
  // Performance Metrics
  performanceMetrics: {
    pageViews: Number,
    uniqueVisitors: Number,
    averageSessionDuration: Number, // minutes
    bounceRate: Number, // %
    loadTime: Number // average page load time
  },
  
  // Geographic Data
  geoMetrics: [{
    country: String,
    city: String,
    users: Number,
    revenue: Number
  }],
  
  // Top Content
  topContent: {
    mostViewedWorkouts: [ObjectId],
    mostLikedContent: [ObjectId],
    topRatedReviews: [ObjectId],
    trendingTags: [String]
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
```javascript
{ date: -1 } // for time-series queries
{ "revenueMetrics.dailyRevenue": -1 }
{ "userMetrics.activeUsers": -1 }
```

---

## 📈 Campaigns Collection

### Schema Structure
```javascript
{
  _id: ObjectId,
  name: String, // campaign name, required
  description: String,
  sponsor: {
    company: String, // sponsor company
    contactPerson: String,
    email: String,
    phone: String,
    website: String
  },
  
  // Campaign Details
  type: String, // ['review', 'guide', 'promotion', 'event']
  budget: Number, // total budget
  ratePerPost: Number, // payment per content piece
  maxPosts: Number, // maximum posts allowed
  
  // Targeting
  targeting: {
    demographics: {
      ageRange: [Number],
      gender: [String],
      location: [String]
    },
    interests: [String],
    fitnessLevels: [String],
    minFollowers: Number // minimum follower count
  },
  
  // Requirements
  requirements: {
    contentGuidelines: String,
    mandatoryHashtags: [String],
    disclosureText: String,
    submissionDeadline: Date,
    revisionRounds: Number // allowed revisions
  },
  
  // Legal
  contract: {
    terms: String,
    signedContract: String, // document URL
    exclusivityPeriod: Number, // days
    usageRights: String // content usage rights
  },
  
  // Status
  status: String, // ['draft', 'active', 'paused', 'completed', 'cancelled']
  startDate: Date,
  endDate: Date,
  
  // Performance
  metrics: {
    totalPosts: Number,
    totalViews: Number,
    totalEngagement: Number,
    totalClicks: Number,
    costPerClick: Number,
    roi: Number // return on investment
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔔 Notifications Collection

### Schema Structure
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: 'User', indexed
  type: String, // ['workout_reminder', 'new_content', 'sponsored_offer', 'social']
  title: String, // notification title
  message: String, // notification content
  
  // Targeting
  priority: String, // ['low', 'medium', 'high', 'urgent']
  category: String, // notification category
  
  // Media
  icon: String, // notification icon
  image: String, // optional image
  
  // Action
  actionUrl: String, // click destination
  actionText: String, // button text
  
  // Status
  isRead: Boolean, // default: false
  readAt: Date,
  delivered: Boolean, // delivery status
  deliveredAt: Date,
  
  // Channels
  channels: {
    inApp: Boolean, // show in app
    email: Boolean, // send email
    push: Boolean, // push notification
    sms: Boolean // SMS notification
  },
  
  // Metadata
  data: Schema.Types.Mixed, // additional data
  expiresAt: Date, // auto-delete date
  
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
```javascript
{ userId: 1, isRead: 1, createdAt: -1 }
{ type: 1, createdAt: -1 }
{ delivered: 1 }
{ expiresAt: 1 } // for TTL auto-deletion
```

---

## 🔗 Data Relationships

### Primary Relationships
```javascript
// User → Workouts (1:many)
User._id → Workout.userId

// User → Reviews (1:many)
User._id → Review.userId

// User → SponsoredContent (1:many - author)
User._id → SponsoredContent.author

// Workout → Exercises (many:many through embedded array)
Workout.exercises[].exerciseId → Exercise._id

// Campaign → SponsoredContent (1:many)
Campaign._id → SponsoredContent.campaign.campaignId

// Review → Target (many:1 polymorphic)
Review.targetId → Workout._id | Exercise._id | etc.
```

### Virtual Relationships
```javascript
// User virtual properties
user.workouts // populated from Workout.userId
user.reviews // populated from Review.userId
user.notifications // populated from Notification.userId

// Workout virtual properties
workout.author // populated from User._id
workout.exerciseDetails // populated from Exercise._id array

// Exercise virtual properties
exercise.workouts // workouts using this exercise
exercise.averageRating // calculated from reviews
```

---

## ⚡ Performance Optimizations

### Strategic Indexes
```javascript
// User queries
{ email: 1 } // login
{ username: 1 } // profile lookup
{ role: 1, isActive: 1 } // admin queries

// Workout queries
{ userId: 1, createdAt: -1 } // user workouts timeline
{ isPublic: 1, averageRating: -1 } // public workout discovery
{ category: 1, difficulty: 1 } // filtered browsing
{ tags: 1 } // tag-based search

// Content queries
{ status: 1, publishedAt: -1 } // published content
{ author: 1, createdAt: -1 } // author content
{ "analytics.views": -1 } // trending content

// Review queries
{ targetType: 1, targetId: 1, "rating.overall": -1 } // target reviews
{ userId: 1, createdAt: -1 } // user review history
```

### Denormalization Strategies
```javascript
// Cached counts for performance
Workout.likeCount // instead of counting likes array
Workout.saveCount // instead of counting saves array
Review.helpfulCount // instead of counting helpful array
SponsoredContent.analytics // embedded for fast access
User.subscription.isActive // calculated field
```

### Query Optimization Tips
```javascript
// Use lean() for read-only queries
const workouts = await Workout.find().lean();

// Project only needed fields
const users = await User.find({}, 'username profile.firstName profile.lastName');

// Use indexes for sorting
const trending = await Workout.find().sort({ likeCount: -1 }).limit(10);

// Compound indexes for complex queries
{ userId: 1, category: 1, createdAt: -1 }
```

---

## 🎯 Business Logic Summary

### Monetization Features
1. **Sponsored Content System** - Content creators can publish sponsored reviews and guides
2. **Review Monetization** - Verified reviews with compensation tracking
3. **Campaign Management** - Brand campaign orchestration
4. **Analytics Dashboard** - Revenue and performance tracking
5. **Subscription Tiers** - Premium features and ad-free experience

### Social Features
1. **Workout Sharing** - Public/private workout sharing
2. **Social Interactions** - Likes, saves, comments
3. **Review System** - Multi-criteria ratings and reviews
4. **User Following** - Social connections
5. **Achievement System** - Gamification elements

### Content Management
1. **Exercise Database** - Comprehensive exercise library
2. **Workout Builder** - Custom workout creation
3. **Content Moderation** - Admin approval workflows
4. **SEO Optimization** - Search engine friendly content
5. **Media Management** - Image and video handling

---

## 🔧 Development Notes

### Environment Setup
```javascript
// Required environment variables
MONGODB_URI=mongodb://localhost:27017/trackme
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Validation Rules
- All user inputs validated with Joi schemas
- MongoDB schema validation as backup
- Rate limiting on API endpoints
- File upload size limits (10MB images, 100MB videos)
- Content moderation for public posts

### Security Considerations
- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Helmet security headers
- Input sanitization
- File upload validation
- API rate limiting

---

## 🚀 Deployment Checklist

### Database Optimization
- [ ] Indexes created for all collections
- [ ] TTL indexes for expired data
- [ ] Compound indexes for complex queries
- [ ] Regular backup schedule
- [ ] Performance monitoring

### Data Migration
- [ ] User data migration scripts
- [ ] Content migration validation
- [ ] Analytics data preservation
- [ ] Search index rebuilding
- [ ] File storage migration

### Monitoring Setup
- [ ] Database performance monitoring
- [ ] Query performance analysis
- [ ] Error tracking and alerting
- [ ] Revenue metrics tracking
- [ ] User behavior analytics

---

*📊 This schema documentation covers the complete database architecture for TrackMe Fitness App with focus on monetization through sponsored content and reviews.*
