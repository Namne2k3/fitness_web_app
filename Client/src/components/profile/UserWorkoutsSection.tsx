import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Divider,
    CircularProgress
} from '@mui/material';
import { use, Suspense } from 'react';
import { User } from '../../types';

// Define interfaces for our mock data
interface WorkoutStats {
    totalWorkouts: number;
    totalDuration: number;
    caloriesBurned: number;
    completionRate: number;
    streakDays: number;
}

interface SimpleWorkout {
    id: string;
    name: string;
    duration: number;
    caloriesBurned: number;
}

// Typed mock service
const WorkoutService = {
    getUserStats: (_userId: string): Promise<WorkoutStats> => {
        // Using underscore to indicate intentionally unused parameter
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    totalWorkouts: 24,
                    totalDuration: 1080,
                    caloriesBurned: 7500,
                    completionRate: 0.85,
                    streakDays: 5
                });
            }, 800);
        });
    },

    getRecentWorkouts: (_userId: string): Promise<SimpleWorkout[]> => {
        // Using underscore to indicate intentionally unused parameter
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: '1', name: 'Full Body Workout', duration: 45, caloriesBurned: 320 },
                    { id: '2', name: 'Cardio Rush', duration: 30, caloriesBurned: 280 }
                ]);
            }, 1000);
        });
    }
};

interface UserWorkoutsSectionProps {
    user?: User;
    userId?: string;
}

/**
 * Component hiển thị thông tin tập luyện của người dùng
 * Sử dụng React 19 patterns với Suspense và use() hook
 */
function UserWorkoutsSection({ user, userId: propUserId }: UserWorkoutsSectionProps) {
    // Get userId from user or use provided userId directly
    const userId = propUserId || user?.id;

    console.log("UserWorkoutsSection rendered with userId:", userId);

    if (!userId) {
        return (
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography color="error">
                        Missing user ID for workout data
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                    Thống kê tập luyện
                </Typography>

                <Suspense fallback={<Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>}>
                    <WorkoutStatsContent userId={userId} />
                </Suspense>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>Bài tập gần đây</Typography>

                <Suspense fallback={<Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>}>
                    <RecentWorkouts userId={userId} />
                </Suspense>
            </CardContent>
        </Card>
    );
}

/**
 * Component con hiển thị thống kê tập luyện
 */
const WorkoutStatsContent = ({ userId }: { userId: string }) => {
    const stats = use(WorkoutService.getUserStats(userId)) as WorkoutStats;

    return (
        <Box>
            <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                <StatsCard label="Tổng số buổi tập" value={stats.totalWorkouts.toString()} />
                <StatsCard label="Tổng thời gian (giờ)" value={Math.floor(stats.totalDuration / 60).toString()} />
                <StatsCard label="Calo đã đốt" value={stats.caloriesBurned.toLocaleString()} />
                <StatsCard label="Số ngày liên tiếp" value={stats.streakDays.toString()} />
            </Box>

            <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                    Tỷ lệ hoàn thành: {Math.round(stats.completionRate * 100)}%
                </Typography>
                <Box
                    sx={{
                        height: 8,
                        width: '100%',
                        bgcolor: 'grey.300',
                        borderRadius: 4,
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            height: '100%',
                            width: `${stats.completionRate * 100}%`,
                            bgcolor: 'primary.main',
                            borderRadius: 4
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

// Simple stats card component to avoid Grid issues
const StatsCard = ({ label, value }: { label: string, value: string }) => {
    return (
        <Box
            sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1,
                textAlign: 'center',
                minWidth: 140
            }}
        >
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                {label}
            </Typography>
            <Typography variant="h5" color="primary">
                {value}
            </Typography>
        </Box>
    );
};

/**
 * Component con hiển thị các bài tập gần đây
 */
const RecentWorkouts = ({ userId }: { userId: string }) => {
    const workouts = use(WorkoutService.getRecentWorkouts(userId)) as SimpleWorkout[];

    if (workouts.length === 0) {
        return (
            <Typography align="center" color="textSecondary" py={3}>
                Chưa có bài tập nào được ghi nhận.
            </Typography>
        );
    }

    return (
        <Box>
            {workouts.map((workout: SimpleWorkout, index: number) => (
                <React.Fragment key={workout.id}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}
                    <Box py={1}>
                        <Typography variant="subtitle1">{workout.name}</Typography>
                        <Box display="flex" gap={2} mt={1}>
                            <Typography variant="body2" color="textSecondary">
                                Thời gian: {workout.duration} phút
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Calo: {workout.caloriesBurned}
                            </Typography>
                        </Box>
                    </Box>
                </React.Fragment>
            ))}
        </Box>
    );
};

export default UserWorkoutsSection;
