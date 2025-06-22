/* eslint-disable @typescript-eslint/no-explicit-any */
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
import WorkoutPage from './pages/workout/WorkoutPage';
import ExercisePage from './pages/exercise/ExercisePage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ✅ React Query Client Configuration
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // React 19 optimizations
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
            retry: (failureCount, error: any) => {
                // Don't retry for 4xx errors
                if (error?.response?.status >= 400 && error?.response?.status < 500) {
                    return false;
                }
                return failureCount < 3;
            },
        },
        mutations: {
            retry: (failureCount, error: any) => {
                // Don't retry mutations for client errors
                if (error?.response?.status >= 400 && error?.response?.status < 500) {
                    return false;
                }
                return failureCount < 2;
            },
        },
    },
});
/**
 * AppRouter - Định nghĩa các route chính cho ứng dụng với MUI Theme
 */
export default function AppRouter() {
    return (
        <ThemeProvider theme={fitnessTheme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <BrowserRouter>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                                <Route path="/reset-password" element={<ResetPasswordPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/logout" element={<LogoutPage />} />
                                <Route path="/workouts/browse" element={<WorkoutPage />} />
                                <Route path="/library/exercises" element={<ExercisePage />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </Layout>
                    </BrowserRouter>
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
