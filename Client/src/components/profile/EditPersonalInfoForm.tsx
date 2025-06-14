import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    OutlinedInput,
    Chip,
    SelectChangeEvent
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
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
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Chỉnh sửa thông tin</Typography>
                </Box>

                <form action={formAction}>
                    {/* Hidden field for fitness goals */}
                    <input
                        type="hidden"
                        name="fitnessGoals"
                        value={JSON.stringify(selectedGoals)}
                    />

                    <Grid container spacing={3}>
                        {/* Basic Info */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="firstName"
                                label="Họ"
                                fullWidth
                                required
                                defaultValue={user.profile.firstName}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="lastName"
                                label="Tên"
                                fullWidth
                                required
                                defaultValue={user.profile.lastName}
                                margin="normal"
                            />
                        </Grid>                        <Grid item xs={12} md={4}>
                            <TextField
                                name="age"
                                label="Tuổi"
                                type="number"
                                fullWidth
                                required
                                defaultValue={user.profile.age}
                                margin="normal"
                                InputProps={{ inputProps: { min: 13, max: 100 } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="gender-select-label">Giới tính</InputLabel>
                                <Select
                                    labelId="gender-select-label"
                                    id="gender-select"
                                    name="gender"
                                    defaultValue={user.profile.gender}
                                    label="Giới tính"
                                    required
                                >
                                    <MenuItem value={Gender.MALE}>Nam</MenuItem>
                                    <MenuItem value={Gender.FEMALE}>Nữ</MenuItem>
                                    <MenuItem value={Gender.OTHER}>Khác</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                name="weight"
                                label="Cân nặng (kg)"
                                type="number"
                                fullWidth
                                required
                                defaultValue={user.profile.weight}
                                margin="normal"
                                InputProps={{ inputProps: { min: 30, max: 300 } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                name="height"
                                label="Chiều cao (cm)"
                                type="number"
                                fullWidth
                                required
                                defaultValue={user.profile.height}
                                margin="normal"
                                InputProps={{ inputProps: { min: 100, max: 250 } }}
                            />
                        </Grid>

                        {/* Gender & Experience Level */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="gender-label">Giới tính</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    name="gender"
                                    defaultValue={user.profile.gender}
                                    label="Giới tính"
                                >
                                    <MenuItem value={Gender.MALE}>Nam</MenuItem>
                                    <MenuItem value={Gender.FEMALE}>Nữ</MenuItem>
                                    <MenuItem value={Gender.OTHER}>Khác</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="experience-label">Mức độ kinh nghiệm</InputLabel>
                                <Select
                                    labelId="experience-label"
                                    name="experienceLevel"
                                    defaultValue={user.profile.experienceLevel}
                                    label="Mức độ kinh nghiệm"
                                >
                                    <MenuItem value={ExperienceLevel.BEGINNER}>Người mới bắt đầu</MenuItem>
                                    <MenuItem value={ExperienceLevel.INTERMEDIATE}>Trung cấp</MenuItem>
                                    <MenuItem value={ExperienceLevel.ADVANCED}>Nâng cao</MenuItem>
                                </Select>
                                <FormHelperText>Hãy chọn mức độ kinh nghiệm tập luyện của bạn</FormHelperText>
                            </FormControl>
                        </Grid>

                        {/* Fitness Goals */}
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="fitness-goals-label">Mục tiêu tập luyện</InputLabel>
                                <Select
                                    labelId="fitness-goals-label"
                                    multiple
                                    value={selectedGoals}
                                    onChange={handleGoalsChange}
                                    input={<OutlinedInput label="Mục tiêu tập luyện" />}
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
                                                return <Chip key={value} label={label} />;
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
                        </Grid>

                        {/* Medical Conditions */}
                        <Grid item xs={12}>
                            <TextField
                                name="medicalConditions"
                                label="Tình trạng sức khỏe cần lưu ý"
                                fullWidth
                                multiline
                                rows={2}
                                margin="normal"
                                defaultValue={(user.profile.medicalConditions || []).join(', ')}
                                helperText="Các vấn đề sức khỏe cần lưu ý khi tập luyện (nếu có). Phân cách bằng dấu phẩy."
                            />
                        </Grid>

                        {/* Form Actions */}
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Button
                                    variant="outlined"
                                    onClick={onCancel}
                                    startIcon={<CancelIcon />}
                                    sx={{ mr: 2 }}
                                    disabled={isPending}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    disabled={isPending}
                                >
                                    {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </Button>
                            </Box>
                        </Grid>

                        {formState.error && (
                            <Grid item xs={12}>
                                <Typography color="error">
                                    {formState.error}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default EditPersonalInfoForm;
