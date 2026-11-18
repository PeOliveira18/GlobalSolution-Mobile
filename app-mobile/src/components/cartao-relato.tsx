import type { SymbolViewProps } from 'expo-symbols';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { TIPOS_OCORRENCIA } from '@/constants/rotulos';
import { Espaco, Raio } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import type { TipoOcorrencia } from '@/types';
import { formatarQuando } from '@/utils/formatar';

import { Cartao } from './cartao';
import { QuadradoIcone } from './grupo';
import { Icone } from './icone';
import { Texto } from './texto';

/** Como a situação do relato aparece: a cor e o ícone acompanham o texto, nunca o substituem. */
export type TomSituacao = 'pendente' | 'erro' | 'sucesso' | 'neutro';

type CartaoRelatoProps = {
  tipo: TipoOcorrencia;
  descricao: string | null;
  criadoEm: string;
  /** Situação em texto (ex.: "Pendente: será enviado quando a internet voltar"). */
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

/** Um relato de alagamento (meu ou de um vizinho), com tipo, descrição, hora e situação. */
export function CartaoRelato({ tipo, descricao, criadoEm, situacao, tom = 'neutro', children }: CartaoRelatoProps) {
  const { cores, tamanho, preferencias } = useTema();
  const visual = TIPOS_OCORRENCIA[tipo];

  // Pendente usa o amarelo da faixa Atenção, erro o vermelho e sucesso o verde (contraste ≥ 5,4:1).
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
        {/* No alto contraste o fundo é preto e a borda colorida marca a situação (a neutra fica sem borda,
            para não parecer um botão). */}
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
