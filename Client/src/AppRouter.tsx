/* eslint-disable @typescript-eslint/no-explicit-any */
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FontDemo from './components/common/FontDemo';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import ProfilePage from './pages/account/ProfilePage';
import NotFoundPage from './pages/app/NotFoundPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import LoginPage from './pages/auth/LoginPage';
import LogoutPage from './pages/auth/LogoutPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ExerciseDetailPage from './pages/exercise/ExerciseDetailPage';
import ExercisePage from './pages/exercise/ExercisePage';
import HomePage from './pages/home/HomePage';
import MyWorkoutPage from './pages/my-workout/MyWorkout';
// import StartWorkoutPage from './pages/workout/StartWorkout';
import WorkoutSessionPage from './pages/workout/WorkoutSession';
import CreateWorkoutPage from './pages/workout/create/CreateWorkoutPage';
import WorkoutDetailPage from './pages/workout/WorkoutDetailPage';
import WorkoutPage from './pages/workout/WorkoutPage';
import fitnessTheme from './styles/theme';
import StartWorkoutPage from './pages/workout/StartWorkout';

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
                                <Route path="/workouts" element={<WorkoutPage />} />
                                <Route path="/workouts/create" element={<CreateWorkoutPage />} />
                                <Route path="/my-workouts" element={<MyWorkoutPage />} />
                                <Route path="/workouts/:id/start" element={<StartWorkoutPage />} />
                                {/* Workout Detail Route */}
                                <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
                                <Route path="/library/exercises" element={<ExercisePage />} />
                                <Route path="/exercises/:slug" element={<ExerciseDetailPage />} />
                                <Route path="/font-demo" element={<FontDemo />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </Layout>
                    </BrowserRouter>
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
