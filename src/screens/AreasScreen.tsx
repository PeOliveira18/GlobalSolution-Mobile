import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AreaCard } from '../components/AreaCard';
import { AreasMap } from '../components/AreasMap';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { Section } from '../components/Section';
import { SettingsIconButton } from '../components/SettingsIconButton';
import { SkeletonList } from '../components/Skeleton';
import { useAgriculture } from '../contexts/AgricultureContext';
import { useThemeMode } from '../hooks/useThemeMode';
import { RootStackParamList } from '../navigation/navigationTypes';
import { RiskFilter, filterAreas } from '../utils/filters';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const riskFilters: RiskFilter[] = ['TODOS', 'BAIXO', 'MEDIO', 'ALTO', 'CRITICO'];

export function AreasScreen() {
  const navigation = useNavigation<Navigation>();
  const { colors } = useThemeMode();
  const { areas, favoriteIds, loadingWeather, addToHistory } = useAgriculture();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('TODOS');
  const [selectedAreaId, setSelectedAreaId] = useState(areas[0]?.id);

  const filteredAreas = useMemo(
    () => filterAreas(areas, search, riskFilter),
    [areas, riskFilter, search],
  );

  useEffect(() => {
    if (!filteredAreas.some((area) => area.id === selectedAreaId)) {
      setSelectedAreaId(filteredAreas[0]?.id);
    }
  }, [filteredAreas, selectedAreaId]);

  return (
    <Screen edges={['top', 'right', 'left']}>
      <FlatList
        data={loadingWeather ? [] : filteredAreas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerText}>
                <Text style={[styles.title, { color: colors.text }]}>Areas monitoradas</Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>
                  Busque por cidade, cultura ou nome da propriedade.
                </Text>
              </View>
              <SettingsIconButton />
            </View>

            <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="search" size={18} color={colors.muted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar area"
                placeholderTextColor={colors.muted}
                style={[styles.input, { color: colors.text }]}
              />
            </View>

            <View style={styles.filterRow}>
              {riskFilters.map((filter) => {
                const active = riskFilter === filter;

                return (
                  <Pressable
                    key={filter}
                    onPress={() => setRiskFilter(filter)}
                    style={({ pressed }) => [
                      styles.filterChip,
                      {
                        backgroundColor: active ? colors.primary : colors.surface,
                        borderColor: active ? colors.primary : colors.border,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.filterText, { color: active ? '#FFFFFF' : colors.text }]}>
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Section title="Mapa das areas">
              <AreasMap
                areas={filteredAreas}
                selectedAreaId={selectedAreaId}
                onSelectArea={(area) => {
                  setSelectedAreaId(area.id);
                  addToHistory(area);
                  navigation.navigate('AreaDetail', { areaId: area.id, originTitle: 'Areas' });
                }}
              />
            </Section>
          </View>
        }
        renderItem={({ item }) => (
          <AreaCard
            area={item}
            isFavorite={favoriteIds.includes(item.id)}
            onPress={() => {
              addToHistory(item);
              navigation.navigate('AreaDetail', { areaId: item.id, originTitle: 'Areas' });
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          loadingWeather ? (
            <SkeletonList count={4} title="Atualizando areas monitoradas..." />
          ) : (
            <EmptyState
              icon="map-outline"
              title="Nenhuma area encontrada"
              message="Altere a busca ou o filtro de risco para visualizar outras regioes."
            />
          )
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
    gap: 14,
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
  searchBox: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    fontSize: 15,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    minHeight: 36,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '800',
  },
  separator: {
    height: 12,
  },
});
