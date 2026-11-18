import { StyleSheet, View } from 'react-native';

import { Espaco, FAIXAS, ORDEM_FAIXAS } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import type { Faixa } from '@/types';

import { Texto } from './texto';

/**
 * Régua das 4 faixas do córrego (Normal → Emergência): as faixas até a atual ficam preenchidas
 * com a cor de cada uma, e a atual é mais alta. É só visual: o leitor de tela já ouve o nome
 * da faixa e a medida no SeloFaixa, então a régua fica escondida dele.
 */
export function ReguaFaixas({ faixa }: { faixa: Faixa }) {
  const { cores } = useTema();
  const atual = ORDEM_FAIXAS.indexOf(faixa);

  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={{ gap: Espaco.xs }}>
      <View style={styles.barra}>
        {ORDEM_FAIXAS.map((f, i) => {
          const preenchida = i <= atual;
          const cor = cores.faixas[f].cor;
          return (
            <View
              key={f}
              style={[
                styles.segmento,
                {
                  height: i === atual ? 14 : 10,
                  backgroundColor: preenchida ? cor : 'transparent',
                  borderColor: preenchida ? cor : cores.borda,
                },
              ]}
            />
          );
        })}
      </View>
      <View style={styles.pontas}>
        <Texto variante="legenda" tom="secundario">
          {FAIXAS.NORMAL.rotulo}
        </Texto>
        <Texto variante="legenda" tom="secundario">
          {FAIXAS.EMERGENCIA.rotulo}
        </Texto>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Espaco.xs,
  },
  segmento: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  pontas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
