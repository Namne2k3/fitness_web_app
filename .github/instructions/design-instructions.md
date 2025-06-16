# 🎨 Fitness Web App (TrackMe) - Design System & UI Guidelines

> **Design Philosophy**: Modern, clean, accessible fitness-focused interface dựa trên Material UI với React 19 patterns.

---

## 🎯 Design Principles

### 1. 💪 Fitness-First Design
- **Bold & Energetic**: Sử dụng gradients, vibrant colors để truyền cảm hứng
- **Progress-Oriented**: Visual progress indicators, achievement representations
- **Community-Focused**: Social elements, sharing features prominent
- **Goal-Driven**: Clear call-to-actions và measurable outcomes

### 2. 🌟 User Experience Principles
- **Mobile-First**: Responsive design cho mobile users (70% traffic)
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Fast loading, smooth interactions
- **Consistency**: Unified visual language across all screens

---

## 🎨 Color Palette & Theme

### Primary Colors
```typescript
const fitnessTheme = {
  palette: {
    primary: {
      main: '#1976d2',      // Energetic Blue
      light: '#42a5f5',     // Light Blue
      dark: '#1565c0',      // Dark Blue
      contrastText: '#fff'
    },
    secondary: {
      main: '#ff9800',      // Motivational Orange
      light: '#ffb74d',     // Light Orange
      dark: '#f57200',      // Dark Orange
      contrastText: '#000'
    }
  }
}
```

### Semantic Colors
- **Success**: `#4caf50` (Goal achieved, positive actions)
- **Warning**: `#ff9800` (Attention needed, challenges)
- **Error**: `#f44336` (Errors, failures, danger)
- **Info**: `#2196f3` (Tips, information, guidance)

### Gradient Usage
```css
/* Primary Hero Gradient */
background: linear-gradient(135deg, #1976d2 0%, #ff9800 100%)

/* Card Hover Gradient */
background: linear-gradient(45deg, rgba(25,118,210,0.1) 0%, rgba(255,152,0,0.1) 100%)

/* Text Gradient (for headings) */
background: linear-gradient(45deg, #fff 30%, #f0f0f0 90%)

/* 🆕 PROFILE SECTION GRADIENTS */
/* Main header gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* Card background gradients by category */
.green-card { background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%) }
.orange-card { background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%) }
.purple-card { background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%) }
.pink-card { background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%) }
.blue-card { background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%) }
```

### Color-Coded Card System
```typescript
// ✅ NEW STANDARD: Color-coded thematic cards
const cardThemes = {
  contact: {
    background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
    border: '1px solid rgba(76, 175, 80, 0.2)',
    iconColor: '#4caf50',
    textColor: '#388e3c',
    accentColor: '#2e7d32'
  },
  personal: {
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
    border: '1px solid rgba(255, 152, 0, 0.2)',
    iconColor: '#ff9800',
    textColor: '#f57c00',
    accentColor: '#ef6c00'
  },
  activity: {
    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
    border: '1px solid rgba(156, 39, 176, 0.2)',
    iconColor: '#9c27b0',
    textColor: '#7b1fa2',
    accentColor: '#6a1b9a'
  },
  bio: {
    background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
    border: '1px solid rgba(233, 30, 99, 0.2)',
    iconColor: '#e91e63',
    textColor: '#c2185b',
    accentColor: '#ad1457'
  },
  profile: {
    background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
    border: '1px solid rgba(33, 150, 243, 0.1)',
    iconColor: '#2196f3',
    textColor: '#1976d2',
    accentColor: '#1565c0'
  }
}
```

---

## 📝 Typography System

### Font Hierarchy
```typescript
// Based on MUI Typography variants
const typography = {
  h1: { fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.2 },  // Hero titles
  h2: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.3 },  // Section headers  
  h3: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.4 },    // Card titles
  h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.5 },  // Sub-headers
  h5: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.6 }, // Small headers
  h6: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.6 },    // Labels
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.7 }, // Main text
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 }, // Secondary text
}
```

### Typography Rules
- **Headlines**: Bold weights (600-800) cho impact
- **Body Text**: Regular weight (400) cho readability  
- **Line Height**: 1.4-1.7 cho comfortable reading
- **Letter Spacing**: Default hoặc slightly increased cho headers

---

## 🧩 Component Design Patterns

### 1. 📄 Page Layout Pattern
```tsx
// ✅ STANDARD: Full-height gradient page với hero + form
function PageLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, primary.main 0%, secondary.main 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 4 
        }}>
          {/* Hero Section */}
          <Box sx={{ flex: 1, color: 'white' }}>
            {/* Hero content */}
          </Box>
          
          {/* Form/Content Card */}
          <Box sx={{ flex: 1, maxWidth: 500 }}>
            <Paper elevation={20} sx={{ 
              p: 4, 
              borderRadius: 4,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              {/* Form content */}
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
```

### 2. 🃏 Card Components
```tsx
// ✅ STANDARD: Feature cards với hover effects
const FeatureCard = () => (
  <Card sx={{
    height: '100%',
    transition: 'all 0.3s ease',
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'grey.100',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      borderColor: 'primary.light',
    }
  }}>
    <CardContent sx={{ textAlign: 'center', p: 4 }}>
      {/* Icon circle */}
      <Box sx={{
        display: 'inline-flex',
        p: 3,
        borderRadius: '50%',
        bgcolor: 'primary.light',
        color: 'primary.main',
        mb: 3,
        fontSize: '2rem',
      }}>
        {icon}
      </Box>
      
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);
```

### 3. 📝 Form Patterns (React 19 Style)
```tsx
// ✅ STANDARD: Forms với Actions và Material UI
function FormPattern() {
  const [state, submitAction, isPending] = useActionState(formAction, initialState);
  
  return (
    <Box component="form" action={submitAction}>
      {/* Error Alert */}
      {state.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error}
        </Alert>
      )}
      
      {/* Input với icons */}
      <TextField
        name="email"
        type="email"
        label="Email"
        required
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />
      
      {/* Submit button với loading state */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isPending}
        startIcon={isPending ? <CircularProgress size={20} /> : <SubmitIcon />}
        sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
      >
        {isPending ? 'Processing...' : 'Submit'}
      </Button>
    </Box>
  );
}
```

### 4. 🧭 Navigation Pattern
```tsx
// ✅ STANDARD: AppBar với user menu
const NavigationBar = () => (
  <AppBar position="static" elevation={0} sx={{ 
    background: 'linear-gradient(90deg, primary.main, primary.dark)' 
  }}>
    <Toolbar>
      {/* Logo */}
      <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
        <FitnessCenter sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          FitApp
        </Typography>
      </Stack>
      
      {/* Navigation items */}
      {isAuthenticated ? (
        <UserMenu user={user} />
      ) : (
        <Stack direction="row" spacing={2}>
          <Button color="inherit" startIcon={<Login />}>
            Đăng nhập
          </Button>
          <Button variant="outlined" color="inherit" startIcon={<PersonAdd />}>
            Đăng ký
          </Button>
        </Stack>
      )}
    </Toolbar>
  </AppBar>
);
```

### 5. 🆕 PROFILE SECTION PATTERNS

#### 5.1 Profile Header with Gradient
```tsx
// ✅ NEW STANDARD: Profile section header với gradient background
const ProfileSectionHeader = ({ title, subtitle, icon: IconComponent, onEdit }) => (
  <Box
    sx={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
        <IconComponent sx={{ color: 'white', fontSize: 28 }} />
      </Avatar>
      <Box>
        <Typography variant="h5" component="h2" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
    {onEdit && (
      <Button
        variant="contained"
        startIcon={<EditIcon />}
        onClick={onEdit}
        sx={{
          bgcolor: 'rgba(255,255,255,0.2)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.3)',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.3)',
            transform: 'translateY(-1px)',
          }
        }}
      >
        Chỉnh sửa
      </Button>
    )}
  </Box>
);
```

#### 5.2 Color-Coded Information Cards
```tsx
// ✅ NEW STANDARD: Thematic information cards với consistent theming
const ThematicInfoCard = ({ 
  theme, // 'contact', 'personal', 'activity', 'bio', 'profile'
  icon: IconComponent, 
  title, 
  children 
}) => {
  const cardTheme = cardThemes[theme];
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: 'fit-content',
        background: cardTheme.background,
        borderRadius: 2,
        border: cardTheme.border
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: cardTheme.iconColor, width: 32, height: 32, mr: 1.5 }}>
          <IconComponent sx={{ fontSize: 18 }} />
        </Avatar>
        <Typography variant="h6" fontWeight="600" color={cardTheme.textColor}>
          {title}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {children}
      </Box>
    </Paper>
  );
};
```

#### 5.3 Profile Tabs Navigation
```tsx
// ✅ NEW STANDARD: Enhanced tabs navigation với modern styling
const ProfileTabsNavigation = ({ tabValue, handleTabChange, isMobile }) => (
  <Paper
    sx={{
      mb: 3,
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
      borderRadius: 3,
      border: '1px solid rgba(102, 126, 234, 0.1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      overflow: 'hidden'
    }}
  >
    {/* Header section for tabs */}
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 2,
        textAlign: 'center'
      }}
    >
      <Typography variant="h5" component="h1" fontWeight="bold">
        Hồ sơ cá nhân
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
        Quản lý thông tin và theo dõi tiến độ của bạn
      </Typography>
    </Box>

    <Tabs
      value={tabValue}
      onChange={handleTabChange}
      variant={isMobile ? "scrollable" : "fullWidth"}
      scrollButtons="auto"
      allowScrollButtonsMobile
      aria-label="profile-tabs"
      sx={{
        '& .MuiTab-root': {
          minHeight: 60,
          fontWeight: 600,
          fontSize: '0.9rem',
          textTransform: 'none',
          px: 3,
          py: 2,
          color: 'text.secondary',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
            transform: 'translateY(-1px)',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
            color: '#667eea',
            fontWeight: 700,
            '& .MuiSvgIcon-root': {
              color: '#667eea',
            },
          },
        },
        '& .MuiTabs-indicator': {
          height: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '2px 2px 0 0',
        },
        '& .MuiTabs-flexContainer': {
          background: 'white',
        },
      }}
    >
      {/* Tab items with icons */}
      <Tab
        icon={<AccountCircleIcon sx={{ fontSize: 24, mb: 0.5 }} />}
        label="Thông tin cá nhân"
        sx={{ borderRight: isMobile ? 'none' : '1px solid rgba(0,0,0,0.06)' }}
      />
      {/* Add more tabs as needed */}
    </Tabs>
  </Paper>
);
```

#### 5.4 Profile Avatar Section
```tsx
// ✅ NEW STANDARD: Large avatar display với verification badges
const ProfileAvatarSection = ({ user, fullName }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 3,
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
      borderRadius: 2,
      border: '1px solid rgba(33, 150, 243, 0.1)'
    }}
  >
    <Box display="flex" alignItems="center" gap={3}>
      <Avatar
        src={user.avatar}
        alt={fullName}
        sx={{
          width: 80,
          height: 80,
          border: '3px solid rgba(102, 126, 234, 0.2)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="#1565c0">
            {fullName}
          </Typography>
          {user.isEmailVerified ? (
            <Chip
              icon={<VerifiedUserIcon />}
              label="Đã xác thực"
              color="success"
              size="medium"
              sx={{ fontWeight: 600 }}
            />
          ) : (
            <Chip
              label="Chưa xác thực"
              color="warning"
              size="medium"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          @{user.username}
        </Typography>
        <Chip
          icon={<BadgeIcon />}
          label={user.role === 'admin' ? 'Quản trị viên' : 
                user.role === 'trainer' ? 'Huấn luyện viên' : 'Thành viên'}
          color={user.role === 'admin' ? 'error' : user.role === 'trainer' ? 'warning' : 'primary'}
          sx={{ fontWeight: 600 }}
        />
      </Box>
    </Box>
  </Paper>
);
```

#### 5.5 BMI & Health Metrics Display
```tsx
// ✅ NEW STANDARD: BMI display component với health-themed styling
const BMIDisplay = ({ bmi, category, color }) => {
  const getGradientBackground = () => {
    switch (color) {
      case 'success':
        return 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)';
      case 'error':
        return 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)';
      default:
        return 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)';
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        textAlign: 'center',
        background: getGradientBackground(),
        borderRadius: 3,
        border: `1px solid ${getBorderColor()}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }
      }}
    >
      {/* Header with Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: getIconColor(), width: 40, height: 40, mr: 1.5 }}>
          <HealthIcon sx={{ fontSize: 20, color: 'white' }} />
        </Avatar>
        <Typography variant="h6" fontWeight="600" color={getCategoryColor()}>
          Chỉ số BMI
        </Typography>
      </Box>

      {/* Large BMI Value */}
      <Typography 
        variant="h2" 
        sx={{ 
          fontWeight: 'bold',
          color: getIconColor(),
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          mb: 2
        }}
      >
        {bmi.toFixed(1)}
      </Typography>

      {/* Progress Bar with gradient */}
      <Box sx={{ mb: 3, px: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: 'rgba(0,0,0,0.06)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 6,
              background: getProgressGradient(color)
            }
          }}
        />
      </Box>

      {/* Category Badge */}
      <Box 
        sx={{ 
          display: 'inline-block',
          px: 3,
          py: 1,
          borderRadius: 20,
          background: getCategoryBackground(color),
          border: `1px solid ${getBorderColor()}`,
          mb: 2
        }}
      >
        <Typography variant="body1" fontWeight="600" sx={{ color: getCategoryColor() }}>
          {category}
        </Typography>
      </Box>

      {/* BMI Scale Reference */}
      <Box sx={{ 
        mt: 2, 
        pt: 2,
        borderTop: `1px solid ${getBorderColor()}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="error.main" fontWeight="500">
            Thiếu cân
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            &lt; 18.5
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="success.main" fontWeight="500">
            Bình thường
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            18.5 - 24.9
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="warning.main" fontWeight="500">
            Thừa cân
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            ≥ 25
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
```

#### 5.6 Health Metrics Card Themes
```tsx
// ✅ NEW STANDARD: Health-themed card styling
const healthCardThemes = {
  bmi: {
    background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)', // Green for healthy metrics
    border: '1px solid rgba(76, 175, 80, 0.2)',
    iconColor: '#4caf50',
    textColor: '#388e3c'
  },
  weight: {
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', // Orange for weight
    border: '1px solid rgba(255, 152, 0, 0.2)',
    iconColor: '#ff9800',
    textColor: '#f57c00'
  },
  height: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', // Blue for measurements
    border: '1px solid rgba(33, 150, 243, 0.2)',
    iconColor: '#2196f3',
    textColor: '#1565c0'
  },
  heart: {
    background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)', // Red for heart rate
    border: '1px solid rgba(244, 67, 54, 0.2)',
    iconColor: '#f44336',
    textColor: '#d32f2f'
  }
};
```

---

## 📏 Spacing & Layout Rules

### Container & Spacing
```typescript
// Standard spacing scale (based on 8px grid)
const spacing = {
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px  
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
  xxl: '4rem',     // 64px
}
```

### Layout Principles
- **Container Max Width**: `lg` (1200px) cho desktop
- **Page Padding**: `py: 4` (32px) top/bottom minimum
- **Card Padding**: `p: 4` (32px) cho forms, `p: 3` (24px) cho content cards
- **Section Gap**: `gap: 4` (32px) between major sections
- **Component Gap**: `gap: 2` (16px) between related elements

### Responsive Breakpoints
```typescript
// MUI breakpoints
const breakpoints = {
  xs: 0,        // Mobile
  sm: 600,      // Tablet
  md: 900,      // Small desktop
  lg: 1200,     // Desktop
  xl: 1536,     // Large desktop
}
```

---

## 📱 Responsive Design Guidelines

### Mobile-First Rules
1. **Stack vertically** cho mobile (`flexDirection: { xs: 'column', md: 'row' }`)
2. **Full width** inputs và buttons trên mobile
3. **Reduce padding** trên mobile (`p: { xs: 3, sm: 4 }`)
4. **Center content** trên mobile (`textAlign: { xs: 'center', md: 'left' }`)

### Component Responsive Patterns
```tsx
// ✅ STANDARD: Responsive component
const ResponsiveComponent = () => (
  <Box sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'center',
    gap: { xs: 2, md: 4 },
    p: { xs: 3, sm: 4 },
    textAlign: { xs: 'center', md: 'left' }
  }}>
    {/* Content */}
  </Box>
);
```

---

## 🎭 Animation & Interactions

### Hover Effects
```tsx
// ✅ STANDARD: Card hover animation
const hoverEffect = {
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  }
}

// ✅ STANDARD: Button hover
const buttonHover = {
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: 2,
  }
}
```

### Loading States
```tsx
// ✅ STANDARD: Loading trong buttons
<Button disabled={isPending} startIcon={
  isPending ? <CircularProgress size={20} /> : <ActionIcon />
}>
  {isPending ? 'Loading...' : 'Action'}
</Button>

// ✅ STANDARD: Skeleton cho content loading
<Skeleton variant="rectangular" width="100%" height={200} />
```

### Page Transitions
```tsx
// ✅ STANDARD: Fade in animation
<Fade in timeout={300}>
  <Box>{content}</Box>
</Fade>

// ✅ NEW: Tab panel animation cho profile sections
<Box
  sx={{
    py: 3,
    animation: 'fadeIn 0.5s ease-in-out',
    '@keyframes fadeIn': {
      '0%': {
        opacity: 0,
        transform: 'translateY(20px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  }}
>
  {content}
</Box>
```

### 🆕 Profile-Specific Animations
```tsx
// ✅ NEW STANDARD: Profile section hover effects
const profileCardHover = {
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
  }
}

// ✅ NEW: Tab hover effect
const tabHoverEffect = {
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
    transform: 'translateY(-1px)',
  }
}

// ✅ NEW: Edit button hover effect
const editButtonHover = {
  transition: 'all 0.2s ease',
  '&:hover': {
    bgcolor: 'rgba(255,255,255,0.3)',
    transform: 'translateY(-1px)',
  }
}
```

---

## ♿ Accessibility Standards

### Color Contrast
- **Text on white**: Minimum 4.5:1 ratio
- **Text on colored backgrounds**: Test với WebAIM tools
- **Interactive elements**: Minimum 3:1 ratio

### Keyboard Navigation
- **Tab order**: Logical flow through interactive elements
- **Focus indicators**: Visible focus states cho tất cả interactive elements
- **Skip links**: Cho navigation

### Screen Reader Support
```tsx
// ✅ GOOD: Proper ARIA labels
<TextField
  aria-label="Email address"
  aria-describedby="email-helper-text"
  error={hasError}
  helperText="Enter your email address"
/>

<Button aria-label="Submit registration form">
  Submit
</Button>
```

### Form Accessibility
- **Labels**: Required cho tất cả inputs
- **Error messages**: Associated với form fields
- **Required indicators**: Visual và programmatic
- **Validation**: Real-time feedback

---

## 🔧 Material UI Customization

### Theme Override Patterns
```typescript
// ✅ STANDARD: Custom component styles
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.08)',
        }
      }
    }
  }
});
```

### Common sx Props Patterns
```tsx
// ✅ STANDARD: Reusable sx patterns
const cardStyle = {
  p: 4,
  borderRadius: 3,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(10px)',
}

const gradientBackground = {
  background: 'linear-gradient(135deg, primary.main 0%, secondary.main 100%)',
}

const centerContent = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
}
```

---

## 📋 Component Library Standards

### 1. 🏠 Page Components
- **Full-height layout** với gradient background
- **Hero section + content card** pattern
- **Responsive flex layout** cho mobile/desktop
- **Consistent spacing** (py: 4, gap: 4)

### 2. 📝 Form Components  
- **React 19 Actions** thay vì manual state
- **Material UI inputs** với icons
- **Loading states** trong buttons
- **Error handling** với Alert components

### 3. 🃏 Content Cards
- **Rounded corners** (borderRadius: 3)
- **Hover animations** với transform + shadow
- **Icon circles** cho visual hierarchy
- **Consistent padding** (p: 4 cho forms, p: 3 cho content)

### 4. 🧭 Navigation Components
- **AppBar** với gradient background
- **User menu** với proper logout action
- **Responsive navigation** cho mobile
- **Logo + brand** consistency

### 5. 🆕 PROFILE COMPONENTS
- **Color-coded thematic cards** theo chức năng (contact, personal, activity, bio, profile)
- **Gradient headers** với icon và edit button
- **Large avatar display** với verification badges
- **Enhanced tabs navigation** với hover effects và responsive design
- **Grid layout** sử dụng CSS Grid thay vì MUI Grid cho type safety
- **Consistent card theming** với predefined color schemes
---

## ✅ Design Checklist

### Before Implementation:
- [ ] Kiểm tra color contrast ratios
- [ ] Test responsive design trên mobile/tablet/desktop
- [ ] Verify accessibility với screen reader
- [ ] Validate consistent spacing usage
- [ ] Check animation performance

### Component Review:
- [ ] Sử dụng React 19 patterns (Actions, use() hook)
- [ ] Material UI components được customize theo theme
- [ ] Responsive design implemented correctly
- [ ] Loading states và error handling
- [ ] Consistent typography hierarchy
- [ ] 🆕 **Profile sections**: Color-coded cards với proper theming
- [ ] 🆕 **Tabs navigation**: Enhanced styling với gradient backgrounds
- [ ] 🆕 **CSS Grid layout**: Thay vì MUI Grid cho better type safety
- [ ] 🆕 **Avatar sections**: Large display với verification badges

### Page Review:
- [ ] Full-height gradient background
- [ ] Hero section + content card layout
- [ ] Mobile-first responsive design
- [ ] Proper navigation integration
- [ ] SEO và accessibility optimization

---

## 🎯 Brand Guidelines

### Logo Usage
- **Icon**: FitnessCenter MUI icon
- **Typography**: "FitApp" với fontWeight: 800
- **Color**: White trên gradient backgrounds, primary.main trên white

### Voice & Tone
- **Encouraging**: Positive, motivational language
- **Professional**: Clear, helpful instructions
- **Inclusive**: Welcoming cho all fitness levels
- **Action-Oriented**: Clear CTAs và next steps

### Imagery Style
- **High contrast**: Bold, vibrant colors
- **People-focused**: Real users, diverse representation  
- **Progress-oriented**: Before/after, achievements
- **Equipment/gym**: Modern, clean environments

---

**🎨 Summary**: Design system tập trung vào trải nghiệm người dùng fitness với Material UI, React 19 patterns, và accessibility standards. Luôn prioritize user experience và performance trong mọi design decisions.

---

## 🆕 PROFILE SECTION DESIGN RULES

### Gradient & Color Standards
1. **Header Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` cho tất cả profile headers
2. **Card Background Gradients**: Sử dụng predefined color themes theo chức năng
3. **Border Colors**: Matching với background gradient nhưng với opacity thấp hơn
4. **Text Colors**: Darker shade của background color cho readability

### Layout Standards
1. **CSS Grid over MUI Grid**: Sử dụng `display: 'grid'` với `gridTemplateColumns` cho better TypeScript support
2. **Responsive Grid**: `{ xs: '1fr', md: '1fr 1fr' }` pattern cho 2-column layout
3. **Card Heights**: `height: 'fit-content'` để avoid stretching issues
4. **Consistent Spacing**: 3 (24px) cho card padding, 2 (16px) cho internal gaps

### Icon & Avatar Standards
1. **Avatar Sizes**: 32x32 cho card headers, 80x80 cho profile display
2. **Icon Colors**: Match với card theme colors
3. **Border Styling**: `3px solid rgba(color, 0.2)` cho profile avatars
4. **Shadow Effects**: `0 4px 20px rgba(0,0,0,0.1)` cho depth

### Typography Standards
1. **Card Titles**: `variant="h6"` với `fontWeight="600"`
2. **Profile Name**: `variant="h4"` với `fontWeight="bold"`
3. **Username**: `variant="h6"` với `color="text.secondary"`
4. **Card Content**: `variant="body1"` hoặc `variant="body2"`

### Interactive Elements
1. **Edit Buttons**: Transparent white background với gradient hover
2. **Tab Hover**: Gradient background với `translateY(-1px)` effect
3. **Card Hover**: Subtle `translateY(-2px)` với enhanced shadow
4. **Transition Duration**: `0.3s ease` cho tất cả animations

### Accessibility Requirements
1. **Color Contrast**: Minimum 4.5:1 ratio cho text trên gradient backgrounds
2. **Focus States**: Visible focus indicators cho tất cả interactive elements
3. **Screen Reader**: Proper ARIA labels cho avatars và icons
4. **Keyboard Navigation**: Tab order phải logical và intuitive