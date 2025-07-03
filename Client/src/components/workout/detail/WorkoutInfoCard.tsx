/**
 * 🎯 Workout Info Card Component - Detailed Information
 */

import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    Stack,
    useTheme,
    alpha
} from '@mui/material';
import {
    Groups,
    FitnessCenter
} from '@mui/icons-material';

// Types
import { Workout } from '../../../types/workout.interface';

interface WorkoutInfoCardProps {
    workout: Workout;
}

const WorkoutInfoCard: React.FC<WorkoutInfoCardProps> = ({ workout }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.grey[50], 0.95)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: '2px solid',
                borderColor: 'transparent',
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
                <Groups sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                >
                    Workout Details
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Muscle Groups & Equipment */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3
                }}>
                    {/* Muscle Groups */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                            <Groups sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Target Muscles
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {workout.muscleGroups?.map((muscle, index) => (
                                <Chip
                                    key={index}
                                    label={muscle}
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontWeight: 500 }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Equipment */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                            <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Equipment Needed
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {workout.equipment?.map((item, index) => (
                                <Chip
                                    key={index}
                                    label={item}
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontWeight: 500 }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Box>

                {/* Tags */}
                {workout.tags.length > 0 && (
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Tags
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {workout.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    size="small"
                                    sx={{ bgcolor: 'primary.light', color: 'white', fontWeight: 500 }}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default WorkoutInfoCard;
