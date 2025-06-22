/**
 * 🔍 ExerciseFilters Component - Auto-Collapse Optimized Design
 * Compact filter interface với smart collapsing để tiết kiệm không gian tối đa
 * Applied WorkoutFilters design pattern for consistency
 */

import React, { useState, useEffect, useTransition } from 'react';
import {
    Box,
    Chip,
    Collapse,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
    IconButton,
    Button,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Clear,
    Search,
    ExpandMore,
    TuneOutlined,
    FilterList
} from '@mui/icons-material';

// ================================
// 🎯 Types & Interfaces
// ================================
interface ExerciseFilterState {
    search: string;
    category: string;
    difficulty: string;
    primaryMuscleGroups: string[];
    equipment: string[];
}

interface ExerciseFiltersProps {
    filters: ExerciseFilterState;
    onFiltersChange: (filters: ExerciseFilterState) => void;
    totalResults: number;
}

// ================================
// 🎨 Filter Categories Data - Following WorkoutFilters pattern
// ================================
const filterOptions = {
    categories: [
        { value: '', label: 'Tất cả', icon: '🏋️' },
        { value: 'strength', label: 'Sức mạnh', icon: '💪' },
        { value: 'cardio', label: 'Tim mạch', icon: '❤️' },
        { value: 'flexibility', label: 'Linh hoạt', icon: '🧘' },
        { value: 'balance', label: 'Thăng bằng', icon: '⚖️' },
        { value: 'sports', label: 'Thể thao', icon: '⚽' }
    ],
    difficulties: [
        { value: '', label: 'Tất cả', color: '#666', bgColor: '#f5f5f5' },
        { value: 'beginner', label: 'Người mới', color: '#4caf50', bgColor: '#e8f5e8' },
        { value: 'intermediate', label: 'Trung bình', color: '#ff9800', bgColor: '#fff3e0' },
        { value: 'advanced', label: 'Nâng cao', color: '#f44336', bgColor: '#ffebee' }
    ],
    muscleGroups: [
        { value: 'chest', label: 'Ngực', icon: '💪' },
        { value: 'back', label: 'Lưng', icon: '🔙' },
        { value: 'legs', label: 'Chân', icon: '🦵' },
        { value: 'shoulders', label: 'Vai', icon: '🤷' },
        { value: 'arms', label: 'Tay', icon: '💪' },
        { value: 'core', label: 'Cơ lõi', icon: '🎯' }
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
// 🔍 Main ExerciseFilters Component - Auto-Collapse
// ================================
const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
    filters,
    onFiltersChange,
    totalResults
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // ✅ State management - Default collapsed
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [isPending, startTransition] = useTransition();

    // ✅ Auto-expand logic when filters are active
    const hasActiveFilters = Object.values(filters).some(value =>
        Array.isArray(value) ? value.length > 0 : value !== ''
    );
    const hasNonSearchFilters = Object.entries(filters).some(([key, value]) =>
        key !== 'search' && (Array.isArray(value) ? value.length > 0 : value !== '')
    );

    // Auto-expand categories if user has selected category/difficulty filters
    useEffect(() => {
        if (filters.category || filters.difficulty) {
            setShowCategories(true);
        }
    }, [filters.category, filters.difficulty]);

    // Auto-expand advanced if user has selected muscle/equipment filters
    useEffect(() => {
        if (filters.primaryMuscleGroups?.length > 0 || filters.equipment?.length > 0) {
            setShowAdvanced(true);
        }
    }, [filters.primaryMuscleGroups, filters.equipment]);

    // Handle filter changes with React 19 transitions
    const handleFilterChange = (key: keyof ExerciseFilterState, value: unknown) => {
        startTransition(() => {
            onFiltersChange({ ...filters, [key]: value });
        });
    };

    // Handle muscle group toggle
    const handleMuscleGroupToggle = (muscleGroup: string) => {
        const currentGroups = filters.primaryMuscleGroups || [];
        const newGroups = currentGroups.includes(muscleGroup)
            ? currentGroups.filter(group => group !== muscleGroup)
            : [...currentGroups, muscleGroup];

        handleFilterChange('primaryMuscleGroups', newGroups);
    };

    // Handle equipment toggle
    const handleEquipmentToggle = (equipment: string) => {
        const currentEquipment = filters.equipment || [];
        const newEquipment = currentEquipment.includes(equipment)
            ? currentEquipment.filter(eq => eq !== equipment)
            : [...currentEquipment, equipment];

        handleFilterChange('equipment', newEquipment);
    };

    // Clear all filters
    const clearAllFilters = () => {
        startTransition(() => {
            onFiltersChange({
                search: '',
                category: '',
                difficulty: '',
                primaryMuscleGroups: [],
                equipment: []
            });
            // Collapse all sections when clearing
            setShowAdvanced(false);
            setShowCategories(false);
        });
    };

    const activeFiltersCount = Object.values(filters).filter(value =>
        Array.isArray(value) ? value.length > 0 : value !== ''
    ).length;

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
                    placeholder="🔍 Tìm kiếm bài tập..."
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
                                borderColor: 'rgba(102, 126, 234, 0.3)'
                            },
                            '&.Mui-focused': {
                                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
                                borderColor: 'primary.main'
                            }
                        }
                    }}
                />

                {/* Compact Filter Actions */}
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                >
                    {/* Results count + Active filters indicator */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {totalResults} bài tập
                        </Typography>
                        {hasActiveFilters && (
                            <Chip
                                label={`${activeFiltersCount} bộ lọc`}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{
                                    height: 24,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    borderRadius: 1
                                }}
                            />
                        )}
                    </Box>

                    {/* Action buttons */}
                    <Stack direction="row" spacing={1}>
                        {hasActiveFilters && (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={clearAllFilters}
                                startIcon={<Clear />}
                                sx={{
                                    minWidth: 'auto',
                                    px: 1.5,
                                    py: 0.5,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    color: 'error.main',
                                    borderColor: 'error.main',
                                    '&:hover': {
                                        borderColor: 'error.dark',
                                        backgroundColor: 'error.50'
                                    }
                                }}
                            >
                                Xóa
                            </Button>
                        )}

                        <Button
                            variant={showCategories ? "contained" : "outlined"}
                            size="small"
                            onClick={() => setShowCategories(!showCategories)}
                            endIcon={
                                <ExpandMore
                                    sx={{
                                        transform: showCategories ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                />
                            }
                            sx={{
                                minWidth: 'auto',
                                px: 1.5,
                                py: 0.5,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                borderRadius: 2
                            }}
                        >
                            Danh mục
                        </Button>

                        <Button
                            variant={showAdvanced ? "contained" : "outlined"}
                            size="small"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            endIcon={
                                <ExpandMore
                                    sx={{
                                        transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                />
                            }
                            sx={{
                                minWidth: 'auto',
                                px: 1.5,
                                py: 0.5,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                borderRadius: 2
                            }}
                        >
                            Nâng cao
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {/* ✅ CATEGORY FILTERS - Collapsible */}
            <Collapse in={showCategories}>
                <Box sx={{
                    px: { xs: 2, md: 2.5 },
                    pb: 2,
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    backgroundColor: 'rgba(102, 126, 234, 0.02)'
                }}>
                    {/* Category Section */}
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1.5,
                                mt: 2,
                                color: 'text.primary',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            📂 Danh mục
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {filterOptions.categories.map((category) => (
                                <Chip
                                    key={category.value}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <span style={{ fontSize: '0.8rem' }}>{category.icon}</span>
                                            <span>{category.label}</span>
                                        </Box>
                                    }
                                    variant={filters.category === category.value ? 'filled' : 'outlined'}
                                    onClick={() => handleFilterChange('category',
                                        filters.category === category.value ? '' : category.value
                                    )}
                                    sx={{
                                        fontSize: '0.8rem',
                                        height: 32,
                                        borderRadius: 2,
                                        fontWeight: 500,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Difficulty Section */}
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1.5,
                                color: 'text.primary',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            🎯 Độ khó
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {filterOptions.difficulties.map((difficulty) => (
                                <Chip
                                    key={difficulty.value}
                                    label={difficulty.label}
                                    variant={filters.difficulty === difficulty.value ? 'filled' : 'outlined'}
                                    onClick={() => handleFilterChange('difficulty',
                                        filters.difficulty === difficulty.value ? '' : difficulty.value
                                    )}
                                    sx={{
                                        fontSize: '0.8rem',
                                        height: 32,
                                        borderRadius: 2,
                                        fontWeight: 500,
                                        transition: 'all 0.2s ease',
                                        color: difficulty.color,
                                        backgroundColor: filters.difficulty === difficulty.value ? difficulty.bgColor : 'white',
                                        borderColor: difficulty.color,
                                        '&:hover': {
                                            backgroundColor: difficulty.bgColor,
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </Collapse>

            {/* ✅ ADVANCED FILTERS - Collapsible */}
            <Collapse in={showAdvanced}>
                <Box sx={{
                    px: { xs: 2, md: 2.5 },
                    pb: 2,
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    backgroundColor: 'rgba(102, 126, 234, 0.02)'
                }}>
                    {/* Muscle Groups Section */}
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1.5,
                                mt: 2,
                                color: 'text.primary',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            💪 Nhóm cơ
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {filterOptions.muscleGroups.map((muscle) => (
                                <Chip
                                    key={muscle.value}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <span style={{ fontSize: '0.8rem' }}>{muscle.icon}</span>
                                            <span>{muscle.label}</span>
                                        </Box>
                                    }
                                    variant={filters.primaryMuscleGroups?.includes(muscle.value) ? 'filled' : 'outlined'}
                                    onClick={() => handleMuscleGroupToggle(muscle.value)}
                                    sx={{
                                        fontSize: '0.8rem',
                                        height: 32,
                                        borderRadius: 2,
                                        fontWeight: 500,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Equipment Section */}
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1.5,
                                color: 'text.primary',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            🛠️ Thiết bị
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {filterOptions.equipment.map((equipment) => (
                                <Chip
                                    key={equipment.value}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <span style={{ fontSize: '0.8rem' }}>{equipment.icon}</span>
                                            <span>{equipment.label}</span>
                                        </Box>
                                    }
                                    variant={filters.equipment?.includes(equipment.value) ? 'filled' : 'outlined'}
                                    onClick={() => handleEquipmentToggle(equipment.value)}
                                    sx={{
                                        fontSize: '0.8rem',
                                        height: 32,
                                        borderRadius: 2,
                                        fontWeight: 500,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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

export default ExerciseFilters;
