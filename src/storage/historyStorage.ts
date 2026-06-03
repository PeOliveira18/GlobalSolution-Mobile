import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecentHistoryItem } from '../types/agricultureArea';

const HISTORY_KEY = '@agroorbit:history';
const HISTORY_LIMIT = 8;

export const historyStorage = {
  async getAll(): Promise<RecentHistoryItem[]> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async add(item: RecentHistoryItem): Promise<RecentHistoryItem[]> {
    try {
      const currentHistory = await this.getAll();
      const nextHistory = [
        item,
        ...currentHistory.filter((historyItem) => historyItem.areaId !== item.areaId),
      ].slice(0, HISTORY_LIMIT);

      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
      return nextHistory;
    } catch {
      return [];
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch {
      return;
    }
  },
};
