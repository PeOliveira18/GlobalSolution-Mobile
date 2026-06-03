import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { AlertCard } from '../components/AlertCard';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { SettingsIconButton } from '../components/SettingsIconButton';
import { useAgriculture } from '../contexts/AgricultureContext';
import { useThemeMode } from '../hooks/useThemeMode';

export function AlertsScreen() {
  const { colors } = useThemeMode();
  const { alerts, findAreaById } = useAgriculture();

  return (
    <Screen edges={['top', 'right', 'left']}>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerText}>
                <Text style={[styles.title, { color: colors.text }]}>Alertas agricolas</Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>
                  Alertas gerados por regras climaticas de seca, geada, vento, chuva e calor.
                </Text>
              </View>
              <SettingsIconButton />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <AlertCard alert={item} areaName={findAreaById(item.areaId)?.name} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="shield-checkmark-outline"
            title="Nenhum alerta ativo"
            message="As areas monitoradas estao sem risco climatico relevante agora."
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
  },
  header: {
    gap: 8,
    marginBottom: 16,
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
  separator: {
    height: 12,
  },
});
