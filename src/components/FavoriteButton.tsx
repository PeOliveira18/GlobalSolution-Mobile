import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../hooks/useThemeMode';

type FavoriteButtonProps = {
  active: boolean;
  onPress: () => void;
};

export function FavoriteButton({ active, onPress }: FavoriteButtonProps) {
  const { colors } = useThemeMode();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: active ? colors.warning : colors.primary,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <Ionicons name={active ? 'star' : 'star-outline'} size={18} color="#FFFFFF" />
      <Text style={styles.text}>{active ? 'Favorito' : 'Favoritar'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
