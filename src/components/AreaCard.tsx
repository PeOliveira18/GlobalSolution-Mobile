import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AgricultureArea } from '../types/agricultureArea';
import { useThemeMode } from '../hooks/useThemeMode';
import { formatRelativeUpdate } from '../utils/formatDate';
import { formatCoordinate } from '../utils/coordinates';
import { RiskBadge } from './RiskBadge';

type AreaCardProps = {
  area: AgricultureArea;
  onPress: () => void;
  isFavorite?: boolean;
};

export function AreaCard({ area, onPress, isFavorite = false }: AreaCardProps) {
  const { colors } = useThemeMode();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.72 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {area.name}
          </Text>
          <Text style={[styles.location, { color: colors.muted }]}>
            {area.city}, {area.state}
          </Text>
        </View>
        {isFavorite && <Ionicons name="star" size={20} color={colors.warning} />}
      </View>

      <View style={styles.metaRow}>
        <Text style={[styles.meta, { color: colors.muted }]}>{area.culture}</Text>
        <Text style={[styles.meta, { color: colors.muted }]}>{area.sizeInHectares} ha</Text>
        <Text style={[styles.meta, { color: colors.muted }]}>
          {formatRelativeUpdate(area.lastUpdate)}
        </Text>
      </View>

      <Text style={[styles.coordinates, { color: colors.muted }]}>
        Lat {formatCoordinate(area.coordinates.latitude)} | Lon {formatCoordinate(area.coordinates.longitude)}
      </Text>

      <View style={styles.footer}>
        <RiskBadge level={area.risk.level} />
        <Text style={[styles.weather, { color: colors.text }]}>
          {area.weather.temperature} C | {area.weather.humidity}% umid.
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
  },
  location: {
    fontSize: 13,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  meta: {
    fontSize: 13,
    fontWeight: '600',
  },
  coordinates: {
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  weather: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
});
