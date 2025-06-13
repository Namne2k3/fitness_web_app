import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Email Service cho việc gửi các loại email
 */
export class EmailService {
    private static transporter: nodemailer.Transporter;

    /**
     * Khởi tạo email transporter
     */
    private static initTransporter(): void {
        if (this.transporter) return;

        // Cấu hình cho Gmail với App Password
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                // Sử dụng App Password thay vì mật khẩu thông thường
                pass: process.env.EMAIL_APP_PASSWORD
            }
        });

        console.log('Email service initialized');
    }

    /**
     * Gửi email reset password 
     * @param email Email người nhận
     * @param resetToken Token để reset password
     * @param username Tên người dùng (optional)
     */
    static async sendPasswordResetEmail(
        email: string,
        resetToken: string,
        username?: string
    ): Promise<void> {
        try {
            this.initTransporter();

            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
            const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;
            const displayName = username || 'Người dùng';

            // Email content
            const mailOptions: nodemailer.SendMailOptions = {
                from: `"${process.env.APP_NAME || 'TrackMe'}" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Đặt lại mật khẩu của bạn',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background-color: #2196F3; color: white; padding: 10px; text-align: center;">
                        <h2>${process.env.APP_NAME || 'TrackMe'}</h2>
                        </div>
                        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
                        <h3>Yêu cầu đặt lại mật khẩu</h3>
                        <p>Xin chào ${displayName},</p>
                        <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấp vào nút bên dưới để tạo mật khẩu mới:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
                        </div>
                        <p>Hoặc copy và paste đường dẫn này vào trình duyệt của bạn:</p>
                        <p style="word-break: break-all;">${resetLink}</p>
                        <p>Đường dẫn này sẽ hết hạn sau 1 giờ.</p>
                        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ nếu bạn có bất kỳ câu hỏi nào.</p>
                        <p>Trân trọng,<br>${process.env.APP_NAME || 'TrackMe'}</p>
                        </div>
                        <div style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
                        <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'TrackMe'}. Đã đăng ký bản quyền.</p>
                        </div>
                    </div>
                `,
                text: `
                    Xin chào ${displayName},

                    Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng truy cập đường dẫn sau để tạo mật khẩu mới:

                    ${resetLink}

                    Đường dẫn này sẽ hết hạn sau 15 phút.

                    Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.

                    Trân trọng,
                    ${process.env.APP_NAME || 'TrackMe'}
                `
            };

            // Send email
            await this.transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${email}`);
        } catch (error) {
            console.error('Failed to send password reset email:', error);
            throw new Error(`Failed to send password reset email: ${(error as Error).message}`);
        }
    }

    /**
     * Kiểm tra kết nối với email server
     */
    static async verifyConnection(): Promise<boolean> {
        try {
            this.initTransporter();
            await this.transporter.verify();
            return true;
        } catch (error) {
            console.error('Email verification failed:', error);
            return false;
        }
    }
}