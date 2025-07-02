/**
 * 💪 WorkoutExerciseCard - Card for Workout Creation
 * React 19 implementation with drag & drop support
 */

import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    IconButton,
    TextField,
    Chip,
    Stack,
    Divider,
    useTheme,
    alpha
} from '@mui/material';
import {
    DragIndicator,
    Delete,
    FitnessCenter,
    Timer,
    Scale,
    Repeat
} from '@mui/icons-material';
import { WorkoutExercise } from '../../../../types';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

interface WorkoutExerciseCardProps {
    exercise: WorkoutExercise & { name?: string };
    index: number;
    dragHandleProps?: Record<string, unknown>;
    onUpdate: (updates: Partial<WorkoutExercise>) => void;
    onRemove: () => void;
}

const WorkoutExerciseCard: React.FC<WorkoutExerciseCardProps> = ({
    exercise,
    index,
    dragHandleProps,
    onUpdate,
    onRemove
}) => {
    const theme = useTheme();

    const handleFieldUpdate = (field: keyof WorkoutExercise, value: number | string) => {
        onUpdate({ [field]: value });
    };

    return (
        <Card
            sx={{
                mb: 2,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'rgba(25,118,210,0.10)',
                background: `linear-gradient(135deg, ${theme.palette.primary.light}10 0%, ${theme.palette.secondary.light}10 100%)`,
                boxShadow: '0 2px 12px rgba(25,118,210,0.06)',
                transition: 'all 0.3s cubic-bezier(.4,1.3,.6,1)',
                '&:hover': {
                    boxShadow: '0 8px 32px rgba(25,118,210,0.13)',
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px) scale(1.01)'
                }
            }}
        >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                        {...dragHandleProps}
                        sx={{
                            cursor: 'grab',
                            color: 'primary.main',
                            mr: 2,
                            fontSize: 28,
                            opacity: 0.7,
                            '&:active': { cursor: 'grabbing', opacity: 1 }
                        }}
                        aria-label="Drag to reorder"
                    >
                        <DragIndicator fontSize="inherit" />
                    </Box>

                    <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                            bgcolor: 'secondary.main',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: 16,
                            px: 1.5,
                            mr: 2,
                            boxShadow: '0 2px 8px rgba(255,152,0,0.10)'
                        }}
                    />

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                color: 'primary.dark',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                letterSpacing: 0.2
                            }}
                        >
                            {exercise.name || 'Unknown Exercise'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                            Exercise {index + 1}
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={onRemove}
                        size="medium"
                        aria-label="Remove exercise"
                        sx={{
                            color: 'error.main',
                            ml: 1,
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.10),
                                transform: 'scale(1.08)'
                            }
                        }}
                    >
                        <Delete />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2, borderColor: 'rgba(25,118,210,0.10)' }} />

                {/* Exercise Parameters */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ mb: 1 }}
                >
                    {/* Sets */}
                    <Box sx={{ minWidth: 120, flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={600}>
                            <FitnessCenter sx={{ fontSize: 18, mr: 0.5, color: 'primary.main' }} /> Sets
                        </Typography>
                        <TextField
                            type="number"
                            value={exercise.sets || 3}
                            onChange={(e) => handleFieldUpdate('sets', parseInt(e.target.value) || 0)}
                            size="small"
                            inputProps={{ min: 1, max: 20, style: { textAlign: 'center', fontWeight: 600 } }}
                            sx={{ width: '100%', bgcolor: 'white', borderRadius: 2 }}
                        />
                    </Box>

                    {/* Reps */}
                    <Box sx={{ minWidth: 120, flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={600}>
                            <Repeat sx={{ fontSize: 18, mr: 0.5, color: 'secondary.main' }} /> Reps
                        </Typography>
                        <TextField
                            type="number"
                            value={exercise.reps || 12}
                            onChange={(e) => handleFieldUpdate('reps', parseInt(e.target.value) || 0)}
                            size="small"
                            inputProps={{ min: 1, max: 100, style: { textAlign: 'center', fontWeight: 600 } }}
                            sx={{ width: '100%', bgcolor: 'white', borderRadius: 2 }}
                        />
                    </Box>

                    {/* Weight */}
                    <Box sx={{ minWidth: 120, flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={600}>
                            <Scale sx={{ fontSize: 18, mr: 0.5, color: 'success.main' }} /> Weight (kg)
                        </Typography>
                        <TextField
                            type="number"
                            value={exercise.weight || 0}
                            onChange={(e) => handleFieldUpdate('weight', parseFloat(e.target.value) || 0)}
                            size="small"
                            inputProps={{ min: 0, max: 500, style: { textAlign: 'center', fontWeight: 600 } }}
                            sx={{ width: '100%', bgcolor: 'white', borderRadius: 2 }}
                        />
                    </Box>

                    {/* Rest Time */}
                    <Box sx={{ minWidth: 120, flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={600}>
                            <Timer sx={{ fontSize: 18, mr: 0.5, color: 'info.main' }} /> Rest (sec)
                        </Typography>
                        <TextField
                            type="number"
                            value={exercise.restTime || 60}
                            onChange={(e) => handleFieldUpdate('restTime', parseInt(e.target.value) || 0)}
                            size="small"
                            inputProps={{ min: 0, max: 600, style: { textAlign: 'center', fontWeight: 600 } }}
                            sx={{ width: '100%', bgcolor: 'white', borderRadius: 2 }}
                        />
                    </Box>
                </Stack>

                {/* Notes */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={600}>
                        Notes (optional)
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Add any notes for this exercise..."
                        value={exercise.notes || ''}
                        onChange={(e) => handleFieldUpdate('notes', e.target.value)}
                        size="small"
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default WorkoutExerciseCard;
