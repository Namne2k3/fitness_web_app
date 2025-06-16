/**
 * BMI Display Component - Hiển thị BMI với visualization
 */
import React from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';

interface BMIDisplayProps {
    bmi: number;
    category: string;
    color: 'success' | 'warning' | 'error';
}

export default function BMIDisplay({ bmi, category, color }: BMIDisplayProps) {
    // Calculate progress bar value based on BMI (0-40 scale)
    const progressValue = Math.min((bmi / 40) * 100, 100);

    return (
        <Paper sx={{ p: 2, mb: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" gutterBottom>
                Chỉ số BMI
            </Typography>

            <Typography variant="h3" color="primary" gutterBottom>
                {bmi.toFixed(1)}
            </Typography>

            <Box sx={{ mb: 2 }}>
                <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    color={color}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 4
                        }
                    }}
                />
            </Box>

            <Typography
                variant="body2"
                color={color === 'success' ? 'success.main' : color === 'warning' ? 'warning.main' : 'error.main'}
                fontWeight="medium"
            >
                {category}
            </Typography>

            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'text.secondary' }}>
                <span>Thiếu cân (&lt;18.5)</span>
                <span>Bình thường (18.5-24.9)</span>
                <span>Thừa cân (&gt;25)</span>
            </Box>
        </Paper>
    );
}
