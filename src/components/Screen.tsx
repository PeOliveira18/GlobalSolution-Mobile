import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useThemeMode } from '../hooks/useThemeMode';

type ScreenProps = {
  children: ReactNode;
  edges?: Edge[];
};

export function Screen({ children, edges = ['top', 'right', 'bottom', 'left'] }: ScreenProps) {
  const { colors } = useThemeMode();

  return (
    <SafeAreaView edges={edges} style={[styles.container, { backgroundColor: colors.background }]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
