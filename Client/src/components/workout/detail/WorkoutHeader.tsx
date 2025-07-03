/**
 * 🎯 Workout Header Component - Hero Section
 */

import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    IconButton,
    Chip,
    Stack,
    Tooltip,
    CircularProgress,
    useTheme,
    alpha
} from '@mui/material';
import {
    ArrowBack,
    Favorite,
    FavoriteBorder,
    Bookmark,
    BookmarkBorder,
    Share,
    PlayArrow,
    AccessTime,
    LocalFireDepartment,
    ThumbUp,
    VerifiedUser,
    Visibility
} from '@mui/icons-material';

// Types
import { Workout } from '../../../types/workout.interface';

interface WorkoutHeaderProps {
    workout: Workout;
    onBack: () => void;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ workout, onBack }) => {
    const theme = useTheme();
    const [isLiked, setIsLiked] = React.useState(false);
    const [isSaved, setIsSaved] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLike = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement actual like API call
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Failed to like workout:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement actual save API call
            setIsSaved(!isSaved);
        } catch (error) {
            console.error('Failed to save workout:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: workout.name,
                    text: workout.description,
                    url: window.location.href,
                });
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(window.location.href);
                // TODO: Show success toast
            }
        } catch (error) {
            console.error('Failed to share:', error);
        }
    };

    return (
        <Box
            sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                paddingTop: '6rem'
            }}
        >
            {/* Background Pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("/fitness_2262725.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.08,
                    zIndex: 0
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 4, sm: 6 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4 }}>
                    {/* Back Button */}
                    <IconButton
                        onClick={onBack}
                        sx={{
                            color: 'white',
                            bgcolor: alpha(theme.palette.common.white, 0.15),
                            backdropFilter: 'blur(4px)',
                            border: '1px solid',
                            borderColor: alpha(theme.palette.common.white, 0.2),
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                bgcolor: alpha(theme.palette.common.white, 0.25),
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.2)}`
                            }
                        }}
                    >
                        <ArrowBack />
                    </IconButton>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1}>
                        <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
                            <IconButton
                                onClick={handleLike}
                                disabled={isLoading}
                                sx={{
                                    color: 'white',
                                    bgcolor: alpha(theme.palette.common.white, 0.15),
                                    backdropFilter: 'blur(4px)',
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.common.white, 0.2),
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.common.white, 0.25),
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.2)}`
                                    }
                                }}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : isLiked ? (
                                    <Favorite />
                                ) : (
                                    <FavoriteBorder />
                                )}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={isSaved ? 'Remove from saved' : 'Save workout'}>
                            <IconButton
                                onClick={handleSave}
                                disabled={isLoading}
                                sx={{
                                    color: 'white',
                                    bgcolor: alpha(theme.palette.common.white, 0.15),
                                    backdropFilter: 'blur(4px)',
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.common.white, 0.2),
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.common.white, 0.25),
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.2)}`
                                    }
                                }}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : isSaved ? (
                                    <Bookmark />
                                ) : (
                                    <BookmarkBorder />
                                )}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Share workout">
                            <IconButton
                                onClick={handleShare}
                                sx={{
                                    color: 'white',
                                    bgcolor: alpha(theme.palette.common.white, 0.15),
                                    backdropFilter: 'blur(4px)',
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.common.white, 0.2),
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.common.white, 0.25),
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.2)}`
                                    }
                                }}
                            >
                                <Share />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 4
                }}>
                    {/* Workout Image */}
                    <Box sx={{ flex: { xs: '1', md: '0 0 300px' } }}>
                        <Box
                            component="img"
                            crossOrigin='anonymous'
                            src={workout.thumbnail || '/fitness_2262746.png'}
                            alt={workout.name}
                            sx={{
                                width: '100%',
                                height: 250,
                                objectFit: 'cover',
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                            }}
                        />
                    </Box>

                    {/* Workout Info */}
                    <Box sx={{ flex: 1 }}>
                        <Stack spacing={3}>
                            {/* Tags */}
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Chip
                                    label={workout.category}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.common.white, 0.25),
                                        backdropFilter: 'blur(4px)',
                                        color: 'white',
                                        fontWeight: 600,
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.common.white, 0.3),
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.common.white, 0.35)
                                        }
                                    }}
                                />
                                <Chip
                                    label={workout.difficulty}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.common.white, 0.25),
                                        backdropFilter: 'blur(4px)',
                                        color: 'white',
                                        fontWeight: 600,
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.common.white, 0.3),
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.common.white, 0.35)
                                        }
                                    }}
                                />
                                {workout.isSponsored && (
                                    <Chip
                                        label="Sponsored"
                                        size="small"
                                        icon={<VerifiedUser sx={{ fontSize: 16 }} />}
                                        sx={{
                                            bgcolor: alpha(theme.palette.secondary.main, 0.9),
                                            backdropFilter: 'blur(4px)',
                                            color: 'white',
                                            fontWeight: 600,
                                            border: '1px solid',
                                            borderColor: alpha(theme.palette.secondary.light, 0.5)
                                        }}
                                    />
                                )}
                            </Stack>

                            {/* Title */}
                            <Typography
                                variant="h3"
                                component="h1"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                    lineHeight: 1.2,
                                    textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                }}
                            >
                                {workout.name}
                            </Typography>

                            {/* Description */}
                            <Typography
                                variant="h6"
                                sx={{
                                    opacity: 0.95,
                                    lineHeight: 1.6,
                                    fontSize: { xs: '1rem', sm: '1.125rem' },
                                    fontWeight: 400,
                                    textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                                }}
                            >
                                {workout.description}
                            </Typography>

                            {/* Quick Stats */}
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={{ xs: 2, sm: 4 }}
                                flexWrap="wrap"
                            >
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    bgcolor: alpha(theme.palette.common.white, 0.15),
                                    backdropFilter: 'blur(4px)',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.common.white, 0.2)
                                }}>
                                    <AccessTime sx={{ fontSize: 20 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {workout.estimatedDuration} mins
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    bgcolor: alpha(theme.palette.common.white, 0.15),
                                    backdropFilter: 'blur(4px)',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.common.white, 0.2)
                                }}>
                                    <LocalFireDepartment sx={{ fontSize: 20 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {workout.caloriesBurned} cal
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    bgcolor: alpha(theme.palette.common.white, 0.15),
                                    backdropFilter: 'blur(4px)',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.common.white, 0.2)
                                }}>
                                    <ThumbUp sx={{ fontSize: 20 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {workout.likeCount} likes
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    bgcolor: alpha(theme.palette.common.white, 0.15),
                                    backdropFilter: 'blur(4px)',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.common.white, 0.2)
                                }}>
                                    <Visibility sx={{ fontSize: 20 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {workout.views} views
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* CTA Button */}
                            <Box>
                                <Button
                                    size="large"
                                    startIcon={<PlayArrow />}
                                    sx={{
                                        bgcolor: alpha(theme.palette.common.white, 0.95),
                                        color: theme.palette.primary.main,
                                        fontWeight: 700,
                                        fontSize: { xs: '1rem', sm: '1.125rem' },
                                        py: { xs: 1.5, sm: 2 },
                                        px: { xs: 3, sm: 4 },
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.2)}`,
                                        backdropFilter: 'blur(4px)',
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.common.white, 0.3),
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            bgcolor: theme.palette.common.white,
                                            transform: 'translateY(-4px) scale(1.03)',
                                            boxShadow: `0 16px 40px ${alpha(theme.palette.common.black, 0.3)}`
                                        }
                                    }}
                                >
                                    Start Workout
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default WorkoutHeader;
