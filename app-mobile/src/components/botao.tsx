import type { SymbolViewProps } from 'expo-symbols';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ALVO_TOQUE_MINIMO, Espaco, Fonte, Raio } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

import { Icone } from './icone';
import { Texto } from './texto';

type BotaoProps = {
  rotulo: string;
  /** O que acontece ao tocar (lido pelo leitor de tela depois do nome). */
  dica: string;
  aoPressionar: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
  icone?: SymbolViewProps['name'];
  desabilitado?: boolean;
  carregando?: boolean;
  /** Botão maior, para a ação principal da tela. */
  grande?: boolean;
};

/** Botão com alvo de toque ≥ 48 dp, ícone + texto e acessibilidade completa (C3.5). */
export function Botao({
  rotulo,
  dica,
  aoPressionar,
  variante = 'primario',
  icone,
  desabilitado,
  carregando,
  grande,
}: BotaoProps) {
  const { cores, tamanho } = useTema();
  const inativo = desabilitado || carregando;

  const fundo =
    variante === 'primario' ? cores.primaria : variante === 'perigo' ? cores.perigo : cores.secundarioFundo;
  const corTexto = variante === 'secundario' ? cores.primaria : cores.sobrePrimaria;
  // No alto contraste o secundário é preto com borda amarela; na paleta padrão, azul-claro sem borda visível.
  const borda = variante === 'secundario' ? cores.secundarioBorda : fundo;

  return (
    <Pressable
      onPress={aoPressionar}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityHint={dica}
      accessibilityState={{ disabled: !!inativo, busy: !!carregando }}
      style={({ pressed }) => [
        styles.botao,
        {
          minHeight: grande ? ALVO_TOQUE_MINIMO + Espaco.lg : ALVO_TOQUE_MINIMO + Espaco.sm,
          backgroundColor: fundo,
          borderColor: borda,
          opacity: inativo ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}>
      <View style={styles.conteudo}>
        {carregando ? (
          <ActivityIndicator color={corTexto} />
        ) : icone ? (
          <Icone nome={icone} cor={corTexto} tamanho={tamanho(grande ? 28 : 22)} />
        ) : null}
        <Texto
          negrito
          style={{
            color: corTexto,
            fontSize: tamanho(grande ? Fonte.subtitulo : Fonte.corpo),
            textAlign: 'center',
            flexShrink: 1,
          }}>
          {rotulo}
        </Texto>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    borderWidth: 2,
    borderRadius: Raio.md,
    paddingHorizontal: Espaco.md,
    paddingVertical: Espaco.sm,
    justifyContent: 'center',
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaco.sm,
  },
});
