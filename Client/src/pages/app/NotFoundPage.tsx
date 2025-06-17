import {
    ArrowBack,
    FitnessCenter,
    Home,
    SearchOff,
    TipsAndUpdates,
    Explore
} from '@mui/icons-material';
import {
    Box,
    Button,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * Enhanced 404 page following the new design patterns from design-instructions.md
 * Uses color-coded cards system and modern gradient backgrounds
 */
export default function NotFoundPage() {
    const navigate = useNavigate();

    // Handle back button click
    const handleGoBack = () => {
        navigate(-1);
    };

    // Handle home navigation
    const handleGoHome = () => {
        navigate('/');
    };

    // Handle going to workouts
    const handleGoToWorkouts = () => {
        navigate('/workouts');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                py: 4,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '1200px',
                    mx: 'auto',
                    px: { xs: 2, sm: 3, md: 4 }
                }}
            >
                {/* Header Section */}
                {/* <Box
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        p: { xs: 3, md: 4 },
                        borderRadius: 2,
                        textAlign: 'center',
                        mb: 4,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                        <SearchOff sx={{ fontSize: { xs: 28, md: 32 } }} />
                        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                            Trang không tìm thấy
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ opacity: 0.9, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                        Hành trình fitness của bạn gặp một chút trở ngại
                    </Typography>
                </Box> */}

                {/* Content Grid */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' },
                        gap: 4,
                        alignItems: 'start'
                    }}
                >
                    {/* Left Side - 404 Illustration (Orange Theme) */}
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                            border: '1px solid rgba(255, 152, 0, 0.2)',
                            borderRadius: 3,
                            p: { xs: 3, md: 4 },
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(255, 152, 0, 0.08)',
                            minHeight: { xs: 'auto', lg: '400px' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Background Pattern */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                opacity: 0.05,
                                transform: 'rotate(15deg)',
                                color: '#ff9800'
                            }}
                        >
                            <SearchOff sx={{ fontSize: 120 }} />
                        </Box>

                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '4rem', md: '6rem', lg: '8rem' },
                                fontWeight: 'bold',
                                color: '#f57f17',
                                lineHeight: 1,
                                mb: 2
                            }}
                        >
                            404
                        </Typography>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                p: 2,
                                borderRadius: '50%',
                                bgcolor: 'rgba(255, 152, 0, 0.1)',
                                color: '#ef6c00',
                                mb: 2
                            }}
                        >
                            <SearchOff sx={{ fontSize: { xs: 32, md: 40 } }} />
                        </Box>
                        <Typography variant="h6" color="#ef6c00" fontWeight="600">
                            Trang không tồn tại
                        </Typography>
                    </Box>

                    {/* Right Side - Content and Actions */}
                    <Box>
                        <Typography
                            variant="h3"
                            component="h2"
                            gutterBottom
                            fontWeight="bold"
                            color="white"
                            sx={{
                                fontSize: { xs: '1.8rem', md: '2.5rem' },
                                mb: 3
                            }}
                        >
                            Hành trình fitness bị gián đoạn
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                mb: 4,
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                lineHeight: 1.6,
                                color: 'rgba(255, 255, 255, 0.9)'
                            }}
                        >
                            Có vẻ như bạn đã đi lạc trong hành trình fitness của mình.
                            Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang vị trí khác.
                        </Typography>

                        {/* Suggestions Box (Blue Theme) */}
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                                border: '1px solid rgba(33, 150, 243, 0.2)',
                                borderRadius: 3,
                                p: { xs: 3, md: 4 },
                                mb: 4,
                                boxShadow: '0 4px 20px rgba(33, 150, 243, 0.08)'
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={3}>
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        p: 1.5,
                                        borderRadius: '50%',
                                        bgcolor: '#2196f3',
                                        color: 'white',
                                        mr: 2
                                    }}
                                >
                                    <TipsAndUpdates sx={{ fontSize: 24 }} />
                                </Box>
                                <Typography variant="h6" fontWeight="600" color="#1976d2">
                                    Gợi ý cho bạn
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                    gap: 2,
                                    '& .suggestion-item': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: 'rgba(33, 150, 243, 0.05)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(33, 150, 243, 0.1)',
                                            transform: 'translateY(-1px)'
                                        }
                                    }
                                }}
                            >
                                <Box className="suggestion-item">
                                    <SearchOff sx={{ fontSize: 20, color: '#1976d2' }} />
                                    <Typography variant="body2" color="#1565c0" fontWeight="500">
                                        Kiểm tra URL
                                    </Typography>
                                </Box>
                                <Box className="suggestion-item">
                                    <ArrowBack sx={{ fontSize: 20, color: '#1976d2' }} />
                                    <Typography variant="body2" color="#1565c0" fontWeight="500">
                                        Quay lại trang trước
                                    </Typography>
                                </Box>
                                <Box className="suggestion-item">
                                    <Home sx={{ fontSize: 20, color: '#1976d2' }} />
                                    <Typography variant="body2" color="#1565c0" fontWeight="500">
                                        Trở về trang chủ
                                    </Typography>
                                </Box>
                                <Box className="suggestion-item">
                                    <Explore sx={{ fontSize: 20, color: '#1976d2' }} />
                                    <Typography variant="body2" color="#1565c0" fontWeight="500">
                                        Khám phá nội dung
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                                gap: 2
                            }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                onClick={handleGoBack}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'white',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: 3,
                                    }
                                }}
                            >
                                Quay lại
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Home />}
                                onClick={handleGoHome}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                                    boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 25px rgba(76, 175, 80, 0.4)',
                                    }
                                }}
                            >
                                Trang chủ
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<FitnessCenter />}
                                onClick={handleGoToWorkouts}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'white',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: 3,
                                    }
                                }}
                            >                                Workout
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
