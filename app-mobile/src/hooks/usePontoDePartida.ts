import { useCallback } from 'react';

import { useMorador } from '@/contexts/MoradorContext';
import { api } from '@/services/api';
import { obterLocalizacao, type Coordenadas } from '@/services/localizacaoService';
import { distanciaMetros } from '@/utils/geo';

import { useCarregar } from '@/hooks/useCarregar';

export type PontoDePartida = Coordenadas & {
  origem: 'gps' | 'area';
  nomeArea: string;
};

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
