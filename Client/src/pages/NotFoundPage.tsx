// React is imported automatically in newer versions
import {
    ArrowBack,
    FitnessCenter,
    Home,
    SentimentDissatisfied
} from '@mui/icons-material';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
    useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * Enhanced 404 page with helpful navigation options and better UI
 */
export default function NotFoundPage() {
    const navigate = useNavigate();
    const theme = useTheme();

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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 5,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background pattern */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '150px',
                        height: '150px',
                        opacity: 0.05,
                        transform: 'rotate(45deg) translate(30px, -50px)',
                        '& > svg': {
                            fontSize: 180,
                        },
                    }}
                >
                    <FitnessCenter fontSize="inherit" />
                </Box>

                <Grid container spacing={4} alignItems="center">
                    {/* Left side - Illustration */}
                    <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
                        <SentimentDissatisfied sx={{
                            fontSize: 100,
                            color: theme.palette.error.main, // Changed color for better semantics
                            mb: 0 // Icon directly above the 404 text
                        }} />
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: '8rem', // Made 404 text larger
                                fontWeight: 'bold',
                                color: theme.palette.primary.main,
                                lineHeight: 1, // Adjust line height for large font
                                mt: 1 // Add some top margin if needed
                            }}
                        >
                            404
                        </Typography>
                    </Grid>

                    {/* Right side - Content */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                            Trang không tìm thấy
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
                            Có vẻ như bạn đã đi lạc trong hành trình fitness của mình.
                            Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
                                Bạn có thể thử:
                            </Typography>
                            <Typography component="ul" sx={{ pl: 2 }}>
                                <li>Kiểm tra lại đường dẫn URL</li>
                                <li>Quay lại trang trước đó</li>
                                <li>Trở về trang chủ</li>
                                <li>Khám phá các bài tập workout</li>
                            </Typography>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<ArrowBack />}
                                    onClick={handleGoBack}
                                >
                                    Quay lại
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Home />}
                                    onClick={handleGoHome}
                                >
                                    Trang chủ
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<FitnessCenter />}
                                    onClick={handleGoToWorkouts}
                                >
                                    Workout
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
