import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProfilePage from './pages/account/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import NotFoundPage from './pages/app/NotFoundPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import LogoutPage from './pages/auth/LogoutPage';
import HomePage from './pages/home/HomePage';
import fitnessTheme from './styles/theme';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

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
                            <Route path="/logout" element={<LogoutPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Layout>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}
