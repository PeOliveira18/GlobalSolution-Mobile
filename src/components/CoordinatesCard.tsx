import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../hooks/useThemeMode';
import { formatCoordinate } from '../utils/coordinates';

type CoordinatesCardProps = {
  latitude: number;
  longitude: number;
  label?: string;
};

export function CoordinatesCard({ latitude, longitude, label = 'Posicao monitorada' }: CoordinatesCardProps) {
  const { colors } = useThemeMode();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.textBlock}>
        <View style={styles.titleRow}>
          <Ionicons name="locate" size={18} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>{label}</Text>
        </View>
        <Text style={[styles.coordinate, { color: colors.muted }]}>
          Lat {formatCoordinate(latitude)} | Lon {formatCoordinate(longitude)}
        </Text>
      </View>

      <View style={[styles.visual, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <View style={[styles.verticalLine, { backgroundColor: colors.border }]} />
        <View style={[styles.horizontalLine, { backgroundColor: colors.border }]} />
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  textBlock: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
  },
  coordinate: {
    fontSize: 13,
    fontWeight: '700',
  },
  visual: {
    width: 62,
    height: 62,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
  },
  horizontalLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
});
