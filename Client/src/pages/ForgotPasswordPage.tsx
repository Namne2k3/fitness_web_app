/**
 * 📧 Forgot Password Page - React 19 with Actions
 * Trang quên mật khẩu sử dụng React 19 features
 */

import {
    Email,
    ArrowBack,
    Send
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useActionState, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ForgotPasswordState {
    success: boolean;
    error?: string | null;
    message?: string;
}

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [emailSent, setEmailSent] = useState(false);

    // React 19: useActionState cho forgot password
    const [state, forgotPasswordAction, isPending] = useActionState(
        async (prevState: ForgotPasswordState, formData: FormData): Promise<ForgotPasswordState> => {
            try {
                const email = formData.get('email') as string;

                const response = await authService.forgotPassword(email);

                setEmailSent(true);

                return {
                    success: true,
                    message: response.message
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại'
                };
            }
        },
        { success: false, error: null }
    );

    return (
        <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                        🔑 Quên mật khẩu
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Nhập email của bạn để nhận link reset mật khẩu
                    </Typography>
                </Box>

                {/* Success State */}
                {emailSent && state.success && (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            ✅ Email đã được gửi!
                        </Typography>
                        <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
                            {state.message}
                        </Alert>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Vui lòng kiểm tra hộp thư email (kể cả thư mục spam) và click vào link để reset mật khẩu.
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() => navigate('/login')}
                            fullWidth
                        >
                            Quay lại đăng nhập
                        </Button>
                    </Box>
                )}

                {/* Form State */}
                {!emailSent && (
                    <>
                        {/* Error Alert */}
                        {state.error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {state.error}
                            </Alert>
                        )}

                        {/* Forgot Password Form */}
                        <form action={forgotPasswordAction}>
                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                fullWidth
                                margin="normal"
                                required
                                autoFocus
                                placeholder="your.email@example.com"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email />
                                        </InputAdornment>
                                    ),
                                }}
                                helperText="Nhập địa chỉ email bạn đã đăng ký tài khoản"
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 3, mb: 2, height: 48, fontWeight: 600 }}
                                disabled={isPending}
                                startIcon={isPending ? <CircularProgress size={22} color="inherit" /> : <Send />}
                            >
                                {isPending ? 'Đang gửi email...' : 'Gửi email reset mật khẩu'}
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

                {/* Resend Email Button */}
                {emailSent && (
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button
                            variant="text"
                            onClick={() => {
                                setEmailSent(false);
                            }}
                            disabled={isPending}
                        >
                            Chưa nhận được email? Gửi lại
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}
