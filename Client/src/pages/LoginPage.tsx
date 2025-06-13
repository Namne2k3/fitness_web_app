/**
 * Trang đăng nhập cho ứng dụng Fitness Web App - Modern UI với React 19 & Material UI
 * Features: Hero section, beautiful form design, responsive layout
 * Updated to be consistent with RegisterPage layout
 */
import {
    FitnessCenter,
    SecurityOutlined,
    Login as LoginIcon,
    Group
} from '@mui/icons-material';
import {
    alpha,
    Box,
    Chip,
    Container,
    Paper,
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

/**
 * LoginPage component với modern Material UI design
 * Bao gồm hero section và form đăng nhập đẹp mắt
 * Layout đồng nhất với RegisterPage để cải thiện UX
 */
export default function LoginPage() {
    const theme = useTheme();

    const benefits = [
        {
            icon: <Group />,
            text: 'Cộng đồng hỗ trợ 24/7',
        },
        {
            icon: <SecurityOutlined />,
            text: 'Bảo mật dữ liệu tuyệt đối',
        },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        gap: 6,
                    }}
                >
                    {/* Left Side - Hero Content */}
                    <Box
                        sx={{
                            flex: 1,
                            textAlign: { xs: 'center', md: 'left' },
                            color: 'white',
                            order: { xs: 2, md: 1 },
                        }}
                    >
                        <Stack direction="row" alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ mb: 3 }}>
                            <FitnessCenter sx={{ fontSize: '3rem', mr: 2 }} />
                            <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }}>
                                FitApp
                            </Typography>
                        </Stack>

                        <Typography
                            variant="h3"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Chào mừng trở lại!
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                mb: 4,
                                opacity: 0.9,
                                fontWeight: 300,
                                lineHeight: 1.6,
                                maxWidth: 500,
                                mx: { xs: 'auto', md: 0 },
                            }}
                        >
                            Tiếp tục hành trình fitness của bạn. Đăng nhập để truy cập
                            vào kế hoạch tập luyện cá nhân và theo dõi tiến độ.
                        </Typography>

                        <Stack spacing={2} sx={{ mb: 4 }}>
                            {benefits.map((benefit, index) => (
                                <Stack key={index} direction="row" alignItems="center" spacing={2}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            bgcolor: alpha(theme.palette.common.white, 0.2),
                                            color: 'white',
                                        }}
                                    >
                                        {benefit.icon}
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {benefit.text}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>

                        <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                            <Chip
                                icon={<SecurityOutlined />}
                                label="Bảo mật cao"
                                sx={{
                                    bgcolor: alpha(theme.palette.common.white, 0.2),
                                    color: 'white',
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
                                    '& .MuiChip-icon': {
                                        color: 'white',
                                    },
                                }}
                            />
                        </Stack>
                    </Box>

                    {/* Right Side - Login Form */}
                    <Box
                        sx={{
                            flex: 1,
                            width: '100%',
                            maxWidth: 500,
                            order: { xs: 1, md: 2 },
                        }}
                    >
                        <Paper
                            elevation={20}
                            sx={{
                                p: { xs: 3, sm: 4 },
                                borderRadius: 4,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <LoginIcon
                                    sx={{
                                        fontSize: '3rem',
                                        color: 'primary.main',
                                        mb: 2,
                                    }}
                                />
                                <Typography
                                    variant="h4"
                                    component="h3"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        color: 'text.primary',
                                    }}
                                >
                                    Đăng nhập
                                </Typography>
                            </Box>

                            <LoginForm />

                            <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    textAlign="center"
                                    sx={{ lineHeight: 1.6 }}
                                >
                                    Chưa có tài khoản?{' '}
                                    <Link
                                        to="/register"
                                        style={{
                                            color: theme.palette.primary.main,
                                            textDecoration: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Đăng ký
                                    </Link>
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
