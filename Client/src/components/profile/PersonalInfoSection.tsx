import {
    Cake as CakeIcon,
    Edit as EditIcon,
    Email as EmailIcon,
    Wc as GenderIcon,
    VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
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
    const fullName = `${user.profile.firstName} ${user.profile.lastName}`;

    // Format the gender display
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
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" component="h2">
                        Thông tin cá nhân
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        size="small"
                        onClick={onEditClick}
                    >
                        Chỉnh sửa
                    </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                        src={user.avatar}
                        alt={fullName}
                        sx={{ width: 100, height: 100, mr: 3 }}
                    />
                    <Box>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h5" component="h1">
                                {fullName}
                            </Typography>                        {user.isEmailVerified ? (
                                <Chip
                                    icon={<VerifiedUserIcon />}
                                    label="Đã xác thực"
                                    color="success"
                                    size="small"
                                    sx={{ ml: 2 }}
                                />
                            ) : (
                                <Chip
                                    label="Chưa xác thực"
                                    color="warning"
                                    size="small"
                                    sx={{ ml: 2 }}
                                />
                            )}
                        </Box>
                        <Typography variant="subtitle1" color="textSecondary">
                            @{user.username}
                        </Typography>
                        <Chip
                            label={user.role}
                            color={user.role === 'admin' ? 'error' : user.role === 'trainer' ? 'warning' : 'default'}
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    <EmailIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Email"
                                    secondary={user.email}
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <CakeIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Tuổi"
                                    secondary={`${user.profile.age} tuổi`}
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <GenderIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Giới tính"
                                    secondary={getGenderDisplay(user.profile.gender)}
                                />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Trạng thái email"
                                    secondary={
                                        <Box display="flex" alignItems="center">
                                            <Chip
                                                label={user.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                                                color={user.isVerified ? "success" : "warning"}
                                                size="small"
                                            />
                                        </Box>
                                    }
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemText
                                    primary="Ngày tham gia"
                                    secondary={new Date(user.createdAt).toLocaleDateString('vi-VN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemText
                                    primary="Đăng nhập gần nhất"
                                    secondary={user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('vi-VN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : 'Chưa có thông tin'}
                                />
                            </ListItem>                        </List>
                    </Grid>
                </Grid>

                {user.profile.bio && (
                    <Box mt={3}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>
                            Giới thiệu
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {user.profile.bio}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default PersonalInfoSection;
