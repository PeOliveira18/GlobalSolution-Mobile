import type { SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { Espaco, Raio } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

import { Icone } from './icone';
import { Texto } from './texto';

export function Etiqueta({ texto, icone }: { texto: string; icone: SymbolViewProps['name'] }) {
  const { cores, tamanho } = useTema();
  return (
    <View style={[styles.etiqueta, { borderColor: cores.bordaSuave, backgroundColor: cores.fundo }]}>
      <Icone nome={icone} cor={cores.texto} tamanho={tamanho(18)} />
      <Texto variante="legenda">{texto}</Texto>
    </View>
  );
}

export const ICONE_ACESSIVEL: SymbolViewProps['name'] = {
  ios: 'figure.roll',
  android: 'accessible',
  web: 'accessible',
};

export const ICONE_ANIMAIS: SymbolViewProps['name'] = {
  ios: 'pawprint.fill',
  android: 'pets',
  web: 'pets',
};

const styles = StyleSheet.create({
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.xs,
    borderWidth: 1,
    borderRadius: Raio.pilula,
    paddingHorizontal: Espaco.sm + 2,
    paddingVertical: Espaco.xs,
  },
});
