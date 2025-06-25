/**
 * 💪 ExerciseList - Modern Grid & List View with Fitness Focus
 * React 19 implementation với Material UI design system
 */

import React, { useState, useTransition } from 'react';
import {
    Box,
    Grid,
    Typography,
    Alert,
    Button,
    Stack,
    Fade,
    Skeleton,
    CircularProgress
} from '@mui/material';
import {
    Refresh
} from '@mui/icons-material';
import { useExercises } from '../../../hooks/useExercises';
import { ExerciseListParams } from '../../../services/exerciseService';
import { Exercise } from '../../../types';
import ExerciseCard from './ExerciseCard';

interface ExerciseListProps {
    params: ExerciseListParams;
    onExerciseClick: (exercise: Exercise) => void;
    viewMode?: 'grid' | 'list';
}

const ExerciseList = ({ params, onExerciseClick, viewMode = 'grid' }: ExerciseListProps) => {
    const {
        data: exerciseData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching
    } = useExercises(params);

    const [internalViewMode, setInternalViewMode] = useState<'grid' | 'list'>(viewMode);
    const [isPending, startTransition] = useTransition();

    // Handle view mode change
    const handleViewModeChange = (mode: 'grid' | 'list') => {
        startTransition(() => {
            setInternalViewMode(mode);
        });
    };

    // Loading state
    if (isLoading) {
        return <ExerciseListSkeleton viewMode={internalViewMode} />;
    }

    // Error state
    if (isError) {
        return (
            <Box sx={{ mt: 3 }}>
                <Alert
                    severity="error"
                    sx={{
                        borderRadius: 3,
                        border: '1px solid rgba(244, 67, 54, 0.2)',
                        background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.02) 0%, rgba(244, 67, 54, 0.08) 100%)'
                    }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => refetch()}
                            startIcon={<Refresh />}
                        >
                            Thử lại
                        </Button>
                    }
                >
                    <Typography variant="h6" gutterBottom>
                        Không thể tải danh sách bài tập
                    </Typography>
                    <Typography variant="body2">
                        {error?.message || 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.'}
                    </Typography>
                </Alert>
            </Box>
        );
    }

    // Empty state
    if (!exerciseData?.exercises || exerciseData.exercises.length === 0) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                textAlign: 'center'
            }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    Không tìm thấy bài tập nào
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => refetch()}
                    startIcon={<Refresh />}
                >
                    Tải lại
                </Button>
            </Box>
        );
    }

    const exercises = exerciseData.exercises;

    return (
        <Box>
            {/* Loading overlay */}
            {isFetching && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(255,255,255,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Content */}
            {internalViewMode === 'grid' ? (
                <ExerciseGridView exercises={exercises} onExerciseClick={onExerciseClick} />
            ) : (
                <ExerciseListView exercises={exercises} onExerciseClick={onExerciseClick} />
            )}
        </Box>
    );
};

// ================================
// 🎯 Skeleton Loading Component
// ================================
const ExerciseListSkeleton = ({ viewMode }: { viewMode: 'grid' | 'list' }) => {
    if (viewMode === 'grid') {
        return (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
                {[...Array(8)].map((_, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Box>
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                            <Box sx={{ p: 2 }}>
                                <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
                                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Skeleton variant="rounded" width={60} height={24} />
                                    <Skeleton variant="rounded" width={80} height={24} />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Stack spacing={2}>
            {[...Array(5)].map((_, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, p: 2 }}>
                    <Skeleton variant="circular" width={64} height={64} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" sx={{ fontSize: '1.2rem', width: '60%' }} />
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%' }} />
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Skeleton variant="rounded" width={60} height={20} />
                            <Skeleton variant="rounded" width={80} height={20} />
                        </Box>
                    </Box>
                </Box>
            ))}
        </Stack>
    );
};

interface ViewProps {
    exercises: Exercise[];
    onExerciseClick: (exercise: Exercise) => void;
}

// ================================
// 🎯 Grid View Component
// ================================
const ExerciseGridView: React.FC<ViewProps> = ({ exercises, onExerciseClick }) => {
    return (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
            {exercises.map((exercise, index) => (
                <Grid
                    key={exercise._id}
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                >
                    <Fade in timeout={300 + index * 50}>
                        <Box>
                            <ExerciseCard
                                exercise={exercise}
                                onClick={() => onExerciseClick(exercise)}
                                variant="standard"
                                showStats={true}
                                showVideo={true}
                            />
                        </Box>
                    </Fade>
                </Grid>
            ))}
        </Grid>
    );
};

// ================================
// 📋 List View Component - Using ExerciseCard
// ================================
const ExerciseListView: React.FC<ViewProps> = ({ exercises, onExerciseClick }) => {
    return (
        <Stack spacing={2}>
            {exercises.map((exercise, index) => (
                <Fade key={exercise._id} in timeout={300 + index * 50}>
                    <Box>
                        <ExerciseCard
                            exercise={exercise}
                            onClick={() => onExerciseClick(exercise)}
                            variant="list"
                            showStats={true}
                            showVideo={true}
                        />
                    </Box>
                </Fade>
            ))}
        </Stack>
    );
};

export default ExerciseList;
