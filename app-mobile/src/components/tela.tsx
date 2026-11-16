import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

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
};

/**
 * Área rolável padrão das telas: fundo do tema, banner "Sem internet" no topo
 * e o "puxar para atualizar" opcional.
 */
export function Tela({ children, aoAtualizar, atualizando = false, dadosDe }: TelaProps) {
  const { cores } = useTema();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: cores.fundo }}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        aoAtualizar ? (
          <RefreshControl
            refreshing={atualizando}
            onRefresh={aoAtualizar}
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
}

const styles = StyleSheet.create({
  conteudo: {
    padding: Espaco.md,
    paddingBottom: Espaco.xl,
    gap: Espaco.md,
  },
});
