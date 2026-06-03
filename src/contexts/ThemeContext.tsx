import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { AppColorScheme, darkColors, lightColors } from '../theme/colors';

const THEME_KEY = '@agroorbit:theme';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextData = {
  mode: ThemeMode;
  isDark: boolean;
  colors: AppColorScheme;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextData | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);

        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setModeState(savedTheme);
        }
      } catch {
        return;
      }
    }

    loadTheme();
  }, []);

  const resolvedTheme = mode === 'system' ? systemScheme ?? 'light' : mode;
  const isDark = resolvedTheme === 'dark';

  const setMode = async (newMode: ThemeMode) => {
    try {
      setModeState(newMode);
      await AsyncStorage.setItem(THEME_KEY, newMode);
    } catch {
      return;
    }
  };

  const toggleDarkMode = async () => {
    await setMode(isDark ? 'light' : 'dark');
  };

  const value = useMemo(
    () => ({
      mode,
      isDark,
      colors: isDark ? darkColors : lightColors,
      setMode,
      toggleDarkMode,
    }),
    [isDark, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme deve ser usado dentro de ThemeProvider');
  }

  return context;
}
