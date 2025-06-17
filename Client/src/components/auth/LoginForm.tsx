/**
 * Login Form Component - Enhanced with new design system
 * Form cho đăng nhập, sử dụng React 19 Actions và Material UI enhanced styling
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
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
    const { loginAction, loginState, isLoading, error, loginPending, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // ✅ ADD: Get message from registration success
    const registrationMessage = location.state?.message;
    const isRegistrationSuccess = location.state?.registrationSuccess;

    if (isAuthenticated) {
        navigate('/');
    }

    return (
        <Box sx={{ position: 'relative' }}>
            {/* Enhanced overlay loading với modern styling */}
            {(isLoading || loginPending) && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: 3,
                        borderRadius: 2,
                    }}
                >
                    <CircularProgress
                        size={60}
                        thickness={4}
                        sx={{
                            color: theme.palette.primary.main,
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                        }}
                    />
                    <Typography
                        variant="h6"
                        color="text.primary"
                        sx={{ fontWeight: 600 }}
                    >
                        Đang đăng nhập...
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: 'center', maxWidth: 200 }}
                    >
                        Vui lòng chờ trong giây lát
                    </Typography>
                </Box>
            )}

            {/* ✅ Enhanced: Registration success message với better styling */}
            {isRegistrationSuccess && registrationMessage && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                        border: '1px solid',
                        borderColor: 'success.main',
                        bgcolor: alpha(theme.palette.success.light, 0.1),
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                            color: 'success.main'
                        },
                        '& .MuiAlert-message': {
                            fontWeight: 500
                        }
                    }}
                >
                    {registrationMessage}
                </Alert>
            )}

            {/* Enhanced Error Alert */}
            {(error || loginState.error) && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'error.main',
                        bgcolor: alpha(theme.palette.error.light, 0.1),
                        '& .MuiAlert-message': {
                            fontWeight: 500
                        }
                    }}
                >
                    {error || loginState.error}
                </Alert>
            )}

            {/* Enhanced Success message */}
            {loginState.success && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'success.main',
                        bgcolor: alpha(theme.palette.success.light, 0.1),
                        '& .MuiAlert-message': {
                            fontWeight: 500
                        }
                    }}
                >
                    Đăng nhập thành công! Đang chuyển hướng...
                </Alert>
            )}

            {/* Enhanced Login Form */}
            <form action={loginAction} autoComplete="on">
                <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    required
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                            },
                            '&.Mui-focused': {
                                transform: 'translateY(-1px)',
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                            }
                        },
                        '& .MuiInputLabel-root': {
                            fontWeight: 500,
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email sx={{ color: 'text.secondary' }} />
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
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                            },
                            '&.Mui-focused': {
                                transform: 'translateY(-1px)',
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                            }
                        },
                        '& .MuiInputLabel-root': {
                            fontWeight: 500,
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword((show) => !show)}
                                    edge="end"
                                    tabIndex={-1}
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                                        }
                                    }}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Enhanced form controls */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 2,
                    mb: 1
                }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                onChange={e => setRememberMe(e.target.checked)}
                                name="rememberMe"
                                color="primary"
                                sx={{
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                                    }
                                }}
                            />
                        }
                        label={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Ghi nhớ đăng nhập
                            </Typography>
                        }
                    />
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate('/forgot-password')}
                        sx={{
                            minWidth: 'auto',
                            textAlign: 'right',
                            fontWeight: 600,
                            borderRadius: 1,
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                transform: 'translateY(-1px)',
                            }
                        }}
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

                {/* Enhanced submit button */}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        mt: 3,
                        mb: 1,
                        height: 56,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.5)}`,
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        },
                        '&:disabled': {
                            background: theme.palette.action.disabled,
                            color: theme.palette.action.disabled,
                            transform: 'none',
                            boxShadow: 'none',
                        }
                    }}
                    disabled={loginPending || isLoading}
                    startIcon={
                        loginPending ?
                            <CircularProgress size={22} color="inherit" /> :
                            <LoginIcon />
                    }
                >
                    {loginPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
            </form>
        </Box>
    );
}
