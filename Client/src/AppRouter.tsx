import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import TestProfilePage from './pages/TestProfilePage';
import LogoutPage from './pages/LogoutPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import fitnessTheme from './styles/theme';

/**
 * AppRouter - Định nghĩa các route chính cho ứng dụng với MUI Theme
 */
export default function AppRouter() {
    return (
        <ThemeProvider theme={fitnessTheme}>
            <CssBaseline />
            <AuthProvider>
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/test-profile" element={<TestProfilePage />} />
                            <Route path="/logout" element={<LogoutPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Layout>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}
