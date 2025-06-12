/**
 * Register Form Component - Modern UI với React 19 Actions & Material UI
 * Features: Multi-step form, Material UI components, React 19 useActionState
 */
import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Stack,
    Alert,
    IconButton,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    LinearProgress,
    Card,
    CardContent,
    Fade,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    PersonOutline,
    EmailOutlined,
    LockOutlined,
    FitnessCenter,
    NavigateNext,
    NavigateBefore,
    CheckCircle,
    Close,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { ExperienceLevel, FitnessGoal } from '../../types';

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
    const { registerAction, isLoading, error, clearError } = useAuth();

    // Form state management
    const [currentStep, setCurrentStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedGoals, setSelectedGoals] = useState<FitnessGoal[]>([]);

    const steps = ['Tài khoản', 'Thông tin cá nhân', 'Mục tiêu fitness'];

    // Fitness goals options
    const fitnessGoals = [
        { value: FitnessGoal.WEIGHT_LOSS, label: 'Giảm cân', icon: '🔥' },
        { value: FitnessGoal.MUSCLE_GAIN, label: 'Tăng cơ', icon: '💪' },
        { value: FitnessGoal.STRENGTH, label: 'Tăng sức mạnh', icon: '🏋️' },
        { value: FitnessGoal.ENDURANCE, label: 'Tăng sức bền', icon: '🏃' },
        { value: FitnessGoal.FLEXIBILITY, label: 'Tăng độ dẻo dai', icon: '🧘' },
        { value: FitnessGoal.GENERAL_FITNESS, label: 'Sức khỏe tổng quát', icon: '❤️' },
    ];

    /**
     * Handle fitness goal selection
     */
    const toggleFitnessGoal = (goal: FitnessGoal) => {
        if (selectedGoals.includes(goal)) {
            setSelectedGoals(selectedGoals.filter((g) => g !== goal));
        } else {
            setSelectedGoals([...selectedGoals, goal]);
        }
    };

    /**
     * Navigate to next step
     */
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    /**
     * Navigate to previous step
     */
    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    /**
     * Handle form submission
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Add selected goals to form data
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        formData.append('fitnessGoals', JSON.stringify(selectedGoals));

        // Submit using React 19 Action
        registerAction(formData);
    };

    return (
        <Box>
            {/* Progress Stepper */}
            <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Progress bar */}
            <LinearProgress
                variant="determinate"
                value={((currentStep + 1) / steps.length) * 100}
                sx={{ mb: 4, borderRadius: 2, height: 6 }}
            />

            {/* Error Alert */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={clearError}
                        >
                            <Close fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
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
                        <Stack spacing={3}>              <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="firstName"
                                type="text"
                                label="Tên"
                                required
                                fullWidth
                                variant="outlined"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                name="lastName"
                                type="text"
                                label="Họ"
                                required
                                fullWidth
                                variant="outlined"
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
                                    inputProps={{ min: 13, max: 120 }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <TextField
                                    name="weight"
                                    type="number"
                                    label="Cân nặng (kg)"
                                    required
                                    fullWidth
                                    variant="outlined"
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
                                    defaultValue=""
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value={ExperienceLevel.BEGINNER}>
                                        Mới bắt đầu
                                    </MenuItem>
                                    <MenuItem value={ExperienceLevel.INTERMEDIATE}>
                                        Trung cấp
                                    </MenuItem>
                                    <MenuItem value={ExperienceLevel.ADVANCED}>
                                        Nâng cao
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </FormStep>
                )}

                {/* Step 3: Fitness Goals */}
                {currentStep === 2 && (
                    <FormStep>
                        <Stack spacing={3}>
                            <Typography
                                variant="h6"
                                component="h3"
                                textAlign="center"
                                color="primary"
                                gutterBottom
                            >
                                Chọn mục tiêu fitness của bạn
                            </Typography>
                            <Typography
                                variant="body2"
                                textAlign="center"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                Bạn có thể chọn nhiều mục tiêu
                            </Typography>              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                {fitnessGoals.map((goal) => (
                                    <Card
                                        key={goal.value}
                                        onClick={() => toggleFitnessGoal(goal.value)}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            border: 2,
                                            borderColor: selectedGoals.includes(goal.value)
                                                ? 'primary.main'
                                                : 'grey.200',
                                            backgroundColor: selectedGoals.includes(goal.value)
                                                ? 'primary.light'
                                                : 'background.paper',
                                            position: 'relative',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: 2,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                                {goal.icon}
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {goal.label}
                                            </Typography>
                                            {selectedGoals.includes(goal.value) && (
                                                <CheckCircle
                                                    color="primary"
                                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>

                            {selectedGoals.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Mục tiêu đã chọn:
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                        {selectedGoals.map((goal) => {
                                            const goalInfo = fitnessGoals.find((g) => g.value === goal);
                                            return (
                                                <Chip
                                                    key={goal}
                                                    label={`${goalInfo?.icon} ${goalInfo?.label}`}
                                                    onDelete={() => toggleFitnessGoal(goal)}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            );
                                        })}
                                    </Stack>
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
                            type="submit"
                            variant="contained"
                            disabled={isLoading || selectedGoals.length === 0}
                            startIcon={<FitnessCenter />}
                            sx={{ borderRadius: 2 }}
                        >
                            {isLoading ? 'Đang tạo tài khoản...' : 'Hoàn thành đăng ký'}
                        </Button>
                    )}
                </Box>
            </form>    </Box>
    );
}
