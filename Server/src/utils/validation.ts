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
            'string.email': 'Vui lòng nhập địa chỉ email hợp lệ',
            'any.required': 'Email là bắt buộc'
        }),
    password: joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
            'any.required': 'Mật khẩu là bắt buộc'
        }),
    rememberMe: joi.boolean()
        .optional()
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
            'string.min': 'Họ phải có ít nhất 2 ký tự',
            'string.max': 'Họ không được vượt quá 50 ký tự',
            'any.required': 'Họ là bắt buộc'
        }), lastName: joi.string()
            .trim()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.min': 'Tên phải có ít nhất 2 ký tự',
                'string.max': 'Tên không được vượt quá 50 ký tự',
                'any.required': 'Tên là bắt buộc'
            }), age: joi.number()
                .integer()
                .min(13)
                .max(120)
                .required()
                .messages({
                    'number.min': 'Phải ít nhất 13 tuổi',
                    'number.max': 'Tuổi không được vượt quá 120',
                    'any.required': 'Tuổi là bắt buộc'
                }), weight: joi.number()
                    .min(20)
                    .max(500)
                    .required()
                    .messages({
                        'number.min': 'Cân nặng phải ít nhất 20kg',
                        'number.max': 'Cân nặng không được vượt quá 500kg',
                        'any.required': 'Cân nặng là bắt buộc'
                    }), height: joi.number()
                        .min(100)
                        .max(250)
                        .required()
                        .messages({
                            'number.min': 'Chiều cao phải ít nhất 100cm',
                            'number.max': 'Chiều cao không được vượt quá 250cm',
                            'any.required': 'Chiều cao là bắt buộc'
                        }), fitnessGoals: joi.array()
                            .items(joi.string().valid(...Object.values(FitnessGoal)))
                            .min(1)
                            .required()
                            .messages({
                                'array.min': 'Cần chọn ít nhất một mục tiêu tập luyện',
                                'any.required': 'Mục tiêu tập luyện là bắt buộc'
                            }), experienceLevel: joi.string()
                                .valid(...Object.values(ExperienceLevel))
                                .required()
                                .messages({
                                    'any.only': 'Cấp độ kinh nghiệm phải là người mới, trung cấp, cao cấp hoặc chuyên gia',
                                    'any.required': 'Cấp độ kinh nghiệm là bắt buộc'
                                }), bio: joi.string()
                                    .max(500)
                                    .allow('')
                                    .optional()
                                    .messages({
                                        'string.max': 'Tiểu sử không được vượt quá 500 ký tự'
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
            'string.email': 'Vui lòng nhập địa chỉ email hợp lệ',
            'any.required': 'Email là bắt buộc'
        }), username: joi.string()
            .trim()
            .min(3)
            .max(30)
            .pattern(/^[a-zA-Z0-9_]+$/)
            .required()
            .messages({
                'string.min': 'Tên người dùng phải có ít nhất 3 ký tự',
                'string.max': 'Tên người dùng không được vượt quá 30 ký tự',
                'string.pattern.base': 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới',
                'any.required': 'Tên người dùng là bắt buộc'
            }), password: joi.string()
                .min(6)
                .max(128)
                .required()
                .messages({
                    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
                    'string.max': 'Mật khẩu không được vượt quá 128 ký tự',
                    'any.required': 'Mật khẩu là bắt buộc'
                }), confirmPassword: joi.string()
                    .valid(joi.ref('password'))
                    .required()
                    .messages({
                        'any.only': 'Mật khẩu không khớp',
                        'any.required': 'Xác nhận mật khẩu là bắt buộc'
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
            'any.required': 'Mật khẩu hiện tại là bắt buộc'
        }), newPassword: joi.string()
            .min(6)
            .max(128)
            .required()
            .messages({
                'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
                'string.max': 'Mật khẩu mới không được vượt quá 128 ký tự',
                'any.required': 'Mật khẩu mới là bắt buộc'
            }), confirmNewPassword: joi.string()
                .valid(joi.ref('newPassword'))
                .required()
                .messages({
                    'any.only': 'Mật khẩu mới không khớp',
                    'any.required': 'Xác nhận mật khẩu mới là bắt buộc'
                })
});

/**
 * Reset password validation schema
 */
const resetPasswordSchema = joi.object({
    token: joi.string()
        .required()
        .messages({
            'any.required': 'Token là bắt buộc'
        }),
    newPassword: joi.string()
        .min(6)
        .max(50)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
        .required()
        .messages({
            'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
            'string.max': 'Mật khẩu mới không được vượt quá 50 ký tự',
            'string.pattern.base': 'Mật khẩu mới phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số',
            'any.required': 'Mật khẩu mới là bắt buộc'
        }),
    confirmNewPassword: joi.string()
        .valid(joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Xác nhận mật khẩu không khớp',
            'any.required': 'Xác nhận mật khẩu là bắt buộc'
        })
});

/**
 * Email validation schema for forgot password
 */
const emailSchema = joi.object({
    email: joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Vui lòng nhập địa chỉ email hợp lệ',
            'any.required': 'Email là bắt buộc'
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
            message: error.details?.[0]?.message || 'Xác thực đăng nhập thất bại',
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
            message: error.details?.[0]?.message || 'Xác thực đăng ký thất bại',
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
            message: error.details?.[0]?.message || 'Xác thực hồ sơ người dùng thất bại',
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
            message: error.details?.[0]?.message || 'Xác thực đổi mật khẩu thất bại',
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
 * Validate reset password
 */
export const validateResetPassword = (data: unknown): ValidationResult => {
    const { error, value } = resetPasswordSchema.validate(data, { abortEarly: false });

    if (error) {
        return {
            isValid: false,
            message: error.details?.[0]?.message || 'Xác thực reset mật khẩu thất bại',
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
 * Validate reset password token format
 */
export const validateToken = (token: string): ValidationResult => {
    if (!token) {
        return {
            isValid: false,
            message: 'Token là bắt buộc'
        };
    }

    if (typeof token !== 'string') {
        return {
            isValid: false,
            message: 'Token phải là chuỗi ký tự'
        };
    }

    // Token should be at least 32 characters (from generateSecureToken)
    if (token.length < 32) {
        return {
            isValid: false,
            message: 'Token không hợp lệ'
        };
    }

    // Token should only contain alphanumeric characters (from crypto.randomBytes)
    if (!/^[a-f0-9]+$/i.test(token)) {
        return {
            isValid: false,
            message: 'Token chứa ký tự không hợp lệ'
        };
    }

    return {
        isValid: true,
        data: token.toLowerCase()
    };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
    const { error, value } = emailSchema.validate({ email });

    if (error) {
        return {
            isValid: false,
            message: error.details?.[0]?.message || 'Email không hợp lệ'
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
