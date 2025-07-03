/**
 * 🎯 Reviews Section Component - Display workout reviews and ratings
 */

import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Avatar,
    Rating,
    Stack,
    Divider,
    useTheme,
    alpha
} from '@mui/material';
import {
    ThumbUp
} from '@mui/icons-material';

interface ReviewsSectionProps {
    workoutId: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = () => {
    const theme = useTheme();

    // Mock reviews data - replace with actual API call
    const mockReviews = [
        {
            id: '1',
            userName: 'Sarah Johnson',
            userAvatar: '',
            rating: 5,
            comment: 'Amazing workout! Really helped me build strength and endurance.',
            date: new Date('2024-01-15'),
            helpful: 12
        },
        {
            id: '2',
            userName: 'Mike Chen',
            userAvatar: '',
            rating: 4,
            comment: 'Great exercises but a bit challenging for beginners.',
            date: new Date('2024-01-10'),
            helpful: 8
        }
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.grey[50], 0.98)} 100%)`,
                border: '2px solid',
                borderColor: alpha(theme.palette.secondary.main, 0.1),
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 32px ${alpha(theme.palette.secondary.main, 0.15)}`,
                    borderColor: alpha(theme.palette.secondary.main, 0.3),
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.warning.main} 100%)`,
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Rating value={5} readOnly size="small" sx={{ color: 'warning.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Reviews ({mockReviews.length})
                </Typography>
            </Box>

            <Stack spacing={3}>
                {mockReviews.map((review) => (
                    <Box key={review.id}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                            <Avatar sx={{ width: 40, height: 40 }}>
                                {review.userName[0]}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {review.userName}
                                    </Typography>
                                    <Rating value={review.rating} readOnly size="small" />
                                    <Typography variant="caption" color="text.secondary">
                                        {review.date.toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {review.comment}
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<ThumbUp />}
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Helpful ({review.helpful})
                                </Button>
                            </Box>
                        </Box>
                        <Divider />
                    </Box>
                ))}
            </Stack>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button variant="outlined" sx={{ borderRadius: 2 }}>
                    Write a Review
                </Button>
            </Box>
        </Paper>
    );
};

export default ReviewsSection;
