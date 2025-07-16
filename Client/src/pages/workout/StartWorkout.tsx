/* eslint-disable @typescript-eslint/no-unused-vars */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import InfoIcon from '@mui/icons-material/Info';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Fade,
    IconButton,
    LinearProgress,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface Set {
    id: number;
    reps: number;
    weight: number;
    completed: boolean;
    restTime?: number;
}

interface Exercise {
    id: number;
    name: string;
    category: string;
    targetMuscles: string[];
    sets: Set[];
    instructions: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedTime: number; // in minutes
    caloriesBurn: number;
    completed: boolean;
}

interface WorkoutSessionProps {
    onEndWorkout: () => void;
}

const difficultyColors = {
    Beginner: { bg: '#e8f5e8', color: '#388e3c' },
    Intermediate: { bg: '#fff3e0', color: '#f57c00' },
    Advanced: { bg: '#ffebee', color: '#d32f2f' },
};

const categoryIcons: Record<string, React.ReactNode> = {
    'Upper Body': <FitnessCenterIcon color="error" />,
    'Lower Body': <FitnessCenterIcon color="primary" />,
    'Core': <BoltIcon color="success" />,
    'Full Body': <TrendingUpIcon color="secondary" />,
    'Cardio': <WhatshotIcon color="warning" />,
};

const WorkoutSession: React.FC<WorkoutSessionProps> = ({ onEndWorkout }) => {
    const [exercises, setExercises] = useState<Exercise[]>([
        {
            id: 1,
            name: 'Push-ups',
            category: 'Upper Body',
            targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
            sets: [
                { id: 1, reps: 12, weight: 0, completed: false, restTime: 60 },
                { id: 2, reps: 10, weight: 0, completed: false, restTime: 60 },
                { id: 3, reps: 8, weight: 0, completed: false, restTime: 90 },
            ],
            instructions: [
                'Start in plank position with hands shoulder-width apart',
                'Lower your body until chest nearly touches the floor',
                'Push back up to starting position',
                'Keep your core tight throughout the movement',
            ],
            difficulty: 'Beginner',
            estimatedTime: 8,
            caloriesBurn: 45,
            completed: false,
        },
        {
            id: 2,
            name: 'Barbell Squats',
            category: 'Lower Body',
            targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
            sets: [
                { id: 1, reps: 15, weight: 60, completed: false, restTime: 90 },
                { id: 2, reps: 12, weight: 70, completed: false, restTime: 90 },
                { id: 3, reps: 10, weight: 80, completed: false, restTime: 120 },
            ],
            instructions: [
                'Stand with feet shoulder-width apart',
                'Lower your body by bending knees and hips',
                'Keep chest up and knees tracking over toes',
                'Return to starting position by driving through heels',
            ],
            difficulty: 'Intermediate',
            estimatedTime: 12,
            caloriesBurn: 85,
            completed: false,
        },
        {
            id: 3,
            name: 'Plank Hold',
            category: 'Core',
            targetMuscles: ['Core', 'Shoulders', 'Glutes'],
            sets: [
                { id: 1, reps: 45, weight: 0, completed: false, restTime: 45 },
                { id: 2, reps: 60, weight: 0, completed: false, restTime: 45 },
                { id: 3, reps: 30, weight: 0, completed: false, restTime: 60 },
            ],
            instructions: [
                'Start in push-up position on forearms',
                'Keep body in straight line from head to heels',
                'Engage core and avoid sagging hips',
                'Breathe steadily throughout the hold',
            ],
            difficulty: 'Beginner',
            estimatedTime: 6,
            caloriesBurn: 25,
            completed: false,
        },
        {
            id: 4,
            name: 'Deadlifts',
            category: 'Full Body',
            targetMuscles: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
            sets: [
                { id: 1, reps: 8, weight: 100, completed: false, restTime: 120 },
                { id: 2, reps: 6, weight: 110, completed: false, restTime: 120 },
                { id: 3, reps: 4, weight: 120, completed: false, restTime: 180 },
            ],
            instructions: [
                'Stand with feet hip-width apart, bar over mid-foot',
                'Bend at hips and knees to grip the bar',
                'Keep chest up and back straight',
                'Drive through heels to lift the bar up',
            ],
            difficulty: 'Advanced',
            estimatedTime: 15,
            caloriesBurn: 120,
            completed: false,
        },
    ]);

    const [isResting, setIsResting] = useState(false);
    const [restTimer, setRestTimer] = useState(0);
    const [workoutTimer, setWorkoutTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [achievements, setAchievements] = useState<string[]>([]);
    const [showAchievement, setShowAchievement] = useState<string | null>(null);

    // Workout stats
    const [workoutStats, setWorkoutStats] = useState({
        totalSets: 0,
        totalReps: 0,
        totalWeight: 0,
        caloriesBurned: 0,
        muscleGroups: new Set<string>(),
    });

    useEffect(() => {
        let interval: number;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setWorkoutTimer((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    useEffect(() => {
        let interval: number;
        if (isResting && restTimer > 0) {
            interval = setInterval(() => {
                setRestTimer((prev) => {
                    if (prev <= 1) {
                        setIsResting(false);
                        // Optionally play sound
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isResting, restTimer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const completeSet = (exerciseId: number, setId: number) => {
        setExercises((prev) =>
            prev.map((exercise) => {
                if (exercise.id === exerciseId) {
                    const updatedSets = exercise.sets.map((set) =>
                        set.id === setId ? { ...set, completed: true } : set
                    );
                    const allSetsCompleted = updatedSets.every((set) => set.completed);
                    const updatedExercise = { ...exercise, sets: updatedSets, completed: allSetsCompleted };

                    // Update stats
                    const completedSet = updatedSets.find((set) => set.id === setId);
                    if (completedSet) {
                        setWorkoutStats((prevStats) => ({
                            totalSets: prevStats.totalSets + 1,
                            totalReps: prevStats.totalReps + completedSet.reps,
                            totalWeight: prevStats.totalWeight + completedSet.weight * completedSet.reps,
                            caloriesBurned:
                                prevStats.caloriesBurned + exercise.caloriesBurn / exercise.sets.length,
                            muscleGroups: new Set([...prevStats.muscleGroups, ...exercise.targetMuscles]),
                        }));
                    }

                    // Check for achievements
                    if (allSetsCompleted) {
                        checkAchievements(exercise);
                    }

                    // Start rest timer if not the last set
                    const currentSetIdx = updatedSets.findIndex((set) => set.id === setId);
                    if (currentSetIdx < updatedSets.length - 1 && completedSet?.restTime) {
                        setRestTimer(completedSet.restTime);
                        setIsResting(true);
                    }

                    return updatedExercise;
                }
                return exercise;
            })
        );
    };

    const checkAchievements = (exercise: Exercise) => {
        const newAchievements: string[] = [];
        if (exercise.difficulty === 'Advanced') {
            newAchievements.push('Advanced Warrior');
        }
        if (exercise.category === 'Full Body') {
            newAchievements.push('Full Body Champion');
        }
        if (newAchievements.length > 0) {
            setAchievements((prev) => [...prev, ...newAchievements]);
            setShowAchievement(newAchievements[0]);
            setTimeout(() => setShowAchievement(null), 3000);
        }
    };

    const updateSetReps = (exerciseId: number, setId: number, newReps: number) => {
        setExercises((prev) =>
            prev.map((exercise) =>
                exercise.id === exerciseId
                    ? {
                        ...exercise,
                        sets: exercise.sets.map((set) =>
                            set.id === setId ? { ...set, reps: Math.max(0, newReps) } : set
                        ),
                    }
                    : exercise
            )
        );
    };

    const updateSetWeight = (exerciseId: number, setId: number, newWeight: number) => {
        setExercises((prev) =>
            prev.map((exercise) =>
                exercise.id === exerciseId
                    ? {
                        ...exercise,
                        sets: exercise.sets.map((set) =>
                            set.id === setId ? { ...set, weight: Math.max(0, newWeight) } : set
                        ),
                    }
                    : exercise
            )
        );
    };

    const completedExercises = exercises.filter((e) => e.completed).length;
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedSets = exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0);
    const progressPercentage = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

                pt: '8rem'
            }}
        >
            {/* Achievement Popup */}
            <Fade in={!!showAchievement} timeout={300}>
                <Box
                    sx={{
                        position: 'fixed',
                        inset: 0,
                        display: showAchievement ? 'flex' : 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1300,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                    }}
                >
                    <Paper
                        elevation={24}
                        sx={{ p: 6, borderRadius: 4, textAlign: 'center', minWidth: 320 }}
                    >
                        <EmojiEventsIcon sx={{ fontSize: 64, color: '#ffb300', mb: 2 }} />
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Achievement Unlocked!
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {showAchievement}
                        </Typography>
                    </Paper>
                </Box>
            </Fade>

            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}
            >
                <Container maxWidth="lg" sx={{ py: 2 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <IconButton onClick={onEndWorkout} color="inherit" aria-label="Quay lại">
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5" fontWeight={700}>
                            Bắt đầu buổi tập
                        </Typography>
                        <Box />
                    </Stack>
                </Container>
            </Paper>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Workout Stats Dashboard */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
                        <FitnessCenterIcon sx={{ fontSize: 32, color: '#1976d2', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            Tổng số set
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>{workoutStats.totalSets}</Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' }}>
                        <WhatshotIcon sx={{ fontSize: 32, color: '#ff9800', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            Calories
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>{Math.round(workoutStats.caloriesBurned)}</Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)' }}>
                        <BoltIcon sx={{ fontSize: 32, color: '#f44336', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            Tổng số reps
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>{workoutStats.totalReps}</Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' }}>
                        <TrendingUpIcon sx={{ fontSize: 32, color: '#4caf50', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            Tổng khối lượng
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>{workoutStats.totalWeight}</Typography>
                    </Paper>
                </Box>

                {/* Rest Timer */}
                {isResting && (
                    <Fade in={isResting} timeout={300}>
                        <Paper elevation={6} sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 4, background: 'linear-gradient(90deg, #42a5f5 0%, #ff9800 100%)', color: 'white' }}>
                            <TimerIcon sx={{ fontSize: 48, mb: 2 }} />
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                Nghỉ giữa set
                            </Typography>
                            <Typography variant="h2" fontWeight="bold" sx={{ letterSpacing: 2 }}>
                                {formatTime(restTimer)}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                Chuẩn bị cho set tiếp theo!
                            </Typography>
                        </Paper>
                    </Fade>
                )}

                {/* Progress Bar */}
                <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight={700}>
                            Tiến độ buổi tập
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {completedSets}/{totalSets} sets hoàn thành
                        </Typography>
                    </Stack>
                    <LinearProgress
                        variant="determinate"
                        value={progressPercentage}
                        sx={{
                            height: 12, borderRadius: 6, background: 'rgba(0,0,0,0.06)', mb: 2,
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 6,
                                background: 'linear-gradient(90deg, #42a5f5 0%, #ff9800 100%)',
                            },
                        }}
                    />
                    <Stack direction="row" spacing={2} mt={2}>
                        <Chip icon={<TimerIcon />} label={`Thời gian: ${formatTime(workoutTimer)}`} color="primary" />
                        <Chip icon={<TrendingUpIcon />} label={`Nhóm cơ: ${Array.from(workoutStats.muscleGroups).length}`} color="success" />
                    </Stack>
                </Paper>

                {/* Exercise List */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                    {exercises.map((exercise) => (
                        <Card key={exercise.id} elevation={3} sx={{ borderRadius: 3, background: difficultyColors[exercise.difficulty].bg, mb: 2, transition: 'all 0.3s ease', '&:hover': { boxShadow: 8, transform: 'translateY(-4px)' } }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                                    <Avatar sx={{ bgcolor: difficultyColors[exercise.difficulty].color, width: 48, height: 48 }}>
                                        {categoryIcons[exercise.category] || <InfoIcon />}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700} color={difficultyColors[exercise.difficulty].color}>
                                            {exercise.name}
                                        </Typography>
                                        <Chip label={exercise.difficulty} sx={{ bgcolor: difficultyColors[exercise.difficulty].bg, color: difficultyColors[exercise.difficulty].color, fontWeight: 600, ml: 1 }} />
                                    </Box>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" mb={1}>
                                    {exercise.category} | {exercise.targetMuscles.join(', ')}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Stack spacing={2}>
                                    {exercise.sets.map((set) => (
                                        <Paper key={set.id} elevation={0} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: set.completed ? 'linear-gradient(90deg, #e8f5e8 0%, #c8e6c9 100%)' : 'white' }}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Chip label={`Set ${set.id}`} color={set.completed ? 'success' : 'default'} />
                                                <Typography variant="body2">Reps: {set.reps}</Typography>
                                                <Typography variant="body2">Weight: {set.weight}kg</Typography>
                                                <Typography variant="body2">Rest: {set.restTime}s</Typography>
                                            </Stack>
                                            <Box>
                                                {set.completed ? (
                                                    <CheckCircleIcon color="success" />
                                                ) : (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        sx={{ borderRadius: 2, fontWeight: 600, px: 2, py: 1, ml: 2 }}
                                                        onClick={() => completeSet(exercise.id, set.id)}
                                                    >
                                                        Hoàn thành
                                                    </Button>
                                                )}
                                            </Box>
                                        </Paper>
                                    ))}
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                                <Box>
                                    <Button
                                        variant="outlined"
                                        startIcon={<InfoIcon />}
                                        onClick={() => setShowInstructions((prev) => !prev)}
                                        sx={{ borderRadius: 2, fontWeight: 600 }}
                                    >
                                        {showInstructions ? 'Ẩn hướng dẫn' : 'Xem hướng dẫn'}
                                    </Button>
                                    <Fade in={showInstructions} timeout={300}>
                                        <Box sx={{ mt: 2 }}>
                                            {exercise.instructions.map((step, idx) => (
                                                <Typography key={idx} variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    {idx + 1}. {step}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Fade>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Completion Message */}
                {completedExercises === exercises.length && (
                    <Fade in timeout={300}>
                        <Alert severity="success" sx={{ mt: 6, fontSize: '1.25rem', fontWeight: 700, borderRadius: 3 }}>
                            <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                            Chúc mừng! Bạn đã hoàn thành toàn bộ buổi tập.
                        </Alert>
                    </Fade>
                )}
            </Container>
        </Box>
    );
};

export default WorkoutSession;
