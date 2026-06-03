import React, { useEffect, useMemo } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AlertCard } from '../components/AlertCard';
import { CoordinatesCard } from '../components/CoordinatesCard';
import { EmptyState } from '../components/EmptyState';
import { FavoriteButton } from '../components/FavoriteButton';
import { MetricCard } from '../components/MetricCard';
import { RecommendationAssistantCard } from '../components/RecommendationAssistantCard';
import { RiskBadge } from '../components/RiskBadge';
import { Screen } from '../components/Screen';
import { Section } from '../components/Section';
import { SkeletonList } from '../components/Skeleton';
import { WeatherCard } from '../components/WeatherCard';
import { useAgriculture } from '../contexts/AgricultureContext';
import { useThemeMode } from '../hooks/useThemeMode';
import { RootStackParamList } from '../navigation/navigationTypes';
import { buildAreaRecommendations } from '../utils/recommendationAssistant';

type AreaDetailRoute = RouteProp<RootStackParamList, 'AreaDetail'>;

export function AreaDetailScreen() {
  const route = useRoute<AreaDetailRoute>();
  const { colors } = useThemeMode();
  const { findAreaById, isFavorite, toggleFavorite, addToHistory, loadingWeather } = useAgriculture();
  const area = findAreaById(route.params.areaId);
  const recommendations = useMemo(() => (area ? buildAreaRecommendations(area) : []), [area]);

  useEffect(() => {
    if (area) {
      addToHistory(area);
    }
  }, [addToHistory, area]);

  if (!area) {
    return (
      <Screen edges={['right', 'bottom', 'left']}>
        <View style={styles.emptyWrapper}>
          <EmptyState
            icon="alert-circle-outline"
            title="Area nao encontrada"
            message="A area selecionada nao esta mais disponivel."
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>{area.culture}</Text>
            <Text style={[styles.title, { color: colors.text }]}>{area.name}</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              {area.city}, {area.state} | {area.sizeInHectares} hectares
            </Text>
          </View>
          <RiskBadge level={area.risk.level} />
        </View>

        <FavoriteButton active={isFavorite(area.id)} onPress={() => toggleFavorite(area)} />

        {loadingWeather ? (
          <SkeletonList count={3} title="Atualizando dados da area..." />
        ) : (
          <>
            <Section title="Dados climaticos">
              <WeatherCard weather={area.weather} />
            </Section>

            <View style={styles.metricGrid}>
              <MetricCard label="Umidade" value={`${area.weather.humidity}%`} icon="water" />
              <MetricCard label="Vento" value={`${area.weather.windSpeed} km/h`} icon="navigate" tone="secondary" />
              <MetricCard label="Chuva" value={`${area.weather.rainChance}%`} icon="rainy" tone="warning" />
              <MetricCard label="Score risco" value={String(area.risk.score)} icon="analytics" tone="danger" />
            </View>

            <Section title="Posicao monitorada">
              <CoordinatesCard
                latitude={area.coordinates.latitude}
                longitude={area.coordinates.longitude}
              />
            </Section>

            <Section title="Assistente de recomendacoes">
              <RecommendationAssistantCard recommendations={recommendations} title="Assistente IA da area" />
            </Section>

            <Section title="Indicadores de risco">
              <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.panelTitle, { color: colors.text }]}>{area.risk.label}</Text>
                <Text style={[styles.panelText, { color: colors.muted }]}>{area.risk.recommendation}</Text>
                <View style={styles.reasonList}>
                  {area.risk.reasons.map((reason) => (
                    <Text key={reason} style={[styles.reason, { color: colors.text }]}>
                      - {reason}
                    </Text>
                  ))}
                </View>
              </View>
            </Section>

            <Section title="Alertas recentes">
              {area.alerts.length ? (
                <View style={styles.listGap}>
                  {area.alerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </View>
              ) : (
                <EmptyState
                  icon="checkmark-circle-outline"
                  title="Sem alertas ativos"
                  message="A area esta sem alertas climaticos relevantes neste momento."
                />
              )}
            </Section>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 18,
    paddingBottom: 32,
    gap: 22,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 6,
  },
  title: {
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 10,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  panelText: {
    fontSize: 15,
    lineHeight: 22,
  },
  reasonList: {
    gap: 6,
  },
  reason: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  listGap: {
    gap: 12,
  },
});
