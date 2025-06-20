# 🎨 Styling & Responsive Design Guidelines

## 📋 Table of Contents
- [Core Principles](#core-principles)
- [Theme Integration](#theme-integration)
- [Responsive Design Strategy](#responsive-design-strategy)
- [Component Styling Patterns](#component-styling-patterns)
- [Animation & Visual Effects](#animation--visual-effects)
- [Layout Optimization](#layout-optimization)
- [Best Practices](#best-practices)
- [Example Implementations](#example-implementations)

## 🎯 Core Principles

### 1. **Theme-First Approach**
Always start with MUI theme integration:
```javascript
import { useTheme, alpha } from '@mui/material';

const theme = useTheme();
// Use theme.palette.primary.main instead of hardcoded colors
// Use alpha(theme.palette.primary.main, 0.1) for transparency
```

### 2. **Mobile-First Responsive Design**
Design for mobile first, then scale up:
```javascript
sx={{
  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
  padding: { xs: 2, sm: 3, md: 4 },
  maxWidth: { xs: '100%', sm: '600px', md: '800px' }
}}
```

### 3. **Consistent Spacing System**
Use MUI's spacing tokens consistently:
```javascript
// Good
spacing: { xs: 1, sm: 2, md: 3 }
gap: { xs: 1, sm: 2 }
p: { xs: 2, sm: 3 }

// Avoid fixed pixel values
padding: '16px 24px'
```

## 🎨 Theme Integration

### Essential Theme Hooks & Functions
```javascript
import { useTheme, alpha } from '@mui/material';

const theme = useTheme();

// Core theme usage patterns
const styles = {
  // Primary colors
  bgcolor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  
  // Transparent colors
  background: alpha(theme.palette.primary.main, 0.1),
  borderColor: alpha(theme.palette.primary.main, 0.3),
  
  // Dynamic colors based on state
  borderColor: isActive ? theme.palette.primary.main : 'divider',
  bgcolor: isCompleted ? theme.palette.success.main : theme.palette.primary.main,
}
```

### Color Palette Strategy
```javascript
// Status-based color mapping
const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in-progress': return 'primary';
    case 'locked': return 'default';
    case 'error': return 'error';
    default: return 'default';
  }
};

// Gradient backgrounds
background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`
```

## 📱 Responsive Design Strategy

### Breakpoint System
```javascript
// MUI Breakpoints: xs, sm, md, lg, xl
// xs: 0px, sm: 600px, md: 900px, lg: 1200px, xl: 1536px

const responsiveStyles = {
  // Typography scaling
  fontSize: { 
    xs: '0.875rem',   // Mobile
    sm: '1rem',       // Tablet
    md: '1.125rem',   // Desktop
    lg: '1.25rem'     // Large desktop
  },
  
  // Spacing scaling
  padding: { xs: 2, sm: 3, md: 4 },
  margin: { xs: 1, sm: 2, md: 3 },
  gap: { xs: 1, sm: 2, md: 3 },
  
  // Layout direction
  flexDirection: { xs: 'column', md: 'row' },
  textAlign: { xs: 'center', sm: 'left' },
  
  // Sizing
  width: { xs: '100%', sm: 'auto' },
  maxWidth: { xs: '100%', sm: '600px', md: '800px' },
  minWidth: { xs: '280px', sm: '400px' }
}
```

### Grid System Responsive Patterns
```javascript
// Responsive grid layouts
<Grid container spacing={{ xs: 2, sm: 3 }}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    {/* Cards: 1 col mobile, 2 col tablet, 3 col desktop, 4 col large */}
  </Grid>
</Grid>

// Form layouts
<Grid item xs={12} sm={6}>
  {/* Form fields: full width mobile, half width tablet+ */}
</Grid>
```

## 🧩 Component Styling Patterns

### Card Components
```javascript
const CardStyling = {
  borderRadius: 3,
  border: '2px solid',
  borderColor: 'transparent',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
  
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
    borderColor: theme.palette.primary.main,
  },
  
  // Top accent bar
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  }
}
```

### Button Styling
```javascript
const ButtonStyling = {
  borderRadius: 2,
  textTransform: 'none',
  fontWeight: 600,
  px: { xs: 2, sm: 3 },
  py: { xs: 1, sm: 1.5 },
  fontSize: { xs: '0.875rem', sm: '1rem' },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Gradient background
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
  
  '&:hover': {
    transform: 'translateY(-2px) scale(1.03)',
    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
  }
}
```

### Dialog Styling
```javascript
const DialogStyling = {
  PaperProps: {
    sx: {
      borderRadius: 3,
      maxWidth: '1000px',
      background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'
    }
  },
  
  // Dialog title with gradient
  DialogTitle: {
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
    borderBottom: '1px solid',
    borderColor: 'divider'
  }
}
```

## ✨ Animation & Visual Effects

### Keyframe Animations
```javascript
import { keyframes } from '@mui/system';

// Shimmer effect
const shimmer = keyframes`
  0% { backgroundPosition: '-200% 0'; }
  100% { backgroundPosition: '200% 0'; }
`;

// Glow effect
const glow = keyframes`
  0% { boxShadow: 0 0 20px rgba(25, 118, 210, 0.3); }
  50% { boxShadow: 0 0 30px rgba(25, 118, 210, 0.6); }
  100% { boxShadow: 0 0 20px rgba(25, 118, 210, 0.3); }
`;

// Usage
sx={{
  animation: `${shimmer} 2s linear infinite`,
  backgroundSize: '200% 100%'
}}
```

### Transition Patterns
```javascript
const TransitionStyles = {
  // Smooth transitions
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Hover effects
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
  },
  
  // Active states
  '&:active': {
    transform: 'translateY(-1px) scale(1.01)',
  }
}
```

## 📐 Layout Optimization

### Container Strategy
```javascript
// Use MUI Container for consistent layouts
<Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4 } }}>
  <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3 } }}>
    {/* Nested containers for content hierarchy */}
  </Container>
</Container>
```

### Stack vs Flexbox
```javascript
// Prefer Stack over manual flexbox
<Stack 
  direction={{ xs: 'column', sm: 'row' }}
  spacing={{ xs: 2, sm: 3 }}
  alignItems={{ xs: 'stretch', sm: 'center' }}
  justifyContent="space-between"
>
  {children}
</Stack>

// Instead of manual flexbox
<Box sx={{ 
  display: 'flex', 
  flexDirection: { xs: 'column', sm: 'row' },
  gap: { xs: 2, sm: 3 }
}}>
```

### Paper Sections
```javascript
// Use Paper for content sections
<Paper 
  elevation={0}
  sx={{ 
    p: { xs: 2, sm: 3 }, 
    border: '1px solid', 
    borderColor: 'divider',
    borderRadius: 2,
    bgcolor: alpha(theme.palette.primary.main, 0.05)
  }}
>
  {/* Section content */}
</Paper>
```

## 🎯 Best Practices

### 1. **Typography Hierarchy**
```javascript
// Consistent typography scaling
<Typography 
  variant="h4" 
  component="h1"
  sx={{ 
    fontWeight: 700,
    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
    lineHeight: 1.2,
    background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
>
```

### 2. **Loading States**
```javascript
// Consistent loading components
const LoadingState = () => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    gap: 2,
    p: 3
  }}>
    <CircularProgress 
      size={48} 
      thickness={4} 
      sx={{ color: theme.palette.primary.main }}
    />
    <Typography variant="body1" color="text.secondary" fontWeight={500}>
      Loading...
    </Typography>
  </Box>
);
```

### 3. **Error States**
```javascript
// Consistent error handling
{error && (
  <Alert 
    severity="error" 
    sx={{ 
      mx: 3,
      my: 2,
      borderRadius: 2,
    }}
    icon={<WarningIcon />}
  >
    <Typography variant="body2" fontWeight={500}>
      {error}
    </Typography>
  </Alert>
)}
```

### 4. **Progressive Enhancement**
```javascript
// Feature detection and fallbacks
const hasAdvancedFeatures = 'backdrop-filter' in document.documentElement.style;

sx={{
  backdropFilter: hasAdvancedFeatures ? 'blur(4px)' : 'none',
  backgroundColor: hasAdvancedFeatures 
    ? alpha(theme.palette.background.paper, 0.8)
    : theme.palette.background.paper
}}
```

## 💡 Example Implementations

### Enhanced Card Component
```javascript
const EnhancedCard = ({ title, description, status, onClick }) => {
  const theme = useTheme();
  
  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: 3,
        border: '2px solid',
        borderColor: status === 'completed' ? theme.palette.success.main : 'transparent',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
          borderColor: theme.palette.primary.main,
        },
        
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {description}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
```

### Responsive Dialog
```javascript
const ResponsiveDialog = ({ open, onClose, title, children }) => {
  const theme = useTheme();
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxWidth: '1000px',
          background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          borderBottom: '1px solid',
          borderColor: 'divider',
          p: { xs: 2, sm: 3 }
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            {title}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};
```

## 🔧 Prompt Engineering for Styling

### Effective Prompt Structure
```
"Optimize [Component Name] for better MUI usage and responsive design with:

1. **Theme Integration**: Use useTheme() hook and alpha() function
2. **Responsive Design**: Mobile-first with breakpoint-specific styling  
3. **Modern Visual Effects**: Subtle animations and hover states
4. **Component Composition**: Reusable patterns with proper spacing
5. **Accessibility**: Proper contrast ratios and focus states

Focus on:
- Consistent spacing system with { xs: 2, sm: 3 } patterns
- Typography scaling across breakpoints  
- Gradient backgrounds and smooth transitions
- Stack/Grid layouts instead of manual flexbox
- Paper sections for content hierarchy"
```

### Key Phrases for AI Styling
- "Make it responsive and theme-compliant"
- "Use MUI best practices with modern styling"
- "Apply consistent spacing and typography scaling"
- "Add subtle animations and hover effects"
- "Ensure mobile-first responsive design"
- "Use alpha() for transparent colors"
- "Apply gradient backgrounds and smooth transitions"

## 📚 Resources & References

- [MUI Theme Documentation](https://mui.com/material-ui/customization/theming/)
- [MUI Responsive Design](https://mui.com/material-ui/react-grid/)
- [CSS Cubic Bezier Generator](https://cubic-bezier.com/)
- [Material Design Guidelines](https://material.io/design)

---

*This document serves as a comprehensive guide for maintaining consistent, modern, and responsive styling across all components using MUI and modern CSS practices.*