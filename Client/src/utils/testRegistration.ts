/**
 * Test Registration API Format
 * Để verify nested profile structure đang hoạt động đúng
 */

// Test data theo format mong muốn của user
const testRegistrationData = {
    "email": "john.doe@example.com",
    "username": "johndoe",
    "password": "password123",
    "confirmPassword": "password123",
    "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "age": 25,
        "weight": 75,
        "height": 180,
        "gender": "male",
        "fitnessGoals": [
            "muscle_gain",
            "strength"
        ],
        "experienceLevel": "intermediate",
        "bio": "Fitness enthusiast passionate about strength training"
    }
};

// Function để test API call
async function testRegistration() {
    try {
        const response = await fetch('http://localhost:5000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testRegistrationData)
        });

        const result = await response.json();
        console.log('Registration test result:', result);

        if (response.ok) {
            console.log('✅ Registration successful with nested profile structure');
        } else {
            console.log('❌ Registration failed:', result.error);
        }
    } catch (error) {
        console.error('❌ API call failed:', error);
    }
}

export { testRegistrationData, testRegistration };
