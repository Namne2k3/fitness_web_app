/**
 * 🏋️ My Workout Page
 * Dashboard cho workout cá nhân với stats, filtering và actions
 * Sử dụng React 19 patterns và Material Design
 */

import {
    Add as AddIcon,
    BookmarkBorder as BookmarkBorderIcon,
    Bookmark as BookmarkIcon,
    Delete as DeleteIcon,
    ContentCopy as DuplicateIcon,
    Edit as EditIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Favorite as FavoriteIcon,
    PlayArrow as PlayIcon,
    Timer as TimerIcon,
    TrendingUp as TrendingIcon,
    FitnessCenter as WorkoutIcon,
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    Paper,
    Skeleton,
    Typography
} from '@mui/material';
import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMyWorkouts, useMyWorkoutStats, useWorkoutLikeSave } from '../../hooks/useMyWorkout';
import { DIFFICULTY_CONFIG, MyWorkoutService, WORKOUT_CATEGORY_CONFIG } from '../../services/myWorkoutService';
import { Workout } from '../../types/workout.interface';

// ================================
// 🎨 Component Styles
// ================================
const statsCardStyle = {
    p: 3,
    borderRadius: 3,
    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    color: 'white',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(25,118,210,0.3)'
    }
};

const workoutCardStyle = {
    height: '100%',
    transition: 'all 0.3s ease',
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'grey.100',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
        borderColor: 'primary.light'
    }
};

// ================================
// 📊 Stats Cards Component
// ================================
function StatsCards() {
    const { stats, loading, error } = useMyWorkoutStats();

    if (loading) {
        return (
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[1, 2, 3, 4].map((i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 4 }}>
                {error.message || 'Không thể tải thống kê bài tập'}
            </Alert>
        );
    }

    if (!stats) return null;

    const statsData = [
        {
            title: 'Tổng bài tập',
            value: stats.totalWorkouts,
            icon: <WorkoutIcon />,
            gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
        },
        {
            title: 'Thời gian tập',
            value: stats.totalExerciseTime,
            icon: <TimerIcon />,
            gradient: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
        },
        {
            title: 'Lượt thích',
            value: stats.totalLikes,
            icon: <FavoriteIcon />,
            gradient: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)'
        },
        {
            title: 'Điểm trung bình',
            value: stats.averageRating.toFixed(1),
            icon: <TrendingIcon />,
            gradient: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)'
        }
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsData.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                        sx={{
                            ...statsCardStyle,
                            background: stat.gradient
                        }}
                    >
                        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h3" sx={{
                                        fontWeight: 'bold',
                                        mb: 1,
                                        color: 'white'
                                    }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        opacity: 0.9,
                                        color: 'white'
                                    }}>
                                        {stat.title}
                                    </Typography>
                                </Box>
                                <Avatar sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    width: 56,
                                    height: 56
                                }}>
                                    {stat.icon}
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

// ================================
// 🏋️ Workout Card Component
// ================================
interface WorkoutCardProps {
    workout: Workout;
    onStart: (workoutId: string) => void;
    onEdit: (workoutId: string) => void;
    onDelete: (workoutId: string) => void;
    onDuplicate: (workoutId: string) => void;
}

function WorkoutCard({ workout, onStart, onEdit, onDelete, onDuplicate }: WorkoutCardProps) {
    const navigate = useNavigate();

    // Hook để manage like/save với optimistic updates
    const { optimisticState, toggleLike, toggleSave, isPending } = useWorkoutLikeSave(
        workout._id,
        {
            likes: workout.likes || [],
            saves: workout.saves || [],
            likeCount: workout.likeCount || 0,
            saveCount: workout.saveCount || 0
        }
    );

    const categoryConfig = WORKOUT_CATEGORY_CONFIG[workout.category as keyof typeof WORKOUT_CATEGORY_CONFIG];
    const difficultyConfig = DIFFICULTY_CONFIG[workout.difficulty];

    return (
        <Card sx={workoutCardStyle}>
            <CardContent sx={{ p: 3 }}>
                {/* Header với category và difficulty */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
                            {categoryConfig?.icon} {workout.name}
                        </Typography>
                    </Box>
                    <Chip
                        label={difficultyConfig?.label}
                        size="small"
                        sx={{
                            bgcolor: difficultyConfig?.color,
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                </Box>

                {/* Description */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, minHeight: 40 }}
                >
                    {workout.description || 'Không có mô tả'}
                </Typography>

                {/* Metadata */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Chip
                        icon={<TimerIcon />}
                        label={`${workout.estimatedDuration || 0} phút`}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        icon={<WorkoutIcon />}
                        label={`${workout.exercises?.length || 0} bài tập`}
                        size="small"
                        variant="outlined"
                    />
                </Box>

                {/* Tags */}
                <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                    {workout.tags?.slice(0, 3).map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                        />
                    ))}
                    {(workout.tags?.length || 0) > 3 && (
                        <Chip
                            label={`+${(workout.tags?.length || 0) - 3}`}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                        />
                    )}
                </Box>

                {/* Progress bar nếu có completed workouts */}
                {/* {workout.completedSessions && workout.completedSessions > 0 && (
                    <Box mb={2}>
                        <Typography variant="caption" color="text.secondary">
                            Đã hoàn thành {workout.completedSessions} lần
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min((workout.completedSessions / 10) * 100, 100)}
                            sx={{ mt: 0.5, borderRadius: 1 }}
                        />
                    </Box>
                )} */}
            </CardContent>

            <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                    {/* Social Actions */}
                    <Box display="flex" alignItems="center">
                        <IconButton
                            size="small"
                            onClick={() => toggleLike('current-user-id')} // TODO: Get actual user ID
                            disabled={isPending}
                            sx={{
                                color: optimisticState.likes.includes('current-user-id')
                                    ? 'error.main'
                                    : 'text.secondary'
                            }}
                        >
                            {optimisticState.likes.includes('current-user-id')
                                ? <FavoriteIcon />
                                : <FavoriteBorderIcon />
                            }
                        </IconButton>
                        <Typography variant="caption" sx={{ mr: 1 }}>
                            {optimisticState.likeCount}
                        </Typography>

                        <IconButton
                            size="small"
                            onClick={() => toggleSave('current-user-id')} // TODO: Get actual user ID
                            disabled={isPending}
                            sx={{
                                color: optimisticState.saves.includes('current-user-id')
                                    ? 'primary.main'
                                    : 'text.secondary'
                            }}
                        >
                            {optimisticState.saves.includes('current-user-id')
                                ? <BookmarkIcon />
                                : <BookmarkBorderIcon />
                            }
                        </IconButton>
                        <Typography variant="caption" sx={{ mr: 1 }}>
                            {optimisticState.saveCount}
                        </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box display="flex" gap={1}>
                        <Button
                            variant="contained"
                            startIcon={<PlayIcon />}
                            size="small"
                            onClick={() => onStart(workout._id)}
                            sx={{ borderRadius: 2 }}
                        >
                            Bắt đầu
                        </Button>

                        <IconButton
                            size="small"
                            onClick={() => onEdit(workout._id)}
                        >
                            <EditIcon />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={() => onDuplicate(workout._id)}
                        >
                            <DuplicateIcon />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={() => onDelete(workout._id)}
                            sx={{ color: 'error.main' }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            </CardActions>
        </Card>
    );
}

// ================================
// 🏠 Main MyWorkout Page Component
// ================================
export default function MyWorkoutPage() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({ page: 1, limit: 12 });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

    // Fetch workouts với filtering
    const { data, loading, error, refetch } = useMyWorkouts(filters);

    // Handle actions
    const handleStartWorkout = (workoutId: string) => {
        navigate(`/app/workout/${workoutId}/start`);
    };

    const handleEditWorkout = (workoutId: string) => {
        navigate(`/app/workout/${workoutId}/edit`);
    };

    const handleDeleteWorkout = (workoutId: string) => {
        setSelectedWorkoutId(workoutId);
        setDeleteDialogOpen(true);
    };

    const handleDuplicateWorkout = async (workoutId: string) => {
        try {
            await MyWorkoutService.duplicateWorkout(workoutId);
            refetch(); // Refresh list
        } catch (error) {
            console.error('Error duplicating workout:', error);
        }
    };

    const confirmDelete = async () => {
        if (!selectedWorkoutId) return;

        try {
            await MyWorkoutService.deleteWorkout(selectedWorkoutId);
            setDeleteDialogOpen(false);
            setSelectedWorkoutId(null);
            refetch(); // Refresh list
        } catch (error) {
            console.error('Error deleting workout:', error);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                <Box>
                    <Typography variant="h3" component="h1" sx={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        🏋️ Bài tập của tôi
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Quản lý và theo dõi các bài tập cá nhân
                    </Typography>
                </Box>

                <Fab
                    color="primary"
                    aria-label="add workout"
                    onClick={() => navigate('/app/workout/create')}
                    sx={{
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1565c0, #1976d2)'
                        }
                    }}
                >
                    <AddIcon />
                </Fab>
            </Box>

            {/* Stats Cards */}
            <Suspense fallback={
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>
            }>
                <StatsCards />
            </Suspense>

            {/* Error State */}
            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error.message || 'Không thể tải bài tập của bạn'}
                </Alert>
            )}

            {/* Loading State */}
            {loading && (
                <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Workouts Grid */}
            {data && !loading && (
                <Grid container spacing={3}>
                    {data.data.map((workout) => (
                        <Grid item xs={12} sm={6} md={4} key={workout._id}>
                            <WorkoutCard
                                workout={workout}
                                onStart={handleStartWorkout}
                                onEdit={handleEditWorkout}
                                onDelete={handleDeleteWorkout}
                                onDuplicate={handleDuplicateWorkout}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Empty State */}
            {data && data.data.length === 0 && !loading && (
                <Paper
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
                    }}
                >
                    <WorkoutIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Chưa có bài tập nào
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Tạo bài tập đầu tiên để bắt đầu hành trình fitness của bạn!
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/app/workout/create')}
                        sx={{ borderRadius: 2 }}
                    >
                        Tạo bài tập mới
                    </Button>
                </Paper>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Xóa bài tập</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa bài tập này? Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}