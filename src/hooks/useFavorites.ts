import { useCallback, useEffect, useState } from 'react';
import { AgricultureArea, FavoriteArea } from '../types/agricultureArea';
import { favoritesStorage } from '../storage/favoritesStorage';
import { notificationService } from '../services/notificationService';

function mapAreaToFavorite(area: AgricultureArea): FavoriteArea {
  return {
    id: area.id,
    name: area.name,
    city: area.city,
    state: area.state,
    culture: area.culture,
    savedAt: new Date().toISOString(),
  };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteArea[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const data = await favoritesStorage.getAll();
      setFavorites(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isFavorite = useCallback(
    (areaId: string) => favorites.some((favorite) => favorite.id === areaId),
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (area: AgricultureArea) => {
      const exists = favorites.some((favorite) => favorite.id === area.id);
      const nextFavorites = exists
        ? favorites.filter((favorite) => favorite.id !== area.id)
        : [mapAreaToFavorite(area), ...favorites];

      setFavorites(nextFavorites);
      await favoritesStorage.saveAll(nextFavorites);

      if (!exists) {
        await notificationService.notifySavedRegion(area);
      }
    },
    [favorites],
  );

  const removeFavorite = useCallback(
    async (areaId: string) => {
      const nextFavorites = favorites.filter((favorite) => favorite.id !== areaId);
      setFavorites(nextFavorites);
      await favoritesStorage.saveAll(nextFavorites);
    },
    [favorites],
  );

  const clearFavorites = useCallback(async () => {
    await favoritesStorage.clear();
    setFavorites([]);
  }, []);

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    reload: loadFavorites,
  };
}
