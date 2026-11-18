import type { SymbolViewProps } from 'expo-symbols';

import type { Faixa, Severidade, StatusOcorrencia, TipoAlerta, TipoOcorrencia } from '@/types';

type Visual = { rotulo: string; icone: SymbolViewProps['name'] };

export const TIPOS_OCORRENCIA: Record<TipoOcorrencia, Visual & { dica: string }> = {
  RUA_ALAGADA: {
    rotulo: 'Rua alagada',
    dica: 'A água tomou a rua',
    icone: { ios: 'cloud.heavyrain.fill', android: 'flood', web: 'flood' },
  },
  CORREGO_TRANSBORDANDO: {
    rotulo: 'Córrego transbordando',
    dica: 'A água do córrego passou da margem',
    icone: { ios: 'water.waves', android: 'waves', web: 'waves' },
  },
  IMOVEL_ATINGIDO: {
    rotulo: 'Casa atingida',
    dica: 'A água entrou em casa ou em outro imóvel',
    icone: { ios: 'house.fill', android: 'water_damage', web: 'water_damage' },
  },
  BUEIRO_ENTUPIDO: {
    rotulo: 'Bueiro entupido',
    dica: 'O bueiro não está escoando a água',
    icone: { ios: 'xmark.octagon.fill', android: 'plumbing', web: 'plumbing' },
  },
};

export const SEVERIDADES: Record<Severidade, { rotulo: string; faixaVisual: Faixa }> = {
  BAIXA: { rotulo: 'Aviso', faixaVisual: 'ATENCAO' },
  MEDIA: { rotulo: 'Atenção', faixaVisual: 'ATENCAO' },
  ALTA: { rotulo: 'Alerta', faixaVisual: 'ALERTA' },
  CRITICA: { rotulo: 'Emergência', faixaVisual: 'EMERGENCIA' },
};

export const TIPOS_ALERTA: Record<TipoAlerta, string> = {
  SENSOR: 'Sensor do córrego',
  COMUNITARIO: 'Relatos dos vizinhos',
  PREVISAO: 'Previsão de chuva',
};

export const STATUS_OCORRENCIA: Record<StatusOcorrencia, string> = {
  ABERTA: 'Aguardando confirmação',
  CONFIRMADA: 'Confirmado pelos vizinhos',
  RESOLVIDA: 'Resolvido',
};
