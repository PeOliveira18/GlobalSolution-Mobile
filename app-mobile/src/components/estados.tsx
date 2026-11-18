import type { SymbolViewProps } from 'expo-symbols';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Espaco, Raio } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

import { Botao } from './botao';
import { Cartao } from './cartao';
import { Icone } from './icone';
import { Texto } from './texto';

export function Carregando({ texto = 'Carregando…' }: { texto?: string }) {
  const { cores } = useTema();
  return (
    <View style={styles.linha} accessible accessibilityLabel={texto} accessibilityLiveRegion="polite">
      <ActivityIndicator color={cores.primaria} />
      <Texto tom="secundario">{texto}</Texto>
    </View>
  );
}

export function ErroCarregar({ mensagem, aoTentarDeNovo }: { mensagem: string; aoTentarDeNovo?: () => void }) {
  const { cores } = useTema();
  return (
    <Cartao style={{ borderColor: cores.perigo, borderWidth: 2 }}>
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

export function EstadoVazio({
  texto,
  icone,
  positivo,
}: {
  texto: string;
  icone: SymbolViewProps['name'];
  positivo?: boolean;
}) {
  const { cores, tamanho, preferencias } = useTema();
  const cor = positivo ? cores.faixas.NORMAL.cor : cores.primaria;
  const fundo = positivo ? cores.faixas.NORMAL.fundo : cores.primariaSuave;
  const tamanhoIcone = tamanho(26);

  return (
    <Cartao style={styles.vazio}>
      <View
        style={[
          styles.circulo,
          {
            backgroundColor: fundo,
            borderColor: preferencias.altoContraste ? cor : fundo,
            width: tamanhoIcone + 26,
            height: tamanhoIcone + 26,
          },
        ]}>
        <Icone nome={icone} cor={cor} tamanho={tamanhoIcone} />
      </View>
      <Texto style={{ textAlign: 'center' }}>{texto}</Texto>
    </Cartao>
  );
}

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
  vazio: {
    alignItems: 'center',
    paddingVertical: Espaco.lg,
    gap: Espaco.sm + 2,
  },
  circulo: {
    borderRadius: Raio.pilula,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
    borderWidth: 2,
    borderRadius: Raio.lg,
    padding: Espaco.md,
  },
});
