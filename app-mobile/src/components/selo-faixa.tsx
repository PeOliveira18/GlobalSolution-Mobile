import { StyleSheet, View } from 'react-native';

import { Espaco, FAIXAS, Fonte } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import type { Faixa } from '@/types';

import { Icone } from './icone';
import { Texto } from './texto';

type SeloFaixaProps = {
  faixa: Faixa;
  complemento?: string;
};

export function SeloFaixa({ faixa, complemento }: SeloFaixaProps) {
  const { cores, tamanho } = useTema();
  const { cor, fundo } = cores.faixas[faixa];
  const { rotulo, icone } = FAIXAS[faixa];
  const tamanhoIcone = tamanho(30);
  const tamanhoNumero = tamanho(Fonte.destaque);

  return (
    <View
      accessible
      accessibilityLabel={`Nível do córrego: ${rotulo}${complemento ? `, ${complemento}` : ''}`}
      style={styles.selo}>
      <View
        style={[
          styles.circulo,
          { backgroundColor: cor, width: tamanhoIcone + 26, height: tamanhoIcone + 26 },
        ]}>
        <Icone nome={icone} cor={fundo} tamanho={tamanhoIcone} />
      </View>
      <View style={styles.textos}>
        <Texto variante="subtitulo" style={{ color: cor, letterSpacing: 0.5 }}>
          {rotulo.toUpperCase()}
        </Texto>
        {complemento ? (
          <Texto
            style={{
              fontSize: tamanhoNumero,
              lineHeight: Math.round(tamanhoNumero * 1.15),
              fontWeight: '800',
              letterSpacing: -0.5,
              fontVariant: ['tabular-nums'],
            }}>
            {complemento}
          </Texto>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
  },
  circulo: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
  },
});
