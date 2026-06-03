import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AlertTypeSummary } from '../components/AlertTypeSummary';
import { AreaCard } from '../components/AreaCard';
import { CurrentLocationCard } from '../components/CurrentLocationCard';
import { EmptyState } from '../components/EmptyState';
import { MetricCard } from '../components/MetricCard';
import { OpenMeteoCard } from '../components/OpenMeteoCard';
import { RecommendationAssistantCard } from '../components/RecommendationAssistantCard';
import { RiskBarChart } from '../components/RiskBarChart';
import { RiskBadge } from '../components/RiskBadge';
import { Screen } from '../components/Screen';
import { Section } from '../components/Section';
import { SettingsIconButton } from '../components/SettingsIconButton';
import { ClimateValidationSkeleton, DashboardSkeleton } from '../components/Skeleton';
import { WeatherCard } from '../components/WeatherCard';
import { useAgriculture } from '../contexts/AgricultureContext';
import { useThemeMode } from '../hooks/useThemeMode';
import { openMeteoService, OpenMeteoClimateData } from '../services/openMeteoService';
import { RootStackParamList } from '../navigation/navigationTypes';
import { buildDailyRecommendations } from '../utils/recommendationAssistant';
import { getRiskWeight } from '../utils/riskCalculator';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Navigation>();
  const { colors } = useThemeMode();
  const {
    areas,
    alerts,
    loadingWeather,
    weatherError,
    reloadWeather,
    favoriteIds,
    addToHistory,
  } = useAgriculture();
  const [regionalClimateData, setRegionalClimateData] = useState<OpenMeteoClimateData | null>(null);
  const [loadingRegionalClimate, setLoadingRegionalClimate] = useState(true);

  const highestRiskArea = useMemo(
    () => [...areas].sort((a, b) => getRiskWeight(b.risk.level) - getRiskWeight(a.risk.level))[0],
    [areas],
  );

  const criticalAlerts = alerts.filter((alert) => alert.level === 'CRITICO').length;
  const monitoredHectares = areas.reduce((total, area) => total + area.sizeInHectares, 0);
  const recommendations = useMemo(() => buildDailyRecommendations(areas), [areas]);

  useEffect(() => {
    let active = true;

    async function loadRegionalClimateData() {
      if (!highestRiskArea) {
        setRegionalClimateData(null);
        setLoadingRegionalClimate(false);
        return;
      }

      setLoadingRegionalClimate(true);
      const data = await openMeteoService.getClimateByCoordinates(
        highestRiskArea.coordinates.latitude,
        highestRiskArea.coordinates.longitude,
      );

      if (active) {
        setRegionalClimateData(data);
        setLoadingRegionalClimate(false);
      }
    }

    loadRegionalClimateData();

    return () => {
      active = false;
    };
  }, [highestRiskArea]);

  return (
    <Screen edges={['top', 'right', 'left']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loadingWeather}
            onRefresh={reloadWeather}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]}>Monitoramento agricola inteligente</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Clima, riscos e alertas para apoiar decisoes preventivas no campo.
            </Text>
          </View>

          <SettingsIconButton />
        </View>

        {!!weatherError && (
          <Text style={[styles.error, { color: colors.danger }]}>{weatherError}</Text>
        )}

        {loadingWeather ? (
          <DashboardSkeleton />
        ) : (
          <>
            {highestRiskArea && (
              <View style={[styles.riskPanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.riskHeader}>
                  <View style={styles.riskTitleBlock}>
                    <Text style={[styles.panelLabel, { color: colors.muted }]}>Area prioritaria</Text>
                    <Text style={[styles.panelTitle, { color: colors.text }]}>{highestRiskArea.name}</Text>
                  </View>
                  <RiskBadge level={highestRiskArea.risk.level} />
                </View>
                <Text style={[styles.recommendation, { color: colors.text }]}>
                  {highestRiskArea.risk.recommendation}
                </Text>
              </View>
            )}

            <View style={styles.metricGrid}>
              <MetricCard label="Areas monitoradas" value={String(areas.length)} icon="map" />
              <MetricCard label="Hectares" value={String(monitoredHectares)} icon="leaf" tone="secondary" />
              <MetricCard label="Alertas ativos" value={String(alerts.length)} icon="warning" tone="warning" />
              <MetricCard label="Criticos" value={String(criticalAlerts)} icon="flame" tone="danger" />
            </View>

            <Section title="Risco por area">
              <RiskBarChart areas={areas} />
            </Section>

            <Section title="Alertas por tipo">
              <AlertTypeSummary alerts={alerts} />
            </Section>

            <Section title="Recomendacoes inteligentes">
              <RecommendationAssistantCard recommendations={recommendations} />
            </Section>

            <Section title="Minha regiao">
              <CurrentLocationCard />
            </Section>

            {highestRiskArea && (
              <Section title="Clima atual">
                <WeatherCard weather={highestRiskArea.weather} />
              </Section>
            )}

            <Section title="Areas em destaque">
              <View style={styles.listGap}>
                {areas.slice(0, 3).map((area) => (
                  <AreaCard
                    key={area.id}
                    area={area}
                    isFavorite={favoriteIds.includes(area.id)}
                    onPress={() => {
                      addToHistory(area);
                      navigation.navigate('AreaDetail', { areaId: area.id, originTitle: 'Home' });
                    }}
                  />
                ))}
              </View>
            </Section>

            <Section title="Validacao climatica regional">
              {loadingRegionalClimate ? (
                <ClimateValidationSkeleton />
              ) : regionalClimateData && highestRiskArea ? (
                <OpenMeteoCard data={regionalClimateData} area={highestRiskArea} />
              ) : (
                <EmptyState
                  icon="cloud-outline"
                  title="Dados climaticos indisponiveis"
                  message="Nao foi possivel carregar a validacao climatica por coordenadas agora."
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
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  error: {
    fontSize: 14,
    fontWeight: '700',
  },
  riskPanel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  riskTitleBlock: {
    flex: 1,
  },
  panelLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  recommendation: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  listGap: {
    gap: 12,
  },
});
