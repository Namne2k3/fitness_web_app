import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Divider,
    ListItemIcon,
} from '@mui/material';
import {
    FitnessCenter,
    AccountCircle,
    ExitToApp,
    Person,
    Home,
    Login,
    PersonAdd,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

/**
 * Layout component cho Fitness Web App với MUI
 * Sử dụng React 19 patterns
 */
export default function Layout({ children }: LayoutProps) {
    const { user, isAuthenticated, logoutAction } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        handleClose();
    };

    const handleLogout = () => {
        logoutAction();
        handleClose();
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* AppBar */}
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    {/* Logo và tên app */}
                    <FitnessCenter sx={{ mr: 2 }} />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate('/')}
                    >
                        Fitness App
                    </Typography>

                    {/* Navigation buttons */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
                        <Button
                            color="inherit"
                            startIcon={<Home />}
                            onClick={() => navigate('/')}
                            sx={{
                                mr: 1,
                                backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent'
                            }}
                        >
                            Trang chủ
                        </Button>
                    </Box>

                    {/* User menu hoặc auth buttons */}
                    {isAuthenticated && user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                                Xin chào, {user.profile.firstName || user.username}
                            </Typography>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                {user.avatar ? (
                                    <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                                ) : (
                                    <AccountCircle />
                                )}
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => handleNavigation('/profile')}>
                                    <ListItemIcon>
                                        <Person fontSize="small" />
                                    </ListItemIcon>
                                    Hồ sơ cá nhân
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <ExitToApp fontSize="small" />
                                    </ListItemIcon>
                                    Đăng xuất
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                color="inherit"
                                startIcon={<Login />}
                                onClick={() => navigate('/login')}
                                variant={location.pathname === '/login' ? 'outlined' : 'text'}
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.5)',
                                    '&:hover': {
                                        borderColor: 'rgba(255,255,255,0.8)',
                                        backgroundColor: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            >
                                Đăng nhập
                            </Button>
                            <Button
                                color="inherit"
                                startIcon={<PersonAdd />}
                                onClick={() => navigate('/register')}
                                variant={location.pathname === '/register' ? 'outlined' : 'text'}
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.5)',
                                    '&:hover': {
                                        borderColor: 'rgba(255,255,255,0.8)',
                                        backgroundColor: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            >
                                Đăng ký
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,

                    backgroundColor: 'background.default',
                }}
            >
                {children}
            </Box>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: 'grey.100',
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © 2025 Fitness Web App. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}
