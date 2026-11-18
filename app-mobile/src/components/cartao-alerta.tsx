import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { SEVERIDADES, TIPOS_ALERTA } from '@/constants/rotulos';
import { Espaco, FAIXAS, Raio } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import type { Alerta } from '@/types';
import { formatarQuando } from '@/utils/formatar';

import { Cartao } from './cartao';
import { Icone } from './icone';
import { Texto } from './texto';

export function CartaoAlerta({ alerta }: { alerta: Alerta }) {
  const { cores, tamanho } = useTema();
  const severidade = SEVERIDADES[alerta.severidade];
  const { cor, fundo } = cores.faixas[severidade.faixaVisual];

  return (
    <Cartao
      style={{ borderLeftWidth: 6, borderLeftColor: cor }}
      aoPressionar={() => router.push({ pathname: '/alerta/[id]', params: { id: String(alerta.id) } })}
      rotulo={`${severidade.rotulo}. ${alerta.mensagem}`}
      dica="Abre o passo a passo do que fazer agora">
      <View style={styles.topo}>
        <View style={[styles.selo, { backgroundColor: fundo, borderColor: cor }]}>
          <Icone nome={FAIXAS[severidade.faixaVisual].icone} cor={cor} tamanho={tamanho(18)} />
          <Texto variante="legenda" negrito style={{ color: cor, letterSpacing: 0.4 }}>
            {severidade.rotulo.toUpperCase()}
          </Texto>
        </View>
        <Texto variante="legenda" tom="secundario" style={{ marginLeft: 'auto' }}>
          {formatarQuando(alerta.criadoEm)}
        </Texto>
      </View>
      <Texto>{alerta.mensagem}</Texto>
      <View style={[styles.rodape, { borderTopColor: cores.bordaSuave }]}>
        <Texto variante="legenda" tom="secundario" style={{ flex: 1 }}>
          {TIPOS_ALERTA[alerta.tipo]}
        </Texto>
        <Texto variante="legenda" negrito style={{ color: cores.primaria }}>
          O que fazer
        </Texto>
        <Icone nome={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} cor={cores.primaria} tamanho={18} />
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
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.xs,
    paddingHorizontal: Espaco.sm + 2,
    paddingVertical: Espaco.xs,
    borderRadius: Raio.pilula,
    borderWidth: 1,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Espaco.sm,
  },
});
