/**
 * 🏋️ CreateWorkoutPage - React 19 Refactored với ExercisePicker & ExerciseLibraryModal
 * Hybrid exercise selection workflow với shared components
 */

import React, { useActionState, useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Avatar,
    LinearProgress,
    FormControlLabel,
    Switch,
} from '@mui/material';
import {
    FitnessCenter as FitnessCenterIcon,
    Save as SaveIcon,
    PlayArrow as PlayIcon,
    LocalOffer as TagIcon,
    Public as PublicIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { Exercise, WorkoutExercise, ExerciseCategory } from '../../../types';
import { WorkoutCategory, DifficultyLevel } from '../../../types/workout.interface';
import { WorkoutService } from '../../../services/workoutService';
import ExercisePicker from '../../../components/exercise/ExercisePicker';
import ExerciseLibraryModal from '../../../components/exercise/ExerciseLibraryModal';
import { WorkoutExerciseCard } from './components/WorkoutExerciseCard';
import './CreateWorkoutPage.css';

// ================================
// 🎯 Type Definitions
// ================================
interface WorkoutFormState {
    success: boolean;
    error: string | null;
    workout: CreateWorkoutFormData | null;
    isValidating: boolean;
}

interface CreateWorkoutFormData {
    name: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration?: number;
    exercises: WorkoutExercise[];
}

interface WorkoutExerciseWithName extends WorkoutExercise {
    name?: string;
    sets: number;
    reps: number;
    weight?: number;
    restTime?: number;
    notes?: string;
    completed?: boolean;
}

// ================================
// 🎨 Utility Functions
// ================================

// ================================
// 🏋️ Main CreateWorkoutPage Component
// ================================
const CreateWorkoutPage: React.FC = () => {
    const navigate = useNavigate();

    // ================================
    // 🎯 State Management
    // ================================
    const [selectedExercises, setSelectedExercises] = useState<WorkoutExerciseWithName[]>([]);
    const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);

    // ✅ React 19: Actions for form submission
    const [state, submitAction, isPending] = useActionState(
        async (_: WorkoutFormState, formData: FormData): Promise<WorkoutFormState> => {
            try {
                const duration = Number(formData.get('duration'));
                const difficulty = formData.get('difficulty') as DifficultyLevel;

                // Build workout data với muscleGroups, equipment, caloriesBurned
                const workoutData = {
                    status: 'published',
                    name: formData.get('name') as string,
                    description: formData.get('description') as string,
                    category: (formData.get('category') as string || 'strength') as WorkoutCategory,
                    difficulty: difficulty,
                    estimatedDuration: duration,
                    tags: formData.get('tags')
                        ? (formData.get('tags') as string).split(',').map(tag => tag.trim())
                        : [],
                    isPublic: formData.has('isPublic'),

                    // Required fields cho WorkoutService
                    muscleGroups: ['core'], // Default muscle groups
                    equipment: ['bodyweight'], // Default equipment
                    caloriesBurned: Math.round(duration * 8), // Estimated calories

                    exercises: selectedExercises.map(exercise => ({
                        exerciseId: exercise.exerciseId,
                        order: exercise.order,
                        sets: exercise.sets,
                        reps: exercise.reps,
                        weight: exercise.weight || 0,
                        restTime: exercise.restTime || 60,
                        notes: exercise.notes || '',
                        completed: false
                    })),
                };

                console.log('Submitting workout data:', workoutData);

                // Validation
                if (!workoutData.name || workoutData.name.length < 3) {
                    return {
                        success: false,
                        error: 'Workout name must be at least 3 characters',
                        workout: null,
                        isValidating: false
                    };
                }

                if (workoutData.exercises.length === 0) {
                    return {
                        success: false,
                        error: 'Please add at least one exercise to your workout',
                        workout: null,
                        isValidating: false
                    };
                }

                if (!duration || duration < 5 || duration > 300) {
                    return {
                        success: false,
                        error: 'Duration must be between 5 and 300 minutes',
                        workout: null,
                        isValidating: false
                    };
                }

                // Submit to server
                const result = await WorkoutService.createWorkout(workoutData);

                // Navigate after success
                setTimeout(() => {
                    navigate(`/app/workouts/${result._id}`);
                }, 1500);

                return {
                    success: true,
                    error: null,
                    workout: workoutData,
                    isValidating: false
                };

            } catch (error) {
                console.error('Failed to create workout:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to create workout',
                    workout: null,
                    isValidating: false
                };
            }
        },
        { success: false, error: null, workout: null, isValidating: false }
    );

    // ================================
    // 🎯 Event Handlers
    // ================================

    /**
     * Handle adding exercises from ExercisePicker quick picks
     */
    const handleQuickAddExercise = (exercise: Exercise) => {
        const newWorkoutExercise: WorkoutExerciseWithName = {
            exerciseId: exercise._id,
            order: selectedExercises.length + 1,
            sets: 3,
            reps: 12,
            weight: 0,
            restTime: 60,
            notes: '',
            completed: false,
            name: exercise.name
        };

        setSelectedExercises(prev => [...prev, newWorkoutExercise]);
    };

    /**
     * Handle adding exercises from ExerciseLibraryModal
     */
    const handleLibraryExercisesSelect = (workoutExercises: WorkoutExercise[]) => {
        const newExercises: WorkoutExerciseWithName[] = workoutExercises.map((exercise, index) => ({
            ...exercise,
            order: selectedExercises.length + index + 1,
            sets: exercise.sets || 3,
            reps: exercise.reps || 12,
            weight: exercise.weight || 0,
            restTime: exercise.restTime || 60,
            notes: exercise.notes || '',
            completed: exercise.completed || false,
            name: `Exercise ${exercise.exerciseId}` // Would be populated from actual exercise data
        }));

        setSelectedExercises(prev => [...prev, ...newExercises]);
    };

    /**
     * Handle removing exercise from workout
     */
    const handleRemoveExercise = (exerciseId: string) => {
        setSelectedExercises(prev =>
            prev.filter(ex => ex.exerciseId !== exerciseId)
                .map((ex, index) => ({ ...ex, order: index + 1 }))
        );
    };

    /**
     * Handle updating exercise details
     */
    const handleUpdateExercise = (exerciseId: string, updates: Partial<WorkoutExerciseWithName>) => {
        setSelectedExercises(prev =>
            prev.map(ex =>
                ex.exerciseId === exerciseId ? { ...ex, ...updates } : ex
            )
        );
    };

    /**
     * Handle drag and drop reordering
     */
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(selectedExercises);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update order numbers
        const reorderedItems = items.map((item, index) => ({
            ...item,
            order: index + 1
        }));

        setSelectedExercises(reorderedItems);
    };

    // ================================
    // 🎨 Calculated Values
    // ================================
    const completionPercentage = selectedExercises.length > 0 ?
        Math.round((selectedExercises.filter(ex => ex.completed).length / selectedExercises.length) * 100) : 0;

    const totalEstimatedTime = selectedExercises.reduce((total, exercise) => {
        const exerciseTime = (exercise.sets * (exercise.reps * 2 + (exercise.restTime || 60))) / 60; // Convert to minutes
        return total + exerciseTime;
    }, 0);

    // ================================
    // 🎨 Render Component
    // ================================
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 4,
            }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', lg: 'row' },
                        gap: 4,
                        alignItems: 'flex-start'
                    }}
                >
                    {/* Left Column - Workout Form */}
                    <Box sx={{ flex: 1, minWidth: { lg: 400 } }}>
                        <Paper
                            elevation={20}
                            component="form"
                            action={submitAction}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                background: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            {/* Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                <Avatar sx={{ bgcolor: '#1976d2', mr: 2, width: 48, height: 48 }}>
                                    <FitnessCenterIcon sx={{ fontSize: 28 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" component="h1" fontWeight="bold" color="#1565c0">
                                        Create Workout
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Design your perfect training session
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Loading Progress */}
                            {isPending && (
                                <Box sx={{ mb: 3 }}>
                                    <LinearProgress sx={{ mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary" textAlign="center">
                                        Creating your workout...
                                    </Typography>
                                </Box>
                            )}

                            {/* Error Alert */}
                            {state.error && (
                                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                    {state.error}
                                </Alert>
                            )}

                            {/* Success Alert */}
                            {state.success && (
                                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                                    Workout created successfully! Redirecting...
                                </Alert>
                            )}

                            {/* Workout Name */}
                            <TextField
                                name="name"
                                label="Workout Name"
                                fullWidth
                                required
                                margin="normal"
                                placeholder="e.g., Morning Strength Training"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FitnessCenterIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />

                            {/* Description */}
                            <TextField
                                name="description"
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                margin="normal"
                                placeholder="Describe your workout goals and focus areas..."
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />

                            {/* Category & Difficulty Row */}
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        name="category"
                                        label="Category"
                                        defaultValue="strength"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="strength">💪 Strength</MenuItem>
                                        <MenuItem value="cardio">❤️ Cardio</MenuItem>
                                        <MenuItem value="flexibility">🧘 Flexibility</MenuItem>
                                        <MenuItem value="sports">⚽ Sports</MenuItem>
                                        <MenuItem value="rehabilitation">🏥 Rehabilitation</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Difficulty</InputLabel>
                                    <Select
                                        name="difficulty"
                                        label="Difficulty"
                                        defaultValue="intermediate"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="beginner">🟢 Beginner</MenuItem>
                                        <MenuItem value="intermediate">🟡 Intermediate</MenuItem>
                                        <MenuItem value="advanced">🔴 Advanced</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Duration */}
                            <TextField
                                name="duration"
                                label="Estimated Duration (minutes)"
                                type="number"
                                fullWidth
                                required
                                margin="normal"
                                inputProps={{ min: 5, max: 300 }}
                                defaultValue={Math.max(30, Math.round(totalEstimatedTime))}
                                helperText={`Auto-estimated: ${Math.round(totalEstimatedTime)} minutes based on exercises`}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />

                            {/* Tags */}
                            <TextField
                                name="tags"
                                label="Tags (comma separated)"
                                fullWidth
                                margin="normal"
                                placeholder="e.g., upper-body, muscle-building, beginner-friendly"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TagIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />

                            {/* Public Switch */}
                            <FormControlLabel
                                control={<Switch name="isPublic" />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PublicIcon color="action" />
                                        <Typography>Make workout public</Typography>
                                    </Box>
                                }
                                sx={{ mt: 2, mb: 3 }}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={isPending || selectedExercises.length === 0}
                                startIcon={isPending ? undefined : <SaveIcon />}
                                sx={{
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1565c0 30%, #f57c00 90%)',
                                    },
                                    '&:disabled': {
                                        background: 'rgba(0,0,0,0.12)',
                                        color: 'rgba(0,0,0,0.26)'
                                    }
                                }}
                            >
                                {isPending ? 'Creating Workout...' : 'Create Workout'}
                            </Button>

                            {/* Cancel Button */}
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate('/app/workouts')}
                                sx={{ mt: 2, borderRadius: 2 }}
                            >
                                Cancel
                            </Button>
                        </Paper>
                    </Box>

                    {/* Right Column - Exercise Selection */}
                    <Box sx={{ flex: 2 }}>
                        {/* Exercise Picker Component */}
                        <ExercisePicker
                            selectedExercises={selectedExercises.map(ex => ({
                                _id: ex.exerciseId,
                                name: ex.name || `Exercise ${ex.exerciseId}`,
                                description: '',
                                category: ExerciseCategory.STRENGTH,
                                primaryMuscleGroups: [],
                                secondaryMuscleGroups: [],
                                equipment: [],
                                difficulty: 'beginner',
                                instructions: [],
                                images: [],
                                caloriesPerMinute: 0,
                                variations: [],
                                precautions: [],
                                contraindications: [],
                                isApproved: true,
                                createdBy: 'user',
                                createdAt: new Date(),
                                updatedAt: new Date()
                            }))}
                            onExerciseSelected={handleQuickAddExercise}
                            onExerciseRemoved={(exercise) => handleRemoveExercise(exercise._id)}
                            onLibraryOpen={() => setShowExerciseLibrary(true)}
                        />

                        {/* Selected Exercises */}
                        {selectedExercises.length > 0 && (
                            <Paper
                                elevation={0}
                                sx={{
                                    mt: 3,
                                    p: 3,
                                    background: 'rgba(255,255,255,0.95)',
                                    borderRadius: 3,
                                    border: '1px solid rgba(0,0,0,0.08)',
                                }}
                            >
                                {/* Header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Avatar sx={{ bgcolor: '#ff9800', mr: 2 }}>
                                        <PlayIcon />
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight="600" color="#f57c00">
                                            Selected Exercises ({selectedExercises.length})
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={completionPercentage}
                                                sx={{
                                                    flexGrow: 1,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 4,
                                                        background: completionPercentage === 100
                                                            ? 'linear-gradient(45deg, #4caf50, #66bb6a)'
                                                            : 'linear-gradient(45deg, #ff9800, #ffb74d)'
                                                    }
                                                }}
                                            />
                                            <Typography variant="body2" fontWeight="600" color="text.secondary">
                                                {completionPercentage}% Complete
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Draggable Exercise List */}
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="selected-exercises">
                                        {(provided) => (
                                            <Box
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                {selectedExercises.map((exercise, index) => (
                                                    <Draggable
                                                        key={exercise.exerciseId}
                                                        draggableId={exercise.exerciseId}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    transform: snapshot.isDragging
                                                                        ? provided.draggableProps.style?.transform
                                                                        : 'none'
                                                                }}
                                                            >
                                                                <WorkoutExerciseCard
                                                                    exercise={exercise}
                                                                    index={index}
                                                                    dragHandleProps={provided.dragHandleProps}
                                                                    onUpdate={(updates) =>
                                                                        handleUpdateExercise(exercise.exerciseId, updates)
                                                                    }
                                                                    onRemove={() =>
                                                                        handleRemoveExercise(exercise.exerciseId)
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </Box>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </Paper>
                        )}
                    </Box>
                </Box>
            </Container>

            {/* Exercise Library Modal */}
            <ExerciseLibraryModal
                isOpen={showExerciseLibrary}
                onClose={() => setShowExerciseLibrary(false)}
                onExercisesSelect={handleLibraryExercisesSelect}
                selectedExerciseIds={selectedExercises.map(ex => ex.exerciseId)}
                maxSelection={20}
            />
        </Box>
    );
};

export default CreateWorkoutPage;
