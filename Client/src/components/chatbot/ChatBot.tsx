/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/**
 * 🤖 ChatBot Component
 * AI Assistant floating chatbot with stream response handling
 * Sử dụng Material UI và React 19 patterns
 */

import {
    AutoAwesome as AIIcon,
    SmartToy as BotIcon,
    Close as CloseIcon,
    Minimize as MinimizeIcon,
    Send as SendIcon,
    Person as UserIcon
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Card,
    CardHeader,
    Chip,
    CircularProgress,
    Fab,
    IconButton,
    InputAdornment,
    Slide,
    TextField,
    Typography,
    Zoom
} from '@mui/material';
import { useActionState, useEffect, useRef, useState } from 'react';

import { ChatBotService } from '../../services/chatBotService';
import { DEFAULT_QUICK_ACTIONS } from '../../types/chatbot.interface';

// ================================
// 📝 Types & Interfaces
// ================================
interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    isStreaming?: boolean;
}

interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
}

// ================================
// 🎨 Component Styles
// ================================
const chatbotStyles = {
    fab: {
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        '&:hover': {
            background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
            transform: 'scale(1.1)',
        },
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 25px rgba(25,118,210,0.3)',
    },
    chatWindow: {
        position: 'fixed',
        bottom: 90,
        right: 24,
        width: { xs: 'calc(100vw - 32px)', sm: 400 },
        height: { xs: 'calc(100vh - 120px)', sm: 550 },
        zIndex: 999,
        borderRadius: 3,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(25,118,210,0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    },
    messageList: {
        height: 'calc(100% - 140px)',
        overflowY: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        '&::-webkit-scrollbar': {
            width: 6,
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: 10,
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: 10,
        },
    },
    userMessage: {
        alignSelf: 'flex-end',
        maxWidth: '80%',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        p: 2,
        borderRadius: '18px 18px 4px 18px',
        wordBreak: 'break-word',
    },
    botMessage: {
        alignSelf: 'flex-start',
        maxWidth: '80%',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        color: 'text.primary',
        p: 2,
        borderRadius: '18px 18px 18px 4px',
        wordBreak: 'break-word',
        border: '1px solid rgba(0,0,0,0.05)',
    },
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        background: 'white',
        borderTop: '1px solid rgba(0,0,0,0.1)',
    }
};

// ================================
// 💬 Message Component
// ================================
interface MessageProps {
    message: ChatMessage;
}

function Message({ message }: MessageProps) {
    const isUser = message.role === 'user';

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                flexDirection: isUser ? 'row-reverse' : 'row',
            }}
        >
            <Avatar
                sx={{
                    width: 32,
                    height: 32,
                    bgcolor: isUser ? 'primary.main' : 'grey.300',
                    fontSize: '1rem',
                }}
            >
                {isUser ? <UserIcon /> : <BotIcon />}
            </Avatar>

            <Box
                sx={isUser ? chatbotStyles.userMessage : chatbotStyles.botMessage}
            >
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {message.content}
                    {message.isStreaming && (
                        <Box
                            component="span"
                            sx={{
                                display: 'inline-block',
                                width: 2,
                                height: 16,
                                bgcolor: 'primary.main',
                                ml: 0.5,
                                animation: 'blink 1s infinite',
                                '@keyframes blink': {
                                    '0%, 50%': { opacity: 1 },
                                    '51%, 100%': { opacity: 0 },
                                },
                            }}
                        />
                    )}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        opacity: 0.7,
                        mt: 0.5,
                        display: 'block',
                        fontSize: '0.7rem',
                    }}
                >
                    {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Typography>
            </Box>
        </Box>
    );
}

// ================================
// 🤖 Main ChatBot Component
// ================================
export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // React 19: useActionState for chat handling
    const [chatState, sendMessageAction, isPending] = useActionState(
        async (prevState: ChatState, formData: FormData): Promise<ChatState> => {
            const message = formData.get('message') as string;

            if (!message.trim()) return prevState;

            const userMessage: ChatMessage = {
                id: `user-${Date.now()}`,
                content: message.trim(),
                role: 'user',
                timestamp: new Date(),
            };

            const newState: ChatState = {
                ...prevState,
                messages: [...prevState.messages, userMessage],
                isLoading: true,
                error: null,
            }; try {
                // Create streaming bot message
                const botMessage: ChatMessage = {
                    id: `bot-${Date.now()}`,
                    content: '',
                    role: 'assistant',
                    timestamp: new Date(),
                    isStreaming: true,
                };

                // Add initial bot message for streaming
                // (In real implementation, this would be handled by state updates)

                // Use ChatBotService for streaming response
                let streamedContent = '';
                const responses = ChatBotService.sendMessage(message);
                console.log(`🤖 Streaming response: ${responses}`);

                // Simulate streaming
                // for (const chunk of responses) {
                //     await new Promise(resolve => setTimeout(resolve, 100));
                //     streamedContent += chunk;

                //     // Update message content (this simulates real streaming)
                //     botMessage.content = streamedContent;
                // }

                // Final message
                const finalBotMessage = {
                    ...botMessage,
                    content: streamedContent,
                    isStreaming: false,
                };

                // Save to local storage
                const finalMessages = [...newState.messages, finalBotMessage];
                ChatBotService.saveChatToStorage(finalMessages);

                return {
                    messages: finalMessages,
                    isLoading: false,
                    error: null,
                };
            } catch (error) {
                return {
                    ...newState,
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Đã xảy ra lỗi',
                };
            }
        },
        {
            messages: [
                {
                    id: 'welcome',
                    content: 'Chào mừng bạn đến với AI Fitness Assistant! 🏋️‍♂️ Tôi sẵn sàng giúp bạn với mọi câu hỏi về tập luyện và sức khỏe.',
                    role: 'assistant',
                    timestamp: new Date(),
                }
            ],
            isLoading: false,
            error: null,
        }
    );

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatState.messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isMinimized]);

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (inputValue.trim() && !isPending) {
    //         const formData = new FormData();
    //         formData.append('message', inputValue);
    //         sendMessageAction(formData);
    //         setInputValue('');
    //     }
    // };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setIsMinimized(false);
    };

    const minimizeChat = () => {
        setIsMinimized(true);
    };

    const closeChat = () => {
        setIsOpen(false);
        setIsMinimized(false);
    };

    return (
        <>
            {/* Floating Action Button */}
            <Zoom in={!isOpen || isMinimized}>
                <Fab
                    onClick={toggleChat}
                    sx={chatbotStyles.fab}
                    aria-label="open chatbot"
                >
                    <Box
                        component="img"
                        src="/trackmebot.png"
                        alt="TrackMe Bot"
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                    />
                </Fab>
            </Zoom>

            {/* Chat Window */}
            <Slide direction="up" in={isOpen && !isMinimized} mountOnEnter unmountOnExit>
                <Card sx={chatbotStyles.chatWindow}>
                    {/* Header */}
                    <CardHeader
                        avatar={
                            <Avatar sx={{
                                bgcolor: 'primary.main',
                                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                            }}>
                                <AIIcon />
                            </Avatar>
                        }
                        title={
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                AI Fitness Assistant
                            </Typography>
                        }
                        subheader={
                            <Box display="flex" alignItems="center" gap={1}>
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'success.main',
                                    }}
                                />
                                <Typography variant="caption" color="success.main">
                                    Đang hoạt động
                                </Typography>
                            </Box>
                        }
                        action={
                            <Box>
                                <IconButton onClick={minimizeChat} size="small">
                                    <MinimizeIcon />
                                </IconButton>
                                <IconButton onClick={closeChat} size="small">
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        }
                        sx={{
                            bgcolor: 'white',
                            borderBottom: '1px solid rgba(0,0,0,0.1)',
                        }}
                    />

                    {/* Messages */}
                    <Box sx={chatbotStyles.messageList}>
                        {chatState.messages.map((message) => (
                            <Message key={message.id} message={message} />
                        ))}

                        {/* Loading indicator */}
                        {isPending && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    alignSelf: 'flex-start',
                                }}
                            >
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300' }}>
                                    <BotIcon />
                                </Avatar>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        p: 2,
                                        borderRadius: '18px 18px 18px 4px',
                                        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                                    }}
                                >
                                    <CircularProgress size={16} />
                                    <Typography variant="caption">
                                        AI đang suy nghĩ...
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Error message */}
                        {chatState.error && (
                            <Chip
                                label={chatState.error}
                                color="error"
                                size="small"
                                sx={{ alignSelf: 'center', mt: 1 }}
                            />
                        )}

                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input */}
                    <Box sx={chatbotStyles.inputContainer}>
                        <form action={sendMessageAction}>
                            <TextField
                                name='message'
                                ref={inputRef}
                                fullWidth
                                variant="outlined"
                                placeholder="Nhập tin nhắn của bạn..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={isPending}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                type="submit"
                                                disabled={!inputValue.trim() || isPending}
                                                sx={{
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    '&:hover': { bgcolor: 'primary.dark' },
                                                    '&:disabled': {
                                                        bgcolor: 'grey.300',
                                                        color: 'grey.500'
                                                    },
                                                }}
                                            >
                                                <SendIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: 3,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(25,118,210,0.3)',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                }}
                                multiline
                                maxRows={3}
                            // onKeyDown={(e) => {
                            //     if (e.key === 'Enter' && !e.shiftKey) {
                            //         e.preventDefault();
                            //         handleSubmit(e);
                            //     }
                            // }}
                            />
                        </form>

                        {/* Quick Actions */}
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                            {DEFAULT_QUICK_ACTIONS.slice(0, 4).map((action) => (
                                <Chip
                                    key={action.id}
                                    label={action.label}
                                    size="small"
                                    onClick={() => setInputValue(action.prompt)}
                                    sx={{
                                        fontSize: '0.7rem',
                                        '&:hover': { bgcolor: 'primary.light', color: 'white' }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Card>
            </Slide>
        </>
    );
}
