/**
 * Trang đăng nhập cho ứng dụng Fitness Web App - Modern UI với React 19 & Material UI
 * Features: Hero section, beautiful form design, responsive layout
 */
import { FitnessCenter, SecurityOutlined } from '@mui/icons-material';
import {
    alpha,
    Box,
    Chip,
    Container,
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import LoginForm from "../components/auth/LoginForm";

/**
 * LoginPage component với modern Material UI design
 * Bao gồm hero section và form đăng nhập đẹp mắt
 */
export default function LoginPage() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        gap: 4,
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
                            variant="h4"
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
                                maxWidth: 400,
                                mx: { xs: 'auto', md: 0 },
                            }}
                        >
                            Tiếp tục hành trình fitness của bạn. Đăng nhập để truy cập
                            vào kế hoạch tập luyện cá nhân và theo dõi tiến độ.
                        </Typography>

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
                    </Box >

                    {/* Right Side - Login Form */}
                    <Box
                        sx={{
                            flex: 1,
                            width: '100%',
                            maxWidth: 450,
                            order: { xs: 1, md: 2 },
                        }
                        }
                    >
                        <LoginForm />
                    </Box >
                </Box >
            </Container >
        </Box >
    );
}
