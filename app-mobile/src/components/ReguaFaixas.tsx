import { StyleSheet, View } from 'react-native';

import { Espaco, FAIXAS, ORDEM_FAIXAS } from '@/themes/theme';
import { useTema } from '@/contexts/TemaContext';
import type { Faixa } from '@/types';

import { Texto } from '@/components/Texto';

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
