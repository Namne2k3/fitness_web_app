/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 💪 Exercise Page - Clean & Compact Design
 * React Query implementation với streamlined header và simplified filters
 */

import {
    FitnessCenter
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Card,
    Container,
    Typography
} from '@mui/material';
import React, { useActionState, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExerciseListParams } from '../../services/exerciseService';
import { Exercise } from '../../types';
import { useExercises } from '../../hooks/useExercises';
import ExerciseFilters, { ExerciseFilterState } from './components/ExerciseFilters';
import ExerciseList from './components/ExerciseList';
import ExercisePagination from './components/ExercisePagination';

interface ExercisePageState {
    success: boolean;
    error: string | null;
    data: unknown;
}

/**
 * ✅ React 19: Main Exercise Page Component với clean design
 */
const ExercisePage: React.FC = () => {
    const navigate = useNavigate();

    // ================================
    // 🎯 State Management
    // ================================
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [viewMode] = useState<'grid' | 'list'>('grid');

    // ✅ React 19: useActionState cho error handling
    const [state] = useActionState(
        async (_: ExercisePageState, formData: FormData) => {
            try {
                const filtersData = formData.get('filters');
                const filters = filtersData ? JSON.parse(filtersData as string) : {};

                return {
                    success: true,
                    error: null,
                    data: { filters, timestamp: Date.now() }
                };
            } catch (error) {
                return {
                    success: false,
                    error: 'Failed to update filters',
                    data: null
                };
            }
        },
        { success: true, error: null, data: { filters: {}, timestamp: Date.now() } }
    );    // ================================
    // 🔧 Filter & Sort Management
    // ================================
    const [filters, setFilters] = useState<ExerciseFilterState>({
        search: '',
        category: '',
        difficulty: '',
        primaryMuscleGroups: [],
        equipment: []
    }); const [sort] = useState<{ field: string; order: 'asc' | 'desc' }>({
        field: 'name',
        order: 'asc'
    });

    // Helper function để convert ExerciseFilterState sang ExerciseListParams['filters']
    const mapFiltersToParams = (filters: ExerciseFilterState): ExerciseListParams['filters'] => {
        return {
            search: filters.search || undefined,
            category: (filters.category as any) || undefined,
            difficulty: (filters.difficulty as any) || undefined,
            primaryMuscleGroups: filters.primaryMuscleGroups.length > 0 ? filters.primaryMuscleGroups : undefined,
            equipment: filters.equipment.length > 0 ? filters.equipment : undefined,
            isApproved: true // Always filter to approved exercises
        };
    };    // Build params cho API call
    const exerciseParams: ExerciseListParams = {
        page,
        limit,
        filters: mapFiltersToParams(filters),
        sort,
        options: {
            includeUserData: false,
            includeVariations: false
        }
    };

    // ✅ Get exercise data để lấy total count cho filters
    const { data: exerciseData } = useExercises(exerciseParams);    // ================================
    // 🎯 Event Handlers
    // ================================
    const handleExerciseClick = (exercise: Exercise) => {
        // Use slug if available, fallback to id for backward compatibility
        const identifier = exercise.slug || exercise._id;
        navigate(`/exercises/${identifier}`);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ================================
    // 🎨 Render Main Component
    // ================================
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                pt: { xs: 10, md: 12 },
                pb: '10rem'
            }}
        >
            <Container maxWidth="lg">
                {/* ================================ */}
                {/* 🎯 COMPACT HEADER */}
                {/* ================================ */}
                <Box
                    sx={{
                        mb: 3,
                        textAlign: 'center',
                        color: 'white',
                        py: { xs: 2, md: 3 }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                        <FitnessCenter sx={{ fontSize: { xs: 32, md: 40 } }} />
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: '1.8rem', md: '2.5rem' }
                            }}
                        >
                            Thư viện Bài tập
                        </Typography>
                    </Box>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            opacity: 0.9,
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            maxWidth: 500,
                            mx: 'auto'
                        }}
                    >
                        Khám phá hàng nghìn bài tập chuyên nghiệp
                    </Typography>
                </Box>                {/* ================================ */}
                {/* 🔍 COMPACT FILTERS - Using ExerciseFilters Component */}
                {/* ================================ */}                <ExerciseFilters
                    filters={filters}
                    onFiltersChange={(newFilters: ExerciseFilterState) => {
                        setFilters(newFilters);
                        setPage(1);
                    }}
                    totalResults={exerciseData?.pagination?.totalItems || exerciseData?.data?.length || 0}
                />

                {/* ================================ */}
                {/* ⚠️ Error Handling */}
                {/* ================================ */}
                {state.error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {state.error}
                    </Alert>
                )}

                {/* ================================ */}
                {/* 📋 Exercise List */}
                {/* ================================ */}
                <Card
                    elevation={0}
                    sx={{
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.2)',
                        p: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                >
                    {/* ✅ React Query: No Suspense needed */}
                    <ExerciseList
                        params={exerciseParams}
                        onExerciseClick={handleExerciseClick}
                        viewMode={viewMode}
                    />

                    {/* Pagination */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 4
                    }}>
                        <ExercisePagination
                            params={exerciseParams}
                            currentPage={page}
                            onPageChange={handlePageChange}
                        />
                    </Box>
                </Card>

                {/* ================================ */}
                {/* 🎯 Floating Action Button */}
                {/* ================================ */}
                {/* <Fab
                    color="primary"
                    aria-label="add exercise"
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        width: 56,
                        height: 56,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6b63a8 100%)',
                            transform: 'scale(1.05)',
                            boxShadow: '0 6px 25px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                    onClick={() => navigate('/exercises/create')}
                >
                    <Add />
                </Fab> */}
            </Container>
        </Box>
    );
};

export default ExercisePage;
