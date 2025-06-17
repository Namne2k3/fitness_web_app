import { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    OutlinedInput,
    Chip,
    SelectChangeEvent,
    Paper,
    Avatar,
    Alert
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
    Edit as EditIcon,
    Person as PersonIcon,
    FitnessCenter as FitnessIcon,
    MonitorHeart as HealthIcon
} from '@mui/icons-material';
import { useActionState } from 'react';
import { User, Gender, ExperienceLevel, FitnessGoal } from '../../types';

interface EditPersonalInfoFormProps {
    user: User;
    onCancel: () => void;
    onSuccess: (updatedUser: User) => void;
}

interface FormState {
    success: boolean;
    error: string | null;
    data: User | null;
}

/**
 * Component form chỉnh sửa thông tin cá nhân
 * Sử dụng React 19 Actions cho form handling
 */
function EditPersonalInfoForm({
    user,
    onCancel,
    onSuccess
}: EditPersonalInfoFormProps) {
    // React 19: Form Action with useActionState
    const [formState, formAction, isPending] = useActionState<FormState, FormData>(
        async (_prevState, formData): Promise<FormState> => {
            try {
                // Giả lập API call - trong thực tế sẽ gọi API thực sự
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Parse form data
                const updatedUserData = {
                    ...user,
                    profile: {
                        ...user.profile,
                        firstName: formData.get('firstName') as string,
                        lastName: formData.get('lastName') as string,
                        age: Number(formData.get('age')),
                        weight: Number(formData.get('weight')),
                        height: Number(formData.get('height')),
                        gender: formData.get('gender') as Gender,
                        experienceLevel: formData.get('experienceLevel') as ExperienceLevel,
                        fitnessGoals: JSON.parse(formData.get('fitnessGoals') as string) as FitnessGoal[],
                        medicalConditions: formData.get('medicalConditions')
                            ? (formData.get('medicalConditions') as string).split(',').map(c => c.trim()).filter(Boolean)
                            : []
                    }
                };

                // Call onSuccess to update UI
                onSuccess(updatedUserData as User);

                return {
                    success: true,
                    error: null,
                    data: updatedUserData as User
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to update profile',
                    data: null
                };
            }
        },
        { success: false, error: null, data: null }
    );

    // State for multiple select (fitness goals)
    const [selectedGoals, setSelectedGoals] = useState<FitnessGoal[]>(user.profile.fitnessGoals);

    const handleGoalsChange = (event: SelectChangeEvent<FitnessGoal[]>) => {
        const value = event.target.value as FitnessGoal[];
        setSelectedGoals(value);
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
                        justifyContent: 'space-between'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                            <EditIcon sx={{ color: 'white', fontSize: 28 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" component="h2" fontWeight="bold">
                                Chỉnh sửa thông tin
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Cập nhật thông tin cá nhân và mục tiêu tập luyện
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Form Content */}
                <Box sx={{ p: 3 }}>
                    <form action={formAction}>
                        {/* Error Alert */}
                        {formState.error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {formState.error}
                            </Alert>
                        )}

                        {/* Hidden field for fitness goals */}
                        <input
                            type="hidden"
                            name="fitnessGoals"
                            value={JSON.stringify(selectedGoals)}
                        />

                        {/* Personal Information Section */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                borderRadius: 2,
                                border: '1px solid rgba(255, 152, 0, 0.2)'
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={3}>
                                <Avatar sx={{ bgcolor: '#ff9800', width: 32, height: 32, mr: 1.5 }}>
                                    <PersonIcon sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#f57c00">
                                    Thông tin cá nhân
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                                <TextField
                                    name="firstName"
                                    label="Họ"
                                    fullWidth
                                    required
                                    defaultValue={user.profile.firstName}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <TextField
                                    name="lastName"
                                    label="Tên"
                                    fullWidth
                                    required
                                    defaultValue={user.profile.lastName}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <TextField
                                    name="age"
                                    label="Tuổi"
                                    type="number"
                                    fullWidth
                                    required
                                    defaultValue={user.profile.age}
                                    InputProps={{ inputProps: { min: 13, max: 100 } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="gender-select-label">Giới tính</InputLabel>
                                    <Select
                                        labelId="gender-select-label"
                                        name="gender"
                                        defaultValue={user.profile.gender}
                                        label="Giới tính"
                                        required
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value={Gender.MALE}>Nam</MenuItem>
                                        <MenuItem value={Gender.FEMALE}>Nữ</MenuItem>
                                        <MenuItem value={Gender.OTHER}>Khác</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Paper>

                        {/* Health Metrics Section */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                                borderRadius: 2,
                                border: '1px solid rgba(76, 175, 80, 0.2)'
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={3}>
                                <Avatar sx={{ bgcolor: '#4caf50', width: 32, height: 32, mr: 1.5 }}>
                                    <HealthIcon sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#388e3c">
                                    Chỉ số sức khỏe
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                                <TextField
                                    name="weight"
                                    label="Cân nặng (kg)"
                                    type="number"
                                    fullWidth
                                    required
                                    defaultValue={user.profile.weight}
                                    InputProps={{ inputProps: { min: 30, max: 300 } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <TextField
                                    name="height"
                                    label="Chiều cao (cm)"
                                    type="number"
                                    fullWidth
                                    required
                                    defaultValue={user.profile.height}
                                    InputProps={{ inputProps: { min: 100, max: 250 } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Box>

                            <Box sx={{ mt: 3 }}>
                                <TextField
                                    name="medicalConditions"
                                    label="Tình trạng sức khỏe cần lưu ý"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    defaultValue={(user.profile.medicalConditions || []).join(', ')}
                                    helperText="Các vấn đề sức khỏe cần lưu ý khi tập luyện (nếu có). Phân cách bằng dấu phẩy."
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Box>
                        </Paper>

                        {/* Fitness Goals Section */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                                borderRadius: 2,
                                border: '1px solid rgba(156, 39, 176, 0.2)'
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={3}>
                                <Avatar sx={{ bgcolor: '#9c27b0', width: 32, height: 32, mr: 1.5 }}>
                                    <FitnessIcon sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#7b1fa2">
                                    Mục tiêu tập luyện
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="experience-label">Mức độ kinh nghiệm</InputLabel>
                                    <Select
                                        labelId="experience-label"
                                        name="experienceLevel"
                                        defaultValue={user.profile.experienceLevel}
                                        label="Mức độ kinh nghiệm"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value={ExperienceLevel.BEGINNER}>Người mới bắt đầu</MenuItem>
                                        <MenuItem value={ExperienceLevel.INTERMEDIATE}>Trung cấp</MenuItem>
                                        <MenuItem value={ExperienceLevel.ADVANCED}>Nâng cao</MenuItem>
                                    </Select>
                                    <FormHelperText>Hãy chọn mức độ kinh nghiệm tập luyện của bạn</FormHelperText>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel id="fitness-goals-label">Mục tiêu</InputLabel>
                                    <Select
                                        labelId="fitness-goals-label"
                                        multiple
                                        value={selectedGoals}
                                        onChange={handleGoalsChange}
                                        input={<OutlinedInput label="Mục tiêu" sx={{ borderRadius: 2 }} />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    let label = '';
                                                    switch (value) {
                                                        case FitnessGoal.WEIGHT_LOSS:
                                                            label = 'Giảm cân';
                                                            break;
                                                        case FitnessGoal.MUSCLE_GAIN:
                                                            label = 'Tăng cơ';
                                                            break;
                                                        case FitnessGoal.STRENGTH:
                                                            label = 'Sức mạnh';
                                                            break;
                                                        case FitnessGoal.ENDURANCE:
                                                            label = 'Sức bền';
                                                            break;
                                                        case FitnessGoal.FLEXIBILITY:
                                                            label = 'Sự dẻo dai';
                                                            break;
                                                        case FitnessGoal.GENERAL_FITNESS:
                                                            label = 'Thể hình chung';
                                                            break;
                                                        default:
                                                            label = value;
                                                    }
                                                    return (
                                                        <Chip
                                                            key={value}
                                                            label={label}
                                                            sx={{
                                                                background: 'rgba(156, 39, 176, 0.1)',
                                                                color: '#7b1fa2',
                                                                border: '1px solid rgba(156, 39, 176, 0.3)'
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </Box>
                                        )}
                                    >
                                        <MenuItem value={FitnessGoal.WEIGHT_LOSS}>Giảm cân</MenuItem>
                                        <MenuItem value={FitnessGoal.MUSCLE_GAIN}>Tăng cơ</MenuItem>
                                        <MenuItem value={FitnessGoal.STRENGTH}>Sức mạnh</MenuItem>
                                        <MenuItem value={FitnessGoal.ENDURANCE}>Sức bền</MenuItem>
                                        <MenuItem value={FitnessGoal.FLEXIBILITY}>Sự dẻo dai</MenuItem>
                                        <MenuItem value={FitnessGoal.GENERAL_FITNESS}>Thể hình chung</MenuItem>
                                    </Select>
                                    <FormHelperText>Chọn một hoặc nhiều mục tiêu</FormHelperText>
                                </FormControl>
                            </Box>
                        </Paper>

                        {/* Form Actions */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 2,
                                pt: 2,
                                borderTop: '1px solid rgba(0,0,0,0.06)'
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={onCancel}
                                startIcon={<CancelIcon />}
                                disabled={isPending}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: 2,
                                    }
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                disabled={isPending}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: 3,
                                    }
                                }}
                            >
                                {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </CardContent>
        </Card>
    );
};

export default EditPersonalInfoForm;
