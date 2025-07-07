/**
 * 🎯 Author Info Card Component - Display workout author information
 */

import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Avatar,
    Chip,
    useTheme,
    alpha
} from '@mui/material';
import {
    PersonAdd
} from '@mui/icons-material';

// Types
import { Workout } from '../../../types/workout.interface';

interface AuthorInfoCardProps {
    workout: Workout;
}

const AuthorInfoCard: React.FC<AuthorInfoCardProps> = ({ workout }) => {
    const theme = useTheme();
    const authorInfo = workout.authorInfo;

    console.log("Check authorInfo >>> ", workout)

    if (!authorInfo) {
        return null;
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.grey[50], 0.98)} 100%)`,
                border: '2px solid',
                borderColor: alpha(theme.palette.success.main, 0.1),
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 32px ${alpha(theme.palette.success.main, 0.15)}`,
                    borderColor: alpha(theme.palette.success.main, 0.3),
                },
            }}
        >
            {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Person sx={{ color: 'success.main', fontSize: 28 }} />
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                >
                    Created by
                </Typography>
            </Box> */}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                    src={authorInfo.avatar || ''}
                    alt={authorInfo.fullName || authorInfo.username}
                    sx={{
                        width: { xs: 56, sm: 64 },
                        height: { xs: 56, sm: 64 },
                        border: '3px solid',
                        borderColor: alpha(theme.palette.success.main, 0.2)
                    }}
                >
                    {(authorInfo.fullName || authorInfo.username)?.[0]?.toUpperCase()}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {authorInfo.fullName || authorInfo.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        @{authorInfo.username}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            label={authorInfo.experienceLevel || 'Beginner'}
                            size="small"
                            sx={{
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                color: 'success.main',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                border: '1px solid',
                                borderColor: alpha(theme.palette.success.main, 0.2)
                            }}
                        />
                        {authorInfo.isEmailVerified && (
                            <Chip
                                label="Verified"
                                size="small"
                                sx={{
                                    bgcolor: alpha(theme.palette.info.main, 0.1),
                                    color: 'info.main',
                                    fontWeight: 600,
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.info.main, 0.2)
                                }}
                            />
                        )}
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PersonAdd />}
                    sx={{
                        borderRadius: 2,
                        borderColor: alpha(theme.palette.success.main, 0.3),
                        color: 'success.main',
                        '&:hover': {
                            borderColor: 'success.main',
                            bgcolor: alpha(theme.palette.success.main, 0.1)
                        }
                    }}
                >
                    Follow
                </Button>
            </Box>
        </Paper>
    );
};

export default AuthorInfoCard;
