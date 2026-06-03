import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../components/EmptyState';
import { RiskBadge } from '../components/RiskBadge';
import { Screen } from '../components/Screen';
import { Section } from '../components/Section';
import { SettingsIconButton } from '../components/SettingsIconButton';
import { useAgriculture } from '../contexts/AgricultureContext';
import { useThemeMode } from '../hooks/useThemeMode';
import { RootStackParamList } from '../navigation/navigationTypes';
import { AgricultureArea, FavoriteArea } from '../types/agricultureArea';
import { formatCoordinate } from '../utils/coordinates';
import { formatDateTime } from '../utils/formatDate';
import { getRiskWeight } from '../utils/riskCalculator';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type FavoriteSort = 'recent' | 'risk' | 'name';
type FavoriteItem = {
  area: AgricultureArea;
  favorite: FavoriteArea;
};

const sortOptions: Array<{ key: FavoriteSort; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { key: 'recent', label: 'Recentes', icon: 'time' },
  { key: 'risk', label: 'Risco', icon: 'warning' },
  { key: 'name', label: 'Nome', icon: 'text' },
];

export function FavoritesScreen() {
  const navigation = useNavigation<Navigation>();
  const { colors } = useThemeMode();
  const { favorites, findAreaById, history, removeFavorite, addToHistory } = useAgriculture();
  const [sortMode, setSortMode] = useState<FavoriteSort>('recent');

  const favoriteItems = useMemo(
    () =>
      favorites
        .map((favorite) => ({
          favorite,
          area: findAreaById(favorite.id),
        }))
        .filter((item): item is FavoriteItem => !!item.area)
        .sort((a, b) => {
          if (sortMode === 'risk') {
            return getRiskWeight(b.area.risk.level) - getRiskWeight(a.area.risk.level);
          }

          if (sortMode === 'name') {
            return a.area.name.localeCompare(b.area.name);
          }

          return new Date(b.favorite.savedAt).getTime() - new Date(a.favorite.savedAt).getTime();
        }),
    [favorites, findAreaById, sortMode],
  );

  const openAreaDetail = (area: AgricultureArea, originTitle = 'Favoritos') => {
    addToHistory(area);
    navigation.navigate('AreaDetail', { areaId: area.id, originTitle });
  };

  return (
    <Screen edges={['top', 'right', 'left']}>
      <FlatList
        data={favoriteItems}
        keyExtractor={(item) => item.area.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerText}>
                <Text style={[styles.title, { color: colors.text }]}>Favoritos</Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>
                  Areas salvas para acesso rapido e historico recente de consulta.
                </Text>
              </View>
              <SettingsIconButton />
            </View>

            <Section title="Historico recente">
              {history.length ? (
                <View style={styles.historyList}>
                  {history.map((item) => {
                    const area = findAreaById(item.areaId);

                    return (
                      <Pressable
                        key={`${item.areaId}-${item.viewedAt}`}
                        onPress={() => {
                          if (area) {
                            openAreaDetail(area);
                          }
                        }}
                        style={({ pressed }) => [
                          styles.historyItem,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            opacity: pressed ? 0.72 : 1,
                          },
                        ]}
                      >
                        <View>
                          <Text style={[styles.historyTitle, { color: colors.text }]}>{item.name}</Text>
                          <Text style={[styles.historyMeta, { color: colors.muted }]}>{item.city}</Text>
                        </View>
                        <Text style={[styles.historyDate, { color: colors.muted }]}>
                          {formatDateTime(item.viewedAt)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <EmptyState
                  icon="time-outline"
                  title="Historico vazio"
                  message="As areas abertas aparecem aqui automaticamente."
                />
              )}
            </Section>

            <View style={styles.sortRow}>
              {sortOptions.map((option) => {
                const active = sortMode === option.key;

                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setSortMode(option.key)}
                    style={({ pressed }) => [
                      styles.sortButton,
                      {
                        backgroundColor: active ? colors.primary : colors.surface,
                        borderColor: active ? colors.primary : colors.border,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <Ionicons name={option.icon} size={15} color={active ? '#FFFFFF' : colors.text} />
                    <Text style={[styles.sortText, { color: active ? '#FFFFFF' : colors.text }]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <FavoriteAreaItem
            area={item}
            onPress={() => openAreaDetail(item.area)}
            onRemove={() => removeFavorite(item.area.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="star-outline"
            title="Nenhum favorito salvo"
            message="Abra uma area monitorada e toque em favoritar para acessar depois."
          />
        }
      />
    </Screen>
  );
}

type FavoriteAreaItemProps = {
  area: FavoriteItem;
  onPress: () => void;
  onRemove: () => void;
};

function FavoriteAreaItem({ area: item, onPress, onRemove }: FavoriteAreaItemProps) {
  const { colors } = useThemeMode();
  const { area, favorite } = item;

  return (
    <View style={[styles.favoriteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.favoriteContent, { opacity: pressed ? 0.72 : 1 }]}
      >
        <View style={styles.favoriteHeader}>
          <View style={styles.favoriteTitleBlock}>
            <Text style={[styles.favoriteTitle, { color: colors.text }]} numberOfLines={1}>
              {area.name}
            </Text>
            <Text style={[styles.favoriteMeta, { color: colors.muted }]}>
              {area.city}, {area.state} | {area.culture}
            </Text>
          </View>
          <RiskBadge level={area.risk.level} compact />
        </View>

        <Text style={[styles.favoriteCoordinate, { color: colors.muted }]}>
          Lat {formatCoordinate(area.coordinates.latitude)} | Lon {formatCoordinate(area.coordinates.longitude)}
        </Text>

        <Text style={[styles.savedAt, { color: colors.primary }]}>
          Favoritado em {formatDateTime(favorite.savedAt)}
        </Text>
      </Pressable>

      <Pressable
        onPress={onRemove}
        style={({ pressed }) => [
          styles.removeButton,
          {
            backgroundColor: colors.surfaceAlt,
            borderColor: colors.border,
            opacity: pressed ? 0.72 : 1,
          },
        ]}
      >
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    gap: 8,
    marginBottom: 2,
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
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  sortButton: {
    minHeight: 36,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '800',
  },
  separator: {
    height: 12,
  },
  favoriteCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoriteContent: {
    flex: 1,
    gap: 10,
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  favoriteTitleBlock: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  favoriteMeta: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  favoriteCoordinate: {
    fontSize: 12,
    fontWeight: '700',
  },
  savedAt: {
    fontSize: 12,
    fontWeight: '900',
  },
  removeButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyList: {
    gap: 10,
  },
  historyItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  historyMeta: {
    fontSize: 12,
    marginTop: 3,
  },
  historyDate: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
});
