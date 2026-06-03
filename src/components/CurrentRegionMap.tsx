import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../hooks/useThemeMode';
import { formatCoordinate } from '../utils/coordinates';
import { WeatherData } from '../types/weather';
import { RiskResult } from '../types/risk';

type CurrentRegionMapProps = {
  regionName: string;
  regionDetails: string;
  latitude: number;
  longitude: number;
  weather?: WeatherData | null;
  risk?: RiskResult | null;
};

const metrics = [
  { key: 'temperature', label: 'Temp.', unit: 'C', icon: 'thermometer' },
  { key: 'humidity', label: 'Umidade', unit: '%', icon: 'water' },
  { key: 'windSpeed', label: 'Vento', unit: 'km/h', icon: 'navigate' },
  { key: 'rainChance', label: 'Chuva', unit: '%', icon: 'rainy' },
] as const;

export function CurrentRegionMap({
  regionName,
  regionDetails,
  latitude,
  longitude,
  weather,
  risk,
}: CurrentRegionMapProps) {
  const { colors } = useThemeMode();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.map, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <View style={[styles.verticalGuide, { backgroundColor: colors.border }]} />
        <View style={[styles.horizontalGuide, { backgroundColor: colors.border }]} />
        <View style={[styles.pinHalo, { backgroundColor: colors.primarySoft }]}>
          <View style={[styles.pin, { backgroundColor: colors.primary }]}>
            <Ionicons name="location" size={17} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={[styles.label, { color: colors.muted }]}>Regiao detectada</Text>
        <Text style={[styles.title, { color: colors.text }]}>{regionName}</Text>
        <Text style={[styles.details, { color: colors.muted }]}>{regionDetails}</Text>
        <Text style={[styles.coordinates, { color: colors.primary }]}>
          Lat {formatCoordinate(latitude)} | Lon {formatCoordinate(longitude)}
        </Text>

        {weather && (
          <View style={styles.metricGrid}>
            {metrics.map((metric) => (
              <View key={metric.key} style={[styles.metric, { backgroundColor: colors.surfaceAlt }]}>
                <Ionicons name={metric.icon} size={16} color={colors.primary} />
                <Text style={[styles.metricValue, { color: colors.text }]}>
                  {weather[metric.key]} {metric.unit}
                </Text>
                <Text style={[styles.metricLabel, { color: colors.muted }]}>{metric.label}</Text>
              </View>
            ))}
            {risk && (
              <View style={[styles.metric, { backgroundColor: colors.surfaceAlt }]}>
                <Ionicons name="analytics" size={16} color={colors.danger} />
                <Text style={[styles.metricValue, { color: colors.text }]}>{risk.score}</Text>
                <Text style={[styles.metricLabel, { color: colors.muted }]}>Score risco</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    height: 156,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalGuide: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
  },
  horizontalGuide: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
  },
  pinHalo: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: 14,
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '900',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  details: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  coordinates: {
    fontSize: 12,
    fontWeight: '900',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  metric: {
    flex: 1,
    minWidth: 96,
    borderRadius: 8,
    padding: 10,
    gap: 5,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
});
