import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Container,
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Button,
    useMediaQuery,
    Alert,
    CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    AccountCircle as AccountCircleIcon,
    FitnessCenter as FitnessCenterIcon,
    Settings as SettingsIcon,
    Star as StarIcon
} from '@mui/icons-material';

// Import the components
import PersonalInfoSection from '../../components/account/PersonalInfoSection';
import FitnessStatsSection from '../../components/account/FitnessStatsSection';
import EditPersonalInfoForm from '../../components/account/EditPersonalInfoForm';
import UserWorkoutsSection from '../../components/account/UserWorkoutsSection';
import { User, ExperienceLevel, FitnessGoal } from '../../types';
import { AccountService, AccountProfile } from '../../services/accountService';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

/**
 * TabPanel component for tab content with modern styling
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
                <Box
                    sx={{
                        py: 3,
                        animation: 'fadeIn 0.5s ease-in-out',
                        '@keyframes fadeIn': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(20px)',
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)',
                            },
                        },
                    }}
                >
                    {children}
                </Box>
            )}
        </div>
    );
}

/**
 * Trang hồ sơ cá nhân với React 19 patterns
 * Fetches account profile data và phân phối cho các component con
 */
export default function ProfilePage() {
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // State management
    const [tabValue, setTabValue] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState<User | null>(user);

    // ✅ Account profile data from API
    const [accountProfile, setAccountProfile] = useState<AccountProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState<boolean>(true);
    const [profileError, setProfileError] = useState<string | null>(null);

    // ✅ Fetch account profile data khi component mount
    useEffect(() => {
        const fetchAccountProfile = async () => {
            try {
                setProfileLoading(true);
                setProfileError(null);

                const response = await AccountService.getAccountProfile();

                if (response.success && response.data) {
                    setAccountProfile(response.data);                    // ✅ Update user data với health metrics từ API
                    if (user) {
                        const updatedUserWithProfile: User = {
                            ...user,
                            profile: {
                                ...user.profile,
                                age: response.data.healthMetrics.age,
                                weight: response.data.healthMetrics.weight,
                                height: response.data.healthMetrics.height,
                                // ✅ Convert string to enum types
                                experienceLevel: response.data.fitnessProfile.experienceLevel as ExperienceLevel,
                                fitnessGoals: response.data.fitnessProfile.fitnessGoals.map(goal => goal as FitnessGoal),
                            },
                            isEmailVerified: response.data.isEmailVerified,
                            createdAt: new Date(response.data.joinDate),
                        };
                        setUpdatedUser(updatedUserWithProfile);
                    }
                } else {
                    setProfileError(response.error || 'Failed to fetch profile');
                }
            } catch (err) {
                setProfileError(err instanceof Error ? err.message : 'Unknown error');
                console.error('❌ Error fetching account profile:', err);
            } finally {
                setProfileLoading(false);
            }
        };

        if (user) {
            fetchAccountProfile();
        }
    }, [user]);

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
    }; return (
        <Container maxWidth="lg" sx={{ py: '8rem' }}>
            {/* Modern Profile tabs navigation */}
            <Paper
                sx={{
                    mb: 3,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    borderRadius: 3,
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    overflow: 'hidden'
                }}
            >
                {/* Header section for tabs */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        p: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h5" component="h1" fontWeight="bold">
                        Hồ sơ cá nhân
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                        Quản lý thông tin và theo dõi tiến độ của bạn
                    </Typography>
                </Box>

                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant={isMobile ? "scrollable" : "fullWidth"}
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label="profile-tabs"
                    sx={{
                        '& .MuiTabs-root': {
                            minHeight: 60,
                        },
                        '& .MuiTab-root': {
                            minHeight: 60,
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            textTransform: 'none',
                            px: 3,
                            py: 2,
                            color: 'text.secondary',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                                transform: 'translateY(-1px)',
                            },
                            '&.Mui-selected': {
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                                color: '#667eea',
                                fontWeight: 700,
                                '& .MuiSvgIcon-root': {
                                    color: '#667eea',
                                },
                            },
                        },
                        '& .MuiTabs-indicator': {
                            height: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '2px 2px 0 0',
                        },
                        '& .MuiTabs-flexContainer': {
                            background: 'white',
                        },
                    }}
                >
                    <Tab
                        icon={
                            <AccountCircleIcon
                                sx={{
                                    fontSize: 24,
                                    mb: 0.5,
                                    color: tabValue === 0 ? '#667eea' : 'text.secondary',
                                    transition: 'color 0.3s ease'
                                }}
                            />
                        }
                        label="Thông tin cá nhân"
                        sx={{
                            borderRight: isMobile ? 'none' : '1px solid rgba(0,0,0,0.06)',
                        }}
                    />
                    <Tab
                        icon={
                            <FitnessCenterIcon
                                sx={{
                                    fontSize: 24,
                                    mb: 0.5,
                                    color: tabValue === 1 ? '#667eea' : 'text.secondary',
                                    transition: 'color 0.3s ease'
                                }}
                            />
                        }
                        label="Thống kê tập luyện"
                        sx={{
                            borderRight: isMobile ? 'none' : '1px solid rgba(0,0,0,0.06)',
                        }}
                    />
                    <Tab
                        icon={
                            <StarIcon
                                sx={{
                                    fontSize: 24,
                                    mb: 0.5,
                                    color: tabValue === 2 ? '#667eea' : 'text.secondary',
                                    transition: 'color 0.3s ease'
                                }}
                            />
                        }
                        label="Đánh giá của tôi"
                        sx={{
                            borderRight: isMobile ? 'none' : '1px solid rgba(0,0,0,0.06)',
                        }}
                    />
                    <Tab
                        icon={
                            <SettingsIcon
                                sx={{
                                    fontSize: 24,
                                    mb: 0.5,
                                    color: tabValue === 3 ? '#667eea' : 'text.secondary',
                                    transition: 'color 0.3s ease'
                                }}
                            />
                        }
                        label="Cài đặt tài khoản"
                    />
                </Tabs>
            </Paper>            {/* Personal Info Tab */}
            <TabPanel value={tabValue} index={0}>
                {/* ✅ Modern loading state */}
                {profileLoading && (
                    <Paper
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(25, 118, 210, 0.05) 100%)',
                            borderRadius: 3,
                            border: '1px solid rgba(33, 150, 243, 0.1)',
                        }}
                    >
                        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                            <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                            <Typography variant="h6" color="primary" fontWeight="600">
                                Đang tải dữ liệu hồ sơ...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Vui lòng chờ trong giây lát
                            </Typography>
                        </Box>
                    </Paper>
                )}

                {/* ✅ Modern error state */}
                {profileError && (
                    <Paper
                        sx={{
                            p: 4,
                            background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(211, 47, 47, 0.05) 100%)',
                            borderRadius: 3,
                            border: '1px solid rgba(244, 67, 54, 0.1)',
                        }}
                    >
                        <Alert
                            severity="error"
                            sx={{
                                background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)',
                                border: '1px solid rgba(244, 67, 54, 0.2)',
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="body1" fontWeight="600" gutterBottom>
                                Không thể tải dữ liệu hồ sơ
                            </Typography>
                            <Typography variant="body2">
                                {profileError}
                            </Typography>
                        </Alert>
                    </Paper>
                )}

                {/* ✅ Show content when both user and profile data are loaded */}
                {updatedUser && accountProfile && !profileLoading && (
                    <Box>
                        {/* ✅ Personal Info Section - uses existing component */}
                        <Box mb={3}>
                            {isEditing ? (
                                <EditPersonalInfoForm
                                    user={updatedUser}
                                    onCancel={handleCancelEdit}
                                    onSuccess={handleUpdateSuccess}
                                />
                            ) : (
                                <PersonalInfoSection
                                    user={updatedUser}
                                    onEditClick={handleEditClick}
                                />
                            )}
                        </Box>                        {/* ✅ Fitness Stats Section - uses existing component with API data */}
                        <Box>
                            <FitnessStatsSection
                                userProfile={{
                                    ...updatedUser.profile,
                                    // ✅ Override with fresh data from API
                                    age: accountProfile.healthMetrics.age,
                                    weight: accountProfile.healthMetrics.weight,
                                    height: accountProfile.healthMetrics.height,
                                    experienceLevel: accountProfile.fitnessProfile.experienceLevel as ExperienceLevel,
                                    fitnessGoals: accountProfile.fitnessProfile.fitnessGoals.map(goal => goal as FitnessGoal),
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </TabPanel>            {/* Workout Stats Tab */}
            <TabPanel value={tabValue} index={1}>
                <UserWorkoutsSection />
            </TabPanel>{/* Reviews Tab */}
            <TabPanel value={tabValue} index={2}>
                <Paper
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.05) 0%, rgba(255, 152, 0, 0.05) 100%)',
                        borderRadius: 3,
                        border: '1px solid rgba(255, 193, 7, 0.1)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    }}
                >
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                            color: 'white',
                            p: 3,
                            borderRadius: 2,
                            mb: 3,
                            mx: 'auto',
                            maxWidth: 400,
                        }}
                    >
                        <StarIcon sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Đánh giá của tôi
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Quản lý tất cả đánh giá bạn đã viết
                        </Typography>
                    </Box>

                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Tính năng đang được phát triển
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Chức năng quản lý đánh giá sẽ sớm được ra mắt.
                    </Typography>

                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 500, mx: 'auto' }}>
                        <Typography variant="subtitle2" color="textPrimary" sx={{ fontWeight: 600, mb: 1 }}>
                            Sẽ bao gồm các tính năng:
                        </Typography>
                        <Box component="ul" sx={{ textAlign: 'left', pl: 2, color: 'text.secondary' }}>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                📝 Quản lý đánh giá phòng gym
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                🏋️ Đánh giá thiết bị tập luyện
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                💊 Review thực phẩm bổ sung
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                👨‍💼 Đánh giá huấn luyện viên
                            </Typography>
                            <Typography component="li" variant="body2">
                                📊 Thống kê đánh giá của bạn
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={tabValue} index={3}>
                <Paper
                    sx={{
                        p: 4,
                        background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.05) 0%, rgba(121, 85, 72, 0.05) 100%)',
                        borderRadius: 3,
                        border: '1px solid rgba(139, 69, 19, 0.1)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    }}
                >
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #8b4513 0%, #795548 100%)',
                            color: 'white',
                            p: 3,
                            borderRadius: 2,
                            mb: 3,
                            mx: 'auto',
                            maxWidth: 400,
                            textAlign: 'center',
                        }}
                    >
                        <SettingsIcon sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Cài đặt tài khoản
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Quản lý bảo mật và tùy chỉnh tài khoản
                        </Typography>
                    </Box>

                    <Alert
                        severity="info"
                        sx={{
                            mb: 3,
                            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)',
                            border: '1px solid rgba(33, 150, 243, 0.2)',
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="body2" fontWeight="600">
                            Chức năng cài đặt tài khoản sẽ sớm được ra mắt.
                        </Typography>
                    </Alert>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        {/* Security Settings */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                                borderRadius: 2,
                                border: '1px solid rgba(76, 175, 80, 0.2)'
                            }}
                        >
                            <Typography variant="h6" gutterBottom color="#388e3c" fontWeight="600">
                                🔒 Bảo mật
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                <Typography component="li" variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    Thay đổi mật khẩu
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    Xác thực 2 bước
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ color: 'text.secondary' }}>
                                    Quản lý phiên đăng nhập
                                </Typography>
                            </Box>
                        </Paper>

                        {/* Privacy Settings */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                borderRadius: 2,
                                border: '1px solid rgba(255, 152, 0, 0.2)'
                            }}
                        >
                            <Typography variant="h6" gutterBottom color="#f57c00" fontWeight="600">
                                🛡️ Quyền riêng tư
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                <Typography component="li" variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    Hiển thị hồ sơ công khai
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    Chia sẻ thống kê
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ color: 'text.secondary' }}>
                                    Cài đặt thông báo
                                </Typography>
                            </Box>
                        </Paper>

                        {/* Data Management */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                                borderRadius: 2,
                                border: '1px solid rgba(156, 39, 176, 0.2)'
                            }}
                        >
                            <Typography variant="h6" gutterBottom color="#7b1fa2" fontWeight="600">
                                📊 Dữ liệu
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                <Typography component="li" variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    Xuất dữ liệu cá nhân
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    Sao lưu thông tin
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ color: 'text.secondary' }}>
                                    Xóa tài khoản
                                </Typography>
                            </Box>
                        </Paper>

                        {/* Preferences */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
                                borderRadius: 2,
                                border: '1px solid rgba(233, 30, 99, 0.2)'
                            }}
                        >
                            <Typography variant="h6" gutterBottom color="#c2185b" fontWeight="600">
                                ⚙️ Tùy chỉnh
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                <Typography component="li" variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    Giao diện tối/sáng
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    Đơn vị đo lường
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ color: 'text.secondary' }}>
                                    Ngôn ngữ hiển thị
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                </Paper>
            </TabPanel>
        </Container>
    );
}
