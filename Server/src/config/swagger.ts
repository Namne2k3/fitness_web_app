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
            }, UserProfile: {
                type: 'object',
                properties: {
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    age: { type: 'number', minimum: 13, maximum: 120, example: 25 },
                    gender: { type: 'string', enum: ['male', 'female', 'other'], example: 'male' },
                    weight: { type: 'number', minimum: 20, maximum: 500, example: 75 },
                    height: { type: 'number', minimum: 100, maximum: 250, example: 180 },
                    fitnessGoals: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['muscle_gain', 'strength']
                    },
                    experienceLevel: {
                        type: 'string',
                        enum: ['beginner', 'intermediate', 'advanced'],
                        example: 'intermediate'
                    },
                    avatar: { type: 'string', format: 'url', example: 'https://res.cloudinary.com/fitness-app/image/upload/v1234567890/avatar.jpg' },
                    bio: { type: 'string', maxLength: 500, example: 'Fitness enthusiast passionate about strength training and nutrition.' },
                    medicalConditions: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['high_blood_pressure', 'knee_injury']
                    },
                    bmi: { type: 'number', readOnly: true, example: 23.1 },
                    fullName: { type: 'string', readOnly: true, example: 'John Doe' }
                }
            }, UserProfileInput: {
                type: 'object',
                required: ['firstName', 'lastName', 'age', 'gender', 'weight', 'height', 'fitnessGoals', 'experienceLevel'],
                properties: {
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    age: { type: 'number', minimum: 13, maximum: 120, example: 25 },
                    gender: { type: 'string', enum: ['male', 'female', 'other'], example: 'male' },
                    weight: { type: 'number', minimum: 20, maximum: 500, example: 75 },
                    height: { type: 'number', minimum: 100, maximum: 250, example: 180 },
                    fitnessGoals: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['muscle_gain', 'strength']
                    },
                    experienceLevel: {
                        type: 'string',
                        enum: ['beginner', 'intermediate', 'advanced'],
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
                    }, privacy: {
                        type: 'object',
                        properties: {
                            profileVisibility: { type: 'string', enum: ['public', 'friends', 'private'], example: 'public' },
                            showRealName: { type: 'boolean', example: true },
                            allowMessages: { type: 'boolean', example: true },
                            shareWorkouts: { type: 'boolean', example: true },
                            trackingConsent: { type: 'boolean', example: false }
                        }
                    },
                    theme: { type: 'string', enum: ['light', 'dark', 'auto'], example: 'auto' },
                    language: { type: 'string', enum: ['vi', 'en'], example: 'vi' },
                    units: { type: 'string', enum: ['metric', 'imperial'], example: 'metric' }
                }
            }, UserSubscription: {
                type: 'object',
                properties: {
                    plan: { type: 'string', enum: ['free', 'premium', 'pro'], example: 'free' },
                    status: { type: 'string', enum: ['active', 'cancelled', 'expired'], example: 'active' },
                    startDate: { type: 'string', format: 'date-time' },
                    endDate: { type: 'string', format: 'date-time' },
                    stripeCustomerId: { type: 'string', example: 'cus_1234567890' },
                    stripeSubscriptionId: { type: 'string', example: 'sub_1234567890' },
                    cancelAtPeriodEnd: { type: 'boolean', example: false },
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
            // ================================            Workout: {
            type: 'object',
            properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
                name: { type: 'string', example: 'Push Day Workout' },
                description: { type: 'string', example: 'Complete upper body push workout focusing on chest, shoulders, and triceps' },
                category: { type: 'string', enum: ['strength', 'cardio', 'flexibility', 'hiit'], example: 'strength' },
                difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'], example: 'intermediate' },
                estimatedDuration: { type: 'number', example: 60 },
                tags: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['chest', 'shoulders', 'push', 'strength']
                },
                isPublic: { type: 'boolean', example: true },
                exercises: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            exerciseId: { type: 'string', example: '507f1f77bcf86cd799439013' },
                            order: { type: 'number', example: 1 },
                            sets: { type: 'number', example: 3 },
                            reps: { type: 'number', example: 12 },
                            duration: { type: 'number', example: 30 },
                            weight: { type: 'number', example: 80 },
                            restTime: { type: 'number', example: 60 },
                            notes: { type: 'string', example: 'Focus on controlled movement' },
                            completed: { type: 'boolean', example: false }
                        }
                    }
                },
                isSponsored: { type: 'boolean', example: false },
                sponsorData: {
                    type: 'object',
                    properties: {
                        sponsorId: { type: 'string', example: '507f1f77bcf86cd799439020' },
                        campaignId: { type: 'string', example: '507f1f77bcf86cd799439021' },
                        rate: { type: 'number', example: 200 },
                        type: { type: 'string', enum: ['review', 'guide', 'promotion'], example: 'guide' },
                        disclosure: { type: 'string', example: 'This workout is sponsored by Elite Fitness' }
                    }
                },
                likes: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['507f1f77bcf86cd799439014', '507f1f77bcf86cd799439015']
                },
                likeCount: { type: 'number', example: 25 },
                saves: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['507f1f77bcf86cd799439016']
                },
                saveCount: { type: 'number', example: 8 },
                shares: { type: 'number', example: 3 },
                views: { type: 'number', example: 150 },
                completions: { type: 'number', example: 12 },
                averageRating: { type: 'number', example: 4.2 },
                totalRatings: { type: 'number', example: 18 },
                muscleGroups: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['chest', 'shoulders', 'triceps']
                },
                equipment: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['barbell', 'bench', 'dumbbells']
                },
                caloriesBurned: { type: 'number', example: 450 },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }, Exercise: {
            type: 'object',
            properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
                name: { type: 'string', example: 'Bench Press' },
                description: { type: 'string', example: 'Compound chest exercise performed lying on a bench' },
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
                category: {
                    type: 'string',
                    enum: ['strength', 'cardio', 'flexibility', 'balance'],
                    example: 'strength'
                },
                primaryMuscleGroups: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['chest', 'shoulders']
                },
                secondaryMuscleGroups: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['triceps']
                },
                equipment: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['barbell', 'bench']
                },
                difficulty: {
                    type: 'string',
                    enum: ['beginner', 'intermediate', 'advanced'],
                    example: 'intermediate'
                },
                images: {
                    type: 'array',
                    items: { type: 'string', format: 'url' },
                    example: ['https://res.cloudinary.com/fitness-app/image/upload/v1234567890/bench-press-1.jpg']
                },
                videoUrl: { type: 'string', format: 'url', example: 'https://res.cloudinary.com/fitness-app/video/upload/v1234567890/bench-press-demo.mp4' },
                gifUrl: { type: 'string', format: 'url', example: 'https://res.cloudinary.com/fitness-app/image/upload/v1234567890/bench-press.gif' },
                caloriesPerMinute: { type: 'number', example: 8.5 },
                averageIntensity: { type: 'number', minimum: 1, maximum: 10, example: 7 },
                variations: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', example: 'Incline Bench Press' },
                            description: { type: 'string', example: 'Performed on an inclined bench to target upper chest' },
                            difficultyModifier: { type: 'string', enum: ['easier', 'harder', 'variation'], example: 'harder' },
                            instructions: {
                                type: 'array',
                                items: { type: 'string' }
                            }
                        }
                    }
                },
                precautions: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Use spotter for heavy weights', 'Warm up thoroughly before lifting']
                },
                contraindications: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['shoulder_injury', 'recent_chest_surgery']
                },
                isApproved: { type: 'boolean', example: true },
                createdBy: { type: 'string', example: '507f1f77bcf86cd799439012' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
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
        },            // ================================
        // ⭐ Review Schemas
        // ================================
        Review: {
            type: 'object',
            properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439017' },
                userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
                targetType: { type: 'string', enum: ['workout', 'exercise', 'gym', 'trainer', 'product'], example: 'gym' },
                targetId: { type: 'string', example: '507f1f77bcf86cd799439018' },
                rating: {
                    type: 'object',
                    properties: {
                        overall: { type: 'number', minimum: 1, maximum: 5, example: 4 },
                        quality: { type: 'number', minimum: 1, maximum: 5, example: 5 },
                        value: { type: 'number', minimum: 1, maximum: 5, example: 4 },
                        difficulty: { type: 'number', minimum: 1, maximum: 5, example: 3 },
                        instructions: { type: 'number', minimum: 1, maximum: 5, example: 4 }
                    }
                },
                title: { type: 'string', example: 'Excellent gym with great equipment' },
                content: { type: 'string', example: 'I\'ve been training here for 6 months and the experience has been fantastic...' },
                pros: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Great equipment', 'Clean facilities', 'Helpful staff']
                },
                cons: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Can get crowded during peak hours']
                },
                images: {
                    type: 'array',
                    items: { type: 'string', format: 'url' },
                    example: ['https://res.cloudinary.com/fitness-app/image/upload/v1234567890/gym-review-1.jpg']
                },
                videoUrl: { type: 'string', format: 'url', example: 'https://res.cloudinary.com/fitness-app/video/upload/v1234567890/gym-tour.mp4' },
                verified: { type: 'boolean', example: true },
                verificationData: {
                    type: 'object',
                    properties: {
                        type: { type: 'string', enum: ['purchase', 'completion', 'attendance'], example: 'purchase' },
                        date: { type: 'string', format: 'date-time' },
                        proof: { type: 'string', format: 'url', example: 'https://res.cloudinary.com/fitness-app/image/upload/receipt.jpg' }
                    }
                },
                helpful: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['507f1f77bcf86cd799439019', '507f1f77bcf86cd799439020']
                },
                helpfulCount: { type: 'number', example: 15 },
                reported: {
                    type: 'array',
                    items: { type: 'string' },
                    example: []
                },
                reportCount: { type: 'number', example: 0 },
                isSponsored: { type: 'boolean', example: false },
                sponsorDisclosure: { type: 'string', example: 'I received a free trial membership in exchange for this review' },
                compensation: {
                    type: 'object',
                    properties: {
                        type: { type: 'string', enum: ['paid', 'free_product', 'discount'], example: 'free_product' },
                        amount: { type: 'number', example: 50 },
                        description: { type: 'string', example: 'Free 1-month membership' }
                    }
                }, isApproved: { type: 'boolean', example: true },
                moderatedBy: { type: 'string', example: '507f1f77bcf86cd799439021' },
                moderationNotes: { type: 'string', example: 'Review approved after verification check' },
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
