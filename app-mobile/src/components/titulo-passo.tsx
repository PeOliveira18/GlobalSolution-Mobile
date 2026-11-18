import { StyleSheet, View } from 'react-native';

import { Espaco, Fonte } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

import { Texto } from './texto';

type TituloPassoProps = {
  numero: number;
  texto: string;
};

export function TituloPasso({ numero, texto }: TituloPassoProps) {
  const { cores, tamanho } = useTema();
  const lado = tamanho(Fonte.subtitulo) + 14;

  return (
    <View accessible accessibilityRole="header" accessibilityLabel={`${numero}. ${texto}`} style={styles.linha}>
      <View
        style={[
          styles.circulo,
          { width: lado, height: lado, borderRadius: lado / 2, backgroundColor: cores.primaria },
        ]}>
        <Texto negrito style={{ color: cores.sobrePrimaria }}>
          {numero}
        </Texto>
      </View>
      <Texto variante="subtitulo" accessibilityRole="none" style={{ flex: 1 }}>
        {texto}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm + 2,
    marginTop: Espaco.sm,
  },
  circulo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
