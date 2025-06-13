/**
 * LogoutDialog Component
 * Hiển thị dialog khi người dùng đang trong quá trình đăng xuất
 * Sử dụng React 19 patterns
 */

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    CircularProgress,
    Zoom,
    Fade,
    useTheme,
    Icon
} from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface LogoutDialogProps {
    open: boolean;
    onClose?: () => void;
    redirectPath?: string;
    isLoading?: boolean;
}

/**
 * Dialog component hiển thị quá trình đăng xuất với loading animation
 * Tự động redirect sau khi đăng xuất hoàn tất
 */
const LogoutDialog: React.FC<LogoutDialogProps> = ({
    open,
    onClose,
    redirectPath = '/login',
    isLoading = false
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [dialogState, setDialogState] = useState({
        isClosing: false,
        showSuccess: false
    });

    // Xử lý đồng bộ trạng thái mở và các giai đoạn của dialog
    useEffect(() => {
        if (!open) return;

        // Reset trạng thái khi dialog mở
        setDialogState({
            isClosing: false,
            showSuccess: false
        });

        // Nếu không đang loading, chuyển sang trạng thái success
        if (!isLoading) {
            setDialogState(prev => ({ ...prev, showSuccess: true }));
        }

        // Đóng dialog tự động sau 2.5 giây
        const closeTimer = setTimeout(() => {
            setDialogState(prev => ({ ...prev, isClosing: true }));

            // Redirect sau 0.5 giây sau khi bắt đầu đóng
            setTimeout(() => {
                if (onClose) onClose();

                // Xóa dữ liệu lưu trữ trước khi chuyển hướng
                try {
                    // Xóa dữ liệu Zustand store
                    localStorage.removeItem('auth-store');
                    sessionStorage.removeItem('auth-store');
                    localStorage.removeItem('zustand-auth-store');
                    sessionStorage.removeItem('zustand-auth-store');

                    // Xóa tokens
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('rememberMe');
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('refreshToken');
                } catch (e) {
                    console.error('Lỗi khi xóa dữ liệu:', e);
                }

                // Chuyển hướng
                navigate(redirectPath);
            }, 500);
        }, 2500);

        return () => clearTimeout(closeTimer);
    }, [open, isLoading, onClose, navigate, redirectPath]);

    // Không render nếu dialog không mở
    if (!open) return null;

    return (
        <Dialog
            open={open}
            maxWidth="xs"
            fullWidth
            TransitionComponent={Zoom}
            TransitionProps={{
                timeout: 400,
                in: !dialogState.isClosing
            }}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.shadows[10],
                }
            }}
        >
            <DialogContent
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 200,
                }}
            >
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        position: 'relative',
                        background: isLoading ? 'transparent' : theme.palette.success.main,
                        transition: 'background-color 0.5s ease-in-out',
                    }}
                >
                    {isLoading ? (
                        <CircularProgress
                            size={80}
                            thickness={4}
                            sx={{ color: theme.palette.primary.main }}
                        />
                    ) : (
                        <Fade in={dialogState.showSuccess} timeout={600}>
                            <Icon
                                component={ExitToApp}
                                sx={{
                                    fontSize: 40,
                                    color: 'white',
                                    transform: 'rotate(180deg)'
                                }}
                            />
                        </Fade>
                    )}
                </Box>

                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                >
                    {isLoading ? 'Đang đăng xuất...' : 'Đăng xuất thành công'}
                </Typography>

                {!isLoading && dialogState.showSuccess && (
                    <Fade in={true} timeout={800}>
                        <Typography variant="body2" color="text.secondary" align="center">
                            Bạn sẽ được chuyển hướng trong giây lát.
                        </Typography>
                    </Fade>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default LogoutDialog;