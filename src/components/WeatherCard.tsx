import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeatherData } from '../types/weather';
import { useThemeMode } from '../hooks/useThemeMode';

type WeatherCardProps = {
  weather: WeatherData;
};

export function WeatherCard({ weather }: WeatherCardProps) {
  const { colors } = useThemeMode();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.city, { color: colors.text }]}>{weather.city}</Text>
          <Text style={[styles.condition, { color: colors.muted }]}>{weather.condition}</Text>
        </View>
        <Ionicons name="partly-sunny" size={30} color={colors.warning} />
      </View>

      <Text style={[styles.temperature, { color: colors.text }]}>{weather.temperature} C</Text>

      <View style={styles.row}>
        <Text style={[styles.info, { color: colors.muted }]}>Umidade {weather.humidity}%</Text>
        <Text style={[styles.info, { color: colors.muted }]}>Vento {weather.windSpeed} km/h</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  city: {
    fontSize: 18,
    fontWeight: '800',
  },
  condition: {
    fontSize: 13,
    marginTop: 2,
  },
  temperature: {
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  info: {
    fontSize: 13,
    fontWeight: '600',
  },
});
