import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { ALVO_TOQUE_MINIMO, Espaco } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

import { Texto } from './texto';

type LinhaInterruptorProps = {
  rotulo: string;
  descricao?: string;
  dica: string;
  ligado: boolean;
  aoMudar: (ligado: boolean) => void;
};

/**
 * Linha inteira tocável com um interruptor (Switch).
 * Para o leitor de tela, a linha é um único "interruptor" com nome, estado e dica.
 */
export function LinhaInterruptor({ rotulo, descricao, dica, ligado, aoMudar }: LinhaInterruptorProps) {
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
        { borderColor: cores.borda, backgroundColor: pressed ? cores.primariaSuave : cores.superficie },
      ]}>
      <View style={styles.textos}>
        <Texto negrito>{rotulo}</Texto>
        {descricao ? (
          <Texto variante="legenda" tom="secundario">
            {descricao}
          </Texto>
        ) : null}
      </View>
      {/* Só visual: o nome e o estado já são anunciados pela linha inteira, e o toque também é dela. */}
      <View pointerEvents="none" aria-hidden importantForAccessibility="no-hide-descendants">
        <Switch
          value={ligado}
          trackColor={{ false: cores.borda, true: cores.primaria }}
          thumbColor={ligado ? cores.sobrePrimaria : cores.fundo}
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
    borderRadius: 12,
  },
  textos: {
    flex: 1,
    gap: Espaco.xs,
  },
});
