import { User } from "./user.interface";

export interface Rating {
    userId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
}

export interface Review {
    readonly id: string;
    userId: string;
    user: User;
    targetId: string;
    targetType: ReviewTargetType;
    rating: DetailedRating;
    title: string;
    content: string;
    pros?: string[];
    cons?: string[];
    images?: string[];
    isVerified: boolean;
    isSponsored: boolean;
    helpfulCount: number;
    unhelpfulCount: number;
    replies: ReviewReply[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ReviewReply {
    id: string;
    userId: string;
    user: User;
    content: string;
    createdAt: Date;
}

export enum ReviewTargetType {
    GYM = 'gym',
    TRAINER = 'trainer',
    SUPPLEMENT = 'supplement',
    EQUIPMENT = 'equipment',
    WORKOUT = 'workout'
}

export interface DetailedRating {
    overall: number;
    quality?: number;
    value?: number;
    service?: number;
    cleanliness?: number;
    equipment?: number;
    staff?: number;
}

export interface ReviewFormData {
    targetId: string;
    targetType: ReviewTargetType;
    rating: DetailedRating;
    title: string;
    content: string;
    pros?: string[];
    cons?: string[];
    images?: File[];
}