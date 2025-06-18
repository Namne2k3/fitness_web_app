import React, { useState } from 'react';
import {
    IconButton,
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    Collapse,
    Box,
    Divider,
    ListItemButton,
    Typography,
    Stack
} from '@mui/material';
import {
    Menu as MenuIcon,
    FitnessCenter,
    MenuBook,
    Restaurant,
    Star,
    Money,
    Group,
    ShoppingCart,
    SportsGymnastics,
    LocalCafe,
    RateReview,
    Storefront,
    Videocam,
    Person,
    BarChart,
    EmojiEvents,
    ExpandLess,
    ExpandMore,
    Home,
    Close,
    DirectionsRun,
    AddCircleOutline,
    Favorite,
    FitnessCenterOutlined,
    Inventory,
    ShoppingBasket
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

/**
 * Mobile navigation menu component with drawer
 * ✅ Updated với labels tiếng Việt đồng bộ với desktop
 */
const MobileNavMenu: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    // State for collapsible sections
    const [workoutsOpen, setWorkoutsOpen] = useState(false);
    const [exercisesOpen, setExercisesOpen] = useState(false);
    const [nutritionOpen, setNutritionOpen] = useState(false);
    const [reviewsOpen, setReviewsOpen] = useState(false);
    const [sponsoredOpen, setSponsoredOpen] = useState(false);
    const [communityOpen, setCommunityOpen] = useState(false);
    const [marketplaceOpen, setMarketplaceOpen] = useState(false);

    const toggleDrawer = (isOpen: boolean) => () => {
        setOpen(isOpen);
    };

    const handleNavigate = (path: string) => {
        setOpen(false);
        navigate(path);
    };

    // Toggle handlers for collapsible sections
    const toggleWorkouts = () => setWorkoutsOpen(!workoutsOpen);
    const toggleExercises = () => setExercisesOpen(!exercisesOpen);
    const toggleNutrition = () => setNutritionOpen(!nutritionOpen);
    const toggleReviews = () => setReviewsOpen(!reviewsOpen);
    const toggleSponsored = () => setSponsoredOpen(!sponsoredOpen);
    const toggleCommunity = () => setCommunityOpen(!communityOpen);
    const toggleMarketplace = () => setMarketplaceOpen(!marketplaceOpen);

    return (
        <>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>
            </Box>

            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer(false)}
                sx={{
                    zIndex: 1400,
                    '& .MuiDrawer-paper': {
                        width: 280,
                        backgroundColor: 'background.paper',
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                    },
                }}
            >
                <Box
                    sx={{
                        width: 280,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                    role="presentation"
                >
                    {/* Header với Logo */}
                    <Box
                        sx={{
                            p: 3,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                            onClick={() => {
                                setOpen(false);
                                navigate('/');
                            }}
                            sx={{
                                cursor: 'pointer',
                                flex: 1
                            }}
                        >
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: 2,
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <FitnessCenter sx={{ fontSize: '1.5rem' }} />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '1.25rem'
                                }}
                            >
                                TrackMe
                            </Typography>
                        </Stack>

                        <IconButton
                            onClick={toggleDrawer(false)}
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                }
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>

                    <List sx={{ flex: 1, overflow: 'auto' }}>
                        {/* Trang chủ */}
                        <ListItemButton onClick={() => handleNavigate('/')}>
                            <ListItemIcon><Home /></ListItemIcon>
                            <ListItemText primary="Trang chủ" />
                        </ListItemButton>

                        <Divider />

                        {/* ✅ Bài tập Section - Updated */}
                        <ListItemButton onClick={toggleWorkouts}>
                            <ListItemIcon><FitnessCenter /></ListItemIcon>
                            <ListItemText primary="Bài tập" />
                            {workoutsOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={workoutsOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/workouts/browse')}>
                                    <ListItemIcon><MenuBook /></ListItemIcon>
                                    <ListItemText primary="Khám phá bài tập" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/workouts/my-workouts')}>
                                    <ListItemIcon><DirectionsRun /></ListItemIcon>
                                    <ListItemText primary="Bài tập của tôi" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/workouts/create')}>
                                    <ListItemIcon><AddCircleOutline /></ListItemIcon>
                                    <ListItemText primary="Tạo bài tập" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/workouts/progress')}>
                                    <ListItemIcon><BarChart /></ListItemIcon>
                                    <ListItemText primary="Theo dõi tiến độ" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* ✅ Động tác Section - Updated */}
                        <ListItemButton onClick={toggleExercises}>
                            <ListItemIcon><SportsGymnastics /></ListItemIcon>
                            <ListItemText primary="Động tác" />
                            {exercisesOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={exercisesOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/exercises/library')}>
                                    <ListItemIcon><MenuBook /></ListItemIcon>
                                    <ListItemText primary="Thư viện động tác" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/exercises/videos')}>
                                    <ListItemIcon><Videocam /></ListItemIcon>
                                    <ListItemText primary="Video hướng dẫn" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/exercises/favorites')}>
                                    <ListItemIcon><Favorite /></ListItemIcon>
                                    <ListItemText primary="Yêu thích" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* ✅ Dinh dưỡng Section - Updated */}
                        <ListItemButton onClick={toggleNutrition}>
                            <ListItemIcon><Restaurant /></ListItemIcon>
                            <ListItemText primary="Dinh dưỡng" />
                            {nutritionOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={nutritionOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/nutrition/guides')}>
                                    <ListItemIcon><MenuBook /></ListItemIcon>
                                    <ListItemText primary="Hướng dẫn dinh dưỡng" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/nutrition/supplements')}>
                                    <ListItemIcon><LocalCafe /></ListItemIcon>
                                    <ListItemText primary="Thực phẩm bổ sung" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/nutrition/meal-plans')}>
                                    <ListItemIcon><Restaurant /></ListItemIcon>
                                    <ListItemText primary="Kế hoạch ăn uống" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* ✅ Đánh giá Section - Updated */}
                        <ListItemButton onClick={toggleReviews}>
                            <ListItemIcon><Star /></ListItemIcon>
                            <ListItemText primary="Đánh giá" />
                            {reviewsOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={reviewsOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/reviews/gyms')}>
                                    <ListItemIcon><FitnessCenterOutlined /></ListItemIcon>
                                    <ListItemText primary="Đánh giá phòng gym" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/reviews/equipment')}>
                                    <ListItemIcon><Inventory /></ListItemIcon>
                                    <ListItemText primary="Đánh giá thiết bị" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/reviews/supplements')}>
                                    <ListItemIcon><LocalCafe /></ListItemIcon>
                                    <ListItemText primary="Đánh giá thực phẩm bổ sung" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/reviews/trainers')}>
                                    <ListItemIcon><Person /></ListItemIcon>
                                    <ListItemText primary="Đánh giá huấn luyện viên" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/reviews/write')}>
                                    <ListItemIcon><RateReview /></ListItemIcon>
                                    <ListItemText primary="Viết đánh giá" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* ✅ Nội dung tài trợ Section - Updated */}
                        <ListItemButton onClick={toggleSponsored}>
                            <ListItemIcon><Money /></ListItemIcon>
                            <ListItemText primary="Nội dung tài trợ" />
                            {sponsoredOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={sponsoredOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/sponsored/featured')}>
                                    <ListItemIcon><Star /></ListItemIcon>
                                    <ListItemText primary="Nội dung nổi bật" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/sponsored/promotions')}>
                                    <ListItemIcon><Money /></ListItemIcon>
                                    <ListItemText primary="Ưu đãi đặc biệt" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/sponsored/guides')}>
                                    <ListItemIcon><MenuBook /></ListItemIcon>
                                    <ListItemText primary="Hướng dẫn tài trợ" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/sponsored/partners')}>
                                    <ListItemIcon><Storefront /></ListItemIcon>
                                    <ListItemText primary="Đối tác của chúng tôi" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* ✅ Cộng đồng Section - Updated */}
                        <ListItemButton onClick={toggleCommunity}>
                            <ListItemIcon><Group /></ListItemIcon>
                            <ListItemText primary="Cộng đồng" />
                            {communityOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={communityOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/community/forum')}>
                                    <ListItemIcon><Group /></ListItemIcon>
                                    <ListItemText primary="Diễn đàn" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/community/challenges')}>
                                    <ListItemIcon><EmojiEvents /></ListItemIcon>
                                    <ListItemText primary="Thử thách" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/community/leaderboard')}>
                                    <ListItemIcon><BarChart /></ListItemIcon>
                                    <ListItemText primary="Bảng xếp hạng" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* ✅ Chợ fitness Section - Updated */}
                        <ListItemButton onClick={toggleMarketplace}>
                            <ListItemIcon><ShoppingCart /></ListItemIcon>
                            <ListItemText primary="Chợ fitness" />
                            {marketplaceOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={marketplaceOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/marketplace/trainers')}>
                                    <ListItemIcon><Person /></ListItemIcon>
                                    <ListItemText primary="Tìm huấn luyện viên" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/marketplace/equipment')}>
                                    <ListItemIcon><ShoppingBasket /></ListItemIcon>
                                    <ListItemText primary="Cửa hàng thiết bị" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/marketplace/supplements')}>
                                    <ListItemIcon><LocalCafe /></ListItemIcon>
                                    <ListItemText primary="Thực phẩm bổ sung" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/marketplace/deals')}>
                                    <ListItemIcon><Money /></ListItemIcon>
                                    <ListItemText primary="Ưu đãi đặc biệt" />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </List>

                    {/* Footer */}
                    <Box
                        sx={{
                            mt: 'auto',
                            p: 2,
                            borderTop: `1px solid ${theme.palette.divider}`,
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.75rem' }}
                        >
                            TrackMe © 2025
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.75rem' }}
                        >
                            Cộng đồng fitness #1 Việt Nam
                        </Typography>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default MobileNavMenu;
