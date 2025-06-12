import { useAuth } from '../context/AuthContext';

/**
 * Trang hồ sơ cá nhân
 */
export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return <div>Bạn cần đăng nhập để xem hồ sơ cá nhân.</div>;
    }

    return (
        <div className="profile-page">
            <h2>Hồ sơ cá nhân</h2>
            <div>
                <strong>Email:</strong> {user.email}
            </div>
            <div>
                <strong>Username:</strong> {user.username}
            </div>
            <div>
                <strong>Họ tên:</strong> {user.profile.firstName} {user.profile.lastName}
            </div>
            {/* Thêm các thông tin khác nếu cần */}
        </div>
    );
}
