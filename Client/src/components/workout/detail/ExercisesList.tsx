/**
 * 🎯 Exercises List Component - Display workout exercises
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    useTheme,
    alpha
} from '@mui/material';
import {
    FitnessCenter
} from '@mui/icons-material';

// Components
import ExerciseCard from '../../exercise/ExerciseCard';

// Types
import { Exercise, ExerciseCategory } from '../../../types/exercise.interface';
import { WorkoutExercise } from '../../../types/workout.interface';

interface ExercisesListProps {
    exercises: WorkoutExercise[];
}

const ExercisesList: React.FC<ExercisesListProps> = ({ exercises }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    console.log("Check exercises", exercises);

    // Handle exercise click to navigate to detail page
    const handleExerciseClick = (exercise: Exercise) => {
        console.log("Check exercise", exercise);
        // Use slug if available, fallback to id for backward compatibility
        const identifier = exercise.slug || exercise._id;
        navigate(`/exercises/${identifier}`);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.grey[50], 0.98)} 100%)`,
                border: '2px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <FitnessCenter sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Exercises ({exercises.length})
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)'
                    },
                    gap: 3,
                    mt: 2,
                    // Ensure all grid items have equal height
                    gridAutoRows: '1fr', // This makes all rows the same height
                    '& > *': {
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '450px', // Set consistent minimum height
                    }
                }}
            >
                {exercises.map((exercise, idx) => {
                    const info = exercise.exerciseInfo;
                    if (!info) {
                        // If no exerciseInfo, skip rendering or show a fallback
                        return null;
                    }
                    // Only use info (ExerciseFull) for ExerciseCard
                    const cardExercise = {
                        _id: info._id || exercise.exerciseId || String(idx),
                        name: info.name || 'Exercise',
                        description: info.description || '',
                        slug: info.slug || '',
                        instructions: info.instructions || [],
                        // Convert category to ExerciseCategory enum if possible, fallback to 'strength'
                        category: Object.values(ExerciseCategory).includes(info.category as ExerciseCategory)
                            ? (info.category as ExerciseCategory)
                            : ExerciseCategory.STRENGTH,
                        primaryMuscleGroups: info.primaryMuscleGroups || [],
                        secondaryMuscleGroups: info.secondaryMuscleGroups || [],
                        equipment: info.equipment || [],
                        difficulty: ['beginner', 'intermediate', 'advanced'].includes(String(info.difficulty))
                            ? (info.difficulty as 'beginner' | 'intermediate' | 'advanced')
                            : 'beginner',
                        images: info.images || [],
                        videoUrl: info.videoUrl || '',
                        gifUrl: info.gifUrl || '',
                        caloriesPerMinute: info.caloriesPerMinute,
                        averageIntensity: info.averageIntensity,
                        variations: info.variations || [],
                        precautions: info.precautions || [],
                        contraindications: info.contraindications || [],
                        isApproved: info.isApproved ?? true,
                        createdBy: info.createdBy || '',
                        createdAt: info.createdAt || new Date(),
                        updatedAt: info.updatedAt || new Date(),
                    };
                    return (
                        <Box
                            key={exercise.exerciseId || idx}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)'
                                },
                                // Force consistent card structure
                                '& .MuiCard-root': {
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                },
                                '& .MuiCardContent-root': {
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '16px !important'
                                },
                                '& .MuiCardActions-root': {
                                    marginTop: 'auto',
                                    padding: '8px 16px 16px 16px'
                                },
                                // Ensure image containers have consistent height
                                '& img': {
                                    height: '180px',
                                    objectFit: 'contain',
                                    width: '100%'
                                }
                            }}
                        >
                            <ExerciseCard
                                exercise={cardExercise}
                                variant="detail"
                                showActions={false}
                                onExerciseClick={handleExerciseClick}
                            />
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};

export default ExercisesList;
