/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
    Divider,
    Button
} from '@mui/material';
import {
    Clear,
    Search,
    ExpandMore
} from '@mui/icons-material';
import { useDebounce } from '../../../hooks/useDebounce';

interface ExerciseFiltersProps {
    filters: Record<string, any>;
    onFiltersChange: (filters: Record<string, any>) => void;
    totalResults: number;
}

// Quick filter data for fast access
const quickFilters = {
    category: [
        { value: 'strength', label: 'Sức mạnh', icon: '💪' },
        { value: 'cardio', label: 'Tim mạch', icon: '❤️' },
        { value: 'flexibility', label: 'Linh hoạt', icon: '🧘' }
    ],
    difficulty: [
        { value: 'beginner', label: 'Người mới', icon: '🟢', color: '#4caf50' },
        { value: 'intermediate', label: 'Trung bình', icon: '🟡', color: '#ff9800' },
        { value: 'advanced', label: 'Nâng cao', icon: '🔴', color: '#f44336' }
    ],
    muscle: [
        { value: 'chest', label: 'Ngực', icon: '💪' },
        { value: 'back', label: 'Lưng', icon: '🦵' },
        { value: 'legs', label: 'Chân', icon: '🦵' },
        { value: 'shoulders', label: 'Vai', icon: '💪' },
        { value: 'arms', label: 'Tay', icon: '💪' },
        { value: 'core', label: 'Cơ lõi', icon: '🎯' }
    ]
};

const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
    filters,
    onFiltersChange,
    totalResults
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [_, startTransition] = useTransition();

    // ✅ Local search state cho immediate UI feedback
    const [localSearchValue, setLocalSearchValue] = useState(filters?.search || '');

    // ✅ Debounced search value để gọi API
    const debouncedSearchValue = useDebounce(localSearchValue, 400);

    // ✅ Sync debounced search với parent component
    useEffect(() => {
        if (debouncedSearchValue !== filters?.search) {
            startTransition(() => {
                onFiltersChange({ ...filters, search: debouncedSearchValue });
            });
        }
    }, [debouncedSearchValue]); // Only depend on debouncedSearchValue

    // ✅ Sync khi filters thay đổi từ bên ngoài
    useEffect(() => {
        if (filters?.search !== undefined && filters?.search !== localSearchValue) {
            setLocalSearchValue(filters?.search || '');
        }
    }, [filters?.search]); // Only depend on filters?.search

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
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
                mb: 3
            }}
        >
            {/* Header với Search */}
            <Box sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    {/* Search Input */}
                    <TextField
                        placeholder="Tìm kiếm bài tập..."
                        size="small"
                        value={localSearchValue}
                        onChange={(e) => setLocalSearchValue(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: localSearchValue && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setLocalSearchValue('')}
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: 'white',
                            }
                        }}
                    />

                    {/* Results Count */}
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 'fit-content' }}>
                        {totalResults} kết quả
                    </Typography>

                    {/* Clear All Button */}
                    {hasActiveFilters && (
                        <Button
                            size="small"
                            startIcon={<Clear />}
                            onClick={clearAllFilters}
                            sx={{ minWidth: 'fit-content' }}
                        >
                            Xóa bộ lọc ({activeFiltersCount})
                        </Button>
                    )}

                    {/* Toggle Advanced */}
                    <IconButton
                        size="small"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        sx={{
                            transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                        }}
                    >
                        <ExpandMore />
                    </IconButton>
                </Stack>
            </Box>

            {/* Quick Filters - Always Visible */}
            <Box sx={{ px: 2, pb: showAdvanced ? 1 : 2 }}>
                <Stack spacing={2}>
                    {/* Category Quick Filters */}
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            🏋️ Loại bài tập
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {quickFilters.category.map((option) => (
                                <Chip
                                    key={option.value}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <span>{option.icon}</span>
                                            <span>{option.label}</span>
                                        </Box>
                                    }
                                    onClick={() => handleFilterChange('category', option.value)}
                                    variant={filters?.category === option.value ? 'filled' : 'outlined'}
                                    size="small"
                                    sx={{
                                        borderRadius: 1.5,
                                        '&.MuiChip-filled': {
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Difficulty Quick Filters */}
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            📊 Độ khó
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {quickFilters.difficulty.map((option) => (
                                <Chip
                                    key={option.value}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <span>{option.icon}</span>
                                            <span>{option.label}</span>
                                        </Box>
                                    }
                                    onClick={() => handleFilterChange('difficulty', option.value)}
                                    variant={filters?.difficulty === option.value ? 'filled' : 'outlined'}
                                    size="small"
                                    sx={{
                                        borderRadius: 1.5,
                                        '&.MuiChip-filled': {
                                            bgcolor: option.color,
                                            color: 'white',
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </Box>

            {/* Advanced Filters */}
            <Collapse in={showAdvanced}>
                <Divider />
                <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Stack spacing={2}>
                        {/* Muscle Groups */}
                        <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                                🎯 Nhóm cơ
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {quickFilters.muscle.map((option) => (
                                    <Chip
                                        key={option.value}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <span>{option.icon}</span>
                                                <span>{option.label}</span>
                                            </Box>
                                        }
                                        onClick={() => {
                                            const currentMuscles = filters?.muscle || [];
                                            const newMuscles = currentMuscles.includes(option.value)
                                                ? currentMuscles.filter((m: string) => m !== option.value)
                                                : [...currentMuscles, option.value];
                                            handleFilterChange('muscle', newMuscles);
                                        }}
                                        variant={filters?.muscle?.includes(option.value) ? 'filled' : 'outlined'}
                                        size="small"
                                        sx={{
                                            borderRadius: 1.5,
                                            '&.MuiChip-filled': {
                                                bgcolor: 'success.main',
                                                color: 'white',
                                            }
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>

                        {/* Equipment Filter */}
                        <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                                🏋️ Thiết bị
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {['none', 'dumbbells', 'barbell', 'machine', 'bodyweight'].map((equipment) => (
                                    <Chip
                                        key={equipment}
                                        label={equipment === 'none' ? 'Không cần' :
                                            equipment === 'dumbbells' ? 'Tạ đơn' :
                                                equipment === 'barbell' ? 'Tạ đòn' :
                                                    equipment === 'machine' ? 'Máy tập' : 'Trọng lượng cơ thể'}
                                        onClick={() => {
                                            const currentEquipment = filters?.equipment || [];
                                            const newEquipment = currentEquipment.includes(equipment)
                                                ? currentEquipment.filter((e: string) => e !== equipment)
                                                : [...currentEquipment, equipment];
                                            handleFilterChange('equipment', newEquipment);
                                        }}
                                        variant={filters?.equipment?.includes(equipment) ? 'filled' : 'outlined'}
                                        size="small"
                                        sx={{
                                            borderRadius: 1.5,
                                            '&.MuiChip-filled': {
                                                bgcolor: 'info.main',
                                                color: 'white',
                                            }
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default ExerciseFilters;
