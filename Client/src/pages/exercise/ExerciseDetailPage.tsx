/**
 * 💪 Exercise Detail Page
 * Chi tiết bài tập với React Query
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Button,
    Grid,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CardMedia,
    Rating,
    Alert,
    Skeleton,
    CircularProgress
} from '@mui/material';
import {
    ArrowBack,
    PlayArrow,
    FitnessCenter,
    LocalFireDepartment,
    Warning,
    Refresh
} from '@mui/icons-material';
import { useExercise } from '../../hooks/useExercises';

/**
 * ✅ React Query: Exercise Detail Component
 */
const ExerciseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    if (!id) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">Exercise ID is required</Alert>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 4
            }}
        >
            <Container maxWidth="lg">
                {/* Back Button */}
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/exercises')}
                    sx={{
                        mb: 3,
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.1)',
                        }
                    }}
                >
                    Quay lại danh sách
                </Button>

                {/* ✅ React Query: Exercise Detail Content */}
                <ExerciseDetailContent exerciseId={id} />
            </Container>
        </Box>
    );
};

/**
 * Exercise Detail Content với React Query
 */
interface ExerciseDetailContentProps {
    exerciseId: string;
}

const ExerciseDetailContent: React.FC<ExerciseDetailContentProps> = ({ exerciseId }) => {
    const {
        data: exercise,
        isLoading,
        isError,
        error,
        refetch,
        isFetching
    } = useExercise(exerciseId);

    // Loading state
    if (isLoading) {
        return <ExerciseDetailSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <Alert
                severity="error"
                action={
                    <Button
                        color="inherit"
                        size="small"
                        onClick={() => refetch()}
                        startIcon={isFetching ? <CircularProgress size={16} /> : <Refresh />}
                    >
                        Thử lại
                    </Button>
                }
            >
                Không thể tải chi tiết bài tập: {error?.message}
            </Alert>
        );
    }

    // No data
    if (!exercise) {
        return (
            <Alert severity="info">Không tìm thấy bài tập</Alert>
        );
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'success';
            case 'intermediate': return 'warning';
            case 'advanced': return 'error';
            default: return 'default';
        }
    };

    return (
        <>
            {/* Background Loading Indicator */}
            {isFetching && !isLoading && (
                <Box sx={{
                    position: 'fixed',
                    top: 16,
                    right: 16,
                    zIndex: 1000
                }}>
                    <Chip
                        icon={<CircularProgress size={16} />}
                        label="Đang cập nhật..."
                        color="primary"
                        variant="filled"
                    />
                </Box>
            )}

            <Grid container spacing={4}>
                {/* Main Content */}
                <Grid item xs={12} md={8}>
                    {/* Exercise Header */}
                    <Card
                        elevation={0}
                        sx={{
                            mb: 3,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 4
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                {/* Exercise Image/Video */}
                                <Box
                                    sx={{
                                        width: 200,
                                        height: 200,
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        flexShrink: 0
                                    }}
                                >
                                    {exercise.images?.[0] ? (
                                        <CardMedia
                                            component="img"
                                            image={exercise.images[0]}
                                            alt={exercise.name}
                                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <FitnessCenter sx={{ fontSize: 64, color: 'white' }} />
                                        </Box>
                                    )}

                                    {/* Video Play Button */}
                                    {exercise.videoUrl && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'rgba(0,0,0,0.3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Avatar sx={{ bgcolor: 'white', width: 56, height: 56 }}>
                                                <PlayArrow sx={{ fontSize: 32, color: 'primary.main' }} />
                                            </Avatar>
                                        </Box>
                                    )}
                                </Box>

                                {/* Exercise Info */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                        {exercise.name}
                                    </Typography>

                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        {exercise.description}
                                    </Typography>

                                    {/* Tags */}
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                        <Chip
                                            label={exercise.category}
                                            color="primary"
                                            variant="outlined"
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                        <Chip
                                            label={exercise.difficulty}
                                            color={getDifficultyColor(exercise.difficulty) as any}
                                            variant="filled"
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    </Box>

                                    {/* Stats */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} sm={4}>
                                            <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
                                                <LocalFireDepartment sx={{ color: 'warning.main', mb: 1 }} />
                                                <Typography variant="h6" fontWeight="bold">
                                                    {exercise.caloriesPerMinute || 0}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    cal/phút
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6} sm={4}>
                                            <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
                                                <Rating
                                                    value={exercise.averageIntensity || 5}
                                                    max={10}
                                                    readOnly
                                                    size="small"
                                                    sx={{ mb: 1 }}
                                                />
                                                <Typography variant="h6" fontWeight="bold">
                                                    {exercise.averageIntensity || 5}/10
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Cường độ
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Instructions */}
                    <Card
                        elevation={0}
                        sx={{
                            mb: 3,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 4
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Hướng dẫn thực hiện
                            </Typography>
                            <List>
                                {exercise.instructions.map((instruction, index) => (
                                    <ListItem key={index} sx={{ pl: 0 }}>
                                        <ListItemIcon>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                                <Typography variant="body2" color="white" fontWeight="bold">
                                                    {index + 1}
                                                </Typography>
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={instruction}
                                            sx={{ ml: 1 }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    {/* Safety Information */}
                    {(exercise.precautions?.length > 0 || exercise.contraindications?.length > 0) && (
                        <Card
                            elevation={0}
                            sx={{
                                background: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 4
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Thông tin an toàn
                                </Typography>

                                {exercise.precautions?.length > 0 && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" color="warning.main" gutterBottom>
                                            <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            Lưu ý an toàn
                                        </Typography>
                                        <List dense>
                                            {exercise.precautions.map((precaution, index) => (
                                                <ListItem key={index} sx={{ pl: 2 }}>
                                                    <ListItemText primary={precaution} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                )}

                                {exercise.contraindications?.length > 0 && (
                                    <Box>
                                        <Typography variant="h6" color="error.main" gutterBottom>
                                            <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            Chống chỉ định
                                        </Typography>
                                        <List dense>
                                            {exercise.contraindications.map((contraindication, index) => (
                                                <ListItem key={index} sx={{ pl: 2 }}>
                                                    <ListItemText primary={contraindication} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    {/* Muscle Groups */}
                    <Card
                        elevation={0}
                        sx={{
                            mb: 3,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 4
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Nhóm cơ tác động
                            </Typography>

                            <Typography variant="subtitle2" color="primary.main" gutterBottom>
                                Nhóm cơ chính:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                {exercise.primaryMuscleGroups.map((muscle) => (
                                    <Chip
                                        key={muscle}
                                        label={muscle}
                                        color="primary"
                                        size="small"
                                    />
                                ))}
                            </Box>

                            {exercise.secondaryMuscleGroups?.length > 0 && (
                                <>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Nhóm cơ phụ:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {exercise.secondaryMuscleGroups.map((muscle) => (
                                            <Chip
                                                key={muscle}
                                                label={muscle}
                                                variant="outlined"
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Equipment */}
                    <Card
                        elevation={0}
                        sx={{
                            mb: 3,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 4
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Thiết bị cần thiết
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {exercise.equipment.map((equip) => (
                                    <Chip
                                        key={equip}
                                        label={equip}
                                        color="secondary"
                                        variant="outlined"
                                        size="small"
                                    />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Variations */}
                    {exercise.variations?.length > 0 && (
                        <Card
                            elevation={0}
                            sx={{
                                background: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 4
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Biến thể ({exercise.variations.length})
                                </Typography>
                                {exercise.variations.map((variation, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            {variation.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {variation.description}
                                        </Typography>
                                        <Chip
                                            label={variation.difficultyModifier}
                                            size="small"
                                            color={
                                                variation.difficultyModifier === 'easier' ? 'success' :
                                                    variation.difficultyModifier === 'harder' ? 'error' : 'default'
                                            }
                                        />
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

/**
 * Loading skeleton cho exercise detail (unchanged)
 */
const ExerciseDetailSkeleton: React.FC = () => (
    <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Skeleton variant="rectangular" width={200} height={200} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="60%" height={48} />
                            <Skeleton variant="text" width="100%" height={24} />
                            <Skeleton variant="text" width="80%" height={24} />
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Skeleton variant="rounded" width={80} height={32} />
                                <Skeleton variant="rounded" width={80} height={32} />
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
            <Card>
                <CardContent sx={{ p: 4 }}>
                    <Skeleton variant="text" width="40%" height={32} />
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} variant="text" width="100%" height={24} sx={{ mt: 1 }} />
                    ))}
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} variant="rounded" width={60} height={24} />
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
);

export default ExerciseDetailPage;
