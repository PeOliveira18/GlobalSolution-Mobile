import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecommendationInsight } from '../utils/recommendationAssistant';
import { riskColors } from '../theme/colors';
import { useThemeMode } from '../hooks/useThemeMode';

type RecommendationAssistantCardProps = {
  recommendations: RecommendationInsight[];
  title?: string;
  limit?: number;
};

export function RecommendationAssistantCard({
  recommendations,
  title = 'Assistente IA local',
  limit = 3,
}: RecommendationAssistantCardProps) {
  const { colors } = useThemeMode();
  const visibleRecommendations = recommendations.slice(0, limit);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
          <Ionicons name="sparkles" size={19} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Regras locais analisam clima, umidade, vento e chuva.
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {visibleRecommendations.map((recommendation) => (
          <View
            key={recommendation.id}
            style={[styles.item, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
          >
            <View style={styles.itemText}>
              <View style={styles.metaRow}>
                <Text
                  style={[
                    styles.priorityPill,
                    {
                      backgroundColor: riskColors[recommendation.level],
                    },
                  ]}
                >
                  {`Prioridade ${recommendation.priority}`}
                </Text>
                <Text style={[styles.timeframe, { color: colors.primary }]}>
                  {recommendation.timeframe}
                </Text>
              </View>
              <Text style={[styles.itemTitle, { color: colors.text }]}>{recommendation.title}</Text>
              {!!recommendation.areaName && (
                <Text style={[styles.areaName, { color: colors.primary }]}>{recommendation.areaName}</Text>
              )}
              <Text style={[styles.message, { color: colors.muted }]}>{recommendation.message}</Text>
              <View style={[styles.reasonBox, { borderColor: colors.border }]}>
                <Text style={[styles.reasonLabel, { color: colors.primary }]}>Motivo</Text>
                <Text style={[styles.reason, { color: colors.text }]}>{recommendation.reason}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  list: {
    gap: 14,
  },
  item: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 10,
  },
  itemText: {
    flex: 1,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityPill: {
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  timeframe: {
    fontSize: 12,
    fontWeight: '900',
    flexShrink: 1,
  },
  itemTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },
  areaName: {
    fontSize: 12,
    fontWeight: '900',
  },
  message: {
    fontSize: 13,
    lineHeight: 20,
  },
  reasonBox: {
    borderTopWidth: 1,
    paddingTop: 9,
    marginTop: 2,
    gap: 4,
  },
  reasonLabel: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  reason: {
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '700',
  },
});
