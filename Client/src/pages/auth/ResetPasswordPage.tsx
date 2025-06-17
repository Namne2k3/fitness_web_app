/**
 * 🔒 Reset Password Page - React 19 with Actions
 * Trang đặt lại mật khẩu sử dụng React 19 features
 */

import {
    Lock,
    Visibility,
    VisibilityOff,
    CheckCircle,
    ArrowBack,
    ErrorOutline,
    Schedule
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useActionState, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';


interface ResetPasswordState {
    success: boolean;
    error?: string | null;
    message?: string;
    isTokenExpired?: boolean;
}

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordReset, setPasswordReset] = useState(false);
    const [tokenValidated, setTokenValidated] = useState(false);
    const [isValidatingToken, setIsValidatingToken] = useState(true);

    // ✅ Validate token on page load
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                navigate('/forgot-password');
                return;
            }

            try {
                setIsValidatingToken(true);

                // ✅ Use dedicated validation endpoint
                const result = await authService.validateResetToken(token);

                if (result.isValid) {
                    setTokenValidated(true);

                    // Optional: Show time remaining if less than 10 minutes
                    if (result.timeRemaining && result.timeRemaining < 600) {
                        const minutes = Math.floor(result.timeRemaining / 60);
                        console.log(`⏰ Token expires in ${minutes} minutes`);
                    }
                } else {
                    setTokenValidated(false);
                    console.log(`❌ Token validation failed: ${result.message}`);
                }

            } catch (error) {
                console.error('Token validation error:', error);
                setTokenValidated(false);
            } finally {
                setIsValidatingToken(false);
            }
        };

        validateToken();
    }, [token, navigate]);

    // React 19: useActionState cho reset password
    const [state, resetPasswordAction, isPending] = useActionState(
        async (prevState: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> => {
            try {
                if (!token) {
                    throw new Error('Token không hợp lệ');
                }

                const newPassword = formData.get('newPassword') as string;
                const confirmNewPassword = formData.get('confirmNewPassword') as string;

                // Client-side validation
                if (newPassword !== confirmNewPassword) {
                    throw new Error('Mật khẩu xác nhận không khớp');
                }

                if (newPassword.length < 6) {
                    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
                }

                const response = await authService.resetPassword({
                    token,
                    newPassword,
                    confirmNewPassword
                });

                setPasswordReset(true);

                return {
                    success: true,
                    message: response.message
                };
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại';

                // Check if token expired during the reset process
                const isTokenExpiredError = errorMessage.includes('Token không hợp lệ') ||
                    errorMessage.includes('đã hết hạn') ||
                    errorMessage.includes('expired');

                return {
                    success: false,
                    error: errorMessage,
                    isTokenExpired: isTokenExpiredError
                };
            }
        },
        { success: false, error: null }
    );

    // Show loading while validating token
    if (isValidatingToken) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                    <CircularProgress size={60} sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Đang kiểm tra link reset...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Vui lòng chờ trong giây lát
                    </Typography>
                </Paper>
            </Container>
        );
    }

    // Show token expired page
    if (!tokenValidated || state.isTokenExpired) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <ErrorOutline sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                        <Typography variant="h5" color="error" gutterBottom fontWeight="bold">
                            ⏰ Link đã hết hạn
                        </Typography>
                        <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                            Link reset mật khẩu chỉ có hiệu lực trong 1 giờ và đã hết hạn.
                        </Alert>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                <Schedule sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                Link reset password có thời hạn 60 phút kể từ khi được tạo
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Để bảo mật tài khoản, bạn cần yêu cầu link mới
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/forgot-password')}
                            fullWidth
                            sx={{ mb: 2, fontWeight: 600 }}
                        >
                            Yêu cầu link mới
                        </Button>

                        <Button
                            component={Link}
                            to="/login"
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            fullWidth
                        >
                            Quay lại đăng nhập
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                        🔒 Đặt lại mật khẩu
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Nhập mật khẩu mới cho tài khoản của bạn
                    </Typography>
                </Box>

                {/* Success State */}
                {passwordReset && state.success && (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                        <Typography variant="h6" color="success.main" gutterBottom>
                            🎉 Mật khẩu đã được cập nhật!
                        </Typography>
                        <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
                            {state.message}
                        </Alert>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/login')}
                            fullWidth
                            sx={{ fontWeight: 600 }}
                        >
                            Đăng nhập ngay
                        </Button>
                    </Box>
                )}

                {/* Form State */}
                {!passwordReset && (
                    <>
                        {/* Error Alert */}
                        {state.error && !state.isTokenExpired && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {state.error}
                            </Alert>
                        )}

                        {/* Reset Password Form */}
                        <form action={resetPasswordAction}>
                            <TextField
                                name="newPassword"
                                label="Mật khẩu mới"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                margin="normal"
                                required
                                autoFocus
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword((show) => !show)}
                                                edge="end"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                helperText="Mật khẩu phải có ít nhất 6 ký tự"
                            />

                            <TextField
                                name="confirmNewPassword"
                                label="Xác nhận mật khẩu mới"
                                type={showConfirmPassword ? 'text' : 'password'}
                                fullWidth
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle confirm password visibility"
                                                onClick={() => setShowConfirmPassword((show) => !show)}
                                                edge="end"
                                                tabIndex={-1}
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                helperText="Nhập lại mật khẩu để xác nhận"
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 3, mb: 2, height: 48, fontWeight: 600 }}
                                disabled={isPending}
                                startIcon={isPending ? <CircularProgress size={22} color="inherit" /> : <Lock />}
                            >
                                {isPending ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                            </Button>

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="text"
                                    startIcon={<ArrowBack />}
                                >
                                    Quay lại đăng nhập
                                </Button>
                            </Box>
                        </form>
                    </>
                )}
            </Paper>
        </Container>
    );
}
