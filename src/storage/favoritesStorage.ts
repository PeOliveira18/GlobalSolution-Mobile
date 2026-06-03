import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteArea } from '../types/agricultureArea';

const FAVORITES_KEY = '@agroorbit:favorites';

export const favoritesStorage = {
  async getAll(): Promise<FavoriteArea[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveAll(favorites: FavoriteArea[]): Promise<void> {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      return;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
    } catch {
      return;
    }
  },
};
