import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

type IconeProps = {
  /** SF Symbol no iOS e Material Symbol no Android e no web. */
  nome: SymbolViewProps['name'];
  cor: ColorValue;
  tamanho?: number;
};

/**
 * Ícone decorativo: fica escondido do leitor de tela, porque o texto ao lado
 * (ou o accessibilityLabel do botão) já diz o que ele significa.
 */
export function Icone({ nome, cor, tamanho = 28 }: IconeProps) {
  return (
    <SymbolView
      name={nome}
      tintColor={cor}
      size={tamanho}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    />
  );
}
