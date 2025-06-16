/**
 * Profile Component với React 19 patterns
 * Sử dụng Suspense và use() hook cho optimal performance
 */

import React, { Suspense } from 'react';
import { Box, Card, CardContent, Typography, Chip, LinearProgress } from '@mui/material';
import useAccountProfile, { calculateIdealWeightRange, formatBMICategory } from '../../hooks/useAccountProfile';


/**
 * Component hiển thị account profile với Suspense boundary
 */
function AccountProfileCard() {
    // React 19: Sử dụng use() hook thông qua custom hook
    const profile = useAccountProfile();

    const idealWeight = calculateIdealWeightRange(profile.healthMetrics.height);
    const bmiCategory = formatBMICategory(profile.healthMetrics.bmi);

    return (
        <Card elevation={2}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Account Overview
                </Typography>

                {/* Account Info */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        Member since: {new Date(profile.joinDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Last login: {new Date(profile.lastLogin).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <Chip
                            label={profile.subscriptionPlan.toUpperCase()}
                            color={profile.subscriptionPlan === 'premium' ? 'primary' : 'default'}
                            size="small"
                        />
                        {profile.isEmailVerified && (
                            <Chip
                                label="Verified"
                                color="success"
                                size="small"
                                sx={{ ml: 1 }}
                            />
                        )}
                    </Box>
                </Box>

                {/* Health Metrics */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Health Metrics
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box>
                            <Typography variant="h4" color="primary">
                                {profile.healthMetrics.bmi.toFixed(1)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                BMI ({bmiCategory})
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h6">
                                {profile.healthMetrics.weight}kg
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Current Weight
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h6">
                                {profile.healthMetrics.height}cm
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Height
                            </Typography>
                        </Box>
                    </Box>

                    {/* Ideal Weight Range */}
                    <Typography variant="body2" color="text.secondary">
                        Ideal weight: {idealWeight.min}kg - {idealWeight.max}kg
                    </Typography>
                </Box>

                {/* Fitness Profile */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Fitness Profile
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            Experience: <strong>{profile.fitnessProfile.experienceLevel}</strong>
                        </Typography>
                    </Box>

                    {/* Fitness Goals */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            Goals:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {profile.fitnessProfile.fitnessGoals.map((goal) => (
                                <Chip
                                    key={goal}
                                    label={goal.replace('_', ' ')}
                                    variant="outlined"
                                    size="small"
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* BMI Warnings */}
                    {profile.fitnessProfile.bmiWarnings &&
                        profile.fitnessProfile.bmiWarnings.length > 0 && (
                            <Box>
                                <Typography variant="body2" color="warning.main" gutterBottom>
                                    Health Recommendations:
                                </Typography>
                                {profile.fitnessProfile.bmiWarnings.map((warning, index) => (
                                    <Typography
                                        key={index}
                                        variant="body2"
                                        color="warning.main"
                                        sx={{ fontSize: '0.8rem' }}
                                    >
                                        • {warning}
                                    </Typography>
                                ))}
                            </Box>
                        )}
                </Box>
            </CardContent>
        </Card>
    );
}

/**
 * Loading skeleton cho account profile
 */
function AccountProfileSkeleton() {
    return (
        <Card elevation={2}>
            <CardContent>
                <Box sx={{ mb: 2 }}>
                    <LinearProgress />
                </Box>
                <Typography variant="h6" gutterBottom>
                    Loading Account Profile...
                </Typography>
                <Box sx={{ mt: 2 }}>
                    {[1, 2, 3, 4].map((item) => (
                        <Box key={item} sx={{ mb: 1 }}>
                            <LinearProgress variant="determinate" value={25 * item} />
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}

/**
 * Error boundary component cho account profile
 */
function AccountProfileError({ error }: { error: Error }) {
    return (
        <Card elevation={2}>
            <CardContent>
                <Typography variant="h6" color="error" gutterBottom>
                    Error Loading Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {error.message}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        Please try refreshing the page or contact support if the problem persists.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

/**
 * Main component với Suspense wrapper
 */
export default function AccountProfileWithSuspense() {
    return (
        <Box sx={{ p: 2 }}>
            <Suspense fallback={<AccountProfileSkeleton />}>
                <AccountProfileCard />
            </Suspense>
        </Box>
    );
}

export { AccountProfileCard, AccountProfileSkeleton, AccountProfileError };
