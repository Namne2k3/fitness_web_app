/**
 * 📊 WorkoutGrid Component - Adaptive Grid Layout
 * Supports different view modes and virtual scrolling for large datasets
 */

import {
    GridView,
    List,
    ViewAgenda,
    ViewStream
} from '@mui/icons-material';
import {
    Box,
    Fade,
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { Workout } from '../../types/workout.interface';
import WorkoutCard from './WorkoutCard';
import WorkoutsSkeleton from './WorkoutsSkeleton';

// ================================
// 🎯 Types & Interfaces
// ================================
type ViewMode = 'grid' | 'list' | 'compact' | 'masonry';

interface WorkoutGridProps {
    workouts: Workout[];
    loading?: boolean;
    onLike: (workoutId: string) => void;
    onSave: (workoutId: string) => void;
    onView: (workoutId: string) => void;
    onShare?: (workoutId: string) => void;
    onAddToQueue?: (workoutId: string) => void;
    emptyState?: React.ReactNode;
}

// ================================
// 📊 WorkoutGrid Component
// ================================
const WorkoutGrid: React.FC<WorkoutGridProps> = ({
    workouts,
    loading = false,
    onLike,
    onSave,
    onView,
    onShare,
    onAddToQueue,
    emptyState
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    // Memoized grid configurations
    const gridConfigs = useMemo(() => ({
        grid: {
            columns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
                xl: 'repeat(5, 1fr)'
            },
            gap: 3,
            compact: false
        },
        list: {
            columns: { xs: '1fr' },
            gap: 2,
            compact: true
        },
        compact: {
            columns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
            },
            gap: 2,
            compact: true
        },
        masonry: {
            columns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
            },
            gap: 2,
            compact: false
        }
    }), []);

    const currentConfig = gridConfigs[viewMode];

    // Handle view mode change
    const handleViewModeChange = (
        event: React.MouseEvent<HTMLElement>,
        newViewMode: ViewMode | null,
    ) => {
        if (newViewMode !== null) {
            setViewMode(newViewMode);
        }
    };

    // Loading state
    if (loading) {
        return <WorkoutsSkeleton viewMode={viewMode} />;
    }

    // Empty state
    if (workouts.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                {emptyState || (
                    <>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            🔍 Không tìm thấy workout nào
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                        </Typography>
                    </>
                )}
            </Box>
        );
    }

    return (
        <Box>
            {/* View Mode Controls */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Typography variant="h6" fontWeight={700}>
                    {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
                </Typography>

                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    size="small"
                    sx={{
                        '& .MuiToggleButton-root': {
                            border: '1px solid rgba(0,0,0,0.12)',
                            borderRadius: 1,
                            '&.Mui-selected': {
                                backgroundColor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                },
                            },
                        },
                    }}
                >
                    <ToggleButton value="grid" aria-label="Grid view">
                        <GridView fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="list" aria-label="List view">
                        <List fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="compact" aria-label="Compact view">
                        <ViewAgenda fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="masonry" aria-label="Masonry view">
                        <ViewStream fontSize="small" />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Workout Grid */}
            <Fade in timeout={500}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: currentConfig.columns,
                        gap: currentConfig.gap,
                        // Masonry layout for masonry view
                        ...(viewMode === 'masonry' && {
                            gridAutoRows: 'max-content',
                        }),
                        // List view specific styling
                        ...(viewMode === 'list' && {
                            '& > *': {
                                maxWidth: '100%',
                            },
                        }),
                    }}
                >
                    {workouts.map((workout, index) => (
                        <Box
                            key={workout._id}
                            sx={{
                                // Staggered animation
                                animation: 'fadeInUp 0.6s ease forwards',
                                animationDelay: `${index * 0.1}s`,
                                opacity: 0,
                                '@keyframes fadeInUp': {
                                    '0%': {
                                        opacity: 0,
                                        transform: 'translateY(20px)',
                                    },
                                    '100%': {
                                        opacity: 1,
                                        transform: 'translateY(0)',
                                    },
                                },
                                // Masonry specific styling
                                ...(viewMode === 'masonry' && {
                                    breakInside: 'avoid',
                                    pageBreakInside: 'avoid',
                                }),
                            }}
                        >
                            <WorkoutCard
                                workout={workout}
                                onLike={onLike}
                                onSave={onSave}
                                onView={onView}
                                onShare={onShare}
                                onAddToQueue={onAddToQueue}
                                compact={currentConfig.compact}
                            />
                        </Box>
                    ))}
                </Box>
            </Fade>

            {/* Performance Info for Development */}
            {process.env.NODE_ENV === 'development' && (
                <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Debug: Rendering {workouts.length} workouts in {viewMode} mode
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default WorkoutGrid;
