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
  /** Linha dentro de um `Grupo` (estilo Ajustes): sem borda nem sombra próprias. */
  agrupada?: boolean;
};

/**
 * Linha inteira tocável com um interruptor (Switch).
 * Para o leitor de tela, a linha é um único "interruptor" com nome, estado e dica.
 */
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
      {/* Só visual: o nome e o estado já são anunciados pela linha inteira, e o toque também é dela. */}
      <View pointerEvents="none" aria-hidden importantForAccessibility="no-hide-descendants">
        <Switch
          value={ligado}
          trackColor={{ false: cores.borda, true: cores.primaria }}
          // Desligado, a bolinha fica branca nas duas paletas: no alto contraste, preta sumiria no trilho escuro.
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
