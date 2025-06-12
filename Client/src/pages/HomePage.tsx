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
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}

interface StatCardProps {
    label: string;
    value: string;
}

/**
 * Component cho feature card với animation và hover effects
 */
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => (
    <Card
        sx={{
            height: '100%',
            transition: 'all 0.3s ease',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.100',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                borderColor: `${color}.light`,
            },
        }}
    >
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Box
                sx={{
                    display: 'inline-flex',
                    p: 3,
                    borderRadius: '50%',
                    bgcolor: `${color}.light`,
                    color: `${color}.main`,
                    mb: 3,
                    fontSize: '2rem',
                }}
            >
                {icon}
            </Box>
            <Typography
                variant="h5"
                component="h3"
                gutterBottom
                sx={{ fontWeight: 600 }}
            >
                {title}
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
            >
                {description}
            </Typography>
        </CardContent>
    </Card>
);

/**
 * Component cho stat card hiển thị số liệu thống kê
 */
const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
    <Box sx={{ textAlign: 'center' }}>
        <Typography
            variant="h2"
            color="primary.main"
            gutterBottom
            sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
        >
            {value}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            {label}
        </Typography>
    </Box>
);

/**
 * HomePage component - Trang chủ với modern design và responsive layout
 */
export default function HomePage() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const features = [
        {
            icon: <FitnessCenter />,
            title: 'Workout Planner',
            description: 'Tạo và theo dõi các bài tập phù hợp với mục tiêu của bạn',
            color: 'primary',
        },
        {
            icon: <TrendingUp />,
            title: 'Progress Tracking',
            description: 'Theo dõi tiến độ và thống kê chi tiết về quá trình luyện tập',
            color: 'secondary',
        },
        {
            icon: <People />,
            title: 'Community',
            description: 'Kết nối với cộng đồng fitness và chia sẻ kinh nghiệm',
            color: 'success',
        },
        {
            icon: <EmojiEvents />,
            title: 'Achievements',
            description: 'Đạt được các thành tích và thử thách trong hành trình fitness',
            color: 'warning',
        },
    ];

    const stats = [
        { label: 'Người dùng hoạt động', value: '10,000+' },
        { label: 'Bài tập hoàn thành', value: '50,000+' },
        { label: 'Cộng đồng trainer', value: '500+' },
        { label: 'Đánh giá 5 sao', value: '95%' },
    ];

    return (
        <Box sx={{ overflow: 'hidden' }}>
            {/* Hero Section với background gradient và animation */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: { xs: 6, md: 10 },
                    mb: 8,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        animation: 'float 6s ease-in-out infinite',
                    },
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography
                                variant="h1"
                                component="h1"
                                sx={{
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    fontWeight: 800,
                                    mb: 2,
                                    background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Transform Your
                                <br />
                                Fitness Journey
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 4,
                                    opacity: 0.9,
                                    fontWeight: 300,
                                    lineHeight: 1.6,
                                }}
                            >
                                Khám phá sức mạnh tiềm ẩn của bạn với hệ thống tập luyện thông minh,
                                theo dõi tiến độ chi tiết và cộng đồng hỗ trợ 24/7.
                            </Typography>

                            {isAuthenticated ? (
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        startIcon={<PlayArrow />}
                                        onClick={() => navigate('/workouts')}
                                        sx={{
                                            py: 2,
                                            px: 4,
                                            fontSize: '1.1rem',
                                            borderRadius: 3,
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                                        }}
                                    >
                                        Bắt đầu tập luyện
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        size="large"
                                        onClick={() => navigate('/profile')}
                                        sx={{
                                            py: 2,
                                            px: 4,
                                            fontSize: '1.1rem',
                                            borderRadius: 3,
                                            borderColor: 'rgba(255,255,255,0.5)',
                                            '&:hover': {
                                                borderColor: 'white',
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                            },
                                        }}
                                    >
                                        Xem hồ sơ
                                    </Button>
                                </Stack>
                            ) : (
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        startIcon={<PersonAdd />}
                                        onClick={() => navigate('/register')}
                                        sx={{
                                            py: 2,
                                            px: 4,
                                            fontSize: '1.1rem',
                                            borderRadius: 3,
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                                        }}
                                    >
                                        Đăng ký miễn phí
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        size="large"
                                        startIcon={<Login />}
                                        onClick={() => navigate('/login')}
                                        sx={{
                                            py: 2,
                                            px: 4,
                                            fontSize: '1.1rem',
                                            borderRadius: 3,
                                            borderColor: 'rgba(255,255,255,0.5)',
                                            '&:hover': {
                                                borderColor: 'white',
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                            },
                                        }}
                                    >
                                        Đăng nhập
                                    </Button>
                                </Stack>
                            )}
                        </Box>

                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                            {isAuthenticated && user ? (
                                <Paper
                                    elevation={20}
                                    sx={{
                                        p: 4,
                                        borderRadius: 4,
                                        background: 'rgba(255,255,255,0.95)',
                                        backdropFilter: 'blur(10px)',
                                        textAlign: 'center',
                                        maxWidth: 350,
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            mx: 'auto',
                                            mb: 2,
                                            bgcolor: 'primary.main',
                                            fontSize: '2rem',
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        {user.profile.firstName
                                            ? user.profile.firstName[0]
                                            : user.username[0]}
                                    </Avatar>
                                    <Typography variant="h5" color="primary" gutterBottom>
                                        Chào mừng trở lại,
                                    </Typography>
                                    <Typography variant="h4" color="text.primary" gutterBottom>
                                        {user.profile.firstName || user.username}!
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ mb: 3 }}
                                    >
                                        Sẵn sàng cho buổi tập hôm nay?
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        endIcon={<ArrowForward />}
                                        onClick={() => navigate('/workouts')}
                                        sx={{ borderRadius: 3 }}
                                    >
                                        Bắt đầu ngay
                                    </Button>
                                </Paper>
                            ) : (
                                <Box sx={{ textAlign: 'center', opacity: 0.7 }}>
                                    <Typography
                                        variant="h1"
                                        sx={{
                                            fontSize: '8rem',
                                            background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        🏋️‍♂️
                                    </Typography>
                                    <Typography variant="h4" sx={{ mt: 2, fontWeight: 300 }}>
                                        Your Fitness Journey
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Features Section */}
                <Box sx={{ mb: 10 }}>
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Chip
                            label="TÍNH NĂNG NỔI BẬT"
                            color="primary"
                            sx={{ mb: 2, fontWeight: 600 }}
                        />
                        <Typography
                            variant="h3"
                            component="h2"
                            gutterBottom
                            sx={{ fontWeight: 700 }}
                        >
                            Mọi thứ bạn cần cho hành trình fitness
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ maxWidth: 600, mx: 'auto' }}
                        >
                            Từ kế hoạch tập luyện cá nhân hóa đến cộng đồng hỗ trợ,
                            chúng tôi có tất cả để giúp bạn đạt được mục tiêu.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(4, 1fr)',
                            },
                            gap: 4,
                        }}
                    >
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                color={feature.color}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Stats Section */}
                <Box sx={{ mb: 10 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            py: 8,
                            px: 4,
                            borderRadius: 4,
                        }}
                    >
                        <Typography
                            variant="h3"
                            component="h2"
                            gutterBottom
                            textAlign="center"
                            sx={{ mb: 6, fontWeight: 700 }}
                        >
                            Được tin tưởng bởi cộng đồng
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: 'repeat(2, 1fr)',
                                    md: 'repeat(4, 1fr)',
                                },
                                gap: 4,
                            }}
                        >
                            {stats.map((stat, index) => (
                                <StatCard key={index} label={stat.label} value={stat.value} />
                            ))}
                        </Box>
                    </Paper>
                </Box>

                {/* CTA Section */}
                {!isAuthenticated && (
                    <Box sx={{ mb: 8 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                textAlign: 'center',
                                py: 8,
                                px: 4,
                                borderRadius: 4,
                            }}
                        >
                            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                                Sẵn sàng bắt đầu?
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                                Tham gia cộng đồng fitness hàng đầu Việt Nam và bắt đầu
                                hành trình thay đổi bản thân ngay hôm nay.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        py: 2,
                                        px: 4,
                                        fontSize: '1.1rem',
                                        borderRadius: 3,
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    Đăng ký miễn phí
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    size="large"
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        py: 2,
                                        px: 4,
                                        fontSize: '1.1rem',
                                        borderRadius: 3,
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        '&:hover': {
                                            borderColor: 'white',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        },
                                    }}
                                >
                                    Đăng nhập
                                </Button>
                            </Stack>
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} sx={{ color: '#ffd700', fontSize: '1.5rem' }} />
                                ))}
                                <Typography variant="body1" sx={{ ml: 2, opacity: 0.9 }}>
                                    Đánh giá 4.9/5 từ hơn 10,000+ người dùng
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                )}
            </Container>

            {/* Add keyframes for animation */}
            <style>
                {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
            </style>
        </Box>
    );
}
