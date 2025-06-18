/**
 * 🏋️ Workout Browse Page - Updated với Embedded Filters
 * Loại bỏ filter component riêng, nhúng vào header để tiết kiệm không gian
 */

import {
    Add,
    Analytics,
    BookmarkBorder,
    FavoriteBorder
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Container,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useOptimistic,
    useState,
    useTransition
} from 'react';

import { WorkoutListParams, WorkoutListResponse, WorkoutService } from '../../services/workoutService';
import { Workout } from '../../types/workout.interface';
import {
    WorkoutGrid,
    WorkoutHeader,
    WorkoutsSkeleton
} from './components';

// ================================
// 🎯 Types & Interfaces
// ================================
interface FilterState {
    search: string;
    category: string;
    difficulty: string;
    maxDuration: string;
    equipment: string;
}

interface WorkoutPageState {
    filters: FilterState;
    page: number;
}

interface OptimisticWorkoutUpdate {
    workoutId: string;
    type: 'like' | 'save';
    value: boolean;
    count: number;
}

// ================================
// 🏠 Main WorkoutPage Component - Updated
// ================================
const WorkoutPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isPending, startTransition] = useTransition();

    // State management - Simplified
    const [state, setState] = useState<WorkoutPageState>({
        filters: {
            search: '',
            category: '',
            difficulty: '',
            maxDuration: '',
            equipment: '',
        },
        page: 1,
    });

    // Data state với useEffect approach
    const [workoutData, setWorkoutData] = useState<WorkoutListResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Optimistic updates for social interactions
    const [optimisticUpdates, addOptimisticUpdate] = useOptimistic(
        [] as OptimisticWorkoutUpdate[],
        (state, newUpdate: OptimisticWorkoutUpdate) => {
            const filtered = state.filter(
                update => !(update.workoutId === newUpdate.workoutId && update.type === newUpdate.type)
            );
            return [...filtered, newUpdate];
        }
    );

    // ✅ NEW: Mock user data for enhanced header
    const currentUser = {
        avatar: 'https://via.placeholder.com/40x40',
        username: 'fitness_enthusiast',
        weeklyGoal: 5,
        weeklyProgress: 3,
        streak: 12
    };

    // ✅ NEW: Mock quick stats
    const quickStats = {
        thisWeekWorkouts: 3,
        totalCalories: 1250,
        avgRating: 4.6,
        trending: ['HIIT', 'Strength', 'Yoga']
    };

    // Build API params từ filters
    const apiParams = useMemo((): WorkoutListParams => {
        const filters: Record<string, unknown> = {};

        if (state.filters.search) filters.search = state.filters.search;
        if (state.filters.category) filters.category = state.filters.category;
        if (state.filters.difficulty) filters.difficulty = state.filters.difficulty;
        if (state.filters.equipment) filters.equipment = state.filters.equipment;
        if (state.filters.maxDuration) {
            filters.duration = { max: parseInt(state.filters.maxDuration) };
        }

        return {
            page: state.page,
            limit: 12,
            filters,
            sort: { field: 'createdAt', order: 'desc' },
            options: {
                includeUserData: true,
                includeExerciseData: false
            }
        };
    }, [state]);

    // Fetch data với useEffect
    const fetchWorkouts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await WorkoutService.getWorkouts(apiParams);
            setWorkoutData(result);
        } catch (err) {
            console.error('Failed to fetch workouts:', err);
            setError('Không thể tải workouts. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }, [apiParams]);

    useEffect(() => {
        fetchWorkouts();
    }, [fetchWorkouts]);

    // Event handlers
    const handleFiltersChange = (filters: FilterState) => {
        startTransition(() => {
            setState(prev => ({
                ...prev,
                filters,
                page: 1 // Reset to first page when filters change
            }));
            setError(null);
        });
    };

    const handlePageChange = (newPage: number) => {
        startTransition(() => {
            setState(prev => ({ ...prev, page: newPage }));
            // Scroll to top when page changes
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // ✅ NEW: Handler functions for enhanced features
    const handleSortChange = (sortBy: string) => {
        console.log('Sort by:', sortBy);
        // TODO: Implement sorting logic
    };

    const handleViewModeChange = (mode: 'grid' | 'list') => {
        console.log('View mode:', mode);
        // TODO: Integrate with WorkoutGrid viewMode
    };

    // Optimistic interactions
    const handleLike = (workoutId: string, currentLiked: boolean, currentCount: number) => {
        const newLiked = !currentLiked;
        const newCount = newLiked ? currentCount + 1 : currentCount - 1;

        addOptimisticUpdate({
            workoutId,
            type: 'like',
            value: newLiked,
            count: newCount
        });

        startTransition(async () => {
            try {
                await WorkoutService.toggleLike(workoutId);
            } catch (error) {
                console.error('Failed to toggle like:', error);
                setError('Không thể cập nhật like. Vui lòng thử lại.');
            }
        });
    };

    const handleSave = (workoutId: string, currentSaved: boolean, currentCount: number) => {
        const newSaved = !currentSaved;
        const newCount = newSaved ? currentCount + 1 : currentCount - 1;

        addOptimisticUpdate({
            workoutId,
            type: 'save',
            value: newSaved,
            count: newCount
        });

        startTransition(async () => {
            try {
                await WorkoutService.toggleSave(workoutId);
            } catch (error) {
                console.error('Failed to toggle save:', error);
                setError('Không thể lưu workout. Vui lòng thử lại.');
            }
        });
    };

    const handleView = (workoutId: string) => {
        console.log('View workout:', workoutId);
        // TODO: Navigate to workout detail page
    };

    const handleShare = (workoutId: string) => {
        console.log('Share workout:', workoutId);
        // TODO: Implement share functionality
    };

    const handleAddToQueue = (workoutId: string) => {
        console.log('Add to queue:', workoutId);
        // TODO: Implement workout queue functionality
    };

    const handleCreateWorkout = () => {
        console.log('Create new workout');
        // TODO: Navigate to workout creation page
    };

    const handleViewAnalytics = () => {
        console.log('View analytics');
        // TODO: Open analytics modal/page
    };

    // Stats calculations from real data
    const stats = useMemo(() => {
        if (!workoutData) return { totalWorkouts: 0, totalBeginner: 0, totalSponsored: 0 };

        return {
            totalWorkouts: workoutData.pagination.totalItems,
            totalBeginner: workoutData.data.filter((w: Workout) => w.difficulty === 'beginner').length,
            totalSponsored: workoutData.data.filter((w: Workout) => w.isSponsored).length,
        };
    }, [workoutData]);

    // Apply optimistic updates to current data
    const optimizedWorkouts = useMemo(() => {
        if (!workoutData) return [];

        return workoutData.data.map(workout => {
            const likeUpdate = optimisticUpdates.find(
                update => update.workoutId === workout._id && update.type === 'like'
            );
            const saveUpdate = optimisticUpdates.find(
                update => update.workoutId === workout._id && update.type === 'save'
            );

            return {
                ...workout,
                ...(likeUpdate && {
                    likeCount: likeUpdate.count,
                }),
                ...(saveUpdate && {
                    saveCount: saveUpdate.count,
                })
            };
        });
    }, [workoutData, optimisticUpdates]);

    // Speed dial actions for mobile
    const speedDialActions = [
        {
            icon: <Add />,
            name: 'Tạo Workout',
            onClick: handleCreateWorkout,
        },
        {
            icon: <FavoriteBorder />,
            name: 'Yêu thích',
            onClick: () => console.log('Favorites'),
        },
        {
            icon: <BookmarkBorder />,
            name: 'Đã lưu',
            onClick: () => console.log('Saved'),
        },
        {
            icon: <Analytics />,
            name: 'Thống kê',
            onClick: handleViewAnalytics,
        },
    ];

    return (
        <Box sx={{
            minHeight: '100vh',
            pt: { xs: 2, md: 4 },
            pb: 4,
            marginTop: { xs: '6rem' },
            background: 'linear-gradient(to bottom, rgba(102, 126, 234, 0.02) 0%, transparent 100%)',
        }}>
            <Container maxWidth="xl">
                {/* Error Alert */}
                {error && (
                    <Alert
                        severity="error"
                        onClose={() => setError(null)}
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Loading Progress Bar */}
                {(isPending || isLoading) && (
                    <Box sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        background: 'linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.1) 50%, transparent 100%)',
                        height: 4,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%)',
                            animation: 'loading 1.5s infinite linear',
                        },
                        '@keyframes loading': {
                            '0%': { left: '-100%' },
                            '100%': { left: '100%' }
                        }
                    }} />
                )}

                {/* Main Content */}
                {isLoading ? (
                    <Box>
                        <WorkoutHeader
                            totalWorkouts={0}
                            totalBeginner={0}
                            totalSponsored={0}
                            filters={state.filters}
                            onFiltersChange={handleFiltersChange}
                            totalResults={0}
                            currentUser={currentUser}
                            quickStats={quickStats}
                            onSortChange={handleSortChange}
                            onViewModeChange={handleViewModeChange}
                        />
                        <WorkoutsSkeleton />
                    </Box>
                ) : workoutData ? (
                    <Box>
                        {/* ✅ UPDATED: Header với Embedded Filters */}
                        <WorkoutHeader
                            totalWorkouts={stats.totalWorkouts}
                            totalBeginner={stats.totalBeginner}
                            totalSponsored={stats.totalSponsored}
                            onCreateWorkout={!isMobile ? handleCreateWorkout : undefined}
                            onViewAnalytics={!isMobile ? handleViewAnalytics : undefined}
                            filters={state.filters}
                            onFiltersChange={handleFiltersChange}
                            totalResults={workoutData.pagination.totalItems}
                            currentUser={currentUser}
                            quickStats={quickStats}
                            onSortChange={handleSortChange}
                            onViewModeChange={handleViewModeChange}
                        />

                        {/* ✅ REMOVED: Separate WorkoutFilters component */}
                        {/* WorkoutFilters is now embedded in WorkoutHeader */}

                        {/* ✅ UPDATED: Grid với Pagination */}
                        <WorkoutGrid
                            workouts={optimizedWorkouts}
                            pagination={workoutData.pagination}
                            onLike={handleLike}
                            onSave={handleSave}
                            onView={handleView}
                            onShare={handleShare}
                            onAddToQueue={handleAddToQueue}
                            onPageChange={handlePageChange}
                        />
                    </Box>
                ) : (
                    <Alert severity="info">
                        Không tìm thấy workout nào. Thử điều chỉnh bộ lọc.
                    </Alert>
                )}

                {/* Mobile Speed Dial */}
                {isMobile && (
                    <SpeedDial
                        ariaLabel="Workout actions"
                        sx={{
                            position: 'fixed',
                            bottom: 24,
                            right: 24,
                            zIndex: 1000,
                        }}
                        icon={<SpeedDialIcon />}
                        FabProps={{
                            sx: {
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                },
                            },
                        }}
                    >
                        {speedDialActions.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={action.onClick}
                                sx={{
                                    '& .MuiSpeedDialAction-fab': {
                                        backgroundColor: 'white',
                                        color: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'primary.light',
                                            color: 'white',
                                        },
                                    },
                                }}
                            />
                        ))}
                    </SpeedDial>
                )}
            </Container>
        </Box>
    );
};

export default WorkoutPage;
