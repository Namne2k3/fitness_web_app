/**
 * TestProfilePage - để test giao diện ProfilePage với mock data
 */
import React, { useState } from 'react';
import { Container, Box, Typography, Paper, Tabs, Tab, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    AccountCircle as AccountCircleIcon,
    FitnessCenter as FitnessCenterIcon,
    Settings as SettingsIcon,
    Star as StarIcon
} from '@mui/icons-material';

// Import components
import PersonalInfoSection from '../components/profile/PersonalInfoSection';
import FitnessStatsSection from '../components/profile/FitnessStatsSection';
import EditPersonalInfoForm from '../components/profile/EditPersonalInfoForm';
import UserWorkoutsSection from '../components/profile/UserWorkoutsSection';

// Import mock data
import { mockUser } from '../utils/mockData';
import { User } from '../types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

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
 * Test Profile Page để xem giao diện
 */
export default function TestProfilePage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // State management
    const [tabValue, setTabValue] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState<User | null>(mockUser);

    // Handle tab change
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

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
        <Container maxWidth="lg" sx={{ py: '10rem' }}>
            <Typography variant="h4" gutterBottom>
                Test Profile Page - Mock Data
            </Typography>

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
            </Paper>

            {/* Personal Info Tab */}
            <TabPanel value={tabValue} index={0}>
                {updatedUser && (
                    <Box>
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
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={tabValue} index={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Tính năng đang được phát triển
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Chức năng cài đặt tài khoản sẽ sớm được ra mắt.
                    </Typography>
                </Paper>
            </TabPanel>
        </Container>
    );
}
