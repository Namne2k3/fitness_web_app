import React from 'react';
import { Button, Box } from '@mui/material';
import { Login, PersonAdd } from '@mui/icons-material';
import { Location, NavigateFunction } from 'react-router-dom';

interface AuthButtonsProps {
    location: Location;
    navigate: NavigateFunction;
}

/**
 * Authentication buttons component for login and registration
 */
const AuthButtons: React.FC<AuthButtonsProps> = ({ location, navigate }) => {
    return (
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
    );
};

export default AuthButtons;
