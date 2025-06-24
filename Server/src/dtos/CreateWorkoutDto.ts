/**
 * 🏋️ CreateWorkoutDto - Robust server-side validation for workout creation
 * Validates incoming request body for creating new workouts
 */

import { ObjectId } from 'mongoose';

export interface CreateWorkoutDtoInput {
    name: string;
    description?: string | undefined;
    category?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedDuration?: number;
    tags?: string[];
    isPublic?: boolean;
    exercises: Array<{
        exerciseId: string;
        order: number;
        sets: number;
        reps?: number;
        duration?: number;
        weight?: number;
        restTime?: number;
        notes?: string;
    }>;

    // Auto-calculated fields (client might send, but we validate/recalculate)
    muscleGroups?: string[];
    equipment?: string[];
    caloriesBurned?: number;

    // Status field (client sends for draft/published state)
    status?: 'draft' | 'published';
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    data?: CreateWorkoutDtoInput | undefined;
}

export class CreateWorkoutDto {
    private data: CreateWorkoutDtoInput;
    private errors: string[] = [];

    constructor(input: any) {
        this.data = input;
        this.validate();
    }

    /**
     * Main validation method
     */
    private validate(): void {
        this.validateRequired();
        this.validateName();
        this.validateDescription();
        this.validateCategory();
        this.validateDifficulty();
        this.validateDuration();
        this.validateTags();
        this.validateExercises();
        this.validateBooleanFields();
        this.validateOptionalFields();
    }

    /**
     * Validate required fields
     */
    private validateRequired(): void {
        const required = ['name', 'difficulty', 'exercises'];

        for (const field of required) {
            if (!this.data[field as keyof CreateWorkoutDtoInput]) {
                this.errors.push(`${field} is required`);
            }
        }
    }

    /**
     * Validate workout name
     */
    private validateName(): void {
        if (!this.data.name) return;

        if (typeof this.data.name !== 'string') {
            this.errors.push('name must be a string');
            return;
        }

        const trimmedName = this.data.name.trim();
        if (trimmedName.length < 3) {
            this.errors.push('name must be at least 3 characters long');
        }

        if (trimmedName.length > 100) {
            this.errors.push('name cannot exceed 100 characters');
        }

        // Update with trimmed value
        this.data.name = trimmedName;
    }

    /**
     * Validate description
     */
    private validateDescription(): void {
        if (!this.data.description) return;

        if (typeof this.data.description !== 'string') {
            this.errors.push('description must be a string');
            return;
        }

        const trimmedDescription = this.data.description.trim();
        if (trimmedDescription.length > 500) {
            this.errors.push('description cannot exceed 500 characters');
        }
        // Update with trimmed value - handle empty string case
        if (trimmedDescription.length === 0) {
            this.data.description = undefined;
        } else {
            this.data.description = trimmedDescription;
        }
    }

    /**
     * Validate category
     */
    private validateCategory(): void {
        if (!this.data.category) return;

        const validCategories = [
            'strength', 'cardio', 'flexibility', 'yoga', 'pilates',
            'crossfit', 'bodyweight', 'weightlifting', 'running',
            'cycling', 'swimming', 'martial-arts', 'sports', 'other'
        ];

        if (typeof this.data.category !== 'string') {
            this.errors.push('category must be a string');
            return;
        }

        if (!validCategories.includes(this.data.category.toLowerCase())) {
            this.errors.push(`category must be one of: ${validCategories.join(', ')}`);
        } else {
            this.data.category = this.data.category.toLowerCase();
        }
    }

    /**
     * Validate difficulty
     */
    private validateDifficulty(): void {
        if (!this.data.difficulty) return;

        const validDifficulties = ['beginner', 'intermediate', 'advanced'];

        if (typeof this.data.difficulty !== 'string') {
            this.errors.push('difficulty must be a string');
            return;
        }

        if (!validDifficulties.includes(this.data.difficulty.toLowerCase())) {
            this.errors.push(`difficulty must be one of: ${validDifficulties.join(', ')}`);
        } else {
            this.data.difficulty = this.data.difficulty.toLowerCase() as 'beginner' | 'intermediate' | 'advanced';
        }
    }

    /**
     * Validate estimated duration
     */
    private validateDuration(): void {
        if (this.data.estimatedDuration === undefined) return;

        const duration = Number(this.data.estimatedDuration);

        if (isNaN(duration)) {
            this.errors.push('estimatedDuration must be a number');
            return;
        }

        if (duration < 5) {
            this.errors.push('estimatedDuration must be at least 5 minutes');
        }

        if (duration > 480) { // 8 hours max
            this.errors.push('estimatedDuration cannot exceed 480 minutes (8 hours)');
        }

        this.data.estimatedDuration = duration;
    }

    /**
     * Validate tags
     */
    private validateTags(): void {
        if (!this.data.tags) {
            this.data.tags = [];
            return;
        }

        if (!Array.isArray(this.data.tags)) {
            this.errors.push('tags must be an array');
            return;
        }

        if (this.data.tags.length > 10) {
            this.errors.push('cannot have more than 10 tags');
        }

        // Validate and clean each tag
        const validTags: string[] = [];
        for (const tag of this.data.tags) {
            if (typeof tag !== 'string') {
                this.errors.push('each tag must be a string');
                continue;
            }

            const cleanTag = tag.trim().toLowerCase();
            if (cleanTag.length > 20) {
                this.errors.push('each tag cannot exceed 20 characters');
                continue;
            }

            if (cleanTag.length > 0 && !validTags.includes(cleanTag)) {
                validTags.push(cleanTag);
            }
        }

        this.data.tags = validTags;
    }

    /**
     * Validate exercises array
     */
    private validateExercises(): void {
        if (!this.data.exercises) return;

        if (!Array.isArray(this.data.exercises)) {
            this.errors.push('exercises must be an array');
            return;
        }

        if (this.data.exercises.length === 0) {
            this.errors.push('workout must have at least 1 exercise');
            return;
        }

        if (this.data.exercises.length > 50) {
            this.errors.push('workout cannot have more than 50 exercises');
            return;
        }
        // Validate each exercise
        const validExercises: any[] = [];
        const usedOrders = new Set<number>();

        for (let i = 0; i < this.data.exercises.length; i++) {
            const exercise = this.data.exercises[i];
            if (!exercise) continue; // Skip null/undefined exercises

            const exerciseErrors = this.validateSingleExercise(exercise, i);

            if (exerciseErrors.length === 0 && exercise.order !== undefined) {
                // Check for duplicate orders
                if (usedOrders.has(exercise.order)) {
                    this.errors.push(`exercise ${i + 1}: order ${exercise.order} is already used`);
                } else {
                    usedOrders.add(exercise.order);
                    validExercises.push(exercise);
                }
            }
        }

        this.data.exercises = validExercises;
    }

    /**
     * Validate a single exercise
     */
    private validateSingleExercise(exercise: any, index: number): string[] {
        const errors: string[] = [];
        const prefix = `exercise ${index + 1}`;

        // Required fields
        if (!exercise.exerciseId) {
            errors.push(`${prefix}: exerciseId is required`);
        } else if (typeof exercise.exerciseId !== 'string') {
            errors.push(`${prefix}: exerciseId must be a string`);
        }

        if (exercise.order === undefined || exercise.order === null) {
            errors.push(`${prefix}: order is required`);
        } else {
            const order = Number(exercise.order);
            if (isNaN(order) || order < 1) {
                errors.push(`${prefix}: order must be a positive number`);
            } else {
                exercise.order = order;
            }
        }

        if (exercise.sets === undefined || exercise.sets === null) {
            errors.push(`${prefix}: sets is required`);
        } else {
            const sets = Number(exercise.sets);
            if (isNaN(sets) || sets < 1 || sets > 20) {
                errors.push(`${prefix}: sets must be between 1 and 20`);
            } else {
                exercise.sets = sets;
            }
        }

        // Optional numeric fields
        if (exercise.reps !== undefined) {
            const reps = Number(exercise.reps);
            if (isNaN(reps) || reps < 1 || reps > 100) {
                errors.push(`${prefix}: reps must be between 1 and 100`);
            } else {
                exercise.reps = reps;
            }
        }

        if (exercise.duration !== undefined) {
            const duration = Number(exercise.duration);
            if (isNaN(duration) || duration < 1 || duration > 3600) { // max 1 hour per exercise
                errors.push(`${prefix}: duration must be between 1 and 3600 seconds`);
            } else {
                exercise.duration = duration;
            }
        }

        if (exercise.weight !== undefined) {
            const weight = Number(exercise.weight);
            if (isNaN(weight) || weight < 0 || weight > 1000) {
                errors.push(`${prefix}: weight must be between 0 and 1000 kg`);
            } else {
                exercise.weight = weight;
            }
        }

        if (exercise.restTime !== undefined) {
            const restTime = Number(exercise.restTime);
            if (isNaN(restTime) || restTime < 0 || restTime > 600) { // max 10 minutes rest
                errors.push(`${prefix}: restTime must be between 0 and 600 seconds`);
            } else {
                exercise.restTime = restTime;
            }
        }

        // Notes validation
        if (exercise.notes && typeof exercise.notes !== 'string') {
            errors.push(`${prefix}: notes must be a string`);
        } else if (exercise.notes && exercise.notes.trim().length > 200) {
            errors.push(`${prefix}: notes cannot exceed 200 characters`);
        } else if (exercise.notes) {
            exercise.notes = exercise.notes.trim();
        }

        // Add errors to main errors array
        this.errors.push(...errors);

        return errors;
    }

    /**
     * Validate boolean fields
     */
    private validateBooleanFields(): void {
        if (this.data.isPublic !== undefined) {
            if (typeof this.data.isPublic !== 'boolean') {
                this.errors.push('isPublic must be a boolean');
            }
        } else {
            this.data.isPublic = false; // default value
        }
    }

    /**
     * Validate optional fields
     */
    private validateOptionalFields(): void {
        // Validate muscle groups if provided
        if (this.data.muscleGroups !== undefined) {
            if (!Array.isArray(this.data.muscleGroups)) {
                this.errors.push('muscleGroups must be an array');
            } else {
                this.data.muscleGroups = this.data.muscleGroups.filter(
                    (group: any) => typeof group === 'string' && group.trim().length > 0
                ).map((group: string) => group.trim().toLowerCase());
            }
        }

        // Validate equipment if provided
        if (this.data.equipment !== undefined) {
            if (!Array.isArray(this.data.equipment)) {
                this.errors.push('equipment must be an array');
            } else {
                this.data.equipment = this.data.equipment.filter(
                    (item: any) => typeof item === 'string' && item.trim().length > 0
                ).map((item: string) => item.trim().toLowerCase());
            }
        }

        // Validate calories if provided
        if (this.data.caloriesBurned !== undefined) {
            const calories = Number(this.data.caloriesBurned);
            if (isNaN(calories) || calories < 0 || calories > 5000) {
                this.errors.push('caloriesBurned must be between 0 and 5000');
            } else {
                this.data.caloriesBurned = calories;
            }
        }

        // Validate status if provided
        if (this.data.status !== undefined) {
            const validStatuses = ['draft', 'published'];
            if (!validStatuses.includes(this.data.status)) {
                this.errors.push(`status must be one of: ${validStatuses.join(', ')}`);
            }
        }
    }

    /**
     * Get validation result
     */
    public getValidationResult(): ValidationResult {
        return {
            isValid: this.errors.length === 0,
            errors: this.errors,
            data: this.errors.length === 0 ? this.data : undefined
        };
    }

    /**
     * Get cleaned and validated data
     */
    public getValidatedData(): CreateWorkoutDtoInput | null {
        return this.errors.length === 0 ? this.data : null;
    }

    /**
     * Get errors
     */
    public getErrors(): string[] {
        return this.errors;
    }

    /**
     * Check if validation passed
     */
    public isValid(): boolean {
        return this.errors.length === 0;
    }

    /**
     * Static method to validate data quickly
     */
    public static validate(input: any): ValidationResult {
        const dto = new CreateWorkoutDto(input);
        return dto.getValidationResult();
    }
}