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
    Button
} from '@mui/material';
import {
    Clear,
    Search,
    ExpandMore
} from '@mui/icons-material';

// ================================
// 🎯 Types & Interfaces
// ================================
export interface ExerciseFilterState {
    search: string;
    category: string;
    difficulty: string;
    primaryMuscleGroups: string[];
    equipment: string[];
    // ✅ NEW: Advanced filters from OLD version
    caloriesRange?: { min?: number; max?: number };
    intensityRange?: { min?: number; max?: number };
    isApproved?: boolean;
    hasPrecautions?: boolean;
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
    ], equipment: [
        { value: '', label: 'Tất cả', icon: '🏋️' },
        { value: 'bodyweight', label: 'Không TB', icon: '🤸' },
        { value: 'dumbbells', label: 'Tạ đơn', icon: '🏋️' },
        { value: 'barbell', label: 'Tạ đòn', icon: '🔗' },
        { value: 'resistance_bands', label: 'Dây kháng', icon: '🎗️' },
        { value: 'kettlebell', label: 'Kettlebell', icon: '⚫' },
        { value: 'machine', label: 'Máy tập', icon: '🤖' },
        { value: 'cable', label: 'Cáp treo', icon: '🪢' },
        { value: 'pull_up_bar', label: 'Xà đơn', icon: '🎯' }
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
    // ✅ State management - Default collapsed
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [isPending, startTransition] = useTransition();

    // ✅ Auto-expand logic when filters are active
    const hasActiveFilters = Object.values(filters).some(value =>
        Array.isArray(value) ? value.length > 0 : value !== ''
    );

    // Auto-expand categories if user has selected category/difficulty filters
    useEffect(() => {
        if (filters.category || filters.difficulty) {
            setShowCategories(true);
        }
    }, [filters.category, filters.difficulty]);    // Auto-expand advanced if user has selected muscle/equipment filters
    useEffect(() => {
        if (filters.primaryMuscleGroups?.length > 0 || filters.equipment?.length > 0 ||
            filters.caloriesRange || filters.intensityRange || filters.isApproved || filters.hasPrecautions) {
            setShowAdvanced(true);
        }
    }, [filters.primaryMuscleGroups, filters.equipment, filters.caloriesRange, filters.intensityRange, filters.isApproved, filters.hasPrecautions]);

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
    };    // Clear all filters
    const clearAllFilters = () => {
        startTransition(() => {
            onFiltersChange({
                search: '',
                category: '',
                difficulty: '',
                primaryMuscleGroups: [],
                equipment: [],
                // ✅ Clear advanced filters too
                caloriesRange: undefined,
                intensityRange: undefined,
                isApproved: undefined,
                hasPrecautions: undefined
            });
            // Collapse all sections when clearing
            setShowAdvanced(false);
            setShowCategories(false);
        });
    };

    const activeFiltersCount = Object.values(filters).filter(value =>
        Array.isArray(value) ? value.length > 0 : value !== ''
    ).length;

    return (<Paper
        elevation={3}
        sx={{
            borderRadius: 3,
            border: '1px solid rgba(102, 126, 234, 0.1)',
            mb: 2,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 255, 0.95) 100%)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 6px 25px rgba(102, 126, 234, 0.12)',
                transform: 'translateY(-1px)'
            },
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
            >                    {/* Results count + Active filters indicator */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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

                    {/* Active Filters Summary */}
                    {hasActiveFilters && (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                            {filters.category && (
                                <Chip
                                    label={`📂 ${filterOptions.categories.find(c => c.value === filters.category)?.label}`}
                                    size="small"
                                    variant="filled"
                                    color="primary"
                                    onDelete={() => handleFilterChange('category', '')}
                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                            )}
                            {filters.difficulty && (
                                <Chip
                                    label={`🎯 ${filterOptions.difficulties.find(d => d.value === filters.difficulty)?.label}`}
                                    size="small"
                                    variant="filled"
                                    color="secondary"
                                    onDelete={() => handleFilterChange('difficulty', '')}
                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                            )}
                            {filters.primaryMuscleGroups?.map(muscle => (
                                <Chip
                                    key={muscle}
                                    label={`💪 ${filterOptions.muscleGroups.find(m => m.value === muscle)?.label}`}
                                    size="small"
                                    variant="filled"
                                    color="success"
                                    onDelete={() => handleMuscleGroupToggle(muscle)}
                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                            ))}                            {filters.equipment?.map(eq => (
                                <Chip
                                    key={eq}
                                    label={`🛠️ ${filterOptions.equipment.find(e => e.value === eq)?.label}`}
                                    size="small"
                                    variant="filled"
                                    color="warning"
                                    onDelete={() => handleEquipmentToggle(eq)}
                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                            ))}
                            {filters.caloriesRange?.min && (
                                <Chip
                                    label={`🔥 Calories ≥${filters.caloriesRange.min}`}
                                    size="small"
                                    variant="filled"
                                    color="error"
                                    onDelete={() => handleFilterChange('caloriesRange', { ...filters.caloriesRange, min: undefined })}
                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                            )}
                            {filters.caloriesRange?.max && (
                                <Chip
                                    label={`🔥 Calories ≤${filters.caloriesRange.max}`}
                                    size="small"
                                    variant="filled"
                                    color="error"
                                    onDelete={() => handleFilterChange('caloriesRange', { ...filters.caloriesRange, max: undefined })}
                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                            )}
                            {filters.intensityRange?.min && (
                                <Chip
                                    label={`⚡ Intensity ≥${filters.intensityRange.min}`}
                                    size="small"
                                    variant="filled"
                                    color="info"
                                    onDelete={() => handleFilterChange('intensityRange', { ...filters.intensityRange, min: undefined })}
                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                            )}
                            {filters.intensityRange?.max && (
                                <Chip
                                    label={`⚡ Intensity ≤${filters.intensityRange.max}`}
                                    size="small"
                                    variant="filled"
                                    color="info"
                                    onDelete={() => handleFilterChange('intensityRange', { ...filters.intensityRange, max: undefined })}
                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                            )}
                            {filters.isApproved && (
                                <Chip
                                    label="✅ Đã duyệt"
                                    size="small"
                                    variant="filled"
                                    color="success"
                                    onDelete={() => handleFilterChange('isApproved', undefined)}
                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                            )}
                            {filters.hasPrecautions && (
                                <Chip
                                    label="⚠️ Cảnh báo"
                                    size="small"
                                    variant="filled"
                                    color="warning"
                                    onDelete={() => handleFilterChange('hasPrecautions', undefined)}
                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                            )}
                        </Stack>
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
                        // startIcon={
                        //     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        //         <span>📂</span>
                        //         {(filters.category || filters.difficulty) && (
                        //             <Box sx={{
                        //                 width: 6,
                        //                 height: 6,
                        //                 borderRadius: '50%',
                        //                 backgroundColor: 'primary.main'
                        //             }} />
                        //         )}
                        //     </Box>
                        // }
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
                        // startIcon={
                        //     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        //         <span>🔧</span>
                        //         {(filters.primaryMuscleGroups?.length > 0 || filters.equipment?.length > 0) && (
                        //             <Box sx={{
                        //                 width: 6,
                        //                 height: 6,
                        //                 borderRadius: '50%',
                        //                 backgroundColor: 'warning.main'
                        //             }} />
                        //         )}
                        //     </Box>
                        // }
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
        </Box>            {/* ✅ CATEGORY FILTERS - Collapsible */}
        <Collapse in={showCategories}>
            <Box sx={{
                px: { xs: 2, md: 2.5 },
                pb: 2,
                borderTop: '1px solid rgba(102, 126, 234, 0.1)',
                backgroundColor: 'rgba(248, 250, 255, 0.8)',
                backdropFilter: 'blur(4px)'
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
        </Collapse>            {/* ✅ ADVANCED FILTERS - Collapsible */}
        <Collapse in={showAdvanced}>
            <Box sx={{
                px: { xs: 2, md: 2.5 },
                pb: 2,
                borderTop: '1px solid rgba(102, 126, 234, 0.1)',
                backgroundColor: 'rgba(248, 250, 255, 0.8)',
                backdropFilter: 'blur(4px)'
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
                </Box>                {/* Equipment Section */}
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

                {/* ✅ NEW: Numeric Range Filters */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 3 }}>
                    {/* Calories Range */}
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
                            🔥 Calories/phút
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                                type="number"
                                placeholder="Min"
                                size="small"
                                value={filters.caloriesRange?.min || ''}
                                onChange={(e) => {
                                    const value = e.target.value ? Number(e.target.value) : undefined;
                                    handleFilterChange('caloriesRange', {
                                        ...filters.caloriesRange,
                                        min: value
                                    });
                                }}
                                sx={{
                                    width: 80,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: '0.8rem',
                                        height: 40,
                                        background: 'white',
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                    }
                                }}
                            />
                            <Typography variant="body2" color="text.secondary">-</Typography>
                            <TextField
                                type="number"
                                placeholder="Max"
                                size="small"
                                value={filters.caloriesRange?.max || ''}
                                onChange={(e) => {
                                    const value = e.target.value ? Number(e.target.value) : undefined;
                                    handleFilterChange('caloriesRange', {
                                        ...filters.caloriesRange,
                                        max: value
                                    });
                                }}
                                sx={{
                                    width: 80,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: '0.8rem',
                                        height: 40,
                                        background: 'white',
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                    }
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Intensity Range */}
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
                            ⚡ Cường độ (1-10)
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                                type="number"
                                placeholder="Min"
                                size="small"
                                inputProps={{ min: 1, max: 10 }}
                                value={filters.intensityRange?.min || ''}
                                onChange={(e) => {
                                    const value = e.target.value ? Number(e.target.value) : undefined;
                                    handleFilterChange('intensityRange', {
                                        ...filters.intensityRange,
                                        min: value
                                    });
                                }}
                                sx={{
                                    width: 80,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: '0.8rem',
                                        height: 40,
                                        background: 'white',
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                    }
                                }}
                            />
                            <Typography variant="body2" color="text.secondary">-</Typography>
                            <TextField
                                type="number"
                                placeholder="Max"
                                size="small"
                                inputProps={{ min: 1, max: 10 }}
                                value={filters.intensityRange?.max || ''}
                                onChange={(e) => {
                                    const value = e.target.value ? Number(e.target.value) : undefined;
                                    handleFilterChange('intensityRange', {
                                        ...filters.intensityRange,
                                        max: value
                                    });
                                }}
                                sx={{
                                    width: 80,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: '0.8rem',
                                        height: 40,
                                        background: 'white',
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* ✅ NEW: Admin & Safety Options */}
                {/* <Box sx={{ mt: 3 }}>
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
                        ⚙️ Tùy chọn khác
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip
                            label="✅ Chỉ bài tập đã duyệt"
                            variant={filters.isApproved === true ? 'filled' : 'outlined'}
                            onClick={() => handleFilterChange('isApproved',
                                filters.isApproved === true ? undefined : true
                            )}
                            color="success"
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
                        <Chip
                            label="⚠️ Có cảnh báo an toàn"
                            variant={filters.hasPrecautions === true ? 'filled' : 'outlined'}
                            onClick={() => handleFilterChange('hasPrecautions',
                                filters.hasPrecautions === true ? undefined : true
                            )}
                            color="warning"
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
                    </Stack>
                </Box> */}
            </Box>
        </Collapse>
    </Paper>
    );
};

export default ExerciseFilters;
