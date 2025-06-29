/**
 * 🏋️ WorkoutSelectionModal - React 19 Implementation
 * Modal để chọn/tạo workout khi add exercise từ ExercisePage
 */

import React, { useState, useActionState } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Alert,
    Chip,
    Stack,
    IconButton,
    CircularProgress,
    Avatar,
    Paper,
    useTheme,
    alpha,
    Checkbox
} from '@mui/material';
import {
    Close as CloseIcon,
    Add as AddIcon,
    FitnessCenter as FitnessCenterIcon,
    Timer as TimerIcon,
    CheckCircle as CheckIcon,
    PlayArrow as PlayIcon,
    LocalFireDepartment as FireIcon
} from '@mui/icons-material';
import { Exercise, Workout, DifficultyLevel } from '../../types';

// ================================
// 🎯 Types & Interfaces
// ================================
interface WorkoutSelectionModalProps {
    exercise: Exercise | null;
    isOpen: boolean;
    onClose: () => void;
    onWorkoutSelected?: (workoutId: string) => void;
}

interface AddToWorkoutState {
    success: boolean;
    error: string | null;
    workoutId: string | null;
    isProcessing: boolean;
}

interface QuickWorkoutState {
    success: boolean;
    error: string | null;
    workout: Workout | null;
    isProcessing: boolean;
}

// ================================
// 🎯 Mock User Workouts (Replace with real API)
// ================================
const mockUserWorkouts: Workout[] = [
    {
        _id: 'workout-1',
        userId: 'user-1',
        name: 'Morning Strength',
        description: 'Full body strength workout',
        difficulty: DifficultyLevel.INTERMEDIATE,
        estimatedDuration: 45,
        tags: ['strength', 'morning'],
        isPublic: false,
        exercises: [
            {
                exerciseId: 'ex-1',
                order: 1,
                sets: 3,
                reps: 10,
                restTime: 60
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: 'workout-2',
        userId: 'user-1',
        name: 'Cardio Blast',
        description: 'High intensity cardio session',
        difficulty: DifficultyLevel.ADVANCED,
        estimatedDuration: 30,
        tags: ['cardio', 'hiit'],
        isPublic: true,
        exercises: [
            {
                exerciseId: 'ex-2',
                order: 1,
                sets: 4,
                duration: 45,
                restTime: 15
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: 'workout-3',
        userId: 'user-1',
        name: 'Evening Flexibility',
        description: 'Relaxing stretching routine',
        difficulty: DifficultyLevel.BEGINNER,
        estimatedDuration: 20,
        tags: ['flexibility', 'evening'],
        isPublic: false,
        exercises: [
            {
                exerciseId: 'ex-3',
                order: 1,
                sets: 1,
                duration: 30,
                restTime: 5
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// ================================
// 🏋️ Main WorkoutSelectionModal Component
// ================================
const WorkoutSelectionModal: React.FC<WorkoutSelectionModalProps> = ({
    exercise,
    isOpen,
    onClose,
    onWorkoutSelected
}) => {
    const theme = useTheme();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);

    // ✅ React 19: Action for adding exercise to existing workout
    const [addToWorkoutState, addToWorkoutAction] = useActionState(
        async (_: AddToWorkoutState, formData: FormData): Promise<AddToWorkoutState> => {
            if (!exercise) {
                return { success: false, error: 'No exercise selected', workoutId: null, isProcessing: false };
            }

            try {
                const workoutId = formData.get('workoutId') as string;

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // In real implementation, call:
                // await WorkoutService.addExerciseToWorkout(workoutId, exercise);

                onWorkoutSelected?.(workoutId);
                onClose();

                return {
                    success: true,
                    error: null,
                    workoutId,
                    isProcessing: false
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to add exercise to workout',
                    workoutId: null,
                    isProcessing: false
                };
            }
        },
        { success: false, error: null, workoutId: null, isProcessing: false }
    );

    // ✅ React 19: Action for creating new workout with exercise
    const [quickWorkoutState, createQuickWorkoutAction] = useActionState(
        async (_: QuickWorkoutState, formData: FormData): Promise<QuickWorkoutState> => {
            if (!exercise) {
                return { success: false, error: 'No exercise selected', workout: null, isProcessing: false };
            }

            try {
                const workoutName = formData.get('workoutName') as string || `Workout with ${exercise.name}`;

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Mock workout creation
                const newWorkout: Workout = {
                    _id: `workout-${Date.now()}`,
                    userId: 'user-1',
                    name: workoutName,
                    description: `Workout featuring ${exercise.name}`,
                    difficulty: exercise.difficulty as DifficultyLevel,
                    estimatedDuration: 30,
                    tags: [exercise.category],
                    isPublic: false,
                    exercises: [
                        {
                            exerciseId: exercise._id,
                            order: 1,
                            sets: 3,
                            reps: exercise.category === 'cardio' ? undefined : 10,
                            duration: exercise.category === 'cardio' ? 30 : undefined,
                            restTime: 60
                        }
                    ],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                // In real implementation:
                // const newWorkout = await WorkoutService.createWorkout({...});

                onWorkoutSelected?.(newWorkout._id);
                onClose();

                return {
                    success: true,
                    error: null,
                    workout: newWorkout,
                    isProcessing: false
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to create workout',
                    workout: null,
                    isProcessing: false
                };
            }
        },
        { success: false, error: null, workout: null, isProcessing: false }
    );

    // ✅ Handle checkbox toggle for workout selection
    const handleWorkoutToggle = (workoutId: string) => {
        setSelectedWorkouts(prev =>
            prev.includes(workoutId)
                ? prev.filter(id => id !== workoutId)
                : [...prev, workoutId]
        );
    };

    // ✅ Handle adding exercise to selected workouts
    const handleAddToSelectedWorkouts = () => {
        if (selectedWorkouts.length === 0) return;

        // Add to all selected workouts
        selectedWorkouts.forEach(workoutId => {
            const formData = new FormData();
            formData.append('workoutId', workoutId);
            addToWorkoutAction(formData);
        });

        // Close modal after adding
        setTimeout(() => {
            onClose();
        }, 1000);
    };

    // ✅ Get difficulty color
    const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' => {
        switch (difficulty) {
            case 'beginner': return 'success';
            case 'intermediate': return 'warning';
            case 'advanced': return 'error';
            default: return 'success';
        }
    };

    if (!exercise) return null;

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 4,
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        background: '#ffffff',
                        boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(25, 118, 210, 0.08)'
                    }
                }
            }}
        >
            {/* Modern Gradient Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #ff9800 100%)',
                    color: 'white',
                    p: 3,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background Pattern */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 200,
                        height: 200,
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        transform: 'translate(50%, -50%)'
                    }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                    <Box sx={{ flex: 1 }}>
                        {/* Exercise Icon */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    width: 56,
                                    height: 56,
                                    border: '2px solid rgba(255,255,255,0.3)'
                                }}
                            >
                                <FitnessCenterIcon sx={{ fontSize: 28, color: 'white' }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" component="h2" fontWeight="800" sx={{ mb: 0.5 }}>
                                    Add to Workout
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                    "{exercise.name}"
                                </Typography>
                            </Box>
                        </Box>

                        {/* Exercise Tags */}
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
                            <Chip
                                label={exercise.category}
                                size="medium"
                                icon={<FitnessCenterIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    fontWeight: 600,
                                    '& .MuiChip-icon': { color: 'white' }
                                }}
                            />
                            <Chip
                                label={exercise.difficulty}
                                size="medium"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    fontWeight: 600
                                }}
                            />
                            {exercise.caloriesPerMinute && (
                                <Chip
                                    label={`${exercise.caloriesPerMinute} cal/min`}
                                    size="medium"
                                    icon={<FireIcon sx={{ fontSize: 16 }} />}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        fontWeight: 600,
                                        '& .MuiChip-icon': { color: 'white' }
                                    }}
                                />
                            )}
                        </Stack>
                    </Box>

                    {/* Close Button */}
                    <IconButton
                        onClick={onClose}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.2)',
                                transform: 'scale(1.05)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            <DialogContent sx={{ p: 4 }}>
                {/* Error Display */}
                {(addToWorkoutState.error || quickWorkoutState.error) && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            border: '1px solid rgba(244, 67, 54, 0.2)',
                            background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(244, 67, 54, 0.02) 100%)'
                        }}
                    >
                        {addToWorkoutState.error || quickWorkoutState.error}
                    </Alert>
                )}

                {!showCreateForm ? (
                    // Show existing workouts
                    <Box>
                        {/* Section Header */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                background: 'linear-gradient(135deg, #e3f2fd 0%, #fff3e0 100%)',
                                borderRadius: 3,
                                border: '1px solid rgba(25, 118, 210, 0.1)'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        width: 48,
                                        height: 48
                                    }}
                                >
                                    <FitnessCenterIcon sx={{ fontSize: 24 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="700" color="primary.main" gutterBottom>
                                        Choose Existing Workout
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Select a workout to add "{exercise.name}" to your routine
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        {/* Workout Cards Grid */}
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                            gap: 3,
                            mb: 4
                        }}>
                            {mockUserWorkouts.map((workout, index) => {
                                const isProcessing = addToWorkoutState.isProcessing && addToWorkoutState.workoutId === workout._id;

                                // Color themes for different workout types
                                const getWorkoutTheme = (index: number) => {
                                    const themes = [
                                        {
                                            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                                            border: '1px solid rgba(76, 175, 80, 0.2)',
                                            iconColor: '#4caf50',
                                            textColor: '#388e3c'
                                        },
                                        {
                                            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                            border: '1px solid rgba(255, 152, 0, 0.2)',
                                            iconColor: '#ff9800',
                                            textColor: '#f57c00'
                                        },
                                        {
                                            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                                            border: '1px solid rgba(156, 39, 176, 0.2)',
                                            iconColor: '#9c27b0',
                                            textColor: '#7b1fa2'
                                        }
                                    ];
                                    return themes[index % themes.length];
                                };

                                const workoutTheme = getWorkoutTheme(index);

                                return (
                                    <Card
                                        key={workout._id}
                                        sx={{
                                            height: '100%',
                                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.3s ease',
                                            borderRadius: 3,
                                            background: workoutTheme.background,
                                            border: workoutTheme.border,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            opacity: isProcessing ? 0.7 : 1,
                                            '&:hover': !isProcessing ? {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                                '& .workout-icon': {
                                                    transform: 'scale(1.1) rotate(5deg)'
                                                }
                                            } : {},
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 4,
                                                background: `linear-gradient(90deg, ${workoutTheme.iconColor} 0%, ${alpha(workoutTheme.iconColor, 0.6)} 100%)`
                                            }
                                        }}
                                    >
                                        <Box sx={{ p: 3, height: '100%' }}>
                                            <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                {/* Header with Icon and Checkbox */}
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                                                    <Checkbox
                                                        checked={selectedWorkouts.includes(workout._id)}
                                                        onChange={() => handleWorkoutToggle(workout._id)}
                                                        disabled={isProcessing}
                                                        sx={{
                                                            color: workoutTheme.iconColor,
                                                            '&.Mui-checked': {
                                                                color: workoutTheme.iconColor,
                                                            },
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: 28,
                                                            }
                                                        }}
                                                    />
                                                    <Avatar
                                                        className="workout-icon"
                                                        sx={{
                                                            bgcolor: workoutTheme.iconColor,
                                                            width: 48,
                                                            height: 48,
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        <FitnessCenterIcon sx={{ fontSize: 24, color: 'white' }} />
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography
                                                            variant="h6"
                                                            fontWeight="700"
                                                            color={workoutTheme.textColor}
                                                            gutterBottom
                                                            sx={{ lineHeight: 1.2 }}
                                                        >
                                                            {workout.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                display: '-webkit-box',
                                                                WebkitBoxOrient: 'vertical',
                                                                WebkitLineClamp: 2,
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            {workout.description}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Stats */}
                                                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                                    <Chip
                                                        icon={<FitnessCenterIcon sx={{ fontSize: 14 }} />}
                                                        label={`${workout.exercises?.length || 0} exercises`}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha(workoutTheme.iconColor, 0.1),
                                                            color: workoutTheme.textColor,
                                                            border: `1px solid ${alpha(workoutTheme.iconColor, 0.2)}`,
                                                            fontWeight: 600,
                                                            '& .MuiChip-icon': { color: workoutTheme.iconColor }
                                                        }}
                                                    />
                                                    <Chip
                                                        icon={<TimerIcon sx={{ fontSize: 14 }} />}
                                                        label={`${workout.estimatedDuration || 0} min`}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha(workoutTheme.iconColor, 0.1),
                                                            color: workoutTheme.textColor,
                                                            border: `1px solid ${alpha(workoutTheme.iconColor, 0.2)}`,
                                                            fontWeight: 600,
                                                            '& .MuiChip-icon': { color: workoutTheme.iconColor }
                                                        }}
                                                    />
                                                </Stack>

                                                {/* Footer */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mt: 'auto',
                                                    pt: 2,
                                                    borderTop: `1px solid ${alpha(workoutTheme.iconColor, 0.1)}`
                                                }}>
                                                    <Chip
                                                        label={workout.difficulty}
                                                        size="small"
                                                        color={getDifficultyColor(workout.difficulty)}
                                                        sx={{ fontWeight: 600 }}
                                                    />

                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: selectedWorkouts.includes(workout._id) ? workoutTheme.iconColor : 'text.secondary',
                                                        fontWeight: 600,
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        {selectedWorkouts.includes(workout._id) ? (
                                                            <>
                                                                <CheckIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                                Selected
                                                            </>
                                                        ) : (
                                                            <>
                                                                <PlayIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                                Available
                                                            </>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Box>
                                    </Card>
                                );
                            })}
                        </Box>

                        {/* Add to Selected Workouts Button */}
                        {selectedWorkouts.length > 0 && (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    mb: 3,
                                    background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                                    borderRadius: 3,
                                    border: '1px solid rgba(25, 118, 210, 0.2)',
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="h6" fontWeight="700" color="primary.main" gutterBottom>
                                    {selectedWorkouts.length} workout{selectedWorkouts.length > 1 ? 's' : ''} selected
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Add "{exercise.name}" to all selected workouts
                                </Typography>

                                <Button
                                    variant="contained"
                                    onClick={handleAddToSelectedWorkouts}
                                    disabled={addToWorkoutState.isProcessing}
                                    startIcon={addToWorkoutState.isProcessing ? <CircularProgress size={20} /> : <CheckIcon />}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                        boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)'
                                        }
                                    }}
                                >
                                    {addToWorkoutState.isProcessing ? 'Adding...' : `Add to ${selectedWorkouts.length} Workout${selectedWorkouts.length > 1 ? 's' : ''}`}
                                </Button>
                            </Paper>
                        )}

                        {/* Create New Workout Section */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
                                borderRadius: 3,
                                border: '1px solid rgba(76, 175, 80, 0.2)',
                                textAlign: 'center'
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: '#4caf50',
                                    width: 56,
                                    height: 56,
                                    mx: 'auto',
                                    mb: 2
                                }}
                            >
                                <AddIcon sx={{ fontSize: 28 }} />
                            </Avatar>

                            <Typography variant="h6" fontWeight="700" color="#388e3c" gutterBottom>
                                Create New Workout
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Start fresh with "{exercise.name}" as your first exercise
                            </Typography>

                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<AddIcon />}
                                onClick={() => setShowCreateForm(true)}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                                    boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 32px rgba(76, 175, 80, 0.4)'
                                    }
                                }}
                            >
                                Create New Workout
                            </Button>
                        </Paper>
                    </Box>
                ) : (
                    // Modern workout creation form
                    <Box>
                        {/* Form Header */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 4,
                                background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
                                borderRadius: 3,
                                border: '1px solid rgba(76, 175, 80, 0.2)'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: '#4caf50',
                                        width: 48,
                                        height: 48
                                    }}
                                >
                                    <AddIcon sx={{ fontSize: 24 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="700" color="#388e3c" gutterBottom>
                                        Create New Workout
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Build a custom workout starting with "{exercise.name}"
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        <Box component="form" action={createQuickWorkoutAction}>
                            {/* Info Alert */}
                            <Alert
                                severity="info"
                                sx={{
                                    mb: 4,
                                    borderRadius: 2,
                                    border: '1px solid rgba(33, 150, 243, 0.2)',
                                    background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
                                }}
                            >
                                <Typography variant="body2" fontWeight="600">
                                    Quick Setup
                                </Typography>
                                <Typography variant="body2">
                                    This will create a new workout with "{exercise.name}" as the first exercise.
                                    You can add more exercises and customize it later.
                                </Typography>
                            </Alert>

                            <Stack spacing={4}>
                                <input
                                    name="workoutName"
                                    type="hidden"
                                    value={`Workout with ${exercise.name}`}
                                />

                                {/* Enhanced Workout Preview */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                        borderRadius: 3,
                                        border: '1px solid rgba(0, 0, 0, 0.08)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Background decoration */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -50,
                                            right: -50,
                                            width: 150,
                                            height: 150,
                                            background: 'radial-gradient(circle, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 70%)',
                                            borderRadius: '50%'
                                        }}
                                    />

                                    <Box sx={{ position: 'relative' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: theme.palette.primary.main,
                                                    width: 40,
                                                    height: 40
                                                }}
                                            >
                                                <FitnessCenterIcon sx={{ fontSize: 20 }} />
                                            </Avatar>
                                            <Typography variant="subtitle1" fontWeight="700" color="primary.main">
                                                Workout Preview
                                            </Typography>
                                        </Box>

                                        <Typography variant="h5" fontWeight="700" gutterBottom color="text.primary">
                                            Workout with {exercise.name}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                                            A personalized workout featuring {exercise.name} and tailored to your fitness goals
                                        </Typography>

                                        {/* Enhanced Tags */}
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                            <Chip
                                                label={exercise.difficulty}
                                                size="medium"
                                                color={getDifficultyColor(exercise.difficulty)}
                                                sx={{ fontWeight: 600 }}
                                            />
                                            <Chip
                                                label={exercise.category}
                                                size="medium"
                                                icon={<FitnessCenterIcon sx={{ fontSize: 16 }} />}
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: theme.palette.primary.main,
                                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                                    fontWeight: 600,
                                                    '& .MuiChip-icon': { color: theme.palette.primary.main }
                                                }}
                                            />
                                            <Chip
                                                label="~30 min"
                                                size="medium"
                                                icon={<TimerIcon sx={{ fontSize: 16 }} />}
                                                sx={{
                                                    bgcolor: alpha('#ff9800', 0.1),
                                                    color: '#f57c00',
                                                    border: '1px solid rgba(255, 152, 0, 0.2)',
                                                    fontWeight: 600,
                                                    '& .MuiChip-icon': { color: '#ff9800' }
                                                }}
                                            />
                                            {exercise.caloriesPerMinute && (
                                                <Chip
                                                    label={`~${exercise.caloriesPerMinute * 30} calories`}
                                                    size="medium"
                                                    icon={<FireIcon sx={{ fontSize: 16 }} />}
                                                    sx={{
                                                        bgcolor: alpha('#f44336', 0.1),
                                                        color: '#d32f2f',
                                                        border: '1px solid rgba(244, 67, 54, 0.2)',
                                                        fontWeight: 600,
                                                        '& .MuiChip-icon': { color: '#f44336' }
                                                    }}
                                                />
                                            )}
                                        </Stack>
                                    </Box>
                                </Paper>

                                {/* Action Buttons */}
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setShowCreateForm(false)}
                                        disabled={quickWorkoutState.isProcessing}
                                        sx={{
                                            flex: 1,
                                            borderRadius: 2,
                                            py: 1.5,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={quickWorkoutState.isProcessing}
                                        startIcon={quickWorkoutState.isProcessing ? <CircularProgress size={20} /> : <CheckIcon />}
                                        sx={{
                                            flex: 2,
                                            borderRadius: 2,
                                            py: 1.5,
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                                            boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 12px 32px rgba(76, 175, 80, 0.4)'
                                            }
                                        }}
                                    >
                                        {quickWorkoutState.isProcessing ? 'Creating...' : 'Create Workout'}
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default WorkoutSelectionModal;
