/**
 * Register Form Component - Modern UI với React 19 Actions & Material UI
 * Features: Multi-step form, Material UI components, React 19 useActionState
 */
import {
    EmailOutlined,
    FitnessCenter,
    LockOutlined,
    NavigateBefore,
    NavigateNext,
    PersonOutline,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    Fade,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FitnessGoal } from '../../types';
import { useNavigate } from 'react-router-dom';

// ✅ Fitness goals options - match với backend enum
const fitnessGoals = [
    { value: 'weight_loss' as FitnessGoal, label: 'Giảm cân', icon: '🎯' },
    { value: 'muscle_gain' as FitnessGoal, label: 'Tăng cơ', icon: '💪' },
    { value: 'endurance' as FitnessGoal, label: 'Tăng sức bền', icon: '🏃‍♂️' },
    { value: 'strength' as FitnessGoal, label: 'Tăng sức mạnh', icon: '🏋️‍♂️' },
    { value: 'flexibility' as FitnessGoal, label: 'Tăng độ linh hoạt', icon: '🧘‍♀️' },
    { value: 'general_fitness' as FitnessGoal, label: 'Sức khỏe tổng quát', icon: '❤️' }
];

interface FormStepProps {
    children: React.ReactNode;
}

/**
 * Component wrapper cho mỗi step của form
 */
const FormStep: React.FC<FormStepProps> = ({ children }) => (
    <Fade in timeout={300}>
        <Box>{children}</Box>
    </Fade>
);

/**
 * Multi-step Register Form với Material UI và React 19 Actions
 */
export default function RegisterForm() {
    const { registerAction, registerState, registerPending, isLoading, error } = useAuth();
    const navigate = useNavigate()

    // Form state management
    const [currentStep, setCurrentStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedGoals, setSelectedGoals] = useState<FitnessGoal[]>([]);

    useEffect(() => {
        // Navigate when registerState.success is true
        if (registerState.success) {
            // Delay để user thấy success message trước khi chuyển trang
            const timer = setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.',
                        registrationSuccess: true
                    }
                });
            }, 1500); // 1.5 seconds delay

            return () => clearTimeout(timer);
        }
    }, [navigate, registerState.success]);

    // ✅ ADD: Controlled form state
    const [formData, setFormData] = useState({
        // Step 1 data
        email: '',
        username: '',
        password: '',
        confirmPassword: '',

        // Step 2 data
        firstName: '',
        lastName: '',
        age: '',
        gender: 'male',
        weight: '',
        height: '',
        experienceLevel: 'beginner'
    });

    const steps = ['Tài khoản', 'Thông tin cá nhân', 'Mục tiêu fitness'];

    // ✅ Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };    // ✅ Handle select changes
    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ✅ Navigation functions
    const handleNext = () => {
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    // ✅ Fitness goal toggle function
    const toggleFitnessGoal = (goal: FitnessGoal) => {
        setSelectedGoals(prev =>
            prev.includes(goal)
                ? prev.filter(g => g !== goal)
                : [...prev, goal]
        );
    };    // ✅ Manual form submission với nested profile structure

    const handleFinalSubmit = () => {
        // Tạo nested object structure cho API
        const registrationData = {
            // Top-level authentication fields
            email: formData.email,
            username: formData.username,
            password: formData.password,
            confirmPassword: formData.confirmPassword,

            // Nested profile object
            profile: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                age: parseInt(formData.age),
                weight: parseFloat(formData.weight),
                height: parseFloat(formData.height),
                gender: formData.gender,
                fitnessGoals: selectedGoals,
                experienceLevel: formData.experienceLevel,
                bio: `Người dùng mới tham gia TrackMe với mục tiêu ${selectedGoals.join(', ')}`
            }
        };

        // Create FormData với nested structure
        const submitFormData = new FormData();

        // Add top-level fields
        submitFormData.append('email', registrationData.email);
        submitFormData.append('username', registrationData.username);
        submitFormData.append('password', registrationData.password);
        submitFormData.append('confirmPassword', registrationData.confirmPassword);

        // Add profile as JSON string
        submitFormData.append('profile', JSON.stringify(registrationData.profile));

        // Debug log
        console.log('Submitting registration data:');
        console.log(JSON.stringify(registrationData, null, 2));

        for (const [key, value] of submitFormData.entries()) {
            console.log(key, value);
        }

        // Call register action
        registerAction(submitFormData);
    };


    return (
        <Box>
            {/* Progress indicator */}
            <LinearProgress
                variant="determinate"
                value={((currentStep + 1) / steps.length) * 100}
                sx={{ mb: 4, borderRadius: 2, height: 6 }}
            />

            {/* Error messages */}
            {(error || registerState.error) && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error || registerState.error}
                </Alert>
            )}

            {/* Success message */}
            {registerState.success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Đăng ký thành công! Chào mừng bạn đến với TrackMe!
                </Alert>
            )}

            {/* Step 1: Account Information */}
            {currentStep === 0 && (
                <FormStep>
                    <Stack spacing={3}>
                        <TextField
                            name="email"
                            type="email"
                            label="Địa chỉ email"
                            required
                            fullWidth
                            variant="outlined"
                            value={formData.email}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        <TextField
                            name="username"
                            type="text"
                            label="Tên người dùng"
                            required
                            fullWidth
                            variant="outlined"
                            value={formData.username}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutline color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        <TextField
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label="Mật khẩu"
                            required
                            fullWidth
                            variant="outlined"
                            value={formData.password}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        <TextField
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            label="Xác nhận mật khẩu"
                            required
                            fullWidth
                            variant="outlined"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Stack>
                </FormStep>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 1 && (
                <FormStep>
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="firstName"
                                type="text"
                                label="Tên"
                                required
                                fullWidth
                                variant="outlined"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                name="lastName"
                                type="text"
                                label="Họ"
                                required
                                fullWidth
                                variant="outlined"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="age"
                                type="number"
                                label="Tuổi"
                                required
                                fullWidth
                                variant="outlined"
                                value={formData.age}
                                onChange={handleInputChange}
                                inputProps={{ min: 13, max: 120 }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                                <InputLabel id="gender-label">Giới tính</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    name="gender"
                                    label="Giới tính"
                                    required
                                    value={formData.gender}
                                    onChange={(e) => handleSelectChange('gender', e.target.value)}
                                >
                                    <MenuItem value="male">Nam</MenuItem>
                                    <MenuItem value="female">Nữ</MenuItem>
                                    <MenuItem value="other">Khác</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="weight"
                                type="number"
                                label="Cân nặng (kg)"
                                required
                                fullWidth
                                variant="outlined"
                                value={formData.weight}
                                onChange={handleInputChange}
                                inputProps={{ min: 20, max: 300 }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                name="height"
                                type="number"
                                label="Chiều cao (cm)"
                                required
                                fullWidth
                                variant="outlined"
                                value={formData.height}
                                onChange={handleInputChange}
                                inputProps={{ min: 100, max: 250 }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Box>

                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Trình độ tập luyện</InputLabel>
                            <Select
                                name="experienceLevel"
                                label="Trình độ tập luyện"
                                required
                                value={formData.experienceLevel}
                                onChange={(e) => handleSelectChange('experienceLevel', e.target.value)}
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value="beginner">Mới bắt đầu</MenuItem>
                                <MenuItem value="intermediate">Trung cấp</MenuItem>
                                <MenuItem value="advanced">Nâng cao</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </FormStep>
            )}

            {/* Step 3: Fitness Goals */}
            {currentStep === 2 && (
                <FormStep>
                    <Stack spacing={3}>
                        <Typography variant="h6" component="h3" gutterBottom>
                            Chọn mục tiêu fitness
                        </Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                            {fitnessGoals.map((goal) => (
                                <Card
                                    key={goal.value}
                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',
                                        border: selectedGoals.includes(goal.value) ? 2 : 1,
                                        borderColor: selectedGoals.includes(goal.value)
                                            ? 'primary.main'
                                            : 'divider',
                                        bgcolor: selectedGoals.includes(goal.value)
                                            ? 'primary.light'
                                            : 'background.paper',
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                    onClick={() => toggleFitnessGoal(goal.value)}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <span style={{ fontSize: '1.5rem' }}>{goal.icon}</span>
                                        <Typography variant="body2">{goal.label}</Typography>
                                    </Box>
                                </Card>
                            ))}
                        </Box>

                        {selectedGoals.length > 0 && (
                            <Box>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Mục tiêu đã chọn:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {selectedGoals.map((goal) => {
                                        const goalOption = fitnessGoals.find(g => g.value === goal);
                                        return (
                                            <Chip
                                                key={goal}
                                                label={goalOption?.label}
                                                onDelete={() => toggleFitnessGoal(goal)}
                                                color="primary"
                                                size="small"
                                            />
                                        );
                                    })}
                                </Box>
                            </Box>
                        )}
                    </Stack>
                </FormStep>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    startIcon={<NavigateBefore />}
                    sx={{ borderRadius: 2 }}
                >
                    Quay lại
                </Button>

                {currentStep < steps.length - 1 ? (
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        endIcon={<NavigateNext />}
                        sx={{ borderRadius: 2 }}
                    >
                        Tiếp theo
                    </Button>
                ) : (
                    <Button
                        type="button"
                        variant="contained"
                        onClick={handleFinalSubmit}
                        disabled={registerPending || isLoading || selectedGoals.length === 0}
                        startIcon={<FitnessCenter />}
                        sx={{ borderRadius: 2 }}
                    >
                        {registerPending ? 'Đang tạo tài khoản...' : 'Hoàn thành đăng ký'}
                    </Button>
                )}
            </Box>
        </Box>
    );
}
