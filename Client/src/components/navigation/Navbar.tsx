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
                        background: `
                            linear-gradient(135deg, 
                                rgba(102, 126, 234, 0.15) 0%, 
                                rgba(118, 75, 162, 0.15) 50%,
                                rgba(99, 102, 241, 0.15) 100%
                            ),
                            rgba(255, 255, 255, 0.85)
                        `,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        overflow: 'visible',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            elevation: 12,
                            background: `
                                linear-gradient(135deg, 
                                    rgba(102, 126, 234, 0.2) 0%, 
                                    rgba(118, 75, 162, 0.2) 50%,
                                    rgba(99, 102, 241, 0.2) 100%
                                ),
                                rgba(255, 255, 255, 0.9)
                            `,
                            transform: 'translateY(-1px)',
                        },
                        // Dark mode support
                        ...(theme => theme.palette.mode === 'dark' && {
                            background: `
                                linear-gradient(135deg, 
                                    rgba(102, 126, 234, 0.2) 0%, 
                                    rgba(118, 75, 162, 0.2) 50%,
                                    rgba(99, 102, 241, 0.2) 100%
                                ),
                                rgba(18, 18, 18, 0.85)
                            `,
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            '&:hover': {
                                background: `
                                    linear-gradient(135deg, 
                                        rgba(102, 126, 234, 0.25) 0%, 
                                        rgba(118, 75, 162, 0.25) 50%,
                                        rgba(99, 102, 241, 0.25) 100%
                                    ),
                                    rgba(18, 18, 18, 0.9)
                                `,
                                transform: 'translateY(-1px)',
                            },
                        }),
                    }}
                >                    <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: { xs: 2, sm: 3, md: 4 },
                        py: { xs: 1.5, sm: 2 },
                        minHeight: '64px',
                    }}
                >
                        {/* Left Section: Logo + Brand + Mobile Menu */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 1, sm: 2 },
                                flex: '0 1 auto',
                                minWidth: 'fit-content',
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
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    TrackMe
                                </Typography>
                            </Box>
                        </Box>

                        {/* Center Section: Navigation Menu (chiếm nhiều nhất) */}
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                flex: '1 1 auto',
                                justifyContent: 'center',
                                mx: 3,
                            }}
                        >
                            <NavigationMenu />
                        </Box>

                        {/* Right Section: Auth Buttons hoặc User Menu */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                flex: '0 1 auto',
                                minWidth: 'fit-content',
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
