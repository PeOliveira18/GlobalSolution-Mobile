/**
 * Tema do Olho d'Água (C3.5 do PLANO.md).
 *
 * - Paleta padrão: fundo cinza-claro com cartões brancos (estilo iOS); todas as cores de texto
 *   com contraste AA (≥ 4,5:1) sobre o fundo, os cartões e os fundos das faixas.
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
  /** Fundo das telas. */
  fundo: string;
  /** Fundo dos cartões, campos e da barra de abas. */
  superficie: string;
  texto: string;
  textoSecundario: string;
  primaria: string;
  /** Texto sobre um botão com fundo `primaria`. */
  sobrePrimaria: string;
  /** Fundo de destaque suave (ex.: aba selecionada, opção escolhida). */
  primariaSuave: string;
  /** Borda que identifica um controle (campo de texto, marca da opção): ≥ 3:1 com o fundo. */
  borda: string;
  /** Contorno decorativo dos cartões. No alto contraste vira borda branca. */
  bordaSuave: string;
  /** Sombra dos cartões (boxShadow), ou null para não ter sombra (alto contraste). */
  sombra: string | null;
  /** Fundo e borda do botão secundário. */
  secundarioFundo: string;
  secundarioBorda: string;
  perigo: string;
  faixas: Record<Faixa, CoresFaixa>;
};

/*
 * Contraste da paleta padrão (WCAG 2.1, conferido para cada par usado):
 * - texto #101828: 16,1:1 no fundo, 17,8:1 no cartão
 * - textoSecundario #475467: 7,0:1 no fundo, 7,7:1 no cartão, ≥ 6,3:1 nos fundos das faixas
 * - primaria #0A5CB8: 6,5:1 no cartão, 5,9:1 no fundo, 5,6:1 na primariaSuave; branco sobre ela 6,5:1
 * - borda #6B7580: 4,7:1 no cartão, 4,3:1 no fundo, 4,0:1 na primariaSuave (mínimo 3:1)
 * - faixas (cor sobre o próprio fundo): normal 5,4 · atenção 5,4 · alerta 4,7 · emergência 5,4
 */
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

/** Cantos arredondados. */
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

/**
 * Tamanhos de fonte em pontos. Por cima deles entram a escala do sistema
 * (fontScale, aplicada pelo próprio React Native) e a preferência "fonte grande".
 */
export const Fonte = {
  legenda: 16,
  corpo: 18,
  subtitulo: 21,
  titulo: 26,
  /** Nome do app no onboarding. */
  marca: 32,
  /** Número em destaque (ex.: o nível do córrego no Início). */
  destaque: 44,
} as const;

/** Ordem das faixas, da mais tranquila à mais grave (usada na régua do Início). */
export const ORDEM_FAIXAS: Faixa[] = ['NORMAL', 'ATENCAO', 'ALERTA', 'EMERGENCIA'];

/** Preferência "fonte grande" do Perfil (C3.3). */
export const ESCALA_FONTE_GRANDE = 1.3;

/** Alvo de toque mínimo exigido na C3.5 (48 × 48 dp). */
export const ALVO_TOQUE_MINIMO = 48;
