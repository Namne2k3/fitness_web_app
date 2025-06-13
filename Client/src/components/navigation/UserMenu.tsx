import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
// import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
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
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { logoutAction, isLoading, logoutPending } = useAuth();
    const [showLogoutConfirmDialog, setShowLogoutConfirmDialog] = React.useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleProfile = () => {
        navigate('/profile');
        handleClose();
    };
    // Khi chọn Logout trong menu, mở dialog xác nhận
    const handleLogout = () => {
        handleClose();
        setShowLogoutConfirmDialog(true);
    };
    // Khi xác nhận đăng xuất (submit form), mở dialog loading
    const handleLogoutStart = () => {
        setShowLogoutConfirmDialog(false);
        setShowLogoutDialog(true);
    };
    return (
        <React.Fragment>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: 2,
                    transition: 'background 0.18s',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.13)',
                    },
                    px: 1,
                    py: 0.5,
                }}
                onClick={handleClick}
            >
                <Typography
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        textTransform: 'capitalize'
                    }}
                >
                    {user.username}
                </Typography>
                <Tooltip title="Account settings">
                    <IconButton
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        {user.avatar ? (
                            <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                        ) : (
                            <Avatar sx={{ width: 32, height: 32 }}>
                                {user.username[0]?.toUpperCase() || 'U'}
                            </Avatar>
                        )}
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleProfile}>
                    <Avatar /> Tài khoản của tôi
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Cài đặt
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Đăng xuất
                </MenuItem>
            </Menu>
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
        </React.Fragment>
    );
};

export default UserMenu;
