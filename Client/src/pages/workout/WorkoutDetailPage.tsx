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
    Grid,
    Card,
    CardContent,
    CardMedia,
    Skeleton,
    Alert,
    Stack,
    Rating,
    Divider,
    Tooltip,
    CircularProgress
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
    VerifiedUser
} from '@mui/icons-material';

// Hooks
import { useWorkout } from '../../hooks/useWorkoutData';

// Types
import { Workout, WorkoutExercise } from '../../types/workout.interface';

/**
 * 🎯 Main WorkoutDetailPage Component
 */
const WorkoutDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // ✅ React Query hook để fetch workout data
    const {
        data: workout,
        isLoading,
        error,
        isError
    } = useWorkout(id || '');

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
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            {/* Header Section */}
            <WorkoutHeader workout={workout} onBack={() => navigate(-1)} />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={4}>
                    {/* Main Content */}
                    <Grid item xs={12} lg={8}>
                        <Stack spacing={4}>
                            {/* Workout Info Card */}
                            <WorkoutInfoCard workout={workout} />

                            {/* Exercises List */}
                            <ExercisesList exercises={workout.exercises} />

                            {/* Reviews Section */}
                            <ReviewsSection workoutId={workout._id} />
                        </Stack>
                    </Grid>

                    {/* Sidebar */}
                    <Grid item xs={12} lg={4}>
                        <Stack spacing={3}>
                            {/* Quick Stats */}
                            <QuickStatsCard workout={workout} />

                            {/* Author Info */}
                            <AuthorInfoCard workout={workout} />

                            {/* Related Workouts */}
                            <RelatedWorkoutsCard />
                        </Stack>
                    </Grid>
                </Grid>
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
            <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                    <Stack spacing={4}>
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                    </Stack>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Stack spacing={3}>
                        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                    </Stack>
                </Grid>
            </Grid>
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
                background: 'linear-gradient(135deg, #1976d2 0%, #ff9800 100%)',
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
                    opacity: 0.1,
                    zIndex: 0
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4 }}>
                    {/* Back Button */}
                    <IconButton
                        onClick={onBack}
                        sx={{
                            color: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
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
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
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
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
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
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                                }}
                            >
                                <Share />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>

                <Grid container spacing={4} alignItems="center">
                    {/* Workout Image */}
                    <Grid item xs={12} md={4}>
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
                    </Grid>

                    {/* Workout Info */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={3}>
                            {/* Tags */}
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Chip
                                    label={workout.category}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        fontWeight: 600
                                    }}
                                />
                                <Chip
                                    label={workout.difficulty}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        fontWeight: 600
                                    }}
                                />
                                {workout.isSponsored && (
                                    <Chip
                                        label="Sponsored"
                                        size="small"
                                        icon={<VerifiedUser sx={{ fontSize: 16 }} />}
                                        sx={{
                                            bgcolor: 'rgba(255, 152, 0, 0.9)',
                                            color: 'white',
                                            fontWeight: 600
                                        }}
                                    />
                                )}
                            </Stack>

                            {/* Title */}
                            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
                                {workout.name}
                            </Typography>

                            {/* Description */}
                            <Typography variant="h6" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                                {workout.description}
                            </Typography>

                            {/* Quick Stats */}
                            <Stack direction="row" spacing={4} flexWrap="wrap">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTime />
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {workout.estimatedDuration} mins
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocalFireDepartment />
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {workout.caloriesBurned} cal
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ThumbUp />
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {workout.likeCount} likes
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Visibility />
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
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        color: '#1976d2',
                                        fontWeight: 700,
                                        py: 1.5,
                                        px: 4,
                                        '&:hover': {
                                            bgcolor: 'white',
                                            transform: 'scale(1.02)'
                                        }
                                    }}
                                >
                                    Start Workout
                                </Button>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
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

const WorkoutInfoCard: React.FC<WorkoutInfoCardProps> = ({ workout }) => (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Workout Details
        </Typography>

        <Grid container spacing={3}>
            {/* Muscle Groups */}
            <Grid item xs={12} md={6}>
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
            </Grid>

            {/* Equipment */}
            <Grid item xs={12} md={6}>
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
            </Grid>

            {/* Tags */}
            {workout.tags.length > 0 && (
                <Grid item xs={12}>
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
                </Grid>
            )}
        </Grid>
    </Paper>
);

/**
 * 🎯 Exercises List Component
 */
interface ExercisesListProps {
    exercises: WorkoutExercise[];
}

const ExercisesList: React.FC<ExercisesListProps> = ({ exercises }) => (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Exercises ({exercises.length})
        </Typography>

        <Stack spacing={2}>
            {exercises.map((exercise, index) => (
                <Card key={index} variant="outlined" sx={{ transition: 'all 0.2s' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3} alignItems="center">
                            {/* Exercise Number */}
                            <Grid item>
                                <Avatar
                                    sx={{
                                        bgcolor: 'primary.main',
                                        width: 40,
                                        height: 40,
                                        fontWeight: 700
                                    }}
                                >
                                    {exercise.order || index + 1}
                                </Avatar>
                            </Grid>

                            {/* Exercise Info */}
                            <Grid item xs>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {exercise.exerciseId?.name || `Exercise ${index + 1}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {exercise.exerciseId?.description || 'No description available'}
                                </Typography>

                                {/* Exercise Stats */}
                                <Stack direction="row" spacing={3} flexWrap="wrap">
                                    {exercise.sets && (
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            <strong>Sets:</strong> {exercise.sets}
                                        </Typography>
                                    )}
                                    {exercise.reps && (
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            <strong>Reps:</strong> {exercise.reps}
                                        </Typography>
                                    )}
                                    {exercise.duration && (
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            <strong>Duration:</strong> {exercise.duration}s
                                        </Typography>
                                    )}
                                    {exercise.weight && (
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            <strong>Weight:</strong> {exercise.weight}kg
                                        </Typography>
                                    )}
                                    {exercise.restTime && (
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            <strong>Rest:</strong> {exercise.restTime}s
                                        </Typography>
                                    )}
                                </Stack>

                                {/* Notes */}
                                {exercise.notes && (
                                    <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                                        Note: {exercise.notes}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    </Paper>
);

/**
 * 🎯 Quick Stats Card Component
 */
interface QuickStatsCardProps {
    workout: Workout;
}

const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ workout }) => (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Quick Stats
        </Typography>

        <Stack spacing={3}>
            {/* Rating */}
            <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={workout.averageRating} readOnly precision={0.1} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {workout.averageRating.toFixed(1)} ({workout.totalRatings})
                    </Typography>
                </Box>
            </Box>

            <Divider />

            {/* Stats Grid */}
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {workout.views}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Views
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                            {workout.completions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Completions
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                            {workout.likeCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Likes
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                            {workout.saveCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Saves
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Stack>
    </Paper>
);

/**
 * 🎯 Author Info Card Component
 */
interface AuthorInfoCardProps {
    workout: Workout;
}

const AuthorInfoCard: React.FC<AuthorInfoCardProps> = ({ workout }) => {
    const author = workout.userId;

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                Created by
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                    src={author?.profile?.avatar}
                    sx={{ width: 56, height: 56 }}
                >
                    {author?.profile?.firstName?.[0] || author?.username?.[0] || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {author?.profile?.firstName && author?.profile?.lastName
                            ? `${author.profile.firstName} ${author.profile.lastName}`
                            : author?.username || 'Unknown User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {author?.profile?.experienceLevel || 'Fitness Enthusiast'}
                    </Typography>
                    {author?.isEmailVerified && (
                        <Chip
                            label="Verified"
                            size="small"
                            icon={<VerifiedUser sx={{ fontSize: 16 }} />}
                            sx={{ mt: 1, height: 20 }}
                        />
                    )}
                </Box>
            </Box>

            <Button
                variant="outlined"
                fullWidth
                sx={{ borderRadius: 2 }}
            >
                View Profile
            </Button>
        </Paper>
    );
};

/**
 * 🎯 Reviews Section Component
 */
interface ReviewsSectionProps {
    workoutId: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ workoutId }) => {
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
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                Reviews ({mockReviews.length})
            </Typography>

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
const RelatedWorkoutsCard: React.FC = () => {
    // Mock related workouts - replace with actual API call
    const mockRelatedWorkouts = [
        {
            id: '1',
            name: 'Upper Body Strength',
            thumbnail: '/fitness_2262746.png',
            duration: 45,
            difficulty: 'Intermediate'
        },
        {
            id: '2',
            name: 'Core Crusher',
            thumbnail: '/fitness_2262746.png',
            duration: 30,
            difficulty: 'Advanced'
        }
    ];

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                Related Workouts
            </Typography>

            <Stack spacing={2}>
                {mockRelatedWorkouts.map((workout) => (
                    <Card key={workout.id} sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                        <Box sx={{ display: 'flex' }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 80, height: 80 }}
                                image={workout.thumbnail}
                                alt={workout.name}
                            />
                            <CardContent sx={{ flex: 1, p: 2, '&:last-child': { pb: 2 } }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                    {workout.name}
                                </Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="caption" color="text.secondary">
                                        {workout.duration} mins
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {workout.difficulty}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Box>
                    </Card>
                ))}
            </Stack>
        </Paper>
    );
};

export default WorkoutDetailPage;
