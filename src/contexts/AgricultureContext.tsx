import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { agricultureAreas } from '../data/agricultureAreas';
import { useFavorites } from '../hooks/useFavorites';
import { useRecentHistory } from '../hooks/useRecentHistory';
import { useWeather } from '../hooks/useWeather';
import { AgricultureArea, FavoriteArea } from '../types/agricultureArea';
import { AgriculturalAlert } from '../types/alert';
import { getRiskWeight } from '../utils/riskCalculator';

type AgricultureContextData = {
  areas: AgricultureArea[];
  alerts: AgriculturalAlert[];
  loadingWeather: boolean;
  weatherError: string;
  reloadWeather: () => Promise<void>;
  favorites: FavoriteArea[];
  favoriteIds: string[];
  isFavorite: (areaId: string) => boolean;
  toggleFavorite: (area: AgricultureArea) => Promise<void>;
  removeFavorite: (areaId: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  history: ReturnType<typeof useRecentHistory>['history'];
  addToHistory: (area: AgricultureArea) => Promise<void>;
  clearHistory: () => Promise<void>;
  findAreaById: (areaId: string) => AgricultureArea | undefined;
};

const AgricultureContext = createContext<AgricultureContextData | null>(null);

export function AgricultureProvider({ children }: { children: ReactNode }) {
  const weather = useWeather(agricultureAreas);
  const favorites = useFavorites();
  const recentHistory = useRecentHistory();

  const alerts = useMemo(
    () =>
      weather.areas
        .flatMap((area) => area.alerts)
        .sort((a, b) => getRiskWeight(b.level) - getRiskWeight(a.level)),
    [weather.areas],
  );

  const favoriteIds = useMemo(
    () => favorites.favorites.map((favorite) => favorite.id),
    [favorites.favorites],
  );

  const findAreaById = (areaId: string) => weather.areas.find((area) => area.id === areaId);

  const value = useMemo(
    () => ({
      areas: weather.areas,
      alerts,
      loadingWeather: weather.loading,
      weatherError: weather.error,
      reloadWeather: weather.reload,
      favorites: favorites.favorites,
      favoriteIds,
      isFavorite: favorites.isFavorite,
      toggleFavorite: favorites.toggleFavorite,
      removeFavorite: favorites.removeFavorite,
      clearFavorites: favorites.clearFavorites,
      history: recentHistory.history,
      addToHistory: recentHistory.addToHistory,
      clearHistory: recentHistory.clearHistory,
      findAreaById,
    }),
    [
      alerts,
      favoriteIds,
      favorites.clearFavorites,
      favorites.favorites,
      favorites.isFavorite,
      favorites.removeFavorite,
      favorites.toggleFavorite,
      recentHistory.addToHistory,
      recentHistory.clearHistory,
      recentHistory.history,
      weather.areas,
      weather.error,
      weather.loading,
      weather.reload,
    ],
  );

  return <AgricultureContext.Provider value={value}>{children}</AgricultureContext.Provider>;
}

export function useAgriculture() {
  const context = useContext(AgricultureContext);

  if (!context) {
    throw new Error('useAgriculture deve ser usado dentro de AgricultureProvider');
  }

  return context;
}
