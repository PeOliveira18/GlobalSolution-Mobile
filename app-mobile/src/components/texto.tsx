import { Text, type TextProps } from 'react-native';

import { Fonte } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

type Variante = 'titulo' | 'subtitulo' | 'corpo' | 'legenda';

type TextoProps = TextProps & {
  variante?: Variante;
  tom?: 'normal' | 'secundario';
  negrito?: boolean;
};

const PESO: Record<Variante, '400' | '700'> = {
  titulo: '700',
  subtitulo: '700',
  corpo: '400',
  legenda: '400',
};

export function Texto({ variante = 'corpo', tom = 'normal', negrito, style, ...resto }: TextoProps) {
  const { cores, tamanho } = useTema();
  const fontSize = tamanho(Fonte[variante]);

  return (
    <Text
      accessibilityRole={variante === 'titulo' || variante === 'subtitulo' ? 'header' : undefined}
      style={[
        {
          color: tom === 'secundario' ? cores.textoSecundario : cores.texto,
          fontSize,
          lineHeight: Math.round(fontSize * 1.4),
          fontWeight: negrito ? '700' : PESO[variante],
        },
        style,
      ]}
      {...resto}
    />
  );
}
