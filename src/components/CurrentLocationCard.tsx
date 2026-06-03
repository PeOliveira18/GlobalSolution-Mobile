import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CurrentRegionMap } from './CurrentRegionMap';
import { RecommendationAssistantCard } from './RecommendationAssistantCard';
import { RiskBadge } from './RiskBadge';
import { WeatherCard } from './WeatherCard';
import { useThemeMode } from '../hooks/useThemeMode';
import { useCurrentLocationWeather } from '../hooks/useCurrentLocationWeather';

export function CurrentLocationCard() {
  const { colors } = useThemeMode();
  const {
    coordinates,
    regionName,
    regionDetails,
    weather,
    risk,
    recommendations,
    loading,
    error,
    loadCurrentLocationWeather,
  } = useCurrentLocationWeather();

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: colors.text }]}>Minha regiao</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Clima e risco calculados a partir da sua posicao atual.
            </Text>
          </View>
          {risk && <RiskBadge level={risk.level} compact />}
        </View>

        <Pressable
          onPress={loadCurrentLocationWeather}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: pressed || loading ? 0.75 : 1,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Ionicons name="locate" size={18} color="#FFFFFF" />
          )}
          <Text style={styles.buttonText}>{weather ? 'Atualizar regiao' : 'Usar minha localizacao'}</Text>
        </Pressable>

        {!!error && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}
      </View>

      {coordinates && (
        <CurrentRegionMap
          regionName={regionName}
          regionDetails={regionDetails}
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
          weather={weather}
          risk={risk}
        />
      )}

      {weather && <WeatherCard weather={weather} />}

      {recommendations.length > 0 && (
        <RecommendationAssistantCard
          recommendations={recommendations}
          title="Recomendacao para sua regiao"
          limit={2}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  button: {
    minHeight: 44,
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  error: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
});
