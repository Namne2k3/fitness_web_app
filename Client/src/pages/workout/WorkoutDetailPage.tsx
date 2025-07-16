import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Stack
} from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Hooks
import { useWorkout } from '../../hooks/useWorkoutData';

// Components
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Avatar, Badge, IconButton, Paper, Tooltip, Typography } from '@mui/material';

import {
    WorkoutDetailSkeleton
} from '../../components/workout/detail';
import { ExerciseFull, WorkoutExercise } from '../../types';

/**
 * 🎯 Main WorkoutDetailPage Component
 */
const WorkoutDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // const theme = useTheme();

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

    const handleStartWorkout = () => {
        navigate(`/workouts/${id}/start`);
    }

    // --- UI inspired by WorkoutDetailExample.tsx ---
    return (
        <Box sx={{ minHeight: '100vh', mt: '6rem' }}>
            {/* Header - sticky, white, shadow */}
            <Box component="header">
                <Container maxWidth="lg" sx={{ py: 2, px: 2 }}>
                    <Box
                        onClick={() => navigate('/workouts')}
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            fontWeight: 500,
                            color: '#1976d2',
                            fontSize: '1.05rem',
                            px: 1,
                            py: 0.5,
                            borderRadius: 2,
                            transition: 'background 0.18s, color 0.18s',
                            '&:hover, &:focus': {
                                background: 'rgba(25,118,210,0.07)',
                                color: '#0d47a1',
                                textDecoration: 'none',
                                outline: 'none',
                            },
                        }}
                        tabIndex={0}
                        role="link"
                        aria-label="Back to Workouts"
                        onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                navigate('/workouts');
                            }
                        }}
                    >
                        <span style={{ marginRight: 8 }}>&larr;</span> Back to Workouts
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', lg: 'row' },
                        alignItems: 'flex-start',
                        gap: 6,
                        position: 'relative',
                    }}
                >
                    {/* Sidebar - now on the left, sticky on desktop */}
                    <Box
                        sx={{
                            width: { xs: '100%', lg: 340 },
                            flexShrink: 0,
                            position: { lg: 'sticky' },
                            top: { lg: '7.5rem' },
                            alignSelf: { lg: 'flex-start' },
                            zIndex: 2,
                            mb: { xs: 4, lg: 0 },
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            maxHeight: { lg: 'calc(100vh - 8rem)' },
                            overflowY: { lg: 'auto' },
                        }}
                    >
                        {/* Start Workout */}
                        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff', p: 3 }}>
                            <Box sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>Ready to Start?</Box>
                            <Button onClick={handleStartWorkout} variant="contained" color="primary" size="large" sx={{ width: '100%', mb: 2, fontWeight: 700 }}>
                                ▶ Start Workout
                            </Button>
                            <Stack spacing={1} sx={{ color: '#666', fontSize: '1rem' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><span>Duration:</span><span style={{ fontWeight: 600 }}>{workout.estimatedDuration} min</span></Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><span>Calories:</span><span style={{ fontWeight: 600 }}>{workout.caloriesBurned} kcal</span></Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><span>Exercises:</span><span style={{ fontWeight: 600 }}>{workout.exercises?.length || 0}</span></Box>
                            </Stack>
                        </Box>

                        {/* Stats - beautiful icons */}
                        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff', p: 3 }}>
                            <Box sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>Workout Stats</Box>
                            <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#e3f2fd', width: 32, height: 32 }}>
                                        <VisibilityIcon color="primary" fontSize="small" />
                                    </Avatar>
                                    <Box flex={1} color="#888">Views</Box>
                                    <Box fontWeight={700}>{workout.views?.toLocaleString?.() || 0}</Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#ffebee', width: 32, height: 32 }}>
                                        <FavoriteIcon color="error" fontSize="small" />
                                    </Avatar>
                                    <Box flex={1} color="#e53935">Likes</Box>
                                    <Box fontWeight={700}>{workout.likeCount}</Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#fff3e0', width: 32, height: 32 }}>
                                        <BookmarkIcon color="primary" fontSize="small" />
                                    </Avatar>
                                    <Box flex={1} color="#1976d2">Saves</Box>
                                    <Box fontWeight={700}>{workout.saveCount}</Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#e8f5e8', width: 32, height: 32 }}>
                                        <StarIcon color="success" fontSize="small" />
                                    </Avatar>
                                    <Box flex={1} color="#43a047">Rating</Box>
                                    <Box fontWeight={700}>{workout.averageRating} ({workout.totalRatings})</Box>
                                </Box>
                            </Stack>
                        </Box>

                        {/* Equipment Needed */}
                        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff', p: 3 }}>
                            <Box sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>Equipment Needed</Box>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {workout.equipment?.map((item: string) => (
                                    <Box key={item} sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: '#fff3e0', color: '#f57c00', fontWeight: 600, fontSize: '0.97rem', border: '1px solid #ffe0b2', textTransform: 'capitalize', mb: 1 }}>{item.replace('_', ' ')}</Box>
                                ))}
                            </Stack>
                        </Box>

                        {/* Muscle Groups */}
                        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff', p: 3 }}>
                            <Box sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>Muscle Groups</Box>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {workout.muscleGroups?.map((muscle: string) => (
                                    <Box key={muscle} sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: '#f3e5f5', color: '#7b1fa2', fontWeight: 600, fontSize: '0.97rem', border: '1px solid #e1bee7', textTransform: 'capitalize', mb: 1 }}>{muscle.replace('_', ' ')}</Box>
                                ))}
                            </Stack>
                        </Box>
                    </Box>

                    {/* Main Content - now on the right, scrollable independently */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {/* Hero Image */}
                        <Box sx={{
                            aspectRatio: '16/9',
                            background: '#e3e6ea',
                            borderRadius: 3,
                            overflow: 'hidden',
                            mb: 3
                        }}>
                            <img
                                crossOrigin='anonymous'
                                src={workout.thumbnail || '/placeholder.svg'}
                                alt={workout.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>

                        {/* Workout Info */}
                        <Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    alignItems: { md: 'center' },
                                    justifyContent: { xs: 'flex-start', md: 'space-between' },
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 3,
                                    p: 3,
                                    mb: 3,
                                    backgroundColor: '#fff',
                                    gap: 2,
                                }}
                            >
                                {/* Left: Avatar + Author Info */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                    <Avatar
                                        src={workout.authorInfo?.avatar || ''}
                                        alt={workout.authorInfo?.fullName || workout.authorInfo?.username}
                                        sx={{ width: 56, height: 56, border: '2px solid #e3f2fd' }}
                                    >
                                        {(workout.authorInfo?.fullName || workout.authorInfo?.username)?.[0]?.toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography fontWeight={700} fontSize="1.1rem" color="#1976d2">
                                            {workout.authorInfo?.fullName || workout.authorInfo?.username}
                                        </Typography>
                                        <Typography fontSize="0.95rem" color="text.secondary">
                                            @{workout.authorInfo?.username}
                                        </Typography>
                                        <Stack direction="row" spacing={1} mt={0.5}>
                                            {workout.authorInfo?.experienceLevel && (
                                                <Chip
                                                    label={workout.authorInfo.experienceLevel}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#e8f5e8',
                                                        color: '#388e3c',
                                                        fontWeight: 600,
                                                        border: '1px solid #c8e6c9',
                                                        textTransform: 'capitalize',
                                                    }}
                                                />
                                            )}
                                            {workout.authorInfo?.isEmailVerified && (
                                                <Chip
                                                    label="Verified"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#e3f2fd',
                                                        color: '#1976d2',
                                                        fontWeight: 600,
                                                        border: '1px solid #bbdefb',
                                                    }}
                                                />
                                            )}
                                        </Stack>
                                    </Box>
                                </Box>

                                {/* Right: Workout Info + Social Actions (right-aligned) */}
                                <Box
                                    sx={{
                                        flex: 2,
                                        mt: { xs: 2, md: 0 },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: { xs: 'flex-start', md: 'flex-end' },
                                        textAlign: { xs: 'left', md: 'right' },
                                    }}
                                >
                                    <Typography
                                        variant="h1"
                                        sx={{ fontSize: '1.8rem', fontWeight: 800, color: '#222', mb: 1 }}
                                    >
                                        {workout.name}
                                    </Typography>

                                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                        {/* Difficulty */}
                                        <Chip
                                            label={workout.difficulty}
                                            size="small"
                                            sx={{
                                                bgcolor:
                                                    workout.difficulty === 'beginner'
                                                        ? '#e8f5e8'
                                                        : workout.difficulty === 'intermediate'
                                                            ? '#e3f2fd'
                                                            : '#ffebee',
                                                color:
                                                    workout.difficulty === 'beginner'
                                                        ? '#388e3c'
                                                        : workout.difficulty === 'intermediate'
                                                            ? '#1976d2'
                                                            : '#d32f2f',
                                                fontWeight: 600,
                                                border: '1px solid #e0e0e0',
                                                textTransform: 'capitalize',
                                            }}
                                        />

                                        {/* Category */}
                                        <Chip
                                            label={workout.category}
                                            size="small"
                                            sx={{
                                                bgcolor: '#fff3e0',
                                                color: '#f57c00',
                                                fontWeight: 600,
                                                border: '1px solid #ffe0b2',
                                                textTransform: 'capitalize',
                                            }}
                                        />

                                        {/* Tags */}
                                        {workout.tags?.slice(0, 2).map((tag) => (
                                            <Chip
                                                key={tag}
                                                label={tag}
                                                size="small"
                                                sx={{
                                                    bgcolor: '#f3e5f5',
                                                    color: '#7b1fa2',
                                                    fontWeight: 500,
                                                    border: '1px solid #e1bee7',
                                                    textTransform: 'capitalize',
                                                }}
                                            />
                                        ))}
                                    </Stack>

                                    {/* Social Actions */}
                                    <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                        <Tooltip title="Like">
                                            <IconButton
                                                sx={{
                                                    transition: 'all 0.2s',
                                                    '&:hover': { bgcolor: 'rgba(244,67,54,0.12)' },
                                                    border: '1.5px solid',
                                                    borderColor: 'grey.200',
                                                    borderRadius: 2,
                                                    minWidth: 44,
                                                    minHeight: 44,
                                                }}
                                            >
                                                <Badge badgeContent={workout.likeCount} color="error" max={999}>
                                                    <FavoriteIcon fontSize="medium" />
                                                </Badge>
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Bookmark">
                                            <IconButton
                                                sx={{
                                                    transition: 'all 0.2s',
                                                    '&:hover': { bgcolor: 'rgba(25,118,210,0.12)' },
                                                    border: '1.5px solid',
                                                    borderColor: 'grey.200',
                                                    borderRadius: 2,
                                                    minWidth: 44,
                                                    minHeight: 44,
                                                }}
                                            >
                                                <Badge badgeContent={workout.saveCount} color="primary" max={999}>
                                                    <BookmarkIcon fontSize="medium" />
                                                </Badge>
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Share">
                                            <IconButton
                                                sx={{
                                                    transition: 'all 0.2s',
                                                    '&:hover': { bgcolor: 'rgba(255,152,0,0.12)' },
                                                    border: '1.5px solid',
                                                    borderColor: 'warning.main',
                                                    borderRadius: 2,
                                                    minWidth: 44,
                                                    minHeight: 44,
                                                }}
                                            >
                                                <ShareIcon fontSize="medium" color="warning" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                            </Box>


                            {/* Creator Info */}
                            {/* <AuthorInfoCard workout={workout} /> */}

                            {/* Workout Description - TrackMe UI with modern hover/focus effect */}
                            {/* <Box
                                sx={{
                                    mt: 3,
                                    borderRadius: 3,
                                    transition: 'box-shadow 0.25s cubic-bezier(.4,0,.2,1), border-color 0.2s, transform 0.25s cubic-bezier(.4,0,.2,1)',
                                    boxShadow: '0 2px 8px rgba(25,118,210,0.04)',
                                    border: '1px solid #e3f2fd',
                                    background: '#fff',
                                    position: 'relative',
                                    outline: 'none',
                                    '&:hover, &:focus-within': {
                                        boxShadow: '0 8px 32px rgba(25,118,210,0.16)',
                                        borderColor: '#1976d2',
                                        transform: 'translateY(-2px) scale(1.012)',
                                    },
                                }}
                                tabIndex={0}
                                role="region"
                                aria-label="Workout description"
                            >
                                <WorkoutDescriptionCard
                                    description={workout.description || ''}
                                    caloriesBurned={workout.caloriesBurned}
                                    estimatedDuration={workout.estimatedDuration}
                                />
                            </Box> */}

                            <Box sx={{ my: 3 }} />

                            {/* Exercises List - All inside one Paper */}
                            <Paper
                                elevation={2}
                                sx={{
                                    borderRadius: 4,
                                    p: { xs: 2, sm: 3 },
                                    background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
                                    border: '1.5px solid #e3f2fd',
                                    boxShadow: '0 4px 24px rgba(25,118,210,0.08)',
                                    mb: 2
                                }}
                            >
                                <Box component="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 3, color: '#1976d2', letterSpacing: 0.5 }}>
                                    Exercises ({workout.exercises?.length || 0})
                                </Box>
                                <Stack spacing={2}>
                                    {(workout.exercises as Array<WorkoutExercise>)?.map((exercise) => {
                                        const info = exercise.exerciseInfo as ExerciseFull | undefined;
                                        console.log("Check info >>> ", info);

                                        const gifUrl = info?.gifUrl || '/placeholder.svg';
                                        // Tooltip wraps the whole item if note exists, otherwise no tooltip
                                        const ExerciseItem = (
                                            <Box
                                                key={exercise.exerciseId}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => navigate(`/exercises/${exercise.exerciseId}`)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        navigate(`/exercises/${exercise.exerciseId}`);
                                                    }
                                                }}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: { xs: 'column', sm: 'row' },
                                                    alignItems: { xs: 'stretch', sm: 'flex-start' },
                                                    gap: 3,
                                                    borderRadius: 3,
                                                    p: { xs: 1.5, sm: 2 },
                                                    background: '#fff',
                                                    boxShadow: '0 2px 8px rgba(25,118,210,0.04)',
                                                    border: '1px solid #e3f2fd',
                                                    cursor: 'pointer',
                                                    transition: 'box-shadow 0.25s cubic-bezier(.4,0,.2,1), border-color 0.2s, transform 0.25s cubic-bezier(.4,0,.2,1)',
                                                    outline: 'none',
                                                    position: 'relative',
                                                    '&:hover, &:focus': {
                                                        boxShadow: '0 8px 32px rgba(25,118,210,0.16)',
                                                        borderColor: '#1976d2',
                                                        transform: 'translateY(-2px) scale(1.012)',
                                                    },
                                                }}
                                            >
                                                {/* Note icon at top-right if note exists */}
                                                {exercise.notes && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 10,
                                                            right: 10,
                                                            zIndex: 3,
                                                            pointerEvents: 'none',
                                                        }}
                                                    >
                                                        <Box sx={{
                                                            bgcolor: '#fffde7',
                                                            border: '1.5px solid #ffe082',
                                                            borderRadius: '50%',
                                                            width: 28,
                                                            height: 28,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#fbc02d',
                                                            fontWeight: 900,
                                                            fontSize: 20,
                                                            boxShadow: '0 2px 8px rgba(255,193,7,0.10)',
                                                        }}>
                                                            !
                                                        </Box>
                                                    </Box>
                                                )}
                                                {/* Large GIF image */}
                                                <Box sx={{
                                                    width: { xs: '100%', sm: 220 },
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    bgcolor: '#f8f9ff',
                                                    mr: { sm: 2 },
                                                    mb: { xs: 2, sm: 0 },
                                                    flexShrink: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'relative',
                                                }}>
                                                    <img
                                                        src={gifUrl}
                                                        alt={info?.name ?? 'Exercise'}
                                                        style={{
                                                            width: 'auto',
                                                            height: '100%',
                                                            maxWidth: '100%',
                                                            maxHeight: '100%',
                                                            objectFit: 'contain',
                                                            display: 'block',
                                                            borderRadius: 12,
                                                        }}
                                                        loading="lazy"
                                                    />
                                                </Box>
                                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <FitnessCenterIcon sx={{ color: '#1976d2', fontSize: 22 }} />
                                                        <Typography variant="h6" fontWeight={700} sx={{ color: '#1976d2' }}>
                                                            {info?.name}
                                                        </Typography>
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#757575',
                                                            fontStyle: 'italic',
                                                            mb: 2,
                                                            fontSize: '1rem',
                                                            transition: 'color 0.2s',
                                                            ...(info?.description && {
                                                                '&:hover': {
                                                                    color: '#1976d2',
                                                                }
                                                            })
                                                        }}
                                                    >
                                                        {info?.description}
                                                    </Typography>
                                                    {/* Badges row */}
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1 }}>
                                                        <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 600, fontSize: '0.97rem', border: '1px solid #bbdefb' }}>
                                                            Sets: {exercise.sets}
                                                        </Box>
                                                        {exercise.reps !== undefined && (
                                                            <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: '#e8f5e8', color: '#388e3c', fontWeight: 600, fontSize: '0.97rem', border: '1px solid #c8e6c9' }}>
                                                                Reps: {exercise.reps}
                                                            </Box>
                                                        )}
                                                        {exercise.duration !== undefined && (
                                                            <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: '#fff3e0', color: '#f57c00', fontWeight: 600, fontSize: '0.97rem', border: '1px solid #ffe0b2' }}>
                                                                Duration: {exercise.duration}s
                                                            </Box>
                                                        )}
                                                        {exercise.weight !== undefined && (
                                                            <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: '#ffebee', color: '#d32f2f', fontWeight: 600, fontSize: '0.97rem', border: '1px solid #ffcdd2' }}>
                                                                Weight: {exercise.weight}kg
                                                            </Box>
                                                        )}
                                                        {exercise.restTime !== undefined && (
                                                            <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: '#ede7f6', color: '#7b1fa2', fontWeight: 600, fontSize: '0.97rem', border: '1px solid #d1c4e9' }}>
                                                                Rest: {exercise.restTime}s
                                                            </Box>
                                                        )}
                                                    </Box>
                                                    {/* --- NEW: Muscle Groups & Equipment badges row --- */}
                                                    {(info?.primaryMuscleGroups?.length || info?.secondaryMuscleGroups?.length || info?.equipment?.length) && (
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1, mt: 0.5 }}>
                                                            {/* Muscle Groups: Ẩn trên màn hình tablet trở xuống */}
                                                            {info?.primaryMuscleGroups?.map((muscle) => (
                                                                <Box
                                                                    key={muscle}
                                                                    sx={{
                                                                        px: 1.2,
                                                                        py: 0.4,
                                                                        borderRadius: 2,
                                                                        bgcolor: '#f3e5f5',
                                                                        color: '#7b1fa2',
                                                                        fontWeight: 600,
                                                                        fontSize: '0.93rem',
                                                                        border: '1px solid #e1bee7',
                                                                        textTransform: 'capitalize',
                                                                        display: { xs: 'none', md: 'inline-flex' },
                                                                    }}
                                                                >
                                                                    💪 {muscle.replace('_', ' ')}
                                                                </Box>
                                                            ))}
                                                            {/* {info?.secondaryMuscleGroups?.map((muscle) => (
                                                                <Box key={muscle} sx={{ px: 1.2, py: 0.4, borderRadius: 2, bgcolor: '#ede7f6', color: '#512da8', fontWeight: 500, fontSize: '0.91rem', border: '1px solid #d1c4e9', textTransform: 'capitalize' }}>
                                                                    🦾 {muscle.replace('_', ' ')}
                                                                </Box>
                                                            ))} */}
                                                            {/* Equipment */}
                                                            {/* {info?.equipment?.map((eq) => (
                                                                <Box key={eq} sx={{ px: 1.2, py: 0.4, borderRadius: 2, bgcolor: '#fff3e0', color: '#f57c00', fontWeight: 600, fontSize: '0.93rem', border: '1px solid #ffe0b2', textTransform: 'capitalize' }}>
                                                                    🏋️ {eq.replace('_', ' ')}
                                                                </Box>
                                                            ))} */}
                                                        </Box>
                                                    )}
                                                    {/* --- END Muscle Groups & Equipment badges row --- */}
                                                </Box>
                                            </Box>
                                        );
                                        return exercise.notes ? (
                                            <Tooltip
                                                key={exercise.exerciseId}
                                                disableInteractive={false}
                                                title={
                                                    <Box sx={{
                                                        p: 1.2,
                                                        bgcolor: '#fffde7',
                                                        border: '1px solid #ffe082',
                                                        borderRadius: 1,
                                                        fontSize: '0.97rem',
                                                        fontStyle: 'italic',
                                                        color: '#a1887f',
                                                        maxWidth: 320,
                                                        whiteSpace: 'pre-line',
                                                    }}>
                                                        <b>Note:</b> {exercise.notes}
                                                    </Box>
                                                }
                                                arrow
                                                placement="top"
                                                enterDelay={200}
                                            >
                                                {ExerciseItem}
                                            </Tooltip>
                                        ) : ExerciseItem;
                                    })}
                                </Stack>
                            </Paper>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default WorkoutDetailPage;
