/**
 * 🏋️ Workout Browse Page - Traditional useEffect Approach
 * Sử dụng useEffect + useState pattern thay vì React 19 use() hook
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
    WorkoutFilters,
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
    viewMode: 'grid' | 'list' | 'compact';
    showFavorites: boolean;
    showSaved: boolean;
    page: number;
}

interface OptimisticWorkoutUpdate {
    workoutId: string;
    type: 'like' | 'save';
    value: boolean;
    count: number;
}

// ================================
// 🏠 Main WorkoutPage Component
// ================================
const WorkoutPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isPending, startTransition] = useTransition();

    // State management
    const [state, setState] = useState<WorkoutPageState>({
        filters: {
            search: '',
            category: '',
            difficulty: '',
            maxDuration: '',
            equipment: '',
        },
        viewMode: 'grid',
        showFavorites: false,
        showSaved: false,
        page: 1,
    });

    // ✅ TRADITIONAL: Data state với useEffect approach
    const [workoutData, setWorkoutData] = useState<WorkoutListResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ React 19: useOptimistic cho social interactions (vẫn giữ để demo)
    const [optimisticUpdates, addOptimisticUpdate] = useOptimistic(
        [] as OptimisticWorkoutUpdate[],
        (state, newUpdate: OptimisticWorkoutUpdate) => {
            // Remove existing update for this workout and type
            const filtered = state.filter(
                update => !(update.workoutId === newUpdate.workoutId && update.type === newUpdate.type)
            );
            return [...filtered, newUpdate];
        }
    );

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

        // Handle favorites/saved views
        if (state.showFavorites) {
            // TODO: Add user-specific favorites filter
        }
        if (state.showSaved) {
            // TODO: Add user-specific saved filter
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

    // ✅ TRADITIONAL: Fetch data với useEffect
    const fetchWorkouts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('Fetching workouts with params:', apiParams);
            const result = await WorkoutService.getWorkouts(apiParams);
            console.log('Workouts fetched successfully:', result);

            setWorkoutData(result);
        } catch (err) {
            console.error('Failed to fetch workouts:', err);
            setError('Failed to load workouts. Please try again.');
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

    // ✅ React 19: Optimistic likes
    const handleLike = (workoutId: string, currentLiked: boolean, currentCount: number) => {
        // Optimistic update
        const newLiked = !currentLiked;
        const newCount = newLiked ? currentCount + 1 : currentCount - 1;

        addOptimisticUpdate({
            workoutId,
            type: 'like',
            value: newLiked,
            count: newCount
        });

        // Actual API call
        startTransition(async () => {
            try {
                await WorkoutService.toggleLike(workoutId);
            } catch (error) {
                console.error('Failed to toggle like:', error);
                // React automatically reverts optimistic update on error
                setError('Failed to update like. Please try again.');
            }
        });
    };

    // ✅ React 19: Optimistic saves
    const handleSave = (workoutId: string, currentSaved: boolean, currentCount: number) => {
        // Optimistic update
        const newSaved = !currentSaved;
        const newCount = newSaved ? currentCount + 1 : currentCount - 1;

        addOptimisticUpdate({
            workoutId,
            type: 'save',
            value: newSaved,
            count: newCount
        });

        // Actual API call
        startTransition(async () => {
            try {
                await WorkoutService.toggleSave(workoutId);
            } catch (error) {
                console.error('Failed to toggle save:', error);
                setError('Failed to save workout. Please try again.');
            }
        });
    };

    const handleView = (workoutId: string) => {
        console.log('View workout:', workoutId);
        // TODO: Navigate to workout detail page
        // navigate(`/workouts/${workoutId}`);
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
        // navigate('/workouts/create');
    };

    const handleViewAnalytics = () => {
        console.log('View analytics');
        // TODO: Open analytics modal/page
    };

    const handleViewFavorites = () => {
        startTransition(() => {
            setState(prev => ({
                ...prev,
                showFavorites: !prev.showFavorites,
                showSaved: false,
                page: 1
            }));
        });
    };

    const handleViewSaved = () => {
        startTransition(() => {
            setState(prev => ({
                ...prev,
                showSaved: !prev.showSaved,
                showFavorites: false,
                page: 1
            }));
        });
    };

    const handlePageChange = (newPage: number) => {
        startTransition(() => {
            setState(prev => ({ ...prev, page: newPage }));
        });
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
            onClick: handleViewFavorites,
        },
        {
            icon: <BookmarkBorder />,
            name: 'Đã lưu',
            onClick: handleViewSaved,
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
            marginTop: { xs: '8rem', md: '10rem' },
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

                {/* Loading Overlay */}
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

                {/* ✅ TRADITIONAL: Conditional rendering thay vì Suspense */}
                {isLoading ? (
                    <Box>
                        <WorkoutHeader
                            totalWorkouts={0}
                            totalBeginner={0}
                            totalSponsored={0}
                            compact={isMobile}
                        />
                        <WorkoutFilters
                            filters={state.filters}
                            onFiltersChange={handleFiltersChange}
                            totalResults={0}
                            compact={isMobile}
                        />
                        <WorkoutsSkeleton />
                    </Box>
                ) : workoutData ? (
                    <Box>
                        {/* Header Section */}
                        <WorkoutHeader
                            totalWorkouts={stats.totalWorkouts}
                            totalBeginner={stats.totalBeginner}
                            totalSponsored={stats.totalSponsored}
                            onCreateWorkout={!isMobile ? handleCreateWorkout : undefined}
                            onViewAnalytics={!isMobile ? handleViewAnalytics : undefined}
                            onViewFavorites={!isMobile ? handleViewFavorites : undefined}
                            onViewSaved={!isMobile ? handleViewSaved : undefined}
                            compact={isMobile}
                        />

                        {/* Filters Section */}
                        <WorkoutFilters
                            filters={state.filters}
                            onFiltersChange={handleFiltersChange}
                            totalResults={workoutData.pagination.totalItems}
                            compact={isMobile}
                        />

                        {/* Main Content Grid */}
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
                        No workouts found. Try adjusting your filters.
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
