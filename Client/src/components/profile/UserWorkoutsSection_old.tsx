import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    LinearProgress,
    CircularProgress
} from '@mui/material';
import {
    Whatshot as WhatshotIcon,
    Timer as TimerIcon,
    EmojiEvents as EmojiEventsIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { use, Suspense } from 'react';
import { Workout, User } from '../../types';

// Mock service - In a real app, this would be a real API call
const WorkoutService = {
    getUserWorkouts: (userId: string): Promise<Workout[]> => {
        // Simulated API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    // This would be actual workout data from the API
                    {
                        id: '1',
                        name: 'Full Body Workout',
                        duration: 45,
                        caloriesBurned: 320,
                        averageRating: 4.5,
                        totalRatings: 12,
                        // Add other required properties with default values
                    } as unknown as Workout,
                    {
                        id: '2',
                        name: 'Cardio Rush',
                        duration: 30,
                        caloriesBurned: 280,
                        averageRating: 4.2,
                        totalRatings: 8,
                        // Add other required properties with default values
                    } as unknown as Workout
                ]);
            }, 1000);
        });
    },

    getWorkoutStats: (userId: string): Promise<WorkoutStats> => {
        // Simulated API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    totalWorkouts: 24,
                    totalDuration: 1080, // minutes
                    totalCaloriesBurned: 7500,
                    completionRate: 0.85,
                    streakDays: 5,
                    favoriteWorkoutType: 'STRENGTH',
                    monthlyProgress: 0.65,
                    workoutsThisMonth: 8,
                    monthlyGoal: 12
                });
            }, 800);
        });
    }
};

interface WorkoutStats {
    totalWorkouts: number;
    totalDuration: number; // minutes
    totalCaloriesBurned: number;
    completionRate: number; // 0 to 1
    streakDays: number;
    favoriteWorkoutType: string;
    monthlyProgress: number; // 0 to 1
    workoutsThisMonth: number;
    monthlyGoal: number;
}

interface UserWorkoutsSectionProps {
    user: User;
}

/**
 * Component hiển thị thông tin tập luyện của người dùng
 * Sử dụng React 19 patterns với Suspense và use() hook
 */
function UserWorkoutsSection({ user }: UserWorkoutsSectionProps) {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Thống kê tập luyện</Typography>
                </Box>

                <Suspense fallback={<Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>}>
                    <WorkoutStatsContent userId={user.id} />
                </Suspense>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>Bài tập gần đây</Typography>

                <Suspense fallback={<Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>}>
                    <RecentWorkouts userId={user.id} />
                </Suspense>
            </CardContent>
        </Card>
    );
};

/**
 * Component con hiển thị thống kê tập luyện
 * Sử dụng React 19 use() hook cho data fetching
 */
const WorkoutStatsContent: React.FC<{ userId: string }> = ({ userId }) => {
    // React 19: use hook thay thế useEffect + useState
    const stats = use(WorkoutService.getWorkoutStats(userId));

    return (
        <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Tổng số buổi tập
                    </Typography>
                    <Typography variant="h4" color="primary">
                        {stats.totalWorkouts}
                    </Typography>
                </Paper>
            </Grid>

            <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Tổng thời gian
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <TimerIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h4">
                            {Math.floor(stats.totalDuration / 60)}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1, pt: 1 }}>giờ</Typography>
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Calo đã đốt
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <WhatshotIcon color="error" sx={{ mr: 1 }} />
                        <Typography variant="h4">
                            {stats.totalCaloriesBurned.toLocaleString()}
                        </Typography>
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Số ngày liên tiếp
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <EmojiEventsIcon color="warning" sx={{ mr: 1 }} />
                        <Typography variant="h4">
                            {stats.streakDays}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1, pt: 1 }}>ngày</Typography>
                    </Box>
                </Paper>
            </Grid>

            {/* Monthly Progress */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Tiến độ tháng này
                    </Typography>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2">
                            {stats.workoutsThisMonth} / {stats.monthlyGoal} buổi tập
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 'auto' }}>
                            {Math.round(stats.monthlyProgress * 100)}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={stats.monthlyProgress * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </Paper>
            </Grid>

            {/* Favorite Workout Type */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Loại bài tập yêu thích
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <TrendingUpIcon color="primary" sx={{ mr: 2 }} />
                        <Chip
                            label={stats.favoriteWorkoutType}
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                        />
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                            Tỷ lệ hoàn thành: {Math.round(stats.completionRate * 100)}%
                        </Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

/**
 * Component con hiển thị các bài tập gần đây
 * Sử dụng React 19 use() hook cho data fetching
 */
const RecentWorkouts: React.FC<{ userId: string }> = ({ userId }) => {
    // React 19: use hook thay thế useEffect + useState
    const workouts = use(WorkoutService.getUserWorkouts(userId));

    if (workouts.length === 0) {
        return (
            <Typography align="center" color="textSecondary" py={3}>
                Chưa có bài tập nào được ghi nhận.
            </Typography>
        );
    }

    return (
        <List>
            {workouts.map((workout, index) => (
                <React.Fragment key={workout.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem alignItems="flex-start">
                        <ListItemText
                            primary={workout.name}
                            secondary={
                                <React.Fragment>
                                    <Box display="flex" alignItems="center" mt={1} flexWrap="wrap" gap={1}>
                                        <Chip
                                            size="small"
                                            icon={<TimerIcon />}
                                            label={`${workout.duration} phút`}
                                        />
                                        <Chip
                                            size="small"
                                            icon={<WhatshotIcon />}
                                            label={`${workout.caloriesBurned} calo`}
                                        />
                                        <Box display="flex" alignItems="center" ml={1}>
                                            <Typography variant="body2" color="textSecondary">
                                                {workout.averageRating}⭐ ({workout.totalRatings})
                                            </Typography>
                                        </Box>
                                    </Box>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                </React.Fragment>
            ))}
        </List>
    );
};

export default UserWorkoutsSection;
