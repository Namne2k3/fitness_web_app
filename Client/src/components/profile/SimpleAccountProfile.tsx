/**
 * Simple Account Profile Component 
 * Không dùng custom hook phức tạp, chỉ sử dụng useState và useEffect đơn giản
 */

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import { AccountService, AccountProfile } from '../../services/accountService';

/**
 * Component hiển thị account profile đơn giản
 */
export default function SimpleAccountProfile() {
    const [profile, setProfile] = useState<AccountProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await AccountService.getAccountProfile();

                if (response.success && response.data) {
                    setProfile(response.data);
                } else {
                    setError(response.error || 'Failed to fetch profile');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                console.error('❌ Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []); // Empty dependency array - chỉ gọi 1 lần khi component mount

    // Loading state
    if (loading) {
        return (
            <Card elevation={2}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                        <CircularProgress size={24} />
                        <Typography variant="body1">
                            Loading account profile...
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    // Error state
    if (error) {
        return (
            <Card elevation={2}>
                <CardContent>
                    <Alert severity="error">
                        <Typography variant="body2">
                            {error}
                        </Typography>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    // No profile data
    if (!profile) {
        return (
            <Card elevation={2}>
                <CardContent>
                    <Alert severity="warning">
                        <Typography variant="body2">
                            No profile data available
                        </Typography>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    // Render profile data
    return (
        <Card elevation={2}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Account Overview
                </Typography>

                {/* Account Basic Info */}
                <Box mb={3}>
                    <Typography variant="body2" color="text.secondary">
                        Member since: {new Date(profile.joinDate).toLocaleDateString('vi-VN')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Last login: {new Date(profile.lastLogin).toLocaleDateString('vi-VN')}
                    </Typography>

                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                        <Chip
                            label={profile.subscriptionPlan.toUpperCase()}
                            color={profile.subscriptionPlan === 'premium' ? 'primary' : 'default'}
                            size="small"
                        />
                        <Chip
                            label={profile.isEmailVerified ? 'Verified' : 'Not Verified'}
                            color={profile.isEmailVerified ? 'success' : 'warning'}
                            size="small"
                        />
                    </Box>
                </Box>                {/* Health Metrics */}
                <Box mb={3}>
                    <Typography variant="subtitle2" gutterBottom>
                        Health Metrics
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ minWidth: 80 }}>
                            <Typography variant="body2" color="text.secondary">
                                BMI
                            </Typography>
                            <Typography variant="h6">
                                {profile.healthMetrics.bmi}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {profile.healthMetrics.bmiCategory}
                            </Typography>
                        </Box>

                        <Box sx={{ minWidth: 80 }}>
                            <Typography variant="body2" color="text.secondary">
                                Weight
                            </Typography>
                            <Typography variant="h6">
                                {profile.healthMetrics.weight} kg
                            </Typography>
                        </Box>

                        <Box sx={{ minWidth: 80 }}>
                            <Typography variant="body2" color="text.secondary">
                                Height
                            </Typography>
                            <Typography variant="h6">
                                {profile.healthMetrics.height} cm
                            </Typography>
                        </Box>

                        <Box sx={{ minWidth: 80 }}>
                            <Typography variant="body2" color="text.secondary">
                                Age
                            </Typography>
                            <Typography variant="h6">
                                {profile.healthMetrics.age} years
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Fitness Profile */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Fitness Profile
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Experience Level:
                        <Chip
                            label={profile.fitnessProfile.experienceLevel}
                            size="small"
                            sx={{ ml: 1 }}
                        />
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Fitness Goals:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {profile.fitnessProfile.fitnessGoals.map((goal, index) => (
                            <Chip
                                key={index}
                                label={goal.replace('_', ' ')}
                                size="small"
                                variant="outlined"
                            />
                        ))}
                    </Box>

                    {/* BMI Warnings */}
                    {profile.fitnessProfile.bmiWarnings && profile.fitnessProfile.bmiWarnings.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Alert severity="warning">
                                <Typography variant="body2" gutterBottom>
                                    Health Recommendations:
                                </Typography>
                                {profile.fitnessProfile.bmiWarnings.map((warning, index) => (
                                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                        • {warning}
                                    </Typography>
                                ))}
                            </Alert>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
