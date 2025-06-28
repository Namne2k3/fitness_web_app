/**
 * 💪 ExerciseSelectionCard - For Exercise Library Modal
 * Specialized card for selecting exercises with toggle functionality
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
    alpha,
    Tooltip
} from '@mui/material';
import {
    PlayArrow,
    LocalFireDepartment,
    Favorite,
    FavoriteBorder,
    BookmarkBorder,
    Bookmark,
    Add,
    Check
} from '@mui/icons-material';
import { Exercise } from '../../types';
import { getCategoryLabel, getDifficultyLabel } from '../../pages/exercise/helpers';

interface ExerciseSelectionCardProps {
    exercise: Exercise;
    onToggleSelect: (exercise: Exercise) => void;
    isSelected: boolean;
    isDisabled?: boolean;
    variant?: 'compact' | 'standard';
    showStats?: boolean;
}

/**
 * ExerciseSelectionCard Component
 */
const ExerciseSelectionCard: React.FC<ExerciseSelectionCardProps> = ({
    exercise,
    onToggleSelect,
    isSelected,
    isDisabled = false,
    variant = 'compact',
    showStats = true
}) => {
    const theme = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    const [, startTransition] = useTransition();
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Handle card click to toggle selection
    const handleCardClick = () => {
        if (!isDisabled) {
            startTransition(() => {
                onToggleSelect(exercise);
            });
        }
    };

    // Handle selection button click
    const handleSelectClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!isDisabled) {
            onToggleSelect(exercise);
        }
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

    // Get category icon
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'strength': return '💪';
            case 'cardio': return '❤️';
            case 'flexibility': return '🧘';
            default: return '🏋️';
        }
    };

    return (
        <Card
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                height: '100%',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: 3,
                border: '2px solid',
                borderColor: isSelected
                    ? theme.palette.primary.main
                    : 'rgba(0,0,0,0.08)',
                overflow: 'hidden',
                position: 'relative',
                background: isSelected
                    ? alpha(theme.palette.primary.main, 0.05)
                    : 'white',
                opacity: isDisabled ? 0.6 : 1,
                boxShadow: isSelected
                    ? '0 8px 24px rgba(25, 118, 210, 0.25)'
                    : '0 2px 8px rgba(0,0,0,0.06)',
                '&:hover': !isDisabled ? {
                    transform: 'translateY(-8px)',
                    boxShadow: isSelected
                        ? '0 24px 48px rgba(25, 118, 210, 0.3)'
                        : '0 20px 40px rgba(0,0,0,0.15)',
                    borderColor: theme.palette.primary.main,
                } : {}
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

                {/* Selection Button - Top Left */}
                <Tooltip title={isSelected ? "Remove from workout" : "Add to workout"}>
                    <IconButton
                        onClick={handleSelectClick}
                        disabled={isDisabled}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            bgcolor: isSelected
                                ? theme.palette.primary.main
                                : 'rgba(25, 118, 210, 0.9)',
                            color: 'white',
                            width: 36,
                            height: 36,
                            '&:hover': !isDisabled ? {
                                bgcolor: theme.palette.primary.dark,
                                transform: 'scale(1.1)',
                            } : {},
                            '&:disabled': {
                                bgcolor: 'rgba(0,0,0,0.3)',
                                color: 'rgba(255,255,255,0.5)'
                            }
                        }}
                    >
                        {isSelected ? <Check sx={{ fontSize: 20 }} /> : <Add sx={{ fontSize: 20 }} />}
                    </IconButton>
                </Tooltip>

                {/* Difficulty Badge - Top Right */}
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

export default ExerciseSelectionCard;
