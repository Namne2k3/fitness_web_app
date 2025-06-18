/**
 * 📊 WorkoutGrid Component - Updated với Grid/List modes only
 * Grid layout với pagination support, loại bỏ compact mode
 */

import {
    GridView,
    List
} from '@mui/icons-material';
import {
    Box,
    Fade,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { Workout } from '../../../types/workout.interface';
import { WorkoutListResponse } from '../../../services/workoutService';
import Pagination from '../../../components/common/Pagination';
import WorkoutCard from './WorkoutCard';

// ================================
// 🎯 Types & Interfaces - Updated
// ================================
type ViewMode = 'grid' | 'list'; // Removed 'compact'

interface WorkoutGridProps {
    workouts: Workout[];
    pagination: WorkoutListResponse['pagination'];
    loading?: boolean;
    onLike: (workoutId: string, currentLiked: boolean, currentCount: number) => void;
    onSave: (workoutId: string, currentSaved: boolean, currentCount: number) => void;
    onView: (workoutId: string) => void;
    onShare?: (workoutId: string) => void;
    onAddToQueue?: (workoutId: string) => void;
    onPageChange: (page: number) => void;
    emptyState?: React.ReactNode;
}

// ================================
// 📊 WorkoutGrid Component - Updated
// ================================
const WorkoutGrid: React.FC<WorkoutGridProps> = ({
    workouts,
    pagination,
    loading = false,
    onLike,
    onSave,
    onView,
    onShare,
    onAddToQueue,
    onPageChange,
    emptyState
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    // ✅ Updated Grid configurations - Removed compact
    const gridConfigs = useMemo(() => ({
        grid: {
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
            },
            gap: 3,
            width: '100%'
        },
        list: {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
        }
    }), []);

    const currentConfig = gridConfigs[viewMode];

    // Handle view mode change
    const handleViewModeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newViewMode: ViewMode | null,
    ) => {
        if (newViewMode !== null) {
            setViewMode(newViewMode);
        }
    };

    // Empty state
    if (!loading && workouts.length === 0) {
        return (
            <Box sx={{ py: 8, textAlign: 'center' }}>
                {emptyState || (
                    <Typography variant="h6" color="text.secondary">
                        Không tìm thấy workout nào
                    </Typography>
                )}
            </Box>
        );
    }

    return (
        <Box>
            {/* Header với View Mode Controls */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
            }}>
                {/* Results Count */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {pagination.totalItems.toLocaleString()} workouts
                </Typography>

                {/* ✅ Updated View Mode Controls - Chỉ Grid và List */}
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    aria-label="view mode"
                    size="small"
                    sx={{
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        '& .MuiToggleButton-root': {
                            border: 'none',
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            color: 'text.secondary',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'white',
                            },
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
                    <ToggleButton value="grid" aria-label="grid view">
                        <GridView sx={{ mr: 1, fontSize: 18 }} />
                        Grid
                    </ToggleButton>
                    <ToggleButton value="list" aria-label="list view">
                        <List sx={{ mr: 1, fontSize: 18 }} />
                        List
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* ✅ Updated Workout Grid/List - Fixed styling */}
            <Fade in timeout={300}>
                <Box sx={currentConfig}>
                    {workouts.map((workout) => (
                        <WorkoutCard
                            key={workout._id}
                            workout={workout}
                            variant={viewMode} // Pass view mode to card
                            onLike={() => onLike(workout._id, false, workout.likeCount || 0)}
                            onSave={() => onSave(workout._id, false, workout.saveCount || 0)}
                            onView={() => onView(workout._id)}
                            onShare={onShare ? () => onShare(workout._id) : undefined}
                            onAddToQueue={onAddToQueue ? () => onAddToQueue(workout._id) : undefined}
                        />
                    ))}
                </Box>
            </Fade>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={onPageChange}
                        showPageInfo
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
};

export default WorkoutGrid;
