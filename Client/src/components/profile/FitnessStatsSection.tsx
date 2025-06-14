import { useMemo } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Divider,
    Grid,
    Chip,
    LinearProgress
} from '@mui/material';
import {
    FitnessCenter as FitnessCenterIcon,
    Straighten as StraightenIcon,
    MonitorWeight as WeightIcon
} from '@mui/icons-material';
import { User, FitnessGoal, ExperienceLevel, UserProfile } from '../../types';

/**
 * Props interface for FitnessStatsSection
 * Allows either a complete user object or just the userProfile
 */
interface FitnessStatsSectionProps {
    user?: User;
    userProfile?: UserProfile;
}

/**
 * Component hiển thị thông tin fitness của user
 * Sử dụng React 19 patterns
 * 
 * @param props Component props
 * @param props.user Complete user object (optional)
 * @param props.userProfile User profile object directly (optional)
 * @returns Component displaying fitness statistics
 * 
 * Note: Component requires either user or userProfile prop, but not necessarily both
 */
function FitnessStatsSection({ user, userProfile }: FitnessStatsSectionProps) {
    // Use userProfile directly if provided, otherwise extract it from user
    const profile = userProfile || (user?.profile);

    // If neither is provided, return null
    if (!profile) {
        return null;
    }

    // Tính BMI từ chiều cao và cân nặng
    const bmi = useMemo(() => {
        if (profile.height && profile.weight) {
            // Công thức BMI: cân nặng (kg) / (chiều cao (m))^2
            // Convert height from cm to m
            const heightInMeters = profile.height / 100;
            return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
        }
        return null;
    }, [profile.height, profile.weight]);

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
    }, [profile.experienceLevel]);

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
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                    Chỉ số thể hình
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    {/* Height and Weight */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 3 }}>
                            <Box display="flex" alignItems="center" mb={1}>
                                <StraightenIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1">Chiều cao</Typography>
                            </Box>
                            <Typography variant="h5" gutterBottom>
                                {profile.height} <Typography component="span" variant="body2">cm</Typography>
                            </Typography>
                        </Box>

                        <Box>
                            <Box display="flex" alignItems="center" mb={1}>
                                <WeightIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1">Cân nặng</Typography>
                            </Box>
                            <Typography variant="h5">
                                {profile.weight} <Typography component="span" variant="body2">kg</Typography>
                            </Typography>
                        </Box>
                    </Grid>

                    {/* BMI */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Chỉ số BMI
                            </Typography>
                            <Typography variant="h4" color="primary">
                                {bmi || '–'}
                            </Typography>
                            {bmiCategory && (
                                <Chip
                                    label={bmiCategory.label}
                                    color={bmiCategory.color as 'success' | 'warning' | 'error'}
                                    size="small"
                                    sx={{ mt: 1 }}
                                />
                            )}
                        </Box>
                    </Grid>

                    {/* Experience Level */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>
                            Mức độ kinh nghiệm
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <Box sx={{ flexGrow: 1, mr: 2 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={experienceLevelProgress}
                                    sx={{ height: 10, borderRadius: 5 }}
                                />
                            </Box>
                            <Typography variant="body1">
                                {getExperienceLevelLabel(profile.experienceLevel)}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Fitness Goals */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>
                            Mục tiêu tập luyện
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {profile.fitnessGoals.map(goal => (
                                <Chip
                                    key={goal}
                                    icon={<FitnessCenterIcon />}
                                    label={getGoalLabel(goal)}
                                    color="primary"
                                />
                            ))}
                        </Box>
                    </Grid>

                    {/* Medical Conditions (if any) */}
                    {profile.medicalConditions && profile.medicalConditions.length > 0 && (
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" gutterBottom>
                                Tình trạng sức khỏe cần lưu ý
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {profile.medicalConditions.map((condition, index) => (
                                    <Chip
                                        key={index}
                                        label={condition}
                                        color="error"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
}

export default FitnessStatsSection;
