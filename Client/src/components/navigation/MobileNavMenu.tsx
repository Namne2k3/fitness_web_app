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
    ListItemButton
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
    Home
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Mobile navigation menu component with drawer
 */
const MobileNavMenu: React.FC = () => {
    const navigate = useNavigate();
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
            >
                <Box
                    sx={{ width: 280 }}
                    role="presentation"
                >
                    <List>
                        <ListItemButton onClick={() => handleNavigate('/')}>
                            <ListItemIcon><Home /></ListItemIcon>
                            <ListItemText primary="Trang chủ" />
                        </ListItemButton>

                        <Divider />

                        {/* Workouts Section */}
                        <ListItemButton onClick={toggleWorkouts}>
                            <ListItemIcon><FitnessCenter /></ListItemIcon>
                            <ListItemText primary="Workouts" />
                            {workoutsOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={workoutsOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/workouts/browse')}>
                                    <ListItemIcon><MenuBook /></ListItemIcon>
                                    <ListItemText primary="Browse Workouts" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/workouts/my-workouts')}>
                                    <ListItemIcon><FitnessCenter /></ListItemIcon>
                                    <ListItemText primary="My Workouts" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/workouts/create')}>
                                    <ListItemIcon><SportsGymnastics /></ListItemIcon>
                                    <ListItemText primary="Create Workout" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/workouts/progress')}>
                                    <ListItemIcon><BarChart /></ListItemIcon>
                                    <ListItemText primary="Progress Tracking" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* Exercises Section */}
                        <ListItemButton onClick={toggleExercises}>
                            <ListItemIcon><SportsGymnastics /></ListItemIcon>
                            <ListItemText primary="Exercises" />
                            {exercisesOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={exercisesOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/exercises/library')}>
                                    <ListItemIcon><MenuBook /></ListItemIcon>
                                    <ListItemText primary="Exercise Library" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/exercises/videos')}>
                                    <ListItemIcon><Videocam /></ListItemIcon>
                                    <ListItemText primary="Video Tutorials" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/exercises/favorites')}>
                                    <ListItemIcon><Star /></ListItemIcon>
                                    <ListItemText primary="My Favorites" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* Nutrition Section */}
                        <ListItemButton onClick={toggleNutrition}>
                            <ListItemIcon><Restaurant /></ListItemIcon>
                            <ListItemText primary="Nutrition" />
                            {nutritionOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={nutritionOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/nutrition/guides')}>
                                    <ListItemIcon><MenuBook /></ListItemIcon>
                                    <ListItemText primary="Nutrition Guides" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/nutrition/supplements')}>
                                    <ListItemIcon><LocalCafe /></ListItemIcon>
                                    <ListItemText primary="Supplements" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/nutrition/meal-plans')}>
                                    <ListItemIcon><Restaurant /></ListItemIcon>
                                    <ListItemText primary="Meal Plans" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* Reviews Section */}
                        <ListItemButton onClick={toggleReviews}>
                            <ListItemIcon><Star /></ListItemIcon>
                            <ListItemText primary="Reviews" />
                            {reviewsOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={reviewsOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/reviews/gyms')}>
                                    <ListItemIcon><FitnessCenter /></ListItemIcon>
                                    <ListItemText primary="Gym Reviews" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/reviews/equipment')}>
                                    <ListItemIcon><SportsGymnastics /></ListItemIcon>
                                    <ListItemText primary="Equipment Reviews" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/reviews/supplements')}>
                                    <ListItemIcon><LocalCafe /></ListItemIcon>
                                    <ListItemText primary="Supplement Reviews" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/reviews/trainers')}>
                                    <ListItemIcon><Person /></ListItemIcon>
                                    <ListItemText primary="Trainer Reviews" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/reviews/write')}>
                                    <ListItemIcon><RateReview /></ListItemIcon>
                                    <ListItemText primary="Write a Review" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* Sponsored Content Section */}
                        <ListItemButton onClick={toggleSponsored}>
                            <ListItemIcon><Money /></ListItemIcon>
                            <ListItemText primary="Sponsored" />
                            {sponsoredOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={sponsoredOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/sponsored/featured')}>
                                    <ListItemIcon><Star /></ListItemIcon>
                                    <ListItemText primary="Featured Content" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/sponsored/promotions')}>
                                    <ListItemIcon><Money /></ListItemIcon>
                                    <ListItemText primary="Special Promotions" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/sponsored/guides')}>
                                    <ListItemIcon><MenuBook /></ListItemIcon>
                                    <ListItemText primary="Sponsored Guides" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/sponsored/partners')}>
                                    <ListItemIcon><Storefront /></ListItemIcon>
                                    <ListItemText primary="Our Partners" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* Community Section */}
                        <ListItemButton onClick={toggleCommunity}>
                            <ListItemIcon><Group /></ListItemIcon>
                            <ListItemText primary="Community" />
                            {communityOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={communityOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/community/forum')}>
                                    <ListItemIcon><Group /></ListItemIcon>
                                    <ListItemText primary="Forums" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/community/challenges')}>
                                    <ListItemIcon><EmojiEvents /></ListItemIcon>
                                    <ListItemText primary="Challenges" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/community/leaderboard')}>
                                    <ListItemIcon><BarChart /></ListItemIcon>
                                    <ListItemText primary="Leaderboard" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* Marketplace Section */}
                        <ListItemButton onClick={toggleMarketplace}>
                            <ListItemIcon><ShoppingCart /></ListItemIcon>
                            <ListItemText primary="Marketplace" />
                            {marketplaceOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={marketplaceOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/marketplace/trainers')}>
                                    <ListItemIcon><Person /></ListItemIcon>
                                    <ListItemText primary="Find a Trainer" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/marketplace/equipment')}>
                                    <ListItemIcon><SportsGymnastics /></ListItemIcon>
                                    <ListItemText primary="Equipment Shop" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/marketplace/supplements')}>
                                    <ListItemIcon><LocalCafe /></ListItemIcon>
                                    <ListItemText primary="Supplements" />
                                </ListItemButton>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/marketplace/deals')}>
                                    <ListItemIcon><Money /></ListItemIcon>
                                    <ListItemText primary="Special Deals" />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default MobileNavMenu;
