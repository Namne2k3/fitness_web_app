/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { use, Suspense, useOptimistic, useTransition } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Paper,
    Typography,
    Chip,
    Button,
    IconButton,
    Avatar,
    Divider,
    Card,
    CardContent,
    LinearProgress,
    Alert,
    Skeleton,
    Stack,
    Grid,
    Rating,
    Tab,
    Tabs,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Breadcrumbs,
    Link,
    Tooltip,
    CircularProgress
} from '@mui/material';
import {
    ArrowBack,
    Favorite,
    FavoriteBorder,
    Share,
    Bookmark,
    BookmarkBorder,
    PlayArrow,
    Warning,
    Info,
    CheckCircle,
    Star,
    ExpandMore,
    Timer,
    LocalFireDepartment,
    FitnessCenter,
    NavigateNext,
    TrendingUp,
    Group,
    Verified
} from '@mui/icons-material';
import { exerciseService } from '../../services/exerciseService';
import { Exercise } from '../../types/exercise.interface';

/**
 * ExerciseDetailPage - Trang chi tiết bài tập với React 19 patterns và design system
 */
const ExerciseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    if (!id) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">Exercise ID not found</Alert>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                pb: 4
            }}
        >
            <Container maxWidth="lg">
                <Suspense fallback={<ExerciseDetailSkeleton />}>
                    <ExerciseDetailContent exerciseId={id} navigate={navigate} />
                </Suspense>
            </Container>
        </Box>
    );
};

/**
 * Main content component với data fetching
 */
const ExerciseDetailContent: React.FC<{ exerciseId: string; navigate: any }> = ({
    exerciseId,
    navigate
}) => {
    // ✅ React 19: use() hook cho data fetching
    const exercise = use(exerciseService.getExerciseById(exerciseId));
    const [tabValue, setTabValue] = React.useState(0);

    // ✅ React 19: useOptimistic cho social interactions
    const [optimisticLikes, addOptimisticLike] = useOptimistic(
        { isLiked: false, count: exercise.likeCount || 0 },
        (state, action: 'toggle') => ({
            isLiked: !state.isLiked,
            count: state.isLiked ? state.count - 1 : state.count + 1
        })
    );

    const [optimisticBookmark, addOptimisticBookmark] = useOptimistic(
        false,
        (state, action: 'toggle') => !state
    );

    const [isPending, startTransition] = useTransition();

    // Like handler với optimistic updates
    const handleLike = () => {
        addOptimisticLike('toggle');

        startTransition(async () => {
            try {
                await exerciseService.toggleLike(exerciseId);
            } catch (error) {
                console.error('Failed to like exercise:', error);
                // React tự động revert optimistic update nếu có lỗi
            }
        });
    };

    // Bookmark handler
    const handleBookmark = () => {
        addOptimisticBookmark('toggle');

        startTransition(async () => {
            try {
                await exerciseService.toggleBookmark(exerciseId);
            } catch (error) {
                console.error('Failed to bookmark exercise:', error);
            }
        });
    };

    // Share handler
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: exercise.name,
                    text: exercise.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ py: 4 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                sx={{ mb: 3 }}
                aria-label="breadcrumb"
            >
                <Link
                    color="inherit"
                    href="#"
                    onClick={() => navigate('/library/exercises')}
                    sx={{
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    Thư viện bài tập
                </Link>
                <Typography color="text.primary">{exercise.name}</Typography>
            </Breadcrumbs>

            {/* Back Button */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
                variant="outlined"
            >
                Quay lại
            </Button>

            {/* Hero Section */}
            <Paper
                elevation={0}
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                    mb: 4
                }}
            >
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    width: 64,
                                    height: 64
                                }}
                            >
                                <FitnessCenter sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                                    {exercise.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                                    <Chip
                                        label={exercise.category}
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            fontWeight: 600
                                        }}
                                    />
                                    <Chip
                                        label={exercise.difficulty}
                                        color={
                                            exercise.difficulty === 'beginner' ? 'success' :
                                                exercise.difficulty === 'intermediate' ? 'warning' : 'error'
                                        }
                                        sx={{ fontWeight: 600 }}
                                    />
                                    {exercise.isApproved && (
                                        <Chip
                                            icon={<Verified />}
                                            label="Đã xác thực"
                                            sx={{
                                                bgcolor: 'rgba(76, 175, 80, 0.2)',
                                                color: '#4caf50',
                                                fontWeight: 600
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                            {exercise.description}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        {/* Action Buttons */}
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                startIcon={optimisticLikes.isLiked ? <Favorite /> : <FavoriteBorder />}
                                onClick={handleLike}
                                disabled={isPending}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.3)',
                                    }
                                }}
                            >
                                {optimisticLikes.count}
                            </Button>

                            <IconButton
                                onClick={handleBookmark}
                                disabled={isPending}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.3)',
                                    }
                                }}
                            >
                                {optimisticBookmark ? <Bookmark /> : <BookmarkBorder />}
                            </IconButton>

                            <IconButton
                                onClick={handleShare}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.3)',
                                    }
                                }}
                            >
                                <Share />
                            </IconButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        icon={<Timer />}
                        title="Thời gian"
                        value="5-10 phút"
                        color="#2196f3"
                        background="linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        icon={<LocalFireDepartment />}
                        title="Calories"
                        value={`${exercise.caloriesPerMinute || 8}/phút`}
                        color="#ff9800"
                        background="linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        icon={<TrendingUp />}
                        title="Cường độ"
                        value={`${exercise.averageIntensity || 7}/10`}
                        color="#4caf50"
                        background="linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        icon={<Group />}
                        title="Độ phổ biến"
                        value="Cao"
                        color="#9c27b0"
                        background="linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)"
                    />
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper elevation={0} sx={{ mb: 4, borderRadius: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            minHeight: 64
                        }
                    }}
                >
                    <Tab label="Hướng dẫn" />
                    <Tab label="Nhóm cơ" />
                    <Tab label="An toàn" />
                    <Tab label="Biến thể" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {/* Tab 0: Instructions */}
                    {tabValue === 0 && (
                        <InstructionsTab instructions={exercise.instructions} />
                    )}

                    {/* Tab 1: Muscle Groups */}
                    {tabValue === 1 && (
                        <MuscleGroupsTab
                            primary={exercise.primaryMuscleGroups}
                            secondary={exercise.secondaryMuscleGroups}
                        />
                    )}

                    {/* Tab 2: Safety */}
                    {tabValue === 2 && (
                        <SafetyTab
                            precautions={exercise.precautions}
                            contraindications={exercise.contraindications}
                        />
                    )}

                    {/* Tab 3: Variations */}
                    {tabValue === 3 && (
                        <VariationsTab variations={exercise.variations} />
                    )}
                </Box>
            </Paper>

            {/* Equipment Section */}
            {exercise.equipment && exercise.equipment.length > 0 && (
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Thiết bị cần thiết
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {exercise.equipment.map((item, index) => (
                            <Chip
                                key={index}
                                label={item}
                                variant="outlined"
                                sx={{
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    fontWeight: 500
                                }}
                            />
                        ))}
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

/**
 * Stats Card Component
 */
const StatsCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    color: string;
    background: string;
}> = ({ icon, title, value, color, background }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            textAlign: 'center',
            background,
            borderRadius: 2,
            border: `1px solid ${color}20`
        }}
    >
        <Avatar sx={{ bgcolor: color, margin: '0 auto', mb: 2 }}>
            {icon}
        </Avatar>
        <Typography variant="h6" fontWeight="600" color={color} gutterBottom>
            {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {title}
        </Typography>
    </Paper>
);

/**
 * Instructions Tab Component
 */
const InstructionsTab: React.FC<{ instructions: string[] }> = ({ instructions }) => (
    <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Hướng dẫn thực hiện
        </Typography>
        <Box component="ol" sx={{ pl: 2 }}>
            {instructions.map((step, index) => (
                <Box component="li" key={index} sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {step}
                    </Typography>
                </Box>
            ))}
        </Box>
    </Box>
);

/**
 * Muscle Groups Tab Component
 */
const MuscleGroupsTab: React.FC<{
    primary: string[];
    secondary: string[];
}> = ({ primary, secondary }) => (
    <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Nhóm cơ chính
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {primary.map((muscle, index) => (
                    <Chip
                        key={index}
                        label={muscle}
                        color="primary"
                        sx={{ fontWeight: 600 }}
                    />
                ))}
            </Box>
        </Grid>
        <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'secondary.main' }}>
                Nhóm cơ phụ
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {secondary.map((muscle, index) => (
                    <Chip
                        key={index}
                        label={muscle}
                        color="secondary"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                    />
                ))}
            </Box>
        </Grid>
    </Grid>
);

/**
 * Safety Tab Component
 */
const SafetyTab: React.FC<{
    precautions: string[];
    contraindications: string[];
}> = ({ precautions, contraindications }) => (
    <Box>
        {precautions && precautions.length > 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Lưu ý an toàn
                </Typography>
                <Box component="ul" sx={{ mb: 0 }}>
                    {precautions.map((precaution, index) => (
                        <li key={index}>
                            <Typography variant="body2">{precaution}</Typography>
                        </li>
                    ))}
                </Box>
            </Alert>
        )}

        {contraindications && contraindications.length > 0 && (
            <Alert severity="error">
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Chống chỉ định
                </Typography>
                <Box component="ul" sx={{ mb: 0 }}>
                    {contraindications.map((contraindication, index) => (
                        <li key={index}>
                            <Typography variant="body2">{contraindication}</Typography>
                        </li>
                    ))}
                </Box>
            </Alert>
        )}
    </Box>
);

/**
 * Variations Tab Component
 */
const VariationsTab: React.FC<{ variations: any[] }> = ({ variations }) => (
    <Box>
        {variations && variations.length > 0 ? (
            variations.map((variation, index) => (
                <Accordion key={index} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {variation.name}
                        </Typography>
                        <Chip
                            label={variation.difficultyModifier}
                            size="small"
                            color={
                                variation.difficultyModifier === 'easier' ? 'success' :
                                    variation.difficultyModifier === 'harder' ? 'error' : 'default'
                            }
                            sx={{ ml: 2 }}
                        />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body1" gutterBottom sx={{ lineHeight: 1.6 }}>
                            {variation.description}
                        </Typography>
                        {variation.instructions && variation.instructions.length > 0 && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                                    Hướng dẫn:
                                </Typography>
                                <Box component="ol" sx={{ pl: 2 }}>
                                    {variation.instructions.map((step: string, stepIndex: number) => (
                                        <Box component="li" key={stepIndex} sx={{ mb: 1 }}>
                                            <Typography variant="body2">{step}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </AccordionDetails>
                </Accordion>
            ))
        ) : (
            <Typography variant="body1" color="text.secondary">
                Chưa có biến thể nào cho bài tập này.
            </Typography>
        )}
    </Box>
);

/**
 * Loading Skeleton Component
 */
const ExerciseDetailSkeleton: React.FC = () => (
    <Box sx={{ py: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 3, mb: 4 }} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {[...Array(4)].map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                </Grid>
            ))}
        </Grid>
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
    </Box>
);

export default ExerciseDetailPage;
