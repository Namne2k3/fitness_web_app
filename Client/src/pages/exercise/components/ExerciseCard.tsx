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
    alpha,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Tooltip
} from '@mui/material';
import {
    PlayArrow,
    LocalFireDepartment,
    Favorite,
    FavoriteBorder,
    BookmarkBorder,
    Bookmark,
    MoreVert,
    Add,
    Share,
    Info
} from '@mui/icons-material';
import { Exercise } from '../../../types';
import { getCategoryLabel, getDifficultyLabel } from '../helpers';
import WorkoutSelectionModal from '../../../components/workout/WorkoutSelectionModal';

interface ExerciseCardProps {
    exercise: Exercise;
    onClick: () => void;
    variant?: 'compact' | 'standard' | 'list';
    showStats?: boolean;
    showVideo?: boolean;
    // ✅ NEW: Action mode configuration
    actionMode?: 'menu' | 'direct' | 'none';
    onDirectAdd?: (exercise: Exercise) => void;
    onAddToWorkout?: (exercise: Exercise) => void;
    isSelected?: boolean;
    isDisabled?: boolean;
}

/**
 * ✅ React 19: Modern Exercise Card Component
 */
const ExerciseCard: React.FC<ExerciseCardProps> = ({
    exercise,
    onClick,
    variant = 'compact',
    showStats = true,
    showVideo = true,
    // ✅ NEW: Action mode props
    actionMode = 'menu',
    onDirectAdd,
    onAddToWorkout,
    isSelected = false,
    isDisabled = false
}) => {
    const theme = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    const [, startTransition] = useTransition();
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);

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

    // Handle menu open
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    // Handle menu close
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Handle add to workout
    const handleAddToWorkout = (event: React.MouseEvent) => {
        event.stopPropagation();
        handleMenuClose();

        // ✅ NEW: Use onAddToWorkout if provided, otherwise open modal
        if (onAddToWorkout) {
            onAddToWorkout(exercise);
        } else {
            setIsWorkoutModalOpen(true);
        }
    };

    // ✅ NEW: Handle direct add (for ExerciseLibraryModal)
    const handleDirectAdd = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (onDirectAdd && !isDisabled) {
            onDirectAdd(exercise);
        }
    };

    // ✅ NEW: Handle card click based on mode
    const handleCardClick = () => {
        if (actionMode === 'direct' && onDirectAdd && !isDisabled) {
            handleDirectAdd({} as React.MouseEvent);
        } else if (actionMode === 'none') {
            handleClick(); // Navigate to detail page
        }
        // actionMode === 'menu': Do nothing on card click, only 3-dot menu should work
    };

    // Handle share
    const handleShare = (event: React.MouseEvent) => {
        event.stopPropagation();
        handleMenuClose();
        // TODO: Implement share functionality
        console.log('Share exercise:', exercise.name);
    };

    // Handle view details
    const handleViewDetails = (event: React.MouseEvent) => {
        event.stopPropagation();
        handleMenuClose();
        onClick(); // Navigate to exercise details
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
                onClick={actionMode === 'menu' ? undefined : handleCardClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                    width: '100%',
                    cursor: (actionMode === 'direct' || actionMode === 'none') ? 'pointer' : 'default',
                    transition: 'all 0.3s ease',
                    border: '2px solid',
                    borderColor: isSelected
                        ? theme.palette.primary.main
                        : 'rgba(0,0,0,0.08)',
                    borderRadius: 2,
                    boxShadow: isSelected
                        ? '0 8px 24px rgba(25, 118, 210, 0.25)'
                        : '0 2px 8px rgba(0,0,0,0.06)',
                    background: isSelected
                        ? alpha(theme.palette.primary.main, 0.05)
                        : 'white',
                    opacity: isDisabled ? 0.6 : 1,
                    pointerEvents: isDisabled ? 'none' : 'auto',
                    '&:hover': !isDisabled ? {
                        transform: 'translateX(8px)',
                        boxShadow: isSelected
                            ? '0 12px 32px rgba(25, 118, 210, 0.3)'
                            : '0 8px 24px rgba(25, 118, 210, 0.15)',
                        borderColor: theme.palette.primary.main,
                    } : {}
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

                    {/* Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Conditional Action Button */}
                        {actionMode === 'menu' && onAddToWorkout && (
                            <Tooltip title="More options">
                                <IconButton
                                    onClick={handleMenuOpen}
                                    size="small"
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                        }
                                    }}
                                >
                                    <MoreVert />
                                </IconButton>
                            </Tooltip>
                        )}

                        {actionMode === 'direct' && (
                            <Tooltip title={isSelected ? "Selected" : "Add to workout"}>
                                <IconButton
                                    onClick={handleDirectAdd}
                                    disabled={isDisabled}
                                    size="small"
                                    sx={{
                                        bgcolor: isSelected
                                            ? alpha(theme.palette.success.main, 0.9)
                                            : alpha(theme.palette.primary.main, 0.9),
                                        color: 'white',
                                        '&:hover': !isDisabled ? {
                                            bgcolor: isSelected
                                                ? theme.palette.success.main
                                                : theme.palette.primary.main,
                                            transform: 'scale(1.1)',
                                        } : {},
                                        '&:disabled': {
                                            bgcolor: 'rgba(0,0,0,0.1)',
                                            color: 'rgba(0,0,0,0.3)'
                                        }
                                    }}
                                >
                                    {isSelected ? '✓' : <Add />}
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* Play Button */}
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
                </Box>
            </Card>
        );
    }

    // Grid View (compact & standard)
    return (
        <Card
            onClick={actionMode === 'menu' ? undefined : handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                height: '100%',
                cursor: (actionMode === 'direct' || actionMode === 'none') ? 'pointer' : 'default',
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
                pointerEvents: isDisabled ? 'none' : 'auto',
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

                {/* Action Button - Conditional Rendering */}
                {actionMode === 'menu' && onAddToWorkout && (
                    <Tooltip title="More options">
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                bgcolor: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                width: 32,
                                height: 32,
                                '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.8)',
                                    transform: 'scale(1.1)',
                                }
                            }}
                        >
                            <MoreVert sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>
                )}

                {actionMode === 'direct' && (
                    <Tooltip title={isSelected ? "Selected" : "Add to workout"}>
                        <IconButton
                            onClick={handleDirectAdd}
                            disabled={isDisabled}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                bgcolor: isSelected
                                    ? alpha(theme.palette.success.main, 0.9)
                                    : 'rgba(25, 118, 210, 0.9)',
                                color: 'white',
                                width: 36,
                                height: 36,
                                '&:hover': !isDisabled ? {
                                    bgcolor: isSelected
                                        ? theme.palette.success.main
                                        : theme.palette.primary.main,
                                    transform: 'scale(1.1)',
                                } : {},
                                '&:disabled': {
                                    bgcolor: 'rgba(0,0,0,0.3)',
                                    color: 'rgba(255,255,255,0.5)'
                                }
                            }}
                        >
                            {isSelected ? '✓' : <Add sx={{ fontSize: 20 }} />}
                        </IconButton>
                    </Tooltip>
                )}

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
                {/* {showVideo && exercise.videoUrl && (
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
                )} */}
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

            {/* Options Menu - Only for menu mode */}
            {actionMode === 'menu' && onAddToWorkout && (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    onClick={(e) => e.stopPropagation()}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            borderRadius: 2,
                            minWidth: 200
                        }
                    }}
                >
                    <MenuItem onClick={handleAddToWorkout}>
                        <ListItemIcon>
                            <Add sx={{ color: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText primary="Add to Workout" />
                    </MenuItem>
                    <MenuItem onClick={handleShare}>
                        <ListItemIcon>
                            <Share sx={{ color: 'text.secondary' }} />
                        </ListItemIcon>
                        <ListItemText primary="Share Exercise" />
                    </MenuItem>
                    <MenuItem onClick={handleViewDetails}>
                        <ListItemIcon>
                            <Info sx={{ color: 'text.secondary' }} />
                        </ListItemIcon>
                        <ListItemText primary="View Details" />
                    </MenuItem>
                </Menu>
            )}

            {/* Workout Selection Modal - Only for menu mode */}
            {actionMode === 'menu' && onAddToWorkout && (
                <WorkoutSelectionModal
                    isOpen={isWorkoutModalOpen}
                    onClose={() => setIsWorkoutModalOpen(false)}
                    exercise={exercise}
                />
            )}
        </Card>
    );
};

export default ExerciseCard;
