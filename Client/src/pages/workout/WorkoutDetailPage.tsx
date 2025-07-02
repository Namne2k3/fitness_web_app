import React, { useState, useTransition } from 'react';
import {
    Box,
    Container,
    Typography,
    Avatar,
    Chip,
    Button,
    Paper,
    Divider,
    IconButton,
    Breadcrumbs,
    Link,
    Fade
} from '@mui/material';
import {
    FavoriteBorder,
    Favorite,
    BookmarkBorder,
    Bookmark,
    Share,
    PlayArrow,
    Timer,
    FitnessCenter,
    Star,
    StarBorder,
    Verified,
    TrendingUp,
    LocalFireDepartment,
    NavigateNext
} from '@mui/icons-material';

// Dữ liệu mẫu dựa trên interface types/
const mockWorkout = {
    _id: 'w1',
    name: 'Full Body HIIT',
    description: 'Bài tập HIIT toàn thân giúp đốt cháy mỡ hiệu quả.',
    thumbnail: '',
    category: 'cardio',
    difficulty: 'intermediate',
    estimatedDuration: 40,
    tags: ['HIIT', 'Fat Burn', 'Cardio'],
    isSponsored: true,
    sponsorData: {
        company: 'Optimum Nutrition',
        campaign: 'Summer Shred',
        rate: 300,
        type: 'promotion',
        disclosure: 'Bài tập này được tài trợ bởi Optimum Nutrition.'
    },
    userId: 'u1',
    likeCount: 120,
    saveCount: 45,
    shareCount: 10,
    isLiked: false,
    isSaved: false,
    createdAt: '2025-06-20T10:00:00Z',
    exercises: [
        {
            exerciseId: 'e1',
            name: 'Jumping Jacks',
            sets: 3,
            reps: 20,
            duration: 60,
            weight: 0,
            restTime: 30,
            notes: '',
            completed: false
        },
        {
            exerciseId: 'e2',
            name: 'Push Ups',
            sets: 3,
            reps: 15,
            duration: 0,
            weight: 0,
            restTime: 30,
            notes: '',
            completed: false
        }
    ]
};

const mockAuthor = {
    _id: 'u1',
    username: 'fitguru',
    profile: {
        firstName: 'Minh',
        lastName: 'Nguyen',
        avatar: '',
        experienceLevel: 'advanced'
    },
    isEmailVerified: true
};

const mockReviews = [
    {
        _id: 'r1',
        userId: 'u2',
        rating: { overall: 5 },
        content: 'Bài tập rất hiệu quả, mình giảm 2kg sau 2 tuần!',
        createdAt: '2025-06-22T09:00:00Z',
        verified: true
    },
    {
        _id: 'r2',
        userId: 'u3',
        rating: { overall: 4 },
        content: 'Khá mệt nhưng rất đáng thử.',
        createdAt: '2025-06-23T11:00:00Z',
        verified: false
    }
];

/**
 * 🏋️ WorkoutDetailPage - Modern UI với Design System
 */
const WorkoutDetailPage: React.FC = () => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleLike = () => {
        startTransition(() => {
            setIsLiked(!isLiked);
        });
    };

    const handleSave = () => {
        startTransition(() => {
            setIsSaved(!isSaved);
        });
    };

    const handleShare = () => {
        console.log('Share workout');
    };

    const handleStartWorkout = () => {
        console.log('Start workout');
    };

    return (
        <Fade in timeout={500}>
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #1976d2 0%, #ff9800 100%)',
                    pb: 4,
                    pt: { xs: 10, md: 12 }
                }}
            >
                <Container maxWidth="lg">
                    {/* Breadcrumbs */}
                    <Breadcrumbs
                        separator={<NavigateNext fontSize="small" />}
                        sx={{ mb: 3, color: 'rgba(255,255,255,0.8)' }}
                    >
                        <Link color="inherit" href="/" sx={{ textDecoration: 'none' }}>
                            Trang chủ
                        </Link>
                        <Link color="inherit" href="/workouts" sx={{ textDecoration: 'none' }}>
                            Workouts
                        </Link>
                        <Typography color="white" fontWeight={600}>
                            {mockWorkout.name}
                        </Typography>
                    </Breadcrumbs>

                    {/* Hero Header Card */}
                    <Paper
                        elevation={20}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            mb: 4,
                            border: '1px solid rgba(255,255,255,0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                            }
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: { xs: 'center', md: 'flex-start' },
                                gap: 3,
                                textAlign: { xs: 'center', md: 'left' }
                            }}
                        >
                            {/* Workout Thumbnail */}
                            <Box
                                sx={{
                                    width: { xs: '100%', md: 200 },
                                    height: 200,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '4rem',
                                    flexShrink: 0,
                                    boxShadow: '0 8px 32px rgba(102,126,234,0.3)'
                                }}
                            >
                                <FitnessCenter sx={{ fontSize: 'inherit' }} />
                            </Box>

                            {/* Workout Info */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                {/* Title and Author */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="h3"
                                        component="h1"
                                        sx={{
                                            fontWeight: 800,
                                            background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            mb: 1,
                                            fontSize: { xs: '2rem', md: '3rem' }
                                        }}
                                    >
                                        {mockWorkout.name}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Avatar
                                            src={mockAuthor.profile.avatar}
                                            alt={mockAuthor.username}
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                border: '2px solid rgba(25,118,210,0.2)'
                                            }}
                                        />
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {mockAuthor.profile.firstName} {mockAuthor.profile.lastName}
                                                {mockAuthor.isEmailVerified && (
                                                    <Verified sx={{ ml: 1, fontSize: 16, color: '#4caf50' }} />
                                                )}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(mockWorkout.createdAt).toLocaleDateString('vi-VN')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Tags and Difficulty */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                    <Chip
                                        label={mockWorkout.difficulty}
                                        color="primary"
                                        sx={{ fontWeight: 600 }}
                                    />
                                    <Chip
                                        label={mockWorkout.category}
                                        color="secondary"
                                        sx={{ fontWeight: 600 }}
                                    />
                                    <Chip
                                        icon={<Timer />}
                                        label={`${mockWorkout.estimatedDuration} phút`}
                                        variant="outlined"
                                        sx={{ fontWeight: 600 }}
                                    />
                                    {mockWorkout.isSponsored && (
                                        <Chip
                                            label="Sponsored"
                                            color="warning"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    )}
                                </Box>

                                {/* Action Buttons */}
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<PlayArrow />}
                                        onClick={handleStartWorkout}
                                        disabled={isPending}
                                        sx={{
                                            background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 3,
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                boxShadow: '0 8px 25px rgba(25,118,210,0.3)'
                                            }
                                        }}
                                    >
                                        Bắt đầu tập
                                    </Button>

                                    <IconButton
                                        onClick={handleLike}
                                        disabled={isPending}
                                        sx={{
                                            bgcolor: isLiked ? 'rgba(244,67,54,0.1)' : 'rgba(0,0,0,0.04)',
                                            color: isLiked ? '#f44336' : 'text.secondary',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: isLiked ? 'rgba(244,67,54,0.2)' : 'rgba(0,0,0,0.08)',
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        {isLiked ? <Favorite /> : <FavoriteBorder />}
                                    </IconButton>

                                    <IconButton
                                        onClick={handleSave}
                                        disabled={isPending}
                                        sx={{
                                            bgcolor: isSaved ? 'rgba(255,152,0,0.1)' : 'rgba(0,0,0,0.04)',
                                            color: isSaved ? '#ff9800' : 'text.secondary',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: isSaved ? 'rgba(255,152,0,0.2)' : 'rgba(0,0,0,0.08)',
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        {isSaved ? <Bookmark /> : <BookmarkBorder />}
                                    </IconButton>

                                    <IconButton
                                        onClick={handleShare}
                                        sx={{
                                            bgcolor: 'rgba(0,0,0,0.04)',
                                            color: 'text.secondary',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: 'rgba(0,0,0,0.08)',
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        <Share />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Quick Stats Cards */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                            gap: 2,
                            mb: 4
                        }}
                    >
                        <Paper
                            elevation={8}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(33,150,243,0.2)'
                                }
                            }}
                        >
                            <Timer sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                            <Typography variant="h6" fontWeight={700} color="#2196f3">
                                {mockWorkout.estimatedDuration}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Phút
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={8}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(255,152,0,0.2)'
                                }
                            }}
                        >
                            <LocalFireDepartment sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                            <Typography variant="h6" fontWeight={700} color="#ff9800">
                                {mockWorkout.estimatedDuration * 8}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Calories
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={8}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(76,175,80,0.2)'
                                }
                            }}
                        >
                            <TrendingUp sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                            <Typography variant="h6" fontWeight={700} color="#4caf50">
                                {mockWorkout.difficulty === 'beginner' ? '3' : mockWorkout.difficulty === 'intermediate' ? '6' : '9'}/10
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Cường độ
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={8}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(156,39,176,0.2)'
                                }
                            }}
                        >
                            <FitnessCenter sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
                            <Typography variant="h6" fontWeight={700} color="#9c27b0">
                                {mockWorkout.exercises.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Bài tập
                            </Typography>
                        </Paper>
                    </Box>

                    {/* Description Card */}
                    <Paper
                        elevation={8}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            mb: 4,
                            background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 16px 32px rgba(0,0,0,0.1)'
                            }
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{
                                mb: 2,
                                background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Mô tả workout
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
                            {mockWorkout.description}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Tags
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {mockWorkout.tags.map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: 'rgba(25,118,210,0.1)',
                                            borderColor: '#1976d2'
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>

                    {/* Exercise List Card */}
                    <Paper
                        elevation={8}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            mb: 4,
                            background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 16px 32px rgba(0,0,0,0.1)'
                            }
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{
                                mb: 3,
                                background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Danh sách bài tập ({mockWorkout.exercises.length})
                        </Typography>

                        {mockWorkout.exercises.map((ex, idx) => (
                            <Paper
                                key={ex.exerciseId}
                                elevation={2}
                                sx={{
                                    p: 3,
                                    mb: 2,
                                    borderRadius: 3,
                                    background: `linear-gradient(135deg, ${idx % 4 === 0 ? '#e3f2fd, #bbdefb' :
                                        idx % 4 === 1 ? '#fff3e0, #ffe0b2' :
                                            idx % 4 === 2 ? '#e8f5e8, #c8e6c9' :
                                                '#f3e5f5, #e1bee7'
                                        })`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateX(8px)',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {idx + 1}
                                    </Box>
                                    <Typography variant="h6" fontWeight={600}>
                                        {ex.name}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 5 }}>
                                    <Chip
                                        label={`${ex.sets} sets`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                    <Chip
                                        label={`${ex.reps} reps`}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                    />
                                    {ex.duration && (
                                        <Chip
                                            label={`${ex.duration}s`}
                                            size="small"
                                            color="success"
                                            variant="outlined"
                                        />
                                    )}
                                    <Chip
                                        label={`Nghỉ ${ex.restTime}s`}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                            </Paper>
                        ))}
                    </Paper>

                    {/* Reviews Card */}
                    <Paper
                        elevation={8}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            mb: 4,
                            background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 16px 32px rgba(0,0,0,0.1)'
                            }
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{
                                mb: 3,
                                background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Đánh giá ({mockReviews.length})
                        </Typography>

                        {mockReviews.map(r => (
                            <Paper
                                key={r._id}
                                elevation={2}
                                sx={{
                                    p: 3,
                                    mb: 2,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateX(4px)',
                                        boxShadow: '0 6px 12px rgba(233,30,99,0.15)'
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar sx={{ bgcolor: '#e91e63', width: 32, height: 32 }}>
                                        U
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            User {r.userId}
                                            {r.verified && (
                                                <Verified sx={{ ml: 1, fontSize: 16, color: '#4caf50' }} />
                                            )}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            {[...Array(5)].map((_, i) => (
                                                i < r.rating.overall ?
                                                    <Star key={i} sx={{ fontSize: 16, color: '#ff9800' }} /> :
                                                    <StarBorder key={i} sx={{ fontSize: 16, color: '#ccc' }} />
                                            ))}
                                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                    {r.content}
                                </Typography>
                            </Paper>
                        ))}

                        <Button
                            variant="contained"
                            sx={{
                                mt: 2,
                                background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
                                borderRadius: 3,
                                px: 3,
                                py: 1.5,
                                fontWeight: 600,
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: '0 6px 16px rgba(233,30,99,0.3)'
                                }
                            }}
                        >
                            Viết đánh giá
                        </Button>
                    </Paper>

                    {/* Sponsored Info */}
                    {mockWorkout.isSponsored && (
                        <Paper
                            elevation={8}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                mb: 4,
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 16px 32px rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                    mb: 2,
                                    background: 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Thông tin tài trợ
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                                {mockWorkout.sponsorData.disclosure}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                <Chip
                                    label={`Chiến dịch: ${mockWorkout.sponsorData.campaign}`}
                                    color="secondary"
                                    variant="outlined"
                                />
                                <Chip
                                    label={`Đơn vị: ${mockWorkout.sponsorData.company}`}
                                    color="secondary"
                                    variant="outlined"
                                />
                            </Box>
                        </Paper>
                    )}
                </Container>
            </Box>
        </Fade>
    );
};

export default WorkoutDetailPage;
