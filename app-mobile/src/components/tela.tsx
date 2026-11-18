import { useState, type ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Espaco } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

import { BannerSemInternet } from './banner-sem-internet';

type TelaProps = {
  children: ReactNode;
  aoAtualizar?: () => void;
  atualizando?: boolean;
  dadosDe?: string | null;
  margemSegura?: boolean;
};

export function Tela({ children, aoAtualizar, atualizando = false, dadosDe, margemSegura }: TelaProps) {
  const { cores } = useTema();
  const insets = useSafeAreaInsets();

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
