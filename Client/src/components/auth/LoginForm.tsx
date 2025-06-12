/**
 * Login Form Component - Redesigned with MUI
 * Form cho đăng nhập, sử dụng React 19 Actions và Material UI
 */

import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
    Alert,
    IconButton,
    InputAdornment,
    Link,
    Divider,
    CircularProgress,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Login as LoginIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
    const { loginAction, loginState, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set('rememberMe', rememberMe ? 'true' : 'false');
        loginAction(formData);
    };

    // Navigate sau khi login thành công
    if (loginState.success) {
        navigate('/profile');
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                py: 3,
            }}
        >
            <Card
                sx={{
                    maxWidth: 400,
                    width: '100%',
                    mx: 2,
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <LoginIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                        <Typography variant="h4" component="h1" gutterBottom>
                            Đăng nhập
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Đăng nhập vào tài khoản Fitness App của bạn
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {(error || loginState.error) && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3 }}
                            onClose={clearError}
                        >
                            {error || loginState.error}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            type="email"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mật khẩu"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    name="rememberMe"
                                    color="primary"
                                />
                            }
                            label="Ghi nhớ đăng nhập"
                            sx={{ mt: 1, mb: 2 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
                        >
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Link component={RouterLink} to="/forgot-password" variant="body2">
                                Quên mật khẩu?
                            </Link>
                        </Box>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                HOẶC
                            </Typography>
                        </Divider>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Chưa có tài khoản?{' '}
                                <Link component={RouterLink} to="/register" variant="body2">
                                    Đăng ký ngay
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
