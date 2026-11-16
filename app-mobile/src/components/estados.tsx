import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Espaco } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

import { Botao } from './botao';
import { Cartao } from './cartao';
import { Icone } from './icone';
import { Texto } from './texto';

/** Indicador de carregamento com texto (o leitor de tela anuncia "Carregando…"). */
export function Carregando({ texto = 'Carregando…' }: { texto?: string }) {
  const { cores } = useTema();
  return (
    <View style={styles.linha} accessible accessibilityLabel={texto} accessibilityLiveRegion="polite">
      <ActivityIndicator color={cores.primaria} />
      <Texto tom="secundario">{texto}</Texto>
    </View>
  );
}

/** Mensagem de erro em linguagem simples, com botão para tentar de novo. */
export function ErroCarregar({ mensagem, aoTentarDeNovo }: { mensagem: string; aoTentarDeNovo?: () => void }) {
  const { cores } = useTema();
  return (
    <Cartao style={{ borderColor: cores.perigo }}>
      <View style={styles.linha} accessible accessibilityLiveRegion="polite">
        <Icone nome={{ ios: 'wifi.exclamationmark', android: 'error', web: 'error' }} cor={cores.perigo} />
        <Texto style={{ flex: 1 }}>{mensagem}</Texto>
      </View>
      {aoTentarDeNovo ? (
        <Botao
          rotulo="Tentar de novo"
          dica="Carrega as informações outra vez"
          variante="secundario"
          icone={{ ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' }}
          aoPressionar={aoTentarDeNovo}
        />
      ) : null}
    </Cartao>
  );
}

/** Aviso curto de sucesso ou informação, anunciado pelo leitor de tela quando aparece. */
export function Aviso({ texto, tipo = 'info' }: { texto: string; tipo?: 'info' | 'sucesso' | 'erro' }) {
  const { cores } = useTema();
  const cor = tipo === 'erro' ? cores.perigo : tipo === 'sucesso' ? cores.faixas.NORMAL.cor : cores.primaria;
  const icone =
    tipo === 'erro'
      ? ({ ios: 'exclamationmark.circle.fill', android: 'error', web: 'error' } as const)
      : tipo === 'sucesso'
        ? ({ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' } as const)
        : ({ ios: 'info.circle.fill', android: 'info', web: 'info' } as const);

  return (
    <View
      accessible
      accessibilityLiveRegion="polite"
      role="alert"
      style={[styles.aviso, { borderColor: cor, backgroundColor: cores.superficie }]}>
      <Icone nome={icone} cor={cor} />
      <Texto style={{ flex: 1 }}>{texto}</Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
    borderWidth: 2,
    borderRadius: 12,
    padding: Espaco.md,
  },
});
