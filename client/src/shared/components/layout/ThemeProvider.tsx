import { ReactNode, useEffect } from 'react';
import { useThemeStore } from '../../../store/slices/themeSlice';
import { applyTheme } from '../../config/theme.config';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useThemeStore();
  
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  
  return <>{children}</>;
};