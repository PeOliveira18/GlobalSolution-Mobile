import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../hooks/useThemeMode';

type MetricCardProps = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone?: 'primary' | 'secondary' | 'warning' | 'danger';
};

export function MetricCard({ label, value, icon, tone = 'primary' }: MetricCardProps) {
  const { colors } = useThemeMode();
  const iconColor =
    tone === 'warning'
      ? colors.warning
      : tone === 'danger'
        ? colors.danger
        : tone === 'secondary'
          ? colors.secondary
          : colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
