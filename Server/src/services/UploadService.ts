
import fs from 'fs';
import path from 'path';

/**
 * 📁 UploadService
 * Lưu file vào thư mục local trên server Node.js
 */
export class UploadService {
    /**
     * Lưu file upload vào thư mục chỉ định
     * @param file - Express.Multer.File
     * @param folder - Thư mục lưu file (mặc định: uploads/local)
     * @returns Đường dẫn file đã lưu (relative path)
     */
    /**
     * Lưu file upload vào thư mục chỉ định và trả về cả đường dẫn tĩnh và URL truy cập
     * @param file - Express.Multer.File
     * @param folder - Thư mục lưu file (mặc định: uploads/local)
     * @param req - Express Request (để lấy host/protocol)
     * @returns { filePath: string, url: string }
     */
    static async saveFileToLocal(
        file: Express.Multer.File,
        folder: string = 'uploads/local',
        req?: import('express').Request
    ): Promise<{ filePath: string }> {
        return new Promise((resolve, reject) => {
            try {
                // Đảm bảo thư mục tồn tại
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder, { recursive: true });
                }
                const ext = path.extname(file.originalname);
                const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
                const destPath = path.join(folder, fileName);
                fs.copyFile(file.path, destPath, (err) => {
                    if (err) return reject(err);
                    fs.unlink(file.path, (err) => {
                        if (err) return reject(err);
                    });
                    // Chuẩn hóa đường dẫn tĩnh cho client (dùng forward slash)
                    let staticPath = destPath.replace(/\\/g, '/');
                    // Đảm bảo bắt đầu bằng 'uploads/'
                    const uploadsIndex = staticPath.indexOf('uploads/');
                    if (uploadsIndex >= 0) {
                        staticPath = staticPath.substring(uploadsIndex);
                    }
                    // Xây dựng URL truy cập nếu có req
                    let url = staticPath;
                    if (req) {
                        // Lấy host từ req gốc (server), không phải client
                        const protocol = req.protocol;
                        let host = req.get('host');
                        // Nếu chạy sau proxy/nginx, ưu tiên header X-Forwarded-Host
                        if (req.headers['x-forwarded-host']) {
                            host = req.headers['x-forwarded-host'] as string;
                        }
                        url = `${protocol}://${host}/${staticPath}`;
                    }
                    resolve({ filePath: url });
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Xóa file local
     */
    static async deleteLocalFile(filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    /**
     * Lưu nhiều file vào local
     */
    /**
     * Lưu nhiều file vào local và trả về mảng object { filePath, url }
     */
    static async saveMultipleFilesToLocal(
        files: Express.Multer.File[],
        folder: string = 'uploads/local',
        req?: import('express').Request
    ): Promise<{ filePath: string }[]> {
        const results: { filePath: string }[] = [];
        for (const file of files) {
            const saved = await this.saveFileToLocal(file, folder, req);
            results.push(saved);
        }
        return results;
    }
}
