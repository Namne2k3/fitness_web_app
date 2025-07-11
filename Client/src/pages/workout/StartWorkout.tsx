/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
/**
 * 🏃 Start Workout Page
 * Trang thực thi workout với timer, tracking và React 19 patterns
 */

import { use, useActionState, useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    LinearProgress,
    Avatar,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    IconButton,
    Grid,
    Paper,
    Stack,
    Divider,
    Alert,
    Fab
} from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Pause as PauseIcon,
    Timer as TimerIcon,
    FitnessCenter as FitnessCenterIcon,
    CheckCircle as CompleteIcon,
    Close as CloseIcon,
    ExpandMore as ExpandIcon,
    ExpandLess as CollapseIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Workout, WorkoutExercise } from '../../types/workout.interface';
import { getWorkoutById, saveWorkoutSession, WorkoutSessionData } from '../../services/myWorkoutService';

// ====================================
// 📊 Interfaces
// ====================================

interface WorkoutSession {
    id: string;
    workoutId: string;
    startTime: Date;
    currentExerciseIndex: number;
    currentSetIndex: number;
    isActive: boolean;
    isPaused: boolean;
    completedSets: Array<{
        exerciseIndex: number;
        setIndex: number;
        reps: number;
        weight: number;
        duration: number;
        completedAt: Date;
    }>;
    totalDuration: number; // seconds
    caloriesBurned: number;
    status: 'active' | 'paused' | 'completed' | 'stopped';
}

interface ExerciseProgress {
    exerciseIndex: number;
    setsCompleted: number;
    totalSets: number;
    isCompleted: boolean;
    currentSet?: {
        reps: number;
        weight: number;
        duration: number;
        restTime: number;
    };
}

interface WorkoutTimer {
    totalSeconds: number;
    exerciseSeconds: number;
    restSeconds: number;
    isResting: boolean;
}

// ====================================
// ⏱️ Timer Hook 
// ====================================

function useWorkoutTimer(isActive: boolean, isPaused: boolean) {
    const [timer, setTimer] = useState<WorkoutTimer>({
        totalSeconds: 0,
        exerciseSeconds: 0,
        restSeconds: 0,
        isResting: false
    });

    useEffect(() => {
        let interval: number;

        if (isActive && !isPaused) {
            interval = window.setInterval(() => {
                setTimer(prev => ({
                    ...prev,
                    totalSeconds: prev.totalSeconds + 1,
                    exerciseSeconds: prev.isResting ? prev.exerciseSeconds : prev.exerciseSeconds + 1,
                    restSeconds: prev.isResting ? prev.restSeconds + 1 : prev.restSeconds
                }));
            }, 1000);
        }

        return () => window.clearInterval(interval);
    }, [isActive, isPaused]);

    const startRest = (duration: number) => {
        setTimer(prev => ({
            ...prev,
            isResting: true,
            restSeconds: 0
        }));

        setTimeout(() => {
            setTimer(prev => ({ ...prev, isResting: false }));
        }, duration * 1000);
    };

    return { timer, startRest };
}

// ====================================
// 🎯 Start Workout Action (React 19)
// ====================================

interface WorkoutSessionState {
    session: WorkoutSession | null;
    error: string | null;
    isLoading: boolean;
}

type WorkoutSessionAction =
    | { type: 'START_WORKOUT'; workoutId: string }
    | { type: 'PAUSE_WORKOUT' }
    | { type: 'RESUME_WORKOUT' }
    | { type: 'COMPLETE_SET'; exerciseIndex: number; setIndex: number; data: any }
    | { type: 'NEXT_EXERCISE' }
    | { type: 'FINISH_WORKOUT' }
    | { type: 'STOP_WORKOUT' };

async function workoutSessionReducer(
    prevState: WorkoutSessionState,
    action: WorkoutSessionAction
): Promise<WorkoutSessionState> {
    try {
        switch (action.type) {
            case 'START_WORKOUT':
                const newSession: WorkoutSession = {
                    id: crypto.randomUUID(),
                    workoutId: action.workoutId,
                    startTime: new Date(),
                    currentExerciseIndex: 0,
                    currentSetIndex: 0,
                    isActive: true,
                    isPaused: false,
                    completedSets: [],
                    totalDuration: 0,
                    caloriesBurned: 0,
                    status: 'active'
                };

                return {
                    session: newSession,
                    error: null,
                    isLoading: false
                };

            case 'PAUSE_WORKOUT':
                if (!prevState.session) return prevState;
                return {
                    ...prevState,
                    session: {
                        ...prevState.session,
                        isPaused: true,
                        status: 'paused'
                    }
                };

            case 'RESUME_WORKOUT':
                if (!prevState.session) return prevState;
                return {
                    ...prevState,
                    session: {
                        ...prevState.session,
                        isPaused: false,
                        status: 'active'
                    }
                };

            case 'COMPLETE_SET':
                if (!prevState.session) return prevState;

                const completedSet = {
                    exerciseIndex: action.exerciseIndex,
                    setIndex: action.setIndex,
                    ...action.data,
                    completedAt: new Date()
                };

                return {
                    ...prevState,
                    session: {
                        ...prevState.session,
                        completedSets: [...prevState.session.completedSets, completedSet],
                        currentSetIndex: prevState.session.currentSetIndex + 1,
                        caloriesBurned: prevState.session.caloriesBurned + calculateCalories(action.data)
                    }
                };

            case 'NEXT_EXERCISE':
                if (!prevState.session) return prevState;
                return {
                    ...prevState,
                    session: {
                        ...prevState.session,
                        currentExerciseIndex: prevState.session.currentExerciseIndex + 1,
                        currentSetIndex: 0
                    }
                };

            case 'FINISH_WORKOUT':
                if (!prevState.session) return prevState;

                // Save workout session to backend
                const sessionData: WorkoutSessionData = {
                    workoutId: prevState.session.workoutId,
                    startTime: prevState.session.startTime,
                    endTime: new Date(),
                    totalDuration: prevState.session.totalDuration,
                    completedSets: prevState.session.completedSets,
                    caloriesBurned: prevState.session.caloriesBurned,
                    status: 'completed'
                };

                await saveWorkoutSession(sessionData);

                return {
                    ...prevState,
                    session: {
                        ...prevState.session,
                        isActive: false,
                        status: 'completed'
                    }
                };

            default:
                return prevState;
        }
    } catch (error) {
        return {
            ...prevState,
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false
        };
    }
}

// ====================================
// 🔧 Helper Functions
// ====================================

function calculateCalories(setData: any): number {
    // Simple calories calculation based on exercise type
    return Math.round(setData.reps * 0.5 + (setData.duration || 0) * 0.1);
}

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ====================================
// 🎨 Exercise Card Component
// ====================================

interface ExerciseCardProps {
    exercise: WorkoutExercise;
    isActive: boolean;
    progress: ExerciseProgress;
    onCompleteSet: (setIndex: number, data: unknown) => void;
    onNextSet: () => void;
}

function ExerciseCard({ exercise, isActive, progress, onCompleteSet }: ExerciseCardProps) {
    const [expanded, setExpanded] = useState(isActive);
    const [currentReps] = useState(exercise.reps || 0);
    const [currentWeight] = useState(exercise.weight || 0);

    const completionPercentage = (progress.setsCompleted / progress.totalSets) * 100;

    return (
        <Card
            sx={{
                mb: 2,
                border: isActive ? 2 : 1,
                borderColor: isActive ? 'primary.main' : 'grey.300',
                boxShadow: isActive ? 4 : 1
            }}
        >
            <CardContent>
                {/* Exercise Header */}
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            sx={{
                                bgcolor: isActive ? 'primary.main' : 'grey.400',
                                width: 40,
                                height: 40
                            }}
                        >
                            <FitnessCenterIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                {exercise.exerciseInfo?.name || `Exercise ${exercise.order}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {exercise.sets} hiệp x {exercise.reps} lần
                                {exercise.weight && ` - ${exercise.weight}kg`}
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton onClick={() => setExpanded(!expanded)}>
                        {expanded ? <CollapseIcon /> : <ExpandIcon />}
                    </IconButton>
                </Box>

                {/* Progress Bar */}
                <Box mt={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">
                            Tiến độ: {progress.setsCompleted}/{progress.totalSets} hiệp
                        </Typography>
                        <Typography variant="body2" color="primary">
                            {Math.round(completionPercentage)}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={completionPercentage}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </Box>

                {/* Expanded Content */}
                {expanded && (
                    <Box mt={3}>
                        <Divider sx={{ mb: 2 }} />

                        {/* Current Set Info */}
                        <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Hiệp {progress.setsCompleted + 1}/{progress.totalSets}
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <Typography variant="body2">Số lần:</Typography>
                                    <Typography variant="h6" color="primary">
                                        {currentReps}
                                    </Typography>
                                </Grid>
                                {exercise.weight && (
                                    <Grid xs={6}>
                                        <Typography variant="body2">Tạ:</Typography>
                                        <Typography variant="h6" color="primary">
                                            {currentWeight}kg
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>

                            {isActive && !progress.isCompleted && (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<CompleteIcon />}
                                    onClick={() => {
                                        onCompleteSet(progress.setsCompleted, {
                                            reps: currentReps,
                                            weight: currentWeight,
                                            duration: exercise.duration || 0
                                        });
                                    }}
                                    sx={{ mt: 2 }}
                                >
                                    Hoàn thành hiệp
                                </Button>
                            )}
                        </Paper>

                        {/* Rest Time */}
                        {exercise.restTime && (
                            <Box textAlign="center">
                                <Typography variant="body2" color="text.secondary">
                                    Thời gian nghỉ: {exercise.restTime}s
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

// ====================================
// 🏃 Main Start Workout Component
// ====================================

export default function StartWorkoutPage() {
    const { workoutId } = useParams<{ workoutId: string }>();
    const navigate = useNavigate();

    // ✅ React 19: useActionState cho complex workflow
    const [sessionState, dispatchSession] = useActionState(
        workoutSessionReducer,
        { session: null, error: null, isLoading: true }
    );

    // ✅ React 19: use() hook cho data fetching
    const workout = workoutId ? use(getWorkoutById(workoutId)) : null;

    // Timer hook
    const { timer, startRest } = useWorkoutTimer(
        sessionState.session?.isActive || false,
        sessionState.session?.isPaused || false
    );

    // Exercise progress tracking
    const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([]);

    // Dialog states
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [showCompleteDialog, setShowCompleteDialog] = useState(false);

    // Initialize exercise progress
    useEffect(() => {
        if (workout) {
            const progress = workout.exercises.map((exercise, index) => ({
                exerciseIndex: index,
                setsCompleted: 0,
                totalSets: exercise.sets,
                isCompleted: false
            }));
            setExerciseProgress(progress);
        }
    }, [workout]);

    // Start workout on mount
    useEffect(() => {
        if (workoutId && !sessionState.session) {
            dispatchSession({ type: 'START_WORKOUT', workoutId });
        }
    }, [workoutId, sessionState.session]);

    // ====================================
    // 🎯 Event Handlers
    // ====================================

    const handlePauseResume = () => {
        if (sessionState.session?.isPaused) {
            dispatchSession({ type: 'RESUME_WORKOUT' });
        } else {
            dispatchSession({ type: 'PAUSE_WORKOUT' });
        }
    };

    const handleCompleteSet = (exerciseIndex: number, setIndex: number, data: any) => {
        dispatchSession({
            type: 'COMPLETE_SET',
            exerciseIndex,
            setIndex,
            data
        });

        // Update exercise progress
        setExerciseProgress(prev => prev.map(progress =>
            progress.exerciseIndex === exerciseIndex
                ? {
                    ...progress,
                    setsCompleted: progress.setsCompleted + 1,
                    isCompleted: progress.setsCompleted + 1 >= progress.totalSets
                }
                : progress
        ));

        // Start rest timer if there's rest time
        const exercise = workout?.exercises[exerciseIndex];
        if (exercise?.restTime) {
            startRest(exercise.restTime);
        }
    };

    const handleFinishWorkout = async () => {
        setShowCompleteDialog(true);
    };

    const handleConfirmFinish = async () => {
        await dispatchSession({ type: 'FINISH_WORKOUT' });
        navigate('/my-workouts', {
            state: { message: 'Workout hoàn thành thành công!' }
        });
    };

    const handleStopWorkout = () => {
        setShowExitDialog(true);
    };

    const handleConfirmStop = () => {
        dispatchSession({ type: 'STOP_WORKOUT' });
        navigate('/my-workouts');
    };

    // ====================================
    // 🎨 Render
    // ====================================

    if (!workout) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">
                    Không tìm thấy workout!
                </Alert>
            </Container>
        );
    }

    const currentExercise = sessionState.session ?
        workout.exercises[sessionState.session.currentExerciseIndex] :
        workout.exercises[0];

    const currentProgress = exerciseProgress[sessionState.session?.currentExerciseIndex || 0];
    const overallProgress = exerciseProgress.reduce((acc, progress) =>
        acc + (progress.setsCompleted / progress.totalSets), 0
    ) / exerciseProgress.length * 100;

    return (
        <Container maxWidth="md" sx={{ py: 2, pb: 10 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {workout.name}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            {workout.exercises.length} bài tập • {workout.estimatedDuration} phút
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={handleStopWorkout}
                        sx={{ color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Paper>

            {/* Timer & Progress */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={6}>
                            <Box textAlign="center">
                                <TimerIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                <Typography variant="h3" fontWeight="bold" color="primary">
                                    {formatTime(timer.totalSeconds)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tổng thời gian
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid xs={12} md={6}>
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Tiến độ tổng thể
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={overallProgress}
                                    sx={{ height: 10, borderRadius: 5, mb: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {Math.round(overallProgress)}% hoàn thành
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Current Exercise */}
            {currentExercise && currentProgress && (
                <ExerciseCard
                    exercise={currentExercise}
                    isActive={true}
                    progress={currentProgress}
                    onCompleteSet={(setIndex, data) => handleCompleteSet(sessionState.session?.currentExerciseIndex || 0, setIndex, data)}
                    onNextSet={() => { }}
                />
            )}

            {/* All Exercises List */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Tất cả bài tập
            </Typography>
            {workout.exercises.map((exercise, index) => {
                const progress = exerciseProgress[index];
                if (!progress) return null;

                return (
                    <ExerciseCard
                        key={index}
                        exercise={exercise}
                        isActive={index === (sessionState.session?.currentExerciseIndex || 0)}
                        progress={progress}
                        onCompleteSet={(setIndex, data) => handleCompleteSet(index, setIndex, data)}
                        onNextSet={() => { }}
                    />
                );
            })}

            {/* Control Buttons */}
            <Box
                position="fixed"
                bottom={16}
                left="50%"
                sx={{ transform: 'translateX(-50%)', zIndex: 1000 }}
            >
                <Stack direction="row" spacing={2}>
                    <Fab
                        color="primary"
                        onClick={handlePauseResume}
                        disabled={sessionState.session?.status === 'completed'}
                    >
                        {sessionState.session?.isPaused ? <PlayIcon /> : <PauseIcon />}
                    </Fab>

                    <Fab
                        color="success"
                        onClick={handleFinishWorkout}
                        disabled={sessionState.session?.status === 'completed'}
                    >
                        <CompleteIcon />
                    </Fab>
                </Stack>
            </Box>

            {/* Exit Confirmation Dialog */}
            <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)}>
                <DialogTitle>Dừng tập luyện?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc muốn dừng tập luyện? Tiến độ sẽ không được lưu.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowExitDialog(false)}>
                        Tiếp tục tập
                    </Button>
                    <Button onClick={handleConfirmStop} color="error">
                        Dừng lại
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Complete Confirmation Dialog */}
            <Dialog open={showCompleteDialog} onClose={() => setShowCompleteDialog(false)}>
                <DialogTitle>Hoàn thành workout!</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Chúc mừng! Bạn đã hoàn thành workout.
                    </Typography>
                    <Box mt={2}>
                        <Typography variant="body2">
                            • Thời gian: {formatTime(timer.totalSeconds)}
                        </Typography>
                        <Typography variant="body2">
                            • Calories đốt cháy: ~{sessionState.session?.caloriesBurned} cal
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCompleteDialog(false)}>
                        Tiếp tục tập
                    </Button>
                    <Button onClick={handleConfirmFinish} variant="contained">
                        Hoàn thành
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
