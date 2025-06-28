/**
 * 💪 ExerciseLibraryModal - Enhanced Modern UI/UX
 * React 19 implementation with improved design & user experience
 */

import React, { useState, useTransition } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Box,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Typography,
    Stack,
    Paper,
    Badge,
    Tooltip,
    CircularProgress,
    Alert,
    useTheme,
    Avatar
} from '@mui/material';
import {
    Close as CloseIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Check as CheckIcon,
    FitnessCenter as FitnessCenterIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { Exercise, WorkoutExercise } from '../../types';
import ExerciseCard from '../../pages/exercise/components/ExerciseCard';
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

    // State Management
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
    const [page, setPage] = useState(1);

    // Filters for future implementation
    const filters = {
        category: '',
        difficulty: '',
        muscleGroups: [],
        equipment: []
    };

    // Exercise Data Fetching
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

    // Event Handlers
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setPage(1); // Reset page when searching
    };

    const handleExerciseSelect = (exercise: Exercise) => {
        setSelectedExercises(prev => {
            const isSelected = prev.some(e => e._id === exercise._id);

            if (isSelected) {
                return prev.filter(e => e._id !== exercise._id);
            } else if (prev.length < maxSelection) {
                return [...prev, exercise];
            }

            return prev;
        });
    };

    const handleAddToWorkout = () => {
        startTransition(() => {
            const workoutExercises: WorkoutExercise[] = selectedExercises.map(exercise => ({
                exerciseId: exercise._id,
                exercise: exercise._id,
                name: exercise.name,
                sets: 3,
                reps: 12,
                weight: 0,
                duration: exercise.averageIntensity ? exercise.averageIntensity * 30 : 60,
                restTime: 60,
                notes: '',
                order: 0
            }));

            onExercisesSelect(workoutExercises);
            onClose();
        });
    };

    const handleClearSelection = () => {
        setSelectedExercises([]);
    };

    const isExerciseSelected = (exerciseId: string): boolean => {
        return selectedExercises.some(e => e._id === exerciseId) ||
            selectedExerciseIds.includes(exerciseId);
    };

    const isMaxSelectionReached = selectedExercises.length >= maxSelection;

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
            {/* Enhanced Header */}
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
                        <FitnessCenterIcon sx={{ fontSize: 28 }} />
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
                                fontWeight: 'bold'
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

            {/* Content */}
            <DialogContent sx={{ p: 0, bgcolor: 'background.default' }}>
                {/* Enhanced Search Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)'
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Tìm kiếm bài tập... (ví dụ: Push-up, Squat, Deadlift)"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setSearchQuery('')}
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: 3,
                                bgcolor: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                '& fieldset': {
                                    border: '1px solid rgba(0,0,0,0.08)',
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                    borderWidth: 2,
                                }
                            }
                        }}
                    />
                </Paper>

                {/* Exercise Grid */}
                <Box sx={{ p: 3, minHeight: 400 }}>
                    {isLoading && (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    )}

                    {isError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            Có lỗi xảy ra khi tải danh sách bài tập. Vui lòng thử lại.
                        </Alert>
                    )}

                    {exerciseData?.data && exerciseData.data.length > 0 ? (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)'
                                },
                                gap: 3
                            }}
                        >
                            {exerciseData.data.map((exercise: Exercise) => (
                                <Box
                                    key={exercise._id}
                                    sx={{
                                        position: 'relative',
                                        border: isExerciseSelected(exercise._id) ?
                                            `2px solid ${theme.palette.primary.main}` :
                                            '2px solid transparent',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        width: '100%'
                                    }}
                                >
                                    <ExerciseCard
                                        exercise={exercise}
                                        onClick={() => { }} // Empty since we use onDirectAdd
                                        onDirectAdd={() => handleExerciseSelect(exercise)}
                                        actionMode="direct"
                                        variant="compact"
                                        isSelected={isExerciseSelected(exercise._id)}
                                        isDisabled={!isExerciseSelected(exercise._id) && isMaxSelectionReached}
                                    />

                                    {/* Selection Indicator */}
                                    {isExerciseSelected(exercise._id) && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor: theme.palette.primary.main,
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: 32,
                                                height: 32,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                                zIndex: 10
                                            }}
                                        >
                                            <CheckIcon sx={{ fontSize: 20 }} />
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    ) : !isLoading && (
                        <Box textAlign="center" py={4}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Không tìm thấy bài tập nào
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                            </Typography>
                        </Box>
                    )}
                </Box>
            </DialogContent>

            {/* Actions */}
            <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={2} width="100%" justifyContent="space-between">
                    <Box>
                        {selectedExercises.length > 0 && (
                            <Button
                                onClick={handleClearSelection}
                                startIcon={<ClearIcon />}
                                sx={{ mr: 2 }}
                            >
                                Xóa tất cả ({selectedExercises.length})
                            </Button>
                        )}
                    </Box>

                    <Stack direction="row" spacing={2}>
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            sx={{ minWidth: 100 }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleAddToWorkout}
                            variant="contained"
                            disabled={selectedExercises.length === 0 || isPending}
                            startIcon={isPending ? <CircularProgress size={20} /> : <AddIcon />}
                            sx={{ minWidth: 120 }}
                        >
                            {isPending ? 'Đang thêm...' : `Thêm vào Workout (${selectedExercises.length})`}
                        </Button>
                    </Stack>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

export default ExerciseLibraryModal;
