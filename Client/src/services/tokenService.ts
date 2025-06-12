/**
 * Token Service
 * Quản lý tokens và authentication state
 */

/**
 * Interface cho JWT payload
 */
interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

/**
 * Token Storage Keys
 */
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    REMEMBER_ME: 'rememberMe',
} as const;

/**
 * Token Service Class
 */
export class TokenService {
    /**
     * Lưu tokens vào localStorage
     */
    static saveTokens(accessToken: string, refreshToken: string): void {
        try {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
            if (import.meta.env.DEV) {
                console.log('✅ Tokens saved successfully');
                this.debugTokens();
            }
        } catch (error) {
            console.error('❌ Failed to save tokens:', error);
        }
    }

    /**
     * Lấy access token
     */
    static getAccessToken(): string | null {
        try {
            return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        } catch (error) {
            console.error('❌ Failed to get access token:', error);
            return null;
        }
    }

    /**
     * Lấy refresh token
     */
    static getRefreshToken(): string | null {
        try {
            return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        } catch (error) {
            console.error('❌ Failed to get refresh token:', error);
            return null;
        }
    }

    /**
     * Xóa tất cả tokens
     */
    static clearTokens(): void {
        try {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
            if (import.meta.env.DEV) {
                console.log('✅ Tokens cleared successfully');
            }
        } catch (error) {
            console.error('❌ Failed to clear tokens:', error);
        }
    }

    /**
     * Kiểm tra xem có tokens không
     */
    static hasTokens(): boolean {
        const accessToken = this.getAccessToken();
        const refreshToken = this.getRefreshToken();
        return !!(accessToken && refreshToken);
    }

    /**
     * Kiểm tra access token có hợp lệ không (chưa hết hạn)
     */
    static isTokenValid(token?: string): boolean {
        const accessToken = token || this.getAccessToken();

        if (!accessToken) {
            return false;
        }

        try {
            const payload = this.decodeToken(accessToken);
            if (!payload) {
                return false;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const isValid = payload.exp > currentTime; if (import.meta.env.DEV) {
                const expiresAt = new Date(payload.exp * 1000);
                console.log(`🔍 Token validation:`, {
                    isValid,
                    expiresAt: expiresAt.toLocaleString(),
                    timeLeft: payload.exp - currentTime + ' seconds'
                });
            }

            return isValid;
        } catch (error) {
            console.error('❌ Error validating token:', error);
            return false;
        }
    }

    /**
     * Decode JWT token
     */
    static decodeToken(token: string): JWTPayload | null {
        try {
            // JWT format: header.payload.signature
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }

            // Decode payload (base64url)
            const payload = parts[1];
            const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(decoded) as JWTPayload;
        } catch (error) {
            console.error('❌ Error decoding token:', error);
            return null;
        }
    }

    /**
     * Lấy user ID từ access token
     */
    static getUserId(): string | null {
        const token = this.getAccessToken();
        if (!token) return null;

        const payload = this.decodeToken(token);
        return payload?.userId || null;
    }

    /**
     * Lấy user role từ access token
     */
    static getUserRole(): string | null {
        const token = this.getAccessToken();
        if (!token) return null;

        const payload = this.decodeToken(token);
        return payload?.role || null;
    }

    /**
     * Lấy user email từ access token
     */
    static getUserEmail(): string | null {
        const token = this.getAccessToken();
        if (!token) return null;

        const payload = this.decodeToken(token);
        return payload?.email || null;
    }

    /**
     * Kiểm tra xem access token có sắp hết hạn không (trong 5 phút tới)
     */
    static isTokenNearExpiry(token?: string): boolean {
        const accessToken = token || this.getAccessToken();

        if (!accessToken) {
            return false;
        }

        try {
            const payload = this.decodeToken(accessToken);
            if (!payload) {
                return false;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const fiveMinutesFromNow = currentTime + (5 * 60); // 5 minutes

            return payload.exp <= fiveMinutesFromNow;
        } catch (error) {
            console.error('❌ Error checking token expiry:', error);
            return false;
        }
    }    /**
     * Debug tokens trong development mode
     */
    static debugTokens(): void {
        if (!import.meta.env.DEV) {
            return;
        }

        const accessToken = this.getAccessToken();
        const refreshToken = this.getRefreshToken();

        console.group('🔐 Token Debug Info');

        console.log('📋 Tokens stored:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            accessTokenLength: accessToken?.length || 0,
            refreshTokenLength: refreshToken?.length || 0
        });

        if (accessToken) {
            const payload = this.decodeToken(accessToken);
            if (payload) {
                console.log('👤 Token payload:', {
                    userId: payload.userId,
                    email: payload.email,
                    role: payload.role,
                    issuedAt: new Date(payload.iat * 1000).toLocaleString(),
                    expiresAt: new Date(payload.exp * 1000).toLocaleString(),
                    isValid: this.isTokenValid(accessToken),
                    isNearExpiry: this.isTokenNearExpiry(accessToken)
                });
            }
        }

        console.groupEnd();
    }    /**
     * Lấy authorization header cho API requests
     */
    static getAuthHeader(): { Authorization: string } | Record<string, never> {
        const token = this.getAccessToken();

        if (!token || !this.isTokenValid(token)) {
            return {};
        }

        return {
            Authorization: `Bearer ${token}`
        };
    }

    /**
     * Check if user is authenticated
     */
    static isAuthenticated(): boolean {
        return this.hasTokens() && this.isTokenValid();
    }
}

export default TokenService;
