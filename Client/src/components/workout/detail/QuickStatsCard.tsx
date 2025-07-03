/**
 * 🎯 Quick Stats Card Component - Display workout statistics
 */

import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Rating,
    Stack,
    Divider,
    useTheme,
    alpha
} from '@mui/material';
import {
    Visibility
} from '@mui/icons-material';

// Types
import { Workout } from '../../../types/workout.interface';

interface QuickStatsCardProps {
    workout: Workout;
}

const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ workout }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                border: '2px solid',
                borderColor: 'transparent',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                    borderColor: theme.palette.primary.main,
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Visibility sx={{ color: 'primary.main', fontSize: 24 }} />
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.125rem', sm: '1.25rem' }
                    }}
                >
                    Quick Stats
                </Typography>
            </Box>

            <Stack spacing={3}>
                {/* Rating */}
                <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Average Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={workout.averageRating || 0} readOnly precision={0.1} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {(workout.averageRating || 0).toFixed(1)} ({workout.totalRatings || 0})
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Stats Grid */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2
                }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {workout.views || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Views
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                            {workout.completions || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Completions
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                            {workout.likeCount || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Likes
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                            {workout.saveCount || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Saves
                        </Typography>
                    </Box>
                </Box>
            </Stack>
        </Paper>
    );
};

export default QuickStatsCard;
