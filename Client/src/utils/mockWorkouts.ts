/**
 * 🏋️ Mock Workout Data - cho trang Khám phá Workouts
 * Dựa trên DATABASE_SCHEMA_COMPLETE.md và sampleExercises
 */

import { Workout, WorkoutExercise } from '../types/workout.interface';

// Sample workout exercises - mapping to existing exercise data
const createWorkoutExercise = (
    exerciseId: string,
    order: number,
    sets: number,
    reps?: number,
    duration?: number,
    weight?: number,
    restTime: number = 60
): WorkoutExercise => ({
    exerciseId,
    order,
    sets,
    reps,
    duration,
    weight,
    restTime,
    notes: '',
    completed: false
});

export const mockWorkouts: Workout[] = [
    // ========================================
    // 💪 STRENGTH TRAINING WORKOUTS
    // ========================================
    {
        _id: '6750a1b2c3d4e5f6789012345a',
        userId: '6750a1b2c3d4e5f6789012340a',
        name: 'Upper Body Power',
        description: 'Comprehensive upper body strength workout focusing on chest, shoulders, and arms. Perfect for building muscle mass and strength.',
        category: 'strength',
        difficulty: 'intermediate',
        estimatedDuration: 75,
        tags: ['strength', 'upper-body', 'muscle-building', 'gym'],
        isPublic: true,

        exercises: [
            createWorkoutExercise('bench-press', 1, 4, 8, undefined, 80, 90),
            createWorkoutExercise('deadlift', 2, 3, 6, undefined, 120, 120),
            createWorkoutExercise('back-squat', 3, 3, 10, undefined, 100, 90),
            createWorkoutExercise('plank', 4, 3, undefined, 60, undefined, 60),
        ],

        // Social Features
        likes: ['user1', 'user2', 'user3'],
        likeCount: 127,
        saves: ['user1', 'user4'],
        saveCount: 43,
        shares: 18,

        // Analytics
        views: 1250,
        completions: 89,
        averageRating: 4.7,
        totalRatings: 34,

        // Metadata
        muscleGroups: ['chest', 'shoulders', 'triceps', 'back', 'core'],
        equipment: ['barbell', 'bench', 'squat-rack'],
        caloriesBurned: 320,

        // Monetization (không sponsored)
        isSponsored: false,

        createdAt: new Date('2024-12-01T08:00:00Z'),
        updatedAt: new Date('2024-12-01T08:00:00Z')
    },

    {
        _id: '6750a1b2c3d4e5f6789012345b',
        userId: '6750a1b2c3d4e5f6789012340b',
        name: 'HIIT Cardio Blast',
        description: 'High-intensity interval training workout designed to torch calories and improve cardiovascular fitness. No equipment needed!',
        category: 'cardio',
        difficulty: 'advanced',
        estimatedDuration: 30,
        tags: ['hiit', 'cardio', 'fat-burning', 'bodyweight', 'home-workout'],
        isPublic: true,

        exercises: [
            createWorkoutExercise('burpees', 1, 4, 12, undefined, undefined, 45),
            createWorkoutExercise('mountain-climbers', 2, 4, undefined, 45, undefined, 30),
            createWorkoutExercise('russian-twists', 3, 3, 20, undefined, undefined, 30),
            createWorkoutExercise('plank', 4, 3, undefined, 45, undefined, 45),
        ],

        likes: ['user2', 'user3', 'user5'],
        likeCount: 89,
        saves: ['user1', 'user3', 'user6'],
        saveCount: 67,
        shares: 23,

        views: 890,
        completions: 145,
        averageRating: 4.5,
        totalRatings: 28,

        muscleGroups: ['full-body', 'core', 'shoulders', 'legs'],
        equipment: ['bodyweight'],
        caloriesBurned: 280,

        // Sponsored Content Example
        isSponsored: true,
        sponsorData: {
            sponsorId: 'sponsor-nike-123',
            campaignId: 'nike-hiit-campaign-2024',
            rate: 250,
            type: 'promotion',
            disclosure: 'Workout được tài trợ bởi Nike - Thương hiệu thể thao hàng đầu thế giới'
        },

        createdAt: new Date('2024-12-02T10:30:00Z'),
        updatedAt: new Date('2024-12-02T10:30:00Z')
    },

    {
        _id: '6750a1b2c3d4e5f6789012345c',
        userId: '6750a1b2c3d4e5f6789012340c',
        name: 'Beginner Yoga Flow',
        description: 'Gentle yoga sequence perfect for beginners. Focus on flexibility, balance, and mindfulness. Great for morning or evening routine.',
        category: 'flexibility',
        difficulty: 'beginner',
        estimatedDuration: 45,
        tags: ['yoga', 'flexibility', 'beginner-friendly', 'stress-relief', 'mindfulness'],
        isPublic: true,

        exercises: [
            createWorkoutExercise('downward-facing-dog', 1, 3, undefined, 60, undefined, 30),
            createWorkoutExercise('plank', 2, 2, undefined, 30, undefined, 45),
            createWorkoutExercise('mountain-climbers', 3, 2, undefined, 20, undefined, 60),
        ],

        likes: ['user4', 'user5'],
        likeCount: 234,
        saves: ['user2', 'user4', 'user7', 'user8'],
        saveCount: 156,
        shares: 45,

        views: 2100,
        completions: 298,
        averageRating: 4.8,
        totalRatings: 67,

        muscleGroups: ['hamstrings', 'calves', 'shoulders', 'back', 'core'],
        equipment: ['yoga-mat'],
        caloriesBurned: 150,

        isSponsored: false,

        createdAt: new Date('2024-11-28T07:15:00Z'),
        updatedAt: new Date('2024-11-28T07:15:00Z')
    },

    {
        _id: '6750a1b2c3d4e5f6789012345d',
        userId: '6750a1b2c3d4e5f6789012340d',
        name: 'Lower Body Strength',
        description: 'Intense lower body workout targeting glutes, quads, and hamstrings. Build powerful legs and improve athletic performance.',
        category: 'strength',
        difficulty: 'intermediate',
        estimatedDuration: 60,
        tags: ['legs', 'glutes', 'strength', 'squats', 'deadlifts'],
        isPublic: true,

        exercises: [
            createWorkoutExercise('back-squat', 1, 4, 10, undefined, 100, 90),
            createWorkoutExercise('deadlift', 2, 4, 8, undefined, 120, 120),
            createWorkoutExercise('russian-twists', 3, 3, 15, undefined, undefined, 45),
        ],

        likes: ['user1', 'user6', 'user7'],
        likeCount: 76,
        saves: ['user3', 'user5'],
        saveCount: 32,
        shares: 12,

        views: 654,
        completions: 78,
        averageRating: 4.6,
        totalRatings: 19,

        muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'calves', 'core'],
        equipment: ['barbell', 'squat-rack', 'weight-plates'],
        caloriesBurned: 380,

        isSponsored: false,

        createdAt: new Date('2024-12-03T14:45:00Z'),
        updatedAt: new Date('2024-12-03T14:45:00Z')
    },

    {
        _id: '6750a1b2c3d4e5f6789012345e',
        userId: '6750a1b2c3d4e5f6789012340e',
        name: 'Core Crusher',
        description: 'Comprehensive core workout targeting all abdominal muscles. Build a strong, stable core for better performance in all activities.',
        category: 'strength',
        difficulty: 'intermediate',
        estimatedDuration: 25,
        tags: ['core', 'abs', 'obliques', 'bodyweight', 'quick-workout'],
        isPublic: true,

        exercises: [
            createWorkoutExercise('plank', 1, 3, undefined, 60, undefined, 45),
            createWorkoutExercise('russian-twists', 2, 4, 20, undefined, undefined, 30),
            createWorkoutExercise('mountain-climbers', 3, 3, undefined, 30, undefined, 45),
        ],

        likes: ['user2', 'user8'],
        likeCount: 145,
        saves: ['user1', 'user4', 'user6'],
        saveCount: 89,
        shares: 31,

        views: 1100,
        completions: 203,
        averageRating: 4.4,
        totalRatings: 41,

        muscleGroups: ['core', 'abs', 'obliques', 'shoulders'],
        equipment: ['bodyweight'],
        caloriesBurned: 180,

        isSponsored: true,
        sponsorData: {
            sponsorId: 'sponsor-myprotein-456',
            campaignId: 'myprotein-core-2024',
            rate: 180,
            type: 'review',
            disclosure: 'Workout được hỗ trợ bởi MyProtein - Thực phẩm bổ sung chất lượng cao'
        },

        createdAt: new Date('2024-12-04T09:20:00Z'),
        updatedAt: new Date('2024-12-04T09:20:00Z')
    },

    {
        _id: '6750a1b2c3d4e5f6789012345f',
        userId: '6750a1b2c3d4e5f6789012340f',
        name: 'Full Body Functional',
        description: 'Complete functional training workout using compound movements. Perfect for building real-world strength and coordination.',
        category: 'strength',
        difficulty: 'advanced',
        estimatedDuration: 90,
        tags: ['functional', 'compound', 'full-body', 'advanced', 'kettlebell'],
        isPublic: true,

        exercises: [
            createWorkoutExercise('turkish-getup', 1, 3, 5, undefined, 16, 90),
            createWorkoutExercise('deadlift', 2, 4, 6, undefined, 140, 120),
            createWorkoutExercise('burpees', 3, 3, 10, undefined, undefined, 60),
            createWorkoutExercise('plank', 4, 3, undefined, 90, undefined, 60),
        ],

        likes: ['user3', 'user7', 'user9'],
        likeCount: 58,
        saves: ['user2', 'user8'],
        saveCount: 24,
        shares: 8,

        views: 432,
        completions: 31,
        averageRating: 4.9,
        totalRatings: 12,

        muscleGroups: ['full-body', 'shoulders', 'core', 'back', 'legs'],
        equipment: ['kettlebell', 'barbell'],
        caloriesBurned: 450,

        isSponsored: false,

        createdAt: new Date('2024-12-05T16:00:00Z'),
        updatedAt: new Date('2024-12-05T16:00:00Z')
    },

    // ========================================
    // 🏃 QUICK WORKOUTS (15-30 mins)
    // ========================================
    {
        _id: '6750a1b2c3d4e5f6789012346a',
        userId: '6750a1b2c3d4e5f6789012340a',
        name: 'Morning Energy Boost',
        description: 'Quick 15-minute energizing workout to start your day right. Perfect combination of movement and mindfulness.',
        category: 'cardio',
        difficulty: 'beginner',
        estimatedDuration: 15,
        tags: ['morning', 'energy', 'quick', 'beginner', 'wake-up'],
        isPublic: true,

        exercises: [
            createWorkoutExercise('mountain-climbers', 1, 2, undefined, 30, undefined, 30),
            createWorkoutExercise('plank', 2, 2, undefined, 30, undefined, 30),
            createWorkoutExercise('downward-facing-dog', 3, 2, undefined, 45, undefined, 30),
        ],

        likes: ['user5', 'user9', 'user10'],
        likeCount: 312,
        saves: ['user1', 'user3', 'user7', 'user11'],
        saveCount: 198,
        shares: 67,

        views: 2890,
        completions: 456,
        averageRating: 4.6,
        totalRatings: 89,

        muscleGroups: ['core', 'shoulders', 'legs', 'back'],
        equipment: ['bodyweight'],
        caloriesBurned: 120,

        isSponsored: false,

        createdAt: new Date('2024-11-25T06:30:00Z'),
        updatedAt: new Date('2024-11-25T06:30:00Z')
    },

    {
        _id: '6750a1b2c3d4e5f6789012346b',
        userId: '6750a1b2c3d4e5f6789012340b',
        name: 'Lunch Break Express',
        description: 'Efficient 20-minute workout perfect for your lunch break. Boost energy and productivity for the afternoon.',
        category: 'cardio',
        difficulty: 'intermediate',
        estimatedDuration: 20,
        tags: ['lunch-break', 'office', 'quick', 'energy', 'productive'],
        isPublic: true,

        exercises: [
            createWorkoutExercise('burpees', 1, 3, 8, undefined, undefined, 45),
            createWorkoutExercise('russian-twists', 2, 3, 15, undefined, undefined, 30),
            createWorkoutExercise('plank', 3, 2, undefined, 45, undefined, 60),
        ],

        likes: ['user4', 'user6', 'user12'],
        likeCount: 167,
        saves: ['user2', 'user5', 'user9'],
        saveCount: 89,
        shares: 34,

        views: 1567,
        completions: 234,
        averageRating: 4.3,
        totalRatings: 52,

        muscleGroups: ['full-body', 'core', 'shoulders'],
        equipment: ['bodyweight'],
        caloriesBurned: 160,

        isSponsored: true,
        sponsorData: {
            sponsorId: 'sponsor-fitbit-789',
            campaignId: 'fitbit-workplace-wellness-2024',
            rate: 200,
            type: 'guide',
            disclosure: 'Workout được đồng hành cùng Fitbit - Theo dõi sức khỏe thông minh'
        },

        createdAt: new Date('2024-12-01T12:15:00Z'),
        updatedAt: new Date('2024-12-01T12:15:00Z')
    }
];

// Helper functions để filter workouts
export const getWorkoutsByCategory = (category: string) =>
    mockWorkouts.filter(workout => workout.category === category);

export const getWorkoutsByDifficulty = (difficulty: string) =>
    mockWorkouts.filter(workout => workout.difficulty === difficulty);

export const getWorkoutsByDuration = (maxDuration: number) =>
    mockWorkouts.filter(workout => (workout.estimatedDuration || 0) <= maxDuration);

export const getPopularWorkouts = () =>
    mockWorkouts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));

export const getSponsoredWorkouts = () =>
    mockWorkouts.filter(workout => workout.isSponsored);

export const searchWorkouts = (query: string) =>
    mockWorkouts.filter(workout =>
        workout.name.toLowerCase().includes(query.toLowerCase()) ||
        workout.description?.toLowerCase().includes(query.toLowerCase()) ||
        workout.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
