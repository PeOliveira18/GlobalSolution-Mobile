import { useCallback } from 'react';

import { lerPreferencias, salvarPreferencia } from '@/services/storageService';
import { api, ErroApi } from '@/services/api';
import type { Area } from '@/types';

import { useCarregar } from '@/hooks/useCarregar';

export function useAreas() {
  const carregar = useCallback(async (): Promise<Area[]> => {
    try {
      const areas = await api.listarAreas();
      await salvarPreferencia('areas', JSON.stringify(areas));
      return areas;
    } catch (erro) {
      if (erro instanceof ErroApi && erro.temporario) {
        const guardadas = (await lerPreferencias()).areas;
        if (guardadas) return JSON.parse(guardadas) as Area[];
      }
      throw erro;
    }
  }, []);

  return useCarregar(carregar);
}
