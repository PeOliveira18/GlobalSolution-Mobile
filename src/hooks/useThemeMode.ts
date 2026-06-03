import { useAppTheme } from '../contexts/ThemeContext';

export function useThemeMode() {
  return useAppTheme();
}
