import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, DARK_THEME, LIGHT_THEME, ThemeColors } from '../../shared/types/common.types';
import { getInitialTheme, applyTheme } from '../../shared/config/theme.config';

interface ThemeState {
  theme: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getInitialTheme(),
      colors: getInitialTheme() === 'dark' ? DARK_THEME : LIGHT_THEME,
      
      setTheme: (theme: Theme) => {
        const colors = theme === 'dark' ? DARK_THEME : LIGHT_THEME;
        applyTheme(theme);
        set({ theme, colors });
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const colors = newTheme === 'dark' ? DARK_THEME : LIGHT_THEME;
        applyTheme(newTheme);
        set({ theme: newTheme, colors });
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);