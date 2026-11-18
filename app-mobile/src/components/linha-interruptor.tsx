import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { ALVO_TOQUE_MINIMO, Espaco, Raio } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

import { Texto } from './texto';

type LinhaInterruptorProps = {
  rotulo: string;
  descricao?: string;
  dica: string;
  ligado: boolean;
  aoMudar: (ligado: boolean) => void;
  agrupada?: boolean;
};

export function LinhaInterruptor({ rotulo, descricao, dica, ligado, aoMudar, agrupada }: LinhaInterruptorProps) {
  const { cores } = useTema();

  return (
    <Pressable
      onPress={() => aoMudar(!ligado)}
      role="switch"
      aria-label={rotulo}
      aria-checked={ligado}
      accessibilityHint={dica}
      style={({ pressed }) => [
        styles.linha,
        agrupada
          ? { borderWidth: 0, borderRadius: 0, backgroundColor: pressed ? cores.primariaSuave : 'transparent' }
          : {
              borderColor: cores.bordaSuave,
              backgroundColor: pressed ? cores.primariaSuave : cores.superficie,
              boxShadow: cores.sombra ?? undefined,
            },
      ]}>
      <View style={styles.textos}>
        <Texto negrito>{rotulo}</Texto>
        {descricao ? (
          <Texto variante="legenda" tom="secundario">
            {descricao}
          </Texto>
        ) : null}
      </View>
      <View pointerEvents="none" aria-hidden importantForAccessibility="no-hide-descendants">
        <Switch
          value={ligado}
          trackColor={{ false: cores.borda, true: cores.primaria }}
          thumbColor={ligado ? cores.sobrePrimaria : '#FFFFFF'}
          focusable={false}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linha: {
    minHeight: ALVO_TOQUE_MINIMO + Espaco.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    paddingHorizontal: Espaco.md,
    paddingVertical: Espaco.sm,
    borderWidth: 1,
    borderRadius: Raio.lg,
  },
  textos: {
    flex: 1,
    gap: Espaco.xs,
  },
});
