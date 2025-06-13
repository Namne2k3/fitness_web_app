import React from 'react';
import { Box, Container, Typography } from '@mui/material';

/**
 * Footer component for the application
 */
const Footer: React.FC = () => {
    return (
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
    );
};

export default Footer;
