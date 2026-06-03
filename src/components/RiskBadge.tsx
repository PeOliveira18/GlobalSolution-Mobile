import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RiskLevel } from '../types/risk';
import { riskColors } from '../theme/colors';

type RiskBadgeProps = {
  level: RiskLevel;
  compact?: boolean;
};

export function RiskBadge({ level, compact = false }: RiskBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: riskColors[level] }]}>
      <Text style={[styles.text, compact && styles.compactText]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  compactText: {
    fontSize: 10,
  },
});
