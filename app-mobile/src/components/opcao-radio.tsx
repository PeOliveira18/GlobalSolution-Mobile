import type { SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ALVO_TOQUE_MINIMO, Espaco } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

import { Icone } from './icone';
import { Texto } from './texto';

type OpcaoRadioProps = {
  rotulo: string;
  descricao?: string;
  dica: string;
  selecionada: boolean;
  aoSelecionar: () => void;
  icone?: SymbolViewProps['name'];
};

/**
 * Uma opção de uma lista de escolha única (área, tipo de relato...).
 * A selecionada fica com borda grossa e um ✓, além da cor (nunca só a cor).
 */
export function OpcaoRadio({ rotulo, descricao, dica, selecionada, aoSelecionar, icone }: OpcaoRadioProps) {
  const { cores, tamanho } = useTema();

  return (
    <Pressable
      onPress={aoSelecionar}
      role="radio"
      aria-label={descricao ? `${rotulo}, ${descricao}` : rotulo}
      aria-checked={selecionada}
      accessibilityHint={dica}
      style={({ pressed }) => [
        styles.opcao,
        {
          borderColor: selecionada ? cores.primaria : cores.borda,
          borderWidth: selecionada ? 3 : 1,
          backgroundColor: selecionada ? cores.primariaSuave : cores.superficie,
          opacity: pressed ? 0.8 : 1,
        },
      ]}>
      {icone ? <Icone nome={icone} cor={selecionada ? cores.primaria : cores.texto} tamanho={tamanho(30)} /> : null}
      <View style={styles.textos}>
        <Texto negrito>{rotulo}</Texto>
        {descricao ? (
          <Texto variante="legenda" tom="secundario">
            {descricao}
          </Texto>
        ) : null}
      </View>
      <View style={[styles.marca, { borderColor: selecionada ? cores.primaria : cores.borda }]}>
        {selecionada ? (
          <Icone nome={{ ios: 'checkmark', android: 'check', web: 'check' }} cor={cores.primaria} tamanho={20} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  opcao: {
    minHeight: ALVO_TOQUE_MINIMO + Espaco.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    paddingHorizontal: Espaco.md,
    paddingVertical: Espaco.sm,
    borderRadius: 12,
  },
  textos: {
    flex: 1,
    gap: Espaco.xs,
  },
  marca: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
