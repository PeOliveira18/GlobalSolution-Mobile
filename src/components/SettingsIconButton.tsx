import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeMode } from '../hooks/useThemeMode';
import { RootStackParamList } from '../navigation/navigationTypes';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function SettingsIconButton() {
  const navigation = useNavigation<Navigation>();
  const { colors } = useThemeMode();

  return (
    <Pressable
      onPress={() => navigation.navigate('Settings')}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <Ionicons name="settings-outline" size={18} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
