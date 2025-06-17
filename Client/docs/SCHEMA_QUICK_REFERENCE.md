# 🏋️ TrackMe Database Schema - Quick Reference

> **📊 Fast Schema Reference for TrackMe Fitness App**

---

## 🎯 Collection Summary

| Collection | Purpose | Key Fields | Monetization |
|------------|---------|------------|-------------|
| **👤 Users** | User management | profile, preferences, subscription | Subscription plans |
| **🏋️ Workouts** | Exercise routines | exercises[], sponsorData | Sponsored workouts |
| **💪 Exercises** | Exercise library | instructions, media | Exercise database |
| **💰 SponsoredContent** | Paid content | analytics, campaign | Direct revenue |
| **⭐ Reviews** | User reviews | rating, verification | Paid reviews |
| **📊 Analytics** | Business metrics | revenue, users | Revenue tracking |
| **📈 Campaigns** | Marketing | budget, targeting | Campaign management |
| **🔔 Notifications** | User communications | channels, delivery | User engagement |

---

## 💰 Revenue Streams

### 1. Sponsored Content
```javascript
// Pricing tiers
Bronze: $50-150/post    // Local gyms, small brands
Silver: $150-300/post   // Mid-size fitness brands
Gold: $300-500/post     // Major supplement brands
Platinum: $500+/post    // Premium equipment brands
```

### 2. Review Monetization
```javascript
// Review types
Organic: $0             // Natural user reviews
Sponsored: $100-400     // Paid brand reviews
Verified: +20% bonus    // Verified purchase/experience
```

### 3. Subscription Plans
```javascript
Free: $0/month          // Basic features, ads
Premium: $9.99/month    // Ad-free, premium content
Pro: $19.99/month       // All features, priority support
```

---

## 🔗 Key Relationships

```
👤 User
├── 🏋️ Workouts (1:many)
├── ⭐ Reviews (1:many)
├── 💰 SponsoredContent (1:many as author)
└── 🔔 Notifications (1:many)

🏋️ Workout
├── 💪 Exercises (many:many)
├── ⭐ Reviews (1:many)
└── 📊 Analytics (embedded)

💰 SponsoredContent
├── 📈 Campaign (many:1)
├── 📊 Analytics (embedded)
└── ⭐ Reviews (1:many)
```

---

## 📊 Core Schemas (Simplified)

### Users
```typescript
interface User {
  email: string;                    // unique
  username: string;                 // unique
  role: 'user' | 'trainer' | 'admin' | 'sponsor';
  profile: {
    firstName: string;
    lastName: string;
    age: number;
    weight: number;
    height: number;
    fitnessGoals: string[];
    experienceLevel: string;
  };
  subscription: {
    plan: 'free' | 'premium' | 'pro';
    status: string;
    features: string[];
  };
}
```

### Workouts
```typescript
interface Workout {
  userId: ObjectId;                 // ref: User
  name: string;
  category: string;
  difficulty: string;
  exercises: ExerciseSet[];
  isSponsored: boolean;
  sponsorData?: {
    sponsorId: ObjectId;
    rate: number;
    type: string;
  };
  likeCount: number;               // denormalized
  views: number;
}
```

### SponsoredContent
```typescript
interface SponsoredContent {
  title: string;
  author: ObjectId;                // ref: User
  type: 'review' | 'guide' | 'promotion';
  sponsor: {
    company: string;
    rate: number;
  };
  analytics: {
    views: number;
    clicks: number;
    revenue: number;
    ctr: number;
  };
  status: 'draft' | 'published' | 'archived';
}
```

### Reviews
```typescript
interface Review {
  userId: ObjectId;                // ref: User
  targetType: string;              // 'workout', 'gym', 'product'
  targetId: ObjectId;
  rating: {
    overall: number;               // 1-5
    quality: number;
    value: number;
  };
  verified: boolean;
  isSponsored: boolean;
  compensation?: {
    amount: number;
    type: string;
  };
}
```

---

## ⚡ Performance Indexes

### Critical Indexes
```javascript
// Users
{ email: 1 }                      // unique, login
{ username: 1 }                   // unique, profile
{ role: 1, isActive: 1 }         // admin queries

// Workouts
{ userId: 1, createdAt: -1 }     // user timeline
{ isPublic: 1, averageRating: -1 } // discovery
{ category: 1, difficulty: 1 }    // filtering

// SponsoredContent
{ status: 1, publishedAt: -1 }   // published content
{ "analytics.views": -1 }        // trending

// Reviews
{ targetType: 1, targetId: 1 }   // target reviews
{ userId: 1, createdAt: -1 }     // user reviews
```

---

## 🔄 Business Workflows

### Content Creation Flow
```
1. User/Sponsor creates content
2. Admin review (if sponsored)
3. Content published with tracking
4. Analytics collection
5. Revenue calculation
6. Payment processing
```

### User Engagement Flow
```
1. User browses content
2. Interacts (view, like, share)
3. Analytics tracked
4. Personalization updated
5. Recommendations refined
```

### Monetization Flow
```
1. Sponsor creates campaign
2. Content creators apply
3. Content produced & approved
4. Published with tracking
5. Performance analytics
6. Revenue distribution
```

---

## 🎯 Development Quick Tips

### Environment Variables
```bash
MONGODB_URI=mongodb://localhost:27017/trackme
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud
STRIPE_SECRET_KEY=sk_test_xxx
```

### Common Queries
```javascript
// Get user workouts
const workouts = await Workout.find({ userId }).sort({ createdAt: -1 });

// Get trending content
const trending = await SponsoredContent.find({ status: 'published' })
  .sort({ 'analytics.views': -1 }).limit(10);

// Get user reviews
const reviews = await Review.find({ userId }).populate('targetId');
```

### Validation Rules
```javascript
// User profile
age: { min: 13, max: 120 }
weight: { min: 20, max: 500 }  // kg
height: { min: 100, max: 250 } // cm

// Content
title: { maxLength: 200 }
description: { maxLength: 1000 }
```

---

## 📈 Analytics Tracking

### Key Metrics
- **User Metrics**: Active users, retention, churn
- **Content Metrics**: Views, engagement, ratings
- **Revenue Metrics**: Daily revenue, ARPU, conversion
- **Performance Metrics**: Page load, bounce rate

### Revenue Calculation
```javascript
const calculateRevenue = (content) => {
  const baseRate = content.sponsor.rate;
  const viewBonus = content.analytics.views * 0.01;
  const clickBonus = content.analytics.clicks * 0.05;
  return baseRate + viewBonus + clickBonus;
};
```

---

*🚀 This quick reference covers essential schema information for TrackMe development.*
