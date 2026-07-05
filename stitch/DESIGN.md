---
name: Masked Probe Control
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#908fa1'
  outline-variant: '#464556'
  surface-tint: '#c1c1ff'
  primary: '#c1c1ff'
  on-primary: '#1500a8'
  primary-container: '#5d5cff'
  on-primary-container: '#fdf9ff'
  inverse-primary: '#4643e9'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#b9c7e0'
  on-tertiary: '#233144'
  tertiary-container: '#66748a'
  on-tertiary-container: '#fafaff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1dfff'
  primary-fixed-dim: '#c1c1ff'
  on-primary-fixed: '#09006b'
  on-primary-fixed-variant: '#2b20d2'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#d5e3fd'
  tertiary-fixed-dim: '#b9c7e0'
  on-tertiary-fixed: '#0d1c2f'
  on-tertiary-fixed-variant: '#3a485c'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  technical-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  technical-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  max-width: 1440px
---

## Brand & Style
The design system is engineered for "Masked Probe Control," a utility-first application demanding high-precision interaction and data clarity. The brand personality is clinical, technical, and authoritative, evoking the feeling of a specialized laboratory instrument or a high-performance terminal. 

The aesthetic blends **Minimalism** with **Modern Corporate** efficiency, leaning into an industrial "control panel" look. The UI prioritizes function over decoration, utilizing a structured layout, subtle depth, and clear visual hierarchies to ensure the user remains focused on critical probe data and system states. The emotional response is one of reliability, calm under pressure, and absolute control.

## Colors
The palette is rooted in a "Deep Slate" environment to minimize eye strain during extended technical monitoring.

- **Primary (Electric Indigo):** Used exclusively for high-priority actions, active states, and successful probe connections. It provides a vibrant contrast against the dark background.
- **Secondary/Tertiary (Slate Grays):** These form the foundation of the interface, defining surface levels and container boundaries.
- **Neutral (Slate White):** Reserved for high-contrast typography and iconography to ensure maximum legibility.
- **Functional Colors:** 
  - Status Success: #10B981 (Emerald)
  - Status Warning: #F59E0B (Amber)
  - Status Critical: #EF4444 (Rose)

## Typography
The typography system uses a dual-font approach to distinguish between interface controls and technical data outputs.

- **Inter:** The primary workhorse for all UI elements, navigation, and headers. It provides a clean, neutral, and highly readable foundation.
- **JetBrains Mono:** Used for all "Probe" data, including coordinates, timestamps, masking IDs, and console logs. The monospaced nature ensures that columns of data remain aligned and easily scannable.
- **Scale:** High-contrast sizing ensures that critical status labels (using `label-caps`) are immediately distinguishable from standard body text.

## Layout & Spacing
This design system utilizes a **Fixed Grid** model for the desktop dashboard to maintain a "cockpit" feel, while transitioning to a fluid stack for mobile utilities.

- **Grid:** A 12-column grid on desktop with a 16px gutter. Components typically span 3, 4, 6, or 12 columns.
- **Rhythm:** All spacing is derived from a 4px baseline unit. 
- **Density:** The layout is high-density. Padding within data cards and lists should be compact (8px to 12px) to maximize information density without sacrificing clarity.
- **Breakpoints:**
  - Mobile: < 768px (Single column, 16px margins)
  - Tablet: 768px - 1024px (Two-column layout)
  - Desktop: > 1024px (Full 12-column dashboard)

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows, preserving the industrial aesthetic.

- **Base Layer:** The deepest slate (#0F172A) acts as the application canvas.
- **Surface Layer:** Cards and panels use #1E293B with a subtle 1px border (#334155).
- **Interactive Layer:** Hover states use a slight lightening of the background or a subtle 1px Electric Indigo stroke.
- **Shadows:** Only used for floating modals or context menus, employing a sharp, low-opacity shadow (0px 4px 12px rgba(0,0,0,0.5)) to indicate a temporary overlay.

## Shapes
In line with the technical nature of the system, shapes are primarily geometric with tight radii. 

- **Standard Elements:** 4px (Soft) radius for buttons, inputs, and tags.
- **Containers:** 8px radius for main dashboard panels and cards.
- **Data Points:** Status indicators and small circular icons use full rounding (pill-shaped) to distinguish them from structural UI elements.

## Components
- **Buttons:** Primary buttons are solid Electric Indigo with white text. Secondary buttons use a slate border with no fill. All buttons feature a 4px corner radius and 14px semi-bold Inter text.
- **Technical Lists:** Used for probe history. Each row should have a 1px bottom border (#334155). Use JetBrains Mono for the value columns and Inter for the labels.
- **Inputs:** Dark backgrounds (#0F172A) with a 1px Slate border. On focus, the border transitions to Electric Indigo with a 1px outer glow.
- **Chips/Status Badges:** Compact, with a subtle background tint and high-contrast text. Use `technical-sm` typography for status values.
- **Control Cards:** Use 8px rounding. Headers should be clearly separated with a horizontal rule and contain the card title in `label-caps`.
- **Data Visualizers:** Line charts and probe graphs should use Electric Indigo for the primary data line, with a faint slate grid pattern in the background.