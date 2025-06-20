/**
 * � ExerciseList - Modern Grid & List View with Fitness Focus
 * React 19 implementation với Material UI design system
 */

import React, { useState, useTransition } from 'react';
import {
    Box,
    Grid,
    List as MuiList,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
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
// 📋 List View Component
// ================================
const ExerciseListView: React.FC<ViewProps> = ({ exercises, onExerciseClick }) => {
    const theme = useTheme();

    return (
        <MuiList sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.06)',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
            {exercises.map((exercise, index) => (
                <Fade key={exercise._id} in timeout={300 + index * 50}>
                    <ListItem
                        disablePadding
                        sx={{
                            borderBottom: index !== exercises.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none'
                        }}
                    >
                        <ListItemButton
                            onClick={() => onExerciseClick(exercise)}
                            sx={{
                                py: 2,
                                px: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                                    transform: 'translateX(8px)',
                                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)'
                                }
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    src={exercise.images?.[0]}
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        bgcolor: theme.palette.primary.main,
                                        border: '2px solid rgba(255,255,255,0.9)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }}
                                >
                                    <FitnessCenter />
                                </Avatar>
                            </ListItemAvatar>

                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                                            {exercise.name}
                                        </Typography>
                                        <Chip
                                            label={getDifficultyLabel(exercise.difficulty)}
                                            size="small"
                                            color={getDifficultyColor(exercise.difficulty)}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Box>
                                }
                                secondary={
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 1, lineHeight: 1.4 }}
                                        >
                                            {exercise.description?.substring(0, 100)}
                                            {exercise.description && exercise.description.length > 100 && '...'}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            {/* Category */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {getCategoryIcon(exercise.category)}
                                                <Typography variant="caption" color="text.secondary">
                                                    {getCategoryLabel(exercise.category)}
                                                </Typography>
                                            </Box>

                                            {/* Muscle Groups */}
                                            {exercise.primaryMuscleGroups && exercise.primaryMuscleGroups.length > 0 && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        🎯 {exercise.primaryMuscleGroups[0]}
                                                        {exercise.primaryMuscleGroups.length > 1 && ` +${exercise.primaryMuscleGroups.length - 1}`}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Intensity */}
                                            {exercise.averageIntensity && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <LocalFireDepartment sx={{ fontSize: 14, color: 'warning.main' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {exercise.averageIntensity}/10
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                }
                            />

                            <IconButton
                                sx={{
                                    ml: 2,
                                    bgcolor: theme.palette.primary.main,
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: theme.palette.primary.dark,
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <PlayArrow />
                            </IconButton>
                        </ListItemButton>
                    </ListItem>
                </Fade>
            ))}
        </MuiList>
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
            <MuiList sx={{ bgcolor: 'background.paper', borderRadius: 3 }}>
                {[...Array(6)].map((_, index) => (
                    <ListItem key={index} sx={{ py: 2 }}>
                        <ListItemAvatar>
                            <Skeleton variant="circular" width={56} height={56} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Skeleton variant="text" width="60%" height={28} />}
                            secondary={
                                <Box>
                                    <Skeleton variant="text" width="100%" height={20} />
                                    <Skeleton variant="text" width="80%" height={20} />
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </MuiList>
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

// ================================
// 🔧 Helper Functions
// ================================
const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' => {
    switch (difficulty) {
        case 'beginner': return 'success';
        case 'intermediate': return 'warning';
        case 'advanced': return 'error';
        default: return 'success';
    }
};

const getDifficultyLabel = (difficulty: string): string => {
    switch (difficulty) {
        case 'beginner': return 'Người mới';
        case 'intermediate': return 'Trung bình';
        case 'advanced': return 'Nâng cao';
        default: return 'Người mới';
    }
};

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'strength': return '💪';
        case 'cardio': return '❤️';
        case 'flexibility': return '🧘';
        default: return '🏋️';
    }
};

const getCategoryLabel = (category: string): string => {
    switch (category) {
        case 'strength': return 'Sức mạnh';
        case 'cardio': return 'Tim mạch';
        case 'flexibility': return 'Linh hoạt';
        default: return 'Khác';
    }
};

export default ExerciseList;
