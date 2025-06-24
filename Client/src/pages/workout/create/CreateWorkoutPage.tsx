import React, { useActionState, useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Chip,
    Alert,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Avatar, Fade,
    LinearProgress,
    CircularProgress,
    FormControlLabel,
    Switch,
} from '@mui/material';
import {
    FitnessCenter as FitnessCenterIcon,
    Timer as TimerIcon,
    Search as SearchIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    PlayArrow as PlayIcon,
    Star as StarIcon,
    LocalFireDepartment as CaloriesIcon,
    DirectionsRun,
    SelfImprovement,
    LocalOffer as TagIcon,
    Public as PublicIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Exercise, WorkoutExercise } from '../../../types';
import { ExerciseCategory } from '../../../types/exercise.interface';
import { WorkoutCategory, DifficultyLevel } from '../../../types/workout.interface';
import { WorkoutService } from '../../../services/workoutService';
import './CreateWorkoutPage.css';

// ✅ React 19: Type-safe form state
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
    duration?: number; // Make optional since we're using estimatedDuration from API
    exercises: WorkoutExercise[];
}

// ✅ Mock exercises data for immediate display
const mockExercises: Exercise[] = [{
    _id: '1',
    name: 'Push-ups',
    description: 'Classic upper body exercise',
    category: ExerciseCategory.STRENGTH,
    primaryMuscleGroups: ['chest', 'shoulders', 'triceps'],
    secondaryMuscleGroups: [],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: ['Start in plank position', 'Lower body to ground', 'Push back up'],
    images: [],
    caloriesPerMinute: 8,
    variations: [],
    precautions: [],
    contraindications: [],
    isApproved: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
},
{
    _id: '2',
    name: 'Squats',
    description: 'Lower body compound exercise',
    category: ExerciseCategory.STRENGTH,
    primaryMuscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    secondaryMuscleGroups: [],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: ['Stand with feet shoulder-width apart', 'Lower hips back and down', 'Return to standing'],
    images: [],
    caloriesPerMinute: 10,
    variations: [],
    precautions: [],
    contraindications: [],
    isApproved: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
},
{
    _id: '3',
    name: 'Burpees',
    description: 'Full body cardio exercise',
    category: ExerciseCategory.CARDIO,
    primaryMuscleGroups: ['full body'],
    secondaryMuscleGroups: [],
    equipment: ['bodyweight'],
    difficulty: 'advanced',
    instructions: ['Start standing', 'Drop to squat', 'Jump back to plank', 'Return to standing with jump'],
    images: [],
    caloriesPerMinute: 15,
    variations: [],
    precautions: [],
    contraindications: [],
    isApproved: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
},
{
    _id: '4',
    name: 'Planks',
    description: 'Core strengthening exercise',
    category: ExerciseCategory.STRENGTH,
    primaryMuscleGroups: ['core', 'shoulders'],
    secondaryMuscleGroups: [],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    instructions: ['Start in forearm plank', 'Hold position', 'Keep body straight'],
    images: [],
    caloriesPerMinute: 5,
    variations: [],
    precautions: [],
    contraindications: [],
    isApproved: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
},
];

// ✅ Exercise Search Component
const ExerciseSearch: React.FC<{
    onExerciseSelect: (exercise: Exercise) => void;
}> = ({ onExerciseSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredExercises = mockExercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'success';
            case 'intermediate': return 'warning';
            case 'advanced': return 'error';
            default: return 'default';
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
                borderRadius: 3,
                border: '1px solid rgba(33, 150, 243, 0.1)',
                mb: 3,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#2196f3', mr: 2 }}>
                    <SearchIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="600" color="#1565c0">
                    Exercise Library
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                    fullWidth
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        label="Category"
                        sx={{ borderRadius: 2 }}
                    >
                        <MenuItem value="all">All Categories</MenuItem>
                        <MenuItem value="strength">Strength</MenuItem>
                        <MenuItem value="cardio">Cardio</MenuItem>
                        <MenuItem value="flexibility">Flexibility</MenuItem>
                    </Select>
                </FormControl>
            </Box>      <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                    gap: 2,
                    maxHeight: 400,
                    overflowY: 'auto',
                }}
                className="exercise-list-scroll"
            >        {filteredExercises.map((exercise) => (
                <Card
                    key={exercise._id}
                    className="exercise-card hover-lift"
                    sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        },
                    }}
                    onClick={() => onExerciseSelect(exercise)}
                >
                    <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="600" sx={{ flex: 1 }}>
                                {exercise.name}
                            </Typography>                <Chip
                                label={exercise.difficulty}
                                color={getDifficultyColor(exercise.difficulty) as 'success' | 'warning' | 'error' | 'default'}
                                size="small"
                                sx={{ ml: 1 }}
                            />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                            {exercise.description}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CaloriesIcon sx={{ fontSize: 16, color: 'orange' }} />
                            <Typography variant="caption">
                                {exercise.caloriesPerMinute} cal/min
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {exercise.primaryMuscleGroups.slice(0, 2).map((muscle: string) => (
                                <Chip
                                    key={muscle}
                                    label={muscle}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                            ))}
                            {exercise.primaryMuscleGroups.length > 2 && (
                                <Chip
                                    label={`+${exercise.primaryMuscleGroups.length - 2}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                            )}
                        </Box>
                    </CardContent>
                </Card>
            ))}
            </Box>
        </Paper>
    );
};

// ✅ Extended WorkoutExercise interface for UI
interface WorkoutExerciseWithName extends WorkoutExercise {
    name: string; // Add name for display
    notes: string; // Required for validation
    completed: boolean; // Required for validation
}

// ✅ Selected Exercise Card Component
const SelectedExerciseCard: React.FC<{
    exercise: WorkoutExerciseWithName;
    index: number;
    onUpdate: (index: number, field: keyof WorkoutExercise, value: string | number | boolean) => void;
    onRemove: (index: number) => void;
}> = ({ exercise, index, onUpdate, onRemove }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <Card
            sx={{
                mb: 2,
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                border: '1px solid rgba(255, 152, 0, 0.2)',
                borderRadius: 2,
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#ff9800', width: 32, height: 32 }}>
                            <FitnessCenterIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="600" color="#f57c00">
                                {exercise.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Exercise #{index + 1}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            size="small"
                            onClick={() => setIsEditing(!isEditing)}
                            sx={{ color: '#f57c00' }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => onRemove(index)}
                            sx={{ color: '#d32f2f' }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>                {isEditing ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Exercise metrics grid */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2 }}>
                            <TextField
                                label="Sets"
                                type="number"
                                value={exercise.sets}
                                onChange={(e) => onUpdate(index, 'sets', Number(e.target.value))}
                                inputProps={{ min: 1, max: 20 }}
                                size="small"
                            />
                            <TextField
                                label="Reps"
                                type="number"
                                value={exercise.reps}
                                onChange={(e) => onUpdate(index, 'reps', Number(e.target.value))}
                                inputProps={{ min: 1, max: 100 }}
                                size="small"
                            />
                            <TextField
                                label="Weight (kg)"
                                type="number"
                                value={exercise.weight || 0}
                                onChange={(e) => onUpdate(index, 'weight', Number(e.target.value))}
                                inputProps={{ min: 0, max: 500 }}
                                size="small"
                            />
                            <TextField
                                label="Rest (sec)"
                                type="number"
                                value={exercise.restTime || 60}
                                onChange={(e) => onUpdate(index, 'restTime', Number(e.target.value))}
                                inputProps={{ min: 0, max: 600 }}
                                size="small"
                            />
                        </Box>
                        {/* Notes field */}
                        <TextField
                            label="Exercise Notes (optional)"
                            value={exercise.notes || ''}
                            onChange={(e) => onUpdate(index, 'notes', e.target.value)}
                            placeholder="Add any specific instructions or modifications..."
                            multiline
                            rows={2}
                            size="small"
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                }
                            }}
                        />

                        {/* Completed checkbox */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={exercise.completed || false}
                                    onChange={(e) => onUpdate(index, 'completed', e.target.checked)}
                                    color="success"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2">Mark as completed</Typography>
                                    <Chip
                                        label={exercise.completed ? "Done" : "Pending"}
                                        size="small"
                                        color={exercise.completed ? "success" : "default"}
                                    />
                                </Box>
                            }
                        />
                    </Box>) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>                        {/* Exercise metrics */}
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" fontWeight="600">Sets:</Typography>
                                <Chip label={exercise.sets} size="small" color="primary" />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" fontWeight="600">Reps:</Typography>
                                <Chip label={exercise.reps} size="small" color="primary" />
                            </Box>
                            {exercise.weight && exercise.weight > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" fontWeight="600">Weight:</Typography>
                                    <Chip label={`${exercise.weight}kg`} size="small" color="secondary" />
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" fontWeight="600">Rest:</Typography>
                                <Chip label={`${exercise.restTime || 60}s`} size="small" color="info" />
                            </Box>
                            {/* Completion status */}
                            <Chip
                                label={exercise.completed ? "✓ Completed" : "○ Pending"}
                                size="small"
                                color={exercise.completed ? "success" : "default"}
                                variant={exercise.completed ? "filled" : "outlined"}
                            />
                        </Box>

                        {/* Notes display */}
                        {exercise.notes && exercise.notes.trim() && (
                            <Box sx={{
                                p: 2,
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                borderRadius: 2,
                                border: '1px solid rgba(25, 118, 210, 0.2)'
                            }}>
                                <Typography variant="body2" fontWeight="600" color="primary.main" sx={{ mb: 1 }}>
                                    Notes:
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {exercise.notes}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

// ✅ Main CreateWorkoutPage Component
const CreateWorkoutPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedExercises, setSelectedExercises] = useState<WorkoutExerciseWithName[]>([]);    // ✅ React 19: Actions for form submission
    const [state, submitAction, isPending] = useActionState(async (_: WorkoutFormState, formData: FormData): Promise<WorkoutFormState> => {
        try {
            const duration = Number(formData.get('duration'));
            const difficulty = formData.get('difficulty') as DifficultyLevel;

            // ✅ Auto-calculate muscle groups from selected exercises
            const muscleGroups = Array.from(new Set(
                selectedExercises.flatMap(ex => {
                    const exercise = mockExercises.find(e => e._id === ex.exerciseId);
                    return exercise ? [...exercise.primaryMuscleGroups, ...exercise.secondaryMuscleGroups] : [];
                })
            ));

            // ✅ Auto-calculate equipment from selected exercises
            const equipment = Array.from(new Set(
                selectedExercises.flatMap(ex => {
                    const exercise = mockExercises.find(e => e._id === ex.exerciseId);
                    return exercise ? exercise.equipment : [];
                })
            ));

            // ✅ Estimate calories burned based on duration and difficulty
            const caloriesPerMinute = difficulty === 'beginner' ? 8 : difficulty === 'intermediate' ? 10 : 12;
            const caloriesBurned = Math.round(duration * caloriesPerMinute);

            // ✅ Build complete workout data matching server expectations
            const workoutData = {
                status: 'published', // Required by WorkoutService
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                category: (formData.get('category') as string || 'strength') as WorkoutCategory,
                difficulty: difficulty,
                estimatedDuration: duration,
                tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(tag => tag.trim()) : [],
                isPublic: formData.has('isPublic'), // Switch sẽ có field này nếu được checked

                // ✅ Auto-calculated fields for richer data
                muscleGroups,
                equipment,
                caloriesBurned, exercises: selectedExercises.map(exercise => ({
                    exerciseId: exercise.exerciseId,
                    order: exercise.order,
                    sets: exercise.sets,
                    reps: exercise.reps,
                    weight: exercise.weight || 0,
                    restTime: exercise.restTime || 60,
                    notes: exercise.notes || '', // Use actual notes
                    completed: exercise.completed || false // Use actual completed status
                })),
            };

            console.log('Submitting workout data (enhanced server format):', {
                ...workoutData,
                exerciseCount: workoutData.exercises.length,
                totalMuscleGroups: workoutData.muscleGroups.length,
                equipmentNeeded: workoutData.equipment.length
            });

            // Validation using estimatedDuration instead of duration
            if (!workoutData.name || workoutData.name.length < 3) {
                return {
                    success: false,
                    error: 'Workout name must be at least 3 characters',
                    workout: null,
                    isValidating: false
                };
            }

            if (selectedExercises.length === 0) {
                return {
                    success: false,
                    error: 'Please add at least one exercise',
                    workout: null,
                    isValidating: false
                };
            }

            if (workoutData.estimatedDuration < 5 || workoutData.estimatedDuration > 300) {
                return {
                    success: false,
                    error: 'Duration must be between 5 and 300 minutes',
                    workout: null,
                    isValidating: false
                };
            }                // ✅ Call WorkoutService to create workout
            const newWorkout = await WorkoutService.createWorkout(workoutData);

            // Navigate to workout detail or dashboard
            // setTimeout(() => {
            //     navigate('/app/workouts');
            // }, 1000); 

            return {
                success: true,
                error: null,
                workout: {
                    ...newWorkout,
                    duration: newWorkout.estimatedDuration, // Map estimatedDuration to duration
                } as CreateWorkoutFormData,
                isValidating: false
            };
        } catch (error) {
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

    // Handle exercise selection
    const handleExerciseSelect = (exercise: Exercise) => {
        const workoutExercise: WorkoutExerciseWithName = {
            exerciseId: exercise._id,
            name: exercise.name,
            sets: 3,
            reps: 12,
            weight: 0,
            restTime: 60,
            order: selectedExercises.length + 1, // Start from 1, not 0
            notes: '', // Required field
            completed: false // Required field
        };
        setSelectedExercises(prev => [...prev, workoutExercise]);
    };
    // Update exercise details
    const handleExerciseUpdate = (index: number, field: keyof WorkoutExercise, value: string | number | boolean) => {
        setSelectedExercises(prev =>
            prev.map((exercise, i) =>
                i === index ? { ...exercise, [field]: value } : exercise
            )
        );
    };    // Remove exercise
    const handleExerciseRemove = (index: number) => {
        setSelectedExercises(prev =>
            prev.filter((_, i) => i !== index).map((exercise, i) => ({
                ...exercise,
                order: i + 1 // Start from 1, not 0
            }))
        );
    };// Calculate total estimated calories and duration
    const totalCalories = selectedExercises.reduce((total, exercise) => {
        const exerciseData = mockExercises.find(e => e._id === exercise.exerciseId);
        const exerciseDuration = (exercise.sets * (exercise.reps || 0) * 3) / 60; // Rough estimate in minutes
        return total + (exerciseData?.caloriesPerMinute || 5) * exerciseDuration;
    }, 0);

    const estimatedDuration = selectedExercises.reduce((total, exercise) => {
        const workTime = (exercise.sets * (exercise.reps || 0) * 3) / 60; // 3 seconds per rep
        const restTime = (exercise.sets - 1) * (exercise.restTime || 60) / 60; // Rest between sets
        return total + workTime + restTime;
    }, 0);    // ✅ Calculate muscle groups and equipment from selected exercises
    const muscleGroups = Array.from(new Set(
        selectedExercises.flatMap(ex => {
            const exercise = mockExercises.find(e => e._id === ex.exerciseId);
            return exercise ? [...exercise.primaryMuscleGroups, ...exercise.secondaryMuscleGroups] : [];
        })
    ));

    const equipment = Array.from(new Set(
        selectedExercises.flatMap(ex => {
            const exercise = mockExercises.find(e => e._id === ex.exerciseId);
            return exercise ? exercise.equipment : [];
        })
    ));

    // ✅ Calculate workout completion percentage
    const completedExercises = selectedExercises.filter(ex => ex.completed).length;
    const completionPercentage = selectedExercises.length > 0
        ? Math.round((completedExercises / selectedExercises.length) * 100)
        : 0;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1976d2 0%, #ff9800 100%)',
                py: 4,
            }}
        >
            <Container maxWidth="xl">
                <Fade in timeout={500}>
                    <Box>            {/* Hero Header */}
                        <Paper
                            elevation={0}
                            className="hero-gradient"
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                p: 4,
                                borderRadius: 3,
                                mb: 4,
                                textAlign: 'center',
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    width: 64,
                                    height: 64,
                                    mx: 'auto',
                                    mb: 2,
                                }}
                            >
                                <FitnessCenterIcon sx={{ fontSize: 32 }} />
                            </Avatar>

                            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                                Create New Workout
                            </Typography>

                            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                                Design your perfect workout routine with our comprehensive exercise library
                            </Typography>
                        </Paper>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                            {/* Left Column - Form */}
                            <Paper
                                elevation={20}
                                sx={{
                                    flex: 1,
                                    p: 4,
                                    borderRadius: 4,
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(10px)',
                                    maxWidth: { lg: 500 },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                                        <EditIcon />
                                    </Avatar>
                                    <Typography variant="h5" fontWeight="600" color="#1565c0">
                                        Workout Details
                                    </Typography>
                                </Box>

                                <Box component="form" action={submitAction}>
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

                                    {/* Difficulty & Duration */}
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Difficulty Level</InputLabel>
                                            <Select
                                                name="difficulty"
                                                label="Difficulty Level"
                                                defaultValue="intermediate"
                                                sx={{ borderRadius: 2 }}
                                            >
                                                <MenuItem value="beginner">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <StarIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                                        Beginner
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="intermediate">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <StarIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                                                        Intermediate
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="advanced">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <StarIcon sx={{ color: 'error.main', fontSize: 20 }} />
                                                        Advanced
                                                    </Box>
                                                </MenuItem>
                                            </Select>
                                        </FormControl>

                                        <TextField
                                            name="duration"
                                            label="Target Duration (min)"
                                            type="number"
                                            inputProps={{ min: 5, max: 300 }}
                                            defaultValue={30}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <TimerIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />                                    </Box>

                                    {/* Category & Tags */}
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Category</InputLabel>
                                            <Select
                                                name="category"
                                                label="Category"
                                                defaultValue="strength"
                                                sx={{ borderRadius: 2 }}
                                            >                                                <MenuItem value="strength">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <FitnessCenterIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                                        Strength Training
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="cardio">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <DirectionsRun sx={{ color: 'error.main', fontSize: 20 }} />
                                                        Cardio
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="flexibility">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <SelfImprovement sx={{ color: 'info.main', fontSize: 20 }} />
                                                        Flexibility
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="hiit">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CaloriesIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                                                        HIIT
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="yoga">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <SelfImprovement sx={{ color: 'success.main', fontSize: 20 }} />
                                                        Yoga
                                                    </Box>
                                                </MenuItem>
                                            </Select>
                                        </FormControl>

                                        <TextField
                                            name="tags"
                                            label="Tags"
                                            fullWidth
                                            placeholder="e.g., upper-body, beginner-friendly"
                                            helperText="Separate tags with commas"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <TagIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Box>

                                    {/* Visibility Setting */}
                                    <Box sx={{ mt: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    name="isPublic"
                                                    defaultChecked={false}
                                                    value="true"
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PublicIcon sx={{ fontSize: 20 }} />
                                                    <Typography variant="body2">
                                                        Make this workout public
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                                            Public workouts can be discovered and used by other users
                                        </Typography>
                                    </Box>                                    {/* Workout Stats */}
                                    {selectedExercises.length > 0 && (
                                        <>
                                            <Paper
                                                elevation={0}
                                                className="stats-card"
                                                sx={{
                                                    mt: 3,
                                                    p: 2,
                                                    background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                                                    borderRadius: 2,
                                                    border: '1px solid rgba(76, 175, 80, 0.2)',
                                                }}
                                            >
                                                <Typography variant="subtitle1" fontWeight="600" color="#388e3c" gutterBottom>
                                                    Workout Summary
                                                </Typography>

                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h6" fontWeight="bold" color="#2e7d32">
                                                            {selectedExercises.length}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Exercises
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h6" fontWeight="bold" color="#2e7d32">
                                                            {Math.round(estimatedDuration)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Est. Minutes
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h6" fontWeight="bold" color="#2e7d32">
                                                            {Math.round(totalCalories)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Est. Calories
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>

                                            {/* Auto-calculated Data Preview */}
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    mt: 2,
                                                    p: 2,
                                                    background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
                                                    borderRadius: 2,
                                                    border: '1px solid rgba(33, 150, 243, 0.1)',
                                                }}
                                            >
                                                <Typography variant="subtitle2" fontWeight="600" color="#1565c0" gutterBottom>
                                                    Auto-Calculated Data
                                                </Typography>

                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Muscle Groups ({muscleGroups.length})
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                            {muscleGroups.slice(0, 4).map((muscle, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    label={muscle}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: 'rgba(33, 150, 243, 0.1)',
                                                                        color: '#1565c0',
                                                                        fontSize: '0.65rem'
                                                                    }}
                                                                />
                                                            ))}
                                                            {muscleGroups.length > 4 && (
                                                                <Chip
                                                                    label={`+${muscleGroups.length - 4} more`}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: 'rgba(33, 150, 243, 0.1)',
                                                                        color: '#1565c0',
                                                                        fontSize: '0.65rem'
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>

                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Equipment ({equipment.length})
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                            {equipment.slice(0, 3).map((eq, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    label={eq}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: 'rgba(33, 150, 243, 0.1)',
                                                                        color: '#1565c0',
                                                                        fontSize: '0.65rem'
                                                                    }}
                                                                />
                                                            ))}
                                                            {equipment.length > 3 && (
                                                                <Chip
                                                                    label={`+${equipment.length - 3} more`}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: 'rgba(33, 150, 243, 0.1)',
                                                                        color: '#1565c0',
                                                                        fontSize: '0.65rem'
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </>
                                    )}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={isPending || selectedExercises.length === 0}
                                        startIcon={isPending ? <CircularProgress size={20} /> : <SaveIcon />}
                                        sx={{
                                            mt: 3,
                                            py: 1.5,
                                            borderRadius: 2,
                                            background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #1565c0 30%, #f57c00 90%)',
                                                transform: 'translateY(-1px)',
                                            },
                                            '&:disabled': {
                                                background: 'rgba(0,0,0,0.12)',
                                                transform: 'none',
                                            },
                                        }}
                                    >
                                        {isPending ? 'Creating Workout...' : 'Create Workout'}
                                    </Button>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => navigate('/app/workouts')}
                                        sx={{ mt: 2, borderRadius: 2 }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Paper>

                            {/* Right Column - Exercise Selection & List */}
                            <Box sx={{ flex: 2 }}>
                                {/* Exercise Library */}
                                <ExerciseSearch onExerciseSelect={handleExerciseSelect} />

                                {/* Selected Exercises */}
                                {selectedExercises.length > 0 && (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            background: 'rgba(255,255,255,0.95)',
                                            borderRadius: 3,
                                            border: '1px solid rgba(0,0,0,0.08)',
                                        }}
                                    >                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Avatar sx={{ bgcolor: '#ff9800', mr: 2 }}>
                                                <PlayIcon />
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" fontWeight="600" color="#f57c00">
                                                    Selected Exercises ({selectedExercises.length})
                                                </Typography>
                                                {selectedExercises.length > 0 && (
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
                                                )}
                                            </Box>
                                        </Box>

                                        <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
                                            {selectedExercises.map((exercise, index) => (
                                                <SelectedExerciseCard
                                                    key={`${exercise.exerciseId}-${index}`}
                                                    exercise={exercise}
                                                    index={index}
                                                    onUpdate={handleExerciseUpdate}
                                                    onRemove={handleExerciseRemove}
                                                />
                                            ))}
                                        </Box>
                                    </Paper>
                                )}

                                {/* Empty State */}
                                {selectedExercises.length === 0 && (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 6,
                                            textAlign: 'center',
                                            background: 'rgba(255,255,255,0.7)',
                                            borderRadius: 3,
                                            border: '2px dashed rgba(0,0,0,0.12)',
                                        }}
                                    >
                                        <FitnessCenterIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            No exercises selected yet
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Browse the exercise library above and click on exercises to add them to your workout
                                        </Typography>
                                    </Paper>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default CreateWorkoutPage;
