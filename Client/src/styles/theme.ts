import { createTheme } from '@mui/material/styles';

/**
 * Custom theme cho Fitness Web App
 * Sử dụng màu sắc phù hợp với fitness theme
 */
export const fitnessTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2', // Blue for primary actions
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ff6b35', // Orange for energy/fitness
            light: '#ff8a65',
            dark: '#e64a19',
            contrastText: '#ffffff',
        },
        success: {
            main: '#4caf50', // Green for achievements
            light: '#81c784',
            dark: '#388e3c',
        },
        error: {
            main: '#f44336',
            light: '#e57373',
            dark: '#d32f2f',
        },
        warning: {
            main: '#ff9800',
            light: '#ffb74d',
            dark: '#f57c00',
        },
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none', // Không viết hoa tự động
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 24px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                    },
                },
                containedSecondary: {
                    background: 'linear-gradient(45deg, #ff6b35 30%, #ff8a65 90%)',
                    boxShadow: '0 3px 5px 2px rgba(255, 107, 53, .3)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #e64a19 30%, #ff6b35 90%)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                },
            },
        },
    },
});

export default fitnessTheme;
