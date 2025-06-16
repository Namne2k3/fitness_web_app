/**
 * Mock data for testing profile page
 */
import { User, UserRole, Gender, FitnessGoal, ExperienceLevel } from '../types';

export const mockUser: User = {
    id: "6847da67350c8db575f8b682",
    email: "john.doe@example.com",
    username: "johndoe",
    avatar: "https://via.placeholder.com/150/007bff/ffffff?text=JD",
    profile: {
        firstName: "John",
        lastName: "Doe",
        age: 25,
        weight: 75,
        height: 180,
        gender: Gender.MALE,
        fitnessGoals: [FitnessGoal.MUSCLE_GAIN, FitnessGoal.STRENGTH],
        experienceLevel: ExperienceLevel.INTERMEDIATE,
        bio: "Fitness enthusiast passionate about strength training",
        medicalConditions: []
    },
    preferences: {
        notifications: {
            workoutReminders: true,
            newContent: true,
            sponsoredOffers: false,
            socialUpdates: true,
            email: true,
            push: true,
            sms: false,
            newFeatures: true,
            marketing: false
        },
        privacy: {
            profileVisibility: 'public',
            workoutVisibility: 'public',
            allowDataCollection: true,
            allowPersonalization: true
        },
        theme: 'auto',
        language: 'vi',
        units: 'metric'
    },
    isVerified: false,
    isEmailVerified: false, // Thêm field này
    role: UserRole.USER,
    createdAt: new Date("2025-06-10T07:10:31.682Z"),
    updatedAt: new Date("2025-06-14T02:35:03.323Z")
};
