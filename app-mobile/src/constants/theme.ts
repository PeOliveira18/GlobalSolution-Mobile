/**
 * Tema do Olho d'Água (C3.5 do PLANO.md).
 *
 * - Paleta padrão: fundo branco, todas as cores de texto com contraste AA (≥ 4,5:1).
 * - Paleta de alto contraste: fundo preto, texto branco, destaques amarelos e faixas com borda.
 * - A faixa do córrego nunca depende só da cor: sempre cor + ícone + texto (FAIXAS).
 *
 * O contexto que escolhe a paleta e a escala da fonte fica em `contexts/tema.tsx`.
 */

import type { SymbolViewProps } from 'expo-symbols';

import type { Faixa } from '@/types';

export type CoresFaixa = {
  /** Cor do ícone, do texto da faixa e da borda do cartão. */
  cor: string;
  /** Fundo do cartão de nível. */
  fundo: string;
};

export type Paleta = {
  fundo: string;
  superficie: string;
  texto: string;
  textoSecundario: string;
  primaria: string;
  /** Texto sobre um botão com fundo `primaria`. */
  sobrePrimaria: string;
  /** Fundo de destaque suave (ex.: aba selecionada). */
  primariaSuave: string;
  borda: string;
  perigo: string;
  faixas: Record<Faixa, CoresFaixa>;
};

export const PALETA_PADRAO: Paleta = {
  fundo: '#FFFFFF',
  superficie: '#F2F5F8',
  texto: '#1A1A1A',
  textoSecundario: '#4A4A4A',
  primaria: '#0B5394',
  sobrePrimaria: '#FFFFFF',
  primariaSuave: '#E3EEF9',
  borda: '#6B7580',
  perigo: '#B3261E',
  faixas: {
    NORMAL: { cor: '#1B7F3B', fundo: '#E6F4EA' },
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
  perigo: '#FF6B6B',
  faixas: {
    NORMAL: { cor: '#4CE07A', fundo: '#000000' },
    ATENCAO: { cor: '#FFD600', fundo: '#000000' },
    ALERTA: { cor: '#FF9E40', fundo: '#000000' },
    EMERGENCIA: { cor: '#FF6B6B', fundo: '#000000' },
  },
};

/** Texto, explicação e ícone de cada faixa, iguais nas duas paletas. */
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

export const Espaco = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

/**
 * Tamanhos de fonte em pontos. Por cima deles entram a escala do sistema
 * (fontScale, aplicada pelo próprio React Native) e a preferência "fonte grande".
 */
export const Fonte = {
  legenda: 16,
  corpo: 18,
  subtitulo: 21,
  titulo: 26,
} as const;

/** Preferência "fonte grande" do Perfil (C3.3). */
export const ESCALA_FONTE_GRANDE = 1.3;

/** Alvo de toque mínimo exigido na C3.5 (48 × 48 dp). */
export const ALVO_TOQUE_MINIMO = 48;
