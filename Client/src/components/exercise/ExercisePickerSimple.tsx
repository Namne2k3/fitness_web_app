/**
 * 🏋️ ExercisePicker - Simplified React 19 Component
 * Simple exercise picker cho workout creation workflow
 */

import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
    Paper,
    Avatar,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    FitnessCenter as FitnessCenterIcon,
    Whatshot as CaloriesIcon
} from '@mui/icons-material';
import { Exercise, ExerciseCategory } from '../../types';

// ================================
// 🎯 Types & Interfaces
// ================================
interface ExercisePickerProps {
    onQuickAdd: (exercise: Exercise) => void;
    onOpenLibrary: () => void;
    title?: string;
}

// ================================
// 🏋️ Main ExercisePicker Component
// ================================
const ExercisePicker: React.FC<ExercisePickerProps> = ({
    onQuickAdd,
    onOpenLibrary,
    title = "Add Exercises to Your Workout"
}) => {
    // Popular/Quick exercises for fast selection
    const quickExercises: Exercise[] = [
        {
            _id: 'quick-1',
            name: 'Push-ups',
            description: 'Classic upper body exercise targeting chest, shoulders, and triceps',
            category: ExerciseCategory.STRENGTH,
            primaryMuscleGroups: ['chest', 'shoulders', 'triceps'],
            secondaryMuscleGroups: ['core'],
            equipment: ['bodyweight'],
            difficulty: 'beginner',
            instructions: ['Start in plank position', 'Lower chest to ground', 'Push back up'],
            images: [],
            caloriesPerMinute: 8,
            variations: [],
            precautions: [],
            contraindications: [],
            isApproved: true,
            createdBy: 'system',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: 'quick-2',
            name: 'Squats',
            description: 'Lower body compound exercise for legs and glutes',
            category: ExerciseCategory.STRENGTH,
            primaryMuscleGroups: ['quadriceps', 'glutes'],
            secondaryMuscleGroups: ['hamstrings', 'calves'],
            equipment: ['bodyweight'],
            difficulty: 'beginner',
            instructions: ['Stand with feet shoulder-width apart', 'Lower down as if sitting', 'Return to standing'],
            images: [],
            caloriesPerMinute: 10,
            variations: [],
            precautions: [],
            contraindications: [],
            isApproved: true,
            createdBy: 'system',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: 'quick-3',
            name: 'Plank',
            description: 'Core strengthening isometric exercise',
            category: ExerciseCategory.STRENGTH,
            primaryMuscleGroups: ['core'],
            secondaryMuscleGroups: ['shoulders', 'back'],
            equipment: ['bodyweight'],
            difficulty: 'beginner',
            instructions: ['Start in push-up position', 'Hold steady position', 'Keep straight line from head to heels'],
            images: [],
            caloriesPerMinute: 5,
            variations: [],
            precautions: [],
            contraindications: [],
            isApproved: true,
            createdBy: 'system',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: 'quick-4',
            name: 'Burpees',
            description: 'Full-body cardio and strength exercise',
            category: ExerciseCategory.CARDIO,
            primaryMuscleGroups: ['full-body'],
            secondaryMuscleGroups: [],
            equipment: ['bodyweight'],
            difficulty: 'intermediate',
            instructions: ['Start standing', 'Drop to squat', 'Jump back to plank', 'Return and jump up'],
            images: [],
            caloriesPerMinute: 15,
            variations: [],
            precautions: [],
            contraindications: [],
            isApproved: true,
            createdBy: 'system',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: 'quick-5',
            name: 'Lunges',
            description: 'Unilateral leg exercise for balance and strength',
            category: ExerciseCategory.STRENGTH,
            primaryMuscleGroups: ['quadriceps', 'glutes'],
            secondaryMuscleGroups: ['hamstrings', 'calves'],
            equipment: ['bodyweight'],
            difficulty: 'beginner',
            instructions: ['Step forward into lunge', 'Lower back knee toward ground', 'Return to starting position'],
            images: [],
            caloriesPerMinute: 8,
            variations: [],
            precautions: [],
            contraindications: [],
            isApproved: true,
            createdBy: 'system',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: 'quick-6',
            name: 'Mountain Climbers',
            description: 'Dynamic cardio exercise with core engagement',
            category: ExerciseCategory.CARDIO,
            primaryMuscleGroups: ['core', 'shoulders'],
            secondaryMuscleGroups: ['legs'],
            equipment: ['bodyweight'],
            difficulty: 'intermediate',
            instructions: ['Start in plank position', 'Bring knees to chest alternately', 'Keep quick pace'],
            images: [],
            caloriesPerMinute: 12,
            variations: [],
            precautions: [],
            contraindications: [],
            isApproved: true,
            createdBy: 'system',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    // Get difficulty color for visual feedback
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return '#4caf50';
            case 'intermediate': return '#ff9800';
            case 'advanced': return '#f44336';
            default: return '#757575';
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.08)',
                backdropFilter: 'blur(10px)',
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                    <FitnessCenterIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="600" color="#1565c0">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Choose from popular exercises or browse the full library
                    </Typography>
                </Box>
            </Box>

            {/* Quick Actions Section */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                    🚀 Quick Add
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Popular exercises to get started quickly
                </Typography>                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                        gap: 2
                    }}
                >
                    {quickExercises.map((exercise) => (
                        <Card
                            key={exercise._id}
                            sx={{
                                height: '100%',
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(0,0,0,0.08)',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                    borderColor: '#1976d2',
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2 }}>
                                {/* Exercise Header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        color: '#1565c0',
                                        flexGrow: 1
                                    }}>
                                        {exercise.name}
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: getDifficultyColor(exercise.difficulty),
                                            ml: 1
                                        }}
                                    />
                                </Box>

                                {/* Exercise Details */}
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
                                    {exercise.description}
                                </Typography>

                                {/* Metrics */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CaloriesIcon sx={{ fontSize: 16, color: '#ff5722' }} />
                                        <Typography variant="caption" color="text.secondary">
                                            {exercise.caloriesPerMinute}/min
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <FitnessCenterIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                                        <Typography variant="caption" color="text.secondary">
                                            {exercise.primaryMuscleGroups.slice(0, 2).join(', ')}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Add Button */}
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => onQuickAdd(exercise)}
                                    sx={{
                                        bgcolor: '#1976d2',
                                        '&:hover': { bgcolor: '#1565c0' },
                                        fontWeight: 600,
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    Add to Workout
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Exercise Library Section */}
            <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                    📚 Exercise Library
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Browse our complete database of exercises with advanced filtering
                </Typography>

                <Card
                    sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        border: '2px dashed #1976d2',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                            transform: 'scale(1.02)',
                        }
                    }}
                    onClick={onOpenLibrary}
                >
                    <SearchIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1565c0', mb: 1 }}>
                        Browse Full Exercise Database
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Search, filter, and add multiple exercises at once
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        sx={{
                            bgcolor: '#1976d2',
                            '&:hover': { bgcolor: '#1565c0' },
                            fontWeight: 600
                        }}
                    >
                        Open Exercise Library
                    </Button>
                </Card>
            </Box>

            {/* Help Alert */}
            <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    💡 <strong>Pro Tip:</strong> Start with 3-5 exercises for a balanced workout.
                    You can always add more or adjust sets/reps later!
                </Typography>
            </Alert>
        </Paper>
    );
};

export default ExercisePicker;
