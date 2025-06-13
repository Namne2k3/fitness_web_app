/**
 * Login Form Component - Redesigned with MUI
 * Form cho đăng nhập, sử dụng React 19 Actions và Material UI
 */

import {
    Email,
    Lock,
    Login as LoginIcon,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
    const { loginAction, loginState, isLoading, error, loginPending, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    if (isAuthenticated) {
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
                    position: 'relative',
                }}
            >
                {/* Overlay loading khi isLoading toàn cục (ví dụ: refresh user, global auth) */}
                {(isLoading || loginPending) && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            zIndex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                        <CircularProgress size={60} />
                        <Typography variant="body1" fontWeight="medium">
                            Đang đăng nhập...
                        </Typography>
                    </Box>
                )}
                <CardContent sx={{ p: 4, position: 'relative' }}>
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
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error || loginState.error}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <form action={loginAction} autoComplete="on">
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            name="password"
                            label="Mật khẩu"
                            type={showPassword ? 'text' : 'password'}
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
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={e => setRememberMe(e.target.checked)}
                                        name="rememberMe"
                                        color="primary"
                                    />
                                }
                                label="Ghi nhớ đăng nhập"
                            />
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => navigate('/forgot-password')}
                                sx={{ minWidth: 'auto', textAlign: 'right' }}
                            >
                                Quên mật khẩu?
                            </Button>
                        </Box>

                        {/* Hidden input cho rememberMe */}
                        <input
                            type="hidden"
                            name="rememberMe"
                            value={rememberMe.toString()}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3, mb: 1, height: 48, fontWeight: 600 }}
                            disabled={loginPending || isLoading}
                            startIcon={loginPending ? <CircularProgress size={22} color="inherit" /> : <LoginIcon />}
                        >
                            {loginPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
