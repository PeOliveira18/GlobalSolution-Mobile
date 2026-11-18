import type { SymbolViewProps } from 'expo-symbols';

import type { Faixa } from '@/types';

export type CoresFaixa = {
  cor: string;
  fundo: string;
};

export type Paleta = {
  fundo: string;
  superficie: string;
  texto: string;
  textoSecundario: string;
  primaria: string;
  sobrePrimaria: string;
  primariaSuave: string;
  borda: string;
  bordaSuave: string;
  sombra: string | null;
  secundarioFundo: string;
  secundarioBorda: string;
  perigo: string;
  faixas: Record<Faixa, CoresFaixa>;
};

export const PALETA_PADRAO: Paleta = {
  fundo: '#F2F4F7',
  superficie: '#FFFFFF',
  texto: '#101828',
  textoSecundario: '#475467',
  primaria: '#0A5CB8',
  sobrePrimaria: '#FFFFFF',
  primariaSuave: '#E5EFFB',
  borda: '#6B7580',
  bordaSuave: '#E4E7EC',
  sombra: '0px 1px 2px rgba(16, 24, 40, 0.06), 0px 4px 14px rgba(16, 24, 40, 0.07)',
  secundarioFundo: '#E5EFFB',
  secundarioBorda: '#E5EFFB',
  perigo: '#B3261E',
  faixas: {
    NORMAL: { cor: '#15703A', fundo: '#E6F4EA' },
    ATENCAO: { cor: '#8A5A00', fundo: '#FFF4D6' },
    ALERTA: { cor: '#B34700', fundo: '#FDE9DC' },
    EMERGENCIA: { cor: '#B3261E', fundo: '#FBE3E1' },
  },
};

export const PALETA_ALTO_CONTRASTE: Paleta = {
  fundo: '#000000',
  superficie: '#000000',
  texto: '#FFFFFF',
  textoSecundario: '#FFFFFF',
  primaria: '#FFD600',
  sobrePrimaria: '#000000',
  primariaSuave: '#333300',
  borda: '#FFFFFF',
  bordaSuave: '#FFFFFF',
  sombra: null,
  secundarioFundo: '#000000',
  secundarioBorda: '#FFD600',
  perigo: '#FF6B6B',
  faixas: {
    NORMAL: { cor: '#4CE07A', fundo: '#000000' },
    ATENCAO: { cor: '#FFD600', fundo: '#000000' },
    ALERTA: { cor: '#FF9E40', fundo: '#000000' },
    EMERGENCIA: { cor: '#FF6B6B', fundo: '#000000' },
  },
};

export const FAIXAS: Record<Faixa, { rotulo: string; explicacao: string; icone: SymbolViewProps['name'] }> = {
  NORMAL: {
    rotulo: 'Normal',
    explicacao: 'O córrego está no nível normal.',
    icone: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  },
  ATENCAO: {
    rotulo: 'Atenção',
    explicacao: 'O córrego está subindo. Fique atento.',
    icone: { ios: 'exclamationmark.circle.fill', android: 'info', web: 'info' },
  },
  ALERTA: {
    rotulo: 'Alerta',
    explicacao: 'O córrego está alto. Prepare-se para sair de casa.',
    icone: { ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' },
  },
  EMERGENCIA: {
    rotulo: 'Emergência',
    explicacao: 'Risco de alagamento agora. Saia de casa e vá para um abrigo.',
    icone: { ios: 'exclamationmark.octagon.fill', android: 'report', web: 'report' },
  },
};

export const Raio = {
  sm: 10,
  md: 14,
  lg: 18,
  pilula: 999,
} as const;

export const Espaco = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const Fonte = {
  legenda: 16,
  corpo: 18,
  subtitulo: 21,
  titulo: 26,
  marca: 32,
  destaque: 44,
} as const;

export const ORDEM_FAIXAS: Faixa[] = ['NORMAL', 'ATENCAO', 'ALERTA', 'EMERGENCIA'];

export const ESCALA_FONTE_GRANDE = 1.3;

export const ALVO_TOQUE_MINIMO = 48;
