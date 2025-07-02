
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
    static async saveFileToLocal(file: Express.Multer.File, folder: string = 'uploads/local'): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                // Đảm bảo thư mục tồn tại
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder, { recursive: true });
                }
                const ext = path.extname(file.originalname);
                const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
                const destPath = path.join(folder, fileName);
                // Đọc file từ temp và ghi vào destPath
                fs.copyFile(file.path, destPath, (err) => {
                    if (err) return reject(err);
                    resolve(destPath);
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
    static async saveMultipleFilesToLocal(files: Express.Multer.File[], folder: string = 'uploads/local'): Promise<string[]> {
        const results: string[] = [];
        for (const file of files) {
            const saved = await this.saveFileToLocal(file, folder);
            results.push(saved);
        }
        return results;
    }
}
