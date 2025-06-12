/**
 * 📖 Swagger API Documentation Configuration
 * Complete API documentation for Fitness Web App
 */

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

/**
 * Swagger definition
 */
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: '🏋️ Fitness Web App API',
        version: '1.0.0',
        description: `
# Fitness Web App - Backend API

**Sponsored Content & Reviews Monetization Platform**

This API powers a comprehensive fitness application with focus on monetized content through sponsored reviews, workout guides, and fitness recommendations.

## 🎯 Key Features
- 👤 **User Management**: Registration, authentication, profiles
- 🏋️ **Workout System**: Exercise library, custom workouts, progress tracking
- 💰 **Sponsored Content**: Monetized reviews and guides  
- ⭐ **Review System**: Multi-criteria ratings for gyms, trainers, equipment
- 📊 **Analytics**: Performance and revenue tracking

## 🔐 Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## 📊 Monetization Tiers
- **Tier 1 (Premium)**: $300-500/post - Major brands, gym chains
- **Tier 2 (Standard)**: $150-300/post - Local businesses, trainers
- **Tier 3 (Entry)**: $50-150/post - Small businesses, apps

## 🚀 Quick Start
1. Register a new account: \`POST /api/v1/auth/register\`
2. Login to get JWT token: \`POST /api/v1/auth/login\`
3. Access protected endpoints with token
`,
        contact: {
            name: 'Fitness App API Support',
            email: 'support@fitnessapp.com',
            url: 'https://fitnessapp.com'
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
        }
    },
    servers: [
        {
            url: 'http://localhost:{port}/api/{version}',
            description: 'Development server',
            variables: {
                port: {
                    default: '3000'
                },
                version: {
                    default: 'v1'
                }
            }
        },
        {
            url: 'https://api.fitnessapp.com/api/{version}',
            description: 'Production server',
            variables: {
                version: {
                    default: 'v1'
                }
            }
        }
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'JWT token obtained from login endpoint'
            }
        },
        schemas: {
            // ================================
            // 🔐 Authentication Schemas
            // ================================
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'john.doe@example.com'
                    },
                    password: {
                        type: 'string',
                        minLength: 6,
                        example: 'password123'
                    }
                }
            },
            RegisterRequest: {
                type: 'object',
                required: ['email', 'username', 'password', 'profile'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'john.doe@example.com'
                    },
                    username: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 30,
                        example: 'johndoe'
                    },
                    password: {
                        type: 'string',
                        minLength: 6,
                        example: 'password123'
                    },
                    profile: {
                        $ref: '#/components/schemas/UserProfileInput'
                    }
                }
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                        type: 'object',
                        properties: {
                            user: { $ref: '#/components/schemas/User' },
                            tokens: { $ref: '#/components/schemas/AuthTokens' }
                        }
                    },
                    message: { type: 'string', example: 'Login successful' }
                }
            },
            AuthTokens: {
                type: 'object',
                properties: {
                    accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    expiresIn: { type: 'number', example: 604800 }
                }
            },

            // ================================
            // 👤 User Schemas
            // ================================
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                    username: { type: 'string', example: 'johndoe' },
                    role: { type: 'string', enum: ['user', 'trainer', 'admin', 'sponsor'], example: 'user' },
                    profile: { $ref: '#/components/schemas/UserProfile' },
                    preferences: { $ref: '#/components/schemas/UserPreferences' },
                    subscription: { $ref: '#/components/schemas/UserSubscription' },
                    isEmailVerified: { type: 'boolean', example: true },
                    lastLoginAt: { type: 'string', format: 'date-time' },
                    isActive: { type: 'boolean', example: true },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            UserProfile: {
                type: 'object',
                properties: {
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    age: { type: 'number', minimum: 13, maximum: 120, example: 25 },
                    weight: { type: 'number', minimum: 20, maximum: 500, example: 75 },
                    height: { type: 'number', minimum: 100, maximum: 250, example: 180 },
                    fitnessGoals: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['weight_loss', 'muscle_gain', 'strength', 'endurance', 'flexibility', 'general_fitness']
                        },
                        example: ['muscle_gain', 'strength']
                    },
                    experienceLevel: {
                        type: 'string',
                        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
                        example: 'intermediate'
                    },
                    avatar: { type: 'string', format: 'url', example: 'https://res.cloudinary.com/fitness-app/image/upload/v1234567890/avatar.jpg' },
                    bio: { type: 'string', maxLength: 500, example: 'Fitness enthusiast passionate about strength training and nutrition.' },
                    bmi: { type: 'number', readOnly: true, example: 23.1 },
                    fullName: { type: 'string', readOnly: true, example: 'John Doe' }
                }
            },
            UserProfileInput: {
                type: 'object',
                required: ['firstName', 'lastName', 'age', 'weight', 'height', 'fitnessGoals', 'experienceLevel'],
                properties: {
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    age: { type: 'number', minimum: 13, maximum: 120, example: 25 },
                    weight: { type: 'number', minimum: 20, maximum: 500, example: 75 },
                    height: { type: 'number', minimum: 100, maximum: 250, example: 180 },
                    fitnessGoals: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['weight_loss', 'muscle_gain', 'strength', 'endurance', 'flexibility', 'general_fitness']
                        },
                        example: ['muscle_gain', 'strength']
                    },
                    experienceLevel: {
                        type: 'string',
                        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
                        example: 'intermediate'
                    },
                    bio: { type: 'string', maxLength: 500, example: 'Fitness enthusiast...' }
                }
            },
            UserPreferences: {
                type: 'object',
                properties: {
                    contentTypes: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['workout', 'nutrition', 'review', 'guide', 'news']
                        }
                    },
                    notifications: {
                        type: 'object',
                        properties: {
                            workoutReminders: { type: 'boolean', example: true },
                            newContent: { type: 'boolean', example: true },
                            sponsoredOffers: { type: 'boolean', example: false },
                            socialUpdates: { type: 'boolean', example: true },
                            email: { type: 'boolean', example: true },
                            push: { type: 'boolean', example: true }
                        }
                    },
                    privacy: {
                        type: 'object',
                        properties: {
                            profileVisibility: { type: 'string', enum: ['public', 'friends', 'private'], example: 'public' },
                            workoutVisibility: { type: 'string', enum: ['public', 'friends', 'private'], example: 'public' },
                            showInLeaderboards: { type: 'boolean', example: true },
                            allowDirectMessages: { type: 'boolean', example: true }
                        }
                    },
                    theme: { type: 'string', enum: ['light', 'dark', 'auto'], example: 'auto' }
                }
            },
            UserSubscription: {
                type: 'object',
                properties: {
                    plan: { type: 'string', enum: ['free', 'premium', 'trainer', 'business'], example: 'free' },
                    status: { type: 'string', enum: ['active', 'inactive', 'cancelled', 'expired'], example: 'active' },
                    startDate: { type: 'string', format: 'date-time' },
                    endDate: { type: 'string', format: 'date-time' },
                    features: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['unlimited_workouts', 'premium_content']
                    },
                    isActive: { type: 'boolean', readOnly: true, example: true }
                }
            },

            // ================================
            // 🏋️ Workout Schemas
            // ================================
            Workout: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
                    name: { type: 'string', example: 'Push Day Workout' },
                    description: { type: 'string', example: 'Complete upper body push workout focusing on chest, shoulders, and triceps' },
                    exercises: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Exercise' }
                    },
                    duration: { type: 'number', example: 60 },
                    caloriesBurned: { type: 'number', example: 450 },
                    difficulty: { type: 'string', enum: ['easy', 'moderate', 'hard', 'extreme'], example: 'moderate' },
                    tags: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['chest', 'shoulders', 'push', 'strength']
                    },
                    isPublic: { type: 'boolean', example: true },
                    likes: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/WorkoutLike' }
                    },
                    reviews: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/WorkoutReview' }
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            Exercise: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
                    name: { type: 'string', example: 'Bench Press' },
                    description: { type: 'string', example: 'Compound chest exercise performed lying on a bench' },
                    muscle_groups: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio']
                        },
                        example: ['chest', 'shoulders', 'arms']
                    },
                    equipment: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['bodyweight', 'dumbbells', 'barbell', 'machine', 'resistance_bands', 'kettlebell', 'cable']
                        },
                        example: ['barbell']
                    },
                    sets: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/ExerciseSet' }
                    },
                    instructions: {
                        type: 'array',
                        items: { type: 'string' },
                        example: [
                            'Lie flat on bench with feet firmly on the ground',
                            'Grip barbell with hands slightly wider than shoulder width',
                            'Lower the bar to chest with control',
                            'Press the bar back up to starting position'
                        ]
                    },
                    tips: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['Keep your core tight', 'Don\'t bounce the bar off your chest']
                    },
                    images: {
                        type: 'array',
                        items: { type: 'string', format: 'url' },
                        example: ['https://res.cloudinary.com/fitness-app/image/upload/v1234567890/bench-press-1.jpg']
                    },
                    videos: {
                        type: 'array',
                        items: { type: 'string', format: 'url' },
                        example: ['https://res.cloudinary.com/fitness-app/video/upload/v1234567890/bench-press-demo.mp4']
                    }
                }
            },
            ExerciseSet: {
                type: 'object',
                properties: {
                    setNumber: { type: 'number', example: 1 },
                    reps: { type: 'number', example: 12 },
                    weight: { type: 'number', example: 80 },
                    duration: { type: 'number', example: 30 },
                    restTime: { type: 'number', example: 60 },
                    notes: { type: 'string', example: 'Felt strong today, could increase weight next time' }
                }
            },
            WorkoutLike: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '507f1f77bcf86cd799439014' },
                    userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
                    workoutId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    isLiked: { type: 'boolean', example: true },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            WorkoutReview: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '507f1f77bcf86cd799439015' },
                    userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
                    workoutId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    rating: { type: 'number', minimum: 1, maximum: 5, example: 4 },
                    comment: { type: 'string', example: 'Great workout! Really felt the burn in my chest.' },
                    helpful: { type: 'number', example: 5 },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },

            // ================================
            // 💰 Sponsored Content Schemas
            // ================================
            SponsoredContent: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '507f1f77bcf86cd799439016' },
                    title: { type: 'string', example: 'Elite Fitness Gym Review: Premium Training Experience' },
                    content: { type: 'string', example: 'After training at Elite Fitness for 3 months, here\'s my comprehensive review...' },
                    excerpt: { type: 'string', example: 'Premium gym with state-of-the-art equipment and expert trainers' },
                    author: { type: 'string', example: '507f1f77bcf86cd799439012' },
                    sponsor: { $ref: '#/components/schemas/SponsorData' },
                    metadata: { $ref: '#/components/schemas/ContentMetadata' },
                    analytics: { $ref: '#/components/schemas/ContentAnalytics' },
                    status: { type: 'string', enum: ['draft', 'pending', 'approved', 'published', 'archived', 'rejected'], example: 'published' },
                    publishDate: { type: 'string', format: 'date-time' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            SponsorData: {
                type: 'object',
                properties: {
                    company: { type: 'string', example: 'Elite Fitness Chain' },
                    campaign: { type: 'string', example: 'New Location Launch 2024' },
                    contactEmail: { type: 'string', format: 'email', example: 'marketing@elitefitness.com' },
                    rate: { type: 'number', example: 450 },
                    type: { type: 'string', enum: ['review', 'guide', 'promotion', 'tutorial'], example: 'review' },
                    tier: { type: 'string', enum: ['tier1', 'tier2', 'tier3'], example: 'tier1' },
                    contract: {
                        type: 'object',
                        properties: {
                            startDate: { type: 'string', format: 'date' },
                            endDate: { type: 'string', format: 'date' },
                            terms: { type: 'string', example: 'Exclusive review with 6-month promotion period' }
                        }
                    }
                }
            },
            ContentMetadata: {
                type: 'object',
                properties: {
                    tags: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['gym', 'review', 'premium', 'equipment']
                    },
                    category: {
                        type: 'string',
                        enum: ['gym_review', 'equipment_review', 'supplement_review', 'trainer_review', 'workout_guide', 'nutrition_guide'],
                        example: 'gym_review'
                    },
                    targetAudience: {
                        type: 'object',
                        properties: {
                            ageRange: {
                                type: 'array',
                                items: { type: 'number' },
                                minItems: 2,
                                maxItems: 2,
                                example: [18, 45]
                            },
                            experienceLevel: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    enum: ['beginner', 'intermediate', 'advanced', 'expert']
                                },
                                example: ['intermediate', 'advanced']
                            },
                            interests: {
                                type: 'array',
                                items: { type: 'string' },
                                example: ['strength_training', 'bodybuilding', 'fitness']
                            }
                        }
                    },
                    seoKeywords: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['elite fitness review', 'premium gym', 'best gym equipment']
                    },
                    featuredImage: { type: 'string', format: 'url', example: 'https://res.cloudinary.com/fitness-app/image/upload/v1234567890/elite-fitness-featured.jpg' }
                }
            },
            ContentAnalytics: {
                type: 'object',
                properties: {
                    views: { type: 'number', example: 1250 },
                    clicks: { type: 'number', example: 89 },
                    shares: { type: 'number', example: 23 },
                    likes: { type: 'number', example: 156 },
                    comments: { type: 'number', example: 34 },
                    engagement: { type: 'number', example: 0.24 },
                    revenue: { type: 'number', example: 450 },
                    conversionRate: { type: 'number', example: 0.071 }
                }
            },

            // ================================
            // ⭐ Review Schemas
            // ================================
            Review: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '507f1f77bcf86cd799439017' },
                    targetId: { type: 'string', example: '507f1f77bcf86cd799439018' },
                    targetType: { type: 'string', enum: ['gym', 'trainer', 'equipment', 'supplement', 'app'], example: 'gym' },
                    userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
                    rating: { $ref: '#/components/schemas/ReviewRating' },
                    title: { type: 'string', example: 'Excellent gym with great equipment' },
                    content: { type: 'string', example: 'I\'ve been training here for 6 months and the experience has been fantastic...' },
                    images: {
                        type: 'array',
                        items: { type: 'string', format: 'url' },
                        example: ['https://res.cloudinary.com/fitness-app/image/upload/v1234567890/gym-review-1.jpg']
                    },
                    videos: {
                        type: 'array',
                        items: { type: 'string', format: 'url' },
                        example: ['https://res.cloudinary.com/fitness-app/video/upload/v1234567890/gym-tour.mp4']
                    },
                    helpful: { type: 'number', example: 15 },
                    notHelpful: { type: 'number', example: 2 },
                    sponsored: { type: 'boolean', example: false },
                    verifiedPurchase: { type: 'boolean', example: true },
                    status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'flagged'], example: 'approved' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            ReviewRating: {
                type: 'object',
                properties: {
                    overall: { type: 'number', minimum: 1, maximum: 5, example: 4 },
                    quality: { type: 'number', minimum: 1, maximum: 5, example: 5 },
                    value: { type: 'number', minimum: 1, maximum: 5, example: 4 },
                    service: { type: 'number', minimum: 1, maximum: 5, example: 4 },
                    atmosphere: { type: 'number', minimum: 1, maximum: 5, example: 5 },
                    cleanliness: { type: 'number', minimum: 1, maximum: 5, example: 4 }
                }
            },

            // ================================
            // 📊 Common Response Schemas
            // ================================
            ApiResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'object' },
                    message: { type: 'string', example: 'Operation completed successfully' },
                    error: { type: 'string', example: null }
                }
            },
            PaginatedResponse: {
                allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                        type: 'object',
                        properties: {
                            pagination: {
                                type: 'object',
                                properties: {
                                    page: { type: 'number', example: 1 },
                                    limit: { type: 'number', example: 10 },
                                    total: { type: 'number', example: 42 },
                                    totalPages: { type: 'number', example: 5 },
                                    hasNext: { type: 'boolean', example: true },
                                    hasPrev: { type: 'boolean', example: false }
                                }
                            }
                        }
                    }
                ]
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Validation failed' },
                    data: { type: 'object', nullable: true, example: null }
                }
            },
            ValidationError: {
                allOf: [
                    { $ref: '#/components/schemas/ErrorResponse' },
                    {
                        type: 'object',
                        properties: {
                            errors: {
                                type: 'object',
                                additionalProperties: { type: 'string' },
                                example: {
                                    email: 'Email is required',
                                    password: 'Password must be at least 6 characters'
                                }
                            }
                        }
                    }
                ]
            }
        },
        responses: {
            Unauthorized: {
                description: 'Authentication failed',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' },
                        example: {
                            success: false,
                            error: 'Invalid token. Please log in again.',
                            data: null
                        }
                    }
                }
            },
            Forbidden: {
                description: 'Insufficient permissions',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' },
                        example: {
                            success: false,
                            error: 'Insufficient permissions',
                            data: null
                        }
                    }
                }
            },
            NotFound: {
                description: 'Resource not found',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' },
                        example: {
                            success: false,
                            error: 'Resource not found',
                            data: null
                        }
                    }
                }
            },
            ValidationError: {
                description: 'Validation failed',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ValidationError' }
                    }
                }
            },
            InternalServerError: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' },
                        example: {
                            success: false,
                            error: 'Something went wrong!',
                            data: null
                        }
                    }
                }
            }
        }
    },
    security: [
        {
            BearerAuth: []
        }
    ]
};

/**
 * Swagger JSDoc options
 */
const swaggerOptions: swaggerJSDoc.Options = {
    definition: swaggerDefinition,
    apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts',
        './src/models/*.ts'
    ]
};

/**
 * Generate Swagger specification
 */
export const swaggerSpec = swaggerJSDoc(swaggerOptions);

/**
 * Setup Swagger UI middleware
 */
export const setupSwagger = (app: Application): void => {
    // Swagger UI setup
    const swaggerUiOptions = {
        explorer: true,
        customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin-bottom: 30px }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px }
    `,
        customSiteTitle: '🏋️ Fitness App API Documentation',
        customfavIcon: '/favicon.ico'
    };

    // Serve Swagger documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

    // Serve raw swagger spec
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log('📖 Swagger Documentation available at: /api-docs');
    console.log('📄 Swagger JSON available at: /api-docs.json');
};
