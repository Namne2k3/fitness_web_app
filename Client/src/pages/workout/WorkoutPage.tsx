/**
 * 🏋️ Workout Browse Page - Khám phá Workouts
 * React 19 implementation với Material UI design system
 */

import {
    BookmarkBorder,
    BookmarkBorderOutlined,
    FavoriteBorder,
    FavoriteOutlined,
    FilterList,
    LocalFireDepartment,
    Schedule,
    Search,
    Star,
    Visibility
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Container,
    Fade,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Skeleton,
    TextField,
    Typography
} from '@mui/material';
import React, { Suspense, useMemo, useState, useTransition } from 'react';

import { Workout } from '../../types/workout.interface';
import { mockWorkouts } from '../../utils/mockWorkouts';

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

interface WorkoutCardProps {
    workout: Workout;
    onLike: (workoutId: string) => void;
    onSave: (workoutId: string) => void;
    onView: (workoutId: string) => void;
}

// ================================
// 🧩 Workout Card Component
// ================================
const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onLike, onSave, onView }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleLike = () => {
        setIsLiked(!isLiked);
        startTransition(() => {
            onLike(workout._id);
        });
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        startTransition(() => {
            onSave(workout._id);
        });
    };

    const handleView = () => {
        startTransition(() => {
            onView(workout._id);
        });
    };

    // Difficulty color mapping
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'success';
            case 'intermediate': return 'warning';
            case 'advanced': return 'error';
            default: return 'primary';
        }
    };

    // Category icon mapping
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'strength': return '💪';
            case 'cardio': return '🏃';
            case 'flexibility': return '🧘';
            default: return '🏋️';
        }
    }; return (
        <Card
            sx={{
                height: '100%', // Sử dụng 100% thay vì fixed height
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(0,0,0,0.08)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    borderColor: 'primary.light',
                },
            }}
        >
            {/* Sponsored Badge */}
            {workout.isSponsored && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 1,
                        background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                >
                    Sponsored ⭐
                </Box>
            )}

            {/* Card Media/Image */}
            <CardMedia
                sx={{
                    height: 200,
                    background: `linear-gradient(135deg, 
                        rgba(102, 126, 234, 0.8) 0%, 
                        rgba(118, 75, 162, 0.8) 100%
                    )`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '3rem',
                    position: 'relative',
                }}
            >
                {getCategoryIcon(workout.category || 'strength')}

                {/* Quick Stats Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        right: 12,
                        display: 'flex',
                        gap: 1,
                        flexWrap: 'wrap',
                    }}
                >
                    <Chip
                        icon={<Schedule sx={{ fontSize: 16 }} />}
                        label={`${workout.estimatedDuration} phút`}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            color: 'text.primary',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                        }}
                    />
                    <Chip
                        icon={<LocalFireDepartment sx={{ fontSize: 16 }} />}
                        label={`${workout.caloriesBurned} cal`}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            color: 'text.primary',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                        }}
                    />
                </Box>
            </CardMedia>            {/* Card Content */}
            <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Chip
                            label={workout.difficulty}
                            color={getDifficultyColor(workout.difficulty)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                {workout.averageRating?.toFixed(1)} ({workout.totalRatings})
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="h6" component="h3" fontWeight={700} gutterBottom>
                        {workout.name}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2, // Giới hạn 2 dòng
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.5em', // Đảm bảo chiều cao tối thiểu
                        }}
                    >
                        {workout.description}
                    </Typography>
                </Box>

                {/* Muscle Groups */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                        NHÓM CƠ:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', minHeight: '32px', alignItems: 'flex-start' }}>
                        {workout.muscleGroups?.slice(0, 2).map((muscle, index) => (
                            <Chip
                                key={index}
                                label={muscle}
                                variant="outlined"
                                size="small"
                                sx={{
                                    fontSize: '0.7rem',
                                    height: 24,
                                    borderColor: 'primary.light',
                                    color: 'primary.main',
                                }}
                            />
                        ))}
                        {(workout.muscleGroups?.length || 0) > 2 && (
                            <Chip
                                label={`+${(workout.muscleGroups?.length || 0) - 2}`}
                                variant="outlined"
                                size="small"
                                sx={{
                                    fontSize: '0.7rem',
                                    height: 24,
                                    borderColor: 'text.secondary',
                                    color: 'text.secondary',
                                }}
                            />
                        )}
                    </Box>
                </Box>

                {/* Social Stats */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FavoriteBorder sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {workout.likeCount}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BookmarkBorderOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {workout.saveCount}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {workout.views}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>

            {/* Card Actions */}
            <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        onClick={handleLike}
                        disabled={isPending}
                        sx={{
                            color: isLiked ? 'error.main' : 'text.secondary',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: isLiked ? 'error.light' : 'action.hover',
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        {isLiked ? <FavoriteOutlined /> : <FavoriteBorder />}
                    </IconButton>

                    <IconButton
                        onClick={handleSave}
                        disabled={isPending}
                        sx={{
                            color: isSaved ? 'primary.main' : 'text.secondary',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: isSaved ? 'primary.light' : 'action.hover',
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        {isSaved ? <BookmarkBorderOutlined /> : <BookmarkBorder />}
                    </IconButton>
                </Box>

                <Button
                    variant="contained"
                    onClick={handleView}
                    disabled={isPending}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                            transform: 'translateY(-1px)',
                        },
                    }}
                >
                    Xem chi tiết
                </Button>
            </CardActions>
        </Card>
    );
};

// ================================
// 📝 Filter Component
// ================================
const WorkoutFilters: React.FC<{
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
}> = ({ filters, onFiltersChange }) => {
    const handleFilterChange = (key: keyof FilterState, value: string) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FilterList sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={700} color="primary.main">
                    Lọc Workouts
                </Typography>
            </Box>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                    md: '2fr 1fr 1fr',
                    lg: '2fr 1fr 1fr 1fr 1fr'
                },
                gap: 2
            }}>
                {/* Search */}
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm workout..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                        },
                    }}
                />

                {/* Category */}
                <FormControl fullWidth>
                    <InputLabel>Danh mục</InputLabel>
                    <Select
                        value={filters.category}
                        label="Danh mục"
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        sx={{ borderRadius: 2 }}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="strength">💪 Strength</MenuItem>
                        <MenuItem value="cardio">🏃 Cardio</MenuItem>
                        <MenuItem value="flexibility">🧘 Flexibility</MenuItem>
                    </Select>
                </FormControl>

                {/* Difficulty */}
                <FormControl fullWidth>
                    <InputLabel>Độ khó</InputLabel>
                    <Select
                        value={filters.difficulty}
                        label="Độ khó"
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        sx={{ borderRadius: 2 }}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="beginner">🟢 Beginner</MenuItem>
                        <MenuItem value="intermediate">🟡 Intermediate</MenuItem>
                        <MenuItem value="advanced">🔴 Advanced</MenuItem>
                    </Select>
                </FormControl>

                {/* Duration */}
                <FormControl fullWidth>
                    <InputLabel>Thời gian</InputLabel>
                    <Select
                        value={filters.maxDuration}
                        label="Thời gian"
                        onChange={(e) => handleFilterChange('maxDuration', e.target.value)}
                        sx={{ borderRadius: 2 }}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="15">⚡ Dưới 15 phút</MenuItem>
                        <MenuItem value="30">🕐 Dưới 30 phút</MenuItem>
                        <MenuItem value="60">🕑 Dưới 60 phút</MenuItem>
                        <MenuItem value="90">🕒 Dưới 90 phút</MenuItem>
                    </Select>
                </FormControl>

                {/* Equipment */}
                <FormControl fullWidth>
                    <InputLabel>Thiết bị</InputLabel>
                    <Select
                        value={filters.equipment}
                        label="Thiết bị"
                        onChange={(e) => handleFilterChange('equipment', e.target.value)}
                        sx={{ borderRadius: 2 }}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="bodyweight">🤸 Không thiết bị</MenuItem>
                        <MenuItem value="barbell">🏋️ Tạ đòn</MenuItem>
                        <MenuItem value="dumbbell">🔩 Tạ đơn</MenuItem>
                        <MenuItem value="kettlebell">⚡ Kettlebell</MenuItem>
                        <MenuItem value="machine">🤖 Máy tập</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </Paper>
    );
};

// ================================
// 🏠 Main WorkoutPage Component
// ================================
const WorkoutPage: React.FC = () => {
    // State management
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        category: '',
        difficulty: '',
        maxDuration: '',
        equipment: '',
    });

    // Filter workouts based on current filters
    const filteredWorkouts = useMemo(() => {
        let result = [...mockWorkouts];

        if (filters.search) {
            result = result.filter(workout =>
                workout.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                workout.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
                workout.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
            );
        }

        if (filters.category) {
            result = result.filter(workout => workout.category === filters.category);
        }

        if (filters.difficulty) {
            result = result.filter(workout => workout.difficulty === filters.difficulty);
        }

        if (filters.maxDuration) {
            result = result.filter(workout =>
                (workout.estimatedDuration || 0) <= parseInt(filters.maxDuration)
            );
        }

        if (filters.equipment) {
            if (filters.equipment === 'bodyweight') {
                result = result.filter(workout =>
                    workout.equipment?.includes('bodyweight') ||
                    !workout.equipment?.some(eq => eq !== 'bodyweight')
                );
            } else {
                result = result.filter(workout =>
                    workout.equipment?.includes(filters.equipment)
                );
            }
        }

        return result;
    }, [filters]);

    // Event handlers
    const handleLike = (workoutId: string) => {
        console.log('Liked workout:', workoutId);
        // TODO: Implement like functionality
    };

    const handleSave = (workoutId: string) => {
        console.log('Saved workout:', workoutId);
        // TODO: Implement save functionality
    };

    const handleView = (workoutId: string) => {
        console.log('View workout:', workoutId);
        // TODO: Navigate to workout detail page
    };

    return (
        <Box sx={{ minHeight: '100vh', py: 4, marginTop: '10rem' }}>
            <Container maxWidth="xl">
                {/* Hero Section */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        fontWeight={800}
                        sx={{
                            mb: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                        }}
                    >
                        🏋️ Khám phá Workouts
                    </Typography>
                    <Typography
                        variant="h5"
                        color="text.secondary"
                        sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
                    >
                        Tìm kiếm và khám phá hàng ngàn workout được thiết kế bởi các chuyên gia và cộng đồng fitness
                    </Typography>

                    {/* Quick Stats */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 4,
                        flexWrap: 'wrap',
                        mb: 2,
                    }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" fontWeight={700} color="primary.main">
                                {mockWorkouts.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Workouts
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" fontWeight={700} color="success.main">
                                {mockWorkouts.filter(w => w.difficulty === 'beginner').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Beginner
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" fontWeight={700} color="warning.main">
                                {mockWorkouts.filter(w => w.isSponsored).length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sponsored
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Filters */}
                <WorkoutFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                />

                {/* Results Header */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2,
                }}>
                    <Typography variant="h5" fontWeight={700}>
                        Kết quả ({filteredWorkouts.length} workouts)
                    </Typography>

                    {Object.values(filters).some(f => f !== '') && (
                        <Button
                            variant="outlined"
                            onClick={() => setFilters({
                                search: '',
                                category: '',
                                difficulty: '',
                                maxDuration: '',
                                equipment: '',
                            })}
                            sx={{ borderRadius: 2 }}
                        >
                            Xóa bộ lọc
                        </Button>
                    )}
                </Box>                {/* Workout Grid */}
                <Suspense fallback={<WorkoutsSkeleton />}>
                    {filteredWorkouts.length > 0 ? (
                        <Fade in timeout={500}>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: 'repeat(2, 1fr)',
                                        lg: 'repeat(3, 1fr)',
                                        xl: 'repeat(4, 1fr)'
                                    },
                                    gap: 3,
                                }}
                            >
                                {filteredWorkouts.map((workout) => (
                                    <WorkoutCard
                                        key={workout._id}
                                        workout={workout}
                                        onLike={handleLike}
                                        onSave={handleSave}
                                        onView={handleView}
                                    />
                                ))}
                            </Box>
                        </Fade>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                🔍 Không tìm thấy workout nào
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => setFilters({
                                    search: '',
                                    category: '',
                                    difficulty: '',
                                    maxDuration: '',
                                    equipment: '',
                                })}
                                sx={{ borderRadius: 2 }}
                            >
                                Xóa tất cả bộ lọc
                            </Button>
                        </Box>
                    )}
                </Suspense>
            </Container>
        </Box>
    );
};

// ================================
// 💀 Loading Skeleton Component
// ================================
const WorkoutsSkeleton: React.FC = () => (
    <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(4, 1fr)'
            },
            gap: 3,
        }}
    >
        {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} sx={{ height: 400, borderRadius: 3 }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="80%" />
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                    </Box>
                </CardContent>
            </Card>
        ))}
    </Box>
);

export default WorkoutPage;