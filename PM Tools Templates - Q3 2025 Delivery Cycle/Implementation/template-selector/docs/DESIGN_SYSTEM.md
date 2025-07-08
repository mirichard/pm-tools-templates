# Template Selector Design System

## Overview
This design system provides a comprehensive guide for the Template Selector interface, ensuring consistency, accessibility, and usability across all components.

## Color Palette

### Primary Colors
- Primary Blue: `#0969da`
- Primary Light: `#d0ebff`
- Primary Dark: `#004085`

### Interface Colors
- Surface: `#ffffff`
- Background: `#f6f8fa`
- Border: `#e1e4e8`

### Text Colors
- Primary Text: `#1F2328`
- Secondary Text: `#57606a`
- Muted Text: `#6e7781`

### Status Colors
- Success: `#2ea44f`
- Success Light: `#dafbe1`
- Error: `#cf222e`
- Error Light: `#ffebe9`

## Typography

### Font Families
- Base: System font stack (San Francisco on macOS, Segoe UI on Windows)
- Monospace: Source Code Pro, Menlo, Monaco, Consolas

### Font Sizes
- XS: 0.75rem (12px)
- SM: 0.875rem (14px)
- Base: 1rem (16px)
- LG: 1.125rem (18px)
- XL: 1.25rem (20px)
- 2XL: 1.5rem (24px)

## Spacing System

### Base Units
- XS: 0.25rem (4px)
- SM: 0.5rem (8px)
- MD: 1rem (16px)
- LG: 1.5rem (24px)
- XL: 2rem (32px)
- 2XL: 3rem (48px)

## Components

### Template Card
- Height: 200px
- Padding: 1.5rem
- Border Radius: 8px
- Hover Transform: translateY(-2px)
- Shadow: 0 4px 8px rgba(0, 0, 0, 0.1)

### Buttons
- Padding: 0.5rem 1rem
- Border Radius: 6px
- Font Weight: 500
- Transition: 200ms cubic-bezier(0.4, 0, 0.2, 1)

### Inputs
- Height: 40px
- Padding: 8px 16px
- Border Radius: 6px
- Border: 1px solid var(--color-border)

## Accessibility Features

### Focus States
- Outline: 2px solid #0969da
- Outline Offset: 2px
- Border Radius: 4px

### Color Contrast
- All text meets WCAG 2.1 AA standards
- Interactive elements have distinct focus states
- Error states use accessible color combinations

### Keyboard Navigation
- All interactive elements are focusable
- Logical tab order
- Skip navigation link available
- Arrow key navigation in grid

### Screen Reader Support
- ARIA labels on interactive elements
- Role attributes for semantic markup
- Status messages for dynamic content
- Alternative text for visual elements

### Reduced Motion
- Respects prefers-reduced-motion
- Essential animations only
- Smooth transitions for state changes

## Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 641px - 768px
- Desktop: 769px - 1024px
- Wide: > 1024px

### Grid System
- Desktop: 4 columns
- Tablet: 2-3 columns
- Mobile: 1 column

## Dark Mode Support
Dark mode colors are automatically applied based on system preferences, with carefully selected contrasting colors that maintain accessibility standards.

## Implementation
The design system is implemented through CSS variables and utility classes. See `theme.css` for the complete implementation.
