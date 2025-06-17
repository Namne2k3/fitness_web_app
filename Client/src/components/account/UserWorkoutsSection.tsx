import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Paper,
    Avatar,
    Chip,
    Button,
    LinearProgress,
    IconButton,
    Tooltip,
    Badge
} from '@mui/material';
import {
    FitnessCenter,
    Timer,
    LocalFireDepartment,
    TrendingUp,
    StarRate,
    FavoriteRounded,
    Share,
    PlayArrow,
    MoreVert,
    EmojiEvents,
    Whatshot,
    Speed,
    VerifiedUser
} from '@mui/icons-material';
import { Workout, DifficultyLevel, WorkoutCategory } from '../../types/workout.interface';

// Enhanced interfaces based on workout types
interface WorkoutStats {
    totalWorkouts: number;
    totalDuration: number; // minutes
    caloriesBurned: number;
    completionRate: number;
    streakDays: number;
    averageRating: number;
    totalLikes: number;
    currentWeekWorkouts: number;
    personalRecord: {
        longestWorkout: number;
        mostCalories: number;
        bestStreak: number;
    };
}

interface EnhancedWorkout extends Omit<Workout, 'id'> {
    id: string;
    thumbnail?: string;
    isCompleted: boolean;
    completedAt?: Date;
    userRating?: number;
    isLiked: boolean;
    progress?: number; // 0-100
}

// Color-coded card themes according to design instructions
const cardThemes = {
    stats: {
        background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        border: '1px solid rgba(76, 175, 80, 0.2)',
        iconColor: '#4caf50',
        textColor: '#388e3c',
        accentColor: '#2e7d32'
    },
    workouts: {
        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
        border: '1px solid rgba(255, 152, 0, 0.2)',
        iconColor: '#ff9800',
        textColor: '#f57c00',
        accentColor: '#ef6c00'
    },
    achievements: {
        background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
        border: '1px solid rgba(156, 39, 176, 0.2)',
        iconColor: '#9c27b0',
        textColor: '#7b1fa2',
        accentColor: '#6a1b9a'
    },
    progress: {
        background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
        border: '1px solid rgba(233, 30, 99, 0.2)',
        iconColor: '#e91e63',
        textColor: '#c2185b',
        accentColor: '#ad1457'
    }
};

// Enhanced mock service with comprehensive data - ✅ REACT 19 COMPATIBLE
const WorkoutService = {
    // Cache for better performance
    _statsCache: null as WorkoutStats | null,
    _workoutsCache: null as EnhancedWorkout[] | null,

    getUserStats: async (): Promise<WorkoutStats> => {
        // Simulate API call with cache
        if (WorkoutService._statsCache) {
            return Promise.resolve(WorkoutService._statsCache);
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                const stats = {
                    totalWorkouts: 47,
                    totalDuration: 2340, // 39 hours
                    caloriesBurned: 12750,
                    completionRate: 0.89,
                    streakDays: 12,
                    averageRating: 4.6,
                    totalLikes: 234,
                    currentWeekWorkouts: 5,
                    personalRecord: {
                        longestWorkout: 90,
                        mostCalories: 650,
                        bestStreak: 21
                    }
                };
                WorkoutService._statsCache = stats;
                resolve(stats);
            }, 500); // Reduced timeout for better UX
        });
    },

    getRecentWorkouts: async (): Promise<EnhancedWorkout[]> => {
        // Simulate API call with cache
        if (WorkoutService._workoutsCache) {
            return Promise.resolve(WorkoutService._workoutsCache);
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                const workouts = [
                    {
                        id: '1',
                        userId: 'current-user',
                        name: 'Full Body Strength Training',
                        description: 'Comprehensive strength workout targeting all major muscle groups with progressive overload',
                        exercises: [],
                        duration: 45,
                        difficulty: DifficultyLevel.INTERMEDIATE,
                        tags: ['strength', 'full-body', 'weights'],
                        category: WorkoutCategory.STRENGTH,
                        caloriesBurned: 320,
                        isPublic: true,
                        isSponsored: false,
                        ratings: [],
                        averageRating: 4.8,
                        totalRatings: 23,
                        createdAt: new Date('2024-01-15'),
                        updatedAt: new Date('2024-01-15'),
                        thumbnail: 'https://via.placeholder.com/300x200/4caf50/ffffff?text=Strength',
                        isCompleted: true,
                        completedAt: new Date('2024-01-20'),
                        userRating: 5,
                        isLiked: true,
                        progress: 100
                    },
                    {
                        id: '2',
                        userId: 'current-user',
                        name: 'HIIT Cardio Blast',
                        description: 'High-intensity interval training for maximum calorie burn and cardiovascular improvement',
                        exercises: [],
                        duration: 30,
                        difficulty: DifficultyLevel.ADVANCED,
                        tags: ['hiit', 'cardio', 'intense'],
                        category: WorkoutCategory.HIIT,
                        caloriesBurned: 380,
                        isPublic: true,
                        isSponsored: true,
                        ratings: [],
                        averageRating: 4.5,
                        totalRatings: 34,
                        createdAt: new Date('2024-01-18'),
                        updatedAt: new Date('2024-01-18'),
                        thumbnail: 'https://via.placeholder.com/300x200/ff9800/ffffff?text=HIIT+Cardio',
                        isCompleted: false,
                        userRating: 4,
                        isLiked: false,
                        progress: 65
                    },
                    {
                        id: '3',
                        userId: 'current-user',
                        name: 'Morning Yoga Flow',
                        description: 'Gentle yoga sequence to start your day with mindfulness and flexibility',
                        exercises: [],
                        duration: 25,
                        difficulty: DifficultyLevel.BEGINNER,
                        tags: ['yoga', 'flexibility', 'morning'],
                        category: WorkoutCategory.YOGA,
                        caloriesBurned: 150,
                        isPublic: true,
                        isSponsored: false,
                        ratings: [],
                        averageRating: 4.9,
                        totalRatings: 67,
                        createdAt: new Date('2024-01-19'),
                        updatedAt: new Date('2024-01-19'),
                        thumbnail: 'https://via.placeholder.com/300x200/9c27b0/ffffff?text=Yoga+Flow',
                        isCompleted: true,
                        completedAt: new Date('2024-01-20'),
                        userRating: 5,
                        isLiked: true,
                        progress: 100
                    },
                    {
                        id: '4',
                        userId: 'current-user',
                        name: 'Push Day Power',
                        description: 'Upper body push workout focusing on chest, shoulders, and triceps development',
                        exercises: [],
                        duration: 40,
                        difficulty: DifficultyLevel.INTERMEDIATE,
                        tags: ['push', 'upper-body', 'strength'],
                        category: WorkoutCategory.STRENGTH,
                        caloriesBurned: 280,
                        isPublic: false,
                        isSponsored: false,
                        ratings: [],
                        averageRating: 4.7,
                        totalRatings: 12,
                        createdAt: new Date('2024-01-22'),
                        updatedAt: new Date('2024-01-22'),
                        thumbnail: 'https://via.placeholder.com/300x200/2196f3/ffffff?text=Push+Day',
                        isCompleted: false,
                        userRating: 0,
                        isLiked: false,
                        progress: 0
                    }
                ];
                WorkoutService._workoutsCache = workouts;
                resolve(workouts);
            }, 700); // Reduced timeout
        });
    }
};

/**
 * Main component displaying user workouts with enhanced UI design
 * Uses token-based authentication instead of userId props
 */
function UserWorkoutsSection() {
    return (<Box sx={{ p: 3 }}>
        {/* Header Section with Enhanced Gradient */}
        <Paper
            elevation={8}
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 4,
                mb: 4,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, zIndex: 1 }}>
                <Avatar
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        width: 56,
                        height: 56,
                        border: '2px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                >
                    <FitnessCenter sx={{ color: 'white', fontSize: 32 }} />
                </Avatar>
                <Box>
                    <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                        Hành trình tập luyện
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 1 }}>
                        Theo dõi tiến độ và thành tích của bạn
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Chip
                            icon={<EmojiEvents />}
                            label="47 Workouts Completed"
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.15)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.3)',
                                fontWeight: 600
                            }}
                        />
                        <Chip
                            icon={<Whatshot />}
                            label="12 Day Streak"
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.15)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.3)',
                                fontWeight: 600
                            }}
                        />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ zIndex: 1 }}>
                <Chip
                    icon={<VerifiedUser />}
                    label="Premium Member"
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        height: 36,
                        '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.3)',
                            transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                />
            </Box>
        </Paper>{/* Stats Section */}
        <WorkoutStatsContent />

        {/* Recent Workouts Section */}
        <Paper
            elevation={0}
            sx={{
                mt: 4,
                p: 3,
                background: cardThemes.workouts.background,
                border: cardThemes.workouts.border,
                borderRadius: 3
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: cardThemes.workouts.iconColor, width: 40, height: 40 }}>
                        <PlayArrow />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600" color={cardThemes.workouts.textColor}>
                        Bài tập gần đây
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<TrendingUp />}
                    sx={{
                        borderColor: cardThemes.workouts.iconColor,
                        color: cardThemes.workouts.textColor,
                        '&:hover': {
                            borderColor: cardThemes.workouts.accentColor,
                            bgcolor: 'rgba(255, 152, 0, 0.1)'
                        }
                    }}
                >
                    Xem tất cả
                </Button>
            </Box>                <RecentWorkouts />
        </Paper>
    </Box>
    );
}

/**
 * Component displaying workout statistics with enhanced cards
 */
const WorkoutStatsContent = () => {
    const [stats, setStats] = useState<WorkoutStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await WorkoutService.getUserStats();
                setStats(data);
            } catch (error) {
                console.error('Error fetching workout stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading || !stats) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    const statCards = [
        {
            label: 'Tổng bài tập',
            value: stats.totalWorkouts.toString(),
            icon: FitnessCenter,
            theme: cardThemes.stats,
            subtitle: `${stats.currentWeekWorkouts} tuần này`
        },
        {
            label: 'Tổng thời gian',
            value: `${Math.floor(stats.totalDuration / 60)}h`,
            icon: Timer,
            theme: cardThemes.workouts,
            subtitle: `${stats.totalDuration % 60}m thêm`
        },
        {
            label: 'Calo đốt cháy',
            value: stats.caloriesBurned.toLocaleString(),
            icon: LocalFireDepartment,
            theme: cardThemes.progress,
            subtitle: 'kcal tổng cộng'
        },
        {
            label: 'Streak hiện tại',
            value: `${stats.streakDays} ngày`,
            icon: Whatshot,
            theme: cardThemes.achievements,
            subtitle: `Tốt nhất: ${stats.personalRecord.bestStreak} ngày`
        }
    ];

    return (
        <Box>
            {/* Stats Grid */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                    gap: 3,
                    mb: 4
                }}
            >
                {statCards.map((card, index) => (
                    <StatCard key={index} {...card} />
                ))}
            </Box>

            {/* Progress Section */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    background: cardThemes.stats.background,
                    border: cardThemes.stats.border,
                    borderRadius: 3
                }}
            >
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar sx={{ bgcolor: cardThemes.stats.iconColor, width: 32, height: 32 }}>
                        <TrendingUp sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600" color={cardThemes.stats.textColor}>
                        Tiến độ tập luyện
                    </Typography>
                </Box>

                <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom color={cardThemes.stats.textColor}>
                        Tỷ lệ hoàn thành: {Math.round(stats.completionRate * 100)}%
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={stats.completionRate * 100}
                        sx={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: 'rgba(76, 175, 80, 0.2)',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 6,
                                background: `linear-gradient(90deg, ${cardThemes.stats.iconColor}, ${cardThemes.stats.accentColor})`
                            }
                        }}
                    />
                </Box>

                {/* Achievement Badges */}
                <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                    <Chip
                        icon={<EmojiEvents />}
                        label={`⭐ ${stats.averageRating}/5.0 Rating`}
                        size="small"
                        sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: cardThemes.stats.textColor }}
                    />
                    <Chip
                        icon={<FavoriteRounded />}
                        label={`❤️ ${stats.totalLikes} Likes`}
                        size="small"
                        sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: cardThemes.stats.textColor }}
                    />
                    <Chip
                        icon={<Speed />}
                        label={`🔥 ${stats.personalRecord.mostCalories} kcal Max`}
                        size="small"
                        sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: cardThemes.stats.textColor }}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

/**
 * Individual stat card component with enhanced styling
 */
const StatCard = ({ label, value, icon: IconComponent, theme, subtitle }: {
    label: string;
    value: string;
    icon: React.ElementType;
    theme: typeof cardThemes.stats;
    subtitle: string;
}) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                background: theme.background,
                border: theme.border,
                borderRadius: 3,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.12)'
                }
            }}
        >
            <Avatar sx={{ bgcolor: theme.iconColor, width: 48, height: 48, mx: 'auto', mb: 2 }}>
                <IconComponent sx={{ color: 'white', fontSize: 24 }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.textColor, mb: 1 }}>
                {value}
            </Typography>
            <Typography variant="subtitle2" color={theme.textColor} gutterBottom>
                {label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {subtitle}
            </Typography>
        </Paper>
    );
};

/**
 * Component displaying recent workouts with enhanced cards
 */
const RecentWorkouts = () => {
    const [workouts, setWorkouts] = useState<EnhancedWorkout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const data = await WorkoutService.getRecentWorkouts();
                setWorkouts(data);
            } catch (error) {
                console.error('Error fetching recent workouts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkouts();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (workouts.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                    borderRadius: 3
                }}
            >
                <FitnessCenter sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Chưa có bài tập nào
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Bắt đầu hành trình tập luyện của bạn ngay hôm nay!
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }} startIcon={<PlayArrow />}>
                    Tạo bài tập đầu tiên
                </Button>
            </Paper>
        );
    }

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(300px, 1fr))' },
                gap: 3
            }}
        >
            {workouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
            ))}
        </Box>
    );
};

/**
 * Individual workout card with comprehensive information
 */
const WorkoutCard = ({ workout }: { workout: EnhancedWorkout }) => {
    const getDifficultyColor = (difficulty: DifficultyLevel) => {
        switch (difficulty) {
            case DifficultyLevel.BEGINNER:
                return '#4caf50';
            case DifficultyLevel.INTERMEDIATE:
                return '#ff9800';
            case DifficultyLevel.ADVANCED:
                return '#f44336';
            default:
                return '#757575';
        }
    };

    const getCategoryIcon = (category: WorkoutCategory) => {
        switch (category) {
            case WorkoutCategory.STRENGTH:
                return <FitnessCenter />;
            case WorkoutCategory.CARDIO:
                return <Speed />;
            case WorkoutCategory.HIIT:
                return <Whatshot />;
            case WorkoutCategory.YOGA:
                return <EmojiEvents />;
            default:
                return <FitnessCenter />;
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.08)',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderColor: 'primary.light'
                }
            }}
        >
            {/* Workout Thumbnail */}
            <Box
                sx={{
                    height: 160,
                    background: `url(${workout.thumbnail}) center/cover`,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-end',
                    p: 2
                }}
            >
                {/* Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        zIndex: 1
                    }}
                />

                {/* Status Badges */}
                <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                    {workout.isSponsored && (
                        <Chip
                            label="Sponsored"
                            size="small"
                            sx={{ bgcolor: 'warning.main', color: 'white', fontWeight: 600, mb: 1 }}
                        />
                    )}
                    {workout.isCompleted && (
                        <Chip
                            label="✓ Hoàn thành"
                            size="small"
                            sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 600 }}
                        />
                    )}
                </Box>

                {/* Category Icon */}
                <Avatar
                    sx={{
                        bgcolor: getDifficultyColor(workout.difficulty),
                        width: 40,
                        height: 40,
                        zIndex: 2
                    }}
                >
                    {getCategoryIcon(workout.category)}
                </Avatar>
            </Box>

            <CardContent sx={{ p: 3 }}>
                {/* Title and Rating */}
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, flex: 1, mr: 1 }}>
                        {workout.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <StarRate sx={{ color: '#ffc107', fontSize: 16 }} />
                        <Typography variant="caption" fontWeight="600">
                            {workout.averageRating}
                        </Typography>
                    </Box>
                </Box>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {workout.description}
                </Typography>

                {/* Stats Row */}
                <Box display="flex" alignItems="center" gap={3} mb={2}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption">{workout.duration}m</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <LocalFireDepartment sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption">{workout.caloriesBurned} kcal</Typography>
                    </Box>
                    <Chip
                        label={workout.difficulty}
                        size="small"
                        sx={{
                            bgcolor: getDifficultyColor(workout.difficulty),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.7rem'
                        }}
                    />
                </Box>

                {/* Progress Bar (if in progress) */}
                {workout.progress !== undefined && workout.progress < 100 && (
                    <Box mb={2}>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                            Tiến độ: {workout.progress}%
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={workout.progress}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 3
                                }
                            }}
                        />
                    </Box>
                )}

                {/* Tags */}
                <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                    {workout.tags.slice(0, 3).map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 24 }}
                        />
                    ))}
                </Box>

                {/* Action Buttons */}
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Button
                        variant={workout.isCompleted ? "outlined" : "contained"}
                        startIcon={workout.isCompleted ? <PlayArrow /> : <PlayArrow />}
                        size="small"
                        sx={{ flex: 1, mr: 1 }}
                    >
                        {workout.isCompleted ? 'Lặp lại' : 'Bắt đầu'}
                    </Button>

                    <Box display="flex" gap={0.5}>
                        <Tooltip title="Yêu thích">
                            <IconButton
                                size="small"
                                sx={{ color: workout.isLiked ? 'error.main' : 'text.secondary' }}
                            >
                                <Badge badgeContent={workout.totalRatings} color="error" max={99}>
                                    <FavoriteRounded fontSize="small" />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Chia sẻ">
                            <IconButton size="small" sx={{ color: 'text.secondary' }}>
                                <Share fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Tùy chọn">
                            <IconButton size="small" sx={{ color: 'text.secondary' }}>
                                <MoreVert fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserWorkoutsSection;
