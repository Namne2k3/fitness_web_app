/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore - MUI Grid type conflicts resolved
/* eslint-disable */
import React, { useOptimistic, useTransition, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Paper,
    Typography,
    Chip,
    Button,
    Avatar,
    Alert,
    Skeleton,
    Stack,
    Grid,
    Card,
    CardContent,
    Breadcrumbs,
    Link, IconButton,
    FormControlLabel,
    Switch
} from '@mui/material';
import {
    ArrowBack,
    Favorite,
    FavoriteBorder,
    Share,
    Bookmark,
    BookmarkBorder,
    Timer,
    LocalFireDepartment,
    FitnessCenter,
    NavigateNext,
    TrendingUp,
    Group,
    Verified,
    Refresh,
    Whatshot,
    PlayCircleOutline as PlayCircleOutlineIcon,
    Gif as GifBoxIcon,
    PlayArrow,
    CheckCircle,
    Build,
    ListAlt,
    Transform, Category,
    Speed,
    AutoAwesome,
    EmojiEvents,
    Psychology,
    Warning,
    Block,
    Info,
} from '@mui/icons-material';
import { ExerciseService } from '../../services/exerciseService';
// import { useExercise } from '../../hooks/useExercises'; // 🚀 Commented out for mock data testing

/**
 * 🚀 MOCK DATA - For UI testing before API implementation
 */
const mockExerciseData = {
    id: 'mock-flying-bell-456',
    name: 'Flying Lateral Raises (Bay vai)',
    description: 'Bài tập Bay vai với tạ đơn là một bài tập cô lập tuyệt vời để phát triển cơ vai trước và giữa. Bài tập này giúp tạo độ rộng cho vai và cải thiện đường nét cơ thể phần trên.',
    category: 'Strength Training',
    difficulty: 'intermediate',
    isApproved: true,
    likeCount: 312,
    caloriesPerMinute: 12,
    averageIntensity: 7,
    primaryMuscleGroups: ['Vai trước', 'Vai giữa', 'Ngực trên'],
    secondaryMuscleGroups: ['Vai sau', 'Cơ core', 'Tay trước'],
    equipment: ['Tạ đơn', 'Ghế tập'],    // 🎥 Media content
    images: [
        'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:437,cw:1125,ch:1125,q:80,w:1125/N7cKZJUp4C3kdvwvKoPXSR.jpg', // Lateral raise starting position
        'https://images.unsplash.com/photo-1434596922112-19c563067271?w=800&q=80', // Dumbbell shoulder exercise
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80', // Seated shoulder workout
        'https://images.unsplash.com/photo-1506629905607-d908a0b61549?w=800&q=80'  // Shoulder training form
    ],
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', // Demo video
    gifUrl: 'https://i.pinimg.com/originals/8b/d3/74/8bd3745dca0749b912b08b0d4bca3833.gif', // Animated demo
    instructions: [
        'Ngồi thẳng trên ghế tập, lưng tựa vào tựa ghế, mỗi tay cầm một tạ đơn',
        'Giữ tạ ở vị trí bên hông, cùi chỏ hơi cong nhẹ (khoảng 15-20 độ)',
        'Nâng tạ lên hai bên theo chuyển động cung tròn cho đến khi ngang vai',
        'Giữ ngực thẳng, vai hạ thấp, không sử dụng động lực từ thân người',
        'Hạ tạ xuống từ từ theo đường cong tương tự, kiểm soát tốc độ',
        'Thở ra khi nâng tạ lên, thở vào khi hạ tạ xuống'
    ],
    precautions: [
        'Không nâng tạ quá cao, chỉ nâng đến ngang vai để tránh tổn thương',
        'Giữ cùi chỏ hơi cong, không duỗi thẳng hoàn toàn',
        'Sử dụng trọng lượng phù hợp, không nên quá nặng',
        'Thực hiện động tác chậm và kiểm soát, tránh sử dụng động lực',
        'Giữ vai hạ thấp, không nhún vai khi thực hiện'
    ],
    contraindications: [
        'Chấn thương vai, đặc biệt là vùng rotator cuff',
        'Viêm gân vai hoặc bursitis',
        'Đau vai mãn tính chưa được điều trị',
        'Chấn thương cổ tay hoặc khuỷu tay nghiêm trọng',
        'Phụ nữ mang thai giai đoạn cuối (tham khảo bác sĩ)'
    ],
    variations: [
        {
            name: 'Lateral Raise đứng',
            description: 'Phiên bản đứng cơ bản cho người mới bắt đầu',
            difficultyModifier: 'easier',
            instructions: [
                'Đứng thẳng, chân rộng bằng vai, mỗi tay cầm một tạ nhẹ',
                'Nâng tạ lên hai bên cho đến ngang vai',
                'Hạ xuống từ từ và lặp lại'
            ]
        },
        {
            name: 'Cable Lateral Raise',
            description: 'Sử dụng máy cáp để tăng độ khó và kiểm soát tốt hơn',
            difficultyModifier: 'harder',
            instructions: [
                'Đứng bên cạnh máy cáp, nắm tay cầm với tay xa máy',
                'Nâng tay cầm lên bên cho đến ngang vai',
                'Điều khiển lực căng liên tục từ cáp'
            ]
        },
        {
            name: 'Bent-over Lateral Raise',
            description: 'Biến thể cúi người tập trung vào vai sau',
            difficultyModifier: 'variation',
            instructions: [
                'Cúi người về phía trước 45 độ, giữ lưng thẳng',
                'Nâng tạ lên sau lưng theo chuyển động cung tròn',
                'Tập trung vào cơ vai sau'
            ]
        }
    ]
};

/**
 * ExerciseDetailPage - Trang chi tiết bài tập với React Query và design system
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
                pb: 4,
                pt: { xs: 10, md: 12 },
            }}
        >
            <Container maxWidth="lg">
                <ExerciseDetailContent exerciseId={id} navigate={navigate} />
            </Container>
        </Box>
    );
};

/**
 * Main content component với React Query
 */
const ExerciseDetailContent: React.FC<{ exerciseId: string; navigate: any }> = ({
    exerciseId,
    navigate
}) => {
    // 🚀 MOCK DATA - Comment out React Query and use mock data for UI testing
    // const { data: exercise, isLoading, error } = useExercise(exerciseId);    // ✅ Using Mock Data for UI Preview
    const exercise = mockExerciseData;
    const isLoading = false;
    const error = null;

    // ✅ React 19: useOptimistic hooks - MUST be called before any conditionals
    const [optimisticLikes, addOptimisticLike] = useOptimistic(
        { isLiked: false, count: exercise?.likeCount || 0 },
        (state) => ({
            isLiked: !state.isLiked,
            count: state.isLiked ? state.count - 1 : state.count + 1
        })
    );

    const [optimisticBookmark, addOptimisticBookmark] = useOptimistic(
        false,
        (state) => !state
    );

    const [isPending, startTransition] = useTransition();

    // ✅ Update optimistic state when exercise data changes
    React.useEffect(() => {
        if (exercise?.likeCount !== undefined) {
            // Reset optimistic state to match actual data
            addOptimisticLike({ isLiked: false, count: exercise.likeCount });
        }
    }, [exercise?.likeCount, addOptimisticLike]);

    // ✅ React Query: Loading state
    if (isLoading) {
        return <ExerciseDetailSkeleton />;
    }    // ✅ React Query: Error state - User-friendly "Not Found" UI
    if (error || !exercise) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    py: 4,
                }}
            >
                <Container maxWidth="md">
                    <Paper
                        elevation={24}
                        sx={{
                            p: 6,
                            borderRadius: 4,
                            textAlign: 'center',
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {/* Illustration Icon */}
                        <Box
                            sx={{
                                display: 'inline-flex',
                                p: 3,
                                borderRadius: '50%',
                                bgcolor: 'error.light',
                                color: 'error.main',
                                mb: 3,
                                fontSize: '4rem',
                            }}
                        >
                            🏋️‍♂️
                        </Box>

                        {/* Main Message */}
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                            Oops. Không tìm thấy thông tin bài tập.
                        </Typography>

                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                            {error ?
                                "Chúng tôi đang gặp sự cố khi tải thông tin bài tập này. Vui lòng kiểm tra kết nối mạng và thử lại." :
                                "Bài tập bạn đang tìm kiếm không tồn tại hoặc có thể đã bị xóa khỏi cơ sở dữ liệu của chúng tôi."
                            }
                        </Typography>

                        {/* Action Buttons */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            justifyContent="center"
                            sx={{ mb: 4 }}
                        >                            <Button
                            variant="contained"
                            size="large"
                            startIcon={<Refresh />}
                            onClick={() => window.location.reload()}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                                Try Again
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<ArrowBack />}
                                onClick={() => navigate('/exercises')}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    '&:hover': {
                                        borderColor: 'primary.dark',
                                        color: 'primary.dark',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                Browse Exercises
                            </Button>
                        </Stack>

                        {/* Help Text */}
                        <Box sx={{
                            p: 3,
                            bgcolor: 'grey.50',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'grey.200'
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                💡 <strong>Need help?</strong> Try browsing our exercise library or contact support if the problem persists.
                            </Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        );
    }

    // Like handler với optimistic updates
    const handleLike = () => {
        addOptimisticLike('toggle');

        startTransition(async () => {
            try {
                await ExerciseService.toggleLike(exerciseId);
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
                await ExerciseService.toggleBookmark(exerciseId);
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

            {/* Hero Section with Image Background */}
            <Paper
                elevation={0}
                sx={{
                    background: exercise.images && exercise.images.length > 0
                        ? `linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%), url(${exercise.images[0]})`
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                    mb: 4
                }}
            >                <Grid container spacing={4} alignItems="center">
                    {/* @ts-ignore - Grid item prop conflict */}
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
                                    {/* {exercise.isApproved && (
                                        <Chip
                                            icon={<Verified />}
                                            label="Đã xác thực"
                                            sx={{
                                                bgcolor: 'rgba(76, 175, 80, 0.2)',
                                                color: '#4caf50',
                                                fontWeight: 600
                                            }}
                                        />
                                    )} */}
                                </Box>
                            </Box>
                        </Box>

                        <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                            {exercise.description}
                        </Typography>
                    </Grid>

                    {/* @ts-ignore */}
                    <Grid item xs={12} md={4}>                        {/* Action Buttons */}
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                startIcon={optimisticLikes.isLiked ? <Favorite /> : <FavoriteBorder />}
                                onClick={handleLike}
                                disabled={isPending}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.3)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
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
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    borderRadius: 2,
                                    width: 48,
                                    height: 48,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.3)',
                                        transform: 'translateY(-2px) scale(1.05)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0) scale(1)',
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
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    borderRadius: 2,
                                    width: 48,
                                    height: 48,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.3)', transform: 'translateY(-2px) rotate(10deg)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0) rotate(0deg)',
                                    }
                                }}
                            >
                                <Share />
                            </IconButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>            {/* Comprehensive Exercise Info Section - Muscle Groups & Equipment */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
                    border: '1px solid rgba(33, 150, 243, 0.1)',
                    mb: 4
                }}
            >
                {/* Muscle Groups Row */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: { xs: 'stretch', sm: 'center' }, mb: 3 }}>
                    {/* Primary Muscle Groups */}
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FitnessCenter sx={{ color: '#1976d2', mr: 1, fontSize: 20 }} />
                            <Typography variant="h6" fontWeight="600" color="#1565c0">
                                Nhóm cơ chính
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {exercise.primaryMuscleGroups.map((muscle, index) => (
                                <Chip
                                    key={index}
                                    label={muscle}
                                    sx={{
                                        bgcolor: '#1976d2',
                                        color: 'white',
                                        fontWeight: 600,
                                        '&:hover': {
                                            bgcolor: '#1565c0',
                                            transform: 'scale(1.05)'
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Secondary Muscle Groups */}
                    {exercise.secondaryMuscleGroups && exercise.secondaryMuscleGroups.length > 0 && (
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <FitnessCenter sx={{ color: '#42a5f5', mr: 1, fontSize: 20 }} />
                                <Typography variant="h6" fontWeight="600" color="#1976d2">
                                    Nhóm cơ phụ
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {exercise.secondaryMuscleGroups.map((muscle, index) => (
                                    <Chip
                                        key={index}
                                        label={muscle}
                                        variant="outlined"
                                        sx={{
                                            borderColor: '#42a5f5',
                                            color: '#1976d2',
                                            fontWeight: 500,
                                            '&:hover': {
                                                bgcolor: 'rgba(66, 165, 245, 0.1)',
                                                transform: 'scale(1.05)'
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Equipment Section */}
                {exercise.equipment && exercise.equipment.length > 0 && (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Build sx={{ color: '#ff9800', mr: 1, fontSize: 20 }} />
                            <Typography variant="h6" fontWeight="600" color="#f57c00">
                                Thiết bị cần thiết
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {exercise.equipment.map((item, index) => (
                                <Chip
                                    key={index}
                                    label={item}
                                    sx={{
                                        bgcolor: '#ff9800',
                                        color: 'white',
                                        fontWeight: 500,
                                        '&:hover': {
                                            bgcolor: '#f57c00',
                                            transform: 'scale(1.05)'
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Paper>{/* Stats Cards */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(4, 1fr)'
                    },
                    gap: 3,
                    mb: 4,
                    width: '100%'
                }}
            >
                <StatsCard
                    icon={<Timer />}
                    title="Thời gian"
                    value="5-10 phút"
                    color="#2196f3"
                    background="linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
                />
                <StatsCard
                    icon={<LocalFireDepartment />}
                    title="Calories"
                    value={`${exercise.caloriesPerMinute || 8}/phút`}
                    color="#ff9800"
                    background="linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)"
                />
                <StatsCard
                    icon={<TrendingUp />}
                    title="Cường độ"
                    value={`${exercise.averageIntensity || 7}/10`}
                    color="#4caf50"
                    background="linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)"
                />
                <StatsCard
                    icon={<Group />}
                    title="Độ phổ biến"
                    value="Cao"
                    color="#9c27b0"
                    background="linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)"
                />
            </Box>{/* 🔄 Instructions and Video Section - Side by Side */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
                {/* Instructions Section */}
                {/* @ts-ignore */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ height: '100%', p: 4, borderRadius: 3, border: '1px solid rgba(33, 150, 243, 0.1)', background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ bgcolor: '#2196f3', width: 40, height: 40, mr: 2 }}>
                                <FitnessCenter />
                            </Avatar>
                            <Typography variant="h5" component="h2" fontWeight="bold" color="#1565c0">
                                Hướng dẫn thực hiện
                            </Typography>
                        </Box>
                        <InstructionsTab instructions={exercise.instructions} />
                    </Paper>
                </Grid>
                {/* Enhanced Video/GIF Section */}
                {/* @ts-ignore */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <VideoGifSection exercise={exercise} />
                </Grid>
            </Grid>
            {/* 🔄 Variations Section - Full Width */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
                {/* Enhanced Variations Section - Full Width */}
                {/* @ts-ignore */}
                <Grid size={{ xs: 12 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            height: '100%',
                            borderRadius: 3,
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                            border: '1px solid rgba(156, 39, 176, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 28px rgba(156, 39, 176, 0.15)'
                            }
                        }}
                    >
                        {/* Header */}
                        <Box sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                                <Whatshot sx={{ color: 'white' }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" component="h2" fontWeight="bold">
                                    Biến thể bài tập
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Khám phá các cách thực hiện khác nhau
                                </Typography>
                            </Box>
                        </Box>

                        {/* Content */}
                        <Box sx={{ p: 3 }}>
                            <EnhancedVariationsSection variations={exercise.variations} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>            {/* Enhanced Safety Section */}
            <Paper
                elevation={0}
                sx={{
                    mb: 4,
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(244, 67, 54, 0.2)',
                    boxShadow: '0 8px 32px rgba(244, 67, 54, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(244, 67, 54, 0.15)',
                        border: '1px solid rgba(244, 67, 54, 0.3)'
                    }
                }}
            >
                {/* Enhanced Header with Gradient Background */}
                <Box sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
                        pointerEvents: 'none'
                    }
                }}>
                    <Avatar sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        width: 48,
                        height: 48,
                        border: '2px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                        <Verified sx={{ fontSize: 28 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
                            Hướng dẫn an toàn
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Thông tin quan trọng để tránh chấn thương và tập luyện hiệu quả
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        background: 'rgba(255,255,255,0.15)',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <Warning sx={{ fontSize: 20 }} />
                        <Typography variant="caption" fontWeight="600">
                            BẮT BUỘC ĐỌC
                        </Typography>
                    </Box>
                </Box>

                {/* Enhanced Content Area */}
                <Box sx={{ p: 4 }}>
                    <EnhancedSafetyTab
                        precautions={exercise.precautions}
                        contraindications={exercise.contraindications}
                    />
                </Box>
            </Paper>{/* 🎯 Enhanced Exercise Summary Section - Completely Redesigned */}
            <Paper
                elevation={0}
                sx={{
                    mb: 6,
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
                        pointerEvents: 'none'
                    }
                }}
            >
                <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                    {/* Section Header with improved layout */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 4,
                        position: 'relative',
                    }}>
                        <Box sx={{
                            position: 'relative',
                            mr: 3
                        }}>
                            <Avatar sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                width: 70,
                                height: 70,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                border: '3px solid rgba(255,255,255,0.3)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <AutoAwesome sx={{ fontSize: 36, color: 'white' }} />
                            </Avatar>
                            <Box sx={{
                                position: 'absolute',
                                top: -5,
                                right: -5,
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                bgcolor: '#4caf50',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '3px solid white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                            }}>
                                <CheckCircle sx={{ fontSize: 16, color: 'white' }} />
                            </Box>
                        </Box>                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="h3" component="h2" fontWeight="800" sx={{
                                    background: 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                    letterSpacing: '-0.5px'
                                }}>
                                    Tóm tắt bài tập
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{
                                opacity: 0.95,
                                fontWeight: 500,
                                color: 'rgba(255,255,255,0.9)',
                                fontStyle: 'italic',
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    fontSize: '2rem',
                                    color: 'rgba(255,255,255,0.3)',
                                    position: 'absolute',
                                    left: '-20px',
                                    top: '-10px'
                                },
                                '&::after': {
                                    content: '""',
                                    fontSize: '2rem',
                                    color: 'rgba(255,255,255,0.3)'
                                }
                            }}>
                                Khám phá chi tiết và những điểm quan trọng để thành công
                            </Typography>
                        </Box>
                    </Box>                    {/* Modern Stats Grid với glassmorphism design */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'repeat(2, 1fr)',
                                sm: 'repeat(4, 1fr)'
                            },
                            gap: 3,
                            mb: 5
                        }}
                    >
                        {/* Instructions Count Card */}
                        <Card sx={{
                            position: 'relative',
                            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(21, 101, 192, 0.05) 100%)',
                            borderRadius: 4,
                            border: '1px solid rgba(33, 150, 243, 0.3)',
                            backdropFilter: 'blur(20px)',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            '&:hover': {
                                transform: 'translateY(-12px) scale(1.03)',
                                background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.25) 0%, rgba(21, 101, 192, 0.15) 100%)',
                                boxShadow: '0 25px 50px rgba(33, 150, 243, 0.3)',
                                border: '1px solid rgba(33, 150, 243, 0.5)'
                            }
                        }}>
                            <CardContent sx={{ textAlign: 'center', p: 3.5 }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Box sx={{
                                        background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                                        borderRadius: '20px',
                                        p: 2.5,
                                        boxShadow: '0 12px 24px rgba(33, 150, 243, 0.4)',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: 0,
                                            borderRadius: '20px',
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
                                            zIndex: 1
                                        }
                                    }}>
                                        <ListAlt sx={{ fontSize: 32, color: 'white', position: 'relative', zIndex: 2 }} />
                                    </Box>
                                    <Typography variant="h1" sx={{
                                        fontWeight: '900',
                                        color: 'white',
                                        textShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                        lineHeight: 1,
                                        fontSize: '3rem'
                                    }}>
                                        {exercise.instructions.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        opacity: 0.95,
                                        fontWeight: 700,
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                        fontSize: '0.75rem'
                                    }}>
                                        Bước thực hiện
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Muscle Groups Card */}
                        <Card sx={{
                            position: 'relative',
                            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(139, 195, 74, 0.05) 100%)',
                            borderRadius: 4,
                            border: '1px solid rgba(76, 175, 80, 0.3)',
                            backdropFilter: 'blur(20px)',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            '&:hover': {
                                transform: 'translateY(-12px) scale(1.03)',
                                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(139, 195, 74, 0.15) 100%)',
                                boxShadow: '0 25px 50px rgba(76, 175, 80, 0.3)',
                                border: '1px solid rgba(76, 175, 80, 0.5)'
                            }
                        }}>
                            <CardContent sx={{ textAlign: 'center', p: 3.5 }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Box sx={{
                                        background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                                        borderRadius: '20px',
                                        p: 2.5,
                                        boxShadow: '0 12px 24px rgba(76, 175, 80, 0.4)',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: 0,
                                            borderRadius: '20px',
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
                                            zIndex: 1
                                        }
                                    }}>
                                        <Group sx={{ fontSize: 32, color: 'white', position: 'relative', zIndex: 2 }} />
                                    </Box>
                                    <Typography variant="h1" sx={{
                                        fontWeight: '900',
                                        color: 'white',
                                        textShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                        lineHeight: 1,
                                        fontSize: '3rem'
                                    }}>
                                        {exercise.primaryMuscleGroups.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        opacity: 0.95,
                                        fontWeight: 700,
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                        fontSize: '0.75rem'
                                    }}>
                                        Nhóm cơ chính
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Variations Card */}
                        <Card sx={{
                            position: 'relative',
                            background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.15) 0%, rgba(233, 30, 99, 0.05) 100%)',
                            borderRadius: 4,
                            border: '1px solid rgba(156, 39, 176, 0.3)',
                            backdropFilter: 'blur(20px)',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            '&:hover': {
                                transform: 'translateY(-12px) scale(1.03)',
                                background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.25) 0%, rgba(233, 30, 99, 0.15) 100%)',
                                boxShadow: '0 25px 50px rgba(156, 39, 176, 0.3)',
                                border: '1px solid rgba(156, 39, 176, 0.5)'
                            }
                        }}>
                            <CardContent sx={{ textAlign: 'center', p: 3.5 }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Box sx={{
                                        background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
                                        borderRadius: '20px',
                                        p: 2.5,
                                        boxShadow: '0 12px 24px rgba(156, 39, 176, 0.4)',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: 0,
                                            borderRadius: '20px',
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
                                            zIndex: 1
                                        }
                                    }}>
                                        <Transform sx={{ fontSize: 32, color: 'white', position: 'relative', zIndex: 2 }} />
                                    </Box>
                                    <Typography variant="h1" sx={{
                                        fontWeight: '900',
                                        color: 'white',
                                        textShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                        lineHeight: 1,
                                        fontSize: '3rem'
                                    }}>
                                        {exercise.variations?.length || 0}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        opacity: 0.95,
                                        fontWeight: 700,
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                        fontSize: '0.75rem'
                                    }}>
                                        Biến thể
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Calories Card */}
                        <Card sx={{
                            position: 'relative',
                            background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 87, 34, 0.05) 100%)',
                            borderRadius: 4,
                            border: '1px solid rgba(255, 152, 0, 0.3)',
                            backdropFilter: 'blur(20px)',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            '&:hover': {
                                transform: 'translateY(-12px) scale(1.03)',
                                background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.25) 0%, rgba(255, 87, 34, 0.15) 100%)',
                                boxShadow: '0 25px 50px rgba(255, 152, 0, 0.3)',
                                border: '1px solid rgba(255, 152, 0, 0.5)'
                            }
                        }}>
                            <CardContent sx={{ textAlign: 'center', p: 3.5 }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Box sx={{
                                        background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                                        borderRadius: '20px',
                                        p: 2.5,
                                        boxShadow: '0 12px 24px rgba(255, 152, 0, 0.4)',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: 0,
                                            borderRadius: '20px',
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
                                            zIndex: 1
                                        }
                                    }}>
                                        <LocalFireDepartment sx={{ fontSize: 32, color: 'white', position: 'relative', zIndex: 2 }} />
                                    </Box>
                                    <Typography variant="h1" sx={{
                                        fontWeight: '900',
                                        color: 'white',
                                        textShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                        lineHeight: 1,
                                        fontSize: '3rem'
                                    }}>
                                        {exercise.caloriesPerMinute}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        opacity: 0.95,
                                        fontWeight: 700,
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                        fontSize: '0.75rem'
                                    }}>
                                        Cal/phút
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>                    {/* Enhanced Key Details Grid với premium design */}
                    <Box sx={{ mb: 5 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            mb: 4
                        }}>
                            <Box sx={{
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                                borderRadius: '20px',
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 12px 24px rgba(255, 107, 107, 0.4)',
                                border: '2px solid rgba(255,255,255,0.2)',
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: 0,
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
                                    zIndex: 1
                                }
                            }}>
                                <Psychology sx={{ fontSize: 28, color: 'white', position: 'relative', zIndex: 2 }} />
                            </Box>
                            <Typography variant="h4" sx={{
                                fontWeight: 800,
                                color: 'white',
                                background: 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                letterSpacing: '-0.5px'
                            }}>
                                Thông số chi tiết
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                            gap: 3
                        }}>
                            {/* Difficulty Level */}
                            <Card sx={{
                                position: 'relative',
                                background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.12) 0%, rgba(255, 152, 0, 0.08) 100%)',
                                borderRadius: 4,
                                border: '1px solid rgba(244, 67, 54, 0.25)',
                                backdropFilter: 'blur(15px)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.18) 0%, rgba(255, 152, 0, 0.12) 100%)',
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 16px 32px rgba(244, 67, 54, 0.2)',
                                    border: '1px solid rgba(244, 67, 54, 0.4)'
                                }
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                        <Avatar sx={{
                                            background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                                            width: 50,
                                            height: 50,
                                            boxShadow: '0 8px 16px rgba(244, 67, 54, 0.3)',
                                            border: '2px solid rgba(255,255,255,0.2)'
                                        }}>
                                            <TrendingUp sx={{ fontSize: 24, color: 'white' }} />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{
                                                opacity: 0.9,
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                letterSpacing: 0.5,
                                                fontSize: '0.75rem',
                                                mb: 0.5
                                            }}>
                                                Mức độ khó
                                            </Typography>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 800,
                                                color: 'white',
                                                fontSize: '1.1rem'
                                            }}>
                                                {exercise.difficulty === 'beginner' ? '🟢 Người mới' :
                                                    exercise.difficulty === 'intermediate' ? '🟡 Trung cấp' : '🔴 Nâng cao'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Category */}
                            <Card sx={{
                                position: 'relative',
                                background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.12) 0%, rgba(63, 81, 181, 0.08) 100%)',
                                borderRadius: 4,
                                border: '1px solid rgba(33, 150, 243, 0.25)',
                                backdropFilter: 'blur(15px)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.18) 0%, rgba(63, 81, 181, 0.12) 100%)',
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 16px 32px rgba(33, 150, 243, 0.2)',
                                    border: '1px solid rgba(33, 150, 243, 0.4)'
                                }
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                        <Avatar sx={{
                                            background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                                            width: 50,
                                            height: 50,
                                            boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)',
                                            border: '2px solid rgba(255,255,255,0.2)'
                                        }}>
                                            <Category sx={{ fontSize: 24, color: 'white' }} />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{
                                                opacity: 0.9,
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                letterSpacing: 0.5,
                                                fontSize: '0.75rem',
                                                mb: 0.5
                                            }}>
                                                Loại bài tập
                                            </Typography>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 800,
                                                color: 'white',
                                                fontSize: '1.1rem'
                                            }}>
                                                💪 {exercise.category === 'strength' ? 'Sức mạnh' :
                                                    exercise.category === 'cardio' ? 'Tim mạch' : 'Linh hoạt'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Intensity */}
                            <Card sx={{
                                position: 'relative',
                                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.12) 0%, rgba(139, 195, 74, 0.08) 100%)',
                                borderRadius: 4,
                                border: '1px solid rgba(76, 175, 80, 0.25)',
                                backdropFilter: 'blur(15px)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.18) 0%, rgba(139, 195, 74, 0.12) 100%)',
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 16px 32px rgba(76, 175, 80, 0.2)',
                                    border: '1px solid rgba(76, 175, 80, 0.4)'
                                }
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                        <Avatar sx={{
                                            background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                                            width: 50,
                                            height: 50,
                                            boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)',
                                            border: '2px solid rgba(255,255,255,0.2)'
                                        }}>
                                            <Speed sx={{ fontSize: 24, color: 'white' }} />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{
                                                opacity: 0.9,
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                letterSpacing: 0.5,
                                                fontSize: '0.75rem',
                                                mb: 0.5
                                            }}>
                                                Cường độ
                                            </Typography>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 800,
                                                color: 'white',
                                                fontSize: '1.1rem'
                                            }}>
                                                ⚡ {exercise.averageIntensity}/10
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Equipment */}
                            <Card sx={{
                                position: 'relative',
                                background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.12) 0%, rgba(255, 87, 34, 0.08) 100%)',
                                borderRadius: 4,
                                border: '1px solid rgba(255, 152, 0, 0.25)',
                                backdropFilter: 'blur(15px)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.18) 0%, rgba(255, 87, 34, 0.12) 100%)',
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 16px 32px rgba(255, 152, 0, 0.2)',
                                    border: '1px solid rgba(255, 152, 0, 0.4)'
                                }
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                        <Avatar sx={{
                                            background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                                            width: 50,
                                            height: 50,
                                            boxShadow: '0 8px 16px rgba(255, 152, 0, 0.3)',
                                            border: '2px solid rgba(255,255,255,0.2)'
                                        }}>
                                            <FitnessCenter sx={{ fontSize: 24, color: 'white' }} />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{
                                                opacity: 0.9,
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                letterSpacing: 0.5,
                                                fontSize: '0.75rem',
                                                mb: 0.5
                                            }}>
                                                Thiết bị cần
                                            </Typography>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 800,
                                                color: 'white',
                                                fontSize: '1.1rem'
                                            }}>
                                                🏋️ {exercise.equipment.length} loại
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>                    {/* Revolutionary Call to Action Area với modern glassmorphism */}
                    <Box sx={{
                        textAlign: 'center',
                        p: 5,
                        position: 'relative',
                        borderRadius: 6,
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(25px)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 50%, rgba(255, 107, 107, 0.05) 100%)',
                            pointerEvents: 'none',
                            animation: 'shimmer 3s ease-in-out infinite'
                        },
                        '@keyframes shimmer': {
                            '0%, 100%': { opacity: 0.5 },
                            '50%': { opacity: 0.8 }
                        }
                    }}>
                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                            {/* Hero Icon Section */}
                            <Box sx={{
                                mb: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2
                            }}>
                                <Box sx={{
                                    background: 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)',
                                    borderRadius: '50%',
                                    p: 3,
                                    boxShadow: '0 20px 40px rgba(255, 215, 0, 0.3)',
                                    border: '3px solid rgba(255,255,255,0.3)',
                                    position: 'relative',
                                    animation: 'pulse 2s ease-in-out infinite',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: -5,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, rgba(255,215,0,0.3), transparent)',
                                        zIndex: -1
                                    },
                                    '@keyframes pulse': {
                                        '0%, 100%': { transform: 'scale(1)' },
                                        '50%': { transform: 'scale(1.05)' }
                                    }
                                }}>
                                    <EmojiEvents sx={{
                                        fontSize: 56,
                                        color: 'white',
                                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                                    }} />
                                </Box>
                            </Box>

                            {/* Title & Description */}
                            <Typography variant="h3" sx={{
                                mb: 3,
                                fontWeight: 900,
                                background: 'linear-gradient(135deg, #fff 0%, #e3f2fd 50%, #fff 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                letterSpacing: '-1px',
                                lineHeight: 1.2
                            }}>
                                🚀 Sẵn sàng chinh phục thử thách?
                            </Typography>

                            <Box sx={{
                                mb: 5,
                                maxWidth: 700,
                                mx: 'auto'
                            }}>
                                <Typography variant="h5" sx={{
                                    mb: 2,
                                    opacity: 0.95,
                                    color: 'rgba(255,255,255,0.9)',
                                    fontWeight: 600,
                                    lineHeight: 1.6,
                                    fontStyle: 'italic'
                                }}>
                                    "Hành trình nghìn dặm bắt đầu từ bước chân đầu tiên"
                                </Typography>
                                <Typography variant="body1" sx={{
                                    opacity: 0.85,
                                    color: 'rgba(255,255,255,0.8)',
                                    fontWeight: 500,
                                    lineHeight: 1.7,
                                    maxWidth: 600,
                                    mx: 'auto'
                                }}>
                                    Hãy bắt đầu với các bước cơ bản và từ từ nâng cao độ khó.
                                    Nhớ luôn chú ý đến kỹ thuật để đạt hiệu quả tối ưu và tránh chấn thương! 💪
                                </Typography>
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{
                                display: 'flex',
                                gap: 4,
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                alignItems: 'center'
                            }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        background: 'linear-gradient(135deg, #00c851 0%, #00ff00 50%, #007e33 100%)',
                                        color: 'white',
                                        border: '2px solid rgba(255,255,255,0.4)',
                                        px: 6,
                                        py: 2.5,
                                        borderRadius: 6,
                                        fontWeight: 800,
                                        fontSize: '1.2rem',
                                        minWidth: 260,
                                        textTransform: 'none',
                                        boxShadow: '0 12px 30px rgba(0, 200, 81, 0.4)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: '-100%',
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                            transition: 'left 0.6s ease'
                                        },
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #007e33 0%, #00c851 50%, #00ff00 100%)',
                                            transform: 'translateY(-6px) scale(1.05)',
                                            boxShadow: '0 20px 45px rgba(0, 200, 81, 0.6)',
                                            '&::before': {
                                                left: '100%'
                                            }
                                        }
                                    }}
                                    startIcon={<PlayArrow sx={{ fontSize: '2rem' }} />}
                                    onClick={() => {
                                        console.log('Starting workout with:', exercise.name);
                                        // TODO: Add workout start logic
                                    }}
                                >
                                    Bắt đầu luyện tập
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.6)',
                                        borderWidth: '2px',
                                        px: 5,
                                        py: 2.5,
                                        borderRadius: 6,
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        textTransform: 'none',
                                        backdropFilter: 'blur(15px)',
                                        background: 'rgba(255,255,255,0.05)',
                                        minWidth: 200,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        },
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.15)',
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 12px 25px rgba(255,255,255,0.2)',
                                            '&::before': {
                                                opacity: 1
                                            }
                                        }
                                    }}
                                    startIcon={<BookmarkBorder sx={{ fontSize: '1.4rem' }} />}
                                >
                                    Lưu bài tập
                                </Button>
                            </Box>

                            {/* Bottom Stats */}
                            <Box sx={{
                                mt: 5,
                                pt: 4,
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 6,
                                flexWrap: 'wrap'
                            }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{
                                        fontWeight: 900,
                                        color: '#4caf50',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                    }}>
                                        {exercise.primaryMuscleGroups.length}+
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: 1
                                    }}>
                                        Nhóm cơ
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{
                                        fontWeight: 900,
                                        color: '#ff9800',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                    }}>
                                        {exercise.caloriesPerMinute}
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: 1
                                    }}>
                                        Cal/phút
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{
                                        fontWeight: 900,
                                        color: '#2196f3',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                    }}>
                                        {exercise.instructions.length}
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: 1
                                    }}>
                                        Bước
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

/**
 * Enhanced Variations Section Component
 */
const EnhancedVariationsSection: React.FC<{ variations: any[] }> = ({ variations }) => {
    if (!variations || variations.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    🚧 Chưa có biến thể nào
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Các biến thể sẽ được cập nhật trong thời gian tới
                </Typography>
            </Box>
        );
    } return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr', // 1 column on mobile
                    md: 'repeat(2, 1fr)', // 2 columns on tablet
                    lg: 'repeat(3, 1fr)' // 3 columns on desktop
                },
                gap: 3,
                gridAutoRows: '1fr' // 🎯 Force all rows to have same height
            }}
        >            {variations.map((variation, index) => (
            <Card
                key={index}
                elevation={2}
                sx={{
                    width: '100%', // 🎯 Take full width of Grid item
                    height: '100%', // 🎯 Take full height available
                    minHeight: '420px', // 🎯 Consistent minimum height
                    background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                        borderColor: 'primary.main',
                    },
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <CardContent
                    sx={{
                        p: 3,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}
                >                        {/* Header */}
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                                sx={{
                                    bgcolor: variation.difficultyModifier === 'easier' ? '#4caf50' :
                                        variation.difficultyModifier === 'harder' ? '#f44336' : '#ff9800',
                                    width: 32,
                                    height: 32,
                                    mr: 1.5
                                }}
                            >
                                {variation.difficultyModifier === 'easier' ? '🟢' :
                                    variation.difficultyModifier === 'harder' ? '🔴' : '🟡'}
                            </Avatar>
                            <Typography
                                variant="h6"
                                fontWeight="600"
                                color="primary.main"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: 1.2,
                                    minHeight: '2.4em' // 🎯 Fixed height for titles
                                }}
                            >
                                {variation.name}
                            </Typography>
                        </Box>

                        {/* Difficulty Badge */}
                        <Chip
                            label={
                                variation.difficultyModifier === 'easier' ? 'Dễ hơn' :
                                    variation.difficultyModifier === 'harder' ? 'Khó hơn' : 'Biến thể'
                            }
                            size="small"
                            color={
                                variation.difficultyModifier === 'easier' ? 'success' :
                                    variation.difficultyModifier === 'harder' ? 'error' : 'warning'
                            }
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>

                    {/* Description - Flexible middle section */}
                    <Box sx={{ mb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography
                            variant="body1"
                            sx={{
                                lineHeight: 1.6,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 4, // 🎯 Increased to 4 lines for better content display
                                WebkitBoxOrient: 'vertical',
                                minHeight: '6.4em' // 🎯 Adjusted for 4 lines
                            }}
                        >
                            {variation.description}
                        </Typography>
                    </Box>                        {/* Instructions - Fixed bottom section */}
                    <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(0,0,0,0.06)', minHeight: '11em' }}>
                        {variation.instructions && variation.instructions.length > 0 ? (
                            <>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                                    📋 Hướng dẫn:
                                </Typography>
                                <Box
                                    component="ol"
                                    sx={{
                                        pl: 2,
                                        m: 0,
                                        height: '9em', // 🎯 Fixed height for instructions
                                        overflow: 'hidden'
                                    }}
                                >
                                    {variation.instructions.slice(0, 4).map((step: string, stepIndex: number) => (
                                        <Box component="li" key={stepIndex} sx={{ mb: 0.5 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontSize: '0.875rem',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical'
                                                }}
                                            >
                                                {step}
                                            </Typography>
                                        </Box>
                                    ))}
                                    {variation.instructions.length > 4 && (
                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            +{variation.instructions.length - 4} bước khác...
                                        </Typography>
                                    )}
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '9em' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    💡 Thực hiện tương tự bài tập gốc
                                </Typography>
                            </Box>
                        )}                        </Box>
                </CardContent>
            </Card>
        ))}
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
            border: `1px solid ${color}20`,
            flex: 1,
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
 * Compact Timeline Instructions Tab Component
 */
const InstructionsTab: React.FC<{ instructions: string[] }> = ({ instructions }) => (
    <Box>
        <Box sx={{ position: 'relative', overflowY: 'auto' }}>
            {/* Timeline Progress Line */}
            <Box
                sx={{
                    position: 'absolute',
                    left: 14, // Adjusted for smaller circle
                    top: 16,
                    bottom: 16,
                    width: 2,
                    bgcolor: 'primary.light',
                    opacity: 0.3,
                    zIndex: 0
                }}
            />

            {instructions.map((step, index) => (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        mb: 1.5, // Reduced from 3 to 1.5
                        position: 'relative',
                        '&:last-child': {
                            mb: 0
                        }
                    }}
                >
                    {/* Compact Step Number Circle */}
                    <Box
                        sx={{
                            width: 28, // Reduced from 40 to 28
                            height: 28,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '13px', // Reduced from 16px to 13px
                            flexShrink: 0,
                            mr: 2, // Reduced from 3 to 2
                            position: 'relative',
                            zIndex: 1,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)', // Reduced shadow
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)', // Reduced from scale(1.1)
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }
                        }}
                    >
                        {index + 1}
                    </Box>

                    {/* Compact Step Content */}
                    <Box sx={{ flex: 1, pt: 0.5 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2, // Reduced from 3 to 2
                                bgcolor: 'rgba(255,255,255,0.8)',
                                border: '1px solid',
                                borderColor: 'rgba(33, 150, 243, 0.1)',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'primary.light',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', // Reduced shadow
                                    transform: 'translateY(-1px)'
                                }
                            }}
                        >
                            <Typography
                                variant="body2" // Changed from body1 to body2
                                sx={{
                                    lineHeight: 1.5, // Reduced from 1.7 to 1.5
                                    fontSize: '14px', // Reduced from 16px to 14px
                                    color: 'text.primary',
                                    fontWeight: 400
                                }}
                            >
                                {step}
                            </Typography>
                        </Paper>
                    </Box>
                </Box>
            ))}
        </Box>

        {/* Compact Summary Footer */}
        <Box
            sx={{
                mt: 2, // Reduced from 4 to 2
                p: 2, // Reduced from 3 to 2
                bgcolor: 'rgba(33, 150, 243, 0.1)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5, // Reduced from 2 to 1.5
                border: '1px solid rgba(33, 150, 243, 0.2)'
            }}
        >
            <CheckCircle sx={{ fontSize: 18, color: 'primary.main' }} /> {/* Reduced from 24 to 18 */}
            <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main', display: 'block' }}>
                    Hoàn thành tất cả {instructions.length} bước
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                    Thực hiện đúng kỹ thuật để đạt hiệu quả tối ưu
                </Typography>
            </Box>
        </Box>
    </Box>
);

/**
 * Muscle Groups Tab Component
 */
/**
 * Enhanced Safety Tab Component - Modern Design with Glassmorphism
 */
const EnhancedSafetyTab: React.FC<{
    precautions: string[];
    contraindications: string[];
}> = ({ precautions, contraindications }) => (
    <Box>
        {/* Precautions Section */}
        {precautions && precautions.length > 0 && (
            <Box sx={{ mb: 4 }}>
                <Card
                    elevation={0}
                    sx={{
                        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
                        border: '1px solid rgba(255, 152, 0, 0.2)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 8px 24px rgba(255, 152, 0, 0.15)',
                            border: '1px solid rgba(255, 152, 0, 0.3)'
                        }
                    }}
                >
                    {/* Header */}
                    <Box sx={{
                        p: 2.5,
                        background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Avatar sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            width: 36,
                            height: 36
                        }}>
                            <Warning sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                                ⚠️ Lưu ý quan trọng
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Các điều cần chú ý khi thực hiện bài tập
                            </Typography>
                        </Box>
                    </Box>

                    {/* Content */}
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {precautions.map((precaution, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 2,
                                        p: 2.5,
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(255, 152, 0, 0.1)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
                                            transform: 'translateX(4px)',
                                            borderColor: 'rgba(255, 152, 0, 0.2)'
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        minWidth: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '13px',
                                        boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)',
                                        mt: 0.2
                                    }}>
                                        {index + 1}
                                    </Box>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            lineHeight: 1.6,
                                            color: 'text.primary',
                                            fontWeight: 500
                                        }}
                                    >
                                        {precaution}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        )}

        {/* Contraindications Section */}
        {contraindications && contraindications.length > 0 && (
            <Box>
                <Card
                    elevation={0}
                    sx={{
                        background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.05) 100%)',
                        border: '1px solid rgba(244, 67, 54, 0.2)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 8px 24px rgba(244, 67, 54, 0.15)',
                            border: '1px solid rgba(244, 67, 54, 0.3)'
                        }
                    }}
                >
                    {/* Header */}
                    <Box sx={{
                        p: 2.5,
                        background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Avatar sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            width: 36,
                            height: 36
                        }}>
                            <Block sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                                🚫 Chống chỉ định
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Các trường hợp KHÔNG nên thực hiện bài tập này
                            </Typography>
                        </Box>
                    </Box>

                    {/* Content */}
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {contraindications.map((contraindication, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 2,
                                        p: 2.5,
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(244, 67, 54, 0.1)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
                                            transform: 'translateX(4px)',
                                            borderColor: 'rgba(244, 67, 54, 0.2)'
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        minWidth: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '13px',
                                        boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)',
                                        mt: 0.2
                                    }}>
                                        <Block sx={{ fontSize: 16 }} />
                                    </Box>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            lineHeight: 1.6,
                                            color: 'text.primary',
                                            fontWeight: 500
                                        }}
                                    >
                                        {contraindication}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        )}

        {/* Bottom Summary Card */}
        <Box sx={{ mt: 4 }}>
            <Card
                elevation={0}
                sx={{
                    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(21, 101, 192, 0.05) 100%)',
                    border: '1px solid rgba(33, 150, 243, 0.2)',
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)'
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#2196f3', width: 32, height: 32 }}>
                            <Info sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Typography variant="h6" fontWeight="600" color="primary.main">
                            Lời khuyên từ chuyên gia
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                        💡 <strong>Luôn khởi động kỹ trước khi tập</strong> và nghe cơ thể của bạn.
                        Nếu cảm thấy đau hoặc khó chịu, hãy dừng lại ngay lập tức.
                        Tham khảo ý kiến bác sĩ hoặc chuyên gia thể hình khi có nghi ngờ.
                    </Typography>
                </CardContent>
            </Card>
        </Box>    </Box>
);

/**
 * VideoGifSection Component - Toggle between video and GIF display
 */
interface VideoGifSectionProps {
    exercise: {
        videoUrl?: string;
        gifUrl?: string;
        name: string;
    };
}

const VideoGifSection: React.FC<VideoGifSectionProps> = ({ exercise }) => {
    const [showGif, setShowGif] = useState(true);
    const [mediaError, setMediaError] = useState(false);

    const hasVideo = Boolean(exercise.videoUrl);
    const hasGif = Boolean(exercise.gifUrl);

    if (!hasVideo && !hasGif) {
        return (
            <Paper
                elevation={0}
                sx={{
                    height: '100%',
                    p: 4,
                    borderRadius: 3,
                    border: '1px solid rgba(156, 39, 176, 0.2)',
                    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 300
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <GifBoxIcon sx={{ fontSize: 60, color: '#9c27b0', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Chưa có video hoặc hình minh họa
                    </Typography>
                </Box>
            </Paper>
        );
    }

    const isGifDisplay = showGif && hasGif;

    return (
        <Paper
            elevation={0}
            sx={{
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                // background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                border: '1px solid rgba(156, 39, 176, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 28px rgba(156, 39, 176, 0.15)'
                }
            }}
        >
            {/* Header */}
            <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                        {isGifDisplay ? <GifBoxIcon /> : <PlayCircleOutlineIcon />}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" component="h2" fontWeight="bold">
                            {isGifDisplay ? 'Hướng dẫn minh họa' : 'Video hướng dẫn'}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {isGifDisplay ? 'Xem động tác chi tiết' : 'Xem video thực hiện'}
                        </Typography>
                    </Box>
                </Box>

                {/* Toggle Switch - Only show if both video and GIF exist */}
                {hasVideo && hasGif && (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showGif}
                                onChange={(e) => {
                                    setShowGif(e.target.checked);
                                    setMediaError(false);
                                }}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: 'white',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography variant="body2" sx={{ color: 'white', fontSize: '0.875rem' }}>
                                {showGif ? 'GIF' : 'Video'}
                            </Typography>
                        }
                        labelPlacement="start"
                    />
                )}
            </Box>

            {/* Media Content */}
            <Box sx={{ p: 3 }}>
                {mediaError ? (
                    <Box sx={{
                        textAlign: 'center',
                        py: 4,
                        minHeight: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Không thể tải {isGifDisplay ? 'hình minh họa' : 'video'}
                        </Alert>
                        <Button
                            variant="outlined"
                            onClick={() => setMediaError(false)}
                            startIcon={<PlayCircleOutlineIcon />}
                        >
                            Thử lại
                        </Button>
                    </Box>
                ) : (<Box sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    minHeight: 200,
                    // background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Box
                        sx={{
                            width: '100%',
                            opacity: mediaError ? 0 : 1,
                            transition: 'opacity 0.5s ease, transform 0.5s ease',
                            transform: mediaError ? 'scale(0.9)' : 'scale(1)',
                        }}
                    >
                        {isGifDisplay ? (
                            // GIF Display with fade effect
                            <Box
                                sx={{
                                    opacity: 1,
                                    transition: 'opacity 0.3s ease',
                                    animation: 'fadeIn 0.5s ease-in',
                                    '@keyframes fadeIn': {
                                        '0%': { opacity: 0, transform: 'translateY(10px)' },
                                        '100%': { opacity: 1, transform: 'translateY(0)' }
                                    }
                                }}
                            >
                                <img
                                    src={exercise.gifUrl}
                                    alt={`${exercise.name} - Hướng dẫn minh họa`}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        minHeight: '200px',
                                        objectFit: 'contain',
                                        borderRadius: '8px'
                                    }}
                                    onError={() => setMediaError(true)}
                                    loading="lazy"
                                />
                            </Box>
                        ) : (
                            // Video Display with fade effect
                            <Box
                                sx={{
                                    opacity: 1,
                                    transition: 'opacity 0.3s ease',
                                    animation: 'slideIn 0.5s ease-out',
                                    '@keyframes slideIn': {
                                        '0%': { opacity: 0, transform: 'translateX(20px)' },
                                        '100%': { opacity: 1, transform: 'translateX(0)' }
                                    }
                                }}
                            >
                                <video
                                    controls
                                    poster={exercise.gifUrl} // Use GIF as poster if available
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        minHeight: '200px',
                                        objectFit: 'contain',
                                        borderRadius: '8px'
                                    }}
                                    onError={() => setMediaError(true)}
                                >
                                    <source src={exercise.videoUrl} type="video/mp4" />
                                    <source src={exercise.videoUrl} type="video/webm" />
                                    <source src={exercise.videoUrl} type="video/ogg" />
                                    Trình duyệt của bạn không hỗ trợ phát video.
                                </video>
                            </Box>
                        )}
                    </Box>

                    {/* Media Type Indicator */}
                    <Chip
                        label={isGifDisplay ? 'GIF' : 'VIDEO'}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                        }}
                    />
                </Box>
                )}

                {/* Media Info */}
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {isGifDisplay
                            ? 'Hình minh họa động giúp bạn hiểu rõ từng bước thực hiện bài tập'
                            : 'Video hướng dẫn chi tiết với âm thanh và giải thích'
                        }
                    </Typography>
                </Box>

                {/* Available Media Types */}
                {hasVideo && hasGif && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Chip
                            label="Video có sẵn"
                            size="small"
                            icon={<PlayCircleOutlineIcon />}
                            variant={!showGif ? 'filled' : 'outlined'}
                            color={!showGif ? 'primary' : 'default'}
                        />
                        <Chip
                            label="GIF có sẵn"
                            size="small"
                            icon={<GifBoxIcon />}
                            variant={showGif ? 'filled' : 'outlined'}
                            color={showGif ? 'secondary' : 'default'}
                        />
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

/**
 * Loading Skeleton Component
 */
const ExerciseDetailSkeleton: React.FC = () => (
    <Box sx={{ py: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 3, mb: 4 }} />        <Grid container spacing={3} sx={{ mb: 4 }}>
            {[...Array(4)].map((_, index) => (
                // @ts-ignore
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                </Grid>
            ))}
        </Grid>
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
    </Box>
);

export default ExerciseDetailPage;
