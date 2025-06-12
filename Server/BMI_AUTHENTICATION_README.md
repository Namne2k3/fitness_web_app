# 🔐 Authentication API với BMI Health Metrics

## 📋 Tổng quan

API Authentication system hoàn chỉnh với tính năng tính toán BMI tự động và health insights cho Fitness Web App. Hệ thống được xây dựng theo React 19 standards và coding best practices.

## 🎯 Tính năng chính

### ✅ Core Authentication
- [x] User registration với validation
- [x] JWT-based authentication  
- [x] Password hashing với bcrypt
- [x] Email verification system
- [x] Profile management
- [x] Password change functionality

### 📊 Health Metrics (MỚI!)
- [x] **BMI tự động tính toán** từ height/weight
- [x] **BMI categorization** theo WHO standards
- [x] **BMR estimation** (Basal Metabolic Rate)
- [x] **TDEE calculations** (Total Daily Energy Expenditure)
- [x] **Calorie recommendations** theo activity level
- [x] **Fitness recommendations** dựa trên BMI và goals
- [x] **Health warnings** cho các BMI cases đặc biệt

## 🚀 Endpoints

| Method | Endpoint | Description | Có BMI? |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Đăng ký user mới | ✅ BMI auto-calculated |
| POST | `/auth/login` | Đăng nhập user | ✅ BMI in response |
| GET | `/auth/me` | Lấy profile hiện tại | ✅ BMI included |
| PUT | `/auth/profile` | Cập nhật profile | ✅ BMI recalculated |
| GET | `/auth/stats` | User statistics | ✅ BMI + health metrics |
| GET | `/auth/health-insights` | **Health insights chi tiết** | ✅ Full health analysis |
| PUT | `/auth/change-password` | Đổi mật khẩu | - |
| POST | `/auth/logout` | Đăng xuất | - |
| DELETE | `/auth/deactivate` | Vô hiệu hóa account | - |

## 📊 BMI System Details

### Automatic BMI Calculation
```javascript
// BMI được tính tự động từ height và weight
BMI = weight(kg) / (height(m))²

// Example:
// Weight: 75kg, Height: 180cm
// BMI = 75 / (1.8)² = 23.1
```

### BMI Categories (WHO Standards)
- **Underweight**: BMI < 18.5
- **Normal weight**: BMI 18.5 - 24.9  
- **Overweight**: BMI 25 - 29.9
- **Obese**: BMI ≥ 30

### Health Warnings System
```javascript
// Automatic warnings dựa trên BMI và fitness goals
if (BMI < 18.5 && goals.includes('weight_loss')) {
  warning: "BMI indicates underweight. Weight loss goals may not be appropriate."
}

if (BMI > 30 && goals.includes('muscle_gain')) {
  warning: "Consider combining muscle gain with weight management goals."
}
```

## 🏥 Health Insights Feature

### GET `/auth/health-insights`
Endpoint mới cung cấp phân tích sức khỏe chi tiết:

#### Response Example:
```json
{
  "success": true,
  "data": {
    "healthMetrics": {
      "bmi": 23.1,
      "bmiCategory": "Normal weight",
      "weight": 75,
      "height": 180,
      "age": 28,
      "estimatedBMR": 1750
    },
    "calorieRecommendations": {
      "sedentary": 2100,
      "light": 2400,
      "moderate": 2700,
      "active": 3000,
      "veryActive": 3300
    },
    "fitnessProfile": {
      "experienceLevel": "intermediate",
      "fitnessGoals": ["muscle_gain", "strength"],
      "warnings": []
    },
    "recommendations": {
      "workoutFrequency": "4-5 times per week",
      "focusAreas": [
        "Resistance training",
        "Progressive overload",
        "Adequate protein intake"
      ],
      "cautionNotes": [],
      "suggestedActivities": [
        "Weight training",
        "Moderate cardio",
        "Flexibility training"
      ]
    }
  }
}
```

## 🧪 Testing Examples

### 1. Register User với BMI
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "username": "johndoe2025",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "age": 28,
      "weight": 75,
      "height": 180,
      "fitnessGoals": ["muscle_gain", "strength"],
      "experienceLevel": "intermediate"
    }
  }'
```

### 2. Get Health Insights
```bash
curl -X GET http://localhost:5000/api/v1/auth/health-insights \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 3. Update Profile (BMI recalculated)
```bash
curl -X PUT http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 80,
    "fitnessGoals": ["muscle_gain", "strength", "endurance"]
  }'
```

## 🔧 Technical Implementation

### User Model với BMI Virtual
```javascript
// BMI được tính như virtual property
UserSchema.virtual('profile.bmi').get(function() {
  const heightInMeters = this.profile.height / 100;
  return Math.round((this.profile.weight / (heightInMeters * heightInMeters)) * 10) / 10;
});
```

### Validation với Health Checks
```javascript
// Validation functions include BMI validation
export const validateBMIForGoals = (bmi, fitnessGoals) => {
  const warnings = [];
  // Logic to check BMI compatibility với fitness goals
  return warnings;
};
```

### Health Calculations
```javascript
// BMR calculation (Mifflin-St Jeor Equation)
const calculateBMR = (weight, height, age, gender) => {
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
};

// TDEE calculation
const calculateTDEE = (bmr, activityLevel) => {
  return Math.round(bmr * activityLevel);
};
```

## 📚 Documentation

- **Swagger UI**: Available tại `/api-docs`
- **API JSON**: Available tại `/api-docs.json`  
- **Test Files**: 
  - `src/tests/bmi.test.ts` - BMI calculation tests
  - `src/tests/api-examples.ts` - API usage examples

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Fill in your MongoDB URI, JWT secrets, etc.
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access Swagger Documentation**:
   ```
   http://localhost:5000/api-docs
   ```

5. **Test BMI calculations**:
   ```bash
   npx ts-node src/tests/bmi.test.ts
   ```

## 🎯 Key Features Summary

### ✅ Authentication Features
- JWT-based auth với access/refresh tokens
- bcrypt password hashing  
- Email verification
- Input validation với Joi
- Type-safe với TypeScript

### 📊 BMI & Health Features  
- **Automatic BMI calculation** từ user profile
- **Health categorization** theo medical standards
- **Personalized recommendations** dựa trên BMI + goals
- **Calorie estimates** cho different activity levels
- **Fitness warnings** cho special BMI cases
- **Detailed health insights** với recommendations

### 🔒 Security Features
- Password strength validation
- Rate limiting ready
- Input sanitization
- Error handling middleware
- CORS protection

### 📖 Developer Experience
- Comprehensive TypeScript types
- Swagger API documentation  
- JSDoc comments throughout
- Validation utilities
- Test examples included

## 🎯 Next Steps

1. **Frontend Integration**: Integrate với React 19 frontend
2. **Email Service**: Add real email verification service
3. **Advanced Analytics**: More detailed health tracking
4. **Nutrition Integration**: Add calorie tracking features
5. **Activity Tracking**: Connect với workout data

---

**🏋️ Fitness Web App Authentication API với BMI Health Metrics - Ready to use! 🚀**
