/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 💪 Exercise Page - Clean & Compact Design
 * React Query implementation với streamlined header và simplified filters
 */

import {
    Add,
    Clear,
    FitnessCenter,
    Search,
    Sort,
    Star,
    TrendingUp,
    ViewList,
    ViewModule
} from '@mui/icons-material';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Fab,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { useActionState, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExerciseListParams } from '../../services/exerciseService';
import { Exercise } from '../../types';
import ExerciseList from './components/ExerciseList';
import ExercisePagination from './components/ExercisePagination';

interface ExercisePageState {
    success: boolean;
    error: string | null;
    data: unknown;
}

/**
 * ✅ React 19: Main Exercise Page Component với clean design
 */
const ExercisePage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    // ================================
    // 🎯 State Management
    // ================================
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    // ✅ React 19: useActionState cho complex state management
    const [state, updateFiltersAction] = useActionState(
        async (prevState: ExercisePageState, formData: FormData) => {
            try {
                const filtersData = formData.get('filters');
                const filters = filtersData ? JSON.parse(filtersData as string) : {};

                return {
                    success: true,
                    error: null,
                    data: { filters, timestamp: Date.now() }
                };
            } catch (error) {
                return {
                    success: false,
                    error: 'Failed to update filters',
                    data: null
                };
            }
        },
        { success: true, error: null, data: { filters: {}, timestamp: Date.now() } }
    );

    // ================================
    // 🔧 Filter & Sort Management
    // ================================
    const [filters, setFilters] = useState<ExerciseListParams['filters']>({
        isApproved: true
    });

    const [sort, setSort] = useState<{ field: string; order: 'asc' | 'desc' }>({
        field: 'name',
        order: 'asc'
    });

    // Filter options
    const categories = [
        { value: 'strength', label: 'Sức mạnh' },
        { value: 'cardio', label: 'Tim mạch' },
        { value: 'flexibility', label: 'Linh hoạt' }
    ];

    const difficulties = [
        { value: 'beginner', label: 'Người mới' },
        { value: 'intermediate', label: 'Trung bình' },
        { value: 'advanced', label: 'Nâng cao' }
    ];

    const muscleGroups = [
        'Ngực', 'Lưng', 'Vai', 'Tay trước', 'Tay sau', 'Cẳng tay',
        'Bụng', 'Hông', 'Đùi trước', 'Đùi sau', 'Mông', 'Chân'
    ];

    const equipment = [
        'Tay không', 'Tạ đơn', 'Tạ đòn', 'Máy tập', 'Dây kháng lực',
        'Kettlebell', 'Cáp', 'Xà đơn', 'Bóng y tế'
    ];

    // Build params cho API call
    const exerciseParams: ExerciseListParams = {
        page,
        limit,
        filters: {
            ...filters,
            search: searchQuery.trim() || undefined
        },
        sort,
        options: {
            includeUserData: false,
            includeVariations: false
        }
    };

    // ================================
    // 🎯 Event Handlers
    // ================================
    const handleFiltersChange = (field: string, value: unknown) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        setPage(1);

        const formData = new FormData();
        formData.append('filters', JSON.stringify(newFilters));
        updateFiltersAction(formData);
    };

    const handleClearFilters = () => {
        setFilters({ isApproved: true });
        setSearchQuery('');
        setPage(1);
    };

    const handleSortChange = (field: string) => {
        const newOrder = sort.field === field && sort.order === 'asc' ? 'desc' : 'asc';
        setSort({ field, order: newOrder });
        setPage(1);
    };

    const handleExerciseClick = (exercise: Exercise) => {
        navigate(`/exercises/${exercise._id}`);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newViewMode: 'grid' | 'list') => {
        if (newViewMode !== null) {
            setViewMode(newViewMode);
        }
    };

    // Count active filters
    const activeFiltersCount = Object.values(filters).filter(value =>
        value !== undefined && value !== null && value !== '' &&
        (Array.isArray(value) ? value.length > 0 : true)
    ).length + (searchQuery ? 1 : 0) - 1; // -1 để loại bỏ isApproved default

    // ================================
    // 🎨 Render Main Component
    // ================================
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                pt: { xs: 10, md: 12 },
                pb: '10rem'
            }}
        >
            <Container maxWidth="xl">
                {/* ================================ */}
                {/* 🎯 COMPACT HEADER */}
                {/* ================================ */}
                <Box
                    sx={{
                        mb: 3,
                        textAlign: 'center',
                        color: 'white',
                        py: { xs: 2, md: 3 }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                        <FitnessCenter sx={{ fontSize: { xs: 32, md: 40 } }} />
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: '1.8rem', md: '2.5rem' }
                            }}
                        >
                            Thư viện Bài tập
                        </Typography>
                    </Box>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            opacity: 0.9,
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            maxWidth: 500,
                            mx: 'auto'
                        }}
                    >
                        Khám phá hàng nghìn bài tập chuyên nghiệp
                    </Typography>
                </Box>

                {/* ================================ */}
                {/* 🔍 STREAMLINED SEARCH & FILTERS */}
                {/* ================================ */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 3,
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        {/* Search Bar */}
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm bài tập..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search color="action" />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: 2,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(0,0,0,0.12)'
                                        }
                                    }
                                }}
                            />
                        </Box>

                        {/* Inline Filters */}
                        <Grid container spacing={2} alignItems="center">
                            {/* Category */}
                            <Grid item xs={12} sm={6} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Loại</InputLabel>
                                    <Select
                                        value={filters?.category || ''}
                                        label="Loại"
                                        onChange={(e) => handleFiltersChange('category', e.target.value)}
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        {categories.map(cat => (
                                            <MenuItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Difficulty */}
                            <Grid item xs={12} sm={6} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Độ khó</InputLabel>
                                    <Select
                                        value={filters?.difficulty || ''}
                                        label="Độ khó"
                                        onChange={(e) => handleFiltersChange('difficulty', e.target.value)}
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        {difficulties.map(diff => (
                                            <MenuItem key={diff.value} value={diff.value}>
                                                {diff.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Muscle Groups */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Autocomplete
                                    multiple
                                    size="small"
                                    options={muscleGroups}
                                    value={Array.isArray(filters?.primaryMuscleGroups) ? filters.primaryMuscleGroups : []}
                                    onChange={(_, value) => handleFiltersChange('primaryMuscleGroups', value)}
                                    renderTags={(value, getTagProps) =>
                                        value.slice(0, 2).map((option, index) => (
                                            <Chip
                                                variant="outlined"
                                                label={option}
                                                size="small"
                                                {...getTagProps({ index })}
                                                key={option}
                                            />
                                        )).concat(
                                            value.length > 2 ? [
                                                <Chip key="more" size="small" label={`+${value.length - 2}`} />
                                            ] : []
                                        )
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Nhóm cơ"
                                            placeholder="Chọn nhóm cơ"
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Equipment */}
                            <Grid item xs={12} sm={6} md={2}>
                                <Autocomplete
                                    size="small"
                                    options={equipment}
                                    value={Array.isArray(filters?.equipment) ? filters.equipment[0] || '' : filters?.equipment || ''}
                                    onChange={(_, value) => handleFiltersChange('equipment', value ? [value] : [])}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Thiết bị"
                                            placeholder="Chọn thiết bị"
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Actions */}
                            <Grid item xs={12} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                    {/* Quick Filters */}
                                    <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', lg: 'flex' } }}>
                                        <Chip
                                            icon={<TrendingUp />}
                                            label="Xu hướng"
                                            variant="outlined"
                                            clickable
                                            size="small"
                                            onClick={() => handleSortChange('views')}
                                            sx={{ fontSize: '0.75rem' }}
                                        />
                                        <Chip
                                            icon={<Star />}
                                            label="Phổ biến"
                                            variant="outlined"
                                            clickable
                                            size="small"
                                            onClick={() => handleSortChange('averageRating')}
                                            sx={{ fontSize: '0.75rem' }}
                                        />
                                    </Stack>

                                    {/* Clear Filters */}
                                    {activeFiltersCount > 0 && (
                                        <Button
                                            size="small"
                                            startIcon={<Clear />}
                                            onClick={handleClearFilters}
                                            sx={{ whiteSpace: 'nowrap' }}
                                        >
                                            Xóa ({activeFiltersCount})
                                        </Button>
                                    )}

                                    {/* Sort */}
                                    <FormControl size="small" sx={{ minWidth: 100 }}>
                                        <InputLabel>Sắp xếp</InputLabel>
                                        <Select
                                            value={sort.field}
                                            label="Sắp xếp"
                                            onChange={(e) => handleSortChange(e.target.value)}
                                            startAdornment={<Sort sx={{ mr: 0.5, fontSize: 16 }} />}
                                        >
                                            <MenuItem value="name">Tên</MenuItem>
                                            <MenuItem value="difficulty">Độ khó</MenuItem>
                                            <MenuItem value="category">Loại</MenuItem>
                                            <MenuItem value="caloriesPerMinute">Calories</MenuItem>
                                            <MenuItem value="averageIntensity">Cường độ</MenuItem>
                                            <MenuItem value="createdAt">Mới nhất</MenuItem>
                                        </Select>
                                    </FormControl>

                                    {/* View Mode */}
                                    <ToggleButtonGroup
                                        value={viewMode}
                                        exclusive
                                        onChange={handleViewModeChange}
                                        size="small"
                                        sx={{
                                            '& .MuiToggleButton-root': {
                                                border: '1px solid rgba(0,0,0,0.12)',
                                                '&.Mui-selected': {
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    '&:hover': {
                                                        bgcolor: 'primary.dark'
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        <ToggleButton value="grid" aria-label="grid view">
                                            <ViewModule fontSize="small" />
                                        </ToggleButton>
                                        <ToggleButton value="list" aria-label="list view">
                                            <ViewList fontSize="small" />
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Active Filters Display */}
                        {activeFiltersCount > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                                        Bộ lọc đang áp dụng:
                                    </Typography>
                                    {searchQuery && (
                                        <Chip
                                            label={`Tìm kiếm: "${searchQuery}"`}
                                            size="small"
                                            onDelete={() => setSearchQuery('')}
                                            deleteIcon={<Clear fontSize="small" />}
                                        />
                                    )}
                                    {filters?.category && (
                                        <Chip
                                            label={`Loại: ${categories.find(c => c.value === filters.category)?.label}`}
                                            size="small"
                                            onDelete={() => handleFiltersChange('category', '')}
                                            deleteIcon={<Clear fontSize="small" />}
                                        />
                                    )}
                                    {filters?.difficulty && (
                                        <Chip
                                            label={`Độ khó: ${difficulties.find(d => d.value === filters.difficulty)?.label}`}
                                            size="small"
                                            onDelete={() => handleFiltersChange('difficulty', '')}
                                            deleteIcon={<Clear fontSize="small" />}
                                        />
                                    )}
                                    {Array.isArray(filters?.primaryMuscleGroups) && filters.primaryMuscleGroups.length > 0 && (
                                        <Chip
                                            label={`Nhóm cơ: ${filters.primaryMuscleGroups.slice(0, 2).join(', ')}${filters.primaryMuscleGroups.length > 2 ? '...' : ''}`}
                                            size="small"
                                            onDelete={() => handleFiltersChange('primaryMuscleGroups', [])}
                                            deleteIcon={<Clear fontSize="small" />}
                                        />
                                    )}
                                    {Array.isArray(filters?.equipment) && filters.equipment.length > 0 && (
                                        <Chip
                                            label={`Thiết bị: ${filters.equipment[0]}`}
                                            size="small"
                                            onDelete={() => handleFiltersChange('equipment', [])}
                                            deleteIcon={<Clear fontSize="small" />}
                                        />
                                    )}
                                </Stack>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* ================================ */}
                {/* ⚠️ Error Handling */}
                {/* ================================ */}
                {state.error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {state.error}
                    </Alert>
                )}

                {/* ================================ */}
                {/* 📋 Exercise List */}
                {/* ================================ */}
                <Card
                    elevation={0}
                    sx={{
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.2)',
                        p: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                >
                    {/* ✅ React Query: No Suspense needed */}
                    <ExerciseList
                        params={exerciseParams}
                        onExerciseClick={handleExerciseClick}
                        viewMode={viewMode}
                    />

                    {/* Pagination */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 4
                    }}>
                        <ExercisePagination
                            params={exerciseParams}
                            currentPage={page}
                            onPageChange={handlePageChange}
                        />
                    </Box>
                </Card>

                {/* ================================ */}
                {/* 🎯 Floating Action Button */}
                {/* ================================ */}
                <Fab
                    color="primary"
                    aria-label="add exercise"
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        width: 56,
                        height: 56,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6b63a8 100%)',
                            transform: 'scale(1.05)',
                            boxShadow: '0 6px 25px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                    onClick={() => navigate('/exercises/create')}
                >
                    <Add />
                </Fab>
            </Container>
        </Box>
    );
};

export default ExercisePage;
