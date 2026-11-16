import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { TIPOS_OCORRENCIA } from '@/constants/rotulos';
import { Espaco } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import type { TipoOcorrencia } from '@/types';
import { formatarQuando } from '@/utils/formatar';

import { Cartao } from './cartao';
import { Icone } from './icone';
import { Texto } from './texto';

type CartaoRelatoProps = {
  tipo: TipoOcorrencia;
  descricao: string | null;
  criadoEm: string;
  /** Situação em texto (ex.: "Aguardando internet"). */
  situacao: string;
  corSituacao?: string;
  children?: ReactNode;
};

/** Um relato de alagamento (meu ou de um vizinho), com tipo, descrição, hora e situação. */
export function CartaoRelato({ tipo, descricao, criadoEm, situacao, corSituacao, children }: CartaoRelatoProps) {
  const { cores, tamanho } = useTema();
  const visual = TIPOS_OCORRENCIA[tipo];

  return (
    <Cartao>
      <View
        accessible
        accessibilityLabel={`${visual.rotulo}, ${formatarQuando(criadoEm)}. ${descricao ?? ''} Situação: ${situacao}.`}
        style={{ gap: Espaco.xs }}>
        <View style={styles.topo}>
          <Icone nome={visual.icone} cor={cores.texto} tamanho={tamanho(24)} />
          <Texto negrito style={{ flex: 1 }}>
            {visual.rotulo}
          </Texto>
          <Texto variante="legenda" tom="secundario">
            {formatarQuando(criadoEm)}
          </Texto>
        </View>
        {descricao ? <Texto>{descricao}</Texto> : null}
        <Texto variante="legenda" negrito style={{ color: corSituacao ?? cores.textoSecundario }}>
          {situacao}
        </Texto>
      </View>
      {children}
    </Cartao>
  );
}

const styles = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
  },
});
