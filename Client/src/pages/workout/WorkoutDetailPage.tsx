/**
 * 🏋️ Workout Detail Page - React 19 Implementation
 * Complete workout detail view với API integration và optimized UI/UX
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Stack,
    Alert,
    Button,
    useTheme,
    useMediaQuery
} from '@mui/material';

// Hooks
import { useWorkout } from '../../hooks/useWorkoutData';

// Components
import {
    WorkoutDetailSkeleton,
    WorkoutHeader,
    WorkoutInfoCard,
    ExercisesList,
    QuickStatsCard,
    AuthorInfoCard,
    ReviewsSection
} from '../../components/workout/detail';

/**
 * 🎯 Main WorkoutDetailPage Component
 */
const WorkoutDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // ✅ React Query hook để fetch workout data
    const {
        data: workout,
        isLoading,
        error,
        isError
    } = useWorkout(id || '');

    console.log("Check workout >>> ", workout)

    // Loading state
    if (isLoading) {
        return <WorkoutDetailSkeleton />;
    }

    // Error state
    if (isError || !workout) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert
                    severity="error"
                    sx={{ mb: 4 }}
                    action={
                        <Button color="inherit" size="small" onClick={() => navigate('/workouts')}>
                            Back to Workouts
                        </Button>
                    }
                >
                    {error?.message || 'Workout not found'}
                </Alert>
            </Container>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1976d2 0%, #ff9800 100%)',
            pb: 4
        }}>
            {/* Header Section */}
            <WorkoutHeader workout={workout} onBack={() => navigate(-1)} />

            <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                    {/* Main Content */}
                    <Box sx={{ flex: { xs: '1', lg: '2' } }}>
                        <Stack spacing={4}>
                            {/* Quick Stats Cards - Mobile First */}
                            {isMobile && <QuickStatsCard workout={workout} />}

                            {/* Workout Info Card */}
                            <WorkoutInfoCard workout={workout} />

                            {/* Author Info Card */}
                            <AuthorInfoCard workout={workout} />

                            {/* Exercises List */}
                            <ExercisesList exercises={workout.exercises} />

                            {/* Reviews Section */}
                            <ReviewsSection workoutId={workout._id} />
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default WorkoutDetailPage;
