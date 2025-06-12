# 🏋️ Fitness Web App - Backend API

> **Sponsored Content & Reviews Monetization Platform**  
> Built with Node.js, Express, TypeScript, MongoDB

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secrets, etc.

# 3. Start development server
npm run dev

# 4. Visit health check
curl http://localhost:5000/health
```

## 🎯 Project Overview

This is the backend API for a fitness web application focused on **sponsored content monetization**. The platform enables:

- 👤 **User Management**: Authentication, profiles, preferences
- 🏋️ **Workout System**: Exercise library, custom workouts, progress tracking  
- 💰 **Sponsored Content**: Monetized reviews, guides, and promotional content
- ⭐ **Review System**: Multi-criteria ratings for gyms, trainers, equipment
- 📊 **Analytics**: Performance tracking for content and revenue

## 🔧 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt
- **File Storage**: Cloudinary integration
- **Security**: Helmet, CORS, rate limiting
- **Testing**: Jest with TypeScript support
- **Code Quality**: ESLint + Prettier

## 📁 Project Structure

```
src/
├── config/          # Database, Cloudinary, Auth configuration
├── controllers/     # HTTP request handlers
├── middleware/      # Express middleware (auth, errors, validation)
├── models/          # MongoDB schemas with Mongoose
├── routes/          # API route definitions
├── services/        # Business logic layer
├── types/           # TypeScript type definitions
├── utils/           # Helper functions and utilities
├── tests/           # Test files
└── index.ts         # Main server entry point
```

## 🔐 Environment Variables

Key environment variables (see `.env.example`):

```bash
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/fitness-app

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Sponsored Content Rates
SPONSORED_CONTENT_RATE_TIER1=500
SPONSORED_CONTENT_RATE_TIER2=300
SPONSORED_CONTENT_RATE_TIER3=150
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/logout` - User logout

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/:id` - Get user by ID

### Workouts
- `GET /api/v1/workouts` - Get all workouts
- `POST /api/v1/workouts` - Create new workout
- `GET /api/v1/workouts/:id` - Get workout by ID
- `PUT /api/v1/workouts/:id` - Update workout

### Sponsored Content
- `GET /api/v1/sponsored-content` - Get sponsored content
- `POST /api/v1/sponsored-content` - Create sponsored content
- `PUT /api/v1/sponsored-content/:id` - Update content
- `GET /api/v1/sponsored-content/analytics` - Get analytics

### Reviews
- `GET /api/v1/reviews` - Get reviews
- `POST /api/v1/reviews` - Create review
- `PUT /api/v1/reviews/:id` - Update review
- `POST /api/v1/reviews/:id/helpful` - Mark review as helpful

## 💰 Monetization Strategy

### Sponsored Content Tiers
- **Tier 1 (Premium)**: $300-500/post - Gym chains, major brands
- **Tier 2 (Standard)**: $150-300/post - Local gyms, personal trainers  
- **Tier 3 (Entry)**: $50-150/post - Health foods, fitness apps

### Revenue Streams
1. **Sponsored Reviews**: Gym, equipment, supplement reviews
2. **Educational Content**: Workout guides, nutrition articles
3. **Promotional Posts**: Special offers, product launches
4. **Affiliate Partnerships**: Commission-based referrals

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- User.test.ts
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Check for lint errors
npm run lint

# Auto-fix lint errors
npm run lint:fix

# Format code
npm run format
```

## 📊 Performance Targets

- **Response Time**: < 200ms for API endpoints
- **Database Queries**: Optimized with proper indexes
- **File Uploads**: Cloudinary integration with image optimization
- **Security**: Rate limiting, input validation, secure headers

## 🔍 Monitoring & Health

- **Health Check**: `GET /health` - Server status and database connectivity
- **Logging**: Morgan middleware for request logging
- **Error Handling**: Centralized error management with proper HTTP status codes

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/sponsored-content-api`
3. Follow TypeScript and ESLint rules
4. Add tests for new features
5. Update documentation
6. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

---

**🎯 Goal**: Build a scalable fitness platform that generates revenue through high-quality sponsored content and reviews, providing value to both users and fitness industry partners.
