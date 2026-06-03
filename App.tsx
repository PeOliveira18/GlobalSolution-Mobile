import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AgricultureProvider } from './src/contexts/AgricultureContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { useThemeMode } from './src/hooks/useThemeMode';
import { AppNavigator } from './src/navigation/AppNavigator';

function AppContent() {
  const { isDark } = useThemeMode();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AgricultureProvider>
          <AppContent />
        </AgricultureProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
