/**
 * 🔍 WorkoutFilters Component - Auto-Collapse Optimized Design
 * Compact filter interface với smart collapsing để tiết kiệm không gian tối đa
 */

import {
    Clear,
    ExpandLess,
    ExpandMore,
    FilterList,
    Search,
    TuneOutlined
} from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Collapse,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { useState, useTransition, useEffect } from 'react';

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

interface WorkoutFiltersProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    totalResults: number;
}

// ================================
// 🎨 Filter Categories Data
// ================================
const filterOptions = {
    categories: [
        { value: '', label: 'Tất cả', icon: '🏃' },
        { value: 'strength', label: 'Strength', icon: '💪' },
        { value: 'cardio', label: 'Cardio', icon: '❤️' },
        { value: 'flexibility', label: 'Flexibility', icon: '🧘' },
        { value: 'hiit', label: 'HIIT', icon: '⚡' },
        { value: 'yoga', label: 'Yoga', icon: '🕉️' },
        { value: 'pilates', label: 'Pilates', icon: '🤸' }
    ],
    difficulties: [
        { value: '', label: 'Tất cả', color: '#666', bgColor: '#f5f5f5' },
        { value: 'beginner', label: 'Beginner', color: '#4caf50', bgColor: '#e8f5e8' },
        { value: 'intermediate', label: 'Intermediate', color: '#ff9800', bgColor: '#fff3e0' },
        { value: 'advanced', label: 'Advanced', color: '#f44336', bgColor: '#ffebee' }
    ],
    durations: [
        { value: '', label: 'Bất kỳ', icon: '⏰' },
        { value: '15', label: '≤ 15p', icon: '⚡' },
        { value: '30', label: '≤ 30p', icon: '🕐' },
        { value: '45', label: '≤ 45p', icon: '🕜' },
        { value: '60', label: '≤ 1h', icon: '🕔' }
    ],
    equipment: [
        { value: '', label: 'Tất cả', icon: '🏋️' },
        { value: 'bodyweight', label: 'Không TB', icon: '🤸' },
        { value: 'dumbbell', label: 'Tạ đơn', icon: '🏋️' },
        { value: 'barbell', label: 'Tạ đòn', icon: '🔗' },
        { value: 'resistance_band', label: 'Dây kháng', icon: '🎗️' },
        { value: 'kettlebell', label: 'Kettlebell', icon: '⚫' },
        { value: 'machine', label: 'Máy tập', icon: '🤖' }
    ]
};

// ================================
// 🔍 Main WorkoutFilters Component - Auto-Collapse
// ================================
const WorkoutFilters: React.FC<WorkoutFiltersProps> = ({
    filters,
    onFiltersChange,
    totalResults
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // ✅ CHANGED: Default collapsed states
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showCategories, setShowCategories] = useState(false); // Default closed
    const [isPending, startTransition] = useTransition();

    // ✅ NEW: Auto-expand when filters are active
    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    const hasNonSearchFilters = Object.entries(filters).some(([key, value]) =>
        key !== 'search' && value !== ''
    );

    // Auto-expand categories if user has selected category/difficulty filters
    useEffect(() => {
        if (filters.category || filters.difficulty) {
            setShowCategories(true);
        }
    }, [filters.category, filters.difficulty]);

    // Auto-expand advanced if user has selected duration/equipment filters
    useEffect(() => {
        if (filters.maxDuration || filters.equipment) {
            setShowAdvanced(true);
        }
    }, [filters.maxDuration, filters.equipment]);

    // Handle filter changes with React 19 transitions
    const handleFilterChange = (key: keyof FilterState, value: string) => {
        startTransition(() => {
            onFiltersChange({ ...filters, [key]: value });
        });
    };

    // Clear all filters
    const clearAllFilters = () => {
        startTransition(() => {
            onFiltersChange({
                search: '',
                category: '',
                difficulty: '',
                maxDuration: '',
                equipment: '',
            });
            // Collapse all sections when clearing
            setShowAdvanced(false);
            setShowCategories(false);
        });
    };

    const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.06)',
                mb: 2,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, transparent 100%)',
                transition: 'all 0.3s ease',
                ...(isPending && {
                    opacity: 0.7,
                    pointerEvents: 'none'
                })
            }}
        >
            {/* ✅ COMPACT: Search Bar + Quick Controls */}
            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                {/* Compact Search Bar */}
                <TextField
                    fullWidth
                    placeholder="🔍 Tìm kiếm workouts..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    size="medium"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: 'primary.main', fontSize: 20 }} />
                            </InputAdornment>
                        ),
                        endAdornment: filters.search && (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={() => handleFilterChange('search', '')}
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': { color: 'error.main' }
                                    }}
                                >
                                    <Clear fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            fontSize: '1rem',
                            fontWeight: 500,
                            background: 'white',
                            height: 48,
                            '&:hover': {
                                boxShadow: '0 2px 12px rgba(102, 126, 234, 0.1)',
                            },
                            '&.Mui-focused': {
                                boxShadow: '0 2px 12px rgba(102, 126, 234, 0.2)',
                            }
                        },
                    }}
                />

                {/* ✅ NEW: Compact Control Bar with Smart Buttons */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1.5
                }}>
                    {/* Left - Smart Filter Toggles */}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Categories Toggle */}
                        <Button
                            size="small"
                            startIcon={showCategories ? <ExpandLess /> : <ExpandMore />}
                            onClick={() => setShowCategories(!showCategories)}
                            variant={showCategories || filters.category || filters.difficulty ? "contained" : "outlined"}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                px: 1.5,
                                py: 0.5,
                                minWidth: 'auto',
                                ...((showCategories || filters.category || filters.difficulty) && {
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }),
                                // Badge for active filters
                                position: 'relative',
                                ...(filters.category || filters.difficulty ? {
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -2,
                                        right: -2,
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: '#ff4444',
                                    }
                                } : {})
                            }}
                        >
                            Danh mục
                        </Button>

                        {/* Advanced Toggle */}
                        <Button
                            size="small"
                            startIcon={<TuneOutlined />}
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            variant={showAdvanced || filters.maxDuration || filters.equipment ? "contained" : "outlined"}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                px: 1.5,
                                py: 0.5,
                                minWidth: 'auto',
                                borderColor: 'secondary.main',
                                color: (showAdvanced || filters.maxDuration || filters.equipment) ? 'white' : 'secondary.main',
                                ...((showAdvanced || filters.maxDuration || filters.equipment) && {
                                    backgroundColor: 'secondary.main',
                                }),
                                // Badge for active filters
                                position: 'relative',
                                ...(filters.maxDuration || filters.equipment ? {
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -2,
                                        right: -2,
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: '#ff4444',
                                    }
                                } : {})
                            }}
                        >
                            Nâng cao
                        </Button>
                    </Box>

                    {/* Right - Results & Clear */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                color: 'primary.main',
                                fontSize: '0.875rem'
                            }}
                        >
                            {totalResults.toLocaleString()} kết quả
                        </Typography>

                        {hasActiveFilters && (
                            <>
                                <Chip
                                    icon={<FilterList />}
                                    label={activeFiltersCount}
                                    size="small"
                                    color="primary"
                                    variant="filled"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        height: 24,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }}
                                />
                                <Button
                                    size="small"
                                    startIcon={<Clear />}
                                    onClick={clearAllFilters}
                                    sx={{
                                        textTransform: 'none',
                                        color: 'error.main',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        px: 1,
                                        py: 0.25,
                                        minWidth: 'auto',
                                        '&:hover': {
                                            backgroundColor: 'error.light',
                                            color: 'white',
                                        },
                                    }}
                                >
                                    Xóa
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* ✅ COLLAPSIBLE: Categories & Difficulty */}
            <Collapse in={showCategories}>
                <Box sx={{
                    px: { xs: 2, md: 2.5 },
                    pb: 2,
                    borderTop: '1px solid rgba(0,0,0,0.04)',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
                }}>
                    {/* Categories - Compact */}
                    <Box sx={{ mb: 2, mt: 2 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mb: 1.5,
                                fontWeight: 600,
                                color: 'text.primary',
                                fontSize: '0.9rem'
                            }}
                        >
                            🏃 Danh mục
                        </Typography>
                        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                            {filterOptions.categories.map((option) => (
                                <Chip
                                    key={option.value}
                                    label={`${option.icon} ${option.label}`}
                                    onClick={() => handleFilterChange('category', option.value)}
                                    variant={filters.category === option.value ? 'filled' : 'outlined'}
                                    color={filters.category === option.value ? 'primary' : 'default'}
                                    size="small"
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        height: 32,
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        },
                                        ...(filters.category === option.value && {
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                        })
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Difficulty - Compact */}
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mb: 1.5,
                                fontWeight: 600,
                                color: 'text.primary',
                                fontSize: '0.9rem'
                            }}
                        >
                            📊 Độ khó
                        </Typography>
                        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                            {filterOptions.difficulties.map((option) => (
                                <Chip
                                    key={option.value}
                                    label={option.label}
                                    onClick={() => handleFilterChange('difficulty', option.value)}
                                    variant={filters.difficulty === option.value ? 'filled' : 'outlined'}
                                    size="small"
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        height: 32,
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        borderColor: option.color,
                                        color: filters.difficulty === option.value ? 'white' : option.color,
                                        backgroundColor: filters.difficulty === option.value ? option.color : option.bgColor,
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: `0 2px 8px ${option.color}40`,
                                            backgroundColor: option.color,
                                            color: 'white',
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </Collapse>

            {/* ✅ COLLAPSIBLE: Advanced Filters */}
            <Collapse in={showAdvanced}>
                <Box sx={{
                    px: { xs: 2, md: 2.5 },
                    pb: 2,
                    pt: 1,
                    background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.03) 0%, rgba(233, 30, 99, 0.03) 100%)',
                    borderTop: '1px solid rgba(0,0,0,0.06)'
                }}>
                    {/* Duration Filter - Compact */}
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mb: 1.5,
                                fontWeight: 600,
                                color: 'text.primary',
                                fontSize: '0.9rem'
                            }}
                        >
                            ⏱️ Thời lượng
                        </Typography>
                        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                            {filterOptions.durations.map((option) => (
                                <Chip
                                    key={option.value}
                                    label={`${option.icon} ${option.label}`}
                                    onClick={() => handleFilterChange('maxDuration', option.value)}
                                    variant={filters.maxDuration === option.value ? 'filled' : 'outlined'}
                                    color={filters.maxDuration === option.value ? 'secondary' : 'default'}
                                    size="small"
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        height: 32,
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)',
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Equipment Filter - Compact */}
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mb: 1.5,
                                fontWeight: 600,
                                color: 'text.primary',
                                fontSize: '0.9rem'
                            }}
                        >
                            🏋️ Thiết bị
                        </Typography>
                        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                            {filterOptions.equipment.map((option) => (
                                <Chip
                                    key={option.value}
                                    label={`${option.icon} ${option.label}`}
                                    onClick={() => handleFilterChange('equipment', option.value)}
                                    variant={filters.equipment === option.value ? 'filled' : 'outlined'}
                                    color={filters.equipment === option.value ? 'info' : 'default'}
                                    size="small"
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        height: 32,
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default WorkoutFilters;
