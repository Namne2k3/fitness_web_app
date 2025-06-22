/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore - MUI Grid type conflicts resolved
/* eslint-disable */
import React, { useOptimistic, useTransition } from 'react';
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
    Link,
    IconButton
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
    TrendingUp, Group,
    Verified,
    Refresh,
    Whatshot,
    PlayCircleOutline as PlayCircleOutlineIcon,
    Gif as GifBoxIcon,
} from '@mui/icons-material';
import { ExerciseService } from '../../services/exerciseService';
// import { useExercise } from '../../hooks/useExercises'; // 🚀 Commented out for mock data testing

/**
 * 🚀 MOCK DATA - For UI testing before API implementation
 */
const mockExerciseData = {
    id: 'mock-push-up-123',
    name: 'Push-ups (Hít đất)',
    description: 'Bài tập hít đất là một bài tập cơ bản giúp tăng cường sức mạnh cho ngực, vai và cánh tay. Đây là bài tập không cần thiết bị và có thể thực hiện ở bất kỳ đâu.',
    category: 'Strength Training',
    difficulty: 'beginner',
    isApproved: true,
    likeCount: 245,
    caloriesPerMinute: 8,
    averageIntensity: 6,
    primaryMuscleGroups: ['Ngực', 'Vai trước', 'Tay sau'],
    secondaryMuscleGroups: ['Cơ core', 'Cơ lưng'],
    equipment: ['Không cần thiết bị'],

    // 🎥 Media content
    images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', // Push-up position 1
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80', // Push-up position 2
        'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80', // Push-up form
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'  // Push-up variations
    ],
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', // Demo video
    gifUrl: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', // Animated demo
    instructions: [
        'Bắt đầu ở tư thế plank với hai tay đặt rộng bằng vai, cánh tay thẳng',
        'Giữ thân người thẳng từ đầu đến gót chân',
        'Hạ thấp cơ thể bằng cách uốn cùi chỏ cho đến khi ngực gần chạm đất',
        'Đẩy cơ thể lên về vị trí ban đầu bằng cách duỗi thẳng cánh tay',
        'Lặp lại động tác với nhịp độ đều đặn và kiểm soát'
    ],
    precautions: [
        'Giữ cổ tay thẳng và không bị gập quá mức',
        'Không để hông chảy xệ hoặc nâng cao quá mức',
        'Thực hiện động tác chậm và có kiểm soát',
        'Dừng lại nếu cảm thấy đau ở cổ tay hoặc vai'
    ],
    contraindications: [
        'Chấn thương cổ tay hoặc vai gần đây',
        'Vấn đề về cột sống thắt lưng nghiêm trọng',
        'Hội chứng ống cổ tay',
        'Phụ nữ mang thai (nên tham khảo bác sĩ)'
    ],
    variations: [
        {
            name: 'Push-up trên đầu gối',
            description: 'Phiên bản dễ hơn cho người mới bắt đầu',
            difficultyModifier: 'easier',
            instructions: [
                'Quỳ xuống với đầu gối chạm đất thay vì duỗi thẳng chân',
                'Giữ thân trên thẳng từ đầu đến đầu gối',
                'Thực hiện động tác hít đất như bình thường'
            ]
        },
        {
            name: 'Diamond Push-ups',
            description: 'Phiên bản khó hơn tập trung vào tay sau',
            difficultyModifier: 'harder',
            instructions: [
                'Đặt hai tay tạo thành hình kim cương dưới ngực',
                'Thực hiện động tác hít đất với tư thế tay này',
                'Tập trung lực vào tay sau'
            ]
        },
        {
            name: 'Wide-grip Push-ups',
            description: 'Biến thể tập trung vào cơ ngực',
            difficultyModifier: 'variation',
            instructions: [
                'Đặt tay rộng hơn vai khoảng 1.5 lần',
                'Thực hiện động tác hít đất bình thường',
                'Cảm nhận sự kéo giãn ở vùng ngực'
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

                    {/* @ts-ignore */}
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

            {/* Compact Muscle Groups Section */}
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
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: { xs: 'stretch', sm: 'center' } }}>
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
            </Paper>            {/* Stats Cards */}
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
                </Grid>                {/* Video/GIF Section */}
                {/* @ts-ignore */}
                <Grid size={{ xs: 12, md: 6 }}>
                    {(exercise.videoUrl || exercise.gifUrl) ? (
                        <Paper
                            elevation={2}
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                overflow: 'hidden',
                                background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                                border: '1px solid rgba(76, 175, 80, 0.2)'
                            }}
                        >
                            <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Avatar sx={{ bgcolor: '#4caf50', width: 40, height: 40, mr: 2 }}>
                                        {exercise.videoUrl ? <PlayCircleOutlineIcon /> : <GifBoxIcon />}
                                    </Avatar>
                                    <Typography variant="h5" fontWeight="bold" color="#388e3c">
                                        {exercise.videoUrl ? 'Video hướng dẫn' : 'Hướng dẫn động'}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        background: '#000',
                                        minHeight: '300px'
                                    }}
                                >
                                    {exercise.videoUrl ? (
                                        <video
                                            controls
                                            poster={exercise.images?.[0]}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                maxHeight: '400px',
                                                objectFit: 'cover'
                                            }}
                                        >
                                            <source src={exercise.videoUrl} type="video/mp4" />
                                            Trình duyệt của bạn không hỗ trợ phát video.
                                        </video>
                                    ) : exercise.gifUrl ? (
                                        <img
                                            src={exercise.gifUrl}
                                            alt="Exercise demonstration"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                maxHeight: '400px',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    ) : null}
                                </Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ textAlign: 'center', mt: 2 }}
                                >
                                    💡 Theo dõi kỹ thuật thực hiện để đảm bảo hiệu quả và an toàn
                                </Typography>
                            </Box>
                        </Paper>
                    ) : (
                        <Paper elevation={0} sx={{ height: '100%', p: 4, borderRadius: 3, border: '1px dashed rgba(76, 175, 80, 0.3)', background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <PlayCircleOutlineIcon sx={{ fontSize: 64, color: 'rgba(76, 175, 80, 0.3)', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    Video hướng dẫn đang được cập nhật
                                </Typography>
                            </Box>
                        </Paper>
                    )}                </Grid>            </Grid>            {/* 🔄 Variations Section - Full Width */}
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
            </Grid>

            {/* Safety Section */}
            <Paper elevation={0} sx={{ mb: 4, p: 4, borderRadius: 3, border: '1px solid rgba(244, 67, 54, 0.2)', background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#f44336', width: 40, height: 40, mr: 2 }}>
                        <Verified />
                    </Avatar>
                    <Typography variant="h5" component="h2" fontWeight="bold" color="#d32f2f">
                        Hướng dẫn an toàn
                    </Typography>
                </Box>
                <SafetyTab
                    precautions={exercise.precautions}
                    contraindications={exercise.contraindications}
                />
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
                                variant="outlined" sx={{
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
