# 📤 ResponseHelper Utility

## 🎯 Mục đích

ResponseHelper được tạo ra để giải quyết vấn đề **code duplication** và đảm bảo **consistent response format** trong toàn bộ API.

## ❌ Vấn đề trước khi có ResponseHelper

Trước đây, mỗi controller method phải viết manually:

```typescript
// ❌ Lặp lại code này ở mọi nơi
res.status(200).json({
    success: true,
    data: userData,
    message: 'User retrieved successfully'
});

// ❌ Lặp lại error handling
res.status(401).json({
    success: false,
    error: 'User not authenticated',
    data: null
});
```

## ✅ Giải pháp với ResponseHelper

```typescript
// ✅ Gọn gàng và consistent
ResponseHelper.success(res, userData, 'User retrieved successfully');

// ✅ Error handling đơn giản
ResponseHelper.unauthorized(res, 'User not authenticated');
```

## 📚 API Reference

### Success Responses

```typescript
// 200 OK
ResponseHelper.success(res, data, 'Operation successful');

// 201 Created
ResponseHelper.created(res, newResource, 'Resource created successfully');

// 204 No Content
ResponseHelper.noContent(res);
```

### Error Responses

```typescript
// 400 Bad Request
ResponseHelper.badRequest(res, 'Invalid input data');

// 401 Unauthorized
ResponseHelper.unauthorized(res, 'Authentication required');

// 403 Forbidden
ResponseHelper.forbidden(res, 'Access denied');

// 404 Not Found
ResponseHelper.notFound(res, 'Resource not found');

// 409 Conflict
ResponseHelper.conflict(res, 'Email already exists');

// 422 Validation Error
ResponseHelper.validationError(res, validationErrors);

// 500 Internal Server Error
ResponseHelper.internalError(res, 'Something went wrong');
```

### Special Responses

```typescript
// Paginated data
ResponseHelper.paginated(res, items, paginationInfo, 'Data retrieved');

// Custom status
ResponseHelper.custom(res, 202, true, data, 'Request accepted');
```

## 🔧 Helper Functions

### Authentication Check

```typescript
// ✅ Thay vì manual check
if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated', data: null });
    return;
}

// ✅ Sử dụng helper
if (!requireAuth(res, req.user)) return;
```

### Validation Check

```typescript
// ✅ Validate required fields
if (!validateRequired(res, { name, email, password })) return;
```

### Email/Username Availability

```typescript
// ✅ Check email exists
const emailExists = await AuthService.checkEmailExists(email);
checkEmailExists(res, emailExists); // Handles response automatically

// ✅ Check username exists  
const usernameExists = await AuthService.checkUsernameExists(username);
checkUsernameExists(res, usernameExists); // Handles response automatically
```

## 🔄 Migration Examples

### AccountController

**Before:**
```typescript
static async getAccountProfile(req: RequestWithUser, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'User not authenticated',
                data: null
            });
            return;
        }

        const stats = await AccountService.getUserProfile(req.user._id);

        res.status(200).json({
            success: true,
            data: stats,
            message: 'User stats retrieved successfully'
        });
    } catch (error) {
        next(error);
    }
}
```

**After:**
```typescript
static async getAccountProfile(req: RequestWithUser, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
        if (!requireAuth(res, req.user)) return;

        const stats = await AccountService.getUserProfile(req.user!._id);
        ResponseHelper.success(res, stats, 'User stats retrieved successfully');
    } catch (error) {
        next(error);
    }
}
```

### AuthController

**Before:**
```typescript
static async checkEmail(req: Request<{}, ApiResponse, { email: string }>, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
        const { email } = req.body;
        const exists = await AuthService.checkEmailExists(email);

        res.status(200).json({
            success: true,
            data: { exists },
            message: exists ? 'Email already exists' : 'Email available'
        });
    } catch (error) {
        next(error);
    }
}
```

**After:**
```typescript
static async checkEmail(req: Request<{}, ApiResponse, { email: string }>, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
        const { email } = req.body;
        const exists = await AuthService.checkEmailExists(email);
        
        checkEmailExists(res, exists); // Handles response automatically
    } catch (error) {
        next(error);
    }
}
```

## 📊 Benefits

### 1. **Code Reduction**
- Giảm ~70% boilerplate code trong controllers
- Từ 8 dòng xuống còn 1 dòng cho mỗi response

### 2. **Consistency**
- Tất cả responses có cùng format
- Không còn typos trong response structure
- Standardized error messages

### 3. **Maintainability**
- Thay đổi response format ở một nơi
- Easy to add new response types
- Better debugging với consistent structure

### 4. **Developer Experience**
- TypeScript autocomplete support
- Fewer bugs với helper validation
- Cleaner, more readable code

### 5. **Performance**
- Less memory allocation
- Faster development time
- Reduced bundle size

## 🚀 Usage trong Project

### Import
```typescript
import { ResponseHelper, requireAuth, validateRequired } from '../utils/responseHelper';
```

### Typical Controller Pattern
```typescript
export class SomeController {
    static async someMethod(req: RequestWithUser, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
        try {
            // 1. Authentication check
            if (!requireAuth(res, req.user)) return;

            // 2. Validation
            if (!validateRequired(res, { field1, field2 })) return;

            // 3. Business logic
            const result = await SomeService.doSomething();

            // 4. Response
            ResponseHelper.success(res, result, 'Operation completed');
        } catch (error) {
            next(error);
        }
    }
}
```

## 🎯 Next Steps

1. ✅ **Completed**: Basic ResponseHelper với common methods
2. ✅ **Completed**: Helper functions cho auth và validation
3. ✅ **Completed**: Migration của AccountController và AuthController
4. 🔄 **In Progress**: Migration của SystemController
5. 📋 **Todo**: Update middleware để sử dụng ResponseHelper
6. 📋 **Todo**: Add more specialized helpers (file upload, etc.)
7. 📋 **Todo**: Add response caching helpers
8. 📋 **Todo**: Add API rate limiting helpers

## 🔗 Related Files

- `src/utils/responseHelper.ts` - Main ResponseHelper class
- `src/controllers/AccountController.ts` - Example usage
- `src/controllers/AuthController.ts` - Example usage  
- `src/examples/responseHelperUsage.ts` - Complete examples
