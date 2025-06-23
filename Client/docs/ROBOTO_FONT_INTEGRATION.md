# 🎨 Roboto Font Integration Guide

## 📋 Tổng quan

Ứng dụng TrackMe Fitness đã được tích hợp hoàn chỉnh với font Roboto, bao gồm tất cả font weights từ Thin (100) đến Black (900) và cả italic styles.

## 📁 Cấu trúc Font Files

```
public/fonts/roboto/
├── Roboto-Thin.ttf           (100)
├── Roboto-ThinItalic.ttf     (100 italic)
├── Roboto-ExtraLight.ttf     (200)
├── Roboto-ExtraLightItalic.ttf (200 italic)
├── Roboto-Light.ttf          (300)
├── Roboto-LightItalic.ttf    (300 italic)
├── Roboto-Regular.ttf        (400) ⭐
├── Roboto-Italic.ttf         (400 italic)
├── Roboto-Medium.ttf         (500) ⭐
├── Roboto-MediumItalic.ttf   (500 italic)
├── Roboto-SemiBold.ttf       (600)
├── Roboto-SemiBoldItalic.ttf (600 italic)
├── Roboto-Bold.ttf           (700) ⭐
├── Roboto-BoldItalic.ttf     (700 italic)
├── Roboto-ExtraBold.ttf      (800)
├── Roboto-ExtraBoldItalic.ttf (800 italic)
├── Roboto-Black.ttf          (900)
└── Roboto-BlackItalic.ttf    (900 italic)
```

⭐ = Preloaded fonts for better performance

## 🎯 Font Configuration

### 1. CSS Font-Face Definitions
Location: `src/styles/fonts.css`

```css
@font-face {
  font-family: 'Roboto';
  src: url('/fonts/roboto/Roboto-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
/* ... và tất cả các weights khác */
```

### 2. Global Font Settings
Location: `src/index.css`

```css
@layer base {
  html, body {
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

### 3. Material UI Theme Integration
Location: `src/styles/theme.ts`

```typescript
export const fitnessTheme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // ... các variant typography
  }
});
```

### 4. Tailwind CSS Integration
Location: `tailwind.config.js`

```javascript
theme: {
  extend: {
    fontFamily: {
      'sans': ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      'roboto': ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
}
```

## 🚀 Cách Sử dụng

### 1. Material UI Typography

```tsx
import { Typography } from '@mui/material';

// Tự động sử dụng Roboto theo theme
<Typography variant="h1">Heading với Roboto Bold</Typography>
<Typography variant="body1">Body text với Roboto Regular</Typography>
```

### 2. Tailwind CSS Classes

```tsx
// Font weights
<div className="font-roboto-thin">Text với Roboto Thin (100)</div>
<div className="font-roboto-regular">Text với Roboto Regular (400)</div>
<div className="font-roboto-medium">Text với Roboto Medium (500)</div>
<div className="font-roboto-bold">Text với Roboto Bold (700)</div>

// Italic
<div className="font-roboto-regular font-roboto-italic">Roboto Italic</div>
```

### 3. Inline Styles

```tsx
// Direct font-weight
<div style={{ fontWeight: 300 }}>Roboto Light</div>
<div style={{ fontWeight: 600 }}>Roboto SemiBold</div>
```

### 4. Glassmorphism Text Utilities

```tsx
// Enhanced text cho glassmorphism backgrounds
<div className="glass-text-shadow">Text với subtle shadow</div>
<div className="glass-text-contrast">Text với high contrast</div>
<div className="glass-text-light">Light text for dark backgrounds</div>
```

## 🔧 Available Font Weight Classes

| Class | Font Weight | Description |
|-------|-------------|-------------|
| `font-roboto-thin` | 100 | Thinnest weight |
| `font-roboto-extralight` | 200 | Extra light |
| `font-roboto-light` | 300 | Light weight |
| `font-roboto-regular` | 400 | Normal/regular ⭐ |
| `font-roboto-medium` | 500 | Medium weight ⭐ |
| `font-roboto-semibold` | 600 | Semi bold |
| `font-roboto-bold` | 700 | Bold weight ⭐ |
| `font-roboto-extrabold` | 800 | Extra bold |
| `font-roboto-black` | 900 | Heaviest weight |
| `font-roboto-italic` | - | Italic style |

## 🧪 Testing Font Integration

Để test xem font có hoạt động đúng không:

1. **Truy cập Font Demo Page**: 
   Navigate to `/font-demo` trong browser

2. **Developer Tools Check**:
   - Mở DevTools (F12)
   - Vào tab Network
   - Reload page
   - Tìm các font files Roboto trong network requests

3. **Visual Inspection**:
   - Text should look crisp and clean
   - Different font weights should be clearly distinct
   - Fallback fonts (Helvetica/Arial) chỉ load nếu Roboto fail

## ⚡ Performance Optimizations

### 1. Font Preloading
Critical fonts được preload trong `index.html`:

```html
<link rel="preload" href="/fonts/roboto/Roboto-Regular.ttf" as="font" type="font/ttf" crossorigin>
<link rel="preload" href="/fonts/roboto/Roboto-Medium.ttf" as="font" type="font/ttf" crossorigin>
<link rel="preload" href="/fonts/roboto/Roboto-Bold.ttf" as="font" type="font/ttf" crossorigin>
```

### 2. Font Display Strategy
Sử dụng `font-display: swap` để avoid layout shift:

```css
@font-face {
  font-display: swap; /* Shows fallback font first, then swaps to Roboto */
}
```

### 3. Font Optimization
- **Local fonts**: Không phụ thuộc Google Fonts CDN
- **TTF format**: Optimized cho web performance
- **Selective loading**: Chỉ load các weights thực sự cần thiết

## 🔍 Troubleshooting

### Font không load?

1. **Check file paths**: Ensure fonts exist in `public/fonts/roboto/`
2. **Network tab**: Verify fonts are being downloaded
3. **CSS import**: Ensure `fonts.css` is imported in `index.css`
4. **Browser cache**: Hard refresh (Ctrl+Shift+R)

### Font looks different?

1. **Fallback fonts**: Browser might be using Helvetica/Arial fallback
2. **Font weight mapping**: Check if correct weight is being applied
3. **Anti-aliasing**: Different on various OS/browsers

### Performance issues?

1. **Reduce font weights**: Comment out unused weights in `fonts.css`
2. **Use font-display**: Ensure `swap` is set for all @font-face rules
3. **Preload optimization**: Adjust preloaded fonts based on usage

## 🎨 Best Practices

### 1. Typography Hierarchy
```tsx
// ✅ Good - Clear hierarchy
<Typography variant="h1" sx={{ fontWeight: 700 }}>Main Title</Typography>
<Typography variant="h2" sx={{ fontWeight: 600 }}>Section Header</Typography>
<Typography variant="body1" sx={{ fontWeight: 400 }}>Body content</Typography>
```

### 2. Glassmorphism Compatibility
```tsx
// ✅ Good - Enhanced text for glass backgrounds
<Box className="glassmorphism-card">
  <Typography className="glass-text-contrast" variant="h4">
    Clear title on glass background
  </Typography>
</Box>
```

### 3. Performance Considerations
```tsx
// ✅ Good - Use semantic HTML with CSS classes
<h1 className="font-roboto-bold">Semantic heading</h1>

// ❌ Avoid - Inline styles for repeated elements
<div style={{ fontFamily: 'Roboto', fontWeight: 700 }}>Title</div>
```

## 📚 Resources

- [Google Fonts Roboto](https://fonts.google.com/specimen/Roboto)
- [Material UI Typography](https://mui.com/material-ui/customization/typography/)
- [Tailwind Custom Fonts](https://tailwindcss.com/docs/font-family)
- [Web Font Performance](https://web.dev/font-display/)

---

**🎯 Result**: Roboto font is now fully integrated across the entire TrackMe Fitness application with all weights, italic styles, and performance optimizations!
