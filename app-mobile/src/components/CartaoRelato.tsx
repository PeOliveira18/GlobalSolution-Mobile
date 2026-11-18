import type { SymbolViewProps } from 'expo-symbols';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { TIPOS_OCORRENCIA } from '@/constants/rotulos';
import { Espaco, Raio } from '@/themes/theme';
import { useTema } from '@/contexts/TemaContext';
import type { TipoOcorrencia } from '@/types';
import { formatarQuando } from '@/utils/formatar';

import { Cartao } from '@/components/Cartao';
import { QuadradoIcone } from '@/components/Grupo';
import { Icone } from '@/components/Icone';
import { Texto } from '@/components/Texto';

export type TomSituacao = 'pendente' | 'erro' | 'sucesso' | 'neutro';

type CartaoRelatoProps = {
  tipo: TipoOcorrencia;
  descricao: string | null;
  criadoEm: string;
  situacao: string;
  tom?: TomSituacao;
  children?: ReactNode;
};

const ICONES: Record<TomSituacao, SymbolViewProps['name']> = {
  pendente: { ios: 'clock.fill', android: 'schedule', web: 'schedule' },
  erro: { ios: 'exclamationmark.circle.fill', android: 'error', web: 'error' },
  sucesso: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  neutro: { ios: 'hourglass', android: 'hourglass_empty', web: 'hourglass_empty' },
};

export function CartaoRelato({ tipo, descricao, criadoEm, situacao, tom = 'neutro', children }: CartaoRelatoProps) {
  const { cores, tamanho, preferencias } = useTema();
  const visual = TIPOS_OCORRENCIA[tipo];

  const { cor, fundo } =
    tom === 'pendente'
      ? cores.faixas.ATENCAO
      : tom === 'erro'
        ? { cor: cores.perigo, fundo: cores.faixas.EMERGENCIA.fundo }
        : tom === 'sucesso'
          ? cores.faixas.NORMAL
          : { cor: cores.textoSecundario, fundo: cores.fundo };

  return (
    <Cartao>
      <View
        accessible
        accessibilityLabel={`${visual.rotulo}, ${formatarQuando(criadoEm)}. ${descricao ?? ''} Situação: ${situacao}.`}
        style={{ gap: Espaco.sm }}>
        <View style={styles.topo}>
          <QuadradoIcone icone={visual.icone} />
          <Texto negrito style={{ flex: 1 }}>
            {visual.rotulo}
          </Texto>
          <Texto variante="legenda" tom="secundario">
            {formatarQuando(criadoEm)}
          </Texto>
        </View>
        {descricao ? <Texto>{descricao}</Texto> : null}
        <View
          style={[
            styles.situacao,
            { backgroundColor: fundo, borderColor: preferencias.altoContraste && tom !== 'neutro' ? cor : fundo },
          ]}>
          <Icone nome={ICONES[tom]} cor={cor} tamanho={tamanho(18)} />
          <Texto variante="legenda" negrito style={{ color: cor, flexShrink: 1 }}>
            {situacao}
          </Texto>
        </View>
      </View>
      {children}
    </Cartao>
  );
}

const styles = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm + 2,
  },
  situacao: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Espaco.xs + 2,
    paddingHorizontal: Espaco.sm + 2,
    paddingVertical: Espaco.xs,
    borderRadius: Raio.sm,
    borderWidth: 1.5,
  },
});
