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
    Money,
    Person,
    RateReview,
    Restaurant,
    ShoppingBasket,
    ShoppingCart,
    SportsGymnastics,
    Star,
    Storefront,
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
    path?: string; // Default path khi click vào main menu
    subItems: (NavSubItem | 'divider')[];
};

// ✅ Updated Navigation Menu với tiếng Việt và default paths
const NAV_MENUS: NavMenu[] = [
    {
        key: 'home',
        icon: <Home />,
        label: 'Trang chủ',
        path: '/',
        subItems: []
    },
    {
        key: 'workouts',
        icon: <FitnessCenter />,
        label: 'Bài tập',
        path: '/workouts',
        subItems: [
            { icon: <MenuBook fontSize="small" />, label: 'Khám phá bài tập', path: '/workouts' },
            { icon: <DirectionsRun fontSize="small" />, label: 'Bài tập của tôi', path: '/my-workouts' },
            { icon: <AddCircleOutline fontSize="small" />, label: 'Tạo bài tập', path: '/workouts/create' },
            'divider',
            { icon: <BarChart fontSize="small" />, label: 'Theo dõi tiến độ', path: '/workouts/progress' },
        ]
    },
    {
        key: 'library', // ✅ NEW: Thay thế "exercises"
        icon: <MenuBook />,
        label: 'Thư viện',
        path: '/library/exercises',
        subItems: [
            { icon: <SportsGymnastics fontSize="small" />, label: 'Tất cả động tác', path: '/library/exercises' },
            // { icon: <FitnessCenter fontSize="small" />, label: 'Theo nhóm cơ', path: '/library/muscle-groups' },
            // { icon: <Inventory fontSize="small" />, label: 'Theo thiết bị', path: '/library/equipment' },
            // { icon: <BarChart fontSize="small" />, label: 'Theo độ khó', path: '/library/difficulty' },
            'divider',
            { icon: <Videocam fontSize="small" />, label: 'Video hướng dẫn', path: '/library/videos' },
            { icon: <Favorite fontSize="small" />, label: 'Yêu thích', path: '/library/favorites' },
        ]
    },
    {
        key: 'nutrition',
        icon: <Restaurant />,
        label: 'Dinh dưỡng',
        path: '/nutrition/guides',
        subItems: [
            { icon: <MenuBook fontSize="small" />, label: 'Hướng dẫn dinh dưỡng', path: '/nutrition/guides' },
            { icon: <LocalCafe fontSize="small" />, label: 'Thực phẩm bổ sung', path: '/nutrition/supplements' },
            { icon: <Restaurant fontSize="small" />, label: 'Kế hoạch ăn uống', path: '/nutrition/meal-plans' },
        ]
    },
    {
        key: 'reviews',
        icon: <Star />,
        label: 'Đánh giá',
        path: '/reviews/gyms', // Default to gym reviews
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
        key: 'sponsored',
        icon: <Money />,
        label: 'Nội dung tài trợ',
        path: '/sponsored/featured', // Default to featured content
        subItems: [
            { icon: <Star fontSize="small" />, label: 'Nội dung nổi bật', path: '/sponsored/featured' },
            { icon: <Money fontSize="small" />, label: 'Ưu đãi đặc biệt', path: '/sponsored/promotions' },
            { icon: <MenuBook fontSize="small" />, label: 'Hướng dẫn tài trợ', path: '/sponsored/guides' },
            { icon: <Storefront fontSize="small" />, label: 'Đối tác của chúng tôi', path: '/sponsored/partners' },
        ]
    },
    {
        key: 'community',
        icon: <Group />,
        label: 'Cộng đồng',
        path: '/community/forum', // Default to forum
        subItems: [
            { icon: <Group fontSize="small" />, label: 'Diễn đàn', path: '/community/forum' },
            { icon: <EmojiEvents fontSize="small" />, label: 'Thử thách', path: '/community/challenges' },
            { icon: <BarChart fontSize="small" />, label: 'Bảng xếp hạng', path: '/community/leaderboard' },
        ]
    },
    {
        key: 'marketplace',
        icon: <ShoppingCart />,
        label: 'Chợ fitness',
        path: '/marketplace/trainers', // Default to trainers
        subItems: [
            { icon: <Person fontSize="small" />, label: 'Tìm huấn luyện viên', path: '/marketplace/trainers' },
            { icon: <ShoppingBasket fontSize="small" />, label: 'Cửa hàng thiết bị', path: '/marketplace/equipment' },
            { icon: <LocalCafe fontSize="small" />, label: 'Thực phẩm bổ sung', path: '/marketplace/supplements' },
            { icon: <Money fontSize="small" />, label: 'Ưu đãi đặc biệt', path: '/marketplace/deals' },
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

    // ✅ NEW: Handle main menu click
    const handleMainMenuClick = (menu: NavMenu) => {
        if (menu.subItems.length === 0) {
            // No submenu - navigate directly
            handleNavigate(menu.path || '/');
        } else {
            // Has submenu - check if already open
            if (openMenu === menu.key) {
                // If open, navigate to default path
                handleNavigate(menu.path || '/');
            } else {
                // If closed, open the menu
                handleMenuOpen(menu.key);
            }
        }
    };

    return (
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
                        onClick={() => handleMainMenuClick(menu)}
                    >
                        {menu.icon}
                    </Button>

                    {/* Submenu Popper */}
                    {menu.subItems.length > 0 && (
                        <Popper
                            open={openMenu === menu.key}
                            anchorEl={anchorRefs.current[menu.key]}
                            placement="bottom-start"
                            transition
                            disablePortal={false}
                            style={{ zIndex: 1400 }}
                            onMouseEnter={() => handleMenuOpen(menu.key)}
                            onMouseLeave={handleMenuClose}
                        >
                            {({ TransitionProps }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: 'top left' }}
                                    timeout={300}
                                >
                                    <Paper
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
