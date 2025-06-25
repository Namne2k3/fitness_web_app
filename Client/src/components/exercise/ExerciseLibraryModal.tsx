/**
 * 💪 ExerciseLibraryModal - Advanced Exercise Selection Modal
 * React 19 implementation với modern UI design và enhanced UX
 */

import React, { useState, useTransition } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Typography,
    Chip,
    Stack,
    Paper,
    Badge,
    Tooltip,
    CircularProgress,
    Alert,
    useTheme,
    alpha,
    Avatar
} from '@mui/material';
import {
    Close as CloseIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Add as AddIcon,
    Check as CheckIcon,
    Category as CategoryIcon,
    FitnessCenter as FitnessCenterIcon,
    Clear as ClearIcon,
    TuneRounded as TuneIcon,
    SportsMma as SportsIcon
} from '@mui/icons-material';
import { Exercise, WorkoutExercise } from '../../types';
import ExerciseCard from './ExerciseCard';
import { useExercises } from '../../hooks/useExercises';
import { ExerciseListParams } from '../../services/exerciseService';

// ✅ Interface definitions
interface ExerciseLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExercisesSelect: (exercises: WorkoutExercise[]) => void;
    selectedExerciseIds?: string[];
    maxSelection?: number;
}

interface FilterState {
    category: string;
    difficulty: string;
    muscleGroups: string[];
    equipment: string[];
}

// ✅ Filter options data
const filterOptions = {
    categories: [
        { value: '', label: 'Tất cả', icon: '🏋️' },
        { value: 'strength', label: 'Sức mạnh', icon: '💪' },
        { value: 'cardio', label: 'Tim mạch', icon: '❤️' },
        { value: 'flexibility', label: 'Linh hoạt', icon: '🧘' },
        { value: 'balance', label: 'Thăng bằng', icon: '⚖️' }
    ],
    difficulties: [
        { value: '', label: 'Tất cả', color: '#666' },
        { value: 'beginner', label: 'Người mới', color: '#4caf50' },
        { value: 'intermediate', label: 'Trung bình', color: '#ff9800' },
        { value: 'advanced', label: 'Nâng cao', color: '#f44336' }
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
        { value: 'bodyweight', label: 'Không TB', icon: '🤸' },
        { value: 'dumbbells', label: 'Tạ đơn', icon: '🏋️' },
        { value: 'barbell', label: 'Tạ đòn', icon: '🔗' },
        { value: 'resistance_bands', label: 'Dây kháng', icon: '🎗️' },
        { value: 'kettlebell', label: 'Kettlebell', icon: '⚫' },
        { value: 'machine', label: 'Máy tập', icon: '🤖' }
    ]
};

/**
 * ✅ Main ExerciseLibraryModal Component
 */
const ExerciseLibraryModal: React.FC<ExerciseLibraryModalProps> = ({
    isOpen,
    onClose,
    onExercisesSelect,
    selectedExerciseIds = [],
    maxSelection = 20
}) => {
    const theme = useTheme();
    const [isPending, startTransition] = useTransition();

    // ================================
    // 🎯 State Management
    // ================================
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        category: '',
        difficulty: '',
        muscleGroups: [],
        equipment: []
    });
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
    const [page, setPage] = useState(1);

    // ================================
    // 🔍 Exercise Data Fetching
    // ================================
    // Build exercise query parameters with proper typing
    const exerciseParams: ExerciseListParams = {
        page,
        limit: 12,
        filters: {
            search: searchQuery || undefined,
            category: (filters.category as 'strength' | 'cardio' | 'flexibility') || undefined,
            difficulty: (filters.difficulty as 'beginner' | 'intermediate' | 'advanced') || undefined,
            primaryMuscleGroups: filters.muscleGroups.length > 0 ? filters.muscleGroups : undefined,
            equipment: filters.equipment.length > 0 ? filters.equipment : undefined,
            isApproved: true
        },
        sort: { field: 'name', order: 'asc' }
    };

    const { data: exerciseData, isLoading, isError } = useExercises(exerciseParams);

    // ================================
    // 🎯 Event Handlers
    // ================================
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        startTransition(() => {
            setSearchQuery(event.target.value);
            setPage(1);
        });
    };

    const handleFilterChange = (key: keyof FilterState, value: string | string[]) => {
        startTransition(() => {
            setFilters(prev => ({ ...prev, [key]: value }));
            setPage(1);
        });
    };

    const handleExerciseToggle = (exercise: Exercise) => {
        setSelectedExercises(prev => {
            const isSelected = prev.some(ex => ex._id === exercise._id);

            if (isSelected) {
                return prev.filter(ex => ex._id !== exercise._id);
            } else {
                if (prev.length >= maxSelection) {
                    return prev; // Don't add if max reached
                }
                return [...prev, exercise];
            }
        });
    };

    const handleConfirmSelection = () => {
        const workoutExercises: WorkoutExercise[] = selectedExercises.map((exercise, index) => ({
            exerciseId: exercise._id,
            order: index + 1,
            sets: 3,
            reps: 12,
            restTime: 60
        }));

        onExercisesSelect(workoutExercises);
        onClose();

        // Reset modal state
        setSelectedExercises([]);
        setSearchQuery('');
        setFilters({
            category: '',
            difficulty: '',
            muscleGroups: [],
            equipment: []
        });
    };

    const handleClearFilters = () => {
        startTransition(() => {
            setFilters({
                category: '',
                difficulty: '',
                muscleGroups: [],
                equipment: []
            });
            setSearchQuery('');
            setPage(1);
        });
    };

    // ================================
    // 🎨 Helper Functions
    // ================================
    const isExerciseSelected = (exerciseId: string) => {
        return selectedExercises.some(ex => ex._id === exerciseId) ||
            selectedExerciseIds.includes(exerciseId);
    };

    const isMaxSelectionReached = selectedExercises.length >= maxSelection;

    // ================================
    // 🎨 Render Component
    // ================================
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    height: '90vh',
                    maxHeight: '900px',
                    borderRadius: 4,
                    overflow: 'hidden',
                    bgcolor: 'background.default'
                }
            }}
        >
            {/* Enhanced Header with Gradient */}
            <DialogTitle
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                        <FitnessCenterIcon sx={{ fontSize: 28, color: 'white' }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                            Thư viện Bài tập
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Chọn bài tập để thêm vào workout của bạn
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <Badge
                        badgeContent={selectedExercises.length}
                        color="error"
                        sx={{
                            '& .MuiBadge-badge': {
                                bgcolor: '#ff4444',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                minWidth: 20,
                                height: 20
                            }
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                px: 2,
                                py: 1,
                                bgcolor: 'rgba(255,255,255,0.15)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="body2" fontWeight="600">
                                {selectedExercises.length}/{maxSelection} Selected
                            </Typography>
                        </Paper>
                    </Badge>

                    <Tooltip title="Đóng">
                        <IconButton 
                            onClick={onClose} 
                            sx={{ 
                                color: 'white',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    transform: 'rotate(90deg)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </DialogTitle>
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />
                    </Badge>

                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box >
            </DialogTitle >

    {/* Content */ }
    < DialogContent sx = {{ p: 0 }}>
        {/* Search & Filters */ }
        < Box sx = {{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Stack spacing={2}>
                {/* Search Bar */}
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm bài tập..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                {/* Filter Toggle */}
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Button
                        startIcon={<FilterIcon />}
                        onClick={() => setShowFilters(!showFilters)}
                        variant={showFilters ? "contained" : "outlined"}
                        size="small"
                    >
                        Bộ lọc
                    </Button>

                    {(filters.category || filters.difficulty ||
                        filters.muscleGroups.length > 0 || filters.equipment.length > 0) && (
                            <Button
                                size="small"
                                onClick={handleClearFilters}
                                sx={{ color: theme.palette.text.secondary }}
                            >
                                Xóa bộ lọc
                            </Button>
                        )}
                </Box>

                {/* Filter Options */}
                {showFilters && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            borderRadius: 2
                        }}
                    >
                        <Stack spacing={2}>
                            {/* Category Filter */}
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Danh mục
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {filterOptions.categories.map((option) => (
                                        <Chip
                                            key={option.value}
                                            label={`${option.icon} ${option.label}`}
                                            variant={filters.category === option.value ? "filled" : "outlined"}
                                            onClick={() => handleFilterChange('category',
                                                filters.category === option.value ? '' : option.value
                                            )}
                                            size="small"
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            {/* Difficulty Filter */}
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Độ khó
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {filterOptions.difficulties.map((option) => (
                                        <Chip
                                            key={option.value}
                                            label={option.label}
                                            variant={filters.difficulty === option.value ? "filled" : "outlined"}
                                            onClick={() => handleFilterChange('difficulty',
                                                filters.difficulty === option.value ? '' : option.value
                                            )}
                                            size="small"
                                            sx={{
                                                color: filters.difficulty === option.value ? 'white' : option.color,
                                                bgcolor: filters.difficulty === option.value ? option.color : 'transparent',
                                                borderColor: option.color
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        </Stack>
                    </Paper>
                )}
            </Stack>
                </Box >

    {/* Exercise List */ }
    < Box sx = {{ p: 3, minHeight: 400 }}>
        { isLoading && (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
                <CircularProgress size={40} />
                <Typography variant="body1" sx={{ ml: 2 }}>
                    Đang tải bài tập...
                </Typography>
            </Box>
        )}

{
    isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
            Không thể tải danh sách bài tập. Vui lòng thử lại.
        </Alert>
    )
}

{
    exerciseData && exerciseData.data.length === 0 && (
        <Box textAlign="center" py={8}>
            <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
                Không tìm thấy bài tập
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </Typography>
        </Box>
    )
}

{
    exerciseData && exerciseData.data.length > 0 && (
        <Box display="grid"
            gridTemplateColumns={{
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
            }}
            gap={2}>
            {exerciseData.data.map((exercise) => {
                const isSelected = isExerciseSelected(exercise._id);
                const isDisabled = !isSelected && isMaxSelectionReached;

                return (
                    <Box
                        key={exercise._id}
                        position="relative"
                        sx={{
                            opacity: isDisabled ? 0.6 : 1,
                            transition: 'all 0.2s ease',
                            '& .MuiCard-root': {
                                border: isSelected ? `2px solid ${theme.palette.success.main}` : undefined,
                                transform: isSelected ? 'scale(0.98)' : undefined,
                            }
                        }}
                    >
                        <ExerciseCard
                            exercise={exercise}
                            variant="compact"
                            onExerciseClick={() => { }}
                            isSelected={isSelected}
                        />

                        {/* Overlay Selection Button */}
                        <Box
                            position="absolute"
                            top={8}
                            right={8}
                            zIndex={2}
                        >
                            <Tooltip
                                title={
                                    isDisabled
                                        ? `Tối đa ${maxSelection} bài tập`
                                        : isSelected
                                            ? 'Bỏ chọn'
                                            : 'Chọn bài tập'
                                }
                            >
                                <span>
                                    <IconButton
                                        onClick={() => handleExerciseToggle(exercise)}
                                        disabled={isDisabled}
                                        size="small"
                                        sx={{
                                            bgcolor: isSelected ? 'success.main' : 'primary.main',
                                            color: 'white',
                                            boxShadow: 2,
                                            '&:hover': {
                                                bgcolor: isSelected ? 'success.dark' : 'primary.dark'
                                            },
                                            '&:disabled': {
                                                bgcolor: 'grey.300',
                                                color: 'grey.500'
                                            }
                                        }}
                                    >
                                        {isSelected ? <CheckIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    )
}

{/* Load More Button */ }
{
    exerciseData && exerciseData.pagination &&
    exerciseData.pagination.hasNextPage && (
        <Box display="flex" justifyContent="center" mt={3}>
            <Button
                variant="outlined"
                onClick={() => setPage(prev => prev + 1)}
                disabled={isPending}
                startIcon={isPending ? <CircularProgress size={16} /> : undefined}
            >
                {isPending ? 'Đang tải...' : 'Tải thêm'}
            </Button>
        </Box>
    )
}
                </Box >
            </DialogContent >

    {/* Actions */ }
    < DialogActions
sx = {{
    p: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
            background: alpha(theme.palette.primary.main, 0.02)
}}
            >
                <Button onClick={onClose} size="large">
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirmSelection}
                    disabled={selectedExercises.length === 0}
                    size="large"
                    startIcon={<CheckIcon />}
                    sx={{
                        minWidth: 160,
                        background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1565c0 30%, #f57c00 90%)'
                        }
                    }}
                >
                    Thêm {selectedExercises.length} bài tập
                </Button>
            </DialogActions >
        </Dialog >
    );
};

export default ExerciseLibraryModal;
