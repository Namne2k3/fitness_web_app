/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 💪 ExerciseCard - Modern Fitness-Focused Design
 * React 19 implementation với Material UI design system
 */

import React, { useState, useTransition } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    Box,
    Avatar,
    IconButton,
    Fade,
    LinearProgress,
    useTheme,
    alpha
} from '@mui/material';
import {
    FitnessCenter,
    PlayArrow,
    LocalFireDepartment,
    Favorite,
    FavoriteBorder,
    BookmarkBorder,
    Bookmark
} from '@mui/icons-material';
import { Exercise } from '../../../types';
import { getCategoryLabel, getDifficultyLabel } from '../helpers';

interface ExerciseCardProps {
    exercise: Exercise;
    onClick: () => void;
    variant?: 'compact' | 'standard' | 'list';
    showStats?: boolean;
    showVideo?: boolean;
}

/**
 * ✅ React 19: Modern Exercise Card Component
 */
const ExerciseCard: React.FC<ExerciseCardProps> = ({
    exercise,
    onClick,
    variant = 'compact',
    showStats = true,
    showVideo = true
}) => {
    const theme = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Handle click with transition
    const handleClick = () => {
        startTransition(() => {
            onClick();
        });
    };

    // Handle like action
    const handleLike = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsLiked(!isLiked);
    };

    // Handle bookmark action
    const handleBookmark = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsBookmarked(!isBookmarked);
    };

    // Get difficulty color
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return theme.palette.success.main;
            case 'intermediate': return theme.palette.warning.main;
            case 'advanced': return theme.palette.error.main;
            default: return theme.palette.primary.main;
        }
    };

    // Get difficulty chip color
    const getDifficultyChipColor = (difficulty: string): 'success' | 'warning' | 'error' | 'primary' => {
        switch (difficulty) {
            case 'beginner': return 'success';
            case 'intermediate': return 'warning';
            case 'advanced': return 'error';
            default: return 'primary';
        }
    };

    // Get category icon
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'strength': return '💪';
            case 'cardio': return '❤️';
            case 'flexibility': return '🧘';
            default: return '🏋️';
        }
    };

    if (variant === 'list') {
        return (
            <Card
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                    width: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: 'rgba(0,0,0,0.08)',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    background: 'white',
                    '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                        borderColor: theme.palette.primary.main,
                    }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                    {/* Exercise Image/Avatar */}
                    <Avatar
                        src={exercise.images?.[0]}
                        sx={{
                            width: 64,
                            height: 64,
                            bgcolor: alpha(getDifficultyColor(exercise.difficulty), 0.2),
                            border: `2px solid ${getDifficultyColor(exercise.difficulty)}`,
                            mr: 2,
                            fontSize: '2rem'
                        }}
                    >
                        {getCategoryIcon(exercise.category)}
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                fontSize: '1.1rem'
                            }}>
                                {exercise.name}
                            </Typography>
                            <Chip
                                label={exercise.difficulty}
                                size="small"
                                color={getDifficultyChipColor(exercise.difficulty)}
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.75rem'
                                }}
                            />
                        </Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 1,
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                                overflow: 'hidden'
                            }}
                        >
                            {exercise.description}
                        </Typography>

                        {/* Stats */}
                        {showStats && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {exercise.primaryMuscleGroups && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            🎯 {exercise.primaryMuscleGroups.slice(0, 2).join(', ')}
                                        </Typography>
                                    </Box>
                                )}
                                {exercise.averageIntensity && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <LocalFireDepartment sx={{ fontSize: 14, color: 'orange' }} />
                                        <Typography variant="caption" color="text.secondary">
                                            {exercise.averageIntensity}/10
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>

                    {/* Action Button */}
                    <IconButton
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            '&:hover': {
                                bgcolor: theme.palette.primary.dark,
                                transform: 'scale(1.1)',
                            }
                        }}
                    >
                        <PlayArrow />
                    </IconButton>
                </Box>
            </Card>
        );
    }

    // Grid View (compact & standard)
    return (
        <Card
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(0,0,0,0.08)',
                overflow: 'hidden',
                position: 'relative',
                background: 'white',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    borderColor: theme.palette.primary.main,
                }
            }}
        >
            {/* Featured Image */}
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    height={variant === 'standard' ? 200 : 160}
                    image={exercise.images?.[0] ?? 'https://media.istockphoto.com/id/512085711/photo/deadlift.jpg?s=612x612&w=0&k=20&c=0FDKEliyGHJ8QJB1G_UO6yx8f4JPdkYeGmsqi-aV2y0='}
                    alt={exercise.name}
                    sx={{
                        transition: 'transform 0.3s ease',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                />

                {/* Overlay with quick actions */}
                <Fade in={isHovered}>
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.8) 0%, rgba(255, 152, 0, 0.8) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                    }}>
                        <IconButton
                            onClick={handleLike}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                        >
                            {isLiked ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                        <IconButton
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.9)',
                                color: theme.palette.primary.main,
                                '&:hover': { bgcolor: 'white' }
                            }}
                        >
                            <PlayArrow />
                        </IconButton>
                        <IconButton
                            onClick={handleBookmark}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                        >
                            {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                        </IconButton>
                    </Box>
                </Fade>

                {/* Difficulty Badge */}
                <Chip
                    label={getDifficultyLabel(exercise.difficulty)}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: alpha(getDifficultyColor(exercise.difficulty), 0.9),
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}
                />

                {/* Video Indicator */}
                {showVideo && exercise.videoUrl && (
                    <Box sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                    }}>
                        <PlayArrow sx={{ fontSize: 14, color: 'white' }} />
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                            Video
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Content */}
            <CardContent sx={{ p: 2.5, pb: '16px !important' }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontSize: '1.1rem',
                        lineHeight: 1.2,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden'
                    }}
                >
                    {exercise.name}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden'
                    }}
                >
                    {exercise.description}
                </Typography>

                {/* Category & Muscle Groups */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="caption" sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 600
                    }}>
                        {getCategoryIcon(exercise.category)} {getCategoryLabel(exercise.category)}
                    </Typography>
                </Box>

                {/* Stats */}
                {showStats && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Intensity */}
                        {exercise.averageIntensity && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocalFireDepartment sx={{ fontSize: 16, color: 'orange' }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    {exercise.averageIntensity}/10
                                </Typography>
                            </Box>
                        )}

                        {/* Muscle Groups */}
                        {exercise.primaryMuscleGroups && exercise.primaryMuscleGroups.length > 0 && (
                            <Typography variant="caption" color="text.secondary">
                                🎯 {exercise.primaryMuscleGroups[0]}
                                {exercise.primaryMuscleGroups.length > 1 && ` +${exercise.primaryMuscleGroups.length - 1}`}
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Intensity Progress Bar */}
                {exercise.averageIntensity && (
                    <Box sx={{ mt: 1.5 }}>
                        <LinearProgress
                            variant="determinate"
                            value={(exercise.averageIntensity / 10) * 100}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 3,
                                    background: `linear-gradient(90deg, ${getDifficultyColor(exercise.difficulty)} 0%, ${alpha(getDifficultyColor(exercise.difficulty), 0.7)} 100%)`
                                }
                            }}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ExerciseCard;
