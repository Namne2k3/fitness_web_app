/**
 * 🏋️ WorkoutCard Component - Enhanced với đầy đủ thông tin
 * Hiển thị comprehensive workout data từ server
 */

import {
    BookmarkBorder,
    BookmarkBorderOutlined,
    FavoriteBorder,
    FavoriteOutlined,
    LocalFireDepartment,
    MoreVert,
    Schedule,
    Star,
    Visibility,
    FitnessCenter,
    Group
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Tooltip
} from '@mui/material';
import React, { useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { Workout } from '../../../types/workout.interface';

// ================================
// 🎯 Types & Interfaces
// ================================
interface WorkoutCardProps {
    workout: Workout;
    onLike: (workoutId: string) => void;
    onSave: (workoutId: string) => void;
    onView: (workoutId: string) => void;
    onShare?: (workoutId: string) => void;
    onAddToQueue?: (workoutId: string) => void;
    compact?: boolean;
}

// ================================
// 🃏 WorkoutCard Component
// ================================
const WorkoutCard: React.FC<WorkoutCardProps> = ({
    workout,
    onLike,
    onSave,
    onView,
    onShare,
    onAddToQueue,
    compact = false
}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [imageError, setImageError] = useState(false);

    // Debug thumbnail URL
    React.useEffect(() => {
        if (workout.thumbnail) {
            console.log('🖼️ Workout thumbnail URL:', workout.thumbnail);
            console.log('🖼️ Full workout data:', workout);
        }
    }, [workout]);

    // Event handlers
    const handleLike = () => {
        setIsLiked(!isLiked);
        startTransition(() => {
            onLike(workout._id);
        });
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        startTransition(() => {
            onSave(workout._id);
        });
    };

    const navigate = useNavigate();
    const handleView = () => {
        startTransition(() => {
            onView(workout._id);
            navigate(`/workouts/${workout._id}`);
        });
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Helper functions
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'success';
            case 'intermediate': return 'warning';
            case 'advanced': return 'error';
            default: return 'primary';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'strength': return '💪';
            case 'cardio': return '🏃';
            case 'flexibility': return '🧘';
            case 'hiit': return '⚡';
            case 'crosstraining': return '🏋️‍♀️';
            case 'sports': return '⚽';
            case 'recovery': return '🛌';
            default: return '🏋️';
        }
    };

    // Format large numbers
    const formatNumber = (num: number): string => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k`;
        }
        return num.toString();
    };

    return (
        <Card
            onClick={handleView}
            sx={{
                height: compact ? 'auto' : '100%',
                display: 'flex',
                flexDirection: compact ? 'row' : 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'rgba(0,0,0,0.06)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                    borderColor: 'primary.main',
                    '& .workout-card-overlay': {
                        opacity: 1,
                    },
                },
                '&:active': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                },
            }}
        >
            {/* Hover Overlay Effect */}
            <Box
                className="workout-card-overlay"
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            />

            {/* Sponsored Badge */}
            {workout.isSponsored && (
                <Chip
                    label="Sponsored"
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 2,
                        background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        height: 20,
                    }}
                />
            )}

            {/* Thumbnail or Category Icon Section */}
            <Box
                sx={{
                    width: compact ? 80 : '100%',
                    height: compact ? 80 : 200,
                    background: workout.thumbnail
                        ? 'none'
                        : `linear-gradient(135deg, 
                            rgba(102, 126, 234, 0.1) 0%, 
                            rgba(118, 75, 162, 0.1) 100%
                        )`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: compact ? '1.5rem' : '2rem',
                    position: 'relative',
                    borderRight: compact ? '1px solid rgba(0,0,0,0.06)' : 'none',
                    overflow: 'hidden',
                }}
            >
                {workout.thumbnail ? (
                    <img
                        crossOrigin='anonymous'
                        src={workout.thumbnail}
                        alt={workout.name}
                        loading='lazy'
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                        onError={() => {
                            console.log('❌ Image failed to load:', workout.thumbnail);
                            setImageError(true);
                        }}
                        onLoad={() => {
                            console.log('✅ Image loaded successfully:', workout.thumbnail);
                        }}
                    />
                ) : (
                    getCategoryIcon(workout.category || 'strength')
                )}

                {/* Quick Stats for compact mode */}
                {compact && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 4,
                            left: 4,
                            right: 4,
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Chip
                            label={`${workout.estimatedDuration}m`}
                            size="small"
                            sx={{
                                fontSize: '0.6rem',
                                height: 16,
                                bgcolor: 'rgba(255,255,255,0.9)',
                            }}
                        />
                    </Box>
                )}

                {/* Exercise Count Badge */}
                {workout.exercises && workout.exercises.length > 0 && (
                    <Chip
                        icon={<FitnessCenter sx={{ fontSize: 14 }} />}
                        label={workout.exercises.length}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: 'rgba(255,255,255,0.9)',
                            color: 'primary.main',
                            fontWeight: 600,
                        }}
                    />
                )}
            </Box>

            {/* Content Section */}
            <CardContent
                sx={{
                    flexGrow: 1,
                    p: compact ? 1.5 : 2,
                    pb: compact ? 1.5 : '8px !important',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                }}
            >
                {/* Header Row */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    mb: compact ? 0.5 : 1,
                    minHeight: 0,
                }}>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                            variant={compact ? "body2" : "h6"}
                            component="h3"
                            fontWeight={700}
                            sx={{
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                lineHeight: 1.2,
                            }}
                        >
                            {workout.name}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                label={workout.difficulty}
                                color={getDifficultyColor(workout.difficulty)}
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    height: compact ? 18 : 24,
                                    fontSize: compact ? '0.65rem' : '0.75rem',
                                }}
                            />

                            {!compact && workout.averageRating && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Star sx={{ fontSize: 14, color: 'warning.main' }} />
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                        {workout.averageRating.toFixed(1)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        ({workout.totalRatings})
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <IconButton
                        size="small"
                        onClick={handleMenuOpen}
                        sx={{
                            ml: 1,
                            p: 0.5,
                            opacity: 0.7,
                            zIndex: 2,
                            '&:hover': {
                                opacity: 1,
                                backgroundColor: 'action.hover',
                            }
                        }}
                    >
                        <MoreVert fontSize="small" />
                    </IconButton>
                </Box>

                {/* Description - Only for non-compact */}
                {!compact && workout.description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4,
                        }}
                    >
                        {workout.description}
                    </Typography>
                )}

                {/* Muscle Groups Tags - Only for non-compact */}
                {!compact && workout.muscleGroups && workout.muscleGroups.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                        {workout.muscleGroups.slice(0, 3).map((muscle, index) => (
                            <Chip
                                key={index}
                                label={muscle}
                                size="small"
                                variant="outlined"
                                sx={{
                                    fontSize: '0.65rem',
                                    height: 20,
                                    borderColor: 'primary.light',
                                    color: 'primary.main',
                                }}
                            />
                        ))}
                        {workout.muscleGroups.length > 3 && (
                            <Chip
                                label={`+${workout.muscleGroups.length - 3}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                    fontSize: '0.65rem',
                                    height: 20,
                                    borderColor: 'grey.300',
                                    color: 'text.secondary',
                                }}
                            />
                        )}
                    </Box>
                )}

                {/* Stats Row */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 'auto',
                    pt: compact ? 0.5 : 1,
                }}>
                    <Box sx={{ display: 'flex', gap: compact ? 0.8 : 1.2, alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Duration */}
                        <Tooltip title="Duration">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                    {workout.estimatedDuration}m
                                </Typography>
                            </Box>
                        </Tooltip>

                        {/* Calories - Only for non-compact */}
                        {!compact && workout.caloriesBurned && (
                            <Tooltip title="Calories burned">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <LocalFireDepartment sx={{ fontSize: 14, color: 'warning.main' }} />
                                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                        {workout.caloriesBurned}
                                    </Typography>
                                </Box>
                            </Tooltip>
                        )}

                        {/* Views */}
                        <Tooltip title="Views">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Visibility sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                    {formatNumber(workout.views || 0)}
                                </Typography>
                            </Box>
                        </Tooltip>

                        {/* Completions - Only for non-compact */}
                        {!compact && workout.completions && (
                            <Tooltip title="Completions">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Group sx={{ fontSize: 14, color: 'success.main' }} />
                                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                        {formatNumber(workout.completions)}
                                    </Typography>
                                </Box>
                            </Tooltip>
                        )}
                    </Box>

                    {/* Action Buttons với Counts */}
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', zIndex: 2 }}>
                        {/* Like Button với Count */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLike();
                                }}
                                disabled={isPending}
                                sx={{
                                    color: isLiked ? 'error.main' : 'text.secondary',
                                    p: 0.5,
                                    '&:hover': {
                                        backgroundColor: isLiked ? 'error.light' : 'action.hover',
                                    },
                                }}
                            >
                                {isLiked ?
                                    <FavoriteOutlined fontSize="small" /> :
                                    <FavoriteBorder fontSize="small" />
                                }
                            </IconButton>
                            {(workout.likeCount || 0) > 0 && (
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                    {formatNumber(workout.likeCount || 0)}
                                </Typography>
                            )}
                        </Box>

                        {/* Save Button với Count */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSave();
                                }}
                                disabled={isPending}
                                sx={{
                                    color: isSaved ? 'primary.main' : 'text.secondary',
                                    p: 0.5,
                                    '&:hover': {
                                        backgroundColor: isSaved ? 'primary.light' : 'action.hover',
                                    },
                                }}
                            >
                                {isSaved ?
                                    <BookmarkBorderOutlined fontSize="small" /> :
                                    <BookmarkBorder fontSize="small" />
                                }
                            </IconButton>
                            {/* {workout.saveCount > 0 && (
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                    {formatNumber(workout.saveCount)}
                                </Typography>
                            )} */}
                        </Box>
                    </Box>
                </Box>
            </CardContent>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {onShare && (
                    <MenuItem onClick={() => { onShare(workout._id); handleMenuClose(); }}>
                        📤 Chia sẻ
                    </MenuItem>
                )}
                {onAddToQueue && (
                    <MenuItem onClick={() => { onAddToQueue(workout._id); handleMenuClose(); }}>
                        ➕ Thêm vào hàng đợi
                    </MenuItem>
                )}
                <MenuItem onClick={handleMenuClose}>
                    📊 Xem thống kê
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    🚫 Báo cáo
                </MenuItem>
            </Menu>
        </Card>
    );
};

export default WorkoutCard;
