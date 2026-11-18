import { StyleSheet, View } from 'react-native';

import { Espaco, FAIXAS } from '@/constants/theme';
import { useTema } from '@/contexts/tema';
import type { StatusAtualSensor } from '@/types';
import { formatarMetros, formatarQuando } from '@/utils/formatar';

import { Cartao } from './cartao';
import { Icone } from './icone';
import { ReguaFaixas } from './regua-faixas';
import { SeloFaixa } from './selo-faixa';
import { Texto } from './texto';

type CartaoNivelProps = {
  nomeArea: string;
  status: StatusAtualSensor;
};

export function CartaoNivel({ nomeArea, status }: CartaoNivelProps) {
  const { cores, tamanho } = useTema();
  const { cor, fundo } = cores.faixas[status.faixa];
  const nivel = status.nivelCm != null ? formatarMetros(status.nivelCm) : undefined;

  return (
    <Cartao style={[styles.cartao, { backgroundColor: fundo, borderColor: cor }]}>
      <View>
        <Texto variante="legenda" tom="secundario">
          Nível do córrego
        </Texto>
        <Texto negrito>{nomeArea}</Texto>
      </View>

      <SeloFaixa faixa={status.faixa} complemento={nivel} />
      <ReguaFaixas faixa={status.faixa} />

      <View style={{ gap: Espaco.xs }}>
        <Texto>{FAIXAS[status.faixa].explicacao}</Texto>
        <View style={styles.linha}>
          <Icone
            nome={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
            cor={cores.textoSecundario}
            tamanho={tamanho(16)}
          />
          <Texto variante="legenda" tom="secundario" style={{ flex: 1 }}>
            {status.atualizadoEm
              ? `Última medição: ${formatarQuando(status.atualizadoEm)}`
              : 'O sensor ainda não enviou nenhuma medição.'}
          </Texto>
        </View>
      </View>
    </Cartao>
  );
}

const styles = StyleSheet.create({
  cartao: {
    borderWidth: 2,
    padding: Espaco.md + 4,
    gap: Espaco.md,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.xs + 2,
  },
});
