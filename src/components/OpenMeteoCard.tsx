import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OpenMeteoClimateData } from '../services/openMeteoService';
import { AgricultureArea } from '../types/agricultureArea';
import { formatCoordinate } from '../utils/coordinates';
import { useThemeMode } from '../hooks/useThemeMode';

type OpenMeteoCardProps = {
  data: OpenMeteoClimateData;
  area: AgricultureArea;
};

const metrics = [
  { key: 'temperature', label: 'Temp.', unit: 'C', icon: 'thermometer' },
  { key: 'humidity', label: 'Umidade', unit: '%', icon: 'water' },
  { key: 'windSpeed', label: 'Vento', unit: 'km/h', icon: 'navigate' },
  { key: 'precipitation', label: 'Precip.', unit: 'mm', icon: 'rainy' },
] as const;

export function OpenMeteoCard({ data, area }: OpenMeteoCardProps) {
  const { colors } = useThemeMode();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
          <Ionicons name="cloud-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>Open-Meteo</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Clima atual por latitude e longitude
          </Text>
        </View>
      </View>

      <View style={[styles.locationBox, { backgroundColor: colors.surfaceAlt }]}>
        <Text style={[styles.areaName, { color: colors.text }]}>{area.name}</Text>
        <Text style={[styles.location, { color: colors.muted }]}>
          {area.city}, {area.state} | Lat {formatCoordinate(area.coordinates.latitude)} | Lon{' '}
          {formatCoordinate(area.coordinates.longitude)}
        </Text>
      </View>

      <View style={styles.metricGrid}>
        {metrics.map((metric) => (
          <View key={metric.key} style={[styles.metric, { backgroundColor: colors.surfaceAlt }]}>
            <Ionicons name={metric.icon} size={18} color={colors.primary} />
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {data[metric.key]} {metric.unit}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>{metric.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.compareBox, { borderColor: colors.border }]}>
        <Text style={[styles.compareTitle, { color: colors.text }]}>Comparacao com clima do app</Text>
        <Text style={[styles.compareText, { color: colors.muted }]}>
          App: {area.weather.temperature} C | {area.weather.humidity}% umid. |{' '}
          {area.weather.windSpeed} km/h vento | {area.weather.rainChance}% chance de chuva
        </Text>
        <Text style={[styles.date, { color: colors.primary }]}>
          Registro Open-Meteo: {data.observedAt}
        </Text>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  locationBox: {
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  areaName: {
    fontSize: 15,
    fontWeight: '900',
  },
  location: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metric: {
    flex: 1,
    minWidth: 118,
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  compareBox: {
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 5,
  },
  compareTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  compareText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    fontWeight: '900',
  },
});
