import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AlertTypeSummary } from '../components/AlertTypeSummary';
import { MetricCard } from '../components/MetricCard';
import { RecommendationAssistantCard } from '../components/RecommendationAssistantCard';
import { RiskBarChart } from '../components/RiskBarChart';
import { RiskBadge } from '../components/RiskBadge';
import { Screen } from '../components/Screen';
import { Section } from '../components/Section';
import { SettingsIconButton } from '../components/SettingsIconButton';
import { useAgriculture } from '../contexts/AgricultureContext';
import { useThemeMode } from '../hooks/useThemeMode';
import { CultureType } from '../types/agricultureArea';
import { RiskLevel } from '../types/risk';
import {
  buildDailyRecommendations,
  getDailyRecommendation,
} from '../utils/recommendationAssistant';

const riskLevels: RiskLevel[] = ['BAIXO', 'MEDIO', 'ALTO', 'CRITICO'];

export function ReportsScreen() {
  const { colors } = useThemeMode();
  const { areas, alerts } = useAgriculture();

  const report = useMemo(() => {
    const monitoredHectares = areas.reduce((total, area) => total + area.sizeInHectares, 0);
    const criticalAlerts = alerts.filter((alert) => alert.level === 'CRITICO').length;
    const riskCount = riskLevels.map((level) => ({
      level,
      count: areas.filter((area) => area.risk.level === level).length,
    }));

    const cultureImpact = areas.reduce<Record<CultureType, number>>((acc, area) => {
      const areaAlertWeight = area.alerts.length || (area.risk.level === 'BAIXO' ? 0 : 1);
      acc[area.culture] = (acc[area.culture] ?? 0) + areaAlertWeight;
      return acc;
    }, {} as Record<CultureType, number>);

    const mostAffectedCulture =
      Object.entries(cultureImpact).sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'Sem dados';

    return {
      monitoredHectares,
      criticalAlerts,
      riskCount,
      mostAffectedCulture,
      dailyRecommendation: getDailyRecommendation(areas),
      recommendations: buildDailyRecommendations(areas),
    };
  }, [alerts, areas]);

  return (
    <Screen edges={['top', 'right', 'left']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: colors.text }]}>Relatorios</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Resumo analitico das areas monitoradas, riscos e recomendacoes do dia.
              </Text>
            </View>
            <SettingsIconButton />
          </View>
        </View>

        <View style={styles.metricGrid}>
          <MetricCard label="Hectares" value={String(report.monitoredHectares)} icon="leaf" />
          <MetricCard label="Criticos" value={String(report.criticalAlerts)} icon="flame" tone="danger" />
          <MetricCard label="Cult. afetada" value={report.mostAffectedCulture} icon="nutrition" tone="secondary" />
          <MetricCard label="Areas" value={String(areas.length)} icon="map" tone="warning" />
        </View>

        <Section title="Areas por nivel de risco">
          <View style={[styles.riskSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {report.riskCount.map((item) => (
              <View key={item.level} style={styles.riskItem}>
                <RiskBadge level={item.level} compact />
                <Text style={[styles.riskCount, { color: colors.text }]}>{item.count}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Recomendacao geral">
          <View style={[styles.recommendationPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.recommendationText, { color: colors.text }]}>
              {report.dailyRecommendation}
            </Text>
          </View>
        </Section>

        <Section title="Risco por area">
          <RiskBarChart areas={areas} />
        </Section>

        <Section title="Alertas por tipo">
          <AlertTypeSummary alerts={alerts} />
        </Section>

        <Section title="Assistente IA local">
          <RecommendationAssistantCard recommendations={report.recommendations} limit={4} />
        </Section>
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
    gap: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  riskSummary: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  riskItem: {
    minWidth: 92,
    flex: 1,
    gap: 8,
  },
  riskCount: {
    fontSize: 24,
    fontWeight: '900',
  },
  recommendationPanel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  recommendationText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
});
