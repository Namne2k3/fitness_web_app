# 🤖 ChatBot Component

AI Fitness Assistant chatbot component với giao diện đẹp và xử lý stream data.

## ✨ Features

- 🎨 **Modern UI**: Material UI design với animations
- 💬 **Real-time Chat**: Stream response simulation
- 🚀 **React 19**: Sử dụng `useActionState` và modern patterns
- 📱 **Responsive**: Mobile-friendly design
- 🎯 **Quick Actions**: Pre-defined fitness prompts
- 💾 **Local Storage**: Chat history persistence
- ⚡ **Performance**: Optimized rendering và smooth UX

## 🏗️ Architecture

```
src/
├── components/chatbot/
│   ├── ChatBot.tsx          # Main chatbot component
│   └── index.ts             # Exports
├── services/
│   └── chatBotService.ts    # API service layer
├── hooks/
│   └── useChatBot.ts        # Custom hook for chat logic
└── types/
    └── chatbot.interface.ts # TypeScript interfaces
```

## 🎨 Component Structure

### ChatBot.tsx
- **Floating Action Button**: Icon để mở/đóng chat
- **Chat Window**: Sliding dialog với header, messages, input
- **Message Component**: Render user/bot messages với avatars
- **Stream Handling**: Real-time message streaming
- **Quick Actions**: Fitness-specific prompt buttons

### ChatBotService.ts
- **Stream Simulation**: Mock API responses với delay
- **Contextual Responses**: Smart replies based on user input
- **Storage Management**: Local storage cho chat history
- **API Integration**: Ready for real API endpoints

### useChatBot.ts
- **State Management**: Messages, loading, typing states
- **Send Message**: Handle user input và API calls
- **Error Handling**: Retry mechanism và error states
- **Chat History**: Persistence và management

## 🔧 Usage

### Basic Implementation

```tsx
import { ChatBot } from '../components/chatbot';

function App() {
  return (
    <div>
      {/* Your app content */}
      <ChatBot />
    </div>
  );
}
```

### Advanced Usage với Custom Hook

```tsx
import { useChatBot } from '../hooks/useChatBot';

function CustomChatInterface() {
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    error
  } = useChatBot();

  return (
    <div>
      {/* Custom chat UI */}
    </div>
  );
}
```

## 📝 Configuration

### Quick Actions Customization

```tsx
// types/chatbot.interface.ts
export const CUSTOM_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'custom-action',
    label: '🎯 Custom Prompt',
    prompt: 'Custom prompt text here',
    category: 'workout'
  }
];
```

### Theme Customization

```tsx
// Customize chat styles
const customChatStyles = {
  fab: {
    background: 'linear-gradient(135deg, #your-color1, #your-color2)',
    // ... other styles
  }
};
```

## 🔌 API Integration

### Real API Implementation

```tsx
// services/chatBotService.ts
static async callChatAPI(messages: ChatMessage[]): Promise<StreamResponse> {
  const response = await fetch('/api/v1/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      messages,
      stream: true,
      model: 'gpt-4',
      temperature: 0.7
    })
  });

  // Handle streaming response
  const reader = response.body?.getReader();
  // ... streaming logic
}
```

### Server-Sent Events

```tsx
// Real-time streaming với SSE
const eventSource = new EventSource('/api/v1/chat/stream');
eventSource.onmessage = (event) => {
  const chunk = JSON.parse(event.data);
  onChunk(chunk.content);
};
```

## 🎯 Fitness-Specific Features

### Smart Context Recognition

```tsx
// Tự động nhận dạng context
if (input.includes('tập luyện')) {
  return workoutAdvice;
}
if (input.includes('dinh dưỡng')) {
  return nutritionAdvice;
}
```

### Quick Actions cho Fitness

- 💪 Lập kế hoạch tập luyện
- 🥗 Tư vấn dinh dưỡng  
- 🏃‍♂️ Hướng dẫn động tác
- 🔥 Động lực tập luyện
- 🛡️ Phòng chống chấn thương
- ⚖️ Giảm cân hiệu quả

## 📱 Mobile Optimization

```tsx
// Responsive design
width: { xs: 'calc(100vw - 32px)', sm: 400 },
height: { xs: 'calc(100vh - 120px)', sm: 600 },

// Touch-friendly interface
const chatbotStyles = {
  // Mobile-optimized styles
  inputContainer: {
    // Touch-friendly input area
  }
};
```

## 🚀 Performance Optimizations

- **Lazy Loading**: Component chỉ render khi cần
- **Message Pagination**: Limit messages để tránh lag
- **Debounced Input**: Prevent spam requests
- **Memory Management**: Clear old messages tự động

## 🧪 Testing

```tsx
// Test chatbot functionality
describe('ChatBot Component', () => {
  test('should render floating button', () => {
    render(<ChatBot />);
    expect(screen.getByLabelText('open chatbot')).toBeInTheDocument();
  });

  test('should handle message sending', async () => {
    // Test message flow
  });
});
```

## 🔮 Future Enhancements

- 🧠 **AI Integration**: OpenAI GPT-4 integration
- 🎙️ **Voice Chat**: Speech-to-text và text-to-speech
- 📊 **Analytics**: User interaction tracking
- 🔗 **Workout Integration**: Direct workout creation
- 🎨 **Themes**: Multiple chat themes
- 🌐 **Multi-language**: International support

## 📚 Dependencies

```json
{
  "@mui/material": "^5.15.0",
  "@mui/icons-material": "^5.15.0",
  "react": "^19.0.0",
  "typescript": "^5.0.0"
}
```

## 🤝 Contributing

1. Follow React 19 patterns
2. Maintain TypeScript strict mode
3. Add proper error handling
4. Include responsive design
5. Test thoroughly on mobile

---

**💡 Tip**: Component được thiết kế để dễ dàng integrate với real AI APIs. Chỉ cần thay đổi `ChatBotService.sendMessage()` method để connect với backend thực tế.
