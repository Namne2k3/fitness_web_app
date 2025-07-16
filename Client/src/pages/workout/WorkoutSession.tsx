/**
 * 🏃 Workout Session Page
 * Giao diện tĩnh hiển thị thông tin workout session
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    LinearProgress,
    AppBar,
    Toolbar,
    IconButton,
    Chip,
    Avatar,
    Paper,
    Stack,
    Divider
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    PlayArrow as PlayIcon,
    Pause as PauseIcon,
    Stop as StopIcon,
    Timer as TimerIcon,
    CheckCircle as CompleteIcon,
    FitnessCenter as ExerciseIcon,
    LocalFireDepartment as CalorieIcon,
    EmojiEvents as TrophyIcon
} from '@mui/icons-material';

// ====================================
// 📊 Mock Data
// ====================================

const mockWorkout = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Full Body Strength Training',
    description: 'A complete workout targeting all major muscle groups',
    difficulty: 'intermediate',
    estimatedDuration: 45,
    exercises: [
        {
            exerciseId: '507f1f77bcf86cd799439012',
            order: 1,
            sets: 3,
            reps: 12,
            weight: 20,
            restTime: 60,
            exerciseInfo: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Push-ups',
                description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
                instructions: [
                    'Start in a plank position with hands shoulder-width apart',
                    'Lower your body until your chest nearly touches the floor',
                    'Push back up to starting position'
                ],
                category: 'strength',
                primaryMuscleGroups: ['chest', 'shoulders', 'triceps'],
                equipment: ['bodyweight'],
                difficulty: 'beginner',
                caloriesPerMinute: 8,
                slug: 'push-ups'
            }
        },
        {
            exerciseId: '507f1f77bcf86cd799439013',
            order: 2,
            sets: 3,
            reps: 10,
            weight: 15,
            restTime: 90,
            exerciseInfo: {
                _id: '507f1f77bcf86cd799439013',
                name: 'Squats',
                description: 'Fundamental lower body exercise targeting legs and glutes',
                instructions: [
                    'Stand with feet shoulder-width apart',
                    'Lower your body by bending knees and hips',
                    'Return to standing position'
                ],
                category: 'strength',
                primaryMuscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
                equipment: ['bodyweight'],
                difficulty: 'beginner',
                caloriesPerMinute: 10,
                slug: 'squats'
            }
        },
        {
            exerciseId: '507f1f77bcf86cd799439014',
            order: 3,
            sets: 3,
            reps: 8,
            weight: 25,
            restTime: 120,
            exerciseInfo: {
                _id: '507f1f77bcf86cd799439014',
                name: 'Dumbbell Rows',
                description: 'Upper body pulling exercise for back and biceps',
                instructions: [
                    'Hold dumbbell in one hand, place other hand on bench',
                    'Pull dumbbell toward your hip',
                    'Lower with control'
                ],
                category: 'strength',
                primaryMuscleGroups: ['back', 'biceps'],
                equipment: ['dumbbell'],
                difficulty: 'intermediate',
                caloriesPerMinute: 7,
                slug: 'dumbbell-rows'
            }
        }
    ]
};

const mockSession = {
    _id: '507f1f77bcf86cd799439015',
    userId: '507f1f77bcf86cd799439016',
    workoutId: '507f1f77bcf86cd799439011',
    startTime: new Date(),
    totalDuration: 1800, // 30 minutes
    pausedDuration: 0,
    currentExerciseIndex: 0,
    totalExercises: 3,
    completedExercises: [],
    totalCaloriesBurned: 150,
    status: 'active',
    completionPercentage: 33,
    createdAt: new Date(),
    updatedAt: new Date()
};

// ====================================
// 📱 Component
// ====================================

const WorkoutSession: React.FC = () => {
    const navigate = useNavigate();

    // Mock current state
    const currentTimer = 1245; // 20:45
    const currentExerciseIndex = 0;
    const currentExercise = mockWorkout.exercises[currentExerciseIndex];
    const sessionStatus = mockSession.status;

    // Helper functions
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgressPercentage = () => {
        return ((currentExerciseIndex + 1) / mockWorkout.exercises.length) * 100;
    };

    const getStatusColor = () => {
        switch (sessionStatus) {
            case 'active':
                return 'success';
            case 'paused':
                return 'warning';
            case 'completed':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusText = () => {
        switch (sessionStatus) {
            case 'active':
                return 'Active';
            case 'paused':
                return 'Paused';
            case 'completed':
                return 'Completed';
            case 'stopped':
                return 'Stopped';
            default:
                return 'Unknown';
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Header */}
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => navigate(-1)}
                        aria-label="back"
                    >
                        <BackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {mockWorkout.name}
                    </Typography>
                    <Chip
                        label={getStatusText()}
                        color={getStatusColor()}
                        size="small"
                        sx={{ color: 'white' }}
                    />
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 3 }}>
                {/* Progress Overview */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Exercise Progress
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {currentExerciseIndex + 1} of {mockWorkout.exercises.length}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={getProgressPercentage()}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                                }
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 3 }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 60,
                                    height: 60,
                                    mx: 'auto',
                                    mb: 2,
                                    bgcolor: 'primary.main'
                                }}
                            >
                                <TimerIcon />
                            </Avatar>
                            <Typography variant="h5" fontWeight="bold" color="primary">
                                {formatTime(currentTimer)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Elapsed Time
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 60,
                                    height: 60,
                                    mx: 'auto',
                                    mb: 2,
                                    bgcolor: 'secondary.main'
                                }}
                            >
                                <CalorieIcon />
                            </Avatar>
                            <Typography variant="h5" fontWeight="bold" color="secondary">
                                {mockSession.totalCaloriesBurned}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Calories Burned
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 60,
                                    height: 60,
                                    mx: 'auto',
                                    mb: 2,
                                    bgcolor: 'success.main'
                                }}
                            >
                                <ExerciseIcon />
                            </Avatar>
                            <Typography variant="h5" fontWeight="bold" color="success.main">
                                {mockSession.completedExercises.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Completed
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 60,
                                    height: 60,
                                    mx: 'auto',
                                    mb: 2,
                                    bgcolor: 'info.main'
                                }}
                            >
                                <TrophyIcon />
                            </Avatar>
                            <Typography variant="h5" fontWeight="bold" color="info.main">
                                {Math.round(mockSession.completionPercentage)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Progress
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Current Exercise */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Current Exercise
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: 'primary.light',
                                    fontSize: '2rem'
                                }}
                            >
                                <ExerciseIcon fontSize="inherit" />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h5" fontWeight="bold">
                                    {currentExercise.exerciseInfo?.name || 'Exercise Name'}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                    {currentExercise.exerciseInfo?.description || 'Exercise description'}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <Chip
                                        label={`${currentExercise.sets} sets`}
                                        variant="outlined"
                                        size="small"
                                    />
                                    <Chip
                                        label={`${currentExercise.reps} reps`}
                                        variant="outlined"
                                        size="small"
                                    />
                                    <Chip
                                        label={`${currentExercise.weight}kg`}
                                        variant="outlined"
                                        size="small"
                                    />
                                    <Chip
                                        label={`${currentExercise.restTime}s rest`}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Stack>
                            </Box>
                        </Box>

                        {/* Instructions */}
                        {currentExercise.exerciseInfo?.instructions && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Instructions:
                                </Typography>
                                {currentExercise.exerciseInfo.instructions.map((instruction, index) => (
                                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                                        {index + 1}. {instruction}
                                    </Typography>
                                ))}
                            </Box>
                        )}

                        {/* Muscle Groups */}
                        {currentExercise.exerciseInfo?.primaryMuscleGroups && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Primary Muscle Groups:
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {currentExercise.exerciseInfo.primaryMuscleGroups.map((muscle, index) => (
                                        <Chip
                                            key={index}
                                            label={muscle}
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        <Divider sx={{ my: 2 }} />

                        {/* Control Buttons */}
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={sessionStatus === 'active' ? <PauseIcon /> : <PlayIcon />}
                                color={sessionStatus === 'active' ? 'warning' : 'primary'}
                                sx={{ minWidth: 120 }}
                            >
                                {sessionStatus === 'active' ? 'Pause' : 'Resume'}
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<CompleteIcon />}
                                color="success"
                                sx={{ minWidth: 120 }}
                            >
                                Complete Set
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<StopIcon />}
                                color="error"
                                sx={{ minWidth: 120 }}
                            >
                                Stop Workout
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {/* All Exercises List */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Workout Exercises
                        </Typography>

                        {mockWorkout.exercises.map((exercise, index) => (
                            <Paper
                                key={exercise.exerciseId}
                                elevation={1}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    border: index === currentExerciseIndex ? '2px solid' : '1px solid',
                                    borderColor: index === currentExerciseIndex ? 'primary.main' : 'divider',
                                    bgcolor: index === currentExerciseIndex ? 'primary.50' : 'background.paper'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: index === currentExerciseIndex ? 'primary.main' : 'grey.400',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {index + 1}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {exercise.exerciseInfo?.name || `Exercise ${index + 1}`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {exercise.sets} sets × {exercise.reps} reps
                                            {exercise.weight && ` × ${exercise.weight}kg`}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Rest: {exercise.restTime}s
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {exercise.exerciseInfo?.caloriesPerMinute || 0} cal/min
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default WorkoutSession;
