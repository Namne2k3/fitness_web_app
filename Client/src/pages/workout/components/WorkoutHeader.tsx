/**
 * 🎯 WorkoutHeader Component - Embedded Filters Design với Category Tabs
 * Header có tabs navigation và embedded filters
 */

import {
    Add,
    Analytics,
    BookmarkBorder,
    FitnessCenter,
    LocalFireDepartment,
    Star,
    TrendingUp,
    ViewModule
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Tab,
    Tabs,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { useState } from 'react';
import WorkoutFilters from './WorkoutFilters';

// ================================
// 🎯 Types & Interfaces
// ================================
interface FilterState {
    search: string;
    category: string;
    difficulty: string;
    maxDuration: string;
    equipment: string;
}

interface WorkoutHeaderProps {
    totalWorkouts: number;
    totalBeginner: number;
    totalSponsored: number;
    onCreateWorkout?: () => void;
    onViewAnalytics?: () => void;
    // ✅ Embedded filters
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    totalResults: number;
    // ✅ Additional features
    onSortChange?: (sortBy: string) => void;
    onViewModeChange?: (mode: 'grid' | 'list') => void;
    // ✅ NEW: Tab functionality
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    currentUser?: {
        avatar?: string;
        username: string;
    };
}

// ================================
// 🎯 Tab Categories Configuration
// ================================
const workoutTabs = [
    {
        value: 'all',
        label: 'Tất cả',
        icon: <FitnessCenter sx={{ fontSize: 18 }} />,
        color: 'primary'
    },
    {
        value: 'trending',
        label: 'Lượt thích',
        icon: <TrendingUp sx={{ fontSize: 18 }} />,
        color: 'warning'
    },
    {
        value: 'sponsored',
        label: 'Premium',
        icon: <Star sx={{ fontSize: 18 }} />,
        color: 'error'
    },
    {
        value: 'my-workouts',
        label: 'Của tôi',
        icon: <BookmarkBorder sx={{ fontSize: 18 }} />,
        color: 'info'
    },
    {
        value: 'popular',
        label: 'Phổ biến',
        icon: <LocalFireDepartment sx={{ fontSize: 18 }} />,
        color: 'success'
    }
];

// ================================
// 🎯 Enhanced WorkoutHeader with Category Tabs
// ================================
const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
    totalWorkouts,
    totalBeginner,
    totalSponsored,
    onCreateWorkout,
    onViewAnalytics,
    filters,
    onFiltersChange,
    totalResults,
    onSortChange,
    onViewModeChange,
    activeTab = 'all',
    onTabChange,
    currentUser
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Handle view mode change
    const handleViewModeToggle = () => {
        const newMode = viewMode === 'grid' ? 'list' : 'grid';
        setViewMode(newMode);
        onViewModeChange?.(newMode);
    };

    // Handle tab change
    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        onTabChange?.(newValue);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 2,
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                overflow: 'hidden',
            }}
        >
            {/* ✅ TOP ROW: Logo + Title + Actions */}
            <Box sx={{
                p: { xs: 2, md: 2.5 },
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                borderBottom: '1px solid rgba(0,0,0,0.06)'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2
                }}>
                    {/* Left: Logo + Title */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                        <Avatar sx={{
                            width: 40,
                            height: 40,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}>
                            <FitnessCenter sx={{ color: 'white', fontSize: 20 }} />
                        </Avatar>
                        <Box>
                            <Typography
                                variant="h5"
                                component="h1"
                                fontWeight={700}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    lineHeight: 1.2,
                                }}
                            >
                                Workout Hub
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {totalWorkouts.toLocaleString()} workouts • {totalResults.toLocaleString()} results
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right: Stats + Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                        {/* Quick Stats Chips */}
                        {/* {!isMobile && (
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Chip
                                    label={`${totalBeginner} Beginner`}
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                                />
                                {totalSponsored > 0 && (
                                    <Chip
                                        label={`${totalSponsored} Premium`}
                                        color="warning"
                                        variant="outlined"
                                        size="small"
                                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                                    />
                                )}
                            </Box>
                        )} */}

                        {/* Control Buttons */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* View Mode Toggle */}
                            {/* {onViewModeChange && !isMobile && (
                                <Tooltip title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}>
                                    <IconButton
                                        size="small"
                                        onClick={handleViewModeToggle}
                                        sx={{
                                            color: 'text.secondary',
                                            '&:hover': { color: 'primary.main' }
                                        }}
                                    >
                                        <ViewModule fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )} */}

                            {/* Analytics Button */}
                            {onViewAnalytics && !isMobile && (
                                <Tooltip title="Analytics">
                                    <IconButton
                                        onClick={onViewAnalytics}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                                            color: '#667eea',
                                            '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' }
                                        }}
                                    >
                                        <Analytics fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}

                            {/* Create Workout Button */}
                            {onCreateWorkout && (
                                <Button
                                    variant="contained"
                                    startIcon={<Add sx={{ fontSize: 18 }} />}
                                    onClick={onCreateWorkout}
                                    size={isMobile ? "small" : "medium"}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        px: { xs: 2, md: 3 },
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                        },
                                    }}
                                >
                                    {isMobile ? 'New' : 'Create Workout'}
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* ✅ MIDDLE ROW: Category Tabs Navigation */}
            <Box sx={{
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                background: 'rgba(255,255,255,0.5)'
            }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant={isMobile ? "scrollable" : "standard"}
                    scrollButtons={isMobile ? "auto" : false}
                    allowScrollButtonsMobile
                    sx={{
                        px: { xs: 1, md: 2.5 },
                        minHeight: 48,
                        '& .MuiTabs-indicator': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            height: 3,
                            borderRadius: '3px 3px 0 0'
                        },
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            minHeight: 48,
                            px: { xs: 1.5, md: 2 },
                            color: 'text.secondary',
                            '&.Mui-selected': {
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            },
                            '&:hover': {
                                color: 'primary.main',
                                backgroundColor: 'rgba(102, 126, 234, 0.08)'
                            }
                        }
                    }}
                >
                    {workoutTabs.map((tab) => (
                        <Tab
                            key={tab.value}
                            value={tab.value}
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                    {/* Show count for specific tabs */}
                                    {tab.value === 'all' && !isMobile && (
                                        <Chip
                                            label={totalWorkouts}
                                            size="small"
                                            sx={{
                                                height: 18,
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                ml: 0.5
                                            }}
                                        />
                                    )}
                                    {tab.value === 'sponsored' && totalSponsored > 0 && !isMobile && (
                                        <Chip
                                            label={totalSponsored}
                                            size="small"
                                            color="warning"
                                            sx={{
                                                height: 18,
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                ml: 0.5
                                            }}
                                        />
                                    )}
                                </Box>
                            }
                            sx={{
                                '&.Mui-selected .MuiChip-root': {
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white'
                                }
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* ✅ BOTTOM ROW: Embedded Filters */}
            <Box sx={{
                '& > div': {
                    mb: 0,
                    borderRadius: 0,
                    border: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                }
            }}>
                <WorkoutFilters
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    totalResults={totalResults}
                />
            </Box>
        </Paper>
    );
};

export default WorkoutHeader;
