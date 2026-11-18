import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ALVO_TOQUE_MINIMO, Espaco, Raio } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

type CartaoProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  aoPressionar?: () => void;
  rotulo?: string;
  dica?: string;
};

export function Cartao({ children, style, aoPressionar, rotulo, dica }: CartaoProps) {
  const { cores } = useTema();
  const base = [
    styles.cartao,
    { borderColor: cores.bordaSuave, backgroundColor: cores.superficie, boxShadow: cores.sombra ?? undefined },
    style,
  ];

  if (!aoPressionar) return <View style={base}>{children}</View>;

  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityHint={dica}
      style={({ pressed }) => [base, { minHeight: ALVO_TOQUE_MINIMO }, pressed && { opacity: 0.85 }]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    borderWidth: 1,
    borderRadius: Raio.lg,
    padding: Espaco.md,
    gap: Espaco.sm,
  },
});
