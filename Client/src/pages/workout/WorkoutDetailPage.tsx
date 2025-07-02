/**
 * 🏋️ Workout Detail Page - React 19 Implementation
 * Complete workout detail view với API integration và optimized UI/UX
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    IconButton,
    Chip,
    Avatar,
    Stack,
    Rating,
    Divider,
    Tooltip,
    CircularProgress,
    Skeleton,
    // Card,
    // CardMedia,
    // CardContent,
    Alert,
    useTheme,
    useMediaQuery,
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
    Groups,
    FitnessCenter,
    Visibility,
    ThumbUp,
    VerifiedUser,
    Person,
    PersonAdd
} from '@mui/icons-material';

// Hooks
import { useWorkout } from '../../hooks/useWorkoutData';

// Components
import ExerciseCard from '../../components/exercise/ExerciseCard';
import { Exercise, ExerciseCategory } from '../../types/exercise.interface';

// Types
import { Workout, WorkoutExercise } from '../../types/workout.interface';

/**
 * 🎯 Main WorkoutDetailPage Component
 */
const WorkoutDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // ✅ React Query hook để fetch workout data
    const {
        data: workout,
        isLoading,
        error,
        isError
    } = useWorkout(id || '');

    console.log("Check workout >>> ", workout)

    // Loading state
    if (isLoading) {
        return <WorkoutDetailSkeleton />;
    }

    // Error state
    if (isError || !workout) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert
                    severity="error"
                    sx={{ mb: 4 }}
                    action={
                        <Button color="inherit" size="small" onClick={() => navigate('/workouts')}>
                            Back to Workouts
                        </Button>
                    }
                >
                    {error?.message || 'Workout not found'}
                </Alert>
            </Container>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1976d2 0%, #ff9800 100%)',
            pb: 4
        }}>
            {/* Header Section */}
            <WorkoutHeader workout={workout} onBack={() => navigate(-1)} />

            <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                    {/* Main Content */}
                    <Box sx={{ flex: { xs: '1', lg: '2' } }}>
                        <Stack spacing={4}>
                            {/* Quick Stats Cards - Mobile First */}
                            {isMobile && <QuickStatsCard workout={workout} />}

                            {/* Workout Info Card */}
                            <WorkoutInfoCard workout={workout} />

                            {/* Author Info Card */}
                            <AuthorInfoCard workout={workout} />

                            {/* Exercises List */}
                            <ExercisesList exercises={workout.exercises} />

                            {/* Reviews Section */}
                            <ReviewsSection workoutId={workout._id} />
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

/**
 * 🎯 Loading Skeleton Component
 */
const WorkoutDetailSkeleton: React.FC = () => (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Skeleton variant="rectangular" height={300} sx={{ mb: 4, borderRadius: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                <Box sx={{ flex: { xs: '1', lg: '2' } }}>
                    <Stack spacing={4}>
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                    </Stack>
                </Box>
                <Box sx={{ flex: { xs: '1', lg: '1' }, minWidth: { lg: '300px' } }}>
                    <Stack spacing={3}>
                        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                    </Stack>
                </Box>
            </Box>
        </Container>
    </Box>
);

/**
 * 🎯 Workout Header Component
 */
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

/**
 * 🎯 Workout Info Card Component
 */
interface WorkoutInfoCardProps {
    workout: Workout;
}

const WorkoutInfoCard: React.FC<WorkoutInfoCardProps> = ({ workout }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.grey[50], 0.95)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: '2px solid',
                borderColor: 'transparent',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Groups sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                >
                    Workout Details
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Muscle Groups & Equipment */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3
                }}>
                    {/* Muscle Groups */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                            <Groups sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Target Muscles
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {workout.muscleGroups?.map((muscle, index) => (
                                <Chip
                                    key={index}
                                    label={muscle}
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontWeight: 500 }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Equipment */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                            <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Equipment Needed
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {workout.equipment?.map((item, index) => (
                                <Chip
                                    key={index}
                                    label={item}
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontWeight: 500 }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Box>

                {/* Tags */}
                {workout.tags.length > 0 && (
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Tags
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {workout.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    size="small"
                                    sx={{ bgcolor: 'primary.light', color: 'white', fontWeight: 500 }}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

/**
 * 🎯 Exercises List Component
 */
interface ExercisesListProps {
    exercises: WorkoutExercise[];
}

const ExercisesList: React.FC<ExercisesListProps> = ({ exercises }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    console.log("Check exercises", exercises);

    // Handle exercise click to navigate to detail page
    const handleExerciseClick = (exercise: Exercise) => {
        console.log("Check exercise", exercise);
        // Use slug if available, fallback to id for backward compatibility
        const identifier = exercise.slug || exercise._id;
        navigate(`/exercises/${identifier}`);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.grey[50], 0.98)} 100%)`,
                border: '2px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <FitnessCenter sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Exercises ({exercises.length})
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)'
                    },
                    gap: 3,
                    mt: 2,
                    // Ensure all grid items have equal height
                    gridAutoRows: '1fr', // This makes all rows the same height
                    '& > *': {
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '450px', // Set consistent minimum height
                    }
                }}
            >
                {exercises.map((exercise, idx) => {
                    const info = exercise.exerciseInfo;
                    if (!info) {
                        // If no exerciseInfo, skip rendering or show a fallback
                        return null;
                    }
                    // Only use info (ExerciseFull) for ExerciseCard
                    const cardExercise = {
                        _id: info._id || exercise.exerciseId || String(idx),
                        name: info.name || 'Exercise',
                        description: info.description || '',
                        slug: info.slug || '',
                        instructions: info.instructions || [],
                        // Convert category to ExerciseCategory enum if possible, fallback to 'strength'
                        category: Object.values(ExerciseCategory).includes(info.category as ExerciseCategory)
                            ? (info.category as ExerciseCategory)
                            : ExerciseCategory.STRENGTH,
                        primaryMuscleGroups: info.primaryMuscleGroups || [],
                        secondaryMuscleGroups: info.secondaryMuscleGroups || [],
                        equipment: info.equipment || [],
                        difficulty: ['beginner', 'intermediate', 'advanced'].includes(String(info.difficulty))
                            ? (info.difficulty as 'beginner' | 'intermediate' | 'advanced')
                            : 'beginner',
                        images: info.images || [],
                        videoUrl: info.videoUrl || '',
                        gifUrl: info.gifUrl || '',
                        caloriesPerMinute: info.caloriesPerMinute,
                        averageIntensity: info.averageIntensity,
                        variations: info.variations || [],
                        precautions: info.precautions || [],
                        contraindications: info.contraindications || [],
                        isApproved: info.isApproved ?? true,
                        createdBy: info.createdBy || '',
                        createdAt: info.createdAt || new Date(),
                        updatedAt: info.updatedAt || new Date(),
                    };
                    return (
                        <Box
                            key={exercise.exerciseId || idx}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)'
                                },
                                // Force consistent card structure
                                '& .MuiCard-root': {
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                },
                                '& .MuiCardContent-root': {
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '16px !important'
                                },
                                '& .MuiCardActions-root': {
                                    marginTop: 'auto',
                                    padding: '8px 16px 16px 16px'
                                },
                                // Ensure image containers have consistent height
                                '& img': {
                                    height: '180px',
                                    objectFit: 'contain',
                                    width: '100%'
                                }
                            }}
                        >
                            <ExerciseCard
                                exercise={cardExercise}
                                variant="detail"
                                showActions={false}
                                onExerciseClick={handleExerciseClick}
                            />
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};

/**
 * 🎯 Quick Stats Card Component
 */
interface QuickStatsCardProps {
    workout: Workout;
}

const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ workout }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                border: '2px solid',
                borderColor: 'transparent',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                    borderColor: theme.palette.primary.main,
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Visibility sx={{ color: 'primary.main', fontSize: 24 }} />
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.125rem', sm: '1.25rem' }
                    }}
                >
                    Quick Stats
                </Typography>
            </Box>

            <Stack spacing={3}>
                {/* Rating */}
                <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Average Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={workout.averageRating || 0} readOnly precision={0.1} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {(workout.averageRating || 0).toFixed(1)} ({workout.totalRatings || 0})
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Stats Grid */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2
                }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {workout.views || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Views
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                            {workout.completions || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Completions
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                            {workout.likeCount || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Likes
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                            {workout.saveCount || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Saves
                        </Typography>
                    </Box>
                </Box>
            </Stack>
        </Paper>
    );
};

/**
 * 🎯 Author Info Card Component
 */
interface AuthorInfoCardProps {
    workout: Workout;
}

const AuthorInfoCard: React.FC<AuthorInfoCardProps> = ({ workout }) => {
    const theme = useTheme();
    const authorInfo = workout.authorInfo;

    console.log("Check authorInfo >>> ", workout)

    if (!authorInfo) {
        return null;
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.grey[50], 0.98)} 100%)`,
                border: '2px solid',
                borderColor: alpha(theme.palette.success.main, 0.1),
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 32px ${alpha(theme.palette.success.main, 0.15)}`,
                    borderColor: alpha(theme.palette.success.main, 0.3),
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.info.main} 100%)`,
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Person sx={{ color: 'success.main', fontSize: 28 }} />
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                >
                    Created by
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                    src={authorInfo.avatar || ''}
                    alt={authorInfo.fullName || authorInfo.username}
                    sx={{
                        width: { xs: 56, sm: 64 },
                        height: { xs: 56, sm: 64 },
                        border: '3px solid',
                        borderColor: alpha(theme.palette.success.main, 0.2)
                    }}
                >
                    {(authorInfo.fullName || authorInfo.username)?.[0]?.toUpperCase()}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {authorInfo.fullName || authorInfo.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        @{authorInfo.username}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            label={authorInfo.experienceLevel || 'Beginner'}
                            size="small"
                            sx={{
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                color: 'success.main',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                border: '1px solid',
                                borderColor: alpha(theme.palette.success.main, 0.2)
                            }}
                        />
                        {authorInfo.isEmailVerified && (
                            <Chip
                                label="Verified"
                                size="small"
                                sx={{
                                    bgcolor: alpha(theme.palette.info.main, 0.1),
                                    color: 'info.main',
                                    fontWeight: 600,
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.info.main, 0.2)
                                }}
                            />
                        )}
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PersonAdd />}
                    sx={{
                        borderRadius: 2,
                        borderColor: alpha(theme.palette.success.main, 0.3),
                        color: 'success.main',
                        '&:hover': {
                            borderColor: 'success.main',
                            bgcolor: alpha(theme.palette.success.main, 0.1)
                        }
                    }}
                >
                    Follow
                </Button>
            </Box>
        </Paper>
    );
};

/**
 * 🎯 Reviews Section Component
 */
interface ReviewsSectionProps {
    workoutId: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = () => {
    const theme = useTheme();

    // Mock reviews data - replace with actual API call
    const mockReviews = [
        {
            id: '1',
            userName: 'Sarah Johnson',
            userAvatar: '',
            rating: 5,
            comment: 'Amazing workout! Really helped me build strength and endurance.',
            date: new Date('2024-01-15'),
            helpful: 12
        },
        {
            id: '2',
            userName: 'Mike Chen',
            userAvatar: '',
            rating: 4,
            comment: 'Great exercises but a bit challenging for beginners.',
            date: new Date('2024-01-10'),
            helpful: 8
        }
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.grey[50], 0.98)} 100%)`,
                border: '2px solid',
                borderColor: alpha(theme.palette.secondary.main, 0.1),
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 32px ${alpha(theme.palette.secondary.main, 0.15)}`,
                    borderColor: alpha(theme.palette.secondary.main, 0.3),
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.warning.main} 100%)`,
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Rating value={5} readOnly size="small" sx={{ color: 'warning.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Reviews ({mockReviews.length})
                </Typography>
            </Box>

            <Stack spacing={3}>
                {mockReviews.map((review) => (
                    <Box key={review.id}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                            <Avatar sx={{ width: 40, height: 40 }}>
                                {review.userName[0]}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {review.userName}
                                    </Typography>
                                    <Rating value={review.rating} readOnly size="small" />
                                    <Typography variant="caption" color="text.secondary">
                                        {review.date.toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {review.comment}
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<ThumbUp />}
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Helpful ({review.helpful})
                                </Button>
                            </Box>
                        </Box>
                        <Divider />
                    </Box>
                ))}
            </Stack>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button variant="outlined" sx={{ borderRadius: 2 }}>
                    Write a Review
                </Button>
            </Box>
        </Paper>
    );
};

/**
 * 🎯 Related Workouts Card Component
 */
// const RelatedWorkoutsCard: React.FC = () => {
//     // Mock related workouts - replace with actual API call
//     const mockRelatedWorkouts = [
//         {
//             id: '1',
//             name: 'Upper Body Strength',
//             thumbnail: '/fitness_2262746.png',
//             duration: 45,
//             difficulty: 'Intermediate'
//         },
//         {
//             id: '2',
//             name: 'Core Crusher',
//             thumbnail: '/fitness_2262746.png',
//             duration: 30,
//             difficulty: 'Advanced'
//         }
//     ];

//     return (
//         <Paper
//             elevation={2}
//             sx={{
//                 p: 3,
//                 borderRadius: 3,
//                 background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.02) 0%, rgba(33, 150, 243, 0.02) 100%)',
//                 border: '1px solid rgba(76, 175, 80, 0.1)'
//             }}
//         >
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
//                 <FitnessCenter sx={{ color: 'success.main', fontSize: 24 }} />
//                 <Typography variant="h6" sx={{ fontWeight: 700 }}>
//                     Related Workouts
//                 </Typography>
//             </Box>

//             <Stack spacing={2}>
//                 {mockRelatedWorkouts.map((workout) => (
//                     <Card key={workout.id} sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
//                         <Box sx={{ display: 'flex' }}>
//                             <CardMedia
//                                 component="img"
//                                 sx={{ width: 80, height: 80 }}
//                                 image={workout.thumbnail}
//                                 alt={workout.name}
//                             />
//                             <CardContent sx={{ flex: 1, p: 2, '&:last-child': { pb: 2 } }}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
//                                     {workout.name}
//                                 </Typography>
//                                 <Stack direction="row" spacing={2} alignItems="center">
//                                     <Typography variant="caption" color="text.secondary">
//                                         {workout.duration} mins
//                                     </Typography>
//                                     <Typography variant="caption" color="text.secondary">
//                                         {workout.difficulty}
//                                     </Typography>
//                                 </Stack>
//                             </CardContent>
//                         </Box>
//                     </Card>
//                 ))}
//             </Stack>
//         </Paper>
//     );
// };

export default WorkoutDetailPage;
