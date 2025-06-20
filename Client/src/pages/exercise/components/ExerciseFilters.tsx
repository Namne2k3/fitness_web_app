/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 🔍 ExerciseFilters - Horizontal Tab-Based Design
 * Khác biệt với WorkoutFilters: sử dụng tab navigation thay vì collapse sections
 */

import {
    Clear,
    Search
} from '@mui/icons-material';
import {
    Autocomplete,
    Box,
    Button,
    Chip,
    InputAdornment,
    Paper,
    Slider,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography
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
    const [activeTab, setActiveTab] = useState(0);
    const [isPending, startTransition] = useTransition();

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

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                border: '1px solid rgba(0,0,0,0.08)',
                mb: 3,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.02) 0%, rgba(25, 118, 210, 0.02) 100%)',
                transition: 'all 0.3s ease'
            }}
        >
            {/* Search Header */}
            <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <TextField
                    fullWidth
                    placeholder="🔍 Tìm kiếm bài tập theo tên..."
                    value={filters?.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    size="medium"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: 'primary.main', fontSize: 22 }} />
                            </InputAdornment>
                        ),
                        endAdornment: filters?.search && (
                            <InputAdornment position="end">
                                <Button
                                    size="small"
                                    onClick={() => handleFilterChange('search', '')}
                                    sx={{ minWidth: 'auto', p: 0.5 }}
                                >
                                    <Clear fontSize="small" />
                                </Button>
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            background: 'white',
                            height: 52,
                            '&:hover': {
                                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.12)',
                            },
                            '&.Mui-focused': {
                                boxShadow: '0 6px 25px rgba(25, 118, 210, 0.2)',
                            }
                        },
                    }}
                />

                {/* Results Counter & Clear */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                            fontSize: '1.1rem'
                        }}
                    >
                        {totalResults.toLocaleString()} bài tập được tìm thấy
                    </Typography>

                    {hasActiveFilters && (
                        <Button
                            startIcon={<Clear />}
                            onClick={clearAllFilters}
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Xóa tất cả bộ lọc
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Filter Tabs Navigation */}
            <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newTab) => setActiveTab(newTab)}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            minHeight: 60,
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            textTransform: 'none',
                            px: 2,
                            py: 1.5,
                            color: 'text.secondary',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.08) 0%, rgba(25, 118, 210, 0.08) 100%)',
                                color: 'primary.main',
                            },
                            '&.Mui-selected': {
                                background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.12) 0%, rgba(25, 118, 210, 0.12) 100%)',
                                color: 'primary.main',
                                fontWeight: 700,
                            },
                        },
                        '& .MuiTabs-indicator': {
                            height: 4,
                            background: 'linear-gradient(90deg, #ff9800 0%, #1976d2 100%)',
                            borderRadius: '2px 2px 0 0',
                        },
                    }}
                >
                    <Tab
                        icon={<span style={{ fontSize: '1.2rem', marginBottom: 4 }}>🏋️</span>}
                        label="Loại bài tập"
                    />
                    <Tab
                        icon={<span style={{ fontSize: '1.2rem', marginBottom: 4 }}>📊</span>}
                        label="Độ khó"
                    />
                    <Tab
                        icon={<span style={{ fontSize: '1.2rem', marginBottom: 4 }}>🎯</span>}
                        label="Nhóm cơ"
                    />
                    <Tab
                        icon={<span style={{ fontSize: '1.2rem', marginBottom: 4 }}>⚙️</span>}
                        label="Nâng cao"
                    />
                </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ p: 3 }}>
                {/* Category Tab */}
                {activeTab === 0 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                            Chọn loại bài tập
                        </Typography>
                        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                            <Chip
                                label="🏋️ Tất cả"
                                onClick={() => handleFilterChange('category', '')}
                                variant={!filters?.category ? 'filled' : 'outlined'}
                                color={!filters?.category ? 'primary' : 'default'}
                                sx={{
                                    borderRadius: 3,
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    height: 40,
                                    px: 2,
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    }
                                }}
                            />
                            {filterTabs.category.options.map((option) => (
                                <Chip
                                    key={option.value}
                                    label={`${option.icon} ${option.label}`}
                                    onClick={() => handleFilterChange('category', option.value)}
                                    variant={filters?.category === option.value ? 'filled' : 'outlined'}
                                    color={filters?.category === option.value ? 'primary' : 'default'}
                                    sx={{
                                        borderRadius: 3,
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        height: 40,
                                        px: 2,
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}

                {/* Difficulty Tab */}
                {activeTab === 1 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                            Chọn độ khó phù hợp
                        </Typography>
                        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                            <Chip
                                label="📊 Tất cả"
                                onClick={() => handleFilterChange('difficulty', '')}
                                variant={!filters?.difficulty ? 'filled' : 'outlined'}
                                color={!filters?.difficulty ? 'primary' : 'default'}
                                sx={{
                                    borderRadius: 3,
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    height: 40,
                                    px: 2,
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    }
                                }}
                            />
                            {filterTabs.difficulty.options.map((option) => (
                                <Chip
                                    key={option.value}
                                    label={option.label}
                                    onClick={() => handleFilterChange('difficulty', option.value)}
                                    variant={filters?.difficulty === option.value ? 'filled' : 'outlined'}
                                    sx={{
                                        borderRadius: 3,
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        height: 40,
                                        px: 2,
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        borderColor: option.color,
                                        color: filters?.difficulty === option.value ? 'white' : option.color,
                                        backgroundColor: filters?.difficulty === option.value ? option.color : 'transparent',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 4px 12px ${option.color}40`,
                                            backgroundColor: option.color,
                                            color: 'white',
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}

                {/* Muscle Groups Tab */}
                {activeTab === 2 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                            Chọn nhóm cơ mục tiêu
                        </Typography>
                        <Autocomplete
                            multiple
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
                                        {...getTagProps({ index })}
                                        key={option}
                                        sx={{ borderRadius: 2, fontWeight: 600 }}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Tìm kiếm và chọn nhóm cơ..."
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            minHeight: 56
                                        }
                                    }}
                                />
                            )}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                )}

                {/* Advanced Tab */}
                {activeTab === 3 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                            Bộ lọc nâng cao
                        </Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                            {/* Equipment Filter */}
                            <Box>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                    🏋️ Thiết bị
                                </Typography>
                                <Autocomplete
                                    options={filterTabs.equipment.options}
                                    value={Array.isArray(filters?.equipment)
                                        ? filters.equipment[0] || ''
                                        : filters?.equipment || ''
                                    }
                                    onChange={(_, value) => handleFilterChange('equipment', value ? [value] : [])}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Chọn thiết bị"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Box>

                            {/* Calories Range */}
                            <Box>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                    🔥 Calories (cal/phút): {filters?.caloriesRange?.min || 0} - {filters?.caloriesRange?.max || 50}
                                </Typography>
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
                                    marks={[
                                        { value: 0, label: '0' },
                                        { value: 25, label: '25' },
                                        { value: 50, label: '50+' }
                                    ]}
                                    sx={{
                                        '& .MuiSlider-thumb': {
                                            background: 'linear-gradient(135deg, #ff9800 0%, #1976d2 100%)',
                                            border: '3px solid white',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                        },
                                        '& .MuiSlider-track': {
                                            background: 'linear-gradient(90deg, #ff9800 0%, #1976d2 100%)',
                                            height: 6
                                        },
                                        '& .MuiSlider-rail': {
                                            height: 6
                                        }
                                    }}
                                />
                            </Box>

                            {/* Intensity Range */}
                            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                    ⚡ Cường độ: {filters?.intensityRange?.min || 1} - {filters?.intensityRange?.max || 10}
                                </Typography>
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
                                    marks={[
                                        { value: 1, label: 'Nhẹ' },
                                        { value: 5, label: 'Trung bình' },
                                        { value: 10, label: 'Cao' }
                                    ]}
                                    sx={{
                                        '& .MuiSlider-thumb': {
                                            background: 'linear-gradient(135deg, #ff9800 0%, #1976d2 100%)',
                                            border: '3px solid white',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                        },
                                        '& .MuiSlider-track': {
                                            background: 'linear-gradient(90deg, #ff9800 0%, #1976d2 100%)',
                                            height: 6
                                        },
                                        '& .MuiSlider-rail': {
                                            height: 6
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default ExerciseFilters;
