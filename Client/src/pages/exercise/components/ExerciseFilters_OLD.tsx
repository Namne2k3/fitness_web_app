/**
 * 🏋️ ExerciseFilters Component - Design System Implementation
 * Modern filter interface following design-instructions.md color palette and gradients
 * Features color-coded categories, difficulty levels, and muscle groups
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
    ExpandMore,
    FitnessCenter,
    Speed,
    SelfImprovement
} from '@mui/icons-material';
import { useDebounce } from '../../../hooks/useDebounce';

interface ExerciseFiltersProps {
    filters: {
        search?: string;
        category?: string;
        difficulty?: string;
        primaryMuscleGroups?: string[];
        equipment?: string[];
        caloriesRange?: { min?: number; max?: number };
        intensityRange?: { min?: number; max?: number };
        isApproved?: boolean;
        hasPrecautions?: boolean;
        [key: string]: unknown;
    };
    onFiltersChange: (filters: Record<string, unknown>) => void;
    totalResults: number;
}

// Design system color-coded filter data following design-instructions.md
const quickFilters = {
    category: [
        {
            value: 'strength',
            label: 'Sức mạnh',
            icon: FitnessCenter,
            shortLabel: 'Sức mạnh',
            color: '#4caf50', // Success green
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            border: 'rgba(76, 175, 80, 0.2)'
        },
        {
            value: 'cardio',
            label: 'Tim mạch',
            icon: Speed,
            shortLabel: 'Tim mạch',
            color: '#f44336', // Error red
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
            border: 'rgba(244, 67, 54, 0.2)'
        },
        {
            value: 'flexibility',
            label: 'Linh hoạt',
            icon: SelfImprovement,
            shortLabel: 'Linh hoạt',
            color: '#9c27b0', // Purple
            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
            border: 'rgba(156, 39, 176, 0.2)'
        }
    ], difficulty: [
        {
            value: 'beginner',
            label: 'Người mới',
            emoji: '●',
            level: 1,
            color: '#4caf50', // Success green
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            border: 'rgba(76, 175, 80, 0.2)'
        },
        {
            value: 'intermediate',
            label: 'Trung bình',
            emoji: '●●',
            level: 2,
            color: '#ff9800', // Warning orange
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            border: 'rgba(255, 152, 0, 0.2)'
        },
        {
            value: 'advanced',
            label: 'Nâng cao',
            emoji: '●●●',
            level: 3,
            color: '#f44336', // Error red
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
            border: 'rgba(244, 67, 54, 0.2)'
        }
    ],
    muscle: [
        { value: 'chest', label: 'Ngực', emoji: '💪', color: '#1976d2', background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)', border: 'rgba(25, 118, 210, 0.2)' },
        { value: 'back', label: 'Lưng', emoji: '�' },
        { value: 'legs', label: 'Chân', emoji: '🦵', color: '#1976d2', background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)', border: 'rgba(25, 118, 210, 0.2)' },
        { value: 'shoulders', label: 'Vai', emoji: '🤷', color: '#1976d2', background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)', border: 'rgba(25, 118, 210, 0.2)' },
        { value: 'arms', label: 'Tay', emoji: '💪', color: '#1976d2', background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)', border: 'rgba(25, 118, 210, 0.2)' },
        { value: 'core', label: 'Cơ lõi', emoji: '🎯', color: '#1976d2', background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)', border: 'rgba(25, 118, 210, 0.2)' }
    ]
};

const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
    filters,
    onFiltersChange,
    totalResults
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [, startTransition] = useTransition();

    // ✅ Local search state cho immediate UI feedback
    const [localSearchValue, setLocalSearchValue] = useState(filters?.search as string || '');

    // ✅ Debounced search value để gọi API
    const debouncedSearchValue = useDebounce(localSearchValue, 400);

    // ✅ Sync debounced search với parent component
    useEffect(() => {
        if (debouncedSearchValue !== filters?.search) {
            startTransition(() => {
                onFiltersChange({ ...filters, search: debouncedSearchValue });
            });
        }
    }, [debouncedSearchValue, filters, onFiltersChange]);

    // ✅ Sync khi filters thay đổi từ bên ngoài
    useEffect(() => {
        if (filters?.search !== undefined && filters?.search !== localSearchValue) {
            setLocalSearchValue(filters?.search as string || '');
        }
    }, [filters?.search, localSearchValue]);

    const handleFilterChange = (key: string, value: unknown) => {
        startTransition(() => {
            onFiltersChange({ ...filters, [key]: value });
        });
    };

    const clearAllFilters = () => {
        setLocalSearchValue('');
        startTransition(() => {
            onFiltersChange({});
        });
    };

    const hasActiveFilters = Object.values(filters || {}).some(value =>
        value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
    );

    const activeFiltersCount = Object.values(filters || {}).filter(value =>
        value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
    ).length;

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 3,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: 'white'
            }}
        >            {/* 🎯 Design System Header Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #ff9800 100%)',
                    color: 'white',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FitnessCenter sx={{ fontSize: 24 }} />
                    <Box>
                        <Typography variant="h6" component="h2" fontWeight="600" sx={{ fontSize: '1.1rem' }}>
                            Thư viện bài tập
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.85rem' }}>
                            {totalResults} bài tập
                        </Typography>
                    </Box>
                </Box>

                {/* Clean Action Buttons */}
                <Stack direction="row" spacing={1}>
                    {hasActiveFilters && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={clearAllFilters}
                            startIcon={<Clear />}
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.3)',
                                fontSize: '0.8rem',
                                px: 2,
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                }
                            }}
                        >
                            Xóa bộ lọc {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                        </Button>
                    )}

                    <Button
                        variant="outlined"
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
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.3)',
                            fontSize: '0.8rem',
                            px: 2,
                            '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                            }
                        }}
                    >
                        {showAdvanced ? 'Thu gọn' : 'Bộ lọc nâng cao'}
                    </Button>
                </Stack>
            </Box>

            {/* 🔍 Minimal Search Bar */}
            <Box sx={{ p: 2, backgroundColor: '#fafafa' }}>
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm bài tập..."
                    value={localSearchValue}
                    onChange={(e) => setLocalSearchValue(e.target.value)}
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: '#666', fontSize: 20 }} />
                            </InputAdornment>
                        ),
                        endAdornment: localSearchValue && (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setLocalSearchValue('')}
                                    size="small"
                                    sx={{ color: '#666', p: 0.5 }}
                                >
                                    <Clear fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }} sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: 1.5,
                            fontSize: '0.9rem',
                            '& fieldset': {
                                borderColor: '#ddd',
                            },
                            '&:hover fieldset': {
                                borderColor: '#1976d2', // Primary blue
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#1976d2', // Primary blue
                                borderWidth: 2
                            },
                        }
                    }}
                />
            </Box>

            {/* 🏷️ Clean Filter Sections */}
            <Box sx={{ p: 2, pt: 1 }}>
                {/* Category Section */}
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            mb: 1,
                            color: '#333',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Danh mục
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {quickFilters.category.map((option) => (
                            <Chip
                                key={option.value}
                                icon={<option.icon sx={{ fontSize: 16 }} />}
                                label={option.shortLabel}
                                variant={filters?.category === option.value ? 'filled' : 'outlined'}
                                onClick={() => handleFilterChange('category',
                                    filters?.category === option.value ? '' : option.value
                                )} sx={{
                                    fontSize: '0.8rem',
                                    height: 32,
                                    borderRadius: 1,
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease',
                                    ...(filters?.category === option.value ? {
                                        background: option.background,
                                        color: option.color,
                                        border: `1px solid ${option.border}`,
                                        '& .MuiChip-icon': { color: option.color },
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        }
                                    } : {
                                        backgroundColor: 'white',
                                        border: `1px solid ${option.border}`,
                                        color: option.color,
                                        '& .MuiChip-icon': { color: option.color },
                                        '&:hover': {
                                            background: option.background,
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }
                                    })
                                }}
                            />
                        ))}
                    </Stack>
                </Box>

                {/* Difficulty Section */}
                <Box sx={{ mb: showAdvanced ? 2 : 0 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            mb: 1,
                            color: '#333',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Độ khó
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {quickFilters.difficulty.map((option) => (
                            <Chip
                                key={option.value}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{option.emoji}</span>
                                        <span>{option.label}</span>
                                    </Box>
                                }
                                variant={filters?.difficulty === option.value ? 'filled' : 'outlined'}
                                onClick={() => handleFilterChange('difficulty',
                                    filters?.difficulty === option.value ? '' : option.value
                                )} sx={{
                                    fontSize: '0.8rem',
                                    height: 32,
                                    borderRadius: 1,
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease',
                                    ...(filters?.difficulty === option.value ? {
                                        background: option.background,
                                        color: option.color,
                                        border: `1px solid ${option.border}`,
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        }
                                    } : {
                                        backgroundColor: 'white',
                                        border: `1px solid ${option.border}`,
                                        color: option.color,
                                        '&:hover': {
                                            background: option.background,
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }
                                    })
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            </Box>            {/* 🔧 Advanced Filters Section */}
            <Collapse in={showAdvanced}>
                <Box sx={{ borderTop: '1px solid #e0e0e0', p: 2, backgroundColor: '#fafafa' }}>

                    {/* Primary Muscle Groups */}
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                color: '#333',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Nhóm cơ chính
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {quickFilters.muscle.map((option) => (
                                <Chip
                                    key={option.value}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <span style={{ fontSize: '0.8rem' }}>{option.emoji}</span>
                                            <span>{option.label}</span>
                                        </Box>
                                    }
                                    variant={filters?.primaryMuscleGroups?.includes(option.value) ? 'filled' : 'outlined'}
                                    onClick={() => {
                                        const currentGroups = filters?.primaryMuscleGroups || [];
                                        const newGroups = currentGroups.includes(option.value)
                                            ? currentGroups.filter(g => g !== option.value)
                                            : [...currentGroups, option.value];
                                        handleFilterChange('primaryMuscleGroups', newGroups);
                                    }}
                                    sx={{
                                        fontSize: '0.8rem',
                                        height: 32,
                                        borderRadius: 1,
                                        fontWeight: 500,
                                        transition: 'all 0.2s ease',
                                        ...(filters?.primaryMuscleGroups?.includes(option.value) ? {
                                            background: option.background,
                                            color: option.color,
                                            border: `1px solid ${option.border}`,
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            }
                                        } : {
                                            backgroundColor: 'white',
                                            border: `1px solid ${option.border}`,
                                            color: option.color,
                                            '&:hover': {
                                                background: option.background,
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            }
                                        })
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Equipment Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                color: '#333',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Thiết bị
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {[
                                { value: 'bodyweight', label: 'Không dụng cụ', emoji: '🏃', color: '#4caf50', background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)', border: 'rgba(76, 175, 80, 0.2)' },
                                { value: 'dumbbells', label: 'Tạ đơn', emoji: '🏋️', color: '#2196f3', background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', border: 'rgba(33, 150, 243, 0.2)' },
                                { value: 'barbell', label: 'Tạ đòn', emoji: '🏋️‍♂️', color: '#ff9800', background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', border: 'rgba(255, 152, 0, 0.2)' },
                                { value: 'machine', label: 'Máy tập', emoji: '⚙️', color: '#9c27b0', background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)', border: 'rgba(156, 39, 176, 0.2)' },
                                { value: 'resistance_bands', label: 'Dây kháng lực', emoji: '🎗️', color: '#e91e63', background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)', border: 'rgba(233, 30, 99, 0.2)' },
                                { value: 'kettlebell', label: 'Kettlebell', emoji: '⚡', color: '#ff5722', background: 'linear-gradient(135deg, #fbe9e7 0%, #ffccbc 100%)', border: 'rgba(255, 87, 34, 0.2)' },
                                { value: 'cable', label: 'Cáp treo', emoji: '🪢', color: '#607d8b', background: 'linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%)', border: 'rgba(96, 125, 139, 0.2)' },
                                { value: 'pull_up_bar', label: 'Xà đơn', emoji: '🎯', color: '#795548', background: 'linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)', border: 'rgba(121, 85, 72, 0.2)' }
                            ].map((option) => (
                                <Chip
                                    key={option.value}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <span style={{ fontSize: '0.8rem' }}>{option.emoji}</span>
                                            <span>{option.label}</span>
                                        </Box>
                                    }
                                    variant={filters?.equipment?.includes(option.value) ? 'filled' : 'outlined'}
                                    onClick={() => {
                                        const currentEquipment = filters?.equipment || [];
                                        const newEquipment = currentEquipment.includes(option.value)
                                            ? currentEquipment.filter(e => e !== option.value)
                                            : [...currentEquipment, option.value];
                                        handleFilterChange('equipment', newEquipment);
                                    }}
                                    sx={{
                                        fontSize: '0.8rem',
                                        height: 32,
                                        borderRadius: 1,
                                        fontWeight: 500,
                                        transition: 'all 0.2s ease',
                                        ...(filters?.equipment?.includes(option.value) ? {
                                            background: option.background,
                                            color: option.color,
                                            border: `1px solid ${option.border}`,
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            }
                                        } : {
                                            backgroundColor: 'white',
                                            border: `1px solid ${option.border}`,
                                            color: option.color,
                                            '&:hover': {
                                                background: option.background,
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            }
                                        })
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Ranges Section */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                        {/* Calories Range */}
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1,
                                    color: '#333',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Calories/phút
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                    type="number"
                                    placeholder="Min"
                                    size="small"
                                    value={filters?.caloriesRange?.min || ''}
                                    onChange={(e) => {
                                        const value = e.target.value ? Number(e.target.value) : undefined;
                                        handleFilterChange('caloriesRange', {
                                            ...filters?.caloriesRange,
                                            min: value
                                        });
                                    }}
                                    sx={{
                                        width: 80,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            fontSize: '0.8rem',
                                            '&:hover fieldset': { borderColor: '#1976d2' },
                                            '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                        }
                                    }}
                                />
                                <Typography variant="body2" color="text.secondary">-</Typography>
                                <TextField
                                    type="number"
                                    placeholder="Max"
                                    size="small"
                                    value={filters?.caloriesRange?.max || ''}
                                    onChange={(e) => {
                                        const value = e.target.value ? Number(e.target.value) : undefined;
                                        handleFilterChange('caloriesRange', {
                                            ...filters?.caloriesRange,
                                            max: value
                                        });
                                    }}
                                    sx={{
                                        width: 80,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            fontSize: '0.8rem',
                                            '&:hover fieldset': { borderColor: '#1976d2' },
                                            '&.Mui-focused fieldset': { borderColor: '#1976d2' }
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
                                    mb: 1,
                                    color: '#333',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Cường độ (1-10)
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                    type="number"
                                    placeholder="Min"
                                    size="small"
                                    inputProps={{ min: 1, max: 10 }}
                                    value={filters?.intensityRange?.min || ''}
                                    onChange={(e) => {
                                        const value = e.target.value ? Number(e.target.value) : undefined;
                                        handleFilterChange('intensityRange', {
                                            ...filters?.intensityRange,
                                            min: value
                                        });
                                    }}
                                    sx={{
                                        width: 80,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            fontSize: '0.8rem',
                                            '&:hover fieldset': { borderColor: '#1976d2' },
                                            '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                        }
                                    }}
                                />
                                <Typography variant="body2" color="text.secondary">-</Typography>
                                <TextField
                                    type="number"
                                    placeholder="Max"
                                    size="small"
                                    inputProps={{ min: 1, max: 10 }}
                                    value={filters?.intensityRange?.max || ''}
                                    onChange={(e) => {
                                        const value = e.target.value ? Number(e.target.value) : undefined;
                                        handleFilterChange('intensityRange', {
                                            ...filters?.intensityRange,
                                            max: value
                                        });
                                    }}
                                    sx={{
                                        width: 80,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            fontSize: '0.8rem',
                                            '&:hover fieldset': { borderColor: '#1976d2' },
                                            '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* Admin & Safety Options */}
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                color: '#333',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Tùy chọn khác
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip
                                label="Chỉ bài tập đã duyệt"
                                variant={filters?.isApproved === true ? 'filled' : 'outlined'}
                                onClick={() => handleFilterChange('isApproved',
                                    filters?.isApproved === true ? undefined : true
                                )}
                                sx={{
                                    fontSize: '0.8rem',
                                    height: 32,
                                    borderRadius: 1,
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease',
                                    ...(filters?.isApproved === true ? {
                                        background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                                        color: '#4caf50',
                                        border: '1px solid rgba(76, 175, 80, 0.2)',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        }
                                    } : {
                                        backgroundColor: 'white',
                                        border: '1px solid rgba(76, 175, 80, 0.2)',
                                        color: '#4caf50',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }
                                    })
                                }}
                            />
                            <Chip
                                label="Có cảnh báo an toàn"
                                variant={filters?.hasPrecautions === true ? 'filled' : 'outlined'}
                                onClick={() => handleFilterChange('hasPrecautions',
                                    filters?.hasPrecautions === true ? undefined : true
                                )}
                                sx={{
                                    fontSize: '0.8rem',
                                    height: 32,
                                    borderRadius: 1,
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease',
                                    ...(filters?.hasPrecautions === true ? {
                                        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                        color: '#ff9800',
                                        border: '1px solid rgba(255, 152, 0, 0.2)',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        }
                                    } : {
                                        backgroundColor: 'white',
                                        border: '1px solid rgba(255, 152, 0, 0.2)',
                                        color: '#ff9800',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }
                                    })
                                }}
                            />
                        </Stack>
                    </Box>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default ExerciseFilters;