import {
    LocalFireDepartment as FireIcon,
    FitnessCenter as FitnessCenterIcon,
    MonitorHeart as HeartIcon,
    Psychology as PsychologyIcon,
    DirectionsRun as RunIcon,
    Speed as SpeedIcon,
    Straighten as StraightenIcon,
    MonitorWeight as WeightIcon,
    SelfImprovement as YogaIcon
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    LinearProgress,
    Paper,
    Typography
} from '@mui/material';
import { useMemo } from 'react';
import { ExperienceLevel, FitnessGoal, User, UserProfile } from '../../types';

/**
 * Props interface for FitnessStatsSection
 * Allows either a complete user object or just the userProfile
 */
interface FitnessStatsSectionProps {
    user?: User;
    userProfile?: UserProfile;
}

/**
 * Component hiển thị thông tin fitness của user với React 19 features
 * 
 * @param props Component props
 * @param props.user Complete user object (optional)
 * @param props.userProfile User profile object directly (optional)
 * @returns Component displaying fitness statistics
 */
const FitnessStatsSection = ({ user, userProfile }: FitnessStatsSectionProps) => {
    // Use userProfile directly if provided, otherwise extract it from user
    const profile = userProfile || (user?.profile);

    // ✅ Always call hooks at the top level
    // Tính BMI từ chiều cao và cân nặng
    const bmi = useMemo(() => {
        if (!profile?.height || !profile?.weight) return null;
        // Công thức BMI: cân nặng (kg) / (chiều cao (m))^2
        // Convert height from cm to m
        const heightInMeters = profile.height / 100;
        return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }, [profile?.height, profile?.weight]);

    // Phân loại BMI
    const bmiCategory = useMemo(() => {
        if (!bmi) return null;
        const bmiValue = parseFloat(bmi);
        if (bmiValue < 18.5) return { label: 'Thiếu cân', color: 'warning' };
        if (bmiValue < 25) return { label: 'Bình thường', color: 'success' };
        if (bmiValue < 30) return { label: 'Thừa cân', color: 'warning' };
        return { label: 'Béo phì', color: 'error' };
    }, [bmi]);

    // Map the experience level to a percentage for progress bar
    const experienceLevelProgress = useMemo(() => {
        if (!profile?.experienceLevel) return 0;
        switch (profile.experienceLevel) {
            case ExperienceLevel.BEGINNER:
                return 33;
            case ExperienceLevel.INTERMEDIATE:
                return 66;
            case ExperienceLevel.ADVANCED:
                return 100;
            default:
                return 0;
        }
    }, [profile?.experienceLevel]);

    // Helper function to get icon for fitness goals
    const getGoalIcon = (goal: FitnessGoal) => {
        switch (goal) {
            case FitnessGoal.WEIGHT_LOSS:
                return <FireIcon />;
            case FitnessGoal.MUSCLE_GAIN:
                return <FitnessCenterIcon />;
            case FitnessGoal.STRENGTH:
                return <SpeedIcon />;
            case FitnessGoal.ENDURANCE:
                return <RunIcon />;
            case FitnessGoal.FLEXIBILITY:
                return <YogaIcon />;
            case FitnessGoal.GENERAL_FITNESS:
                return <HeartIcon />;
            default:
                return <FitnessCenterIcon />;
        }
    };

    // If neither is provided, return fallback
    if (!profile) {
        return (
            <Card
                sx={{
                    mb: 3,
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
            >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 64, height: 64 }}>
                        <FitnessCenterIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Chỉ số thể hình
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Chưa có thông tin thể hình
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    // Helper function to get Vietnamese translation of fitness goals
    const getGoalLabel = (goal: FitnessGoal): string => {
        switch (goal) {
            case FitnessGoal.WEIGHT_LOSS:
                return 'Giảm cân';
            case FitnessGoal.MUSCLE_GAIN:
                return 'Tăng cơ';
            case FitnessGoal.STRENGTH:
                return 'Sức mạnh';
            case FitnessGoal.ENDURANCE:
                return 'Sức bền';
            case FitnessGoal.FLEXIBILITY:
                return 'Sự dẻo dai';
            case FitnessGoal.GENERAL_FITNESS:
                return 'Thể hình chung';
            default:
                return goal;
        }
    };

    // Helper for experience level display
    const getExperienceLevelLabel = (level: ExperienceLevel): string => {
        switch (level) {
            case ExperienceLevel.BEGINNER:
                return 'Người mới bắt đầu';
            case ExperienceLevel.INTERMEDIATE:
                return 'Trung cấp';
            case ExperienceLevel.ADVANCED:
                return 'Nâng cao';
            default:
                return level;
        }
    }; return (
        <Card
            sx={{
                mb: 3,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                borderRadius: 3,
                border: '1px solid rgba(102, 126, 234, 0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                overflow: 'hidden'
            }}
        >
            <CardContent sx={{ p: 0 }}>
                {/* Header Section */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                        <FitnessCenterIcon sx={{ color: 'white', fontSize: 28 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" component="h2" fontWeight="bold">
                            Chỉ số thể hình
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Thống kê sức khỏe và thể lực của bạn
                        </Typography>
                    </Box>
                </Box>

                {/* Content Section */}
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        {/* Physical Stats Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Height Card */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(33, 150, 243, 0.2)'
                                    }}
                                >
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Avatar sx={{ bgcolor: '#2196f3', width: 32, height: 32, mr: 1.5 }}>
                                            <StraightenIcon sx={{ fontSize: 18 }} />
                                        </Avatar>
                                        <Typography variant="subtitle1" fontWeight="600" color="#1976d2">
                                            Chiều cao
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" color="#1565c0">
                                        {profile.height}
                                        <Typography component="span" variant="h6" sx={{ ml: 0.5, opacity: 0.7 }}>
                                            cm
                                        </Typography>
                                    </Typography>
                                </Paper>

                                {/* Weight Card */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(156, 39, 176, 0.2)'
                                    }}
                                >
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Avatar sx={{ bgcolor: '#9c27b0', width: 32, height: 32, mr: 1.5 }}>
                                            <WeightIcon sx={{ fontSize: 18 }} />
                                        </Avatar>
                                        <Typography variant="subtitle1" fontWeight="600" color="#7b1fa2">
                                            Cân nặng
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" color="#6a1b9a">
                                        {profile.weight}
                                        <Typography component="span" variant="h6" sx={{ ml: 0.5, opacity: 0.7 }}>
                                            kg
                                        </Typography>
                                    </Typography>
                                </Paper>
                            </Box>
                        </Grid>

                        {/* BMI Section */}
                        <Grid item xs={12} md={6}>
                            {bmi && bmiCategory && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        background: bmiCategory.color === 'success'
                                            ? 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)'
                                            : bmiCategory.color === 'warning'
                                                ? 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)'
                                                : 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                                        borderRadius: 2,
                                        border: `1px solid ${bmiCategory.color === 'success'
                                            ? 'rgba(76, 175, 80, 0.2)'
                                            : bmiCategory.color === 'warning'
                                                ? 'rgba(255, 152, 0, 0.2)'
                                                : 'rgba(244, 67, 54, 0.2)'
                                            }`,
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography variant="subtitle1" gutterBottom fontWeight="600">
                                        Chỉ số BMI
                                    </Typography>
                                    <Typography
                                        variant="h2"
                                        fontWeight="bold"
                                        color={
                                            bmiCategory.color === 'success' ? '#388e3c' :
                                                bmiCategory.color === 'warning' ? '#f57c00' : '#d32f2f'
                                        }
                                        gutterBottom
                                    >
                                        {bmi}
                                    </Typography>
                                    <Chip
                                        label={bmiCategory.label}
                                        color={bmiCategory.color as 'success' | 'warning' | 'error'}
                                        sx={{
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            mb: 2
                                        }}
                                    />

                                    {/* BMI Scale */}
                                    <Box sx={{ mt: 2 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min((parseFloat(bmi) / 35) * 100, 100)}
                                            color={bmiCategory.color as 'success' | 'warning' | 'error'}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: 'rgba(0,0,0,0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 4
                                                }
                                            }}
                                        />
                                        <Box sx={{
                                            mt: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '0.7rem',
                                            color: 'text.secondary',
                                            fontWeight: 500
                                        }}>
                                            <span>18.5</span>
                                            <span>25</span>
                                            <span>30</span>
                                        </Box>
                                    </Box>
                                </Paper>
                            )}
                        </Grid>

                        {/* Experience Level */}
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    background: 'linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(139, 195, 74, 0.2)'
                                }}
                            >
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar sx={{ bgcolor: '#8bc34a', width: 32, height: 32, mr: 1.5 }}>
                                        <SpeedIcon sx={{ fontSize: 18 }} />
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="600" color="#689f38">
                                        Mức độ kinh nghiệm
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={experienceLevelProgress}
                                            color="success"
                                            sx={{
                                                height: 12,
                                                borderRadius: 6,
                                                bgcolor: 'rgba(139, 195, 74, 0.2)',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 6
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Chip
                                        label={getExperienceLevelLabel(profile.experienceLevel)}
                                        color="success"
                                        variant="filled"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Fitness Goals */}
                        <Grid item xs={12}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(233, 30, 99, 0.2)'
                                }}
                            >
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar sx={{ bgcolor: '#e91e63', width: 32, height: 32, mr: 1.5 }}>
                                        <HeartIcon sx={{ fontSize: 18 }} />
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="600" color="#c2185b">
                                        Mục tiêu tập luyện
                                    </Typography>
                                </Box>
                                <Box display="flex" flexWrap="wrap" gap={1.5}>
                                    {profile.fitnessGoals.map(goal => (
                                        <Chip
                                            key={goal}
                                            icon={getGoalIcon(goal)}
                                            label={getGoalLabel(goal)}
                                            sx={{
                                                background: 'rgba(233, 30, 99, 0.1)',
                                                color: '#ad1457',
                                                fontWeight: 600,
                                                border: '1px solid rgba(233, 30, 99, 0.3)',
                                                '&:hover': {
                                                    background: 'rgba(233, 30, 99, 0.2)',
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Medical Conditions (if any) */}
                        {profile.medicalConditions && profile.medicalConditions.length > 0 && (
                            <Grid item xs={12}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(255, 152, 0, 0.2)'
                                    }}
                                >
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar sx={{ bgcolor: '#ff9800', width: 32, height: 32, mr: 1.5 }}>
                                            <PsychologyIcon sx={{ fontSize: 18 }} />
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="600" color="#f57c00">
                                            Tình trạng sức khỏe cần lưu ý
                                        </Typography>
                                    </Box>
                                    <Box display="flex" flexWrap="wrap" gap={1.5}>
                                        {profile.medicalConditions.map((condition, index) => (
                                            <Chip
                                                key={index}
                                                label={condition}
                                                variant="outlined"
                                                sx={{
                                                    borderColor: 'rgba(255, 152, 0, 0.5)',
                                                    color: '#ef6c00',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        background: 'rgba(255, 152, 0, 0.1)',
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
}

export default FitnessStatsSection;
