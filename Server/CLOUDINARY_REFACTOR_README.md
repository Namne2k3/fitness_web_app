# 📸 Cloudinary Integration Refactor

## 🎯 Mục tiêu
Tách biệt Cloudinary utility functions từ config file vào một service riêng biệt để tăng tính modular và maintainability.

## 🏗️ Cấu trúc mới

### 📁 Files được tạo/sửa đổi:

#### 1. `src/services/CloudinaryService.ts` (NEW)
- **Chức năng**: Centralized service cho tất cả Cloudinary operations
- **Methods**:
  - `uploadImage()` - Upload single image
  - `uploadVideo()` - Upload single video  
  - `uploadMultipleImages()` - Upload batch images
  - `deleteFile()` - Delete single file
  - `deleteMultipleFiles()` - Delete batch files
  - `generateTransformationUrl()` - Generate transformation URLs
  - `generateOptimizedImageUrl()` - Generate optimized URLs
  - `extractPublicId()` - Extract public ID from URL
  - `getFileInfo()` - Get file information
  - `fileExists()` - Check file existence
  - `getFolderContents()` - Get folder contents

#### 2. `src/config/cloudinary.ts` (REFACTORED)
- **Chức năng**: Chỉ chứa configuration và initialization
- **Content**: 
  - Configuration setup
  - `initializeCloudinary()` function
  - Export cloudinary instance

#### 3. `src/controllers/UploadController.ts` (NEW)
- **Chức năng**: Demo controller sử dụng CloudinaryService
- **Endpoints**:
  - `POST /upload/image` - Upload single image
  - `POST /upload/video` - Upload single video
  - `POST /upload/images` - Upload multiple images
  - `DELETE /upload/:publicId` - Delete file
  - `DELETE /upload/batch` - Delete multiple files
  - `GET /upload/optimize/:publicId` - Generate optimized URL
  - `GET /upload/info/:publicId` - Get file info
  - `GET /upload/exists/:publicId` - Check file existence

#### 4. `src/middleware/upload.ts` (NEW)
- **Chức năng**: Multer middleware cho file uploads
- **Features**:
  - File type validation (images + videos)
  - File size limits (50MB)
  - Temporary storage setup
  - Multiple upload support

#### 5. `src/routes/upload.ts` (NEW)
- **Chức năng**: Routes cho upload operations
- **Authentication**: All routes require authentication

## 🔄 Migration từ code cũ

### Trước đây:
```typescript
import { uploadImage, deleteFile } from '../config/cloudinary';

// Upload
const imageUrl = await uploadImage(file, 'folder');

// Delete
await deleteFile(publicId);
```

### Bây giờ:
```typescript
import { CloudinaryService } from '../services/CloudinaryService';

// Upload
const imageUrl = await CloudinaryService.uploadImage(file, 'folder');

// Delete
await CloudinaryService.deleteFile(publicId);
```

## ✨ Advantages của refactor

### 1. **Separation of Concerns**
- Config file chỉ handle configuration
- Service file handle business logic
- Controller handle HTTP requests

### 2. **Better Organization**
- Tất cả Cloudinary operations ở một nơi
- Dễ maintain và extend
- Clear responsibility boundaries

### 3. **Type Safety**
- Improved error handling
- Better TypeScript support
- Validation cho inputs

### 4. **Extensibility**
- Dễ dàng thêm methods mới
- Support cho batch operations
- Advanced transformation options

## 🚀 Usage Examples

### Basic Image Upload:
```typescript
// In controller
const imageUrl = await CloudinaryService.uploadImage(req.file);
```

### Batch Upload:
```typescript
const imageUrls = await CloudinaryService.uploadMultipleImages(req.files);
```

### Generate Optimized URL:
```typescript
const optimizedUrl = CloudinaryService.generateOptimizedImageUrl(
    publicId, 
    800, // width
    600, // height
    'auto' // quality
);
```

### Delete with URL:
```typescript
const publicId = CloudinaryService.extractPublicId(imageUrl);
await CloudinaryService.deleteFile(publicId);
```

## 📦 Dependencies

Đảm bảo install các packages cần thiết:

```bash
npm install multer @types/multer cloudinary
```

## 🔧 Environment Variables

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🧪 Testing

Test upload functionality:

```bash
# Upload image
curl -X POST http://localhost:5000/api/v1/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"

# Get file info
curl -X GET http://localhost:5000/api/v1/upload/info/PUBLIC_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Next Steps

1. **Update existing controllers** để sử dụng CloudinaryService
2. **Add error handling** cho network failures
3. **Implement retry logic** cho failed uploads
4. **Add progress tracking** cho large files
5. **Setup cleanup jobs** cho temporary files

---

**🎉 Refactor hoàn thành!** Cloudinary integration giờ đây modular và maintainable hơn.
