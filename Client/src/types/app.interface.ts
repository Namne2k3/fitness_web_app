import { WorkoutFilters } from "./workout.interface";

export interface AppError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface SearchParams {
    query?: string;
    filters?: WorkoutFilters;
    sortBy?: 'name' | 'rating' | 'difficulty' | 'duration' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

// Utility types
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T | undefined | null;
    message?: string;
    error?: string;
    metadata?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

export interface PaginatedResult<T> {
    data: T[];
    pagination?: {
        currentPage?: number;
        hasNextPage?: boolean;
        hasPrevPage?: boolean;
        itemsPerPage?: number;
        totalItems?: number;
        totalPages?: number;
    };
    sort?: {
        field?: string;
        order?: 'asc' | 'desc';
    };
}