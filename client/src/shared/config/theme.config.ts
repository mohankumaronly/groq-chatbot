import { DARK_THEME, LIGHT_THEME, Theme, ThemeColors } from '../types/common.types';

// Theme Configuration
export const THEME_CONFIG = {
  dark: {
    mode: 'dark' as Theme,
    colors: DARK_THEME,
  },
  light: {
    mode: 'light' as Theme,
    colors: LIGHT_THEME,
  },
} as const;

// Get theme colors based on mode
export const getThemeColors = (mode: Theme): ThemeColors => {
  return mode === 'dark' ? DARK_THEME : LIGHT_THEME;
};

// CSS Variables for theme
export const getThemeCSSVariables = (mode: Theme): Record<string, string> => {
  const colors = getThemeColors(mode);
  return {
    '--bg-primary': colors.background,
    '--bg-sidebar': colors.sidebar,
    '--bg-surface': colors.surface,
    '--bg-surface-hover': colors.surfaceHover,
    '--text-primary': colors.text,
    '--text-secondary': colors.textSecondary,
    '--text-muted': colors.textMuted,
    '--border-color': colors.border,
    '--color-primary': colors.primary,
    '--color-primary-hover': colors.primaryHover,
    '--color-success': colors.success,
    '--color-error': colors.error,
    '--color-warning': colors.warning,
    '--color-info': colors.info,
  };
};

// Apply theme to document
export const applyTheme = (mode: Theme): void => {
  const root = document.documentElement;
  const colors = getThemeColors(mode);
  
  Object.entries(getThemeCSSVariables(mode)).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Add/remove theme class
  if (mode === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
  
  // Store in localStorage
  localStorage.setItem('theme', mode);
};

// Get saved theme or system preference
export const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
    return savedTheme;
  }
  
  // Check system preference
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return systemPrefersDark ? 'dark' : 'light';
};