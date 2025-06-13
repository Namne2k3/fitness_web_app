import React from 'react';
import { Button, Box } from '@mui/material';
import { Login, PersonAdd } from '@mui/icons-material';
import { Location, NavigateFunction } from 'react-router-dom';

interface AuthButtonsProps {
    location: Location;
    navigate: NavigateFunction;
}

/**
 * Authentication buttons với modern design
 */
const AuthButtons: React.FC<AuthButtonsProps> = ({ location, navigate }) => {
    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Sign In Button */}
            <Button
                variant="text"
                startIcon={<Login />}
                onClick={() => navigate('/login', { state: { from: location } })}
                sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(103, 126, 234, 0.08)',
                        color: 'primary.main',
                        transform: 'translateY(-1px)',
                    },
                }}
            >
                Đăng nhập
            </Button>

            {/* Sign Up Button */}
            <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => navigate('/register', { state: { from: location } })}
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(103, 126, 234, 0.3)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(103, 126, 234, 0.4)',
                    },
                }}
            >
                Đăng ký
            </Button>
        </Box>
    );
};

export default AuthButtons;
