import { prefs } from '@/lib/storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from storage on mount
  useEffect(() => {
    async function loadTheme() {
      try {
        const saved = await prefs.get<string>('theme_mode', 'system');
        const validTheme: ThemeMode = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
        console.log('📱 Initial theme from storage:', validTheme);
        setThemeModeState(validTheme);
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTheme();
  }, []);

  // Calculate current theme
  const currentTheme: 'light' | 'dark' = themeMode === 'system' ? (systemColorScheme || 'light') : themeMode;

  // Function to change theme mode
  const setMode = (mode: ThemeMode) => {
    console.log('🎨 Theme mode changing to:', mode);
    setThemeModeState(mode);
    // Save to storage (fire and forget)
    prefs.set('theme_mode', mode).catch(error => {
      console.error('Failed to save theme:', error);
    });
  };

  const toggleTheme = () => {
    const newTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
    console.log('🔄 Toggling theme from', currentTheme, 'to', newTheme);
    setMode(newTheme);
  };

  const value: ThemeContextType = {
    theme: currentTheme,
    themeMode,
    setMode,
    toggleTheme,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light',
    isSystem: themeMode === 'system',
  };

  // Debug log when theme changes
  useEffect(() => {
    if (!isLoading) {
      console.log('🌈 ThemeContext updated:', {
        currentTheme,
        themeMode,
        isDark: currentTheme === 'dark',
      });
    }
  }, [currentTheme, themeMode, isLoading]);

  // Don't render children until theme is loaded to avoid flash
  if (isLoading) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
