// Theme Types
export type Theme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  sidebar: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryHover: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export interface ThemeConfig {
  mode: Theme;
  colors: ThemeColors;
}

// ChatGPT Theme Colors
export const DARK_THEME: ThemeColors = {
  background: '#343541',      // Main background
  sidebar: '#202123',         // Sidebar background
  surface: '#444654',         // Card/Message surface
  surfaceHover: '#4a4b52',    // Hover state
  text: '#ececf1',            // Primary text
  textSecondary: '#c5c5d2',   // Secondary text
  textMuted: '#8e8ea0',       // Muted text
  border: '#4a4b52',          // Border color
  primary: '#10a37f',         // ChatGPT green
  primaryHover: '#0e8f6f',    // Darker green on hover
  success: '#10a37f',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export const LIGHT_THEME: ThemeColors = {
  background: '#ffffff',
  sidebar: '#f7f7f8',
  surface: '#ffffff',
  surfaceHover: '#f7f7f8',
  text: '#343541',
  textSecondary: '#6e6e80',
  textMuted: '#acacbe',
  border: '#e5e5e5',
  primary: '#10a37f',
  primaryHover: '#0e8f6f',
  success: '#10a37f',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

// UI Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  name?: string;
}

export interface AlertProps extends BaseComponentProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
  avatar?: string;
  themePreference?: Theme;
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState {
  status: LoadingState;
  error: string | null;
}