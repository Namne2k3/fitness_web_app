/**
 * 💪 Enhanced ExerciseCard - React 19 với Multiple Variants
 * Reusable exercise card với support cho different contexts
 */

import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    CardActionArea,
    Typography,
    Box,
    Chip,
    Button,
    Stack,
    IconButton,
    Tooltip,
    alpha,
    useTheme
} from '@mui/material';
import {
    Add as AddIcon,
    PlayArrow as PlayIcon,
    FitnessCenter as FitnessCenterIcon,
    LocalFireDepartment as CaloriesIcon,
    Star as StarIcon,
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { Exercise } from '../../types';

// ================================
// 🎯 Types & Interfaces
// ================================
interface ExerciseCardProps {
    exercise: Exercise;
    variant?: 'detail' | 'compact' | 'picker' | 'list';
    onAddToWorkout?: (exercise: Exercise) => void;
    onExerciseClick?: (exercise: Exercise) => void;
    onToggleLike?: (exercise: Exercise) => void;
    onToggleBookmark?: (exercise: Exercise) => void;
    showActions?: boolean;
    isSelected?: boolean;
}

// ================================
// 🎨 Utility Functions
// ================================
const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (difficulty) {
        case 'beginner': return 'success';
        case 'intermediate': return 'warning';
        case 'advanced': return 'error';
        default: return 'default';
    }
};

const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
        case 'strength': return '💪';
        case 'cardio': return '❤️';
        case 'flexibility': return '🧘';
        case 'balance': return '⚖️';
        default: return '🏋️';
    }
};

// ================================
// 🏋️ Main ExerciseCard Component
// ================================
const ExerciseCard: React.FC<ExerciseCardProps> = ({
    exercise,
    variant = 'detail',
    onAddToWorkout,
    onExerciseClick,
    onToggleLike,
    onToggleBookmark,
    showActions = true,
    isSelected = false
}) => {
    const theme = useTheme();

    // ✅ Handle clicks based on variant
    const handleCardClick = () => {
        if (variant === 'picker' && onExerciseClick) {
            onExerciseClick(exercise);
        } else if (variant === 'detail' && onExerciseClick) {
            onExerciseClick(exercise);
        }
    };

    // ✅ Render different variants
    const renderCardContent = () => (
        <CardContent sx={{ p: variant === 'compact' ? 2 : 3 }}>
            {/* GIF/Image Display */}
            {exercise.gifUrl && (
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: variant === 'compact' ? 120 : 180,
                        borderRadius: 2,
                        overflow: 'hidden',
                        mb: 2,
                        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
                    }}
                >
                    <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 8
                        }}
                        loading="lazy"
                    />

                    {/* Overlay badges */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            display: 'flex',
                            gap: 1
                        }}
                    >
                        <Chip
                            label={getCategoryIcon(exercise.category) + ' ' + exercise.category}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.9)',
                                fontSize: '0.75rem',
                                height: 24
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8
                        }}
                    >
                        <Chip
                            label={exercise.difficulty}
                            size="small"
                            color={getDifficultyColor(exercise.difficulty)}
                            sx={{
                                fontSize: '0.75rem',
                                height: 24,
                                fontWeight: 600
                            }}
                        />
                    </Box>
                </Box>
            )}

            {/* Exercise Info */}
            <Box>
                <Typography
                    variant={variant === 'compact' ? 'h6' : 'h5'}
                    component="h3"
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {exercise.name}
                </Typography>

                {variant !== 'compact' && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {exercise.description}
                    </Typography>
                )}

                {/* Exercise Stats */}
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    {exercise.caloriesPerMinute && (
                        <Chip
                            icon={<CaloriesIcon sx={{ fontSize: 16 }} />}
                            label={`${exercise.caloriesPerMinute} cal/min`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                        />
                    )}

                    {exercise.primaryMuscleGroups.length > 0 && (
                        <Chip
                            icon={<FitnessCenterIcon sx={{ fontSize: 16 }} />}
                            label={exercise.primaryMuscleGroups[0]}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                        />
                    )}
                </Stack>

                {/* Social Stats - Only for detail variant */}
                {variant === 'detail' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FavoriteIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                {exercise.likeCount || 0}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                4.5
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>
        </CardContent>
    );

    // ✅ Render actions based on variant
    const renderActions = () => {
        if (!showActions || variant === 'picker') return null;

        return (
            <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                    {/* Add to Workout Button */}
                    {onAddToWorkout && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToWorkout(exercise);
                            }}
                            sx={{
                                flex: 1,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Add to Workout
                        </Button>
                    )}

                    {/* View Details Button */}
                    {variant === 'detail' && onExerciseClick && (
                        <Button
                            variant="outlined"
                            startIcon={<PlayIcon />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onExerciseClick(exercise);
                            }}
                            sx={{
                                flex: onAddToWorkout ? 1 : 1,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            {onAddToWorkout ? 'Details' : 'View Exercise'}
                        </Button>
                    )}

                    {/* Social Actions */}
                    {variant === 'detail' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Like Exercise">
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleLike?.(exercise);
                                    }}
                                    sx={{
                                        color: exercise.isLiked ? 'error.main' : 'action.active'
                                    }}
                                >
                                    {exercise.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Bookmark Exercise">
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleBookmark?.(exercise);
                                    }}
                                    sx={{
                                        color: exercise.isBookmarked ? 'primary.main' : 'action.active'
                                    }}
                                >
                                    {exercise.isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Stack>
            </CardActions>
        );
    };

    // ✅ Main Card Wrapper
    const cardSx = {
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: (variant === 'picker' || (variant === 'detail' && onExerciseClick)) ? 'pointer' : 'default',
        ...(isSelected && {
            border: `2px solid ${theme.palette.primary.main}`,
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
        }),
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
            ...(variant === 'picker' && {
                border: `1px solid ${theme.palette.primary.main}`
            })
        }
    };

    // ✅ Render Card Based on Variant
    if (variant === 'picker') {
        return (
            <Card sx={cardSx}>
                <CardActionArea onClick={handleCardClick} sx={{ height: '100%' }}>
                    {renderCardContent()}
                </CardActionArea>
            </Card>
        );
    }

    return (
        <Card sx={cardSx}>
            {variant === 'detail' && onExerciseClick ? (
                <CardActionArea onClick={handleCardClick}>
                    {renderCardContent()}
                </CardActionArea>
            ) : (
                renderCardContent()
            )}
            {renderActions()}
        </Card>
    );
};

export default ExerciseCard;
