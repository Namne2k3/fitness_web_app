/**
 * 🏋️ Workout Browse Page - Compact & Extensible Design
 * React 19 implementation với modular components và space-efficient layout
 */

import {
    Add,
    Analytics,
    BookmarkBorder,
    FavoriteBorder,
    Settings,
    TrendingUp
} from '@mui/icons-material';
import {
    Box,
    Button,
    Container,
    Fab,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { Suspense, useMemo, useState } from 'react';

import {
    WorkoutFilters,
    WorkoutGrid,
    WorkoutHeader
} from '../../components/workout';
import { Workout } from '../../types/workout.interface';
import { mockWorkouts } from '../../utils/mockWorkouts';

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
}

// ================================
// 🏠 Main WorkoutPage Component
// ================================
const WorkoutPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // State management với React 19 patterns
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
    });

    // Memoized filtered workouts
    const filteredWorkouts = useMemo(() => {
        let result = [...mockWorkouts];

        // Apply filters
        if (state.filters.search) {
            result = result.filter(workout =>
                workout.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
                workout.description?.toLowerCase().includes(state.filters.search.toLowerCase()) ||
                workout.tags.some(tag => tag.toLowerCase().includes(state.filters.search.toLowerCase()))
            );
        }

        if (state.filters.category) {
            result = result.filter(workout => workout.category === state.filters.category);
        }

        if (state.filters.difficulty) {
            result = result.filter(workout => workout.difficulty === state.filters.difficulty);
        }

        if (state.filters.maxDuration) {
            result = result.filter(workout =>
                (workout.estimatedDuration || 0) <= parseInt(state.filters.maxDuration)
            );
        }

        if (state.filters.equipment) {
            if (state.filters.equipment === 'bodyweight') {
                result = result.filter(workout =>
                    workout.equipment?.includes('bodyweight') ||
                    !workout.equipment?.some(eq => eq !== 'bodyweight')
                );
            } else {
                result = result.filter(workout =>
                    workout.equipment?.includes(state.filters.equipment)
                );
            }
        }

        return result;
    }, [state.filters]);

    // Stats calculations
    const stats = useMemo(() => ({
        totalWorkouts: mockWorkouts.length,
        totalBeginner: mockWorkouts.filter(w => w.difficulty === 'beginner').length,
        totalSponsored: mockWorkouts.filter(w => w.isSponsored).length,
    }), []);

    // Event handlers
    const handleFiltersChange = (filters: FilterState) => {
        setState(prev => ({ ...prev, filters }));
    };

    const handleLike = (workoutId: string) => {
        console.log('Liked workout:', workoutId);
        // TODO: Implement like functionality với React 19 useOptimistic
    };

    const handleSave = (workoutId: string) => {
        console.log('Saved workout:', workoutId);
        // TODO: Implement save functionality
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

    const handleViewFavorites = () => {
        setState(prev => ({
            ...prev,
            showFavorites: !prev.showFavorites,
            showSaved: false
        }));
    };

    const handleViewSaved = () => {
        setState(prev => ({
            ...prev,
            showSaved: !prev.showSaved,
            showFavorites: false
        }));
    };

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
                {/* Header Section - Compact on mobile */}
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
                    totalResults={filteredWorkouts.length}
                    compact={isMobile}
                />

                {/* Main Content Grid */}
                <Suspense fallback={<div>Loading workouts...</div>}>
                    <WorkoutGrid
                        workouts={filteredWorkouts}
                        onLike={handleLike}
                        onSave={handleSave}
                        onView={handleView}
                        onShare={handleShare}
                        onAddToQueue={handleAddToQueue}
                    />
                </Suspense>

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

                {/* Future Extension Areas - Commented for future development */}
                {/* 
                TODO: Future Features to Add:
                
                1. Workout Queue/Playlist Section
                <WorkoutQueue workouts={queuedWorkouts} />
                
                2. Quick Recommendations
                <RecommendationCarousel user={currentUser} />
                
                3. Live Classes Section
                <LiveClassesWidget />
                
                4. Social Feed Integration
                <SocialWorkoutFeed />
                
                5. Achievement Progress
                <AchievementProgress user={currentUser} />
                
                6. Workout Analytics Dashboard
                <AnalyticsDashboard compact />
                
                7. Trainer Spotlight
                <TrainerSpotlight />
                
                8. Equipment Marketplace
                <EquipmentMarketplace />
                */}
            </Container>
        </Box>
    );
};

export default WorkoutPage;