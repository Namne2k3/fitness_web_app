/**
 * 🎯 Workout Description Card - TrackMe UI
 * Hiển thị mô tả workout với style nổi bật, icon, và background gradient
 */
import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface WorkoutDescriptionCardProps {
    description: string;
    caloriesBurned?: number;
    estimatedDuration?: number;
}

const WorkoutDescriptionCard: React.FC<WorkoutDescriptionCardProps> = ({ description, caloriesBurned, estimatedDuration }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
                border: '1px solid rgba(33, 150, 243, 0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 3,
            }}
        >
            <Box sx={{ mt: 0.5 }}>
                <InfoOutlinedIcon color="primary" sx={{ fontSize: 36 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: '#1976d2' }}>
                    Mô tả
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: '#757575', // Gray
                        mb: 1.5,
                        fontSize: '1.08rem',
                        lineHeight: 1.7,
                        fontStyle: 'italic',
                        fontWeight: 400
                    }}
                >
                    {description || 'No description provided.'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {typeof caloriesBurned === 'number' && (
                        <Chip label={`🔥 ${caloriesBurned} kcal`} color="success" size="small" sx={{ fontWeight: 600 }} />
                    )}
                    {typeof estimatedDuration === 'number' && (
                        <Chip label={`⏱️ ${estimatedDuration} min`} color="info" size="small" sx={{ fontWeight: 600 }} />
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default WorkoutDescriptionCard;
