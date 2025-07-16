/**
 * 🤖 ChatBot Component
 * AI Assistant floating chatbot with markdown response rendering
 * Sử dụng Material UI và React 19 patterns với Optimistic UI Updates
 */

import {
    SmartToy as BotIcon,
    Close as CloseIcon,
    Fullscreen as FullscreenIcon,
    Send as SendIcon,
    Person as UserIcon
} from '@mui/icons-material';
import {
    Avatar,
    Backdrop,
    Box,
    Card,
    CardHeader,
    Chip,
    CircularProgress,
    Fab,
    IconButton,
    InputAdornment,
    Modal,
    Slide,
    TextField,
    Typography,
    Zoom
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import { ChatBotService } from '../../services/chatBotService';
import { DEFAULT_QUICK_ACTIONS } from '../../types/chatbot.interface';

// Import highlight.js styles
import 'highlight.js/styles/github.css';

// ================================
// 📝 Types & Interfaces
// ================================
interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
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
        display: 'flex',
        flexDirection: 'column',
    },
    fullscreenModal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
    },
    fullscreenWindow: {
        width: { xs: '95vw', sm: '80vw', md: '70vw' },
        height: { xs: '90vh', sm: '80vh' },
        maxWidth: 800,
        maxHeight: 700,
        borderRadius: 3,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(25,118,210,0.1)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
    },
    messageList: {
        flex: 1,
        minHeight: 0,
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
        position: 'relative',
        p: 2,
        background: 'white',
        borderTop: '1px solid rgba(0,0,0,0.1)',
    }
};

// ================================
// 💬 Message Component với Markdown Support
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
                {isUser ? (
                    // User messages - plain text
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {message.content}
                    </Typography>
                ) : (
                    // AI messages - render as markdown
                    <Box
                        sx={{
                            '& p': { margin: 0, lineHeight: 1.6 },
                            '& ul, & ol': { margin: '8px 0', paddingLeft: '20px' },
                            '& li': { margin: '4px 0' },
                            '& h1, & h2, & h3, & h4, & h5, & h6': {
                                margin: '12px 0 8px 0',
                                fontWeight: 600
                            },
                            '& pre': {
                                backgroundColor: '#f5f5f5',
                                padding: '12px',
                                borderRadius: '8px',
                                overflow: 'auto',
                                fontSize: '0.875rem'
                            },
                            '& code': {
                                backgroundColor: '#f5f5f5',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.875rem'
                            },
                            '& blockquote': {
                                borderLeft: '4px solid #ddd',
                                margin: '8px 0',
                                paddingLeft: '12px',
                                fontStyle: 'italic'
                            },
                            '& strong': { fontWeight: 600 },
                            '& em': { fontStyle: 'italic' },
                            fontSize: '0.875rem'
                        }}
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </Box>
                )}

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
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Chat state quản lý local
    const [chatState, setChatState] = useState<ChatState>({
        messages: [
            {
                id: 'welcome',
                content: 'Chào mừng bạn đến với **AI Fitness Assistant**! 🏋️‍♂️\n\nTôi sẵn sàng giúp bạn với:\n- Tư vấn bài tập phù hợp\n- Lập kế hoạch tập luyện\n- Hướng dẫn dinh dưỡng\n- Theo dõi tiến độ\n\nHãy hỏi tôi bất cứ điều gì về fitness nhé! 💪',
                role: 'assistant',
                timestamp: new Date(),
            }
        ],
        isLoading: false,
        error: null,
    });

    // State for loading status
    const [isPending, setIsPending] = useState(false);

    // Hàm gửi tin nhắn (thông thường, không dùng useActionState)
    const sendMessage = async (message: string) => {
        if (!message.trim()) return;
        setIsPending(true);
        try {
            const response = await ChatBotService.sendMessage(
                message.trim(),
                'default-conversation'
            );
            setChatState(prev => {
                const newMessages = [...prev.messages];
                // Tìm và thay thế loading message bằng response thực tế
                const loadingIndex = newMessages.findIndex(msg =>
                    msg.role === 'assistant' && msg.content === ''
                );
                if (loadingIndex !== -1) {
                    newMessages[loadingIndex] = {
                        id: `bot-${Date.now()}`,
                        content: response.reply,
                        role: 'assistant',
                        timestamp: new Date(),
                    };
                }
                const finalState = {
                    ...prev,
                    messages: newMessages,
                    isLoading: false,
                    error: null,
                };
                ChatBotService.saveChatToStorage(finalState.messages);
                return finalState;
            });
        } catch (error) {
            setChatState(prev => {
                const newMessages = [...prev.messages];
                const loadingIndex = newMessages.findIndex(msg =>
                    msg.role === 'assistant' && msg.content === ''
                );
                if (loadingIndex !== -1) {
                    newMessages[loadingIndex] = {
                        id: `bot-error-${Date.now()}`,
                        content: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi gửi tin nhắn',
                        role: 'assistant',
                        timestamp: new Date(),
                    };
                }
                return {
                    ...prev,
                    messages: newMessages,
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi gửi tin nhắn',
                };
            });
        } finally {
            setIsPending(false);
        }
    };

    // Handle form submit - Optimistic UI update (thông thường)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isPending) {
            // Thêm user message ngay lập tức (Optimistic Update)
            const userMessage: ChatMessage = {
                id: `user-${Date.now()}`,
                content: inputValue.trim(),
                role: 'user',
                timestamp: new Date(),
            };
            // Thêm loading message cho bot
            const loadingMessage: ChatMessage = {
                id: `bot-loading-${Date.now()}`,
                content: '', // Empty content sẽ hiển thị loading indicator
                role: 'assistant',
                timestamp: new Date(),
            };
            // Cập nhật state ngay lập tức
            setChatState(prev => ({
                ...prev,
                messages: [...prev.messages, userMessage, loadingMessage],
                isLoading: true,
                error: null,
            }));
            // Gửi message qua hàm thường
            sendMessage(inputValue);
            setInputValue('');
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const closeChat = () => {
        setIsOpen(false);
        setIsFullscreen(false);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Auto scroll to bottom when new messages added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatState.messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isFullscreen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isFullscreen]);

    // Render chat window content
    const renderChatContent = () => (
        <Card sx={isFullscreen ? chatbotStyles.fullscreenWindow : chatbotStyles.chatWindow}>
            {/* Header */}
            <CardHeader
                avatar={
                    <Box
                        component="img"
                        src="/trackmebot.png"
                        alt="TrackMe Bot"
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            boxShadow: '0 2px 8px rgba(25,118,210,0.15)',
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                        }}
                    />
                }
                title={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        TrackMe Bot
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
                        <IconButton onClick={toggleFullscreen} size="small">
                            <FullscreenIcon />
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
                {chatState.messages.map((message: ChatMessage) => (
                    message.content === '' ? (
                        // Loading indicator for empty bot messages
                        <Box
                            key={message.id}
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
                                {/* Only show loading spinner, no label */}
                            </Box>
                        </Box>
                    ) : (
                        <Message key={message.id} message={message} />
                    )
                ))}

                {/* Error message */}
                {chatState.error && (
                    <Chip
                        label={chatState.error}
                        color="error"
                        size="small"
                        sx={{ alignSelf: 'center', mt: 1 }}
                    />
                )}

                {/* End of messages for scroll anchor */}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box sx={chatbotStyles.inputContainer}>
                <form onSubmit={handleSubmit}>
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
                                }
                            },
                        }}
                        sx={{
                            '& .MuiInputBase-root': {
                                fontSize: '0.875rem',
                                minHeight: 'unset',
                            },
                            '& .MuiInputBase-multiline': {
                                padding: '8px 12px',
                            },
                            borderRadius: 3,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(25,118,210,0.3)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                            },
                        }}
                        multiline
                        maxRows={3}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
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
    );

    return (
        <>
            {/* Floating Action Button */}
            <Zoom in={!isOpen}>
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

            {/* Regular Chat Window */}
            <Slide direction="up" in={isOpen && !isFullscreen} mountOnEnter unmountOnExit>
                {renderChatContent()}
            </Slide>

            {/* Fullscreen Modal */}
            <Modal
                open={isFullscreen}
                onClose={() => setIsFullscreen(false)}
                sx={chatbotStyles.fullscreenModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
                }}
            >
                <Slide direction="up" in={isFullscreen} mountOnEnter unmountOnExit>
                    {renderChatContent()}
                </Slide>
            </Modal>
        </>
    );
}
