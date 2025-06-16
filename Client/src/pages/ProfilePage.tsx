import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Button,
    useMediaQuery,
    Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    AccountCircle as AccountCircleIcon,
    FitnessCenter as FitnessCenterIcon,
    Settings as SettingsIcon,
    Star as StarIcon
} from '@mui/icons-material';

// Import the components
import PersonalInfoSection from '../components/profile/PersonalInfoSection';
import FitnessStatsSection from '../components/profile/FitnessStatsSection';
import EditPersonalInfoForm from '../components/profile/EditPersonalInfoForm';
import UserWorkoutsSection from '../components/profile/UserWorkoutsSection';
import SimpleAccountProfile from '../components/profile/SimpleAccountProfile';
import { User } from '../types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

/**
 * TabPanel component for tab content
 */
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

/**
 * Trang hồ sơ cá nhân
 * Sử dụng React 19 patterns cho performance optimization
 */
export default function ProfilePage() {
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    // State management
    const [tabValue, setTabValue] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState<User | null>(user);

    // Handle tab change
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // If no user is authenticated, show login message
    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Bạn cần đăng nhập để xem hồ sơ cá nhân
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        href="/login"
                        sx={{ mt: 2 }}
                    >
                        Đăng nhập
                    </Button>
                </Paper>
            </Container>
        );
    }

    // Handle edit mode toggle
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleUpdateSuccess = (updatedUserData: User) => {
        setUpdatedUser(updatedUserData);
        setIsEditing(false);
    };

    return (
        <Container maxWidth="lg" sx={{ py: '8rem' }}>
            {/* Profile tabs navigation */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant={isMobile ? "scrollable" : "fullWidth"}
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label="profile-tabs"
                >
                    <Tab icon={<AccountCircleIcon />} label="Thông tin cá nhân" />
                    <Tab icon={<FitnessCenterIcon />} label="Thống kê tập luyện" />
                    <Tab icon={<StarIcon />} label="Đánh giá của tôi" />
                    <Tab icon={<SettingsIcon />} label="Cài đặt tài khoản" />
                </Tabs>
            </Paper>            {/* Personal Info Tab */}
            <TabPanel value={tabValue} index={0}>
                {updatedUser && (
                    <Box>                        {/* Simple Account Profile - No Suspense needed */}
                        <Box mb={3}>
                            <SimpleAccountProfile />
                        </Box>

                        <Box mb={3}>
                            {isEditing ? (
                                <EditPersonalInfoForm
                                    user={updatedUser}
                                    onCancel={handleCancelEdit}
                                    onSuccess={handleUpdateSuccess}
                                />
                            ) : (
                                <PersonalInfoSection user={updatedUser} onEditClick={handleEditClick} />
                            )}
                        </Box>
                        <Box>
                            <FitnessStatsSection userProfile={updatedUser.profile} />
                        </Box>
                    </Box>
                )}
            </TabPanel>

            {/* Workout Stats Tab */}
            <TabPanel value={tabValue} index={1}>
                {updatedUser && <UserWorkoutsSection userId={updatedUser.id} />}
            </TabPanel>

            {/* Reviews Tab */}
            <TabPanel value={tabValue} index={2}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Tính năng đang được phát triển
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Chức năng quản lý đánh giá sẽ sớm được ra mắt.
                    </Typography>
                </Paper>
            </TabPanel>            {/* Settings Tab */}
            <TabPanel value={tabValue} index={3}>
                <Paper sx={{ p: 3 }}>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Chức năng cài đặt tài khoản sẽ sớm được ra mắt.
                    </Alert>

                    <Typography variant="h6" gutterBottom>
                        Cài đặt sẽ bao gồm:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                        <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                            Thay đổi mật khẩu
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                            Cài đặt thông báo
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                            Quyền riêng tư
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                            Xuất dữ liệu cá nhân
                        </Typography>
                        <Typography component="li" variant="body2">
                            Xóa tài khoản
                        </Typography>
                    </Box>
                </Paper>
            </TabPanel>
        </Container>
    );
}
