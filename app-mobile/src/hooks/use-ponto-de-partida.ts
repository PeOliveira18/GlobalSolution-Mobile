import { useCallback } from 'react';

import { useMorador } from '@/contexts/morador';
import { api } from '@/services/api';
import { obterLocalizacao, type Coordenadas } from '@/services/localizacao';
import { distanciaMetros } from '@/utils/geo';

import { useCarregar } from './use-carregar';

export type PontoDePartida = Coordenadas & {
  origem: 'gps' | 'area';
  nomeArea: string;
};

/**
 * De onde medir a distância até os abrigos: a localização do celular, se ela estiver
 * dentro da área do morador; senão, o centro da área (fallback da C3.3).
 */
export function usePontoDePartida() {
  const { areaId } = useMorador();

  const carregar = useCallback(async (): Promise<PontoDePartida> => {
    const [area, gps] = await Promise.all([api.obterArea(areaId!), obterLocalizacao()]);
    const dentroDaArea =
      gps && distanciaMetros(gps.latitude, gps.longitude, area.latitude, area.longitude) <= area.raioMetros;
    return dentroDaArea
      ? { ...gps, origem: 'gps', nomeArea: area.nome }
      : { latitude: area.latitude, longitude: area.longitude, origem: 'area', nomeArea: area.nome };
  }, [areaId]);

  return useCarregar(carregar);
}
