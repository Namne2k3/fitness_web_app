/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    AddCircleOutline,
    BarChart,
    DirectionsRun,
    EmojiEvents,
    Favorite,
    FitnessCenter,
    FitnessCenterOutlined,
    Group,
    Home,
    Inventory,
    LocalCafe,
    MenuBook,
    Person,
    RateReview,
    Restaurant,
    ShoppingBasket,
    ShoppingCart,
    SportsGymnastics,
    Star,
    Videocam
} from '@mui/icons-material';
import {
    Box,
    Button,
    ClickAwayListener,
    Divider,
    Grow,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Typography
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
            { icon: <MenuBook fontSize="small" />, label: 'Khám phá Workouts', path: '/workouts/browse' },
            { icon: <DirectionsRun fontSize="small" />, label: 'Workouts của tôi', path: '/workouts/my-workouts' },
            { icon: <AddCircleOutline fontSize="small" />, label: 'Tạo Workout', path: '/workouts/create' },
            'divider',
            { icon: <BarChart fontSize="small" />, label: 'Theo dõi tiến độ', path: '/workouts/progress' },
        ]
    },
    {
        key: 'exercises',
        icon: <SportsGymnastics />, label: 'Exercises',
        subItems: [
            { icon: <MenuBook fontSize="small" />, label: 'Thư viện bài tập', path: '/exercises/library' },
            { icon: <Videocam fontSize="small" />, label: 'Hướng dẫn video', path: '/exercises/videos' },
            'divider',
            { icon: <Favorite fontSize="small" />, label: 'Yêu thích của tôi', path: '/exercises/favorites' },
        ]
    },
    {
        key: 'nutrition',
        icon: <Restaurant />, label: 'Nutrition',
        subItems: [
            { icon: <MenuBook fontSize="small" />, label: 'Hướng dẫn dinh dưỡng', path: '/nutrition/guides' },
            { icon: <LocalCafe fontSize="small" />, label: 'Thực phẩm bổ sung', path: '/nutrition/supplements' },
            { icon: <Restaurant fontSize="small" />, label: 'Kế hoạch ăn uống', path: '/nutrition/meal-plans' },
        ]
    },
    {
        key: 'reviews',
        icon: <Star />, label: 'Reviews',
        subItems: [
            { icon: <FitnessCenterOutlined fontSize="small" />, label: 'Đánh giá phòng gym', path: '/reviews/gyms' },
            { icon: <Inventory fontSize="small" />, label: 'Đánh giá thiết bị', path: '/reviews/equipment' },
            { icon: <LocalCafe fontSize="small" />, label: 'Đánh giá thực phẩm bổ sung', path: '/reviews/supplements' },
            { icon: <Person fontSize="small" />, label: 'Đánh giá huấn luyện viên', path: '/reviews/trainers' },
            'divider',
            { icon: <RateReview fontSize="small" />, label: 'Viết đánh giá', path: '/reviews/write' },
        ]
    },
    {
        key: 'community',
        icon: <Group />, label: 'Community',
        subItems: [
            { icon: <Group fontSize="small" />, label: 'Diễn đàn', path: '/community/forum' },
            { icon: <EmojiEvents fontSize="small" />, label: 'Thử thách', path: '/community/challenges' },
            { icon: <BarChart fontSize="small" />, label: 'Bảng xếp hạng', path: '/community/leaderboard' },
        ]
    },
    {
        key: 'marketplace',
        icon: <ShoppingCart />, label: 'Marketplace',
        subItems: [
            { icon: <Person fontSize="small" />, label: 'Tìm huấn luyện viên', path: '/marketplace/trainers' },
            { icon: <ShoppingBasket fontSize="small" />, label: 'Cửa hàng thiết bị', path: '/marketplace/equipment' },
            { icon: <LocalCafe fontSize="small" />, label: 'Thực phẩm bổ sung', path: '/marketplace/supplements' },
            { icon: <BarChart fontSize="small" />, label: 'Ưu đãi đặc biệt', path: '/marketplace/deals' },
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
    }; return (
        <Box sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5
        }}>
            {NAV_MENUS.map(menu => (
                <Box
                    key={menu.key}
                    sx={{
                        position: 'relative',
                        borderRadius: 2,
                    }}
                    onMouseEnter={() => menu.subItems.length > 0 ? handleMenuOpen(menu.key) : null}
                    onMouseLeave={handleMenuClose}
                >
                    <Button
                        ref={ref => { anchorRefs.current[menu.key] = ref; }}
                        color="inherit"
                        aria-haspopup={menu.subItems.length > 0}
                        aria-controls={`${menu.key}-menu`}
                        sx={{
                            minWidth: 'auto',
                            width: 48,
                            height: 48,
                            p: 1,
                            color: 'text.primary',
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            backgroundColor: openMenu === menu.key ||
                                (menu.key === 'home' ? location.pathname === '/' : location.pathname.startsWith(`/${menu.key}`))
                                ? 'rgba(103, 126, 234, 0.15)' : 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(103, 126, 234, 0.1)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(103, 126, 234, 0.2)',
                            },
                        }}
                        onClick={() => {
                            if (menu.subItems.length === 0) {
                                // Nếu không có subItems, navigate trực tiếp
                                if (menu.key === 'home') {
                                    handleNavigate('/');
                                }
                            } else {
                                // Nếu có subItems, toggle menu
                                if (openMenu === menu.key) {
                                    handleMenuClose();
                                } else {
                                    handleMenuOpen(menu.key);
                                }
                            }
                        }}
                    >
                        {menu.icon}
                    </Button>
                    {menu.subItems.length > 0 && (
                        <Popper
                            open={openMenu === menu.key}
                            anchorEl={anchorRefs.current[menu.key]}
                            placement="bottom-start"
                            transition
                            disablePortal={false} // Changed to false to render in portal
                            style={{ zIndex: 1400 }} // Increased z-index
                            onMouseEnter={() => handleMenuOpen(menu.key)}
                            onMouseLeave={handleMenuClose}
                        >
                            {({ TransitionProps }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: 'top left' }}
                                    timeout={300}
                                >                                    <Paper
                                    sx={{
                                        mt: 1,
                                        minWidth: 280,
                                        maxWidth: 320,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        bgcolor: 'rgba(255, 255, 255, 0.98)',
                                        color: 'text.primary',
                                        backdropFilter: 'blur(20px)',
                                        // Dark mode support
                                        ...(theme => theme.palette.mode === 'dark' && {
                                            bgcolor: 'rgba(18, 18, 18, 0.98)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                        }),
                                    }}
                                >
                                        <ClickAwayListener onClickAway={handleMenuClose}>
                                            <MenuList
                                                autoFocusItem={openMenu === menu.key}
                                                sx={{ py: 1 }}
                                            >
                                                {/* Menu Header với label */}
                                                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {menu.icon}
                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                            {menu.label}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {menu.subItems.map((item, idx) =>
                                                    item === 'divider' ? (
                                                        <Divider key={idx} sx={{ my: 1 }} />
                                                    ) : (
                                                        <MenuItem
                                                            key={item.label}
                                                            onClick={() => handleNavigate(item.path)}
                                                            selected={location.pathname === item.path}
                                                            sx={{
                                                                py: 1.5,
                                                                px: 2,
                                                                mx: 1,
                                                                borderRadius: 1,
                                                                fontWeight: location.pathname === item.path ? 600 : 400,
                                                                fontSize: '0.875rem',
                                                                transition: 'all 0.2s ease',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(103, 126, 234, 0.08)',
                                                                    transform: 'translateX(4px)',
                                                                },
                                                                '&.Mui-selected': {
                                                                    backgroundColor: 'rgba(103, 126, 234, 0.12)',
                                                                    color: 'primary.main',
                                                                },
                                                            }}
                                                        >
                                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                                {item.icon}
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={item.label}
                                                                primaryTypographyProps={{
                                                                    fontWeight: 'inherit',
                                                                    fontSize: 'inherit',
                                                                }}
                                                            />
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
