import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useThemeMode } from '../hooks/useThemeMode';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = 'Carregando dados...' }: LoadingStateProps) {
  const { colors } = useThemeMode();

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} />
      <Text style={[styles.text, { color: colors.muted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});
