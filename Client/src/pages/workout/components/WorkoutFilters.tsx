/**
 * 🔍 WorkoutFilters Component - Advanced & Compact
 * Collapsible filters with smart defaults and quick actions
 */

import {
    Clear,
    ExpandLess,
    ExpandMore,
    FilterList,
    Search,
    Tune
} from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Collapse,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';

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
    compact?: boolean;
}

// ================================
// 🔍 WorkoutFilters Component
// ================================
const WorkoutFilters: React.FC<WorkoutFiltersProps> = ({
    filters,
    onFiltersChange,
    totalResults,
    compact = false
}) => {
    const [isExpanded, setIsExpanded] = useState(!compact);
    const [quickFilter, setQuickFilter] = useState('');

    // Handle filter changes
    const handleFilterChange = (key: keyof FilterState, value: string) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    // Clear all filters
    const clearAllFilters = () => {
        onFiltersChange({
            search: '',
            category: '',
            difficulty: '',
            maxDuration: '',
            equipment: '',
        });
        setQuickFilter('');
    };

    // Quick filter presets
    const quickFilters = [
        { label: 'Beginner', filters: { difficulty: 'beginner', maxDuration: '30' } },
        { label: 'Quick (< 15m)', filters: { maxDuration: '15' } },
        { label: 'No Equipment', filters: { equipment: 'bodyweight' } },
        { label: 'Strength', filters: { category: 'strength' } },
        { label: 'Cardio', filters: { category: 'cardio' } },
    ];

    // Apply quick filter
    const applyQuickFilter = (preset: typeof quickFilters[0]) => {
        const newFilters = { ...filters };
        Object.entries(preset.filters).forEach(([key, value]) => {
            newFilters[key as keyof FilterState] = value;
        });
        onFiltersChange(newFilters);
        setQuickFilter(preset.label);
    };

    // Check if any filters are active
    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.06)',
                overflow: 'hidden',
                mb: 3,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    pb: compact ? 2 : 1,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    borderBottom: isExpanded ? '1px solid rgba(0,0,0,0.06)' : 'none',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FilterList sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                            Bộ lọc
                        </Typography>
                        <Chip
                            label={`${totalResults} kết quả`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 22 }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {hasActiveFilters && (
                            <Button
                                size="small"
                                startIcon={<Clear />}
                                onClick={clearAllFilters}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '0.8rem',
                                    color: 'text.secondary',
                                }}
                            >
                                Xóa bộ lọc
                            </Button>
                        )}

                        {compact && (
                            <IconButton
                                size="small"
                                onClick={() => setIsExpanded(!isExpanded)}
                                sx={{ ml: 1 }}
                            >
                                {isExpanded ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        )}
                    </Box>
                </Box>

                {/* Quick Search - Always visible */}
                <Box sx={{ mt: 1.5 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Tìm kiếm workouts..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ fontSize: 20 }} />
                                </InputAdornment>
                            ),
                            ...(filters.search && {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleFilterChange('search', '')}
                                        >
                                            <Clear fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            })
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                backgroundColor: 'white',
                            },
                        }}
                    />
                </Box>
            </Box>

            {/* Collapsible Content */}
            <Collapse in={isExpanded}>
                <Box sx={{ p: 2 }}>
                    {/* Quick Filter Chips */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            BỘ LỌC NHANH:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {quickFilters.map((preset) => (
                                <Chip
                                    key={preset.label}
                                    label={preset.label}
                                    variant={quickFilter === preset.label ? 'filled' : 'outlined'}
                                    color={quickFilter === preset.label ? 'primary' : 'default'}
                                    size="small"
                                    onClick={() => applyQuickFilter(preset)}
                                    sx={{
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                        '&:hover': {
                                            backgroundColor: quickFilter === preset.label ? 'primary.dark' : 'action.hover',
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Detailed Filters */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                            md: '1fr 1fr 1fr 1fr'
                        },
                        gap: 2
                    }}>
                        {/* Category */}
                        <FormControl size="small" fullWidth>
                            <InputLabel>Danh mục</InputLabel>
                            <Select
                                value={filters.category}
                                label="Danh mục"
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                sx={{ borderRadius: 1.5 }}
                            >
                                <MenuItem value="">Tất cả danh mục</MenuItem>
                                <MenuItem value="strength">💪 Strength Training</MenuItem>
                                <MenuItem value="cardio">🏃 Cardio</MenuItem>
                                <MenuItem value="flexibility">🧘 Flexibility</MenuItem>
                                <MenuItem value="hiit">⚡ HIIT</MenuItem>
                                <MenuItem value="yoga">🕉️ Yoga</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Difficulty */}
                        <FormControl size="small" fullWidth>
                            <InputLabel>Độ khó</InputLabel>
                            <Select
                                value={filters.difficulty}
                                label="Độ khó"
                                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                                sx={{ borderRadius: 1.5 }}
                            >
                                <MenuItem value="">Tất cả cấp độ</MenuItem>
                                <MenuItem value="beginner">🟢 Beginner</MenuItem>
                                <MenuItem value="intermediate">🟡 Intermediate</MenuItem>
                                <MenuItem value="advanced">🔴 Advanced</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Duration */}
                        <FormControl size="small" fullWidth>
                            <InputLabel>Thời lượng</InputLabel>
                            <Select
                                value={filters.maxDuration}
                                label="Thời lượng"
                                onChange={(e) => handleFilterChange('maxDuration', e.target.value)}
                                sx={{ borderRadius: 1.5 }}
                            >
                                <MenuItem value="">Bất kỳ thời gian</MenuItem>
                                <MenuItem value="10">⚡ Dưới 10 phút</MenuItem>
                                <MenuItem value="20">🕐 Dưới 20 phút</MenuItem>
                                <MenuItem value="30">🕑 Dưới 30 phút</MenuItem>
                                <MenuItem value="45">🕓 Dưới 45 phút</MenuItem>
                                <MenuItem value="60">🕔 Dưới 1 giờ</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Equipment */}
                        <FormControl size="small" fullWidth>
                            <InputLabel>Thiết bị</InputLabel>
                            <Select
                                value={filters.equipment}
                                label="Thiết bị"
                                onChange={(e) => handleFilterChange('equipment', e.target.value)}
                                sx={{ borderRadius: 1.5 }}
                            >
                                <MenuItem value="">Tất cả thiết bị</MenuItem>
                                <MenuItem value="bodyweight">🤸 Không thiết bị</MenuItem>
                                <MenuItem value="dumbbell">🏋️ Tạ đơn</MenuItem>
                                <MenuItem value="barbell">🔗 Tạ đòn</MenuItem>
                                <MenuItem value="kettlebell">⚖️ Kettlebell</MenuItem>
                                <MenuItem value="resistance-band">🎗️ Dây kháng lực</MenuItem>
                                <MenuItem value="machine">🤖 Máy tập</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                BỘ LỌC ĐANG ÁPLỰNG:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {Object.entries(filters).map(([key, value]) => {
                                    if (!value) return null;

                                    const labels: Record<string, string> = {
                                        search: `Tìm kiếm: ${value}`,
                                        category: `Danh mục: ${value}`,
                                        difficulty: `Độ khó: ${value}`,
                                        maxDuration: `Dưới ${value} phút`,
                                        equipment: `Thiết bị: ${value}`,
                                    };

                                    return (
                                        <Chip
                                            key={key}
                                            label={labels[key]}
                                            size="small"
                                            onDelete={() => handleFilterChange(key as keyof FilterState, '')}
                                            color="primary"
                                            variant="outlined"
                                            sx={{ fontSize: '0.7rem' }}
                                        />
                                    );
                                })}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Collapse>
        </Paper>
    );
};

export default WorkoutFilters;
