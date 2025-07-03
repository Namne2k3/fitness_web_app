/**
 * 🎯 Workout Detail Skeleton - Loading State Component
 */

import React from 'react';
import {
    Box,
    Container,
    Stack,
    Skeleton
} from '@mui/material';

/**
 * Loading Skeleton Component for Workout Detail Page
 */
const WorkoutDetailSkeleton: React.FC = () => (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Skeleton variant="rectangular" height={300} sx={{ mb: 4, borderRadius: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                <Box sx={{ flex: { xs: '1', lg: '2' } }}>
                    <Stack spacing={4}>
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
                    </Stack>
                </Box>
                <Box sx={{ flex: { xs: '1', lg: '1' }, minWidth: { lg: '300px' } }}>
                    <Stack spacing={3}>
                        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                    </Stack>
                </Box>
            </Box>
        </Container>
    </Box>
);

export default WorkoutDetailSkeleton;
