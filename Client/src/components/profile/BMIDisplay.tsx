/**
 * BMI Display Component - Hiển thị BMI với visualization
 * Thiết kế hiện đại với gradient backgrounds và color-coded system
 */

import { Box, Typography, LinearProgress, Paper, Avatar } from '@mui/material';
import { MonitorHeart as HealthIcon } from '@mui/icons-material';

interface BMIDisplayProps {
    bmi: number;
    category: string;
    color: 'success' | 'warning' | 'error';
}

export default function BMIDisplay({ bmi, category, color }: BMIDisplayProps) {
    // Calculate progress bar value based on BMI (0-40 scale)
    const progressValue = Math.min((bmi / 40) * 100, 100);

    // Define gradient backgrounds based on BMI category
    const getGradientBackground = () => {
        switch (color) {
            case 'success':
                return 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)';
            case 'warning':
                return 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)';
            case 'error':
                return 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)';
            default:
                return 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)';
        }
    };

    const getBorderColor = () => {
        switch (color) {
            case 'success':
                return 'rgba(76, 175, 80, 0.2)';
            case 'warning':
                return 'rgba(255, 152, 0, 0.2)';
            case 'error':
                return 'rgba(244, 67, 54, 0.2)';
            default:
                return 'rgba(0, 0, 0, 0.1)';
        }
    };

    const getIconColor = () => {
        switch (color) {
            case 'success':
                return '#4caf50';
            case 'warning':
                return '#ff9800';
            case 'error':
                return '#f44336';
            default:
                return '#666';
        }
    };

    const getCategoryColor = () => {
        switch (color) {
            case 'success':
                return '#388e3c';
            case 'warning':
                return '#f57c00';
            case 'error':
                return '#d32f2f';
            default:
                return '#666';
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mb: 2,
                textAlign: 'center',
                background: getGradientBackground(),
                borderRadius: 3,
                border: `1px solid ${getBorderColor()}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }
            }}
        >
            {/* Header with Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: getIconColor(), width: 40, height: 40, mr: 1.5 }}>
                    <HealthIcon sx={{ fontSize: 20, color: 'white' }} />
                </Avatar>
                <Typography variant="h6" fontWeight="600" color={getCategoryColor()}>
                    Chỉ số BMI
                </Typography>
            </Box>

            {/* BMI Value */}
            <Typography
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    color: getIconColor(),
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    mb: 2
                }}
            >
                {bmi.toFixed(1)}
            </Typography>

            {/* Progress Bar */}
            <Box sx={{ mb: 3, px: 2 }}>
                <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    sx={{
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: 'rgba(0,0,0,0.06)',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 6,
                            background: color === 'success'
                                ? 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)'
                                : color === 'warning'
                                    ? 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)'
                                    : 'linear-gradient(90deg, #f44336 0%, #ef5350 100%)'
                        }
                    }}
                />
            </Box>

            {/* Category Badge */}
            <Box
                sx={{
                    display: 'inline-block',
                    px: 3,
                    py: 1,
                    borderRadius: 20,
                    background: color === 'success'
                        ? 'rgba(76, 175, 80, 0.1)'
                        : color === 'warning'
                            ? 'rgba(255, 152, 0, 0.1)'
                            : 'rgba(244, 67, 54, 0.1)',
                    border: `1px solid ${getBorderColor()}`,
                    mb: 2
                }}
            >
                <Typography
                    variant="body1"
                    fontWeight="600"
                    sx={{ color: getCategoryColor() }}
                >
                    {category}
                </Typography>
            </Box>

            {/* BMI Scale Reference */}
            <Box sx={{
                mt: 2,
                pt: 2,
                borderTop: `1px solid ${getBorderColor()}`,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1,
                fontSize: '0.75rem'
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="error.main" fontWeight="500">
                        Thiếu cân
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                        &lt; 18.5
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="success.main" fontWeight="500">
                        Bình thường
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                        18.5 - 24.9
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="warning.main" fontWeight="500">
                        Thừa cân
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                        ≥ 25
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}
