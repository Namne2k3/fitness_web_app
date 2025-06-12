/**
 * 🚀 Authentication API Test Examples
 * Comprehensive examples của tất cả authentication endpoints với BMI data
 */

// Base URL cho API
const BASE_URL = 'http://localhost:5000/api/v1';

/**
 * 📋 Available Authentication Endpoints:
 * 
 * 1. POST /auth/register - Đăng ký user mới
 * 2. POST /auth/login - Đăng nhập user
 * 3. GET /auth/me - Lấy thông tin user hiện tại
 * 4. PUT /auth/profile - Cập nhật profile user
 * 5. PUT /auth/change-password - Đổi mật khẩu
 * 6. POST /auth/check-email - Kiểm tra email tồn tại
 * 7. POST /auth/check-username - Kiểm tra username tồn tại
 * 8. POST /auth/verify-email - Xác thực email
 * 9. POST /auth/resend-verification - Gửi lại email xác thực
 * 10. GET /auth/stats - Thống kê user với BMI
 * 11. GET /auth/health-insights - Chi tiết health insights và recommendations
 * 12. POST /auth/logout - Đăng xuất
 * 13. DELETE /auth/deactivate - Vô hiệu hóa tài khoản
 */

// ================================
// 📝 Example 1: Register User với BMI data
// ================================

const registerExample = {
    url: `${BASE_URL}/auth/register`,
    method: 'POST',
    body: {
        email: 'john.doe@example.com',
        username: 'johndoe2025',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        profile: {
            firstName: 'John',
            lastName: 'Doe',
            age: 28,
            weight: 75, // kg - sẽ được dùng để tính BMI
            height: 180, // cm - sẽ được dùng để tính BMI
            fitnessGoals: ['muscle_gain', 'strength'],
            experienceLevel: 'intermediate',
            bio: 'Passionate about fitness and healthy living'
        }
    }
};

console.log('📝 Register User Example:');
console.log(`${registerExample.method} ${registerExample.url}`);
console.log('Body:', JSON.stringify(registerExample.body, null, 2));
console.log('\n✅ Expected Response: User registered with BMI calculated automatically\n');

// ================================
// 🔐 Example 2: Login User
// ================================

const loginExample = {
    url: `${BASE_URL}/auth/login`,
    method: 'POST',
    body: {
        email: 'john.doe@example.com',
        password: 'SecurePass123!'
    }
};

console.log('🔐 Login User Example:');
console.log(`${loginExample.method} ${loginExample.url}`);
console.log('Body:', JSON.stringify(loginExample.body, null, 2));
console.log('\n✅ Expected Response: JWT tokens + user profile với BMI\n');

// ================================
// 📊 Example 3: Get User Stats với BMI
// ================================

const statsExample = {
    url: `${BASE_URL}/auth/stats`,
    method: 'GET',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
        'Content-Type': 'application/json'
    }
};

console.log('📊 Get User Stats Example:');
console.log(`${statsExample.method} ${statsExample.url}`);
console.log('Headers:', JSON.stringify(statsExample.headers, null, 2));
console.log('\n✅ Expected Response:');
console.log(`{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "joinDate": "2025-06-10T10:00:00.000Z",
    "lastLogin": "2025-06-10T14:30:00.000Z",
    "isEmailVerified": true,
    "subscriptionPlan": "free",
    "subscriptionStatus": "active",
    "healthMetrics": {
      "bmi": 23.1,
      "bmiCategory": "Normal weight",
      "weight": 75,
      "height": 180,
      "age": 28
    },
    "fitnessProfile": {
      "experienceLevel": "intermediate",
      "fitnessGoals": ["muscle_gain", "strength"],
      "bmiWarnings": []
    }
  },
  "message": "User stats retrieved successfully"
}\n`);

// ================================
// 🏥 Example 4: Get Health Insights (NEW!)
// ================================

const healthInsightsExample = {
    url: `${BASE_URL}/auth/health-insights`,
    method: 'GET',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
        'Content-Type': 'application/json'
    }
};

console.log('🏥 Get Health Insights Example:');
console.log(`${healthInsightsExample.method} ${healthInsightsExample.url}`);
console.log('Headers:', JSON.stringify(healthInsightsExample.headers, null, 2));
console.log('\n✅ Expected Response:');
console.log(`{
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
      "focusAreas": ["Resistance training", "Progressive overload", "Adequate protein intake"],
      "cautionNotes": [],
      "suggestedActivities": ["Weight training", "Moderate cardio", "Flexibility training"]
    }
  },
  "message": "Health insights retrieved successfully"
}\n`);

// ================================
// 🔄 Example 5: Update Profile với BMI recalculation
// ================================

const updateProfileExample = {
    url: `${BASE_URL}/auth/profile`,
    method: 'PUT',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
        'Content-Type': 'application/json'
    },
    body: {
        weight: 80, // Updated weight - BMI sẽ được tính lại
        height: 180, // Height unchanged
        fitnessGoals: ['muscle_gain', 'strength', 'endurance'], // Added endurance goal
        bio: 'Updated bio: Training for upcoming marathon while building muscle'
    }
};

console.log('🔄 Update Profile Example:');
console.log(`${updateProfileExample.method} ${updateProfileExample.url}`);
console.log('Headers:', JSON.stringify(updateProfileExample.headers, null, 2));
console.log('Body:', JSON.stringify(updateProfileExample.body, null, 2));
console.log('\n✅ Expected Response: Updated user profile với BMI mới (24.7)\n');

// ================================
// 🧪 Curl Commands cho Testing
// ================================

console.log('🧪 Curl Commands for Quick Testing:\n');

console.log('1. Register User:');
console.log(`curl -X POST ${BASE_URL}/auth/register \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(registerExample.body)}'\n`);

console.log('2. Login User:');
console.log(`curl -X POST ${BASE_URL}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(loginExample.body)}'\n`);

console.log('3. Get Health Insights (replace TOKEN):');
console.log(`curl -X GET ${BASE_URL}/auth/health-insights \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"\n`);

console.log('4. Get User Stats (replace TOKEN):');
console.log(`curl -X GET ${BASE_URL}/auth/stats \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"\n`);

// ================================
// 📚 BMI Calculation Examples
// ================================

console.log('📚 BMI Calculation Examples:\n');

const bmiExamples = [
    { weight: 50, height: 170, expected: 17.3, category: 'Underweight' },
    { weight: 70, height: 175, expected: 22.9, category: 'Normal weight' },
    { weight: 85, height: 180, expected: 26.2, category: 'Overweight' },
    { weight: 100, height: 170, expected: 34.6, category: 'Obese' }
];

bmiExamples.forEach((example, index) => {
    const bmi = Math.round((example.weight / ((example.height / 100) ** 2)) * 10) / 10;
    console.log(`Example ${index + 1}: ${example.weight}kg, ${example.height}cm → BMI: ${bmi} (${example.category})`);
});

console.log('\n🎯 BMI Categories:');
console.log('• Underweight: BMI < 18.5');
console.log('• Normal weight: BMI 18.5 - 24.9');
console.log('• Overweight: BMI 25 - 29.9');
console.log('• Obese: BMI ≥ 30');

console.log('\n✅ All examples ready for testing! Start server với `npm run dev` và test endpoints.');
