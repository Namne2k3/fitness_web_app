````

````markdown
# 🏋️ Fitness Web App - System Schema Overview
## Giải thích toàn bộ cấu trúc dữ liệu và mối quan hệ

---

## 🎯 **Big Picture - Tổng quan hệ thống**

Fitness Web App có **4 core entities chính**:
1. **👤 USERS** - Người dùng (members, trainers, sponsors, admin)
2. **🏋️ WORKOUTS** - Bài tập thể dục 
3. **📝 REVIEWS** - Đánh giá sản phẩm/dịch vụ
4. **💰 SPONSORED CONTENT** - Nội dung quảng cáo có trả phí

---

## 🔗 **Mối quan hệ giữa các entities**

```
👤 USER (1) -----> (Many) 🏋️ WORKOUTS
   |                      |
   |                      |
   +--> (Many) 📝 REVIEWS +--> (Many) 💰 SPONSORED CONTENT
                |                         ^
                |                         |
                +-------------------------+
```

---

## 📊 **Chi tiết từng Schema**

### 1. 👤 **USER Schema** - Trung tâm của hệ thống

```typescript
interface User {
  // Basic Info
  id: string                    // "user_123"
  email: string                 // "john@gmail.com"  
  username: string              // "john_fitness"
  avatar?: string               // URL ảnh đại diện
  
  // Profile Details  
  profile: UserProfile {
    firstName: "John"
    lastName: "Doe"
    age: 25
    weight: 70          // kg
    height: 175         // cm
    gender: "male"
    fitnessGoals: ["weight_loss", "muscle_gain"]
    experienceLevel: "beginner"
    medicalConditions?: ["knee_injury"]
  }
  
  // System Info
  role: "user" | "trainer" | "admin" | "sponsor"
  isVerified: boolean
  createdAt: Date
}
```

**💡 User có 4 vai trò:**
- **USER**: Thành viên thường
- **TRAINER**: Huấn luyện viên (tạo workout premium)
- **SPONSOR**: Nhà tài trợ (tạo sponsored content)
- **ADMIN**: Quản trị viên

---

### 2. 🏋️ **WORKOUT Schema** - Bài tập thể dục

```typescript
interface Workout {
  // Basic Info
  id: string                    // "workout_456"
  userId: string                // Người tạo workout
  name: "Morning Cardio"
  description?: "Bài tập buổi sáng giảm cân"
  
  // Workout Details
  exercises: Exercise[] {
    [
      {
        id: "ex_1"
        name: "Push-ups"
        instructions: ["Nằm xuống", "Đẩy người lên"]
        sets: 3
        reps: 15
        restTime: 60    // giây nghỉ
        muscleGroups: ["chest", "triceps"]
        equipment?: ["none"]
      }
    ]
  }
  
  duration: 30                  // phút
  difficulty: "beginner"
  category: "cardio"
  tags: ["morning", "fat-loss"]
  
  // Monetization 💰
  isSponsored: boolean          // Có phải sponsored không?
  sponsorData?: SponsorData {   // Thông tin nhà tài trợ
    sponsorName: "Whey Protein Brand"
    dealValue: 200              // $200 cho post này
    promotionalText: "Powered by XYZ Protein"
    trackingUrl: "https://xyz.com/track?ref=workout456"
    impressions: 1500
    clicks: 45
    conversions: 3
  }
  
  // Social Features
  isPublic: boolean
  ratings: Rating[]
  averageRating: 4.5
  
  createdAt: Date
}
```

**💡 Workout Monetization Logic:**
- Workout thường: `isSponsored = false`
- Workout có tài trợ: `isSponsored = true` + có `sponsorData`
- Sponsor trả $50-500 tùy theo tier và engagement

---

### 3. 📝 **REVIEW Schema** - Đánh giá sản phẩm

```typescript
interface Review {
  // Basic Info
  id: string                    // "review_789"
  userId: string                // Người viết review
  
  // Target Info - Đánh giá cái gì?
  targetId: string              // ID của gym/trainer/supplement
  targetType: "gym" | "trainer" | "supplement" | "equipment"
  
  // Review Content
  title: "Amazing Gym Experience"
  content: "Gym này có thiết bị hiện đại..."
  
  // Detailed Rating
  rating: DetailedRating {
    overall: 5                  // Tổng thể 1-5 sao
    quality: 5                  // Chất lượng
    value: 4                    // Giá trị
    service: 5                  // Dịch vụ
    cleanliness: 4              // Vệ sinh (gym)
    equipment: 5                // Thiết bị
  }
  
  // Extra Info
  pros: ["Sạch sẽ", "PT nhiệt tình"]
  cons: ["Hơi đông người"]
  images?: ["gym1.jpg", "gym2.jpg"]
  
  // Monetization 💰
  isSponsored: boolean          // Review có trả phí không?
  isVerified: boolean           // Đã verify mua hàng chưa?
  
  // Social Features
  helpfulCount: 25              // Số người thấy helpful
  unhelpfulCount: 2
  replies: ReviewReply[]        // Gym owner reply
  
  createdAt: Date
}
```

**💡 Review Monetization:**
- Review thật: `isSponsored = false`, có `isVerified = true`
- Sponsored review: `isSponsored = true`, sponsor trả $100-400
- Verified review: User đã mua/sử dụng sản phẩm

---

### 4. 💰 **SPONSORED CONTENT Schema** - Nội dung quảng cáo

```typescript
interface SponsoredContent {
  // Basic Info
  id: string                    // "content_101"
  title: "Top 5 Protein Powders 2025"
  content: "HTML content of the article..."
  excerpt: "Discover the best proteins..."
  
  // Author & Sponsor
  authorId: string              // Content creator
  sponsor: Sponsor {
    companyName: "Optimum Nutrition"
    logo: "on_logo.png"
    tier: "gold"                // bronze/silver/gold/platinum
    campaign: Campaign {
      name: "2025 Protein Launch"
      budget: 5000              // $5000 budget
      startDate: Date
      endDate: Date
    }
  }
  
  // Content Classification
  type: "review" | "tutorial" | "guide" | "promotion"
  category: "supplement_review"
  tags: ["protein", "muscle-gain", "nutrition"]
  
  // Media
  featuredImage: "protein_review.jpg"
  gallery?: ["img1.jpg", "img2.jpg"]
  
  // Business Analytics 📊
  analytics: ContentAnalytics {
    views: 5000
    uniqueViews: 3200
    clicks: 150                 // Click to sponsor website
    shares: 45
    likes: 120
    engagementRate: 8.5         // %
    revenue: 300                // $300 earned from this post
  }
  
  // Content Status
  status: "published"          // draft -> pending -> approved -> published
  isApproved: true
  publishedAt: Date
}
```

**💡 Sponsored Content Pricing:**
- **Bronze Tier**: $50-150/post
- **Silver Tier**: $150-300/post  
- **Gold Tier**: $300-500/post
- **Platinum Tier**: $500+/post

---

## 🔄 **Workflow - Luồng hoạt động**

### **User Journey:**
```
1. User Register/Login
2. Create Profile (goals, experience)
3. Browse Workouts (free + sponsored)
4. Create own Workouts
5. Write Reviews (earn credibility)
6. Engage with Sponsored Content
```

### **Monetization Journey:**
```
1. Sponsor registers
2. Create Campaign (budget, goals)
3. Content Creator writes sponsored post
4. Admin approves content
5. Content published with tracking
6. Analytics tracked (views, clicks, conversions)
7. Revenue calculated & distributed
```

---

## 📈 **Business Logic Examples**

### **Sponsored Workout Example:**
```typescript
// Workout được McDonald's sponsor
const sponsoredWorkout: Workout = {
  name: "Quick Office Workout",
  isSponsored: true,
  sponsorData: {
    sponsorName: "McDonald's Salad Line",
    dealValue: 150,             // $150 cho post này
    promotionalText: "Fuel your workout with fresh salads!",
    callToAction: "Order Now - 20% off",
    trackingUrl: "https://mcdonalds.com/track?ref=office-workout"
  }
}
```

### **Sponsored Review Example:**
```typescript
// Review về gym được gym đó sponsor
const sponsoredReview: Review = {
  title: "My Experience at FitnessPro Gym",
  isSponsored: true,           // Phải hiển thị "Sponsored" badge
  targetType: "gym",
  targetId: "gym_fitnesspro",
  rating: {
    overall: 5,
    equipment: 5,
    cleanliness: 4,
    service: 5
  }
}
```

---

## 🎯 **Revenue Calculation Logic**

```typescript
/**
 * Tính revenue cho sponsored content
 */
const calculateRevenue = (content: SponsoredContent): number => {
  const { tier, analytics } = content.sponsor;
  const { views, clicks, conversions } = analytics;
  
  // Base rate theo tier
  const baseRates = {
    bronze: 0.05,    // $0.05/view
    silver: 0.08,    // $0.08/view  
    gold: 0.12,      // $0.12/view
    platinum: 0.20   // $0.20/view
  };
  
  // Bonus cho clicks và conversions
  const clickBonus = clicks * 0.50;        // $0.50/click
  const conversionBonus = conversions * 5;  // $5/conversion
  
  return (views * baseRates[tier]) + clickBonus + conversionBonus;
};
```

---

## 🔍 **Key Relationships Summary**

1. **User (1) → Workouts (Many)**
   - Mỗi user có thể tạo nhiều workout
   - Workout có thể sponsored hoặc free

2. **User (1) → Reviews (Many)**  
   - User viết review về gym/trainer/products
   - Review có thể sponsored (trả phí)

3. **Sponsor (1) → SponsoredContent (Many)**
   - Sponsor tạo campaigns
   - Mỗi campaign có nhiều sponsored posts

4. **User → SponsoredContent (Engagement)**
   - User xem, click, share sponsored content
   - Analytics tracking cho revenue calculation

---

## 💡 **Tại sao thiết kế như vậy?**

1. **Flexibility**: Schema linh hoạt, có thể mở rộng
2. **Monetization**: Tích hợp sẵn các tính năng kiếm tiền
3. **Analytics**: Track được mọi hoạt động để optimize revenue
4. **User Experience**: Balance giữa content quality và monetization
5. **Scalability**: Có thể scale khi user base tăng

---

Bây giờ bạn đã hiểu toàn bộ schema chưa? Có phần nào cần tôi giải thích thêm không? 🚀