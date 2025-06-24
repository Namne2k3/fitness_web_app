import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Switch,
    FormControlLabel,
    Alert,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Autocomplete,
    Card,
    CardContent,
    IconButton,
    Divider,
    Stack,
    Slider,
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    FitnessCenter as FitnessIcon,
    Timer as TimerIcon,
    Settings as SettingsIcon,
    Save as SaveIcon,
    Preview as PreviewIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Types
import {
    WorkoutFormData,
    WorkoutExercise,
    DifficultyLevel,
    WorkoutCategory
} from '../../../types/workout.interface';
import { Exercise, ExerciseCategory } from '../../../types/exercise.interface';

// Mock exercises data cho demo (sau này sẽ fetch từ API)
const mockExercises: Exercise[] = [{
    _id: '1', name: 'Push-ups',
    description: 'Classic bodyweight exercise for chest and arms',
    instructions: ['Start in plank position', 'Lower body to ground', 'Push back up'],
    category: ExerciseCategory.STRENGTH,
    primaryMuscleGroups: ['chest', 'triceps'],
    secondaryMuscleGroups: ['shoulders', 'core'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    images: [],
    variations: [],
    precautions: [],
    contraindications: [],
    isApproved: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
},
{
    _id: '2', name: 'Squats',
    description: 'Fundamental lower body exercise',
    instructions: ['Stand with feet shoulder-width', 'Lower into squat', 'Stand back up'],
    category: ExerciseCategory.STRENGTH,
    primaryMuscleGroups: ['quadriceps', 'glutes'],
    secondaryMuscleGroups: ['hamstrings', 'calves'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    images: [],
    variations: [],
    precautions: [],
    contraindications: [],
    isApproved: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
},
{
    _id: '3', name: 'Burpees',
    description: 'Full body cardio exercise',
    instructions: ['Start standing', 'Drop to squat', 'Jump back to plank', 'Do push-up', 'Jump forward', 'Jump up'],
    category: ExerciseCategory.CARDIO,
    primaryMuscleGroups: ['full_body'],
    secondaryMuscleGroups: ['cardiovascular'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    images: [],
    variations: [],
    precautions: [],
    contraindications: [],
    isApproved: true,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
}
];



/**
 * CreateWorkoutPage Component
 * Trang tạo workout mới với Material UI và React 18 patterns
 */
const CreateWorkoutPage: React.FC = () => {
    const navigate = useNavigate();

    // State management với useState (React 18 style)
    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);

    // Form data state
    const [formData, setFormData] = useState<WorkoutFormData>({
        name: '',
        description: '',
        category: WorkoutCategory.STRENGTH,
        difficulty: DifficultyLevel.BEGINNER,
        duration: 30,
        tags: [],
        exercises: [],
        isPublic: false
    });

    // Current exercise being added
    const [currentExercise, setCurrentExercise] = useState<{
        exercise: Exercise | null;
        sets: number;
        reps: number;
        duration: number;
        weight: number;
        restTime: number;
        notes: string;
    }>({
        exercise: null,
        sets: 3,
        reps: 12,
        duration: 60,
        weight: 0,
        restTime: 60,
        notes: ''
    });

    // Load exercises (mock data cho demo)
    useEffect(() => {
        setAvailableExercises(mockExercises);
    }, []);

    // Form validation
    const validateStep = useCallback((step: number): boolean => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 0: // Basic info
                if (!formData.name.trim()) {
                    newErrors.name = 'Tên workout là bắt buộc';
                }
                if (formData.name.length > 100) {
                    newErrors.name = 'Tên workout không được quá 100 ký tự';
                }
                if (formData.description && formData.description.length > 500) {
                    newErrors.description = 'Mô tả không được quá 500 ký tự';
                }
                if (formData.duration < 5 || formData.duration > 300) {
                    newErrors.duration = 'Thời gian phải từ 5-300 phút';
                }
                break;

            case 1: // Exercises
                if (formData.exercises.length === 0) {
                    newErrors.exercises = 'Phải có ít nhất 1 bài tập';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);
    // Handle form input changes
    const handleInputChange = useCallback((field: keyof WorkoutFormData, value: WorkoutFormData[keyof WorkoutFormData]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [errors]);
    // Handle tag input
    const handleTagsChange = useCallback((_: unknown, newValue: string[]) => {
        handleInputChange('tags', newValue);
    }, [handleInputChange]);

    // Add exercise to workout
    const handleAddExercise = useCallback(() => {
        if (!currentExercise.exercise) return;

        const workoutExercise: WorkoutExercise = {
            exerciseId: currentExercise.exercise._id,
            order: formData.exercises.length + 1,
            sets: currentExercise.sets,
            reps: currentExercise.reps,
            duration: currentExercise.duration,
            weight: currentExercise.weight,
            restTime: currentExercise.restTime,
            notes: currentExercise.notes,
            completed: false
        };

        setFormData(prev => ({
            ...prev,
            exercises: [...prev.exercises, workoutExercise]
        }));

        // Reset current exercise
        setCurrentExercise({
            exercise: null,
            sets: 3,
            reps: 12,
            duration: 60,
            weight: 0,
            restTime: 60,
            notes: ''
        });
    }, [currentExercise, formData.exercises]);

    // Remove exercise from workout
    const handleRemoveExercise = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            exercises: prev.exercises.filter((_, i) => i !== index).map((ex, i) => ({
                ...ex,
                order: i + 1
            }))
        }));
    }, []);

    // Handle step navigation
    const handleNext = useCallback(() => {
        if (validateStep(activeStep)) {
            setActiveStep(prev => prev + 1);
        }
    }, [activeStep, validateStep]);

    const handleBack = useCallback(() => {
        setActiveStep(prev => prev - 1);
    }, []);

    // Handle form submission
    const handleSubmit = useCallback(async () => {
        if (!validateStep(1)) return;

        setIsLoading(true);

        try {
            // TODO: Gọi API tạo workout
            // Hiện tại chỉ log data
            console.log('=== WORKOUT DATA TO SUBMIT ===');
            console.log(JSON.stringify(formData, null, 2));
            console.log('===============================');

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('Workout đã được tạo thành công! (Demo - chưa gọi API thực)');
            // navigate('/workouts');
        } catch (error) {
            console.error('Error creating workout:', error);
            setErrors({ submit: 'Có lỗi xảy ra khi tạo workout' });
        } finally {
            setIsLoading(false);
        }
    }, [formData, validateStep]);

    // Get exercise by ID (helper function)
    const getExerciseById = useCallback((id: string): Exercise | undefined => {
        return availableExercises.find(ex => ex._id === id);
    }, [availableExercises]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 4
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/workouts')}
                        sx={{ color: 'white', mb: 2 }}
                    >
                        Quay lại
                    </Button>

                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            mb: 1
                        }}
                    >
                        Tạo Workout Mới
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255,255,255,0.9)',
                            textAlign: 'center'
                        }}
                    >
                        Thiết kế chương trình tập luyện của riêng bạn
                    </Typography>
                </Box>

                {/* Main Content */}
                <Paper
                    elevation={20}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {/* Stepper */}
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {/* Step 1: Basic Information */}
                        <Step>
                            <StepLabel>
                                <Typography variant="h6" fontWeight="600">
                                    Thông tin cơ bản
                                </Typography>
                            </StepLabel>
                            <StepContent>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                                    {/* Workout Name */}
                                    <TextField
                                        label="Tên Workout"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        required
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FitnessIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />

                                    {/* Description */}
                                    <TextField
                                        label="Mô tả"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        error={!!errors.description}
                                        helperText={errors.description}
                                        multiline
                                        rows={3}
                                        fullWidth
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />

                                    {/* Category & Difficulty */}
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Loại workout</InputLabel>
                                            <Select
                                                value={formData.category}
                                                label="Loại workout"
                                                onChange={(e) => handleInputChange('category', e.target.value)}
                                            >
                                                {Object.values(WorkoutCategory).map((category) => (
                                                    <MenuItem key={category} value={category}>
                                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <InputLabel>Độ khó</InputLabel>
                                            <Select
                                                value={formData.difficulty}
                                                label="Độ khó"
                                                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                                            >
                                                {Object.values(DifficultyLevel).map((difficulty) => (
                                                    <MenuItem key={difficulty} value={difficulty}>
                                                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    {/* Duration */}
                                    <Box>
                                        <Typography variant="body1" gutterBottom>
                                            Thời gian dự kiến: {formData.duration} phút
                                        </Typography>
                                        <Slider
                                            value={formData.duration}
                                            onChange={(_, value) => handleInputChange('duration', value)}
                                            min={5}
                                            max={120}
                                            marks={[
                                                { value: 15, label: '15p' },
                                                { value: 30, label: '30p' },
                                                { value: 60, label: '1h' },
                                                { value: 90, label: '1.5h' },
                                            ]}
                                            valueLabelDisplay="auto"
                                            sx={{ mt: 2 }}
                                        />
                                    </Box>

                                    {/* Tags */}
                                    <Autocomplete
                                        multiple
                                        freeSolo
                                        options={['Beginner Friendly', 'High Intensity', 'Low Impact', 'Quick Workout', 'Full Body']}
                                        value={formData.tags}
                                        onChange={handleTagsChange}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    variant="outlined"
                                                    label={option}
                                                    {...getTagProps({ index })}
                                                    key={index}
                                                />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Tags"
                                                placeholder="Thêm tags..."
                                            />
                                        )}
                                    />

                                    {/* Public/Private */}
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.isPublic}
                                                onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                                            />
                                        }
                                        label="Công khai workout này"
                                    />

                                    {errors.submit && (
                                        <Alert severity="error">
                                            {errors.submit}
                                        </Alert>
                                    )}

                                    {/* Navigation Buttons */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            endIcon={<SettingsIcon />}
                                            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                                        >
                                            Tiếp theo
                                        </Button>
                                    </Box>
                                </Box>
                            </StepContent>
                        </Step>

                        {/* Step 2: Exercise Selection */}
                        <Step>
                            <StepLabel>
                                <Typography variant="h6" fontWeight="600">
                                    Chọn bài tập
                                </Typography>
                            </StepLabel>
                            <StepContent>
                                <Box sx={{ mt: 2 }}>
                                    {/* Add Exercise Section */}
                                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Thêm bài tập mới
                                            </Typography>

                                            {/* Exercise Selection */}
                                            <Autocomplete
                                                options={availableExercises}
                                                getOptionLabel={(option) => option.name}
                                                value={currentExercise.exercise}
                                                onChange={(_, value) =>
                                                    setCurrentExercise(prev => ({ ...prev, exercise: value }))
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Chọn bài tập"
                                                        placeholder="Tìm kiếm bài tập..."
                                                        sx={{ mb: 2 }}
                                                    />
                                                )}
                                                fullWidth
                                            />

                                            {/* Exercise Configuration */}
                                            {currentExercise.exercise && (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <TextField
                                                            label="Số sets"
                                                            type="number"
                                                            value={currentExercise.sets}
                                                            onChange={(e) =>
                                                                setCurrentExercise(prev => ({
                                                                    ...prev,
                                                                    sets: parseInt(e.target.value) || 0
                                                                }))
                                                            }
                                                            inputProps={{ min: 1, max: 20 }}
                                                            sx={{ flex: 1 }}
                                                        />

                                                        <TextField
                                                            label="Số reps"
                                                            type="number"
                                                            value={currentExercise.reps}
                                                            onChange={(e) =>
                                                                setCurrentExercise(prev => ({
                                                                    ...prev,
                                                                    reps: parseInt(e.target.value) || 0
                                                                }))
                                                            }
                                                            inputProps={{ min: 1, max: 100 }}
                                                            sx={{ flex: 1 }}
                                                        />

                                                        <TextField
                                                            label="Weight (kg)"
                                                            type="number"
                                                            value={currentExercise.weight}
                                                            onChange={(e) =>
                                                                setCurrentExercise(prev => ({
                                                                    ...prev,
                                                                    weight: parseFloat(e.target.value) || 0
                                                                }))
                                                            }
                                                            inputProps={{ min: 0, step: 0.5 }}
                                                            sx={{ flex: 1 }}
                                                        />

                                                        <TextField
                                                            label="Rest (giây)"
                                                            type="number"
                                                            value={currentExercise.restTime}
                                                            onChange={(e) =>
                                                                setCurrentExercise(prev => ({
                                                                    ...prev,
                                                                    restTime: parseInt(e.target.value) || 0
                                                                }))
                                                            }
                                                            inputProps={{ min: 0, max: 600 }}
                                                            sx={{ flex: 1 }}
                                                        />
                                                    </Box>

                                                    <TextField
                                                        label="Ghi chú"
                                                        value={currentExercise.notes}
                                                        onChange={(e) =>
                                                            setCurrentExercise(prev => ({
                                                                ...prev,
                                                                notes: e.target.value
                                                            }))
                                                        }
                                                        fullWidth
                                                        multiline
                                                        rows={2}
                                                    />

                                                    <Button
                                                        variant="contained"
                                                        startIcon={<AddIcon />}
                                                        onClick={handleAddExercise}
                                                        sx={{ alignSelf: 'flex-start' }}
                                                    >
                                                        Thêm bài tập
                                                    </Button>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Current Exercises List */}
                                    <Typography variant="h6" gutterBottom>
                                        Danh sách bài tập ({formData.exercises.length})
                                    </Typography>

                                    {formData.exercises.length === 0 ? (
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            Chưa có bài tập nào. Hãy thêm ít nhất 1 bài tập.
                                        </Alert>
                                    ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                                            {formData.exercises.map((exercise, index) => {
                                                const exerciseInfo = getExerciseById(exercise.exerciseId);
                                                return (
                                                    <Card key={index} variant="outlined">
                                                        <CardContent>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Typography variant="h6" gutterBottom>
                                                                        {index + 1}. {exerciseInfo?.name || 'Unknown Exercise'}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                        {exerciseInfo?.description}
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                                        <Chip label={`${exercise.sets} sets`} size="small" />
                                                                        <Chip label={`${exercise.reps} reps`} size="small" />
                                                                        {exercise.weight && exercise.weight > 0 && (
                                                                            <Chip label={`${exercise.weight}kg`} size="small" />
                                                                        )}
                                                                        <Chip label={`${exercise.restTime}s rest`} size="small" />
                                                                    </Box>
                                                                    {exercise.notes && (
                                                                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                                                            Ghi chú: {exercise.notes}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                                <IconButton
                                                                    color="error"
                                                                    onClick={() => handleRemoveExercise(index)}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </Box>
                                    )}

                                    {errors.exercises && (
                                        <Alert severity="error" sx={{ mb: 3 }}>
                                            {errors.exercises}
                                        </Alert>
                                    )}

                                    {/* Navigation Buttons */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                        <Button
                                            onClick={handleBack}
                                            sx={{ px: 4, py: 1.5 }}
                                        >
                                            Quay lại
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            endIcon={<PreviewIcon />}
                                            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                                        >
                                            Xem trước
                                        </Button>
                                    </Box>
                                </Box>
                            </StepContent>
                        </Step>

                        {/* Step 3: Preview & Save */}
                        <Step>
                            <StepLabel>
                                <Typography variant="h6" fontWeight="600">
                                    Xem trước & Lưu
                                </Typography>
                            </StepLabel>
                            <StepContent>
                                <Box sx={{ mt: 2 }}>
                                    {/* Workout Preview */}
                                    <Card sx={{ mb: 3 }}>
                                        <CardContent>
                                            <Typography variant="h5" gutterBottom>
                                                {formData.name}
                                            </Typography>

                                            <Typography variant="body1" paragraph>
                                                {formData.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                                <Chip
                                                    label={formData.category}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={formData.difficulty}
                                                    color="secondary"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    icon={<TimerIcon />}
                                                    label={`${formData.duration} phút`}
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={formData.isPublic ? 'Công khai' : 'Riêng tư'}
                                                    variant="outlined"
                                                    color={formData.isPublic ? 'success' : 'default'}
                                                />
                                            </Box>

                                            {formData.tags.length > 0 && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        Tags:
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                        {formData.tags.map((tag, index) => (
                                                            <Chip key={index} label={tag} size="small" />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}

                                            <Divider sx={{ my: 2 }} />

                                            <Typography variant="h6" gutterBottom>
                                                Bài tập ({formData.exercises.length})
                                            </Typography>

                                            <Stack spacing={1}>
                                                {formData.exercises.map((exercise, index) => {
                                                    const exerciseInfo = getExerciseById(exercise.exerciseId);
                                                    return (
                                                        <Box
                                                            key={index}
                                                            sx={{
                                                                p: 2,
                                                                border: '1px solid',
                                                                borderColor: 'grey.200',
                                                                borderRadius: 1
                                                            }}
                                                        >
                                                            <Typography variant="subtitle1" fontWeight="600">
                                                                {index + 1}. {exerciseInfo?.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {exercise.sets} sets × {exercise.reps} reps
                                                                {exercise.weight && exercise.weight > 0 && ` @ ${exercise.weight}kg`}
                                                                {` • ${exercise.restTime}s rest`}
                                                            </Typography>
                                                            {exercise.notes && (
                                                                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                                                                    {exercise.notes}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    );
                                                })}
                                            </Stack>
                                        </CardContent>
                                    </Card>

                                    {errors.submit && (
                                        <Alert severity="error" sx={{ mb: 3 }}>
                                            {errors.submit}
                                        </Alert>
                                    )}

                                    {/* Navigation Buttons */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                        <Button
                                            onClick={handleBack}
                                            sx={{ px: 4, py: 1.5 }}
                                        >
                                            Quay lại
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleSubmit}
                                            disabled={isLoading}
                                            startIcon={isLoading ? undefined : <SaveIcon />}
                                            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                                        >
                                            {isLoading ? 'Đang lưu...' : 'Tạo Workout'}
                                        </Button>
                                    </Box>
                                </Box>
                            </StepContent>
                        </Step>
                    </Stepper>
                </Paper>
            </Container>
        </Box>
    );
};

export default CreateWorkoutPage;
