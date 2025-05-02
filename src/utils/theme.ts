// Theme colors for Zynvo
// This file contains the color palette used across the application

export const theme = {
  // Core colors
  primary: {
    50: '#f0f1fe',
    100: '#e1e3fd',
    200: '#c3c7fb',
    300: '#a5aaf9',
    400: '#878ef7',
    500: '#6971f5', // Primary brand color
    600: '#4a54f3',
    700: '#2c37f1',
    800: '#0e1ae0',
    900: '#0a13a6',
  },
  secondary: {
    50: '#f4f0fd',
    100: '#e9e1fb',
    200: '#d3c3f7',
    300: '#bca5f3',
    400: '#a687ef',
    500: '#9069eb', // Secondary brand color
    600: '#774be7',
    700: '#6333e3',
    800: '#4f1bdf',
    900: '#3b15a8',
  },
  accent: {
    50: '#fef0fc',
    100: '#fde1f9',
    200: '#fbc3f3',
    300: '#f9a4ed',
    400: '#f786e7',
    500: '#f568e1', // Accent color
    600: '#f34adb',
    700: '#f12cd5',
    800: '#e00ec3',
    900: '#a60a91',
  },
  
  // UI colors
  success: '#10b981', // Green
  warning: '#f59e0b', // Amber
  error: '#ef4444',   // Red
  info: '#3b82f6',    // Blue
  
  // Neutrals
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  
  // Light/Dark mode 
  light: {
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    foreground: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
  },
  dark: {
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    border: '#334155',
  }
};

// Define typography
export const typography = {
  fontFamily: {
    sans: 'var(--font-geist-sans)',
    mono: 'var(--font-geist-mono)',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};

// Define spacings
export const spacing = {
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

// Define shadows
export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

// Border radiuses
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Animations and transitions
export const animation = {
  durations: {
    fast: '150ms',
    default: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },
  easings: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};