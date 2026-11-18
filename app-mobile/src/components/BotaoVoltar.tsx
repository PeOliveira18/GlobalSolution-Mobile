import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { ALVO_TOQUE_MINIMO } from '@/themes/theme';
import { useTema } from '@/contexts/TemaContext';

import { Icone } from '@/components/Icone';

export function BotaoVoltar() {
  const { cores } = useTema();

  const voltar = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <Pressable
      onPress={voltar}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      accessibilityHint="Volta para a tela anterior"
      hitSlop={4}
      style={({ pressed }) => ({
        width: ALVO_TOQUE_MINIMO,
        height: ALVO_TOQUE_MINIMO,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.6 : 1,
      })}>
      <Icone nome={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} cor={cores.primaria} tamanho={28} />
    </Pressable>
  );
}
