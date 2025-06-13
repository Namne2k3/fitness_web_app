/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    Popper,
    Paper,
    MenuList,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Grow,
    ClickAwayListener
} from '@mui/material';
import {
    FitnessCenter,
    MenuBook,
    Restaurant,
    Star,
    Group,
    ShoppingCart,
    SportsGymnastics,
    LocalCafe,
    RateReview,
    Videocam,
    Person,
    BarChart,
    EmojiEvents,
    Home
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavSubItem {
    icon: React.ReactNode;
    label: string;
    path: string;
}

type NavMenu = {
    key: string;
    icon: React.ReactNode;
    label: string;
    path?: string; // Optional path for main menu items
    subItems: (NavSubItem | 'divider')[];
};

const NAV_MENUS: NavMenu[] = [
    {
        key: 'home',
        icon: <Home />, label: 'Trang chủ',
        subItems: []
    },
    {
        key: 'workouts',
        icon: <FitnessCenter />, label: 'Workouts',
        subItems: [
            { icon: <MenuBook fontSize="small" />, label: 'Browse Workouts', path: '/workouts/browse' },
            { icon: <FitnessCenter fontSize="small" />, label: 'My Workouts', path: '/workouts/my-workouts' },
            { icon: <SportsGymnastics fontSize="small" />, label: 'Create Workout', path: '/workouts/create' },
            'divider',
            { icon: <BarChart fontSize="small" />, label: 'Progress Tracking', path: '/workouts/progress' },
        ]
    },
    {
        key: 'exercises',
        icon: <SportsGymnastics />, label: 'Exercises',
        subItems: [
            { icon: <MenuBook fontSize="small" />, label: 'Exercise Library', path: '/exercises/library' },
            { icon: <Videocam fontSize="small" />, label: 'Video Tutorials', path: '/exercises/videos' },
            'divider',
            { icon: <Star fontSize="small" />, label: 'My Favorites', path: '/exercises/favorites' },
        ]
    },
    {
        key: 'nutrition',
        icon: <Restaurant />, label: 'Nutrition',
        subItems: [
            { icon: <MenuBook fontSize="small" />, label: 'Nutrition Guides', path: '/nutrition/guides' },
            { icon: <LocalCafe fontSize="small" />, label: 'Supplements', path: '/nutrition/supplements' },
            { icon: <Restaurant fontSize="small" />, label: 'Meal Plans', path: '/nutrition/meal-plans' },
        ]
    },
    {
        key: 'reviews',
        icon: <Star />, label: 'Reviews',
        subItems: [
            { icon: <FitnessCenter fontSize="small" />, label: 'Gym Reviews', path: '/reviews/gyms' },
            { icon: <SportsGymnastics fontSize="small" />, label: 'Equipment Reviews', path: '/reviews/equipment' },
            { icon: <LocalCafe fontSize="small" />, label: 'Supplement Reviews', path: '/reviews/supplements' },
            { icon: <Person fontSize="small" />, label: 'Trainer Reviews', path: '/reviews/trainers' },
            'divider',
            { icon: <RateReview fontSize="small" />, label: 'Write a Review', path: '/reviews/write' },
        ]
    },
    {
        key: 'community',
        icon: <Group />, label: 'Community',
        subItems: [
            { icon: <Group fontSize="small" />, label: 'Forums', path: '/community/forum' },
            { icon: <EmojiEvents fontSize="small" />, label: 'Challenges', path: '/community/challenges' },
            { icon: <BarChart fontSize="small" />, label: 'Leaderboard', path: '/community/leaderboard' },
        ]
    },
    {
        key: 'marketplace',
        icon: <ShoppingCart />, label: 'Marketplace',
        subItems: [
            { icon: <Person fontSize="small" />, label: 'Find a Trainer', path: '/marketplace/trainers' },
            { icon: <SportsGymnastics fontSize="small" />, label: 'Equipment Shop', path: '/marketplace/equipment' },
            { icon: <LocalCafe fontSize="small" />, label: 'Supplements', path: '/marketplace/supplements' },
            { icon: <BarChart fontSize="small" />, label: 'Special Deals', path: '/marketplace/deals' },
        ]
    },
];

const NavigationMenu: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const anchorRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    const handleMenuOpen = (key: string) => setOpenMenu(key);
    const handleMenuClose = () => setOpenMenu(null);

    const handleNavigate = (path: string) => {
        setOpenMenu(null);
        navigate(path);
    };

    return (
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', gap: 2.5 }}>
            {NAV_MENUS.map(menu => (
                <Box key={menu.key} sx={{ position: 'relative' }}>
                    <Button
                        ref={ref => { anchorRefs.current[menu.key] = ref; }}
                        color="inherit"
                        aria-haspopup="true"
                        aria-controls={`${menu.key}-menu`}
                        onMouseEnter={() => handleMenuOpen(menu.key)}
                        onMouseLeave={handleMenuClose}
                        sx={{
                            minWidth: 48,
                            px: 1.5,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: openMenu === menu.key || (menu.key === 'home' ? location.pathname === '/' : location.pathname.startsWith(`/${menu.key}`))
                                ? 'rgba(255,255,255,0.13)' : 'transparent',
                            transition: 'background 0.2s',
                            '& .menu-main-label': {
                                opacity: (openMenu === menu.key || (menu.key === 'home' ? location.pathname === '/' : location.pathname.startsWith(`/${menu.key}`))) ? 1 : 0,
                                maxWidth: (openMenu === menu.key || (menu.key === 'home' ? location.pathname === '/' : location.pathname.startsWith(`/${menu.key}`))) ? 200 : 0,
                                marginLeft: (openMenu === menu.key || (menu.key === 'home' ? location.pathname === '/' : location.pathname.startsWith(`/${menu.key}`))) ? 1 : 0,
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1), max-width 0.35s cubic-bezier(0.4,0,0.2,1), margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
                                color: 'white',
                                fontWeight: 500,
                            },
                            '&:hover .menu-main-label': {
                                opacity: 1,
                                maxWidth: 200,
                                marginLeft: 1,
                            },
                        }}
                        onClick={() => {
                            if (menu.subItems.length > 0) {
                                // Tìm subItem đầu tiên có path
                                const firstSubItem = menu.subItems.find(
                                    (item): item is NavSubItem => typeof item !== 'string' && !!item.path
                                );
                                if (firstSubItem) {
                                    handleNavigate(firstSubItem.path);
                                    return;
                                }
                            }
                            if (menu.key === 'home') {
                                handleNavigate('/');
                            }
                        }}
                    >
                        {menu.icon}
                        <span className="menu-main-label">{menu.label}</span>
                    </Button>
                    {menu.subItems.length > 0 && (
                        <Popper
                            open={openMenu === menu.key}
                            anchorEl={anchorRefs.current[menu.key]}
                            placement="bottom"
                            transition
                            disablePortal
                            style={{ zIndex: 1302 }}
                            onMouseEnter={() => handleMenuOpen(menu.key)}
                            onMouseLeave={handleMenuClose}
                        >
                            {({ TransitionProps }) => (
                                <Grow {...TransitionProps} style={{ transformOrigin: 'top center' }}>
                                    <Paper sx={{ mt: 1, minWidth: 210, boxShadow: 3, bgcolor: 'background.paper', color: 'text.primary' }}>
                                        <ClickAwayListener onClickAway={handleMenuClose}>
                                            <MenuList autoFocusItem={openMenu === menu.key}>
                                                {menu.subItems.map((item, idx) =>
                                                    item === 'divider' ? (
                                                        <Divider key={idx} sx={{ my: 0.5 }} />
                                                    ) : (
                                                        <MenuItem
                                                            key={item.label}
                                                            onClick={() => handleNavigate(item.path)}
                                                            selected={location.pathname === item.path}
                                                            sx={{
                                                                py: 1,
                                                                px: 2,
                                                                fontWeight: location.pathname === item.path ? 600 : 400,
                                                            }}
                                                        >
                                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                                            <ListItemText>{item.label}</ListItemText>
                                                        </MenuItem>
                                                    )
                                                )}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default NavigationMenu;
