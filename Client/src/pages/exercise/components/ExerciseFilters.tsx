/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 🔍 ExerciseFilters - Compact Horizontal Design
 * Tối ưu không gian với inline filters và collapsible advanced options
 */

import {
    Clear,
    Search,
    FilterList
} from '@mui/icons-material';
import {
    Autocomplete,
    Box,
    Chip,
    Collapse,
    InputAdornment,
    Paper,
    Slider,
    Stack,
    TextField,
    Typography,
    IconButton,
    Divider
} from '@mui/material';
import React, { useState, useTransition } from 'react';
import { ExerciseListParams } from '../../../services/exerciseService';

interface ExerciseFiltersProps {
    filters: ExerciseListParams['filters'];
    onFiltersChange: (filters: ExerciseListParams['filters']) => void;
    totalResults: number;
}

// Filter data
const filterTabs = {
    category: {
        label: 'Loại bài tập',
        icon: '🏋️',
        options: [
            { value: 'strength', label: 'Sức mạnh', icon: '💪' },
            { value: 'cardio', label: 'Tim mạch', icon: '❤️' },
            { value: 'flexibility', label: 'Linh hoạt', icon: '🧘' }
        ]
    },
    difficulty: {
        label: 'Độ khó',
        icon: '📊',
        options: [
            { value: 'beginner', label: 'Người mới', color: '#4caf50' },
            { value: 'intermediate', label: 'Trung bình', color: '#ff9800' },
            { value: 'advanced', label: 'Nâng cao', color: '#f44336' }
        ]
    },
    muscle: {
        label: 'Nhóm cơ',
        icon: '🎯',
        options: ['Ngực', 'Lưng', 'Vai', 'Tay', 'Bụng', 'Chân', 'Mông']
    },
    equipment: {
        label: 'Thiết bị',
        icon: '🏋️',
        options: ['Tay không', 'Tạ đơn', 'Tạ đòn', 'Máy tập', 'Dây kháng']
    }
};

const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
    filters,
    onFiltersChange,
    totalResults
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [_, startTransition] = useTransition();

    const handleFilterChange = (key: string, value: unknown) => {
        startTransition(() => {
            onFiltersChange({ ...filters, [key]: value });
        });
    };

    const clearAllFilters = () => {
        startTransition(() => {
            onFiltersChange({});
        });
    };

    const hasActiveFilters = Object.values(filters || {}).some(value =>
        value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
    );

    const activeFiltersCount = Object.values(filters || {}).filter(value =>
        value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
    ).length; return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.06)',
                mb: 2,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
            }}
        >
            {/* Ultra Compact Filter Bar */}
            <Box sx={{
                p: { xs: 1.5, sm: 2 },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1.5, sm: 2 },
                alignItems: { xs: 'stretch', sm: 'center' }
            }}>
                {/* Left: Search + Quick Filters */}
                <Box sx={{
                    display: 'flex',
                    gap: 1.5,
                    flex: 1,
                    alignItems: 'center',
                    flexWrap: { xs: 'wrap', md: 'nowrap' }
                }}>
                    {/* Compact Search */}
                    <TextField
                        placeholder="🔍 Tìm kiếm..."
                        value={filters?.search || ''}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        size="small"
                        sx={{
                            minWidth: { xs: '100%', sm: 200, md: 250 },
                            flex: { xs: 'none', md: 1 },
                            maxWidth: { md: 300 },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 20,
                                height: 36,
                                fontSize: '0.85rem',
                                background: 'white',
                                border: '1px solid rgba(0,0,0,0.08)',
                                '&:hover': {
                                    boxShadow: '0 2px 12px rgba(25, 118, 210, 0.15)',
                                    borderColor: 'primary.main'
                                },
                                '&.Mui-focused': {
                                    boxShadow: '0 2px 12px rgba(25, 118, 210, 0.2)',
                                }
                            },
                            '& .MuiInputBase-input': {
                                py: 0.8
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ fontSize: 16, color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                            endAdornment: filters?.search && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleFilterChange('search', '')}
                                        sx={{ p: 0.25 }}
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    {/* Quick Filter Chips - Inline */}
                    <Box sx={{
                        display: { xs: 'none', lg: 'flex' },
                        gap: 0.5,
                        alignItems: 'center'
                    }}>
                        {/* Category Chips */}
                        <Chip
                            label="💪"
                            onClick={() => handleFilterChange('category', filters?.category === 'strength' ? '' : 'strength')}
                            variant={filters?.category === 'strength' ? 'filled' : 'outlined'}
                            color={filters?.category === 'strength' ? 'primary' : 'default'}
                            size="small"
                            sx={{
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                height: 24,
                                minWidth: 32,
                                '& .MuiChip-label': { px: 0.5 },
                                '&:hover': { transform: 'scale(1.05)' }
                            }}
                        />
                        <Chip
                            label="❤️"
                            onClick={() => handleFilterChange('category', filters?.category === 'cardio' ? '' : 'cardio')}
                            variant={filters?.category === 'cardio' ? 'filled' : 'outlined'}
                            color={filters?.category === 'cardio' ? 'primary' : 'default'}
                            size="small"
                            sx={{
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                height: 24,
                                minWidth: 32,
                                '& .MuiChip-label': { px: 0.5 },
                                '&:hover': { transform: 'scale(1.05)' }
                            }}
                        />
                        <Chip
                            label="🧘"
                            onClick={() => handleFilterChange('category', filters?.category === 'flexibility' ? '' : 'flexibility')}
                            variant={filters?.category === 'flexibility' ? 'filled' : 'outlined'}
                            color={filters?.category === 'flexibility' ? 'primary' : 'default'}
                            size="small"
                            sx={{
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                height: 24,
                                minWidth: 32,
                                '& .MuiChip-label': { px: 0.5 },
                                '&:hover': { transform: 'scale(1.05)' }
                            }}
                        />

                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20 }} />

                        {/* Difficulty Chips */}
                        <Chip
                            label="🟢"
                            onClick={() => handleFilterChange('difficulty', filters?.difficulty === 'beginner' ? '' : 'beginner')}
                            variant={filters?.difficulty === 'beginner' ? 'filled' : 'outlined'}
                            size="small"
                            sx={{
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                height: 24,
                                minWidth: 32,
                                '& .MuiChip-label': { px: 0.5 },
                                borderColor: '#4caf50',
                                color: filters?.difficulty === 'beginner' ? 'white' : '#4caf50',
                                backgroundColor: filters?.difficulty === 'beginner' ? '#4caf50' : 'transparent',
                                '&:hover': {
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    transform: 'scale(1.05)'
                                }
                            }}
                        />
                        <Chip
                            label="🟡"
                            onClick={() => handleFilterChange('difficulty', filters?.difficulty === 'intermediate' ? '' : 'intermediate')}
                            variant={filters?.difficulty === 'intermediate' ? 'filled' : 'outlined'}
                            size="small"
                            sx={{
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                height: 24,
                                minWidth: 32,
                                '& .MuiChip-label': { px: 0.5 },
                                borderColor: '#ff9800',
                                color: filters?.difficulty === 'intermediate' ? 'white' : '#ff9800',
                                backgroundColor: filters?.difficulty === 'intermediate' ? '#ff9800' : 'transparent',
                                '&:hover': {
                                    backgroundColor: '#ff9800',
                                    color: 'white',
                                    transform: 'scale(1.05)'
                                }
                            }}
                        />
                        <Chip
                            label="🔴"
                            onClick={() => handleFilterChange('difficulty', filters?.difficulty === 'advanced' ? '' : 'advanced')}
                            variant={filters?.difficulty === 'advanced' ? 'filled' : 'outlined'}
                            size="small"
                            sx={{
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                height: 24,
                                minWidth: 32,
                                '& .MuiChip-label': { px: 0.5 },
                                borderColor: '#f44336',
                                color: filters?.difficulty === 'advanced' ? 'white' : '#f44336',
                                backgroundColor: filters?.difficulty === 'advanced' ? '#f44336' : 'transparent',
                                '&:hover': {
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    transform: 'scale(1.05)'
                                }
                            }}
                        />
                    </Box>
                </Box>

                {/* Right: Results + Actions */}
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    flexShrink: 0
                }}>
                    {/* Results Counter - Compact */}
                    <Box sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
                    }}>
                        {totalResults.toLocaleString()}
                    </Box>

                    {/* Clear Button - Compact */}
                    {hasActiveFilters && (
                        <IconButton
                            onClick={clearAllFilters}
                            color="error"
                            size="small"
                            sx={{
                                bgcolor: 'error.main',
                                color: 'white',
                                width: 28,
                                height: 28,
                                '&:hover': {
                                    bgcolor: 'error.dark',
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            <Clear fontSize="small" />
                        </IconButton>
                    )}

                    {/* Advanced Toggle - Compact */}
                    <IconButton
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        color={showAdvanced ? 'primary' : 'default'}
                        size="small"
                        sx={{
                            bgcolor: showAdvanced ? 'primary.main' : 'rgba(0,0,0,0.06)',
                            color: showAdvanced ? 'white' : 'text.secondary',
                            width: 28,
                            height: 28,
                            position: 'relative',
                            '&:hover': {
                                bgcolor: showAdvanced ? 'primary.dark' : 'rgba(0,0,0,0.12)',
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <FilterList fontSize="small" />
                        {activeFiltersCount > 0 && (
                            <Box sx={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                                bgcolor: 'error.main',
                                color: 'white',
                                borderRadius: '50%',
                                width: 16,
                                height: 16,
                                fontSize: '0.6rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {activeFiltersCount}
                            </Box>
                        )}
                    </IconButton>
                </Box>
            </Box>

            {/* Mobile Quick Filters - Show on mobile when search is not active */}
            <Box sx={{
                display: { xs: 'block', lg: 'none' },
                px: { xs: 1.5, sm: 2 },
                pb: { xs: 1.5, sm: 2 }
            }}>
                <Stack direction="row" spacing={0.5} sx={{
                    flexWrap: 'wrap',
                    gap: 0.5,
                    '& > *': {
                        marginTop: '0 !important'
                    }
                }}>
                    <Chip
                        label="💪 Sức mạnh"
                        onClick={() => handleFilterChange('category', filters?.category === 'strength' ? '' : 'strength')}
                        variant={filters?.category === 'strength' ? 'filled' : 'outlined'}
                        color={filters?.category === 'strength' ? 'primary' : 'default'}
                        size="small"
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: 26,
                            '&:hover': { transform: 'translateY(-1px)' }
                        }}
                    />
                    <Chip
                        label="❤️ Tim mạch"
                        onClick={() => handleFilterChange('category', filters?.category === 'cardio' ? '' : 'cardio')}
                        variant={filters?.category === 'cardio' ? 'filled' : 'outlined'}
                        color={filters?.category === 'cardio' ? 'primary' : 'default'}
                        size="small"
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: 26,
                            '&:hover': { transform: 'translateY(-1px)' }
                        }}
                    />
                    <Chip
                        label="🧘 Linh hoạt"
                        onClick={() => handleFilterChange('category', filters?.category === 'flexibility' ? '' : 'flexibility')}
                        variant={filters?.category === 'flexibility' ? 'filled' : 'outlined'}
                        color={filters?.category === 'flexibility' ? 'primary' : 'default'}
                        size="small"
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: 26,
                            '&:hover': { transform: 'translateY(-1px)' }
                        }}
                    />
                    <Chip
                        label="🟢 Mới"
                        onClick={() => handleFilterChange('difficulty', filters?.difficulty === 'beginner' ? '' : 'beginner')}
                        variant={filters?.difficulty === 'beginner' ? 'filled' : 'outlined'}
                        size="small"
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: 26,
                            borderColor: '#4caf50',
                            color: filters?.difficulty === 'beginner' ? 'white' : '#4caf50',
                            backgroundColor: filters?.difficulty === 'beginner' ? '#4caf50' : 'transparent',
                            '&:hover': {
                                backgroundColor: '#4caf50',
                                color: 'white',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    />
                    <Chip
                        label="🟡 TB"
                        onClick={() => handleFilterChange('difficulty', filters?.difficulty === 'intermediate' ? '' : 'intermediate')}
                        variant={filters?.difficulty === 'intermediate' ? 'filled' : 'outlined'}
                        size="small"
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: 26,
                            borderColor: '#ff9800',
                            color: filters?.difficulty === 'intermediate' ? 'white' : '#ff9800',
                            backgroundColor: filters?.difficulty === 'intermediate' ? '#ff9800' : 'transparent',
                            '&:hover': {
                                backgroundColor: '#ff9800',
                                color: 'white',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    />
                    <Chip
                        label="🔴 NC"
                        onClick={() => handleFilterChange('difficulty', filters?.difficulty === 'advanced' ? '' : 'advanced')}
                        variant={filters?.difficulty === 'advanced' ? 'filled' : 'outlined'}
                        size="small"
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: 26,
                            borderColor: '#f44336',
                            color: filters?.difficulty === 'advanced' ? 'white' : '#f44336',
                            backgroundColor: filters?.difficulty === 'advanced' ? '#f44336' : 'transparent',
                            '&:hover': {
                                backgroundColor: '#f44336',
                                color: 'white',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    />
                </Stack>
            </Box>            {/* Advanced Filters - Ultra Compact */}
            <Collapse in={showAdvanced}>
                <Box sx={{
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    p: { xs: 1.5, sm: 2 },
                    background: 'rgba(248,250,252,0.5)'
                }}>
                    {/* Advanced Header */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        gap: 1
                    }}>
                        <FilterList sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            color: 'primary.main'
                        }}>
                            Bộ lọc nâng cao
                        </Typography>
                    </Box>

                    {/* Compact Grid Layout */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                            md: '1fr 1fr 1fr 1fr'
                        },
                        gap: { xs: 1.5, sm: 2 }
                    }}>
                        {/* Muscle Groups - Compact */}
                        <Box>
                            <Typography variant="caption" sx={{
                                display: 'block',
                                mb: 0.5,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                color: 'text.secondary',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5
                            }}>
                                🎯 Nhóm cơ
                            </Typography>
                            <Autocomplete
                                multiple
                                size="small"
                                options={filterTabs.muscle.options}
                                value={Array.isArray(filters?.primaryMuscleGroups)
                                    ? filters.primaryMuscleGroups
                                    : filters?.primaryMuscleGroups ? [filters.primaryMuscleGroups] : []
                                }
                                onChange={(_, value) => handleFilterChange('primaryMuscleGroups', value)}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            variant="filled"
                                            label={option}
                                            color="primary"
                                            size="small"
                                            {...getTagProps({ index })}
                                            key={option}
                                            sx={{
                                                borderRadius: 1,
                                                fontSize: '0.7rem',
                                                height: 20,
                                                '& .MuiChip-label': { px: 0.5 }
                                            }}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Chọn nhóm cơ..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                fontSize: '0.8rem',
                                                minHeight: 36
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Box>

                        {/* Equipment - Compact */}
                        <Box>
                            <Typography variant="caption" sx={{
                                display: 'block',
                                mb: 0.5,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                color: 'text.secondary',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5
                            }}>
                                🏋️ Thiết bị
                            </Typography>
                            <Autocomplete
                                size="small"
                                options={filterTabs.equipment.options}
                                value={Array.isArray(filters?.equipment)
                                    ? filters.equipment[0] || ''
                                    : filters?.equipment || ''
                                }
                                onChange={(_, value) => handleFilterChange('equipment', value ? [value] : [])}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Chọn thiết bị..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                fontSize: '0.8rem',
                                                height: 36
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Box>

                        {/* Calories Range - Compact */}
                        <Box>
                            <Typography variant="caption" sx={{
                                display: 'block',
                                mb: 0.5,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                color: 'text.secondary',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5
                            }}>
                                🔥 Calories: {filters?.caloriesRange?.min || 0}-{filters?.caloriesRange?.max || 50}
                            </Typography>
                            <Box sx={{ px: 1, pt: 1 }}>
                                <Slider
                                    value={[
                                        filters?.caloriesRange?.min || 0,
                                        filters?.caloriesRange?.max || 50
                                    ]}
                                    onChange={(_, value) => {
                                        const [min, max] = value as number[];
                                        handleFilterChange('caloriesRange', { min, max });
                                    }}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={50}
                                    step={2}
                                    size="small"
                                    sx={{
                                        '& .MuiSlider-thumb': {
                                            width: 12,
                                            height: 12,
                                            background: 'linear-gradient(135deg, #ff9800 0%, #1976d2 100%)'
                                        },
                                        '& .MuiSlider-track': {
                                            background: 'linear-gradient(90deg, #ff9800 0%, #1976d2 100%)',
                                            height: 3
                                        }
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Intensity Range - Compact */}
                        <Box>
                            <Typography variant="caption" sx={{
                                display: 'block',
                                mb: 0.5,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                color: 'text.secondary',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5
                            }}>
                                ⚡ Cường độ: {filters?.intensityRange?.min || 1}-{filters?.intensityRange?.max || 10}
                            </Typography>
                            <Box sx={{ px: 1, pt: 1 }}>
                                <Slider
                                    value={[
                                        filters?.intensityRange?.min || 1,
                                        filters?.intensityRange?.max || 10
                                    ]}
                                    onChange={(_, value) => {
                                        const [min, max] = value as number[];
                                        handleFilterChange('intensityRange', { min, max });
                                    }}
                                    valueLabelDisplay="auto"
                                    min={1}
                                    max={10}
                                    step={1}
                                    size="small"
                                    sx={{
                                        '& .MuiSlider-thumb': {
                                            width: 12,
                                            height: 12,
                                            background: 'linear-gradient(135deg, #ff9800 0%, #1976d2 100%)'
                                        },
                                        '& .MuiSlider-track': {
                                            background: 'linear-gradient(90deg, #ff9800 0%, #1976d2 100%)',
                                            height: 3
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default ExerciseFilters;
