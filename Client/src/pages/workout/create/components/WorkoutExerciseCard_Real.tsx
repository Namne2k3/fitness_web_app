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
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(0,0,0,0.08)',
                '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderColor: 'primary.main'
                },
                transition: 'all 0.3s ease'
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                        {...dragHandleProps}
                        sx={{
                            cursor: 'grab',
                            color: 'text.secondary',
                            mr: 2,
                            '&:active': { cursor: 'grabbing' }
                        }}
                    >
                        <DragIndicator />
                    </Box>

                    <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontWeight: 600,
                            mr: 2
                        }}
                    />

                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                            {exercise.name || 'Unknown Exercise'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Exercise {index + 1}
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={onRemove}
                        size="small"
                        sx={{
                            color: 'error.main',
                            '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.1)
                            }
                        }}
                    >
                        <Delete />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Exercise Parameters */}
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    {/* Sets */}
                    <Box sx={{ minWidth: 100 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Sets
                        </Typography>
                        <TextField
                            type="number"
                            value={exercise.sets || 3}
                            onChange={(e) => handleFieldUpdate('sets', parseInt(e.target.value) || 0)}
                            size="small"
                            InputProps={{
                                startAdornment: <FitnessCenter sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            sx={{ width: '100%' }}
                        />
                    </Box>

                    {/* Reps */}
                    <Box sx={{ minWidth: 100 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Reps
                        </Typography>
                        <TextField
                            type="number"
                            value={exercise.reps || 12}
                            onChange={(e) => handleFieldUpdate('reps', parseInt(e.target.value) || 0)}
                            size="small"
                            InputProps={{
                                startAdornment: <Repeat sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            sx={{ width: '100%' }}
                        />
                    </Box>

                    {/* Weight */}
                    <Box sx={{ minWidth: 100 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Weight (kg)
                        </Typography>
                        <TextField
                            type="number"
                            value={exercise.weight || 0}
                            onChange={(e) => handleFieldUpdate('weight', parseFloat(e.target.value) || 0)}
                            size="small"
                            InputProps={{
                                startAdornment: <Scale sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            sx={{ width: '100%' }}
                        />
                    </Box>

                    {/* Rest Time */}
                    <Box sx={{ minWidth: 100 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Rest (sec)
                        </Typography>
                        <TextField
                            type="number"
                            value={exercise.restTime || 60}
                            onChange={(e) => handleFieldUpdate('restTime', parseInt(e.target.value) || 0)}
                            size="small"
                            InputProps={{
                                startAdornment: <Timer sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            sx={{ width: '100%' }}
                        />
                    </Box>
                </Stack>

                {/* Notes */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
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
