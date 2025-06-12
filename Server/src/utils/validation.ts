/**
 * 🔍 Validation Utilities
 * Input validation with Joi for authentication and user data
 */

import joi from 'joi';
import { FitnessGoal, ExperienceLevel } from '../types';

/**
 * Validation result interface
 */
export interface ValidationResult {
    isValid: boolean;
    message?: string;
    errors?: Record<string, string>;
    data?: any;
}

// ================================
// 🔐 Auth Validation Schemas
// ================================

/**
 * Login validation schema
 */
const loginSchema = joi.object({
    email: joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),
    password: joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        })
});

/**
 * User profile validation schema
 */
const userProfileSchema = joi.object({
    firstName: joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'First name must be at least 2 characters',
            'string.max': 'First name cannot exceed 50 characters',
            'any.required': 'First name is required'
        }),
    lastName: joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Last name must be at least 2 characters',
            'string.max': 'Last name cannot exceed 50 characters',
            'any.required': 'Last name is required'
        }),
    age: joi.number()
        .integer()
        .min(13)
        .max(120)
        .required()
        .messages({
            'number.min': 'Must be at least 13 years old',
            'number.max': 'Age cannot exceed 120',
            'any.required': 'Age is required'
        }),
    weight: joi.number()
        .min(20)
        .max(500)
        .required()
        .messages({
            'number.min': 'Weight must be at least 20kg',
            'number.max': 'Weight cannot exceed 500kg',
            'any.required': 'Weight is required'
        }),
    height: joi.number()
        .min(100)
        .max(250)
        .required()
        .messages({
            'number.min': 'Height must be at least 100cm',
            'number.max': 'Height cannot exceed 250cm',
            'any.required': 'Height is required'
        }),
    fitnessGoals: joi.array()
        .items(joi.string().valid(...Object.values(FitnessGoal)))
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one fitness goal is required',
            'any.required': 'Fitness goals are required'
        }),
    experienceLevel: joi.string()
        .valid(...Object.values(ExperienceLevel))
        .required()
        .messages({
            'any.only': 'Experience level must be beginner, intermediate, advanced, or expert',
            'any.required': 'Experience level is required'
        }),
    bio: joi.string()
        .max(500)
        .allow('')
        .optional()
        .messages({
            'string.max': 'Bio cannot exceed 500 characters'
        })
});

/**
 * Registration validation schema
 */
const registerSchema = joi.object({
    email: joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),
    username: joi.string()
        .trim()
        .min(3)
        .max(30)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .required()
        .messages({
            'string.min': 'Username must be at least 3 characters',
            'string.max': 'Username cannot exceed 30 characters',
            'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
            'any.required': 'Username is required'
        }),
    password: joi.string()
        .min(6)
        .max(128)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'string.max': 'Password cannot exceed 128 characters',
            'any.required': 'Password is required'
        }),
    confirmPassword: joi.string()
        .valid(joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Password confirmation is required'
        }),
    profile: userProfileSchema.required()
});

/**
 * Change password validation schema
 */
const changePasswordSchema = joi.object({
    currentPassword: joi.string()
        .required()
        .messages({
            'any.required': 'Current password is required'
        }),
    newPassword: joi.string()
        .min(6)
        .max(128)
        .required()
        .messages({
            'string.min': 'New password must be at least 6 characters',
            'string.max': 'New password cannot exceed 128 characters',
            'any.required': 'New password is required'
        }),
    confirmNewPassword: joi.string()
        .valid(joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'New passwords do not match',
            'any.required': 'New password confirmation is required'
        })
});

/**
 * Email validation schema
 */
const emailSchema = joi.object({
    email: joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        })
});

// ================================
// 🔧 Validation Functions
// ================================

/**
 * Validate login credentials
 */
export const validateLogin = (data: unknown): ValidationResult => {
    const { error, value } = loginSchema.validate(data, { abortEarly: false });

    if (error) {
        return {
            isValid: false,
            message: error.details?.[0]?.message || 'Validation failed',
            errors: error.details.reduce((acc, detail) => {
                const key = detail.path.join('.');
                acc[key] = detail.message;
                return acc;
            }, {} as Record<string, string>)
        };
    }

    return { isValid: true, data: value };
};

/**
 * Validate user registration
 */
export const validateRegister = (data: unknown): ValidationResult => {
    const { error, value } = registerSchema.validate(data, { abortEarly: false });

    if (error) {
        return {
            isValid: false,
            message: error.details?.[0]?.message || 'Validation failed',
            errors: error.details.reduce((acc, detail) => {
                const key = detail.path.join('.');
                acc[key] = detail.message;
                return acc;
            }, {} as Record<string, string>)
        };
    }

    return { isValid: true, data: value };
};

/**
 * Validate user profile update
 */
export const validateUserProfile = (data: unknown): ValidationResult => {
    const { error, value } = userProfileSchema.validate(data, { abortEarly: false });

    if (error) {
        return {
            isValid: false,
            message: error.details?.[0]?.message || 'Validation failed',
            errors: error.details.reduce((acc, detail) => {
                const key = detail.path.join('.');
                acc[key] = detail.message;
                return acc;
            }, {} as Record<string, string>)
        };
    }

    return { isValid: true, data: value };
};

/**
 * Validate change password
 */
export const validateChangePassword = (data: unknown): ValidationResult => {
    const { error, value } = changePasswordSchema.validate(data, { abortEarly: false });

    if (error) {
        return {
            isValid: false,
            message: error.details?.[0]?.message || 'Validation failed',
            errors: error.details.reduce((acc, detail) => {
                const key = detail.path.join('.');
                acc[key] = detail.message;
                return acc;
            }, {} as Record<string, string>)
        };
    }

    return { isValid: true, data: value };
};

/**
 * Validate email format
 */
export const validateEmail = (data: unknown): ValidationResult => {
    const { error, value } = emailSchema.validate(data);

    if (error) {
        return {
            isValid: false,
            message: error.details?.[0]?.message || 'Invalid email'
        };
    }

    return { isValid: true, data: value };
};

/**
 * Validate MongoDB ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};
