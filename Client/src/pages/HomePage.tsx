/**
 * Trang chủ của Fitness Web App - Modern UI với React 19 & Material UI
 * Features: Hero section, Feature cards, Stats, CTA, Responsive design
 */
import React from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    Avatar,
    Paper,
    Chip,
    Grid,
    IconButton,
    Divider,
    useTheme,
    alpha,
} from '@mui/material';
import {
    FitnessCenter,
    TrendingUp,
    People,
    EmojiEvents,
    PlayArrow,
    Login,
    PersonAdd,
    Star,
    ArrowForward,
    Timer,
    LocalFireDepartment,
    Timeline,
    Groups,
    CheckCircle,
    Verified,
    AutoAwesome,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    gradient: string;
}

interface StatCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    color: string;
}

interface TestimonialProps {
    name: string;
    role: string;
    content: string;
    avatar: string;
    rating: number;
}

/**
 * Component cho feature card với animation và hover effects
 */
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color, gradient }) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                borderRadius: 4,
                border: 'none',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: `0 25px 50px ${alpha(theme.palette[color].main, 0.25)}`,
                    '& .feature-icon': {
                        transform: 'rotate(360deg) scale(1.1)',
                    },
                    '& .feature-bg': {
                        transform: 'scale(1.2)',
                        opacity: 0.1,
                    }
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: gradient,
                }
            }}
        >
            <Box
                className="feature-bg"
                sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    background: gradient,
                    borderRadius: '50%',
                    opacity: 0.05,
                    transition: 'all 0.4s ease',
                }}
            />
            <CardContent sx={{ textAlign: 'center', p: 4, position: 'relative', zIndex: 1 }}>
                <Box
                    className="feature-icon"
                    sx={{
                        display: 'inline-flex',
                        p: 3,
                        borderRadius: '50%',
                        background: gradient,
                        color: 'white',
                        mb: 3,
                        fontSize: '2rem',
                        transition: 'all 0.4s ease',
                        boxShadow: `0 8px 25px ${alpha(theme.palette[color].main, 0.3)}`,
                    }}
                >
                    {icon}
                </Box>
                <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 2,
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        lineHeight: 1.7,
                        fontSize: '0.95rem',
                    }}
                >
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};

/**
 * Component cho stat card hiển thị số liệu thống kê
 */
const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => (
    <Box
        sx={{
            textAlign: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)',
            }
        }}
    >
        <Box
            sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: '50%',
                bgcolor: `${color}.light`,
                color: `${color}.main`,
                mb: 2,
                fontSize: '1.5rem',
            }}
        >
            {icon}
        </Box>
        <Typography
            variant="h2"
            color={`${color}.main`}
            gutterBottom
            sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3rem' },
                background: `linear-gradient(45deg, ${color === 'primary' ? '#667eea, #764ba2' : color === 'secondary' ? '#f093fb, #f5576c' : color === 'success' ? '#4facfe, #00f2fe' : '#ffecd2, #fcb69f'})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}
        >
            {value}
        </Typography>
        <Typography
            variant="h6"
            color="text.secondary"
            sx={{
                fontWeight: 600,
                fontSize: '1rem',
            }}
        >
            {label}
        </Typography>
    </Box>
);

/**
 * Component testimonial
 */
const TestimonialCard: React.FC<TestimonialProps> = ({ name, role, content, avatar, rating }) => (
    <Card
        sx={{
            height: '100%',
            p: 3,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }
        }}
    >
        <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                {[...Array(rating)].map((_, i) => (
                    <Star key={i} sx={{ color: '#ffd700', fontSize: '1.2rem' }} />
                ))}
            </Box>
            <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                "{content}"
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={avatar} sx={{ width: 50, height: 50 }} />
                <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {role}
                    </Typography>
                </Box>
            </Box>
        </Stack>
    </Card>
);

/**
 * HomePage component - Trang chủ với modern design và responsive layout
 */
export default function HomePage() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const features = [
        {
            icon: <FitnessCenter />,
            title: 'Smart Workout Plans',
            description: 'Kế hoạch tập luyện thông minh được cá nhân hóa theo mục tiêu và thể trạng của bạn',
            color: 'primary',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
            icon: <Timeline />,
            title: 'Progress Analytics',
            description: 'Phân tích tiến độ chi tiết với biểu đồ trực quan và báo cáo thông minh',
            color: 'secondary',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        },
        {
            icon: <Groups />,
            title: 'Fitness Community',
            description: 'Kết nối với cộng đồng fitness năng động, chia sẻ kinh nghiệm và động lực',
            color: 'success',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        },
        {
            icon: <EmojiEvents />,
            title: 'Achievement System',
            description: 'Hệ thống thành tích và thử thách đa dạng để duy trì động lực luyện tập',
            color: 'warning',
            gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        },
    ];

    const stats = [
        {
            label: 'Thành viên tích cực',
            value: '25K+',
            icon: <People />,
            color: 'primary'
        },
        {
            label: 'Bài tập hoàn thành',
            value: '150K+',
            icon: <LocalFireDepartment />,
            color: 'secondary'
        },
        {
            label: 'Huấn luyện viên',
            value: '1,200+',
            icon: <Verified />,
            color: 'success'
        },
        {
            label: 'Đánh giá tích cực',
            value: '98%',
            icon: <AutoAwesome />,
            color: 'warning'
        },
    ];

    const testimonials = [
        {
            name: 'Nguyễn Minh Anh',
            role: 'Kế toán viên',
            content: 'Ứng dụng tuyệt vời! Tôi đã giảm được 15kg trong 6 tháng nhờ kế hoạch tập luyện khoa học.',
            avatar: '/api/placeholder/50/50',
            rating: 5,
        },
        {
            name: 'Trần Văn Nam',
            role: 'Lập trình viên',
            content: 'Giao diện đẹp, dễ sử dụng. Cộng đồng rất hỗ trợ và tích cực. Rất recommend!',
            avatar: '/api/placeholder/50/50',
            rating: 5,
        },
        {
            name: 'Lê Thị Hoa',
            role: 'Marketing Manager',
            content: 'Theo dõi tiến độ rất chi tiết, giúp tôi duy trì động lực tập luyện mỗi ngày.',
            avatar: '/api/placeholder/50/50',
            rating: 5,
        },
    ];

    return (
        <Box sx={{ overflow: 'hidden' }}>
            {/* Hero Section với background gradient và animation */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    color: 'white',
                    py: { xs: '8rem', md: '10rem', sm: '10rem' },
                    position: 'relative',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
                            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
                        `,
                        animation: 'float 8s ease-in-out infinite',
                    },
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={6} alignItems="center" justifyContent="center">
                        <Grid item xs={12} md={6} >
                            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                {/* <Chip
                                    label="🚀 PHIÊN BẢN MỚI"
                                    sx={{
                                        mb: 3,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.3)',
                                        }
                                    }}
                                /> */}
                                <Typography
                                    variant="h1"
                                    component="h1"
                                    sx={{
                                        fontSize: { xs: '2.8rem', md: '4rem' },
                                        fontWeight: 900,
                                        mb: 3,
                                        background: 'linear-gradient(45deg, #fff 20%, rgba(255,255,255,0.8) 80%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                                        lineHeight: 1.1,
                                    }}
                                >
                                    Transform Your
                                    <br />
                                    <Box component="span" sx={{ color: '#FFD700' }}>
                                        Fitness Journey
                                    </Box>
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        mb: 4,
                                        opacity: 0.95,
                                        fontWeight: 400,
                                        lineHeight: 1.6,
                                        maxWidth: 500,
                                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                                    }}
                                >
                                    Khám phá sức mạnh tiềm ẩn với hệ thống AI thông minh,
                                    theo dõi tiến độ real-time và cộng đồng hỗ trợ 24/7.
                                </Typography>

                                {isAuthenticated ? (
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<PlayArrow />}
                                            onClick={() => navigate('/workouts')}
                                            sx={{
                                                py: 2.5,
                                                px: 5,
                                                fontSize: '1.2rem',
                                                fontWeight: 600,
                                                borderRadius: 25,
                                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                                boxShadow: '0 8px 30px rgba(255,107,107,0.4)',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 12px 40px rgba(255,107,107,0.5)',
                                                }
                                            }}
                                        >
                                            Bắt đầu tập luyện
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={() => navigate('/profile')}
                                            sx={{
                                                py: 2.5,
                                                px: 5,
                                                fontSize: '1.2rem',
                                                fontWeight: 600,
                                                borderRadius: 25,
                                                borderColor: 'rgba(255,255,255,0.6)',
                                                borderWidth: 2,
                                                color: 'white',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                    transform: 'translateY(-2px)',
                                                },
                                            }}
                                        >
                                            Xem hồ sơ
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<PersonAdd />}
                                            onClick={() => navigate('/register')}
                                            sx={{
                                                py: 2.5,
                                                px: 5,
                                                fontSize: '1.2rem',
                                                fontWeight: 600,
                                                borderRadius: 25,
                                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                                boxShadow: '0 8px 30px rgba(255,107,107,0.4)',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 12px 40px rgba(255,107,107,0.5)',
                                                }
                                            }}
                                        >
                                            Đăng ký miễn phí
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            startIcon={<Login />}
                                            onClick={() => navigate('/login')}
                                            sx={{
                                                py: 2.5,
                                                px: 5,
                                                fontSize: '1.2rem',
                                                fontWeight: 600,
                                                borderRadius: 25,
                                                borderColor: 'rgba(255,255,255,0.6)',
                                                borderWidth: 2,
                                                textTransform: 'none',
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                    transform: 'translateY(-2px)',
                                                },
                                            }}
                                        >
                                            Đăng nhập
                                        </Button>
                                    </Stack>
                                )}

                                {/* Trust indicators */}
                                <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
                                        ))}
                                        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                            4.9/5
                                        </Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                        25,000+ thành viên tin tưởng
                                    </Typography>
                                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircle sx={{ fontSize: '1.2rem', color: '#4ECDC4' }} />
                                        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                            Miễn phí 100%
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {isAuthenticated && user ? (
                                    <Paper
                                        elevation={25}
                                        sx={{
                                            p: 5,
                                            borderRadius: 6,
                                            background: 'rgba(255,255,255,0.95)',
                                            backdropFilter: 'blur(20px)',
                                            textAlign: 'center',
                                            maxWidth: 400,
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                mx: 'auto',
                                                mb: 3,
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                fontSize: '2.5rem',
                                                fontWeight: 600,
                                                boxShadow: '0 10px 30px rgba(102,126,234,0.4)',
                                            }}
                                        >
                                            {user.profile.firstName
                                                ? user.profile.firstName[0]
                                                : user.username[0]}
                                        </Avatar>
                                        <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                                            Chào mừng trở lại,
                                        </Typography>
                                        <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 700 }}>
                                            {user.profile.firstName || user.username}!
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{ mb: 4, fontSize: '1.1rem' }}
                                        >
                                            Sẵn sàng chinh phục mục tiêu hôm nay? 💪
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            endIcon={<ArrowForward />}
                                            onClick={() => navigate('/workouts')}
                                            sx={{
                                                borderRadius: 25,
                                                py: 1.5,
                                                px: 4,
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 25px rgba(102,126,234,0.4)',
                                                }
                                            }}
                                        >
                                            Bắt đầu ngay
                                        </Button>

                                        {/* Quick stats */}
                                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-around' }}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" color="primary" fontWeight={700}>12</Typography>
                                                <Typography variant="caption" color="text.secondary">Ngày streak</Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" color="secondary" fontWeight={700}>85</Typography>
                                                <Typography variant="caption" color="text.secondary">Bài tập</Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" color="success.main" fontWeight={700}>24</Typography>
                                                <Typography variant="caption" color="text.secondary">Thành tích</Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                ) : (
                                    <Box sx={{
                                        textAlign: 'center',
                                        p: 4,
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: 6,
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                    }}>
                                        <Typography
                                            sx={{
                                                fontSize: '8rem',
                                                mb: 2,
                                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                                            }}
                                        >
                                            🏋️‍♂️
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 600, opacity: 0.9 }}>
                                            Your Fitness Journey
                                        </Typography>
                                        <Typography variant="h6" sx={{ mt: 1, opacity: 0.7, fontWeight: 300 }}>
                                            Starts Here
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Features Section */}
                <Box sx={{ py: 10 }}>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Chip
                            label="✨ TÍNH NĂNG NỔI BẬT"
                            color="primary"
                            variant="outlined"
                            sx={{
                                mb: 3,
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                py: 1,
                                px: 2,
                            }}
                        />
                        <Typography
                            variant="h2"
                            component="h2"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 3,
                            }}
                        >
                            Mọi thứ bạn cần cho hành trình fitness
                        </Typography>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            sx={{
                                maxWidth: 700,
                                mx: 'auto',
                                fontWeight: 400,
                                lineHeight: 1.6,
                            }}
                        >
                            Từ kế hoạch tập luyện được AI cá nhân hóa đến cộng đồng hỗ trợ nhiệt tình,
                            chúng tôi có tất cả để biến ước mơ thành hiện thực.
                        </Typography>
                    </Box>

                    <Grid container spacing={4} justifyContent="center">
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <FeatureCard
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                    color={feature.color}
                                    gradient={feature.gradient}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Stats Section */}
                <Box sx={{ py: 8 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            py: 10,
                            px: 6,
                            borderRadius: 6,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `
                                    radial-gradient(circle at 10% 20%, rgba(102,126,234,0.1) 0%, transparent 50%),
                                    radial-gradient(circle at 90% 80%, rgba(118,75,162,0.1) 0%, transparent 50%)
                                `,
                            }
                        }}
                    >
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography
                                variant="h2"
                                component="h2"
                                gutterBottom
                                textAlign="center"
                                sx={{
                                    mb: 2,
                                    fontWeight: 800,
                                    fontSize: { xs: '2.5rem', md: '3rem' },
                                }}
                            >
                                Được tin tưởng bởi cộng đồng
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                textAlign="center"
                                sx={{ mb: 6, fontWeight: 400 }}
                            >
                                Con số không nói dối về chất lượng dịch vụ của chúng tôi
                            </Typography>
                            <Grid container spacing={4} justifyContent="center">
                                {stats.map((stat, index) => (
                                    <Grid item xs={6} md={3} key={index}>
                                        <StatCard
                                            label={stat.label}
                                            value={stat.value}
                                            icon={stat.icon}
                                            color={stat.color}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Paper>
                </Box>

                {/* Testimonials Section */}
                <Box sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Chip
                            label="💬 FEEDBACK THÀNH VIÊN"
                            color="secondary"
                            variant="outlined"
                            sx={{
                                mb: 3,
                                fontWeight: 600,
                                fontSize: '0.9rem',
                            }}
                        />
                        <Typography
                            variant="h2"
                            component="h2"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '2.5rem', md: '3rem' },
                                mb: 2,
                            }}
                        >
                            Câu chuyện thành công
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}
                        >
                            Hàng nghìn thành viên đã thay đổi cuộc sống nhờ nền tảng của chúng tôi
                        </Typography>
                    </Box>

                    <Grid container spacing={4} justifyContent="center">
                        {testimonials.map((testimonial, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <TestimonialCard {...testimonial} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* CTA Section */}
                {!isAuthenticated && (
                    <Box sx={{ py: 8 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                color: 'white',
                                textAlign: 'center',
                                py: 10,
                                px: 6,
                                borderRadius: 6,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: `
                                        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
                                    `,
                                }
                            }}
                        >
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Typography
                                    variant="h2"
                                    component="h2"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                                        mb: 2,
                                    }}
                                >
                                    Sẵn sàng bắt đầu?
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        mb: 5,
                                        opacity: 0.95,
                                        maxWidth: 700,
                                        mx: 'auto',
                                        fontWeight: 400,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Tham gia cộng đồng fitness hàng đầu Việt Nam và bắt đầu
                                    hành trình thay đổi bản thân ngay hôm nay. Hoàn toàn miễn phí!
                                </Typography>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={3}
                                    justifyContent="center"
                                    sx={{ mb: 5 }}
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => navigate('/register')}
                                        sx={{
                                            py: 2.5,
                                            px: 6,
                                            fontSize: '1.3rem',
                                            fontWeight: 600,
                                            borderRadius: 25,
                                            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                            boxShadow: '0 8px 30px rgba(255,107,107,0.4)',
                                            textTransform: 'none',
                                            '&:hover': {
                                                transform: 'translateY(-3px)',
                                                boxShadow: '0 15px 40px rgba(255,107,107,0.5)',
                                            }
                                        }}
                                    >
                                        Đăng ký miễn phí ngay
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/login')}
                                        sx={{
                                            py: 2.5,
                                            px: 6,
                                            fontSize: '1.3rem',
                                            fontWeight: 600,
                                            borderRadius: 25,
                                            borderColor: 'rgba(255,255,255,0.6)',
                                            borderWidth: 2,
                                            textTransform: 'none',
                                            '&:hover': {
                                                borderColor: 'white',
                                                backgroundColor: 'rgba(255,255,255,0.15)',
                                                transform: 'translateY(-3px)',
                                            },
                                        }}
                                    >
                                        Đã có tài khoản?
                                    </Button>
                                </Stack>

                                {/* Enhanced trust indicators */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 3,
                                    flexWrap: 'wrap',
                                    opacity: 0.9,
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} sx={{ color: '#FFD700', fontSize: '1.5rem' }} />
                                        ))}
                                        <Typography variant="body1" sx={{ ml: 1, fontWeight: 600 }}>
                                            4.9/5 từ 25,000+ đánh giá
                                        </Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircle sx={{ fontSize: '1.5rem', color: '#4ECDC4' }} />
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            Không cần thẻ tín dụng
                                        </Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Timer sx={{ fontSize: '1.5rem', color: '#FFD700' }} />
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            Chỉ mất 30 giây
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                )}
            </Container>

            {/* Enhanced animations */}
            <style>
                {`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        33% { transform: translateY(-10px) rotate(1deg); }
                        66% { transform: translateY(-5px) rotate(-1deg); }
                    }

                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.8; }
                    }

                    @keyframes slideInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </Box>
    );
}