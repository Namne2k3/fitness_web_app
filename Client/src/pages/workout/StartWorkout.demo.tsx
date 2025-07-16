import React, { useState, useEffect } from 'react';
import {
    X, CheckCircle, Circle, Clock, Trophy, ArrowLeft, Target,
    Play, Pause, RotateCcw, Plus, Minus, Heart, Flame,
    Timer, Zap, Award, TrendingUp, Calendar, User,
    Volume2, VolumeX, Settings, Info, Star
} from 'lucide-react';

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
                { id: 3, reps: 8, weight: 0, completed: false, restTime: 90 }
            ],
            instructions: [
                'Start in plank position with hands shoulder-width apart',
                'Lower your body until chest nearly touches the floor',
                'Push back up to starting position',
                'Keep your core tight throughout the movement'
            ],
            difficulty: 'Beginner',
            estimatedTime: 8,
            caloriesBurn: 45,
            completed: false
        },
        {
            id: 2,
            name: 'Barbell Squats',
            category: 'Lower Body',
            targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
            sets: [
                { id: 1, reps: 15, weight: 60, completed: false, restTime: 90 },
                { id: 2, reps: 12, weight: 70, completed: false, restTime: 90 },
                { id: 3, reps: 10, weight: 80, completed: false, restTime: 120 }
            ],
            instructions: [
                'Stand with feet shoulder-width apart',
                'Lower your body by bending knees and hips',
                'Keep chest up and knees tracking over toes',
                'Return to starting position by driving through heels'
            ],
            difficulty: 'Intermediate',
            estimatedTime: 12,
            caloriesBurn: 85,
            completed: false
        },
        {
            id: 3,
            name: 'Plank Hold',
            category: 'Core',
            targetMuscles: ['Core', 'Shoulders', 'Glutes'],
            sets: [
                { id: 1, reps: 45, weight: 0, completed: false, restTime: 45 }, // reps = seconds for time-based exercises
                { id: 2, reps: 60, weight: 0, completed: false, restTime: 45 },
                { id: 3, reps: 30, weight: 0, completed: false, restTime: 60 }
            ],
            instructions: [
                'Start in push-up position on forearms',
                'Keep body in straight line from head to heels',
                'Engage core and avoid sagging hips',
                'Breathe steadily throughout the hold'
            ],
            difficulty: 'Beginner',
            estimatedTime: 6,
            caloriesBurn: 25,
            completed: false
        },
        {
            id: 4,
            name: 'Deadlifts',
            category: 'Full Body',
            targetMuscles: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
            sets: [
                { id: 1, reps: 8, weight: 100, completed: false, restTime: 120 },
                { id: 2, reps: 6, weight: 110, completed: false, restTime: 120 },
                { id: 3, reps: 4, weight: 120, completed: false, restTime: 180 }
            ],
            instructions: [
                'Stand with feet hip-width apart, bar over mid-foot',
                'Bend at hips and knees to grip the bar',
                'Keep chest up and back straight',
                'Drive through heels to lift the bar up'
            ],
            difficulty: 'Advanced',
            estimatedTime: 15,
            caloriesBurn: 120,
            completed: false
        }
    ]);

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
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
        muscleGroups: new Set<string>()
    });

    useEffect(() => {
        let interval: NodeJ.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setWorkoutTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isResting && restTimer > 0) {
            interval = setInterval(() => {
                setRestTimer(prev => {
                    if (prev <= 1) {
                        setIsResting(false);
                        if (soundEnabled) {
                            // Play notification sound (would need actual audio implementation)
                            console.log('Rest complete!');
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isResting, restTimer, soundEnabled]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const completeSet = (exerciseId: number, setId: number) => {
        setExercises(prev => prev.map(exercise => {
            if (exercise.id === exerciseId) {
                const updatedSets = exercise.sets.map(set =>
                    set.id === setId ? { ...set, completed: true } : set
                );

                const allSetsCompleted = updatedSets.every(set => set.completed);
                const updatedExercise = { ...exercise, sets: updatedSets, completed: allSetsCompleted };

                // Update stats
                const completedSet = updatedSets.find(set => set.id === setId);
                if (completedSet) {
                    setWorkoutStats(prevStats => ({
                        totalSets: prevStats.totalSets + 1,
                        totalReps: prevStats.totalReps + completedSet.reps,
                        totalWeight: prevStats.totalWeight + (completedSet.weight * completedSet.reps),
                        caloriesBurned: prevStats.caloriesBurned + (exercise.caloriesBurn / exercise.sets.length),
                        muscleGroups: new Set([...prevStats.muscleGroups, ...exercise.targetMuscles])
                    }));
                }

                // Check for achievements
                if (allSetsCompleted) {
                    checkAchievements(exercise);
                }

                // Start rest timer if not the last set
                const currentSetIdx = updatedSets.findIndex(set => set.id === setId);
                if (currentSetIdx < updatedSets.length - 1 && completedSet?.restTime) {
                    setRestTimer(completedSet.restTime);
                    setIsResting(true);
                }

                return updatedExercise;
            }
            return exercise;
        }));
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
            setAchievements(prev => [...prev, ...newAchievements]);
            setShowAchievement(newAchievements[0]);
            setTimeout(() => setShowAchievement(null), 3000);
        }
    };

    const updateSetReps = (exerciseId: number, setId: number, newReps: number) => {
        setExercises(prev => prev.map(exercise =>
            exercise.id === exerciseId
                ? {
                    ...exercise,
                    sets: exercise.sets.map(set =>
                        set.id === setId ? { ...set, reps: Math.max(0, newReps) } : set
                    )
                }
                : exercise
        ));
    };

    const updateSetWeight = (exerciseId: number, setId: number, newWeight: number) => {
        setExercises(prev => prev.map(exercise =>
            exercise.id === exerciseId
                ? {
                    ...exercise,
                    sets: exercise.sets.map(set =>
                        set.id === setId ? { ...set, weight: Math.max(0, newWeight) } : set
                    )
                }
                : exercise
        ));
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner': return 'bg-green-100 text-green-800';
            case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'Advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            'Upper Body': 'bg-red-100 text-red-800',
            'Lower Body': 'bg-blue-100 text-blue-800',
            'Core': 'bg-green-100 text-green-800',
            'Full Body': 'bg-purple-100 text-purple-800',
            'Cardio': 'bg-orange-100 text-orange-800',
        };
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const completedExercises = exercises.filter(e => e.completed).length;
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedSets = exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
    const progressPercentage = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Achievement Popup */}
            {showAchievement && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 mx-4 text-center animate-bounce">
                        <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Achievement Unlocked!</h3>
                        <p className="text-gray-600 text-lg">{showAchievement}</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onEndWorkout}
                            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>End Workout</span>
                        </button>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className="text-white hover:text-gray-300 transition-colors"
                            >
                                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                            </button>

                            <button
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                            >
                                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                <span>{formatTime(workoutTimer)}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Workout Stats Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
                        <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{completedSets}/{totalSets}</div>
                        <div className="text-white/70 text-sm">Sets</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
                        <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{Math.round(workoutStats.caloriesBurned)}</div>
                        <div className="text-white/70 text-sm">Calories</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
                        <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{workoutStats.totalWeight}kg</div>
                        <div className="text-white/70 text-sm">Total Weight</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
                        <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{Math.round(progressPercentage)}%</div>
                        <div className="text-white/70 text-sm">Progress</div>
                    </div>
                </div>

                {/* Rest Timer */}
                {isResting && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-6 text-center">
                        <Timer className="w-12 h-12 text-white mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Rest Time</h3>
                        <div className="text-4xl font-bold text-white mb-2">{formatTime(restTimer)}</div>
                        <p className="text-white/80">Take a breather, you're doing great!</p>
                    </div>
                )}

                {/* Progress Bar */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-white">Workout Progress</h2>
                        <div className="text-white text-lg font-semibold">
                            {completedExercises}/{exercises.length} Exercises
                        </div>
                    </div>

                    <div className="bg-white/20 rounded-full h-4 overflow-hidden mb-4">
                        <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-white/80">
                            <span className="font-semibold">Muscle Groups:</span> {workoutStats.muscleGroups.size}
                        </div>
                        <div className="text-white/80">
                            <span className="font-semibold">Total Reps:</span> {workoutStats.totalReps}
                        </div>
                        <div className="text-white/80">
                            <span className="font-semibold">Achievements:</span> {achievements.length}
                        </div>
                    </div>
                </div>

                {/* Exercise List */}
                <div className="space-y-6">
                    {exercises.map((exercise) => (
                        <div
                            key={exercise.id}
                            className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 ${exercise.completed
                                ? 'bg-green-500/20 border-green-400/30'
                                : 'hover:bg-white/15'
                                }`}
                        >
                            {/* Exercise Header */}
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className={`text-2xl font-bold ${exercise.completed ? 'text-green-400' : 'text-white'
                                                }`}>
                                                {exercise.name}
                                            </h3>
                                            {exercise.completed && <CheckCircle className="w-6 h-6 text-green-400" />}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(exercise.category)}`}>
                                                {exercise.category}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                                                {exercise.difficulty}
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {exercise.estimatedTime} min
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                {exercise.caloriesBurn} cal
                                            </span>
                                        </div>

                                        <div className="text-white/70 text-sm">
                                            <span className="font-semibold">Target Muscles:</span> {exercise.targetMuscles.join(', ')}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowInstructions(showInstructions === exercise.id ? 0 : exercise.id)}
                                        className="text-white/60 hover:text-white transition-colors"
                                    >
                                        <Info className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Instructions */}
                                {showInstructions === exercise.id && (
                                    <div className="bg-white/5 rounded-xl p-4 mt-4">
                                        <h4 className="text-white font-semibold mb-3">Instructions:</h4>
                                        <ol className="space-y-2">
                                            {exercise.instructions.map((instruction, index) => (
                                                <li key={index} className="text-white/80 text-sm flex gap-3">
                                                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                        {index + 1}
                                                    </span>
                                                    {instruction}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </div>

                            {/* Sets */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {exercise.sets.map((set, setIndex) => (
                                        <div
                                            key={set.id}
                                            className={`bg-white/5 rounded-xl p-4 border transition-all duration-200 ${set.completed
                                                ? 'border-green-400/30 bg-green-500/10'
                                                : 'border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => completeSet(exercise.id, set.id)}
                                                        disabled={set.completed}
                                                        className="flex-shrink-0 transition-colors"
                                                    >
                                                        {set.completed ? (
                                                            <CheckCircle className="w-8 h-8 text-green-400" />
                                                        ) : (
                                                            <Circle className="w-8 h-8 text-white/60 hover:text-white" />
                                                        )}
                                                    </button>

                                                    <div className="text-white font-semibold">
                                                        Set {setIndex + 1}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    {/* Reps */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white/70 text-sm">Reps:</span>
                                                        <button
                                                            onClick={() => updateSetReps(exercise.id, set.id, set.reps - 1)}
                                                            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="text-white font-bold w-8 text-center">{set.reps}</span>
                                                        <button
                                                            onClick={() => updateSetReps(exercise.id, set.id, set.reps + 1)}
                                                            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Weight */}
                                                    {set.weight > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-white/70 text-sm">Weight:</span>
                                                            <button
                                                                onClick={() => updateSetWeight(exercise.id, set.id, set.weight - 2.5)}
                                                                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="text-white font-bold w-12 text-center">{set.weight}kg</span>
                                                            <button
                                                                onClick={() => updateSetWeight(exercise.id, set.id, set.weight + 2.5)}
                                                                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Rest Time */}
                                                    {set.restTime && (
                                                        <div className="text-white/70 text-sm">
                                                            Rest: {formatTime(set.restTime)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Completion Message */}
                {completedExercises === exercises.length && (
                    <div className="mt-8 text-center">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-8">
                            <Trophy className="w-20 h-20 text-white mx-auto mb-4" />
                            <h3 className="text-3xl font-bold text-white mb-2">Workout Complete!</h3>
                            <p className="text-white/90 mb-6 text-lg">
                                Amazing work! You've completed all exercises in {formatTime(workoutTimer)}.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-white">
                                <div>
                                    <div className="text-2xl font-bold">{workoutStats.totalSets}</div>
                                    <div className="text-sm opacity-80">Total Sets</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{workoutStats.totalReps}</div>
                                    <div className="text-sm opacity-80">Total Reps</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{Math.round(workoutStats.caloriesBurned)}</div>
                                    <div className="text-sm opacity-80">Calories Burned</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{achievements.length}</div>
                                    <div className="text-sm opacity-80">Achievements</div>
                                </div>
                            </div>

                            <button
                                onClick={onEndWorkout}
                                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
                            >
                                Finish & Save Progress
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutSession;