/**
 * Trang đăng nhập cho ứng dụng Fitness Web App - Modern UI với React 19 & Material UI
 * Features: Enhanced hero section, beautiful form design, responsive layout
 * Updated with new design system and improved UX
 */
import {
    FitnessCenter,
    SecurityOutlined,
    Login as LoginIcon,
    Group,
    Speed,
    TrendingUp,
    CheckCircle
} from '@mui/icons-material';
import {
    alpha,
    Box,
    Chip,
    Container,
    Paper,
    Stack,
    Typography,
    useTheme,
    Fade,
    Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

/**
 * LoginPage component với modern Material UI design
 * Enhanced với new design system và improved user experience
 */
export default function LoginPage() {
    const theme = useTheme();

    const benefits = [
        {
            icon: <TrendingUp />,
            text: 'Theo dõi tiến độ chi tiết',
            highlight: '100% cá nhân hóa'
        },
        {
            icon: <Group />,
            text: 'Cộng đồng hỗ trợ 24/7',
            highlight: '50K+ thành viên'
        },
        {
            icon: <SecurityOutlined />,
            text: 'Bảo mật dữ liệu tuyệt đối',
            highlight: 'Mã hóa end-to-end'
        },
        {
            icon: <Speed />,
            text: 'Phân tích AI thông minh',
            highlight: 'Gợi ý tự động'
        }
    ];

    const achievements = [
        { icon: <CheckCircle />, text: 'Đã giúp 10,000+ người đạt mục tiêu' },
        { icon: <CheckCircle />, text: 'Được tin tưởng bởi chuyên gia fitness' },
        { icon: <CheckCircle />, text: 'Ứng dụng #1 cho người Việt' }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                py: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    animation: 'float 20s ease-in-out infinite',
                },
                '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            }}
        >
            <Container maxWidth="lg">
                <Fade in timeout={800}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            gap: { xs: 4, md: 8 },
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        {/* Left Side - Enhanced Hero Content */}
                        <Box
                            sx={{
                                flex: 1,
                                textAlign: { xs: 'center', md: 'left' },
                                color: 'white',
                                order: { xs: 2, md: 1 },
                                maxWidth: { xs: '100%', md: '600px' },
                            }}
                        >
                            {/* Brand Header */}
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent={{ xs: 'center', md: 'flex-start' }}
                                sx={{ mb: 4 }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: alpha(theme.palette.common.white, 0.2),
                                        width: 64,
                                        height: 64,
                                        mr: 2,
                                        border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
                                    }}
                                >
                                    <FitnessCenter sx={{ fontSize: '2rem', color: 'white' }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h3" component="h1" sx={{ fontWeight: 800, lineHeight: 1 }}>
                                        TrackMe
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>
                                        Fitness made simple
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* Main Heading */}
                            <Typography
                                variant="h2"
                                component="h2"
                                sx={{
                                    fontWeight: 700,
                                    mb: 3,
                                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                                    background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    lineHeight: 1.2,
                                }}
                            >
                                Chào mừng trở lại!
                            </Typography>

                            {/* Subtitle */}
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 4,
                                    opacity: 0.9,
                                    fontWeight: 300,
                                    lineHeight: 1.6,
                                    maxWidth: 500,
                                    mx: { xs: 'auto', md: 0 },
                                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                }}
                            >
                                Tiếp tục hành trình fitness của bạn. Đăng nhập để truy cập
                                vào kế hoạch tập luyện cá nhân và theo dõi tiến độ.
                            </Typography>

                            {/* Enhanced Benefits */}
                            <Stack spacing={3} sx={{ mb: 4 }}>
                                {benefits.map((benefit, index) => (
                                    <Fade in timeout={1000 + index * 200} key={index}>
                                        <Stack direction="row" alignItems="center" spacing={3}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: alpha(theme.palette.common.white, 0.2),
                                                    border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                                                    width: 48,
                                                    height: 48,
                                                }}
                                            >
                                                {benefit.icon}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {benefit.text}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                                                    {benefit.highlight}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Fade>
                                ))}
                            </Stack>

                            {/* Achievement Badges */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 2, fontWeight: 600 }}>
                                    Được tin tưởng bởi:
                                </Typography>
                                <Stack spacing={1}>
                                    {achievements.map((achievement, index) => (
                                        <Stack key={index} direction="row" alignItems="center" spacing={1}>
                                            <CheckCircle sx={{ fontSize: '1rem', opacity: 0.8 }} />
                                            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.85rem' }}>
                                                {achievement.text}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Box>

                            {/* Feature Chips */}
                            <Stack
                                direction="row"
                                spacing={2}
                                flexWrap="wrap"
                                justifyContent={{ xs: 'center', md: 'flex-start' }}
                                sx={{ gap: 1 }}
                            >
                                <Chip
                                    icon={<SecurityOutlined />}
                                    label="Bảo mật cao"
                                    sx={{
                                        bgcolor: alpha(theme.palette.common.white, 0.2),
                                        color: 'white',
                                        border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                                        fontWeight: 600,
                                        '& .MuiChip-icon': {
                                            color: 'white',
                                        },
                                    }}
                                />
                                <Chip
                                    icon={<FitnessCenter />}
                                    label="24/7 Support"
                                    sx={{
                                        bgcolor: alpha(theme.palette.common.white, 0.2),
                                        color: 'white',
                                        border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                                        fontWeight: 600,
                                        '& .MuiChip-icon': {
                                            color: 'white',
                                        },
                                    }}
                                />
                                <Chip
                                    icon={<Speed />}
                                    label="AI Powered"
                                    sx={{
                                        bgcolor: alpha(theme.palette.common.white, 0.2),
                                        color: 'white',
                                        border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                                        fontWeight: 600,
                                        '& .MuiChip-icon': {
                                            color: 'white',
                                        },
                                    }}
                                />
                            </Stack>
                        </Box>

                        {/* Right Side - Enhanced Login Form */}
                        <Box
                            sx={{
                                flex: 1,
                                width: '100%',
                                maxWidth: 480,
                                order: { xs: 1, md: 2 },
                            }}
                        >
                            <Fade in timeout={1200}>
                                <Paper
                                    elevation={24}
                                    sx={{
                                        p: { xs: 3, sm: 4, md: 5 },
                                        borderRadius: 4,
                                        background: 'rgba(255, 255, 255, 0.98)',
                                        backdropFilter: 'blur(20px)',
                                        border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                                        boxShadow: '0 32px 64px rgba(0,0,0,0.2)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 4,
                                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        },
                                    }}
                                >
                                    {/* Form Header */}
                                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                width: 72,
                                                height: 72,
                                                mx: 'auto',
                                                mb: 3,
                                                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                                            }}
                                        >
                                            <LoginIcon sx={{ fontSize: '2rem', color: 'white' }} />
                                        </Avatar>
                                        <Typography
                                            variant="h4"
                                            component="h3"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 700,
                                                color: 'text.primary',
                                                mb: 1,
                                            }}
                                        >
                                            Đăng nhập
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontSize: '1rem', lineHeight: 1.5 }}
                                        >
                                            Tiếp tục với tài khoản TrackMe của bạn
                                        </Typography>
                                    </Box>

                                    {/* Login Form Component */}
                                    <LoginForm />

                                    {/* Footer */}
                                    <Box sx={{
                                        mt: 4,
                                        pt: 3,
                                        borderTop: `1px solid ${theme.palette.divider}`,
                                        textAlign: 'center'
                                    }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ lineHeight: 1.6, mb: 2 }}
                                        >
                                            Chưa có tài khoản?{' '}
                                            <Link
                                                to="/register"
                                                style={{
                                                    color: theme.palette.primary.main,
                                                    textDecoration: 'none',
                                                    fontWeight: 600,
                                                    borderBottom: `1px solid transparent`,
                                                    transition: 'border-color 0.2s ease',
                                                }}
                                                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                                    e.currentTarget.style.borderBottomColor = theme.palette.primary.main;
                                                }}
                                                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                                    e.currentTarget.style.borderBottomColor = 'transparent';
                                                }}
                                            >
                                                Đăng ký ngay
                                            </Link>
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ opacity: 0.8 }}
                                        >
                                            Bằng việc đăng nhập, bạn đồng ý với{' '}
                                            <Link to="/terms" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                                                Điều khoản sử dụng
                                            </Link>
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Fade>
                        </Box>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
}
