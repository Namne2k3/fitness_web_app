import { ExperienceLevel, FitnessGoal, Gender } from "./user.interface";

export interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterFormData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    age: number;
    weight: number;
    height: number;
    gender: Gender;
    fitnessGoals: FitnessGoal[];
    experienceLevel: ExperienceLevel;
    agreeToTerms: boolean;
}