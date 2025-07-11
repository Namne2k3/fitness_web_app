import { Box } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './navigation/Navbar';
import Footer from './navigation/Footer';
import { ChatBot } from './chatbot';

interface LayoutProps {
    children: React.ReactNode;
}

/**
 * Layout component cho Fitness Web App với MUI
 * Sử dụng React 19 patterns
 * Updated: Refactored into smaller components
 */
export default function Layout({ children }: LayoutProps) {
    const location = useLocation();

    // Full-screen pages không cần navigation
    const fullScreenPages = ['/login', '/register'];
    const isFullScreenPage = fullScreenPages.includes(location.pathname); return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Hide AppBar cho full-screen pages */}
            {!isFullScreenPage && <Navbar />}

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    // Không add padding cho full-screen pages
                    ...(isFullScreenPage ? {} : { backgroundColor: 'background.default' })
                }}
            >
                {children}
            </Box>

            {/* Hide Footer cho full-screen pages */}
            {!isFullScreenPage && <Footer />}

            {/* ChatBot - hiển thị trên tất cả trang trừ full-screen */}
            {!isFullScreenPage && <ChatBot />}
        </Box>
    );
}
