import { StyleSheet, TextInput, View } from 'react-native';

import { ALVO_TOQUE_MINIMO, Espaco, Fonte } from '@/constants/theme';
import { useTema } from '@/contexts/tema';

import { Texto } from './texto';

type CampoTextoProps = {
  rotulo: string;
  dica: string;
  valor: string;
  aoMudar: (texto: string) => void;
  limite: number;
  placeholder?: string;
};

/**
 * Campo de texto de várias linhas com contador de caracteres.
 * Passar do limite não corta o texto: mostra o erro "Máximo de N caracteres" (TC-F04-02).
 */
export function CampoTexto({ rotulo, dica, valor, aoMudar, limite, placeholder }: CampoTextoProps) {
  const { cores, tamanho } = useTema();
  const passou = valor.length > limite;
  const corBorda = passou ? cores.perigo : cores.borda;

  return (
    <View style={{ gap: Espaco.xs }}>
      <Texto negrito nativeID="rotulo-campo">
        {rotulo}
      </Texto>
      <TextInput
        value={valor}
        onChangeText={aoMudar}
        multiline
        placeholder={placeholder}
        placeholderTextColor={cores.textoSecundario}
        accessibilityLabel={rotulo}
        accessibilityHint={dica}
        aria-invalid={passou}
        style={[
          styles.campo,
          {
            color: cores.texto,
            backgroundColor: cores.fundo,
            borderColor: corBorda,
            borderWidth: passou ? 3 : 1,
            fontSize: tamanho(Fonte.corpo),
          },
        ]}
      />
      <View style={styles.rodape} accessibilityLiveRegion="polite">
        {passou ? (
          <Texto variante="legenda" negrito style={{ color: cores.perigo, flex: 1 }}>
            Máximo de {limite} caracteres
          </Texto>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <Texto variante="legenda" tom="secundario" style={passou ? { color: cores.perigo } : undefined}>
          {valor.length} de {limite}
        </Texto>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  campo: {
    minHeight: ALVO_TOQUE_MINIMO * 2,
    borderRadius: 12,
    padding: Espaco.md,
    textAlignVertical: 'top',
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
  },
});
