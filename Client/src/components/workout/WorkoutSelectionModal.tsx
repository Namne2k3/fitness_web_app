/**
 * 🏋️ WorkoutSelectionModal - React 19 Implementation
 * Modal để chọn/tạo workout khi add exercise từ ExercisePage
 */

import React, { useState, useActionState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardActionArea,
    Divider,
    Alert,
    Chip,
    Stack,
    IconButton,
    CircularProgress
} from '@mui/material';
import {
    Close as CloseIcon,
    Add as AddIcon,
    FitnessCenter as FitnessCenterIcon,
    Timer as TimerIcon,
    TrendingUp as TrendingIcon,
    CheckCircle as CheckIcon
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
    const [showCreateForm, setShowCreateForm] = useState(false);

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

    // ✅ Handle workout selection
    const handleWorkoutSelect = (workoutId: string) => {
        const formData = new FormData();
        formData.append('workoutId', workoutId);
        addToWorkoutAction(formData);
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
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                            Add "{exercise.name}" to Workout
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                                label={exercise.category}
                                size="small"
                                icon={<FitnessCenterIcon sx={{ fontSize: 16 }} />}
                            />
                            <Chip
                                label={exercise.difficulty}
                                size="small"
                                color={getDifficultyColor(exercise.difficulty)}
                            />
                            {exercise.caloriesPerMinute && (
                                <Chip
                                    label={`${exercise.caloriesPerMinute} cal/min`}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                    </Box>
                    <IconButton onClick={onClose} sx={{ mt: -1, mr: -1 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pb: 3 }}>
                {/* Error Display */}
                {(addToWorkoutState.error || quickWorkoutState.error) && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {addToWorkoutState.error || quickWorkoutState.error}
                    </Alert>
                )}

                {!showCreateForm ? (
                    // Show existing workouts
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FitnessCenterIcon />
                            Choose existing workout:
                        </Typography>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                            gap: 2,
                            mb: 3
                        }}>
                            {mockUserWorkouts.map(workout => (
                                <Box key={workout._id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            '&:hover': {
                                                boxShadow: 3,
                                                borderColor: 'primary.main',
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        <CardActionArea
                                            onClick={() => handleWorkoutSelect(workout._id)}
                                            disabled={addToWorkoutState.isProcessing}
                                            sx={{ height: '100%', p: 2 }}
                                        >
                                            <CardContent sx={{ p: 0 }}>
                                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                                    {workout.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {workout.description}
                                                </Typography>

                                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                                    <Chip
                                                        icon={<FitnessCenterIcon sx={{ fontSize: 14 }} />}
                                                        label={`${workout.exercises?.length || 0} exercises`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        icon={<TimerIcon sx={{ fontSize: 14 }} />}
                                                        label={`${workout.estimatedDuration || 0} min`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Stack>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Chip
                                                        label={workout.difficulty}
                                                        size="small"
                                                        color={getDifficultyColor(workout.difficulty)}
                                                    />

                                                    {addToWorkoutState.isProcessing && addToWorkoutState.workoutId === workout._id ? (
                                                        <CircularProgress size={20} />
                                                    ) : (
                                                        <TrendingIcon color="action" />
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Box>
                            ))}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setShowCreateForm(true)}
                            fullWidth
                            size="large"
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Create New Workout with this Exercise
                        </Button>
                    </Box>
                ) : (
                    // Quick workout creation form
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AddIcon />
                            Create New Workout
                        </Typography>

                        <Box component="form" action={createQuickWorkoutAction}>
                            <Alert severity="info" sx={{ mb: 3 }}>
                                This will create a new workout with "{exercise.name}" as the first exercise.
                                You can add more exercises and customize it later.
                            </Alert>

                            <Stack spacing={3}>
                                <input
                                    name="workoutName"
                                    type="hidden"
                                    value={`Workout with ${exercise.name}`}
                                />

                                {/* Workout Preview */}
                                <Card variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                        Workout Preview:
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        Workout with {exercise.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Workout featuring {exercise.name}
                                    </Typography>

                                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                        <Chip
                                            label={exercise.difficulty}
                                            size="small"
                                            color={getDifficultyColor(exercise.difficulty)}
                                        />
                                        <Chip
                                            label={exercise.category}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label="30 min"
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Stack>
                                </Card>

                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setShowCreateForm(false)}
                                        disabled={quickWorkoutState.isProcessing}
                                        sx={{ flex: 1 }}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={quickWorkoutState.isProcessing}
                                        startIcon={quickWorkoutState.isProcessing ? <CircularProgress size={20} /> : <CheckIcon />}
                                        sx={{ flex: 2 }}
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
