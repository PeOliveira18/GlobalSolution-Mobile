import React from 'react';
import { DimensionValue, StyleSheet, Text, View } from 'react-native';
import { useThemeMode } from '../hooks/useThemeMode';

type SkeletonBlockProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
};

export function SkeletonBlock({ width = '100%', height = 14, radius = 8 }: SkeletonBlockProps) {
  const { colors } = useThemeMode();

  return (
    <View
      style={[
        styles.block,
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
        },
      ]}
    />
  );
}

export function SkeletonCard() {
  const { colors } = useThemeMode();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleBlock}>
          <SkeletonBlock width="74%" height={18} />
          <SkeletonBlock width="48%" height={12} />
        </View>
        <SkeletonBlock width={58} height={26} />
      </View>
      <SkeletonBlock width="100%" height={12} />
      <SkeletonBlock width="82%" height={12} />
      <View style={styles.metricRow}>
        <SkeletonBlock width="30%" height={34} />
        <SkeletonBlock width="30%" height={34} />
        <SkeletonBlock width="30%" height={34} />
      </View>
    </View>
  );
}

export function SkeletonList({ count = 3, title }: { count?: number; title?: string }) {
  const { colors } = useThemeMode();

  return (
    <View style={styles.list}>
      {!!title && <Text style={[styles.title, { color: colors.muted }]}>{title}</Text>}
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={`skeleton-${index}`} />
      ))}
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View style={styles.list}>
      <View style={styles.metricRow}>
        <SkeletonBlock width="47%" height={96} />
        <SkeletonBlock width="47%" height={96} />
      </View>
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

export function ClimateValidationSkeleton() {
  const { colors } = useThemeMode();

  return (
    <View style={[styles.spaceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.spaceContent}>
        <SkeletonBlock width="72%" height={18} />
        <SkeletonBlock width="52%" height={12} />
        <SkeletonBlock width="100%" height={54} />
        <View style={styles.metricRow}>
          <SkeletonBlock width="47%" height={74} />
          <SkeletonBlock width="47%" height={74} />
          <SkeletonBlock width="47%" height={74} />
          <SkeletonBlock width="47%" height={74} />
        </View>
        <SkeletonBlock width="100%" height={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    borderWidth: 1,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitleBlock: {
    flex: 1,
    gap: 8,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  list: {
    gap: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
  },
  spaceCard: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  spaceContent: {
    padding: 14,
    gap: 10,
  },
});
