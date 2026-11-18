import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

type IconeProps = {
  nome: SymbolViewProps['name'];
  cor: ColorValue;
  tamanho?: number;
};

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
