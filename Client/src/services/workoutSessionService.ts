/**
 * 🏃 Workout Session Service
 * API service cho workout session management
 */

import { api } from './api';
import {
    WorkoutSession,
    UpdateExerciseProgressRequest,
    CompleteExerciseRequest,
    CompleteSessionRequest,
    UpdateSessionRequest,
    WorkoutSessionFilters,
    WorkoutSessionStats
} from '../types/workoutSession.interface';
import { ApiResponse } from '../types/app.interface';

const BASE_URL = '/workout-sessions';

export class WorkoutSessionService {
    /**
     * Tạo session workout mới (start session)
     */
    static async startSession(workoutId: string): Promise<WorkoutSession> {
        const response = await api.post<ApiResponse<WorkoutSession>>(`${BASE_URL}/start`, { workoutId });
        if (!response.data?.data) {
            throw new Error('Failed to start workout session');
        }
        return response.data.data;
    }

    /**
     * Lấy active session của user
     */
    static async getActiveSession(): Promise<WorkoutSession | null> {
        try {
            const response = await api.get<ApiResponse<WorkoutSession>>(`${BASE_URL}/active`);
            return response.data?.data || null;
        } catch {
            // Nếu không có active session, trả về null
            return null;
        }
    }

    /**
     * Lấy session theo ID
     */
    static async getSessionById(sessionId: string): Promise<WorkoutSession> {
        const response = await api.get<ApiResponse<WorkoutSession>>(`${BASE_URL}/${sessionId}`);
        if (!response.data?.data) {
            throw new Error('Workout session not found');
        }
        return response.data.data;
    }

    /**
     * Lấy lịch sử workout sessions
     */
    static async getSessionHistory(
        page: number = 1,
        limit: number = 10,
        filters?: WorkoutSessionFilters
    ): Promise<{
        sessions: WorkoutSession[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });

        // Add filters if provided
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) {
                    if (Array.isArray(value)) {
                        params.append(key, value.join(','));
                    } else {
                        params.append(key, value.toString());
                    }
                }
            });
        }

        const response = await api.get<ApiResponse<{
            sessions: WorkoutSession[];
            total: number;
            page: number;
            totalPages: number;
        }>>(`${BASE_URL}?${params}`);

        if (!response.data?.data) {
            throw new Error('Failed to fetch workout session history');
        }

        return response.data.data;
    }

    /**
     * Cập nhật progress của exercise
     */
    static async updateExerciseProgress(
        sessionId: string,
        data: UpdateExerciseProgressRequest
    ): Promise<WorkoutSession> {
        const response = await api.put<ApiResponse<WorkoutSession>>(
            `${BASE_URL}/${sessionId}/exercise-progress`,
            data
        );
        if (!response.data?.data) {
            throw new Error('Failed to update exercise progress');
        }
        return response.data.data;
    }

    /**
     * Hoàn thành exercise
     */
    static async completeExercise(
        sessionId: string,
        data: CompleteExerciseRequest
    ): Promise<WorkoutSession> {
        const response = await api.post<ApiResponse<WorkoutSession>>(
            `${BASE_URL}/${sessionId}/complete-exercise`,
            data
        );
        if (!response.data?.data) {
            throw new Error('Failed to complete exercise');
        }
        return response.data.data;
    }

    /**
     * Pause session
     */
    static async pauseSession(sessionId: string): Promise<WorkoutSession> {
        const response = await api.post<ApiResponse<WorkoutSession>>(
            `${BASE_URL}/${sessionId}/pause`
        );
        if (!response.data?.data) {
            throw new Error('Failed to pause session');
        }
        return response.data.data;
    }

    /**
     * Resume session
     */
    static async resumeSession(sessionId: string): Promise<WorkoutSession> {
        const response = await api.post<ApiResponse<WorkoutSession>>(
            `${BASE_URL}/${sessionId}/resume`
        );
        if (!response.data?.data) {
            throw new Error('Failed to resume session');
        }
        return response.data.data;
    }

    /**
     * Hoàn thành session
     */
    static async completeSession(
        sessionId: string,
        data?: CompleteSessionRequest
    ): Promise<WorkoutSession> {
        const response = await api.post<ApiResponse<WorkoutSession>>(
            `${BASE_URL}/${sessionId}/complete`,
            data
        );
        if (!response.data?.data) {
            throw new Error('Failed to complete session');
        }
        return response.data.data;
    }

    /**
     * Dừng session
     */
    static async stopSession(sessionId: string): Promise<WorkoutSession> {
        const response = await api.post<ApiResponse<WorkoutSession>>(
            `${BASE_URL}/${sessionId}/stop`
        );
        if (!response.data?.data) {
            throw new Error('Failed to stop session');
        }
        return response.data.data;
    }

    /**
     * Cập nhật session metadata
     */
    static async updateSession(
        sessionId: string,
        data: UpdateSessionRequest
    ): Promise<WorkoutSession> {
        const response = await api.put<ApiResponse<WorkoutSession>>(
            `${BASE_URL}/${sessionId}`,
            data
        );
        if (!response.data?.data) {
            throw new Error('Failed to update session');
        }
        return response.data.data;
    }

    /**
     * Xóa session
     */
    static async deleteSession(sessionId: string): Promise<void> {
        await api.delete(`${BASE_URL}/${sessionId}`);
    }

    /**
     * Lấy thống kê workout sessions
     */
    static async getStats(): Promise<WorkoutSessionStats> {
        const response = await api.get<ApiResponse<WorkoutSessionStats>>(`${BASE_URL}/stats`);
        if (!response.data?.data) {
            throw new Error('Failed to fetch workout session stats');
        }
        return response.data.data;
    }
}

export default WorkoutSessionService;
