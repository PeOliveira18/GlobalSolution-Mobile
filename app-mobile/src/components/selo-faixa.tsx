import { StyleSheet, View } from 'react-native';

import { Espaco, FAIXAS, Fonte } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import type { Faixa } from '@/types';

import { Icone } from './icone';
import { Texto } from './texto';

type SeloFaixaProps = {
  faixa: Faixa;
  /** Texto extra depois do nome da faixa, ex.: "2,35 m". */
  complemento?: string;
};

/**
 * Mostra a faixa do córrego com cor + ícone + texto (C3.5: nunca só a cor).
 * No alto contraste o fundo fica preto e a borda colorida continua marcando a faixa.
 */
export function SeloFaixa({ faixa, complemento }: SeloFaixaProps) {
  const { cores, tamanho } = useTema();
  const { cor, fundo } = cores.faixas[faixa];
  const { rotulo, icone } = FAIXAS[faixa];
  const texto = complemento ? `${rotulo.toUpperCase()} — ${complemento}` : rotulo.toUpperCase();

  return (
    <View
      accessible
      accessibilityLabel={`Nível do córrego: ${rotulo}${complemento ? `, ${complemento}` : ''}`}
      style={[styles.selo, { backgroundColor: fundo, borderColor: cor }]}>
      <Icone nome={icone} cor={cor} tamanho={tamanho(Fonte.subtitulo) + 4} />
      <Texto variante="subtitulo" style={{ color: cor, flexShrink: 1 }}>
        {texto}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
    paddingHorizontal: Espaco.md,
    paddingVertical: Espaco.sm,
    borderWidth: 2,
    borderRadius: 12,
  },
});
