/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * LogoutConfirmDialog Component
 * Hiển thị dialog xác nhận khi người dùng muốn đăng xuất
 * Sử dụng React 19 Actions pattern đúng cách thông qua form submission
 */

import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    useTheme,
    CircularProgress
} from '@mui/material';
import { ExitToApp } from '@mui/icons-material';

interface LogoutConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    logoutAction: (formData: FormData) => void;
    isLoading?: boolean;
    onConfirmStart?: () => void;
}

/**
 * Dialog component để xác nhận đăng xuất trước khi thực hiện
 * Sử dụng form với action để tuân thủ React 19 Actions pattern
 */
const LogoutConfirmDialog: React.FC<LogoutConfirmDialogProps> = ({
    open,
    onClose,
    logoutAction,
    isLoading = false,
    onConfirmStart
}) => {
    const theme = useTheme();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        // Gọi callback để thông báo rằng form đang được submit
        // (để component cha có thể hiển thị LogoutDialog)
        if (onConfirmStart) {
            onConfirmStart();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: theme.shadows[5]
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600 }}>
                Xác nhận đăng xuất
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không?
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    sx={{ borderRadius: 2 }}
                    disabled={isLoading}
                >
                    Hủy bỏ
                </Button>

                {/* Form submission cho logout action */}                <form
                    action={logoutAction}
                    onSubmit={handleSubmit}
                    style={{ margin: 0 }}
                >                    <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    disableElevation
                    startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <ExitToApp />}
                    sx={{
                        borderRadius: 2,
                        '&.Mui-disabled': {
                            backgroundColor: theme.palette.error.main,
                            color: 'white',
                            opacity: 0.7
                        }
                    }}
                    disabled={isLoading}
                    autoFocus
                >
                        {isLoading ? 'Đang xử lý...' : 'Đăng xuất'}
                    </Button>
                </form>
            </DialogActions>
        </Dialog>
    );
};

export default LogoutConfirmDialog;
