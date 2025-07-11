# 🤖 ChatBot API Documentation

## Overview

ChatBot API cho phép tích hợp AI assistant vào Fitness Web App để hỗ trợ người dùng với các câu hỏi về tập luyện và sức khỏe.

## Base URL

```
http://localhost:3000/api/v1/chatbot
```

## Authentication

Tất cả endpoints (trừ health check) yêu cầu JWT authentication token trong header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Send Message

Gửi tin nhắn đến ChatBot và nhận phản hồi AI.

**Endpoint:** `POST /message`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "message": "Tôi muốn tập gym để tăng cân, bạn có thể tư vấn không?",
  "conversation_id": "conv_1234567890" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "Tôi sẽ giúp bạn tư vấn về tập gym để tăng cân...",
    "conversation_id": "conv_1234567890",
    "timestamp": "2025-01-11T10:30:00.000Z",
    "metadata": {
      "user_id": "user123",
      "message_length": 45,
      "processing_time": 1641897000000
    }
  },
  "message": "Message sent successfully"
}
```

**Error Response (External API failed):**
```json
{
  "success": true,
  "data": {
    "reply": "Xin lỗi, tôi đang gặp vấn đề kỹ thuật. Vui lòng thử lại sau.",
    "conversation_id": "conv_1234567890",
    "timestamp": "2025-01-11T10:30:00.000Z",
    "metadata": {
      "fallback": true,
      "error_code": "EXTERNAL_API_ERROR_500"
    }
  },
  "message": "Response generated with fallback"
}
```

### 2. Get Conversations

Lấy danh sách conversations của user (hiện tại trả về empty array).

**Endpoint:** `GET /conversations`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [],
    "total": 0,
    "user_id": "user123"
  },
  "message": "Conversations retrieved successfully"
}
```

### 3. Delete Conversation

Xóa một conversation (hiện tại chỉ trả về success).

**Endpoint:** `DELETE /conversations/:conversationId`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deleted": true,
    "conversation_id": "conv_1234567890",
    "user_id": "user123"
  },
  "message": "Conversation deleted successfully"
}
```

### 4. Health Check

Kiểm tra trạng thái ChatBot service.

**Endpoint:** `GET /health`

**Response (Healthy):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "latency": 125
  },
  "message": "ChatBot service is healthy"
}
```

**Response (Unhealthy):**
```json
{
  "success": false,
  "error": "ChatBot service is unhealthy",
  "data": {
    "status": "unhealthy",
    "error": "Request timeout"
  }
}
```

### 5. Get Config (Admin Only)

Lấy thông tin cấu hình ChatBot.

**Endpoint:** `GET /config`

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "config_valid": true,
    "has_api_key": true,
    "api_url": "https://api.openai.com/v1/chat/completions",
    "timeout": "30000",
    "max_retries": "3",
    "model": "gpt-3.5-turbo"
  },
  "message": "ChatBot configuration retrieved"
}
```

### 6. Test ChatBot (Admin Only)

Test ChatBot với sample message.

**Endpoint:** `POST /test`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "message": "Hello, this is a test message" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "test_successful": true,
    "request": {
      "message": "Hello, this is a test message",
      "user_id": "test-user-admin",
      "conversation_id": undefined
    },
    "response": {
      "reply": "Hello! How can I help you with your fitness journey?",
      "conversation_id": "conv_1641897000000",
      "timestamp": "2025-01-11T10:30:00.000Z"
    },
    "response_time_ms": 1250,
    "timestamp": "2025-01-11T10:30:00.000Z"
  },
  "message": "ChatBot test completed successfully"
}
```

## Environment Variables

Configure these environment variables in your `.env` file:

```env
# ChatBot Configuration
CHATBOT_API_URL=https://api.openai.com/v1/chat/completions
CHATBOT_API_KEY=your-openai-api-key
CHATBOT_TIMEOUT=30000
CHATBOT_MAX_RETRIES=3
CHATBOT_MODEL=gpt-3.5-turbo
CHATBOT_TEMPERATURE=0.7
```

## Error Codes

- `400 Bad Request` - Invalid request format or missing required fields
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Admin access required
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error or external API failure
- `503 Service Unavailable` - ChatBot service is unhealthy

## Rate Limiting

- **Message API**: 30 requests per minute per user
- **Health Check**: 10 requests per 5 minutes
- **Test API**: 5 requests per 10 minutes (admin only)

## External API Integration

The ChatBot service integrates with OpenAI's GPT-3.5-turbo model:

- **API URL**: `https://api.openai.com/v1/chat/completions`
- **Model**: `gpt-3.5-turbo`
- **Max Tokens**: 500
- **Temperature**: 0.7
- **System Prompt**: Configured for Vietnamese fitness assistant

## Fallback Mechanism

When the external API fails, the service automatically provides fallback responses to ensure user experience is not interrupted.

## Security

- All requests (except health check) require authentication
- Admin endpoints require admin role
- API keys are securely stored in environment variables
- Input validation and sanitization
- Rate limiting to prevent abuse

## Usage Example

```javascript
// Send message to ChatBot
const response = await fetch('/api/v1/chatbot/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwtToken}`
  },
  body: JSON.stringify({
    message: 'Tôi muốn giảm cân, bạn có thể tư vấn không?',
    conversation_id: 'conv_123'
  })
});

const data = await response.json();
console.log(data.data.reply); // AI response
```

## Support

For questions or issues, contact the development team or check the application logs for detailed error information.
