import { useState, type ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Espaco } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

import { BannerSemInternet } from './banner-sem-internet';

type TelaProps = {
  children: ReactNode;
  /** Liga o "puxar para atualizar". */
  aoAtualizar?: () => void;
  atualizando?: boolean;
  /** Quando a tela mostra dados guardados no celular, a hora em que eles foram salvos. */
  dadosDe?: string | null;
  /** Para telas sem cabeçalho (onboarding): afasta o conteúdo da barra de status e do indicador de início. */
  margemSegura?: boolean;
};

/**
 * Área rolável padrão das telas: fundo do tema, banner "Sem internet" no topo
 * e o "puxar para atualizar" opcional.
 */
export function Tela({ children, aoAtualizar, atualizando = false, dadosDe, margemSegura }: TelaProps) {
  const { cores } = useTema();
  const insets = useSafeAreaInsets();

  // O indicador só aparece quando o morador puxa a tela. Nas recargas automáticas (ex.: ao voltar
  // para a aba), ligar e desligar o indicador rápido deixava um espaço em branco no topo no iOS.
  const [puxou, setPuxou] = useState(false);
  const [atualizandoAntes, setAtualizandoAntes] = useState(atualizando);
  if (atualizando !== atualizandoAntes) {
    setAtualizandoAntes(atualizando);
    if (!atualizando) setPuxou(false);
  }

  const puxar = () => {
    setPuxou(true);
    aoAtualizar?.();
  };

  const rolagem = (
    <ScrollView
      style={{ flex: 1, backgroundColor: cores.fundo }}
      contentContainerStyle={[
        styles.conteudo,
        margemSegura && { paddingTop: insets.top + Espaco.md, paddingBottom: insets.bottom + Espaco.xl },
      ]}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        aoAtualizar ? (
          <RefreshControl
            refreshing={puxou && atualizando}
            onRefresh={puxar}
            tintColor={cores.primaria}
            colors={[cores.primaria]}
            accessibilityLabel="Puxe para atualizar"
          />
        ) : undefined
      }>
      <BannerSemInternet dadosDe={dadosDe} />
      {children}
    </ScrollView>
  );

  if (!margemSegura) return rolagem;

  // Sem cabeçalho, o conteúdo passaria por baixo do relógio: uma faixa da cor do fundo cobre a barra de status.
  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      {rolagem}
      <View pointerEvents="none" style={[styles.barraStatus, { height: insets.top, backgroundColor: cores.fundo }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  barraStatus: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  conteudo: {
    padding: Espaco.md,
    paddingBottom: Espaco.xl,
    gap: Espaco.md,
  },
});
