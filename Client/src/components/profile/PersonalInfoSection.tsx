import {
    Cake as CakeIcon,
    Edit as EditIcon,
    Email as EmailIcon,
    Wc as GenderIcon,
    VerifiedUser as VerifiedUserIcon,
    Person as PersonIcon,
    AccessTime as AccessTimeIcon,
    Badge as BadgeIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Typography,
    Paper
} from '@mui/material';
import { Gender, User } from '../../types';

interface PersonalInfoSectionProps {
    user: User;
    onEditClick: () => void;
}

/**
 * Component hiển thị thông tin cá nhân của user
 * Sử dụng React 19 patterns
 */
function PersonalInfoSection({ user, onEditClick }: PersonalInfoSectionProps) {
    const fullName = `${user.profile.firstName} ${user.profile.lastName}`;    // Format the gender display
    const getGenderDisplay = (gender: Gender) => {
        switch (gender) {
            case Gender.MALE:
                return 'Nam';
            case Gender.FEMALE:
                return 'Nữ';
            case Gender.OTHER:
                return 'Khác';
            default:
                return 'Không xác định';
        }
    };

    return (
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
                            <PersonIcon sx={{ color: 'white', fontSize: 28 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" component="h2" fontWeight="bold">
                                Thông tin cá nhân
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Thông tin tài khoản và hồ sơ cá nhân
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={onEditClick}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.3)',
                                transform: 'translateY(-1px)',
                            }
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                </Box>

                {/* Profile Header Section */}
                <Box sx={{ p: 3 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
                            borderRadius: 2,
                            border: '1px solid rgba(33, 150, 243, 0.1)'
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={3}>
                            <Avatar
                                src={user.avatar}
                                alt={fullName}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    border: '3px solid rgba(102, 126, 234, 0.2)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Box display="flex" alignItems="center" gap={2} mb={1}>
                                    <Typography variant="h4" component="h1" fontWeight="bold" color="#1565c0">
                                        {fullName}
                                    </Typography>
                                    {user.isEmailVerified ? (
                                        <Chip
                                            icon={<VerifiedUserIcon />}
                                            label="Đã xác thực"
                                            color="success"
                                            size="medium"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    ) : (
                                        <Chip
                                            label="Chưa xác thực"
                                            color="warning"
                                            size="medium"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    )}
                                </Box>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    @{user.username}
                                </Typography>
                                <Chip
                                    icon={<BadgeIcon />}
                                    label={user.role === 'admin' ? 'Quản trị viên' :
                                        user.role === 'trainer' ? 'Huấn luyện viên' : 'Thành viên'}
                                    color={user.role === 'admin' ? 'error' : user.role === 'trainer' ? 'warning' : 'primary'}
                                    sx={{ fontWeight: 600, padding: '8px 4px' }}
                                />
                            </Box>
                        </Box>
                    </Paper>                    {/* Personal Details Grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        {/* Contact Information */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                height: 'fit-content',
                                background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                                borderRadius: 2,
                                border: '1px solid rgba(76, 175, 80, 0.2)'
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar sx={{ bgcolor: '#4caf50', width: 32, height: 32, mr: 1.5 }}>
                                    <EmailIcon sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#388e3c">
                                    Thông tin liên hệ
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Email
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500" color="#2e7d32">
                                        {user.email}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Trạng thái email
                                    </Typography>
                                    {user.isEmailVerified ? (
                                        <Chip
                                            icon={<VerifiedUserIcon />}
                                            label="Đã xác thực"
                                            color="success"
                                            size="small"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    ) : (
                                        <Chip
                                            label="Chưa xác thực"
                                            color="warning"
                                            size="small"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </Paper>

                        {/* Personal Details */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                height: 'fit-content',
                                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                borderRadius: 2,
                                border: '1px solid rgba(255, 152, 0, 0.2)'
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar sx={{ bgcolor: '#ff9800', width: 32, height: 32, mr: 1.5 }}>
                                    <CakeIcon sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#f57c00">
                                    Thông tin cá nhân
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Tuổi
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500" color="#ef6c00">
                                        {user.profile.age} tuổi
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Giới tính
                                    </Typography>
                                    <Chip
                                        icon={<GenderIcon />}
                                        label={getGenderDisplay(user.profile.gender)}
                                        sx={{
                                            background: 'rgba(255, 152, 0, 0.1)',
                                            color: '#e65100',
                                            fontWeight: 600,
                                            border: '1px solid rgba(255, 152, 0, 0.3)'
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Account Activity */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mt: 3,
                            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                            borderRadius: 2,
                            border: '1px solid rgba(156, 39, 176, 0.2)'
                        }}
                    >
                        <Box display="flex" alignItems="center" mb={2}>
                            <Avatar sx={{ bgcolor: '#9c27b0', width: 32, height: 32, mr: 1.5 }}>
                                <AccessTimeIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Typography variant="h6" fontWeight="600" color="#7b1fa2">
                                Hoạt động tài khoản
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Ngày tham gia
                                </Typography>
                                <Typography variant="body1" fontWeight="500" color="#6a1b9a">
                                    {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Cập nhật gần nhất
                                </Typography>
                                <Typography variant="body1" fontWeight="500" color="#6a1b9a">
                                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('vi-VN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : 'Chưa có thông tin'}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Bio Section */}
                    {user.profile.bio && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mt: 3,
                                background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
                                borderRadius: 2,
                                border: '1px solid rgba(233, 30, 99, 0.2)'
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar sx={{ bgcolor: '#e91e63', width: 32, height: 32, mr: 1.5 }}>
                                    <InfoIcon sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Typography variant="h6" fontWeight="600" color="#c2185b">
                                    Giới thiệu
                                </Typography>
                            </Box>
                            <Typography
                                variant="body1"
                                color="#ad1457"
                                sx={{
                                    lineHeight: 1.6,
                                    fontStyle: 'italic',
                                    background: 'rgba(233, 30, 99, 0.05)',
                                    p: 2,
                                    borderRadius: 1,
                                    border: '1px solid rgba(233, 30, 99, 0.1)'
                                }}
                            >
                                "{user.profile.bio}"
                            </Typography>
                        </Paper>
                    )}
                </Box>            </CardContent>
        </Card>
    );
}

export default PersonalInfoSection;
