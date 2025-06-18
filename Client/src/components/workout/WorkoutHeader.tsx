/**
 * 🎯 WorkoutHeader Component - Dynamic Header Section
 * Compact header with stats and quick actions
 */

import {
    Add,
    Analytics,
    BookmarkBorder,
    FavoriteBorder,
    TrendingUp
} from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Container,
    IconButton,
    Paper,
    Typography
} from '@mui/material';
import React from 'react';

// ================================
// 🎯 Types & Interfaces
// ================================
interface WorkoutHeaderProps {
    totalWorkouts: number;
    totalBeginner: number;
    totalSponsored: number;
    onCreateWorkout?: () => void;
    onViewAnalytics?: () => void;
    onViewFavorites?: () => void;
    onViewSaved?: () => void;
    compact?: boolean;
}

// ================================
// 🎯 WorkoutHeader Component
// ================================
const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
    totalWorkouts,
    totalBeginner,
    totalSponsored,
    onCreateWorkout,
    onViewAnalytics,
    onViewFavorites,
    onViewSaved,
    compact = false
}) => {
    const stats = [
        {
            value: totalWorkouts,
            label: 'Workouts',
            color: 'primary.main',
            icon: '🏋️'
        },
        {
            value: totalBeginner,
            label: 'Beginner',
            color: 'success.main',
            icon: '🟢'
        },
        {
            value: totalSponsored,
            label: 'Sponsored',
            color: 'warning.main',
            icon: '⭐'
        }
    ];

    if (compact) {
        return (
            <Paper
                elevation={0}
                sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.06)',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Box>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                            🏋️ Workouts
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            {stats.map((stat, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography variant="h6" fontWeight={700} color={stat.color}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {onViewFavorites && (
                            <IconButton size="small" onClick={onViewFavorites} title="Yêu thích">
                                <FavoriteBorder />
                            </IconButton>
                        )}
                        {onViewSaved && (
                            <IconButton size="small" onClick={onViewSaved} title="Đã lưu">
                                <BookmarkBorder />
                            </IconButton>
                        )}
                        {onViewAnalytics && (
                            <IconButton size="small" onClick={onViewAnalytics} title="Thống kê">
                                <Analytics />
                            </IconButton>
                        )}
                        {onCreateWorkout && (
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<Add />}
                                onClick={onCreateWorkout}
                                sx={{
                                    borderRadius: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                            >
                                Tạo mới
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>
        );
    }

    // Full header for non-compact mode
    return (
        <Box sx={{ mb: 4 }}>
            <Container maxWidth="xl">
                {/* Main Title */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        fontWeight={800}
                        sx={{
                            mb: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                        }}
                    >
                        🏋️ Khám phá Workouts
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
                    >
                        Tìm kiếm và khám phá hàng ngàn workout được thiết kế bởi các chuyên gia và cộng đồng fitness
                    </Typography>
                </Box>

                {/* Stats & Actions */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 3,
                    mb: 2,
                }}>
                    {/* Quick Stats */}
                    <Box sx={{
                        display: 'flex',
                        gap: 4,
                        flexWrap: 'wrap',
                    }}>
                        {stats.map((stat, index) => (
                            <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    minWidth: 100,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                    },
                                }}
                            >
                                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '1.2rem' }}>
                                    {stat.icon}
                                </Typography>
                                <Typography variant="h4" fontWeight={700} color={stat.color}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {stat.label}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>

                    {/* Quick Actions */}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {onViewFavorites && (
                            <Button
                                variant="outlined"
                                startIcon={<FavoriteBorder />}
                                onClick={onViewFavorites}
                                sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                                Yêu thích
                            </Button>
                        )}
                        {onViewSaved && (
                            <Button
                                variant="outlined"
                                startIcon={<BookmarkBorder />}
                                onClick={onViewSaved}
                                sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                                Đã lưu
                            </Button>
                        )}
                        {onViewAnalytics && (
                            <Button
                                variant="outlined"
                                startIcon={<TrendingUp />}
                                onClick={onViewAnalytics}
                                sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                                Thống kê
                            </Button>
                        )}
                        {onCreateWorkout && (
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={onCreateWorkout}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                    },
                                }}
                            >
                                Tạo Workout Mới
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Trending Tags */}
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        TRENDING TAGS:
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                        {['Full Body', 'HIIT', 'Strength', 'Beginner', 'No Equipment', 'Quick'].map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                variant="outlined"
                                size="small"
                                sx={{
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default WorkoutHeader;
