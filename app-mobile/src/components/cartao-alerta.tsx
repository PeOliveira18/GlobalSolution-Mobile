import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { SEVERIDADES, TIPOS_ALERTA } from '@/constants/rotulos';
import { Espaco, FAIXAS } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import type { Alerta } from '@/types';
import { formatarQuando } from '@/utils/formatar';

import { Cartao } from './cartao';
import { Icone } from './icone';
import { Texto } from './texto';

/** Item da lista de alertas: gravidade (cor + ícone + texto), mensagem e horário. Abre o detalhe. */
export function CartaoAlerta({ alerta }: { alerta: Alerta }) {
  const { cores, tamanho } = useTema();
  const severidade = SEVERIDADES[alerta.severidade];
  const cor = cores.faixas[severidade.faixaVisual].cor;

  return (
    <Cartao
      style={{ borderLeftWidth: 8, borderLeftColor: cor }}
      aoPressionar={() => router.push({ pathname: '/alerta/[id]', params: { id: String(alerta.id) } })}
      rotulo={`${severidade.rotulo}. ${alerta.mensagem}`}
      dica="Abre o passo a passo do que fazer agora">
      <View style={styles.topo}>
        <Icone nome={FAIXAS[severidade.faixaVisual].icone} cor={cor} tamanho={tamanho(24)} />
        <Texto negrito style={{ color: cor }}>
          {severidade.rotulo.toUpperCase()}
        </Texto>
        <Texto variante="legenda" tom="secundario" style={{ marginLeft: 'auto' }}>
          {formatarQuando(alerta.criadoEm)}
        </Texto>
      </View>
      <Texto>{alerta.mensagem}</Texto>
      <View style={styles.rodape}>
        <Texto variante="legenda" tom="secundario" style={{ flex: 1 }}>
          {TIPOS_ALERTA[alerta.tipo]}
        </Texto>
        <Texto variante="legenda" negrito style={{ color: cores.primaria }}>
          O que fazer
        </Texto>
        <Icone nome={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} cor={cores.primaria} tamanho={20} />
      </View>
    </Cartao>
  );
}

const styles = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.xs,
  },
});
