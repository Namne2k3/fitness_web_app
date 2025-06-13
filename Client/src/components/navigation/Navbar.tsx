import { FitnessCenter } from '@mui/icons-material';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import AuthButtons from './AuthButtons';
import MobileNavMenu from './MobileNavMenu';
import NavigationMenu from './NavigationMenu';
import UserMenu from './UserMenu';

/**
 * Navigation bar component for the application
 */
const Navbar: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <AppBar position="static" elevation={0}>
            <Toolbar>
                {/* Mobile menu */}
                <MobileNavMenu />

                {/* Left: Logo và tên app */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
                    <FitnessCenter sx={{ mr: 2 }} />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                        onClick={() => navigate('/')}
                    >
                        Fitness App
                    </Typography>
                </Box>

                {/* Center: Main navigation menu */}
                <Box sx={{ flex: 2, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', minWidth: 0 }}>
                    <NavigationMenu />
                </Box>

                {/* Right: User menu hoặc auth buttons */}
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minWidth: 0 }}>
                    {isAuthenticated && user ? (
                        <UserMenu user={user} />
                    ) : (
                        <AuthButtons location={location} navigate={navigate} />
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
