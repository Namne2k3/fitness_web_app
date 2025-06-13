import React, { useState } from 'react';
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Typography
} from '@mui/material';
import { AccountCircle, ExitToApp, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmDialog from '../auth/LogoutConfirmDialog';
import LogoutDialog from '../auth/LogoutDialog';
import { useAuth } from '../../context/AuthContext';

interface UserMenuProps {
    user: {
        username: string;
        avatar?: string;
        profile: {
            firstName?: string;
        };
    };
}

/**
 * User menu component showing user profile and logout options
 */
const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
    const navigate = useNavigate();
    const { logoutAction, isLoading, logoutPending } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showLogoutConfirmDialog, setShowLogoutConfirmDialog] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const open = Boolean(anchorEl);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        handleClose();
    };

    // Xử lý hiển thị dialog logout
    const handleLogout = () => {
        handleClose();
        // Hiển thị dialog xác nhận đầu tiên
        setShowLogoutConfirmDialog(true);
    };

    // Khi người dùng nhấn nút đăng xuất (form sẽ được submit)
    const handleLogoutStart = () => {
        // Đóng dialog xác nhận
        setShowLogoutConfirmDialog(false);
        // Hiển thị dialog đăng xuất với loading
        setShowLogoutDialog(true);
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                    Xin chào, {user.profile.firstName || user.username}
                </Typography>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    {user.avatar ? (
                        <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                    ) : (
                        <AccountCircle />
                    )}
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => handleNavigation('/profile')}>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        Hồ sơ cá nhân
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <ExitToApp fontSize="small" />
                        </ListItemIcon>
                        Đăng xuất
                    </MenuItem>
                </Menu>
            </Box>

            {/* Logout Confirmation Dialog với form */}
            <LogoutConfirmDialog
                open={showLogoutConfirmDialog}
                onClose={() => setShowLogoutConfirmDialog(false)}
                logoutAction={logoutAction}
                isLoading={isLoading}
                onConfirmStart={handleLogoutStart}
            />

            {/* Logout Loading Dialog */}
            <LogoutDialog
                open={showLogoutDialog}
                onClose={() => setShowLogoutDialog(false)}
                redirectPath="/login"
                isLoading={isLoading || logoutPending}
            />
        </>
    );
};

export default UserMenu;
