import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AgriculturalAlert } from '../types/alert';
import { useThemeMode } from '../hooks/useThemeMode';
import { formatDateTime } from '../utils/formatDate';
import { RiskBadge } from './RiskBadge';

type AlertCardProps = {
  alert: AgriculturalAlert;
  areaName?: string;
};

export function AlertCard({ alert, areaName }: AlertCardProps) {
  const { colors } = useThemeMode();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
          <Ionicons name="warning" size={20} color={colors.warning} />
        </View>
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: colors.text }]}>{alert.title}</Text>
          {!!areaName && <Text style={[styles.area, { color: colors.muted }]}>{areaName}</Text>}
        </View>
        <RiskBadge level={alert.level} compact />
      </View>

      <Text style={[styles.message, { color: colors.muted }]}>{alert.message}</Text>
      <Text style={[styles.date, { color: colors.muted }]}>{formatDateTime(alert.createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
  },
  area: {
    fontSize: 12,
    marginTop: 2,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
  },
});
