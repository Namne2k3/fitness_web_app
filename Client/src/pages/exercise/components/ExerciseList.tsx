/**
 * � ExerciseList - Modern Grid & List View with Fitness Focus
 * React 19 implementation với Material UI design system
 */

import React, { useState, useTransition } from 'react';
import {
    Box,
    Grid,
    Avatar,
    Typography,
    Card,
    CardContent,
    Chip,
    IconButton,
    Tooltip,
    Fade,
    Skeleton,
    Alert,
    Button,
    Stack,
    Paper,
    useTheme,
    CircularProgress
} from '@mui/material';
import {
    GridView,
    ViewList,
    FitnessCenter,
    LocalFireDepartment,
    Refresh,
    PlayArrow
} from '@mui/icons-material';
import { useExercises } from '../../../hooks/useExercises';
import { ExerciseListParams } from '../../../services/exerciseService';
import { Exercise } from '../../../types';
import ExerciseCard from './ExerciseCard';
import { getCategoryIcon, getDifficultyLabel, getDifficultyColor, getCategoryLabel } from '../helpers';

interface ExerciseListProps {
    params: ExerciseListParams;
    onExerciseClick: (exercise: Exercise) => void;
    viewMode?: 'grid' | 'list';
}

const ExerciseList = ({ params, onExerciseClick, viewMode = 'grid' }: ExerciseListProps) => {
    const theme = useTheme();
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

    // No data state
    if (!exerciseData || exerciseData.data.length === 0) {
        return (
            <Box sx={{
                textAlign: 'center',
                py: 8,
                px: 3,
                color: 'text.secondary',
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.02) 0%, rgba(255, 152, 0, 0.02) 100%)',
                borderRadius: 4,
                border: '1px solid rgba(0,0,0,0.06)',
                mt: 3
            }}>
                <FitnessCenter sx={{
                    fontSize: { xs: 48, sm: 64 },
                    mb: 3,
                    opacity: 0.3,
                    color: theme.palette.primary.main
                }} />
                <Typography variant="h4" gutterBottom sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                }}>
                    Không tìm thấy bài tập nào
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm thấy bài tập phù hợp.
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={() => refetch()}
                    sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(135deg, #1976d2 0%, #ff9800 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #1565c0 0%, #f57c00 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)'
                        }
                    }}
                >
                    Tải lại
                </Button>
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
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2
            }}>
                {/* Results Summary */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {exerciseData.pagination?.totalItems || exerciseData.data.length} bài tập
                    </Typography>
                    {exerciseData.pagination && (
                        <Chip
                            label={`Trang ${exerciseData.pagination.currentPage}/${exerciseData.pagination.totalPages}`}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        />
                    )}
                </Box>

                {/* View Mode Toggle */}
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Dạng lưới">
                        <IconButton
                            onClick={() => handleViewModeChange('grid')}
                            disabled={isPending}
                            sx={{
                                bgcolor: internalViewMode === 'grid' ? theme.palette.primary.main : 'transparent',
                                color: internalViewMode === 'grid' ? 'white' : theme.palette.text.secondary,
                                border: '1px solid',
                                borderColor: internalViewMode === 'grid' ? theme.palette.primary.main : 'rgba(0,0,0,0.1)',
                                '&:hover': {
                                    bgcolor: internalViewMode === 'grid' ? theme.palette.primary.dark : theme.palette.action.hover,
                                }
                            }}
                        >
                            <GridView />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Dạng danh sách">
                        <IconButton
                            onClick={() => handleViewModeChange('list')}
                            disabled={isPending}
                            sx={{
                                bgcolor: internalViewMode === 'list' ? theme.palette.primary.main : 'transparent',
                                color: internalViewMode === 'list' ? 'white' : theme.palette.text.secondary,
                                border: '1px solid',
                                borderColor: internalViewMode === 'list' ? theme.palette.primary.main : 'rgba(0,0,0,0.1)',
                                '&:hover': {
                                    bgcolor: internalViewMode === 'list' ? theme.palette.primary.dark : theme.palette.action.hover,
                                }
                            }}
                        >
                            <ViewList />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {/* Exercise Content */}
            {internalViewMode === 'grid' ? (
                <ExerciseGridView exercises={exerciseData.data} onExerciseClick={onExerciseClick} />
            ) : (
                <ExerciseListView exercises={exerciseData.data} onExerciseClick={onExerciseClick} />
            )}

            {/* Background Loading Indicator */}
            {isFetching && !isLoading && (
                <Box sx={{
                    position: 'fixed',
                    top: 16,
                    right: 16,
                    zIndex: 1000
                }}>
                    <Chip
                        icon={<CircularProgress size={16} color="inherit" />}
                        label="Đang cập nhật..."
                        color="primary"
                        variant="filled"
                        sx={{
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
                        }}
                    />
                </Box>
            )}
        </Box>
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
// 📋 List View Component - Enhanced Beautiful Design
// ================================
const ExerciseListView: React.FC<ViewProps> = ({ exercises, onExerciseClick }) => {
    const theme = useTheme();

    return (
        <Stack spacing={2}>
            {exercises.map((exercise, index) => (
                <Fade key={exercise._id} in timeout={300 + index * 50}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                            border: '1px solid rgba(0,0,0,0.04)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                                '& .exercise-image': {
                                    transform: 'scale(1.05)',
                                },
                                '& .exercise-overlay': {
                                    opacity: 1,
                                },
                                '& .action-button': {
                                    transform: 'scale(1.1)',
                                    bgcolor: theme.palette.primary.dark,
                                }
                            }
                        }}
                        onClick={() => onExerciseClick(exercise)}
                    >
                        {/* Gradient Overlay */}
                        <Box
                            className="exercise-overlay"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.02) 0%, rgba(255, 152, 0, 0.02) 100%)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                                zIndex: 1,
                            }}
                        />

                        <Box sx={{ display: 'flex', p: 3, alignItems: 'center', gap: 3, position: 'relative', zIndex: 2 }}>                            {/* Exercise Image/Avatar */}
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={exercise.images?.[0]}
                                    className="exercise-image"
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: '3px solid rgba(255,255,255,0.9)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                        transition: 'all 0.3s ease',
                                        '& .MuiAvatar-img': {
                                            borderRadius: '50%',
                                        }
                                    }}
                                >
                                    <FitnessCenter sx={{ fontSize: 32, color: 'white' }} />
                                </Avatar>

                                {/* Category Badge - Moved to avatar overlay */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -8,
                                        left: -8,
                                        bgcolor: 'rgba(255, 152, 0, 0.9)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 32,
                                        height: 32,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1rem',
                                        border: '2px solid white',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    {getCategoryIcon(exercise.category)}
                                </Box>
                            </Box>

                            {/* Exercise Details */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                {/* Title Row */}
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                            color: 'text.primary',
                                            lineHeight: 1.3,
                                            flex: 1,
                                            minWidth: 0,
                                            mr: 2
                                        }}
                                    >
                                        {exercise.name}
                                    </Typography>

                                    {/* Difficulty Badge - Moved to top right */}
                                    <Chip
                                        label={getDifficultyLabel(exercise.difficulty)}
                                        size="small"
                                        color={getDifficultyColor(exercise.difficulty)}
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '0.7rem',
                                            height: 24,
                                            '& .MuiChip-label': {
                                                px: 1.5,
                                            }
                                        }}
                                    />
                                </Box>

                                {/* Category Label Row */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'warning.main',
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            bgcolor: 'rgba(255, 152, 0, 0.1)',
                                            px: 1,
                                            py: 0.25,
                                            borderRadius: 1,
                                            border: '1px solid rgba(255, 152, 0, 0.2)'
                                        }}
                                    >
                                        {getCategoryLabel(exercise.category)}
                                    </Typography>
                                </Box>

                                {/* Description */}
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 2,
                                        lineHeight: 1.5,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {exercise.description || 'No description available'}
                                </Typography>

                                {/* Metrics Row */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    {/* Muscle Groups */}
                                    {exercise.primaryMuscleGroups && exercise.primaryMuscleGroups.length > 0 && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                bgcolor: 'rgba(25, 118, 210, 0.08)',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 2,
                                                border: '1px solid rgba(25, 118, 210, 0.12)'
                                            }}
                                        >
                                            <Box sx={{ fontSize: '0.75rem' }}>🎯</Box>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'primary.main',
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {exercise.primaryMuscleGroups[0]}
                                                {exercise.primaryMuscleGroups.length > 1 && ` +${exercise.primaryMuscleGroups.length - 1}`}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Intensity */}
                                    {exercise.averageIntensity && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                bgcolor: 'rgba(255, 152, 0, 0.08)',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 2,
                                                border: '1px solid rgba(255, 152, 0, 0.12)'
                                            }}
                                        >
                                            <LocalFireDepartment sx={{ fontSize: 14, color: 'warning.main' }} />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'warning.main',
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {exercise.averageIntensity}/10
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Equipment */}
                                    {exercise.equipment && exercise.equipment.length > 0 && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                bgcolor: 'rgba(76, 175, 80, 0.08)',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 2,
                                                border: '1px solid rgba(76, 175, 80, 0.12)'
                                            }}
                                        >
                                            <Box sx={{ fontSize: '0.75rem' }}>🏋️</Box>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'success.main',
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {exercise.equipment[0]}
                                                {exercise.equipment.length > 1 && ` +${exercise.equipment.length - 1}`}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            {/* Action Button */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                    className="action-button"
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        bgcolor: theme.palette.primary.main,
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.dark,
                                            transform: 'scale(1.1)',
                                            boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                                        }
                                    }}
                                >
                                    <PlayArrow sx={{ fontSize: 24 }} />
                                </IconButton>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                        fontSize: '0.7rem'
                                    }}
                                >
                                    Start
                                </Typography>
                            </Box>
                        </Box>

                        {/* Progress Bar Accent */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 3,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                opacity: 0.6,
                            }}
                        />
                    </Paper>
                </Fade>
            ))}
        </Stack>
    );
};

// ================================
// 💀 Loading Skeleton
// ================================
interface SkeletonProps {
    viewMode: 'grid' | 'list';
}

const ExerciseListSkeleton: React.FC<SkeletonProps> = ({ viewMode }) => {
    if (viewMode === 'list') {
        return (
            <Stack spacing={2}>
                {[...Array(6)].map((_, index) => (
                    <Paper
                        key={index}
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                            border: '1px solid rgba(0,0,0,0.04)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Skeleton variant="circular" width={80} height={80} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 2 }} />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Skeleton variant="rounded" width={80} height={24} />
                                    <Skeleton variant="rounded" width={60} height={24} />
                                    <Skeleton variant="rounded" width={70} height={24} />
                                </Box>
                            </Box>
                            <Skeleton variant="circular" width={48} height={48} />
                        </Box>
                    </Paper>
                ))}
            </Stack>
        );
    }

    return (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
            {[...Array(8)].map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card sx={{ borderRadius: 3 }}>
                        <Skeleton variant="rectangular" height={200} />
                        <CardContent>
                            <Skeleton variant="text" width="80%" height={32} />
                            <Skeleton variant="text" width="100%" height={20} />
                            <Skeleton variant="text" width="60%" height={20} />
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};


export default ExerciseList;
