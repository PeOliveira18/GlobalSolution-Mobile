import { Alert, Platform } from 'react-native';

/**
 * Pergunta "tem certeza?" antes de uma ação que não dá para desfazer.
 * No web o `Alert` do React Native não aparece, então usamos o `confirm` do navegador.
 */
export function confirmar(titulo: string, mensagem: string, textoConfirmar: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }
  return new Promise((resolve) => {
    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
      { text: textoConfirmar, style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
