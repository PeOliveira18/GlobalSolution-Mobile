import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

import { lerPreferencias, salvarPreferencia } from '@/db/repositorio';
import { api, ErroApi } from '@/services/api';
import type { Area } from '@/types';

import { useCarregar } from './use-carregar';

/**
 * Lista das áreas de risco (GET /api/areas), guardada no SQLite.
 * Sem internet, usa a última lista salva: assim dá para reportar offline.
 */
export function useAreas() {
  const db = useSQLiteContext();

  const carregar = useCallback(async (): Promise<Area[]> => {
    try {
      const areas = await api.listarAreas();
      await salvarPreferencia(db, 'areas', JSON.stringify(areas));
      return areas;
    } catch (erro) {
      if (erro instanceof ErroApi && erro.temporario) {
        const guardadas = (await lerPreferencias(db)).areas;
        if (guardadas) return JSON.parse(guardadas) as Area[];
      }
      throw erro;
    }
  }, [db]);

  return useCarregar(carregar);
}
