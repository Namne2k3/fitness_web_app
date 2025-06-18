/**
 * 💀 WorkoutsSkeleton Component - Loading Placeholders
 * Adaptive skeleton based on view mode
 */

import {
    Box,
    Card,
    CardContent,
    Skeleton
} from '@mui/material';
import React from 'react';

// ================================
// 🎯 Types & Interfaces
// ================================
interface WorkoutsSkeletonProps {
    count?: number;
    viewMode?: 'grid' | 'list' | 'compact' | 'masonry';
}

// ================================
// 💀 Individual Skeleton Card
// ================================
const SkeletonCard: React.FC<{ viewMode: string }> = ({ viewMode }) => {
    const isCompact = viewMode === 'list' || viewMode === 'compact';

    return (
        <Card
            sx={{
                height: isCompact ? 'auto' : 300,
                display: 'flex',
                flexDirection: isCompact ? 'row' : 'column',
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.06)',
            }}
        >
            {/* Image/Icon area */}
            <Skeleton
                variant="rectangular"
                width={isCompact ? 80 : '100%'}
                height={isCompact ? 80 : 120}
                sx={{
                    borderRadius: isCompact ? '8px 0 0 8px' : '8px 8px 0 0',
                    flexShrink: 0,
                }}
            />

            <CardContent sx={{ flexGrow: 1, p: isCompact ? 1.5 : 2 }}>
                {/* Title */}
                <Skeleton
                    variant="text"
                    width="70%"
                    height={isCompact ? 20 : 28}
                    sx={{ mb: 1 }}
                />

                {/* Subtitle/Tags */}
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Skeleton variant="rounded" width={60} height={20} />
                    <Skeleton variant="rounded" width={40} height={20} />
                </Box>

                {/* Description - Only for non-compact */}
                {!isCompact && (
                    <>
                        <Skeleton variant="text" width="100%" height={16} />
                        <Skeleton variant="text" width="80%" height={16} sx={{ mb: 2 }} />
                    </>
                )}

                {/* Actions row */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: isCompact ? 1 : 'auto'
                }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="circular" width={24} height={24} />
                    </Box>
                    <Skeleton variant="rounded" width={80} height={28} />
                </Box>
            </CardContent>
        </Card>
    );
};

// ================================
// 💀 Main WorkoutsSkeleton Component
// ================================
const WorkoutsSkeleton: React.FC<WorkoutsSkeletonProps> = ({
    count = 8,
    viewMode = 'grid'
}) => {
    // Grid configuration based on view mode
    const getGridColumns = () => {
        switch (viewMode) {
            case 'list':
                return { xs: '1fr' };
            case 'compact':
                return {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)'
                };
            case 'masonry':
                return {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)'
                };
            default: // grid
                return {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                    xl: 'repeat(5, 1fr)'
                };
        }
    };

    const getGap = () => {
        switch (viewMode) {
            case 'list':
            case 'compact':
                return 2;
            default:
                return 3;
        }
    };

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: getGridColumns(),
                gap: getGap(),
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                    '0%, 100%': {
                        opacity: 1,
                    },
                    '50%': {
                        opacity: 0.7,
                    },
                },
            }}
        >
            {Array.from({ length: count }, (_, index) => (
                <Box
                    key={index}
                    sx={{
                        // Staggered loading animation
                        animation: 'fadeIn 0.6s ease forwards',
                        animationDelay: `${index * 0.1}s`,
                        opacity: 0,
                        '@keyframes fadeIn': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(20px)',
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)',
                            },
                        },
                    }}
                >
                    <SkeletonCard viewMode={viewMode} />
                </Box>
            ))}
        </Box>
    );
};

export default WorkoutsSkeleton;
