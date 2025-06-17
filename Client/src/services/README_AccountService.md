# AccountService - React 19 Implementation

## 📋 Tổng quan

AccountService là service chính để quản lý API calls liên quan đến account/profile của user, được implement theo React 19 patterns với focus vào performance và developer experience.

## 🚀 Features

### Core Functionality
- ✅ `getAccountProfile()` - Lấy thông tin profile chi tiết với health metrics
- ✅ `updateProfile()` - Cập nhật thông tin cá nhân và preferences
- ✅ `uploadAvatar()` / `deleteAvatar()` - Quản lý avatar
- ✅ `changePassword()` - Thay đổi mật khẩu
- ✅ `deleteAccount()` - Xóa tài khoản (soft delete)

### Analytics & Stats
- ✅ `getWorkoutStats()` - Thống kê workout chi tiết
- ✅ `getActivityHistory()` - Lịch sử hoạt động

### Utility Functions
- ✅ `checkUsernameAvailability()` - Kiểm tra username
- ✅ `resendVerificationEmail()` - Gửi lại email xác thực
- ✅ `exportPersonalData()` - Xuất dữ liệu cá nhân (GDPR)

## 🎯 React 19 Usage Examples

### 1. Basic Usage với use() Hook

```typescript
import { Suspense } from 'react';
import { useAccountProfile } from '../hooks/useAccountProfile';

function ProfileComponent() {
    // React 19: use() hook thông qua custom hook
    const profile = useAccountProfile();
    
    return (
        <div>
            <h2>BMI: {profile.healthMetrics.bmi}</h2>
            <p>Experience: {profile.fitnessProfile.experienceLevel}</p>
        </div>
    );
}

// Wrap với Suspense
function ProfilePage() {
    return (
        <Suspense fallback={<div>Loading profile...</div>}>
            <ProfileComponent />
        </Suspense>
    );
}
```

### 2. Update Profile với Actions Pattern

```typescript
import { useActionState } from 'react';
import { AccountService } from '../services/accountService';

function EditProfileForm() {
    const [state, submitAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
            try {
                const updateData = {
                    profile: {
                        weight: Number(formData.get('weight')),
                        height: Number(formData.get('height')),
                        fitnessGoals: JSON.parse(formData.get('goals') as string)
                    }
                };
                
                const response = await AccountService.updateProfile(updateData);
                
                if (response.success) {
                    return { success: true, error: null };
                } else {
                    return { success: false, error: response.error };
                }
            } catch (error) {
                return { 
                    success: false, 
                    error: error instanceof Error ? error.message : 'Unknown error' 
                };
            }
        },
        { success: false, error: null }
    );

    return (
        <form action={submitAction}>
            <input name="weight" type="number" placeholder="Weight (kg)" />
            <input name="height" type="number" placeholder="Height (cm)" />
            <textarea name="goals" placeholder="Fitness goals (JSON)" />
            
            <button type="submit" disabled={isPending}>
                {isPending ? 'Updating...' : 'Update Profile'}
            </button>
            
            {state.error && <div className="error">{state.error}</div>}
            {state.success && <div className="success">Profile updated!</div>}
        </form>
    );
}
```

### 3. Avatar Upload với Progress

```typescript
import { useState } from 'react';
import { AccountService } from '../services/accountService';

function AvatarUploader() {
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const handleUpload = async (file: File) => {
        setUploading(true);
        
        try {
            const response = await AccountService.uploadAvatar(file);
            
            if (response.success && response.data) {
                setAvatarUrl(response.data.avatarUrl);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                }}
                disabled={uploading}
            />
            
            {uploading && <p>Uploading...</p>}
            {avatarUrl && <img src={avatarUrl} alt="Avatar" />}
        </div>
    );
}
```

## 📊 API Response Format

### AccountProfile Interface
```typescript
interface AccountProfile {
    id: string;
    joinDate: string;
    lastLogin: string;
    isEmailVerified: boolean;
    subscriptionPlan: string;
    subscriptionStatus: string;
    healthMetrics: {
        bmi: number;
        bmiCategory: string;
        weight: number;
        height: number;
        age: number;
    };
    fitnessProfile: {
        experienceLevel: string;
        fitnessGoals: string[];
        bmiWarnings?: string[];
    };
}
```

### Update Profile Data
```typescript
interface UpdateProfileData {
    profile?: {
        firstName?: string;
        lastName?: string;
        age?: number;
        weight?: number;
        height?: number;
        // ... more fields
    };
    preferences?: {
        notifications?: { ... };
        privacy?: { ... };
        theme?: 'light' | 'dark' | 'auto';
        // ... more settings
    };
}
```

## 🔧 Configuration

### Environment Variables
```bash
# .env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### API Endpoints
```
GET    /account/profile              # Get account profile
PUT    /account/profile              # Update profile
POST   /account/avatar               # Upload avatar
DELETE /account/avatar               # Delete avatar
PUT    /account/password             # Change password
DELETE /account                      # Delete account
GET    /account/workout-stats        # Get workout statistics
GET    /account/activity             # Get activity history
GET    /account/check-username       # Check username availability
POST   /account/resend-verification  # Resend verification email
POST   /account/export-data          # Export personal data
```

## 🧪 Testing

### Run Tests
```typescript
import { runAllAccountTests } from '../utils/testAccountService';

// Run all tests
await runAllAccountTests();

// Or test individual functions
import { testAccountService } from '../utils/testAccountService';
await testAccountService();
```

### Test Component
```tsx
import { AccountServiceTester } from '../utils/testAccountService';

function TestPage() {
    return (
        <div>
            <h1>AccountService Tests</h1>
            <AccountServiceTester />
        </div>
    );
}
```

## 🚨 Error Handling

AccountService implements comprehensive error handling:

1. **Network Errors**: Axios interceptors handle timeouts và connection issues
2. **Authentication**: Automatic token refresh khi cần thiết  
3. **Validation**: Server-side validation với detailed error messages
4. **Type Safety**: Full TypeScript support với proper error types

## 🎯 Best Practices

1. **Always wrap với Suspense** khi sử dụng use() hook
2. **Use Actions pattern** cho form submissions và updates
3. **Handle loading states** với isPending từ useActionState
4. **Implement error boundaries** cho graceful error handling
5. **Cache API responses** khi có thể với useMemo

## 📝 Notes

- AccountService tương thích hoàn toàn với React 19 patterns
- Sử dụng TypeScript strict mode để đảm bảo type safety
- Error handling được implement theo MERN best practices
- API calls được optimize với axios interceptors
- Support cho file uploads với progress tracking

## 🔗 Related Files

- `src/services/accountService.ts` - Main service file
- `src/hooks/useAccountProfile.ts` - React 19 custom hook
- `src/components/profile/AccountProfileCard.tsx` - Example component
- `src/utils/testAccountService.ts` - Test utilities
- `src/pages/ProfilePage.tsx` - Integration example
