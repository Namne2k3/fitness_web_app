# 🎨 Fitness Web App - Design System & UI Guidelines

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