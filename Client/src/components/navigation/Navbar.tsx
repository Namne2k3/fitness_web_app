import { FitnessCenter } from '@mui/icons-material';
import { Box, Container, Paper, Typography } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import AuthButtons from './AuthButtons';
import MobileNavMenu from './MobileNavMenu';
import NavigationMenu from './NavigationMenu';
import UserMenu from './UserMenu';

/**
 * Modern sticky navigation bar component với rounded design
 */
const Navbar: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); return (
        <>
            {/* Sticky Navbar Container - Fixed positioning */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 16,
                    left: 0,
                    right: 0,
                    zIndex: 1300,
                    px: { xs: 2, sm: 3, md: 4 },
                    py: 0,
                }}
            >
                <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 0 } }}>                    <Paper
                    elevation={8}
                    sx={{
                        borderRadius: 3,
                        backdropFilter: 'blur(20px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        overflow: 'visible', // Changed from 'hidden' to 'visible'
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            elevation: 12,
                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        },
                        // Dark mode support
                        ...(theme => theme.palette.mode === 'dark' && {
                            backgroundColor: 'rgba(18, 18, 18, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                                backgroundColor: 'rgba(18, 18, 18, 0.98)',
                            },
                        }),
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: { xs: 2, sm: 3, md: 4 },
                            py: { xs: 1.5, sm: 2 },
                            minHeight: '64px',
                        }}
                    >
                        {/* Left Section: Logo + Brand + Navigation */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 2, md: 4 },
                                flex: 1,
                                minWidth: 0,
                            }}
                        >
                            {/* Mobile Menu (chỉ hiện trên mobile) */}
                            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                                <MobileNavMenu />
                            </Box>

                            {/* Logo + Brand */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    },
                                }}
                                onClick={() => navigate('/')}
                            >
                                <Box
                                    sx={{
                                        p: 1,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <FitnessCenter sx={{ fontSize: 24 }} />
                                </Box>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        display: { xs: 'none', sm: 'block' },
                                    }}
                                >
                                    TrackMe
                                </Typography>
                            </Box>

                            {/* Desktop Navigation Menu */}
                            <Box
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    flex: 1,
                                    justifyContent: 'center',
                                    maxWidth: '600px',
                                }}
                            >
                                <NavigationMenu />
                            </Box>
                        </Box>

                        {/* Right Section: Auth Buttons hoặc User Menu */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                flexShrink: 0,
                            }}
                        >
                            {isAuthenticated && user ? (
                                <UserMenu user={user} />
                            ) : (
                                <AuthButtons location={location} navigate={navigate} />
                            )}
                        </Box>
                    </Box>
                </Paper>
                </Container>
            </Box>
        </>
    );
};

export default Navbar;
