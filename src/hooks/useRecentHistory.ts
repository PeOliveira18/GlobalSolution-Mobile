import { useCallback, useEffect, useState } from 'react';
import { AgricultureArea, RecentHistoryItem } from '../types/agricultureArea';
import { historyStorage } from '../storage/historyStorage';

const RECENT_HISTORY_LIMIT = 8;

export function useRecentHistory() {
  const [history, setHistory] = useState<RecentHistoryItem[]>([]);

  const loadHistory = useCallback(async () => {
    const data = await historyStorage.getAll();
    setHistory(data);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addToHistory = useCallback(async (area: AgricultureArea) => {
    const historyItem = {
      areaId: area.id,
      name: area.name,
      city: area.city,
      viewedAt: new Date().toISOString(),
    };

    setHistory((currentHistory) =>
      [
        historyItem,
        ...currentHistory.filter((item) => item.areaId !== historyItem.areaId),
      ].slice(0, RECENT_HISTORY_LIMIT),
    );

    await historyStorage.add(historyItem);
  }, []);

  const clearHistory = useCallback(async () => {
    await historyStorage.clear();
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    reload: loadHistory,
  };
}
