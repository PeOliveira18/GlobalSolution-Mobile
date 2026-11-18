import type { SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ALVO_TOQUE_MINIMO, Espaco, Raio } from '@/constants/theme';
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
  agrupada?: boolean;
};

export function OpcaoRadio({ rotulo, descricao, dica, selecionada, aoSelecionar, icone, agrupada }: OpcaoRadioProps) {
  const { cores, tamanho } = useTema();
  const tamanhoIcone = tamanho(26);

  return (
    <Pressable
      onPress={aoSelecionar}
      role="radio"
      aria-label={descricao ? `${rotulo}, ${descricao}` : rotulo}
      aria-checked={selecionada}
      accessibilityHint={dica}
      style={({ pressed }) => [
        styles.opcao,
        agrupada
          ? { borderRadius: 0, backgroundColor: selecionada || pressed ? cores.primariaSuave : 'transparent' }
          : {
              borderColor: selecionada ? cores.primaria : cores.bordaSuave,
              borderWidth: selecionada ? 3 : 1,
              backgroundColor: selecionada ? cores.primariaSuave : cores.superficie,
              boxShadow: selecionada ? undefined : (cores.sombra ?? undefined),
              opacity: pressed ? 0.85 : 1,
            },
      ]}>
      {icone ? (
        <View
          style={[
            styles.quadroIcone,
            {
              width: tamanhoIcone + Espaco.md,
              height: tamanhoIcone + Espaco.md,
              backgroundColor: selecionada ? cores.primaria : cores.primariaSuave,
            },
          ]}>
          <Icone nome={icone} cor={selecionada ? cores.sobrePrimaria : cores.primaria} tamanho={tamanhoIcone} />
        </View>
      ) : null}
      <View style={styles.textos}>
        <Texto negrito>{rotulo}</Texto>
        {descricao ? (
          <Texto variante="legenda" tom="secundario">
            {descricao}
          </Texto>
        ) : null}
      </View>
      <View
        style={[
          styles.marca,
          selecionada
            ? { borderColor: cores.primaria, backgroundColor: cores.primaria }
            : { borderColor: cores.borda, backgroundColor: cores.superficie },
        ]}>
        {selecionada ? (
          <Icone nome={{ ios: 'checkmark', android: 'check', web: 'check' }} cor={cores.sobrePrimaria} tamanho={16} />
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
    paddingVertical: Espaco.sm + 2,
    borderRadius: Raio.lg,
  },
  quadroIcone: {
    borderRadius: Raio.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    gap: 2,
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
