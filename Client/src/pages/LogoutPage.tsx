import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Trang xử lý đăng xuất
 */
export default function LogoutPage() {
    const { logoutAction } = useAuth();

    useEffect(() => {
        logoutAction();
        // Có thể chuyển hướng về trang chủ hoặc login sau khi logout
    }, [logoutAction]);

    return <div>Đang đăng xuất...</div>;
}
