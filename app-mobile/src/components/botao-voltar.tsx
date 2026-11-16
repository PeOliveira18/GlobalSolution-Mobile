import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { ALVO_TOQUE_MINIMO } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

import { Icone } from './icone';

/**
 * Botão "Voltar" do cabeçalho das telas de detalhe.
 * Substitui o padrão da navegação, que tinha 30 × 30 e era lido como "Voltar, back":
 * este tem 48 × 48 (C3.5) e nome, papel e dica em português.
 */
export function BotaoVoltar() {
  const { cores } = useTema();

  const voltar = () => {
    // Se a tela foi aberta direto (link), não há para onde voltar: vai para o Início.
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
