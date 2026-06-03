import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AgricultureArea } from '../types/agricultureArea';
import { riskColors } from '../theme/colors';
import { useThemeMode } from '../hooks/useThemeMode';

type RiskBarChartProps = {
  areas: AgricultureArea[];
};

export function RiskBarChart({ areas }: RiskBarChartProps) {
  const { colors } = useThemeMode();
  const maxScore = Math.max(...areas.map((area) => area.risk.score), 1);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {areas.map((area) => {
        const barWidth = Math.max((area.risk.score / maxScore) * 100, 8);

        return (
          <View key={area.id} style={styles.row}>
            <View style={styles.labelRow}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                {area.name}
              </Text>
              <Text style={[styles.score, { color: colors.muted }]}>
                {area.risk.level} | {area.risk.score}
              </Text>
            </View>
            <View style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${barWidth}%` as `${number}%`,
                    backgroundColor: riskColors[area.risk.level],
                  },
                ]}
              />
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
    gap: 14,
  },
  row: {
    gap: 7,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  name: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
  score: {
    fontSize: 12,
    fontWeight: '800',
  },
  track: {
    height: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 8,
  },
});
