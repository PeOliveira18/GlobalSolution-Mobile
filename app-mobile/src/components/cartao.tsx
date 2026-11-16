import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ALVO_TOQUE_MINIMO, Espaco } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

type CartaoProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Se informado, o cartão inteiro vira um botão (precisa de `rotulo` e `dica`). */
  aoPressionar?: () => void;
  rotulo?: string;
  dica?: string;
};

/** Caixa com borda. Quando tocável, é lida como um único botão pelo leitor de tela. */
export function Cartao({ children, style, aoPressionar, rotulo, dica }: CartaoProps) {
  const { cores } = useTema();
  const base = [styles.cartao, { borderColor: cores.borda, backgroundColor: cores.superficie }, style];

  if (!aoPressionar) return <View style={base}>{children}</View>;

  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityHint={dica}
      style={({ pressed }) => [base, { minHeight: ALVO_TOQUE_MINIMO }, pressed && { opacity: 0.8 }]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Espaco.md,
    gap: Espaco.sm,
  },
});
