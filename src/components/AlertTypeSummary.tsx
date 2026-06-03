import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AgriculturalAlert } from '../types/alert';
import { useThemeMode } from '../hooks/useThemeMode';

const alertTypes: Array<{
  type: AgriculturalAlert['type'];
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { type: 'seca', label: 'Seca', icon: 'sunny' },
  { type: 'geada', label: 'Geada', icon: 'snow' },
  { type: 'vento', label: 'Vento', icon: 'navigate' },
  { type: 'chuva', label: 'Chuva', icon: 'rainy' },
  { type: 'calor', label: 'Calor', icon: 'flame' },
  { type: 'umidade', label: 'Umidade', icon: 'water' },
];

type AlertTypeSummaryProps = {
  alerts: AgriculturalAlert[];
};

export function AlertTypeSummary({ alerts }: AlertTypeSummaryProps) {
  const { colors } = useThemeMode();
  const summary = alertTypes.map((item) => ({
    ...item,
    count: alerts.filter((alert) => alert.type === item.type).length,
  }));
  const maxCount = Math.max(...summary.map((item) => item.count), 1);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {summary.map((item) => {
        const barWidth = Math.max((item.count / maxCount) * 100, item.count ? 12 : 0);

        return (
          <View key={item.type} style={styles.row}>
            <View style={styles.typeLabel}>
              <Ionicons name={item.icon} size={17} color={colors.primary} />
              <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
            </View>
            <View style={styles.barArea}>
              <View style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${barWidth}%` as `${number}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.count, { color: colors.muted }]}>{item.count}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 12,
  },
  row: {
    gap: 7,
  },
  typeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
  },
  barArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  track: {
    flex: 1,
    height: 9,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 8,
  },
  count: {
    width: 24,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '900',
  },
});
